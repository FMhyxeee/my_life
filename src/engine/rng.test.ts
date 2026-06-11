import { describe, expect, it } from "vitest";
import { createRng } from "./rng";

describe("createRng", () => {
  it("returns the same sequence for the same seed", () => {
    const first = createRng("same-life");
    const second = createRng("same-life");

    expect([first.nextFloat(), first.nextFloat(), first.nextFloat()]).toEqual([
      second.nextFloat(),
      second.nextFloat(),
      second.nextFloat(),
    ]);
  });

  it("returns different first values for different seeds", () => {
    const first = createRng("seed-a");
    const second = createRng("seed-b");

    expect(first.nextFloat()).not.toBe(second.nextFloat());
  });

  it("returns integers within the requested range", () => {
    const rng = createRng("bounded");

    for (let index = 0; index < 20; index += 1) {
      const value = rng.nextInt(3);
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(3);
    }
  });
});
