// Private homes over the real server: consent, host approval, and closing.
import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import WebSocket from 'ws';
import { HOME } from './fixtures.js';

const PORT = 18000 + Math.floor(Math.random() * 1000);

function client() {
  const ws = new WebSocket(`ws://localhost:${PORT}/ws`);
  const queue = []; const waiters = [];
  ws.on('message', (d) => {
    const m = JSON.parse(d);
    if (m.t === 'snap') return;
    const w = waiters.findIndex((x) => x.t === m.t);
    if (w >= 0) waiters.splice(w, 1)[0].resolve(m); else queue.push(m);
  });
  const next = (t) => {
    const i = queue.findIndex((m) => m.t === t);
    if (i >= 0) return Promise.resolve(queue.splice(i, 1)[0]);
    return new Promise((resolve, reject) => { waiters.push({ t, resolve }); setTimeout(() => reject(new Error(`no ${t}`)), 3000); });
  };
  return new Promise((r) => ws.on('open', () => r({ ws, next, send: (m) => ws.send(JSON.stringify(m)) })));
}

test('hosting a home needs consent; guests wait for the host; layout is sent only when allowed', async (t) => {
  const srv = spawn(process.execPath, ['server/server.js'], { env: { ...process.env, PORT: String(PORT) }, stdio: 'ignore' });
  t.after(() => srv.kill());
  await new Promise((r) => setTimeout(r, 600));

  const noConsent = await client();
  noConsent.send({ t: 'hello', name: 'H', cls: 'warrior', create: true, world: HOME });
  assert.match((await noConsent.next('error')).text, /consent/);

  const host = await client();
  host.send({ t: 'hello', name: 'Host', cls: 'warrior', create: true, world: HOME, shareConsent: true });
  const hw = await host.next('welcome');
  assert.equal(hw.host, true);

  const guest = await client();
  guest.send({ t: 'hello', name: 'Guest', cls: 'mage', room: hw.room });
  await guest.next('waiting');
  const knock = await host.next('knock');
  assert.equal(knock.name, 'Guest');
  host.send({ t: 'admit', id: knock.id, allow: true });
  const gw = await guest.next('welcome');
  assert.equal(gw.world.zones.length, 3);

  const rude = await client();
  rude.send({ t: 'hello', name: 'Rude', cls: 'mage', room: hw.room });
  await rude.next('waiting');
  const k2 = await host.next('knock');
  host.send({ t: 'admit', id: k2.id, allow: false });
  assert.match((await rude.next('error')).text, /no/);

  host.ws.close();
  assert.match((await guest.next('closed')).text, /closed/);
});
