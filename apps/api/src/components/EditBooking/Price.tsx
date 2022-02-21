import { __, sprintf } from '@wordpress/i18n';
import { Fragment, useState } from 'react';
import * as z from 'zod';

import { usePriceInput } from '../../hooks/use-price-input';
import { Table, TableInputRow, TableRadioGroupRow } from '../FormTable';
import { PostBox } from '../PostBox';

export const Price: React.FC = () => {
  let data = PriceSchema.parse(window.SMK_BOOKING_RELATED_PRICE);

  let [mode, setMode] = useState<typeof data.mode>(data.mode);
  let [cents, setCents] = useState(() => {
    if (mode === 'custom') return data.booking_price ?? 0;
    return 0;
  });

  let inputValue = mode === 'custom' ? cents : mode === 'retreat' ? data.retreat_price : 0;
  const priceInput = usePriceInput(inputValue ?? 0, setCents);

  let strategyDescription: React.ReactNode = null;
  if (data.status === 'paid') {
    strategyDescription = __("Retreat is already paid. The price can't be changed after that.", 'smk');
  }

  let priceDescription: React.ReactNode = null;
  if (data.payment_intent != null) {
    priceDescription = (
      <a href={`https://dashboard.stripe.com/test/payments/${data.payment_intent}`}>
        {__("Manage refunds and more on Stripe's dashboard.", 'smk')}
      </a>
    );
  }

  return (
    <PostBox title={__('Price', 'smk')}>
      <div>
        <Table>
          <TableRadioGroupRow
            label={__('Strategy', 'smk')}
            name="booking_price[mode]"
            value={mode}
            options={[
              { value: 'retreat', label: __('Use retreat price', 'smk') },
              { value: 'custom', label: __('Use custom price', 'smk') },
              { value: 'no_payment', label: __('No payment', 'smk') },
            ]}
            onChange={(e) => setMode(e.currentTarget.value as any)}
            disabled={data.status === 'paid'}
            description={strategyDescription}
          />
          <TableInputRow
            label={__('Price', 'smk')}
            type="text"
            inputMode="decimal"
            id="proxy_booking_price"
            name="proxy_booking_price[amount]"
            disabled={mode !== 'custom' || data.status === 'paid'}
            description={priceDescription}
            {...priceInput}
          />
        </Table>

        {mode === 'custom' ? <input type="hidden" name="booking_price[amount]" value={cents} /> : null}
        <input type="hidden" name="booking_price[status]" value={data.status} />
      </div>
    </PostBox>
  );
};

const PriceSchema = z.object({
  mode: z.enum(['no_payment', 'retreat', 'custom']),
  status: z.enum(['paid', 'unpaid', 'no_payment_required']),
  booking_price: z
    .union([z.number(), z.string()])
    .nullable()
    .transform((x) => (Number.isNaN(Number(x)) || x == null ? null : Number(x))),
  retreat_price: z
    .union([z.number(), z.string()])
    .nullable()
    .transform((x) => (Number.isNaN(Number(x)) || x == null ? null : Number(x))),
  payment_intent: z.string().nullable().optional(),
});

declare global {
  interface Window {
    SMK_BOOKING_RELATED_PRICE: unknown;
  }
}
