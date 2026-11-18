export type ProductCategory =
  | 'Sublim & Jersey'
  | 'Sablon & Kaos'
  | 'Cetak DTF & Polyflex'
  | 'Seragam & Kemeja'
  | 'Banner & Promosi'
  | 'Merchandise & Souvenir';

export type Product = {
  id: number;
  name: string;
  category: ProductCategory;
  image: string;
  description: string;
  materials: string[];
  customOptions: string[];
  minOrder: string;
  eta: string;
  sizes: string[];
  price: string;
  featured?: boolean;
  specifications?: string[];
  orderGuide?: string[];
};

export type ProductionPhase = 'queue' | 'printing' | 'sewing' | 'shipping' | 'completed';

export interface OrderTracking {
  orderId: string;
  customerName: string;
  teamName?: string;
  productName: string;
  quantity: number;
  orderDate: string;
  estimatedCompletion: string;
  currentPhase: ProductionPhase;
  phasePercentage: number;
  statusTitle: string;
  notes: string;
  details: {
    material: string;
    model: string;
    collar: string;
    sleeve: string;
  };
  timeline: {
    phase: ProductionPhase;
    title: string;
    date: string;
    completed: boolean;
    current: boolean;
    description: string;
  }[];
}
