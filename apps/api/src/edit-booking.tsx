import { __ } from '@wordpress/i18n';
import { useState, Fragment } from 'react';
import { render } from 'react-dom';

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

let comments = document.querySelector<HTMLTextAreaElement>('[name="content"]')?.value ?? '';
const Comments: React.FC<{ value: string }> = ({ value: initialValue }) => {
  const [value, setValue] = useState(initialValue);
  return (
    <div style={{ display: 'flex', flexFlow: 'column nowrap', marginTop: 12 }}>
      <label htmlFor="comments">{__('Comments', 'smk')}</label>
      <textarea
        name="content"
        id="comments"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={10}
        style={{ padding: 12 }}
      />
    </div>
  );
};

render(<Comments value={comments} />, document.getElementById('postdivrich'));

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
