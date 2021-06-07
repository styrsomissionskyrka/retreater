import {
  format as _format,
  formatDistance as _formatDistance,
  formatDistanceStrict as _formatDistanceStrict,
  formatRelative as _formatRelative,
} from 'date-fns';
import { sv } from 'date-fns/locale';

export * from 'date-fns';

export function format(...args: Parameters<typeof _format>): ReturnType<typeof _format> {
  let [date, format, options] = args;
  return _format(date, format, { locale: sv, weekStartsOn: 1, ...options });
}

export function formatDistance(...args: Parameters<typeof _formatDistance>): ReturnType<typeof _formatDistance> {
  let [date, baseDate, options] = args;
  return _formatDistance(date, baseDate, { locale: sv, ...options });
}

export function formatDistanceStrict(
  ...args: Parameters<typeof _formatDistanceStrict>
): ReturnType<typeof _formatDistanceStrict> {
  let [date, baseDate, options] = args;
  return _formatDistanceStrict(date, baseDate, { locale: sv, ...options });
}

export function formatRelative(...args: Parameters<typeof _formatRelative>): ReturnType<typeof _formatRelative> {
  let [date, baseDate, options] = args;
  return _formatRelative(date, baseDate, { locale: sv, weekStartsOn: 1, ...options });
}
