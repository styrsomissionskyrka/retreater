import { Fragment } from 'react';
import { registerPlugin } from '@wordpress/plugins';
import { PluginSidebarMoreMenuItem, PluginSidebar } from '@wordpress/edit-post';
import { __ } from '@wordpress/i18n';
import { Retreat, RetreatMetadata } from '@styrsomissionskyrka/types';

import { usePostAttribute, usePostMeta } from './utils/data';

const name = 'smk-api-retreat-settings';
const icon = 'welcome-write-blog';

const Render: React.FC = () => {
  let [price, setPrice] = usePostAttribute<Retreat>('stripe_price');
  let [meta, setMeta] = usePostMeta<RetreatMetadata>();

  let startDate = meta.start_date || undefined;
  return (
    <Fragment>
      <PluginSidebarMoreMenuItem target={name} icon={icon}>
        <span>{__('Retreat settings', 'smk')}</span>
      </PluginSidebarMoreMenuItem>

      <PluginSidebar name={name} title={__('Retreat settings', 'smk')} icon={icon}>
        <p>{price}</p>
        <p>{startDate ?? 'No date'}</p>
      </PluginSidebar>
    </Fragment>
  );
};

registerPlugin(name, {
  icon,
  render: Render,
});
