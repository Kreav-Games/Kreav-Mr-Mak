// Network-ready message shapes for a future online mode.
// Nothing here opens a connection: online play needs a server, which this build does not include.
import type { InputFrame, PartItem, Paint, ClassId, SlotId } from '../core/types';

/** What a client would send to describe its robot before a match. */
export interface LoadoutMessage { type: 'loadout'; name: string; cls: ClassId; parts: Partial<Record<SlotId, PartItem>>; paint: Paint; decal: number; skills: Record<string, number> }
/** One simulation tick of player intent. Fighter.update consumes exactly this shape. */
export interface InputMessage { type: 'input'; tick: number; frame: InputFrame }
/** Authoritative snapshot a server would broadcast for reconciliation. */
export interface SnapshotMessage {
  type: 'snapshot'; tick: number;
  fighters: { x: number; z: number; yaw: number; hp: number; stamina: number; heat: number; special: number; state: string; move: string | null; moveT: number }[];
  round: number; time: number;
}
export type NetMessage = LoadoutMessage | InputMessage | SnapshotMessage;
export const NET_TICK_RATE = 60;
