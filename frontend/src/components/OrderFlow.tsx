import { MessageCircle, PenTool, CreditCard, Settings, Truck } from 'lucide-react';

export default function OrderFlow() {
  const orderFlows = [
    {
      step: '01',
      icon: <MessageCircle className="w-6 h-6" />,
      title: 'Konsultasi Admin',
      desc: 'Hubungi admin via WhatsApp untuk diskusi produk, bahan, dan jumlah.',
    },
    {
      step: '02',
      icon: <PenTool className="w-6 h-6" />,
      title: 'Desain & Spesifikasi',
      desc: 'Kirim file siap cetak atau konfirmasi mockup, ukuran, dan detail desain.',
    },
    {
      step: '03',
      icon: <CreditCard className="w-6 h-6" />,
      title: 'Penawaran & DP',
      desc: 'Konfirmasi invoice penawaran harga dan pembayaran DP produksi.',
    },
    {
      step: '04',
      icon: <Settings className="w-6 h-6" />,
      title: 'Produksi & QC',
      desc: 'Proses cetak sublim/DTF, jahit konveksi, dan quality control ketat.',
    },
    {
      step: '05',
      icon: <Truck className="w-6 h-6" />,
      title: 'Ambil / Kirim',
      desc: 'Pelunasan dan pengambilan di workshop atau kirim ke alamat Anda.',
    },
  ];

  return (
    <section
      id="alur"
      className="py-12 md:py-16 bg-gradient-to-br from-slate-800 via-blue-950 to-slate-900 text-white"
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10 md:mb-12">
          <span className="text-blue-300 font-bold text-xs tracking-widest uppercase mb-2 block">
            Cara Pemesanan
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
            Cara Mudah Order Online
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 text-center">
          {orderFlows.map((flow, idx) => (
            <div key={flow.step} className="relative flex flex-col items-center group">
              {idx !== orderFlows.length - 1 && (
                <div
                  aria-hidden="true"
                  className="hidden md:block absolute top-9 left-[60%] w-[80%] h-[2px] bg-white/20 z-0"
                />
              )}
              <div className="relative z-10 mb-3">
                <div className="w-18 h-18 rounded-full bg-white text-blue-900 shadow-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                  {flow.icon}
                </div>
                <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-blue-600 text-white text-[10px] font-extrabold flex items-center justify-center border-2 border-slate-900 tabular-nums">
                  {flow.step}
                </span>
              </div>
              <h4 className="font-bold text-white text-sm sm:text-base mb-1.5">
                {flow.title}
              </h4>
              <p className="text-xs text-blue-100/80 leading-relaxed max-w-[200px]">
                {flow.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
