import { IconX } from '@tabler/icons';

import { Button } from 'lib/components';
import { gql, EditRetreatPricingFieldsFragment } from 'lib/graphql';

interface EditPricingProps {
  retreat: EditRetreatPricingFieldsFragment;
}

export const EditRetreatPricing: React.FC<EditPricingProps> = ({ retreat }) => {
  let { registrationFee, products } = retreat;

  return (
    <ul>
      {products.map((product) => (
        <li key={product.id}>
          <h2>{product.name ?? product.id}</h2>
          <Button size="square-small" variant="outline" iconEnd={<IconX size={16} />} />
        </li>
      ))}
    </ul>
  );
};

export const EDIT_RETREAT_PRODUCT_FIELDS = gql`
  fragment EditRetreatProductFields on Product {
    id
    name
    description
    prices {
      id
      amount
      nickname
    }
  }
`;

export const EDIT_RETREAT_PRICING_FIELDS = gql`
  fragment EditRetreatPricingFields on Retreat {
    id
    registrationFee {
      ...EditRetreatProductFields
    }
    products(active: true) {
      ...EditRetreatProductFields
    }
  }

  ${EDIT_RETREAT_PRODUCT_FIELDS}
`;
