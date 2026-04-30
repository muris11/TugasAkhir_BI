import { cn } from "@/lib/cn";

type InsightBoxProps = {
  what: string;
  why: string;
  impact: string;
  decision?: string;
  className?: string;
};

export function InsightBox({ what, why, impact, decision, className }: InsightBoxProps) {
  const items: Array<[string, string, string]> = [
    ["01", "Apa yang terjadi", what],
    ["02", "Mengapa terjadi", why],
    ["03", "Dampak", impact],
  ];
  if (decision) items.push(["04", "Keputusan & rekomendasi", decision]);

  return (
    <div
      className={cn(
        "rounded-2xl bg-linear-to-br from-accent to-accent-secondary p-[1.5px] shadow-accent-tint",
        className,
      )}
    >
      <div className="rounded-[calc(1rem-1.5px)] bg-card p-6 md:p-8">
        <p className="font-mono-ui text-[11px] uppercase tracking-[0.18em] text-accent">
          Data storytelling
        </p>
        <h3 className="font-display mt-2 text-2xl leading-tight text-foreground md:text-[2rem]">
          Insight & keputusan berbasis data
        </h3>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {items.map(([num, title, body]) => (
            <div key={num} className="rounded-xl border border-border/70 bg-muted/40 p-4">
              <div className="flex items-center gap-2">
                <span className="font-mono-ui text-[10px] tracking-[0.2em] text-accent">{num}</span>
                <span className="text-sm font-semibold text-foreground">{title}</span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
