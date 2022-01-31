import { useRef } from 'react';
import { PanelBody, PanelRow } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { addDays, isBefore } from 'date-fns';

import { useRetreatMeta } from '../../utils/data';
import { DropdownDatePicker } from '../DropdownDatePicker';
import { db } from '../../utils/date';

export const SectionDates: React.FC = () => {
  let [meta, setMeta] = useRetreatMeta();

  let startDate = meta.start_date ? db.parse(meta.start_date) : null;
  let endDate = meta.end_date ? db.parse(meta.end_date) : null;

  let startRowRef = useRef<HTMLElement>(null);
  let endRowRef = useRef<HTMLElement>(null);

  const handleStartDateChange = (next: Date | null) => {
    let nextEndDate = endDate;
    if (next == null) {
      nextEndDate = null;
    } else if (nextEndDate == null) {
      nextEndDate = addDays(next, 1);
    } else if (isBefore(nextEndDate, next)) {
      nextEndDate = addDays(next, 1);
    }

    setMeta({
      start_date: next != null ? db.format(next) : '',
      end_date: nextEndDate != null ? db.format(nextEndDate) : '',
    });
  };

  const handleEndDateChange = (next: Date | null) => {
    setMeta({ end_date: next != null ? db.format(next) : '' });
  };

  return (
    <PanelBody title={__('Dates', 'smk')} initialOpen>
      <PanelRow ref={startRowRef}>
        <span>{__('Start date', 'smk')}</span>
        <DropdownDatePicker date={startDate} anchorRef={startRowRef} onChange={handleStartDateChange} />
      </PanelRow>

      <PanelRow ref={endRowRef}>
        <span>{__('End date', 'smk')}</span>
        <DropdownDatePicker date={endDate} anchorRef={endRowRef} onChange={handleEndDateChange} />
      </PanelRow>
    </PanelBody>
  );
};
