import { Fragment } from 'react';
import { registerPlugin } from '@wordpress/plugins';
import { PluginSidebarMoreMenuItem, PluginSidebar } from '@wordpress/edit-post';
import { __ } from '@wordpress/i18n';

import { usePostAttribute } from './utils/data';

const name = 'smk-api-retreat-settings';
const icon = 'welcome-write-blog';

const Render: React.FC = () => {
  let [price, setPrice] = usePostAttribute('stripe_price');

  return (
    <Fragment>
      <PluginSidebarMoreMenuItem target={name} icon={icon}>
        <span>{__('Retreat settings', 'smk')}</span>
      </PluginSidebarMoreMenuItem>

      <PluginSidebar name={name} title={__('Retreat', 'smk')} icon={icon}>
        <p>{price}</p>
        <button onClick={() => setPrice((prev) => (prev === 4_000_00 ? 5_000_00 : 4_000_00))}>Increase price</button>
      </PluginSidebar>
    </Fragment>
  );
};

registerPlugin(name, {
  icon,
  render: Render,
});
