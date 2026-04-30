export const chartPalette = {
  accent: "#0052ff",
  accentSecondary: "#4d7cff",
  rose: "#f43f5e",
  amber: "#f59e0b",
  emerald: "#10b981",
  violet: "#8b5cf6",
  cyan: "#06b6d4",
  slate: "#64748b",
  foreground: "#0f172a",
  border: "#e2e8f0",
  mutedFg: "#94a3b8",
};

export const clusterColors: Record<string, string> = {
  "Prioritas Tinggi": "#0052ff",
  "Prioritas Sedang": "#4d7cff",
  "Prioritas Rendah": "#94a3b8",
  "Stabil": "#10b981",
  "Rentan": "#f43f5e",
};

export function getClusterColor(label: string, index = 0) {
  if (clusterColors[label]) return clusterColors[label];
  const fallback = ["#0052ff", "#4d7cff", "#10b981", "#f59e0b", "#f43f5e", "#8b5cf6"];
  return fallback[index % fallback.length];
}
