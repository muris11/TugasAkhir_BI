import type { ClusterRow, InflasiRow, KinerjaRow } from "@/lib/data";

const KINERJA_INDIKATOR_KEYS: Array<keyof KinerjaRow> = [
  "tpt",
  "persentase_penduduk_miskin",
  "gini_ratio",
  "ipg",
  "rls",
  "hls",
];

export function getDataQualitySummary(kinerja: KinerjaRow[], inflasi: InflasiRow[]) {
  const totalKinerja = kinerja.length;
  const missingTpt = kinerja.filter((row) => row.tpt === null).length;
  const kerentananBelum = kinerja.filter(
    (row) => row.status_indeks_kerentanan !== "tersedia",
  ).length;

  const totalInflasi = inflasi.length;
  const inflasiTersedia = inflasi.filter((row) => row.status_inflasi === "tersedia").length;

  return {
    totalKinerja,
    missingTpt,
    kerentananBelum,
    totalInflasi,
    inflasiTersedia,
    inflasiCoveragePct: totalInflasi === 0 ? 0 : (inflasiTersedia / totalInflasi) * 100,
  };
}

export function getTopPriority(cluster: ClusterRow[], top = 10) {
  return [...cluster].sort((a, b) => b.priority_score - a.priority_score).slice(0, top);
}

export function getBottomPriority(cluster: ClusterRow[], bottom = 5) {
  return [...cluster].sort((a, b) => a.priority_score - b.priority_score).slice(0, bottom);
}

export function getClusterDistribution(cluster: ClusterRow[]) {
  const map = new Map<string, number>();
  for (const row of cluster) {
    map.set(row.cluster_label, (map.get(row.cluster_label) ?? 0) + 1);
  }
  return Array.from(map.entries()).map(([label, jumlah]) => ({ label, jumlah }));
}

export function getAreaProfileRows(kinerja: KinerjaRow[]) {
  return [...kinerja]
    .filter((row) => row.tahun === 2024)
    .map((row) => ({
      wilayah: row.nama_wilayah,
      jenis: row.jenis_wilayah,
      tpt: row.tpt,
      miskin: row.persentase_penduduk_miskin,
      gini: row.gini_ratio,
      ipg: row.ipg,
      kerentanan: row.kemiskinan_pengangguran_index,
    }))
    .sort((a, b) => (b.kerentanan ?? 0) - (a.kerentanan ?? 0));
}

export function getClusterProfile(cluster: ClusterRow[]) {
  const grouped = new Map<string, ClusterRow[]>();
  for (const row of cluster) {
    const arr = grouped.get(row.cluster_label) ?? [];
    arr.push(row);
    grouped.set(row.cluster_label, arr);
  }
  return Array.from(grouped.entries())
    .map(([label, rows]) => ({
      cluster_label: label,
      jumlah: rows.length,
      tpt: avg(rows.map((r) => r.tpt)),
      miskin: avg(rows.map((r) => r.persentase_penduduk_miskin)),
      gini: avg(rows.map((r) => r.gini_ratio)),
      ipg: avg(rows.map((r) => r.ipg)),
      rls: avg(rows.map((r) => r.rls)),
      hls: avg(rows.map((r) => r.hls)),
      priorityScore: avg(rows.map((r) => r.priority_score)),
    }))
    .sort((a, b) => b.priorityScore - a.priorityScore);
}

export function getCorrelationMatrix(kinerja: KinerjaRow[]) {
  const labels: Array<{ key: keyof KinerjaRow; name: string }> = [
    { key: "tpt", name: "TPT" },
    { key: "persentase_penduduk_miskin", name: "Miskin" },
    { key: "gini_ratio", name: "Gini" },
    { key: "ipg", name: "IPG" },
    { key: "rls", name: "RLS" },
    { key: "hls", name: "HLS" },
  ];
  const data = kinerja.filter((row) => labels.every((l) => typeof row[l.key] === "number"));
  const cols: number[][] = labels.map((l) => data.map((row) => row[l.key] as number));

  const matrix: number[][] = labels.map((_, i) =>
    labels.map((__, j) => pearson(cols[i], cols[j])),
  );
  return { labels: labels.map((l) => l.name), matrix };
}

export function getYearOverYearKinerja(kinerja: KinerjaRow[], indicator: keyof KinerjaRow) {
  const grouped = new Map<number, number[]>();
  for (const row of kinerja) {
    const v = row[indicator];
    if (typeof v !== "number") continue;
    const arr = grouped.get(row.tahun) ?? [];
    arr.push(v);
    grouped.set(row.tahun, arr);
  }
  return Array.from(grouped.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([tahun, values]) => ({ tahun, value: values.reduce((a, b) => a + b, 0) / values.length }));
}

function avg(values: number[]) {
  if (!values.length) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function pearson(x: number[], y: number[]) {
  const n = Math.min(x.length, y.length);
  if (n === 0) return 0;
  const mx = x.slice(0, n).reduce((a, b) => a + b, 0) / n;
  const my = y.slice(0, n).reduce((a, b) => a + b, 0) / n;
  let num = 0, dx = 0, dy = 0;
  for (let i = 0; i < n; i++) {
    const a = x[i] - mx;
    const b = y[i] - my;
    num += a * b;
    dx += a * a;
    dy += b * b;
  }
  const denom = Math.sqrt(dx * dy);
  return denom === 0 ? 0 : num / denom;
}

export const indicatorKeys = KINERJA_INDIKATOR_KEYS;

/* ------------------- BUSINESS QUESTIONS HELPERS ------------------- */

/** Q1: Get TPT ranking for specific year - top and bottom */
export function getTptRanking(kinerja: KinerjaRow[], tahun: number, limit = 5) {
  const yearData = kinerja.filter((r) => r.tahun === tahun && r.tpt !== null);
  const sorted = [...yearData].sort((a, b) => (b.tpt ?? 0) - (a.tpt ?? 0));
  return {
    top: sorted.slice(0, limit).map((r) => ({
      nama: r.nama_wilayah,
      jenis: r.jenis_wilayah,
      tpt: r.tpt ?? 0,
    })),
    bottom: sorted.slice(-limit).reverse().map((r) => ({
      nama: r.nama_wilayah,
      jenis: r.jenis_wilayah,
      tpt: r.tpt ?? 0,
    })),
    avg: avg(yearData.map((r) => r.tpt ?? 0)),
  };
}

/** Q2: Get Kemiskinan vs IPG scatter data with quadrant analysis */
export function getMiskinIpgAnalysis(kinerja: KinerjaRow[], tahun: number) {
  const data = kinerja.filter(
    (r) => r.tahun === tahun && r.persentase_penduduk_miskin !== null && r.ipg !== null,
  );
  const miskinValues = data.map((r) => r.persentase_penduduk_miskin ?? 0);
  const ipgValues = data.map((r) => r.ipg ?? 0);
  const avgMiskin = avg(miskinValues);
  const avgIpg = avg(ipgValues);

  const scatter = data.map((r) => ({
    nama: r.nama_wilayah,
    jenis: r.jenis_wilayah,
    miskin: r.persentase_penduduk_miskin ?? 0,
    ipg: r.ipg ?? 0,
    quadrant:
      (r.persentase_penduduk_miskin ?? 0) > avgMiskin && (r.ipg ?? 0) < avgIpg
        ? "danger" // High poverty, low IPG
        : (r.persentase_penduduk_miskin ?? 0) > avgMiskin && (r.ipg ?? 0) >= avgIpg
          ? "high-poverty"
          : (r.ipg ?? 0) < avgIpg
            ? "low-ipg"
            : "stable",
  }));

  const dangerZone = scatter
    .filter((s) => s.quadrant === "danger")
    .sort((a, b) => b.miskin - a.miskin);

  return {
    scatter,
    dangerZone,
    avgMiskin,
    avgIpg,
  };
}

/** Q5: Compare Kota vs Kabupaten performance */
export function getKotaVsKabupaten(kinerja: KinerjaRow[], tahun: number) {
  const yearData = kinerja.filter((r) => r.tahun === tahun);
  const kota = yearData.filter((r) => r.jenis_wilayah.toLowerCase().includes("kota"));
  const kabupaten = yearData.filter((r) => !r.jenis_wilayah.toLowerCase().includes("kota"));

  const indicators = [
    { key: "tpt", name: "TPT", invert: true },
    { key: "persentase_penduduk_miskin", name: "Kemiskinan", invert: true },
    { key: "gini_ratio", name: "Gini", invert: true },
    { key: "ipg", name: "IPG", invert: false },
    { key: "rls", name: "RLS", invert: false },
    { key: "hls", name: "HLS", invert: false },
  ] as const;

  const computeStats = (rows: KinerjaRow[]) => {
    const stats = indicators.map((ind) => {
      const values = rows.map((r) => r[ind.key]).filter((v): v is number => v !== null);
      return {
        key: ind.key,
        name: ind.name,
        avg: avg(values),
        median: median(values),
        min: Math.min(...values),
        max: Math.max(...values),
        invert: ind.invert,
      };
    });
    return stats;
  };

  return {
    kota: {
      count: kota.length,
      stats: computeStats(kota),
    },
    kabupaten: {
      count: kabupaten.length,
      stats: computeStats(kabupaten),
    },
  };
}

/** Get inflation peak analysis */
export function getInflasiPeakAnalysis(inflasi: InflasiRow[]) {
  const byPeriode = new Map<string, number[]>();
  for (const row of inflasi) {
    if (row.inflasi_yoy === null) continue;
    const key = `${row.tahun}-${String(row.bulan_ke).padStart(2, "0")}`;
    const arr = byPeriode.get(key) ?? [];
    arr.push(row.inflasi_yoy);
    byPeriode.set(key, arr);
  }

  const periods = Array.from(byPeriode.entries())
    .map(([key, values]) => ({
      key,
      tahun: Number(key.split("-")[0]),
      bulan: Number(key.split("-")[1]),
      avg: values.reduce((a, b) => a + b, 0) / values.length,
      max: Math.max(...values),
    }))
    .sort((a, b) => a.key.localeCompare(b.key));

  const peak = periods.reduce((max, p) => (p.avg > max.avg ? p : max), periods[0]);
  const latest = periods.slice(-12);

  return { periods, peak, latest };
}

function median(values: number[]) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}
