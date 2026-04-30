export type StakeholderAudience = {
  primary: string;
  secondary: string[];
  example: string;
};

export type StakeholderPageConfig = {
  slug: "strategic" | "tactical" | "managerial" | "operational" | "analytical" | "public";
  title: string;
  subtitle: string;
  orientation: string;
  focusMetrics: string[];
  kpiLabels: [string, string, string, string];
  actionDirectives: string[];
  decisionSupport: string;
  decisionLevel: "Makro" | "Sektoral" | "Operasional Daerah" | "Teknis Data" | "Eksplorasi" | "Publik";
  audience: StakeholderAudience;
};

export const stakeholderConfigs: StakeholderPageConfig[] = [
  {
    slug: "strategic",
    title: "Strategic Dashboard",
    subtitle: "Untuk pimpinan Pemprov Jabar dan Bappeda Provinsi",
    orientation: "Arah kebijakan makro, prioritas intervensi lintas wilayah, dan evaluasi capaian tahunan provinsi.",
    focusMetrics: ["KPI utama", "Ranking prioritas wilayah", "Tren tahunan antarindikator", "Peta prioritas"],
    kpiLabels: ["Tekanan Ketenagakerjaan", "Kerentanan Sosial", "Ketimpangan", "Pemberdayaan Gender"],
    actionDirectives: [
      "Tetapkan 5 wilayah prioritas untuk paket intervensi terpadu.",
      "Susun kebijakan lintas OPD berbasis tren 5 tahun terakhir.",
      "Monitor gap capaian antar wilayah per triwulan kebijakan.",
    ],
    decisionSupport: "Mendukung keputusan kebijakan makro dan prioritas intervensi antarwilayah.",
    decisionLevel: "Makro",
    audience: {
      primary: "Gubernur & Wakil Gubernur Jawa Barat",
      secondary: ["Bappeda Provinsi", "Sekretaris Daerah Provinsi", "Tim Perencana RPJMD"],
      example: "Penetapan prioritas RPJMD 5 tahunan dan paket intervensi terpadu antar OPD.",
    },
  },
  {
    slug: "tactical",
    title: "Tactical Dashboard",
    subtitle: "Untuk Kepala Dinas dan OPD sektoral",
    orientation: "Pengendalian program sektoral melalui drill-down indikator dan prioritas wilayah operasional menengah.",
    focusMetrics: ["Drill-down per indikator", "Top-bottom daerah", "Perubahan tahunan", "Cluster wilayah"],
    kpiLabels: ["Rata-rata TPT Program", "Rata-rata Kemiskinan Program", "Ketimpangan Wilayah", "IPG Program"],
    actionDirectives: [
      "Tetapkan target penurunan indikator untuk wilayah top-priority.",
      "Bandingkan efektivitas program antar OPD berbasis perubahan tahunan.",
      "Arahkan redistribusi anggaran ke wilayah dengan skor intervensi tertinggi.",
    ],
    decisionSupport: "Mendukung monitoring program sektoral dan penajaman alokasi intervensi.",
    decisionLevel: "Sektoral",
    audience: {
      primary: "Kepala Dinas (Disnakertrans, Dinas Sosial, Dinas Pendidikan, BPS Provinsi)",
      secondary: ["Manajer Program OPD", "TPID Provinsi", "Koordinator Bidang Sosial-Ekonomi"],
      example: "Penyesuaian program ketenagakerjaan & bantuan sosial per triwulan berdasarkan tren wilayah.",
    },
  },
  {
    slug: "managerial",
    title: "Managerial Dashboard",
    subtitle: "Untuk Pemerintah Kabupaten/Kota dan manajer program daerah",
    orientation: "Evaluasi kinerja daerah, identifikasi gap indikator, dan perencanaan tindak lanjut level manajerial.",
    focusMetrics: ["Profil wilayah", "Gap indikator antardaerah", "Capaian target tahunan", "Komparasi kab/kota"],
    kpiLabels: ["TPT Wilayah", "Kemiskinan Wilayah", "Gini Wilayah", "IPG Wilayah"],
    actionDirectives: [
      "Petakan gap capaian daerah terhadap rerata provinsi.",
      "Prioritaskan program perbaikan indikator terlemah tiap wilayah.",
      "Tetapkan rencana aksi 90 hari berbasis ranking kerentanan.",
    ],
    decisionSupport: "Mendukung evaluasi kinerja daerah dan tindak lanjut operasional daerah.",
    decisionLevel: "Operasional Daerah",
    audience: {
      primary: "Bupati/Wali Kota & Wakilnya, Sekretaris Daerah Kab/Kota",
      secondary: ["Bappeda Kabupaten/Kota", "Kepala Dinas daerah", "Camat di wilayah priority"],
      example: "Rencana aksi 90 hari untuk perbaikan indikator daerah berdasarkan ranking kerentanan.",
    },
  },
  {
    slug: "operational",
    title: "Operational Dashboard",
    subtitle: "Untuk Operator dan Admin Data",
    orientation: "Kontrol kualitas data harian: kelengkapan, konsistensi, dan status ketersediaan indikator.",
    focusMetrics: ["Kelengkapan data", "Status missing value", "Konsistensi update", "Catatan ETL"],
    kpiLabels: ["Kelengkapan TPT", "Ketersediaan Inflasi", "Status Kerentanan", "Catatan ETL Aktif"],
    actionDirectives: [
      "Lakukan tindak lanjut data belum tersedia dengan unit sumber data.",
      "Prioritaskan validasi record yang memiliki catatan ETL non-OK.",
      "Jadwalkan pemeriksaan konsistensi update bulanan secara rutin.",
    ],
    decisionSupport: "Mendukung jaminan kualitas data dan kesiapan data untuk analitik.",
    decisionLevel: "Teknis Data",
    audience: {
      primary: "Operator/Admin Data Diskominfo & BPS Provinsi",
      secondary: ["Tim ETL Pusat Data Pemprov", "IT Bappeda", "PIC integrasi data OPD"],
      example: "Validasi harian record ETL & follow-up ke unit sumber data ketika status kerentanan belum tersedia.",
    },
  },
  {
    slug: "analytical",
    title: "Analytical Dashboard",
    subtitle: "Untuk Tim BI dan Data Analyst",
    orientation: "Eksplorasi pola data lanjutan: cluster, prioritas skor, dan sinyal anomali untuk rekomendasi berbasis data.",
    focusMetrics: ["Clustering wilayah", "Priority score", "Korelasi indikator", "Anomali data"],
    kpiLabels: ["Rata-rata Skor Prioritas", "Top Cluster Intervensi", "Bottom Cluster Stabil", "Rentang Skor"],
    actionDirectives: [
      "Dalami karakteristik cluster prioritas tinggi sebagai dasar model intervensi.",
      "Identifikasi outlier indikator untuk investigasi lanjutan.",
      "Sediakan skenario intervensi berbasis segmentasi cluster.",
    ],
    decisionSupport: "Mendukung pendalaman analisis untuk rekomendasi berbasis data.",
    decisionLevel: "Eksplorasi",
    audience: {
      primary: "Tim Business Intelligence & Data Analyst Pemprov Jabar",
      secondary: ["Akademisi/peneliti mitra", "Konsultan kebijakan", "Tim riset Bappeda"],
      example: "Eksplorasi pola lanjutan untuk skenario simulasi kebijakan & rekomendasi berbasis cluster.",
    },
  },
  {
    slug: "public",
    title: "Public Dashboard",
    subtitle: "Untuk publik, akademisi, jurnalis, dan masyarakat umum",
    orientation: "Transparansi kinerja wilayah dalam format ringkas, mudah dipahami, dan akuntabel untuk publik.",
    focusMetrics: ["Tren ringkas", "Profil wilayah", "Transparansi indikator", "Topik prioritas"],
    kpiLabels: ["TPT Provinsi", "Kemiskinan Provinsi", "IPG Provinsi", "Wilayah Prioritas"],
    actionDirectives: [
      "Publikasikan ringkasan capaian indikator utama secara berkala.",
      "Gunakan data terbuka untuk literasi kebijakan berbasis bukti.",
      "Pantau perubahan ranking wilayah sebagai indikator akuntabilitas.",
    ],
    decisionSupport: "Mendukung transparansi, akuntabilitas, dan literasi data publik.",
    decisionLevel: "Publik",
    audience: {
      primary: "Masyarakat Umum Jawa Barat",
      secondary: ["Jurnalis & media", "Akademisi & dosen", "NGO & komunitas", "Mahasiswa"],
      example: "Memahami kondisi sosial-ekonomi daerah & memantau akuntabilitas pemerintah.",
    },
  },
];
