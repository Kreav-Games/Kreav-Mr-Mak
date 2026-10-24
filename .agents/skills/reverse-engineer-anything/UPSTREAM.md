# Upstream and local changes

This folder is a vendored, unmodified copy of a third-party skill. Keep `LICENSE` with it.

| | |
| --- | --- |
| Project | REA (`rea-agents` on npm, skill `reverse-engineer-anything`) |
| Author | morluto |
| Source | https://github.com/morluto/rea |
| Pinned release | `rea-agents@6.7.0` (skill version 42, 207 tools) |
| License | MIT (`LICENSE`) |
| Vendored | 2026-10-24 |

## What was left out

Everything except `skills/reverse-engineer-anything/` and the package `LICENSE`. The skill supplies
instructions only; it does not register the `rea` MCP server or install Ghidra or any other engine.

## What was changed

Nothing. The files match the package's `skills/reverse-engineer-anything/` byte for byte.

## Updating

When `rea-agents` setup installs a newer skill, copy the package's `skills/reverse-engineer-anything/`
over this folder, keep this file, update the pinned release here and run `npm run skills:sync`.
Version-pinned commands inside `SKILL.md` (for example `rea-agents@6.7.0 doctor`) follow the release.
