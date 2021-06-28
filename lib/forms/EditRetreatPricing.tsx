import { useMemo, useState, useCallback } from 'react';
import { RenderExpandedRow, Row } from 'react-table';

import {
  gql,
  EditRetreatPricingFieldsFragment,
  EditRetreatProductFieldsFragment,
  UpdateProductMutation,
  UpdateProductMutationVariables,
  UpdateProductPriceMutation,
  UpdateProductPriceMutationVariables,
  UpdateProductStateMutation,
  UpdateProductStateMutationVariables,
  useMutation,
  TypedDocumentNode,
} from 'lib/graphql';
import { Form, BrowserOnly, DataTable, Spinner, ToggleButton, Link } from 'lib/components';
import { formatCents, toCents } from 'lib/utils/money';

interface EditPricingProps {
  retreat: EditRetreatPricingFieldsFragment;
}

interface ColumnData extends EditRetreatProductFieldsFragment {
  amount: number;
  currency: string;
}

export const EditRetreatPricing: React.FC<EditPricingProps> = ({ retreat }) => {
  let { products } = retreat;

  const data: ColumnData[] = useMemo<ColumnData[]>(
    () =>
      products.map((product) => ({
        ...product,
        amount: product.prices[0]?.amount ?? 0,
        currency: product.prices[0]?.currency ?? 'SEK',
      })),
    [products],
  );

  const columns = useMemo<DataTable.Column<ColumnData>[]>(
    () => [
      { accessor: 'name', Header: 'Namn', Cell: NameCell },
      { accessor: 'amount', Header: 'Pris', Cell: PriceCell },
      { accessor: 'active', Header: 'Aktiv', Cell: ActiveCell },
    ],
    [],
  );

  const renderExpandedRow: RenderExpandedRow<ColumnData> = useCallback((row) => <DescriptionCell {...row} />, []);

  return (
    <DataTable.Provider
      data={data}
      columns={columns}
      renderExpandedRow={renderExpandedRow}
      hooks={[DataTable.Plugins.useExpanded]}
    >
      <DataTable.Layout>
        <DataTable.Table>
          <DataTable.Head />
          <DataTable.Body />
        </DataTable.Table>
      </DataTable.Layout>
    </DataTable.Provider>
  );
};

export const EDIT_RETREAT_PRICE_FIELDS = gql`
  fragment EditRetreatPriceFields on Price {
    id
    amount
    currency
  }
`;

export const EDIT_RETREAT_PRODUCT_FIELDS = gql`
  fragment EditRetreatProductFields on Product {
    id
    active
    name
    description
    prices(active: true) {
      ...EditRetreatPriceFields
    }
  }

  ${EDIT_RETREAT_PRICE_FIELDS}
`;

export const EDIT_RETREAT_PRICING_FIELDS = gql`
  fragment EditRetreatPricingFields on Retreat {
    id
    products {
      ...EditRetreatProductFields
    }
  }

  ${EDIT_RETREAT_PRODUCT_FIELDS}
`;

export const UPDATE_PRODUCT: TypedDocumentNode<UpdateProductMutation, UpdateProductMutationVariables> = gql`
  mutation UpdateProduct($id: ID!, $name: String, $description: String) {
    updateProduct(id: $id, input: { name: $name, description: $description }) {
      ...EditRetreatProductFields
    }
  }

  ${EDIT_RETREAT_PRODUCT_FIELDS}
`;

const NameCell: DataTable.Renderer<DataTable.CellProps<ColumnData, string | null>> = ({ row, value }) => {
  const [updateName, { loading }] = useMutation(UPDATE_PRODUCT);

  const handleUpdateName = (next: string) => {
    if (loading) return;
    if (next !== value && next.length > 0) {
      updateName({ variables: { id: row.original.id, name: next } });
    }
  };

  const handleBlur: React.FocusEventHandler<HTMLInputElement> = (event) => {
    handleUpdateName(event.currentTarget.value);
  };

  let handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleUpdateName(event.currentTarget.value);
    }
  };

  return (
    <Form.Input
      type="text"
      defaultValue={value ?? ''}
      disabled={loading || !row.original.active}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      aria-label={`Namn för ${row.original.name ?? row.original.id}`}
    />
  );
};

export const UPDATE_PRODUCT_PRICE: TypedDocumentNode<
  UpdateProductPriceMutation,
  UpdateProductPriceMutationVariables
> = gql`
  mutation UpdateProductPrice($productId: ID!, $input: CreatePriceInput!) {
    updateProductPrice(input: $input, productId: $productId) {
      ...EditRetreatPriceFields
    }
  }

  ${EDIT_RETREAT_PRICE_FIELDS}
`;

const PriceCell: DataTable.Renderer<DataTable.CellProps<ColumnData, unknown>> = ({ row }) => {
  const [error, setError] = useState<string | null>(null);
  const [controlledValue, setControlledValue] = useState(formatCents(row.original.amount));

  const [updatePrice, { loading }] = useMutation(UPDATE_PRODUCT_PRICE, { refetchQueries: ['EditRetreatForm'] });

  let handleUpdatePrice = (value: string) => {
    if (loading) return;

    let clean = value.replace(/,/g, '.').replace(/\s/g, '');
    while (clean.split('').filter((char) => char === '.').length > 1) {
      clean = clean.replace('.', '');
    }
    let parsed = Number(clean);
    if (Number.isNaN(parsed)) {
      setError('Priset är inte korrekt formaterat.');
    } else {
      let amount = toCents(parsed);
      let formatted = formatCents(amount);
      setControlledValue(formatted);
      setError(null);
      if (row.original.amount !== amount) {
        updatePrice({ variables: { productId: row.original.id, input: { amount, currency: 'sek' } } });
      }
    }
  };

  let handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setControlledValue(event.currentTarget.value.replace(/[a-zA-Z]/g, ''));
  };

  let handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleUpdatePrice(event.currentTarget.value);
    }
  };

  let handleBlur: React.FocusEventHandler<HTMLInputElement> = (event) => handleUpdatePrice(event.currentTarget.value);

  return (
    <BrowserOnly>
      <Form.Input
        name="amount"
        type="text"
        inputMode="decimal"
        aria-label={`Pris för ${row.original.name ?? row.original.id}`}
        suffix={loading ? <Spinner size={16} /> : row.original.currency.toUpperCase()}
        align="right"
        value={controlledValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        error={error}
        disabled={!row.original.active}
      />
    </BrowserOnly>
  );
};

export const UPDATE_PRODUCT_STATUS: TypedDocumentNode<
  UpdateProductStateMutation,
  UpdateProductStateMutationVariables
> = gql`
  mutation UpdateProductState($id: ID!, $active: Boolean!) {
    updateProduct(id: $id, input: { active: $active }) {
      ...EditRetreatProductFields
    }
  }

  ${EDIT_RETREAT_PRODUCT_FIELDS}
`;

const ActiveCell: DataTable.Renderer<DataTable.CellProps<ColumnData, boolean>> = ({ row, value }) => {
  const [updateStatus, { loading }] = useMutation(UPDATE_PRODUCT_STATUS);
  return (
    <ToggleButton
      checked={value}
      pending={loading}
      aria-label="Aktiv"
      onChange={(event) => updateStatus({ variables: { id: row.original.id, active: event.target.checked } })}
    />
  );
};

const DescriptionCell: React.FC<Row<ColumnData>> = ({ original }) => {
  const initialValue = original.description ?? '';
  const [updateDescription, { loading }] = useMutation(UPDATE_PRODUCT);

  const handleUpdateName = (next: string) => {
    if (loading) return;
    if (next !== initialValue && next.length > 0) {
      updateDescription({ variables: { id: original.id, description: next } });
    }
  };

  const handleBlur: React.FocusEventHandler<HTMLTextAreaElement> = (event) => {
    handleUpdateName(event.currentTarget.value);
  };

  return (
    <div className="flex w-full">
      <div className="w-1/3">
        <Form.Textarea
          defaultValue={initialValue}
          placeholder="Beskrivning"
          aria-label={`Beskrivning av ${original.name ?? original.id}`}
          onBlur={handleBlur}
          disabled={loading || !original.active}
        />
      </div>

      <div className="ml-auto flex flex-col space-y-2 pr-10 justify-end">
        <Link
          href={`https://dashboard.stripe.com/test/products/${original.id}`}
          target="_blank"
          className="text-blue-500 hover:text-blue-700"
        >
          Visa produkten i Stripe
        </Link>
      </div>
    </div>
  );
};
