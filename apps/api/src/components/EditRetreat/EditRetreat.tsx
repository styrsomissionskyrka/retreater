import { Fragment } from 'react';
import { PluginSidebarMoreMenuItem, PluginSidebar } from '@wordpress/edit-post';
import { Dashicon, Panel } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import { SectionPrice } from './SectionPrice';
import { SectionDates } from './SectionDates';
import { SectionParticipants } from './SectionParticipants';

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
