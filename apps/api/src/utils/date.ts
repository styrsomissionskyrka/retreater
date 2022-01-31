import { format, parse } from 'date-fns';

export const DB_DATE_FORMAT = 'yyyy-MM-dd HH:mm:ss';

export const db = {
  format(date: Date): string {
    return format(date, DB_DATE_FORMAT);
  },
  parse(date: string): Date | null {
    if (date == null || date === '') return null;

    try {
      let parsed = parse(date, DB_DATE_FORMAT, new Date());
      if (parsed.toString() === 'Invalid Date') return null;
      return parsed;
    } catch (error) {
      return null;
    }
  },
} as const;
