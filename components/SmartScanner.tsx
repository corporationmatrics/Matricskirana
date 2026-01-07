
import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, Loader2, CheckCircle, Zap, Image as ImageIcon, ScanText, AlertCircle, RefreshCw } from 'lucide-react';
import { identifyGroceryItem, analyzeBillImage } from '../geminiService';

interface Props {
  mode: 'item' | 'bill';
  onClose: () => void;
  onResult: (data: any) => void;
  lang: 'en' | 'hi';
}

const SmartScanner: React.FC<Props> = ({ mode, onClose, onResult, lang }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastResult, setLastResult] = useState<any>(null);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  const t = {
    en: {
      permReq: "Permission Required",
      retry: "Try Again",
      itemRec: "Item Recognition",
      billRec: "Bill OCR Mode",
      analyzing: "Analyzing",
      itemHint: "Point at item to Tick it off",
      billHint: "Align receipt clearly within frame",
      permDenied: "Camera permission was dismissed or denied. Please allow access to scan.",
      startError: "Could not start camera. Please try again."
    },
    hi: {
      permReq: "परमिशन की आवश्यकता है",
      retry: "पुनः प्रयास करें",
      itemRec: "सामान की पहचान",
      billRec: "बिल स्कैन मोड",
      analyzing: "चेक कर रहा हूँ",
      itemHint: "सामान पर टिक करने के लिए पॉइंट करें",
      billHint: "रसीद को फ्रेम में रखें",
      permDenied: "कैमरा परमिशन नहीं मिली। कृपया सेटिंग्स में अनुमति दें।",
      startError: "कैमरा शुरू करने में समस्या आई।"
    }
  }[lang];

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    setPermissionError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch(e => console.error("Video play failed:", e));
        };
      }
    } catch (err: any) {
      console.error("Camera error:", err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError' || err.message?.includes('dismissed')) {
        setPermissionError(t.permDenied);
      } else {
        setPermissionError(t.startError);
      }
    }
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject as MediaStream;
    stream?.getTracks().forEach(track => track.stop());
  };

  const captureFrame = async () => {
    if (!videoRef.current || !canvasRef.current || isProcessing || permissionError) return;

    const context = canvasRef.current.getContext('2d');
    if (!context) return;

    setIsProcessing(true);
    canvasRef.current.width = videoRef.current.videoWidth || 640;
    canvasRef.current.height = videoRef.current.videoHeight || 480;
    
    context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
    const base64Image = canvasRef.current.toDataURL('image/jpeg', 0.8).split(',')[1];

    try {
      let result;
      if (mode === 'item') {
        result = await identifyGroceryItem(base64Image);
      } else {
        result = await analyzeBillImage(base64Image);
      }
      setLastResult(result);
      setTimeout(() => {
        onResult(result);
        if (mode === 'bill') onClose();
        setIsProcessing(false);
      }, 1000);
    } catch (err) {
      console.error("Analysis error:", err);
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-[110] flex flex-col">
      <div className="relative flex-1 bg-black overflow-hidden flex items-center justify-center">
        {!permissionError ? (
          <>
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted
              className="w-full h-full object-cover"
            />
            <canvas ref={canvasRef} className="hidden" />
            <div className="absolute inset-0 pointer-events-none border-[40px] border-black/40">
               <div className={`w-full h-full border-2 border-dashed ${isProcessing ? 'border-indigo-400' : 'border-white/50'} rounded-3xl flex items-center justify-center`}>
                  {lastResult && (
                    <div className="bg-emerald-500 p-4 rounded-full animate-ping">
                      <CheckCircle className="text-white" size={48} />
                    </div>
                  )}
               </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center space-y-6">
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center text-red-500">
              <AlertCircle size={48} />
            </div>
            <div className="space-y-2">
              <h3 className="text-white font-bold text-lg">{t.permReq}</h3>
              <p className="text-slate-400 text-sm max-w-xs">{permissionError}</p>
            </div>
            <button 
              onClick={startCamera}
              className="bg-white text-black px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center gap-2 active:scale-95 transition-all"
            >
              <RefreshCw size={18} />
              {t.retry}
            </button>
          </div>
        )}

        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white z-20"
        >
          <X size={24} />
        </button>

        <div className="absolute top-6 left-6 px-4 py-2 bg-black/40 backdrop-blur-md rounded-full border border-white/20 z-20">
          <p className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2">
            <Zap size={12} className="text-yellow-400" />
            {mode === 'item' ? t.itemRec : t.billRec}
          </p>
        </div>
      </div>

      <div className="h-48 bg-slate-900 p-8 flex flex-col items-center justify-center gap-4">
        {isProcessing ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="text-indigo-400 animate-spin" size={32} />
            <p className="text-[10px] font-black text-indigo-200 uppercase tracking-[0.2em]">{t.analyzing} {mode}...</p>
          </div>
        ) : !permissionError && (
          <button 
            onClick={captureFrame}
            className="w-20 h-20 bg-white rounded-full border-8 border-slate-800 flex items-center justify-center active:scale-90 transition-transform shadow-2xl"
          >
            {mode === 'item' ? <ScanText size={32} className="text-slate-900" /> : <Camera size={32} className="text-slate-900" />}
          </button>
        )}
        {!permissionError && (
          <p className="text-xs text-slate-400 font-bold">
            {mode === 'item' ? t.itemHint : t.billHint}
          </p>
        )}
      </div>
    </div>
  );
};

export default SmartScanner;
