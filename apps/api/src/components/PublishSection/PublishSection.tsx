import './PublishSection.css';

import { useState } from 'react';
import { sprintf, __ } from '@wordpress/i18n';

export const PublishSection: React.FC = ({ children }) => {
  return <div className="publish-section">{children}</div>;
};

export interface PublishRowProps {
  name: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLSelectElement>;
  options: { value: string; label: React.ReactNode }[];
  label: string;
}

export const PublishRow: React.FC<PublishRowProps> = ({ name, value, onChange, options, label }) => {
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
            {!value ? <option value="">{sprintf(__('Set %s', 'smk'), label.toLowerCase())}</option> : null}
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
