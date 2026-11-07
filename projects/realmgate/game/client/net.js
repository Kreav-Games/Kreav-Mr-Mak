// Two transports with the same interface: a local simulation for solo play and
// a WebSocket connection to the room server for multiplayer.
//   t.connect(hello) -> Promise<{ id, room }>
//   t.send(msg); t.onSnapshot = fn; t.onSave = fn; t.close()

import { Sim } from '../shared/sim.js';
import { TICK_RATE } from '../shared/data.js';

export class LocalTransport {
  constructor({ arena }) { this.sim = new Sim({ arenaRadius: arena }); this.id = 'solo'; }

  connect(hello) {
    this.sim.join(this.id, hello);
    let tick = 0;
    this.timer = setInterval(() => {
      this.sim.step(1 / TICK_RATE);
      if (++tick % 2) return;
      const events = this.sim.drainEvents();
      this.onSnapshot?.(this.sim.snapshot(this.id, events));
      if (tick % (TICK_RATE * 5) === 0) this.onSave?.(this.sim.saveOf(this.id));
    }, 1000 / TICK_RATE);
    return Promise.resolve({ id: this.id, room: null });
  }

  send(msg) { this.sim.handle(this.id, msg); }
  requestSave() { this.onSave?.(this.sim.saveOf(this.id)); }
  close() { this.requestSave(); clearInterval(this.timer); }
}

export class WsTransport {
  constructor({ url }) { this.url = url; }

  connect(hello) {
    return new Promise((resolve, reject) => {
      const ws = new WebSocket(this.url);
      this.ws = ws;
      let welcomed = false;
      ws.onopen = () => ws.send(JSON.stringify({ t: 'hello', ...hello }));
      ws.onerror = () => { if (!welcomed) reject(new Error('Could not reach the game server')); };
      ws.onclose = () => { if (welcomed) this.onClose?.(); };
      ws.onmessage = (ev) => {
        const msg = JSON.parse(ev.data);
        if (msg.t === 'welcome') { welcomed = true; this.id = msg.id; resolve(msg); }
        else if (msg.t === 'error' && !welcomed) reject(new Error(msg.text));
        else if (msg.t === 'snap') this.onSnapshot?.(msg.s);
        else if (msg.t === 'save') this.onSave?.(msg.save);
      };
    });
  }

  send(msg) { if (this.ws?.readyState === 1) this.ws.send(JSON.stringify(msg)); }
  requestSave() { this.send({ t: 'save' }); }
  close() { this.ws?.close(); }
}

export function serverUrl() {
  const q = new URLSearchParams(location.search).get('server');
  if (q) return q;
  return `${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.host}/ws`;
}
