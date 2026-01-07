
import React, { useState, useEffect, useRef } from 'react';
import { Mic, X, Loader2, Volume2, MicOff, ShoppingCart, CheckCircle2, Plus, ListChecks, MessageCircle, Sparkles, ShieldAlert, Play } from 'lucide-react';

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
  const [hasStarted, setHasStarted] = useState(false);
  
  const transcriptRef = useRef("");
  const recognitionRef = useRef<any>(null);

  const t = {
    en: { 
      title: "Voice Sales Assistant", 
      listening: "Listening...", 
      processing: "Parsing Items...", 
      addMore: "Tap to Speak", 
      done: "Finalize Sale", 
      list: "Sale Breakdown",
      start: "Start Voice Session",
      permError: "Microphone Access Blocked",
      permSub: "Close any screen overlays (bubbles/filters) and try again."
    },
    hi: { 
      title: "वॉयस सेल्स असिस्टेंट", 
      listening: "सुन रहा हूँ...", 
      processing: "चेक कर रहा हूँ...", 
      addMore: "बोलने के लिए दबाएं", 
      done: "बिल पक्का करें", 
      list: "बिक्री का विवरण",
      start: "वॉइस शुरू करें",
      permError: "माइक्रोफोन अनुमति नहीं मिली",
      permSub: "स्क्रीन पर चल रहे अन्य एप्स (जैसे चैट बबल्स) को बंद करें और फिर प्रयास करें।"
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

    recognition.onresult = (event: any) => {
      const text = Array.from(event.results).map((r: any) => r[0].transcript).join('');
      transcriptRef.current = text;
      setDisplayTranscript(text);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      if (event.error === 'not-allowed') {
        setStatus('permission_denied');
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

          const followUp = lang === 'hi' 
            ? `${result.message}. Kya check-out karun ya aur bhi saamaan hai?`
            : `${result.message}. Ready to checkout or add more?`;
          
          speak(followUp);
        } catch (error) {
          console.error("AI Error:", error);
          setAiResponse("Maaf kijiye, samajh nahi aaya. Phir se boliye.");
          setStatus('idle');
        }
      } else {
        setStatus('idle');
      }
    };

    return recognition;
  };

  const startSession = () => {
    setHasStarted(true);
    const greeting = lang === 'hi' 
      ? "Namaste! Kya becha hai, batayein?" 
      : "Namaste! What have you sold? Please tell me.";
    
    speak(greeting, () => {
      startListening();
    });
  };

  const startListening = () => {
    if (isListening) return;
    transcriptRef.current = "";
    setDisplayTranscript("");
    setStatus('listening');
    
    if (!recognitionRef.current) {
      recognitionRef.current = initRecognition();
    }

    try {
      recognitionRef.current?.start();
      setIsListening(true);
    } catch (e) {
      console.warn("Recognition start failed:", e);
      setStatus('permission_denied');
    }
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  useEffect(() => {
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[110] flex items-end justify-center">
      <div className="bg-slate-50 w-full max-w-screen-md rounded-t-[40px] p-6 flex flex-col max-h-[92vh] shadow-2xl animate-in slide-in-from-bottom duration-500">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${isListening ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`}></div>
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{t.title}</h2>
          </div>
          <button onClick={onClose} className="bg-slate-200 p-2.5 rounded-full text-slate-500 hover:bg-slate-300 active:scale-90 transition-all">
            <X size={20} />
          </button>
        </div>

        {!hasStarted ? (
          /* Permission Guard Screen */
          <div className="flex-1 flex flex-col items-center justify-center space-y-8 py-12 text-center px-8 animate-in fade-in zoom-in-95">
             <div className="bg-indigo-100 p-8 rounded-[40px] text-indigo-600 shadow-inner">
                <Mic size={64} className="animate-pulse" />
             </div>
             <div className="space-y-3">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">{t.start}</h3>
                <p className="text-sm text-slate-500 font-medium">Click below to activate the microphone and start recording your sales.</p>
             </div>
             <button 
               onClick={startSession}
               className="w-full bg-slate-900 text-white py-6 rounded-[32px] font-black text-lg uppercase tracking-widest shadow-2xl flex items-center justify-center gap-4 active:scale-95 transition-all"
             >
               <Play size={24} /> {t.start}
             </button>
          </div>
        ) : status === 'permission_denied' ? (
          /* Error State */
          <div className="flex-1 flex flex-col items-center justify-center space-y-6 py-12 text-center px-8 animate-in shake duration-500">
             <div className="bg-red-50 p-8 rounded-[40px] text-red-500">
                <ShieldAlert size={64} />
             </div>
             <div className="space-y-2">
                <h3 className="text-xl font-black text-slate-900">{t.permError}</h3>
                <p className="text-sm text-slate-500 font-bold">{t.permSub}</p>
             </div>
             <button 
               onClick={() => { setStatus('idle'); startListening(); }}
               className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest"
             >
               Try Again
             </button>
          </div>
        ) : (
          /* Active Assistant UI */
          <div className="flex-1 overflow-y-auto space-y-4 px-1 custom-scrollbar">
            {sessionItems.length > 0 ? (
              <div className="animate-in fade-in duration-700">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <ListChecks size={14} className="text-emerald-600" />
                  {t.list}
                </h3>
                <div className="bg-white rounded-[32px] border-2 border-slate-100 divide-y-2 divide-slate-50 shadow-sm overflow-hidden">
                  {sessionItems.map((item, idx) => (
                    <div key={idx} className="p-5 flex justify-between items-center bg-white hover:bg-slate-50 transition-colors animate-in slide-in-from-right">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-sm">
                          {item.qty || 1}
                        </div>
                        <div>
                          <p className="font-black text-slate-900 capitalize text-lg leading-tight flex items-center gap-2">
                            {item.product}
                            <Sparkles size={12} className="text-indigo-400" />
                          </p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">{item.unit || 'units'}</p>
                        </div>
                      </div>
                      {item.price ? <span className="font-black text-slate-900 text-lg">₹{item.price * (item.qty || 1)}</span> : <div className="w-8 h-1 bg-slate-100 rounded-full"></div>}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-40 flex flex-col items-center justify-center opacity-30">
                <ShoppingCart size={48} className="text-slate-400" />
                <p className="text-[10px] font-black uppercase tracking-widest mt-4">Record items by voice...</p>
              </div>
            )}

            <div className="text-center py-8">
              {status === 'listening' && (
                <div className="space-y-6">
                  <div className="flex justify-center gap-2 h-10 items-center">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                      <div key={i} className="w-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ height: `${40 + Math.random() * 60}%`, animationDelay: `${i * 0.1}s` }}></div>
                    ))}
                  </div>
                  <div className="px-10">
                    <p className="text-2xl font-black text-slate-900 italic leading-tight animate-in fade-in duration-300">
                      {displayTranscript ? `"${displayTranscript}"` : t.listening}
                    </p>
                  </div>
                </div>
              )}
              
              {status === 'processing' && (
                <div className="flex flex-col items-center gap-4 py-6">
                  <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
                  <p className="text-sm font-black text-slate-900 tracking-widest uppercase">{t.processing}</p>
                </div>
              )}

              {status === 'waiting' && aiResponse && !isListening && (
                <div className="bg-slate-900 p-6 rounded-[32px] inline-flex items-start gap-4 text-left shadow-2xl shadow-indigo-100 mx-6 animate-in zoom-in-95 duration-300">
                  <div className="bg-indigo-600 p-2.5 rounded-2xl shrink-0">
                    <MessageCircle className="text-white" size={24} />
                  </div>
                  <p className="font-black text-white text-lg leading-snug">{aiResponse}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Controls */}
        {hasStarted && status !== 'permission_denied' && (
          <div className="pt-6 border-t-2 border-slate-100 space-y-6 shrink-0">
            <div className="flex flex-col items-center">
              <button 
                onClick={isListening ? stopListening : startListening}
                className={`group flex flex-col items-center gap-4 transition-all duration-300 ${isListening ? 'scale-110' : 'hover:scale-105 active:scale-95'}`}
              >
                <div className={`w-24 h-24 rounded-full flex items-center justify-center shadow-2xl relative transition-all duration-300 ${isListening ? 'bg-red-500' : 'bg-slate-900'}`}>
                  {isListening ? <MicOff size={40} className="text-white" /> : <Mic size={40} className="text-white" />}
                  {isListening && (
                    <div className="absolute inset-0 rounded-full animate-ping bg-red-400 opacity-30"></div>
                  )}
                </div>
                <span className={`text-[10px] font-black uppercase tracking-[0.3em] transition-colors ${isListening ? 'text-red-500' : 'text-slate-500'}`}>
                  {isListening ? 'Stop' : t.addMore}
                </span>
              </button>
            </div>

            {sessionItems.length > 0 && !isListening && status !== 'processing' && (
              <button 
                onClick={handleFinalize}
                className="w-full bg-indigo-600 text-white p-6 rounded-[28px] font-black flex items-center justify-center gap-4 shadow-2xl hover:bg-indigo-700 active:scale-[0.98] transition-all text-lg"
              >
                <CheckCircle2 size={28} className="text-white/80" />
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
