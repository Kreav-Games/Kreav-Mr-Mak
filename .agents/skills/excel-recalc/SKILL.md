---
name: excel-recalc
description: Recalculate an .xlsx or .xlsm with the installed Microsoft Excel and report formula errors. A Windows replacement for the official xlsx skill's LibreOffice-based recalc.py, which crashes on Windows.
---

# Excel recalculation

Use this after writing or editing a workbook's formulas with openpyxl, when the
file must carry real calculated values and be checked for errors. openpyxl saves
formulas with no cached values, so `pandas`, `load_workbook(data_only=True)` and
most previewers read every formula cell as empty until Excel has calculated it.

Run it from this skill's folder, or pass the full path:

```powershell
python scripts/recalc_excel.py book.xlsx                    # recalculate, save in place, report
python scripts/recalc_excel.py book.xlsx --output out.xlsx  # keep the original untouched
python scripts/recalc_excel.py book.xlsx --no-save          # report only, write nothing
```

It prints one JSON object. `status` is `success` or `errors_found`, with
`total_formulas`, `total_errors`, `error_summary` (error type to count and up to
100 cell addresses) and `locations_truncated` (how many addresses were withheld;
trust `total_errors`, not the list length). `sheets` gives per-sheet counts.
`{"error": ...}` with exit 1 means nothing was recalculated. `errors_found` exits
0, so a clean exit is not a clean workbook; add `--fail-on-errors` to exit 3.

A green result proves the formulas evaluate, not that they are right: an
off-by-one range gives clean, wrong numbers. Fix what `error_summary` names and
run it again, then spot-check a few results against the inputs.

## What to know

- It needs Windows, Microsoft Excel and `pywin32` (`python -m pip install --user pywin32`).
- The workbook opens in a separate hidden Excel process with macros disabled and
  link-update prompts off, so the user's own Excel windows are never touched.
  External links keep their cached values and are listed in `external_links`.
- The save goes to a temporary file and replaces the target only after Excel has
  closed the workbook. Close the file in any other program first, or it fails
  with a read-only error.
- `--timeout` defaults to 120 seconds and ends the Excel process it started when
  exceeded. A deliberately heavy workbook (600 volatile million-row `INDIRECT`
  formulas) took 153 seconds, so raise it for large models.
- Excel evaluates what LibreOffice cannot. `XLOOKUP`, `TEXTJOIN` and `IFS` were
  verified through openpyxl with their `_xlfn.` prefix (`_xlfn.XLOOKUP(...)`);
  written bare, they come back as `#NAME?`. Spilling functions (`FILTER`,
  `SORT`, `UNIQUE`, `SEQUENCE`) were not verified through openpyxl; open the
  result in Excel and look before relying on them.
- Formula counts include spilled cells. Only `.xlsx` and `.xlsm` are accepted.
- Keep the official xlsx skill's other rules (formulas instead of hardcoded
  results, input-cell colours, documented assumptions); only its `recalc.py` is
  replaced.
