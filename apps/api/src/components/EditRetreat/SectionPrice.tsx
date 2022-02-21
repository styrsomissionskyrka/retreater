import { PanelBody, PanelRow, TextControl } from '@wordpress/components';
import { __, sprintf } from '@wordpress/i18n';

import { usePriceInput } from '../../hooks/use-price-input';
import { SetState, useRetreatAttribute, useRetreatMeta } from '../../utils/data';

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
  let props = usePriceInput(value, onBlur);

  return (
    <TextControl
      name="price"
      // value={state}
      inputMode="numeric"
      label={label}
      help={help}
      {...props}
    />
  );
};
