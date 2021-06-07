import {
  differenceInCalendarWeeks as _differenceInCalendarWeeks,
  eachWeekOfInterval as _eachWeekOfInterval,
  endOfWeek as _endOfWeek,
  format as _format,
  formatDistance as _formatDistance,
  formatDistanceStrict as _formatDistanceStrict,
  formatDistanceToNow as _formatDistanceToNow,
  formatDistanceToNowStrict as _formatDistanceToNowStrict,
  formatDuration as _formatDuration,
  formatRelative as _formatRelative,
  getWeek as _getWeek,
  getWeekOfMonth as _getWeekOfMonth,
  getWeeksInMonth as _getWeeksInMonth,
  getWeekYear as _getWeekYear,
  isMatch as _isMatch,
  isSameWeek as _isSameWeek,
  isThisWeek as _isThisWeek,
  lastDayOfWeek as _lastDayOfWeek,
  parse as _parse,
  setDay as _setDay,
  setWeek as _setWeek,
  setWeekYear as _setWeekYear,
  startOfWeek as _startOfWeek,
  startOfWeekYear as _startOfWeekYear,
} from 'date-fns';
import { sv } from 'date-fns/locale';

export * from 'date-fns';

export const differenceInCalendarWeeks = wrap(_differenceInCalendarWeeks);
export const eachWeekOfInterval = wrap(_eachWeekOfInterval);
export const endOfWeek = wrap(_endOfWeek);
export const format = wrap(_format);
export const formatDistance = wrap(_formatDistance);
export const formatDistanceStrict = wrap(_formatDistanceStrict);
export const formatDistanceToNow = wrap(_formatDistanceToNow);
export const formatDistanceToNowStrict = wrap(_formatDistanceToNowStrict);
export const formatDuration = wrap(_formatDuration);
export const formatRelative = wrap(_formatRelative);
export const getWeek = wrap(_getWeek);
export const getWeekOfMonth = wrap(_getWeekOfMonth);
export const getWeeksInMonth = wrap(_getWeeksInMonth);
export const getWeekYear = wrap(_getWeekYear);
export const isMatch = wrap(_isMatch);
export const isSameWeek = wrap(_isSameWeek);
export const isThisWeek = wrap(_isThisWeek);
export const lastDayOfWeek = wrap(_lastDayOfWeek);
export const parse = wrap(_parse);
export const setDay = wrap(_setDay);
export const setWeek = wrap(_setWeek);
export const setWeekYear = wrap(_setWeekYear);
export const startOfWeek = wrap(_startOfWeek);
export const startOfWeekYear = wrap(_startOfWeekYear);

function wrap<T extends (...args: any[]) => any>(fn: T): T {
  let wrapped = (...args: Parameters<T>) => {
    let length = fn.length;
    let newArgs = new Array(length);
    for (let i = 0; i < length; i++) {
      if (i === length - 1) {
        newArgs[i] = { locale: sv, weekStartsOn: 1, ...args[i] };
      } else {
        newArgs[i] = args[i];
      }
    }

    return fn(...newArgs);
  };

  return wrapped as T;
}
