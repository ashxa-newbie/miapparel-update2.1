import { useState, useEffect, type FormEvent } from 'react';
import {
  Search,
  Package,
  Printer,
  Scissors,
  Truck,
  CheckCircle2,
  Clock,
  AlertCircle,
  MessageCircle,
  RotateCcw,
  Sparkles,
  Layers,
  Calendar,
  Users
} from 'lucide-react';
import { useAppConfig } from '../contexts/ConfigContext';
import { OrderTracking, ProductionPhase } from '../types';

// Client-side fallback dataset in case of network issue
const fallbackOrders: OrderTracking[] = [
  {
    orderId: 'MI-7821',
    customerName: 'Fajar Pratama',
    teamName: 'Garuda FC Tangerang',
    productName: 'Jersey Sepak Bola Sublim Full Print',
    quantity: 24,
    orderDate: '3 September 2026',
    estimatedCompletion: '8 September 2026',
    currentPhase: 'printing',
    phasePercentage: 45,
    statusTitle: 'Tahap Printing Sublim & Heat Press',
    notes: 'Kertas sublimasi telah dicetak dengan tinta original Epson Hi-Definition. Saat ini proses transfer panas (heat press roll) ke kain Milano Anti-UV.',
    details: {
      material: 'Dry-fit Milano 150gsm',
      model: 'Jersey Setelan (Baju + Celana)',
      collar: 'V-Neck Rib Hitam',
      sleeve: 'Lengan Pendek'
    },
    timeline: [
      {
        phase: 'queue',
        title: 'Konfirmasi Desain & Antrean',
        date: '3 Sep 2026, 09:30 WIB',
        completed: true,
        current: false,
        description: 'Mockup vector dan data nama/nomor pemain disetujui.'
      },
      {
        phase: 'printing',
        title: 'Printing Sublim & Press',
        date: '5 Sep 2026, 14:15 WIB',
        completed: false,
        current: true,
        description: 'Pencetakan pola jersey pada kain dan proses sublimasi suhu 200°C.'
      },
      {
        phase: 'sewing',
        title: 'Cutting & Jahit (Sewing)',
        date: 'Estimasi: 6 Sep 2026',
        completed: false,
        current: false,
        description: 'Pemotongan pola presisi dan perakitan jahit kumis/rantai.'
      },
      {
        phase: 'shipping',
        title: 'QC & Pengiriman (Shipping)',
        date: 'Estimasi: 8 Sep 2026',
        completed: false,
        current: false,
        description: 'Pemeriksaan kualitas akhir, steam uap, dan pengiriman.'
      }
    ]
  },
  {
    orderId: 'MI-6540',
    customerName: 'Rian Hendrawan',
    teamName: 'Bintang Muda Volleyball Club',
    productName: 'Jersey Voli Custom Full Print',
    quantity: 18,
    orderDate: '1 September 2026',
    estimatedCompletion: '6 September 2026',
    currentPhase: 'sewing',
    phasePercentage: 75,
    statusTitle: 'Tahap Cutting Pola & Penjahitan (Sewing)',
    notes: 'Semua lembaran kain sublim telah lolos inspeksi warna dan kini sedang dirakit di lini penjahitan (pasang kerah O-neck & jahit obras 4 benang).',
    details: {
      material: 'Dry-fit Benzema Breathable',
      model: 'Atasan Jersey Voli Tanpa Lengan',
      collar: 'O-Neck Solid Navy',
      sleeve: 'Sleeveless'
    },
    timeline: [
      {
        phase: 'queue',
        title: 'Konfirmasi Desain & Antrean',
        date: '1 Sep 2026, 11:00 WIB',
        completed: true,
        current: false,
        description: 'Data pemain dan sponsor dada telah disetujui.'
      },
      {
        phase: 'printing',
        title: 'Printing Sublim & Press',
        date: '3 Sep 2026, 16:30 WIB',
        completed: true,
        current: false,
        description: 'Pewarnaan sublimasi selesai dengan warna cerah dan tajam.'
      },
      {
        phase: 'sewing',
        title: 'Cutting & Jahit (Sewing)',
        date: '5 Sep 2026, 10:00 WIB',
        completed: false,
        current: true,
        description: 'Kain sedang dijahit oleh operator konveksi profesional.'
      },
      {
        phase: 'shipping',
        title: 'QC & Pengiriman (Shipping)',
        date: 'Estimasi: 6 Sep 2026',
        completed: false,
        current: false,
        description: 'Quality control benang, packing satuan, dan kirim.'
      }
    ]
  },
  {
    orderId: 'MI-5120',
    customerName: 'Agus Setiawan',
    teamName: 'Komunitas Gowes Serpong BSD',
    productName: 'Jersey Sepeda Roadbike Zipper',
    quantity: 32,
    orderDate: '28 Agustus 2026',
    estimatedCompletion: '5 September 2026',
    currentPhase: 'shipping',
    phasePercentage: 95,
    statusTitle: 'Tahap Pengiriman (Shipping) / Siap Diambil',
    notes: 'Produksi selesai 100%. Telah melewati QC ketat, dipacking polybag ziplock per ukuran, dan telah diserahkan ke kurir ekspedisi (No. Resi: JT9928192301).',
    details: {
      material: 'Dry-fit Brazil Premium + Mesh Ventilasi',
      model: 'Jersey Sepeda Resleting Depan Penuh',
      collar: 'Kerah Stand Collar',
      sleeve: 'Lengan Pendek + 3 Kantong Belakang'
    },
    timeline: [
      {
        phase: 'queue',
        title: 'Konfirmasi Desain & Antrean',
        date: '28 Ags 2026, 10:20 WIB',
        completed: true,
        current: false,
        description: 'Desain jersey sepeda dan ukuran disetujui.'
      },
      {
        phase: 'printing',
        title: 'Printing Sublim & Press',
        date: '30 Ags 2026, 15:40 WIB',
        completed: true,
        current: false,
        description: 'Hasil cetak tajam dengan gradasi presisi tinggi.'
      },
      {
        phase: 'sewing',
        title: 'Cutting & Jahit (Sewing)',
        date: '2 Sep 2026, 17:00 WIB',
        completed: true,
        current: false,
        description: 'Pemasangan ritsleting YKK dan saku belakang tuntas.'
      },
      {
        phase: 'shipping',
        title: 'QC & Pengiriman (Shipping)',
        date: '5 Sep 2026, 09:15 WIB',
        completed: true,
        current: true,
        description: 'Paket telah dikirim via ekspedisi J&T Cargo.'
      }
    ]
  }
];

const sampleOrders = [
  { id: 'MI-7821', phase: 'Printing', label: 'Cetak Sublim' },
  { id: 'MI-6540', phase: 'Sewing', label: 'Jahit Pola' },
  { id: 'MI-5120', phase: 'Shipping', label: 'Pengiriman' }
];

export default function OrderStatusTracker() {
  const { config: siteConfig } = useAppConfig();
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState<OrderTracking | null>(null);
  const [notFoundQuery, setNotFoundQuery] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const fetchOrder = async (queryId: string) => {
    const cleanId = queryId.trim().toUpperCase();
    if (!cleanId) return;

    setLoading(true);
    setNotFoundQuery(null);
    setHasSearched(true);

    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(cleanId)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.found && data.order) {
          setOrderData(data.order);
          setLoading(false);
          return;
        }
      }
    } catch {
      // Backend request fallback to local dataset
    }

    // Fallback search locally
    const matched = fallbackOrders.find(
      (o) =>
        o.orderId.toUpperCase() === cleanId ||
        o.orderId.replace(/[^A-Z0-9]/g, '') === cleanId.replace(/[^A-Z0-9]/g, '')
    );

    if (matched) {
      setOrderData(matched);
      setNotFoundQuery(null);
    } else {
      setOrderData(null);
      setNotFoundQuery(cleanId);
    }
    setLoading(false);
  };

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      fetchOrder(searchInput);
    }
  };

  const handleSelectSample = (sampleId: string) => {
    setSearchInput(sampleId);
    fetchOrder(sampleId);
  };

  const handleReset = () => {
    setSearchInput('');
    setOrderData(null);
    setNotFoundQuery(null);
    setHasSearched(false);
  };

  const getPhaseBadge = (phase: ProductionPhase) => {
    switch (phase) {
      case 'printing':
        return {
          icon: Printer,
          text: 'Fase Printing Sublim',
          bg: 'bg-blue-50 text-blue-700 border-blue-200',
          dot: 'bg-blue-600',
          gradient: 'from-blue-600 to-indigo-600'
        };
      case 'sewing':
        return {
          icon: Scissors,
          text: 'Fase Cutting & Jahit (Sewing)',
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          dot: 'bg-emerald-600',
          gradient: 'from-emerald-600 to-teal-600'
        };
      case 'shipping':
        return {
          icon: Truck,
          text: 'Fase Pengiriman (Shipping)',
          bg: 'bg-purple-50 text-purple-700 border-purple-200',
          dot: 'bg-purple-600',
          gradient: 'from-purple-600 to-indigo-700'
        };
      case 'completed':
        return {
          icon: CheckCircle2,
          text: 'Produksi Selesai',
          bg: 'bg-green-50 text-green-700 border-green-200',
          dot: 'bg-green-600',
          gradient: 'from-green-600 to-emerald-600'
        };
      default:
        return {
          icon: Clock,
          text: 'Antrean Desain',
          bg: 'bg-amber-50 text-amber-700 border-amber-200',
          dot: 'bg-amber-600',
          gradient: 'from-amber-600 to-orange-600'
        };
    }
  };

  return (
    <section id="lacak-pesanan" className="py-16 md:py-24 bg-white border-b border-gray-100 relative">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-200/80 rounded-full text-blue-800 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Tracking Produksi Jersey</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-3">
            Lacak Status Pesanan Anda
          </h2>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            Pantau perkembangan produksi pesanan jersey Anda secara transparan, mulai dari proses cetak sublimasi,
            penjahitan, hingga tahap pengiriman ke lokasi Anda.
          </p>
        </div>

        {/* Search Box Card */}
        <div className="max-w-3xl mx-auto bg-gray-50/90 rounded-2xl p-4 sm:p-6 border border-gray-200/80 shadow-sm mb-8">
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Masukkan Nomor Order (Contoh: MI-7821)"
                className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-300 rounded-xl text-sm sm:text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent font-medium shadow-xs uppercase tracking-wide"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !searchInput.trim()}
              className="bg-blue-900 hover:bg-blue-800 disabled:opacity-50 text-white font-bold px-7 py-3.5 rounded-xl text-sm transition-all shadow-md hover:shadow-blue-900/20 flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
                  <span>Memeriksa...</span>
                </>
              ) : (
                <>
                  <Package className="w-4 h-4" />
                  <span>Cek Status</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Sample Selector */}
          <div className="mt-4 pt-4 border-t border-gray-200/70 flex flex-wrap items-center gap-2 text-xs text-gray-500">
            <span className="font-semibold text-gray-700">Coba Contoh ID:</span>
            {sampleOrders.map((sample) => (
              <button
                key={sample.id}
                type="button"
                onClick={() => handleSelectSample(sample.id)}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-300 text-gray-700 hover:text-blue-900 rounded-lg font-mono text-xs font-bold transition-colors cursor-pointer shadow-2xs"
              >
                <span>{sample.id}</span>
                <span className="text-[10px] text-gray-400 font-sans font-normal">({sample.label})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Results Container */}
        {orderData && (
          <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-bottom-4">
            {/* Result Header */}
            {(() => {
              const badge = getPhaseBadge(orderData.currentPhase);
              const BadgeIcon = badge.icon;
              return (
                <div className="p-6 sm:p-8 bg-gradient-to-r from-blue-900 via-blue-950 to-gray-900 text-white relative">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
                        <span className="font-mono text-xl sm:text-2xl font-black tracking-wider text-blue-200">
                          {orderData.orderId}
                        </span>
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${badge.bg}`}>
                          <span className={`w-2 h-2 rounded-full ${badge.dot} animate-pulse`}></span>
                          <BadgeIcon className="w-3.5 h-3.5" />
                          <span>{badge.text}</span>
                        </div>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-white leading-tight">
                        {orderData.productName}
                      </h3>
                    </div>

                    <button
                      type="button"
                      onClick={handleReset}
                      className="self-start sm:self-center text-xs font-semibold text-gray-300 hover:text-white bg-white/10 hover:bg-white/20 px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Cari Lain</span>
                    </button>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-6 pt-5 border-t border-white/15">
                    <div className="flex justify-between text-xs font-semibold text-blue-200 mb-2">
                      <span>Progres Produksi Keseluruhan</span>
                      <span>{orderData.phasePercentage}% Selesai</span>
                    </div>
                    <div className="w-full h-2.5 bg-white/20 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${badge.gradient} transition-all duration-1000 ease-out`}
                        style={{ width: `${orderData.phasePercentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Stepper Phases */}
            <div className="p-6 sm:p-8 bg-gray-50/50 border-b border-gray-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-6">
                Tahapan Pengerjaan Produksi
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {orderData.timeline.map((step, idx) => {
                  let stepIcon = Clock;
                  if (step.phase === 'printing') stepIcon = Printer;
                  if (step.phase === 'sewing') stepIcon = Scissors;
                  if (step.phase === 'shipping') stepIcon = Truck;

                  const StepIcon = stepIcon;

                  return (
                    <div
                      key={step.phase + idx}
                      className={`relative p-4 rounded-xl border transition-all ${
                        step.current
                          ? 'bg-blue-50/80 border-blue-300 shadow-sm ring-2 ring-blue-500/20'
                          : step.completed
                          ? 'bg-white border-green-200 shadow-2xs'
                          : 'bg-gray-50 border-gray-200/80 opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-2.5">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                            step.completed
                              ? 'bg-green-100 text-green-700'
                              : step.current
                              ? 'bg-blue-600 text-white animate-pulse'
                              : 'bg-gray-200 text-gray-500'
                          }`}
                        >
                          {step.completed ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : (
                            <StepIcon className="w-4 h-4" />
                          )}
                        </div>
                        <span className="text-[11px] font-mono text-gray-400 font-bold">
                          Step 0{idx + 1}
                        </span>
                      </div>

                      <h5
                        className={`text-sm font-bold leading-tight mb-1 ${
                          step.current
                            ? 'text-blue-900'
                            : step.completed
                            ? 'text-gray-900'
                            : 'text-gray-500'
                        }`}
                      >
                        {step.title}
                      </h5>

                      <p className="text-[11px] text-gray-500 line-clamp-2 leading-normal mb-2">
                        {step.description}
                      </p>

                      <div className="text-[10px] font-semibold text-gray-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{step.date}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order Details & Workshop Note */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Workshop Live Note */}
              <div className="bg-blue-50/80 border border-blue-200 rounded-xl p-4 sm:p-5 flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                  <AlertCircle className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-blue-900 mb-1">
                    Catatan Terkini dari Workshop MI Apparel:
                  </h5>
                  <p className="text-sm text-blue-950 font-medium leading-relaxed">
                    "{orderData.notes}"
                  </p>
                </div>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200/80">
                  <span className="text-[11px] text-gray-400 block mb-0.5 flex items-center gap-1">
                    <Users className="w-3 h-3" /> Pemesan / Tim
                  </span>
                  <p className="text-sm font-bold text-gray-900 truncate">
                    {orderData.customerName}
                  </p>
                  {orderData.teamName && (
                    <p className="text-xs text-blue-700 font-semibold truncate">
                      {orderData.teamName}
                    </p>
                  )}
                </div>

                <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200/80">
                  <span className="text-[11px] text-gray-400 block mb-0.5 flex items-center gap-1">
                    <Layers className="w-3 h-3" /> Jumlah &amp; Kain
                  </span>
                  <p className="text-sm font-bold text-gray-900">
                    {orderData.quantity} Pcs
                  </p>
                  <p className="text-xs text-gray-600 truncate">
                    {orderData.details?.material || 'Bahan Dry-fit Standard'}
                  </p>
                </div>

                <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200/80">
                  <span className="text-[11px] text-gray-400 block mb-0.5 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Tanggal Masuk
                  </span>
                  <p className="text-sm font-bold text-gray-900">
                    {orderData.orderDate}
                  </p>
                  <p className="text-xs text-gray-500">Antrean Terdaftar</p>
                </div>

                <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200/80">
                  <span className="text-[11px] text-gray-400 block mb-0.5 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Estimasi Selesai
                  </span>
                  <p className="text-sm font-bold text-green-700">
                    {orderData.estimatedCompletion}
                  </p>
                  <p className="text-xs text-gray-500">Sesuai Timeline</p>
                </div>
              </div>

              {/* WhatsApp Support Button */}
              <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <p className="text-xs text-gray-500 leading-normal">
                  Perlu update khusus, penambahan ukuran, atau konfirmasi alamat pengiriman?
                </p>
                <a
                  href={`https://wa.me/${siteConfig?.whatsapp.number || '6282225511082'}?text=${encodeURIComponent(
                    `Halo Admin MI Apparel, saya ingin menanyakan perkembangan produksi pesanan dengan Nomor Order ${orderData.orderId} atas nama ${orderData.customerName} (${orderData.teamName || orderData.productName}).`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-600 hover:bg-green-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shadow-sm shrink-0"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Konfirmasi via WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Not Found State */}
        {hasSearched && notFoundQuery && !loading && !orderData && (
          <div className="max-w-xl mx-auto bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 text-center shadow-md animate-in fade-in">
            <div className="w-14 h-14 bg-amber-50 border border-amber-200 rounded-full flex items-center justify-center text-amber-600 mx-auto mb-4">
              <AlertCircle className="w-7 h-7" />
            </div>
            <h4 className="text-lg font-bold text-gray-900 mb-2">
              Nomor Pesanan "{notFoundQuery}" Tidak Ditemukan
            </h4>
            <p className="text-xs sm:text-sm text-gray-600 mb-6 leading-relaxed">
              Pastikan Anda memasukkan kode pesanan dengan benar (contoh: <span className="font-mono font-bold text-blue-900">MI-7821</span>).
              Jika Anda baru saja memesan hari ini, silakan hubungi admin kami untuk pengecekan status manual.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                type="button"
                onClick={handleReset}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-5 py-2.5 rounded-xl text-xs transition-colors"
              >
                Coba Cari Lagi
              </button>
              <a
                href={`https://wa.me/${siteConfig?.whatsapp.number || '6282225511082'}?text=${encodeURIComponent(
                  `Halo Admin MI Apparel, saya ingin menanyakan status pesanan saya dengan nomor: ${notFoundQuery}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 hover:bg-green-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Tanya Admin WhatsApp</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
