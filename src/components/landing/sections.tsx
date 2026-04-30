"use client";

import { pipelineSteps } from "@/components/landing/pipeline-content";
import { GradientText } from "@/components/ui/gradient-text";
import { InvertedSection } from "@/components/ui/inverted-section";
import { MathBlock } from "@/components/ui/math";
import { SectionLabel } from "@/components/ui/section-label";
import { fadeInUp, stagger, viewportOnce } from "@/lib/motion";
import { motion } from "framer-motion";
import {
    Activity,
    ArrowRight,
    Award,
    BarChart3,
    Briefcase,
    ChevronDown,
    Compass,
    Globe2,
    Layers,
    LineChart,
    Megaphone,
    Network,
    ShieldCheck,
    Telescope,
    Users,
    type LucideIcon
} from "lucide-react";
import Link from "next/link";

/* ============== STATS ============== */

export function StatsStrip({
  totalWilayah,
  totalKinerjaRecord,
  totalInflasiRecord,
  rentangTahun,
}: {
  totalWilayah: number;
  totalKinerjaRecord: number;
  totalInflasiRecord: number;
  rentangTahun: string;
}) {
  const items = [
    { value: String(totalWilayah), label: "Kab/kota", desc: "Cakupan analisis Jawa Barat" },
    { value: rentangTahun, label: "Rentang waktu", desc: "Data tahunan & bulanan" },
    { value: totalKinerjaRecord.toLocaleString("id-ID"), label: "Record kinerja", desc: "Mart kinerja ekonomi" },
    { value: totalInflasiRecord.toLocaleString("id-ID"), label: "Record inflasi", desc: "Mart inflasi bulanan" },
  ];
  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <InvertedSection className="px-6 py-12 md:px-12 md:py-16">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="relative grid gap-8 md:grid-cols-4 md:gap-4"
        >
          {items.map((item) => (
            <motion.div key={item.label} variants={fadeInUp} className="md:border-l md:border-white/10 md:pl-6 first:border-l-0 first:pl-0">
              <p className="font-display text-4xl text-white md:text-5xl">{item.value}</p>
              <p className="mt-2 font-mono-ui text-[10px] uppercase tracking-[0.2em] text-white/60">{item.label}</p>
              <p className="mt-1 text-sm text-white/70">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </InvertedSection>
    </section>
  );
}

/* ============== INDIKATOR ============== */

const indikator: Array<{ icon: LucideIcon; title: string; desc: string }> = [
  { icon: Briefcase, title: "TPT", desc: "Tingkat Pengangguran Terbuka — tekanan ketenagakerjaan." },
  { icon: ShieldCheck, title: "Kemiskinan", desc: "Persentase penduduk miskin. KPI inti kebijakan sosial." },
  { icon: Activity, title: "Gini Ratio", desc: "Ketimpangan pendapatan antar kelompok." },
  { icon: Award, title: "IPG", desc: "Indeks Pembangunan Gender. Pemerataan capaian." },
  { icon: BarChart3, title: "RLS & HLS", desc: "Rata-rata & Harapan Lama Sekolah—indikator pendidikan." },
  { icon: LineChart, title: "Inflasi YoY", desc: "Inflasi bulanan tahun-ke-tahun per kota." },
];

export function IndicatorsSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <motion.div initial="hidden" whileInView="visible" viewport={viewportOnce} variants={fadeInUp}>
        <SectionLabel pulse>Apa yang dianalisis</SectionLabel>
      </motion.div>
      <motion.h2
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={fadeInUp}
        className="font-display mt-5 max-w-3xl text-3xl leading-tight text-foreground md:text-[2.75rem]"
      >
        Enam indikator inti yang membentuk <GradientText>peta sosial-ekonomi</GradientText> Jabar.
      </motion.h2>
      <motion.p
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={fadeInUp}
        className="mt-4 max-w-2xl text-base text-muted-foreground"
      >
        Setiap indikator dihubungkan ke KPI dan business question agar dashboard tidak berhenti di
        visualisasi—tapi mengarah ke keputusan.
      </motion.p>

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {indikator.map((item) => {
          const Icon = item.icon;
          return (
            <motion.article
              key={item.title}
              variants={fadeInUp}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-card-lg"
            >
              <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-accent/4 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="flex h-11 w-11 items-center justify-center rounded-xl gradient-bg shadow-accent-tint">
                <Icon className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-display mt-4 text-xl text-foreground">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
            </motion.article>
          );
        })}
      </motion.div>
    </section>
  );
}

/* ============== BUSINESS QUESTION ============== */

const questions = [
  {
    no: "01",
    text: "Wilayah mana yang paling rentan dan harus jadi prioritas intervensi?",
    answer: "Dijawab oleh K-Means clustering + priority score komposit.",
    href: "/stakeholder/strategic",
    cta: "Strategic dashboard",
  },
  {
    no: "02",
    text: "Bagaimana tren ketenagakerjaan dan kemiskinan berubah dari waktu ke waktu?",
    answer: "Dijawab oleh trend chart 5 tahun (2021–2025) dengan target reference line.",
    href: "/stakeholder/tactical",
    cta: "Tactical dashboard",
  },
  {
    no: "03",
    text: "Indikator mana yang saling berkaitan dan paling memengaruhi kerentanan?",
    answer: "Dijawab oleh correlation matrix + cluster radar profile.",
    href: "/stakeholder/analytical",
    cta: "Analytical dashboard",
  },
];

export function BusinessQuestionSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
      <motion.div initial="hidden" whileInView="visible" viewport={viewportOnce} variants={fadeInUp}>
        <SectionLabel>Business question</SectionLabel>
      </motion.div>
      <motion.h2
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={fadeInUp}
        className="font-display mt-5 max-w-3xl text-3xl leading-tight text-foreground md:text-[2.75rem]"
      >
        Tiga pertanyaan inti yang <GradientText>dijawab oleh data</GradientText>.
      </motion.h2>

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="mt-10 grid gap-4 md:grid-cols-3"
      >
        {questions.map((q) => (
          <motion.div key={q.no} variants={fadeInUp}>
            <Link
              href={q.href}
              className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-card-lg"
            >
              <div>
                <p className="font-mono-ui text-[10px] uppercase tracking-[0.22em] text-accent">{q.no}</p>
                <p className="font-display mt-3 text-xl leading-snug text-foreground">{q.text}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{q.answer}</p>
              </div>
              <div className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-accent">
                {q.cta}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

/* ============== PIPELINE ============== */

export function PipelineSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <motion.div initial="hidden" whileInView="visible" viewport={viewportOnce} variants={fadeInUp}>
        <SectionLabel pulse>Pipeline BI end-to-end</SectionLabel>
      </motion.div>
      <motion.h2
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={fadeInUp}
        className="font-display mt-5 max-w-3xl text-3xl leading-tight text-foreground md:text-[2.75rem]"
      >
        Dari data mentah ke <GradientText>keputusan publik</GradientText>—dalam 8 langkah terhubung.
      </motion.h2>
      <motion.p
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={fadeInUp}
        className="mt-4 max-w-2xl text-base text-muted-foreground"
      >
        Klik tiap langkah untuk melihat aktivitas, output, dan rumus matematika yang dipakai.
      </motion.p>

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="mt-12 space-y-3"
      >
        {pipelineSteps.map((step, idx) => (
          <motion.div key={step.id} variants={fadeInUp}>
            <PipelineAccordionItem step={step} defaultOpen={idx === 0} />
          </motion.div>
        ))}
      </motion.div>

      <div className="mt-10 flex justify-center">
        <Link
          href="/metodologi"
          className="group inline-flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground transition-all duration-200 hover:bg-muted hover:border-accent/30"
        >
          Baca metodologi lengkap dengan rumus
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}

function PipelineAccordionItem({
  step,
  defaultOpen,
}: {
  step: (typeof pipelineSteps)[number];
  defaultOpen?: boolean;
}) {
  const Icon = step.icon;
  return (
    <details
      open={defaultOpen}
      className="group rounded-2xl border border-border bg-card transition-all duration-300 hover:border-accent/30 open:shadow-card-lg"
    >
      <summary className="flex cursor-pointer list-none items-start gap-4 p-5 md:p-6">
        <span className="font-display shrink-0 text-3xl text-foreground/30 group-open:text-accent md:text-4xl">
          {step.number}
        </span>
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl gradient-bg shadow-accent-tint">
          <Icon className="h-5 w-5 text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-display text-lg leading-tight text-foreground md:text-xl">{step.title}</h3>
            <span className="rounded-full border border-accent/20 bg-accent/5 px-2 py-0.5 font-mono-ui text-[9px] uppercase tracking-[0.18em] text-accent">
              {step.kontrolBI}
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{step.subtitle}</p>
        </div>
        <ChevronDown className="mt-1 h-5 w-5 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
      </summary>
      <div className="border-t border-border px-5 py-5 md:px-6 md:py-6">
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="font-mono-ui text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Aktivitas</p>
            <ol className="mt-3 space-y-2">
              {step.aktivitas.map((a, i) => (
                <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-foreground">
                  <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/10 font-mono-ui text-[10px] font-semibold text-accent">
                    {i + 1}
                  </span>
                  <span dangerouslySetInnerHTML={{ __html: a.replace(/\*\*(.+?)\*\*/g, '<strong class="text-foreground">$1</strong>') }} />
                </li>
              ))}
            </ol>

            {step.formula && step.formula.length > 0 ? (
              <div className="mt-6">
                <p className="font-mono-ui text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Rumus & formulasi</p>
                <div className="mt-3 space-y-4">
                  {step.formula.map((f) => (
                    <div key={f.label}>
                      <p className="text-sm font-semibold text-foreground">{f.label}</p>
                      <MathBlock>{f.expr}</MathBlock>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{f.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {step.contoh ? (
              <div className="mt-6">
                <p className="font-mono-ui text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{step.contoh.caption}</p>
                <div className="dash-scroll mt-3 overflow-x-auto rounded-xl border border-border">
                  <table className="min-w-full divide-y divide-border text-sm">
                    <thead className="bg-muted/40">
                      <tr>
                        {step.contoh.headers.map((h) => (
                          <th key={h} className="px-3 py-2 text-left font-mono-ui text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {step.contoh.rows.map((row, ri) => (
                        <tr key={ri}>
                          {row.map((cell, ci) => (
                            <td key={ci} className="px-3 py-2 text-xs text-foreground">{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : null}
          </div>

          <aside className="space-y-4">
            <div className="rounded-xl border border-border bg-muted/40 p-4">
              <p className="font-mono-ui text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Output / Deliverables</p>
              <ul className="mt-2 space-y-1">
                {step.output.map((o) => (
                  <li key={o} className="flex items-start gap-2 text-xs text-foreground">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                    <span>{o}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-border bg-muted/40 p-4">
              <p className="font-mono-ui text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Tools & library</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {step.tools.map((t) => (
                  <span key={t} className="rounded-md bg-card px-2 py-1 font-mono-ui text-[10px] text-foreground">{t}</span>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-accent/20 bg-accent/5 p-4">
              <p className="font-mono-ui text-[10px] uppercase tracking-[0.18em] text-accent">Referensi</p>
              <p className="mt-1.5 text-xs text-foreground">{step.referensi}</p>
            </div>
          </aside>
        </div>
      </div>
    </details>
  );
}

/* ============== STAKEHOLDER ============== */

type StakeholderCard = {
  icon: LucideIcon;
  slug: string;
  title: string;
  level: string;
  primary: string;
  secondary: string[];
  example: string;
};

const stakeholders: StakeholderCard[] = [
  {
    icon: Compass,
    slug: "strategic",
    title: "Strategic",
    level: "Keputusan Makro",
    primary: "Gubernur & Wakil Gubernur Jabar",
    secondary: ["Bappeda Provinsi", "Sekda Provinsi", "Tim RPJMD"],
    example: "Penetapan prioritas RPJMD 5 tahunan & paket intervensi terpadu antar OPD.",
  },
  {
    icon: LineChart,
    slug: "tactical",
    title: "Tactical",
    level: "Program Sektoral",
    primary: "Kepala Dinas (Disnakertrans, Dinsos, Pendidikan, BPS Provinsi)",
    secondary: ["Manajer Program OPD", "TPID Provinsi", "Koordinator Bidang"],
    example: "Penyesuaian program ketenagakerjaan & bantuan sosial per triwulan.",
  },
  {
    icon: Layers,
    slug: "managerial",
    title: "Managerial",
    level: "Eksekusi Daerah",
    primary: "Bupati/Wali Kota & Wakilnya, Sekda Kab/Kota",
    secondary: ["Bappeda Kab/Kota", "Kepala Dinas daerah", "Camat wilayah priority"],
    example: "Rencana aksi 90 hari perbaikan indikator daerah berdasarkan ranking kerentanan.",
  },
  {
    icon: Activity,
    slug: "operational",
    title: "Operational",
    level: "Kualitas Data",
    primary: "Operator/Admin Data Diskominfo & BPS Provinsi",
    secondary: ["Tim ETL Pusat Data", "IT Bappeda", "PIC integrasi data OPD"],
    example: "Validasi harian record ETL & follow-up ke unit sumber data.",
  },
  {
    icon: Telescope,
    slug: "analytical",
    title: "Analytical",
    level: "Eksplorasi Lanjutan",
    primary: "Tim Business Intelligence & Data Analyst Pemprov",
    secondary: ["Akademisi/peneliti mitra", "Konsultan kebijakan", "Tim riset Bappeda"],
    example: "Skenario simulasi kebijakan & rekomendasi berbasis cluster.",
  },
  {
    icon: Megaphone,
    slug: "public",
    title: "Public",
    level: "Transparansi & Literasi",
    primary: "Masyarakat Umum Jawa Barat",
    secondary: ["Jurnalis & media", "Akademisi & dosen", "NGO & komunitas", "Mahasiswa"],
    example: "Memantau kondisi sosial-ekonomi daerah & akuntabilitas pemerintah.",
  },
];

export function StakeholderSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
      <motion.div initial="hidden" whileInView="visible" viewport={viewportOnce} variants={fadeInUp}>
        <SectionLabel>Multi-role dashboard</SectionLabel>
      </motion.div>
      <motion.h2
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={fadeInUp}
        className="font-display mt-5 max-w-3xl text-3xl leading-tight text-foreground md:text-[2.75rem]"
      >
        Enam dashboard, enam <GradientText>level keputusan</GradientText>—untuk siapa?
      </motion.h2>
      <motion.p
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={fadeInUp}
        className="mt-4 max-w-2xl text-base text-muted-foreground"
      >
        Tiap stakeholder dipisah ke halaman tersendiri sesuai tingkat keputusan dan audiens institusionalnya—
        bukan menumpuk semua KPI di satu dashboard generik.
      </motion.p>

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {stakeholders.map((s) => {
          const Icon = s.icon;
          return (
            <motion.div key={s.slug} variants={fadeInUp}>
              <Link
                href={`/stakeholder/${s.slug}`}
                className="group flex h-full flex-col gap-4 rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-card-lg"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-bg shadow-accent-tint">
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <span className="rounded-full border border-accent/20 bg-accent/5 px-2.5 py-1 font-mono-ui text-[9px] uppercase tracking-[0.18em] text-accent">
                    {s.level}
                  </span>
                </div>
                <div>
                  <h3 className="font-display text-2xl text-foreground">{s.title}</h3>
                  <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    <Users className="h-3 w-3" /> Untuk:
                  </p>
                  <p className="mt-1 text-sm font-medium text-foreground">{s.primary}</p>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {s.secondary.slice(0, 3).map((sec) => (
                      <span key={sec} className="rounded-md bg-muted px-2 py-0.5 font-mono-ui text-[10px] text-muted-foreground">
                        {sec}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="mt-auto rounded-lg border border-border bg-muted/40 p-3 text-xs leading-relaxed text-muted-foreground">
                  <span className="font-medium text-foreground">Contoh keputusan:</span> {s.example}
                </p>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-accent">
                  Buka dashboard
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}

/* ============== INSIGHT TEASER ============== */

export function InsightTeaserSection({
  topPriorities,
}: {
  topPriorities: Array<{ rank: number; nama: string; cluster: string; score: string }>;
}) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
      <InvertedSection className="px-6 py-12 md:px-12 md:py-16">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <div className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/5 px-4 py-1.5">
            <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-white" />
            <span className="font-mono-ui text-[10px] uppercase tracking-[0.2em] text-white">
              Insight teratas
            </span>
          </div>
          <h2 className="font-display mt-5 max-w-2xl text-3xl leading-tight text-white md:text-[2.5rem]">
            Tiga wilayah dengan skor prioritas tertinggi
          </h2>
          <p className="mt-3 max-w-xl text-sm text-white/70 md:text-base">
            Hasil K-Means clustering + priority score komposit (TPT, kemiskinan, gini, kerentanan).
            Wilayah-wilayah ini disarankan jadi fokus paket intervensi terpadu.
          </p>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mt-10 grid gap-4 md:grid-cols-3"
        >
          {topPriorities.map((p) => (
            <motion.div
              key={p.nama}
              variants={fadeInUp}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
            >
              <div className="flex items-baseline justify-between">
                <span className="font-display text-5xl text-white">#{p.rank}</span>
                <span className="rounded-full border border-white/20 px-2 py-0.5 text-[10px] font-mono-ui uppercase tracking-[0.18em] text-white/70">
                  {p.cluster}
                </span>
              </div>
              <p className="font-display mt-4 text-xl text-white">{p.nama}</p>
              <p className="mt-1 text-xs text-white/60">Skor prioritas</p>
              <p className="mt-1 font-display text-2xl text-white">
                <GradientText>{p.score}</GradientText>
              </p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mt-10"
        >
          <Link
            href="/stakeholder/strategic"
            className="group inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-medium text-foreground transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-lg"
          >
            Lihat semua prioritas wilayah
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </InvertedSection>
    </section>
  );
}

/* ============== METHODOLOGY TEASER ============== */

export function MethodologyTeaserSection() {
  const points = [
    "Dataset multi-source: BPS, Open Data Jabar, Bank Indonesia",
    "ETL Python dengan validasi + dokumentasi data dictionary",
    "Star schema dengan fact (kinerja & inflasi) + 4 dimensi",
    "K-Means k=3 dengan silhouette score evaluation",
    "Priority score = SAW dari 4 indikator utama",
  ];
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <motion.div initial="hidden" whileInView="visible" viewport={viewportOnce} variants={fadeInUp}>
          <SectionLabel>Metodologi</SectionLabel>
          <h2 className="font-display mt-5 text-3xl leading-tight text-foreground md:text-[2.5rem]">
            Tidak ada dashboard tanpa <GradientText>analisis data</GradientText>.
          </h2>
          <p className="mt-4 max-w-xl text-base text-muted-foreground">
            Semua visualisasi di sini adalah representasi hasil analisis—bukan dashboard kosong.
            Setiap chart dibangun dari pipeline ETL yang bisa direplikasi.
          </p>
          <ul className="mt-8 space-y-3">
            {points.map((p, i) => (
              <li key={p} className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/10 font-mono-ui text-[10px] font-semibold text-accent">
                  {i + 1}
                </span>
                <span className="text-sm leading-relaxed text-foreground">{p}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <Link
              href="/metodologi"
              className="group inline-flex items-center gap-2 rounded-xl border border-border bg-transparent px-5 py-2.5 text-sm font-medium text-foreground transition-all duration-200 hover:bg-muted hover:border-accent/30"
            >
              Baca metodologi lengkap
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          viewport={viewportOnce}
          className="relative overflow-hidden rounded-tl-[3rem] rounded-br-[3rem] rounded-tr-2xl rounded-bl-2xl border border-border bg-card p-8 shadow-card-lg"
        >
          <div aria-hidden className="pointer-events-none absolute inset-0 dot-pattern-light opacity-60" />
          <div className="relative">
            <Network className="h-8 w-8 text-accent" />
            <p className="font-display mt-4 text-2xl text-foreground">Star schema BI Jabar</p>
            <div className="mt-6 space-y-2">
              {[
                { label: "fact_kinerja_ekonomi_tahunan", type: "FACT" },
                { label: "fact_inflasi_bulanan", type: "FACT" },
                { label: "dim_lokasi (27 kab/kota)", type: "DIM" },
                { label: "dim_waktu_tahunan", type: "DIM" },
                { label: "dim_waktu_bulanan", type: "DIM" },
                { label: "dim_dashboard_stakeholder", type: "DIM" },
              ].map((t) => (
                <div key={t.label} className="flex items-center gap-2">
                  <span className={`font-mono-ui text-[9px] uppercase tracking-[0.18em] ${t.type === "FACT" ? "text-accent" : "text-muted-foreground"}`}>
                    {t.type}
                  </span>
                  <span className="text-xs text-foreground">{t.label}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ============== CTA + FOOTER ============== */

export function FinalCTASection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <InvertedSection className="px-6 py-14 md:px-12 md:py-20">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="relative max-w-3xl"
        >
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/5 px-4 py-1.5">
            <Globe2 className="h-3.5 w-3.5 text-white" />
            <span className="font-mono-ui text-[10px] uppercase tracking-[0.2em] text-white">Ready to explore</span>
          </motion.div>
          <motion.h2
            variants={fadeInUp}
            className="font-display mt-5 text-3xl leading-tight text-white md:text-[3rem]"
          >
            Buka dashboard. Mulai eksplorasi data Jabar <GradientText>sekarang</GradientText>.
          </motion.h2>
          <motion.p variants={fadeInUp} className="mt-4 text-sm text-white/70 md:text-base">
            Akses 9 halaman, 15+ visualisasi, filter interaktif, dan rekomendasi berbasis data—
            siap dipakai untuk pengambilan keputusan publik.
          </motion.p>
          <motion.div variants={fadeInUp} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/dashboard"
              className="group inline-flex h-13 items-center justify-center gap-2 rounded-xl bg-white px-7 text-sm font-medium text-foreground shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-xl"
            >
              Buka Dashboard
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/stakeholder/public"
              className="group inline-flex h-13 items-center justify-center gap-2 rounded-xl border border-white/20 bg-transparent px-7 text-sm font-medium text-white transition-all duration-200 hover:bg-white/10"
            >
              Versi publik
            </Link>
          </motion.div>
        </motion.div>
      </InvertedSection>
    </section>
  );
}

export function LandingFooter() {
  return (
    <footer className="border-t border-border bg-card/40">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <p className="font-display text-lg text-foreground">BI Jabar</p>
          <p className="mt-1 text-xs text-muted-foreground">Smart Province Analytics · Kelompok 3 D4 SIKC 3B</p>
          <p className="mt-2 text-xs text-muted-foreground">Tugas Besar Business Intelligence · Semester Genap 2025/2026</p>
        </div>
        <div>
          <p className="font-mono-ui text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Halaman</p>
          <ul className="mt-3 space-y-1.5 text-sm">
            <li><Link href="/dashboard" className="text-foreground hover:text-accent">Dashboard</Link></li>
            <li><Link href="/metodologi" className="text-foreground hover:text-accent">Metodologi</Link></li>
            <li><Link href="/data-quality" className="text-foreground hover:text-accent">Data Quality</Link></li>
            <li><Link href="/ringkasan-eksekutif" className="text-foreground hover:text-accent">Ringkasan Eksekutif</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-mono-ui text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Sumber data</p>
          <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
            <li>BPS Jawa Barat</li>
            <li>Open Data Jabar</li>
            <li>Bank Indonesia</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 text-xs text-muted-foreground sm:px-6 lg:px-8">
          <span>© 2026 BI Jabar — Kelompok 3</span>
          <span>Built with Next.js + Recharts + Framer Motion</span>
        </div>
      </div>
    </footer>
  );
}
