import { forwardRef } from 'react';

import { gql, useQuery, TypedDocumentNode, PriceDropdownQuery, PriceDropdownQueryVariables } from 'lib/graphql';
import { formatProductPrices } from 'lib/utils/price';

import { Spinner } from '../Spinner';
import { SelectProps, Select } from './Controls';

export type PriceDropdownProps = SelectProps & {
  retreatId: string;
};

export const PriceDropdown = forwardRef<HTMLSelectElement, PriceDropdownProps>(({ retreatId, ...props }, ref) => {
  const { data, error } = useQuery(PRICE_DROPDOWN, { variables: { id: retreatId } });

  if (error) return <p>Kunde inte ladda priser</p>;
  if (data == null) return <Spinner />;
  if (data.retreat?.products == null) return <p>Kunde inte ladda priser</p>;

  let options = data.retreat.products.flatMap((p) => formatProductPrices(p));

  return (
    <Select {...props} ref={ref}>
      {options.map(({ value, label }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </Select>
  );
});

PriceDropdown.displayName = 'Form.PriceDropdown';

export const PRICE_DROPDOWN: TypedDocumentNode<PriceDropdownQuery, PriceDropdownQueryVariables> = gql`
  query PriceDropdown($id: ID!) {
    retreat(id: $id) {
      id
      products {
        id
        name
        prices {
          id
          amount
          currency
        }
      }
    }
  }
`;
