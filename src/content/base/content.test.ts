import { describe, expect, it } from "vitest";
import { advanceRun, createNewRun, startRun } from "../../engine/gameLoop";
import type { Effect, LifeEvent } from "../../engine/types";
import { baseContent } from "./index";

function collectTriggeredEndingIds(events: LifeEvent[]): string[] {
  return events.flatMap((event) =>
    event.choices.flatMap((choice) =>
      choice.effects
        .filter(
          (effect): effect is Extract<Effect, { type: "triggerEnding" }> =>
            effect.type === "triggerEnding",
        )
        .map((effect) => effect.endingId),
    ),
  );
}

describe("base content", () => {
  it("has unique event ids and valid choices", () => {
    const eventIds = new Set(baseContent.events.map((event) => event.id));

    expect(eventIds.size).toBe(baseContent.events.length);
    for (const event of baseContent.events) {
      expect(event.weight).toBeGreaterThan(0);
      expect(event.choices.length).toBeGreaterThan(0);
      const choiceIds = new Set(event.choices.map((choice) => choice.id));
      expect(choiceIds.size).toBe(event.choices.length);
      for (const choice of event.choices) {
        expect(choice.text.trim()).not.toBe("");
      }
    }
  });

  it("has unique ending ids and valid trigger references", () => {
    const endingIds = new Set(baseContent.endings.map((ending) => ending.id));

    expect(endingIds.size).toBe(baseContent.endings.length);
    for (const endingId of collectTriggeredEndingIds(baseContent.events)) {
      expect(endingIds.has(endingId)).toBe(true);
    }
  });

  it("includes a fallback event for progression", () => {
    expect(baseContent.events.some((event) => event.fallback)).toBe(true);
  });

  it("can smoke-run multiple complete lives without crashing", () => {
    for (const seed of ["alpha", "beta", "gamma", "delta", "epsilon"]) {
      let run = startRun(
        createNewRun({ seed, name: `测试者-${seed}` }),
        baseContent.events,
      );
      let steps = 0;

      while (run.status !== "ended" && steps < 80) {
        const choice = run.currentEvent?.choices[0];
        expect(choice).toBeDefined();
        run = advanceRun(run, choice!.id, baseContent.events, baseContent.endings);
        steps += 1;
      }

      expect(run.status).toBe("ended");
      expect(run.endingId).not.toBeNull();
      expect(run.finalScore).not.toBeNull();
    }
  });
});
