import { Phone, Mail, MapPin, Instagram, Facebook, Clock } from 'lucide-react';
import { useAppConfig } from '../contexts/ConfigContext';
import { PRODUCT_CATEGORIES } from '../data/categories';
import { ProductCategory } from '../types';

type Props = {
  onSelectCategory?: (cat: ProductCategory | 'Semua') => void;
};

export default function Footer({ onSelectCategory }: Props) {
  const { config: siteConfig } = useAppConfig();
  if (!siteConfig) return null;

  const shippingPartners = ['J&T Cargo', 'JNE', 'SiCepat', 'Instant Courier', 'Ambil di Workshop'];
  const paymentMethods = ['Transfer BCA', 'Mandiri', 'BRI', 'QRIS', 'Cash Workshop'];

  return (
    <footer className="bg-[#111827] text-gray-300 pt-12 pb-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4">
        {/* Top 4-Column Footer Grid (ATM xpressprint desktop-footer) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-gray-800">
          {/* Col 1: Brand + Social */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/logo.png"
                alt="MI Apparel Logo"
                className="h-10 w-auto object-contain brightness-0 invert"
              />
              <div className="flex flex-col leading-tight">
                <h3 className="text-lg font-extrabold italic uppercase text-white tracking-wide">
                  {siteConfig.name}
                </h3>
                <p className="text-[11px] text-gray-400 mt-0.5">{siteConfig.company}</p>
              </div>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed mb-4">
              {siteConfig.description}
            </p>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-2.5">
                Ikuti Kami
              </h4>
              <div className="flex items-center gap-2.5">
                <a
                  href={siteConfig.instagram.mainLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram MI Apparel"
                  className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-blue-800 text-gray-300 hover:text-white flex items-center justify-center transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="https://www.facebook.com/search/top?q=MI%20Apparel"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook MI Apparel"
                  className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-blue-800 text-gray-300 hover:text-white flex items-center justify-center transition-colors"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Col 2: Kategori Layanan */}
          <div>
            <h4 className="font-bold text-white mb-4 uppercase tracking-wider text-xs">
              Kategori Layanan
            </h4>
            <ul className="space-y-2 text-xs">
              {PRODUCT_CATEGORIES.map((cat) => (
                <li key={cat.id}>
                  <a
                    href="#katalog"
                    onClick={() => onSelectCategory?.(cat.id)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {cat.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Navigasi & Jam Layanan */}
          <div>
            <h4 className="font-bold text-white mb-4 uppercase tracking-wider text-xs">
              Informasi &amp; Bantuan
            </h4>
            <ul className="space-y-2 text-xs mb-6">
              <li>
                <a href="#katalog" className="text-gray-400 hover:text-white transition-colors">
                  Produk Pilihan
                </a>
              </li>
              <li>
                <a href="#paket-bisnis" className="text-gray-400 hover:text-white transition-colors">
                  Paket Tim &amp; Bisnis
                </a>
              </li>
              <li>
                <a href="#keunggulan" className="text-gray-400 hover:text-white transition-colors">
                  Keunggulan MI Apparel
                </a>
              </li>
              <li>
                <a href="#alur" className="text-gray-400 hover:text-white transition-colors">
                  Cara Mudah Order Online
                </a>
              </li>
              <li>
                <a href="#faq" className="text-gray-400 hover:text-white transition-colors">
                  Pertanyaan Umum (FAQ)
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Hubungi Kami & Jam Layanan */}
          <div>
            <h4 className="font-bold text-white mb-4 uppercase tracking-wider text-xs">
              Hubungi Kami
            </h4>
            <div className="space-y-2.5 text-xs mb-5">
              <p className="flex items-center gap-2 text-gray-300">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <span>{siteConfig.whatsapp.display}</span>
              </p>
              <p className="flex items-center gap-2 text-gray-300">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <span>{siteConfig.email}</span>
              </p>
              <a
                href={siteConfig.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>{siteConfig.address}</span>
              </a>
            </div>

            <div className="bg-gray-800/70 rounded-xl p-3 border border-gray-700/70">
              <div className="flex items-center gap-1.5 text-white font-bold text-xs mb-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-400" />
                <span>Jam Layanan (WIB)</span>
              </div>
              <p className="text-[11px] text-gray-300 tabular-nums">Senin–Jumat: 08.00 – 20.00</p>
              <p className="text-[11px] text-gray-300 tabular-nums">Sabtu: 08.00 – 18.00</p>
              <p className="text-[11px] text-red-400 font-semibold">Minggu: Libur</p>
            </div>
          </div>
        </div>

        {/* Middle Strip: Jasa Pengiriman & Metode Pembayaran */}
        <div className="py-6 border-b border-gray-800 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
              Jasa Pengiriman
            </h4>
            <div className="flex flex-wrap gap-2">
              {shippingPartners.map((partner) => (
                <span
                  key={partner}
                  className="text-[11px] font-semibold bg-gray-800 text-gray-200 border border-gray-700 px-3 py-1 rounded-md"
                >
                  {partner}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
              Metode Pembayaran
            </h4>
            <div className="flex flex-wrap gap-2">
              {paymentMethods.map((method) => (
                <span
                  key={method}
                  className="text-[11px] font-semibold bg-gray-800 text-gray-200 border border-gray-700 px-3 py-1 rounded-md"
                >
                  {method}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 text-center text-xs text-gray-500">
          &copy; {new Date().getFullYear()} {siteConfig.company} ({siteConfig.name}) — {siteConfig.tagline}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
