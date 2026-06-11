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
