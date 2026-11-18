import { useState, useEffect } from 'react';
import { X, CheckCircle2, MessageCircle, Share2, Check, ShoppingBag } from 'lucide-react';
import { Product } from '../types';
import { useAppConfig } from '../contexts/ConfigContext';

const getModalProductImage = (product: Product) => {
  const lower = product.name.toLowerCase().trim();
  if (lower.includes('jersey')) return '/assets/katalog/katalog-jersey-2.png';
  if (lower.includes('kaos')) return '/assets/katalog/katalog-kaos-2.png';
  if (lower.includes('dtf')) return '/assets/katalog/katalog-dtf-2.png';
  if (lower.includes('polo')) return '/assets/katalog/katalog-polo-2.png';
  if (lower.includes('kemeja')) return '/assets/katalog/katalog-kemeja-2.png';
  if (lower.includes('polyflex')) return '/assets/katalog/katalog-polyflex-2.png';
  if (lower.includes('banner')) return '/assets/katalog/katalog-banner-2.png';
  if (lower.includes('lanyard')) return '/assets/katalog/katalog-lanyard-2.png';
  if (lower.includes('mug') || lower.includes('tumbler')) return '/assets/katalog/katalog-mug-2.png';
  if (lower.includes('topi')) return '/assets/katalog/katalog-topi-2.png';
  return product.image || '/assets/katalog/katalog-jersey-2.png';
};

type Props = {
  product: Product | null;
  onClose: () => void;
  onAddToInquiry?: (product: Product, selectedMaterial?: string) => void;
};

export default function ProductModal({ product, onClose, onAddToInquiry }: Props) {
  const { config: siteConfig } = useAppConfig();
  const [isCopied, setIsCopied] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<string>('');
  const [addedFeedback, setAddedFeedback] = useState(false);

  useEffect(() => {
    if (product) {
      setSelectedMaterial(product.materials?.[0] || '');
      setAddedFeedback(false);
    }
  }, [product]);

  if (!product || !siteConfig) return null;

  const handleShare = async () => {
    const shareData = {
      title: `${product.name} - ${siteConfig.name}`,
      text: `Cek ${product.name} di ${siteConfig.name}!\n`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share canceled or failed', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}${shareData.url}`);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy', err);
      }
    }
  };

  const handleAdd = () => {
    if (onAddToInquiry) {
      onAddToInquiry(product, selectedMaterial || product.materials?.[0]);
      setAddedFeedback(true);
      setTimeout(() => setAddedFeedback(false), 1800);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-white w-full max-w-4xl rounded-2xl max-h-[90vh] flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-white z-10 p-5 border-b border-gray-100 flex justify-between items-center rounded-t-2xl shrink-0">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-800 block">
              {product.category}
            </span>
            <h3 className="font-bold text-gray-900 text-xl">Detail Spesifikasi</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              title="Bagikan produk ini"
              aria-label="Bagikan produk ini"
              className="p-2 bg-gray-100 rounded-full hover:bg-blue-100 text-gray-600 hover:text-blue-600 transition-colors relative cursor-pointer"
            >
              {isCopied ? <Check className="w-5 h-5 text-green-600" /> : <Share2 className="w-5 h-5" />}
              {isCopied && (
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-bold bg-gray-800 text-white px-2 py-1 rounded">
                  Tersalin!
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup detail produk"
              className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 text-gray-600 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-0 overflow-y-auto overscroll-contain">
          <div className="md:grid md:grid-cols-2">
            <div className="w-full bg-gray-100 flex items-center justify-center overflow-hidden">
              <img
                src={getModalProductImage(product)}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full aspect-square object-contain"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = product.image;
                }}
              />
            </div>

            <div className="p-6 w-full">
              <h4 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h4>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">{product.description}</p>

              <div className="space-y-5 mb-6">
                <div>
                  <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">
                    Pilihan Custom
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {product.customOptions?.map((c) => (
                      <span
                        key={c}
                        className="px-3 py-1.5 bg-blue-50 text-blue-800 text-xs font-semibold rounded-lg border border-blue-100"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">
                    Pilih Bahan (Klik untuk Konsultasi)
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {product.materials?.map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setSelectedMaterial(m)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                          selectedMaterial === m
                            ? 'bg-blue-900 text-white border-blue-900'
                            : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <h5 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                      Minimum Order
                    </h5>
                    <p className="text-sm font-bold text-gray-900">{product.minOrder}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <h5 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                      Estimasi Waktu
                    </h5>
                    <p className="text-sm font-bold text-green-600 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      {product.eta}
                    </p>
                  </div>
                </div>

                <div>
                  <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">
                    Ukuran Tersedia
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes?.map((s) => (
                      <span
                        key={s}
                        className="px-3 py-1.5 bg-white border border-gray-200 text-gray-700 text-xs font-semibold rounded-lg"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Harga Estimasi</p>
                    <p className="text-xl font-bold text-blue-900">{product.price}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl shrink-0 flex flex-col sm:flex-row gap-3">
          {onAddToInquiry && (
            <button
              type="button"
              onClick={handleAdd}
              className="flex items-center justify-center gap-2 flex-1 bg-white hover:bg-blue-50 text-blue-900 border border-blue-200 font-bold py-3.5 px-5 rounded-xl transition-all text-sm cursor-pointer"
            >
              {addedFeedback ? (
                <>
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-green-700">Ditambahkan ke Daftar!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-5 h-5" />
                  <span>Tambah ke Daftar Konsultasi</span>
                </>
              )}
            </button>
          )}

          <a
            href={`https://wa.me/${siteConfig.whatsapp.number}?text=${encodeURIComponent(
              `${siteConfig.whatsapp.messageTemplate} *${product.name}*${
                selectedMaterial ? ` (Bahan: ${selectedMaterial})` : ''
              }.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 flex-1 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-3.5 px-6 rounded-xl shadow-md hover:shadow-lg transition-all text-sm"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Pesan Langsung via WA</span>
          </a>
        </div>
      </div>
    </div>
  );
}
