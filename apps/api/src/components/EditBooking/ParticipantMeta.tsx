import { __ } from '@wordpress/i18n';
import * as z from 'zod';

import { Table, TableInputRow } from '../FormTable';
import { PostBox } from '../PostBox';

const BookingMetaSchema = z.object({
  name: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  address: z
    .object({
      street: z.string().nullable().optional(),
      postal: z.string().nullable().optional(),
      city: z.string().nullable().optional(),
    })
    .nullable()
    .optional(),
});

function getBookingMetadata() {
  let result = BookingMetaSchema.safeParse(window.SMK_BOOKING_META);
  if (result.success) return result.data;
  return {};
}

type MetaInput = {
  value?: string | null;
  label: string;
  name: string;
  type?: string;
};

let meta = getBookingMetadata();
let inputs: MetaInput[] = [
  {
    value: meta.name,
    label: __('Name', 'smk'),
    name: '[name]',
  },
  {
    value: meta.email,
    label: __('E-mail', 'smk'),
    name: '[email]',
    type: 'email',
  },
  {
    value: meta.phone,
    label: __('Phone', 'smk'),
    name: '[phone]',
    type: 'tel',
  },
  {
    value: meta.address?.street,
    label: __('Street', 'smk'),
    name: '[address][street]',
  },
  {
    value: meta.address?.postal,
    label: __('Zip code', 'smk'),
    name: '[address][postal]',
  },
  {
    value: meta.address?.city,
    label: __('City', 'smk'),
    name: '[address][city]',
  },
];

export const ParticipantMeta: React.FC = () => {
  return (
    <PostBox title={__('Participant', 'smk')}>
      <Table>
        {inputs.map((input) => (
          <TableInputRow
            key={input.name}
            label={input.label}
            type={input.type ?? 'text'}
            name={`booking_meta${input.name}`}
            defaultValue={input.value ?? ''}
          />
        ))}
      </Table>
    </PostBox>
  );
};

declare global {
  interface Window {
    SMK_BOOKING_META: unknown;
  }
}
