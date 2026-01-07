
import React, { useState, useMemo } from 'react';
import { 
  UserPlus, 
  MessageCircle, 
  Search, 
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  Phone,
  History,
  AlertCircle,
  X,
  Receipt,
  User,
  Plus,
  ArrowRight
} from 'lucide-react';
import { UdhaarEntry, Bill } from '../types';
import { GUPTA_UDHAAR_LEDGER } from '../mockData';

interface Props {
  lang: 'en' | 'hi';
  entries?: UdhaarEntry[];
  bills?: Bill[];
  onAddCustomer?: (name: string, phone: string) => void;
}

const UdhaarLedger: React.FC<Props> = ({ lang, entries: propEntries, bills = [], onAddCustomer }) => {
  const entries = propEntries || GUPTA_UDHAAR_LEDGER;
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'high'>('all');
  const [selectedDebtorId, setSelectedDebtorId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');

  const translations = {
    en: {
      total: "Portfolio Recovery",
      give: "New Credit",
      get: "Collect",
      add: "Add Debtor",
      searchHint: "Search 50+ Debtors",
      highDues: "Critical Dues",
      history: "Transaction History"
    },
    hi: {
      total: "कुल वसूली बाकी",
      give: "नया उधार",
      get: "वसूली",
      add: "ग्राहक जोड़ें",
      searchHint: "ग्राहकों में खोजें",
      highDues: "ज्यादा उधार",
      history: "बिक्री इतिहास"
    }
  };

  const t = translations[lang];

  const filteredEntries = useMemo(() => {
    return entries.filter(e => {
      const matchesSearch = e.name.toLowerCase().includes(searchTerm.toLowerCase());
      if (filter === 'pending') return matchesSearch && e.status === 'pending';
      if (filter === 'high') return matchesSearch && e.status === 'pending' && e.amount > 3000;
      return matchesSearch;
    }).sort((a, b) => b.amount - a.amount);
  }, [entries, searchTerm, filter]);

  const totalPending = entries
    .filter(e => e.status === 'pending')
    .reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Precision Recovery Dashboard */}
      <div className="bg-white border border-slate-200 rounded-[56px] overflow-hidden shadow-2xl shadow-slate-200/50">
        <div className="bg-red-600 p-12 text-white flex justify-between items-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent"></div>
          <div className="relative z-10 space-y-2">
            <p className="text-white/60 text-[10px] font-black uppercase tracking-[0.4em]">{t.total}</p>
            <h3 className="text-7xl font-black tracking-tighter">₹{totalPending.toLocaleString()}</h3>
            <div className="flex items-center gap-2 bg-white/20 px-4 py-1.5 rounded-full w-fit backdrop-blur-md border border-white/20 mt-4">
               <AlertCircle size={14} />
               <p className="text-[10px] font-black uppercase tracking-widest">12 Accounts Overdue</p>
            </div>
          </div>
          <ArrowDownLeft size={160} className="text-white opacity-5 absolute -right-12 -bottom-12 transition-transform group-hover:scale-110 duration-700" />
        </div>
        <div className="grid grid-cols-2 divide-x divide-slate-100">
          <button className="p-10 flex flex-col items-center gap-4 hover:bg-slate-50 transition-all group">
            <div className="bg-red-100 text-red-600 p-6 rounded-[32px] group-hover:scale-110 transition-transform"><ArrowDownLeft size={36} /></div>
            <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">{t.give}</span>
          </button>
          <button className="p-10 flex flex-col items-center gap-4 hover:bg-slate-50 transition-all group">
            <div className="bg-emerald-100 text-emerald-600 p-6 rounded-[32px] group-hover:scale-110 transition-transform"><ArrowUpRight size={36} /></div>
            <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">{t.get}</span>
          </button>
        </div>
      </div>

      {/* Modern Search & Filtering Layer */}
      <div className="space-y-6">
        <div className="flex gap-4">
           <div className="flex-1 bg-white border border-slate-200 rounded-[32px] px-8 flex items-center gap-4 shadow-sm group focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all">
             <Search size={22} className="text-slate-400 group-focus-within:text-indigo-600" />
             <input 
               type="text" 
               placeholder={t.searchHint} 
               className="w-full py-6 outline-none bg-transparent font-bold text-slate-900 placeholder:text-slate-400" 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
           </div>
           <button 
             onClick={() => setIsAddModalOpen(true)}
             className="bg-slate-900 text-white p-6 rounded-[32px] shadow-2xl active:scale-95 transition-all hover:bg-indigo-600"
           >
             <UserPlus size={28} />
           </button>
        </div>
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 px-1">
           {[
             { id: 'all', label: lang === 'hi' ? 'सभी' : 'Overview' },
             { id: 'pending', label: lang === 'hi' ? 'बाकी' : 'Pending' },
             { id: 'high', label: t.highDues }
           ].map(f => (
             <button 
               key={f.id}
               onClick={() => setFilter(f.id as any)}
               className={`flex-none px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${filter === f.id ? 'bg-slate-900 border-slate-900 text-white shadow-xl' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}`}
             >
               {f.label}
             </button>
           ))}
        </div>
      </div>

      <div className="space-y-5">
        {filteredEntries.map(entry => (
          <div key={entry.id} className="bg-white p-8 rounded-[48px] border border-slate-100 flex items-center justify-between hover:shadow-[0_40px_80px_-20px_rgba(15,23,42,0.1)] hover:-translate-y-2 transition-all group cursor-pointer" onClick={() => setSelectedDebtorId(entry.id)}>
            <div className="flex items-center gap-6">
              <div className={`w-20 h-20 rounded-[32px] flex items-center justify-center font-black text-3xl shadow-sm border transition-all group-hover:scale-110 ${entry.amount > 3000 ? 'bg-red-50 text-red-600 border-red-100' : 'bg-indigo-50 text-indigo-600 border-indigo-100'}`}>
                {entry.name[0]}
              </div>
              <div>
                <h4 className="font-black text-slate-900 tracking-tight text-2xl capitalize">{entry.name}</h4>
                <div className="flex items-center gap-3 mt-1.5 opacity-40">
                   <p className="text-[11px] font-black uppercase tracking-widest">{entry.date}</p>
                </div>
              </div>
            </div>
            <div className="text-right flex flex-col items-end gap-4">
              <span className={`font-black text-3xl tracking-tighter ${entry.status === 'pending' ? 'text-red-600' : 'text-emerald-600'}`}>
                ₹{entry.amount.toLocaleString()}
              </span>
              {entry.status === 'pending' && (
                 <button className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-emerald-500/20 active:scale-95 transition-all">
                    <MessageCircle size={14} /> Send Alert
                 </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UdhaarLedger;
