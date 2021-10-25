const assertPrefix = 'Assertion failed';

export function assert(value: boolean, message?: string): asserts value;
export function assert<T>(value: T | null | undefined, message?: string): asserts value is T;
export function assert(value: any, message?: string) {
  if (value === false || value === null || typeof value === 'undefined') {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(assertPrefix);
    }

    throw new Error(`${assertPrefix}: ${message ?? ''}`);
  }
}

export function ensure<T>(value: T | null | undefined, message?: string): T {
  assert(value, message);
  return value;
}

export function warning(value: unknown, message: string) {
  if (process.env.NODE_ENV !== 'production') {
    if (value === false || value === null || typeof value === 'undefined') return;

    let text = `Warning: ${message}`;
    console.warn(text);

    try {
      throw new Error(text);
    } catch (error) {}
  }
}

export function truthy<T>(value: T | null | undefined | '' | 0): value is T {
  if (value === '') return false;
  if (value === 0) return false;
  if (value == null) return false;
  return true;
}
