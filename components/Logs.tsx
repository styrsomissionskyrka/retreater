import { IconRefresh } from '@tabler/icons';

import { gql, TypedDocumentNode, LogsQuery, LogsQueryVariables, useQuery, LogEventEnum } from 'lib/graphql';
import { format, formatISO } from 'lib/utils/date-fns';

import { LoadingButton } from './Button';
import { Spinner } from './Spinner';
import { Time } from './Time';

export const Logs: React.FC<{ id: string }> = ({ id }) => {
  const { data } = useQuery(LOGS_QUERY, { variables: { id } });
  let logs = data?.logs ?? [];

  return (
    <div>
      <ul>
        {logs.map((log) => (
          <li key={log.id}>
            <Time dateTime={formatISO(log.createdAt)}>{format(log.createdAt, 'yyyy-MM-dd HH:mm:ss')}</Time>:{' '}
            {getMessage(log.event)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export const RefetchLogs: React.FC<{ id: string }> = ({ id }) => {
  const { refetch } = useQuery(LOGS_QUERY, { variables: { id } });

  return (
    <LoadingButton
      square
      size="normal"
      onClick={refetch}
      iconStart={<IconRefresh size={16} />}
      spinner={<Spinner as={IconRefresh} size={16} reverse />}
      aria-label="Uppdatera loggar"
    />
  );
};

export const LOGS_QUERY: TypedDocumentNode<LogsQuery, LogsQueryVariables> = gql`
  query Logs($id: ID!) {
    logs(id: $id) {
      id
      createdAt
      event
      item {
        __typename
      }
    }
  }
`;

function getMessage(event: LogEventEnum): React.ReactNode {
  switch (event) {
    /**
     * Order events
     */
    case LogEventEnum.OrderCheckoutCompleted:
      return 'Betalning avlustad och avklarad.';

    case LogEventEnum.OrderCheckoutInit:
      return 'Betalning påbörjad.';

    case LogEventEnum.OrderCreated:
      return 'Bokning skapad.';

    case LogEventEnum.OrderMetadataUpdated:
      return 'Bokningsinformation uppdaterad.';

    case LogEventEnum.OrderStatusUpdated:
      return 'Bokningens status har uppdaterats.';

    /**
     * Retreat events
     */
    case LogEventEnum.RetreatArchived:
      return 'Retreaten har arkiverats.';

    case LogEventEnum.RetreatCreated:
      return 'Retreaten har skapats.';

    case LogEventEnum.RetreatPriceCreated:
      return 'Nytt pris har lagts till.';

    case LogEventEnum.RetreatPriceUpdated:
      return 'Ett pris har uppdaterats.';

    case LogEventEnum.RetreatPublished:
      return 'Retreaten har publicerats.';

    case LogEventEnum.RetreatUnpublished:
      return 'Retreaten har avpublicerats.';

    case LogEventEnum.RetreatUpdated:
      return 'Retreaten har uppdaterats.';

    default:
      return '';
  }
}
