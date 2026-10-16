# Deliverable 3 — PvP flagging state, expanded

Version 0.1, 2026-10-15. The direction's flagging rules (§2.4, pseudocode §5.3) and the owner's state keys and
RPCs ([GDD 05](../gdd/05-pvp-zones.md)) worked out as a server-side state machine, ready to build. Everything runs
on the server (D-04); clients only display what the server replicates. Points the direction leaves open are marked
**Proposal** and wait for the owner.

## 1. Inputs

| Source | Fields used |
|---|---|
| Zone data (`Data/Zones.csv` → `DT_Zones`) | `zone_id`, `type`, bounds, `pvp_flag`, `entry_consent_buffer_seconds`, `exit_cooldown_seconds` |
| Server settings | `ProxySeconds` = 300 (combat-logging proxy), `NewPlayerProtectionSeconds` (Proposal: 2 h of play), `BountyPerKill` (Proposal) |
| Player | position, alive or dead, connection, level |

## 2. State per player

Lives in a `UTharrnPvPFlagComponent` on the player state, so it survives the pawn's death and respawn.

| Key (owner's name) | Type | Replicated to | Meaning |
|---|---|---|---|
| `FlagState` | `Unflagged`, `Consenting`, `Flagged`, `Cooling` | everyone | The state machine below |
| `Flagged` | bool, derived | everyone | `FlagState` is `Flagged` or `Cooling`: other players' clients colour the name plate red |
| `InPvPZone` | bool | owner | Inside at least one zone with `pvp_flag` |
| `FlagConsentTimer` | server time when consent ends | owner | HUD countdown while `Consenting` |
| `FlagExitTimer` | server time when the flag clears | owner | HUD countdown while `Cooling` |
| `ProxyActive` | bool | everyone | The player is disconnected and an AI stand-in holds their place |
| `BountyValue` | int | everyone | Bounty on this player |
| `ProtectedUntil` | server time | owner | New-player protection (Proposal) |

Timers are stored as end times, not counted down every frame: the server sets a timer, clients show
`end time − server time`. The gameplay tag `State.Flagged` on the player's ability system mirrors `Flagged` for the
damage check (§5).

## 3. Zone membership

A player can stand in two zones at once at a border. The server keeps the set of zone IDs the pawn overlaps
(zone volumes built from `DT_Zones`; overlap events, checked against `UTharrnDataLibrary::FindZoneAt` every second
so a missed event cannot leave a stale state).

```
OnZoneSetChanged(player, zones):
    pvpZones = [z for z in zones if z.pvp_flag]
    wasIn = player.InPvPZone
    player.InPvPZone = not pvpZones.empty()
    player.LastPvPZone = pvpZones.last() if pvpZones else player.LastPvPZone
    if not wasIn and player.InPvPZone:  OnEnterPvP(player, pvpZones.last())
    if wasIn and not player.InPvPZone:  OnLeavePvP(player, player.LastPvPZone)
    if any(z.type == BufferZone for z in zones):  Client_ShowWarning(player, "Flagged zone ahead")
```

Moving from one PvP zone into a neighbouring one never leaves `InPvPZone`, so it changes nothing.

## 4. State machine

```
                 enter PvP zone, consent > 0
   Unflagged ───────────────────────────────► Consenting
       ▲  │ enter PvP zone, consent = 0            │ consent timer ends
       │  └──────────────────────┐                 ▼
       │                         └────────────► Flagged ◄──────┐
       │ leave during consent                      │ leave     │ re-enter (no new consent)
       │ (no cooldown)                             ▼           │
       ├─────────────────────────────────────── Cooling ───────┘
       │            exit timer ends
       └─────────── death (any state) ──────────────────────────
```

```
OnEnterPvP(player, zone):
    if player.ProtectedUntil > Now():                  # Proposal: entering ends protection, after a warning
        Client_ShowWarning(player, "Entering ends your new-player protection")
        player.ProtectedUntil = Now()
    switch player.FlagState:
        Unflagged:
            if zone.entry_consent_buffer_seconds > 0:
                SetState(player, Consenting)
                player.FlagConsentTimer = Now() + zone.entry_consent_buffer_seconds
                StartTimer(player.ConsentHandle, zone.entry_consent_buffer_seconds, OnConsentEnds)
            else:
                SetState(player, Flagged)
        Cooling:
            ClearTimer(player.ExitHandle)              # back inside: the flag never cleared
            SetState(player, Flagged)
        Consenting, Flagged:
            pass                                       # cannot happen: InPvPZone was already true

OnConsentEnds(player):
    if player.FlagState == Consenting and player.InPvPZone:
        SetState(player, Flagged)

OnLeavePvP(player, zone):
    switch player.FlagState:
        Consenting:
            ClearTimer(player.ConsentHandle)
            SetState(player, Unflagged)                # left before consenting: no cooldown
        Flagged:
            SetState(player, Cooling)
            player.FlagExitTimer = Now() + zone.exit_cooldown_seconds
            StartTimer(player.ExitHandle, zone.exit_cooldown_seconds, OnExitTimerEnds)

OnExitTimerEnds(player):
    if player.FlagState == Cooling and not player.InPvPZone:
        SetState(player, Unflagged)

SetState(player, state):
    player.FlagState = state
    player.Flagged = state in (Flagged, Cooling)
    SetGameplayTag(player, "State.Flagged", player.Flagged)
    ForceNetUpdate(player)                             # QA002: nearby clients see it within 100 ms
    Log("[THFlag]", player, state)
```

## 5. Who may damage whom

Checked on the server in the damage path, before armour and multipliers (D-04).

```
CanDamage(attacker, victim):
    if attacker is not a player or victim is not a player:   return true      # creatures, hazards, self-made traps
    if attacker == victim:                                   return true      # own grenades
    if victim.ProxyActive:                                   return victim.Flagged and attacker.Flagged
    return attacker.Flagged and victim.Flagged
```

So a `Cooling` player who has just left a zone can still be shot by, and shoot, other flagged players: leaving is
not a free escape. An unflagged player standing at the border can do nothing to a flagged one. **Proposal:** friendly
fire inside a party is off; parties are not designed yet.

## 6. Death and respawn

```
OnPlayerDied(victim, killer):
    if victim.Flagged:                                # Flagged or Cooling. Proposal: the 60 s after leaving count too,
        DropLootContainer(victim, all carried items)  # or stepping out would save the loot. Full loot is the direction's
                                                      # default; base storage is untouched
    if killer is a player and killer.Flagged and victim.Flagged:
        killer.BountyValue += BountyPerKill + victim.BountyValue / 2      # Proposal; the direction gives no formula
        victim.BountyValue = 0
    ClearTimer(victim.ConsentHandle); ClearTimer(victim.ExitHandle)
    SetState(victim, Unflagged)
    RespawnAt(victim, NearestSafeRespawnOutside(PvP zones))
```

## 7. Disconnecting (combat logging)

```
Server_HandleDisconnect(playerID):
    player = Find(playerID)
    if player.Flagged:                                  # Flagged or Cooling
        proxy = SpawnProxy(player.pawn.transform, player.health, player.inventory, player.FlagState)
        player.ProxyActive = true
        StartTimer(player.ProxyHandle, ProxySeconds, OnProxyExpires)
    else:
        DespawnPawn(player)                             # an unflagged player just leaves

OnProxyKilled(proxy, killer):    OnPlayerDied(proxy.owner, killer); DespawnProxy(proxy); proxy.owner.ProxyActive = false
OnProxyExpires(player):          SavePlayer(player, from = proxy); DespawnProxy; player.ProxyActive = false
OnReconnect(player):
    if player.ProxyActive:                              # take over the stand-in where it stands
        Possess(player, proxy.pawn); ClearTimer(player.ProxyHandle); player.ProxyActive = false
```

The proxy keeps the flag state it had, and its exit timer keeps running.

## 8. Extraction

```
Server_RequestExtraction(playerID, extractionPointID):
    player, point = Find(playerID), Find(extractionPointID)
    reject unless player is alive, within point.radius, point.active, player not already extracting
    player.Extraction = {point, startedAt = Now(), endsAt = Now() + point.seconds}
    Multicast to players near the point: ExtractionStarted(player, point, endsAt)

On each server second, for each extracting player:
    if player left point.radius or died:  Interrupt(player, reason)
    elif Now() >= player.Extraction.endsAt:  CompleteExtraction(player)   # loot secured, travel to a hub

Server_InterruptExtraction(attackerID, targetExtractionID):   # called by the damage path, not by clients
    when a player who is extracting takes damage from a flagged player:  Interrupt(target, "interrupted by <attacker>")

Interrupt(player, reason):
    player.Extraction = none                            # Proposal: progress resets; the direction does not say
    Notify player and nearby: ExtractionInterrupted(player, reason)       # QA003
```

`Server_InterruptExtraction` is listed by the owner as an RPC; it is kept as a server function the damage path calls,
because a client must never be able to interrupt someone else's extraction by asking.

## 9. Building it in Unreal (Prototype onwards)

| Part | Where |
|---|---|
| State, timers, damage check | C++ `UTharrnPvPFlagComponent` on the player state; state replicated (`FlagState`, `Flagged`, `BountyValue`, `ProxyActive` to all; timers owner-only) |
| Zones | `ATharrnZoneVolume` actors generated from `DT_Zones` by a re-runnable tool script |
| HUD | Red icon and countdown from the replicated state; amber warning on buffer zones |
| Logs | `[THFlag]` lines, so `net_test.py` can check every client sees each change |

## 10. Tests

| Test | Pass |
|---|---|
| Enter a zone with a 10 s consent buffer | `Consenting`, then `Flagged` after 10 s, not before |
| Leave during consent | `Unflagged` at once; no cooldown |
| Leave a flagged zone | `Cooling` for 60 s, then `Unflagged` |
| Re-enter while cooling | `Flagged` at once, no new consent |
| Cross from one PvP zone into a neighbour | No state change |
| Damage matrix | Only flagged ↔ flagged player damage passes; creatures always |
| Disconnect while flagged | A proxy with the same gear stays 300 s; killing it drops the loot; reconnecting takes it over |
| Death while flagged (inside a zone, or cooling outside one) | Loot container dropped, respawn outside PvP zones, `Unflagged` |
| Extraction interrupted by a flagged attacker | Progress stops; the HUD shows it interrupted (QA003) |
| Flag change on 2 clients at 100 ms latency | Every client logs it within 100 ms of the server plus latency (QA002) |

Server-only logic is covered by automation tests; the last row by `net_test.py`.
