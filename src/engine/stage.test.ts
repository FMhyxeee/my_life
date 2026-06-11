import { describe, expect, it } from "vitest";
import { getLifeStage } from "./stage";

describe("getLifeStage", () => {
  it("maps age ranges to life stages", () => {
    expect(getLifeStage(0)).toBe("baby");
    expect(getLifeStage(8)).toBe("child");
    expect(getLifeStage(16)).toBe("teen");
    expect(getLifeStage(30)).toBe("adult");
    expect(getLifeStage(55)).toBe("middle");
    expect(getLifeStage(80)).toBe("elder");
  });
});
