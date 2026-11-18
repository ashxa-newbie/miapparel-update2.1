import { ProductCategory } from '../types';

export interface CategoryMeta {
  id: ProductCategory;
  label: string;
  shortDesc: string;
  items: string[];
}

export const PRODUCT_CATEGORIES: CategoryMeta[] = [
  {
    id: 'Sublim & Jersey',
    label: 'Sublim & Jersey',
    shortDesc: 'Full print olahraga & komunitas',
    items: ['Jersey Sublim Custom'],
  },
  {
    id: 'Sablon & Kaos',
    label: 'Sablon & Kaos',
    shortDesc: 'Cotton combed 24s / 30s custom',
    items: ['Kaos Sablon Custom'],
  },
  {
    id: 'Cetak DTF & Polyflex',
    label: 'Cetak DTF & Polyflex',
    shortDesc: 'DTF meteran 58cm & cutting polyflex',
    items: ['Cetak DTF Meteran', 'Cutting Sablon Polyflex'],
  },
  {
    id: 'Seragam & Kemeja',
    label: 'Seragam & Kemeja',
    shortDesc: 'Polo shirt, PDH, PDL & seragam kerja',
    items: ['Polo Shirt Custom', 'Kemeja dan Seragam Konveksi'],
  },
  {
    id: 'Banner & Promosi',
    label: 'Banner & Promosi',
    shortDesc: 'Media promosi usaha & acara',
    items: ['Cetak Banner Custom'],
  },
  {
    id: 'Merchandise & Souvenir',
    label: 'Merchandise & Souvenir',
    shortDesc: 'Lanyard, topi bordir, mug & tumbler',
    items: ['Custom Lanyard', 'Topi Bordir Custom', 'Mug dan Tumbler Custom'],
  },
];

export const WORKSHOP_BRANCHES = [
  {
    city: 'Tangerang Selatan',
    label: 'Workshop Utama — Jurang Mangu Barat',
    address: 'Jl. Guru Kojar No. 154, Jurang Mangu Barat, Tangerang Selatan',
    eta: 'Bisa Ambil Langsung / Instant Courier',
  },
  {
    city: 'Jabodetabek',
    label: 'Pengiriman Reguler & Instant',
    address: 'Jakarta, Tangerang, Bogor, Depok, Bekasi',
    eta: 'Estimasi 1–2 Hari Via Kurir / Cargo',
  },
  {
    city: 'Seluruh Indonesia',
    label: 'Ekspedisi Kargo Darat & Udara',
    address: 'JNE, J&T Cargo, SiCepat, Lion Parcel, Indah Cargo',
    eta: 'Pengiriman Aman ke Seluruh Provinsi',
  },
];
