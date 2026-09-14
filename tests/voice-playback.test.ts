import test from 'node:test';
import assert from 'node:assert/strict';
import { VoicePlayback } from '../src/hooks/voice-playback.js';

function setup() {
  const starts: number[] = [], samples: Float32Array[] = [];
  let stopped = 0;
  const context = {
    currentTime: 0, destination: {},
    createBuffer(_channels: number, length: number, rate: number) {
      const data = new Float32Array(length); samples.push(data);
      return { duration: length / rate, getChannelData: () => data };
    },
    createBufferSource() { return { connect() {}, disconnect() {}, stop() { stopped++; }, start(at: number) { starts.push(at); } }; },
  };
  return { context, starts, samples, player: new VoicePlayback(context as any), stopped: () => stopped };
}
const chunk = () => Buffer.alloc(4800).toString('base64'); // 100ms, 24kHz PCM

test('bursty chunks remain contiguous across a 120ms network delay', () => {
  const { context, starts, player } = setup();
  player.begin('r1', true);
  player.append('r1', 'i1', chunk());
  context.currentTime = 0.12;
  player.append('r1', 'i1', chunk());
  context.currentTime = 0.25;
  player.append('r1', 'i1', chunk());
  assert.deepEqual(starts, [0.18, 0.28, 0.38]);
  assert.ok(player.remainingMs() > 220);
});

test('interruption truncates only heard samples, and late audio cannot restart the old turn', () => {
  const { context, player, starts, stopped } = setup();
  player.begin('r1', true); player.append('r1', 'i1', chunk());
  context.currentTime = 0.23;
  assert.deepEqual(player.interrupt(), { item_id: 'i1', content_index: 0, audio_end_ms: 50 });
  player.begin('r2', true);
  assert.equal(player.append('r1', 'i1', chunk()), false);
  assert.equal(player.append('r2', 'i2', chunk()), true);
  assert.equal(stopped(), 1);
  assert.equal(starts.length, 2);
});

test('interruption timing excludes silence when playback had to rebuffer', () => {
  const { context, player } = setup();
  player.begin('r1', true); player.append('r1', 'i1', chunk());
  context.currentTime = 0.5; player.append('r1', 'i1', chunk());
  context.currentTime = 0.73;
  const result = player.interrupt();
  assert.ok(result!.audio_end_ms >= 149 && result!.audio_end_ms <= 150);
});

test('suppresses the automatic startup response and preserves PCM samples split across packets', () => {
  const { player, starts, samples } = setup();
  player.begin('automatic', false);
  player.begin('greeting', true);
  assert.equal(player.append('automatic', 'old', chunk()), false);
  player.append('greeting', 'new', Buffer.from([0]).toString('base64'));
  player.append('greeting', 'new', Buffer.from([64, 0, 192]).toString('base64'));
  assert.equal(starts.length, 1);
  assert.deepEqual([...samples[0]], [0.5, -0.5]);
});
