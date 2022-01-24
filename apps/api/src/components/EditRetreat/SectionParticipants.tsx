import { useEffect } from 'react';
import { PanelBody, PanelRow, TextControl, FormTokenField } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { usePersistedState } from '@fransvilhelm/hooks';

import { useRetreatMeta } from '../../utils/data';
import { uniq } from '../../utils/array';

export const SectionParticipants: React.FC = () => {
  let [meta, setMeta] = useRetreatMeta();

  return (
    <PanelBody title={__('Participants', 'smk')}>
      <PanelRow>
        <TextControl
          label={__('Max participants', 'smk')}
          value={meta.max_participants}
          type="number"
          onChange={(next) => {
            let num = Number(next);
            if (Number.isNaN(num)) return;
            setMeta({ max_participants: num });
          }}
        />
      </PanelRow>

      <PanelRow>
        <LeadersInput />
      </PanelRow>
    </PanelBody>
  );
};

const LeadersInput: React.FC = () => {
  let [meta, setMeta] = useRetreatMeta();
  let [suggestions, setSuggestions] = usePersistedState<string[]>([], 'smk_leaders_suggestion');

  let handleChange = (next: string[]) => {
    setMeta({ leaders: uniq(next) });
  };

  useEffect(() => {
    setSuggestions((prev) => uniq([...prev, ...meta.leaders].sort()));
  }, [setSuggestions, meta.leaders]);

  return (
    <FormTokenField
      value={meta.leaders}
      suggestions={suggestions}
      onChange={handleChange}
      maxSuggestions={5}
      label={__('Retreat leaders', 'smk')}
      messages={{
        added: __('Added leader', 'smk'),
        removed: __('Removed leader', 'smk'),
        remove: __('Remove leader', 'smk'),
      }}
    />
  );
};
