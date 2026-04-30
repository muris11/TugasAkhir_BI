import { parse } from "csv-parse/sync";
import { readFile } from "node:fs/promises";
import path from "node:path";

export type StakeholderRow = {
  key_dashboard: string;
  jenis_dashboard: string;
  pengguna_utama: string;
  level_keputusan: string;
  kebutuhan_informasi: string;
  keputusan_yang_didukung: string;
};

export type KinerjaRow = {
  nama_wilayah: string;
  jenis_wilayah: string;
  tahun: number;
  tpt: number | null;
  persentase_penduduk_miskin: number | null;
  gini_ratio: number | null;
  ipg: number | null;
  rls: number | null;
  hls: number | null;
  pendidikan_indeks_sederhana: number | null;
  kemiskinan_pengangguran_index: number | null;
  gender_pendidikan_index: number | null;
  status_tpt: string;
  status_indeks_kerentanan: string;
  keterangan_etl: string;
};

export type InflasiRow = {
  nama_wilayah: string;
  jenis_wilayah: string;
  tahun: number;
  bulan: string;
  bulan_ke: number;
  periode_label: string;
  inflasi_yoy: number | null;
  status_inflasi: string;
  keterangan_etl: string;
};

export type ClusterRow = {
  priority_rank: number;
  nama_wilayah: string;
  jenis_wilayah: string;
  cluster_id_model: number;
  cluster_label: string;
  priority_score: number;
  tpt: number;
  persentase_penduduk_miskin: number;
  gini_ratio: number;
  ipg: number;
  rls: number;
  hls: number;
  pendidikan_indeks_sederhana: number;
  kemiskinan_pengangguran_index: number;
  gender_pendidikan_index: number;
};

export type DashboardData = {
  stakeholders: StakeholderRow[];
  kinerja: KinerjaRow[];
  inflasi: InflasiRow[];
  clusterPriority: ClusterRow[];
};

const docsRoot = path.join(process.cwd(), "dataset");

const toNumber = (value: string | undefined): number | null => {
  if (!value || value.trim() === "") return null;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
};

const readCsv = async <T>(relativePath: string): Promise<T[]> => {
  const fullPath = path.join(docsRoot, relativePath);
  const raw = await readFile(fullPath, "utf8");
  return parse(raw, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  }) as T[];
};

export async function getDashboardData(): Promise<DashboardData> {
  const [stakeholdersRaw, kinerjaRaw, inflasiRaw, clusterRaw] = await Promise.all([
    readCsv<StakeholderRow>("Minggu3_Final_Laporan_dan_Data/data_siap_dw/dim_dashboard_stakeholder.csv"),
    readCsv<Record<string, string>>("Minggu3_Final_Laporan_dan_Data/data_siap_dw/mart_kinerja_ekonomi_tahunan.csv"),
    readCsv<Record<string, string>>("Minggu3_Final_Laporan_dan_Data/data_siap_dw/mart_inflasi_bulanan.csv"),
    readCsv<Record<string, string>>("Minggu 4/output_data_mining/week4_hasil_data_mining_cluster_priority.csv"),
  ]);

  const kinerja: KinerjaRow[] = kinerjaRaw.map((row) => ({
    nama_wilayah: row.nama_wilayah,
    jenis_wilayah: row.jenis_wilayah,
    tahun: Number(row.tahun),
    tpt: toNumber(row.tpt),
    persentase_penduduk_miskin: toNumber(row.persentase_penduduk_miskin),
    gini_ratio: toNumber(row.gini_ratio),
    ipg: toNumber(row.ipg),
    rls: toNumber(row.rls),
    hls: toNumber(row.hls),
    pendidikan_indeks_sederhana: toNumber(row.pendidikan_indeks_sederhana),
    kemiskinan_pengangguran_index: toNumber(row.kemiskinan_pengangguran_index),
    gender_pendidikan_index: toNumber(row.gender_pendidikan_index),
    status_tpt: row.status_tpt,
    status_indeks_kerentanan: row.status_indeks_kerentanan,
    keterangan_etl: row.keterangan_etl,
  }));

  const inflasi: InflasiRow[] = inflasiRaw.map((row) => ({
    nama_wilayah: row.nama_wilayah,
    jenis_wilayah: row.jenis_wilayah,
    tahun: Number(row.tahun),
    bulan: row.bulan,
    bulan_ke: Number(row.bulan_ke),
    periode_label: row.periode_label,
    inflasi_yoy: toNumber(row.inflasi_yoy),
    status_inflasi: row.status_inflasi,
    keterangan_etl: row.keterangan_etl,
  }));

  const clusterPriority: ClusterRow[] = clusterRaw.map((row) => ({
    priority_rank: Number(row.priority_rank),
    nama_wilayah: row.nama_wilayah,
    jenis_wilayah: row.jenis_wilayah,
    cluster_id_model: Number(row.cluster_id_model),
    cluster_label: row.cluster_label,
    priority_score: Number(row.priority_score),
    tpt: Number(row.tpt),
    persentase_penduduk_miskin: Number(row.persentase_penduduk_miskin),
    gini_ratio: Number(row.gini_ratio),
    ipg: Number(row.ipg),
    rls: Number(row.rls),
    hls: Number(row.hls),
    pendidikan_indeks_sederhana: Number(row.pendidikan_indeks_sederhana),
    kemiskinan_pengangguran_index: Number(row.kemiskinan_pengangguran_index),
    gender_pendidikan_index: Number(row.gender_pendidikan_index),
  }));

  return {
    stakeholders: stakeholdersRaw,
    kinerja,
    inflasi,
    clusterPriority,
  };
}

export function getLatestKinerjaByWilayah(kinerja: KinerjaRow[]) {
  const latestByArea = new Map<string, KinerjaRow>();
  for (const row of kinerja) {
    const current = latestByArea.get(row.nama_wilayah);
    if (!current || row.tahun > current.tahun) {
      latestByArea.set(row.nama_wilayah, row);
    }
  }
  return Array.from(latestByArea.values());
}

export function getKinerjaTrend(kinerja: KinerjaRow[]) {
  const grouped = new Map<number, KinerjaRow[]>();
  for (const row of kinerja) {
    const arr = grouped.get(row.tahun) ?? [];
    arr.push(row);
    grouped.set(row.tahun, arr);
  }

  return Array.from(grouped.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([tahun, rows]) => ({
      tahun,
      tpt: average(rows.map((row) => row.tpt)),
      miskin: average(rows.map((row) => row.persentase_penduduk_miskin)),
      gini: average(rows.map((row) => row.gini_ratio)),
      ipg: average(rows.map((row) => row.ipg)),
    }));
}

export function getInflasiRingkas(inflasi: InflasiRow[]) {
  const available = inflasi.filter((row) => row.inflasi_yoy !== null);
  const byPeriode = new Map<string, InflasiRow[]>();

  for (const row of available) {
    const key = `${row.tahun}-${String(row.bulan_ke).padStart(2, "0")}`;
    const arr = byPeriode.get(key) ?? [];
    arr.push(row);
    byPeriode.set(key, arr);
  }

  return Array.from(byPeriode.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([, rows]) => ({
      periode: rows[0].periode_label,
      inflasiRataRata: average(rows.map((row) => row.inflasi_yoy)),
    }));
}

function average(values: Array<number | null>): number {
  const valid = values.filter((value): value is number => value !== null);
  if (valid.length === 0) return 0;
  return valid.reduce((acc, value) => acc + value, 0) / valid.length;
}
