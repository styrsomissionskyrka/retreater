import classNames from 'classnames';

import { OrderStatusEnum, RetreatStatusEnum } from 'lib/graphql';

export type StatusProps = {
  status: RetreatStatusEnum | OrderStatusEnum;
};

export const STATUS_COLOR_MAP: Record<RetreatStatusEnum | OrderStatusEnum, string> = {
  [RetreatStatusEnum.Archived]: 'bg-gray-300',
  [RetreatStatusEnum.Draft]: 'bg-yellow-500',
  [RetreatStatusEnum.Published]: 'bg-green-500',
  [OrderStatusEnum.Cancelled]: 'bg-gray-300',
  [OrderStatusEnum.Confirmed]: 'bg-green-500',
  [OrderStatusEnum.Created]: 'bg-yellow-500',
  [OrderStatusEnum.Declined]: 'bg-red-500',
  [OrderStatusEnum.Errored]: 'bg-red-500',
  [OrderStatusEnum.PartiallyConfirmed]: 'bg-green-500',
  [OrderStatusEnum.Pending]: 'bg-yellow-500',
};

export const StatusIndicator: React.FC<StatusProps> = ({ status }) => {
  return (
    <span className="inline-flex items-center justify-center text-center">
      <StatusRing status={status} />
    </span>
  );
};

export const StatusRing: React.FC<StatusProps> = ({ status }) => {
  return <span className={classNames('inline-block w-2 h-2 rounded-full', STATUS_COLOR_MAP[status])} />;
};
