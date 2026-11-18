import { Clock, ArrowRight } from 'lucide-react';
import { Product } from '../types';
import { useAppConfig } from '../contexts/ConfigContext';

type Props = {
  onSelectProduct: (product: Product) => void;
};

export default function BusinessBentoSection({ onSelectProduct }: Props) {
  const { products } = useAppConfig();

  const findProduct = (id: number) => products.find((p) => p.id === id);

  const teamKitProducts = [
    findProduct(3), // Jersey Sublim Custom
    findProduct(2), // Kaos Sablon Custom
    findProduct(4), // Polo Shirt Custom
    findProduct(5), // Kemeja & Seragam Konveksi
  ].filter((p): p is Product => Boolean(p));

  const dtfProduct = findProduct(1); // Cetak DTF Meteran
  const lanyardProduct = findProduct(8); // Custom Lanyard
  const mugProduct = findProduct(10); // Mug & Tumbler Custom

  return (
    <section id="paket-bisnis" className="py-10 md:py-14 bg-white border-y border-gray-200/70">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header with Dotted Hairline Rule */}
        <div className="relative flex items-center justify-between gap-4 mb-6">
          <h2 className="text-lg sm:text-xl font-extrabold text-gray-900 bg-white pr-4 z-10 whitespace-nowrap">
            Penunjang Tim &amp; Bisnis Anda
          </h2>
          <div
            aria-hidden="true"
            className="hidden sm:block flex-1 h-1 border-b-2 border-dotted border-gray-300"
          />
          <a
            href="#katalog"
            className="bg-white pl-3 z-10 text-xs font-bold text-blue-800 hover:text-blue-950 flex items-center gap-1 whitespace-nowrap"
          >
            <span>Lihat Katalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Asymmetric 2-Column Bento Grid (ATM xpressprint Penunjang Bisnis Anda) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* Left Big Bento Box: 4-in-1 Apparel Kit */}
          <div className="lg:col-span-6 bg-[#f8f9fa] rounded-2xl border border-gray-200 p-5 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base sm:text-lg font-extrabold text-gray-900">
                  Seragam &amp; Apparel Tim
                </h3>
                <p className="text-xs text-gray-500">
                  Paket produksi konveksi &amp; jersey komunitas langsung dari workshop
                </p>
              </div>
              <span className="text-xs font-bold text-blue-900 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-lg whitespace-nowrap">
                Min. 1 Pcs
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3.5 flex-1">
              {teamKitProducts.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectProduct(item)}
                  className="bg-white rounded-xl border border-gray-200 hover:border-blue-400 hover:shadow-md p-3 text-left transition-all flex flex-col group cursor-pointer"
                >
                  <div className="aspect-square w-full rounded-lg overflow-hidden bg-gray-100 mb-2.5">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-gray-900 line-clamp-1 group-hover:text-blue-800">
                    {item.name}
                  </h4>
                  <div className="text-[11px] text-gray-500 flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3 text-blue-700" />
                    <span>{item.eta}</span>
                  </div>
                  <p className="text-xs font-bold text-blue-900 mt-1.5">{item.price}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Top Wide Promo Card + Bottom 2 Split Cards */}
          <div className="lg:col-span-6 flex flex-col gap-5">
            {/* Top Wide Card */}
            {dtfProduct && (
              <button
                type="button"
                onClick={() => onSelectProduct(dtfProduct)}
                className="group bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 text-white rounded-2xl p-5 sm:p-6 text-left shadow-sm hover:shadow-xl transition-all flex flex-col sm:flex-row items-center justify-between gap-5 cursor-pointer flex-1"
              >
                <div className="space-y-2 flex-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-200 block">
                    Layanan Sablon Digital Tercepat
                  </span>
                  <h3 className="text-xl sm:text-2xl font-extrabold leading-tight">
                    {dtfProduct.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
                    {dtfProduct.description} Lebar cetak 58 cm dengan warna solid &amp; siap press.
                  </p>
                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <span className="bg-white text-blue-950 text-xs font-extrabold px-3.5 py-2 rounded-lg">
                      {dtfProduct.price}
                    </span>
                    <span className="text-xs font-semibold text-blue-100 group-hover:text-white flex items-center gap-1">
                      Lihat Spesifikasi <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
                <div className="w-full sm:w-44 h-44 rounded-xl overflow-hidden bg-white/10 border border-white/20 shrink-0">
                  <img
                    src="/assets/katalog/katalog-dtf-2.png"
                    alt={dtfProduct.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </button>
            )}

            {/* Bottom 2 Split Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 flex-1">
              {lanyardProduct && (
                <button
                  type="button"
                  onClick={() => onSelectProduct(lanyardProduct)}
                  className="group bg-[#f8f9fa] hover:bg-blue-50/40 rounded-2xl border border-gray-200 hover:border-blue-300 p-4 text-left transition-all flex items-center gap-4 cursor-pointer"
                >
                  <img
                    src={lanyardProduct.image}
                    alt={lanyardProduct.name}
                    className="w-24 h-24 rounded-xl object-cover bg-white border border-gray-200 shrink-0 group-hover:scale-105 transition-transform"
                  />
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 block mb-0.5">
                      Event &amp; Kantor
                    </span>
                    <h3 className="text-sm sm:text-base font-extrabold text-gray-900 leading-snug group-hover:text-blue-900">
                      {lanyardProduct.name}
                    </h3>
                    <p className="text-[11px] text-gray-500 mt-1">
                      Min. {lanyardProduct.minOrder} · {lanyardProduct.eta}
                    </p>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-800 mt-2">
                      Detail <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </button>
              )}

              {mugProduct && (
                <button
                  type="button"
                  onClick={() => onSelectProduct(mugProduct)}
                  className="group bg-[#f8f9fa] hover:bg-blue-50/40 rounded-2xl border border-gray-200 hover:border-blue-300 p-4 text-left transition-all flex items-center gap-4 cursor-pointer"
                >
                  <img
                    src={mugProduct.image}
                    alt={mugProduct.name}
                    className="w-24 h-24 rounded-xl object-cover bg-white border border-gray-200 shrink-0 group-hover:scale-105 transition-transform"
                  />
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 block mb-0.5">
                      Corporate Gift
                    </span>
                    <h3 className="text-sm sm:text-base font-extrabold text-gray-900 leading-snug group-hover:text-blue-900">
                      {mugProduct.name}
                    </h3>
                    <p className="text-[11px] text-gray-500 mt-1">
                      Min. {mugProduct.minOrder} · {mugProduct.eta}
                    </p>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-800 mt-2">
                      Detail <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
