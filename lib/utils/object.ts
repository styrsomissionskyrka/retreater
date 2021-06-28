export function omit<T extends object, K extends keyof T>(obj: T, ...keys: K[]): Omit<T, K> {
  let clone: any = {};
  for (let key of Object.keys(obj) as K[]) {
    if (keys.includes(key)) continue;
    clone[key] = obj[key];
  }

  return clone;
}

export function pick<T extends object, K extends keyof T>(obj: T, ...keys: K[]): Pick<T, K> {
  let clone: any = {};
  for (let key of keys) {
    clone[key] = obj[key];
  }

  return clone;
}
