import { __ } from '@wordpress/i18n';
import { Fragment } from 'react';
import { createPortal } from 'react-dom';

import { useExistingPortal } from './utils';

export const Save: React.FC = () => {
  let portal = useExistingPortal('major-publishing-actions');
  if (portal == null) return null;

  return createPortal(
    <Fragment>
      <div id="publishing-action">
        <button type="submit" className="button button-primary button-large">
          {__('Save', 'smk')}
        </button>
      </div>
      <div className="clear"></div>
    </Fragment>,
    portal,
  );
};
