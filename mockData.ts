
import { UserRole, NodeMetrics, Product, Campaign, RiskProfile, UdhaarEntry, Bill, DistributorOrder, StoreOffer } from './types';

// Robust catalog of 100+ Indian Grocery Items
export const PRODUCT_CATALOG: Product[] = [
  // STAPLES & GRAINS (0-15)
  { sku: 'STP-RIC-HMT-25', name: 'HMT Kolam Rice 25kg', category: 'Grains', stock: 0, price: 1350, unit: 'bags' },
  { sku: 'STP-RIC-BAS-5', name: 'India Gate Basmati 5kg', category: 'Grains', stock: 0, price: 650, unit: 'bags' },
  { sku: 'STP-AAT-ASH-10', name: 'Aashirvaad Shudh Atta 10kg', category: 'Grains', stock: 0, price: 440, unit: 'bags' },
  { sku: 'STP-AAT-FOR-10', name: 'Fortune Chakki Atta 10kg', category: 'Grains', stock: 0, price: 410, unit: 'bags' },
  { sku: 'STP-DAL-TUR-1', name: 'Tata Sampann Tur Dal 1kg', category: 'Pulses', stock: 0, price: 185, unit: 'pcs' },
  { sku: 'STP-DAL-MOO-1', name: 'Moong Dal 1kg (Loose)', category: 'Pulses', stock: 0, price: 120, unit: 'pcs' },
  { sku: 'STP-DAL-CHA-1', name: 'Chana Dal 1kg', category: 'Pulses', stock: 0, price: 95, unit: 'pcs' },
  { sku: 'STP-POH-500', name: 'Rajdhani Poha 500g', category: 'Staples', stock: 0, price: 55, unit: 'pcs' },
  { sku: 'STP-SUG-1', name: 'Madhur Sugar 1kg', category: 'Staples', stock: 0, price: 52, unit: 'pcs' },
  { sku: 'STP-BES-500', name: 'Fortune Besan 500g', category: 'Staples', stock: 0, price: 65, unit: 'pcs' },
  { sku: 'STP-MAI-500', name: 'Maida 500g (Loose)', category: 'Staples', stock: 0, price: 30, unit: 'pcs' },
  { sku: 'STP-SOO-500', name: 'Suji 500g (Loose)', category: 'Staples', stock: 0, price: 35, unit: 'pcs' },
  { sku: 'STP-DAL-URA-1', name: 'Urad Dal White 1kg', category: 'Pulses', stock: 0, price: 140, unit: 'pcs' },
  { sku: 'STP-RIC-SND-10', name: 'Sona Masoori Rice 10kg', category: 'Grains', stock: 0, price: 580, unit: 'bags' },
  { sku: 'STP-DAL-MAS-1', name: 'Masoor Dal 1kg', category: 'Pulses', stock: 0, price: 110, unit: 'pcs' },

  // OIL & GHEE (15-30)
  { sku: 'OIL-FOR-1L', name: 'Fortune Soya Health Oil 1L', category: 'Oils', stock: 0, price: 145, unit: 'pcs' },
  { sku: 'OIL-SUN-1L', name: 'Sunpure Sunflower Oil 1L', category: 'Oils', stock: 0, price: 165, unit: 'pcs' },
  { sku: 'OIL-DHA-1L', name: 'Dhara Mustard Oil 1L', category: 'Oils', stock: 0, price: 175, unit: 'pcs' },
  { sku: 'OIL-AMU-GHE-500', name: 'Amul Pure Ghee 500ml', category: 'Ghee', stock: 0, price: 310, unit: 'pcs' },
  { sku: 'OIL-PAT-GHE-500', name: 'Patanjali Cow Ghee 500ml', category: 'Ghee', stock: 0, price: 295, unit: 'pcs' },
  { sku: 'OIL-GRD-1L', name: 'Engine Mustard Oil 1L', category: 'Oils', stock: 0, price: 180, unit: 'pcs' },
  { sku: 'OIL-SAF-1L', name: 'Saffola Gold Oil 1L', category: 'Oils', stock: 0, price: 190, unit: 'pcs' },
  { sku: 'OIL-FOR-5L', name: 'Fortune Soya Oil 5L Jar', category: 'Oils', stock: 0, price: 710, unit: 'pcs' },
  { sku: 'OIL-GRD-500', name: 'Groundnut Oil 500ml', category: 'Oils', stock: 0, price: 110, unit: 'pcs' },
  { sku: 'OIL-COCO-250', name: 'Parachute Coconut Oil 250ml', category: 'Oils', stock: 0, price: 95, unit: 'pcs' },

  // SPICES & CONDIMENTS (30-50)
  { sku: 'SPC-SAL-TAT-1', name: 'Tata Salt 1kg', category: 'Spices', stock: 0, price: 28, unit: 'pcs' },
  { sku: 'SPC-SAL-LITE', name: 'Tata Salt Lite 1kg', category: 'Spices', stock: 0, price: 42, unit: 'pcs' },
  { sku: 'SPC-MIR-MDH-100', name: 'MDH Deggi Mirch 100g', category: 'Masala', stock: 0, price: 85, unit: 'pcs' },
  { sku: 'SPC-TUR-EVR-100', name: 'Everest Turmeric 100g', category: 'Masala', stock: 0, price: 32, unit: 'pcs' },
  { sku: 'SPC-COR-EVR-100', name: 'Everest Coriander Powder 100g', category: 'Masala', stock: 0, price: 38, unit: 'pcs' },
  { sku: 'SPC-GAR-MDH-100', name: 'MDH Garam Masala 100g', category: 'Masala', stock: 0, price: 92, unit: 'pcs' },
  { sku: 'SPC-CHI-MDH-100', name: 'MDH Chicken Masala 100g', category: 'Masala', stock: 0, price: 88, unit: 'pcs' },
  { sku: 'SPC-CHA-MDH-100', name: 'MDH Chunky Chat Masala 100g', category: 'Masala', stock: 0, price: 75, unit: 'pcs' },
  { sku: 'SPC-ASA-PAT-25', name: 'Patanjali Hing 25g', category: 'Spices', stock: 0, price: 45, unit: 'pcs' },
  { sku: 'SPC-BLA-SAL-100', name: 'Black Salt 100g (Loose)', category: 'Spices', stock: 0, price: 15, unit: 'pcs' },
  { sku: 'SPC-JEER-100', name: 'Jeera (Cumin) 100g', category: 'Spices', stock: 0, price: 65, unit: 'pcs' },
  { sku: 'SPC-RAI-100', name: 'Rai (Mustard Seeds) 100g', category: 'Spices', stock: 0, price: 25, unit: 'pcs' },
  { sku: 'SPC-MET-100', name: 'Methi Seeds 100g', category: 'Spices', stock: 0, price: 30, unit: 'pcs' },
  { sku: 'SPC-SAU-100', name: 'Saunf (Fennel) 100g', category: 'Spices', stock: 0, price: 40, unit: 'pcs' },
  { sku: 'SPC-ELA-50', name: 'Green Cardamom (Elaichi) 50g', category: 'Spices', stock: 0, price: 160, unit: 'pcs' },

  // DAIRY & BEVERAGES (50-70)
  { sku: 'BEV-TEA-WAG-250', name: 'Wagh Bakri Tea 250g', category: 'Beverages', stock: 0, price: 155, unit: 'pcs' },
  { sku: 'BEV-TEA-RED-250', name: 'Red Label Tea 250g', category: 'Beverages', stock: 0, price: 140, unit: 'pcs' },
  { sku: 'BEV-TEA-TAT-250', name: 'Tata Tea Gold 250g', category: 'Beverages', stock: 0, price: 165, unit: 'pcs' },
  { sku: 'BEV-COF-NES-50', name: 'Nescafe Classic 50g Jar', category: 'Beverages', stock: 0, price: 185, unit: 'pcs' },
  { sku: 'BEV-COF-BRU-50', name: 'Bru Instant Coffee 50g', category: 'Beverages', stock: 0, price: 145, unit: 'pcs' },
  { sku: 'BEV-HOR-500', name: 'Horlicks Classic 500g Jar', category: 'Beverages', stock: 0, price: 245, unit: 'pcs' },
  { sku: 'BEV-COM-500', name: 'Complan Chocolate 500g', category: 'Beverages', stock: 0, price: 290, unit: 'pcs' },
  { sku: 'BEV-BOU-500', name: 'Bournvita Health Drink 500g', category: 'Beverages', stock: 0, price: 235, unit: 'pcs' },
  { sku: 'DRY-AMU-MIL-1L', name: 'Amul Taaza Milk 1L (T-Pack)', category: 'Dairy', stock: 0, price: 72, unit: 'pcs' },
  { sku: 'DRY-AMU-BUT-100', name: 'Amul Butter 100g', category: 'Dairy', stock: 0, price: 58, unit: 'pcs' },
  { sku: 'DRY-AMU-CHE-200', name: 'Amul Cheese Slices 200g', category: 'Dairy', stock: 0, price: 145, unit: 'pcs' },
  { sku: 'DRY-AMU-PAN-200', name: 'Amul Paneer Fresh 200g', category: 'Dairy', stock: 0, price: 95, unit: 'pcs' },
  { sku: 'BEV-COL-2L', name: 'Coca Cola 2L Bottle', category: 'Beverages', stock: 0, price: 95, unit: 'pcs' },
  { sku: 'BEV-PEP-2L', name: 'Pepsi 2L Bottle', category: 'Beverages', stock: 0, price: 90, unit: 'pcs' },
  { sku: 'BEV-SPR-750', name: 'Sprite 750ml Bottle', category: 'Beverages', stock: 0, price: 45, unit: 'pcs' },

  // SNACKS & PACKAGED FOOD (70-90)
  { sku: 'SNK-MAG-70', name: 'Maggi 2-Minute Noodles 70g', category: 'Packaged Food', stock: 0, price: 14, unit: 'pcs' },
  { sku: 'SNK-YIP-70', name: 'YiPPee! Noodles 70g', category: 'Packaged Food', stock: 0, price: 12, unit: 'pcs' },
  { sku: 'SNK-PAS-MAG-70', name: 'Maggi Pazzta Cheese 70g', category: 'Packaged Food', stock: 0, price: 28, unit: 'pcs' },
  { sku: 'SNK-BIS-MAR-250', name: 'Britannia Marie Gold 250g', category: 'Biscuits', stock: 0, price: 40, unit: 'pcs' },
  { sku: 'SNK-BIS-GOO-200', name: 'Britannia Good Day 200g', category: 'Biscuits', stock: 0, price: 35, unit: 'pcs' },
  { sku: 'SNK-BIS-PAR-100', name: 'Parle-G Gold 100g', category: 'Biscuits', stock: 0, price: 10, unit: 'pcs' },
  { sku: 'SNK-BIS-ORB-100', name: 'Oreo Biscuits 100g', category: 'Biscuits', stock: 0, price: 30, unit: 'pcs' },
  { sku: 'SNK-NAM-HAL-200', name: 'Haldiram Alu Bhujia 200g', category: 'Snacks', stock: 0, price: 55, unit: 'pcs' },
  { sku: 'SNK-NAM-HAL-MOO', name: 'Haldiram Moong Dal 200g', category: 'Snacks', stock: 0, price: 60, unit: 'pcs' },
  { sku: 'SNK-NAM-LAY-50', name: 'Lays Magic Masala 50g', category: 'Snacks', stock: 0, price: 20, unit: 'pcs' },
  { sku: 'SNK-NAM-KUR-50', name: 'Kurkure Masala Munch 50g', category: 'Snacks', stock: 0, price: 20, unit: 'pcs' },
  { sku: 'SNK-KET-KIS-500', name: 'Kissan Tomato Ketchup 500g', category: 'Packaged Food', stock: 0, price: 125, unit: 'pcs' },
  { sku: 'SNK-JAM-KIS-500', name: 'Kissan Mixed Fruit Jam 500g', category: 'Packaged Food', stock: 0, price: 165, unit: 'pcs' },
  { sku: 'SNK-CHO-DAI-50', name: 'Cadbury Dairy Milk 50g', category: 'Confectionery', stock: 0, price: 45, unit: 'pcs' },
  { sku: 'SNK-CHO-KIT-40', name: 'Nestle KitKat 40g', category: 'Confectionery', stock: 0, price: 25, unit: 'pcs' },

  // HOUSEHOLD & PERSONAL CARE (90-115)
  { sku: 'HPC-DET-SUR-1K', name: 'Surf Excel Easy Wash 1kg', category: 'Cleaning', stock: 0, price: 145, unit: 'pcs' },
  { sku: 'HPC-DET-ARI-1K', name: 'Ariel Matic Front Load 1kg', category: 'Cleaning', stock: 0, price: 280, unit: 'pcs' },
  { sku: 'HPC-DET-RIN-1K', name: 'Rin Detergent Powder 1kg', category: 'Cleaning', stock: 0, price: 95, unit: 'pcs' },
  { sku: 'HPC-SOA-DET-125', name: 'Dettol Original Soap 125g', category: 'Personal Care', stock: 0, price: 48, unit: 'pcs' },
  { sku: 'HPC-SOA-LIF-125', name: 'Lifebuoy Total Soap 125g', category: 'Personal Care', stock: 0, price: 36, unit: 'pcs' },
  { sku: 'HPC-SOA-LUX-125', name: 'Lux International Soap 125g', category: 'Personal Care', stock: 0, price: 55, unit: 'pcs' },
  { sku: 'HPC-SHA-CLI-340', name: 'Clinic Plus Shampoo 340ml', category: 'Personal Care', stock: 0, price: 195, unit: 'pcs' },
  { sku: 'HPC-SHA-HEA-340', name: 'Head & Shoulders 340ml', category: 'Personal Care', stock: 0, price: 340, unit: 'pcs' },
  { sku: 'HPC-TOO-COL-200', name: 'Colgate MaxFresh 200g', category: 'Personal Care', stock: 0, price: 185, unit: 'pcs' },
  { sku: 'HPC-TOO-SENS-100', name: 'Sensodyne Fresh Mint 100g', category: 'Personal Care', stock: 0, price: 195, unit: 'pcs' },
  { sku: 'HPC-HAN-DET-200', name: 'Dettol Handwash Refill 200ml', category: 'Personal Care', stock: 0, price: 95, unit: 'pcs' },
  { sku: 'HPC-DISH-VIM-500', name: 'Vim Dishwash Liquid 500ml', category: 'Cleaning', stock: 0, price: 105, unit: 'pcs' },
  { sku: 'HPC-DISH-BAR-VIM', name: 'Vim Dishwash Bar 155g', category: 'Cleaning', stock: 0, price: 10, unit: 'pcs' },
  { sku: 'HPC-HAR-BLU-500', name: 'Harpic Toilet Cleaner 500ml', category: 'Cleaning', stock: 0, price: 105, unit: 'pcs' },
  { sku: 'HPC-LYS-FLO-500', name: 'Lizol Floor Cleaner 500ml', category: 'Cleaning', stock: 0, price: 115, unit: 'pcs' },
  { sku: 'HPC-HIT-BLA-400', name: 'Godrej Hit Black 400ml', category: 'Cleaning', stock: 0, price: 215, unit: 'pcs' },
  { sku: 'HPC-AGAR-ZED-1', name: 'Zed Black Agarbatti 1pkt', category: 'Household', stock: 0, price: 50, unit: 'pcs' },
  { sku: 'HPC-COI-MOR-10', name: 'Mortein Coil 10pcs', category: 'Household', stock: 0, price: 45, unit: 'pcs' },
  { sku: 'HPC-BRI-SCO-3', name: 'Scotch Brite Scrubber 3pk', category: 'Cleaning', stock: 0, price: 85, unit: 'pcs' },
  { sku: 'HPC-OIL-BAJ-200', name: 'Bajaj Almond Drops 200ml', category: 'Personal Care', stock: 0, price: 165, unit: 'pcs' },
  { sku: 'HPC-FAC-PDS-100', name: 'Ponds White Beauty 100g', category: 'Personal Care', stock: 0, price: 210, unit: 'pcs' },
];

export const MOCK_DISTRIBUTOR_ORDERS: DistributorOrder[] = [
  { id: 'PO-9021', distributorName: 'Chhattisgarh Wholesale Corp', status: 'Accepted', totalAmount: 45000, date: '2023-11-28', items: [{name: 'HMT Rice', qty: 20}, {name: 'Sugar', qty: 100}] },
  { id: 'PO-9022', distributorName: 'Bilaspur FMCG Hub', status: 'In-Transit', totalAmount: 12000, date: '2023-11-29', items: [{name: 'Fortune Oil', qty: 50}] },
];

export const MOCK_OFFERS: StoreOffer[] = [
  { id: 'off-1', productName: 'Fortune Oil 1L', discount: '15% OFF', validUntil: '2023-12-05', shopName: 'Gupta Kirana Store' },
  { id: 'off-2', productName: 'Aashirvaad Aata 10kg', discount: '₹40 Instant Cashback', validUntil: '2023-12-01', shopName: 'Sahu General Store' },
];

// Initialize Retailer with 100+ items with randomized stock
export const MOCK_RETAILERS: (NodeMetrics & { isUser: boolean; address: string; turnover: number; inventory: Product[] })[] = [
  { 
    id: 'ret-01', name: 'Gupta Kirana Store', type: 'RETAILER', location: { lat: 22.0797, lng: 82.1409 }, 
    stickinessScore: 92, creditRisk: 'Low', lastActive: '2 mins ago', isUser: true, 
    address: 'Sector 4, Bilaspur', turnover: 450000,
    inventory: PRODUCT_CATALOG.map((item, idx) => ({
      ...item,
      // Randomize stock levels: 10% items are critical (low stock), rest are healthy
      stock: idx % 10 === 0 ? Math.floor(Math.random() * 14) + 1 : Math.floor(Math.random() * 100) + 20,
      demandForecast: idx % 15 === 0 ? 'High' : (idx % 20 === 0 ? 'Low' : 'Normal')
    }))
  },
  { 
    id: 'ret-05', name: 'Mishra Daily Needs', type: 'RETAILER', location: { lat: 21.2514, lng: 81.6296 }, 
    stickinessScore: 42, creditRisk: 'High', lastActive: '4 hours ago', isUser: true, 
    address: 'Shanti Nagar, Raipur', turnover: 115000, 
    inventory: PRODUCT_CATALOG.slice(0, 20).map(item => ({...item, stock: 10})) 
  },
];

export const GUPTA_UDHAAR_LEDGER: UdhaarEntry[] = [
  { id: 'u-1', name: 'Ramesh Sahu', amount: 1440, date: '2023-11-20', status: 'pending', phone: '+919827000000' },
  { id: 'u-2', name: 'Suresh Yadav', amount: 220, date: '2023-11-18', status: 'paid', phone: '+919827000001' },
];

// Helper for bill dates
const todayStr = new Date().toLocaleDateString();
const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
const yesterdayStr = yesterday.toLocaleDateString();
const lastWeek = new Date(); lastWeek.setDate(lastWeek.getDate() - 5);
const lastWeekStr = lastWeek.toLocaleDateString();
const lastMonth = new Date(); lastMonth.setMonth(lastMonth.getMonth() - 1);
const lastMonthStr = lastMonth.toLocaleDateString();

export const MOCK_BILLS: Bill[] = [
  { id: 'BILL-101', date: todayStr, customerName: 'Ramesh Sahu', shopName: 'Gupta Kirana Store', items: [{sku: 'STP-RIC-HMT-25', name: 'HMT Rice 25kg', qty: 1, price: 1150, unit: 'bags'}], total: 1150, paymentMode: 'CASH', status: 'paid' },
  { id: 'BILL-102', date: todayStr, customerName: 'Walk-in', shopName: 'Gupta Kirana Store', items: [{sku: 'OIL-FOR-1L', name: 'Fortune Oil', qty: 2, price: 145, unit: 'pcs'}], total: 290, paymentMode: 'CASH', status: 'paid' },
  { id: 'BILL-103', date: yesterdayStr, customerName: 'Suresh Yadav', shopName: 'Gupta Kirana Store', items: [{sku: 'STP-AAT-ASH-10', name: 'Aata 10kg', qty: 2, price: 440, unit: 'bags'}], total: 880, paymentMode: 'CASH', status: 'paid' },
  { id: 'BILL-104', date: lastWeekStr, customerName: 'Ramesh Sahu', shopName: 'Gupta Kirana Store', items: [{sku: 'SNK-MAG-70', name: 'Maggi', qty: 10, price: 14, unit: 'pcs'}], total: 140, paymentMode: 'UDHAAR', status: 'pending' },
  { id: 'BILL-105', date: lastMonthStr, customerName: 'Walk-in', shopName: 'Gupta Kirana Store', items: [{sku: 'HPC-DET-SUR-1K', name: 'Surf Excel', qty: 5, price: 145, unit: 'pcs'}], total: 725, paymentMode: 'CASH', status: 'paid' },
  { id: 'BILL-106', date: '01/01/2023', customerName: 'Old Customer', shopName: 'Gupta Kirana Store', items: [{sku: 'STP-RIC-BAS-5', name: 'Basmati 5kg', qty: 10, price: 650, unit: 'bags'}], total: 6500, paymentMode: 'CASH', status: 'paid' },
];

export const MOCK_CAMPAIGNS: Campaign[] = [
  { id: 'c1', name: 'Zero Commission Nov', type: 'Incentive', target: 'DISTRIBUTORS', metrics: { impressions: 1200, clicks: 450, conversion: 82 }, status: 'Active' },
  { id: 'c2', name: 'Fortune Oil Promo', type: 'Sponsored', target: 'RETAILERS', metrics: { impressions: 45000, clicks: 3800, conversion: 14 }, status: 'Active' },
];

export const MOCK_RISK_WATCHLIST: RiskProfile[] = [
  { id: 'r1', nodeName: 'Mishra Daily Needs', riskLevel: 'Critical', signals: ['Inventory Stalling', 'App Usage Drop', 'COD Rejection'] },
];

export const SALES_TRENDS_3M = [
  { month: 'Sep', gmv: 8500000, logRev: 420000, finRev: 120000 },
  { month: 'Oct', gmv: 9800000, logRev: 510000, finRev: 180000 },
  { month: 'Nov', gmv: 12400000, logRev: 620000, finRev: 290000 },
];

export const RAMESH_CONSUMPTION_HISTORY = [
  { date: '2023-11-01', amount: 450 },
  { date: '2023-11-05', amount: 1200 },
  { date: '2023-11-10', amount: 800 },
  { date: '2023-11-15', amount: 2100 },
  { date: '2023-11-20', amount: 1500 },
  { date: '2023-11-25', amount: 2400 },
];

export const MOCK_CONSUMERS_METRICS = {
  total: 500,
  activeThisWeek: 412,
  avgMonthlySpend: 8400,
  searchFailures: [{ term: 'Oat Milk', count: 154 }, { term: 'Organic Ghee', count: 98 }],
  regionalDistribution: [{ name: 'Bilaspur Sector 4', count: 120 }, { name: 'Raipur Civil Lines', count: 210 }],
};
