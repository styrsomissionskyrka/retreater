import { useId as _useId } from '@reach/auto-id';

export function useId(prefix: string, idFromProps: string): string;
export function useId(prefix: string, idFromProps: string | undefined): string | undefined;
export function useId(prefix: string, idFromProps?: null): string | undefined;
export function useId(prefix: string, idFromProps?: string | null) {
  const generated = _useId(idFromProps as any);
  if (idFromProps) return generated;
  return `${prefix}${generated}`;
}
