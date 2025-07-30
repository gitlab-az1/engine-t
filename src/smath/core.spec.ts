import { sum, sub } from "./core";


describe("SuperMath/Core", () => {
  test("Should sum all values from iterable", () => {
    expect(sum([10, 20, 30, 40, 50])).toBe(150);
  });

  test("Should subtract all values from iterable", () => {
    expect(sub([10, 20, 30, 40, 50])).toBe(-150);
  });
});
