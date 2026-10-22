# Upstream and local changes

This folder is a vendored, trimmed copy of a third-party skill. Keep `LICENSE` and `NOTICE` with it.

| | |
| --- | --- |
| Project | claude-powerpoint-skill (`building-powerpoint-decks`) |
| Author | Peter Kalmström |
| Source | https://github.com/PeterKalmstrom/claude-powerpoint-skill |
| Pinned commit | `a89090d02849efbbda1a01adebd4515e49ff9965` (2026-10-09) |
| License | MIT (`LICENSE`); third-party attributions in `NOTICE` |
| Vendored | 2026-10-09 |

## What was left out

- `mcp-app/` — the optional "PowerPoint Live" MCP server (it runs Claude-supplied Python against an open deck).
- `scripts/send_error_report.py` — the error-report sender.
- `scripts/selftest.py`, `tools/`, `evals/`, `.github/`, `.claude-plugin/`, `CONTRIBUTING.md`, `README.md`,
  `CHANGELOG.md` and the example images other than `examples/spec/skyline.jpg`.

## What was changed

- `scripts/kShared.py`: error reporting is disabled. `kErrorReport.EstateUrl()` and `EffectiveUrl()` return `""`
  and `kErrorReport.Send()` returns before any network call, so nothing is ever transmitted. Upstream could POST an
  error report (message, stack trace, script path, Python/OS version) to the author's Azure relay after a yes/no
  prompt. Errors are still printed as `ERROR in Class.Method` and exit 1.
- `SKILL.md`, `reference/SETUP.md`, `reference/BUILDER.md`, `scripts/README.md`, `scripts/directions.json`:
  references to the removed files were removed or reworded.

## Updating

Re-fetch the upstream commit you want, re-apply the changes above, review the diff for new network or `exec`
code, and update the pinned commit here. Nothing in this folder updates itself.
