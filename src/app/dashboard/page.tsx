import { AppShell } from "@/components/app-shell";
import {
    ChartFrame,
    KPITrendLine,
    PriorityTreemap,
    RankingBar,
    ScatterBubble,
    Sparkline,
} from "@/components/charts/index";
import { chartPalette, getClusterColor } from "@/components/charts/palette";
import { KPICards } from "@/components/kpi-cards";
import { InsightBox } from "@/components/ui/insight-box";
import { SectionLabel } from "@/components/ui/section-label";
import {
    getDataQualitySummary,
    getTopPriority,
    getYearOverYearKinerja,
} from "@/lib/dashboard-metrics";
import {
    getDashboardData,
    getInflasiRingkas,
    getKinerjaTrend,
    getLatestKinerjaByWilayah,
} from "@/lib/data";
import { formatAngka, formatPersen } from "@/lib/format";
import { ArrowRight, Award, Briefcase, ShieldCheck, TrendingDown } from "lucide-react";
import Link from "next/link";

export default async function DashboardHomePage() {
  const data = await getDashboardData();
  const latest2025 = getLatestKinerjaByWilayah(data.kinerja).filter((row) => row.tahun === 2025);
  const kinerja2024 = data.kinerja.filter((row) => row.tahun === 2024);
  const latest2024 = getLatestKinerjaByWilayah(data.kinerja.filter((row) => row.tahun <= 2024)).filter((row) => row.tahun === 2024);
  const quality = getDataQualitySummary(data.kinerja, data.inflasi);
  const topPriority = getTopPriority(data.clusterPriority, 10);

  const trend = getKinerjaTrend(data.kinerja);
  const trendData = trend.map((r) => ({
    tahun: r.tahun,
    TPT: Number(r.tpt.toFixed(2)),
    Kemiskinan: Number(r.miskin.toFixed(2)),
    IPG: Number(r.ipg.toFixed(2)),
  }));

  const tptYoy = getYearOverYearKinerja(data.kinerja, "tpt");
  const miskinYoy = getYearOverYearKinerja(data.kinerja, "persentase_penduduk_miskin");
  const giniYoy = getYearOverYearKinerja(data.kinerja, "gini_ratio");
  const ipgYoy = getYearOverYearKinerja(data.kinerja, "ipg");

  const avgTpt = avg(latest2025.map((r) => r.tpt));
  const avgMiskin = avg(latest2025.map((r) => r.persentase_penduduk_miskin));
  const avgGini = avg(latest2025.map((r) => r.gini_ratio));
  const avgIpg = avg(latest2025.map((r) => r.ipg));

  const prevTpt = avg(latest2024.map((r) => r.tpt));
  const prevMiskin = avg(latest2024.map((r) => r.persentase_penduduk_miskin));
  const prevGini = avg(latest2024.map((r) => r.gini_ratio));
  const prevIpg = avg(latest2024.map((r) => r.ipg));

  const scatterData = kinerja2024.map((row) => {
    const cluster = data.clusterPriority.find((c) => c.nama_wilayah === row.nama_wilayah);
    return {
      nama: row.nama_wilayah,
      tpt: row.tpt ?? 0,
      miskin: row.persentase_penduduk_miskin ?? 0,
      score: cluster?.priority_score ?? 0,
      cluster: cluster?.cluster_label ?? "Tidak terklaster",
    };
  }).filter((d) => d.tpt > 0 && d.miskin > 0);

  const treemapData = topPriority.slice(0, 10).map((row) => ({
    name: row.nama_wilayah,
    size: row.priority_score,
    cluster: row.cluster_label,
  }));

  const inflasiTrend = getInflasiRingkas(data.inflasi).slice(-12);

  return (
    <AppShell
      title="Beranda"
      highlight="Dashboard"
      description="Overview kinerja sosial-ekonomi 27 kabupaten/kota Jawa Barat. Empat KPI inti, tren 5 tahun (2021–2025), ranking prioritas, scatter cluster, dan ringkasan inflasi—semua dalam satu halaman."
      eyebrow="Control center"
      toolbar={
        <Link
          href="/stakeholder/strategic"
          className="group inline-flex h-11 items-center gap-2 rounded-xl gradient-bg px-5 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-accent-tint-lg"
        >
          Buka Strategic
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      }
    >
      <KPICards
        items={[
          {
            label: "Rata-rata TPT 2025",
            value: formatPersen(avgTpt),
            note: "Persen tenaga kerja menganggur",
            trend: prevTpt && avgTpt < prevTpt ? "down" : avgTpt > prevTpt ? "up" : "flat",
            trendLabel: prevTpt ? `${(avgTpt - prevTpt).toFixed(2)} pp YoY` : undefined,
            invertTrend: true,
            icon: <Briefcase className="h-4 w-4" />,
          },
          {
            label: "Kemiskinan 2025",
            value: formatPersen(avgMiskin),
            note: "Persentase penduduk miskin",
            trend: prevMiskin && avgMiskin < prevMiskin ? "down" : avgMiskin > prevMiskin ? "up" : "flat",
            trendLabel: prevMiskin ? `${(avgMiskin - prevMiskin).toFixed(2)} pp YoY` : undefined,
            invertTrend: true,
            icon: <ShieldCheck className="h-4 w-4" />,
          },
          {
            label: "Gini Ratio",
            value: formatAngka(avgGini, 3),
            note: "Ketimpangan pendapatan",
            trend: prevGini && avgGini < prevGini ? "down" : avgGini > prevGini ? "up" : "flat",
            trendLabel: prevGini ? `${(avgGini - prevGini).toFixed(3)}` : undefined,
            invertTrend: true,
            icon: <TrendingDown className="h-4 w-4" />,
            variant: "featured",
          },
          {
            label: "IPG 2025",
            value: formatAngka(avgIpg),
            note: "Indeks Pembangunan Gender",
            trend: prevIpg && avgIpg > prevIpg ? "up" : avgIpg < prevIpg ? "down" : "flat",
            trendLabel: prevIpg ? `${(avgIpg - prevIpg).toFixed(2)}` : undefined,
            icon: <Award className="h-4 w-4" />,
          },
        ]}
      />

      {/* Mini sparkline KPI strip */}
      <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { label: "TPT trend", data: tptYoy, color: chartPalette.accent },
          { label: "Kemiskinan trend", data: miskinYoy, color: chartPalette.rose },
          { label: "Gini trend", data: giniYoy, color: chartPalette.violet },
          { label: "IPG trend", data: ipgYoy, color: chartPalette.emerald },
        ].map((item) => (
          <div key={item.label} className="rounded-xl border border-border bg-card p-4 shadow-card">
            <p className="font-mono-ui text-[9px] uppercase tracking-[0.2em] text-muted-foreground">{item.label}</p>
            <p className="font-display mt-1 text-lg text-foreground">{formatAngka(item.data.at(-1)?.value ?? 0, 2)}</p>
            <div className="mt-2 h-9">
              <Sparkline data={item.data.map((d) => ({ tahun: d.tahun, value: d.value }))} yKey="value" color={item.color} height={36} />
            </div>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <ChartFrame
          className="xl:col-span-2"
          title="Tren agregat 2021–2025"
          prompt="Apakah kondisi sosial-ekonomi Jabar membaik dalam 5 tahun terakhir?"
          description="Rata-rata TPT, kemiskinan, dan IPG per tahun di seluruh kab/kota."
          badge="Trend · Deskriptif"
          height="h-80"
        >
          <KPITrendLine
            data={trendData}
            xKey="tahun"
            lines={[
              { key: "TPT", name: "TPT", color: chartPalette.accent },
              { key: "Kemiskinan", name: "Kemiskinan", color: chartPalette.rose },
              { key: "IPG", name: "IPG", color: chartPalette.emerald },
            ]}
          />
        </ChartFrame>

        <ChartFrame
          title="Inflasi YoY rata-rata"
          prompt="Kapan tekanan harga paling memuncak?"
          description="12 periode bulanan terakhir."
          badge="Trend · Inflasi"
          height="h-80"
        >
          <KPITrendLine
            data={inflasiTrend.map((r) => ({ periode: r.periode, inflasi: Number(r.inflasiRataRata.toFixed(2)) }))}
            xKey="periode"
            lines={[{ key: "inflasi", name: "Inflasi YoY (%)", color: chartPalette.amber }]}
            legend={false}
          />
        </ChartFrame>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <ChartFrame
          title="Top 10 wilayah priority score"
          prompt="Wilayah mana yang harus didahulukan untuk intervensi?"
          description="Skor komposit dari TPT, kemiskinan, gini, dan kerentanan (SAW)."
          badge="Ranking · SPK"
          height="h-96"
        >
          <RankingBar
            data={topPriority.map((r) => ({ wilayah: r.nama_wilayah, skor: Number(r.priority_score.toFixed(3)) }))}
            xKey="wilayah"
            yKey="skor"
            color="gradient"
            reference={{
              x: avg(topPriority.map((r) => r.priority_score)),
              label: "Rata-rata top 10",
            }}
          />
        </ChartFrame>

        <ChartFrame
          title="Treemap prioritas intervensi"
          prompt="Bagaimana distribusi beban prioritas antar daerah?"
          description="Ukuran kotak = priority score. Warna = cluster."
          badge="Visual · Cluster"
          height="h-96"
        >
          <PriorityTreemap data={treemapData} />
        </ChartFrame>
      </div>

      <ChartFrame
        title="Kemiskinan vs TPT (2024)"
        prompt="Apakah pengangguran selalu beriringan dengan kemiskinan?"
        description="Bubble = priority score. Warna = cluster K-Means."
        badge="Scatter · Korelasi"
        height="h-96"
      >
        <ScatterBubble
          data={scatterData}
          xKey="miskin"
          yKey="tpt"
          zKey="score"
          xLabel="Kemiskinan (%)"
          yLabel="TPT (%)"
          colorBy="cluster"
        />
      </ChartFrame>

      <InsightBox
        what="Lima dari sepuluh wilayah priority score tertinggi berada di pesisir utara (Indramayu, Cirebon, Subang) dan sentra industri (Cianjur, Garut)."
        why="Kombinasi TPT tinggi + kemiskinan persisten + IPG di bawah rata-rata provinsi mendorong skor komposit naik."
        impact="Tanpa intervensi, gap capaian dengan rata-rata provinsi bertahan dan target RPJMD sosial-ekonomi sulit tercapai."
        decision="Bappeda Jabar disarankan menetapkan paket intervensi terpadu (program ketenagakerjaan + perlindungan sosial + pendidikan) untuk 5 wilayah priority tertinggi pada tahun anggaran berikutnya."
      />

      <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
        <SectionLabel>Akses cepat</SectionLabel>
        <h3 className="font-display mt-3 text-xl text-foreground">Telusuri lebih dalam</h3>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ["/analisis", "Analisis Bisnis", "2.4 Business Question"],
            ["/ringkasan-eksekutif", "Ringkasan Eksekutif", "Narasi & insight utama"],
            ["/data-quality", "Data Quality", `${formatPersen(quality.inflasiCoveragePct, 1)} coverage inflasi`],
            ["/metodologi", "Metodologi & Traceability", "Pipeline + matriks Minggu 1–4"],
            ["/stakeholder/strategic", "Strategic", "Gubernur · Bappeda"],
            ["/stakeholder/tactical", "Tactical", "Disnaker · Dinsos"],
            ["/stakeholder/managerial", "Managerial", "Pemkab/Pemkot"],
            ["/stakeholder/operational", "Operational", "Operator data"],
            ["/stakeholder/analytical", "Analytical", "Tim BI"],
            ["/stakeholder/public", "Public", "Versi publik"],
          ].map(([href, label, hint]) => (
            <Link
              key={href}
              href={href}
              className="group flex items-center justify-between rounded-xl border border-border bg-background px-4 py-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/30 hover:shadow-card"
            >
              <div>
                <p className="text-sm font-medium text-foreground">{label}</p>
                <p className="text-[11px] text-muted-foreground">{hint}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-accent" />
            </Link>
          ))}
        </div>
      </section>
    </AppShell>
  );
}

function avg(values: Array<number | null>) {
  const valid = values.filter((v): v is number => v !== null);
  if (!valid.length) return 0;
  return valid.reduce((a, b) => a + b, 0) / valid.length;
}

// Suppress unused import warning
void getClusterColor;
