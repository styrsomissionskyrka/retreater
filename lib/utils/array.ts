export function unique<T>(arr: readonly T[]): readonly T[];
export function unique<T>(arr: T[]): T[];
export function unique<T>(arr: T[] | readonly T[]): T[] | readonly T[] {
  return arr.filter((value, index, self) => self.indexOf(value) === index);
}
