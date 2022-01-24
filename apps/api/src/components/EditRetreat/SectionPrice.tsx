import { useState, useEffect } from 'react';
import { PanelBody, PanelRow, TextControl } from '@wordpress/components';
import { __, sprintf } from '@wordpress/i18n';

import { useRetreatAttribute, useRetreatMeta, SetState } from '../../utils/data';

export const SectionPrice: React.FC = () => {
  let [price, setPrice] = useRetreatAttribute('stripe_price');
  let [meta] = useRetreatMeta();

  return (
    <PanelBody title={__('Price', 'smk')} initialOpen>
      <PanelRow>
        <PriceControl
          label={__('Price', 'smk')}
          value={price}
          onBlur={setPrice}
          help={sprintf(__('Price id: %s', 'smk'), meta.stripe_price_id ?? '')}
        />
      </PanelRow>
    </PanelBody>
  );
};

interface PriceControlProps {
  value: number;
  label: React.ReactNode;
  help?: React.ReactNode;
  onBlur: SetState<number>;
}

const PriceControl: React.FC<PriceControlProps> = ({ value, label, help, onBlur }) => {
  let [state, setState] = useState(() => formatCents(value));

  useEffect(() => {
    setState(formatCents(value));
  }, [value]);

  return (
    <TextControl
      name="price"
      value={state}
      inputMode="numeric"
      label={label}
      help={help}
      onChange={(value) => setState(value)}
      onBlur={() => {
        try {
          let next = toCents(state);
          onBlur(next);
        } catch (error) {
          // Handle error
        }
      }}
    />
  );
};

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

function formatCents(value: number, withCurrency: boolean = false) {
  if (withCurrency) return formatter.currency.format(fromCents(value));
  return formatter.withoutCurrency.format(fromCents(value));
}

function fromCents(value: number) {
  return value / 100;
}

function toCents(value: number | string): number {
  if (typeof value === 'number') return value * 100;

  let cleanValue = value.trim().replace(/\s/g, '').replace(',', '.').split('.').slice(0, 2).join('.');
  let num = Number(cleanValue);

  if (Number.isNaN(num)) {
    throw new Error('Can not parse number');
  }

  return toCents(num);
}
