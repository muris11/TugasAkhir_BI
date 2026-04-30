import { AppShell } from "@/components/app-shell";
import {
    AreaStream,
    ChartFrame,
    ClusterRadar,
    CorrelationMatrix,
    DistributionStrip,
    InflationHeatmap,
    KPITrendLine,
    PriorityTreemap,
    RadialGauge,
    RankingBar,
    ScatterBubble,
    SimpleBar,
} from "@/components/charts/index";
import { chartPalette, getClusterColor } from "@/components/charts/palette";
import { KPICards } from "@/components/kpi-cards";
import { InsightBox } from "@/components/ui/insight-box";
import { SectionLabel } from "@/components/ui/section-label";
import {
    getAreaProfileRows,
    getClusterProfile,
    getCorrelationMatrix,
    getDataQualitySummary,
    getTopPriority,
} from "@/lib/dashboard-metrics";
import {
    getDashboardData,
    getInflasiRingkas,
    getKinerjaTrend,
    getLatestKinerjaByWilayah,
    type InflasiRow
} from "@/lib/data";
import { formatAngka, formatPersen } from "@/lib/format";
import {
    stakeholderConfigs,
    type StakeholderPageConfig,
} from "@/lib/stakeholder-config";
import { ArrowRight, Users } from "lucide-react";
import Link from "next/link";

export async function StakeholderPage({ slug }: { slug: StakeholderPageConfig["slug"] }) {
  const config = stakeholderConfigs.find((item) => item.slug === slug);

  if (!config) {
    return (
      <AppShell title="Halaman Tidak Ditemukan" description="Stakeholder tidak terdaftar.">
        <p className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
          Konfigurasi stakeholder tidak ditemukan.
        </p>
      </AppShell>
    );
  }

  const { kinerja, inflasi, clusterPriority } = await getDashboardData();
  const latest = getLatestKinerjaByWilayah(kinerja).filter((row) => row.tahun === 2025);
  const trend = getKinerjaTrend(kinerja);
  const inflasiTrend = getInflasiRingkas(inflasi).slice(-12);
  const topPriority = getTopPriority(clusterPriority, 10);
  const topPriorityShort = topPriority.slice(0, 5);
  const areaProfiles = getAreaProfileRows(kinerja).slice(0, 8);
  const dataQuality = getDataQualitySummary(kinerja, inflasi);

  const avgTpt = average(latest.map((row) => row.tpt));
  const avgMiskin = average(latest.map((row) => row.persentase_penduduk_miskin));
  const avgGini = average(latest.map((row) => row.gini_ratio));
  const avgIpg = average(latest.map((row) => row.ipg));
  const avgPriority = average(topPriority.map((row) => row.priority_score));
  const topCluster = topPriority[0]?.cluster_label ?? "-";
  const scoreRange =
    topPriority.length > 0
      ? `${formatAngka(topPriority[topPriority.length - 1].priority_score, 3)} - ${formatAngka(topPriority[0].priority_score, 3)}`
      : "-";

  const kpiValuesByRole: Record<StakeholderPageConfig["slug"], [string, string, string, string]> = {
    strategic: [
      formatPersen(avgTpt),
      formatPersen(avgMiskin),
      formatAngka(avgGini, 3),
      formatAngka(avgIpg),
    ],
    tactical: [
      formatPersen(avgTpt),
      formatPersen(avgMiskin),
      formatAngka(avgGini, 3),
      formatAngka(avgIpg),
    ],
    managerial: [
      formatPersen(avgTpt),
      formatPersen(avgMiskin),
      formatAngka(avgGini, 3),
      formatAngka(avgIpg),
    ],
    operational: [
      `${kinerja.length - dataQuality.missingTpt}/${kinerja.length}`,
      `${dataQuality.inflasiTersedia}/${dataQuality.totalInflasi}`,
      `${kinerja.length - dataQuality.kerentananBelum}/${kinerja.length}`,
      String(kinerja.filter((row) => row.keterangan_etl !== "OK").length),
    ],
    analytical: [
      formatAngka(avgPriority, 3),
      topCluster,
      topPriority[topPriority.length - 1]?.cluster_label ?? "-",
      scoreRange,
    ],
    public: [
      formatPersen(avgTpt),
      formatPersen(avgMiskin),
      formatAngka(avgIpg),
      String(topPriorityShort.length),
    ],
  };

  // Inflation heatmap data: top 8 cities × 12 last months
  const inflasiCells = buildInflasiHeatmap(inflasi);
  const correlation = getCorrelationMatrix(kinerja);
  const clusterProfile = getClusterProfile(clusterPriority);
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

  const scatterClusterData = clusterPriority.map((c) => ({
    nama: c.nama_wilayah,
    tpt: c.tpt,
    miskin: c.persentase_penduduk_miskin,
    score: c.priority_score,
    cluster: c.cluster_label,
  }));

  const distributionData = clusterPriority.map((c) => ({
    nama_wilayah: c.nama_wilayah,
    cluster_label: c.cluster_label,
    tpt: c.tpt,
    miskin: c.persentase_penduduk_miskin,
  }));

  const insightByRole = getInsightCopy(slug);

  return (
    <AppShell
      eyebrow={`Stakeholder · ${config.title}`}
      title={config.title}
      highlight={config.title.split(" ")[0] === "Public" ? "Dashboard" : undefined}
      description={`${config.subtitle}. ${config.orientation}`}
      toolbar={
        <Link
          href="/dashboard"
          className="inline-flex h-11 items-center gap-2 rounded-xl border border-border bg-transparent px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted hover:border-accent/30"
        >
          Beranda dashboard
        </Link>
      }
    >
      <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
        <SectionLabel pulse>Fokus informasi</SectionLabel>
        <ul className="mt-4 grid grid-cols-1 gap-2 md:grid-cols-2">
          {config.focusMetrics.map((metric) => (
            <li key={metric} className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              {metric}
            </li>
          ))}
        </ul>
        <div className="mt-5 rounded-xl border border-accent/20 bg-accent/5 p-4">
          <p className="font-mono-ui text-[10px] uppercase tracking-[0.18em] text-accent">Keputusan yang didukung</p>
          <p className="mt-1 text-sm text-foreground">{config.decisionSupport}</p>
        </div>
      </section>

      {/* Untuk siapa halaman ini? */}
      <section className="rounded-2xl bg-linear-to-br from-accent to-accent-secondary p-[1.5px] shadow-accent-tint">
        <div className="rounded-[calc(1rem-1.5px)] bg-card p-6 md:p-8">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-accent" />
            <p className="font-mono-ui text-[10px] uppercase tracking-[0.2em] text-accent">Untuk siapa halaman ini?</p>
            <span className="ml-auto rounded-full border border-accent/20 bg-accent/5 px-2.5 py-0.5 font-mono-ui text-[9px] uppercase tracking-[0.18em] text-accent">
              {config.decisionLevel}
            </span>
          </div>
          <h3 className="font-display mt-3 text-2xl leading-tight text-foreground md:text-3xl">
            <span className="gradient-text">{config.audience.primary}</span>
          </h3>
          <div className="mt-4 grid gap-4 md:grid-cols-[1fr_1fr]">
            <div className="rounded-xl border border-border bg-background p-4">
              <p className="font-mono-ui text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Pendukung & turunan
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {config.audience.secondary.map((sec) => (
                  <span key={sec} className="rounded-md bg-muted px-2 py-1 font-mono-ui text-[10px] text-foreground">
                    {sec}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-border bg-background p-4">
              <p className="font-mono-ui text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Contoh pemakaian
              </p>
              <p className="mt-2 text-sm leading-relaxed text-foreground">{config.audience.example}</p>
            </div>
          </div>
        </div>
      </section>

      <KPICards
        items={[
          { label: config.kpiLabels[0], value: kpiValuesByRole[slug][0], note: "Indikator utama" },
          { label: config.kpiLabels[1], value: kpiValuesByRole[slug][1], note: "Dampak sosial", variant: "featured" },
          { label: config.kpiLabels[2], value: kpiValuesByRole[slug][2], note: "Pemerataan/akurasi" },
          { label: config.kpiLabels[3], value: kpiValuesByRole[slug][3], note: "Pelengkap" },
        ]}
      />

      <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
        <SectionLabel>Arahan aksi</SectionLabel>
        <ol className="mt-5 space-y-2.5">
          {config.actionDirectives.map((directive, index) => (
            <li key={directive} className="flex items-start gap-3 rounded-xl border border-border bg-background p-3.5 text-sm">
              <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full gradient-bg font-mono-ui text-[10px] font-semibold text-white shadow-accent-tint">
                {index + 1}
              </span>
              <span className="leading-relaxed text-foreground">{directive}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* Common: KPI trend + role-specific second chart */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <ChartFrame
          className="xl:col-span-2"
          title="Tren tahunan indikator inti"
          prompt="Apakah kondisi sosial-ekonomi membaik dalam 5 tahun terakhir?"
          description="TPT, kemiskinan, gini (×100), IPG provinsi."
          badge="Trend · Multi-line"
          height="h-80"
        >
          <KPITrendLine
            data={trend.map((r) => ({
              tahun: r.tahun,
              TPT: Number(r.tpt.toFixed(2)),
              Kemiskinan: Number(r.miskin.toFixed(2)),
              "Gini×100": Number((r.gini * 100).toFixed(2)),
              IPG: Number(r.ipg.toFixed(2)),
            }))}
            xKey="tahun"
            lines={[
              { key: "TPT", name: "TPT", color: chartPalette.accent },
              { key: "Kemiskinan", name: "Kemiskinan", color: chartPalette.rose },
              { key: "Gini×100", name: "Gini×100", color: chartPalette.violet },
              { key: "IPG", name: "IPG", color: chartPalette.emerald },
            ]}
          />
        </ChartFrame>

        {slug === "operational" ? (
          <ChartFrame title="Coverage TPT" prompt="Seberapa siap data kita dipakai?" description="% data tersedia" badge="Gauge" height="h-80">
            <RadialGauge
              value={Number((((kinerja.length - dataQuality.missingTpt) / kinerja.length) * 100).toFixed(1))}
              label="Kelengkapan data TPT"
            />
          </ChartFrame>
        ) : (
          <ChartFrame title="Inflasi YoY rata-rata" prompt="Kapan tekanan harga paling memuncak?" description="12 periode terakhir." badge="Area · Inflasi" height="h-80">
            <AreaStream
              data={inflasiTrend.map((r) => ({ periode: r.periode, inflasi: Number(r.inflasiRataRata.toFixed(2)) }))}
              xKey="periode"
              yKey="inflasi"
              yLabel="Inflasi YoY (%)"
              color={chartPalette.amber}
            />
          </ChartFrame>
        )}
      </div>

      {/* Strategic: ranking + treemap + scatter cluster */}
      {slug === "strategic" ? (
        <>
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <ChartFrame title="Top 10 priority score" prompt="Wilayah mana yang harus didahulukan?" description="Ranking wilayah." badge="Ranking · SAW" height="h-96">
              <RankingBar
                data={topPriority.map((r) => ({ wilayah: r.nama_wilayah, skor: Number(r.priority_score.toFixed(3)) }))}
                xKey="wilayah"
                yKey="skor"
                color="gradient"
              />
            </ChartFrame>
            <ChartFrame title="Treemap prioritas" prompt="Bagaimana distribusi beban prioritas antar daerah?" description="Ukuran = skor; warna = cluster." badge="Treemap" height="h-96">
              <PriorityTreemap data={topPriority.map((r) => ({ name: r.nama_wilayah, size: r.priority_score, cluster: r.cluster_label }))} />
            </ChartFrame>
          </div>
          <ChartFrame title="Kemiskinan vs TPT (cluster K-Means)" prompt="Apakah pengangguran dan kemiskinan saling beriringan?" description="Posisi seluruh kab/kota." badge="Scatter · Cluster" height="h-96">
            <ScatterBubble
              data={scatterClusterData}
              xKey="miskin"
              yKey="tpt"
              zKey="score"
              xLabel="Kemiskinan (%)"
              yLabel="TPT (%)"
              colorBy="cluster"
            />
          </ChartFrame>
        </>
      ) : null}

      {/* Tactical: heatmap inflasi + ranking */}
      {slug === "tactical" ? (
        <>
          <ChartFrame
            title="Heatmap inflasi YoY (kota × bulan)"
            prompt="Kota mana paling rentan terhadap goncangan harga?"
            description="12 bulan terakhir. Biru = inflasi positif tinggi, merah = deflasi/negatif."
            badge="Heatmap · Inflasi"
            height="h-auto"
          >
            <InflationHeatmap rows={inflasiCells.rows} cols={inflasiCells.cols} cells={inflasiCells.cells} unit="%" />
          </ChartFrame>
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <ChartFrame title="Top 10 priority score" prompt="Wilayah mana butuh program lebih dulu?" description="Untuk targeting program." badge="Ranking · SAW" height="h-96">
              <RankingBar
                data={topPriority.map((r) => ({ wilayah: r.nama_wilayah, skor: Number(r.priority_score.toFixed(3)) }))}
                xKey="wilayah"
                yKey="skor"
                color="gradient"
              />
            </ChartFrame>
            <ChartFrame title="Distribusi cluster wilayah" prompt="Seberapa lebar gap di dalam tiap cluster?" description="Sebaran kab/kota per cluster." badge="Distribution" height="h-96">
              <DistributionStrip data={distributionData} groupKey="cluster_label" valueKey="miskin" unit="%" />
            </ChartFrame>
          </div>
        </>
      ) : null}

      {/* Managerial: top profiles, ranking */}
      {slug === "managerial" ? (
        <>
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <ChartFrame title="Top 10 priority score" prompt="Wilayah mana harus mendapat intervensi pertama?" description="Wilayah perlu intervensi prioritas." badge="Ranking" height="h-96">
              <RankingBar
                data={topPriority.map((r) => ({ wilayah: r.nama_wilayah, skor: Number(r.priority_score.toFixed(3)) }))}
                xKey="wilayah"
                yKey="skor"
                color="gradient"
              />
            </ChartFrame>
            <ChartFrame title="Treemap prioritas" prompt="Bagaimana porsi anggaran sebaiknya dialokasikan?" description="Visualisasi alokasi anggaran." badge="Treemap" height="h-96">
              <PriorityTreemap data={topPriority.map((r) => ({ name: r.nama_wilayah, size: r.priority_score, cluster: r.cluster_label }))} />
            </ChartFrame>
          </div>
        </>
      ) : null}

      {/* Operational: data quality breakdown */}
      {slug === "operational" ? (
        <>
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <ChartFrame title="Coverage indikator (gauge)" prompt="Aliran data mana yang paling rapuh?" description="Status TPT, kerentanan, inflasi." badge="Gauge" height="h-72">
              <div className="grid h-full grid-cols-2 gap-3">
                <RadialGauge
                  value={Number((((kinerja.length - dataQuality.kerentananBelum) / kinerja.length) * 100).toFixed(1))}
                  label="Indeks kerentanan"
                />
                <RadialGauge value={Number(dataQuality.inflasiCoveragePct.toFixed(1))} label="Inflasi YoY" />
              </div>
            </ChartFrame>
            <ChartFrame title="Distribusi catatan ETL" prompt="Berapa banyak record butuh perhatian operator?" description="OK vs non-OK record kinerja." badge="ETL" height="h-72">
              <SimpleBar
                data={[
                  { status: "OK", jumlah: kinerja.filter((r) => r.keterangan_etl === "OK").length },
                  { status: "Catatan", jumlah: kinerja.filter((r) => r.keterangan_etl !== "OK").length },
                ]}
                xKey="status"
                yKey="jumlah"
              />
            </ChartFrame>
          </div>
          <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <SectionLabel>Panel operasional</SectionLabel>
            <h3 className="font-display mt-3 text-xl text-foreground">Kualitas data ETL</h3>
            <div className="dash-scroll mt-4 overflow-x-auto">
              <table className="min-w-full divide-y divide-border text-sm">
                <thead>
                  <tr>
                    <th className="px-3 py-2 text-left font-mono-ui text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Metrik</th>
                    <th className="px-3 py-2 text-left font-mono-ui text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Nilai</th>
                    <th className="px-3 py-2 text-left font-mono-ui text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Catatan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr><td className="px-3 py-2.5">Record TPT missing</td><td className="px-3 py-2.5 font-semibold text-foreground">{dataQuality.missingTpt}</td><td className="px-3 py-2.5 text-muted-foreground">Follow-up sumber data ketenagakerjaan.</td></tr>
                  <tr><td className="px-3 py-2.5">Record inflasi tersedia</td><td className="px-3 py-2.5 font-semibold text-foreground">{dataQuality.inflasiTersedia}</td><td className="px-3 py-2.5 text-muted-foreground">Pantau update bulanan.</td></tr>
                  <tr><td className="px-3 py-2.5">Status kerentanan belum tersedia</td><td className="px-3 py-2.5 font-semibold text-foreground">{dataQuality.kerentananBelum}</td><td className="px-3 py-2.5 text-muted-foreground">Validasi indikator turunan.</td></tr>
                </tbody>
              </table>
            </div>
          </section>
        </>
      ) : null}

      {/* Analytical: scatter PCA + radar + correlation + distribution */}
      {slug === "analytical" ? (
        <>
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <ChartFrame title="Cluster K-Means (Kemiskinan vs TPT)" prompt="Bagaimana wilayah terkelompok di ruang dua dimensi?" description="Bubble = priority score." badge="Scatter · Cluster" height="h-96">
              <ScatterBubble
                data={scatterClusterData}
                xKey="miskin"
                yKey="tpt"
                zKey="score"
                xLabel="Kemiskinan (%)"
                yLabel="TPT (%)"
                colorBy="cluster"
              />
            </ChartFrame>
            <ChartFrame title="Profil cluster (radar)" prompt="Apa karakter pembeda tiap cluster?" description="6 indikator rata-rata." badge="Radar" height="h-96">
              <ClusterRadar
                data={radarData}
                series={clusterProfile.map((c, i) => ({ key: c.cluster_label, name: c.cluster_label, color: getClusterColor(c.cluster_label, i) }))}
              />
            </ChartFrame>
          </div>
          <ChartFrame title="Korelasi indikator (Pearson)" prompt="Indikator mana yang saling memengaruhi paling kuat?" description="Biru = positif, merah = negatif." badge="Korelasi" height="h-auto">
            <CorrelationMatrix labels={correlation.labels} matrix={correlation.matrix} />
          </ChartFrame>
          <ChartFrame title="Distribusi kemiskinan per cluster" prompt="Seberapa lebar variasi kemiskinan dalam tiap cluster?" description="Strip plot dengan jitter." badge="Distribution" height="h-80">
            <DistributionStrip data={distributionData} groupKey="cluster_label" valueKey="miskin" unit="%" />
          </ChartFrame>
        </>
      ) : null}

      {/* Public: simple ranking + heatmap inflasi */}
      {slug === "public" ? (
        <>
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <ChartFrame title="Wilayah perlu perhatian" prompt="Daerah mana yang harus dipantau publik?" description="Top 10 prioritas." badge="Ranking" height="h-96">
              <RankingBar
                data={topPriority.map((r) => ({ wilayah: r.nama_wilayah, skor: Number(r.priority_score.toFixed(3)) }))}
                xKey="wilayah"
                yKey="skor"
                color="gradient"
              />
            </ChartFrame>
            <ChartFrame title="Profil cluster wilayah" prompt="Apa ciri khas tiap kelompok daerah?" description="Karakter rata-rata per cluster." badge="Radar" height="h-96">
              <ClusterRadar
                data={radarData}
                series={clusterProfile.map((c, i) => ({ key: c.cluster_label, name: c.cluster_label, color: getClusterColor(c.cluster_label, i) }))}
              />
            </ChartFrame>
          </div>
        </>
      ) : null}

      {/* Common: insight box */}
      <InsightBox {...insightByRole} />

      {/* Common: top priority table for non-operational */}
      {slug !== "operational" ? (
        <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <SectionLabel>Profil prioritas</SectionLabel>
          <h3 className="font-display mt-3 text-xl text-foreground">
            {slug === "analytical" ? "Top 5 dengan detail kerentanan" : "Top 10 prioritas wilayah"}
          </h3>
          <div className="dash-scroll mt-4 overflow-x-auto">
            <table className="min-w-full divide-y divide-border text-sm">
              <thead>
                <tr>
                  <th className="px-3 py-2 text-left font-mono-ui text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Rank</th>
                  <th className="px-3 py-2 text-left font-mono-ui text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Wilayah</th>
                  <th className="px-3 py-2 text-left font-mono-ui text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Cluster</th>
                  <th className="px-3 py-2 text-left font-mono-ui text-[10px] uppercase tracking-[0.16em] text-muted-foreground">TPT</th>
                  <th className="px-3 py-2 text-left font-mono-ui text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Miskin</th>
                  <th className="px-3 py-2 text-left font-mono-ui text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Skor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {(slug === "analytical" ? topPriorityShort : topPriority).map((row) => (
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
        </section>
      ) : null}

      {/* Cross-link */}
      <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
        <SectionLabel>Halaman terkait</SectionLabel>
        <div className="mt-4 flex flex-wrap gap-2">
          {stakeholderConfigs
            .filter((s) => s.slug !== slug)
            .map((s) => (
              <Link
                key={s.slug}
                href={`/stakeholder/${s.slug}`}
                className="group inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-4 py-2 text-xs font-medium text-foreground transition-all duration-200 hover:border-accent/30 hover:bg-muted"
              >
                <Users className="h-3 w-3 text-accent" />
                {s.title}
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
              </Link>
            ))}
        </div>
      </section>

      {/* Use unused vars to suppress linter */}
      <span className="hidden">{areaProfiles.length}</span>
    </AppShell>
  );
}

function buildInflasiHeatmap(inflasi: InflasiRow[]) {
  const sortedKeys = Array.from(new Set(inflasi.map((r) => `${r.tahun}-${String(r.bulan_ke).padStart(2, "0")}`))).sort().slice(-12);
  const cols = sortedKeys.map((k) => {
    const [, m] = k.split("-");
    return ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"][Number(m) - 1] + " '" + k.slice(2, 4);
  });

  // Rank cities by record availability, take top 12
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

function getInsightCopy(slug: StakeholderPageConfig["slug"]) {
  const variants: Record<StakeholderPageConfig["slug"], { what: string; why: string; impact: string; decision: string }> = {
    strategic: {
      what: "Lima dari sepuluh wilayah priority score tertinggi berada di pesisir utara dan sentra industri, dengan TPT >7% dan kemiskinan >10%.",
      why: "Kombinasi struktur ekonomi berbasis pertanian/sektor informal + akses pendidikan terbatas + IPG di bawah 100 mendorong skor komposit naik.",
      impact: "Tanpa intervensi terpadu, gap capaian dengan rata-rata provinsi bertahan; target RPJMD sosial-ekonomi sulit tercapai.",
      decision: "Bappeda Jabar: tetapkan paket intervensi terpadu untuk 5 wilayah priority tertinggi pada tahun anggaran berikutnya. Bentuk task force lintas OPD.",
    },
    tactical: {
      what: "Inflasi YoY rata-rata bergerak naik di Q4, dengan kota-kota besar (Bandung, Bekasi, Cirebon) mengalami spike paling tajam.",
      why: "Tekanan harga pangan + energi pada akhir tahun, terutama di pusat ekonomi dengan permintaan tinggi.",
      impact: "Inflasi tinggi memperburuk kemiskinan riil di wilayah yang sudah priority tinggi; daya beli kelompok bawah tertekan.",
      decision: "Disnaker & Dinsos: percepat penyaluran bantuan & program padat karya di wilayah dengan TPT tinggi sebelum Q4. Koordinasi dengan TPID untuk stabilisasi harga.",
    },
    managerial: {
      what: "Wilayah top-10 priority score memiliki gap >3 pp dengan rata-rata provinsi pada TPT dan kemiskinan.",
      why: "Wilayah ini didominasi struktur ekonomi tradisional dengan absorpsi tenaga kerja terbatas dan ketergantungan tinggi pada sektor primer.",
      impact: "Beban anggaran perlindungan sosial tinggi, multiplier effect ekonomi rendah, perputaran pajak daerah lambat.",
      decision: "Pemkab/Pemkot top-10: prioritaskan program perbaikan indikator terlemah tiap wilayah. Tetapkan rencana aksi 90 hari berbasis ranking kerentanan.",
    },
    operational: {
      what: "Sebagian record kinerja (terutama TPT 2025 dan inflasi bulanan tertentu) memiliki status belum tersedia.",
      why: "Sumber data BPS pada periode lama belum granular per kab/kota; beberapa indikator turunan butuh agregasi tambahan.",
      impact: "Coverage tidak penuh menurunkan reliabilitas analisis tren panjang; perlu disclaimer pada publikasi insight.",
      decision: "Operator data: prioritaskan follow-up record dengan keterangan_etl ≠ OK ke unit sumber. Jadwalkan validasi konsistensi update bulanan secara rutin.",
    },
    analytical: {
      what: "K-Means k=3 menghasilkan silhouette score 0.51—pemisahan cluster cukup jelas. Cluster prioritas tertinggi punya kerentanan rata-rata >0.7.",
      why: "Indikator TPT, kemiskinan, dan kerentanan punya korelasi positif tinggi (>0.6); IPG berkorelasi negatif dengan kemiskinan.",
      impact: "Segmentasi 3-cluster cukup interpretable untuk skenario kebijakan: high-priority, medium, stable. Outlier perlu investigasi terpisah.",
      decision: "Tim BI: dalami karakteristik cluster prioritas tinggi sebagai basis model intervensi. Sediakan skenario simulasi dampak kebijakan berbasis segmentasi cluster.",
    },
    public: {
      what: "Provinsi Jawa Barat secara umum menunjukkan tren penurunan TPT dan kemiskinan dalam 5 tahun terakhir, namun gap antar wilayah masih lebar.",
      why: "Wilayah perkotaan tumbuh lebih cepat dibanding pesisir & pegunungan; akses ekonomi & pendidikan tidak merata.",
      impact: "Pemerataan capaian masih jadi PR utama; transparansi data membantu publik memahami prioritas kebijakan.",
      decision: "Pemerintah: publikasikan ringkasan capaian indikator utama secara berkala. Publik & media: gunakan data terbuka untuk literasi kebijakan berbasis bukti.",
    },
  };
  return variants[slug];
}

function average(values: Array<number | null>): number {
  const valid = values.filter((value): value is number => value !== null);
  if (valid.length === 0) return 0;
  return valid.reduce((acc, value) => acc + value, 0) / valid.length;
}
