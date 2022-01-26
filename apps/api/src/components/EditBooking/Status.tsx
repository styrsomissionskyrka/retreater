import { useState } from 'react';
import { createPortal } from 'react-dom';
import { __ } from '@wordpress/i18n';

import { useExistingPortal } from './utils';

type Status = 'draft' | 'pending' | 'publish';

const isStatus = (value: unknown): value is Status => {
  return typeof value === 'string' && ['draft', 'pending', 'publish'].includes(value);
};

const statusLabels: Record<string, string> = {
  draft: __('Queued', 'smk'),
  pending: __('Payment pending', 'smk'),
  publish: __('Confirmed', 'smk'),
};

export const Status: React.FC<{ value: unknown }> = ({ value: initialValue }) => {
  const portal = useExistingPortal('minor-publishing');
  const [value, setValue] = useState(isStatus(initialValue) ? initialValue : 'draft');
  const [state, setState] = useState<'idle' | 'edit'>('idle');

  if (portal == null) return null;

  return createPortal(
    <div className="misc-pub-section misc-pub-post-status">
      <input type="hidden" name="hidden_post_status" id="hidden_post_status" value={value} />
      <input type="hidden" name="post_status" id="post_status" value={value} />
      {__('Status', 'smk')}: <span id="post-status-display">{statusLabels[value]}</span>{' '}
      <button className="edit-post-status" type="button" onClick={() => setState('edit')}>
        <span aria-hidden="true">{__('Edit', 'smk')}</span>{' '}
        <span className="screen-reader-text">{__('Edit status', 'smk')}</span>
      </button>
      {state === 'edit' ? (
        <div id="post-status-select">
          <label htmlFor="post_status" className="screen-reader-text">
            {__('Set status', 'smk')}
          </label>
          <select
            name="proxy_post_status"
            id="proxy_post_status"
            value={value}
            onChange={(e) => {
              if (isStatus(e.currentTarget.value)) setValue(e.currentTarget.value);
            }}
          >
            <option value="draft">{statusLabels['draft']}</option>
            <option value="pending">{statusLabels['pending']}</option>
            <option value="publish">{statusLabels['publish']}</option>
          </select>
          <button className="save-post-status button" type="button" onClick={() => setState('idle')}>
            {__('OK', 'smk')}
          </button>
        </div>
      ) : null}
    </div>,
    portal,
  );
};
