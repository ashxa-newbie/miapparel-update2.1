import { useState } from 'react';
import {
  ChevronRight,
  Truck,
  Award,
  Zap,
  Headphones,
  Shirt,
  Palette,
  Layers,
  Briefcase,
  Flag,
  Gift,
  ArrowUpRight,
} from 'lucide-react';
import HeroBannerCarousel from './HeroBannerCarousel';
import { Product, ProductCategory } from '../types';
import { PRODUCT_CATEGORIES } from '../data/categories';
import { useAppConfig } from '../contexts/ConfigContext';

type Props = {
  selectedCategory: ProductCategory | 'Semua';
  onSelectCategory: (cat: ProductCategory | 'Semua') => void;
  onSelectProduct: (product: Product) => void;
};

const categoryIcons: Record<ProductCategory, typeof Shirt> = {
  'Sublim & Jersey': Shirt,
  'Sablon & Kaos': Palette,
  'Cetak DTF & Polyflex': Layers,
  'Seragam & Kemeja': Briefcase,
  'Banner & Promosi': Flag,
  'Merchandise & Souvenir': Gift,
};

export default function HeroMarketplaceStage({
  selectedCategory,
  onSelectCategory,
  onSelectProduct,
}: Props) {
  const { products } = useAppConfig();
  const [hoveredCategory, setHoveredCategory] = useState<ProductCategory | null>(null);

  const dtfProduct = products.find((p) => p.id === 1) || products[0];
  const jerseyProduct = products.find((p) => p.id === 3) || products[2] || products[0];

  const handleCategoryClick = (cat: ProductCategory) => {
    onSelectCategory(cat);
    setHoveredCategory(null);
    const el = document.getElementById('katalog');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const hoveredProducts = hoveredCategory
    ? products.filter((p) => p.category === hoveredCategory)
    : [];

  return (
    <section className="bg-[#f8f9fa] border-b border-gray-200/80 pb-6">
      <div className="max-w-7xl mx-auto px-4">
        {/* Desktop Connected Category + Banner Grid (ATM xpressprint.id) */}
        <div className="flex flex-col lg:flex-row gap-4 pt-3 lg:pt-0 items-stretch relative">
          {/* Left Column: Connected Category Sidebar (Desktop Only, 240px width aligned with Secondary Navbar) */}
          <div
            className="hidden lg:block w-[240px] shrink-0 relative"
            onMouseLeave={() => setHoveredCategory(null)}
          >
            <div className="bg-white border border-t-0 border-gray-200 rounded-b-2xl shadow-sm overflow-hidden h-full flex flex-col justify-between">
              <div className="divide-y divide-gray-100">
                {PRODUCT_CATEGORIES.map((cat) => {
                  const Icon = categoryIcons[cat.id];
                  const isActive = selectedCategory === cat.id || hoveredCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onMouseEnter={() => setHoveredCategory(cat.id)}
                      onClick={() => handleCategoryClick(cat.id)}
                      className={`w-full flex items-center justify-between px-3.5 py-3 text-left transition-colors cursor-pointer ${
                        isActive ? 'bg-blue-50 text-blue-900' : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                            isActive
                              ? 'bg-blue-900 text-white'
                              : 'bg-blue-50 text-blue-800'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs font-semibold truncate">{cat.label}</span>
                      </div>
                      <ChevronRight
                        className={`w-3.5 h-3.5 shrink-0 ${
                          isActive ? 'text-blue-800' : 'text-gray-400'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              <div className="p-3 bg-blue-50/70 border-t border-blue-100 text-center">
                <p className="text-[11px] font-bold text-blue-900">Min. Order Mulai 1 Pcs</p>
                <p className="text-[10px] text-gray-600 mt-0.5">Kapasitas 3.000 pcs/minggu</p>
              </div>
            </div>

            {/* Flyout Submenu on Hover (matches xpressprint kategori-submenu-col) */}
            {hoveredCategory && hoveredProducts.length > 0 && (
              <div className="absolute left-full top-0 ml-2 w-[380px] bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 z-40">
                <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-gray-100">
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">{hoveredCategory}</h4>
                    <p className="text-[11px] text-gray-500">
                      {PRODUCT_CATEGORIES.find((c) => c.id === hoveredCategory)?.shortDesc}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCategoryClick(hoveredCategory)}
                    className="text-[11px] font-bold text-blue-800 hover:underline cursor-pointer"
                  >
                    Lihat Semua
                  </button>
                </div>
                <div className="space-y-2">
                  {hoveredProducts.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setHoveredCategory(null);
                        onSelectProduct(item);
                      }}
                      className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-blue-50/70 border border-transparent hover:border-blue-100 text-left transition-colors cursor-pointer"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 rounded-lg object-cover bg-gray-100 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-gray-900 truncate">{item.name}</p>
                        <p className="text-[11px] text-gray-500 truncate">
                          Min. {item.minOrder} · {item.eta}
                        </p>
                      </div>
                      <span className="text-[11px] font-bold text-blue-900 shrink-0">
                        {item.price}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Main Banner + 2 Side Promo Cards + 4-Column Feature Strip */}
          <div className="flex-1 min-w-0 lg:pt-4 flex flex-col gap-4">
            {/* Banner Row: Carousel (3/4 width) + Side Promos (1/4 width) */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-3.5 items-stretch">
              <div className="xl:col-span-3">
                <HeroBannerCarousel />
              </div>

              {/* 2 Stacked Side Promo Cards (Desktop/XL) */}
              <div className="hidden xl:grid grid-rows-2 gap-3 h-full">
                {dtfProduct && (
                  <button
                    type="button"
                    onClick={() => onSelectProduct(dtfProduct)}
                    className="group relative rounded-2xl overflow-hidden bg-gradient-to-br from-blue-900 to-blue-800 text-white p-3.5 text-left shadow-sm hover:shadow-md transition-all flex items-center justify-between gap-2.5 cursor-pointer"
                  >
                    <div className="min-w-0 z-10">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-200 block mb-0.5">
                        Layanan Kilat
                      </span>
                      <h4 className="text-sm font-extrabold leading-tight truncate">
                        Cetak DTF Meteran
                      </h4>
                      <p className="text-xs font-semibold text-amber-300 mt-0.5 truncate">
                        {dtfProduct.price}
                      </p>
                      <span className="inline-flex items-center gap-1 text-[11px] text-blue-100 mt-1.5 group-hover:text-white">
                        Pesan Sekarang <ArrowUpRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                    <img
                      src="/assets/katalog/katalog-dtf.png"
                      alt="Cetak DTF Meteran"
                      className="w-16 h-16 rounded-xl object-cover shrink-0 border border-white/20 group-hover:scale-105 transition-transform"
                    />
                  </button>
                )}

                {jerseyProduct && (
                  <button
                    type="button"
                    onClick={() => onSelectProduct(jerseyProduct)}
                    className="group relative rounded-2xl overflow-hidden bg-white border border-gray-200 hover:border-blue-300 p-3.5 text-left shadow-sm hover:shadow-md transition-all flex items-center justify-between gap-2.5 cursor-pointer"
                  >
                    <div className="min-w-0 z-10">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 block mb-0.5">
                        Produk Unggulan
                      </span>
                      <h4 className="text-sm font-extrabold text-gray-900 leading-tight truncate">
                        Jersey Sublim Custom
                      </h4>
                      <p className="text-xs text-gray-600 mt-0.5 truncate">
                        Min. Order 1 Pcs · Dry-fit
                      </p>
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-800 mt-1.5">
                        Lihat Detail <ArrowUpRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                    <img
                      src="/assets/katalog/katalog-jersey.png"
                      alt="Jersey Sublim Custom"
                      className="w-16 h-16 rounded-xl object-cover shrink-0 border border-gray-100 group-hover:scale-105 transition-transform"
                    />
                  </button>
                )}
              </div>
            </div>

            {/* 4-Column Features Strip (ATM xpressprint features-section-desktop) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-white rounded-xl p-3.5 border border-gray-200/80 shadow-2xs flex items-center gap-3 hover:-translate-y-0.5 transition-transform">
                <div className="w-10 h-10 rounded-lg bg-blue-900 text-white flex items-center justify-center shrink-0">
                  <Truck className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs sm:text-sm font-bold text-gray-900 truncate">
                    Kirim Kemanapun
                  </h3>
                  <p className="text-[11px] text-gray-500 truncate">Seluruh Indonesia</p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-3.5 border border-gray-200/80 shadow-2xs flex items-center gap-3 hover:-translate-y-0.5 transition-transform">
                <div className="w-10 h-10 rounded-lg bg-blue-900 text-white flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs sm:text-sm font-bold text-gray-900 truncate">
                    Berkualitas
                  </h3>
                  <p className="text-[11px] text-gray-500 truncate">QC Ketat &amp; Rapi</p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-3.5 border border-gray-200/80 shadow-2xs flex items-center gap-3 hover:-translate-y-0.5 transition-transform">
                <div className="w-10 h-10 rounded-lg bg-blue-900 text-white flex items-center justify-center shrink-0">
                  <Zap className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs sm:text-sm font-bold text-gray-900 truncate">
                    Kapasitas Besar
                  </h3>
                  <p className="text-[11px] text-gray-500 truncate">3.000 pcs / minggu</p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-3.5 border border-gray-200/80 shadow-2xs flex items-center gap-3 hover:-translate-y-0.5 transition-transform">
                <div className="w-10 h-10 rounded-lg bg-blue-900 text-white flex items-center justify-center shrink-0">
                  <Headphones className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs sm:text-sm font-bold text-gray-900 truncate">
                    Online Support
                  </h3>
                  <p className="text-[11px] text-gray-500 truncate">Konsultasi Gratis</p>
                </div>
              </div>
            </div>

            {/* Mobile Quick Category Grid (visible on < lg screens) */}
            <div className="lg:hidden bg-white rounded-2xl border border-gray-200/80 p-3.5 shadow-2xs">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-bold text-gray-900">Kategori Produk</span>
                <button
                  type="button"
                  onClick={() => onSelectCategory('Semua')}
                  className="text-[11px] font-semibold text-blue-800 cursor-pointer"
                >
                  Semua Layanan
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {PRODUCT_CATEGORIES.map((cat) => {
                  const Icon = categoryIcons[cat.id];
                  const active = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleCategoryClick(cat.id)}
                      className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-colors cursor-pointer ${
                        active
                          ? 'bg-blue-900 text-white border-blue-900'
                          : 'bg-gray-50 text-gray-700 border-gray-100 hover:bg-blue-50'
                      }`}
                    >
                      <Icon className="w-4 h-4 mb-1" />
                      <span className="text-[10px] font-semibold leading-tight line-clamp-2">
                        {cat.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
