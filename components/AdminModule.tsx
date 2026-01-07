
import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Activity, Map, BarChart3, Users, DollarSign, 
  Lock, CloudLightning, MessageSquare, Target, Zap, TrendingUp, 
  AlertCircle, LayoutDashboard, Package, Truck, Share2, Plus,
  MapPin, Globe, Filter, ChevronRight, ArrowUpRight, BookOpen,
  Mic, Smartphone, Database, Search, Cpu, Eye,
  Store, HeartPulse, Tag, CheckCircle2, Server, Terminal, HardDrive
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { MOCK_RETAILERS, MOCK_CAMPAIGNS, MOCK_RISK_WATCHLIST, SALES_TRENDS_3M } from '../mockData';
import { ServiceStatus } from '../types';

interface Props { lang: 'en' | 'hi'; }

const AdminModule: React.FC<Props> = ({ lang }) => {
  const [activeTab, setActiveTab] = useState('mesh');
  const [services, setServices] = useState<ServiceStatus[]>([
    { name: 'Traefik Gateway', status: 'Healthy', latency: 4, throughput: '1.2k req/s' },
    { name: 'TigerBeetle Ledger', status: 'Healthy', latency: 0.2, throughput: '45k tx/s' },
    { name: 'Python Routing (Elkai)', status: 'Healthy', latency: 450, throughput: '12 solve/m' },
    { name: 'Java Loading Engine', status: 'Healthy', latency: 85, throughput: '80 pack/s' },
    { name: 'Go OCR Service', status: 'Degraded', latency: 1200, throughput: '5 doc/s' },
    { name: 'TimesFM Forecast', status: 'Healthy', latency: 2100, throughput: '1 infer/s' },
  ]);

  const t = {
    en: { 
      title: "Logistics Core", 
      health: "Service Mesh", 
      risk: "Risk Sentinel", 
      node: "Active Nodes", 
      manual: "Operational Docs",
      version: "Logistics MVP Platform v1.0.0",
      throughput: "Network Throughput",
      mesh: "Mesh",
      nodes: "Nodes",
      intel: "Intel",
      docs: "Docs",
      latency: "Latency",
      load: "Load",
      ledger: "Infrastructure Ledger Analytics",
      graph: "Supply Network Graph",
      riskMonitor: "Critical Risk Monitoring"
    },
    hi: { 
      title: "लॉजिस्टिक्स कोर", 
      health: "सर्विस मेश", 
      risk: "खतरा अलर्ट", 
      node: "सक्रिय आउटलेट्स", 
      manual: "उपयोगकर्ता गाइड",
      version: "लॉजिस्टिक्स MVP प्लेटफॉर्म v1.0.0",
      throughput: "नेटवर्क थ्रूपुट",
      mesh: "मेश",
      nodes: "नोड्स",
      intel: "इंटेल",
      docs: "दस्तावेज़",
      latency: "विलंबता",
      load: "भार",
      ledger: "इन्फ्रास्ट्रक्चर लेजर एनालिटिक्स",
      graph: "सप्लाई नेटवर्क ग्राफ",
      riskMonitor: "महत्वपूर्ण जोखिम निगरानी"
    }
  }[lang];

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 flex">
      <div className="w-28 bg-[#0F172A] border-r border-white/5 flex flex-col items-center py-12 gap-8 shrink-0 sticky top-0 h-screen shadow-2xl">
        <div className="bg-indigo-600 p-5 rounded-[28px] shadow-indigo-500/40 mb-12 hover:scale-110 transition-transform cursor-pointer border border-indigo-400/30">
           <ShieldCheck size={32} className="text-white" />
        </div>
        {[
          { id: 'mesh', icon: Server, label: t.mesh },
          { id: 'map', icon: Map, label: t.nodes },
          { id: 'intel', icon: BarChart3, label: t.intel },
          { id: 'manual', icon: BookOpen, label: t.docs },
        ].map(mod => (
          <button 
            key={mod.id}
            onClick={() => setActiveTab(mod.id)}
            className={`group relative p-5 rounded-[24px] transition-all duration-300 ${activeTab === mod.id ? 'bg-white text-slate-950 shadow-2xl' : 'text-slate-600 hover:text-slate-300 hover:bg-white/5'}`}
          >
            <mod.icon size={26} />
          </button>
        ))}
      </div>

      <div className="flex-1 p-16 space-y-16 overflow-y-auto custom-scrollbar">
        <header className="flex justify-between items-end border-b border-white/5 pb-12">
           <div className="space-y-4">
              <div className="flex items-center gap-3">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                 <p className="text-[10px] font-black uppercase tracking-[0.5em] text-emerald-400">{t.version}</p>
              </div>
              <h2 className="text-6xl font-black tracking-tighter text-white">{t.title}</h2>
           </div>
           <div className="flex gap-12 text-right">
              <div>
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">{t.throughput}</p>
                 <p className="text-5xl font-black text-indigo-400 tracking-tighter">18.2 GB/s</p>
              </div>
           </div>
        </header>

        {activeTab === 'mesh' && (
          <div className="space-y-12 animate-in fade-in duration-700">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {services.map(service => (
                  <div key={service.name} className="bg-[#0F172A] border border-white/5 rounded-[48px] p-10 space-y-8 hover:border-indigo-500/50 transition-all group">
                     <div className="flex justify-between items-start">
                        <div className={`p-5 rounded-[24px] ${service.status === 'Healthy' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                           <Terminal size={28} />
                        </div>
                        <span className={`text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border ${service.status === 'Healthy' ? 'border-emerald-500/20 text-emerald-400' : 'border-amber-500/20 text-amber-400'}`}>
                           {lang === 'hi' ? (service.status === 'Healthy' ? 'स्वस्थ' : 'कमजोर') : service.status}
                        </span>
                     </div>
                     <div>
                        <h4 className="text-xl font-black text-white tracking-tight">{service.name}</h4>
                        <div className="flex gap-6 mt-6">
                           <div>
                              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">{t.latency}</p>
                              <p className="text-lg font-black text-white">{service.latency}ms</p>
                           </div>
                           <div className="border-l border-white/5 pl-6">
                              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">{t.load}</p>
                              <p className="text-lg font-black text-white">{service.throughput}</p>
                           </div>
                        </div>
                     </div>
                     <div className="pt-4 opacity-20 group-hover:opacity-100 transition-opacity">
                        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                           <div className="h-full bg-indigo-500" style={{ width: `${Math.random() * 60 + 20}%` }}></div>
                        </div>
                     </div>
                  </div>
                ))}
             </div>
             
             <div className="bg-[#0F172A] border border-white/5 rounded-[64px] p-16 space-y-12">
                <h3 className="text-2xl font-black text-white tracking-tight flex items-center gap-4">
                   <HardDrive className="text-indigo-400" /> {t.ledger}
                </h3>
                <div className="h-64">
                   <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={SALES_TRENDS_3M}>
                         <XAxis dataKey="month" hide />
                         <Tooltip contentStyle={{ backgroundColor: '#0F172A', border: 'none', borderRadius: '16px' }} />
                         <Area type="monotone" dataKey="gmv" stroke="#4F46E5" fill="#4F46E5" fillOpacity={0.1} strokeWidth={4} />
                      </AreaChart>
                   </ResponsiveContainer>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'map' && (
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 animate-in fade-in duration-700">
              <div className="lg:col-span-2 bg-[#0F172A] border border-white/5 rounded-[64px] p-16 h-[600px] relative overflow-hidden">
                 <div className="flex justify-between items-center relative z-10 mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-indigo-400 flex items-center gap-3">
                       <Globe size={20} className="animate-spin-slow" /> {t.graph}
                    </h3>
                 </div>
                 {MOCK_RETAILERS.map((ret, idx) => (
                   <div key={ret.id} className="absolute cursor-pointer group" 
                     style={{ left: `${25 + idx * 25}%`, top: `${30 + (idx % 2 === 0 ? 15 : 40)}%` }}>
                     <div className={`w-6 h-6 rounded-full border-4 border-[#0F172A] shadow-xl relative transition-all group-hover:scale-150 ${ret.isUser ? 'bg-emerald-500' : 'bg-red-500'}`}>
                        <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity bg-white text-slate-900 px-3 py-1 rounded text-[9px] font-black uppercase">
                           {ret.name}
                        </div>
                     </div>
                   </div>
                 ))}
              </div>
              <div className="bg-indigo-600 rounded-[56px] p-12 text-white flex flex-col justify-between">
                 <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-60 mb-3">{t.node}</p>
                    <p className="text-8xl font-black tracking-tighter">2.4k</p>
                 </div>
                 <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60">{t.riskMonitor}</p>
                    {MOCK_RISK_WATCHLIST.map(risk => (
                      <div key={risk.id} className="bg-white/10 p-4 rounded-2xl flex items-center gap-4">
                         <AlertCircle className="text-red-400" size={20} />
                         <span className="font-bold text-sm">{risk.nodeName}</span>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        )}
      </div>
    </div>
  );
};

export default AdminModule;
