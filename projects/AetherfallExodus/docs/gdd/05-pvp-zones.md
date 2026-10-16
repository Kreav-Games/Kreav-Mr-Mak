# 05 — PvP flagged zones (direction §2.4)

## Flagging

| Rule | Spec |
|---|---|
| Entry | Flagged immediately, server-side, on crossing the zone boundary |
| Cooldown | The flag stays until the player has left and stayed outside for 60 s (configurable) |
| Consent buffer | Optional 10 s buffer on entry for casual servers |
| State | `Player.Flagged` true or false; the HUD shows a red icon and a timer |

## Consequences

- Combat: flagged players can damage each other; unflagged players cannot be attacked.
- Loot: full loot on death in flagged zones by default; secured base storage is safe unless raided.
- Bounties: kills accrue bounties; bounty hunters can track flagged players with devices.
- Extraction: extraction points with progress bars, interruptible by other players.

## Anti-abuse

- Combat logging: a disconnect leaves an AI proxy with the player's gear for 5 minutes.
- Griefing: newbie protection timers; safe respawn outside PvP zones.
- Cheating: server-side validation and automated reporting.

## Reference pseudocode (direction §5.3)

```
Event OnPlayerEnterZone(zone)
  if zone.type == "PvP"
    Player.Flagged = true
    Player.FlagTimer = 0
    Broadcast HUD update (red icon, timer)

Tick(delta)
  if Player.Flagged and not Player.InPvPZone
    Player.FlagTimer += delta
    if Player.FlagTimer >= 60
      Player.Flagged = false
      Broadcast HUD update (clear)
```

Extraction RPCs: `Server_RequestExtraction(player, extractionPointId)` validates, starts progress,
replicates to nearby players; `Server_InterruptExtraction(attackerId)` interrupts.

## Build notes

- Flag state on the player state, replicated; zone volumes from the zone CSV (direction §5.4) with
  `pvp_flag`; the 60 s exit timer as a server timer rather than a tick (same behaviour, cheaper).
- Damage permission is checked on the server in the damage path (gameplay tag `State.Flagged` on both
  sides), never on the client.
- Not in the Prototype; the vertical slice has one flagged zone with extraction.

## From the owner's package ([owner's package review](../reviews/owner-package-2026-10-15.md))

- **Per-zone settings** in the zone CSV: `entry_consent_buffer_seconds` (10 on PvP zones) and
  `exit_cooldown_seconds` (60), so casual and hardcore zones can differ.
- **State keys:** player `Flagged`, `InPvPZone`, `FlagExitTimer`, `FlagConsentTimer`, `ProxyActive`,
  `BountyValue`; zone `ZoneID`, `PvPFlag`, `ConsentBuffer`, `ExitCooldown`.
- **Server RPCs:** `Server_OnPlayerEnterZone(player, zoneID)`, `Server_OnPlayerExitZone(player, zoneID)`,
  `Server_RequestExtraction(playerID, extractionPointID)`,
  `Server_InterruptExtraction(attackerID, targetExtractionID)`, `Server_HandleDisconnect(playerID)`.
- The expanded pseudocode (deliverable 3) is still to write.
