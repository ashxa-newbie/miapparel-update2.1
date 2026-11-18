import { useState, useEffect, useRef, type DragEvent, type ChangeEvent } from 'react';
import type { User } from 'firebase/auth';
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  ExternalLink,
  FileUp,
  FolderOpen,
  Info,
  Lightbulb,
  Link2,
  Loader2,
  LogOut,
  MessageCircle,
  Package,
  Share2,
  ShoppingBag,
  Sparkles,
  Upload,
  AlertCircle,
  Ruler,
  Layers,
  Hash,
  Tag,
  FileText,
} from 'lucide-react';
import { Product, InquiryItem } from '../types';
import { useAppConfig } from '../contexts/ConfigContext';
import {
  initAuth,
  googleSignIn,
  logoutGoogle,
  uploadDesignToDrive,
  getAccessToken,
  TARGET_DRIVE_FOLDER_URL,
  type DriveUploadResult,
} from '../lib/googleDrive';

const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50MB
const ACCEPTED_EXTENSIONS = ['.pdf', '.ai', '.cdr', '.psd', '.jpg', '.jpeg', '.png', '.zip', '.rar', '.svg'];

const getDetailProductImage = (product: Product) => {
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
  return product.image;
};

function getDtfRatePerMeter(material: string): number {
  const lower = material.toLowerCase();
  if (lower.includes('29 cm') || lower.includes('kecil')) return 20000;
  if (lower.includes('premium')) return 35000;
  return 30000;
}

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

type Props = {
  product: Product;
  onBack: () => void;
  onAddToInquiry: (item: InquiryItem) => void;
};

export default function ProductDetailView({ product, onBack, onAddToInquiry }: Props) {
  const { config: siteConfig } = useAppConfig();
  const detailImage = getDetailProductImage(product);
  const galleryImages = detailImage !== product.image ? [product.image, detailImage] : [product.image];

  const [activeImage, setActiveImage] = useState(galleryImages[0]);
  const [infoTab, setInfoTab] = useState<'specs' | 'guide'>('specs');
  const [isCopied, setIsCopied] = useState(false);

  // Order form state
  const isDtfMeteran = product.id === 1;
  const [selectedMaterial, setSelectedMaterial] = useState(product.materials?.[0] || '');
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || '');
  const [lengthMeters, setLengthMeters] = useState<string>('1');
  const [selectedCustomOptions, setSelectedCustomOptions] = useState<string[]>(
    product.customOptions?.slice(0, 1) || []
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [note, setNote] = useState('');

  // Upload & Google Drive state
  const [uploadTab, setUploadTab] = useState<'file' | 'link'>('file');
  const [driveUser, setDriveUser] = useState<User | null>(null);
  const [hasDriveToken, setHasDriveToken] = useState<boolean>(Boolean(getAccessToken()));
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<DriveUploadResult | null>(null);
  const [manualDesignLink, setManualDesignLink] = useState('');
  const [addedFeedback, setAddedFeedback] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset form when product changes
  useEffect(() => {
    const nextDetail = getDetailProductImage(product);
    setActiveImage(product.image || nextDetail);
    setInfoTab('specs');
    setSelectedMaterial(product.materials?.[0] || '');
    setSelectedSize(product.sizes?.[0] || '');
    setLengthMeters('1');
    setSelectedCustomOptions(product.customOptions?.slice(0, 1) || []);
    setQuantity(1);
    setNote('');
    setUploadedFile(null);
    setManualDesignLink('');
    setUploadError(null);
    setAddedFeedback(false);
  }, [product]);

  // Listen to Firebase Auth state for Google Drive
  useEffect(() => {
    const unsubscribe = initAuth(
      (user) => {
        setDriveUser(user);
        setHasDriveToken(true);
        setUploadError(null);
      },
      (user) => {
        setDriveUser(user);
        setHasDriveToken(Boolean(getAccessToken()));
      }
    );
    return () => unsubscribe();
  }, []);

  if (!siteConfig) return null;

  const parsedMeters = Math.max(0.5, Number(lengthMeters) || 1);
  const safeQuantity = Math.max(1, Number(quantity) || 1);

  const unitPrice = isDtfMeteran ? getDtfRatePerMeter(selectedMaterial) * parsedMeters : null;
  const totalPrice = unitPrice !== null ? unitPrice * safeQuantity : null;

  const effectiveDesignUrl =
    uploadTab === 'file' ? uploadedFile?.webViewLink || '' : manualDesignLink.trim();
  const effectiveDesignName = uploadTab === 'file' ? uploadedFile?.name || '' : '';

  const sizeOrLengthValue = isDtfMeteran
    ? `${parsedMeters} Meter (${selectedMaterial.includes('29') ? 'Lebar 29 cm' : 'Lebar 58 cm'})`
    : selectedSize;

  const handleToggleCustomOption = (option: string) => {
    setSelectedCustomOptions((prev) =>
      prev.includes(option) ? prev.filter((item) => item !== option) : [...prev, option]
    );
  };

  const handleShare = async () => {
    const shareData = {
      title: `${product.name} - ${siteConfig.name}`,
      text: `Cek ${product.name} di ${siteConfig.name}`,
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // user canceled share
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${shareData.title}\n${shareData.url}`);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } catch {
        // clipboard unavailable
      }
    }
  };

  const handleGoogleSignIn = async () => {
    setUploadError(null);
    setIsSigningIn(true);
    try {
      const { user } = await googleSignIn();
      setDriveUser(user);
      setHasDriveToken(true);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Login Google dibatalkan atau gagal.';
      setUploadError(message);
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleGoogleSignOut = async () => {
    await logoutGoogle();
    setDriveUser(null);
    setHasDriveToken(false);
  };

  const processFileUpload = async (file: File) => {
    setUploadError(null);

    const ext = `.${file.name.split('.').pop()?.toLowerCase() || ''}`;
    if (!ACCEPTED_EXTENSIONS.includes(ext)) {
      setUploadError(
        `Format file (${ext || 'tidak dikenal'}) tidak didukung. Gunakan PDF, AI, CDR, PSD, JPG, PNG, SVG, ZIP, atau RAR.`
      );
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setUploadError('Ukuran file melebihi batas maksimal 50MB. Silakan kompres ke ZIP/RAR.');
      return;
    }

    if (!getAccessToken()) {
      setUploadError('Silakan login dengan akun Google terlebih dahulu sebelum mengupload file.');
      return;
    }

    setIsUploading(true);
    try {
      const result = await uploadDesignToDrive(
        file,
        product.name,
        driveUser?.displayName || driveUser?.email || undefined
      );
      setUploadedFile(result);
    } catch (err) {
      const msg = err instanceof Error ? err.message : '';
      if (msg === 'AUTH_REQUIRED') {
        setHasDriveToken(false);
        setUploadError('Sesi Google Drive berakhir. Silakan klik Masuk dengan Google lagi.');
      } else {
        setUploadError(
          msg || 'Gagal mengupload file ke Google Drive. Pastikan koneksi stabil dan coba lagi.'
        );
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      void processFileUpload(file);
    }
    e.target.value = '';
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      void processFileUpload(file);
    }
  };

  const handleAddToInquiryClick = () => {
    onAddToInquiry({
      product,
      quantity: safeQuantity,
      selectedMaterial: selectedMaterial || product.materials?.[0],
      sizeOrLength: sizeOrLengthValue,
      customOptions: selectedCustomOptions,
      note: note.trim() || undefined,
      designUrl: effectiveDesignUrl || undefined,
      designFileName: effectiveDesignName || undefined,
    });
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 2200);
  };

  const buildSingleOrderWhatsAppUrl = () => {
    const lines = [
      `Halo Admin MI Apparel, saya ingin memesan produk berikut:`,
      ``,
      `• *Produk:* ${product.name}`,
      `• *Bahan:* ${selectedMaterial || '-'}`,
      `• *${isDtfMeteran ? 'Panjang Bahan' : 'Ukuran'}:* ${sizeOrLengthValue || '-'}`,
      `• *Jumlah:* ${safeQuantity} ${isDtfMeteran ? 'Roll/Paket' : 'Pcs'}`,
    ];

    if (selectedCustomOptions.length > 0) {
      lines.push(`• *Opsi Custom:* ${selectedCustomOptions.join(', ')}`);
    }
    if (totalPrice !== null) {
      lines.push(`• *Estimasi Harga:* ${formatRupiah(totalPrice)} (belum termasuk ongkir)`);
    }
    if (note.trim()) {
      lines.push(`• *Catatan:* ${note.trim()}`);
    }
    if (effectiveDesignUrl) {
      lines.push(`• *Link File Desain (Google Drive):* ${effectiveDesignUrl}`);
    } else {
      lines.push(`• *File Desain:* Akan dikirim menyusul via WhatsApp`);
    }
    lines.push('', 'Mohon informasi konfirmasi produksi dan total tagihannya. Terima kasih!');

    return `https://wa.me/${siteConfig.whatsapp.number}?text=${encodeURIComponent(lines.join('\n'))}`;
  };

  const specsList =
    product.specifications && product.specifications.length > 0
      ? product.specifications
      : [
          `Bahan tersedia: ${product.materials.join(', ')}`,
          `Pilihan ukuran: ${product.sizes.join(', ')}`,
          `Minimum pemesanan ${product.minOrder} dengan estimasi pengerjaan ${product.eta}`,
          `Dukungan custom: ${product.customOptions.join(', ')}`,
        ];

  const guideList =
    product.orderGuide && product.orderGuide.length > 0
      ? product.orderGuide
      : [
          'Tentukan bahan, ukuran/panjang, opsi custom, dan jumlah pesanan pada Form Order',
          'Upload file desain siap cetak langsung ke Google Drive atau tempelkan link desain Anda',
          'Tuliskan detail catatan pesanan (warna, pembagian ukuran, atau deadline)',
          'Klik Tambah ke Daftar Konsultasi atau Pesan Sekarang via WhatsApp untuk konfirmasi dengan Admin',
        ];

  return (
    <div className="bg-[#f8f9fa] pb-14">
      {/* 1. Breadcrumb & Back Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-gray-500">
            <button
              type="button"
              onClick={onBack}
              className="hover:text-blue-900 font-medium cursor-pointer"
            >
              Beranda
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <button
              type="button"
              onClick={onBack}
              className="hover:text-blue-900 font-medium cursor-pointer"
            >
              Produk Katalog
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-gray-600 hidden sm:inline">{product.category}</span>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400 hidden sm:inline" />
            <span className="font-bold text-blue-900 truncate max-w-[200px] sm:max-w-none">
              {product.name}
            </span>
          </nav>

          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-gray-200 bg-gray-50 hover:bg-blue-50 hover:border-blue-200 text-xs font-bold text-gray-700 hover:text-blue-900 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Katalog</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-6 space-y-6">
        {/* 2. Top Product Overview & Specifications / Ordering Guide */}
        <section className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Gallery Column */}
            <div className="lg:col-span-5 bg-gray-50 p-5 sm:p-6 border-b lg:border-b-0 lg:border-r border-gray-200 flex flex-col justify-between">
              <div className="aspect-square w-full bg-white rounded-xl border border-gray-200 overflow-hidden flex items-center justify-center p-2">
                <img
                  src={activeImage}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = product.image;
                  }}
                />
              </div>

              {galleryImages.length > 1 && (
                <div className="flex items-center gap-3 mt-4">
                  {galleryImages.map((imgUrl, idx) => (
                    <button
                      key={imgUrl}
                      type="button"
                      onClick={() => setActiveImage(imgUrl)}
                      className={`w-20 h-20 rounded-xl border-2 overflow-hidden bg-white p-1 transition-all cursor-pointer ${
                        activeImage === imgUrl
                          ? 'border-blue-900 ring-2 ring-blue-100'
                          : 'border-gray-200 hover:border-blue-300 opacity-75 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={imgUrl}
                        alt={`${product.name} tampilan ${idx + 1}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info, Specs & Guide Column */}
            <div className="lg:col-span-7 p-5 sm:p-7 flex flex-col">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-blue-800 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-md">
                    <Sparkles className="w-3 h-3" />
                    {product.category}
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-2.5 tracking-tight">
                    {product.name}
                  </h1>
                </div>

                <button
                  type="button"
                  onClick={handleShare}
                  aria-label="Bagikan produk"
                  className="relative p-2.5 rounded-xl border border-gray-200 bg-gray-50 hover:bg-blue-50 text-gray-600 hover:text-blue-900 transition-colors cursor-pointer shrink-0"
                >
                  {isCopied ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Share2 className="w-4 h-4" />
                  )}
                  {isCopied && (
                    <span className="absolute -bottom-8 right-0 text-[10px] font-bold bg-gray-900 text-white px-2 py-1 rounded whitespace-nowrap">
                      Link Tersalin!
                    </span>
                  )}
                </button>
              </div>

              <div className="mt-3 flex flex-wrap items-baseline gap-3">
                <span className="text-2xl font-black text-blue-900">{product.price}</span>
                <span className="text-xs text-gray-500 font-medium">
                  · Kualitas Produksi Workshop Tangerang
                </span>
              </div>

              <p className="text-sm text-gray-600 leading-relaxed mt-3">{product.description}</p>

              {/* Quick Meta Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-5">
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">
                    Minimum Order
                  </span>
                  <span className="text-sm font-bold text-gray-900 mt-0.5 flex items-center gap-1.5">
                    <Package className="w-4 h-4 text-blue-800 shrink-0" />
                    {product.minOrder}
                  </span>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">
                    Estimasi Pengerjaan
                  </span>
                  <span className="text-sm font-bold text-green-700 mt-0.5 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 shrink-0" />
                    {product.eta}
                  </span>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 col-span-2 sm:col-span-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">
                    Upload Desain
                  </span>
                  <span className="text-sm font-bold text-blue-900 mt-0.5 flex items-center gap-1.5">
                    <FolderOpen className="w-4 h-4 shrink-0" />
                    Google Drive Direct
                  </span>
                </div>
              </div>

              {/* Tabs: Spesifikasi Produk & Panduan Pemesanan */}
              <div className="mt-6 border-t border-gray-200 pt-5 flex-1 flex flex-col">
                <div className="flex border-b border-gray-200 gap-6">
                  <button
                    type="button"
                    onClick={() => setInfoTab('specs')}
                    className={`pb-2.5 text-sm font-bold border-b-2 transition-colors cursor-pointer ${
                      infoTab === 'specs'
                        ? 'border-blue-900 text-blue-900'
                        : 'border-transparent text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    Spesifikasi Produk
                  </button>
                  <button
                    type="button"
                    onClick={() => setInfoTab('guide')}
                    className={`pb-2.5 text-sm font-bold border-b-2 transition-colors cursor-pointer ${
                      infoTab === 'guide'
                        ? 'border-blue-900 text-blue-900'
                        : 'border-transparent text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    Panduan Pemesanan
                  </button>
                </div>

                {infoTab === 'specs' ? (
                  <div className="pt-4 space-y-4">
                    <ul className="space-y-2">
                      {specsList.map((spec) => (
                        <li key={spec} className="flex items-start gap-2.5 text-sm text-gray-700">
                          <CheckCircle2 className="w-4 h-4 text-blue-800 shrink-0 mt-0.5" />
                          <span>{spec}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-900 leading-relaxed flex items-start gap-2.5">
                      <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold block mb-0.5">
                          Catatan Penting Warna Cetak (RGB vs CMYK)
                        </span>
                        Layar monitor menggunakan spektrum warna RGB, sedangkan mesin cetak menggunakan tinta CMYK. Untuk hasil paling akurat sesuai desain, disarankan menggunakan profil warna CMYK sebelum upload file.
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="pt-4">
                    <ol className="space-y-2.5">
                      {guideList.map((step, index) => (
                        <li key={step} className="flex items-start gap-3 text-sm text-gray-700">
                          <span className="w-6 h-6 rounded-full bg-blue-900 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                            {index + 1}
                          </span>
                          <span className="leading-relaxed">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 3. 3-Step Horizontal Strip (Matches ATM Screenshot #eb0b52d2 in MI Apparel Royal Blue) */}
        <section
          aria-label="Tahapan Pemesanan"
          className="bg-white rounded-2xl border border-gray-200 px-5 py-4 shadow-2xs"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-center gap-4 md:gap-8">
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-full bg-blue-900 text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-xs">
                1
              </span>
              <div>
                <p className="text-sm font-bold text-gray-900">Tentukan Pilihan</p>
                <p className="text-xs text-gray-500">Bahan &amp; spesifikasi</p>
              </div>
            </div>

            <span className="hidden md:inline text-gray-300 text-xl font-light">&rarr;</span>

            <div className="flex items-center gap-3">
              <span
                className={`w-9 h-9 rounded-full font-bold text-sm flex items-center justify-center shrink-0 shadow-xs transition-colors ${
                  effectiveDesignUrl
                    ? 'bg-green-600 text-white'
                    : 'bg-blue-900 text-white'
                }`}
              >
                {effectiveDesignUrl ? <Check className="w-4 h-4" /> : '2'}
              </span>
              <div>
                <p className="text-sm font-bold text-gray-900">Upload Desain</p>
                <p className="text-xs text-gray-500">
                  {effectiveDesignUrl ? 'Desain sudah siap dilampirkan' : 'File Google Drive atau link'}
                </p>
              </div>
            </div>

            <span className="hidden md:inline text-gray-300 text-xl font-light">&rarr;</span>

            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-full bg-blue-900 text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-xs">
                3
              </span>
              <div>
                <p className="text-sm font-bold text-gray-900">Checkout</p>
                <p className="text-xs text-gray-500">Kirim pesanan &amp; konsultasi</p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Two-Column Form Order & Upload Desain + Checkout (Matches ATM Screenshot #eb0b52d2) */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* LEFT COLUMN: FORM ORDER */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs p-5 sm:p-6">
            <div className="flex items-center gap-2 pb-3 border-b-2 border-blue-900 mb-5">
              <FileText className="w-5 h-5 text-blue-900" />
              <h2 className="text-base font-extrabold text-blue-900">Form Order</h2>
            </div>

            <div className="space-y-4">
              {/* Row 1: Bahan & Panjang/Ukuran */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="order-material"
                    className="flex items-center gap-1.5 text-xs font-bold text-gray-800 mb-1.5"
                  >
                    <Layers className="w-3.5 h-3.5 text-gray-500" />
                    <span>
                      Bahan <span className="text-red-500">*</span>
                    </span>
                  </label>
                  <select
                    id="order-material"
                    value={selectedMaterial}
                    onChange={(e) => setSelectedMaterial(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm font-medium text-gray-900 focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-100"
                  >
                    {product.materials.map((mat) => (
                      <option key={mat} value={mat}>
                        {mat}
                      </option>
                    ))}
                  </select>
                </div>

                {isDtfMeteran ? (
                  <div>
                    <label
                      htmlFor="order-length"
                      className="flex items-center gap-1.5 text-xs font-bold text-gray-800 mb-1.5"
                    >
                      <Ruler className="w-3.5 h-3.5 text-gray-500" />
                      <span>
                        Panjang Bahan (Meter) <span className="text-red-500">*</span>
                      </span>
                    </label>
                    <input
                      id="order-length"
                      type="number"
                      min="0.5"
                      step="0.5"
                      value={lengthMeters}
                      onChange={(e) => setLengthMeters(e.target.value)}
                      placeholder="Masukkan panjang (meter)"
                      className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm font-medium text-gray-900 focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-100 tabular-nums"
                    />
                  </div>
                ) : (
                  <div>
                    <label
                      htmlFor="order-size"
                      className="flex items-center gap-1.5 text-xs font-bold text-gray-800 mb-1.5"
                    >
                      <Ruler className="w-3.5 h-3.5 text-gray-500" />
                      <span>
                        Ukuran <span className="text-red-500">*</span>
                      </span>
                    </label>
                    <select
                      id="order-size"
                      value={selectedSize}
                      onChange={(e) => setSelectedSize(e.target.value)}
                      className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm font-medium text-gray-900 focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-100"
                    >
                      {product.sizes.map((sz) => (
                        <option key={sz} value={sz}>
                          {sz}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Row 2: Jumlah & Harga Satuan */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="order-qty"
                    className="flex items-center gap-1.5 text-xs font-bold text-gray-800 mb-1.5"
                  >
                    <Hash className="w-3.5 h-3.5 text-gray-500" />
                    <span>
                      Jumlah <span className="text-red-500">*</span>
                    </span>
                  </label>
                  <input
                    id="order-qty"
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
                    className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm font-medium text-gray-900 focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-100 tabular-nums"
                  />
                </div>

                <div>
                  <label
                    htmlFor="order-unit-price"
                    className="flex items-center gap-1.5 text-xs font-bold text-gray-800 mb-1.5"
                  >
                    <Tag className="w-3.5 h-3.5 text-gray-500" />
                    <span>Harga Satuan</span>
                  </label>
                  <input
                    id="order-unit-price"
                    type="text"
                    readOnly
                    value={unitPrice !== null ? formatRupiah(unitPrice) : product.price}
                    className="w-full rounded-xl border border-gray-200 bg-gray-100 px-3.5 py-2.5 text-sm font-bold text-gray-800 cursor-default tabular-nums"
                  />
                </div>
              </div>

              {/* Custom Options Chips */}
              {product.customOptions && product.customOptions.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-gray-800 mb-2">Opsi Kustomisasi</p>
                  <div className="flex flex-wrap gap-2">
                    {product.customOptions.map((option) => {
                      const active = selectedCustomOptions.includes(option);
                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => handleToggleCustomOption(option)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                            active
                              ? 'bg-blue-900 text-white border-blue-900'
                              : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-blue-300'
                          }`}
                        >
                          {active && <Check className="w-3.5 h-3.5" />}
                          <span>{option}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Catatan */}
              <div>
                <label
                  htmlFor="order-note"
                  className="flex items-center gap-1.5 text-xs font-bold text-gray-800 mb-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-gray-500" />
                  <span>Catatan</span>
                </label>
                <textarea
                  id="order-note"
                  rows={4}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Masukkan catatan khusus untuk pesanan ini (misal: rincian ukuran S/M/L/XL, warna kain, nama & nomor punggung, atau jadwal deadline)..."
                  className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-100 resize-y"
                />
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: UPLOAD DESAIN (GOOGLE DRIVE) + CHECKOUT */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs p-5 sm:p-6 space-y-6">
            <div>
              <div className="flex items-center justify-between gap-2 pb-3 border-b-2 border-blue-900 mb-5">
                <div className="flex items-center gap-2">
                  <Upload className="w-5 h-5 text-blue-900" />
                  <h2 className="text-base font-extrabold text-blue-900">Upload Desain</h2>
                </div>
                <a
                  href={TARGET_DRIVE_FOLDER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-800 hover:text-blue-950 hover:underline"
                >
                  <FolderOpen className="w-3.5 h-3.5" />
                  <span>Folder Drive MI Apparel</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Tabs: Upload File vs Link Desain */}
              <div className="grid grid-cols-2 bg-gray-100 p-1 rounded-xl mb-4">
                <button
                  type="button"
                  onClick={() => setUploadTab('file')}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    uploadTab === 'file'
                      ? 'bg-white text-blue-900 shadow-2xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <FileUp className="w-4 h-4" />
                  <span>Upload File</span>
                </button>
                <button
                  type="button"
                  onClick={() => setUploadTab('link')}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    uploadTab === 'link'
                      ? 'bg-white text-blue-900 shadow-2xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Link2 className="w-4 h-4" />
                  <span>Link Desain</span>
                </button>
              </div>

              {uploadTab === 'file' ? (
                <div className="space-y-4">
                  {/* Google Drive Auth Bar */}
                  <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    {driveUser && hasDriveToken ? (
                      <>
                        <div className="flex items-center gap-2.5 min-w-0">
                          {driveUser.photoURL ? (
                            <img
                              src={driveUser.photoURL}
                              alt={driveUser.displayName || 'Google User'}
                              referrerPolicy="no-referrer"
                              className="w-8 h-8 rounded-full border border-blue-200 shrink-0"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-blue-900 text-white text-xs font-bold flex items-center justify-center shrink-0">
                              {(driveUser.displayName || driveUser.email || 'G')[0].toUpperCase()}
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-gray-900 truncate">
                              Terhubung: {driveUser.displayName || driveUser.email}
                            </p>
                            <p className="text-[11px] text-green-700 font-semibold">
                              Siap upload langsung ke Google Drive
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={handleGoogleSignOut}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 text-xs font-semibold text-gray-700 transition-colors cursor-pointer shrink-0 self-start sm:self-auto"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Keluar</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="text-xs text-blue-950">
                          <p className="font-bold">Koneksi Google Drive</p>
                          <p className="text-[11px] text-blue-800 mt-0.5">
                            Masuk dengan akun Google untuk upload desain langsung ke Drive.
                          </p>
                        </div>

                        {/* Official Google Sign-In Button Styling */}
                        <button
                          type="button"
                          onClick={handleGoogleSignIn}
                          disabled={isSigningIn}
                          className="inline-flex items-center gap-2.5 bg-white hover:bg-gray-50 border border-[#747775] rounded-full px-3.5 py-2 text-xs font-medium text-[#1f1f1f] shadow-2xs transition-colors cursor-pointer disabled:opacity-60 shrink-0 self-start sm:self-auto"
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 48 48"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                          >
                            <path
                              fill="#EA4335"
                              d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                            />
                            <path
                              fill="#4285F4"
                              d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                            />
                            <path
                              fill="#FBBC05"
                              d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                            />
                            <path
                              fill="#34A853"
                              d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                            />
                          </svg>
                          <span>{isSigningIn ? 'Menghubungkan...' : 'Masuk dengan Google'}</span>
                        </button>
                      </>
                    )}
                  </div>

                  {/* Dropzone + Tips Upload Desain Grid (Matches Screenshot #eb0b52d2) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {/* Dropzone */}
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                      }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={handleDrop}
                      className={`border-2 border-dashed rounded-xl p-5 text-center flex flex-col items-center justify-center transition-colors ${
                        isDragging
                          ? 'border-blue-900 bg-blue-50'
                          : uploadedFile
                            ? 'border-green-400 bg-green-50/40'
                            : 'border-gray-300 bg-gray-50/60 hover:border-blue-400'
                      }`}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept={ACCEPTED_EXTENSIONS.join(',')}
                        onChange={handleFileChange}
                        className="hidden"
                      />

                      {isUploading ? (
                        <div className="py-4 flex flex-col items-center">
                          <Loader2 className="w-8 h-8 text-blue-900 animate-spin mb-2" />
                          <p className="text-xs font-bold text-blue-900">
                            Mengupload ke Google Drive...
                          </p>
                          <p className="text-[11px] text-gray-500 mt-1">Mohon tunggu sebentar</p>
                        </div>
                      ) : uploadedFile ? (
                        <div className="py-2 flex flex-col items-center w-full">
                          <div className="w-10 h-10 rounded-full bg-green-100 text-green-700 flex items-center justify-center mb-2">
                            <CheckCircle2 className="w-6 h-6" />
                          </div>
                          <p className="text-xs font-bold text-gray-900 line-clamp-2 break-all px-1">
                            {uploadedFile.name}
                          </p>
                          <p className="text-[11px] text-green-700 font-medium mt-1">
                            {uploadedFile.uploadedToTargetFolder
                              ? 'Tersimpan di folder Drive MI Apparel'
                              : 'Tersimpan di Google Drive (link siap dibagikan)'}
                          </p>
                          <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
                            <a
                              href={uploadedFile.webViewLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 text-white text-[11px] font-bold"
                            >
                              <span>Buka di Drive</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="px-2.5 py-1.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 text-gray-700 text-[11px] font-bold cursor-pointer"
                            >
                              Ganti File
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center mb-2.5">
                            <Upload className="w-5 h-5" />
                          </div>
                          <p className="text-xs font-bold text-gray-800">
                            Drag &amp; Drop file desain Anda di sini
                          </p>
                          <p className="text-[11px] text-gray-500 mt-1 mb-3">
                            atau klik tombol di bawah
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              if (!hasDriveToken) {
                                void handleGoogleSignIn();
                              } else {
                                fileInputRef.current?.click();
                              }
                            }}
                            className="inline-flex items-center gap-1.5 bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-xs transition-colors cursor-pointer"
                          >
                            <FolderOpen className="w-3.5 h-3.5" />
                            <span>{hasDriveToken ? 'Pilih File' : 'Login & Pilih File'}</span>
                          </button>
                        </>
                      )}
                    </div>

                    {/* Tips Upload Desain Box */}
                    <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-4">
                      <div className="flex items-center gap-1.5 text-xs font-extrabold text-blue-900 mb-2">
                        <Lightbulb className="w-4 h-4 text-blue-800 shrink-0" />
                        <span>Tips Upload Desain</span>
                      </div>
                      <ul className="space-y-1.5 text-[11px] text-blue-950/90 list-disc pl-4 leading-relaxed">
                        <li>Pastikan desain sudah siap cetak</li>
                        <li>Resolusi minimal 300 DPI untuk hasil terbaik</li>
                        <li>Gunakan mode warna CMYK untuk hasil akurat</li>
                        <li>Konversi seluruh teks/font menjadi kurva (outline)</li>
                      </ul>
                    </div>
                  </div>

                  {uploadError && (
                    <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-800">
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      <span>{uploadError}</span>
                    </div>
                  )}

                  {/* Format Info Card */}
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-xs text-gray-700 space-y-1.5">
                    <div className="flex items-start gap-2">
                      <Info className="w-4 h-4 text-blue-800 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-gray-900">Format yang diterima:</p>
                        <p className="text-[11px] text-gray-600 mt-0.5">
                          PDF, AI, CDR, PSD, JPG, PNG, SVG, ZIP, RAR
                        </p>
                        <p className="text-[11px] italic text-gray-500 mt-0.5">
                          Jika file lebih dari 1 (satu), silahkan gabung dengan ZIP/RAR
                        </p>
                      </div>
                    </div>
                    <p className="text-[11px] pl-6">
                      <span className="font-bold text-gray-900">Ukuran maksimal:</span> 50MB per file
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label
                      htmlFor="design-url-input"
                      className="block text-xs font-bold text-gray-800 mb-1.5"
                    >
                      Tempel Link Desain (Google Drive, Canva, Figma, Dropbox)
                    </label>
                    <input
                      id="design-url-input"
                      type="url"
                      value={manualDesignLink}
                      onChange={(e) => setManualDesignLink(e.target.value)}
                      placeholder="https://drive.google.com/drive/folders/..."
                      className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                  <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-3.5 text-xs text-blue-950 leading-relaxed">
                    Pastikan akses tautan disetel ke <strong>&ldquo;Siapa saja yang memiliki link dapat melihat&rdquo;</strong> (Anyone with the link) agar tim desain MI Apparel bisa mengunduh file Anda. Anda juga dapat mengupload langsung ke{' '}
                    <a
                      href={TARGET_DRIVE_FOLDER_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold underline text-blue-900"
                    >
                      Folder Drive MI Apparel
                    </a>
                    .
                  </div>
                </div>
              )}
            </div>

            {/* CHECKOUT SECTION */}
            <div className="pt-2 border-t border-gray-200">
              <div className="flex items-center gap-2 pb-2.5 border-b-2 border-blue-900 mb-4">
                <ShoppingBag className="w-5 h-5 text-blue-900" />
                <h3 className="text-base font-extrabold text-blue-900">Checkout</h3>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-xs text-gray-500 font-medium">Total Pesanan</p>
                  <p className="text-2xl font-black text-blue-900 tabular-nums mt-0.5">
                    {totalPrice !== null ? formatRupiah(totalPrice) : product.price}
                  </p>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Belum termasuk biaya pengiriman
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-2.5 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleAddToInquiryClick}
                    className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-gray-300 bg-white hover:bg-blue-50 hover:border-blue-300 text-xs font-bold text-gray-800 hover:text-blue-900 transition-colors cursor-pointer"
                  >
                    {addedFeedback ? (
                      <>
                        <Check className="w-4 h-4 text-green-600" />
                        <span className="text-green-700">Ditambahkan!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>Tambah ke Daftar</span>
                      </>
                    )}
                  </button>

                  <a
                    href={buildSingleOrderWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold shadow-md transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Pesan Sekarang via WA</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
