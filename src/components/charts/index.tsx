"use client";

import { chartPalette, clusterColors, getClusterColor } from "@/components/charts/palette";
import { cn } from "@/lib/cn";

export { chartPalette, clusterColors, getClusterColor };

    import {
        Area,
        AreaChart,
        Bar,
        BarChart,
        CartesianGrid,
        Cell,
        ComposedChart,
        Legend,
        Line,
        LineChart,
        PolarAngleAxis,
        PolarGrid,
        PolarRadiusAxis,
        Radar,
        RadarChart,
        RadialBar,
        RadialBarChart,
        ReferenceLine,
        ResponsiveContainer,
        Scatter,
        ScatterChart,
        Tooltip,
        Treemap,
        XAxis,
        YAxis,
        ZAxis,
    } from "recharts";

export function ChartFrame({
  title,
  description,
  prompt,
  badge,
  children,
  className,
  height = "h-72",
  actions,
}: {
  title: string;
  description?: string;
  prompt?: string;
  badge?: string;
  children: React.ReactNode;
  className?: string;
  height?: string;
  actions?: React.ReactNode;
}) {
  return (
    <section
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-card transition-all duration-300 hover:shadow-card-lg",
        className,
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          {badge ? (
            <p className="font-mono-ui text-[10px] uppercase tracking-[0.18em] text-accent">
              {badge}
            </p>
          ) : null}
          <h3 className="font-display mt-1 text-lg leading-tight text-foreground md:text-xl">
            {title}
          </h3>
          {prompt ? (
            <p className="font-display mt-2 max-w-xl text-sm italic leading-snug text-accent/90 md:text-[0.95rem]">
              <span className="mr-1 text-accent/60">&#10077;</span>
              {prompt}
            </p>
          ) : null}
          {description ? (
            <p className="mt-1.5 max-w-xl text-xs leading-relaxed text-muted-foreground md:text-sm">
              {description}
            </p>
          ) : null}
        </div>
        {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
      </div>
      <div className={cn("mt-4 w-full", height)}>{children}</div>
    </section>
  );
}

const tooltipStyle = {
  borderRadius: 12,
  border: `1px solid ${chartPalette.border}`,
  background: "#fff",
  boxShadow: "0 10px 25px rgba(15,23,42,0.08)",
  fontSize: 12,
  padding: "8px 12px",
} as const;

const axisTick = { fontSize: 11, fill: chartPalette.mutedFg };

/* ------------------- 1. KPI TREND LINE ------------------- */

type TrendPoint = Record<string, number | string>;

export function KPITrendLine({
  data,
  xKey,
  lines,
  reference,
  legend = true,
}: {
  data: TrendPoint[];
  xKey: string;
  lines: Array<{ key: string; name: string; color: string }>;
  reference?: { y: number; label: string; color?: string };
  legend?: boolean;
}) {
  return (
    <ResponsiveContainer>
      <LineChart data={data} margin={{ top: 10, right: 16, bottom: 0, left: -10 }}>
        <CartesianGrid strokeDasharray="4 4" stroke={chartPalette.border} vertical={false} />
        <XAxis dataKey={xKey} tick={axisTick} tickLine={false} axisLine={false} />
        <YAxis tick={axisTick} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={tooltipStyle} />
        {legend ? <Legend wrapperStyle={{ fontSize: 12 }} iconType="circle" /> : null}
        {reference ? (
          <ReferenceLine
            y={reference.y}
            stroke={reference.color ?? chartPalette.rose}
            strokeDasharray="3 3"
            label={{ value: reference.label, position: "right", fontSize: 10, fill: reference.color ?? chartPalette.rose }}
          />
        ) : null}
        {lines.map((line) => (
          <Line
            key={line.key}
            type="monotone"
            dataKey={line.key}
            name={line.name}
            stroke={line.color}
            strokeWidth={2.4}
            dot={{ r: 3, strokeWidth: 0, fill: line.color }}
            activeDot={{ r: 5 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

/* ------------------- 2. RANKING BAR (horizontal) ------------------- */

export function RankingBar({
  data,
  xKey,
  yKey,
  color = chartPalette.accent,
  reference,
}: {
  data: Array<Record<string, number | string>>;
  xKey: string;
  yKey: string;
  color?: string;
  reference?: { x: number; label: string };
}) {
  return (
    <ResponsiveContainer>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 24, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id="barGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={chartPalette.accent} />
            <stop offset="100%" stopColor={chartPalette.accentSecondary} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={chartPalette.border} horizontal={false} />
        <XAxis type="number" tick={axisTick} tickLine={false} axisLine={false} />
        <YAxis dataKey={xKey} type="category" tick={{ ...axisTick, fontSize: 11 }} tickLine={false} axisLine={false} width={140} />
        <Tooltip contentStyle={tooltipStyle} />
        {reference ? (
          <ReferenceLine
            x={reference.x}
            stroke={chartPalette.rose}
            strokeDasharray="3 3"
            label={{ value: reference.label, position: "top", fontSize: 10, fill: chartPalette.rose }}
          />
        ) : null}
        <Bar dataKey={yKey} fill={color === "gradient" ? "url(#barGrad)" : color} radius={[0, 8, 8, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

/* ------------------- 3. SCATTER (bubble) ------------------- */

export function ScatterBubble({
  data,
  xKey,
  yKey,
  zKey,
  xLabel,
  yLabel,
  colorBy,
  colors,
  referenceLines,
}: {
  data: Array<Record<string, number | string>>;
  xKey: string;
  yKey: string;
  zKey?: string;
  xLabel?: string;
  yLabel?: string;
  colorBy?: string;
  colors?: Record<string, string>;
  referenceLines?: Array<{ axis: "x" | "y"; value: number; label?: string }>;
}) {
  const groups = colorBy
    ? Array.from(new Set(data.map((d) => String(d[colorBy]))))
    : ["all"];

  return (
    <ResponsiveContainer>
      <ScatterChart margin={{ top: 10, right: 20, bottom: 16, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={chartPalette.border} />
        <XAxis
          type="number"
          dataKey={xKey}
          name={xLabel ?? xKey}
          tick={axisTick}
          label={xLabel ? { value: xLabel, position: "insideBottom", offset: -8, fontSize: 11, fill: chartPalette.mutedFg } : undefined}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          type="number"
          dataKey={yKey}
          name={yLabel ?? yKey}
          tick={axisTick}
          label={yLabel ? { value: yLabel, angle: -90, position: "insideLeft", fontSize: 11, fill: chartPalette.mutedFg } : undefined}
          tickLine={false}
          axisLine={false}
        />
        {zKey ? <ZAxis dataKey={zKey} range={[40, 360]} /> : null}
        <Tooltip cursor={{ strokeDasharray: "3 3" }} contentStyle={tooltipStyle} />
        {colorBy ? <Legend wrapperStyle={{ fontSize: 12 }} iconType="circle" /> : null}
        {referenceLines?.map((line, idx) =>
          line.axis === "x" ? (
            <ReferenceLine key={`x-${idx}`} x={line.value} stroke={chartPalette.accent} strokeDasharray="4 4" label={line.label} />
          ) : (
            <ReferenceLine key={`y-${idx}`} y={line.value} stroke={chartPalette.accent} strokeDasharray="4 4" label={line.label} />
          )
        )}
        {groups.map((g, idx) => {
          const subset = colorBy ? data.filter((d) => String(d[colorBy]) === g) : data;
          const color = colors?.[g] ?? getClusterColor(g, idx);
          return (
            <Scatter key={g} name={g} data={subset} fill={color} fillOpacity={0.85} />
          );
        })}
      </ScatterChart>
    </ResponsiveContainer>
  );
}

/* ------------------- 4. RADAR ------------------- */

export function ClusterRadar({
  data,
  series,
}: {
  data: Array<Record<string, number | string>>;
  series: Array<{ key: string; name: string; color: string }>;
}) {
  return (
    <ResponsiveContainer>
      <RadarChart data={data} outerRadius="78%">
        <PolarGrid stroke={chartPalette.border} />
        <PolarAngleAxis dataKey="indikator" tick={{ fontSize: 11, fill: chartPalette.foreground }} />
        <PolarRadiusAxis tick={{ fontSize: 9, fill: chartPalette.mutedFg }} angle={30} />
        {series.map((s) => (
          <Radar key={s.key} dataKey={s.key} name={s.name} stroke={s.color} fill={s.color} fillOpacity={0.18} strokeWidth={2} />
        ))}
        <Legend wrapperStyle={{ fontSize: 12 }} iconType="circle" />
        <Tooltip contentStyle={tooltipStyle} />
      </RadarChart>
    </ResponsiveContainer>
  );
}

/* ------------------- 5. AREA STREAM ------------------- */

export function AreaStream({
  data,
  xKey,
  yKey,
  yLabel,
  color = chartPalette.accent,
}: {
  data: Array<Record<string, number | string>>;
  xKey: string;
  yKey: string;
  yLabel?: string;
  color?: string;
}) {
  return (
    <ResponsiveContainer>
      <AreaChart data={data} margin={{ top: 8, right: 16, bottom: 0, left: -10 }}>
        <defs>
          <linearGradient id={`areaGrad-${yKey}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.45} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="4 4" stroke={chartPalette.border} vertical={false} />
        <XAxis dataKey={xKey} tick={axisTick} tickLine={false} axisLine={false} />
        <YAxis tick={axisTick} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={tooltipStyle} />
        <Area
          type="monotone"
          dataKey={yKey}
          name={yLabel ?? yKey}
          stroke={color}
          strokeWidth={2.4}
          fill={`url(#areaGrad-${yKey})`}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

/* ------------------- 6. RADIAL GAUGE ------------------- */

export function RadialGauge({
  value,
  label,
  max = 100,
  color = chartPalette.accent,
}: {
  value: number;
  label: string;
  max?: number;
  color?: string;
}) {
  const data = [{ name: label, value, fill: color }];
  return (
    <div className="relative h-full w-full">
      <ResponsiveContainer>
        <RadialBarChart innerRadius="70%" outerRadius="95%" data={data} startAngle={210} endAngle={-30} barSize={14}>
          <PolarAngleAxis type="number" domain={[0, max]} tick={false} />
          <RadialBar dataKey="value" background={{ fill: chartPalette.border }} cornerRadius={20} />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="font-display text-3xl text-foreground">{value.toFixed(1)}{max === 100 ? "%" : ""}</span>
        <span className="mt-1 max-w-40 text-[10px] font-mono-ui uppercase tracking-[0.18em] text-muted-foreground">
          {label}
        </span>
      </div>
    </div>
  );
}

/* ------------------- 7. SPARKLINE ------------------- */

export function Sparkline({
  data,
  yKey,
  color = chartPalette.accent,
  height = 36,
}: {
  data: Array<Record<string, number | string>>;
  yKey: string;
  color?: string;
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id={`spark-${yKey}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.45} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey={yKey} stroke={color} strokeWidth={1.8} fill={`url(#spark-${yKey})`} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

/* ------------------- 8. TREEMAP ------------------- */

type TreemapDatum = { name: string; size: number; cluster?: string };

export function PriorityTreemap({ data }: { data: TreemapDatum[] }) {
  return (
    <ResponsiveContainer>
      <Treemap
        data={data}
        dataKey="size"
        stroke="#fff"
        content={<TreemapNode /> as unknown as undefined}
      />
    </ResponsiveContainer>
  );
}

function TreemapNode(props: {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  name?: string;
  size?: number;
  cluster?: string;
  index?: number;
}) {
  const { x = 0, y = 0, width = 0, height = 0, name = "", size = 0, cluster = "", index = 0 } = props;
  const fill = cluster ? getClusterColor(cluster, index) : getClusterColor("", index);
  if (width < 1 || height < 1) return null;
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} fill={fill} fillOpacity={0.85} stroke="#fff" strokeWidth={2} rx={6} />
      {width > 70 && height > 38 ? (
        <>
          <text x={x + 8} y={y + 18} fill="#fff" fontSize={11} fontWeight={600}>
            {name.length > 18 ? `${name.slice(0, 16)}…` : name}
          </text>
          <text x={x + 8} y={y + 32} fill="#fff" fontSize={10} fillOpacity={0.85}>
            {size.toFixed(3)}
          </text>
        </>
      ) : null}
    </g>
  );
}

/* ------------------- 9. INFLATION HEATMAP (custom grid) ------------------- */

type HeatCell = { row: string; col: string; value: number | null };

export function InflationHeatmap({
  rows,
  cols,
  cells,
  unit = "%",
}: {
  rows: string[];
  cols: string[];
  cells: HeatCell[];
  unit?: string;
}) {
  const valid = cells.filter((c) => c.value !== null) as Array<HeatCell & { value: number }>;
  const min = Math.min(...valid.map((c) => c.value), 0);
  const max = Math.max(...valid.map((c) => c.value), 1);

  const colorFor = (v: number | null) => {
    if (v === null || Number.isNaN(v)) return "rgba(148,163,184,0.2)";
    const t = (v - min) / Math.max(max - min, 0.0001);
    if (v >= 0) {
      const opacity = 0.18 + t * 0.72;
      return `rgba(0, 82, 255, ${opacity})`;
    }
    const opacity = 0.18 + (1 - t) * 0.72;
    return `rgba(244, 63, 94, ${opacity})`;
  };

  const lookup = new Map<string, number | null>();
  cells.forEach((c) => lookup.set(`${c.row}__${c.col}`, c.value));

  return (
    <div className="dash-scroll w-full overflow-x-auto">
      <div className="min-w-160">
        <div className="grid" style={{ gridTemplateColumns: `160px repeat(${cols.length}, minmax(34px, 1fr))` }}>
          <div />
          {cols.map((c) => (
            <div key={c} className="px-1 py-2 text-center font-mono-ui text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
              {c}
            </div>
          ))}
          {rows.map((r) => (
            <div key={r} className="contents">
              <div className="flex items-center px-2 py-1.5 text-[11px] text-foreground">
                {r}
              </div>
              {cols.map((c) => {
                const v = lookup.get(`${r}__${c}`) ?? null;
                return (
                  <div
                    key={`${r}-${c}`}
                    title={v !== null ? `${r} ${c}: ${v.toFixed(2)}${unit}` : `${r} ${c}: tidak tersedia`}
                    className="m-0.5 flex aspect-square items-center justify-center rounded text-[9px] font-medium"
                    style={{
                      background: colorFor(v),
                      color: v !== null && Math.abs(v) > (max - min) * 0.5 ? "#fff" : "var(--foreground)",
                    }}
                  >
                    {v !== null ? v.toFixed(1) : "–"}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-2 text-[10px] text-muted-foreground">
          <span>Skala</span>
          <div className="h-2 w-40 rounded-full" style={{ background: "linear-gradient(to right, rgba(244,63,94,0.8), rgba(148,163,184,0.3), rgba(0,82,255,0.85))" }} />
          <span>{min.toFixed(1)}{unit}</span>
          <span className="text-foreground/40">→</span>
          <span>{max.toFixed(1)}{unit}</span>
        </div>
      </div>
    </div>
  );
}

/* ------------------- 10. CORRELATION MATRIX ------------------- */

export function CorrelationMatrix({ labels, matrix }: { labels: string[]; matrix: number[][] }) {
  return (
    <div className="dash-scroll w-full overflow-x-auto">
      <div className="min-w-120">
        <div className="grid" style={{ gridTemplateColumns: `120px repeat(${labels.length}, minmax(48px, 1fr))` }}>
          <div />
          {labels.map((l) => (
            <div key={l} className="px-1 py-2 text-center font-mono-ui text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
              {l}
            </div>
          ))}
          {labels.map((row, i) => (
            <div key={row} className="contents">
              <div className="flex items-center px-2 py-1.5 font-mono-ui text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                {row}
              </div>
              {labels.map((_, j) => {
                const v = matrix[i][j];
                const opacity = Math.min(Math.abs(v), 1) * 0.75 + 0.1;
                const bg = v >= 0
                  ? `rgba(0, 82, 255, ${opacity})`
                  : `rgba(244, 63, 94, ${opacity})`;
                return (
                  <div
                    key={`${i}-${j}`}
                    className="m-0.5 flex aspect-square items-center justify-center rounded text-[10px] font-semibold"
                    style={{ background: bg, color: opacity > 0.45 ? "#fff" : "var(--foreground)" }}
                  >
                    {v.toFixed(2)}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------- 11. DIVERGENT BAR ------------------- */

export function DivergentBar({
  data,
  xKey,
  positiveKey,
  negativeKey,
  positiveColor = chartPalette.accent,
  negativeColor = chartPalette.rose,
}: {
  data: Array<Record<string, number | string>>;
  xKey: string;
  positiveKey: string;
  negativeKey: string;
  positiveColor?: string;
  negativeColor?: string;
}) {
  return (
    <ResponsiveContainer>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, bottom: 0, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={chartPalette.border} horizontal={false} />
        <XAxis type="number" tick={axisTick} tickLine={false} axisLine={false} />
        <YAxis dataKey={xKey} type="category" tick={{ ...axisTick, fontSize: 11 }} width={140} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={tooltipStyle} />
        <Legend wrapperStyle={{ fontSize: 12 }} iconType="circle" />
        <ReferenceLine x={0} stroke={chartPalette.foreground} />
        <Bar dataKey={negativeKey} fill={negativeColor} radius={[8, 0, 0, 8]} />
        <Bar dataKey={positiveKey} fill={positiveColor} radius={[0, 8, 8, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

/* ------------------- 12. COMPOSED BAR + LINE ------------------- */

export function ComposedBarLine({
  data,
  xKey,
  bar,
  line,
}: {
  data: Array<Record<string, number | string>>;
  xKey: string;
  bar: { key: string; name: string; color: string };
  line: { key: string; name: string; color: string };
}) {
  return (
    <ResponsiveContainer>
      <ComposedChart data={data} margin={{ top: 10, right: 16, bottom: 0, left: -10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={chartPalette.border} vertical={false} />
        <XAxis dataKey={xKey} tick={axisTick} tickLine={false} axisLine={false} />
        <YAxis yAxisId="left" tick={axisTick} tickLine={false} axisLine={false} />
        <YAxis yAxisId="right" orientation="right" tick={axisTick} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={tooltipStyle} />
        <Legend wrapperStyle={{ fontSize: 12 }} iconType="circle" />
        <Bar yAxisId="left" dataKey={bar.key} name={bar.name} fill={bar.color} radius={[6, 6, 0, 0]} />
        <Line yAxisId="right" type="monotone" dataKey={line.key} name={line.name} stroke={line.color} strokeWidth={2.4} dot={{ r: 3 }} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

/* ------------------- 13. STACKED BAR ------------------- */

export function StackedBar({
  data,
  xKey,
  series,
}: {
  data: Array<Record<string, number | string>>;
  xKey: string;
  series: Array<{ key: string; name: string; color: string }>;
}) {
  return (
    <ResponsiveContainer>
      <BarChart data={data} margin={{ top: 4, right: 16, bottom: 0, left: -10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={chartPalette.border} vertical={false} />
        <XAxis dataKey={xKey} tick={axisTick} tickLine={false} axisLine={false} />
        <YAxis tick={axisTick} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={tooltipStyle} />
        <Legend wrapperStyle={{ fontSize: 12 }} iconType="circle" />
        {series.map((s, i) => (
          <Bar key={s.key} dataKey={s.key} name={s.name} fill={s.color} stackId="a" radius={i === series.length - 1 ? [6, 6, 0, 0] : 0} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

/* ------------------- 14. SIMPLE BAR ------------------- */

export function SimpleBar({
  data,
  xKey,
  yKey,
  color = chartPalette.accent,
}: {
  data: Array<Record<string, number | string>>;
  xKey: string;
  yKey: string;
  color?: string;
}) {
  return (
    <ResponsiveContainer>
      <BarChart data={data} margin={{ top: 4, right: 16, bottom: 0, left: -10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={chartPalette.border} vertical={false} />
        <XAxis dataKey={xKey} tick={axisTick} tickLine={false} axisLine={false} />
        <YAxis tick={axisTick} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={tooltipStyle} />
        <Bar dataKey={yKey} fill={color} radius={[6, 6, 0, 0]}>
          {data.map((_, i) => (
            <Cell key={i} fill={color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

/* ------------------- 15. DISTRIBUTION DOTS (jittered) ------------------- */

export function DistributionStrip({
  data,
  groupKey,
  valueKey,
  unit = "",
}: {
  data: Array<Record<string, number | string>>;
  groupKey: string;
  valueKey: string;
  unit?: string;
}) {
  const groups = Array.from(new Set(data.map((d) => String(d[groupKey]))));
  const points: Array<Record<string, number | string>> = data.map((d, idx) => {
    const group = String(d[groupKey]);
    const groupIdx = groups.indexOf(group);
    return {
      ...d,
      groupIdx: groupIdx + Math.sin(idx * 13.37) * 0.3,
      label: (d.label ?? d.nama_wilayah ?? "") as string | number,
    };
  });

  return (
    <ResponsiveContainer>
      <ScatterChart margin={{ top: 10, right: 16, bottom: 16, left: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={chartPalette.border} horizontal vertical={false} />
        <XAxis
          type="number"
          dataKey="groupIdx"
          ticks={groups.map((_, i) => i)}
          tickFormatter={(v) => groups[Math.round(Number(v))] ?? ""}
          tick={{ fontSize: 11, fill: chartPalette.foreground }}
          domain={[-0.5, groups.length - 0.5]}
          axisLine={false}
          tickLine={false}
        />
        <YAxis type="number" dataKey={valueKey} tick={axisTick} tickLine={false} axisLine={false} unit={unit} />
        <Tooltip contentStyle={tooltipStyle} />
        {groups.map((g, i) => (
          <Scatter
            key={g}
            name={g}
            data={points.filter((p) => String(p[groupKey]) === g)}
            fill={getClusterColor(g, i)}
            fillOpacity={0.75}
          />
        ))}
      </ScatterChart>
    </ResponsiveContainer>
  );
}

/* Backward-compat exports */
export function TrendChart(props: {
  title: string;
  data: Array<Record<string, number | string>>;
  lines: Array<{ dataKey: string; name: string; color: string }>;
  xKey: string;
}) {
  return (
    <ChartFrame title={props.title}>
      <KPITrendLine
        data={props.data}
        xKey={props.xKey}
        lines={props.lines.map((l) => ({ key: l.dataKey, name: l.name, color: l.color }))}
      />
    </ChartFrame>
  );
}

export function RankingChart(props: {
  title: string;
  data: Array<Record<string, number | string>>;
  xKey: string;
  yKey: string;
  barColor?: string;
}) {
  return (
    <ChartFrame title={props.title} height="h-80">
      <RankingBar data={props.data} xKey={props.xKey} yKey={props.yKey} color={props.barColor ?? "gradient"} />
    </ChartFrame>
  );
}
