"use client";

import { GradientText } from "@/components/ui/gradient-text";
import { FloatingCard } from "@/components/ui/motion";
import { fadeInUp, stagger, viewportOnce } from "@/lib/motion";
import { motion } from "framer-motion";
import { ArrowRight, ChevronRight, Compass, TrendingDown, TrendingUp } from "lucide-react";
import Link from "next/link";

export function HeroSection({
  topPriorityName,
  topPriorityScore,
  avgTpt,
  avgMiskin,
}: {
  topPriorityName: string;
  topPriorityScore: string;
  avgTpt: string;
  avgMiskin: string;
}) {
  return (
    <section className="relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-150">
        <div className="absolute left-1/2 top-0 h-100 w-200 -translate-x-1/2 rounded-full bg-accent/8 blur-[120px]" />
      </div>
      <div className="mx-auto grid max-w-6xl gap-12 px-4 pb-16 pt-12 sm:px-6 md:pt-20 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8 lg:px-8 lg:pb-24 lg:pt-28">
        <motion.div initial="hidden" animate="visible" variants={stagger}>
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-3 rounded-full border border-accent/30 bg-accent/5 px-4 py-1.5">
            <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-accent" />
            <span className="font-mono-ui text-[10px] uppercase tracking-[0.2em] text-accent">
              Proyek BI · Kelompok 3 · D4 SIKC 3B
            </span>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="font-display mt-6 text-[2.4rem] leading-[1.05] tracking-tight text-foreground md:text-[3.4rem] lg:text-[4rem]"
          >
            Membaca <GradientText withUnderline>Jawa Barat</GradientText>
            <br />
            dari data, bukan dari asumsi.
          </motion.h1>

          <motion.p variants={fadeInUp} className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Sistem Business Intelligence end-to-end untuk 27 kabupaten/kota Jawa Barat.
            Dari ETL, data warehouse, K-Means clustering, sampai dashboard stakeholder—
            semua berbasis data terbuka dan siap dipakai untuk pengambilan keputusan.
          </motion.p>

          <motion.div variants={fadeInUp} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/dashboard"
              className="group inline-flex h-13 items-center justify-center gap-2 rounded-xl gradient-bg px-7 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110 hover:shadow-accent-tint-lg"
            >
              Lihat Dashboard
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/metodologi"
              className="group inline-flex h-13 items-center justify-center gap-2 rounded-xl border border-border bg-transparent px-7 text-sm font-medium text-foreground transition-all duration-200 hover:bg-muted hover:border-accent/30"
            >
              Baca Metodologi
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </motion.div>

          <motion.div variants={fadeInUp} className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
            <p className="font-mono-ui text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Sumber data
            </p>
            <span className="text-sm font-medium text-foreground">BPS Jabar</span>
            <span className="text-sm font-medium text-muted-foreground">·</span>
            <span className="text-sm font-medium text-foreground">Open Data Jabar</span>
            <span className="text-sm font-medium text-muted-foreground">·</span>
            <span className="text-sm font-medium text-foreground">Bank Indonesia</span>
          </motion.div>
        </motion.div>

        {/* Animated graphic */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative hidden h-120 lg:block"
          viewport={viewportOnce}
        >
          {/* Rotating dashed ring */}
          <div
            aria-hidden
            className="animate-rotate-slow absolute inset-12 rounded-full border-2 border-dashed border-accent/30"
          />
          <div
            aria-hidden
            className="animate-rotate-slower absolute inset-24 rounded-full border border-accent/20"
          />

          {/* Center accent block */}
          <div className="absolute right-6 top-6 h-20 w-20 rounded-2xl gradient-bg shadow-accent-tint-lg">
            <div className="flex h-full w-full items-center justify-center">
              <Compass className="h-8 w-8 text-white" />
            </div>
          </div>

          {/* 3x3 dot grid */}
          <div className="absolute bottom-12 right-16 grid grid-cols-3 gap-2">
            {Array.from({ length: 9 }).map((_, i) => (
              <span
                key={i}
                className="h-2 w-2 rounded-full"
                style={{
                  background: i % 3 === 0 ? "var(--accent)" : "rgba(0,82,255,0.25)",
                }}
              />
            ))}
          </div>

          {/* Floating cards */}
          <FloatingCard duration={5} className="absolute left-2 top-10 w-56 rounded-2xl border border-border bg-card p-4 shadow-card-lg">
            <div className="flex items-center justify-between">
              <p className="font-mono-ui text-[9px] uppercase tracking-[0.2em] text-muted-foreground">TPT 2025</p>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                <TrendingDown className="h-3 w-3" />
                turun
              </span>
            </div>
            <p className="font-display mt-2 text-2xl text-foreground">{avgTpt}</p>
            <p className="text-[11px] text-muted-foreground">Rata-rata 27 kab/kota</p>
            <div className="mt-3 flex items-end gap-1">
              {[18, 24, 21, 28, 22, 19, 16].map((h, i) => (
                <span key={i} className="w-1.5 rounded-sm bg-accent/30" style={{ height: h }} />
              ))}
            </div>
          </FloatingCard>

          <FloatingCard duration={4} delay={0.8} className="absolute left-1/2 top-44 w-60 -translate-x-1/2 rounded-2xl bg-foreground p-4 text-background shadow-card-xl">
            <div className="flex items-center justify-between">
              <p className="font-mono-ui text-[9px] uppercase tracking-[0.2em] text-white/60">Prioritas #1</p>
              <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-accent" />
            </div>
            <p className="font-display mt-2 text-xl text-white">{topPriorityName}</p>
            <p className="text-[11px] text-white/70">Skor prioritas: {topPriorityScore}</p>
            <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-4/5 gradient-bg" />
            </div>
          </FloatingCard>

          <FloatingCard duration={6} delay={1.4} className="absolute bottom-6 left-12 w-52 rounded-2xl border border-border bg-card p-4 shadow-card-lg">
            <div className="flex items-center justify-between">
              <p className="font-mono-ui text-[9px] uppercase tracking-[0.2em] text-muted-foreground">Kemiskinan</p>
              <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-medium text-rose-700">
                <TrendingUp className="h-3 w-3" />
                fokus
              </span>
            </div>
            <p className="font-display mt-2 text-2xl text-foreground">{avgMiskin}</p>
            <p className="text-[11px] text-muted-foreground">Rata-rata provinsi</p>
          </FloatingCard>
        </motion.div>
      </div>
    </section>
  );
}
