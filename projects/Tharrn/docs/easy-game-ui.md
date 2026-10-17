# Tharrn — Easy Game UI Ultimate reference

Tharrn's menus and HUD are built with **Easy Game UI Ultimate 3.0** (D-21): "i added Easy Game UI ultimate 3.0 to my
library. this should let us make the games UI and Hud" (owner, 2026-10-16). Its documentation is the source:
[nerwy-ue.com/docs/easy-game-ui-ultimate-3-0](https://www.nerwy-ue.com/docs/easy-game-ui-ultimate-3-0/project-setup/).
This file notes what matters for Tharrn, read on 2026-10-16.

## State

- Downloaded, and added by the owner to the project as `Content/EasyGameUI` (2026-10-16). Like every pack it stays
  outside Git (D-08): it still needs a row in `Tools/Packs/packs.csv`, so the STAGED PACKS block of `.gitignore`
  covers it. Its two plugins (JSON Blueprint Utilities, Blueprint File Utilities) are on in `Tharrn.uproject`.
- Version 3.0.2 (18 June 2026) officially supports UE 5.8 and fixes a 5.8 crash tied to some volumetric settings.
- **Set up 2026-10-16 (P4.9), with no change to the pack but one value:** Tharrn's copies of its settings and styling
  (`/Game/Tharrn/UI/DA_TharrnUIConfig`, `DA_TharrnUIStyling`) and its config selector `BP_EGUI_GlobalConfigSelector`
  pointed at them (its class default `GlobalConfigDataAsset`; the pack's file is backed up in
  `Saved/PackBackups/2026-10-16/` until the pack is staged again); `BP_TharrnGameInstance` (its game instance, as a
  Tharrn child) as the project's game instance; `BP_TharrnHUD` (its HUD, as a Tharrn child) in `BP_TharrnGameMode`;
  the main menu level `L_TharrnMainMenu` (its menu controller, a camera, `BP_TharrnMenuGameMode` with no body) as the
  game's start level; Render Focus Rule Never; Esc (`IA_PauseMenu`) calls its HUD's `OpenPauseMenu` from
  `ATharrnPlayerController`. Settings chosen for Tharrn: New Game opens the test range; the pause menu does not pause
  (online); no saves, autosaves, photo mode, intro or credits button yet; version 0.4; MSS's text colour and a pale
  blue accent; a text placeholder logo. All in `Tools/UI/build_ui.py`.
- Its menus keep their own backdrops (a teal or pink blur) and the demo content stays until the whole UI pass.

## What it gives

Main menu and intro screen, pause menu, options menu (with a settings system), save game system, a HUD building
toolkit, an interaction system, photo mode, credits, UI navigation for mouse and gamepad, modular widgets, input
prompts, and a global config and styling system. Demo content can be removed (its "Removing Demo Content" page).

## Setup it needs (its Project Setup, Game Instance and Game HUD pages)

| Step | Tharrn |
|---|---|
| Plugins: JSON Blueprint Utilities, Blueprint File Utilities | On (2026-10-16) |
| Project settings: Enable User Settings on; Render Focus Rule "Never"; optional: Should Flush Pressed Keys on Viewport Focus Lost off | To set |
| Rendering: Lumen on; Support Hardware Ray Tracing (only for its options-menu toggle for hardware Lumen) | Lumen on; hardware ray tracing to decide (D-11 budget) |
| Game Instance: `GI_EasyMainGameInstance` (`EasyGameUI/Core`) in Maps & Modes | Tharrn has the engine's default Game Instance, so it is set directly (their "Situation A") |
| HUD: `BP_EasyMainGameHUD` (`EasyGameUI/Core`) as the HUD class in every game mode | `BP_TharrnGameMode` uses the engine HUD; set it there |

## For Tharrn

- Its pages do not mention multiplayer. Menus and HUDs run on each player's own machine anyway; what they show
  (vitals, ammo) comes from replicated game state, built server-authoritative (D-04). Its interaction system is to
  be checked against that rule before it is used, as the Sci-Fi bundle's are (D-20).
- The game's UI is module P4 (D-25: the hotbar, the inventory screen, the HUD and its menus, in the look of MSS's
  weapon selector, with this pack's global styling set to match); the vitals on the HUD come with P5. Its main menu has
  no hosting or joining (its pages do not cover online play): a later module. Its HUD builder and interaction system are
  not used (Tharrn's HUD widget and pickups are C++, server-checked). The 12 placeholder icons of deliverable 8
  stay placeholders until the art direction is set.
- The owner offered a Higgsfield subscription for better-looking art and icons that match the assets; Claude says
  when it would help (not needed yet).
