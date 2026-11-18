import { X, Trash2, Plus, Minus, MessageCircle, ShoppingBag, ExternalLink, FileCheck2 } from 'lucide-react';
import { InquiryItem } from '../types';
import { useAppConfig } from '../contexts/ConfigContext';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  items: InquiryItem[];
  onUpdateQty: (index: number, delta: number) => void;
  onRemoveItem: (index: number) => void;
  onClear: () => void;
};

export default function InquiryDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQty,
  onRemoveItem,
  onClear,
}: Props) {
  const { config: siteConfig } = useAppConfig();

  if (!isOpen || !siteConfig) return null;

  const totalUnits = items.reduce((acc, item) => acc + item.quantity, 0);

  const buildWhatsAppMessage = () => {
    const lines = [
      'Halo Admin MI Apparel, saya ingin konsultasi & memesan daftar produk berikut:',
      '',
      ...items.map((item, idx) => {
        const unitLabel = item.product.name.toLowerCase().includes('meteran')
          ? 'Roll/Paket'
          : 'Pcs';
        const parts = [
          `${idx + 1}. *${item.product.name}* — Jumlah: *${item.quantity} ${unitLabel}*`,
          `   • Bahan: ${item.selectedMaterial || item.product.materials?.[0] || 'Standar'}`,
        ];
        if (item.sizeOrLength) {
          parts.push(`   • Ukuran / Panjang: ${item.sizeOrLength}`);
        }
        if (item.customOptions && item.customOptions.length > 0) {
          parts.push(`   • Opsi Custom: ${item.customOptions.join(', ')}`);
        }
        if (item.note) {
          parts.push(`   • Catatan: ${item.note}`);
        }
        if (item.designUrl) {
          parts.push(
            `   • File Desain${item.designFileName ? ` (${item.designFileName})` : ''}: ${item.designUrl}`
          );
        }
        return parts.join('\n');
      }),
      '',
      'Mohon informasi estimasi harga total dan jadwal produksinya. Terima kasih!',
    ];
    return encodeURIComponent(lines.join('\n'));
  };

  return (
    <div className="fixed inset-0 z-[110] flex justify-end">
      <div
        className="fixed inset-0 bg-gray-900/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />
      <aside className="relative z-10 w-full max-w-md bg-white h-full shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-900 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base">Daftar Konsultasi Pesanan</h3>
              <p className="text-xs text-gray-500 tabular-nums">
                {items.length} jenis produk · {totalUnits} total item
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup daftar konsultasi"
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-gray-50/70">
          {items.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-16 h-16 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-gray-900 text-base mb-1">
                Daftar Konsultasi Masih Kosong
              </h4>
              <p className="text-xs text-gray-500 leading-relaxed max-w-xs mx-auto">
                Pilih produk dari katalog, lengkapi Form Order &amp; Upload Desain, lalu klik &quot;Tambah ke Daftar&quot; untuk mengirim beberapa pesanan sekaligus ke WhatsApp Admin.
              </p>
            </div>
          ) : (
            items.map((item, idx) => (
              <div
                key={`${item.product.id}-${idx}`}
                className="bg-white rounded-xl border border-gray-200 p-3.5 flex gap-3.5 shadow-2xs"
              >
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-16 h-16 rounded-lg object-cover bg-gray-100 border border-gray-100 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-bold text-sm text-gray-900 leading-snug line-clamp-1">
                      {item.product.name}
                    </h4>
                    <button
                      type="button"
                      onClick={() => onRemoveItem(idx)}
                      aria-label={`Hapus ${item.product.name}`}
                      className="text-gray-400 hover:text-red-600 p-1 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-600 mt-0.5 truncate">
                    Bahan: {item.selectedMaterial || item.product.materials?.[0] || 'Standar'}
                  </p>
                  {item.sizeOrLength && (
                    <p className="text-[11px] text-gray-500 mt-0.5 truncate">
                      Ukuran/Panjang: {item.sizeOrLength}
                    </p>
                  )}
                  {item.customOptions && item.customOptions.length > 0 && (
                    <p className="text-[11px] text-blue-800 mt-0.5 line-clamp-1">
                      Custom: {item.customOptions.join(', ')}
                    </p>
                  )}
                  {item.note && (
                    <p className="text-[11px] text-gray-500 italic mt-0.5 line-clamp-2">
                      Catatan: &ldquo;{item.note}&rdquo;
                    </p>
                  )}
                  {item.designUrl && (
                    <a
                      href={item.designUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-green-700 hover:text-green-800 hover:underline mt-1"
                    >
                      <FileCheck2 className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate max-w-[180px]">
                        {item.designFileName || 'Link Desain Terlampir'}
                      </span>
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                  )}
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs font-bold text-blue-900">{item.product.price}</span>
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                      <button
                        type="button"
                        onClick={() => onUpdateQty(idx, -1)}
                        aria-label="Kurangi jumlah"
                        className="px-2 py-1 text-gray-600 hover:bg-gray-200 transition-colors cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-2.5 text-xs font-bold text-gray-900 tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdateQty(idx, 1)}
                        aria-label="Tambah jumlah"
                        className="px-2 py-1 text-gray-600 hover:bg-gray-200 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-5 border-t border-gray-200 bg-white space-y-3">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Konsultasi &amp; Estimasi Penawaran Harga</span>
              <button
                type="button"
                onClick={onClear}
                className="text-red-600 hover:text-red-700 font-semibold cursor-pointer"
              >
                Kosongkan
              </button>
            </div>
            <a
              href={`https://wa.me/${siteConfig.whatsapp.number}?text=${buildWhatsAppMessage()}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-3.5 px-5 rounded-xl shadow-md transition-all text-sm"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Kirim Daftar ke WhatsApp ({items.length})</span>
            </a>
          </div>
        )}
      </aside>
    </div>
  );
}
