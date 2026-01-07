
import React, { useState, useEffect, useRef } from 'react';
import { Mic, X, Loader2, Volume2, MicOff, ShoppingCart, CheckCircle2, Plus, ListChecks, MessageCircle, Sparkles, ShieldAlert, Play, RotateCcw } from 'lucide-react';

interface Props {
  onClose: () => void;
  onFinalize: (items: any[], intent: string) => void;
  onProcess: (transcript: string) => Promise<{ message: string; items?: any[]; intent?: string; payment_mode?: string }>;
  lang: 'en' | 'hi';
  isProcurementMode?: boolean;
}

const VoiceAssistant: React.FC<Props> = ({ onClose, onFinalize, onProcess, lang, isProcurementMode }) => {
  const [isListening, setIsListening] = useState(false);
  const [displayTranscript, setDisplayTranscript] = useState("");
  const [status, setStatus] = useState<'idle' | 'listening' | 'processing' | 'waiting' | 'permission_denied'>('idle');
  const [sessionItems, setSessionItems] = useState<any[]>([]);
  const [lastIntent, setLastIntent] = useState<string>('record_sale');
  const [aiResponse, setAiResponse] = useState("");
  
  const transcriptRef = useRef("");
  const recognitionRef = useRef<any>(null);
  const speechDetectedRef = useRef(false);

  const t = {
    en: { 
      title: "Voice Assistant", 
      listening: "Listening...", 
      processing: "Processing...", 
      tapToStart: "Tap to Speak", 
      done: "Finalize Sale", 
      list: "Bill Details",
      permError: "Microphone Blocked",
      permSub: "Ensure no other apps are using the mic and permissions are granted.",
      retry: "Retry"
    },
    hi: { 
      title: "वॉयस असिस्टेंट", 
      listening: "सुन रहा हूँ...", 
      processing: "चेक कर रहा हूँ...", 
      tapToStart: "बोलने के लिए दबाएं", 
      done: "बिल पक्का करें", 
      list: "बिल का विवरण",
      permError: "माइक्रोफोन बंद है",
      permSub: "कृपया चेक करें कि कोई और एप माइक तो नहीं इस्तेमाल कर रहा।",
      retry: "फिर कोशिश करें"
    }
  }[lang];

  const speak = (text: string, onEnd?: () => void) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'en' ? 'en-IN' : 'hi-IN';
    utterance.rate = 1.0;
    if (onEnd) utterance.onend = onEnd;
    window.speechSynthesis.speak(utterance);
    return utterance;
  };

  const initRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return null;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = lang === 'en' ? 'en-IN' : 'hi-IN';

    recognition.onstart = () => {
      speechDetectedRef.current = false;
    };

    recognition.onresult = (event: any) => {
      speechDetectedRef.current = true;
      const text = Array.from(event.results).map((r: any) => r[0].transcript).join('');
      transcriptRef.current = text;
      setDisplayTranscript(text);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      
      // If we already detected speech and it's ending, don't show the error screen
      if (speechDetectedRef.current && (event.error === 'no-speech' || event.error === 'aborted')) {
        return;
      }

      if (event.error === 'not-allowed') {
        // Only show permission denied if we haven't actually successfully recorded anything this session
        if (!speechDetectedRef.current) {
          setStatus('permission_denied');
        }
      }
      setIsListening(false);
    };

    recognition.onend = async () => {
      setIsListening(false);
      const finalTranscript = transcriptRef.current.trim();
      
      if (finalTranscript.length > 1) {
        setStatus('processing');
        try {
          const result = await onProcess(finalTranscript);
          
          if (result.intent === 'finalize_sale') {
            setAiResponse(result.message);
            speak(result.message, () => {
              handleFinalize();
            });
            return;
          }

          if (result.items && result.items.length > 0) {
            setSessionItems(prev => [...prev, ...result.items!]);
            if (result.intent) setLastIntent(result.intent);
          }
          
          setAiResponse(result.message);
          setStatus('waiting');
          speak(result.message);
        } catch (error) {
          console.error("AI Error:", error);
          setStatus('idle');
        }
      } else {
        // Don't switch to permission_denied if it was just no-speech
        if (status !== 'permission_denied') setStatus('idle');
      }
    };

    return recognition;
  };

  const startListening = () => {
    // Clear any active synthesis to avoid mic conflicts
    window.speechSynthesis.cancel();
    
    if (isListening) return;
    
    transcriptRef.current = "";
    setDisplayTranscript("");
    speechDetectedRef.current = false;
    setStatus('listening');
    
    if (!recognitionRef.current) {
      recognitionRef.current = initRecognition();
    }

    try {
      recognitionRef.current?.start();
      setIsListening(true);
    } catch (e) {
      console.warn("Recognition start failed:", e);
      // If it fails to start, usually it means a previous instance is hanging
      recognitionRef.current?.stop();
      setTimeout(() => {
        try {
           recognitionRef.current?.start();
           setIsListening(true);
        } catch(retryErr) {
           setStatus('permission_denied');
        }
      }, 300);
    }
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  useEffect(() => {
    // Attempt auto-start greeting on mount if it's a new session
    const greeting = lang === 'hi' ? "Namaste! Kya becha hai?" : "Namaste! What have you sold?";
    speak(greeting);

    return () => {
      recognitionRef.current?.stop();
      window.speechSynthesis.cancel();
    };
  }, []);

  const handleFinalize = () => {
    onFinalize(sessionItems, lastIntent);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[110] flex items-end justify-center">
      <div className="bg-white w-full max-w-screen-md rounded-t-[48px] p-8 flex flex-col max-h-[90vh] shadow-[0_-20px_80px_rgba(0,0,0,0.2)] animate-in slide-in-from-bottom duration-500">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${isListening ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`}></div>
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{t.title}</h2>
          </div>
          <button onClick={onClose} className="bg-slate-100 p-3 rounded-full text-slate-500 hover:bg-slate-200 active:scale-90 transition-all">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-6 px-1 custom-scrollbar min-h-[300px] flex flex-col">
          {status === 'permission_denied' ? (
            <div className="flex-1 flex flex-col items-center justify-center space-y-6 py-12 text-center animate-in shake duration-500">
               <div className="bg-red-50 p-8 rounded-[40px] text-red-500">
                  <ShieldAlert size={64} />
               </div>
               <div className="space-y-2">
                  <h3 className="text-xl font-black text-slate-900">{t.permError}</h3>
                  <p className="text-sm text-slate-500 font-bold px-8 leading-relaxed">{t.permSub}</p>
               </div>
               <button 
                 onClick={() => { setStatus('idle'); startListening(); }}
                 className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2"
               >
                 <RotateCcw size={16} /> {t.retry}
               </button>
            </div>
          ) : (
            <>
              {sessionItems.length > 0 && (
                <div className="animate-in fade-in slide-in-from-top-4">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <ListChecks size={14} className="text-indigo-600" />
                    {t.list}
                  </h3>
                  <div className="bg-slate-50 rounded-[32px] border-2 border-slate-100 divide-y-2 divide-slate-100 overflow-hidden shadow-sm">
                    {sessionItems.map((item, idx) => (
                      <div key={idx} className="p-5 flex justify-between items-center bg-white hover:bg-slate-50 transition-colors animate-in slide-in-from-right">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-sm">
                            {item.qty || 1}
                          </div>
                          <div>
                            <p className="font-black text-slate-900 capitalize text-lg leading-tight">{item.product}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">{item.unit || 'units'}</p>
                          </div>
                        </div>
                        {item.price && <span className="font-black text-slate-900 text-lg">₹{item.price * (item.qty || 1)}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
                {status === 'listening' ? (
                  <div className="space-y-8 w-full">
                    <div className="flex justify-center gap-3 h-16 items-center">
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                        <div key={i} className="w-2 bg-indigo-500 rounded-full animate-bounce" style={{ height: `${30 + Math.random() * 70}%`, animationDelay: `${i * 0.08}s` }}></div>
                      ))}
                    </div>
                    <div className="px-6">
                      <p className="text-3xl font-black text-slate-900 italic leading-tight tracking-tight">
                        {displayTranscript ? `"${displayTranscript}"` : t.listening}
                      </p>
                    </div>
                  </div>
                ) : status === 'processing' ? (
                  <div className="flex flex-col items-center gap-6">
                    <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                    <p className="text-sm font-black text-slate-900 tracking-[0.2em] uppercase">{t.processing}</p>
                  </div>
                ) : aiResponse && (
                  <div className="bg-slate-900 p-8 rounded-[40px] inline-flex items-start gap-5 text-left shadow-2xl shadow-indigo-100 mx-4 animate-in zoom-in-95">
                    <div className="bg-indigo-600 p-3 rounded-2xl shrink-0">
                      <MessageCircle className="text-white" size={24} />
                    </div>
                    <p className="font-black text-white text-xl leading-snug">{aiResponse}</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Action Bar */}
        {status !== 'permission_denied' && (
          <div className="pt-8 border-t-2 border-slate-100 space-y-8 shrink-0">
            <div className="flex flex-col items-center">
              <button 
                onClick={isListening ? stopListening : startListening}
                className="group relative flex flex-col items-center"
              >
                <div className={`w-28 h-28 rounded-full flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.1)] relative transition-all duration-300 ${isListening ? 'bg-red-500 scale-110 shadow-red-200' : 'bg-slate-900 hover:scale-105 active:scale-95'}`}>
                  {isListening ? <MicOff size={44} className="text-white" /> : <Mic size={44} className="text-white" />}
                  {isListening && <div className="absolute inset-0 rounded-full animate-ping bg-red-400 opacity-30"></div>}
                </div>
                <span className={`mt-4 text-[10px] font-black uppercase tracking-[0.3em] transition-colors ${isListening ? 'text-red-500' : 'text-slate-500'}`}>
                  {isListening ? 'Stop' : t.tapToStart}
                </span>
              </button>
            </div>

            {sessionItems.length > 0 && !isListening && status !== 'processing' && (
              <button 
                onClick={handleFinalize}
                className="w-full bg-indigo-600 text-white p-7 rounded-[32px] font-black flex items-center justify-center gap-4 shadow-2xl hover:bg-indigo-700 active:scale-[0.98] transition-all text-xl"
              >
                <CheckCircle2 size={32} className="text-white/80" />
                {t.done}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceAssistant;
