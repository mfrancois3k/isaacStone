import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  X, 
  Send, 
  Sparkles, 
  Phone, 
  Layers, 
  CheckCircle2, 
  RotateCcw,
  Headphones,
  Maximize2,
  Minimize2,
  AlertCircle
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

const SUGGESTED_PROMPTS = [
  "What is your 50% mobilization deposit policy?",
  "How much to install a 10ft marble waterfall island?",
  "Do you work with Calacatta Viola & Quartzite?",
  "What towns in Long Island do you service?",
  "How do I schedule on-site laser templating?"
];

export const VoiceChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'bot',
      text: "Greetings. I am the Isaac Stone & Tile AI voice consultant. Speak into your microphone or type below to inquire about Italian marble, diamond miters, or our 50% mobilization deposit schedule.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Initialize Speech Recognition & Synthesis
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          setIsListening(true);
        };

        recognition.onresult = (event: any) => {
          const current = event.resultIndex;
          const transcript = event.results[current][0].transcript;
          setInputText(transcript);
          if (event.results[current].isFinal) {
            handleSendMessage(transcript);
            setIsListening(false);
          }
        };

        recognition.onerror = (event: any) => {
          console.warn("Speech recognition error:", event.error);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      } else {
        setSpeechSupported(false);
      }

      if ('speechSynthesis' in window) {
        synthRef.current = window.speechSynthesis;
      }
    }

    // Event listener to open voice assistant from navbar or hero
    const handleOpenExternal = () => {
      setIsOpen(true);
    };
    window.addEventListener('open-voice-bot', handleOpenExternal);

    return () => {
      window.removeEventListener('open-voice-bot', handleOpenExternal);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  // Auto-scroll messages to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Text-To-Speech Output Function
  const speakText = (text: string) => {
    if (isMuted || !synthRef.current) return;

    try {
      synthRef.current.cancel(); // Stop any previous speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 0.98;

      // Prefer high-quality natural English voice if available
      const voices = synthRef.current.getVoices();
      const naturalVoice = voices.find(v => 
        (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Daniel') || v.name.includes('Guy')) && v.lang.startsWith('en')
      );
      if (naturalVoice) {
        utterance.voice = naturalVoice;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      synthRef.current.speak(utterance);
    } catch (e) {
      console.warn("Speech synthesis error:", e);
      setIsSpeaking(false);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      // Stop speech if speaking
      if (synthRef.current) {
        synthRef.current.cancel();
        setIsSpeaking(false);
      }
      try {
        recognitionRef.current?.start();
      } catch (err) {
        console.warn("Could not start recognition:", err);
      }
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const messageContent = (textToSend || inputText).trim();
    if (!messageContent || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: messageContent,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/voice-consultant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageContent,
          conversationHistory: messages.slice(-5)
        })
      });

      const data = await response.json();
      const botReply = data.reply || "Thank you for inquiring. You can reach our master mason directly at (631) 530-5883.";

      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: botReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMessage]);
      speakText(botReply);
    } catch (err) {
      console.error("Consultant API call failed:", err);
      const fallbackReply = "Our master mason is available directly at (631) 530-5883 to discuss your stone and tile specifications. All projects require a standard 50% mobilization deposit.";
      setMessages(prev => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: fallbackReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      speakText(fallbackReply);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Activation Pill / Trigger Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <motion.button
          onClick={() => setIsOpen(true)}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className={`flex items-center gap-3 px-4 py-3 bg-white text-[#0F172A] border-2 border-[#0F172A] shadow-xl hover:shadow-2xl transition-all duration-200 group font-mono ${
            isOpen ? 'hidden' : 'flex'
          }`}
          aria-label="Open Voice Consultant"
        >
          <div className="relative flex items-center justify-center w-8 h-8 bg-[#DC2626] text-white">
            <Mic className="w-4 h-4 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full" />
          </div>

          <div className="flex flex-col text-left">
            <span className="text-[10px] text-[#DC2626] font-bold uppercase tracking-wider">
              [ AI VOICE DISPATCH ]
            </span>
            <span className="text-xs font-black uppercase text-[#0F172A] tracking-tight flex items-center gap-1.5">
              CONSULTANT ONLINE
              <span className="inline-block w-1.5 h-1.5 bg-[#DC2626] rounded-full animate-ping" />
            </span>
          </div>
        </motion.button>
      </div>

      {/* Voice Consultant Modal / Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-[calc(100vw-32px)] sm:w-[440px] max-h-[85vh] h-[620px] bg-white border-2 border-[#0F172A] shadow-2xl z-50 flex flex-col font-mono overflow-hidden text-[#0F172A]"
          >
            {/* Header */}
            <div className="bg-[#0F172A] text-white p-4 flex items-center justify-between border-b border-white/10 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 bg-[#DC2626] flex items-center justify-center text-white font-bold text-xs">
                  <Mic className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[9px] text-[#DC2626] font-bold tracking-widest uppercase">
                    GEMINI 3.8 &bull; FIELD INTELLIGENCE
                  </div>
                  <h3 className="text-sm font-black tracking-tight uppercase flex items-center gap-2">
                    STONE &amp; TILE VOICE AGENT
                    {isSpeaking && (
                      <span className="text-[10px] px-1.5 py-0.2 bg-[#DC2626] text-white animate-pulse">
                        SPEAKING
                      </span>
                    )}
                    {isListening && (
                      <span className="text-[10px] px-1.5 py-0.2 bg-green-500 text-white animate-pulse">
                        LISTENING
                      </span>
                    )}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {/* Audio Mute/Unmute */}
                <button
                  onClick={() => {
                    if (synthRef.current) synthRef.current.cancel();
                    setIsSpeaking(false);
                    setIsMuted(!isMuted);
                  }}
                  className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                  title={isMuted ? "Unmute Voice" : "Mute Voice"}
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-[#DC2626]" /> : <Volume2 className="w-4 h-4 text-green-400" />}
                </button>

                {/* Close */}
                <button
                  onClick={() => {
                    if (synthRef.current) synthRef.current.cancel();
                    if (recognitionRef.current) recognitionRef.current.abort();
                    setIsSpeaking(false);
                    setIsListening(false);
                    setIsOpen(false);
                  }}
                  className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                  title="Close Voice Assistant"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Active Voice Visualization Banner */}
            <div className="bg-[#F8F9FA] border-b border-[#E2E8F0] p-3 flex items-center justify-between text-xs shrink-0">
              <div className="flex items-center gap-3">
                <div className="flex items-end gap-1 h-5">
                  {[40, 75, 100, 60, 85, 45, 95, 30].map((h, i) => (
                    <motion.span
                      key={i}
                      animate={
                        isSpeaking
                          ? { height: ['20%', `${h}%`, '30%'] }
                          : isListening
                          ? { height: ['15%', `${h * 0.7}%`, '20%'] }
                          : { height: '20%' }
                      }
                      transition={{
                        repeat: Infinity,
                        duration: 0.6 + (i % 3) * 0.2,
                        ease: 'easeInOut',
                      }}
                      className={`w-1 rounded-full ${
                        isSpeaking
                          ? 'bg-[#DC2626]'
                          : isListening
                          ? 'bg-green-600'
                          : 'bg-[#CBD5E1]'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[11px] font-bold text-[#475569] uppercase">
                  {isSpeaking
                    ? "VOCALIZING RESPONSE..."
                    : isListening
                    ? "LISTENING TO MICROPHONE..."
                    : "TAP MIC OR SELECT PROMPT"}
                </span>
              </div>

              <a
                href="tel:6315305883"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#0F172A] text-white text-[10px] font-bold uppercase hover:bg-[#DC2626] transition-colors"
              >
                <Phone className="w-2.5 h-2.5" />
                <span>(631) 530-5883</span>
              </a>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FFFFFF]">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3.5 border ${
                      msg.sender === 'user'
                        ? 'bg-[#0F172A] text-white border-[#0F172A]'
                        : 'bg-[#F8F9FA] text-[#0F172A] border-[#E2E8F0]'
                    }`}
                  >
                    <div className="text-[9px] font-bold uppercase tracking-wider mb-1 flex items-center justify-between gap-4 opacity-70">
                      <span>{msg.sender === 'user' ? 'CLIENT SPECIFICATION' : 'ISAAC STONE AGENT'}</span>
                      <span>{msg.timestamp}</span>
                    </div>
                    <p className="text-xs sm:text-sm font-sans leading-relaxed">
                      {msg.text}
                    </p>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex flex-col items-start">
                  <div className="max-w-[85%] p-3.5 bg-[#F8F9FA] border border-[#E2E8F0]">
                    <div className="flex items-center gap-2 text-xs text-[#DC2626] font-bold">
                      <span className="w-2 h-2 bg-[#DC2626] rounded-full animate-ping" />
                      <span>ANALYZING MASONRY DATABASE...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Prompts Carousel */}
            <div className="p-2.5 bg-[#F8F9FA] border-t border-[#E2E8F0] overflow-x-auto whitespace-nowrap scrollbar-none flex gap-2 shrink-0">
              {SUGGESTED_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInputText(prompt);
                    handleSendMessage(prompt);
                  }}
                  className="px-2.5 py-1 text-[10px] bg-white border border-[#CBD5E1] text-[#334155] hover:border-[#DC2626] hover:text-[#DC2626] transition-colors shrink-0 font-sans"
                >
                  &rarr; {prompt}
                </button>
              ))}
            </div>

            {/* Bottom Input Controls */}
            <div className="p-3 bg-white border-t-2 border-[#0F172A] flex items-center gap-2 shrink-0">
              {/* Mic Toggle Button */}
              {speechSupported ? (
                <button
                  onClick={toggleListening}
                  className={`w-11 h-11 shrink-0 flex items-center justify-center border-2 transition-all duration-150 ${
                    isListening
                      ? 'bg-green-600 text-white border-green-700 animate-pulse'
                      : 'bg-[#DC2626] text-white border-[#DC2626] hover:bg-[#B91C1C]'
                  }`}
                  title={isListening ? "Stop Listening" : "Start Voice Input"}
                >
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
              ) : (
                <button
                  disabled
                  className="w-11 h-11 shrink-0 flex items-center justify-center border-2 bg-gray-200 text-gray-400 border-gray-300"
                  title="Speech not supported in browser"
                >
                  <MicOff className="w-5 h-5" />
                </button>
              )}

              {/* Text Input */}
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSendMessage();
                  }}
                  placeholder={isListening ? "Listening to your voice..." : "Type or speak your masonry question..."}
                  className="w-full h-11 px-3 bg-[#F8F9FA] border border-[#CBD5E1] text-xs text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#DC2626] font-sans"
                />
              </div>

              {/* Send Button */}
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputText.trim() || isLoading}
                className="w-11 h-11 shrink-0 bg-[#0F172A] text-white flex items-center justify-center hover:bg-[#DC2626] transition-colors disabled:opacity-40 disabled:hover:bg-[#0F172A]"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
