import { useCallback, useEffect, useRef, useState } from 'react';
import { VoicePlayback } from './voice-playback';

type VoiceState = 'idle' | 'connecting' | 'listening' | 'thinking' | 'speaking';
type Transcript = (id: string, sender: 'user' | 'bot', text: string) => void;
interface Call {
  cancelled: boolean;
  ready: boolean;
  socket?: WebSocket;
  stream?: MediaStream;
  context?: AudioContext;
  capture?: AudioWorkletNode;
  source?: MediaStreamAudioSourceNode;
  timer?: ReturnType<typeof setTimeout>;
  timeout?: ReturnType<typeof setTimeout>;
  playbackTimer?: ReturnType<typeof setTimeout>;
  playback?: VoicePlayback;
  inputMeter?: AnalyserNode;
  outputMeter?: AnalyserNode;
}

export function useVoiceAgent(onTranscript: Transcript) {
  const [state, setState] = useState<VoiceState>('idle');
  const [error, setError] = useState('');
  const [muted, setMuted] = useState(false);
  const [supported, setSupported] = useState(true);
  const callRef = useRef<Call | null>(null);
  const callback = useRef(onTranscript);
  callback.current = onTranscript;
  const mutedRef = useRef(false);

  const stop = useCallback(() => {
    const call = callRef.current;
    callRef.current = null;
    if (call) {
      call.cancelled = true;
      clearTimeout(call.timer); clearTimeout(call.timeout); clearTimeout(call.playbackTimer);
      call.stream?.getTracks().forEach(track => track.stop());
      call.capture?.disconnect(); call.source?.disconnect();
      call.playback?.clear();
      call.socket?.close();
      void call.context?.close().catch(() => {});
    }
    setState('idle');
    setMuted(false); mutedRef.current = false;
  }, []);

  useEffect(() => {
    setSupported(Boolean(navigator.mediaDevices?.getUserMedia && window.AudioContext && window.AudioWorkletNode));
    return stop;
  }, [stop]);

  const start = useCallback(async () => {
    if (callRef.current) return;
    const call: Call = { cancelled: false, ready: false };
    callRef.current = call;
    setError(''); setState('connecting');
    const fail = (message: string) => {
      if (callRef.current !== call) return;
      stop(); setError(message);
    };
    const send = (event: object) => {
      if (call.socket?.readyState === WebSocket.OPEN) call.socket.send(JSON.stringify(event));
    };
    call.timeout = setTimeout(() => fail('Microphone access is still pending. Allow the microphone in your browser, then try again.'), 30_000);
    try {
      // Request audio only from this explicit click; closing cancels every pending step.
      const context = new AudioContext({ sampleRate: 24000 });
      call.context = context;
      call.outputMeter = context.createAnalyser();
      call.outputMeter.fftSize = 256;
      call.outputMeter.connect(context.destination);
      call.playback = new VoicePlayback(context, call.outputMeter);
      await context.resume();
      if (call.cancelled) return;
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true, channelCount: 1 }, video: false });
      if (call.cancelled) { stream.getTracks().forEach(track => track.stop()); return; }
      call.stream = stream;
      await context.audioWorklet.addModule('/audio/voice-capture.js');
      if (call.cancelled) return;
      const response = await fetch('/api/voice-session', { method: 'POST', signal: AbortSignal.timeout(15_000) });
      const data = await response.json();
      if (call.cancelled) return;
      if (!response.ok) throw new Error(data.error || 'Voice could not connect. Please try again.');
      const socket = new WebSocket(`wss://api.x.ai/v1/realtime?agent_id=${encodeURIComponent(data.agentId)}`, [`xai-client-secret.${data.token}`]);
      call.socket = socket;
      clearTimeout(call.timeout);
      call.timeout = setTimeout(() => fail('Voice took too long to connect. Please try again.'), 15_000);
      const transcripts = new Map<string, string>();
      let configured = false;
      const playback = call.playback;
      socket.onmessage = ({ data: raw }) => {
        if (call.cancelled) return;
        let event: any;
        try { event = JSON.parse(raw); } catch { return; }
        if (event.type === 'session.updated') {
          // Keep the saved agent's voice/tools; configure browser audio and turn-taking.
          if (!configured) {
            configured = true;
            send({ type: 'session.update', session: {
              // End a normal turn promptly; keep the louder activation threshold for speakers.
              turn_detection: { type: 'server_vad', silence_duration_ms: 500, threshold: 0.85 },
              audio: { input: { format: { type: 'audio/pcm', rate: context.sampleRate } }, output: { format: { type: 'audio/pcm', rate: 24000 } } },
            } });
          } else if (!call.ready && event.session?.audio?.input?.format) {
            call.ready = true;
            clearTimeout(call.timeout);
            call.source = context.createMediaStreamSource(stream);
            call.inputMeter = context.createAnalyser();
            call.inputMeter.fftSize = 256;
            call.source.connect(call.inputMeter);
            call.capture = new AudioWorkletNode(context, 'voice-capture');
            call.capture.port.onmessage = ({ data: buffer }: MessageEvent<ArrayBuffer>) => {
              if (call.cancelled || mutedRef.current || socket.readyState !== WebSocket.OPEN) return;
              if (socket.bufferedAmount > 256_000) { fail('The connection is too slow for voice. Please reconnect or type below.'); return; }
              const bytes = new Uint8Array(buffer);
              let binary = '';
              for (const byte of bytes) binary += String.fromCharCode(byte);
              send({ type: 'input_audio_buffer.append', audio: btoa(binary) });
            };
            call.source.connect(call.capture);
            call.capture.connect(context.destination);
            setState('listening');
            send({ type: 'response.create' });
            // A bounded prototype call also releases the microphone if a tab is forgotten.
            call.timer = setTimeout(() => { fail('This voice session has ended after five minutes. Tap to start a new conversation.'); }, 5 * 60_000);
          }
        }
        if (event.type === 'input_audio_buffer.speech_started') {
          clearTimeout(call.playbackTimer);
          const truncated = playback.interrupt();
          if (truncated) send({ type: 'conversation.item.truncate', ...truncated });
          setState('listening');
        }
        if (event.type === 'input_audio_buffer.speech_stopped') setState('thinking');
        if (event.type === 'conversation.item.input_audio_transcription.completed' && event.transcript) callback.current(`voice-user-${event.item_id}`, 'user', event.transcript);
        if (event.type === 'response.created') { clearTimeout(call.playbackTimer); playback.begin(event.response.id, call.ready); }
        if (event.type === 'response.output_audio_transcript.delta' && playback.accepts(event.response_id)) {
          const id = `voice-bot-${event.item_id || event.response_id}`;
          const text = (transcripts.get(id) || '') + event.delta;
          transcripts.set(id, text); callback.current(id, 'bot', text);
        }
        if (event.type === 'response.output_audio.delta') {
          if (playback.append(event.response_id, event.item_id, event.delta)) setState('speaking');
        }
        if (event.type === 'response.done' && playback.accepts(event.response?.id)) {
          if (event.response?.status === 'failed') { fail('Voice could not answer. Please reconnect or type below.'); return; }
          clearTimeout(call.playbackTimer);
          call.playbackTimer = setTimeout(() => { if (!call.cancelled) setState('listening'); }, playback.remainingMs());
        }
        if (event.type === 'response.function_call_arguments.done' && event.name === 'end_call') {
          clearTimeout(call.timer);
          call.timer = setTimeout(stop, playback.remainingMs() + 250);
        }
        if (event.type === 'error') fail('Voice ran into a problem. Please reconnect or type below.');
      };
      socket.onerror = () => fail('Voice could not connect. Please try again or type below.');
      socket.onclose = () => { if (!call.cancelled) fail('Voice disconnected. Tap to reconnect, or type below.'); };
    } catch (cause) {
      if (call.cancelled) return;
      const denied = cause instanceof DOMException && ['NotAllowedError', 'PermissionDeniedError'].includes(cause.name);
      fail(denied ? 'Microphone access was declined. Allow it to talk, or type below.' : cause instanceof Error ? cause.message : 'Voice could not start. Please type below.');
    }
  }, [stop]);

  const toggleMute = useCallback(() => {
    mutedRef.current = !mutedRef.current;
    callRef.current?.stream?.getAudioTracks().forEach(track => { track.enabled = !mutedRef.current; });
    setMuted(mutedRef.current);
  }, []);
  const sendText = useCallback((text: string) => {
    const call = callRef.current;
    if (!call?.ready || call.socket?.readyState !== WebSocket.OPEN) return false;
    call.socket.send(JSON.stringify({ type: 'conversation.item.create', item: { type: 'message', role: 'user', content: [{ type: 'input_text', text }] } }));
    call.socket.send(JSON.stringify({ type: 'response.create' }));
    callback.current(`voice-user-${crypto.randomUUID()}`, 'user', text);
    setState('thinking');
    return true;
  }, []);
  const meterSamples = useRef(new Float32Array(256));
  const getAudioLevel = useCallback((output: boolean) => {
    const meter = output ? callRef.current?.outputMeter : callRef.current?.inputMeter;
    if (!meter || (!output && mutedRef.current)) return 0;
    meter.getFloatTimeDomainData(meterSamples.current);
    return Math.min(1, Math.sqrt(meterSamples.current.reduce((sum, value) => sum + value * value, 0) / 256) * 5);
  }, []);
  return { state, error, muted, supported, start, stop, toggleMute, sendText, getAudioLevel, active: state !== 'idle' };
}
