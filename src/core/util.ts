export function exclude<T extends object, K extends keyof T>(
  obj: T,
  ...keys: K[] // eslint-disable-line comma-dangle
): Omit<T, K> {
  return Object.fromEntries(
    Object.entries(obj)
      .filter(([key]) => !keys.includes(key as K)) // eslint-disable-line comma-dangle
  ) as Omit<T, K>;
}


export function isNumber(arg: any): boolean {
  if(typeof arg === "number")
    return true;

  if(typeof arg !== "string")
    return false;

  if((/^0x[0-9a-f]+$/i).test(arg))
    return true;

  return (/^[-+]?(?:\d+(?:\.\d*)?|\.\d+)(e[-+]?\d+)?$/).test(arg);
}


export function isIterable<T>(arg: unknown): arg is Iterable<T> {
  return !!arg && typeof arg === "object" && typeof (arg as Iterable<T>)[Symbol.iterator] === "function";
}

export function isAsyncIterable<T>(arg: unknown): arg is AsyncIterable<T> {
  return !!arg && typeof arg === "object" && typeof (arg as AsyncIterable<T>)[Symbol.asyncIterator] === "function";
}
