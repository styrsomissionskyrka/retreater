import { __ } from '@wordpress/i18n';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import * as z from 'zod';

import { PublishRow, PublishSection } from '../PublishSection';
import { useExistingPortal } from './utils';

interface PublishProps {
  status: unknown;
}

export const Publish: React.FC<PublishProps> = ({ status }) => {
  const portal = useExistingPortal('minor-publishing');
  if (portal == null) return null;

  return createPortal(
    <PublishSection>
      <RelatedRetreat />
      <Status value={status} />
    </PublishSection>,
    portal,
  );
};

type StatusType = 'booking_created' | 'booking_pending' | 'booking_confirmed' | 'booking_cancelled';

const isStatus = (value: unknown): value is StatusType => {
  return (
    typeof value === 'string' &&
    ['booking_created', 'booking_pending', 'booking_confirmed', 'booking_cancelled'].includes(value)
  );
};

const statusLabels: Record<StatusType, string> = {
  booking_created: __('Created', 'smk'),
  booking_pending: __('Pending', 'smk'),
  booking_confirmed: __('Confirmed', 'smk'),
  booking_cancelled: __('Cancelled', 'smk'),
};

export const Status: React.FC<{ value: unknown }> = ({ value: initialValue }) => {
  const [value, setValue] = useState(isStatus(initialValue) ? initialValue : 'booking_created');

  return (
    <PublishRow
      name="status"
      value={value}
      onChange={(e) => {
        if (isStatus(e.currentTarget.value)) setValue(e.currentTarget.value);
      }}
      options={Object.entries(statusLabels).map(([value, label]) => ({ value, label }))}
      label={__('Status', 'smk')}
    />
  );
};

const RelatedRetreat: React.FC = () => {
  const data = RelatedRetreatSchema.parse(window.SMK_BOOKING_RELATED_RETREAT);
  const [value, setValue] = useState(data.retreat?.id ?? null);

  return (
    <PublishRow
      name="retreat_id"
      value={value?.toString() ?? ''}
      onChange={(e) => setValue(Number(e.currentTarget.value))}
      options={data.retreats.map((r) => ({ value: r.id.toString(), label: r.title }))}
      label={__('Retreat', 'smk')}
    />
  );
};

const RelatedRetreatSchema = z.object({
  retreat: z.object({ id: z.number(), title: z.string() }).nullable(),
  retreats: z.array(z.object({ id: z.number(), title: z.string() })),
});

declare global {
  interface Window {
    SMK_BOOKING_RELATED_RETREAT: unknown;
  }
}
