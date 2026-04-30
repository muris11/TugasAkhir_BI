"use client";

import { cn } from "@/lib/cn";
import {
    Activity,
    Award,
    BarChart3,
    Compass,
    Database,
    GitBranch,
    HelpCircle,
    Layers,
    LayoutDashboard,
    LineChart,
    Megaphone,
    Menu,
    ShieldCheck,
    Telescope,
    Users,
    X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  subtitle?: string;
  badge?: string;
};

const utamaItems: NavItem[] = [
  { href: "/dashboard", label: "Beranda", icon: LayoutDashboard, subtitle: "Overview KPI provinsi" },
  { href: "/analisis", label: "Analisis Bisnis", icon: HelpCircle, subtitle: "2.4 Business Question" },
  { href: "/ringkasan-eksekutif", label: "Ringkasan Eksekutif", icon: Award, subtitle: "Untuk pimpinan" },
  { href: "/data-quality", label: "Data Quality", icon: ShieldCheck, subtitle: "Kualitas & coverage data" },
  { href: "/metodologi", label: "Metodologi", icon: GitBranch, subtitle: "Pipeline & rumus" },
];

const stakeholderItems: NavItem[] = [
  { href: "/stakeholder/strategic", label: "Strategic", icon: Compass, subtitle: "Gubernur · Bappeda Provinsi" },
  { href: "/stakeholder/tactical", label: "Tactical", icon: LineChart, subtitle: "Kepala Dinas · OPD sektoral" },
  { href: "/stakeholder/managerial", label: "Managerial", icon: Layers, subtitle: "Bupati/Wali Kota · Sekda" },
  { href: "/stakeholder/operational", label: "Operational", icon: Activity, subtitle: "Operator data · Diskominfo" },
  { href: "/stakeholder/analytical", label: "Analytical", icon: Telescope, subtitle: "Tim BI · Data Analyst" },
  { href: "/stakeholder/public", label: "Public", icon: Megaphone, subtitle: "Masyarakat · Media · Akademisi" },
];

export function AppShell({
  title,
  description,
  eyebrow = "Dashboard BI Jabar",
  highlight,
  children,
  toolbar,
}: {
  title: string;
  description: string;
  eyebrow?: string;
  highlight?: string;
  children: ReactNode;
  toolbar?: ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background">
      <TopBar onMenuToggle={() => setMobileOpen((v) => !v)} mobileOpen={mobileOpen} />

      <div className="mx-auto grid max-w-352 grid-cols-1 gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[280px_1fr] lg:px-8">
        <aside className={cn("lg:sticky lg:top-24 lg:h-fit", mobileOpen ? "block" : "hidden lg:block")}>
          <Sidebar pathname={pathname} onNavigate={() => setMobileOpen(false)} />
        </aside>

        <main className="min-w-0 space-y-6">
          <PageHeader eyebrow={eyebrow} title={title} highlight={highlight} description={description} toolbar={toolbar} />
          {children}
        </main>
      </div>

      <Footer />
    </div>
  );
}

function TopBar({ onMenuToggle, mobileOpen }: { onMenuToggle: () => void; mobileOpen: boolean }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-352 items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-2.5">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-lg gradient-bg shadow-accent-tint">
            <BarChart3 className="h-4 w-4 text-white" />
          </div>
          <div className="leading-tight">
            <p className="font-display text-base text-foreground">BI Jabar</p>
            <p className="font-mono-ui text-[9px] uppercase tracking-[0.18em] text-muted-foreground">Smart Province Analytics</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <TopLink href="/dashboard">Dashboard</TopLink>
          <TopLink href="/metodologi">Metodologi</TopLink>
          <TopLink href="/data-quality">Data Quality</TopLink>
          <TopLink href="/ringkasan-eksekutif">Eksekutif</TopLink>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/dashboard"
            className="hidden h-10 items-center justify-center gap-1.5 rounded-xl gradient-bg px-4 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-accent-tint-lg sm:inline-flex"
          >
            Buka Dashboard
          </Link>
          <button
            type="button"
            aria-label={mobileOpen ? "Tutup menu" : "Buka menu"}
            onClick={onMenuToggle}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-foreground transition-colors hover:bg-muted lg:hidden"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </header>
  );
}

function TopLink({ href, children }: { href: string; children: ReactNode }) {
  const pathname = usePathname();
  const active = pathname === href;
  return (
    <Link
      href={href}
      className={cn(
        "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
        active ? "bg-accent/10 text-accent" : "text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      {children}
    </Link>
  );
}

function Sidebar({ pathname, onNavigate }: { pathname: string; onNavigate: () => void }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-card">
      <div className="rounded-xl border border-accent/20 bg-accent/5 p-4">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-accent" />
          <p className="font-mono-ui text-[9px] uppercase tracking-[0.2em] text-accent">Mode analitik</p>
        </div>
        <p className="mt-1.5 font-display text-base leading-tight text-foreground">
          Stakeholder-driven BI
        </p>
        <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
          Interaktif · Responsif · Berbasis ETL & data mining
        </p>
      </div>

      <NavGroup label="Halaman utama" items={utamaItems} pathname={pathname} onNavigate={onNavigate} />
      <NavGroup label="Stakeholder" items={stakeholderItems} pathname={pathname} onNavigate={onNavigate} />

      <div className="mt-4 rounded-xl border border-border bg-muted/40 p-3">
        <div className="flex items-center gap-2">
          <Database className="h-3.5 w-3.5 text-accent" />
          <p className="font-mono-ui text-[9px] uppercase tracking-[0.2em] text-muted-foreground">Sumber data</p>
        </div>
        <p className="mt-2 text-[11px] leading-relaxed text-foreground">
          BPS · Open Data Jabar · Bank Indonesia
        </p>
        <p className="mt-1 text-[10px] text-muted-foreground">27 kab/kota · 2021–2025</p>
      </div>

      <Link
        href="/"
        className="mt-3 inline-flex w-full items-center justify-center gap-1 rounded-xl border border-border bg-transparent px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <Users className="h-3.5 w-3.5" />
        Tentang proyek
      </Link>
    </div>
  );
}

function NavGroup({
  label,
  items,
  pathname,
  onNavigate,
}: {
  label: string;
  items: NavItem[];
  pathname: string;
  onNavigate: () => void;
}) {
  return (
    <div className="mt-5">
      <p className="px-2 font-mono-ui text-[9px] uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
      <nav className="mt-2 space-y-0.5">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "group relative flex items-start gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active ? "bg-accent/10 text-accent" : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {active ? (
                <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full gradient-bg" />
              ) : null}
              <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", active ? "text-accent" : "text-muted-foreground/70 group-hover:text-foreground")} />
              <div className="min-w-0 flex-1">
                <span className="block truncate leading-tight">{item.label}</span>
                {item.subtitle ? (
                  <span className={cn("block truncate text-[10px] font-normal leading-tight", active ? "text-accent/70" : "text-muted-foreground/70")}>
                    {item.subtitle}
                  </span>
                ) : null}
              </div>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

function PageHeader({
  eyebrow,
  title,
  highlight,
  description,
  toolbar,
}: {
  eyebrow: string;
  title: string;
  highlight?: string;
  description: string;
  toolbar?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 md:p-8 shadow-card">
      <div aria-hidden className="pointer-events-none absolute -right-32 -top-24 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-accent-secondary/10 blur-3xl" />
      <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-3 rounded-full border border-accent/30 bg-accent/5 px-4 py-1.5">
            <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-accent" />
            <span className="font-mono-ui text-[10px] uppercase tracking-[0.2em] text-accent">{eyebrow}</span>
          </div>
          <h1 className="font-display mt-4 text-[1.85rem] leading-[1.1] tracking-tight text-foreground md:text-[2.5rem]">
            {title}
            {highlight ? (
              <>
                {" "}
                <span className="gradient-text">{highlight}</span>
              </>
            ) : null}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">{description}</p>
        </div>
        {toolbar ? <div className="shrink-0">{toolbar}</div> : null}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-card/40">
      <div className="mx-auto flex max-w-352 flex-col gap-4 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <div>
          <p className="font-display text-base text-foreground">BI Jabar — Kelompok 3</p>
          <p className="mt-1 text-xs text-muted-foreground">D4 SIKC 3B · Business Intelligence · Semester Genap 2025/2026</p>
        </div>
        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
          <span>Sumber: BPS Jawa Barat</span>
          <span>·</span>
          <span>Open Data Jabar</span>
          <span>·</span>
          <span>Bank Indonesia</span>
        </div>
      </div>
    </footer>
  );
}
