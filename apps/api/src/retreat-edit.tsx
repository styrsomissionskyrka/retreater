import { Dashicon } from '@wordpress/components';
import { registerPlugin } from '@wordpress/plugins';

import { EditRetreat } from './components/EditRetreat';
import { RestrictPostTypes } from './components/RestrictPostTypes';

const name = 'smk-api-retreat-settings';
const icon: Dashicon.Icon = 'nametag';

registerPlugin(name, {
  icon,
  render: () => (
    <RestrictPostTypes types="retreat">
      <EditRetreat name={name} icon={icon} />
    </RestrictPostTypes>
  ),
});
