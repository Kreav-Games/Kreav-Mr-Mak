#!/usr/bin/env python3
"""Labeled thumbnail grids of a deck's slides, rendered by the installed Microsoft PowerPoint.

Windows only. Needs Microsoft PowerPoint, pywin32 and Pillow, and defusedxml for reading the package
(python -m pip install --user pywin32 pillow defusedxml).

    python thumbnail_powerpoint.py deck.pptx deck-thumbs
    python thumbnail_powerpoint.py deck.pptx deck-thumbs --columns 3 --width 420

Writes deck-thumbs.jpg, or deck-thumbs-1.jpg, deck-thumbs-2.jpg ... when the deck has more than --per-image
slides (default 12), and prints the absolute path of each file it created, one per line. Existing files with
those names are overwritten, so give each deck its own prefix.

Every cell is labeled with the slide's position and its file name inside the package (slide3.xml) - the name the
unpack / edit / repack workflow uses, which differs from the position once slides have been reordered - then
its layout name. Hidden slides are marked. The slides are rendered by PowerPoint itself, so embedded fonts,
theme effects and charts look as they do in the real application.

If PowerPoint is already running the helper attaches to it and leaves everything of yours alone: the deck is
opened read-only without a window (or, if you already have it open, that copy is used as it is), and PowerPoint
is only quit when this helper started it.
"""
import argparse
import os
import posixpath
import shutil
import subprocess
import sys
import tempfile
import threading
import zipfile

EXTENSIONS = (".pptx", ".potx")
PP_SAVE_AS_JPG = 17            # ppSaveAsJPG
PP_ALERTS_NONE = 1             # ppAlertsNone
AUTOMATION_SECURITY_FORCE_DISABLE = 3
MAX_PART_BYTES = 20_000_000
NS_P = "{http://schemas.openxmlformats.org/presentationml/2006/main}"
NS_R = "{http://schemas.openxmlformats.org/officeDocument/2006/relationships}"


class ThumbnailError(Exception):
    """An expected failure: printed on stderr, exit 1."""


def package_target(base_part, target):
    """Resolve a relationship Target against the part that owns it, as a zip member name."""
    if target.startswith("/"):
        return target.lstrip("/")
    return posixpath.normpath(posixpath.join(posixpath.dirname(base_part), target))


def slide_labels(path):
    """[(slide file name, layout name, hidden)] in presentation order, or None when the package cannot be read."""
    try:
        from defusedxml import ElementTree as ET
    except ImportError:
        return None

    def part(archive, name):
        if archive.getinfo(name).file_size > MAX_PART_BYTES:
            raise ValueError(f"{name} is unreasonably large")
        return ET.fromstring(archive.read(name))

    def relationships(archive, owner):
        folder, base = posixpath.split(owner)
        rels_name = posixpath.join(folder, "_rels", base + ".rels")
        if rels_name not in archive.namelist():
            return []
        return [(r.get("Id"), r.get("Type", ""), r.get("Target", "")) for r in part(archive, rels_name)]

    try:
        with zipfile.ZipFile(path) as archive:
            presentation = part(archive, "ppt/presentation.xml")
            by_id = {rid: target for rid, _kind, target in relationships(archive, "ppt/presentation.xml")}
            order = []
            for entry in presentation.find(f"{NS_P}sldIdLst"):
                order.append(package_target("ppt/presentation.xml", by_id[entry.get(f"{NS_R}id")]))
            labels = []
            for slide_part in order:
                layout_name = ""
                try:
                    for _rid, kind, target in relationships(archive, slide_part):
                        if kind.endswith("/slideLayout"):
                            layout = part(archive, package_target(slide_part, target))
                            node = layout.find(f"{NS_P}cSld")
                            layout_name = (node.get("name") if node is not None else "") or ""
                            break
                except Exception:
                    layout_name = ""
                hidden = part(archive, slide_part).get("show") == "0"
                labels.append((posixpath.basename(slide_part), layout_name, hidden))
            return labels
    except Exception:
        return None


def powerpoint_running():
    out = subprocess.run(["tasklist", "/FI", "IMAGENAME eq POWERPNT.EXE", "/NH"], capture_output=True, text=True)
    return "powerpnt.exe" in out.stdout.lower()


def render_slides(source, folder, result, started_by_us):
    """Worker: export every slide to JPEG with PowerPoint. Runs on its own thread with its own COM apartment."""
    import pythoncom
    import win32com.client

    pythoncom.CoInitialize()
    app = presentation = None
    opened_by_us = False
    old_security = old_alerts = None
    try:
        try:
            app = win32com.client.DispatchEx("PowerPoint.Application")
        except Exception as exc:
            raise ThumbnailError(f"could not start Microsoft PowerPoint: {exc}")
        try:
            old_security, old_alerts = app.AutomationSecurity, app.DisplayAlerts
            app.AutomationSecurity = AUTOMATION_SECURITY_FORCE_DISABLE  # never run macros from the deck
            app.DisplayAlerts = PP_ALERTS_NONE
        except Exception:
            pass
        wanted = os.path.normcase(source)
        for candidate in app.Presentations:
            try:
                if os.path.normcase(candidate.FullName) == wanted:
                    presentation = candidate
                    break
            except Exception:
                continue
        if presentation is None:
            presentation = app.Presentations.Open(source, ReadOnly=True, Untitled=False, WithWindow=False)
            opened_by_us = True
        result["slides"] = presentation.Slides.Count
        result["engine"] = f"Microsoft PowerPoint {app.Version} (build {app.Build})"
        presentation.SaveCopyAs(os.path.join(folder, "slides"), PP_SAVE_AS_JPG)
        result["done"] = True
    except ThumbnailError as exc:
        result["error"] = str(exc)
    except Exception as exc:
        result["error"] = f"PowerPoint automation failed: {exc}"
    finally:
        try:
            if opened_by_us and presentation is not None:
                presentation.Close()
        except Exception:
            pass
        try:
            if app is not None and old_security is not None:
                app.AutomationSecurity, app.DisplayAlerts = old_security, old_alerts
        except Exception:
            pass
        try:
            if app is not None and started_by_us and app.Presentations.Count == 0:
                app.Quit()
        except Exception:
            pass
        presentation = app = None
        pythoncom.CoUninitialize()


def load_font(size):
    from PIL import ImageFont
    for name in ("segoeui.ttf", "arial.ttf", "calibri.ttf"):
        try:
            return ImageFont.truetype(name, size)
        except OSError:
            continue
    return ImageFont.load_default()


def fit_text(draw, text, font, width):
    if draw.textlength(text, font=font) <= width:
        return text
    while text and draw.textlength(text + "...", font=font) > width:
        text = text[:-1]
    return text + "..."


def build_grid(cells, columns, thumb_width, pad=14, label_height=44):
    """cells: [(PIL image, line 1, line 2, hidden)] -> one RGB image."""
    from PIL import Image, ImageDraw

    first = cells[0][0]
    thumb_height = max(1, round(first.height * thumb_width / first.width))
    cell_w, cell_h = thumb_width + 2 * pad, thumb_height + label_height + 2 * pad
    rows = -(-len(cells) // columns)
    sheet = Image.new("RGB", (columns * cell_w, rows * cell_h), (238, 240, 243))
    draw = ImageDraw.Draw(sheet)
    title_font, sub_font = load_font(16), load_font(13)
    for index, (image, line1, line2, hidden) in enumerate(cells):
        x, y = (index % columns) * cell_w + pad, (index // columns) * cell_h + pad
        thumb = image.convert("RGB").resize((thumb_width, thumb_height), Image.LANCZOS)
        sheet.paste(thumb, (x, y))
        draw.rectangle((x - 1, y - 1, x + thumb_width, y + thumb_height), outline=(150, 156, 166))
        draw.text((x, y + thumb_height + 6), fit_text(draw, line1, title_font, thumb_width),
                  font=title_font, fill=(176, 36, 36) if hidden else (28, 32, 40))
        draw.text((x, y + thumb_height + 26), fit_text(draw, line2, sub_font, thumb_width),
                  font=sub_font, fill=(90, 98, 110))
    return sheet


def run(args):
    if sys.platform != "win32":
        raise ThumbnailError("this helper drives Microsoft PowerPoint and only runs on Windows")
    source = os.path.abspath(args.deck)
    if not os.path.isfile(source):
        raise ThumbnailError(f"file not found: {source}")
    if os.path.splitext(source)[1].lower() not in EXTENSIONS:
        raise ThumbnailError(f"unsupported file type: expected {' or '.join(EXTENSIONS)}")
    try:
        import PIL  # noqa: F401
        import pythoncom  # noqa: F401
        import win32com.client  # noqa: F401
    except ImportError as exc:
        raise ThumbnailError(f"missing package ({exc.name}): python -m pip install --user pywin32 pillow defusedxml")

    labels = slide_labels(source)
    started_by_us = not powerpoint_running()
    work = tempfile.mkdtemp(prefix="pptx-thumbs-")
    result = {}
    try:
        worker = threading.Thread(target=render_slides, args=(source, work, result, started_by_us), daemon=True)
        worker.start()
        worker.join(args.timeout)
        if worker.is_alive():
            if started_by_us:
                subprocess.run(["taskkill", "/F", "/IM", "POWERPNT.EXE"], capture_output=True)
            raise ThumbnailError(f"timed out after {args.timeout} seconds"
                                 + ("; the PowerPoint process was ended" if started_by_us else
                                    "; PowerPoint was already running and was left alone"))
        if "error" in result:
            raise ThumbnailError(result["error"])
        folder = os.path.join(work, "slides")
        images = []
        if os.path.isdir(folder):
            for name in os.listdir(folder):
                stem, ext = os.path.splitext(name)
                digits = "".join(ch for ch in stem if ch.isdigit())
                if ext.lower() in (".jpg", ".jpeg") and digits:
                    images.append((int(digits), os.path.join(folder, name)))
        images.sort()
        if not images or len(images) != result.get("slides"):
            raise ThumbnailError(f"PowerPoint exported {len(images)} images for {result.get('slides')} slides")
        if labels is not None and len(labels) != len(images):
            labels = None  # package and application disagree: label by position only

        from PIL import Image
        cells = []
        for position, (_number, path) in enumerate(images):
            with Image.open(path) as handle:
                image = handle.copy()
            if labels:
                file_name, layout, hidden = labels[position]
                line1 = f"{position + 1}   {file_name}" + ("  (hidden)" if hidden else "")
                line2 = layout
            else:
                line1, line2, hidden = f"{position + 1}", "", False
            cells.append((image, line1, line2, hidden))

        pages = [cells[i:i + args.per_image] for i in range(0, len(cells), args.per_image)]
        prefix = os.path.abspath(args.prefix)
        os.makedirs(os.path.dirname(prefix), exist_ok=True)
        created = []
        for number, page in enumerate(pages, 1):
            out = f"{prefix}.jpg" if len(pages) == 1 else f"{prefix}-{number}.jpg"
            build_grid(page, min(args.columns, len(page)), args.width).save(out, "JPEG", quality=90)
            created.append(out)
        return created
    finally:
        shutil.rmtree(work, ignore_errors=True)


def main(argv=None):
    parser = argparse.ArgumentParser(description="Labeled thumbnail grids of a deck, rendered by PowerPoint.")
    parser.add_argument("deck", help="the .pptx (or .potx) deck")
    parser.add_argument("prefix", nargs="?", default="thumbnails",
                        help="output prefix; give each deck its own (default: thumbnails)")
    parser.add_argument("--columns", type=int, default=4, help="slides per row (default 4)")
    parser.add_argument("--per-image", type=int, default=12, help="slides per output image (default 12)")
    parser.add_argument("--width", type=int, default=360, help="thumbnail width in pixels (default 360)")
    parser.add_argument("--timeout", type=int, default=180, metavar="SECONDS", help="give up after this long (default 180)")
    args = parser.parse_args(argv)
    for name in ("columns", "per_image", "width", "timeout"):
        if getattr(args, name) < 1:
            parser.error(f"--{name.replace('_', '-')} must be at least 1")
    try:
        created = run(args)
    except ThumbnailError as exc:
        print(f"Error: {exc}", file=sys.stderr)
        return 1
    for path in created:
        print(path)
    return 0


if __name__ == "__main__":
    code = main()
    sys.stdout.flush()
    sys.stderr.flush()
    os._exit(code)  # a timed-out COM worker thread must not keep the process alive
