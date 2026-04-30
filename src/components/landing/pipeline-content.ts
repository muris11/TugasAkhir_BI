import type { LucideIcon } from "lucide-react";
import {
    BarChart3,
    Compass,
    Cpu,
    Database,
    GitBranch,
    Layers,
    LineChart,
    Workflow,
    Zap,
} from "lucide-react";

export type PipelineStep = {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  short: string;
  kontrolBI: string;
  icon: LucideIcon;
  aktivitas: string[];
  output: string[];
  tools: string[];
  referensi: string;
  formula?: Array<{
    label: string;
    expr: string; // KaTeX expression
    desc: string;
  }>;
  contoh?: {
    caption: string;
    rows: Array<Array<string>>;
    headers: string[];
  };
};

export const pipelineSteps: PipelineStep[] = [
  {
    id: "01",
    number: "01",
    title: "Business Understanding",
    subtitle: "Memahami masalah dulu, baru cari data.",
    short: "Permasalahan Smart City Jabar diturunkan jadi KPI & business question.",
    kontrolBI: "Business Layer",
    icon: Compass,
    aktivitas: [
      "Identifikasi masalah sosial-ekonomi Jabar (pengangguran tinggi, kemiskinan persisten, ketimpangan antar wilayah).",
      "Pemetaan stakeholder: Gubernur/Bappeda, Dinas, Pemkab/Pemkot, Operator data, Tim BI, dan Publik.",
      "Definisi 3 business question utama yang harus dijawab oleh dashboard.",
      "Menetapkan ruang lingkup: 27 kabupaten/kota Jawa Barat, periode 2021–2025.",
    ],
    output: [
      "Dokumen scope proyek (Minggu 1)",
      "3 business question + KPI traceability matrix",
      "Stakeholder map 6 role",
    ],
    tools: ["Notion", "Diskusi tim", "Studi literatur BPS"],
    referensi: "Laporan Minggu 1 — Bab Pendahuluan & Kebutuhan Bisnis.",
  },
  {
    id: "02",
    number: "02",
    title: "KPI",
    subtitle: "Indikator yang akan dipantau & diukur.",
    short: "TPT, kemiskinan, gini, IPG, inflasi YoY, kerentanan.",
    kontrolBI: "Measurement Layer",
    icon: BarChart3,
    aktivitas: [
      "Pemilihan 6 KPI inti berdasarkan publikasi BPS dan keterkaitan dengan business question.",
      "Definisi tiap KPI: satuan, sumber, frekuensi update, dan arah optimal (lower-better atau higher-better).",
      "Pembentukan KPI turunan: priority score (komposit) dan indeks kerentanan.",
    ],
    output: [
      "KPI dictionary (6 indikator inti + 2 indikator turunan)",
      "Mapping KPI → fact table → dashboard component",
    ],
    tools: ["Excel", "Data dictionary", "BPS publikasi"],
    referensi: "Laporan Minggu 2 — Bab Kebutuhan Bisnis & KPI.",
    formula: [
      {
        label: "Inflasi Year-on-Year",
        expr: "\\text{Inflasi YoY}_t = \\frac{\\text{IHK}_t - \\text{IHK}_{t-12}}{\\text{IHK}_{t-12}} \\times 100\\%",
        desc: "Perbandingan Indeks Harga Konsumen bulan ke-t terhadap bulan yang sama tahun sebelumnya.",
      },
      {
        label: "Indeks Kerentanan (komposit)",
        expr: "\\text{Kerentanan} = w_1 \\cdot \\text{norm}(\\text{TPT}) + w_2 \\cdot \\text{norm}(\\text{Miskin}) + w_3 \\cdot \\text{norm}(\\text{Gini})",
        desc: "Bobot wᵢ ditentukan dari kepentingan kebijakan (default 0.4/0.4/0.2). Norm = Min-Max scaling.",
      },
    ],
  },
  {
    id: "03",
    number: "03",
    title: "Dataset",
    subtitle: "Multi-source, terbuka, terdokumentasi.",
    short: "27 kab/kota, BPS + Open Data Jabar + BI, 2021–2025.",
    kontrolBI: "Data Acquisition",
    icon: Database,
    aktivitas: [
      "Akuisisi data dari 3 sumber: BPS Provinsi Jabar, Open Data Jabar (jabarprov.go.id), dan Bank Indonesia.",
      "Data tabular CSV: 135 record kinerja tahunan (27 wilayah × 5 tahun) + 1.620 record inflasi bulanan (27 wilayah × 5 tahun × 12 bulan).",
      "Validasi struktur kolom & tipe data terhadap data dictionary.",
    ],
    output: [
      "jabar_week1_dataset_inti_27kabkota.csv",
      "data_dictionary_etl_dw.csv",
      "ringkasan_objek_etl_dw.csv",
    ],
    tools: ["Python (pandas)", "CSV parser", "Open Data Jabar API"],
    referensi: "Laporan Minggu 1 & 3 — Bab Dataset.",
    formula: [
      {
        label: "Coverage data",
        expr: "\\text{Coverage} = \\frac{\\text{record tersedia}}{\\text{record diharapkan}} \\times 100\\%",
        desc: "Mengukur kelengkapan data per indikator/per tahun. Threshold publikasi: ≥ 90%.",
      },
    ],
    contoh: {
      caption: "Sample skema kolom mart_kinerja_ekonomi_tahunan",
      headers: ["Kolom", "Tipe", "Sumber"],
      rows: [
        ["nama_wilayah", "string", "BPS"],
        ["tahun", "int", "BPS"],
        ["tpt", "float", "BPS Sakernas"],
        ["persentase_penduduk_miskin", "float", "BPS Susenas"],
        ["gini_ratio", "float", "BPS Susenas"],
        ["ipg", "float", "BPS"],
        ["status_indeks_kerentanan", "string", "ETL turunan"],
      ],
    },
  },
  {
    id: "04",
    number: "04",
    title: "ETL",
    subtitle: "Extract, Transform, Load—setiap byte tervalidasi.",
    short: "Cleaning, integrasi multi-source, normalisasi, validasi.",
    kontrolBI: "Data Engineering",
    icon: Workflow,
    aktivitas: [
      "**Extract**: load 3 dataset CSV ke dataframe Python.",
      "**Transform**: cleaning (trim, lowercase nama wilayah), integrasi (join by nama_wilayah + tahun), validasi range (TPT 0–30%, IPG 0–110), imputasi missing dengan flag.",
      "**Load**: simpan ke fact + dimension tables, lalu denormalisasi ke mart untuk konsumsi dashboard.",
      "Audit kolom keterangan_etl untuk traceability.",
    ],
    output: [
      "fact_kinerja_ekonomi_tahunan.csv",
      "fact_inflasi_bulanan.csv",
      "mart_kinerja_ekonomi_tahunan.csv",
      "mart_inflasi_bulanan.csv",
    ],
    tools: ["Python (pandas)", "numpy", "csv-parse"],
    referensi: "Laporan Minggu 3 — Bab ETL & Data Warehouse.",
    formula: [
      {
        label: "Min-Max Normalisasi",
        expr: "x' = \\frac{x - \\min(X)}{\\max(X) - \\min(X)}",
        desc: "Skala fitur ke rentang [0, 1]. Dipakai sebelum K-Means agar bobot fitur seragam.",
      },
      {
        label: "Z-Score Standarisasi",
        expr: "z = \\frac{x - \\mu}{\\sigma}",
        desc: "Skala fitur ke distribusi mean 0, stdev 1. Alternatif Min-Max bila ada outlier ekstrim.",
      },
    ],
  },
  {
    id: "05",
    number: "05",
    title: "Data Warehouse",
    subtitle: "Star schema: 2 fact, 4 dimensi.",
    short: "Star schema fact + dimension, mart kinerja & inflasi.",
    kontrolBI: "Storage Layer",
    icon: Layers,
    aktivitas: [
      "Pemodelan star schema dengan grain `fact_kinerja_ekonomi_tahunan` = 1 record per (wilayah, tahun).",
      "Pemodelan grain `fact_inflasi_bulanan` = 1 record per (wilayah, tahun, bulan).",
      "Pembentukan 4 dimensi: dim_lokasi (Type-1 SCD), dim_waktu_tahunan, dim_waktu_bulanan, dim_dashboard_stakeholder.",
      "Generate surrogate key & relasi 1:N antara fact dan dimensi.",
    ],
    output: [
      "Star schema diagram",
      "fact_*.csv (2 fact)",
      "dim_*.csv (4 dimensi)",
      "mart_*.csv (2 view denormalized)",
    ],
    tools: ["Python", "draw.io / dbdiagram", "CSV"],
    referensi: "Laporan Minggu 3 — Bab Data Warehouse.",
    contoh: {
      caption: "Cardinality grain",
      headers: ["Tabel", "Jumlah Baris", "Grain"],
      rows: [
        ["fact_kinerja_ekonomi_tahunan", "135", "wilayah × tahun"],
        ["fact_inflasi_bulanan", "1.620", "wilayah × tahun × bulan"],
        ["dim_lokasi", "27", "1 baris per kab/kota"],
        ["dim_waktu_tahunan", "5", "2021–2025"],
        ["dim_waktu_bulanan", "60", "5 tahun × 12 bulan"],
        ["dim_dashboard_stakeholder", "6", "1 baris per role"],
      ],
    },
  },
  {
    id: "06",
    number: "06",
    title: "Data Mining",
    subtitle: "K-Means + Silhouette + SAW priority score.",
    short: "K-Means clustering + priority score komposit (SAW).",
    kontrolBI: "Analytics Layer",
    icon: Cpu,
    aktivitas: [
      "Standarisasi fitur dengan Z-score (TPT, miskin, gini, IPG, RLS, HLS).",
      "Penentuan k optimal: uji k=2..6, evaluasi dengan Silhouette score → terpilih k=3 (silhouette 0.51).",
      "Pelabelan cluster berdasar profil rata-rata: Prioritas Tinggi / Sedang / Rendah.",
      "Perhitungan priority score per wilayah dengan SAW (Simple Additive Weighting).",
      "Validasi: Pearson correlation antar indikator untuk uji multikolinearitas.",
    ],
    output: [
      "week4_evaluasi_model_kmeans.csv (silhouette per k)",
      "week4_profil_cluster.csv (rata-rata indikator per cluster)",
      "week4_hasil_data_mining_cluster_priority.csv (label & skor 27 wilayah)",
      "week4_bobot_skor_prioritas.csv (bobot SAW)",
    ],
    tools: ["scikit-learn (KMeans)", "matplotlib", "scipy"],
    referensi: "Laporan Minggu 4 — Bab Data Mining & Evaluasi Model.",
    formula: [
      {
        label: "K-Means Objective",
        expr: "J = \\sum_{i=1}^{k} \\sum_{x \\in C_i} \\|x - \\mu_i\\|^2",
        desc: "Minimalkan total jarak kuadrat tiap titik ke centroid cluster-nya. k=3 dipilih karena interpretable & silhouette tertinggi.",
      },
      {
        label: "Silhouette Score",
        expr: "s(i) = \\frac{b(i) - a(i)}{\\max\\{a(i),\\, b(i)\\}}",
        desc: "a(i) = jarak rata-rata ke titik dalam cluster yang sama. b(i) = jarak rata-rata ke titik di cluster terdekat berikutnya. Skor [-1, 1], makin tinggi makin baik.",
      },
      {
        label: "SAW Priority Score",
        expr: "V_i = \\sum_{j=1}^{n} w_j \\cdot r_{ij}",
        desc: "rᵢⱼ = nilai ternormalisasi alternatif ke-i pada kriteria ke-j. Bobot: TPT 0.30, Miskin 0.30, Gini 0.20, Kerentanan 0.20.",
      },
      {
        label: "Pearson Correlation",
        expr: "\\rho_{X,Y} = \\frac{\\text{cov}(X,Y)}{\\sigma_X \\sigma_Y}",
        desc: "Mengukur korelasi linier antar indikator. Nilai [-1, 1]. Dipakai untuk uji apakah indikator saling redundant.",
      },
    ],
  },
  {
    id: "07",
    number: "07",
    title: "Dashboard",
    subtitle: "9 halaman, 15+ visualisasi, role-aware.",
    short: "6 stakeholder + 3 utility page, 15+ visualisasi interaktif.",
    kontrolBI: "Presentation Layer",
    icon: LineChart,
    aktivitas: [
      "Implementasi landing page + 9 halaman dashboard di Next.js + Recharts.",
      "Pembuatan 15+ komponen chart: trend line, ranking, scatter, radar, treemap, heatmap, gauge, sparkline, distribution, correlation matrix.",
      "Filter implisit per role (jenis wilayah & tahun untuk halaman strategis/taktis).",
      "Setiap chart diberi pemantik question-led dan deskripsi teknis.",
    ],
    output: [
      "Landing page + 9 halaman terhubung",
      "15+ komponen visualisasi reusable",
      "Insight box (apa→mengapa→dampak→keputusan) per halaman",
    ],
    tools: ["Next.js 16", "React 19", "Recharts", "Framer Motion", "Tailwind v4"],
    referensi: "Laporan Minggu 5 — Bab Dashboard BI.",
  },
  {
    id: "08",
    number: "08",
    title: "Decision",
    subtitle: "Insight → keputusan → rekomendasi → KPI monitor.",
    short: "Insight → keputusan berbasis data → rekomendasi prioritas.",
    kontrolBI: "Action Layer",
    icon: Zap,
    aktivitas: [
      "Sintesis insight dari analisis cluster: top-3 wilayah priority tertinggi (Indramayu, Cirebon, Cianjur).",
      "Formulasi keputusan: paket intervensi terpadu lintas OPD untuk wilayah priority.",
      "Rekomendasi prioritas: alokasi anggaran, task force, review berkala 6 bulan.",
      "Setup KPI monitor: ranking + skor di-track ulang per tahun anggaran.",
    ],
    output: [
      "Decision document (rekomendasi 5 wilayah priority)",
      "Action plan 90 hari per Pemkab/Pemkot",
      "KPI monitoring schedule",
    ],
    tools: ["Dashboard insight box", "Stakeholder meeting"],
    referensi: "Laporan Minggu 5 — Bab Insight & Decision Making.",
  },
];

// Re-export icon helper
export const PipelineGitBranchIcon = GitBranch;
