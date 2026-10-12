# Wildwright — Vision

> *The world is not your resource. It is your creation, your adversary, and your memory.*

**Read this first (two minutes).** The full specification is in
[02-gdd.md](02-gdd.md). Decisions are in [04-decisions.md](04-decisions.md).

## The idea

Wildwright is a third-person action-fantasy sandbox in which you learn to wield
**fire, water, earth and air** and use them to change a living, damaged valley.
Every cast is a cinematic performance. Every cast also changes the world in a way
you can read, remember and build on.

> **Player fantasy:** "I understand this world better than I did yesterday. I can
> now do things that once seemed impossible, and the landscape itself shows the
> consequences of my decisions."

## What makes it different

| Typical survival game | Wildwright |
|---|---|
| Gather → craft → fight stronger enemies | Observe → experiment → understand → reshape |
| Progression is gear and numbers | Progression is **knowledge** of how the world works |
| Spells are damage | Spells change moisture, heat, soil, airflow and habitat |
| World resets or ignores you | The world **remembers** selected consequences |
| Effects are decoration | Effects are a performance *and* are backed by readable state |

## Two layers, one game

This is the central design idea, and it is what makes the cinematic direction
compatible with a systemic game.

| Cast layer | State layer |
|---|---|
| The performance: charge, release, camera, Niagara, audio, haptics | The consequence: moisture, heat, soil, vegetation, creature habitat |
| Transient, spectacular | Persistent, readable |
| Cosmetic, never authoritative | The only source of truth |

*You cast with the weight of an action-fantasy hero. The valley responds like an
ecosystem.* Full rules: GDD section 2.2.

## The loop

**Observe → hypothesize → cast → read the result → record it → use the new option
→ come back to a changed region.**

Example: a river vanishes into a collapsed ravine. You find a smaller stream
nearby, redirect it with an earth barrier, watch soil darken and plants return,
and later notice a grazing creature has claimed the new green patch. The new
route is harder to cross. You decide how to adapt.

## Scope guard

The first playable is **one small valley**: four elements, six rules, two plant
types, one or two creatures, a shelter, a journal and save/load. It is not an open
world and not a combat game. See GDD sections 14 and 15.3.

## Directions considered

Five concept directions were explored while the idea was developed. One became
the core; the others are borrowed selectively.

| Concept | Role in Wildwright |
|---|---|
| **The World That Learns** | Primary foundation (ecological memory) |
| Elemental Cartographer | Traversal and environmental puzzles |
| The Wild Engine | Selective: living infrastructure, ecosystem systems |
| After the Elements | Regional identity and exploration |
| The Elemental Legacy | Possible future shared-world expansion |

Do not merge all five into separate major systems.

## Where the "feel" comes from

The target for spectacle, animation fluidity and cast presentation is Epic's
*Valley of the Ancient* sample. It is a **reference for feel and pipeline, not a
base project**. See
[03-feel-reference-valley-of-the-ancient.md](03-feel-reference-valley-of-the-ancient.md).

## Open at the vision level

- Final title (Wildwright is a working title; only a quick web check has been done).
- How much combat the action-fantasy direction implies (OD-03).
- Art direction (OD-06).
- Whether a shared world is ever a goal (currently: no).

*Originals of the concept document and GDD v0.1 are preserved in `../source/`.*
