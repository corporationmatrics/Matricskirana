
import React, { useState, useMemo } from 'react';
import { 
  BookOpen, Package, ShoppingCart, Mic, Search, 
  Plus, Minus, X, CreditCard, Banknote, ArrowRight, Sparkles, 
  AlertTriangle, History, Receipt, Truck, Share2, Zap, LayoutGrid,
  TrendingUp, ArrowUpRight, Box, Layers, Gauge, ChevronLeft, ChevronRight, CheckCircle2,
  Trash2, Wallet, MousePointer2, Store, Clock, Scan, Info
} from 'lucide-react';
import UdhaarLedger from './UdhaarLedger';
import VoiceAssistant from './VoiceAssistant';
import SmartScanner from './SmartScanner';
import { processVoiceCommand } from '../geminiService';
import { Product, Bill, DistributorOrder, BillItem } from '../types';
import { MOCK_RETAILERS, MOCK_DISTRIBUTOR_ORDERS, MOCK_BILLS } from '../mockData';

interface Props {
  lang: 'en' | 'hi';
}

const RetailerModule: React.FC<Props> = ({ lang }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'inventory' | 'udhaar' | 'supply'>('dashboard');
  const [inventory, setInventory] = useState<Product[]>(MOCK_RETAILERS[0].inventory);
  const [bills, setBills] = useState<Bill[]>(MOCK_BILLS);
  const [searchTerm, setSearchTerm] = useState('');
  const [showVoice, setShowVoice] = useState(false);
  const [showScanner, setShowScanner] = useState<{show: boolean, mode: 'item' | 'bill'}>({show: false, mode: 'item'});
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [recentBill, setRecentBill] = useState<Bill | null>(null);
  
  const [pendingSale, setPendingSale] = useState<BillItem[]>([]);
  const [showCart, setShowCart] = useState(false);

  const categoryMap: Record<string, string> = {
    'Grains': lang === 'hi' ? 'अनाज और चावल' : 'Grains',
    'Pulses': lang === 'hi' ? 'दालें' : 'Pulses',
    'Staples': lang === 'hi' ? 'जरूरी सामान' : 'Staples',
    'Oils': lang === 'hi' ? 'तेल' : 'Oils',
    'Ghee': lang === 'hi' ? 'घी' : 'Ghee',
    'Spices': lang === 'hi' ? 'मसाले' : 'Spices',
    'Masala': lang === 'hi' ? 'पिसे मसाले' : 'Masala',
    'Beverages': lang === 'hi' ? 'पेय पदार्थ' : 'Beverages',
    'Dairy': lang === 'hi' ? 'डेयरी' : 'Dairy',
    'Packaged Food': lang === 'hi' ? 'पैकेट बंद' : 'Packaged Food',
    'Biscuits': lang === 'hi' ? 'बिस्कुट' : 'Biscuits',
    'Snacks': lang === 'hi' ? 'नाश्ता' : 'Snacks',
    'Confectionery': lang === 'hi' ? 'चॉकलेट' : 'Confectionery',
    'Cleaning': lang === 'hi' ? 'सफाई का सामान' : 'Cleaning',
    'Personal Care': lang === 'hi' ? 'पर्सनल केयर' : 'Personal Care',
    'Household': lang === 'hi' ? 'घर का सामान' : 'Household',
  };

  const unitMap: Record<string, string> = {
    'bags': lang === 'hi' ? 'बोरी' : 'bags',
    'pcs': lang === 'hi' ? 'पीस' : 'pcs',
    'pkt': lang === 'hi' ? 'पैकेट' : 'pkt',
    'kg': lang === 'hi' ? 'किलो' : 'kg',
  };

  const t = {
    en: { 
      dashboard: "Report", inventory: "Stock", udhaar: "Udhaar", supply: "Supply",
      todaySales: "Today's Sales", activeBills: "Total Bills", cashDrawer: "Cash Drawer",
      actionSale: "New Bill", actionPrice: "Check Price", actionStock: "Refill Stock",
      recentSales: "Live Activity", lowStockUrgent: "Low Stock Alert",
      saleSuccess: "Bill Done!", share: "Share", close: "Close",
      total: "Total", completeSale: "Confirm Bill", back: "Back",
      void: "Delete", holdToSpeak: "Hold to speak items", searchItems: "Search items...",
      supplyIntel: "Supply Intelligence", fleetUtilized: "Fleet Active",
      truckLoadOpt: "Auto-routing active", broadcastOrder: "Smart Order",
      activeBill: "Current Bill", noActivity: "No sales yet",
      vsYesterday: "vs Yesterday", left: "remaining", collected: "Collected",
      items: "Items", verified: "Verified", inStock: "In Stock",
      worth: "Stock Value", forecast: "AI Forecast", highDemand: "High Demand",
      scanToBill: "Scan Item"
    },
    hi: { 
      dashboard: "आज की रिपोर्ट", inventory: "स्टॉक", udhaar: "उधार", supply: "सप्लाई",
      todaySales: "आज की बिक्री", activeBills: "कुल बिल", cashDrawer: "गल्ले में कैश",
      actionSale: "नया बिल", actionPrice: "रेट देखें", actionStock: "स्टॉक भरें",
      recentSales: "अभी की हलचल", lowStockUrgent: "स्टॉक कम है",
      saleSuccess: "बिल बन गया!", share: "शेयर", close: "बंद करें",
      total: "कुल", completeSale: "बिल पक्का करें", back: "वापस",
      void: "हटाएं", holdToSpeak: "बोलने के लिए दबाएं", searchItems: "सामान खोजें...",
      supplyIntel: "सप्लाई इंटेलिजेंस", fleetUtilized: "गाड़ियां चालू हैं",
      truckLoadOpt: "स्मार्ट रास्ता चालू है", broadcastOrder: "ऑर्डर भेजें",
      activeBill: "अभी का बिल", noActivity: "आज कोई बिक्री नहीं हुई",
      vsYesterday: "कल से", left: "बाकी", collected: "जमा हुआ",
      items: "सामान", verified: "सत्यापित", inStock: "स्टॉक में",
      worth: "स्टॉक की कीमत", forecast: "स्मार्ट अनुमान", highDemand: "मांग ज्यादा है",
      scanToBill: "सामान स्कैन करें"
    }
  }[lang];

  const todayStats = useMemo(() => {
    const todayStr = new Date().toLocaleDateString();
    const todayBills = bills.filter(b => b.date === todayStr);
    const totalSales = todayBills.reduce((s, b) => s + b.total, 0);
    const cashInHand = todayBills.filter(b => b.paymentMode === 'CASH').reduce((s, b) => s + b.total, 0);
    const billCount = todayBills.length;
    const inventoryWorth = inventory.reduce((acc, curr) => acc + (curr.stock * curr.price), 0);
    return { totalSales, cashInHand, billCount, todayBills, inventoryWorth };
  }, [bills, inventory]);

  const urgentRestock = useMemo(() => {
    return inventory.filter(p => p.stock < 10).slice(0, 5);
  }, [inventory]);

  const cartTotal = pendingSale.reduce((acc, item) => acc + (item.price * item.qty), 0);

  const addToSale = (product: Product) => {
    setPendingSale(prev => {
      const existing = prev.find(i => i.sku === product.sku);
      if (existing) {
        return prev.map(i => i.sku === product.sku ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { sku: product.sku, name: product.name, qty: 1, price: product.price, unit: product.unit }];
    });
    setShowCart(true);
  };

  const finalizeSale = (paymentMode: 'CASH' | 'UDHAAR' = 'CASH') => {
    if (pendingSale.length === 0) return;
    setInventory(prev => prev.map(p => {
      const soldItem = pendingSale.find(bi => bi.sku === p.sku);
      if (soldItem) return { ...p, stock: Math.max(0, p.stock - soldItem.qty) };
      return p;
    }));
    const newBill: Bill = {
      id: `BILL-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toLocaleDateString(),
      items: [...pendingSale],
      total: cartTotal,
      paymentMode, 
      status: paymentMode === 'CASH' ? 'paid' : 'pending',
      shopName: MOCK_RETAILERS[0].name
    };
    setBills([newBill, ...bills]);
    setRecentBill(newBill);
    setPendingSale([]);
    setShowCart(false);
  };

  const voidSale = (billId: string) => {
    setBills(prev => prev.filter(b => b.id !== billId));
  };

  const handleScannerResult = (result: any) => {
    if (result && result.product) {
       const found = inventory.find(p => p.name.toLowerCase().includes(result.product.toLowerCase()));
       if (found) addToSale(found);
    }
    setShowScanner({show: false, mode: 'item'});
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-32">
      <div className="sticky top-20 z-[60] px-4 py-3 bg-white/80 backdrop-blur-xl border-b border-slate-200">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {[
            { id: 'dashboard', label: t.dashboard, icon: Zap },
            { id: 'inventory', label: t.inventory, icon: Package },
            { id: 'udhaar', label: t.udhaar, icon: BookOpen },
            { id: 'supply', label: t.supply, icon: Truck },
          ].map(tab => (
            <button 
              key={tab.id} 
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-none px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2.5 transition-all ${
                activeTab === tab.id ? 'bg-slate-900 text-white shadow-lg scale-105' : 'bg-slate-100 text-slate-500'
              }`}
            >
              <tab.icon size={14} /> {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'dashboard' && (
        <div className="p-6 space-y-8 animate-in fade-in duration-500">
          <div className="grid grid-cols-1 gap-4">
             <div className="bg-slate-900 rounded-[48px] p-10 text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px] -mr-32 -mt-32"></div>
                <div className="relative z-10 space-y-2">
                   <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">{t.todaySales}</p>
                   <h2 className="text-7xl font-black tracking-tighter">₹{todayStats.totalSales.toLocaleString()}</h2>
                   <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs mt-2">
                      <TrendingUp size={14} /> 12% {t.vsYesterday}
                   </div>
                   <div className="pt-8 flex items-center gap-3">
                      <div className="px-4 py-2 bg-white/10 rounded-xl backdrop-blur-md border border-white/10">
                         <p className="text-[8px] font-black uppercase tracking-widest text-white/40">{t.worth}</p>
                         <p className="font-black text-white">₹{(todayStats.inventoryWorth/1000).toFixed(1)}k</p>
                      </div>
                      <div className="px-4 py-2 bg-white/10 rounded-xl backdrop-blur-md border border-white/10">
                         <p className="text-[8px] font-black uppercase tracking-widest text-white/40">{t.activeBills}</p>
                         <p className="font-black text-white">{todayStats.billCount}</p>
                      </div>
                   </div>
                </div>
             </div>

             <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setShowVoice(true)}
                  className="bg-indigo-600 text-white p-8 rounded-[40px] flex flex-col items-center gap-4 shadow-xl active:scale-95 transition-all group overflow-hidden"
                >
                   <Mic size={32} className="group-hover:scale-110 transition-transform" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-white/80">{t.actionSale}</span>
                </button>
                <button 
                  onClick={() => setShowScanner({show: true, mode: 'item'})}
                  className="bg-white border border-slate-200 p-8 rounded-[40px] flex flex-col items-center gap-4 hover:bg-slate-50 transition-all active:scale-95 group"
                >
                   <Scan size={32} className="text-slate-400 group-hover:text-slate-900" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">{t.scanToBill}</span>
                </button>
             </div>
          </div>

          <div className="space-y-4">
             <div className="flex justify-between items-center px-2">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                   <AlertTriangle size={12} className="text-red-500" /> {t.lowStockUrgent}
                </h4>
                <div className="flex items-center gap-1 text-[9px] font-black text-indigo-600 uppercase">
                   <Sparkles size={10}/> {t.forecast}
                </div>
             </div>
             <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 px-1">
                {urgentRestock.map(item => (
                  <div key={item.sku} className="flex-none bg-white border border-slate-100 p-5 rounded-[32px] w-48 space-y-3 shadow-sm group">
                     <div>
                        <p className="font-black text-slate-900 truncate text-sm">{item.name}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase">{categoryMap[item.category as string] || item.category}</p>
                     </div>
                     <div className="flex justify-between items-center">
                        <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-lg ${item.stock < 5 ? 'bg-red-50 text-red-500' : 'bg-amber-50 text-amber-600'}`}>
                           {item.stock} {t.left}
                        </span>
                        <button onClick={() => addToSale(item)} className="bg-slate-900 text-white p-2.5 rounded-xl group-hover:bg-indigo-600 transition-colors"><Plus size={14}/></button>
                     </div>
                  </div>
                ))}
             </div>
          </div>

          <div className="space-y-4">
             <div className="flex justify-between items-center px-2">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                   <Clock size={12} /> {t.recentSales}
                </h4>
             </div>
             <div className="space-y-3">
                {todayStats.todayBills.length === 0 ? (
                  <div className="p-12 text-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-[48px]">
                     <History size={48} className="mx-auto text-slate-200 mb-4" />
                     <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t.noActivity}</p>
                  </div>
                ) : (
                  todayStats.todayBills.slice(0, 5).map(bill => (
                    <div key={bill.id} className="bg-white p-6 rounded-[36px] border border-slate-100 flex items-center justify-between group hover:border-indigo-500 transition-all">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center font-bold text-xs group-hover:bg-indigo-50 group-hover:text-indigo-600">
                             {bill.id.slice(-2)}
                          </div>
                          <div>
                             <p className="font-black text-slate-900">₹{bill.total.toLocaleString()}</p>
                             <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{bill.items.length} {t.items} • {bill.paymentMode}</p>
                          </div>
                       </div>
                       <button onClick={() => voidSale(bill.id)} className="opacity-0 group-hover:opacity-100 p-3 text-red-400 hover:bg-red-50 rounded-2xl transition-all">
                          <Trash2 size={18} />
                       </button>
                    </div>
                  ))
                )}
             </div>
          </div>
        </div>
      )}

      {activeTab === 'inventory' && (
        <div className="p-6 space-y-6 animate-in fade-in duration-500">
           <div className="relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                placeholder={t.searchItems}
                className="w-full pl-16 pr-8 py-5 bg-white rounded-[28px] border border-slate-200 shadow-sm font-bold"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
           
           {!selectedCategory && !searchTerm ? (
             <div className="grid grid-cols-1 gap-4">
                {Array.from(new Set(inventory.map(i => i.category))).map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className="bg-white p-8 rounded-[40px] border border-slate-200 flex justify-between items-center group active:scale-95 transition-all"
                  >
                     <div className="flex items-center gap-5">
                        <div className="bg-indigo-50 text-indigo-600 p-4 rounded-2xl"><Layers size={24}/></div>
                        <h3 className="text-xl font-black text-slate-900 tracking-tight">{categoryMap[cat as string] || cat}</h3>
                     </div>
                     <ChevronRight className="text-slate-300 group-hover:text-indigo-600 transition-colors" />
                  </button>
                ))}
             </div>
           ) : (
             <div className="space-y-4">
                <button onClick={() => {setSelectedCategory(null); setSearchTerm('')}} className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 px-2">
                   <ChevronLeft size={16} /> {t.back}
                </button>
                <div className="grid grid-cols-1 gap-4">
                   {inventory.filter(i => (!selectedCategory || i.category === selectedCategory) && (!searchTerm || i.name.toLowerCase().includes(searchTerm.toLowerCase()))).map(item => (
                     <div key={item.sku} className="bg-white p-6 rounded-[36px] border border-slate-200 flex items-center justify-between group hover:border-indigo-500 transition-all">
                        <div className="flex items-center gap-5">
                           <div className={`p-4 rounded-2xl ${item.stock < 15 ? 'bg-red-50 text-red-500' : 'bg-slate-50 text-slate-400'}`}><Package size={24}/></div>
                           <div>
                              <div className="flex items-center gap-2">
                                 <h4 className="font-black text-slate-900 text-lg leading-tight">{item.name}</h4>
                                 {item.demandForecast === 'High' && (
                                   <span className="bg-orange-100 text-orange-600 text-[8px] font-black px-1.5 py-0.5 rounded flex items-center gap-0.5">
                                      <TrendingUp size={8}/> {t.highDemand}
                                   </span>
                                 )}
                              </div>
                              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">
                                ₹{item.price} • {item.stock} {unitMap[item.unit as string] || item.unit} {t.inStock}
                              </p>
                           </div>
                        </div>
                        <button onClick={() => addToSale(item)} className="bg-slate-900 text-white p-4 rounded-2xl active:scale-95 transition-all group-hover:bg-indigo-600"><Plus size={20}/></button>
                     </div>
                   ))}
                </div>
             </div>
           )}
        </div>
      )}

      {activeTab === 'udhaar' && <UdhaarLedger lang={lang} />}

      {activeTab === 'supply' && (
        <div className="p-6 space-y-6 animate-in fade-in duration-500">
           <div className="bg-indigo-600 p-10 rounded-[48px] text-white space-y-8 shadow-2xl relative overflow-hidden">
              <div className="relative z-10 space-y-4">
                 <h3 className="text-3xl font-black tracking-tight leading-tight">{t.supplyIntel}</h3>
                 <p className="text-sm opacity-80 font-bold uppercase tracking-widest">{t.truckLoadOpt}</p>
                 <div className="bg-black/20 p-6 rounded-3xl backdrop-blur-md">
                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden mb-2">
                       <div className="h-full bg-indigo-400" style={{ width: '45%' }}></div>
                    </div>
                    <p className="text-[10px] font-black text-white/60 text-right uppercase">45% {t.fleetUtilized}</p>
                 </div>
                 <button className="w-full bg-white text-indigo-700 py-5 rounded-[28px] font-black uppercase text-xs tracking-widest shadow-2xl active:scale-95 transition-all">
                    {t.broadcastOrder}
                 </button>
              </div>
              <Truck size={120} className="absolute -right-8 -bottom-8 opacity-10 -rotate-12" />
           </div>
        </div>
      )}

      {recentBill && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
           <div className="bg-white w-full max-w-md rounded-[48px] shadow-2xl overflow-hidden animate-in zoom-in-95">
              <div className="bg-emerald-600 p-10 text-white text-center space-y-4">
                 <div className="bg-white/20 w-20 h-20 rounded-[32px] flex items-center justify-center mx-auto backdrop-blur-md">
                    <CheckCircle2 size={40} />
                 </div>
                 <h3 className="text-3xl font-black tracking-tighter">{t.saleSuccess}</h3>
                 <p className="text-sm opacity-80 font-bold uppercase tracking-widest">₹{recentBill.total.toLocaleString()} {t.collected}</p>
              </div>
              <div className="p-8 space-y-6">
                 <div className="space-y-4 max-h-[30vh] overflow-y-auto pr-2 custom-scrollbar">
                    {recentBill.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center">
                         <div>
                            <p className="font-bold text-slate-900">{item.name}</p>
                            <p className="text-[10px] text-slate-400 font-bold">{item.qty} {unitMap[item.unit as string] || item.unit} x ₹{item.price}</p>
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

      {showCart && pendingSale.length > 0 && (
        <div className="fixed bottom-32 left-4 right-4 z-[90] animate-in slide-in-from-bottom duration-500">
           <div className="bg-white rounded-[40px] shadow-2xl border border-slate-200 overflow-hidden">
              <div className="bg-slate-900 px-8 py-6 flex justify-between items-center text-white">
                 <div className="flex items-center gap-3">
                    <ShoppingCart size={20} className="text-indigo-400" />
                    <h4 className="font-black text-[10px] uppercase tracking-[0.2em]">{t.activeBill}</h4>
                 </div>
                 <button onClick={() => setShowCart(false)} className="p-2 bg-white/10 rounded-full"><X size={16}/></button>
              </div>
              <div className="p-6 max-h-[40vh] overflow-y-auto space-y-4 custom-scrollbar">
                 {pendingSale.map((item) => (
                    <div key={item.sku} className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl">
                       <div className="flex-1">
                          <p className="font-black text-slate-900 text-sm leading-tight">{item.name}</p>
                          <p className="text-[10px] font-bold text-slate-400">₹{item.price} / {unitMap[item.unit as string] || item.unit}</p>
                       </div>
                       <div className="flex items-center gap-4">
                          <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-2 py-1">
                             <button onClick={() => {
                               setPendingSale(prev => prev.map(i => i.sku === item.sku ? {...i, qty: Math.max(1, i.qty - 1)} : i));
                             }} className="p-1"><Minus size={14} /></button>
                             <span className="font-black text-sm w-4 text-center">{item.qty}</span>
                             <button onClick={() => {
                               setPendingSale(prev => prev.map(i => i.sku === item.sku ? {...i, qty: i.qty + 1} : i));
                             }} className="p-1"><Plus size={14} /></button>
                          </div>
                          <button onClick={() => setPendingSale(prev => prev.filter(i => i.sku !== item.sku))} className="text-red-400"><Trash2 size={18} /></button>
                       </div>
                    </div>
                 ))}
              </div>
              <div className="p-8 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-6">
                 <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.total}</p>
                    <p className="text-3xl font-black text-slate-900 tracking-tighter">₹{cartTotal.toLocaleString()}</p>
                 </div>
                 <button onClick={() => finalizeSale()} className="bg-indigo-600 text-white px-10 py-5 rounded-[28px] font-black text-[11px] uppercase tracking-widest shadow-xl shadow-indigo-200 active:scale-95 transition-all">
                   {t.completeSale}
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Floating Action Buttons */}
      <div className="fixed bottom-10 right-8 z-[80] flex flex-col gap-4">
        <button 
           onClick={() => setShowScanner({show: true, mode: 'item'})}
           className="w-16 h-16 bg-white text-slate-900 rounded-3xl shadow-2xl flex items-center justify-center ring-4 ring-slate-100 active:scale-90 transition-all group"
        >
           <Scan size={28} className="group-hover:scale-110 transition-transform" />
        </button>
        <button onClick={() => setShowVoice(true)} className="w-24 h-24 bg-indigo-600 text-white rounded-[40px] shadow-[0_20px_60px_rgba(79,70,229,0.5)] flex items-center justify-center ring-8 ring-white active:scale-90 transition-all duration-300 group">
          <div className="absolute inset-0 rounded-[40px] bg-indigo-400 animate-ping opacity-20 group-hover:hidden"></div>
          <Mic size={44} className="group-hover:scale-125 transition-transform" />
        </button>
      </div>
      
      {showVoice && (
        <VoiceAssistant 
          onClose={() => setShowVoice(false)} 
          onProcess={async (v) => await processVoiceCommand(v, 'RETAILER')} 
          onFinalize={(sessionItems) => {
             const newItems: BillItem[] = sessionItems.map(item => {
                const realProduct = inventory.find(p => p.name.toLowerCase().includes(item.product.toLowerCase()));
                return {
                  sku: realProduct?.sku || 'UNKNOWN',
                  name: realProduct?.name || item.product,
                  qty: item.qty || 1,
                  price: realProduct?.price || item.price || 0,
                  unit: realProduct?.unit || item.unit || 'pcs'
                };
             });
             setPendingSale(prev => [...prev, ...newItems]);
             setShowCart(true);
          }} 
          lang={lang} 
        />
      )}

      {showScanner.show && (
        <SmartScanner 
          mode={showScanner.mode} 
          lang={lang} 
          onClose={() => setShowScanner({show: false, mode: 'item'})} 
          onResult={handleScannerResult} 
        />
      )}
    </div>
  );
};

export default RetailerModule;
