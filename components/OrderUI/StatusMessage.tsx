import { Fragment, useEffect } from 'react';

import {
  gql,
  useQuery,
  OrderStatusEnum,
  TypedDocumentNode,
  AdminOrderStatusQuery,
  AdminOrderStatusQueryVariables,
} from 'lib/graphql';
import { format } from 'lib/utils/date-fns';
import { styled } from 'styles/stitches.config';

import { Spinner } from '../Spinner';
import { StatusIndicator } from '../StatusIndicator';

const ORDER_STATUS_QUERY: TypedDocumentNode<AdminOrderStatusQuery, AdminOrderStatusQueryVariables> = gql`
  query AdminOrderStatus($id: ID!) {
    order(id: $id) {
      id
      status
      confirmedAt
      cancelledAt
      updatedAt
    }
  }
`;

export const StatusMessage: React.FC<{ id: string }> = ({ id }) => {
  const { data, loading, stopPolling } = useQuery(ORDER_STATUS_QUERY, {
    variables: { id },
    pollInterval: 5000,
  });

  useEffect(() => {
    if (loading) return;

    const dynamicStatus = [OrderStatusEnum.Created, OrderStatusEnum.Pending];
    if (data?.order != null && !dynamicStatus.includes(data.order.status)) {
      stopPolling();
    }
  }, [data, loading, stopPolling]);

  if (data?.order == null) return <Spinner size={16} />;

  let order = data.order;

  let message: React.ReactNode = null;

  switch (order.status) {
    case OrderStatusEnum.Confirmed:
    case OrderStatusEnum.PartiallyConfirmed:
      message = (
        <Fragment>
          Bokningen är bekräftad och betald ({format(order.confirmedAt ?? order.updatedAt, 'yyyy-MM-dd HH:mm')}).
        </Fragment>
      );
      break;

    case OrderStatusEnum.Cancelled:
      message = (
        <Fragment>Bokningen är avbruten ({format(order.cancelledAt ?? order.updatedAt, 'yyyy-MM-dd HH:mm')}).</Fragment>
      );
      break;

    case OrderStatusEnum.Created:
    case OrderStatusEnum.Pending:
      message = 'Bokningen är skapad och inväntar betalning.';
      break;

    case OrderStatusEnum.Declined:
      message = 'Betalningen har inte gått igenom.';
      break;

    case OrderStatusEnum.Errored:
      message = 'Något har gått snett med ordern. Se information längre ner.';
  }

  return (
    <Message>
      <StatusIndicator status={order.status} />
      <span>{message}</span>
    </Message>
  );
};

const Message = styled('p', { text: '$sm', spaceX: '$2' });
