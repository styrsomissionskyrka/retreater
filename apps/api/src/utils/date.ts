import { format } from 'date-fns';

export function dbDatetime(date: Date): string {
  return format(date, 'yyyy-MM-dd HH:mm:ss');
}
