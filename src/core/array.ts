export function choose(arr: string): string;
export function choose<T>(arr: T[]): T;
export function choose<T>(arr: string | T[]): T | string {
  return arr[Math.floor(Math.random() * arr.length)];
}
