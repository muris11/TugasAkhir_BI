import { AppShell } from "@/components/app-shell";
import {
  ChartFrame,
  ClusterRadar,
  DivergentBar,
  KPITrendLine,
  PriorityTreemap,
  RadialGauge,
  RankingBar,
  StackedBar,
} from "@/components/charts/index";
import { chartPalette, getClusterColor } from "@/components/charts/palette";
import { KPICards } from "@/components/kpi-cards";
import { InsightBox } from "@/components/ui/insight-box";
import { SectionLabel } from "@/components/ui/section-label";
import {
  getClusterDistribution,
  getClusterProfile,
  getDataQualitySummary,
  getTopPriority
} from "@/lib/dashboard-metrics";
import { getDashboardData, getKinerjaTrend, getLatestKinerjaByWilayah } from "@/lib/data";
import { formatAngka, formatPersen } from "@/lib/format";

export default async function RingkasanEksekutifPage() {
  const { kinerja, clusterPriority, inflasi } = await getDashboardData();
  const trend = getKinerjaTrend(kinerja);
  const latest2025 = getLatestKinerjaByWilayah(kinerja).filter((row) => row.tahun === 2025);
  const top = getTopPriority(clusterPriority, 10);
  const distribution = getClusterDistribution(clusterPriority);
  const clusterProfile = getClusterProfile(clusterPriority);
  const quality = getDataQualitySummary(kinerja, inflasi);

  const avgPriority = clusterPriority.reduce((a, r) => a + r.priority_score, 0) / Math.max(clusterPriority.length, 1);
  const avgTpt = trend.at(-1)?.tpt ?? 0;
  const avgMiskin = trend.at(-1)?.miskin ?? 0;
  const avgIpg = trend.at(-1)?.ipg ?? 0;

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

  const divergentData = latest2025
    .filter((r) => r.ipg !== null && r.gender_pendidikan_index !== null)
    .map((r) => ({
      wilayah: r.nama_wilayah,
      ipg: Number((r.ipg ?? 0).toFixed(2)),
      gap: Number((((r.ipg ?? 0) - 100) * 1).toFixed(2)),
    }))
    .sort((a, b) => Math.abs(b.gap) - Math.abs(a.gap))
    .slice(0, 12);

  const stackedClusterData = clusterProfile.map((c) => ({
    cluster: c.cluster_label,
    TPT: Number(c.tpt.toFixed(2)),
    Miskin: Number(c.miskin.toFixed(2)),
    Gini: Number((c.gini * 100).toFixed(2)),
  }));

  return (
    <AppShell
      eyebrow="Executive summary"
      title="Ringkasan"
      highlight="Eksekutif"
      description="Narasi data-driven untuk pimpinan: KPI agregat provinsi, tren 2021–2025, distribusi cluster, gap pemerataan, dan rekomendasi keputusan."
    >
      <KPICards
        items={[
          { label: "Wilayah priority tinggi", value: String(clusterProfile[0]?.jumlah ?? 0), note: "Cluster prioritas teratas", icon: "★" },
          { label: "Rata-rata priority score", value: formatAngka(avgPriority, 3), note: "Skor komposit lintas indikator", variant: "featured" },
          { label: "TPT 2025", value: formatPersen(avgTpt), note: "Agregasi provinsi" },
          { label: "Kemiskinan 2025", value: formatPersen(avgMiskin), note: "Agregasi provinsi" },
        ]}
      />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <ChartFrame
          title="Tren agregat 2021–2025"
          prompt="Sudah sejauh mana progres Jabar dalam 5 tahun terakhir?"
          description="Lintasan TPT, kemiskinan, dan IPG provinsi."
          badge="Trend"
          height="h-80"
          className="xl:col-span-2"
        >
          <KPITrendLine
            data={trend.map((r) => ({
              tahun: r.tahun,
              TPT: Number(r.tpt.toFixed(2)),
              Kemiskinan: Number(r.miskin.toFixed(2)),
              IPG: Number(r.ipg.toFixed(2)),
            }))}
            xKey="tahun"
            lines={[
              { key: "TPT", name: "TPT (%)", color: chartPalette.accent },
              { key: "Kemiskinan", name: "Kemiskinan (%)", color: chartPalette.rose },
              { key: "IPG", name: "IPG", color: chartPalette.emerald },
            ]}
          />
        </ChartFrame>

        <ChartFrame title="IPG capaian" prompt="Seberapa setara pembangunan gender hari ini?" description="Indeks Pembangunan Gender 2025." badge="Gauge" height="h-80">
          <RadialGauge value={avgIpg} max={110} label="IPG provinsi (skala 0–110)" />
        </ChartFrame>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <ChartFrame
          title="Distribusi cluster wilayah"
          prompt="Berapa banyak wilayah di tiap kelompok prioritas?"
          description="Jumlah kab/kota per cluster K-Means."
          badge="Cluster · Profile"
          height="h-72"
        >
          <RankingBar
            data={distribution.map((d) => ({ label: d.label, jumlah: d.jumlah }))}
            xKey="label"
            yKey="jumlah"
            color={chartPalette.accent}
          />
        </ChartFrame>

        <ChartFrame
          title="Profil rata-rata per cluster"
          prompt="Apa karakter khas tiap kelompok wilayah?"
          description="Radar 6 indikator (Gini diskala ×100)."
          badge="Radar · Cluster"
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
        title="Top 10 prioritas intervensi"
        prompt="Wilayah mana yang harus mendapat perhatian pertama?"
        description="Treemap berdasar priority score; warna per cluster."
        badge="Treemap · SPK"
        height="h-96"
      >
        <PriorityTreemap data={top.slice(0, 10).map((r) => ({ name: r.nama_wilayah, size: r.priority_score, cluster: r.cluster_label }))} />
      </ChartFrame>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <ChartFrame
          title="IPG vs benchmark 100"
          prompt="Daerah mana yang sudah lampaui benchmark gender?"
          description="Selisih IPG kab/kota terhadap nilai 100."
          badge="Divergent · Pemerataan"
          height="h-96"
        >
          <DivergentBar
            data={divergentData.map((d) => ({
              wilayah: d.wilayah,
              positif: d.gap > 0 ? d.gap : 0,
              negatif: d.gap < 0 ? d.gap : 0,
            }))}
            xKey="wilayah"
            positiveKey="positif"
            negativeKey="negatif"
          />
        </ChartFrame>

        <ChartFrame
          title="Beban sosial-ekonomi per cluster"
          prompt="Cluster mana memikul beban paling berat?"
          description="TPT, kemiskinan, gini (×100) per cluster."
          badge="Stacked · Komparasi"
          height="h-96"
        >
          <StackedBar
            data={stackedClusterData}
            xKey="cluster"
            series={[
              { key: "TPT", name: "TPT", color: chartPalette.accent },
              { key: "Miskin", name: "Kemiskinan", color: chartPalette.rose },
              { key: "Gini", name: "Gini ×100", color: chartPalette.violet },
            ]}
          />
        </ChartFrame>
      </div>

      <InsightBox
        what={`Cluster prioritas tertinggi mencakup ${clusterProfile[0]?.jumlah ?? 0} wilayah dengan rata-rata TPT ${formatPersen(clusterProfile[0]?.tpt ?? 0)} dan kemiskinan ${formatPersen(clusterProfile[0]?.miskin ?? 0)}—jauh di atas rata-rata provinsi.`}
        why="Cluster ini didominasi wilayah dengan ekonomi berbasis pertanian/sektor informal, akses pendidikan terbatas (RLS rendah), dan IPG di bawah 100."
        impact="Tanpa intervensi, ketimpangan antar cluster melebar; target RPJMD penurunan kemiskinan & TPT sulit tercapai pada periode berikutnya."
        decision={`Pemprov Jawa Barat (Bappeda) disarankan: (1) Alokasikan ${Math.max(30, clusterProfile[0]?.jumlah ? clusterProfile[0].jumlah * 5 : 30)}% anggaran perlindungan sosial ke cluster prioritas; (2) Bentuk task force lintas OPD untuk top-5 wilayah; (3) Lakukan review berkala per 6 bulan dengan KPI yang sama.`}
      />

      <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
        <SectionLabel>Top 5 prioritas</SectionLabel>
        <h3 className="font-display mt-3 text-xl text-foreground">Wilayah yang harus mendapat intervensi pertama</h3>
        <div className="dash-scroll mt-5 overflow-x-auto">
          <table className="min-w-full divide-y divide-border text-sm">
            <thead>
              <tr className="text-left">
                <th className="px-3 py-2 font-mono-ui text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Rank</th>
                <th className="px-3 py-2 font-mono-ui text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Wilayah</th>
                <th className="px-3 py-2 font-mono-ui text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Cluster</th>
                <th className="px-3 py-2 font-mono-ui text-[10px] uppercase tracking-[0.16em] text-muted-foreground">TPT</th>
                <th className="px-3 py-2 font-mono-ui text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Miskin</th>
                <th className="px-3 py-2 font-mono-ui text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Skor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {top.slice(0, 5).map((row) => (
                <tr key={row.nama_wilayah} className="hover:bg-muted/40">
                  <td className="px-3 py-2.5 font-display text-base text-accent">#{row.priority_rank}</td>
                  <td className="px-3 py-2.5 font-medium text-foreground">{row.nama_wilayah}</td>
                  <td className="px-3 py-2.5 text-muted-foreground">{row.cluster_label}</td>
                  <td className="px-3 py-2.5 text-foreground">{formatPersen(row.tpt, 2)}</td>
                  <td className="px-3 py-2.5 text-foreground">{formatPersen(row.persentase_penduduk_miskin, 2)}</td>
                  <td className="px-3 py-2.5 font-semibold text-foreground">{formatAngka(row.priority_score, 3)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          Coverage data inflasi: <span className="font-medium text-foreground">{formatPersen(quality.inflasiCoveragePct, 1)}</span>.
          Status data {kinerja.length - quality.missingTpt} dari {kinerja.length} record TPT tersedia.
        </p>
      </section>
    </AppShell>
  );
}

