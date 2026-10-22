#!/usr/bin/env python3
"""Recalculate a workbook with the installed Microsoft Excel and report formula errors.

Windows only. Needs Microsoft Excel and pywin32 (python -m pip install --user pywin32).

    python recalc_excel.py book.xlsx                    recalculate, save in place, report
    python recalc_excel.py book.xlsx --output out.xlsx  leave the original untouched
    python recalc_excel.py book.xlsx --no-save          check only, write nothing

One JSON object is printed on stdout:

    status               "success" or "errors_found"
    total_formulas       formula cells counted (spilled cells included)
    total_errors         cells whose value is an Excel error
    error_summary        {"#REF!": {"count": n, "locations": ["Sheet1!B4", ...]}}, at most 100 locations per type
    locations_truncated  locations withheld from error_summary (trust total_errors, not the list length)
    sheets               [{"name", "formulas", "errors"}]
    engine, saved, output, external_links, warnings (only when something needs your attention)

or {"error": "..."} with exit code 1 when nothing was recalculated. errors_found exits 0 (a clean exit is not a
clean workbook) unless --fail-on-errors is given, which exits 3.

The workbook is opened in a separate, hidden Excel process with macros disabled and link-update prompts off, so
your own Excel windows are never touched. The save goes to a temporary file and replaces the target only after
Excel has closed the workbook.
"""
import argparse
import json
import os
import subprocess
import sys
import threading
import time

# Excel error values come back through COM as negative ints whose low word is the xlCVError code.
ERROR_CODES = {
    2000: "#NULL!", 2007: "#DIV/0!", 2015: "#VALUE!", 2023: "#REF!", 2029: "#NAME?", 2036: "#NUM!",
    2042: "#N/A", 2043: "#GETTING_DATA", 2045: "#SPILL!", 2046: "#CONNECT!", 2047: "#BLOCKED!",
    2048: "#UNKNOWN!", 2049: "#FIELD!", 2050: "#CALC!",
}
ERROR_RANGE = (-2146826288, -2146826238)  # 0x800A07D0 .. 0x800A0802
MAX_LOCATIONS = 100
EXTENSIONS = (".xlsx", ".xlsm")
AUTOMATION_SECURITY_FORCE_DISABLE = 3  # msoAutomationSecurityForceDisable: never run macros
CALCULATION_DONE = 0                   # xlDone


class RecalcError(Exception):
    """An expected failure: reported as {"error": ...} and exit 1."""


def error_name(value):
    if isinstance(value, bool) or not isinstance(value, int):
        return None
    if not ERROR_RANGE[0] <= value <= ERROR_RANGE[1]:
        return None
    return ERROR_CODES.get(value & 0xFFFF, "#ERROR!")


def column_letters(number):
    letters = ""
    while number > 0:
        number, rest = divmod(number - 1, 26)
        letters = chr(65 + rest) + letters
    return letters


def sheet_prefix(name):
    plain = name.replace("_", "").isalnum() and not name[0].isdigit()
    return name if plain else "'" + name.replace("'", "''") + "'"


def as_grid(value, rows, columns):
    """Range.Value2 and Range.Formula give a scalar for a single cell and a tuple of rows otherwise."""
    return ((value,),) if rows == 1 and columns == 1 else value


def scan_sheet(sheet, found):
    """Count formulas and collect error cells for one worksheet. Returns (formulas, errors)."""
    used = sheet.UsedRange
    rows, columns = used.Rows.Count, used.Columns.Count
    top, left = used.Row, used.Column
    formulas = as_grid(used.Formula, rows, columns)
    values = as_grid(used.Value2, rows, columns)
    prefix = sheet_prefix(sheet.Name)
    formula_count = error_count = 0
    for r in range(rows):
        formula_row, value_row = formulas[r], values[r]
        for c in range(columns):
            text = formula_row[c]
            if isinstance(text, str) and text.startswith("="):
                formula_count += 1
            name = error_name(value_row[c])
            if name:
                error_count += 1
                found.setdefault(name, []).append(f"{prefix}!{column_letters(left + c)}{top + r}")
    return formula_count, error_count


def kill_process(pid, timed_out):
    timed_out.set()
    try:
        subprocess.run(["taskkill", "/F", "/T", "/PID", str(pid)], capture_output=True, timeout=15)
    except Exception:  # best effort: the timeout error is reported either way
        pass


def wait_until_calculated(app, give_up_at):
    while app.CalculationState != CALCULATION_DONE:
        if time.monotonic() > give_up_at:
            raise RecalcError("Excel did not finish calculating in time")
        time.sleep(0.2)


def recalculate(args):
    if sys.platform != "win32":
        raise RecalcError("this helper drives Microsoft Excel and only runs on Windows")
    source = os.path.abspath(args.file)
    if not os.path.isfile(source):
        raise RecalcError(f"file not found: {source}")
    extension = os.path.splitext(source)[1].lower()
    if extension not in EXTENSIONS:
        raise RecalcError(f"unsupported file type {extension or '(none)'}: expected {' or '.join(EXTENSIONS)}")
    target = os.path.abspath(args.output) if args.output else source
    if os.path.splitext(target)[1].lower() != extension:
        raise RecalcError("--output must keep the source file's extension")
    if args.output and os.path.normcase(target) == os.path.normcase(source):
        raise RecalcError("--output is the source file; omit --output to save in place")

    try:
        import pythoncom
        import win32com.client
        import win32process
    except ImportError:
        raise RecalcError("pywin32 is missing: python -m pip install --user pywin32")

    pythoncom.CoInitialize()
    app = workbook = timer = None
    temp = None
    warnings = []
    timed_out = threading.Event()
    try:
        try:
            app = win32com.client.DispatchEx("Excel.Application")  # own process, never the user's session
        except Exception as exc:
            raise RecalcError(f"could not start Microsoft Excel: {exc}")
        app.Visible = False
        app.DisplayAlerts = False
        app.EnableEvents = False
        app.AskToUpdateLinks = False
        app.AutomationSecurity = AUTOMATION_SECURITY_FORCE_DISABLE
        try:
            pid = win32process.GetWindowThreadProcessId(app.Hwnd)[1]
            timer = threading.Timer(args.timeout, kill_process, (pid, timed_out))
            timer.daemon = True
            timer.start()
        except Exception:
            warnings.append("the time limit is not enforced: could not identify the Excel process this run started")

        read_only = args.no_save or bool(args.output)
        workbook = app.Workbooks.Open(source, UpdateLinks=0, ReadOnly=read_only, IgnoreReadOnlyRecommended=True,
                                      AddToMru=False)
        if workbook.ReadOnly and not read_only:
            raise RecalcError("the workbook opened read-only; close it in any other program and try again")

        deadline = time.monotonic() + args.timeout
        app.CalculateFull()
        wait_until_calculated(app, deadline)

        found, sheets = {}, []
        total_formulas = total_errors = 0
        for sheet in workbook.Worksheets:
            formulas, errors = scan_sheet(sheet, found)
            sheets.append({"name": sheet.Name, "formulas": formulas, "errors": errors})
            total_formulas += formulas
            total_errors += errors

        try:
            links = workbook.LinkSources(1)
        except Exception:
            links = None

        saved = False
        if not args.no_save:
            temp = os.path.join(os.path.dirname(target), f".recalc-{os.getpid()}-{os.path.basename(target)}")
            workbook.SaveCopyAs(temp)
            if not os.path.isfile(temp) or os.path.getsize(temp) == 0:
                raise RecalcError("Excel did not write the recalculated copy")
        engine = f"Microsoft Excel {app.Version} (build {app.Build})"
        workbook.Close(SaveChanges=False)
        workbook = None
        if temp:
            os.replace(temp, target)  # the original is unlocked now that the workbook is closed
            temp, saved = None, True
    except RecalcError:
        raise
    except Exception as exc:
        if timed_out.is_set():
            raise RecalcError(
                f"timed out after {args.timeout} seconds; the Excel process was ended. If the next run waits on a "
                "\"the last time you opened ... it caused a serious error\" prompt, open the file in Excel once, "
                "answer Yes, and raise --timeout")
        raise RecalcError(f"Excel automation failed: {exc}")
    finally:
        if timer:
            timer.cancel()
        try:
            if workbook is not None:
                workbook.Close(SaveChanges=False)
        except Exception:
            pass
        try:
            if app is not None:
                app.Quit()
        except Exception:
            pass
        workbook = app = None
        if temp and os.path.exists(temp):
            try:
                os.remove(temp)
            except OSError:
                pass
        pythoncom.CoUninitialize()

    summary, withheld = {}, 0
    for name, locations in sorted(found.items()):
        summary[name] = {"count": len(locations), "locations": locations[:MAX_LOCATIONS]}
        withheld += max(0, len(locations) - MAX_LOCATIONS)
    result = {
        "status": "errors_found" if total_errors else "success",
        "total_formulas": total_formulas,
        "total_errors": total_errors,
        "error_summary": summary,
        "locations_truncated": withheld,
        "sheets": sheets,
        "engine": engine,
        "saved": saved,
        "output": target if saved else None,
        "external_links": list(links) if links else [],
    }
    if warnings:
        result["warnings"] = warnings
    return result


def main(argv=None):
    parser = argparse.ArgumentParser(description="Recalculate a workbook with Microsoft Excel and report errors.")
    parser.add_argument("file", help="the .xlsx or .xlsm workbook")
    parser.add_argument("--output", metavar="PATH", help="write the recalculated copy here and leave the source alone")
    parser.add_argument("--no-save", action="store_true", help="recalculate and report, write nothing")
    parser.add_argument("--timeout", type=int, default=120, metavar="SECONDS",
                        help="give up and end the Excel process after this long (default 120)")
    parser.add_argument("--fail-on-errors", action="store_true", help="exit 3 when formula errors are found")
    args = parser.parse_args(argv)
    if args.output and args.no_save:
        parser.error("--output and --no-save cannot be combined")
    if args.timeout < 1:
        parser.error("--timeout must be at least 1")
    try:
        result = recalculate(args)
    except RecalcError as exc:
        print(json.dumps({"error": str(exc)}, indent=2))
        return 1
    print(json.dumps(result, indent=2))
    return 3 if args.fail_on_errors and result["total_errors"] else 0


if __name__ == "__main__":
    sys.exit(main())
