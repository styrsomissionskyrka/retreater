import { __ } from '@wordpress/i18n';
import { Fragment } from 'react';
import { createPortal } from 'react-dom';

import { useExistingPortal } from './utils';

export const Title: React.FC<{ value: unknown }> = ({ value }) => {
  let portal = useExistingPortal('titlewrap');

  if (portal == null) return null;
  if (typeof value !== 'string') return null;

  return createPortal(
    <Fragment>
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
    </Fragment>,
    portal,
  );
};
