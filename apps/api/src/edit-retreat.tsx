import { Fragment } from 'react';
import { registerPlugin } from '@wordpress/plugins';
import { PluginSidebarMoreMenuItem, PluginSidebar } from '@wordpress/edit-post';
import { __ } from '@wordpress/i18n';

const name = 'smk-api-retreat-settings';
const icon = 'welcome-write-blog';

registerPlugin(name, {
  icon,
  render() {
    return (
      <Fragment>
        <PluginSidebarMoreMenuItem target={name} icon={icon}>
          <span>{__('Retreat settings', 'smk')}</span>
        </PluginSidebarMoreMenuItem>

        <PluginSidebar name={name} title={__('Retreat', 'smk')} icon={icon}>
          <p>Retreat options</p>
        </PluginSidebar>
      </Fragment>
    );
  },
});
