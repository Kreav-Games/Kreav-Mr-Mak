import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { PassThrough } from 'node:stream';
import path from 'node:path';
import os from 'node:os';
import { ClaudeCoordinator, extraTools } from '../claude-coordinator.mjs';
import { coordinatorTools } from '../coordinator.mjs';

const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jvWQAAAAASUVORK5CYII=', 'base64');

async function fixture(reply = () => 'Done, sir.') {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'mrmak-claude-coordinator-'));
  const calls = [], sent = [];
  const coordinator = await new ClaudeCoordinator({ repo: dir, stateDir: dir, memoryFile: path.join(dir, 'memory.md'), context: () => ({ chats: [] }),
    execute: async (name, args) => { calls.push({ name, args }); return { ok: true }; } }).init();
  // A fake Claude Code process: every stream-json user message gets a result.
  coordinator.startInternal = async () => {
    await coordinator.startToolServer();
    const stdin = new PassThrough();
    stdin.on('data', chunk => {
      for (const line of String(chunk).split('\n').filter(Boolean)) {
        const message = JSON.parse(line); sent.push(message);
        setImmediate(async () => coordinator.message({ type: 'result', subtype: 'success', result: await reply(message, coordinator) }));
      }
    });
    coordinator.child = { stdin, kill() {} };
  };
  return { dir, coordinator, calls, sent };
}

test('Claude coordinator sends text and images as stream-json and never replays a completed operation', async () => {
  const { dir, coordinator, sent } = await fixture();
  try {
    const image = path.join(dir, 'Reference.png'); await writeFile(image, png);
    const result = await coordinator.ask({ id: 'one', text: 'Look at this', images: [image] });
    assert.equal(result.status, 'completed'); assert.equal(result.result, 'Done, sir.');
    assert.equal(sent.length, 1);
    const [text, picture] = sent[0].message.content;
    assert.ok(text.text.includes('LATEST USER REQUEST:\nLook at this'));
    assert.deepEqual(picture, { type: 'image', source: { type: 'base64', media_type: 'image/png', data: png.toString('base64') } });
    await coordinator.ask({ id: 'one', text: 'Again' });
    assert.equal(sent.length, 1);
  } finally { coordinator.close(); }
});

test('Claude coordinator tool endpoint requires its token and an active request', async () => {
  let endpoint;
  const { coordinator, calls } = await fixture(async () => {
    const call = (token, name = 'list_chats') => fetch(endpoint, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify({ name, args: {} }) });
    assert.equal((await call('wrong')).status, 401);
    assert.equal((await call(coordinator.token, 'run_shell')).status, 404);
    const value = await (await call(coordinator.token)).json();
    assert.deepEqual(value, { result: { ok: true } });
    return 'Listed.';
  });
  try {
    await coordinator.startToolServer();
    endpoint = `http://127.0.0.1:${coordinator.toolServer.address().port}/`;
    const idle = await fetch(endpoint, { method: 'POST', headers: { Authorization: `Bearer ${coordinator.token}` }, body: JSON.stringify({ name: 'list_chats', args: {} }) });
    assert.equal(idle.status, 409);
    assert.equal((await coordinator.ask({ id: 'tools', text: 'List chats' })).result, 'Listed.');
    assert.deepEqual(calls.map(item => item.name), ['list_chats']);
  } finally { coordinator.close(); }
});

test('Claude coordinator remembers facts without secrets or duplicates', async () => {
  const { dir, coordinator } = await fixture();
  assert.deepEqual(await coordinator.execute('remember', { fact: 'The user likes the Lewis voice.' }), { saved: true, fact: 'The user likes the Lewis voice.' });
  assert.equal((await coordinator.execute('remember', { fact: 'The user likes the Lewis voice.' })).saved, false);
  await assert.rejects(coordinator.execute('remember', { fact: 'API key: abc123' }));
  assert.match(await readFile(path.join(dir, 'memory.md'), 'utf8'), /^- The user likes the Lewis voice\.$/m);
  assert.match((await coordinator.execute('recall')).memory, /Lewis/);
  assert.ok(extraTools.every(tool => !coordinatorTools.some(item => item.name === tool.name)));
});
