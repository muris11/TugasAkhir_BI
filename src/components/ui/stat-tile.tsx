import { cn } from "@/lib/cn";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";

type Trend = "up" | "down" | "flat" | "none";

type StatTileProps = {
  label: string;
  value: string;
  hint?: string;
  trend?: Trend;
  trendLabel?: string;
  /** Lower-is-better KPI (e.g. TPT, kemiskinan) flips the color of trend. */
  invertTrend?: boolean;
  icon?: React.ReactNode;
  variant?: "default" | "inverted" | "featured";
  sparkline?: React.ReactNode;
  className?: string;
};

export function StatTile({
  label,
  value,
  hint,
  trend = "none",
  trendLabel,
  invertTrend,
  icon,
  variant = "default",
  sparkline,
  className,
}: StatTileProps) {
  const isInv = variant === "inverted";

  let trendColor = "text-muted-foreground";
  if (trend === "up") {
    trendColor = invertTrend ? "text-rose-500" : "text-emerald-500";
  } else if (trend === "down") {
    trendColor = invertTrend ? "text-emerald-500" : "text-rose-500";
  }
  if (isInv && trend !== "none") {
    trendColor = trend === "up"
      ? invertTrend ? "text-rose-300" : "text-emerald-300"
      : invertTrend ? "text-emerald-300" : "text-rose-300";
  }

  const TrendIcon = trend === "up" ? ArrowUpRight : trend === "down" ? ArrowDownRight : Minus;

  if (variant === "featured") {
    return (
      <div className={cn("rounded-2xl bg-linear-to-br from-accent to-accent-secondary p-[1.5px] shadow-accent-tint", className)}>
        <div className="h-full w-full rounded-[calc(1rem-1.5px)] bg-card p-5">
          <Inner
            label={label}
            value={value}
            hint={hint}
            trend={trend}
            trendLabel={trendLabel}
            trendColor={trendColor}
            TrendIcon={TrendIcon}
            icon={icon}
            sparkline={sparkline}
            isInv={false}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border p-5 transition-all duration-300",
        isInv
          ? "border-white/10 bg-white/5 text-white hover:bg-white/10"
          : "border-border bg-card shadow-card hover:shadow-card-lg",
        className,
      )}
    >
      <Inner
        label={label}
        value={value}
        hint={hint}
        trend={trend}
        trendLabel={trendLabel}
        trendColor={trendColor}
        TrendIcon={TrendIcon}
        icon={icon}
        sparkline={sparkline}
        isInv={isInv}
      />
    </div>
  );
}

function Inner({
  label,
  value,
  hint,
  trend,
  trendLabel,
  trendColor,
  TrendIcon,
  icon,
  sparkline,
  isInv,
}: {
  label: string;
  value: string;
  hint?: string;
  trend: Trend;
  trendLabel?: string;
  trendColor: string;
  TrendIcon: React.ComponentType<{ className?: string }>;
  icon?: React.ReactNode;
  sparkline?: React.ReactNode;
  isInv: boolean;
}) {
  return (
    <>
      <div className="flex items-start justify-between gap-3">
        <p className={cn("font-mono-ui text-[10px] uppercase tracking-[0.18em]", isInv ? "text-white/60" : "text-muted-foreground")}>
          {label}
        </p>
        {icon ? (
          <div className={cn("flex h-9 w-9 items-center justify-center rounded-lg", isInv ? "bg-white/10" : "gradient-bg text-white shadow-accent-tint")}>
            {icon}
          </div>
        ) : null}
      </div>
      <p className={cn("font-display mt-3 text-3xl leading-none md:text-[2.5rem]", isInv ? "text-white" : "text-foreground")}>
        {value}
      </p>
      <div className="mt-2 flex items-center gap-3">
        {trend !== "none" ? (
          <span className={cn("inline-flex items-center gap-1 text-xs font-medium", trendColor)}>
            <TrendIcon className="h-3.5 w-3.5" />
            {trendLabel}
          </span>
        ) : null}
        {hint ? (
          <span className={cn("text-xs", isInv ? "text-white/60" : "text-muted-foreground")}>{hint}</span>
        ) : null}
      </div>
      {sparkline ? <div className="mt-3 -mx-1 h-10">{sparkline}</div> : null}
    </>
  );
}
