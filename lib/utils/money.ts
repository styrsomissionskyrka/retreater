export function toCents(value: number) {
  return Number(value.toFixed(2)) * 100;
}

export function fromCents(value: number) {
  return value / 100;
}

export function formatMoney(cents: number, currency: string) {
  let formatter = new Intl.NumberFormat(undefined, { style: 'currency', currency });
  return formatter.format(fromCents(cents));
}

export function formatCents(cents: number) {
  let formatter = new Intl.NumberFormat(undefined, { style: 'decimal', minimumFractionDigits: 2 });
  return formatter.format(fromCents(cents));
}
