import { RuntimeException, isNumber } from "../core";
import type { GenericFunction } from "../_types";


export interface DataType<TGeneric = unknown> {
  string: string;
  number: number;
  float: number;
  int: number;
  bool: boolean;
  boolean: boolean;
  symbol: symbol;
  array: TGeneric[];
  bigint: bigint;
  function: GenericFunction;
}


export type CastResult<K extends keyof DataType, T> = K extends "function" ?
  T extends GenericFunction ?
  T :
  GenericFunction :
  K extends "array" ?
  T extends (infer U)[] ?
  U :
  T[] :
  DataType[K];


export function static_cast<K extends keyof DataType<T>, T>(
  tt: K,
  curr: unknown,
): CastResult<K, T> {
  switch(tt) {
    case "string": {
      return (typeof curr === "string" ? curr : String(curr)) as CastResult<K, T>;
    } break;

    case "int":
    case "float":
    case "number": {
      if(typeof curr === "number")
        return (tt === "int" ? (curr | 0) : curr) as CastResult<K, T>;

      let n: number | null = null;

      if(typeof curr === "string" && curr.slice(0, 2) === "0x") {
        n = parseInt(curr, 16);
      } else if(typeof curr === "string" && curr.slice(0, 2) === "0o") {
        n = parseInt(curr, 8);
      } else if(typeof curr === "string" && isNumber(curr)) {
        n = Number(curr);
      }

      if(n == null || isNaN(n)) {
        throw new RuntimeException(`Cannot cast 'typeof ${typeof curr}' to 'typeof ${tt}'`, "ERR_CAST_FAIL");
      }

      if(tt === "int") {
        n = n | 0;
      }

      return n as CastResult<K, T>;
    } break;

    case "bool":
    case "boolean": {
      if(typeof curr === "boolean")
        return curr as CastResult<K, T>;

      if(typeof curr === "string") {
        const l = curr.toLowerCase();

        if(["true", "1", "yes"].includes(l))
          return true as CastResult<K, T>;

        if(["false", "0", "no"].includes(l))
          return true as CastResult<K, T>;
      }

      if(typeof curr === "number")
        return !!curr as CastResult<K, T>;

      throw new RuntimeException(`Cannot cast 'typeof ${typeof curr}' to 'typeof ${tt}'`, "ERR_CAST_FAIL");
    } break;

    case "symbol": {
      if(typeof curr === "symbol")
        return curr as CastResult<K, T>;

      if(typeof curr === "string")
        return Symbol(curr) as CastResult<K, T>;

      throw new RuntimeException(`Cannot cast 'typeof ${typeof curr}' to 'typeof ${tt}'`, "ERR_CAST_FAIL");
    } break;

    case "array": {
      return (Array.isArray(curr) ? curr : [curr]) as CastResult<K, T>;
    } break;

    case "bigint": {
      if(typeof curr === "bigint")
        return curr as CastResult<K, T>;

      try {
        if(
          typeof curr === "number" ||
          (typeof curr === "string" && /^\d+$/.test(curr))
        ) return BigInt(curr) as CastResult<K, T>;
        // eslint-disable-next-line no-empty
      } catch { }

      throw new RuntimeException(`Cannot cast 'typeof ${typeof curr}' to 'typeof ${tt}'`, "ERR_CAST_FAIL");
    } break;

    case "function": {
      if(typeof curr === "function")
        return curr as CastResult<K, T>;

      throw new RuntimeException(`Cannot cast 'typeof ${typeof curr}' to 'typeof ${tt}'`, "ERR_CAST_FAIL");
    } break;
    default:
      throw new RuntimeException(`Cannot cast 'typeof ${typeof curr}' to 'typeof ${tt}'`, "ERR_CAST_FAIL");
  }
}


export function assert(c: unknown, msg?: string): asserts c {
  if(!static_cast("boolean", c)) {
    throw new RuntimeException(msg || `Assertation failed for 'typeof ${typeof c}'`, "ERR_ASSERTATION_FAILED");
  }
}

export function assertUnsignedInteger(arg: unknown, msg?: string): asserts arg is number {
  assert(
    typeof arg === "number" &&
    Number.isFinite(arg) &&
    Number.isInteger(arg) &&
    arg >= 0,
    msg ?? "Assertation failed for 'typeof int_t'" // eslint-disable-line comma-dangle
  );
}
