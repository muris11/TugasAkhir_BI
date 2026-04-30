export function formatAngka(value: number, digits = 2): string {
  return new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}

export function formatPersen(value: number, digits = 2): string {
  return `${formatAngka(value, digits)}%`;
}
