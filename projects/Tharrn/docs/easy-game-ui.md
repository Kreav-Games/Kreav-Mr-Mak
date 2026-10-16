# Tharrn — Easy Game UI Ultimate reference

Tharrn's menus and HUD are built with **Easy Game UI Ultimate 3.0** (D-21): "i added Easy Game UI ultimate 3.0 to my
library. this should let us make the games UI and Hud" (owner, 2026-10-16). Its documentation is the source:
[nerwy-ue.com/docs/easy-game-ui-ultimate-3-0](https://www.nerwy-ue.com/docs/easy-game-ui-ultimate-3-0/project-setup/).
This file notes what matters for Tharrn, read on 2026-10-16.

## State

- In the owner's Fab library; **not downloaded yet** (not in the launcher cache). To stage it like the other packs
  (outside Git, D-08), the owner downloads it in the Epic Games Launcher; then it gets a row in `Tools/Packs/packs.csv`.
- Version 3.0.2 (18 June 2026) officially supports UE 5.8 and fixes a 5.8 crash tied to some volumetric settings.
- Check its Fab AI flag when it is downloaded, as for every pack (D-08).

## What it gives

Main menu and intro screen, pause menu, options menu (with a settings system), save game system, a HUD building
toolkit, an interaction system, photo mode, credits, UI navigation for mouse and gamepad, modular widgets, input
prompts, and a global config and styling system. Demo content can be removed (its "Removing Demo Content" page).

## Setup it needs (its Project Setup, Game Instance and Game HUD pages)

| Step | Tharrn |
|---|---|
| Plugins: JSON Blueprint Utilities, Blueprint File Utilities | To enable |
| Project settings: Enable User Settings on; Render Focus Rule "Never"; optional: Should Flush Pressed Keys on Viewport Focus Lost off | To set |
| Rendering: Lumen on; Support Hardware Ray Tracing (only for its options-menu toggle for hardware Lumen) | Lumen on; hardware ray tracing to decide (D-11 budget) |
| Game Instance: `GI_EasyMainGameInstance` (`EasyGameUI/Core`) in Maps & Modes | Tharrn has the engine's default Game Instance, so it is set directly (their "Situation A") |
| HUD: `BP_EasyMainGameHUD` (`EasyGameUI/Core`) as the HUD class in every game mode | `BP_TharrnGameMode` uses the engine HUD; set it there |

## For Tharrn

- Its pages do not mention multiplayer. Menus and HUDs run on each player's own machine anyway; what they show
  (vitals, ammo) comes from replicated game state, built server-authoritative (D-04). Its interaction system is to
  be checked against that rule before it is used, as the Sci-Fi bundle's are (D-20).
- The prototype HUD is module P4 (vitals and the weapon panel, GDD 10); the 12 placeholder icons of deliverable 8
  stay placeholders until the art direction is set.
- The owner offered a Higgsfield subscription for better-looking art and icons that match the assets; Claude says
  when it would help (not needed yet).
