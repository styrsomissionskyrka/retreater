import { useState } from 'react';
import { createPortal } from 'react-dom';
import { sprintf, __ } from '@wordpress/i18n';

import { useExistingPortal } from './utils';

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

interface PublishProps {
  status: unknown;
}

export const Publish: React.FC<PublishProps> = ({ status }) => {
  const portal = useExistingPortal('minor-publishing');

  if (portal == null) return null;

  return createPortal(
    <div className="publish-section">
      <Status value={status} />
    </div>,
    portal,
  );
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

interface PublishRowProps {
  name: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLSelectElement>;
  options: { value: string; label: React.ReactNode }[];
  label: string;
}

const PublishRow: React.FC<PublishRowProps> = ({ name, value, onChange, options, label }) => {
  const [state, setState] = useState<'idle' | 'edit'>('idle');

  let currentValueLabel = options.find((o) => o.value === value);

  return (
    <div className={`misc-pub-section publish-row publish-row-${name}`}>
      <input type="hidden" name={`hidden_post_${name}`} id={`hidden_post_${name}`} value={value} />
      <input type="hidden" name={`post_${name}`} id={`post_${name}`} value={value} />
      {label}: <span style={{ fontWeight: 600 }}>{currentValueLabel?.label ?? '-'}</span>{' '}
      <button type="button" onClick={() => setState('edit')}>
        <span aria-hidden="true">{__('Edit', 'smk')}</span>
        <span className="screen-reader-text">{sprintf(__('Edit %s', 'smk'), label)}</span>
      </button>
      {state === 'edit' ? (
        <div style={{ marginTop: 3 }}>
          <label htmlFor={`proxy_post_${name}`} className="screen-reader-text">
            {sprintf(__('Set %s', 'smk'), label.toLowerCase())}
          </label>
          <select name={`proxy_post_${name}`} id={`proxy_post_${name}`} value={value} onChange={onChange}>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button className="button" type="button" onClick={() => setState('idle')}>
            {__('OK', 'smk')}
          </button>
        </div>
      ) : null}
    </div>
  );
};
