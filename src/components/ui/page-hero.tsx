import { cn } from "@/lib/cn";

export function PageHero({
  eyebrow,
  title,
  highlight,
  description,
  meta,
  className,
}: {
  eyebrow: string;
  title: string;
  highlight?: string;
  description: string;
  meta?: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("relative overflow-hidden rounded-3xl border border-border bg-card p-6 md:p-10", className)}>
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 -top-32 h-72 w-72 rounded-full bg-accent/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-accent-secondary/10 blur-3xl"
      />
      <div className="relative">
        <div className="inline-flex items-center gap-3 rounded-full border border-accent/30 bg-accent/5 px-4 py-1.5">
          <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-accent" />
          <span className="font-mono-ui text-[11px] uppercase tracking-[0.18em] text-accent">
            {eyebrow}
          </span>
        </div>
        <h1 className="font-display mt-5 text-3xl leading-[1.1] tracking-tight text-foreground md:text-[2.75rem]">
          {title}{" "}
          {highlight ? <span className="gradient-text">{highlight}</span> : null}
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">
          {description}
        </p>
        {meta ? <div className="mt-6">{meta}</div> : null}
      </div>
    </section>
  );
}
