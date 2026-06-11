import { describe, expect, it } from "vitest";
import { applyEffects } from "./effects";
import type { RunState } from "./types";

const baseState: RunState = {
  id: "run-1",
  seed: "test-seed",
  rngState: 1,
  name: "测试人生",
  currentAge: 16,
  currentStage: "teen",
  stats: {
    health: 70,
    intelligence: 62,
    charm: 45,
    wealth: 35,
    mindset: 55,
    luck: 50,
    education: 58,
    career: 0,
    family: 60,
    relationships: 52,
    reputation: 20,
    risk: 12,
    stress: 40,
    classBackground: 48,
  },
  tags: ["elite_school"],
  milestones: [],
  seenEventIds: ["birth_background"],
  history: [],
  currentEvent: null,
  pendingEndingId: null,
  endingId: null,
  finalScore: null,
  status: "playing",
  createdAt: "2026-06-11T00:00:00.000Z",
  updatedAt: "2026-06-11T00:00:00.000Z",
};

describe("applyEffects", () => {
  it("applies stat deltas and clamps stats between 0 and 100", () => {
    const result = applyEffects(baseState, [
      { type: "stat", stat: "health", delta: 80 },
      { type: "stat", stat: "wealth", delta: -80 },
    ]);

    expect(result.stats.health).toBe(100);
    expect(result.stats.wealth).toBe(0);
    expect(baseState.stats.health).toBe(70);
  });

  it("adds and removes tags without duplicates", () => {
    const result = applyEffects(baseState, [
      { type: "tag", tag: "exam_focused", action: "add" },
      { type: "tag", tag: "exam_focused", action: "add" },
      { type: "tag", tag: "elite_school", action: "remove" },
    ]);

    expect(result.tags).toEqual(["exam_focused"]);
  });

  it("records milestones once", () => {
    const result = applyEffects(baseState, [
      { type: "milestone", milestone: "entered_university" },
      { type: "milestone", milestone: "entered_university" },
    ]);

    expect(result.milestones).toEqual(["entered_university"]);
  });

  it("advances time and updates life stage", () => {
    const result = applyEffects(baseState, [{ type: "advanceTime", years: 4 }]);

    expect(result.currentAge).toBe(20);
    expect(result.currentStage).toBe("adult");
  });

  it("records a pending ending trigger", () => {
    const result = applyEffects(baseState, [
      { type: "triggerEnding", endingId: "accident" },
    ]);

    expect(result.pendingEndingId).toBe("accident");
  });
});
