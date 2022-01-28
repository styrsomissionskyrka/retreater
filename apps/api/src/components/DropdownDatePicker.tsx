import { DateTimePicker, Dropdown, Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { format } from 'date-fns';

export interface DatePickerProps {
  date: Date | null;
  label?: (date: Date | null) => React.ReactNode;
  anchorRef: React.RefObject<HTMLElement>;
  onChange: (next: Date | null) => void;
}

const defaultFormatLabel = (date: Date | null) => {
  return date == null ? __('Pick date', 'smk') : format(date, 'yyyy-MM-dd HH:mm');
};

export const DropdownDatePicker: React.FC<DatePickerProps> = ({
  date,
  label = defaultFormatLabel,
  anchorRef,
  onChange,
}) => {
  return (
    <Dropdown
      popoverProps={{ anchorRef: anchorRef.current }}
      position="bottom left"
      renderToggle={({ onToggle, isOpen }) => (
        <Button onClick={onToggle} aria-expanded={isOpen} variant="tertiary">
          {label(date)}
        </Button>
      )}
      renderContent={() => (
        <DateTimePicker
          currentDate={date ? date.toISOString() : undefined}
          onChange={(next) => {
            if (next == null) {
              onChange(next);
            } else {
              let nextDate = new Date(next);
              onChange(isValidDate(nextDate) ? nextDate : null);
            }
          }}
        />
      )}
    />
  );
};

function isValidDate(date: unknown): date is Date {
  if (date instanceof Date && !Number.isNaN(date.getTime())) return true;
  return false;
}
