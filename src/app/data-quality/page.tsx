import { AppShell } from "@/components/app-shell";
import {
    ChartFrame,
    RadialGauge,
    SimpleBar,
    StackedBar,
} from "@/components/charts/index";
import { chartPalette } from "@/components/charts/palette";
import { KPICards } from "@/components/kpi-cards";
import { InsightBox } from "@/components/ui/insight-box";
import { SectionLabel } from "@/components/ui/section-label";
import { getDataQualitySummary } from "@/lib/dashboard-metrics";
import { getDashboardData } from "@/lib/data";
import { formatAngka, formatPersen } from "@/lib/format";

export default async function DataQualityPage() {
  const { kinerja, inflasi } = await getDashboardData();
  const summary = getDataQualitySummary(kinerja, inflasi);

  const etlAlerts = kinerja
    .filter((row) => row.keterangan_etl !== "OK")
    .map((row) => ({
      wilayah: row.nama_wilayah,
      tahun: row.tahun,
      catatan: row.keterangan_etl,
    }))
    .slice(0, 20);

  // Coverage per tahun (kinerja TPT)
  const yearGrouped = new Map<number, { total: number; missing: number }>();
  for (const r of kinerja) {
    const cur = yearGrouped.get(r.tahun) ?? { total: 0, missing: 0 };
    cur.total += 1;
    if (r.tpt === null) cur.missing += 1;
    yearGrouped.set(r.tahun, cur);
  }
  const coverageData = Array.from(yearGrouped.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([tahun, c]) => ({
      tahun,
      tersedia: c.total - c.missing,
      missing: c.missing,
    }));

  // Inflasi per tahun
  const inflasiYear = new Map<number, { total: number; tersedia: number }>();
  for (const r of inflasi) {
    const cur = inflasiYear.get(r.tahun) ?? { total: 0, tersedia: 0 };
    cur.total += 1;
    if (r.status_inflasi === "tersedia") cur.tersedia += 1;
    inflasiYear.set(r.tahun, cur);
  }
  const inflasiCoverageData = Array.from(inflasiYear.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([tahun, c]) => ({
      tahun,
      coverage: Number(((c.tersedia / c.total) * 100).toFixed(1)),
    }));

  const tptCoveragePct = ((summary.totalKinerja - summary.missingTpt) / summary.totalKinerja) * 100;
  const kerentananCoveragePct = ((summary.totalKinerja - summary.kerentananBelum) / summary.totalKinerja) * 100;

  return (
    <AppShell
      eyebrow="Data quality · Monitoring"
      title="Data Quality &"
      highlight="Reliability"
      description="Pemantauan kelengkapan, status ketersediaan, dan konsistensi data ETL untuk menjamin reliabilitas dashboard. Transparansi penuh: data yang belum tersedia tidak diimputasi."
    >
      <KPICards
        items={[
          { label: "Total record kinerja", value: String(summary.totalKinerja), note: "Mart kinerja ekonomi" },
          { label: "Coverage TPT", value: formatPersen(tptCoveragePct, 1), note: `Missing: ${summary.missingTpt}`, trend: "up", trendLabel: "validasi rutin" },
          { label: "Coverage kerentanan", value: formatPersen(kerentananCoveragePct, 1), note: `Belum tersedia: ${summary.kerentananBelum}` },
          { label: "Coverage inflasi", value: formatPersen(summary.inflasiCoveragePct, 1), note: `${summary.inflasiTersedia}/${summary.totalInflasi}`, variant: "featured" },
        ]}
      />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <ChartFrame title="Coverage TPT" prompt="Seberapa siap data TPT dipakai untuk publikasi?" description="Persentase data TPT tersedia." badge="Gauge" height="h-72">
          <RadialGauge value={Number(tptCoveragePct.toFixed(1))} label="Data TPT tersedia" />
        </ChartFrame>
        <ChartFrame title="Coverage kerentanan" prompt="Indeks turunan sudah lengkap atau masih bolong?" description="Indeks kerentanan tersedia." badge="Gauge" height="h-72">
          <RadialGauge value={Number(kerentananCoveragePct.toFixed(1))} label="Indeks kerentanan tersedia" />
        </ChartFrame>
        <ChartFrame title="Coverage inflasi" prompt="Apakah aliran data inflasi bulanan konsisten?" description="Record inflasi YoY tersedia." badge="Gauge" height="h-72">
          <RadialGauge value={Number(summary.inflasiCoveragePct.toFixed(1))} label="Inflasi YoY tersedia" />
        </ChartFrame>
      </div>

      <ChartFrame
        title="Kelengkapan TPT per tahun"
        prompt="Apakah lubang data terkonsentrasi di tahun tertentu?"
        description="Tersedia vs missing record (stacked)."
        badge="Stacked · ETL"
        height="h-80"
      >
        <StackedBar
          data={coverageData}
          xKey="tahun"
          series={[
            { key: "tersedia", name: "Tersedia", color: chartPalette.accent },
            { key: "missing", name: "Missing", color: chartPalette.rose },
          ]}
        />
      </ChartFrame>

      <ChartFrame
        title="Coverage inflasi YoY per tahun"
        prompt="Tahun mana yang paling rapuh pada data inflasi?"
        description="Persentase record inflasi yang tersedia di tiap tahun."
        badge="Bar · ETL"
        height="h-80"
      >
        <SimpleBar data={inflasiCoverageData} xKey="tahun" yKey="coverage" />
      </ChartFrame>

      <InsightBox
        what={`Coverage TPT mencapai ${formatPersen(tptCoveragePct, 1)} dengan ${summary.missingTpt} record missing. Coverage inflasi YoY ${formatPersen(summary.inflasiCoveragePct, 1)}.`}
        why="Data missing umumnya berasal dari TPT 2025 (belum dirilis BPS pada periode laporan) dan record inflasi bulanan pada wilayah/bulan tertentu yang belum granular per kab/kota."
        impact="Missing terkonsentrasi pada periode terbaru tidak mengganggu segmentasi 2024 yang dipakai pada Data Mining; namun publikasi tren bulanan harus disertai disclaimer coverage."
        decision="Operator data: prioritaskan follow-up ke unit sumber untuk record dengan keterangan_etl ≠ OK. Tim BI: gunakan coverage threshold 90% sebagai gating untuk publikasi insight ke level publik."
      />

      <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
        <SectionLabel>ETL alerts</SectionLabel>
        <h3 className="font-display mt-3 text-xl text-foreground">Record dengan catatan ETL aktif</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Total {kinerja.filter((r) => r.keterangan_etl !== "OK").length} record dengan catatan non-OK. Sample 20 teratas:
        </p>
        <div className="dash-scroll mt-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-border text-sm">
            <thead>
              <tr>
                <th className="px-3 py-2 text-left font-mono-ui text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Wilayah</th>
                <th className="px-3 py-2 text-left font-mono-ui text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Tahun</th>
                <th className="px-3 py-2 text-left font-mono-ui text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Catatan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {etlAlerts.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-3 py-4 text-center text-muted-foreground">Tidak ada alert signifikan.</td>
                </tr>
              ) : (
                etlAlerts.map((row, idx) => (
                  <tr key={`${row.wilayah}-${row.tahun}-${idx}`} className="hover:bg-muted/40">
                    <td className="px-3 py-2.5 font-medium text-foreground">{row.wilayah}</td>
                    <td className="px-3 py-2.5 text-muted-foreground">{row.tahun}</td>
                    <td className="px-3 py-2.5 text-foreground">{row.catatan}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          Total record kinerja: <span className="font-medium text-foreground">{formatAngka(summary.totalKinerja, 0)}</span> · Total record inflasi: <span className="font-medium text-foreground">{formatAngka(summary.totalInflasi, 0)}</span>
        </p>
      </section>
    </AppShell>
  );
}
