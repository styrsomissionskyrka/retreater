import { useState, Fragment } from 'react';
import { render } from 'react-dom';
import { __ } from '@wordpress/i18n';
import * as z from 'zod';

import { Table, TableInputRow } from './components/FormTable';
import { PostBox } from './components/PostBox';

const Title: React.FC<{ value: string }> = ({ value }) => {
  return (
    <div id="titlewrap">
      <label className="screen-reader-text" id="title-prompt-text" htmlFor="title">
        {__('Booking id', 'smk')}
      </label>
      <input
        type="text"
        name="post_title"
        size={30}
        value={value}
        id="title"
        spellCheck="true"
        autoComplete="off"
        readOnly
      />
    </div>
  );
};

let title = document.querySelector<HTMLInputElement>('[name="post_title"]')?.value ?? '';
render(<Title value={title} />, document.getElementById('titlewrap'));

const Status: React.FC<{ value: string }> = ({ value: initialValue }) => {
  const [value, setValue] = useState(initialValue);
  return (
    <div id="misc-publishing-actions">
      <div className="misc-pub-section">
        <div id="post-status-select" className="hide-if-js" style={{ display: 'block' }}>
          <input type="hidden" name="hidden_post_status" id="hidden_post_status" value={value} />
          <label htmlFor="post_status" className="screen-reader-text">
            {__('Set status', 'smk')}
          </label>
          <select name="post_status" id="post_status" value={value} onChange={(e) => setValue(e.currentTarget.value)}>
            <option value="draft">{__('Queued', 'smk')}</option>
            <option value="pending">{__('Payment pending', 'smk')}</option>
            <option value="publish">{__('Confirmed', 'smk')}</option>
          </select>
        </div>
      </div>
    </div>
  );
};

let status = document.querySelector<HTMLSelectElement>('[name="post_status"]')?.value ?? 'draft';
render(<Status value={status} />, document.getElementById('minor-publishing'));

const Save: React.FC = () => {
  return (
    <Fragment>
      <div id="publishing-action">
        <button type="submit" className="button button-primary button-large">
          {__('Save', 'smk')}
        </button>
      </div>
      <div className="clear"></div>
    </Fragment>
  );
};

render(<Save />, document.getElementById('major-publishing-actions'));

const BookingMetaScheme = z.object({
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
  let result = BookingMetaScheme.safeParse((window as any).SMK_BOOKING_META);
  if (result.success) return result.data;
  return {};
}

type MetaInput = {
  value?: string | null;
  label: string;
  name: string;
  type?: string;
};

let initialContent = document.querySelector<HTMLTextAreaElement>('[name="content"]')?.value ?? '';
const Meta: React.FC = () => {
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

  return (
    <Fragment>
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

      <PostBox title={__('Comment', 'smk')}>
        <div style={{ display: 'flex', flexFlow: 'column nowrap', marginTop: 12 }}>
          <label htmlFor="comments">{__('Comment', 'smk')}</label>
          <textarea
            name="content"
            id="comments"
            defaultValue={initialContent}
            rows={10}
            style={{ padding: 12, marginTop: 8 }}
          />
        </div>
      </PostBox>
    </Fragment>
  );
};

render(<Meta />, document.getElementById('postdivrich'));
