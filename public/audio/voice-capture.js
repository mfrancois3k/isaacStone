class VoiceCapture extends AudioWorkletProcessor {
  constructor() { super(); this.buffer = new Int16Array(2048); this.offset = 0; }
  process(inputs) {
    const input = inputs[0]?.[0];
    if (input) for (const sample of input) {
      const clamped = Math.max(-1, Math.min(1, sample));
      this.buffer[this.offset++] = clamped < 0 ? clamped * 32768 : clamped * 32767;
      if (this.offset === this.buffer.length) {
        this.port.postMessage(this.buffer.buffer, [this.buffer.buffer]);
        this.buffer = new Int16Array(2048);
        this.offset = 0;
      }
    }
    return true;
  }
}
registerProcessor('voice-capture', VoiceCapture);
