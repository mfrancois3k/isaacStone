export type ProjectType = 
  | 'Tile Installation'
  | 'Granite Countertops'
  | 'Custom Masonry/Stone'
  | 'Marble Bathroom Remodel'
  | 'Fireplace Slabs & Accents';

export type MaterialCategory = 
  | 'Porcelain & Ceramic'
  | 'Granite Slab'
  | 'Imported Marble'
  | 'Quartz & Quartzite'
  | 'Natural Fieldstone';

export interface EstimateResult {
  sqft: number;
  materialType: string;
  application: string;
  complexity: 'Standard' | 'Premium / Beveled' | 'Master Intricate / Bookmatched';
  baseRatePerSqFt: number;
  laborRatePerSqFt: number;
  subtotal: number;
  prepFee: number;
  total: number;
  depositDueNow: number; // 50%
  remainingBalance: number; // 50%
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: 'Bathrooms' | 'Countertops' | 'Fireplaces' | 'Flooring' | 'Outdoor';
  location: string;
  material: string;
  sqft: string;
  description: string;
  image: string;
  completionTime: string;
  features: string[];
}

export interface QuoteFormData {
  name: string;
  email: string;
  phone: string;
  projectType: ProjectType;
  sqft: string;
  message: string;
}

export interface InvoiceData {
  invoiceNumber: string;
  date: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  projectType: string;
  sqft: number;
  totalAmount: number;
  depositAmount: number;
  balanceDue: number;
  terms: string;
  status: 'PENDING_DEPOSIT' | 'DEPOSIT_PAID' | 'COMPLETED';
}
