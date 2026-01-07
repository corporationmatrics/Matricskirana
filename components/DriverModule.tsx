
import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Navigation, 
  CheckCircle, 
  Scan, 
  Truck,
  Phone,
  MessageSquare,
  Clock,
  MoreVertical,
  ChevronRight,
  Zap,
  Route
} from 'lucide-react';
import { Task } from '../types';
import { optimizeDeliveryRoute } from '../geminiService';

interface Props {
  lang: 'en' | 'hi';
}

const DriverModule: React.FC<Props> = ({ lang }) => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', location: 'Warehouse Sector 5', type: 'pickup', status: 'completed', shopName: 'Main Hub', optimizedOrder: 0, eta: '10:00 AM' },
    { id: '2', location: 'Gandhi Nagar 12', type: 'drop', status: 'pending', shopName: 'Gupta Kirana', optimizedOrder: 1, eta: '11:15 AM' },
    { id: '3', location: 'Laxmi Bazaar 4', type: 'drop', status: 'pending', shopName: 'Sahu General Store', optimizedOrder: 2, eta: '11:45 AM' },
  ]);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const handleOptimize = async () => {
    setIsOptimizing(true);
    // Simulating TSP call
    await new Promise(r => setTimeout(r, 2000));
    // In a real app, we'd update state based on optimizeDeliveryRoute(tasks)
    setIsOptimizing(false);
  };

  const translations = {
    en: {
      route: "Optimize Path",
      pickups: "Pickups",
      drops: "Drops",
      scanPod: "Proof of Delivery",
      active: "Active Trip",
      engine: "Elkai TSP Solver Active"
    },
    hi: {
      route: "रास्ता अनुकूलित करें",
      pickups: "पिकअप",
      drops: "डिलीवरी",
      scanPod: "डिलीवरी कन्फर्म करें",
      active: "सक्रिय ट्रिप",
      engine: "Elkai TSP सॉल्वर चालू है"
    }
  };

  const t = translations[lang];

  return (
    <div className="p-4 space-y-6 bg-slate-50 min-h-screen pb-32">
      <div className="bg-slate-900 p-8 rounded-[40px] text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/10 rounded-full blur-[60px] -mr-16 -mt-16"></div>
        <div className="flex justify-between items-start mb-8 relative z-10">
          <div className="flex items-center gap-4">
            <div className="bg-orange-500 p-4 rounded-2xl shadow-lg shadow-orange-500/30">
              <Truck size={28} className="text-white" />
            </div>
            <div>
              <h2 className="font-black text-2xl tracking-tighter uppercase">{t.active}</h2>
              <p className="text-[10px] text-orange-400 font-black tracking-[0.3em] uppercase">{t.engine}</p>
            </div>
          </div>
          <button onClick={handleOptimize} className={`p-4 rounded-2xl transition-all ${isOptimizing ? 'bg-orange-500/20 text-orange-300' : 'bg-white text-slate-900 shadow-xl active:scale-90'}`}>
            <Route size={24} className={isOptimizing ? 'animate-spin' : ''} />
          </button>
        </div>

        <div className="relative h-6 bg-white/5 rounded-full overflow-hidden mt-6 mb-4 p-1.5 border border-white/10">
          <div className="absolute top-1.5 left-1.5 h-3 w-1/3 bg-orange-500 rounded-full"></div>
          <div className="absolute top-1.5 left-[33%] w-3 h-3 bg-white rounded-full border-2 border-orange-500 m-0"></div>
        </div>
        <div className="flex justify-between text-[9px] font-black text-white/40 uppercase tracking-widest px-2">
          <span>{tasks[0].shopName}</span>
          <span>{tasks[1].shopName}</span>
          <span>{tasks[2].shopName}</span>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs px-2 flex items-center justify-between">
          <span>AI Optimized Route</span>
          <span className="text-indigo-600 flex items-center gap-1"><Zap size={12}/> Saving 1.2km</span>
        </h3>
        <div className="space-y-4">
          {tasks.map(task => (
            <div key={task.id} className={`bg-white border-2 rounded-[32px] p-6 relative overflow-hidden transition-all ${task.status === 'completed' ? 'opacity-40 border-slate-100' : 'border-indigo-100 shadow-xl'}`}>
              <div className="flex justify-between items-start">
                <div className="flex gap-5">
                  <div className={`mt-2 w-5 h-5 rounded-full border-4 border-white shadow-sm ${task.type === 'pickup' ? 'bg-indigo-500' : 'bg-orange-500'}`}></div>
                  <div>
                    <h4 className="font-black text-slate-900 text-xl leading-tight">{task.shopName}</h4>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-1 font-bold">
                      <MapPin size={14} /> {task.location}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ETA</p>
                   <p className="font-black text-indigo-600">{task.eta}</p>
                </div>
              </div>

              {!task.status.includes('completed') && (
                <div className="mt-8 flex gap-3">
                  <button className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-2xl active:scale-95 transition-all">
                    <Navigation size={18} /> Navigate
                  </button>
                  <button className="flex-1 bg-white border border-slate-200 text-slate-900 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all">
                    <Scan size={18} /> Scan POD
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-8 py-4 rounded-full shadow-2xl flex items-center gap-10 border border-white/10 backdrop-blur-xl">
        <button className="flex flex-col items-center gap-1 opacity-60 hover:opacity-100 transition-opacity">
          <Phone size={20} />
          <span className="text-[9px] font-black uppercase tracking-widest">Support</span>
        </button>
        <div className="w-px h-8 bg-white/10"></div>
        <button className="flex flex-col items-center gap-1 text-orange-400">
          <Clock size={20} />
          <span className="text-[9px] font-black uppercase tracking-widest">Break</span>
        </button>
        <div className="w-px h-8 bg-white/10"></div>
        <button className="flex flex-col items-center gap-1 text-emerald-400">
          <CheckCircle size={20} />
          <span className="text-[9px] font-black uppercase tracking-widest">Finish</span>
        </button>
      </div>
    </div>
  );
};

export default DriverModule;
