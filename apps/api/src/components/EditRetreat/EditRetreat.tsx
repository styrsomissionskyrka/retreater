import { Dashicon, Panel } from '@wordpress/components';
import { PluginSidebar, PluginSidebarMoreMenuItem } from '@wordpress/edit-post';
import { __ } from '@wordpress/i18n';
import { Fragment } from 'react';

import { SectionDates } from './SectionDates';
import { SectionParticipants } from './SectionParticipants';
import { SectionPrice } from './SectionPrice';

export interface EditRetreatProps {
  name: string;
  icon: Dashicon.Icon;
}

export const EditRetreat: React.FC<EditRetreatProps> = ({ name, icon }) => {
  return (
    <Fragment>
      <PluginSidebarMoreMenuItem target={name} icon={icon}>
        {__('Retreat settings', 'smk')}
      </PluginSidebarMoreMenuItem>

      <PluginSidebar name={name} title={__('Retreat settings', 'smk')} icon={icon}>
        <Panel>
          <SectionPrice />
          <SectionDates />
          <SectionParticipants />
        </Panel>
      </PluginSidebar>
    </Fragment>
  );
};
