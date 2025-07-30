import { assert } from "../runtime";
import { RuntimeException } from "../core";
import type { MaybeArray, MaybeROArray } from "../_types";


export type range_t = readonly [number, number];


class Range {
  public static from(
    r: range_t | string | { min: number; max: number },
    ocs?: [
      (boolean | null | undefined | never)?,
      (boolean | null | undefined | never)?
    ] // eslint-disable-line comma-dangle
  ): Range {
    if(typeof r === "string")
      return Range.parse(r);

    const lc = typeof ocs?.[0] === "boolean" ?
      ocs[0] : true;

    const uc = typeof ocs?.[1] === "boolean" ?
      ocs[1] : true;

    if(Array.isArray(r))
      return new Range(r[0], r[1], [lc, uc]);

    if(typeof r === "object" && "min" in r && "max" in r)
      return new Range(r.min, r.max, [lc, uc]);

    throw new RuntimeException();
  }

  public static parse(s: string): Range {
    const match = s.replace(/\s+/g, "")
      .match(/^(\[|\])(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)(\]|\[)$/);

    if(!match) {
      throw new RuntimeException();
    }

    const lc = match[1] === "[";
    const uc = match[4] === "]";

    return new Range(
      Number(match[2]),
      Number(match[3]),
      [lc, uc] // eslint-disable-line comma-dangle
    );
  }

  public constructor(
    private readonly _min: number,
    private readonly _max: number,
    private readonly _cs: [boolean, boolean] = [true, true] // eslint-disable-line comma-dangle
  ) { assert(_min <= _max); }

  public get min(): number {
    return this._min;
  }

  public get max(): number {
    return this._max;
  }

  public isBetween(x: number): boolean {
    const testLower = (
      this._cs[0] ?
        x >= this._min :
        x > this._min
    );

    const testUpper = (
      this._cs[1] ?
        x <= this._max :
        x < this._max
    );

    return testLower && testUpper;
  }

  public includes(x: number): boolean;
  public includes(x: number[]): readonly boolean[];
  public includes(x: MaybeArray<number>): MaybeROArray<boolean> {
    if(typeof x === "number")
      return this.isBetween(x);

    const r: boolean[] = [];

    for(let i = 0; i < x.length; i++) {
      r.push(this.isBetween(x[i]));
    }

    return r;
  }

  public intersect(o: Range): Range {
    if(!this.intersects(o)) {
      throw new RuntimeException("These ranges have no intersection");
    }

    const min = Math.max(this._min, o._min);
    const max = Math.min(this._max, o._max);

    const lc = min === this._min ?
      this._cs[0] :
      o._cs[0];

    const uc = max === this._max ?
      this._cs[1] :
      o._cs[1];

    return new Range(min, max, [lc, uc]);
  }

  public union(o: Range): Range {
    assert(o instanceof Range);

    const canUnion = (
      this.intersects(o) ||
      this._max === o._min && (this._cs[1] || o._cs[0]) ||
      o._max === this._min && (o._cs[1] || this._cs[0])
    );

    if(!canUnion) {
      throw new RuntimeException("Ranges do not overlap or touch");
    }

    const min = Math.min(this._min, o._min);
    const max = Math.max(this._max, o._max);

    const lc = this._min < o._min ?
      this._cs[0] :
      this._min > o._min ?
        o._cs[0] :
        this._cs[0] || o._cs[0];

    const uc = this._max > o._max ?
      this._cs[1] :
      this._max < o._max ?
        o._cs[1] :
        this._cs[1] || o._cs[1];

    return new Range(min, max, [lc, uc]);
  }

  public subtract(o: Range): Range[] {
    assert(o instanceof Range);
    if(!this.intersects(o)) return [this];

    const r: Range[] = [];

    if(o._min > this._min || (o._min === this._min && (!o._cs[0] && this._cs[0]))) {
      const min = this._min;
      const max = o._max;

      const lc = this._cs[0];
      const uc = !o._cs[0];

      r.push(new Range(min, max, [lc, uc]));
    }

    if(o._max < this._max || (o._max === this._max && (!o._cs[1] && this._cs[1]))) {
      const min = o._max;
      const max = this._max;

      const lc = !o._cs[1];
      const uc = this._cs[1];

      r.push(new Range(min, max, [lc, uc]));
    }

    return r;
  }

  public intersects(o: Range): boolean {
    assert(o instanceof Range);

    const min = Math.max(this._min, o._min);
    const max = Math.min(this._max, o._max);

    return min < max || (min === max && this.includes(min) && o.includes(min));
  }

  public export(): range_t {
    return Object.freeze([this._min, this._max] as const);
  }

  public toString(): string {
    const lb = !this._cs[0] || !Number.isFinite(this._min) ? "]" : "[";
    const rb = !this._cs[1] || !Number.isFinite(this._max) ? "[" : "]";

    const min = !Number.isFinite(this._min) ?
      "-\u221e" :
      this._min;

    const max = !Number.isFinite(this._max) ?
      "+\u221e" :
      this._max;

    return `Range << ${lb}${min}, ${max}${rb}`;
  }
}

export default Range;
