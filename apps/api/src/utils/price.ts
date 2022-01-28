let formatter = {
  currency: new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'sek',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }),
  withoutCurrency: new Intl.NumberFormat(undefined, {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }),
};

export function formatCents(value: number, withCurrency: boolean = false) {
  if (withCurrency) return formatter.currency.format(fromCents(value));
  return formatter.withoutCurrency.format(fromCents(value));
}

export function fromCents(value: number) {
  return value / 100;
}

export function toCents(value: number | string): number {
  if (typeof value === 'number') return value * 100;

  let cleanValue = value.trim().replace(/\s/g, '').replace(',', '.').split('.').slice(0, 2).join('.');
  let num = Number(cleanValue);

  if (Number.isNaN(num)) {
    throw new Error('Can not parse number');
  }

  return toCents(num);
}
