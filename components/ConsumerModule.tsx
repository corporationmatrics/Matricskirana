
import React, { useState, useMemo } from 'react';
import { 
  Activity, BarChart2, ShoppingBag, Camera, Bell, Mic, HeartPulse, 
  Sparkles, History, Receipt, Store, ChevronRight, Zap, ListChecks, Tag,
  TrendingUp, Wallet, ArrowUpRight, Plus, ShoppingCart, Info, CheckCircle2
} from 'lucide-react';
import { AreaChart, Area, XAxis, ResponsiveContainer, Tooltip, YAxis } from 'recharts';
import { RAMESH_CONSUMPTION_HISTORY, MOCK_BILLS, MOCK_OFFERS } from '../mockData';

interface Props { lang: 'en' | 'hi'; }

const ConsumerModule: React.FC<Props> = ({ lang }) => {
  const [activeTab, setActiveTab] = useState<'home' | 'analysis' | 'deals' | 'khata'>('home');
  const [offers] = useState(MOCK_OFFERS);

  const t = {
    en: { 
      welcome: "Hi Ramesh,", pulse: "Consumption Pulse", budget: "Wallet Share", 
      deals: "Market Offers", smartList: "AI Smart Auto-List", 
      healthAlert: "Sugar intake is High (12.4%).", healthSub: "Try Organic Jaggery at Gupta's",
      history: "Purchase History", khata: "My Khata", recovery: "Balance Due"
    },
    hi: { 
      welcome: "नमस्ते रमेश,", pulse: "उपभोग पल्स", budget: "बजट मीटर", 
      deals: "बाजार ऑफर्स", smartList: "स्मार्ट लिस्ट",
      healthAlert: "चीनी का सेवन अधिक है (12.4%)।", healthSub: "गुप्ता जी से गुड़ मंगवाएं",
      history: "पुराना सामान", khata: "मेरा खाता", recovery: "कुल उधार"
    }
  }[lang];

  return (
    <div className="p-4 md:p-8 space-y-8 pb-32 bg-[#F8FAFC] min-h-screen">
      {/* Dynamic Header */}
      <div className="flex justify-between items-center px-2">
         <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-slate-900 rounded-[28px] flex items-center justify-center text-white shadow-2xl relative group overflow-hidden">
               <div className="absolute inset-0 bg-indigo-500 opacity-0 group-hover:opacity-20 transition-opacity"></div>
               <Activity size={32} className="relative z-10" />
               <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white"></span>
            </div>
            <div>
               <h2 className="text-3xl font-black text-slate-900 tracking-tighter">{t.welcome}</h2>
               <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded-lg flex items-center gap-1">
                     <Sparkles size={10} /> Diamond Saver
                  </span>
               </div>
            </div>
         </div>
         <div className="flex gap-2">
            <button className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 border border-slate-200 shadow-sm active:scale-95 transition-all"><Camera size={22} /></button>
            <button className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 border border-slate-200 shadow-sm relative active:scale-95 transition-all">
              <Bell size={22} />
              <span className="absolute top-3.5 right-3.5 w-2 h-2 bg-indigo-500 rounded-full border-2 border-white"></span>
            </button>
         </div>
      </div>

      {activeTab === 'home' && (
        <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-500">
           {/* Wallet Card */}
           <div className="bg-slate-900 rounded-[56px] p-10 text-white shadow-[0_40px_80px_-20px_rgba(15,23,42,0.3)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
              <div className="relative z-10 space-y-10">
                 <div className="flex justify-between items-start">
                    <div className="space-y-2">
                       <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">{t.budget}</p>
                       <h3 className="text-6xl font-black tracking-tighter">₹8,450</h3>
                       <p className="text-[11px] font-black text-emerald-400 flex items-center gap-2 tracking-widest uppercase mt-2">
                          <TrendingUp size={14}/> 14% Saved this month
                       </p>
                    </div>
                    <div className="bg-white/10 p-5 rounded-[32px] backdrop-blur-md border border-white/10">
                       <Wallet className="text-white" size={32} />
                    </div>
                 </div>
                 <div className="space-y-4">
                    <div className="flex justify-between text-[11px] font-black uppercase tracking-widest opacity-40">
                       <span>Limit: ₹12,000</span>
                       <span>65% Used</span>
                    </div>
                    <div className="h-5 w-full bg-white/5 rounded-full overflow-hidden p-1.5 border border-white/10">
                       <div className="h-full bg-gradient-to-r from-indigo-500 to-blue-400 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                 </div>
              </div>
           </div>

           {/* Health Alert */}
           <div className="bg-emerald-600 rounded-[48px] p-8 text-white flex items-center gap-8 shadow-2xl relative overflow-hidden group">
              <div className="bg-white/20 p-5 rounded-[32px] backdrop-blur-xl shrink-0 shadow-lg border border-white/10">
                 <HeartPulse size={40} className="animate-pulse" />
              </div>
              <div className="space-y-2">
                 <p className="text-xl font-black leading-tight tracking-tight">{t.healthAlert}</p>
                 <p className="text-sm font-medium text-emerald-100/80">{t.healthSub}</p>
                 <button className="mt-4 bg-white text-emerald-600 px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all">Claim Offer</button>
              </div>
           </div>

           {/* AI Smart Auto-List (New Feature) */}
           <div className="bg-white border border-slate-200 rounded-[48px] p-8 space-y-6 shadow-sm">
              <div className="flex justify-between items-center">
                 <div className="flex items-center gap-3">
                    <div className="bg-indigo-50 p-2.5 rounded-xl text-indigo-600"><ListChecks size={20} /></div>
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">{t.smartList}</h3>
                 </div>
                 <Sparkles size={16} className="text-indigo-400 animate-pulse" />
              </div>
              <div className="space-y-3">
                 {['Fortune Oil 1L', 'Tata Salt 1kg', 'HMT Rice 25kg'].map((item, idx) => (
                   <div key={idx} className="flex justify-between items-center bg-slate-50 p-5 rounded-[24px] border border-slate-100 group hover:border-indigo-500 transition-all">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center font-black text-slate-400 text-xs">#{idx+1}</div>
                         <span className="font-bold text-slate-800">{item}</span>
                      </div>
                      <button className="bg-indigo-600 text-white p-2.5 rounded-xl shadow-lg active:scale-90 transition-all">
                         <ShoppingCart size={16} />
                      </button>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      )}

      {activeTab === 'analysis' && (
        <div className="space-y-8 animate-in fade-in duration-500">
           <div className="bg-white p-10 rounded-[56px] border border-slate-200 shadow-sm space-y-8">
              <div className="flex justify-between items-end">
                 <div>
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">{t.pulse}</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Last 30 days spending</p>
                 </div>
                 <div className="text-right">
                    <p className="text-2xl font-black text-indigo-600 tracking-tighter">₹8,450</p>
                    <p className="text-[9px] font-black text-emerald-500 uppercase">Avg: ₹280 / day</p>
                 </div>
              </div>
              <div className="h-64 w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={RAMESH_CONSUMPTION_HISTORY}>
                       <defs>
                          <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3}/>
                             <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                          </linearGradient>
                       </defs>
                       <XAxis dataKey="date" hide />
                       <YAxis hide />
                       <Tooltip 
                         contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', padding: '16px' }}
                         labelStyle={{ fontWeight: '900', color: '#64748b', marginBottom: '4px', textTransform: 'uppercase', fontSize: '10px' }}
                         itemStyle={{ fontWeight: '900', color: '#1e293b', fontSize: '16px' }}
                         formatter={(value: number) => [`₹${value}`, 'Spend']}
                       />
                       <Area type="monotone" dataKey="amount" stroke="#4F46E5" strokeWidth={5} fillOpacity={1} fill="url(#colorSpend)" />
                    </AreaChart>
                 </ResponsiveContainer>
              </div>
           </div>

           <div className="grid grid-cols-2 gap-4">
              <div className="bg-indigo-50 p-8 rounded-[40px] border border-indigo-100 flex flex-col gap-4">
                 <div className="bg-white w-fit p-3 rounded-2xl text-indigo-600 shadow-sm"><ShoppingCart size={20}/></div>
                 <div>
                    <p className="text-3xl font-black text-indigo-900 tracking-tighter">12</p>
                    <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Store Visits</p>
                 </div>
              </div>
              <div className="bg-emerald-50 p-8 rounded-[40px] border border-emerald-100 flex flex-col gap-4">
                 <div className="bg-white w-fit p-3 rounded-2xl text-emerald-600 shadow-sm"><Receipt size={20}/></div>
                 <div>
                    <p className="text-3xl font-black text-emerald-900 tracking-tighter">4.2%</p>
                    <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Points Earned</p>
                 </div>
              </div>
           </div>
        </div>
      )}

      {activeTab === 'khata' && (
        <div className="space-y-8 animate-in fade-in duration-500">
           <div className="bg-red-600 rounded-[56px] p-12 text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-black/10 rounded-full blur-[60px] -mr-32 -mt-32 transition-transform group-hover:scale-125"></div>
              <div className="relative z-10">
                 <p className="text-white/60 text-[10px] font-black uppercase tracking-[0.4em] mb-2">{t.recovery}</p>
                 <h3 className="text-7xl font-black tracking-tighter">₹1,440</h3>
                 <div className="flex items-center gap-2 mt-8">
                    <button className="bg-white text-red-600 px-8 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all">Pay Balance</button>
                    <button className="p-3 bg-white/20 rounded-2xl backdrop-blur-md border border-white/20"><Info size={20}/></button>
                 </div>
              </div>
           </div>

           <div className="space-y-4">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">{t.khata} Stores</h4>
              <div className="bg-white border border-slate-200 rounded-[48px] overflow-hidden divide-y divide-slate-100 shadow-sm">
                 <div className="p-8 flex justify-between items-center group cursor-pointer hover:bg-slate-50 transition-all">
                    <div className="flex items-center gap-6">
                       <div className="w-16 h-16 bg-slate-900 text-white rounded-[24px] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <Store size={28} />
                       </div>
                       <div>
                          <p className="font-black text-slate-900 text-xl tracking-tight">Gupta Kirana Store</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Last Transaction: Nov 20</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="text-2xl font-black text-red-600 tracking-tighter">₹1,440</p>
                       <p className="text-[9px] font-black text-slate-400 uppercase mt-1 flex items-center gap-1 justify-end">Verified <CheckCircle2 size={10} className="text-emerald-500" /></p>
                    </div>
                 </div>
              </div>
           </div>

           <div className="space-y-4 pt-4">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">{t.history}</h4>
              <div className="space-y-3">
                 {MOCK_BILLS.map(bill => (
                    <div key={bill.id} className="bg-white p-6 rounded-[36px] border border-slate-100 flex justify-between items-center">
                       <div className="flex items-center gap-4">
                          <div className="bg-indigo-50 p-3 rounded-2xl text-indigo-600"><Receipt size={24}/></div>
                          <div>
                             <p className="font-black text-slate-900 text-sm">Bill #{bill.id.slice(-3)}</p>
                             <p className="text-[9px] font-bold text-slate-400 uppercase">{bill.date} • {bill.shopName}</p>
                          </div>
                       </div>
                       <p className="font-black text-slate-900">₹{bill.total}</p>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      )}

      {activeTab === 'deals' && (
        <div className="space-y-6 animate-in slide-in-from-right duration-500">
           <div className="flex items-center gap-3 px-2">
              <Tag className="text-indigo-600" size={24} />
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">{t.deals} In Bilaspur</h3>
           </div>
           <div className="grid grid-cols-1 gap-4">
              {offers.map(off => (
                <div key={off.id} className="bg-white p-8 rounded-[48px] border border-slate-100 flex items-center gap-8 shadow-sm group hover:border-indigo-500 transition-all relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform"></div>
                   <div className="bg-indigo-50 text-indigo-600 p-6 rounded-[32px] group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-md">
                      <Store size={36} />
                   </div>
                   <div className="flex-1 space-y-2">
                      <h4 className="font-black text-slate-900 text-xl tracking-tight">{off.shopName}</h4>
                      <p className="text-sm font-bold text-slate-500">{off.productName}</p>
                      <p className="text-3xl font-black text-indigo-600 tracking-tighter">{off.discount}</p>
                      <div className="flex items-center gap-2 mt-4">
                         <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-widest">Valid until {off.validUntil}</span>
                      </div>
                   </div>
                   <button className="bg-slate-900 text-white p-5 rounded-[24px] shadow-xl active:scale-90 transition-all">
                      <ChevronRight size={24} />
                   </button>
                </div>
              ))}
           </div>
        </div>
      )}

      {/* Persistent Bottom Tab Bar */}
      <div className="fixed bottom-10 left-8 right-8 flex justify-center z-[100]">
        <div className="bg-slate-900/90 px-6 py-4 rounded-[40px] flex items-center gap-3 border border-white/10 shadow-[0_40px_80px_-15px_rgba(15,23,42,0.6)] backdrop-blur-3xl">
          {[
            { id: 'home', icon: Activity, label: 'Pulse' },
            { id: 'deals', icon: Tag, label: 'Deals' },
            { id: 'analysis', icon: BarChart2, label: 'Intel' },
            { id: 'khata', icon: History, label: 'Khata' }
          ].map(tab => (
            <button 
              key={tab.id} 
              onClick={() => setActiveTab(tab.id as any)} 
              className={`flex items-center gap-3 px-6 py-4 rounded-[28px] transition-all duration-500 ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-xl scale-110' : 'text-slate-500 hover:text-white/60'}`}
            >
              <tab.icon size={22} />
              {activeTab === tab.id && <span className="text-[11px] font-black uppercase tracking-[0.1em]">{tab.label}</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ConsumerModule;
