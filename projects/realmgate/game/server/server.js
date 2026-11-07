// Realmgate multiplayer server: serves the built client from dist/ and runs one
// authoritative simulation per room over WebSockets at /ws.
//   PORT=8787 node server/server.js

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { WebSocketServer } from 'ws';
import { Sim } from '../shared/sim.js';
import { TICK_RATE } from '../shared/data.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const PORT = Number(process.env.PORT || 8787);
const MAX_PER_ROOM = 6;
const SNAPSHOT_EVERY = 2; // ticks: 10 snapshots per second

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.json': 'application/json', '.webmanifest': 'application/manifest+json' };

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://x');
  if (url.pathname === '/health') {
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ ok: true, rooms: rooms.size }));
    return;
  }
  let file = path.join(ROOT, path.normalize(decodeURIComponent(url.pathname)).replace(/^([/\\])+/, ''));
  if (!file.startsWith(ROOT)) { res.writeHead(403); res.end(); return; }
  if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) file = path.join(ROOT, 'index.html');
  if (!fs.existsSync(file)) { res.writeHead(404); res.end('Build the client first: npm run build'); return; }
  res.writeHead(200, { 'content-type': MIME[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});

const rooms = new Map(); // code -> { sim, clients: Map<id, ws>, tick }
let clientSeq = 0;

function makeCode() {
  const A = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let c;
  do c = Array.from({ length: 4 }, () => A[Math.floor(Math.random() * A.length)]).join('');
  while (rooms.has(c));
  return c;
}

function getRoom(code, create, arenaRadius) {
  if (code && rooms.has(code)) return rooms.get(code);
  if (!create) return null;
  const r = Math.min(6, Math.max(1, Number(arenaRadius) || 3));
  const room = { code: code || makeCode(), sim: new Sim({ arenaRadius: r }), clients: new Map(), tick: 0 };
  rooms.set(room.code, room);
  return room;
}

const wss = new WebSocketServer({ server, path: '/ws', maxPayload: 64 * 1024 });

wss.on('connection', (ws) => {
  const id = `p${++clientSeq}`;
  let room = null;
  ws.on('message', (data) => {
    let msg;
    try { msg = JSON.parse(data); } catch { return; }
    if (msg.t === 'hello') {
      if (room) return;
      const code = String(msg.room || '').toUpperCase().slice(0, 4);
      room = getRoom(code || null, !code || msg.create, msg.arena);
      if (!room) { ws.send(JSON.stringify({ t: 'error', text: `Room ${code} not found` })); return; }
      if (room.clients.size >= MAX_PER_ROOM) { ws.send(JSON.stringify({ t: 'error', text: 'Room is full' })); room = null; return; }
      room.clients.set(id, ws);
      room.sim.join(id, msg);
      ws.send(JSON.stringify({ t: 'welcome', id, room: room.code }));
      return;
    }
    if (!room) return;
    if (msg.t === 'save') { ws.send(JSON.stringify({ t: 'save', save: room.sim.saveOf(id) })); return; }
    room.sim.handle(id, msg);
  });
  ws.on('close', () => {
    if (!room) return;
    room.clients.delete(id);
    room.sim.leave(id);
    if (!room.clients.size) rooms.delete(room.code);
  });
});

setInterval(() => {
  for (const room of rooms.values()) {
    room.sim.step(1 / TICK_RATE);
    room.tick++;
    if (room.tick % SNAPSHOT_EVERY) continue;
    const events = room.sim.drainEvents();
    for (const [id, ws] of room.clients) {
      if (ws.readyState !== 1) continue;
      const snap = room.sim.snapshot(id, events);
      ws.send(JSON.stringify({ t: 'snap', s: snap }));
      if (room.tick % (TICK_RATE * 10) === 0) ws.send(JSON.stringify({ t: 'save', save: room.sim.saveOf(id) }));
    }
  }
}, 1000 / TICK_RATE);

server.listen(PORT, () => console.log(`Realmgate server on http://localhost:${PORT} (ws /ws)`));
