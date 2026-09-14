/** Fast attack and slower release keep syllables distinct without twitching. */
export function followVoiceLevel(previous: number, sample: number, deltaMs: number) {
  const target = Number.isFinite(sample) ? Math.min(1, Math.max(0, sample)) : 0;
  const dt = Math.min(64, Math.max(0, deltaMs));
  const tau = target > previous ? 45 : 180;
  return previous + (target - previous) * (1 - Math.exp(-dt / tau));
}

export type MarbleVoiceState = 'idle' | 'connecting' | 'listening' | 'thinking' | 'speaking' | 'paused';

/**
 * Turns the smoothed audio meter into a distinct visual language for each
 * conversation state. Keeping this pure means the animation loop only writes
 * transform and opacity values, and makes the voice response easy to test.
 */
export function getMarbleVisual(state: MarbleVoiceState, sample: number) {
  const level = Number.isFinite(sample) ? Math.min(1, Math.max(0, sample)) : 0;
  if (state === 'paused') return { level: 0, energy: 0, scale: 1, lift: 0, tiltX: 0, tiltY: 0, glow: 0.08, halo: 0 };
  if (state === 'thinking' || state === 'connecting') return { level: 0, energy: 0.34, scale: 1.025, lift: -1, tiltX: 1.5, tiltY: -1.5, glow: 0.28, halo: 0.22 };
  if (state === 'listening') return { level, energy: 0.12 + level * 0.88, scale: 1.018 + level * 0.072, lift: -1 - level * 4, tiltX: level * 3, tiltY: -level * 4, glow: 0.28 + level * 0.62, halo: 0.16 + level * 0.54 };
  if (state === 'speaking') return { level, energy: 0.22 + level * 0.78, scale: 1.03 + level * 0.09, lift: -2 - level * 6, tiltX: -level * 4, tiltY: level * 5, glow: 0.38 + level * 0.62, halo: 0.26 + level * 0.64 };
  return { level: 0, energy: 0, scale: 1, lift: 0, tiltX: 0, tiltY: 0, glow: 0.13, halo: 0 };
}
