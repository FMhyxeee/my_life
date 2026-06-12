import { describe, expect, it } from "vitest";
import { createTestEvent } from "../test/factories";
import type { Ending } from "./types";
import { advanceRun, createNewRun, startRun } from "./gameLoop";

const endings: Ending[] = [
  {
    id: "ordinary_life",
    title: "平凡一生",
    body: "你度过了普通但完整的一生。",
  },
  {
    id: "accident",
    title: "意外终止",
    body: "一次意外提前结束了人生。",
  },
];

describe("gameLoop", () => {
  it("creates a new run with stable defaults", () => {
    const run = createNewRun({ seed: "abc", name: "小明" });

    expect(run.seed).toBe("abc");
    expect(run.name).toBe("小明");
    expect(run.currentAge).toBe(0);
    expect(run.currentStage).toBe("baby");
    expect(run.status).toBe("playing");
    expect(run.stats.health).toBeGreaterThan(0);
  });

  it("starts a run by selecting the first current event", () => {
    const run = createNewRun({ seed: "abc", name: "小明" });
    const birthEvent = createTestEvent({
      id: "birth",
      stage: "baby",
      trigger: { minAge: 0, maxAge: 1 },
    });

    const started = startRun(run, [birthEvent]);

    expect(started.currentEvent?.id).toBe("birth");
  });

  it("records a choice, applies effects, advances age, and selects next event", () => {
    const run = startRun(createNewRun({ seed: "abc", name: "小明" }), [
      createTestEvent({
        id: "birth",
        stage: "baby",
        trigger: { minAge: 0, maxAge: 1 },
        choices: [
          {
            id: "curious",
            text: "好奇地观察世界",
            effects: [
              { type: "stat", stat: "intelligence", delta: 5 },
              { type: "advanceTime", years: 4 },
            ],
          },
        ],
        once: true,
      }),
    ]);
    const childEvent = createTestEvent({
      id: "childhood",
      stage: "child",
      trigger: { minAge: 3, maxAge: 12 },
    });

    const next = advanceRun(run, "curious", [childEvent], endings);

    expect(next.currentAge).toBe(4);
    expect(next.currentStage).toBe("child");
    expect(next.history).toHaveLength(1);
    expect(next.history[0].eventId).toBe("birth");
    expect(next.seenEventIds).toContain("birth");
    expect(next.stats.intelligence).toBeGreaterThan(run.stats.intelligence);
    expect(next.currentEvent?.id).toBe("childhood");
  });

  it("auto-records ordinary years until the next meaningful choice", () => {
    const run = createNewRun({ seed: "abc", name: "小明" });
    const quietAgeOne = createTestEvent({
      id: "quiet_age_one",
      stage: "baby",
      title: "一岁静年",
      trigger: { minAge: 1, maxAge: 1 },
      fallback: true,
      auto: true,
      choices: [
        {
          id: "year_passes",
          text: "这一年只在身体里留下很轻的痕迹",
          effects: [
            { type: "tag", tag: "ordinary_years_accumulated", action: "add" },
            { type: "advanceTime", years: 1 },
          ],
        },
      ],
    });
    const quietAgeTwo = createTestEvent({
      id: "quiet_age_two",
      stage: "baby",
      title: "两岁静年",
      trigger: { minAge: 2, maxAge: 2 },
      fallback: true,
      auto: true,
      choices: [
        {
          id: "year_passes",
          text: "这一年没有问题，只留下记录",
          effects: [
            { type: "tag", tag: "ordinary_years_accumulated", action: "add" },
            { type: "advanceTime", years: 1 },
          ],
        },
      ],
    });
    const firstChoice = createTestEvent({
      id: "first_real_choice",
      stage: "child",
      title: "第一道真正的岔路",
      trigger: { minAge: 3, maxAge: 3 },
    });

    const started = startRun(
      { ...run, currentAge: 1, currentStage: "baby" },
      [quietAgeOne, quietAgeTwo, firstChoice],
    );

    expect(started.currentAge).toBe(3);
    expect(started.currentEvent?.id).toBe("first_real_choice");
    expect(started.history.map((entry) => entry.eventId)).toEqual([
      "quiet_age_one",
      "quiet_age_two",
    ]);
    expect(started.history.every((entry) => entry.auto)).toBe(true);
  });

  it("ends a run when a choice triggers an ending", () => {
    const run = startRun(createNewRun({ seed: "abc", name: "小明" }), [
      createTestEvent({
        id: "danger",
        stage: "baby",
        choices: [
          {
            id: "risk",
            text: "冒险",
            effects: [{ type: "triggerEnding", endingId: "accident" }],
          },
        ],
      }),
    ]);

    const ended = advanceRun(run, "risk", [], endings);

    expect(ended.status).toBe("ended");
    expect(ended.endingId).toBe("accident");
    expect(ended.finalScore).not.toBeNull();
  });
});
