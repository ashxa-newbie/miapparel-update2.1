import { useState, useEffect, useRef, type FormEvent } from 'react';
import {
  MapPin,
  Instagram,
  Facebook,
  Search,
  ChevronDown,
  ChevronRight,
  Clock,
  ShoppingBag,
  Menu,
  X,
  Phone,
  MessageCircle,
  CheckCircle2,
  Mail,
} from 'lucide-react';
import { useAppConfig } from '../contexts/ConfigContext';
import { Product, ProductCategory } from '../types';
import { PRODUCT_CATEGORIES, WORKSHOP_BRANCHES } from '../data/categories';

type Props = {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: ProductCategory | 'Semua';
  onSelectCategory: (cat: ProductCategory | 'Semua') => void;
  onSelectProduct: (product: Product) => void;
  inquiryCount: number;
  onOpenInquiry: () => void;
  onGoHome?: (anchorId?: string) => void;
};

function getOperationalStatus() {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Jakarta',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(new Date());

  const getPart = (type: string) => parts.find((p) => p.type === type)?.value ?? '';
  const weekday = getPart('weekday');
  const hour = Number(getPart('hour'));
  const minute = Number(getPart('minute'));
  const currentMinutes = hour * 60 + minute;
  const openMinutes = 8 * 60;

  if (weekday === 'Sun') {
    return { isOpen: false, message: 'Hari Minggu kami libur' };
  }

  const closeMinutes = weekday === 'Sat' ? 18 * 60 : 20 * 60;
  const isOpen = currentMinutes >= openMinutes && currentMinutes < closeMinutes;

  return {
    isOpen,
    message: isOpen
      ? `Melayani s/d ${weekday === 'Sat' ? '18.00' : '20.00'} WIB`
      : 'Buka kembali pukul 08.00 WIB',
  };
}

export default function Header({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  onSelectProduct,
  inquiryCount,
  onOpenInquiry,
  onGoHome,
}: Props) {
  const { config: siteConfig, products } = useAppConfig();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isCityOpen, setIsCityOpen] = useState(false);
  const [isHoursOpen, setIsHoursOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(WORKSHOP_BRANCHES[0].city);
  const [status, setStatus] = useState(getOperationalStatus());

  const searchRef = useRef<HTMLDivElement>(null);
  const cityRef = useRef<HTMLDivElement>(null);
  const hoursRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = window.setInterval(() => setStatus(getOperationalStatus()), 60000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
      if (cityRef.current && !cityRef.current.contains(e.target as Node)) {
        setIsCityOpen(false);
      }
      if (hoursRef.current && !hoursRef.current.contains(e.target as Node)) {
        setIsHoursOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!siteConfig) return null;

  const searchResults = searchQuery.trim()
    ? products.filter((p) => {
        const q = searchQuery.toLowerCase().trim();
        return (
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.materials.some((m) => m.toLowerCase().includes(q)) ||
          p.category.toLowerCase().includes(q)
        );
      })
    : products.slice(0, 4);

  const handlePickCategory = (cat: ProductCategory | 'Semua') => {
    onSelectCategory(cat);
    setIsMobileMenuOpen(false);
    setTimeout(() => {
      const el = document.getElementById('katalog');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 60);
  };

  const handleAnchorNav = (anchorId?: string) => {
    setIsMobileMenuOpen(false);
    onGoHome?.(anchorId);
  };

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSearchFocused(false);
    onGoHome?.('katalog');
  };

  return (
    <>
      {/* 1. Top Bar (ATM xpressprint top-bar in MI Apparel Royal Blue) */}
      <div className="bg-blue-900 text-blue-50 text-[11px] py-1.5 px-4 w-full">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-1.5">
          <div className="flex flex-wrap justify-center items-center gap-3">
            <a
              href={`mailto:${siteConfig.email}`}
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>{siteConfig.email}</span>
            </a>
            <span className="hidden sm:inline opacity-40">|</span>
            <div className="flex items-center gap-2.5">
              <span className="hidden md:inline text-blue-100">Ikuti Kami:</span>
              <a
                href={siteConfig.instagram.mainLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram MI Apparel"
                className="hover:text-white transition-colors"
              >
                <Instagram className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://www.facebook.com/search/top?q=MI%20Apparel"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook MI Apparel"
                className="hover:text-white transition-colors"
              >
                <Facebook className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-4">
            <a href="#alur" onClick={() => handleAnchorNav('alur')} className="hover:text-white transition-colors whitespace-nowrap">
              Cara Order
            </a>
            <span className="opacity-40">|</span>
            <a href="#lokasi" onClick={() => handleAnchorNav('lokasi')} className="hover:text-white transition-colors whitespace-nowrap">
              Lokasi Workshop
            </a>
            <span className="opacity-40">|</span>
            <a href="#faq" onClick={() => handleAnchorNav('faq')} className="hover:text-white transition-colors whitespace-nowrap">
              FAQ
            </a>
          </div>
        </div>
      </div>

      {/* 2. Main Sticky Header (Logo + City Selector + Search Bar + Hours & Inquiry) */}
      <header className="bg-white sticky top-0 z-50 shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3 md:gap-5">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Buka menu navigasi"
              className="md:hidden p-2 -ml-2 text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <a
              href="#"
              onClick={() => handleAnchorNav()}
              className="flex items-center gap-2.5 shrink-0"
            >
              <img src="/logo.png" alt="MI Apparel Logo" className="h-9 sm:h-10 w-auto object-contain" />
              <div className="hidden sm:flex flex-col leading-none">
                <span className="text-base font-black italic text-gray-900 tracking-wide whitespace-nowrap">
                  {siteConfig.name}
                </span>
                <span className="mt-0.5 text-[10px] text-gray-500 font-medium whitespace-nowrap">
                  {siteConfig.tagline}
                </span>
              </div>
            </a>
          </div>

          {/* City / Area Selector (Desktop) */}
          <div className="relative hidden lg:block shrink-0" ref={cityRef}>
            <button
              type="button"
              onClick={() => setIsCityOpen(!isCityOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-full border border-gray-200 bg-gray-50 hover:bg-blue-50 hover:border-blue-200 text-xs font-semibold text-gray-700 transition-colors cursor-pointer whitespace-nowrap"
            >
              <MapPin className="w-3.5 h-3.5 text-blue-800 shrink-0" />
              <span>{selectedBranch}</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            </button>

            {isCityOpen && (
              <div className="absolute left-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 p-3 z-50">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-2 mb-2">
                  Area Layanan &amp; Workshop
                </p>
                <div className="space-y-1.5">
                  {WORKSHOP_BRANCHES.map((branch) => (
                    <button
                      key={branch.city}
                      type="button"
                      onClick={() => {
                        setSelectedBranch(branch.city);
                        setIsCityOpen(false);
                      }}
                      className={`w-full text-left p-2.5 rounded-lg transition-colors cursor-pointer ${
                        selectedBranch === branch.city
                          ? 'bg-blue-50 border border-blue-200'
                          : 'hover:bg-gray-50 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-900">{branch.city}</span>
                        {selectedBranch === branch.city && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-700" />
                        )}
                      </div>
                      <p className="text-[11px] text-gray-600 mt-0.5">{branch.label}</p>
                      <p className="text-[10px] text-blue-700 font-medium mt-0.5">{branch.eta}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Central Search Bar with Instant Dropdown */}
          <div className="flex-1 max-w-xl relative" ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  setIsSearchFocused(true);
                }}
                placeholder="Mau produksi apa hari ini? (Jersey, DTF, Kaos...)"
                className="w-full pl-4 pr-11 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-full text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-800 focus:bg-white transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  aria-label="Hapus kata kunci"
                  className="absolute right-10 p-1 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                type="submit"
                aria-label="Cari produk"
                className="absolute right-1.5 w-8 h-8 rounded-full bg-blue-900 hover:bg-blue-800 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>

            {/* Instant Search Dropdown */}
            {isSearchFocused && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 z-50">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    {searchQuery.trim()
                      ? `Hasil Pencarian (${searchResults.length})`
                      : 'Produk Populer MI Apparel'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsSearchFocused(false)}
                    className="text-xs text-gray-400 hover:text-gray-700 cursor-pointer"
                  >
                    Tutup
                  </button>
                </div>

                {searchResults.length === 0 ? (
                  <p className="text-xs text-gray-500 py-4 text-center">
                    Produk &quot;{searchQuery}&quot; tidak ditemukan. Coba kata kunci seperti Jersey, DTF, Kaos, atau Lanyard.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {searchResults.slice(0, 6).map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setIsSearchFocused(false);
                          onSelectProduct(item);
                        }}
                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-blue-50/70 border border-transparent hover:border-blue-100 text-left transition-colors cursor-pointer"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-11 h-11 rounded-lg object-cover bg-gray-100 shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-gray-900 truncate">{item.name}</p>
                          <p className="text-[11px] text-blue-800 font-semibold truncate">
                            {item.price}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Header Actions: Operational Status, Inquiry Bag, WhatsApp CTA */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Operational Status Dropdown */}
            <div className="relative hidden sm:block" ref={hoursRef}>
              <button
                type="button"
                onClick={() => setIsHoursOpen(!isHoursOpen)}
                title="Jam Layanan Workshop"
                className="flex items-center gap-2 px-3 py-2 rounded-full border border-gray-200 hover:border-blue-200 bg-gray-50 hover:bg-blue-50/50 text-xs font-semibold text-gray-800 transition-colors cursor-pointer whitespace-nowrap"
              >
                <Clock
                  className={`w-4 h-4 ${status.isOpen ? 'text-green-600' : 'text-red-500'}`}
                />
                <span className="hidden xl:inline">
                  {status.isOpen ? 'Buka Hari Ini' : 'Sedang Tutup'}
                </span>
              </button>

              {isHoursOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-200 p-4 z-50">
                  <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center ${
                        status.isOpen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}
                    >
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900">
                        {status.isOpen ? 'Workshop Sedang Buka' : 'Workshop Sedang Tutup'}
                      </p>
                      <p className="text-[11px] text-gray-500">{status.message}</p>
                    </div>
                  </div>
                  <div className="pt-3 space-y-1.5 text-xs tabular-nums">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Senin – Jumat</span>
                      <span className="font-bold text-gray-900">08.00 – 20.00 WIB</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Sabtu</span>
                      <span className="font-bold text-gray-900">08.00 – 18.00 WIB</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Minggu</span>
                      <span className="font-bold text-red-600">Libur</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Inquiry Cart Button */}
            <button
              type="button"
              onClick={onOpenInquiry}
              aria-label="Buka daftar konsultasi pesanan"
              className="relative p-2.5 rounded-full border border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-gray-700 hover:text-blue-900 transition-colors cursor-pointer"
            >
              <ShoppingBag className="w-5 h-5" />
              {inquiryCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-blue-900 text-white text-[10px] font-bold flex items-center justify-center tabular-nums shadow-sm">
                  {inquiryCount}
                </span>
              )}
            </button>

            {/* Primary WhatsApp CTA */}
            <a
              href={`https://wa.me/${siteConfig.whatsapp.number}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-2 bg-blue-900 hover:bg-blue-800 text-white px-4 py-2.5 rounded-full text-xs font-bold transition-all shadow-sm whitespace-nowrap shrink-0"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Hubungi Admin</span>
            </a>
          </div>
        </div>

        {/* 3. Secondary Brand Navbar (Desktop Only — matches xpressprint secondary-navbar) */}
        <div className="hidden md:block bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white">
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
            <div className="flex items-center">
              {/* Connected Category Header Title (240px width aligned with Hero sidebar) */}
              <button
                type="button"
                onClick={() => handlePickCategory('Semua')}
                className="w-[240px] flex items-center justify-between px-4 py-2.5 bg-blue-950/50 hover:bg-blue-950/70 text-xs font-bold tracking-wide transition-colors cursor-pointer shrink-0"
              >
                <span>KATEGORI LAYANAN</span>
                <ChevronDown className="w-4 h-4 opacity-80" />
              </button>

              <nav className="flex items-center gap-1 pl-4">
                <a
                  href="#katalog"
                  onClick={() => {
                    onSelectCategory('Semua');
                    handleAnchorNav('katalog');
                  }}
                  className={`px-3 py-2.5 text-xs font-medium hover:bg-white/10 transition-colors whitespace-nowrap ${
                    selectedCategory === 'Semua' ? 'text-white font-semibold' : 'text-blue-100'
                  }`}
                >
                  Produk Pilihan
                </a>
                <a
                  href="#paket-bisnis"
                  onClick={() => handleAnchorNav('paket-bisnis')}
                  className="px-3 py-2.5 text-xs font-medium text-blue-100 hover:text-white hover:bg-white/10 transition-colors whitespace-nowrap"
                >
                  Paket Tim &amp; Bisnis
                </a>
                <a
                  href="#keunggulan"
                  onClick={() => handleAnchorNav('keunggulan')}
                  className="px-3 py-2.5 text-xs font-medium text-blue-100 hover:text-white hover:bg-white/10 transition-colors whitespace-nowrap"
                >
                  Keunggulan
                </a>
                <a
                  href="#alur"
                  onClick={() => handleAnchorNav('alur')}
                  className="px-3 py-2.5 text-xs font-medium text-blue-100 hover:text-white hover:bg-white/10 transition-colors whitespace-nowrap"
                >
                  Cara Order
                </a>
                <a
                  href="#lokasi"
                  onClick={() => handleAnchorNav('lokasi')}
                  className="px-3 py-2.5 text-xs font-medium text-blue-100 hover:text-white hover:bg-white/10 transition-colors whitespace-nowrap"
                >
                  Temukan Kami
                </a>
              </nav>
            </div>

            <a
              href={`tel:${siteConfig.whatsapp.number}`}
              className="flex items-center gap-1.5 text-xs text-blue-100 hover:text-white py-2 whitespace-nowrap shrink-0"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>CS: {siteConfig.whatsapp.display}</span>
            </a>
          </div>
        </div>

        {/* Mobile Slide-down Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 shadow-xl px-4 py-4 space-y-4">
            <div className="flex items-center justify-between text-xs bg-gray-50 px-3 py-2.5 rounded-xl border border-gray-200">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-800" />
                <span className="font-semibold text-gray-800">{selectedBranch}</span>
              </div>
              <span
                className={`font-bold ${status.isOpen ? 'text-green-700' : 'text-red-600'}`}
              >
                {status.isOpen ? 'Buka' : 'Tutup'}
              </span>
            </div>

            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                Kategori Layanan
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                {PRODUCT_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handlePickCategory(cat.id)}
                    className="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-50 hover:bg-blue-50 text-xs font-semibold text-gray-800 text-left cursor-pointer"
                  >
                    <span className="truncate">{cat.label}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-2 border-t border-gray-100 text-sm font-semibold text-gray-700">
              <a href="#katalog" onClick={() => handleAnchorNav('katalog')}>
                Produk Pilihan
              </a>
              <a href="#paket-bisnis" onClick={() => handleAnchorNav('paket-bisnis')}>
                Paket Tim &amp; Bisnis
              </a>
              <a href="#keunggulan" onClick={() => handleAnchorNav('keunggulan')}>
                Keunggulan Kami
              </a>
              <a href="#alur" onClick={() => handleAnchorNav('alur')}>
                Cara Order
              </a>
              <a href="#lokasi" onClick={() => handleAnchorNav('lokasi')}>
                Temukan Kami
              </a>
            </div>

            <a
              href={`https://wa.me/${siteConfig.whatsapp.number}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-blue-900 text-white py-3 rounded-xl text-sm font-bold"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Hubungi Admin WhatsApp</span>
            </a>
          </div>
        )}
      </header>
    </>
  );
}
