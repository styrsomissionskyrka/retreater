import { formatMoney } from './money';

type ProductWithPrice = {
  name?: string | null | undefined;
  prices: {
    id: string;
    amount: number;
    currency: string;
  }[];
};

export function formatProductPrices(product: ProductWithPrice) {
  return product.prices.map((price) => ({
    value: price.id,
    label: `${product.name}, ${formatMoney(price.amount, price.currency)}`,
  }));
}
