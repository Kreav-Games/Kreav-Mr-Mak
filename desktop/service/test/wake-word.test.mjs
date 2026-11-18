// Wake phrase rules for Talk mode (src/lib/wake.ts), checked with Node's type stripping.
import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const source = fileURLToPath(new URL('../../../src/lib/wake.ts', import.meta.url));
const run = cases => JSON.parse(execFileSync(process.execPath, ['--experimental-strip-types', '--no-warnings', '--input-type=module', '-e',
  `const { detectWake, isGoodbye } = await import(${JSON.stringify(source)}); console.log(JSON.stringify(${JSON.stringify(cases)}.map(([kind, text]) => kind === 'bye' ? isGoodbye(text) : detectWake(text))))`], { encoding: 'utf8' }));

test('wake phrase starts a request and keeps the command', () => {
  const [a, b, c, d, e, f, g, h] = run([
    ['wake', 'Hey Jarvis, open the dream game chat.'], ['wake', 'Hey Jarvis.'], ['wake', 'Jarvis what time is it'],
    ['wake', 'Okay so, hey Jarvis, check the build'], ['wake', 'Hey Travis, read my cards'],
    ['wake', 'I watched Iron Man and Jarvis was great'], ['wake', 'Travis is coming over'], ['wake', 'Hey Javis stop'],
  ]);
  assert.deepEqual(a, { woke: true, command: 'open the dream game chat.' });
  assert.deepEqual(b, { woke: true, command: '' });
  assert.deepEqual(c, { woke: true, command: 'what time is it' });
  assert.deepEqual(d, { woke: true, command: 'check the build' });
  assert.deepEqual(e, { woke: true, command: 'read my cards' });
  assert.equal(f.woke, false); assert.equal(g.woke, false);
  assert.deepEqual(h, { woke: true, command: 'stop' });
});

test('goodbyes put Jarvis to sleep', () => {
  assert.deepEqual(run([['bye', "That's all, Jarvis."], ['bye', 'Goodbye'], ['bye', 'Stand by.'], ['bye', 'Thanks, that is all for the game'], ['bye', 'Go to sleep, Jarvis.'], ['bye', 'Go to sleep now'], ['bye', 'Okay, you can go back to sleep.'], ['bye', 'How did you sleep?']]), [true, true, true, false, true, true, true, false]);
  // "Jarvis, go to sleep" loses its name to wake detection first, then is a goodbye.
  assert.deepEqual(run([['wake', 'Jarvis, go to sleep.']]), [{ woke: true, command: 'go to sleep.' }]);
});
