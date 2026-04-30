import { StatTile } from "@/components/ui/stat-tile";

export type KPIItem = {
  label: string;
  value: string;
  note?: string;
  trend?: "up" | "down" | "flat" | "none";
  trendLabel?: string;
  invertTrend?: boolean;
  icon?: React.ReactNode;
  variant?: "default" | "inverted" | "featured";
};

export function KPICards({ items }: { items: Array<{ label: string; value: string; note?: string }> | KPIItem[] }) {
  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {(items as KPIItem[]).map((item) => (
        <StatTile
          key={item.label}
          label={item.label}
          value={item.value}
          hint={item.note}
          trend={item.trend ?? "none"}
          trendLabel={item.trendLabel}
          invertTrend={item.invertTrend}
          icon={item.icon}
          variant={item.variant}
        />
      ))}
    </section>
  );
}
