type PromiseFn<T> = () => T | PromiseLike<T>;

export async function serial<T>(values: readonly PromiseFn<T>[]): Promise<T[]> {
  let results: T[] = [];

  for (let fn of values) {
    results.push(await fn());
  }

  return results;
}
