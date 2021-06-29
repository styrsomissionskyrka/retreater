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

export function parsePriceInput(value: string): { amount: number; formatted: string } | null {
  let clean = value.replace(/,/g, '.').replace(/\s/g, '');
  while (clean.split('').filter((char) => char === '.').length > 1) {
    clean = clean.replace('.', '');
  }
  let parsed = Number(clean);
  if (Number.isNaN(parsed)) {
    return null;
  } else {
    let amount = toCents(parsed);
    let formatted = formatCents(amount);
    return { amount, formatted };
  }
}
