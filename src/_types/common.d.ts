export type MultidimensionalArray<T> = (T | MultidimensionalArray<T>)[];

export type GenericFunction = (...args: any[]) => unknown;

export type MaybeArray<T> = T | T[];

export type MaybeROArray<T> = T | readonly T[];

export type vec_array<T> = RelativeIndexable<T> & (
  | { readonly length: number }
  | { size(): number }
);
