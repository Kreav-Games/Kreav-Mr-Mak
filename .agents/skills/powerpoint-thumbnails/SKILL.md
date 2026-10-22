---
name: powerpoint-thumbnails
description: Render labeled thumbnail grids of a deck's slides with the installed Microsoft PowerPoint, labeled with each slide's file name and layout. A Windows replacement for the official pptx skill's thumbnail.py, which crashes on Windows.
---

# PowerPoint thumbnail grids

Use this to see a deck or template at a glance and to pick which slide or layout
to duplicate when editing a `.pptx` by its XML. The official `thumbnail.py`
fails on Windows, so PowerPoint itself renders the slides.

Run it from this skill's folder, or pass the full path:

```powershell
python scripts/thumbnail_powerpoint.py template.pptx template-thumbs
python scripts/thumbnail_powerpoint.py deck.pptx deck-thumbs --columns 3 --width 420
```

It writes `template-thumbs.jpg`, or `template-thumbs-1.jpg`,
`template-thumbs-2.jpg` and so on when the deck has more than 12 slides
(`--per-image`), and prints the absolute path of each file it created, one per
line. Open the images to look at them.

Each cell is labeled with the slide's position and its file name inside the
package (`slide4.xml`), then its layout name. The file name is what
`add_slide.py` and the unpack, edit, repack workflow use, and it differs from the
position once slides have been reordered. Hidden slides are included and marked.

## What to know

- It needs Windows, Microsoft PowerPoint, `pywin32`, `pillow` and `defusedxml`
  (`python -m pip install --user pywin32 pillow defusedxml`).
- Always pass a prefix named after the deck. Existing files with that prefix are
  overwritten, and the default `thumbnails` collides between decks.
- A `.potx` template can be given directly; no copy to `.pptx` is needed.
- PowerPoint renders the slides, so embedded fonts, theme effects and charts look
  as they do in the real application. A grid is for choosing layouts; for
  checking a finished deck look at full-size renders.
- If PowerPoint is already running it attaches to it and leaves your session
  alone: the deck opens read-only without a window (or, if you already have it
  open, that copy is used), automation security and alert settings are restored,
  and PowerPoint is only quit when this helper started it.
- `--timeout` (default 180 seconds) ends the PowerPoint process only when this
  helper started it; an already-running PowerPoint is never ended.
- Macros in the deck are disabled while it is opened.
- The `building-powerpoint-decks` skill has its own `contact_sheet.py` for its
  build and audit workflow; this one is for the official unpack and edit flow.
