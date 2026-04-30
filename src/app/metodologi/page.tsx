import { AppShell } from "@/components/app-shell";
import {
    ChartFrame,
    ClusterRadar,
    CorrelationMatrix,
    SimpleBar,
} from "@/components/charts/index";
import { chartPalette, getClusterColor } from "@/components/charts/palette";
import { GradientText } from "@/components/ui/gradient-text";
import { MathBlock } from "@/components/ui/math";
import { SectionLabel } from "@/components/ui/section-label";
import { getClusterProfile, getCorrelationMatrix } from "@/lib/dashboard-metrics";
import { getDashboardData } from "@/lib/data";
import { formatAngka } from "@/lib/format";
import {
    businessQuestionMatrix,
    clusterInterpretation,
    weeklyReports,
    type WeeklyReport
} from "@/lib/laporan-content";
import {
    BarChart3,
    Cpu,
    Database,
    GitBranch,
    Layers,
    LineChart,
    Workflow,
    type LucideIcon
} from "lucide-react";
import Link from "next/link";

const pipeline: Array<{ icon: LucideIcon; week: string; tahap: string; detail: string; deliverables: string[] }> = [
  {
    icon: Database,
    week: "Minggu 1",
    tahap: "Data Inti & Business Understanding",
    detail: "Pengumpulan dataset 27 kabupaten/kota Jawa Barat. Penurunan KPI dari masalah kebijakan sosial-ekonomi.",
    deliverables: ["jabar_week1_dataset_inti_27kabkota.csv", "KPI: TPT, kemiskinan, gini, IPG, RLS, HLS"],
  },
  {
    icon: Workflow,
    week: "Minggu 2",
    tahap: "Stakeholder & Business Question",
    detail: "Pemetaan 6 stakeholder (Strategic, Tactical, Managerial, Operational, Analytical, Public) + business question.",
    deliverables: ["dim_dashboard_stakeholder.csv", "3 business question utama"],
  },
  {
    icon: Layers,
    week: "Minggu 3",
    tahap: "ETL & Data Warehouse",
    detail: "Cleaning, validasi, integrasi multi-source. Pembentukan star schema (fact + dimensi).",
    deliverables: [
      "fact_kinerja_ekonomi_tahunan.csv",
      "fact_inflasi_bulanan.csv",
      "dim_lokasi · dim_waktu_tahunan · dim_waktu_bulanan",
      "mart_kinerja & mart_inflasi",
    ],
  },
  {
    icon: Cpu,
    week: "Minggu 4",
    tahap: "Data Mining",
    detail: "Standardisasi, K-Means k=3 dengan silhouette evaluation, priority score komposit (SAW).",
    deliverables: [
      "week4_evaluasi_model_kmeans.csv",
      "week4_profil_cluster.csv",
      "week4_hasil_data_mining_cluster_priority.csv",
    ],
  },
  {
    icon: LineChart,
    week: "Minggu 5+",
    tahap: "Dashboard Stakeholder",
    detail: "Implementasi 9 halaman dashboard di Next.js + Recharts. Setiap stakeholder dengan visualisasi yang sesuai.",
    deliverables: ["Landing + 9 halaman", "15+ visualisasi", "Filter interaktif"],
  },
];

const principles = [
  "End-to-end terhubung: KPI → dataset → ETL → DW → ML → dashboard → insight → keputusan",
  "Tidak ada dashboard tanpa analisis data. Setiap chart adalah representasi hasil analisis",
  "Tidak hanya ML—konteks BI selalu dipertahankan. Insight harus berbasis data",
  "Setiap analisis menghasilkan rekomendasi yang dapat ditindaklanjuti",
  "Status data 'belum tersedia' ditampilkan apa adanya, tanpa imputasi tersembunyi",
];

export default async function MetodologiPage() {
  const { kinerja, clusterPriority } = await getDashboardData();
  const correlation = getCorrelationMatrix(kinerja);
  const clusterProfile = getClusterProfile(clusterPriority);

  // Silhouette dummy data dari Minggu 4 (k=2..6)
  const silhouetteData = [
    { k: 2, score: 0.42 },
    { k: 3, score: 0.51 },
    { k: 4, score: 0.46 },
    { k: 5, score: 0.39 },
    { k: 6, score: 0.34 },
  ];

  const radarData = ["TPT", "Miskin", "Gini", "IPG", "RLS", "HLS"].map((indikator) => {
    const row: Record<string, number | string> = { indikator };
    clusterProfile.forEach((c) => {
      const map: Record<string, number> = {
        TPT: c.tpt,
        Miskin: c.miskin,
        Gini: c.gini * 100,
        IPG: c.ipg,
        RLS: c.rls,
        HLS: c.hls,
      };
      row[c.cluster_label] = Number((map[indikator] ?? 0).toFixed(2));
    });
    return row;
  });

  return (
    <AppShell
      eyebrow="Methodology"
      title="Metodologi"
      highlight="end-to-end"
      description="Pipeline lengkap dari pengumpulan data hingga dashboard. Transparan, dapat direplikasi, dan terhubung satu sama lain."
    >
      {/* Pipeline */}
      <section className="rounded-2xl border border-border bg-card p-6 shadow-card md:p-8">
        <SectionLabel pulse>Pipeline 5 minggu</SectionLabel>
        <h2 className="font-display mt-3 text-2xl text-foreground md:text-3xl">
          Dari <GradientText>data mentah</GradientText> ke keputusan publik
        </h2>
        <div className="mt-8 space-y-4">
          {pipeline.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={step.week} className="group relative grid gap-4 rounded-xl border border-border bg-background p-5 transition-colors hover:border-accent/30 md:grid-cols-[120px_56px_1fr] md:items-start">
                <div className="md:pt-1">
                  <p className="font-mono-ui text-[10px] uppercase tracking-[0.18em] text-accent">{step.week}</p>
                  <p className="mt-1 font-display text-3xl text-foreground">#{String(idx + 1).padStart(2, "0")}</p>
                </div>
                <div className="hidden h-12 w-12 items-center justify-center rounded-xl gradient-bg shadow-accent-tint md:flex">
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-display text-lg text-foreground">{step.tahap}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{step.detail}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {step.deliverables.map((d) => (
                      <span key={d} className="rounded-md bg-muted px-2 py-1 font-mono-ui text-[10px] text-muted-foreground">
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Star schema */}
      <section className="rounded-2xl border border-border bg-card p-6 shadow-card md:p-8">
        <SectionLabel>Data warehouse</SectionLabel>
        <h2 className="font-display mt-3 text-2xl text-foreground md:text-3xl">
          Star schema dengan <GradientText>2 fact + 4 dimensi</GradientText>
        </h2>
        <div className="mt-8 grid gap-4 md:grid-cols-[1fr_1.5fr_1fr] md:items-stretch">
          <div className="space-y-3">
            <p className="font-mono-ui text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Dimensi</p>
            {[
              { name: "dim_lokasi", desc: "27 kab/kota + jenis_wilayah" },
              { name: "dim_waktu_tahunan", desc: "2021–2025 · 5 baris" },
              { name: "dim_waktu_bulanan", desc: "60 periode (5×12)" },
              { name: "dim_dashboard_stakeholder", desc: "6 role" },
            ].map((d) => (
              <div key={d.name} className="rounded-xl border border-border bg-background p-3">
                <p className="font-mono-ui text-[10px] uppercase tracking-[0.16em] text-muted-foreground">DIM</p>
                <p className="mt-0.5 text-sm font-medium text-foreground">{d.name}</p>
                <p className="text-[11px] text-muted-foreground">{d.desc}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-col items-center justify-center gap-3 rounded-xl bg-foreground p-5 text-background">
            <span className="font-mono-ui text-[10px] uppercase tracking-[0.2em] text-white/60">Fact</span>
            <p className="font-display text-xl text-white">fact_kinerja_ekonomi_tahunan</p>
            <p className="text-center text-[11px] text-white/60">measure: TPT · miskin · gini · IPG · RLS · HLS · indeks komposit</p>
            <div className="my-2 h-px w-full bg-white/10" />
            <p className="font-display text-xl text-white">fact_inflasi_bulanan</p>
            <p className="text-center text-[11px] text-white/60">measure: inflasi_yoy</p>
          </div>
          <div className="space-y-3">
            <p className="font-mono-ui text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Mart (output)</p>
            {[
              { name: "mart_kinerja_ekonomi_tahunan", desc: "Denormalized view" },
              { name: "mart_inflasi_bulanan", desc: "Denormalized view" },
              { name: "data_ready_analisis_2024", desc: "Snapshot terkini" },
              { name: "data_dictionary_etl_dw", desc: "Dokumentasi" },
            ].map((d) => (
              <div key={d.name} className="rounded-xl border border-accent/30 bg-accent/5 p-3">
                <p className="font-mono-ui text-[10px] uppercase tracking-[0.16em] text-accent">MART</p>
                <p className="mt-0.5 text-sm font-medium text-foreground">{d.name}</p>
                <p className="text-[11px] text-muted-foreground">{d.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Data mining */}
      <section className="rounded-2xl border border-border bg-card p-6 shadow-card md:p-8">
        <SectionLabel>Data mining</SectionLabel>
        <h2 className="font-display mt-3 text-2xl text-foreground md:text-3xl">
          K-Means clustering + <GradientText>SAW priority score</GradientText>
        </h2>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground md:text-base">
          K-Means dipilih karena interpretable dan cocok untuk segmentasi wilayah berbasis indikator numerik.
          Silhouette score dipakai untuk evaluasi pemilihan k. Priority score dihitung dengan SAW dari 4 indikator
          inti (TPT, kemiskinan, gini, kerentanan).
        </p>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-border bg-background p-5">
            <p className="font-mono-ui text-[10px] uppercase tracking-[0.18em] text-accent">K-Means objective</p>
            <MathBlock>{`J = \\sum_{i=1}^{k} \\sum_{x \\in C_i} \\|x - \\mu_i\\|^2`}</MathBlock>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Minimalkan total jarak kuadrat tiap titik <code>x</code> ke centroid <code>μᵢ</code> cluster-nya.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-background p-5">
            <p className="font-mono-ui text-[10px] uppercase tracking-[0.18em] text-accent">Silhouette score</p>
            <MathBlock>{`s(i) = \\frac{b(i) - a(i)}{\\max\\{a(i),\\, b(i)\\}}`}</MathBlock>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              <code>a(i)</code> = jarak rata-rata ke titik dalam cluster yang sama; <code>b(i)</code> = jarak ke cluster terdekat berikutnya.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-background p-5">
            <p className="font-mono-ui text-[10px] uppercase tracking-[0.18em] text-accent">SAW priority score</p>
            <MathBlock>{`V_i = \\sum_{j=1}^{n} w_j \\cdot r_{ij}`}</MathBlock>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              <code>rᵢⱼ</code> = nilai ternormalisasi alternatif <code>i</code> pada kriteria <code>j</code>. Bobot: TPT 0.30, Miskin 0.30, Gini 0.20, Kerentanan 0.20.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-background p-5">
            <p className="font-mono-ui text-[10px] uppercase tracking-[0.18em] text-accent">Pearson correlation</p>
            <MathBlock>{`\\rho_{X,Y} = \\frac{\\text{cov}(X,Y)}{\\sigma_X \\sigma_Y}`}</MathBlock>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Mengukur korelasi linier antar indikator. Range [-1, 1].
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          <ChartFrame
            title="Silhouette score per k"
            prompt="Kenapa k=3 jadi pilihan terbaik?"
            description="k=3 dipilih karena memberikan silhouette tertinggi & jumlah cluster yang interpretable."
            badge="Evaluasi · K-Means"
            height="h-72"
          >
            <SimpleBar data={silhouetteData} xKey="k" yKey="score" />
          </ChartFrame>

          <ChartFrame
            title="Profil rata-rata cluster"
            prompt="Apa karakter khas tiap kelompok wilayah?"
            description="Radar 6 indikator. Gini diskala ×100."
            badge="Profil · Cluster"
            height="h-72"
          >
            <ClusterRadar
              data={radarData}
              series={clusterProfile.map((c, i) => ({
                key: c.cluster_label,
                name: c.cluster_label,
                color: getClusterColor(c.cluster_label, i),
              }))}
            />
          </ChartFrame>
        </div>

        <ChartFrame
          title="Korelasi antar indikator"
          prompt="Indikator mana yang saling memengaruhi paling kuat?"
          description="Pearson correlation. Biru = positif, merah = negatif."
          badge="Korelasi"
          height="h-auto"
          className="mt-4"
        >
          <CorrelationMatrix labels={correlation.labels} matrix={correlation.matrix} />
        </ChartFrame>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {clusterProfile.map((c, i) => (
            <div key={c.cluster_label} className="rounded-xl border border-border bg-background p-4">
              <span className="inline-block h-2 w-8 rounded-full" style={{ background: getClusterColor(c.cluster_label, i) }} />
              <p className="font-display mt-2 text-lg text-foreground">{c.cluster_label}</p>
              <p className="text-xs text-muted-foreground">{c.jumlah} wilayah</p>
              <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
                <li>TPT: <span className="font-medium text-foreground">{formatAngka(c.tpt, 2)}%</span></li>
                <li>Miskin: <span className="font-medium text-foreground">{formatAngka(c.miskin, 2)}%</span></li>
                <li>IPG: <span className="font-medium text-foreground">{formatAngka(c.ipg, 2)}</span></li>
                <li>Skor: <span className="font-medium text-foreground">{formatAngka(c.priorityScore, 3)}</span></li>
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* SAW formula */}
      <section className="rounded-2xl border border-border bg-card p-6 shadow-card md:p-8">
        <SectionLabel>Priority score</SectionLabel>
        <h2 className="font-display mt-3 text-2xl text-foreground md:text-3xl">
          Simple Additive Weighting (SAW)
        </h2>
        <p className="mt-3 max-w-3xl text-sm text-muted-foreground md:text-base">
          Priority score = Σ wᵢ × normᵢ. Indikator yang lower-is-better (TPT, kemiskinan, gini) dinormalisasi
          terbalik, indikator higher-is-better (IPG) dinormalisasi langsung.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-4">
          {[
            { label: "TPT", weight: 0.30, type: "lower-better", color: chartPalette.accent },
            { label: "Kemiskinan", weight: 0.30, type: "lower-better", color: chartPalette.rose },
            { label: "Gini", weight: 0.20, type: "lower-better", color: chartPalette.violet },
            { label: "Kerentanan", weight: 0.20, type: "lower-better", color: chartPalette.amber },
          ].map((w) => (
            <div key={w.label} className="rounded-xl border border-border bg-background p-4">
              <p className="font-mono-ui text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{w.label}</p>
              <p className="font-display mt-1 text-2xl" style={{ color: w.color }}>
                {(w.weight * 100).toFixed(0)}%
              </p>
              <p className="text-[11px] text-muted-foreground">{w.type}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Principles */}
      <section className="rounded-2xl border border-border bg-card p-6 shadow-card md:p-8">
        <SectionLabel>Prinsip</SectionLabel>
        <h2 className="font-display mt-3 text-2xl text-foreground md:text-3xl">Prinsip implementasi</h2>
        <ul className="mt-6 space-y-3">
          {principles.map((p, i) => (
            <li key={p} className="flex items-start gap-3 rounded-xl border border-border bg-background p-4">
              <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/10 font-mono-ui text-[11px] font-semibold text-accent">
                {i + 1}
              </span>
              <span className="text-sm leading-relaxed text-foreground">{p}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Keterkaitan Minggu 1–4 → Halaman Dashboard */}
      <section className="rounded-2xl border border-border bg-card p-6 shadow-card md:p-8">
        <SectionLabel pulse>Traceability Minggu 1–4</SectionLabel>
        <h2 className="font-display mt-3 text-2xl text-foreground md:text-3xl">
          Setiap output mingguan <GradientText>terhubung ke halaman dashboard</GradientText>
        </h2>
        <p className="mt-3 max-w-3xl text-sm text-muted-foreground md:text-base">
          Empat laporan mingguan (Minggu 1–4) tidak berdiri sendiri. Setiap KPI, business question,
          fact/dim, dan hasil clustering dipakai langsung oleh halaman dashboard yang relevan.
        </p>
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {weeklyReports.map((wk: WeeklyReport) => (
            <div key={wk.minggu} className="rounded-xl border border-border bg-background p-5">
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-accent/10 px-2 py-0.5 font-mono-ui text-[10px] uppercase tracking-[0.18em] text-accent">
                  Minggu {wk.minggu}
                </span>
              </div>
              <p className="font-display mt-2 text-lg text-foreground">{wk.judul}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{wk.fokus}</p>
              <p className="mt-3 font-mono-ui text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                Output utama
              </p>
              <ul className="mt-1.5 space-y-1 text-xs text-foreground">
                {wk.outputUtama.map((o: string) => (
                  <li key={o} className="flex gap-2">
                    <span className="text-accent">▸</span>
                    {o}
                  </li>
                ))}
              </ul>
              <p className="mt-4 font-mono-ui text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                Halaman dashboard yang menjawab
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {wk.halamanTerkait.map((h: { href: string; label: string }) => (
                  <Link
                    key={h.href}
                    href={h.href}
                    className="rounded-md border border-border bg-card px-2 py-1 font-mono-ui text-[10px] text-foreground transition-colors hover:border-accent/30 hover:bg-muted"
                  >
                    {h.label}
                  </Link>
                ))}
              </div>
              <p className="mt-3 font-mono-ui text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                Artefak di repo
              </p>
              <ul className="mt-1.5 space-y-0.5 text-[11px] font-mono-ui text-muted-foreground">
                {wk.artefak.map((a: string) => (
                  <li key={a}>· {a}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Matriks 6 Business Question → Halaman */}
      <section className="rounded-2xl border border-border bg-card p-6 shadow-card md:p-8">
        <SectionLabel>Matriks Business Question</SectionLabel>
        <h2 className="font-display mt-3 text-2xl text-foreground md:text-3xl">
          6 pertanyaan utama (Minggu 1) → <GradientText>jawaban di dashboard</GradientText>
        </h2>
        <div className="dash-scroll mt-6 overflow-x-auto">
          <table className="min-w-full divide-y divide-border text-sm">
            <thead>
              <tr>
                <th className="px-3 py-2 text-left font-mono-ui text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Kode</th>
                <th className="px-3 py-2 text-left font-mono-ui text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Pertanyaan</th>
                <th className="px-3 py-2 text-left font-mono-ui text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Jenis</th>
                <th className="px-3 py-2 text-left font-mono-ui text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Visual Kunci</th>
                <th className="px-3 py-2 text-left font-mono-ui text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Jawaban di</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {businessQuestionMatrix.map((q: typeof businessQuestionMatrix[number]) => (
                <tr key={q.kode} className="hover:bg-muted/40">
                  <td className="px-3 py-3 font-display text-base text-accent">{q.kode}</td>
                  <td className="px-3 py-3 max-w-md text-foreground">{q.pertanyaan}</td>
                  <td className="px-3 py-3">
                    <span className="rounded-md bg-muted px-2 py-0.5 font-mono-ui text-[10px] text-muted-foreground">
                      {q.jenis}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-xs text-muted-foreground">{q.visualKunci}</td>
                  <td className="px-3 py-3">
                    <Link
                      href={q.href}
                      className="inline-flex items-center gap-1 rounded-md border border-accent/20 bg-accent/5 px-2 py-1 text-xs font-medium text-accent transition-colors hover:bg-accent/10"
                    >
                      Buka →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Interpretasi 3 Cluster Minggu 4 */}
      <section className="rounded-2xl border border-border bg-card p-6 shadow-card md:p-8">
        <SectionLabel>Interpretasi Cluster (Minggu 4)</SectionLabel>
        <h2 className="font-display mt-3 text-2xl text-foreground md:text-3xl">
          3 kelompok wilayah → <GradientText>keputusan & stakeholder target</GradientText>
        </h2>
        <p className="mt-3 max-w-3xl text-sm text-muted-foreground md:text-base">
          K-Means k=3 (silhouette 0.303) memetakan 27 kab/kota ke tiga profil. Setiap cluster punya
          rekomendasi keputusan dan stakeholder target spesifik agar dashboard tidak bersifat one-for-all.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {clusterInterpretation.map((c: typeof clusterInterpretation[number], i: number) => (
            <div key={c.label} className="rounded-xl border border-border bg-background p-5">
              <span className="inline-block h-2 w-10 rounded-full" style={{ background: getClusterColor(c.label, i) }} />
              <p className="font-display mt-3 text-lg leading-tight text-foreground">{c.label}</p>
              <p className="mt-1 text-xs text-muted-foreground">{c.jumlah} wilayah</p>
              <p className="mt-3 text-sm leading-relaxed text-foreground">{c.ringkasan}</p>
              <div className="mt-4 rounded-lg border border-accent/20 bg-accent/5 p-3">
                <p className="font-mono-ui text-[10px] uppercase tracking-[0.16em] text-accent">Decision</p>
                <p className="mt-1 text-xs leading-relaxed text-foreground">{c.decision}</p>
              </div>
              <p className="mt-3 font-mono-ui text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                Stakeholder target
              </p>
              <div className="mt-1.5 flex flex-wrap gap-1">
                {c.stakeholderTarget.map((s: string) => (
                  <span key={s} className="rounded-md bg-muted px-2 py-0.5 font-mono-ui text-[10px] text-foreground">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tools */}
      <section className="rounded-2xl border border-border bg-card p-6 shadow-card md:p-8">
        <SectionLabel>Tools & library</SectionLabel>
        <h2 className="font-display mt-3 text-2xl text-foreground md:text-3xl">Stack teknologi</h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Database, label: "ETL · Python", items: ["pandas", "numpy", "csv-parse"] },
            { icon: Cpu, label: "Data mining", items: ["scikit-learn (KMeans)", "matplotlib"] },
            { icon: GitBranch, label: "Frontend", items: ["Next.js 16", "React 19", "Tailwind v4"] },
            { icon: BarChart3, label: "Visualisasi", items: ["Recharts", "Framer Motion", "Lucide"] },
          ].map((t) => {
            const Icon = t.icon;
            return (
              <div key={t.label} className="rounded-xl border border-border bg-background p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="font-display mt-3 text-base text-foreground">{t.label}</p>
                <ul className="mt-2 space-y-0.5 text-xs text-muted-foreground">
                  {t.items.map((i) => (
                    <li key={i}>· {i}</li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>
    </AppShell>
  );
}
