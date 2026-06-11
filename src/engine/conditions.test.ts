import { describe, expect, it } from "vitest";
import type { RunState } from "./types";
import { areConditionsMet, evaluateCondition, isTriggerMet } from "./conditions";

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

describe("conditions", () => {
  it("evaluates stat comparisons", () => {
    expect(
      evaluateCondition(
        { type: "stat", stat: "education", op: ">=", value: 50 },
        baseState,
      ),
    ).toBe(true);
    expect(
      evaluateCondition(
        { type: "stat", stat: "stress", op: "<", value: 20 },
        baseState,
      ),
    ).toBe(false);
  });

  it("evaluates tag presence and absence", () => {
    expect(
      evaluateCondition(
        { type: "tag", tag: "elite_school", present: true },
        baseState,
      ),
    ).toBe(true);
    expect(
      evaluateCondition(
        { type: "tag", tag: "chronic_illness", present: false },
        baseState,
      ),
    ).toBe(true);
  });

  it("evaluates event history", () => {
    expect(
      evaluateCondition(
        { type: "eventHappened", eventId: "birth_background", happened: true },
        baseState,
      ),
    ).toBe(true);
    expect(
      evaluateCondition(
        { type: "eventHappened", eventId: "career_choice", happened: true },
        baseState,
      ),
    ).toBe(false);
  });

  it("evaluates age bounds and full condition lists", () => {
    expect(evaluateCondition({ type: "age", min: 13, max: 18 }, baseState)).toBe(
      true,
    );
    expect(
      areConditionsMet(
        [
          { type: "age", min: 13, max: 18 },
          { type: "stat", stat: "education", op: ">=", value: 55 },
        ],
        baseState,
      ),
    ).toBe(true);
    expect(
      areConditionsMet(
        [
          { type: "age", min: 19 },
          { type: "stat", stat: "education", op: ">=", value: 55 },
        ],
        baseState,
      ),
    ).toBe(false);
  });

  it("evaluates event triggers with age and condition constraints", () => {
    expect(
      isTriggerMet(
        {
          minAge: 14,
          maxAge: 18,
          conditions: [{ type: "tag", tag: "elite_school", present: true }],
        },
        baseState,
      ),
    ).toBe(true);
    expect(isTriggerMet({ minAge: 17 }, baseState)).toBe(false);
  });
});
