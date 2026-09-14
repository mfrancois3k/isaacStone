/** Schedule PCM on the audio clock, with enough lead for network/main-thread jitter. */
export class VoicePlayback {
  private sources = new Set<AudioBufferSourceNode>();
  private segments: Array<{ responseId: string; itemId: string; start: number; duration: number }> = [];
  private blocked = new Set<string>();
  private responseId?: string;
  private nextTime = 0;
  private pendingByte?: number;
  constructor(private context: AudioContext, private output: AudioNode = context.destination) {}

  begin(responseId: string, ready: boolean) {
    if (!ready) { this.blocked.add(responseId); return; }
    if (this.responseId !== responseId) this.pendingByte = undefined;
    this.responseId = responseId;
  }

  accepts(responseId: string) { return !this.blocked.has(responseId); }

  append(responseId: string, itemId: string, encoded: string) {
    if (!this.accepts(responseId)) return false;
    const raw = atob(encoded);
    const bytes = new Uint8Array(raw.length + (this.pendingByte === undefined ? 0 : 1));
    const offset = this.pendingByte === undefined ? 0 : 1;
    if (offset) bytes[0] = this.pendingByte!;
    for (let i = 0; i < raw.length; i++) bytes[i + offset] = raw.charCodeAt(i);
    this.pendingByte = bytes.length % 2 ? bytes[bytes.length - 1] : undefined;
    const length = Math.floor(bytes.length / 2);
    if (!length) return false;
    const view = new DataView(bytes.buffer);
    const buffer = this.context.createBuffer(1, length, 24000);
    const samples = buffer.getChannelData(0);
    for (let i = 0; i < length; i++) samples[i] = view.getInt16(i * 2, true) / 32768;
    const source = this.context.createBufferSource();
    source.buffer = buffer;
    source.connect(this.output);
    // Keep chunks contiguous while there is buffered audio. Rebuffer only on underrun.
    if (this.nextTime <= this.context.currentTime + 0.005) this.nextTime = this.context.currentTime + 0.18;
    const start = this.nextTime;
    this.nextTime += buffer.duration;
    this.segments.push({ responseId, itemId, start, duration: buffer.duration });
    this.sources.add(source);
    source.onended = () => { this.sources.delete(source); source.disconnect(); };
    source.start(start);
    return true;
  }

  remainingMs() { return Math.max(0, (this.nextTime - this.context.currentTime) * 1000); }

  interrupt() {
    if (this.responseId) this.blocked.add(this.responseId);
    for (const segment of this.segments) this.blocked.add(segment.responseId);
    const now = this.context.currentTime;
    const item = this.segments.find(segment => segment.start + segment.duration > now)?.itemId;
    // Count samples actually played, excluding the initial buffer and any network gaps.
    const played = item ? this.segments.filter(segment => segment.itemId === item)
      .reduce((sum, segment) => sum + Math.max(0, Math.min(segment.duration, now - segment.start)), 0) : 0;
    this.clear();
    return item ? { item_id: item, audio_end_ms: Math.floor(played * 1000), content_index: 0 } : undefined;
  }

  clear() {
    for (const source of this.sources) { try { source.stop(); } catch {} }
    this.sources.clear(); this.segments = []; this.pendingByte = undefined;
    this.nextTime = this.context.currentTime;
  }
}
