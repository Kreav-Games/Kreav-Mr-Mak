# Wildwright — Vision

> *Read the land. Change it with your own hands. Come back and see what it became.*

**Read this first (two minutes).** The full design is [02-gdd.md](02-gdd.md);
decisions are in [04-decisions.md](04-decisions.md).

## The idea

Wildwright is a third-person sandbox in which you learn to wield **fire, water,
earth and air** and use them to shape a living valley. Earth cuts channels and
raises berms in soft ground. Water follows the new course and wets the land it
reaches. Fire burns what is dry and leaves scars. Air turns the wind, and the fire
with it. Every cast is a cinematic performance, and every cast changes the
landscape in a way you can see, understand and come back to.

> **Player fantasy:** "I read this valley, I changed it with my own hands, and when
> I came back it had become something new, partly because of me."

## Scars, not resets

The valley remembers. A burned slope stays burned, then slowly greens through
grass, scrub and woodland. A diverted stream keeps its new course. A flooded hollow
may become a marsh and stay one. Nature pushes back, but recovery does not have to
recreate the original: changed conditions can settle into a new, stable landscape.
Nothing quietly resets behind you.

## What makes it different

| Typical sandbox | Wildwright |
|---|---|
| Elements are damage | Elements change terrain, water, vegetation and wind |
| Build on top of a fixed world | Shape the world itself, within readable limits: soft earth moves, bedrock resists |
| The world resets or ignores you | The world keeps scars and recovers on its own terms |
| Progress is gear and numbers | Progress is understanding how the land works |
| Water and fire are decoration | A flow network decides where water goes; cells decide what burns; the visuals follow |

## Two layers, one game

| Cast layer | State layer |
|---|---|
| Charge, release, camera, Niagara, sound | Terrain cells, earthworks, flow network, vegetation, scars |
| Transient, spectacular | Persistent, readable |
| Never decides what happened | The only source of truth |

*You cast with the weight of an action-fantasy hero. The valley responds like an
ecosystem.* (GDD §2.2)

## The loop

**Read the land → choose an intervention → shape it → watch it work → let the world
respond → return and read the consequence → adapt.**

Example: a meadow below the stream has dried out. You draw a channel from the stream
down the slope, and water finds it. The banks darken; the old stream bed thins.
A fire starts upwind of the grove; your channel stops it on one side and burns
through the other. You rest at camp for two days. The meadow is green; the burned
slope shows the first new grass.

## Built to scale

The whole world never runs at full detail: rich simulation only where you are,
compact numbers everywhere else, and no fluid or voxel simulation. That keeps a
single valley fast today, and leaves the door open to a shared world many players
shape together later.

## The MVP

One valley about 400 m across, four element actions, the world systems underneath
them, two objectives and save and load. Built **system by system, hardest
technology first**: prove that a channel can be cut, carry water and be saved
before adding fire, growth and spells (GDD §14).

## Open at the vision level

- Final title (Wildwright is a working title; OD-05).
- Art direction (OD-06).
- Whether a shared multiplayer world becomes a goal (designed for, not built).

*Original source documents, including the Dynamic World Systems Concept v0.1, are in
`../source/`.*
