import { describe, expect, it } from "vitest";
import { createTestRunState } from "../test/factories";
import type { Ending } from "./types";
import { calculateScore, selectEnding } from "./scoring";

const endings: Ending[] = [
  {
    id: "ordinary_life",
    title: "平凡一生",
    body: "你度过了普通但完整的一生。",
    priority: 1,
  },
  {
    id: "legendary_life",
    title: "传奇人生",
    body: "你的名字被很多人记住。",
    priority: 10,
    conditions: [
      { type: "stat", stat: "reputation", op: ">=", value: 80 },
      { type: "stat", stat: "wealth", op: ">=", value: 70 },
    ],
  },
  {
    id: "accident",
    title: "意外终止",
    body: "一次意外提前结束了人生。",
    priority: 100,
  },
];

describe("scoring", () => {
  it("prefers explicitly triggered endings", () => {
    const state = createTestRunState({ pendingEndingId: "accident" });

    expect(selectEnding(state, endings).id).toBe("accident");
  });

  it("selects the highest priority matching ending", () => {
    const state = createTestRunState({
      stats: { reputation: 90, wealth: 88 },
    });

    expect(selectEnding(state, endings).id).toBe("legendary_life");
  });

  it("falls back to the lowest priority ending when no conditional ending matches", () => {
    const state = createTestRunState({
      stats: { reputation: 30, wealth: 20 },
    });

    expect(selectEnding(state, endings).id).toBe("ordinary_life");
  });

  it("calculates a bounded final score from age and life stats", () => {
    const state = createTestRunState({
      currentAge: 82,
      stats: {
        health: 80,
        wealth: 90,
        education: 70,
        career: 65,
        family: 75,
        relationships: 60,
        reputation: 55,
      },
    });

    expect(calculateScore(state)).toBeGreaterThan(0);
    expect(calculateScore(state)).toBeLessThanOrEqual(100);
  });
});
