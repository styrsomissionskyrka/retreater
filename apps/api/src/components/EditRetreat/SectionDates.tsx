import { useRef } from 'react';
import { PanelBody, PanelRow } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import { useRetreatMeta } from '../../utils/data';
import { DropdownDatePicker } from '../DropdownDatePicker';

export const SectionDates: React.FC = () => {
  let [meta, setMeta] = useRetreatMeta();

  let startDate = parseApiDate(meta.start_date);
  let endDate = parseApiDate(meta.end_date);

  let startRowRef = useRef<HTMLElement>(null);
  let endRowRef = useRef<HTMLElement>(null);

  return (
    <PanelBody title={__('Dates', 'smk')} initialOpen>
      <PanelRow ref={startRowRef}>
        <span>{__('Start date', 'smk')}</span>
        <DropdownDatePicker
          date={startDate}
          anchorRef={startRowRef}
          onChange={(next) => setMeta({ start_date: next?.toISOString() ?? '' })}
        />
      </PanelRow>

      <PanelRow ref={endRowRef}>
        <span>{__('End date', 'smk')}</span>
        <DropdownDatePicker
          date={endDate}
          anchorRef={endRowRef}
          onChange={(next) => setMeta({ end_date: next?.toISOString() ?? '' })}
        />
      </PanelRow>
    </PanelBody>
  );
};

function parseApiDate(date: string | null | undefined): Date | null {
  if (date == null || date === '') return null;

  try {
    let parsed = new Date(date);
    if (parsed.toString() === 'Invalid Date') return null;
    return parsed;
  } catch (error) {
    return null;
  }
}
