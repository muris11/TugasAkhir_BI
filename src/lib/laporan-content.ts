/**
 * Ringkasan naratif Minggu 1–4 sebagai konstanta TS.
 * Dipakai di /metodologi untuk merender traceability eksplisit dari laporan tugas besar.
 * Sumber: dataset/laporan/Laporan_Minggu_{1..4}_*.docx & laporan markdown ringkas pada repo.
 */

export type WeeklyReport = {
  minggu: 1 | 2 | 3 | 4;
  judul: string;
  fokus: string;
  outputUtama: string[];
  artefak: string[]; // path relatif ke /dataset/...
  halamanTerkait: Array<{ href: string; label: string }>;
};

export const weeklyReports: WeeklyReport[] = [
  {
    minggu: 1,
    judul: "Topik, Business Understanding, KPI, Business Question, Dataset",
    fokus:
      "Menetapkan tema Smart Economy, stakeholder 9 role, 9 KPI, 6 Business Question, dan dataset panel 27 kab/kota × 5 tahun × 12 bulan = 1.620 baris.",
    outputUtama: [
      "Judul proyek + ruang lingkup 27 kab/kota Jawa Barat (2021–2025)",
      "9 KPI: TPT, Kemiskinan, Inflasi YoY, Gini, IPG, RLS, HLS, Pendidikan Indeks Sederhana, Kemiskinan-Pengangguran Index",
      "6 Business Question utama (TPT ekstrim, miskin+IPG rendah, pola inflasi, korelasi multi-indikator, kota vs kabupaten, prioritas kebijakan)",
      "Stakeholder map 9 role + 6 jenis dashboard (strategic/tactical/managerial/operational/analytical/public)",
    ],
    artefak: [
      "/dataset/laporan/Laporan_Minggu_1_BI_Kelompok 3_D4 SIKC 3B.pdf",
      "/dataset/jabar_week1_dataset_inti_27kabkota.csv",
    ],
    halamanTerkait: [
      { href: "/", label: "Landing — Hero & Indicators" },
      { href: "/analisis", label: "Analisis · 6 Business Question" },
      { href: "/dashboard", label: "Beranda Dashboard" },
    ],
  },
  {
    minggu: 2,
    judul: "Eksplorasi Data (EDA), Analytical Question, Insight Awal",
    fokus:
      "Statistik deskriptif, distribusi, tren 2021–2025, korelasi pendidikan↔kemiskinan, perbandingan kota vs kabupaten, dan top-5 wilayah kerentanan ekonomi 2024.",
    outputUtama: [
      "Statistik deskriptif 9 variabel (mean, median, min, max)",
      "Tren rata-rata TPT 9.40% → 6.52% & kemiskinan 8.97% → 7.60%",
      "Top-5 wilayah rentan 2024: Kuningan, Indramayu, Cirebon, Tasikmalaya (kota), Bandung Barat",
      "Korelasi pendidikan ↔ kemiskinan ≈ -0.75 (negatif kuat)",
      "Insight kota vs kabupaten: kota unggul pendidikan, namun TPT & gini lebih tinggi",
    ],
    artefak: [
      "/dataset/laporan/Laporan_Minggu_2_BI_Kelompok 3_D4 SIKC3B.pdf",
    ],
    halamanTerkait: [
      { href: "/analisis#q1", label: "Q1 · TPT Ranking" },
      { href: "/analisis#q4", label: "Q4 · Korelasi Indikator" },
      { href: "/analisis#q5", label: "Q5 · Kota vs Kabupaten" },
      { href: "/data-quality", label: "Data Quality" },
    ],
  },
  {
    minggu: 3,
    judul: "Preprocessing (ETL) dan Perancangan Data Warehouse",
    fokus:
      "Star schema multi-fact dengan conformed dimension lokasi & waktu. Pemisahan grain tahunan (135 baris) dan bulanan (1.620 baris). Snapshot data_ready_analisis_2024 sebagai input data mining.",
    outputUtama: [
      "Star schema: 2 fact + 4 dimensi + 2 mart",
      "fact_kinerja_ekonomi_tahunan (135 baris) · fact_inflasi_bulanan (1.620 baris)",
      "dim_lokasi (27) · dim_waktu_tahunan (5) · dim_waktu_bulanan (60) · dim_dashboard_stakeholder (6)",
      "mart_kinerja_ekonomi_tahunan + mart_inflasi_bulanan untuk dashboard",
      "data_ready_analisis_2024 (27 baris, tanpa missing pada KPI inti)",
    ],
    artefak: [
      "/dataset/laporan/Laporan_Minggu_3_BI_Kelompok 3_D4 SIKC3B.pdf",
      "/dataset/Minggu3_Final_Laporan_dan_Data/data_siap_dw/",
      "/dataset/Kode_Python_Minggu_3_dan_4_BI_Kelompok3/",
    ],
    halamanTerkait: [
      { href: "/metodologi", label: "Metodologi · Star Schema" },
      { href: "/data-quality", label: "Data Quality · Coverage" },
    ],
  },
  {
    minggu: 4,
    judul: "Analisis Data Mining, Evaluasi, dan Interpretasi",
    fokus:
      "K-Means clustering pada data_ready_analisis_2024 (27 wilayah, 9 fitur). Evaluasi k=2..6, k=3 dipilih (silhouette 0.303) untuk interpretasi operasional. Skor prioritas SAW untuk ranking wilayah.",
    outputUtama: [
      "3 cluster: Prioritas Intervensi Sosial-Ekonomi (12) · Urban Produktif Tidak Merata (8) · Relatif Stabil (7)",
      "Top-10 priority score: Kuningan, Bandung Barat, Cirebon, Indramayu, Garut, Cianjur, Purwakarta, Subang, Karawang, Majalengka",
      "Silhouette per k = {2: 0.375, 3: 0.303, 4: 0.305, 5: 0.273, 6: 0.237}",
      "Bobot SAW: TPT 0.20, Miskin 0.25, Gini 0.10, Low-Edu 0.20, Low-IPG 0.10, Rentan 0.15",
      "Decision per cluster + rekomendasi 5 stakeholder (Bappeda, Dinsos, Disnaker, Pemkab/Pemkot, Tim BI)",
    ],
    artefak: [
      "/dataset/laporan/Laporan_Minggu_4_BI_Kelompok_3_D4_SIKC3B_Lengkap.pdf",
      "/dataset/Minggu 4/output_data_mining/",
      "/dataset/Minggu 4/Kode_Python_Minggu_4_Data_Mining.ipynb",
    ],
    halamanTerkait: [
      { href: "/ringkasan-eksekutif", label: "Ringkasan Eksekutif · Top-10" },
      { href: "/analisis#q6", label: "Q6 · Prioritas Kebijakan" },
      { href: "/stakeholder/strategic", label: "Strategic Dashboard" },
      { href: "/stakeholder/analytical", label: "Analytical · Cluster Map" },
    ],
  },
];

/**
 * Matriks 6 Business Question (Minggu 1) → halaman dashboard yang menjawabnya.
 */
export const businessQuestionMatrix: Array<{
  kode: string;
  pertanyaan: string;
  jenis: string;
  jawabanSingkat: string;
  href: string;
  visualKunci: string;
}> = [
  {
    kode: "BQ1",
    pertanyaan: "Kabupaten/kota mana yang memiliki tingkat pengangguran tertinggi dan terendah pada periode 2021–2025?",
    jenis: "Descriptive",
    jawabanSingkat: "Top-5 & Bottom-5 wilayah berdasar TPT 2025 dengan reference rata-rata provinsi.",
    href: "/analisis#q1",
    visualKunci: "Ranking bar TPT tertinggi & terendah",
  },
  {
    kode: "BQ2",
    pertanyaan: "Wilayah mana yang memiliki tingkat kemiskinan tinggi sekaligus kualitas pembangunan manusia relatif rendah?",
    jenis: "Diagnostic",
    jawabanSingkat: "Scatter quadrant Miskin × IPG; danger zone (miskin > avg & IPG < avg) di-highlight.",
    href: "/analisis#q2",
    visualKunci: "Scatter quadrant analysis",
  },
  {
    kode: "BQ3",
    pertanyaan: "Bagaimana pola inflasi bulanan antarwilayah dan kapan tekanan harga tertinggi muncul?",
    jenis: "Trend",
    jawabanSingkat: "Heatmap inflasi YoY 10 wilayah × 12 bulan terakhir + identifikasi puncak Q4.",
    href: "/analisis#q3",
    visualKunci: "Inflation heatmap + peak callout",
  },
  {
    kode: "BQ4",
    pertanyaan: "Apakah terdapat hubungan antara pendidikan, pembangunan gender, pengangguran, dan kemiskinan?",
    jenis: "Correlation",
    jawabanSingkat: "Pearson correlation matrix 9 indikator; pendidikan ↔ kemiskinan ≈ -0.75.",
    href: "/analisis#q4",
    visualKunci: "Correlation matrix heatmap",
  },
  {
    kode: "BQ5",
    pertanyaan: "Apakah kota secara umum memiliki performa smart economy yang lebih baik daripada kabupaten?",
    jenis: "Comparative",
    jawabanSingkat: "Komparasi rata-rata 9 kota vs 18 kabupaten; kota unggul pendidikan, kabupaten unggul gini.",
    href: "/analisis#q5",
    visualKunci: "Komparasi grouped bar + tipologi card",
  },
  {
    kode: "BQ6",
    pertanyaan: "Wilayah mana yang harus menjadi prioritas kebijakan smart economy berdasarkan gabungan KPI utama?",
    jenis: "Prioritization",
    jawabanSingkat: "Top-10 priority score (SAW) + cluster K-Means k=3; Kuningan #1.",
    href: "/analisis#q6",
    visualKunci: "Ranking bar SAW + treemap cluster",
  },
];

/**
 * Profil 3 cluster K-Means hasil Minggu 4 (sumber: Laporan_Minggu_4 §7).
 * Angka rata-rata KPI tetap dirender dari mart oleh dashboard-metrics; ini metadata interpretasi.
 */
export const clusterInterpretation: Array<{
  label: string;
  jumlah: number;
  ringkasan: string;
  decision: string;
  stakeholderTarget: string[];
}> = [
  {
    label: "Prioritas Intervensi Sosial-Ekonomi",
    jumlah: 12,
    ringkasan:
      "Didominasi kabupaten dengan kemiskinan tinggi, pendidikan relatif rendah, dan skor prioritas tertinggi.",
    decision:
      "Fokus program pengurangan kemiskinan, peningkatan akses pendidikan, pelatihan kerja, dan perlindungan sosial.",
    stakeholderTarget: ["Bappeda", "Dinsos", "Disnaker", "Pemkab terkait"],
  },
  {
    label: "Wilayah Urban Produktif namun Tidak Merata",
    jumlah: 8,
    ringkasan:
      "Didominasi kota dengan pendidikan & IPG tinggi, namun TPT dan ketimpangan (gini) cenderung tinggi.",
    decision:
      "Pemerataan kesempatan kerja, pengendalian ketimpangan, dan link-and-match tenaga kerja.",
    stakeholderTarget: ["Pemkot", "Disnaker", "TPID", "Bappeda"],
  },
  {
    label: "Relatif Stabil / Menengah",
    jumlah: 7,
    ringkasan:
      "Tekanan ekonomi relatif lebih rendah; campuran kota-kabupaten dengan capaian indikator menengah.",
    decision:
      "Monitoring berkala, menjaga daya tahan ekonomi, dan mencegah penurunan indikator.",
    stakeholderTarget: ["Pemkab/Pemkot", "Bappeda", "Tim BI"],
  },
];
