/** Fast attack and slower release keep syllables distinct without twitching. */
export function followVoiceLevel(previous: number, sample: number, deltaMs: number) {
  const target = Number.isFinite(sample) ? Math.min(1, Math.max(0, sample)) : 0;
  const dt = Math.min(64, Math.max(0, deltaMs));
  const tau = target > previous ? 45 : 180;
  return previous + (target - previous) * (1 - Math.exp(-dt / tau));
}
