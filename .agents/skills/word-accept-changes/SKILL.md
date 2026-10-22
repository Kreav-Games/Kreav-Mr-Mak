---
name: word-accept-changes
description: Accept every tracked change in a .docx with the installed Microsoft Word and write a clean copy. A Windows replacement for the official docx skill's accept_changes.py, which crashes on Windows.
---

# Accept tracked changes with Word

Use this when a Word document carries tracked changes (insertions, deletions,
formatting changes, moves) and a clean copy is needed, for example after
redlining with the docx skill. The official `accept_changes.py` fails on
Windows, so ask the installed Word to do it.

Run it from this skill's folder, or pass the full path:

```powershell
python scripts/accept_changes_word.py in.docx out.docx
```

It prints one JSON object: `status`, `revisions_accepted`, `revisions_remaining`
(0 on success), `input`, `output`, `engine`. `{"error": ...}` with exit 1 means
no output was written. Header, footer, footnote, endnote and text-box changes
are included. Comments are kept. A paragraph whose text was entirely deleted
disappears (its deleted paragraph mark joins it to the next one), so no empty
bullets are left behind.

## What to know

- It needs Windows, Microsoft Word and `pywin32` (`python -m pip install --user pywin32`).
- The input is never modified. The output must be a different path with the same
  extension (`.docx`, `.docm`, `.dotx` or `.dotm`).
- Word saves the whole file, so the XML is normalized: revision ids, spell-check
  runs and similar bookkeeping are rewritten. For the smallest possible diff,
  edit the XML by hand instead; for what Word itself would produce, use this.
- The document opens in a separate hidden Word process with macros disabled and
  automatic link updating switched off (restored afterwards), so opening an
  untrusted file cannot pull in remote content.
- Word is opened on a uniquely named temporary copy beside the input, deleted
  afterwards. This matters if a run is ended by `--timeout` (default 120
  seconds): Word then remembers that the file it was opening caused a serious
  error and the next open of that name blocks on a prompt that automation cannot
  answer. A fresh copy name each run keeps the real file and any retry clear of
  it. Ending Word that way can still make Word's own next start run recovery
  checks, so raise `--timeout` for very large documents rather than relying on
  it. A 60,000-paragraph document with 120,000 changes took about 25 seconds.
- A document protected for tracked changes cannot be accepted; the run fails and
  writes nothing.
- Check the result with the docx skill's `validate.py`. On Windows run it with
  `PYTHONUTF8=1`, or it reports a false encoding error.
