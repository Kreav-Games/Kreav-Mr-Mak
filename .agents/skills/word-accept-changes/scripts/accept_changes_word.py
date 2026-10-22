#!/usr/bin/env python3
"""Accept every tracked change in a Word document using the installed Microsoft Word.

Windows only. Needs Microsoft Word and pywin32 (python -m pip install --user pywin32).

    python accept_changes_word.py in.docx out.docx

Writes a clean copy of in.docx to out.docx with all tracked changes accepted: insertions kept, deletions
removed, a deleted paragraph mark joins the paragraph to the one below it (so a paragraph whose text was all
deleted disappears), formatting changes applied. Headers, footers, footnotes, endnotes and text boxes are
included. Comments are left in place. The input file is never modified.

Prints one JSON object on stdout:
    status                "success"
    revisions_accepted    tracked changes found in all parts of the document
    revisions_remaining   always 0 on success (otherwise nothing is written and the exit code is 1)
    input, output, engine
or {"error": "..."} with exit code 1.

Word saves the whole file, so the XML is normalized (revision ids, spell-check runs and similar bookkeeping are
rewritten). Use it when you want what Word itself would produce; edit the XML by hand if you need the smallest
possible diff.

The document opens in a separate, hidden Word process with macros disabled. Automatic link updating at open is
switched off for that process and restored afterwards, so a document cannot pull in remote content by being opened.

Word is opened on a uniquely named temporary copy that sits next to the input and is deleted afterwards. If a run
has to be ended by --timeout, Word records that the file it was opening caused a serious error and the next open of
that file name blocks on a prompt; with a fresh copy name every run, neither your file nor a retry is affected.
Ending Word that way can still make Word's own next start run its recovery checks.
"""
import argparse
import json
import os
import shutil
import subprocess
import sys
import threading
import time
import uuid

# WdSaveFormat: wdFormatXMLDocument, ...MacroEnabled, wdFormatXMLTemplate, ...MacroEnabled
FILE_FORMATS = {".docx": 12, ".docm": 13, ".dotx": 14, ".dotm": 15}
WD_ALERTS_NONE = 0
AUTOMATION_SECURITY_FORCE_DISABLE = 3


class AcceptError(Exception):
    """An expected failure: reported as {"error": ...} and exit 1."""


def copy_beside(source, target, extension):
    """Copy the input to a uniquely named hidden-style file next to it (or next to the output if the input's
    folder is read-only). Returns the copy's path."""
    name = f".accept-src-{uuid.uuid4().hex}{extension}"
    for folder in (os.path.dirname(source), os.path.dirname(target)):
        copy = os.path.join(folder, name)
        try:
            shutil.copy2(source, copy)
            return copy
        except OSError:
            continue
    raise AcceptError("could not write a working copy next to the input or the output")


def remove_file(path):
    """Delete a leftover file, waiting briefly for an ended Word process to let go of it."""
    for _ in range(25):
        try:
            if os.path.exists(path):
                os.remove(path)
            return
        except OSError:
            time.sleep(0.2)


def word_pids():
    """Process ids of every running WINWORD.EXE."""
    out = subprocess.run(["tasklist", "/FI", "IMAGENAME eq WINWORD.EXE", "/FO", "CSV", "/NH"],
                         capture_output=True, text=True).stdout
    pids = set()
    for line in out.splitlines():
        fields = [field.strip('"') for field in line.split('","')]
        if len(fields) > 1 and fields[0].lower() == "winword.exe" and fields[1].isdigit():
            pids.add(int(fields[1]))
    return pids


def story_ranges(document):
    """Every story (body, headers, footers, footnotes, text boxes ...) including linked continuations."""
    for story in document.StoryRanges:
        current = story
        while current is not None:
            yield current
            try:
                current = current.NextStoryRange
            except Exception:
                current = None


def count_revisions(document):
    total = 0
    for story in story_ranges(document):
        try:
            total += story.Revisions.Count
        except Exception:
            pass  # a story type that has no revisions collection
    return total


def accept_all(args):
    if sys.platform != "win32":
        raise AcceptError("this helper drives Microsoft Word and only runs on Windows")
    source, target = os.path.abspath(args.input), os.path.abspath(args.output)
    if not os.path.isfile(source):
        raise AcceptError(f"file not found: {source}")
    extension = os.path.splitext(source)[1].lower()
    if extension not in FILE_FORMATS:
        raise AcceptError(f"unsupported file type {extension or '(none)'}: expected one of {', '.join(FILE_FORMATS)}")
    if os.path.splitext(target)[1].lower() != extension:
        raise AcceptError("the output must keep the input's extension")
    if os.path.normcase(source) == os.path.normcase(target):
        raise AcceptError("the output is the input file; choose a different output path")
    try:
        import pythoncom
        import win32com.client
    except ImportError:
        raise AcceptError("pywin32 is missing: python -m pip install --user pywin32")

    pythoncom.CoInitialize()
    app = document = timer = None
    temp = working_copy = None
    old_update_links = None
    warnings = []
    timed_out = threading.Event()
    try:
        # Word remembers a document it was killed while opening and then asks "The last time you opened X it caused
        # a serious error. Do you still want to open it?" - a prompt automation cannot answer, so a retry would hang.
        # Opening a uniquely named copy keeps that record off the real file name. It sits beside the original so
        # relative links keep resolving.
        working_copy = copy_beside(source, target, extension)
        before = word_pids()
        try:
            app = win32com.client.DispatchEx("Word.Application")  # its own process, never the user's session
        except Exception as exc:
            raise AcceptError(f"could not start Microsoft Word: {exc}")
        app.Visible = False
        app.DisplayAlerts = WD_ALERTS_NONE
        app.AutomationSecurity = AUTOMATION_SECURITY_FORCE_DISABLE
        # Word's Application has no Hwnd, so the process we started is the one that was not there before.
        started = word_pids() - before
        if len(started) == 1:
            pid = next(iter(started))

            def end_word():
                timed_out.set()
                try:
                    subprocess.run(["taskkill", "/F", "/T", "/PID", str(pid)], capture_output=True, timeout=15)
                except Exception:
                    pass

            timer = threading.Timer(args.timeout, end_word)
            timer.daemon = True
            timer.start()
        else:
            warnings.append("the time limit is not enforced: could not identify the Word process this run started")
        try:
            old_update_links = app.Options.UpdateLinksAtOpen
            app.Options.UpdateLinksAtOpen = False
        except Exception:
            old_update_links = None

        document = app.Documents.Open(FileName=working_copy, ConfirmConversions=False, ReadOnly=True,
                                      AddToRecentFiles=False, Visible=False, NoEncodingDialog=True)
        found = count_revisions(document)
        for story in story_ranges(document):
            try:
                story.Revisions.AcceptAll()
            except Exception:
                pass
        remaining = count_revisions(document)
        if remaining:
            raise AcceptError(f"{remaining} tracked change(s) could not be accepted "
                              "(is the document protected for tracked changes?)")

        temp = os.path.join(os.path.dirname(target), f".accept-{os.getpid()}-{os.path.basename(target)}")
        document.SaveAs2(FileName=temp, FileFormat=FILE_FORMATS[extension], AddToRecentFiles=False)
        engine = f"Microsoft Word {app.Version} (build {app.Build})"
        document.Close(SaveChanges=False)
        document = None
        if not os.path.isfile(temp) or os.path.getsize(temp) == 0:
            raise AcceptError("Word did not write the output file")
        os.replace(temp, target)
        temp = None
    except AcceptError:
        raise
    except Exception as exc:
        if timed_out.is_set():
            raise AcceptError(f"timed out after {args.timeout} seconds; the Word process was ended")
        raise AcceptError(f"Word automation failed: {exc}")
    finally:
        if timer:
            timer.cancel()
        try:
            if document is not None:
                document.Close(SaveChanges=False)
        except Exception:
            pass
        try:
            if app is not None and old_update_links is not None:
                app.Options.UpdateLinksAtOpen = old_update_links
        except Exception:
            pass
        try:
            if app is not None:
                app.Quit(SaveChanges=False)
        except Exception:
            pass
        document = app = None
        for leftover in (temp, working_copy):
            if leftover:
                remove_file(leftover)
        pythoncom.CoUninitialize()
    result = {"status": "success", "revisions_accepted": found, "revisions_remaining": remaining,
              "input": source, "output": target, "engine": engine}
    if warnings:
        result["warnings"] = warnings
    return result


def main(argv=None):
    parser = argparse.ArgumentParser(description="Accept all tracked changes in a Word document using Microsoft Word.")
    parser.add_argument("input", help="the document with tracked changes (.docx, .docm, .dotx, .dotm)")
    parser.add_argument("output", help="where to write the clean copy (same extension)")
    parser.add_argument("--timeout", type=int, default=120, metavar="SECONDS",
                        help="end the Word process it started after this long (default 120)")
    args = parser.parse_args(argv)
    if args.timeout < 1:
        parser.error("--timeout must be at least 1")
    try:
        result = accept_all(args)
    except AcceptError as exc:
        print(json.dumps({"error": str(exc)}, indent=2))
        return 1
    print(json.dumps(result, indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main())
