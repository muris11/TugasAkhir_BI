import { HeroSection } from "@/components/landing/hero";
import { LandingNavbar } from "@/components/landing/navbar";
import {
    BusinessQuestionSection,
    FinalCTASection,
    IndicatorsSection,
    InsightTeaserSection,
    LandingFooter,
    MethodologyTeaserSection,
    PipelineSection,
    StakeholderSection,
    StatsStrip,
} from "@/components/landing/sections";
import { getTopPriority } from "@/lib/dashboard-metrics";
import { getDashboardData, getLatestKinerjaByWilayah } from "@/lib/data";
import { formatAngka, formatPersen } from "@/lib/format";

export default async function LandingPage() {
  const data = await getDashboardData();
  const latest2025 = getLatestKinerjaByWilayah(data.kinerja).filter((row) => row.tahun === 2025);
  const top = getTopPriority(data.clusterPriority, 3);

  const avgTpt = avg(latest2025.map((r) => r.tpt));
  const avgMiskin = avg(latest2025.map((r) => r.persentase_penduduk_miskin));

  return (
    <div className="min-h-screen bg-background">
      <LandingNavbar />
      <main>
        <HeroSection
          topPriorityName={top[0]?.nama_wilayah ?? "—"}
          topPriorityScore={formatAngka(top[0]?.priority_score ?? 0, 3)}
          avgTpt={formatPersen(avgTpt, 2)}
          avgMiskin={formatPersen(avgMiskin, 2)}
        />
        <StatsStrip
          totalWilayah={latest2025.length || 27}
          totalKinerjaRecord={data.kinerja.length}
          totalInflasiRecord={data.inflasi.length}
          rentangTahun="2021–2025"
        />
        <IndicatorsSection />
        <BusinessQuestionSection />
        <PipelineSection />
        <StakeholderSection />
        <InsightTeaserSection
          topPriorities={top.map((row) => ({
            rank: row.priority_rank,
            nama: row.nama_wilayah,
            cluster: row.cluster_label,
            score: formatAngka(row.priority_score, 3),
          }))}
        />
        <MethodologyTeaserSection />
        <FinalCTASection />
      </main>
      <LandingFooter />
    </div>
  );
}

function avg(values: Array<number | null>) {
  const valid = values.filter((v): v is number => v !== null);
  if (!valid.length) return 0;
  return valid.reduce((a, b) => a + b, 0) / valid.length;
}
