export function uniq<T>(arr: readonly T[]): T[] {
  return arr.filter((item, index, self) => {
    return self.indexOf(item) === index;
  });
}
