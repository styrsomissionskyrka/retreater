import { styled } from 'styles/stitches.config';
import { OrderStatusEnum, RetreatStatusEnum } from 'lib/graphql';

export const StatusIndicator: React.FC<{ status: RetreatStatusEnum | OrderStatusEnum }> = ({ status }) => {
  return (
    <StatusWrapper>
      <StatusRing status={status} />
    </StatusWrapper>
  );
};

const StatusWrapper = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
});

export const StatusRing = styled('span', {
  disply: 'block',
  size: '$2',
  borderRadius: '100%',
  variants: {
    status: {
      [RetreatStatusEnum.Archived]: {
        backgroundColor: '$gray300',
      },
      [RetreatStatusEnum.Draft]: {
        backgroundColor: '$yellow500',
      },
      [RetreatStatusEnum.Published]: {
        backgroundColor: '$green500',
      },
      [OrderStatusEnum.Cancelled]: {
        backgroundColor: '$gray300',
      },
      [OrderStatusEnum.Confirmed]: {
        backgroundColor: '$green500',
      },
      [OrderStatusEnum.Created]: {
        backgroundColor: '$yellow500',
      },
      [OrderStatusEnum.Declined]: {
        backgroundColor: '$red500',
      },
      [OrderStatusEnum.Errored]: {
        backgroundColor: '$red500',
      },
      [OrderStatusEnum.PartiallyConfirmed]: {
        backgroundColor: '$green500',
      },
      [OrderStatusEnum.Pending]: {
        backgroundColor: '$yellow500',
      },
    },
  },
});
