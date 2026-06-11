import type { LifeEvent, RunState, Stats } from "../engine/types";

export const defaultStats: Stats = {
  health: 70,
  intelligence: 55,
  charm: 50,
  wealth: 40,
  mindset: 60,
  luck: 50,
  education: 30,
  career: 0,
  family: 55,
  relationships: 50,
  reputation: 20,
  risk: 10,
  stress: 30,
  classBackground: 45,
};

export function createTestRunState(
  overrides: Partial<RunState> = {},
): RunState {
  const state: RunState = {
    id: "run-test",
    seed: "test-seed",
    rngState: 1,
    name: "测试人生",
    currentAge: 16,
    currentStage: "teen",
    stats: { ...defaultStats, ...overrides.stats },
    tags: [],
    milestones: [],
    seenEventIds: [],
    history: [],
    currentEvent: null,
    pendingEndingId: null,
    endingId: null,
    finalScore: null,
    status: "playing",
    createdAt: "2026-06-11T00:00:00.000Z",
    updatedAt: "2026-06-11T00:00:00.000Z",
    ...overrides,
  };

  return {
    ...state,
    stats: { ...defaultStats, ...overrides.stats },
  };
}

export function createTestEvent(
  overrides: Partial<LifeEvent> = {},
): LifeEvent {
  return {
    id: "test_event",
    stage: "teen",
    title: "测试事件",
    body: "一个用于测试的事件。",
    weight: 10,
    choices: [
      {
        id: "continue",
        text: "继续",
        effects: [{ type: "advanceTime", years: 1 }],
      },
    ],
    ...overrides,
  };
}
