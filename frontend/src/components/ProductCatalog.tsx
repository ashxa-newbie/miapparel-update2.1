import { Search, X, Clock, ArrowRight } from 'lucide-react';
import { Product, ProductCategory } from '../types';
import { useAppConfig } from '../contexts/ConfigContext';
import { PRODUCT_CATEGORIES } from '../data/categories';

type Props = {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: ProductCategory | 'Semua';
  onSelectCategory: (cat: ProductCategory | 'Semua') => void;
  onSelectProduct: (product: Product) => void;
};

const getCatalogImage = (product: Product) => {
  const lower = product.name.toLowerCase();
  if (lower.includes('dtf')) return '/assets/katalog/katalog-dtf.png';
  if (lower.includes('kaos')) return '/assets/katalog/katalog-kaos.png';
  if (lower.includes('jersey')) return '/assets/katalog/katalog-jersey.png';
  if (lower.includes('polo shirt')) return '/assets/katalog/katalog-polo.png';
  if (lower.includes('kemeja')) return '/assets/katalog/katalog-kemeja.png';
  if (lower.includes('polyflex')) return '/assets/katalog/katalog-polyflex.png';
  if (lower.includes('banner')) return '/assets/katalog/katalog-banner.png';
  if (lower.includes('lanyard')) return '/assets/katalog/katalog-lanyard.png';
  if (lower.includes('mug') || lower.includes('tumbler')) return '/assets/katalog/katalog-mug.png';
  if (lower.includes('topi')) return '/assets/katalog/katalog-topi.png';
  return product.image || '/assets/katalog/katalog-jersey.png';
};

export default function ProductCatalog({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  onSelectProduct,
}: Props) {
  const { products } = useAppConfig();

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === 'Semua' || product.category === selectedCategory;
    if (!matchesCategory) return false;

    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;

    const matchName = product.name.toLowerCase().includes(query);
    const matchDescription = product.description.toLowerCase().includes(query);
    const matchMaterial = product.materials?.some((m) => m.toLowerCase().includes(query));
    const matchCategory = product.category.toLowerCase().includes(query);
    return matchName || matchDescription || matchMaterial || matchCategory;
  });

  return (
    <section id="katalog" className="py-10 md:py-14 bg-[#f8f9fa]">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header with Dotted Hairline Rule (ATM xpressprint section-header) */}
        <div className="relative flex items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-3 bg-[#f8f9fa] pr-4 z-10">
            <h2 className="text-lg sm:text-xl font-extrabold text-gray-900 whitespace-nowrap">
              Produk Pilihan
            </h2>
            <span className="text-xs font-medium text-gray-500 whitespace-nowrap tabular-nums">
              ({filteredProducts.length} layanan)
            </span>
          </div>
          <div
            aria-hidden="true"
            className="hidden sm:block flex-1 h-1 border-b-2 border-dotted border-gray-300"
          />
          <button
            type="button"
            onClick={() => {
              onSelectCategory('Semua');
              onSearchChange('');
            }}
            className="bg-[#f8f9fa] pl-3 z-10 text-xs font-bold text-blue-800 hover:text-blue-950 flex items-center gap-1 whitespace-nowrap cursor-pointer"
          >
            <span>Lihat Semua</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-6">
          <button
            type="button"
            onClick={() => onSelectCategory('Semua')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              selectedCategory === 'Semua'
                ? 'bg-blue-900 text-white shadow-xs'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-blue-50 hover:text-blue-900'
            }`}
          >
            Semua Produk
          </button>
          {PRODUCT_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-blue-50 hover:text-blue-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Active Search Feedback */}
        {searchQuery && (
          <div className="mb-5 flex items-center justify-between bg-white px-4 py-2.5 rounded-xl border border-blue-100 text-xs text-gray-600">
            <span>
              Menampilkan <strong className="text-blue-800">{filteredProducts.length}</strong> produk
              untuk pencarian &quot;<strong>{searchQuery}</strong>&quot;
            </span>
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="text-blue-800 font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" /> Reset
            </button>
          </div>
        )}

        {/* Product Grid (5 columns on lg matching xpressprint card density) */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-14 bg-white rounded-2xl border border-gray-200 max-w-md mx-auto px-6">
            <Search className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <h4 className="text-gray-900 font-bold text-lg mb-1">Produk Tidak Ditemukan</h4>
            <p className="text-gray-500 text-sm mb-4">
              Tidak ada produk yang sesuai dengan filter atau pencarian Anda.
            </p>
            <button
              type="button"
              onClick={() => {
                onSearchChange('');
                onSelectCategory('Semua');
              }}
              className="text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 px-5 py-2.5 rounded-xl transition-colors cursor-pointer"
            >
              Tampilkan Semua Produk
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => onSelectProduct(product)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectProduct(product);
                  }
                }}
                role="button"
                tabIndex={0}
                className="bg-white rounded-xl overflow-hidden shadow-2xs border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all duration-200 cursor-pointer group flex flex-col h-full hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
              >
                {/* Square Product Visual */}
                <div className="aspect-square w-full overflow-hidden relative bg-gray-100">
                  <img
                    src={getCatalogImage(product)}
                    alt={product.name}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = product.image;
                    }}
                  />
                  {product.minOrder && (
                    <div className="absolute top-0 right-0 bg-blue-900/90 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg shadow-xs">
                      Min. {product.minOrder}
                    </div>
                  )}
                </div>

                {/* Product Body */}
                <div className="p-3 flex flex-col flex-grow">
                  <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide truncate mb-0.5">
                    {product.category}
                  </span>
                  <h4 className="text-[13px] sm:text-sm font-semibold text-gray-900 leading-snug mb-1.5 line-clamp-2 min-h-[2.35rem] group-hover:text-blue-800 transition-colors">
                    {product.name}
                  </h4>

                  <div className="text-[11px] text-gray-500 flex items-center gap-1.5 mb-2.5 truncate">
                    <span className="truncate">
                      {product.materials[0]}
                      {product.materials.length > 1 ? ` +${product.materials.length - 1}` : ''}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="inline-flex items-center gap-1 text-blue-800 font-medium shrink-0">
                      <Clock className="w-3 h-3" />
                      {product.eta}
                    </span>
                  </div>

                  <div className="mt-auto pt-2 border-t border-gray-100 flex items-center justify-between gap-2">
                    <span className="text-xs sm:text-sm font-bold text-blue-900 truncate tabular-nums">
                      {product.price}
                    </span>
                    <span className="text-[11px] font-semibold text-gray-500 group-hover:text-blue-800 shrink-0">
                      Detail &rarr;
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
