import { __ } from '@wordpress/i18n';
import { useState } from 'react';
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

  return (
    <PostBox title={__('Price', 'smk')}>
      <div>
        <Table>
          <TableRadioGroupRow
            label={__('Strategy', 'smk')}
            name="mode"
            value={mode}
            options={[
              { value: 'retreat', label: __('Use retreat price', 'smk') },
              { value: 'custom', label: __('Use custom price', 'smk') },
              { value: 'no_payment', label: __('No payment', 'smk') },
            ]}
            onChange={(e) => setMode(e.currentTarget.value as any)}
          />
          <TableInputRow
            label={__('Price', 'smk')}
            type="text"
            inputMode="decimal"
            id="proxy_booking_price"
            name="proxy_booking_price[amount]"
            disabled={mode !== 'custom'}
            {...priceInput}
          />
        </Table>

        {mode === 'custom' ? <input type="hidden" name="booking_price[amount]" value={cents} /> : null}
      </div>
    </PostBox>
  );
};

const PriceSchema = z.object({
  mode: z.enum(['no_payment', 'retreat', 'custom']),
  booking_price: z
    .union([z.number(), z.string()])
    .nullable()
    .transform((x) => (Number.isNaN(Number(x)) || x == null ? null : Number(x))),
  retreat_price: z
    .union([z.number(), z.string()])
    .nullable()
    .transform((x) => (Number.isNaN(Number(x)) || x == null ? null : Number(x))),
});

declare global {
  interface Window {
    SMK_BOOKING_RELATED_PRICE: unknown;
  }
}
