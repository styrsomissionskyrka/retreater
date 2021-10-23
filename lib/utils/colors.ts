import { OrderStatusEnum, RetreatStatusEnum } from '../graphql';

export const statusColorMap: Record<RetreatStatusEnum | OrderStatusEnum, string> = {
  [RetreatStatusEnum.Archived]: 'bg-gray-300',
  [RetreatStatusEnum.Draft]: 'bg-yellow-500',
  [RetreatStatusEnum.Published]: 'bg-green-500',

  [OrderStatusEnum.Cancelled]: 'bg-gray-300',
  [OrderStatusEnum.Confirmed]: 'bg-green-500',
  [OrderStatusEnum.Created]: 'bg-yellow-500',
  [OrderStatusEnum.Declined]: 'bg-orange-500',
  [OrderStatusEnum.Errored]: 'bg-red-500',
  [OrderStatusEnum.PartiallyConfirmed]: 'bg-green-500',
  [OrderStatusEnum.Pending]: 'bg-yellow-500',
};
