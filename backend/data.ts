import { Product, OrderTracking } from './types';

export const siteConfig = {
  name: "MI Apparel",
  company: "PT Mayapada Industri Luhur",
  tagline: "More Than Fly",
  description: "Pusat layanan jasa sublim jersey, sablon, cetak DTF, dan konveksi terpercaya di Tangerang.",
  heroDescription: "Solusi pembuatan pakaian custom dengan kapasitas besar hingga 3.000 pcs per minggu dan kualitas premium. Percayakan produksi apparel Anda kepada ahlinya.",
  whatsapp: {
    number: "6282225511082",
    display: "0822-2551-1082",
    messageTemplate: "Halo Admin MI Apparel, saya tertarik dan ingin tanya detail untuk pemesanan"
  },
  email: "flymiapparel@gmail.com",
  address: "Jl. Guru Kojar No. 154, Jurang Mangu Barat, Tangerang Selatan",
  googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=MI+Apparel+Jl.+Guru+Kojar+No.+154%2C+Jurang+Mangu+Barat%2C+Tangerang+Selatan",
  instagram: {
    main: "@mayapadaindustri",
    mainLink: "https://www.instagram.com/mayapadaindustri/",
    dtf: "@mayapadaindustri",
    dtfLink: "https://www.instagram.com/mayapadaindustri/"
  },
  facebook: "MI Apparel",
  tiktok: "@miapparelofficial",
  shopee: "MI Apparel Official",
  shopeeUrl: "https://shopee.co.id/miapparel"
};

export const products: Product[] = [
  {
    id: 1,
    name: "Cetak DTF Meteran",
    category: "Cetak DTF & Polyflex",
    image: "/assets/katalog/katalog-dtf.png",
    description: "Layanan cetak sablon DTF (Direct Transfer Film) meteran dengan tinta premium, warna solid tajam, powder perekat merata, dan siap press pada berbagai jenis kain.",
    materials: ["PET Film Standard (Lebar 58 cm)", "PET Film Premium (Lebar 58 cm)", "PET Film Roll Kecil (Lebar 29 cm)"],
    customOptions: ["Lebar Cetak 58 cm", "Desain Bebas Full Color", "Siap Press 150°C–160°C"],
    minOrder: "1 Meter",
    eta: "1 - 2 Hari Kerja",
    sizes: ["Meteran (Lari)"],
    price: "Mulai Rp30.000 / meter",
    featured: true,
    specifications: [
      "Teknologi Direct Transfer Film (DTF) resolusi tinggi hingga 1440 dpi",
      "Pilihan lebar bahan 60 cm (area cetak maksimal 58 cm) & 30 cm (maksimal 29 cm)",
      "Harga dihitung per meter lari (bisa muat banyak desain dalam 1 lembar layout)",
      "Menggunakan tinta CMYK + White solid dengan hotmelt powder berkualitas",
      "Cocok untuk bahan katun, polyester, dry-fit, canvas, hingga totebag"
    ],
    orderGuide: [
      "Siapkan file layout PNG transparan / PDF / CDR / AI / PSD resolusi minimal 300 DPI tanpa background",
      "Atur lebar kanvas sesuai pilihan (maksimal 58 cm atau 29 cm) dengan panjang sesuai kebutuhan",
      "Pilih jenis PET Film dan isi panjang meteran serta jumlah pada Form Order",
      "Upload file desain ke Google Drive melalui panel Upload Desain atau tempel link desain",
      "Kirim pesanan ke Daftar Konsultasi atau langsung konfirmasi via WhatsApp admin"
    ]
  },
  {
    id: 2,
    name: "Kaos Sablon Custom",
    category: "Sablon & Kaos",
    image: "/assets/katalog/katalog-kaos.png",
    description: "Produksi kaos sablon custom dengan bahan Cotton Combed premium yang adem dan lembut, cocok untuk komunitas, perusahaan, acara, dan brand clothing.",
    materials: ["Cotton Combed 24s", "Cotton Combed 30s"],
    customOptions: ["Sablon DTF", "Sablon Plastisol", "Bordir Komputer"],
    minOrder: "1 Pcs",
    eta: "7 - 10 Hari Kerja",
    sizes: ["S", "M", "L", "XL", "XXL", "3XL"],
    price: "Hubungi Admin",
    featured: true,
    specifications: [
      "Bahan 100% Cotton Combed 24s (tebal pas) atau 30s (ringan & adem)",
      "Jahitan rantai pundak rapi standar distro dengan overdeck 3 benang",
      "Pilihan teknik cetak: Sablon DTF full color satuan, Plastisol awet, atau Bordir",
      "Tersedia ukuran lengkap S hingga 3XL (bisa campur ukuran dalam 1 pesanan)",
      "Melewati tahap steam uap & quality control sebelum pengemasan satuan"
    ],
    orderGuide: [
      "Pilih ketebalan bahan kaos (Combed 24s atau Combed 30s) dan jenis sablon",
      "Cantumkan rincian ukuran (misal: M=5, L=8, XL=4) dan warna kaos di kolom Catatan",
      "Upload file desain/logo resolusi tinggi atau mockup penempatan sablon ke Google Drive",
      "Tim desain kami akan mengkonfirmasi mockup final sebelum produksi dimulai",
      "Pembayaran DP minimal 50% untuk mengunci jadwal produksi di workshop"
    ]
  },
  {
    id: 3,
    name: "Jersey Sublim Custom",
    category: "Sublim & Jersey",
    image: "/assets/katalog/katalog-jersey.png",
    description: "Pusat pembuatan jersey custom full print sublimasi untuk sepak bola, futsal, basket, voli, badminton, sepeda, esport, dan komunitas.",
    materials: ["Dry-fit Milano", "Dry-fit Brazil", "Benzema", "Pique"],
    customOptions: ["Nama dan Nomor", "Lengan Pendek atau Panjang", "Desain Full Print"],
    minOrder: "1 Pcs",
    eta: "7 - 14 Hari Kerja",
    sizes: ["S", "M", "L", "XL", "XXL", "3XL", "Custom"],
    price: "Hubungi Admin",
    featured: true,
    specifications: [
      "Cetak sublimasi full print dengan tinta Epson Hi-Definition yang menyatu di serat kain (tidak luntur)",
      "Pilihan kain olahraga breathable: Dry-fit Milano, Brazil, Benzema, dan Pique",
      "Custom bebas motif, sponsor, logo tim, serta nama & nomor punggung berbeda tiap pemain",
      "Pilihan variasi kerah (V-Neck, O-Neck, Stand Collar) & lengan pendek/panjang",
      "Kapasitas produksi besar hingga 3.000 pcs/minggu dengan pengerjaan tepat waktu"
    ],
    orderGuide: [
      "Pilih bahan Dry-fit dan tentukan jenis kerah/lengan pada pilihan kustomisasi",
      "Siapkan daftar nama, nomor punggung, dan ukuran tiap pemain di catatan atau file Excel/PDF",
      "Upload file desain (CDR/AI/PDF/PNG) atau referensi jersey ke Google Drive",
      "Tim kami menyediakan mockup preview sebelum masuk tahap printing & heat press",
      "Estimasi selesai 7–14 hari kerja setelah desain disetujui dan DP diterima"
    ]
  },
  {
    id: 4,
    name: "Polo Shirt Custom",
    category: "Seragam & Kemeja",
    image: "/assets/katalog/katalog-polo.png",
    description: "Pembuatan polo shirt custom berkerah rapi dengan bordir komputer presisi atau sablon DTF, ideal untuk seragam kantor, panitia, dan komunitas.",
    materials: ["Lacoste Pique", "Cotton CVC"],
    customOptions: ["Bordir Komputer", "Sablon DTF", "Kombinasi Warna"],
    minOrder: "1 Pcs",
    eta: "10 - 14 Hari Kerja",
    sizes: ["S", "M", "L", "XL", "XXL", "3XL"],
    price: "Hubungi Admin",
    featured: true,
    specifications: [
      "Bahan berpori elegan: Lacoste Pique atau Cotton CVC yang nyaman dipakai seharian",
      "Kerah dan manset lengan menggunakan rib rajut kokoh anti melar",
      "Aplikasi logo menggunakan Bordir Komputer presisi tinggi atau Sablon DTF",
      "Dapat dikombinasikan dengan list warna pada kerah, plaket kancing, dan ujung lengan",
      "Tersedia ukuran standar hingga jumbo (3XL)"
    ],
    orderGuide: [
      "Tentukan bahan polo (Lacoste Pique atau Cotton CVC) dan metode aplikasi logo",
      "Tuliskan detail warna kain, posisi logo (dada kiri/punggung/lengan), dan rincian size",
      "Upload file logo vektor (CDR/AI/PDF/PNG HD) melalui fitur Upload Desain Google Drive",
      "Konfirmasi penawaran harga dan proof bordir/cetak bersama admin via WhatsApp"
    ]
  },
  {
    id: 5,
    name: "Kemeja dan Seragam Konveksi",
    category: "Seragam & Kemeja",
    image: "/assets/katalog/katalog-kemeja.png",
    description: "Produksi kemeja PDL, PDH, wearpack, dan seragam kerja instansi dengan bahan drill berkualitas tinggi serta jahitan kuat dan rapi.",
    materials: ["American Drill", "Nagata Drill", "Tropical"],
    customOptions: ["Bordir Komputer", "Model Lengan", "Saku Custom"],
    minOrder: "1 Pcs",
    eta: "14 - 21 Hari Kerja",
    sizes: ["S", "M", "L", "XL", "XXL", "3XL", "4XL"],
    price: "Hubungi Admin",
    featured: true,
    specifications: [
      "Pilihan bahan premium: American Drill (kokoh), Nagata Drill (halus & adem), atau Tropical",
      "Jahitan ganda/rantai kuat untuk pemakaian lapangan (PDL) maupun kantor (PDH)",
      "Bordir komputer langsung pada kain atau emblem/patch perekat (velcro)",
      "Custom model saku tempel/bobok, skoder bahu, ventilasi punggung, hingga pita reflektor",
      "Tersedia size S hingga 4XL"
    ],
    orderGuide: [
      "Pilih jenis kain drill/tropical dan tentukan model lengan (pendek/panjang/lipat)",
      "Siapkan sketsa/referensi model seragam, posisi saku, dan penempatan logo bordir",
      "Upload file desain & logo ke Google Drive dan cantumkan rincian ukuran pada catatan",
      "Admin akan mengirimkan penawaran harga resmi beserta estimasi jadwal selesai"
    ]
  },
  {
    id: 6,
    name: "Cutting Sablon Polyflex",
    category: "Cetak DTF & Polyflex",
    image: "/assets/katalog/katalog-polyflex.png",
    description: "Layanan cutting sticker polyflex presisi untuk nama, nomor punggung jersey, logo minimalis, dan tulisan custom pada berbagai media kain.",
    materials: ["Polyflex PU", "Polyflex Flock", "Polyflex Reflective"],
    customOptions: ["Nama Custom", "Nomor Punggung", "Logo dan Tulisan"],
    minOrder: "1 Pcs",
    eta: "1 - 3 Hari Kerja",
    sizes: ["Ukuran Custom"],
    price: "Hubungi Admin",
    featured: true,
    specifications: [
      "Hasil potong mesin cutting presisi tinggi hingga detail kecil",
      "Bahan Polyflex PU lentur dan tipis, Flock bertekstur beludru, atau Reflective menyala saat kena cahaya",
      "Warna solid cerah, tidak pecah saat dicuci, dan menempel kuat dengan mesin heat press",
      "Cocok untuk pasang nama & nomor punggung jersey atau logo satuan cepat"
    ],
    orderGuide: [
      "Pilih jenis bahan polyflex (PU, Flock, atau Reflective) sesuai kebutuhan",
      "Kirim daftar nama/nomor punggung atau file vektor (.CDR / .AI / .EPS / .PDF) ke Google Drive",
      "Cantumkan warna polyflex dan tinggi/lebar huruf yang diinginkan di kolom Catatan",
      "Pesanan diproses cepat dalam 1–3 hari kerja"
    ]
  },
  {
    id: 7,
    name: "Cetak Banner Custom",
    category: "Banner & Promosi",
    image: "/assets/katalog/katalog-banner.png",
    description: "Cetak spanduk & banner promosi usaha, event, organisasi, maupun media informasi dengan warna cerah, tajam, dan tahan cuaca.",
    materials: ["Flexi China", "Flexi Korea", "Albatros"],
    customOptions: ["Ukuran Custom", "Desain Bebas", "Finishing Mata Ayam"],
    minOrder: "1 Pcs",
    eta: "1 - 3 Hari Kerja",
    sizes: ["Ukuran Custom"],
    price: "Hubungi Admin",
    featured: true,
    specifications: [
      "Pilihan bahan: Flexi China (ekonomis), Flexi Korea (lebih tebal & halus), atau Albatros (indoor)",
      "Cetak outdoor/indoor resolusi tinggi dengan tinta tahan air dan sinar matahari",
      "Gratis opsi finishing: lipat keliling + mata ayam (ring), selongsong kayu, atau potong pas",
      "Ukuran bebas sesuai kebutuhan spanduk toko, backdrop acara, atau X/Y-Banner"
    ],
    orderGuide: [
      "Pilih bahan banner dan tuliskan ukuran (Panjang x Lebar dalam meter/cm) pada Form Order",
      "Sebutkan pilihan finishing (mata ayam tiap sudut/per meter, selongsong, atau tanpa finishing)",
      "Upload file desain siap cetak (PDF/CDR/JPG resolusi tinggi CMYK) ke Google Drive",
      "Pesanan siap dalam 1–3 hari kerja, bisa diambil di workshop atau dikirim kurir"
    ]
  },
  {
    id: 8,
    name: "Custom Lanyard",
    category: "Merchandise & Souvenir",
    image: "/assets/katalog/katalog-lanyard.png",
    description: "Produksi tali lanyard / gantungan ID Card full print custom untuk perusahaan, sekolah, panitia event, dan komunitas.",
    materials: ["Polyester", "Tissue", "Nylon"],
    customOptions: ["Desain Full Print", "Logo Custom", "Pilihan Pengait"],
    minOrder: "12 Pcs",
    eta: "7 - 14 Hari Kerja",
    sizes: ["Lebar 1,5 cm", "Lebar 2 cm"],
    price: "Hubungi Admin",
    featured: true,
    specifications: [
      "Bahan tali lembut nyaman di leher: Tissue (halus rata maksimal), Polyester, atau Nylon",
      "Cetak sublimasi 2 sisi (bolak-balik) full color dengan warna tajam dan tidak mudah pudar",
      "Pilihan lebar tali 1,5 cm atau 2 cm (panjang standar ±90 cm)",
      "Lengkap dengan stopper putar dan pengait besi/kait udang berkualitas"
    ],
    orderGuide: [
      "Minimum pemesanan 12 pcs per desain",
      "Pilih bahan tali (Tissue/Polyester/Nylon) dan lebar tali (1,5 cm atau 2 cm)",
      "Upload file desain lanyard (ukuran area desain 2x90 cm) atau logo perusahaan ke Google Drive",
      "Tuliskan apakah membutuhkan tambahan stopper atau tempat ID card di catatan"
    ]
  },
  {
    id: 9,
    name: "Topi Bordir Custom",
    category: "Merchandise & Souvenir",
    image: "/assets/katalog/katalog-topi.png",
    description: "Produksi topi custom bordir 2D/3D atau sablon DTF untuk merchandise, seragam lapangan, komunitas, dan promosi brand.",
    materials: ["Twill", "Drill", "Rafel", "Jaring Trucker"],
    customOptions: ["Bordir 2D", "Bordir 3D", "Sablon DTF"],
    minOrder: "1 Pcs",
    eta: "7 - 14 Hari Kerja",
    sizes: ["All Size"],
    price: "Hubungi Admin",
    featured: true,
    specifications: [
      "Pilihan model & bahan: Baseball Twill/Drill, Rafel tebal lembut, atau Trucker Jaring",
      "Aplikasi logo menggunakan Bordir Komputer 2D standar, Bordir 3D timbul, atau Sablon DTF",
      "Pengait belakang dapat disesuaikan (rel plastik, gesper besi, atau velcro)",
      "Jahitan panel depan rapi dengan visor/lidah topi kokoh"
    ],
    orderGuide: [
      "Pilih bahan topi dan jenis aplikasi logo (Bordir 2D, Bordir 3D, atau Sablon DTF)",
      "Cantumkan warna topi dan jenis pengait belakang yang diinginkan pada catatan",
      "Upload file logo/desain topi ke Google Drive untuk pemeriksaan detail bordir",
      "Admin akan mengkonfirmasi estimasi harga berdasarkan tingkat kerumitan logo"
    ]
  },
  {
    id: 10,
    name: "Mug dan Tumbler Custom",
    category: "Merchandise & Souvenir",
    image: "/assets/katalog/katalog-mug.png",
    description: "Layanan cetak souvenir mug keramik dan tumbler stainless custom dengan print UV atau grafir laser untuk hadiah, event, dan corporate gift.",
    materials: ["Mug Keramik", "Tumbler Stainless"],
    customOptions: ["Foto Custom", "Logo Custom", "Tulisan Custom"],
    minOrder: "1 Pcs",
    eta: "3 - 7 Hari Kerja",
    sizes: ["Standar"],
    price: "Hubungi Admin",
    featured: true,
    specifications: [
      "Mug keramik SNI coating sublimasi kilap (kapasitas 325 ml / 11 oz), aman untuk minuman panas/dingin",
      "Tumbler stainless tahan panas/dingin dengan pilihan cetak UV full color atau grafir laser permanen",
      "Tersedia opsi kemasan box satuan rapi untuk kebutuhan souvenir acara atau hampers",
      "Bisa custom foto, logo perusahaan, ucapan acara, hingga nama individu berbeda tiap pcs"
    ],
    orderGuide: [
      "Pilih jenis media (Mug Keramik atau Tumbler Stainless) serta jenis cetak",
      "Upload file foto/logo/desain (resolusi minimal 300 DPI) ke Google Drive",
      "Tuliskan apakah memerlukan box satuan tambahan atau daftar nama custom di catatan",
      "Packing aman dengan bubble wrap untuk pengiriman dalam dan luar kota"
    ]
  }
];

export const orders: OrderTracking[] = [
  {
    orderId: "MI-7821",
    customerName: "Fajar Pratama",
    teamName: "Garuda FC Tangerang",
    productName: "Jersey Sepak Bola Sublim Full Print",
    quantity: 24,
    orderDate: "3 September 2026",
    estimatedCompletion: "8 September 2026",
    currentPhase: "printing",
    phasePercentage: 45,
    statusTitle: "Tahap Printing Sublim & Heat Press",
    notes: "Kertas sublimasi telah dicetak dengan tinta original Epson Hi-Definition. Saat ini proses transfer panas (heat press roll) ke kain Milano Anti-UV.",
    details: {
      material: "Dry-fit Milano 150gsm",
      model: "Jersey Setelan (Baju + Celana)",
      collar: "V-Neck Rib Hitam",
      sleeve: "Lengan Pendek"
    },
    timeline: [
      {
        phase: "queue",
        title: "Konfirmasi Desain & Antrean",
        date: "3 Sep 2026, 09:30 WIB",
        completed: true,
        current: false,
        description: "Mockup vector dan data nama/nomor pemain disetujui."
      },
      {
        phase: "printing",
        title: "Printing Sublim & Press",
        date: "5 Sep 2026, 14:15 WIB",
        completed: false,
        current: true,
        description: "Pencetakan pola jersey pada kain dan proses sublimasi suhu 200°C."
      },
      {
        phase: "sewing",
        title: "Cutting & Jahit (Sewing)",
        date: "Estimasi: 6 Sep 2026",
        completed: false,
        current: false,
        description: "Pemotongan pola presisi dan perakitan jahit kumis/rantai."
      },
      {
        phase: "shipping",
        title: "QC & Pengiriman (Shipping)",
        date: "Estimasi: 8 Sep 2026",
        completed: false,
        current: false,
        description: "Pemeriksaan kualitas akhir, steam uap, dan pengiriman."
      }
    ]
  },
  {
    orderId: "MI-6540",
    customerName: "Rian Hendrawan",
    teamName: "Bintang Muda Volleyball Club",
    productName: "Jersey Voli Custom Full Print",
    quantity: 18,
    orderDate: "1 September 2026",
    estimatedCompletion: "6 September 2026",
    currentPhase: "sewing",
    phasePercentage: 75,
    statusTitle: "Tahap Cutting Pola & Penjahitan (Sewing)",
    notes: "Semua lembaran kain sublim telah lolos inspeksi warna dan kini sedang dirakit di lini penjahitan (pasang kerah O-neck & jahit obras benang katun 4 benang).",
    details: {
      material: "Dry-fit Benzema Breathable",
      model: "Atasan Jersey Voli Tanpa Lengan",
      collar: "O-Neck Solid Navy",
      sleeve: "Sleeveless"
    },
    timeline: [
      {
        phase: "queue",
        title: "Konfirmasi Desain & Antrean",
        date: "1 Sep 2026, 11:00 WIB",
        completed: true,
        current: false,
        description: "Data pemain dan sponsor dada telah disetujui."
      },
      {
        phase: "printing",
        title: "Printing Sublim & Press",
        date: "3 Sep 2026, 16:30 WIB",
        completed: true,
        current: false,
        description: "Pewarnaan sublimasi selesai dengan warna cerah dan tajam."
      },
      {
        phase: "sewing",
        title: "Cutting & Jahit (Sewing)",
        date: "5 Sep 2026, 10:00 WIB",
        completed: false,
        current: true,
        description: "Kain sedang dijahit oleh operator konveksi profesional."
      },
      {
        phase: "shipping",
        title: "QC & Pengiriman (Shipping)",
        date: "Estimasi: 6 Sep 2026",
        completed: false,
        current: false,
        description: "Quality control benang, packing satuan, dan kirim."
      }
    ]
  },
  {
    orderId: "MI-5120",
    customerName: "Agus Setiawan",
    teamName: "Komunitas Gowes Serpong BSD",
    productName: "Jersey Sepeda Roadbike Zipper",
    quantity: 32,
    orderDate: "28 Agustus 2026",
    estimatedCompletion: "5 September 2026",
    currentPhase: "shipping",
    phasePercentage: 95,
    statusTitle: "Tahap Pengiriman (Shipping) / Siap Diambil",
    notes: "Produksi selesai 100%. Telah melewati QC ketat, dipacking plastik polybag ziplock per ukuran, dan telah diserahkan ke kurir ekspedisi (No. Resi: JT9928192301).",
    details: {
      material: "Dry-fit Brazil Premium + Mesh Ventilasi",
      model: "Jersey Sepeda Resleting Depan Penuh",
      collar: "Kerah Stand Collar",
      sleeve: "Lengan Pendek + 3 Kantong Belakang"
    },
    timeline: [
      {
        phase: "queue",
        title: "Konfirmasi Desain & Antrean",
        date: "28 Ags 2026, 10:20 WIB",
        completed: true,
        current: false,
        description: "Desain jersey sepeda dan ukuran disetujui."
      },
      {
        phase: "printing",
        title: "Printing Sublim & Press",
        date: "30 Ags 2026, 15:40 WIB",
        completed: true,
        current: false,
        description: "Hasil cetak tajam dengan gradasi presisi tinggi."
      },
      {
        phase: "sewing",
        title: "Cutting & Jahit (Sewing)",
        date: "2 Sep 2026, 17:00 WIB",
        completed: true,
        current: false,
        description: "Pemasangan ritsleting YKK dan saku belakang tuntas."
      },
      {
        phase: "shipping",
        title: "QC & Pengiriman (Shipping)",
        date: "5 Sep 2026, 09:15 WIB",
        completed: true,
        current: true,
        description: "Paket telah dikirim via ekspedisi J&T Cargo."
      }
    ]
  },
  {
    orderId: "MI-9042",
    customerName: "Budi Santoso",
    teamName: "Wolves E-Sport Academy",
    productName: "Jersey Esport Sublim Hoodie",
    quantity: 15,
    orderDate: "4 September 2026",
    estimatedCompletion: "10 September 2026",
    currentPhase: "printing",
    phasePercentage: 35,
    statusTitle: "Tahap Layout & Printing Sublimasi",
    notes: "File desain vector telah lolos kalibrasi warna RGB ke CMYK sublim. Sedang masuk mesin plotter printer industri hari ini.",
    details: {
      material: "Dry-fit Pique Diamond",
      model: "Jersey Gamers Kombinasi Hoodie",
      collar: "Hoodie Drawstring",
      sleeve: "Lengan Panjang Rib"
    },
    timeline: [
      {
        phase: "queue",
        title: "Konfirmasi Desain & Antrean",
        date: "4 Sep 2026, 13:00 WIB",
        completed: true,
        current: false,
        description: "Desain nickname dan logo sponsor verified."
      },
      {
        phase: "printing",
        title: "Printing Sublim & Press",
        date: "5 Sep 2026, 11:30 WIB",
        completed: false,
        current: true,
        description: "Proses print kertas sublim & press kain."
      },
      {
        phase: "sewing",
        title: "Cutting & Jahit (Sewing)",
        date: "Estimasi: 7 Sep 2026",
        completed: false,
        current: false,
        description: "Jahit potongan hoodie dan manset lengan."
      },
      {
        phase: "shipping",
        title: "QC & Pengiriman (Shipping)",
        date: "Estimasi: 10 Sep 2026",
        completed: false,
        current: false,
        description: "Packing dan pengiriman pesanan."
      }
    ]
  }
];

