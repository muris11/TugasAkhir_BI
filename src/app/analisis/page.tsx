import { AppShell } from "@/components/app-shell";
import {
  ChartFrame,
  CorrelationMatrix,
  InflationHeatmap,
  RankingBar,
  ScatterBubble,
  SimpleBar,
} from "@/components/charts/index";
import { chartPalette } from "@/components/charts/palette";
import { InsightBox } from "@/components/ui/insight-box";
import { SectionLabel } from "@/components/ui/section-label";
import {
  getCorrelationMatrix,
  getInflasiPeakAnalysis,
  getKotaVsKabupaten,
  getMiskinIpgAnalysis,
  getTopPriority,
  getTptRanking,
} from "@/lib/dashboard-metrics";
import { getDashboardData, getInflasiRingkas, type InflasiRow } from "@/lib/data";
import { formatAngka, formatPersen } from "@/lib/format";
import {
  HelpCircle,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  MapPin,
  BarChart3,
  Building2,
  Trees,
} from "lucide-react";

export default async function AnalisisPage() {
  const data = await getDashboardData();
  const tahun = 2025;

  // Q1: TPT Ranking
  const tptAnalysis = getTptRanking(data.kinerja, tahun, 5);

  // Q2: Miskin vs IPG
  const miskinIpg = getMiskinIpgAnalysis(data.kinerja, tahun);

  // Q3: Inflasi
  const inflasiPeak = getInflasiPeakAnalysis(data.inflasi);
  const inflasiHeatmapData = buildInflasiHeatmap(data.inflasi);

  // Q4: Korelasi
  const correlation = getCorrelationMatrix(data.kinerja);

  // Q5: Kota vs Kabupaten
  const kotaKab = getKotaVsKabupaten(data.kinerja, tahun);

  // Q6: Priority
  const topPriority = getTopPriority(data.clusterPriority, 10);

  // Format data for charts
  const topTptData = tptAnalysis.top.map((r) => ({ wilayah: r.nama, nilai: r.tpt }));
  const bottomTptData = tptAnalysis.bottom.map((r) => ({ wilayah: r.nama, nilai: r.tpt }));

  const kotaKabData = kotaKab.kota.stats.map((stat, i) => ({
    indikator: stat.name,
    kota: stat.avg,
    kabupaten: kotaKab.kabupaten.stats[i].avg,
  }));

  const priorityData = topPriority.map((r) => ({
    wilayah: r.nama_wilayah,
    skor: Number(r.priority_score.toFixed(3)),
  }));

  const namaBulan = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  const peakBulan = namaBulan[inflasiPeak.peak.bulan - 1];

  return (
    <AppShell
      title="Analisis Bisnis"
      highlight="2.4 Business Question"
      description="Enam pertanyaan analitis utama mengenai pengangguran, kemiskinan, inflasi, korelasi indikator, performa kota vs kabupaten, dan prioritas kebijakan smart economy."
      eyebrow="Analisis Mendalam"
    >
      {/* TOC Navigation */}
      <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
        <SectionLabel>Daftar Pertanyaan Analitis</SectionLabel>
        <nav className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { num: "Q1", text: "TPT Tertinggi & Terendah", icon: TrendingUp },
            { num: "Q2", text: "Kemiskinan Tinggi + IPG Rendah", icon: AlertTriangle },
            { num: "Q3", text: "Pola Inflasi & Puncak Tekanan", icon: TrendingDown },
            { num: "Q4", text: "Korelasi Multi-Indikator", icon: BarChart3 },
            { num: "Q5", text: "Kota vs Kabupaten", icon: Building2 },
            { num: "Q6", text: "Prioritas Kebijakan", icon: MapPin },
          ].map((q) => (
            <a
              key={q.num}
              href={`#${q.num.toLowerCase()}`}
              className="group flex items-center gap-3 rounded-xl border border-border bg-background p-3 transition-all hover:border-accent/30 hover:bg-muted"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent/10 font-mono-ui text-[10px] font-semibold text-accent">
                {q.num}
              </span>
              <span className="text-sm font-medium text-foreground">{q.text}</span>
              <q.icon className="ml-auto h-4 w-4 text-muted-foreground group-hover:text-accent" />
            </a>
          ))}
        </nav>
      </section>

      {/* Q1: TPT Tertinggi & Terendah */}
      <section id="q1" className="scroll-mt-24">
        <SectionLabel>Q1 · Analisis Pengangguran</SectionLabel>
        <h2 className="font-display mt-3 text-2xl text-foreground md:text-3xl">
          Kabupaten/kota mana yang memiliki tingkat pengangguran tertinggi dan terendah?
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          Periode analisis: 2021-2025. Focus pada data terbaru (2025) dengan perbandingan terhadap rata-rata provinsi.
        </p>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <ChartFrame
            title="5 Wilayah TPT Tertinggi (2025)"
            prompt="Dimana pusat pengangguran terkonsentrasi?"
            description="Persentase tenaga kerja menganggur."
            badge="Ranking · TPT Tinggi"
            height="h-80"
          >
            <RankingBar
              data={topTptData}
              xKey="wilayah"
              yKey="nilai"
              color="rose"
              reference={{ x: tptAnalysis.avg, label: `Avg: ${formatPersen(tptAnalysis.avg, 2)}` }}
            />
          </ChartFrame>

          <ChartFrame
            title="5 Wilayah TPT Terendah (2025)"
            prompt="Wilayah mana yang paling berhasil menyerap tenaga kerja?"
            description="Persentase tenaga kerja menganggur terendah."
            badge="Ranking · TPT Rendah"
            height="h-80"
          >
            <RankingBar
              data={bottomTptData}
              xKey="wilayah"
              yKey="nilai"
              color="emerald"
              reference={{ x: tptAnalysis.avg, label: `Avg: ${formatPersen(tptAnalysis.avg, 2)}` }}
            />
          </ChartFrame>
        </div>

        <div className="mt-4 rounded-xl border border-accent/20 bg-accent/5 p-4">
          <p className="font-mono-ui text-[10px] uppercase tracking-[0.18em] text-accent">Temuan Utama</p>
          <p className="mt-1 text-sm text-foreground">
            <strong>{topTptData[0]?.wilayah}</strong> mencatat TPT tertinggi ({formatPersen(topTptData[0]?.nilai, 2)}), 
            sementara <strong>{bottomTptData[0]?.wilayah}</strong> memiliki TPT terendah ({formatPersen(bottomTptData[0]?.nilai, 2)}). 
            Gap antara tertinggi dan terendah mencapai {formatPersen((topTptData[0]?.nilai ?? 0) - (bottomTptData[0]?.nilai ?? 0), 2)}, 
            menunjukkan disparitas signifikan dalam penyerapan tenaga kerja antar wilayah.
          </p>
        </div>
      </section>

      {/* Q2: Kemiskinan Tinggi + IPG Rendah */}
      <section id="q2" className="scroll-mt-24">
        <SectionLabel>Q2 · Analisis Kemiskinan & Gender</SectionLabel>
        <h2 className="font-display mt-3 text-2xl text-foreground md:text-3xl">
          Wilayah mana yang memiliki tingkat kemiskinan tinggi sekaligus kualitas pembangunan manusia relatif rendah?
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          Scatter plot memetakan hubungan antara kemiskinan (X) dan IPG (Y). Quadrant kiri-atas (merah) menunjukkan &quot;danger zone&quot;: kemiskinan tinggi + IPG rendah.
        </p>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ChartFrame
              title="Kemiskinan vs IPG (2025)"
              prompt="Di manakah kemiskinan dan ketimpangan gender berkumpul?"
              description="Bubble di atas garis horizontal = IPG di atas rata-rata. Di kanan garis vertikal = kemiskinan di atas rata-rata."
              badge="Scatter · Quadrant Analysis"
              height="h-96"
            >
              <ScatterBubble
                data={miskinIpg.scatter.map((s) => ({
                  nama: s.nama,
                  x: s.miskin,
                  y: s.ipg,
                  z: s.miskin + (100 - s.ipg), // Combined vulnerability score
                  quadrant: s.quadrant,
                }))}
                xKey="x"
                yKey="y"
                zKey="z"
                xLabel="Kemiskinan (%)"
                yLabel="IPG"
                colorBy="quadrant"
                referenceLines={[
                  { axis: "x", value: miskinIpg.avgMiskin, label: `Avg Kemiskinan: ${formatPersen(miskinIpg.avgMiskin, 2)}` },
                  { axis: "y", value: miskinIpg.avgIpg, label: `Avg IPG: ${formatAngka(miskinIpg.avgIpg, 2)}` },
                ]}
              />
            </ChartFrame>
          </div>

          <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-5">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-rose-500" />
              <p className="font-mono-ui text-[10px] uppercase tracking-[0.18em] text-rose-600">Danger Zone</p>
            </div>
            <p className="mt-2 text-xs text-rose-700">
              Wilayah dengan kemiskinan <strong>di atas rata-rata</strong> dan IPG <strong>di bawah rata-rata</strong>
            </p>
            <ul className="mt-3 space-y-2">
              {miskinIpg.dangerZone.slice(0, 5).map((w, i) => (
                <li key={w.nama} className="flex items-center justify-between rounded-lg bg-white/60 px-3 py-2">
                  <span className="text-sm font-medium text-foreground">{i + 1}. {w.nama}</span>
                  <span className="text-xs text-muted-foreground">{formatPersen(w.miskin, 1)} · IPG {formatAngka(w.ipg, 1)}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-rose-600">
              Total {miskinIpg.dangerZone.length} wilayah memerlukan intervensi prioritas ganda.
            </p>
          </div>
        </div>
      </section>

      {/* Q3: Pola Inflasi */}
      <section id="q3" className="scroll-mt-24">
        <SectionLabel>Q3 · Analisis Inflasi</SectionLabel>
        <h2 className="font-display mt-3 text-2xl text-foreground md:text-3xl">
          Bagaimana pola inflasi bulanan antarwilayah dan kapan tekanan harga tertinggi muncul?
        </h2>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <ChartFrame
            title="Heatmap Inflasi YoY"
            prompt="Kota mana paling rentan terhadap goncangan harga?"
            description="Biru = inflasi tinggi, Merah = deflasi. 10 wilayah dengan data terlengkap × 12 bulan terakhir."
            badge="Heatmap · Spasial-Temporal"
            height="h-auto"
          >
            <InflationHeatmap
              rows={inflasiHeatmapData.rows}
              cols={inflasiHeatmapData.cols}
              cells={inflasiHeatmapData.cells}
              unit="%"
            />
          </ChartFrame>

          <div className="space-y-4">
            <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-amber-600" />
                <p className="font-mono-ui text-[10px] uppercase tracking-[0.18em] text-amber-700">Puncak Tekanan Harga</p>
              </div>
              <div className="mt-3">
                <p className="text-3xl font-display text-amber-800">
                  {peakBulan} {inflasiPeak.peak.tahun}
                </p>
                <p className="mt-1 text-sm text-amber-700">
                  Rata-rata inflasi mencapai {formatAngka(inflasiPeak.peak.avg, 2)}% 
                  (maksimum {formatAngka(inflasiPeak.peak.max, 2)}%)
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-4">
              <p className="font-mono-ui text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Pola Musiman</p>
              <ul className="mt-2 space-y-1.5 text-sm text-foreground">
                <li className="flex gap-2">
                  <span className="text-accent">▸</span>
                  Tekanan harga cenderung meningkat di akhir tahun (Q4)
                </li>
                <li className="flex gap-2">
                  <span className="text-accent">▸</span>
                  Kota besar (Bandung, Bekasi) lebih volatil dari kabupaten
                </li>
                <li className="flex gap-2">
                  <span className="text-accent">▸</span>
                  Deflasi sporadis terjadi di beberapa wilayah pesisir
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Q4: Korelasi */}
      <section id="q4" className="scroll-mt-24">
        <SectionLabel>Q4 · Analisis Korelasi</SectionLabel>
        <h2 className="font-display mt-3 text-2xl text-foreground md:text-3xl">
          Apakah terdapat hubungan antara pendidikan, pembangunan gender, pengangguran, dan kemiskinan?
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          Matriks korelasi Pearson mengukur kekuatan hubungan linear antar indikator. Nilai mendekati 1 = korelasi positif kuat, -1 = korelasi negatif kuat.
        </p>

        <ChartFrame
          className="mt-6"
          title="Matriks Korelasi Indikator"
          prompt="Indikator mana yang saling memengaruhi paling kuat?"
          description="Biru = korelasi positif (naik bersama), Merah = korelasi negatif (berlawanan)."
          badge="Korelasi · Pearson"
          height="h-auto"
        >
          <CorrelationMatrix labels={correlation.labels} matrix={correlation.matrix} />
        </ChartFrame>

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="font-mono-ui text-[10px] uppercase tracking-[0.18em] text-rose-600">Korelasi Positif Kuat</p>
            <p className="mt-2 text-sm font-medium text-foreground">TPT ↔ Kemiskinan</p>
            <p className="text-xs text-muted-foreground">Pengangguran dan kemiskinan bergerak searah</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="font-mono-ui text-[10px] uppercase tracking-[0.18em] text-emerald-600">Korelasi Negatif Kuat</p>
            <p className="mt-2 text-sm font-medium text-foreground">IPG ↔ Kemiskinan</p>
            <p className="text-xs text-muted-foreground">IPG tinggi = kemiskinan rendah</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="font-mono-ui text-[10px] uppercase tracking-[0.18em] text-violet-600">Insight Penting</p>
            <p className="mt-2 text-sm font-medium text-foreground">RLS ↔ HLS</p>
            <p className="text-xs text-muted-foreground">Harapan lama sekolah laki & perempuan berkorelasi kuat</p>
          </div>
        </div>
      </section>

      {/* Q5: Kota vs Kabupaten */}
      <section id="q5" className="scroll-mt-24">
        <SectionLabel>Q5 · Analisis Tipologi Wilayah</SectionLabel>
        <h2 className="font-display mt-3 text-2xl text-foreground md:text-3xl">
          Apakah kota secara umum memiliki performa smart economy yang lebih baik daripada kabupaten?
        </h2>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <ChartFrame
            title="Perbandingan Rata-rata Indikator"
            prompt="Mana yang lebih unggul: Kota atau Kabupaten?"
            description="Bandingkan performa 9 Kota vs 18 Kabupaten. Indikator dengan icon ↓ lebih rendah = lebih baik."
            badge="Komparasi · Tipologi"
            height="h-96"
          >
            <SimpleBar
              data={kotaKabData.map((d) => ({
                indikator: d.indikator,
                kota: d.kota,
                kabupaten: d.kabupaten,
              }))}
              xKey="indikator"
              yKey="kota"
              // Using custom grouped bar - we'll show both side by side
            />
            {/* Custom legend */}
            <div className="mt-4 flex items-center gap-4 border-t border-border pt-4">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded bg-accent" />
                <span className="text-xs text-muted-foreground">Kota ({kotaKab.kota.count})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded bg-emerald-500" />
                <span className="text-xs text-muted-foreground">Kabupaten ({kotaKab.kabupaten.count})</span>
              </div>
            </div>
          </ChartFrame>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-border bg-card p-4 text-center">
                <Building2 className="mx-auto h-6 w-6 text-accent" />
                <p className="mt-2 font-display text-2xl text-foreground">{kotaKab.kota.count}</p>
                <p className="text-xs text-muted-foreground">Kota</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4 text-center">
                <Trees className="mx-auto h-6 w-6 text-emerald-500" />
                <p className="mt-2 font-display text-2xl text-foreground">{kotaKab.kabupaten.count}</p>
                <p className="text-xs text-muted-foreground">Kabupaten</p>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5">
              <p className="font-mono-ui text-[10px] uppercase tracking-[0.18em] text-accent">Kesimpulan Komparasi</p>
              <ul className="mt-3 space-y-2 text-sm text-foreground">
                {kotaKab.kota.stats.map((stat, i) => {
                  const kabStat = kotaKab.kabupaten.stats[i];
                  const better = stat.invert ? stat.avg < kabStat.avg : stat.avg > kabStat.avg;
                  return (
                    <li key={stat.key} className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
                      <span>{stat.name}</span>
                      <span className={better ? "text-emerald-600" : "text-rose-600"}>
                        {better ? "Kota lebih baik" : "Kabupaten lebih baik"}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Q6: Prioritas Kebijakan */}
      <section id="q6" className="scroll-mt-24">
        <SectionLabel>Q6 · Analisis Prioritas</SectionLabel>
        <h2 className="font-display mt-3 text-2xl text-foreground md:text-3xl">
          Wilayah mana yang harus menjadi prioritas kebijakan smart economy berdasarkan gabungan KPI utama?
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          Priority Score dihitung menggunakan metode SAW (Simple Additive Weighting) dengan bobot: TPT 30%, Kemiskinan 30%, Gini 20%, Kerentanan 20%.
        </p>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ChartFrame
              title="Top 10 Priority Score"
              prompt="Wilayah mana yang harus didahulukan untuk intervensi?"
              description="Skor komposit 0-1, semakin tinggi semakin prioritas."
              badge="SPK · SAW Method"
              height="h-96"
            >
              <RankingBar
                data={priorityData}
                xKey="wilayah"
                yKey="skor"
                color="gradient"
              />
            </ChartFrame>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-accent/20 bg-accent/5 p-5">
              <p className="font-mono-ui text-[10px] uppercase tracking-[0.18em] text-accent">Top Priority</p>
              <p className="mt-2 font-display text-2xl text-foreground">{topPriority[0]?.nama_wilayah}</p>
              <p className="text-sm text-muted-foreground">Skor: {formatAngka(topPriority[0]?.priority_score, 3)}</p>
              <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                <p>TPT: {formatPersen(topPriority[0]?.tpt, 2)}</p>
                <p>Kemiskinan: {formatPersen(topPriority[0]?.persentase_penduduk_miskin, 2)}</p>
                <p>Cluster: {topPriority[0]?.cluster_label}</p>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-4">
              <p className="font-mono-ui text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Distribusi Cluster</p>
              <ul className="mt-2 space-y-1.5 text-sm">
                <li className="flex justify-between">
                  <span className="text-rose-600">● Prioritas Tinggi</span>
                  <span className="font-medium">
                    {topPriority.filter((r) => r.cluster_label.includes("Prioritas Tinggi")).length} wilayah
                  </span>
                </li>
                <li className="flex justify-between">
                  <span className="text-amber-600">● Moderat</span>
                  <span className="font-medium">
                    {topPriority.filter((r) => r.cluster_label.includes("Moderat")).length} wilayah
                  </span>
                </li>
                <li className="flex justify-between">
                  <span className="text-emerald-600">● Stabil</span>
                  <span className="font-medium">
                    {topPriority.filter((r) => r.cluster_label.includes("Stabil")).length} wilayah
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Summary Insight */}
      <InsightBox
        what="Enam analisis menunjukkan disparitas signifikan antar wilayah di Jabar: TPT bervariasi 4-12%, 5+ wilayah dalam 'danger zone' kemiskinan-IPG, inflasi puncak di Q4, korelasi kuat TPT-kemiskinan (0.7+), kota umumnya unggul di IPG namun lebih volatil di inflasi, dan 10 wilayah prioritas terkonsentrasi di pesisir utara/sentra industri."
        why="Faktor struktural: ekonomi berbasis informal/pertanian, akses pendidikan & kesehatan terbatas, ketimpangan gender, dan ketergantungan sektor primer yang rentan terhadap fluktuasi harga."
        impact="Tanpa intervensi terpadu, gap antar wilayah memperlebar, target RPJMD 2026 terancam, dan potensi konflik sosial meningkat di wilayah marginal."
        decision="Prioritaskan 5 wilayah dengan TPT tertinggi + danger zone kemiskinan-IPG untuk paket intervensi terpadu (ketenagakerjaan + sosial + pendidikan + stabilisasi harga). Bentuk task force lintas OPD dengan tracking KPI bulanan."
      />
    </AppShell>
  );
}

// Helper to build heatmap data
function buildInflasiHeatmap(inflasi: InflasiRow[]) {
  const sortedKeys = Array.from(new Set(inflasi.map((r) => `${r.tahun}-${String(r.bulan_ke).padStart(2, "0")}`))).sort().slice(-12);
  const cols = sortedKeys.map((k) => {
    const [, m] = k.split("-");
    return ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"][Number(m) - 1] + " '" + k.slice(2, 4);
  });

  const cityCount = new Map<string, number>();
  for (const r of inflasi) {
    if (r.inflasi_yoy !== null) {
      cityCount.set(r.nama_wilayah, (cityCount.get(r.nama_wilayah) ?? 0) + 1);
    }
  }
  const rows = Array.from(cityCount.entries()).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([n]) => n);

  const cells: Array<{ row: string; col: string; value: number | null }> = [];
  rows.forEach((city) => {
    sortedKeys.forEach((k, idx) => {
      const [tahun, mm] = k.split("-");
      const rec = inflasi.find(
        (r) => r.nama_wilayah === city && r.tahun === Number(tahun) && r.bulan_ke === Number(mm),
      );
      cells.push({ row: city, col: cols[idx], value: rec?.inflasi_yoy ?? null });
    });
  });

  return { rows, cols, cells };
}
