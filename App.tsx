
import React, { useState } from 'react';
import { UserRole } from './types';
import { 
  User, 
  Store, 
  Truck, 
  LogOut, 
  ChevronRight,
  Globe,
  Bell,
  ShieldCheck,
  Zap
} from 'lucide-react';

import RetailerModule from './components/RetailerModule';
import ConsumerModule from './components/ConsumerModule';
import DriverModule from './components/DriverModule';
import AdminModule from './components/AdminModule';

const App: React.FC = () => {
  const [role, setRole] = useState<UserRole | 'ADMIN' | null>(null);
  const [lang, setLang] = useState<'en' | 'hi'>('en');

  const t = {
    en: {
      welcome: "KiranaConnect",
      tagline: "Empowering Local Bharat",
      choose: "Select Your Portal",
      retailer: "Retailer",
      retailerSub: "Manage stock & credit",
      consumer: "Consumer",
      consumerSub: "Track spending & deals",
      driver: "Driver",
      driverSub: "Deliver & earn",
      admin: "Ecosystem Control",
      logout: "Switch Profile",
      langToggle: "हिन्दी"
    },
    hi: {
      welcome: "किरानाकनेक्ट",
      tagline: "स्थानीय भारत का सशक्तिकरण",
      choose: "अपना पोर्टल चुनें",
      retailer: "रिटेलर",
      retailerSub: "स्टॉक और उधार संभालें",
      consumer: "कंज्यूमर",
      consumerSub: "खर्च और डील्स देखें",
      driver: "ड्राइवर",
      driverSub: "डिलीवरी करें",
      admin: "इकोसिस्टम कंट्रोल",
      logout: "प्रोफाइल बदलें",
      langToggle: "English"
    }
  }[lang];

  if (!role) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#0F172A] relative overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-blue-600/20 rounded-full blur-[100px]"></div>

        <div className="w-full max-w-lg z-10">
          <div className="text-center mb-12 space-y-4">
             <div className="flex justify-center mb-6">
                <div className="bg-gradient-to-tr from-indigo-600 to-blue-500 p-5 rounded-[32px] shadow-2xl shadow-indigo-500/40">
                   <Store className="w-10 h-10 text-white" />
                </div>
             </div>
             <h1 className="text-5xl font-black text-white tracking-tighter">{t.welcome}</h1>
             <p className="text-indigo-400 font-black uppercase text-[10px] tracking-[0.4em]">{t.tagline}</p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <button 
              onClick={() => setRole(UserRole.RETAILER)}
              className="w-full group relative p-0.5 rounded-[32px] transition-all hover:scale-[1.02] active:scale-95"
            >
              <div className="relative bg-slate-900/40 backdrop-blur-xl border border-white/10 p-6 rounded-[31px] flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <div className="bg-emerald-500/10 p-4 rounded-2xl text-emerald-400 border border-emerald-500/20 shadow-lg">
                    <Store size={24} />
                  </div>
                  <div className="text-left">
                    <span className="block font-black text-white text-lg tracking-tight uppercase">{t.retailer}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.retailerSub}</span>
                  </div>
                </div>
                <ChevronRight className="text-slate-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </div>
            </button>

            <button 
              onClick={() => setRole(UserRole.CONSUMER)}
              className="w-full group relative p-0.5 rounded-[32px] transition-all hover:scale-[1.02] active:scale-95"
            >
              <div className="relative bg-slate-900/40 backdrop-blur-xl border border-white/10 p-6 rounded-[31px] flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <div className="bg-blue-500/10 p-4 rounded-2xl text-blue-400 border border-blue-500/20 shadow-lg">
                    <User size={24} />
                  </div>
                  <div className="text-left">
                    <span className="block font-black text-white text-lg tracking-tight uppercase">{t.consumer}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.consumerSub}</span>
                  </div>
                </div>
                <ChevronRight className="text-slate-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </div>
            </button>

            <button 
              onClick={() => setRole(UserRole.DRIVER)}
              className="w-full group relative p-0.5 rounded-[32px] transition-all hover:scale-[1.02] active:scale-95"
            >
              <div className="relative bg-slate-900/40 backdrop-blur-xl border border-white/10 p-6 rounded-[31px] flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <div className="bg-orange-500/10 p-4 rounded-2xl text-orange-400 border border-orange-500/20 shadow-lg">
                    <Truck size={24} />
                  </div>
                  <div className="text-left">
                    <span className="block font-black text-white text-lg tracking-tight uppercase">{t.driver}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.driverSub}</span>
                  </div>
                </div>
                <ChevronRight className="text-slate-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </div>
            </button>

            <button 
              onClick={() => setRole('ADMIN')}
              className="w-full mt-8 p-6 rounded-[32px] bg-white text-slate-900 font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl hover:bg-indigo-50 transition-all active:scale-95"
            >
              <ShieldCheck size={20} className="text-indigo-600" />
              {t.admin}
            </button>
          </div>

          <button 
            onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
            className="mt-12 flex items-center gap-2 mx-auto text-white/40 font-black uppercase text-[10px] tracking-widest hover:text-white transition-colors"
          >
            <Globe size={16} />
            {t.langToggle}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-screen-md mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setRole(null)}>
            <div className="bg-slate-900 text-white p-2 rounded-xl shadow-lg">
              <Zap size={18} className="fill-white" />
            </div>
            <span className="font-black text-2xl tracking-tighter text-slate-900">KiranaConnect</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-3 text-slate-400 hover:text-slate-900 transition-colors relative">
               <Bell size={22} />
               <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-indigo-500 rounded-full border-2 border-white"></span>
            </button>
            <button 
              onClick={() => setRole(null)}
              className="p-3 text-slate-400 hover:text-red-500 transition-colors"
            >
              <LogOut size={22} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-screen-md mx-auto min-h-[calc(100vh-80px)]">
        {role === UserRole.RETAILER && <RetailerModule lang={lang} />}
        {role === UserRole.CONSUMER && <ConsumerModule lang={lang} />}
        {role === UserRole.DRIVER && <DriverModule lang={lang} />}
        {role === 'ADMIN' && <AdminModule lang={lang} />}
      </main>
    </div>
  );
};

export default App;
