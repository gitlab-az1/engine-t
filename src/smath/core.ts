import type { vec_array } from "../_types";
import { type math_vec2d } from "./vector";
import { static_cast } from "../runtime/core";
import { RuntimeException, isIterable } from "../core";


/**
 * The `PI` constant (same as built-in `Math`)
 */
export const pi = Math.PI;

/**
 * The `E` constant
 */
export const e = Math.E;

/**
 * The calculated logarithm of `E` (base 10)
 */
export const log10e = Math.LOG10E;

/**
 * The calculated logarithm of `E` (base 2)
 */
export const log2e = Math.LOG2E;
export const ln10 = Math.LN10;
export const ln2 = Math.LN2;
export const sqrt2 = Math.SQRT2;

/**
 * The `PI` constant calculated with Machin's formula
 */
export const machins_pi: number = 3.1415926535897936;

export const deg_2_rad = Math.PI / 180;
export const rad_2_deg = 180 / Math.PI;

export const machins_deg_2_rad = machins_pi / 180;
export const machins_rad_2_deg = 180 / machins_pi;


export function sum(args: vec_array<number> | Iterable<number>): number {
  let sr: number = 0;
  
  if(isIterable(args) && !("at" in args)) {
    for(const x of args) {
      sr += static_cast("number", x);
    }
  } else {
    let l: number = -1;

    if("length" in args && typeof args.length === "number") {
      l = args.length;
    }

    if("size" in args && typeof args.size === "function") {
      l = args.size();
    }

    if(typeof l !== "number" || l < 0) {
      throw new RuntimeException();
    }

    for(let i = 0; i < l; i++) {
      sr += static_cast("number", (args as RelativeIndexable<number>).at(i));
    }
  }

  return sr;
}

export function sub(args: vec_array<number> | Iterable<number>): number {
  let sr: number = 0;
  
  if(isIterable(args) && !("at" in args)) {
    for(const x of args) {
      sr -= static_cast("number", x);
    }
  } else {
    let l: number = -1;

    if("length" in args && typeof args.length === "number") {
      l = args.length;
    }

    if("size" in args && typeof args.size === "function") {
      l = args.size();
    }

    if(typeof l !== "number" || l < 0) {
      throw new RuntimeException();
    }

    for(let i = 0; i < l; i++) {
      sr -= static_cast("number", (args as RelativeIndexable<number>).at(i));
    }
  }

  return sr;
}


/**
 * Computes the Euclidean modulo of the given parameters that
 * is `( ( n % m ) + m ) % m`.
 *
 * @param {number} n - The first parameter.
 * @param {number} m - The second parameter.
 * @return {number} The Euclidean modulo.
 */
export function euclideanModulo(n: number, m: number): number {
  return ((n % m) + m) % m;
}


/**
 * Return the `n` root of the provided number.
 * 
 * @param {number} x 
 * @param {number} [_n= 2] 
 * @returns {number}
 */
export function root(x: number, _n: number = 2): number {
  return x ** (1 / _n);
}


/**
 * Clamps a number within a specified range defined by the minimum and maximum values.
 *
 * @param x - The number to be clamped.
 * @param min - The minimum value of the range.
 * @param max - The maximum value of the range.
 * @returns The clamped value within the specified range.
 */
export function clamp(x: number, min: number, max: number): number {
  return Math.min(Math.max(x, min), max);
}


/**
 * Evaluates a given function over a range of x values and returns an object containing
 * an array of points, minimum and maximum y values, and the string representation of the function.
 *
 * @param f - The function to be evaluated.
 * @param x1 - The start of the x range.
 * @param x2 - The end of the x range.
 * @param n - The number of points to evaluate (default is the absolute difference between x1 and x2).
 * @returns An object containing points, min, max, and the string representation of the function.
 */
export function getFunctionValues(
  f: ((x: number) => number),
  x1: number, x2: number,
  n: number = Math.abs(x1 - x2) // eslint-disable-line comma-dangle
) {
  try {
    const points: math_vec2d[] = [];

    let min = Infinity;
    let max = -Infinity;

    const step = (x2 - x1) / n;
    const reversed = x1 > x2;
    const stepDir = reversed ? -1 : 1;

    for(let i = 0; i <= n; i++) {
      const x = x1 + i * stepDir * step;
      const y = f(x);

      points.push({ x, y });

      if(y < min) {
        min = y;
      }

      if(y > max) {
        max = y;
      }
    }

    return {
      points,
      min, max,
      success: true,
      "f(x)": f.toString(),
    };
  } catch (err: any) {
    return {
      points: [],
      min: Infinity,
      max: -Infinity,
      success: false,
      errors: [err],
    };
  }
}


/**
 * Checks if a given number is a power of two.
 *
 * @param num - The number to check.
 * @returns True if the number is a power of two, false otherwise.
 */
export function isPowerOfTwo(num: number): boolean {
  if(num < 1)
    return false; // Numbers less than 1 cannot be powers of 2

  // Bitwise AND operation: num & (num - 1) clears the rightmost set bit of num
  // If num is a power of 2, it will have only one set bit (MSB), and (num - 1) will have all the lower bits set.
  // So, num & (num - 1) will be 0 for powers of 2.
  return (num & (num - 1)) === 0;
}


/**
 * Rounds a given number to the nearest power of two.
 *
 * @param number - The number to round.
 * @returns The rounded number to the nearest power of two.
 * @throws Throws an error if the input number is less than or equal to zero.
 */
export function roundToPowerOfTwo(number: number): number {
  if(number <= 0) {
    throw new RuntimeException("Number must be greater than zero.");
  }

  // Check if the number is already a power of two
  if((number & (number - 1)) === 0) return number;

  let power = 1;

  while(power < number) {
    power <<= 1;
  }

  const nextPower = power;
  const previousPower = power >> 1;

  return (
    nextPower - number < number - previousPower ?
      nextPower :
      previousPower
  );
}


/**
 * Checks if a given number is a prime number.
 *
 * @param n - The number to check for primality.
 * @returns True if the number is prime, false otherwise.
 */
export function isPrime(n: number): boolean {
  if(n <= 1)
    return false;

  if(n <= 3)
    return true;

  if(n % 2 === 0 || n % 3 === 0)
    return false;

  for(let i = 5; i * i <= n; i += 6) {
    if(n % i === 0 || n % (i + 2) === 0)
      return false;
  }

  return true;
}
