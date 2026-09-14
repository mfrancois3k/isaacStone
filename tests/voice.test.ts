import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import handler from '../api/voice-session.js';
import { createVoiceSession } from '../shared/voice-session.js';

test('token route rejects methods and foreign origins without contacting xAI', async () => {
  const original = globalThis.fetch;
  globalThis.fetch = async () => { throw new Error('Unexpected upstream call'); };
  try {
    for (const [method, origin, expected] of [['GET', 'https://example.test', 405], ['POST', 'https://foreign.test', 403], ['POST', undefined, 403]] as const) {
      let code = 0;
      const res = { setHeader() {}, status(status: number) { code = status; return this; }, json() { return this; } };
      await handler({ method, headers: { host: 'example.test', origin } } as any, res as any);
      assert.equal(code, expected);
    }
  } finally { globalThis.fetch = original; }
});

test('minting exposes only temporary credentials, bounds retries, and redacts upstream failures', async () => {
  const original = globalThis.fetch;
  const previousKey = process.env.XAI_API_KEY;
  const previousAgent = process.env.XAI_AGENT_ID;
  process.env.XAI_API_KEY = 'permanent-test-secret';
  process.env.XAI_AGENT_ID = 'agent_test';
  let calls = 0;
  globalThis.fetch = async (_url, init) => {
    calls++;
    assert.equal((init?.headers as Record<string, string>).Authorization, 'Bearer permanent-test-secret');
    assert.equal(JSON.parse(init?.body as string).expires_after.seconds, 60);
    return Response.json({ value: 'temporary-token', expires_at: 123 });
  };
  try {
    for (let i = 0; i < 5; i++) {
      const result = await createVoiceSession('test-limit');
      assert.equal(result.status, 200);
      assert.deepEqual(result.body, { token: 'temporary-token', expiresAt: 123, agentId: 'agent_test' });
      assert.ok(!JSON.stringify(result).includes('permanent-test-secret'));
    }
    assert.equal((await createVoiceSession('test-limit')).status, 429);
    assert.equal(calls, 5);
    globalThis.fetch = async () => Response.json({ error: 'permanent-test-secret' }, { status: 401 });
    const failure = await createVoiceSession('test-error');
    assert.equal(failure.status, 502);
    assert.ok(!JSON.stringify(failure).includes('permanent-test-secret'));
  } finally {
    globalThis.fetch = original;
    if (previousKey === undefined) delete process.env.XAI_API_KEY; else process.env.XAI_API_KEY = previousKey;
    if (previousAgent === undefined) delete process.env.XAI_AGENT_ID; else process.env.XAI_AGENT_ID = previousAgent;
  }
});

test('microphone worklet emits bounded signed PCM audio and tolerates empty input', () => {
  let Processor: any;
  const packets: ArrayBuffer[] = [];
  vm.runInNewContext(fs.readFileSync(new URL('../public/audio/voice-capture.js', import.meta.url), 'utf8'), {
    AudioWorkletProcessor: class { port = { postMessage(buffer: ArrayBuffer) { packets.push(buffer); } }; },
    Int16Array,
    registerProcessor(_name: string, ctor: any) { Processor = ctor; },
  });
  const capture = new Processor();
  assert.equal(capture.process([]), true);
  const input = new Float32Array(2048);
  input[0] = -2; input[1] = 2; input[2] = 0.5;
  capture.process([[input]]);
  assert.equal(packets.length, 1);
  assert.equal(packets[0].byteLength, 4096);
  assert.deepEqual([...new Int16Array(packets[0]).slice(0, 4)], [-32768, 32767, 16383, 0]);
});
