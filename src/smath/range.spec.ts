import Range from "./range";
import { RuntimeException } from "../core";


const createRange = (min: number, max: number, closed?: [boolean, boolean]) => new Range(min, max, closed);

describe("SuperMath/Range", () => {
  test("Should create a new range from tuple", () => {
    const r = Range.from([1, 5]);
    
    expect(r.min).toBe(1);
    expect(r.max).toBe(5);
  });

  test("Should create a new range from object", () => {
    const r = Range.from({ min: 2, max: 4 }, [false, true]);

    expect(r.min).toBe(2);
    expect(r.max).toBe(4);
    expect(r.includes(2)).toBe(false);
    expect(r.includes(4)).toBe(true);
  });

  test("Should throw for invalid input when parsing range", () => {
    expect(() => {
      Range.from({ a: 1, bc: "D" } as any);
    }).toThrow(RuntimeException);
  });

  test("Should parte open and closed bounds", () => {
    const r1 = Range.parse("[1, 5]");
    
    expect(r1.includes(1)).toBe(true);
    expect(r1.includes(5)).toBe(true);

    const r2 = Range.parse("]-1, 5[");

    expect(r2.includes(-1)).toBe(false);
    expect(r2.includes(0)).toBe(true);
    expect(r2.includes(5)).toBe(false);
  });

  test("throws on invalid format", () => {
    expect(() => Range.parse("invalid")).toThrow(RuntimeException);
    expect(() => Range.parse("[1-5]")).toThrow(RuntimeException);
  });

  const r = createRange(0, 10, [true, false]);

  test("Includes single number", () => {
    expect(r.includes(0)).toBe(true);
    expect(r.includes(10)).toBe(false);
    expect(r.includes(5)).toBe(true);
  });

  test("Includes array", () => {
    expect(r.includes([0, 5, 10])).toEqual([true, true, false]);
  });
    
  test("detects overlapping ranges", () => {
    const r1 = createRange(0, 5);
    const r2 = createRange(3, 10);

    expect(r1.intersects(r2)).toBe(true);
  });

  test("detects touching ranges if closed", () => {
    const r1 = createRange(0, 5);
    const r2 = createRange(5, 10);

    expect(r1.intersects(r2)).toBe(true);
  });

  test("does not detect non-touching open ranges", () => {
    const r1 = createRange(0, 5, [true, false]);
    const r2 = createRange(5, 10, [false, true]);

    expect(r1.intersects(r2)).toBe(false);
  });
    
  test("returns correct intersection", () => {
    const r1 = createRange(0, 10);
    const r2 = createRange(5, 15);

    const i = r1.intersect(r2);

    expect(i.min).toBe(5);
    expect(i.max).toBe(10);
  });

  test("throws on disjoint ranges", () => {
    const r1 = createRange(0, 5, [true, false]);
    const r2 = createRange(5, 10, [false, true]);

    expect(() => r1.intersect(r2)).toThrow(RuntimeException);
  });
    
  test("returns merged range for overlapping", () => {
    const r1 = createRange(0, 5);
    const r2 = createRange(3, 10);

    const u = r1.union(r2);

    expect(u.min).toBe(0);
    expect(u.max).toBe(10);
  });

  test("merges touching ranges if at least one bound is closed", () => {
    const r1 = createRange(0, 5, [true, true]);
    const r2 = createRange(5, 10, [true, true]);

    const u = r1.union(r2);

    expect(u.min).toBe(0);
    expect(u.max).toBe(10);
  });

  test("throws on disjoint ranges", () => {
    const r1 = createRange(0, 5, [true, false]);
    const r2 = createRange(5.01, 10, [true, true]);

    expect(() => r1.union(r2)).toThrow(RuntimeException);
  });
    
  test("removes a middle section", () => {
    const r1 = createRange(0, 10);
    const r2 = createRange(3, 7);

    const [a, b] = r1.subtract(r2);

    expect(a.min).toBe(0);
    expect(a.max).toBe(7);
    expect(b.min).toBe(7);
    expect(b.max).toBe(10);
  });

  test("returns original if no intersection", () => {
    const r1 = createRange(0, 5);
    const r2 = createRange(6, 10);

    const result = r1.subtract(r2);

    expect(result).toHaveLength(1);
    expect(result[0].min).toBe(0);
    expect(result[0].max).toBe(5);
  });
    
  test("exports as frozen tuple", () => {
    const r = createRange(2, 5);
    const e = r.export();

    expect(e).toStrictEqual([2, 5]);

    expect(Object.isFrozen(e)).toBe(true);
  });
    
  test("formats correctly", () => {
    const r = createRange(1, 5);
    expect(r.toString()).toBe("Range << [1, 5]");
  });

  test("uses correct brackets for open bounds", () => {
    const r = createRange(1, 5, [false, false]);
    expect(r.toString()).toBe("Range << ]1, 5[");
  });

  test("handles infinite bounds", () => {
    const r = createRange(-Infinity, Infinity);
    
    expect(r.toString()).toContain("-\u221e");
    expect(r.toString()).toContain("+\u221e");
  });
});
