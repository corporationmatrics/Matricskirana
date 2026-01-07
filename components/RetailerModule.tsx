
import React, { useState, useMemo } from 'react';
import { 
  BookOpen, Package, ShoppingCart, Mic, BarChart3, Search, 
  Plus, Minus, X, CreditCard, Banknote, ArrowRight, Sparkles, 
  AlertTriangle, History, Receipt, Truck, Share2, Zap, LayoutGrid,
  TrendingUp, TrendingDown, ArrowUpRight, Box, Layers, Gauge, ChevronLeft, ChevronRight, CheckCircle2, Download,
  CalendarDays, CalendarRange, Calendar
} from 'lucide-react';
import UdhaarLedger from './UdhaarLedger';
import VoiceAssistant from './VoiceAssistant';
import { processVoiceCommand, getLogisticsIntelligence } from '../geminiService';
import { Product, UdhaarEntry, Bill, DistributorOrder, BillItem } from '../types';
import { MOCK_RETAILERS, MOCK_DISTRIBUTOR_ORDERS, MOCK_BILLS } from '../mockData';

interface Props {
  lang: 'en' | 'hi';
}

const RetailerModule: React.FC<Props> = ({ lang }) => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'udhaar' | 'distributor' | 'history'>('inventory');
  const [inventory, setInventory] = useState<Product[]>(MOCK_RETAILERS[0].inventory);
  const [orders, setOrders] = useState<DistributorOrder[]>(MOCK_DISTRIBUTOR_ORDERS);
  const [bills, setBills] = useState<Bill[]>(MOCK_BILLS);
  const [searchTerm, setSearchTerm] = useState('');
  const [showVoice, setShowVoice] = useState(false);
  const [loadingAnalysis, setLoadingAnalysis] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [recentBill, setRecentBill] = useState<Bill | null>(null);

  const t = {
    en: { 
      inventory: "Stock", udhaar: "Udhaar", distributor: "Supply Hub", history: "Sales",
      broadcast: "Smart Reorder", capacity: "Capacity Engine", loadFactor: "Truck Load",
      catValue: "Category Value", back: "Back to Categories", items: "items",
      saleSuccess: "Sale Recorded!", viewReceipt: "View Receipt", share: "Share", close: "Close",
      total: "Total", billId: "Bill ID", date: "Date", noSales: "No sales recorded yet.",
      performance: "Sales Performance", daySale: "Today", weekSale: "Weekly", monthSale: "Monthly", yearSale: "Annual"
    },
    hi: { 
      inventory: "स्टॉक", udhaar: "उधार", distributor: "सप्लाई हब", history: "बिक्री",
      broadcast: "स्मार्ट रिऑर्डर", capacity: "क्षमता इंजन", loadFactor: "ट्रक लोड",
      catValue: "कुल कीमत", back: "श्रेणियों पर वापस", items: "आइटम",
      saleSuccess: "बिक्री दर्ज की गई!", viewReceipt: "रसीद देखें", share: "शेयर", close: "बंद करें",
      total: "कुल", billId: "बिल आईडी", date: "तारीख", noSales: "अभी तक कोई बिक्री दर्ज नहीं है।",
      performance: "बिक्री रिपोर्ट", daySale: "आज", weekSale: "साप्ताहिक", monthSale: "मासिक", yearSale: "वार्षिक"
    }
  }[lang];

  // Group items by category and calculate values
  const categoryStats = useMemo(() => {
    const groups: Record<string, { value: number; count: number; lowStock: number }> = {};
    inventory.forEach(item => {
      if (!groups[item.category]) {
        groups[item.category] = { value: 0, count: 0, lowStock: 0 };
      }
      groups[item.category].value += item.price * item.stock;
      groups[item.category].count += 1;
      if (item.stock < 15) groups[item.category].lowStock += 1;
    });
    return Object.entries(groups).map(([name, stat]) => ({ name, ...stat }));
  }, [inventory]);

  // Performance analytics
  const salesStats = useMemo(() => {
    const now = new Date();
    const today = now.toLocaleDateString();
    
    // Simple mock logic for periods (in a real app, use better date libs)
    const dayTotal = bills.filter(b => b.date === today).reduce((s, b) => s + b.total, 0);
    
    // For week, month, year, we'd ideally parse strings properly
    // This is a simplified demo-ready calculation
    const weekTotal = bills.slice(0, 4).reduce((s, b) => s + b.total, 0); 
    const monthTotal = bills.slice(0, 5).reduce((s, b) => s + b.total, 0);
    const yearTotal = bills.reduce((s, b) => s + b.total, 0);

    return { dayTotal, weekTotal, monthTotal, yearTotal };
  }, [bills]);

  const filteredItems = useMemo(() => {
    let items = inventory;
    if (selectedCategory) {
      items = items.filter(i => i.category === selectedCategory);
    }
    if (searchTerm) {
      items = items.filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    return items;
  }, [inventory, selectedCategory, searchTerm]);

  const runCapacityCheck = async () => {
    const lowStockItems = inventory.filter(i => i.stock < 20);
    const analysis = await getLogisticsIntelligence(lowStockItems, 200);
    setLoadingAnalysis(analysis);
  };

  const handleBroadcast = () => {
    const newOrder: DistributorOrder = {
      id: `PO-${Date.now().toString().slice(-4)}`,
      distributorName: 'Pending Response',
      status: 'Broadcast',
      totalAmount: 0,
      date: new Date().toISOString().split('T')[0],
      items: inventory.filter(i => i.stock < 20).map(i => ({name: i.name, qty: 50})),
      loadFactor: loadingAnalysis?.loadFactor || 0.45
    };
    setOrders([newOrder, ...orders]);
  };

  const handleVoiceFinalize = (sessionItems: any[], intent: string) => {
    if (sessionItems.length === 0) return;

    // 1. Map session items to real products in inventory and calculate bill items
    const billItems: BillItem[] = sessionItems.map(item => {
      const realProduct = inventory.find(p => p.name.toLowerCase() === item.product.toLowerCase()) || 
                          inventory.find(p => p.name.toLowerCase().includes(item.product.toLowerCase()));
      
      return {
        sku: realProduct?.sku || 'UNKNOWN',
        name: realProduct?.name || item.product,
        qty: item.qty || 1,
        price: realProduct?.price || item.price || 0,
        unit: realProduct?.unit || item.unit || 'pcs'
      };
    });

    const total = billItems.reduce((acc, item) => acc + (item.price * item.qty), 0);

    // 2. Deduct stock from inventory
    setInventory(prev => prev.map(p => {
      const soldItem = billItems.find(bi => bi.sku === p.sku);
      if (soldItem) {
        return { ...p, stock: Math.max(0, p.stock - soldItem.qty) };
      }
      return p;
    }));

    // 3. Create Bill
    const newBill: Bill = {
      id: `BILL-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toLocaleDateString(),
      items: billItems,
      total,
      paymentMode: 'CASH', 
      status: 'paid',
      shopName: MOCK_RETAILERS[0].name
    };

    setBills([newBill, ...bills]);
    setRecentBill(newBill);
    setShowVoice(false);
  };

  return (
    <div className="p-4 space-y-6 bg-[#F8FAFC] min-h-screen pb-40">
      {/* Recent Bill Success Modal */}
      {recentBill && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-md rounded-[48px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="bg-emerald-600 p-10 text-white text-center space-y-4">
                 <div className="bg-white/20 w-20 h-20 rounded-[32px] flex items-center justify-center mx-auto backdrop-blur-md border border-white/10">
                    <CheckCircle2 size={40} />
                 </div>
                 <h3 className="text-3xl font-black tracking-tighter">{t.saleSuccess}</h3>
                 <p className="text-sm opacity-80 font-bold uppercase tracking-widest">₹{recentBill.total.toLocaleString()} Collected</p>
              </div>
              <div className="p-8 space-y-6">
                 <div className="space-y-4">
                    <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
                       <span>{t.items}</span>
                       <span>Value</span>
                    </div>
                    {recentBill.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center">
                         <div>
                            <p className="font-bold text-slate-900">{item.name}</p>
                            <p className="text-[10px] text-slate-400 font-bold">{item.qty} {item.unit} x ₹{item.price}</p>
                         </div>
                         <p className="font-black text-slate-900">₹{item.price * item.qty}</p>
                      </div>
                    ))}
                 </div>
                 <div className="flex gap-3">
                    <button className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-2">
                       <Share2 size={16} /> {t.share}
                    </button>
                    <button onClick={() => setRecentBill(null)} className="flex-1 bg-slate-100 text-slate-900 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest">
                       {t.close}
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}

      <div className="bg-slate-900 rounded-[40px] p-8 text-white shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px] -mr-32 -mt-32"></div>
        <div className="relative z-10 space-y-6">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className="bg-emerald-500/20 p-2 rounded-lg text-emerald-400 border border-emerald-500/20 shadow-lg">
                    <TrendingUp size={16} />
                 </div>
                 <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50">Supply Intelligence Active</h2>
              </div>
              <button onClick={handleBroadcast} className="bg-white text-slate-900 px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-indigo-50 transition-all active:scale-95 shadow-xl">
                {t.broadcast}
              </button>
           </div>
           
           <div className="flex items-end justify-between">
              <div className="space-y-1">
                <p className="text-5xl font-black tracking-tighter">₹4,24,000</p>
                <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1">
                   <ArrowUpRight size={10}/> Stock Value • Powered by TimesFM
                </p>
              </div>
           </div>
        </div>
      </div>

      <div className="sticky top-20 z-40 py-2 -mx-4 px-4 bg-[#F8FAFC]/80 backdrop-blur-xl border-b border-slate-200">
        <div className="flex gap-3 overflow-x-auto scrollbar-hide py-2">
          {[
            { id: 'inventory', label: t.inventory, icon: Package },
            { id: 'udhaar', label: t.udhaar, icon: BookOpen },
            { id: 'distributor', label: t.distributor, icon: Truck },
            { id: 'history', label: t.history, icon: History }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                if (tab.id !== 'inventory') setSelectedCategory(null);
              }}
              className={`flex-none px-6 py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center gap-2.5 transition-all duration-300 ${
                activeTab === tab.id ? 'bg-slate-900 text-white shadow-2xl scale-105' : 'bg-white text-slate-500 border border-slate-200 hover:border-slate-300'
              }`}
            >
              <tab.icon size={16} /> {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'inventory' && (
        <div className="space-y-6 animate-in fade-in duration-500">
          <div className="relative group">
             <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
             <input 
               type="text" 
               placeholder="Search items..."
               className="w-full pl-16 pr-8 py-5 bg-white rounded-[28px] border border-slate-200 shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold text-slate-800"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
          </div>

          {!selectedCategory && !searchTerm ? (
            // Layer 1: Categories View
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categoryStats.map(cat => (
                <button 
                  key={cat.name} 
                  onClick={() => setSelectedCategory(cat.name)}
                  className="bg-white p-8 rounded-[40px] border border-slate-200 text-left hover:border-indigo-500 transition-all group relative overflow-hidden flex flex-col justify-between h-56"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-16 -mt-16 group-hover:bg-indigo-50 transition-colors"></div>
                  <div className="relative z-10 flex justify-between items-start">
                    <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-xl">
                      <Layers size={24} />
                    </div>
                    {cat.lowStock > 0 && (
                      <div className="bg-red-50 text-red-500 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-red-100 flex items-center gap-1">
                        <AlertTriangle size={10} /> {cat.lowStock} Low
                      </div>
                    )}
                  </div>
                  <div className="relative z-10">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-2">{cat.name}</h3>
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{t.catValue}</p>
                        <p className="text-xl font-black text-indigo-600">₹{cat.value.toLocaleString()}</p>
                      </div>
                      <div className="w-px h-8 bg-slate-100"></div>
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{t.items}</p>
                        <p className="text-xl font-black text-slate-800">{cat.count}</p>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="absolute right-8 bottom-8 text-slate-300 group-hover:text-indigo-600 transition-colors" size={24} />
                </button>
              ))}
            </div>
          ) : (
            // Layer 2: Detailed Item List
            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <button 
                  onClick={() => { setSelectedCategory(null); setSearchTerm(''); }}
                  className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors"
                >
                  <ChevronLeft size={16} /> {t.back}
                </button>
                <div className="text-right">
                  <h3 className="text-xl font-black text-slate-900">{selectedCategory || 'Search Results'}</h3>
                  <p className="text-[9px] font-bold text-slate-400 uppercase">{filteredItems.length} {t.items} found</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredItems.map(item => (
                  <div key={item.sku} className="bg-white p-6 rounded-[36px] border border-slate-200 flex flex-col gap-6 group hover:border-indigo-500 transition-all relative overflow-hidden">
                    <div className="flex justify-between items-start relative z-10">
                       <div className="flex items-center gap-5">
                          <div className={`p-4 rounded-2xl transition-colors ${item.stock < 15 ? 'bg-red-50 text-red-500' : 'bg-slate-50 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600'}`}>
                             <Package size={24} />
                          </div>
                          <div>
                             <h4 className="font-black text-slate-900 text-lg tracking-tight leading-tight">{item.name}</h4>
                             <p className={`text-[10px] font-black uppercase tracking-widest mt-1 ${item.stock < 15 ? 'text-red-500' : 'text-emerald-500'}`}>{item.stock} {item.unit} left</p>
                             <p className="text-[10px] font-bold text-slate-400 mt-1">₹{item.price} per {item.unit}</p>
                          </div>
                       </div>
                       <div className="text-right">
                         <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Total Value</p>
                         <p className="font-black text-slate-900">₹{(item.price * item.stock).toLocaleString()}</p>
                       </div>
                    </div>
                    <button className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl hover:shadow-indigo-500/20 active:scale-[0.98] transition-all">
                      + Add to Sale
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'history' && (
        <div className="space-y-8 animate-in fade-in duration-500 px-2">
           <div className="flex justify-between items-center mb-2">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">{t.performance}</h3>
           </div>

           {/* Performance Grid */}
           <div className="grid grid-cols-2 gap-4">
              {[
                { label: t.daySale, value: salesStats.dayTotal, icon: CalendarDays, color: 'indigo' },
                { label: t.weekSale, value: salesStats.weekTotal, icon: CalendarRange, color: 'emerald' },
                { label: t.monthSale, value: salesStats.monthTotal, icon: Calendar, color: 'blue' },
                { label: t.yearSale, value: salesStats.yearTotal, icon: TrendingUp, color: 'orange' }
              ].map(stat => (
                <div key={stat.label} className="bg-white p-6 rounded-[40px] border border-slate-100 shadow-sm space-y-4">
                   <div className={`w-12 h-12 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600 flex items-center justify-center`}>
                      <stat.icon size={22} />
                   </div>
                   <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                      <p className="text-2xl font-black text-slate-900 tracking-tighter">₹{stat.value.toLocaleString()}</p>
                   </div>
                </div>
              ))}
           </div>
           
           <div className="pt-4 space-y-4">
              <div className="flex justify-between items-center">
                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Transaction Log</h4>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{bills.length} Records</p>
              </div>
              
              {bills.length === 0 ? (
                <div className="bg-white p-20 rounded-[48px] border border-dashed border-slate-300 flex flex-col items-center justify-center text-center">
                   <History className="text-slate-200 mb-4" size={64} />
                   <p className="text-slate-400 font-bold">{t.noSales}</p>
                </div>
              ) : (
                <div className="space-y-4">
                   {bills.map(bill => (
                     <div key={bill.id} className="bg-white p-8 rounded-[48px] border border-slate-100 flex items-center justify-between group hover:shadow-xl hover:border-indigo-100 transition-all cursor-pointer">
                       <div className="flex items-center gap-6">
                          <div className="bg-slate-50 text-slate-400 p-4 rounded-[24px] group-hover:bg-slate-900 group-hover:text-white transition-all">
                             <Receipt size={28} />
                          </div>
                          <div>
                             <p className="font-black text-slate-900 text-xl tracking-tight">{bill.id}</p>
                             <div className="flex items-center gap-2 mt-1">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{bill.date}</span>
                                <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest">{bill.items.length} {t.items}</span>
                             </div>
                          </div>
                       </div>
                       <div className="text-right flex flex-col items-end gap-1">
                          <p className="text-2xl font-black text-slate-900 tracking-tighter">₹{bill.total.toLocaleString()}</p>
                          <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${bill.paymentMode === 'CASH' ? 'border-emerald-100 text-emerald-600 bg-emerald-50' : 'border-amber-100 text-amber-600 bg-amber-50'}`}>
                             {bill.paymentMode}
                          </span>
                       </div>
                     </div>
                   ))}
                </div>
              )}
           </div>
        </div>
      )}

      {activeTab === 'distributor' && (
        <div className="space-y-6 animate-in fade-in duration-500">
           <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-10 rounded-[48px] text-white space-y-6 shadow-2xl relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-3xl font-black tracking-tight leading-tight">{t.broadcast}</h3>
                <p className="text-sm opacity-80 font-medium max-w-[240px] mt-2">Powered by Java Loading Engine & Python Routing solver.</p>
                
                <div className="mt-8 bg-black/20 p-6 rounded-3xl backdrop-blur-md border border-white/10">
                   <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2"><Box size={14}/> {t.capacity}</span>
                      <button onClick={runCapacityCheck} className="text-[9px] font-black bg-white/20 px-3 py-1 rounded-full hover:bg-white/40">Analyze</button>
                   </div>
                   <div className="h-4 w-full bg-white/10 rounded-full overflow-hidden mb-2">
                      <div className="h-full bg-indigo-400 transition-all duration-1000" style={{ width: `${loadingAnalysis?.loadFactor ? loadingAnalysis.loadFactor * 100 : 45}%` }}></div>
                   </div>
                   <p className="text-[9px] font-bold text-white/60 text-right uppercase tracking-widest">
                     {loadingAnalysis?.loadFactor ? (loadingAnalysis.loadFactor * 100).toFixed(1) : 45}% Utilized
                   </p>
                </div>

                <button onClick={handleBroadcast} className="mt-6 w-full bg-white text-indigo-700 py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-2xl active:scale-95 transition-all">
                  Broadcast Reorder
                </button>
              </div>
              <Truck size={140} className="absolute -right-8 -bottom-8 text-white opacity-10 -rotate-12" />
           </div>

           <div className="px-2 space-y-4">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Recent Fleet Activity</h4>
              {orders.map(order => (
                <div key={order.id} className="bg-white p-6 rounded-[36px] border border-slate-100 flex justify-between items-center shadow-sm">
                   <div className="flex items-center gap-5">
                      <div className={`p-4 rounded-2xl ${order.status === 'Broadcast' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
                         <Layers size={28} />
                      </div>
                      <div>
                         <h4 className="font-black text-slate-900 text-lg">{order.distributorName}</h4>
                         <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Load Factor: {(order.loadFactor || 0.45) * 100}%</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-full ${order.status === 'Broadcast' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
                         {order.status}
                      </span>
                   </div>
                </div>
              ))}
           </div>
        </div>
      )}

      {activeTab === 'udhaar' && <UdhaarLedger lang={lang} />}

      <div className="fixed bottom-10 right-8 z-[80]">
        <button onClick={() => setShowVoice(true)} className="w-24 h-24 bg-indigo-600 text-white rounded-[40px] shadow-[0_20px_60px_rgba(79,70,229,0.5)] flex items-center justify-center ring-8 ring-white active:scale-90 transition-all duration-300 relative group">
          <div className="absolute inset-0 rounded-[40px] bg-indigo-400 animate-ping opacity-20 group-hover:hidden"></div>
          <Mic size={44} className="group-hover:scale-125 transition-transform" />
        </button>
      </div>
      
      {showVoice && (
        <VoiceAssistant 
          onClose={() => setShowVoice(false)} 
          onProcess={async (v) => await processVoiceCommand(v, 'RETAILER')} 
          onFinalize={handleVoiceFinalize} 
          lang={lang} 
        />
      )}
    </div>
  );
};

export default RetailerModule;
