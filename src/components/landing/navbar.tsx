"use client";

import { cn } from "@/lib/cn";
import { ArrowRight, BarChart3, Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/metodologi", label: "Metodologi" },
  { href: "/ringkasan-eksekutif", label: "Insight" },
  { href: "/data-quality", label: "Data Quality" },
];

export function LandingNavbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-lg gradient-bg shadow-accent-tint">
            <BarChart3 className="h-5 w-5 text-white" />
            <span className="absolute -right-1 -top-1 h-2.5 w-2.5 animate-pulse-dot rounded-full bg-emerald-400 ring-2 ring-background" />
          </div>
          <div className="leading-tight">
            <p className="font-display text-lg text-foreground">BI Jabar</p>
            <p className="font-mono-ui text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-medium">Smart Province Analytics</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-4 py-2.5 text-base font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/dashboard"
            className="group hidden h-12 items-center justify-center gap-2 rounded-xl gradient-bg px-6 text-base font-medium text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110 hover:shadow-accent-tint-lg sm:inline-flex"
          >
            Buka Dashboard
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-card md:hidden"
            onClick={() => setOpen((v) => !v)}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>
      {open ? (
        <div className="border-t border-border md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3 sm:px-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-lg px-4 py-2.5 text-base font-medium text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
