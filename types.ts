
export enum UserRole {
  RETAILER = 'RETAILER',
  CONSUMER = 'CONSUMER',
  DRIVER = 'DRIVER'
}

export interface ServiceStatus {
  name: string;
  status: 'Healthy' | 'Degraded' | 'Down';
  latency: number;
  throughput: string;
}

export interface NodeMetrics {
  id: string;
  name: string;
  type: 'RETAILER' | 'DISTRIBUTOR';
  location: { lat: number; lng: number };
  stickinessScore: number;
  creditRisk: 'Low' | 'Medium' | 'High';
  fulfillmentRate?: number;
  lastActive: string;
}

export interface BillItem {
  sku: string;
  name: string;
  qty: number;
  price: number;
  unit: string;
}

// Added UdhaarEntry interface to fix "no exported member" errors
export interface UdhaarEntry {
  id: string;
  name: string;
  amount: number;
  date: string;
  status: 'paid' | 'pending';
  phone: string;
}

export interface Bill {
  id: string;
  date: string;
  customerId?: string;
  customerName?: string;
  shopId?: string;
  shopName?: string;
  items: BillItem[];
  total: number;
  paymentMode: 'CASH' | 'UDHAAR';
  status: 'paid' | 'pending';
}

export interface DistributorOrder {
  id: string;
  distributorName: string;
  status: 'Draft' | 'Broadcast' | 'Accepted' | 'In-Transit' | 'Delivered';
  totalAmount: number;
  date: string;
  items: Array<{name: string, qty: number, volume?: number}>;
  loadFactor?: number; // 0-1 percentage
}

export interface StoreOffer {
  id: string;
  productName: string;
  discount: string;
  validUntil: string;
  shopName: string;
}

export interface Product {
  sku: string;
  name: string;
  category: string;
  stock: number;
  price: number;
  unit: string;
  demandForecast?: 'High' | 'Normal' | 'Low';
  restockDate?: string;
  volumePerUnit?: number; // for 3D bin packing
}

export interface Task {
  id: string;
  location: string;
  type: 'pickup' | 'drop';
  status: 'pending' | 'completed';
  shopName: string;
  optimizedOrder: number;
  eta: string;
}

export interface Campaign {
  id: string;
  name: string;
  type: 'Sponsored' | 'Incentive';
  target: 'RETAILERS' | 'CONSUMERS' | 'DISTRIBUTORS';
  metrics: { impressions: number; clicks: number; conversion: number };
  status: 'Active' | 'Paused';
}

export interface RiskProfile {
  id: string;
  nodeName: string;
  riskLevel: 'Critical' | 'High' | 'Medium';
  signals: string[];
}
