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

function annualFallbackEvents(): LifeEvent[] {
  return baseContent.events.filter(
    (event) =>
      event.fallback &&
      event.trigger?.minAge !== undefined &&
      event.trigger.minAge === event.trigger.maxAge,
  );
}

describe("base content", () => {
  it("has enough narrative volume for a replayable fate simulator", () => {
    expect(baseContent.events.length).toBeGreaterThanOrEqual(30);
    expect(baseContent.endings.length).toBeGreaterThanOrEqual(10);
  });

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
        expect(
          choice.effects.some((effect) => effect.type !== "advanceTime"),
        ).toBe(true);
      }
    }
  });

  it("uses worldline tags to make choices change more than personal stats", () => {
    const worldlineTags = new Set(
      baseContent.events.flatMap((event) =>
        event.choices.flatMap((choice) =>
          choice.effects
            .filter(
              (effect): effect is Extract<Effect, { type: "tag" }> =>
                effect.type === "tag" && effect.tag.startsWith("world_"),
            )
            .map((effect) => effect.tag),
        ),
      ),
    );

    expect(worldlineTags.size).toBeGreaterThanOrEqual(8);
  });

  it("covers everyday life domains with dedicated event chains", () => {
    const requiredDomains = ["love", "study", "work", "illness", "travel"];

    for (const domain of requiredDomains) {
      const eventsInDomain = baseContent.events.filter((event) =>
        event.id.startsWith(`${domain}_`),
      );

      expect(eventsInDomain.length).toBeGreaterThanOrEqual(4);
    }
  });

  it("covers branching wealth timelines for clean money, gray money, tech, and law", () => {
    const wealthEvents = baseContent.events.filter((event) =>
      event.id.startsWith("wealth_"),
    );
    const wealthTags = new Set(
      wealthEvents.flatMap((event) =>
        event.choices.flatMap((choice) =>
          choice.effects
            .filter(
              (effect): effect is Extract<Effect, { type: "tag" }> =>
                effect.type === "tag",
            )
            .map((effect) => effect.tag),
        ),
      ),
    );
    const techStartup = wealthEvents.find(
      (event) => event.id === "wealth_tech_startup",
    );

    expect(wealthEvents.length).toBeGreaterThanOrEqual(6);
    for (const tagName of [
      "wealth_honest_income",
      "wealth_gray_income",
      "wealth_tech_degree",
      "wealth_tech_startup",
      "wealth_lawyer_path",
    ]) {
      expect(wealthTags.has(tagName)).toBe(true);
    }
    expect(techStartup?.trigger?.conditions).toContainEqual({
      type: "tag",
      tag: "wealth_tech_degree",
      present: true,
    });
  });

  it("advances exactly one year per non-ending choice so every age can have a story", () => {
    for (const event of baseContent.events) {
      for (const choice of event.choices) {
        const triggersEnding = choice.effects.some(
          (effect) => effect.type === "triggerEnding",
        );
        const timeEffects = choice.effects.filter(
          (effect) => effect.type === "advanceTime",
        );

        if (triggersEnding) {
          expect(timeEffects).toHaveLength(0);
        } else {
          expect(timeEffects).toHaveLength(1);
          expect(timeEffects[0]).toMatchObject({ years: 1 });
        }
      }
    }
  });

  it("keeps the fate theme visible in events and endings", () => {
    const combinedText = [
      ...baseContent.events.flatMap((event) => [
        event.title,
        event.body,
        ...event.choices.map((choice) => choice.text),
      ]),
      ...baseContent.endings.flatMap((ending) => [
        ending.title,
        ending.body,
      ]),
    ].join("");

    expect(combinedText).toContain("命");
  });

  it("keeps the full fate motto only in hidden story content", () => {
    const motto = "万般都是命，半点不由人";
    const publicEvents = baseContent.events.filter(
      (event) => !event.hidden,
    );
    const hiddenEvents = baseContent.events.filter(
      (event) => event.hidden,
    );
    const publicText = [
      ...publicEvents.flatMap((event) => [
        event.title,
        event.body,
        ...event.choices.map((choice) => choice.text),
      ]),
      ...baseContent.endings.flatMap((ending) => [
        ending.title,
        ending.body,
      ]),
    ].join("");
    const hiddenText = hiddenEvents
      .flatMap((event) => [
        event.title,
        event.body,
        ...event.choices.map((choice) => choice.text),
      ])
      .join("");

    expect(publicText).not.toContain(motto);
    expect(publicText).not.toContain("万般都是命");
    expect(publicText).not.toContain("半点不由人");
    expect(hiddenText).toContain(motto);
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

  it("includes annual fallback stories for every age after birth", () => {
    const annualFallbackAges = new Set(
      annualFallbackEvents().map((event) => event.trigger!.minAge!),
    );

    expect(annualFallbackAges).toEqual(
      new Set(Array.from({ length: 89 }, (_, index) => index + 1)),
    );
  });

  it("gives every annual fallback story multiple timeline-shaping choices", () => {
    const timelineTagPattern = /^(weather|scene|era|fate)_/;

    for (const event of annualFallbackEvents()) {
      expect(event.choices.length).toBeGreaterThanOrEqual(3);
      for (const choice of event.choices) {
        expect(
          choice.effects.some(
            (effect) =>
              effect.type === "tag" && timelineTagPattern.test(effect.tag),
          ),
        ).toBe(true);
      }
    }
  });

  it("can smoke-run multiple complete lives without crashing", () => {
    for (const seed of ["alpha", "beta", "gamma", "delta", "epsilon"]) {
      let run = startRun(
        createNewRun({ seed, name: `测试者-${seed}` }),
        baseContent.events,
      );
      let steps = 0;

      while (run.status !== "ended" && steps < 120) {
        const choice = run.currentEvent?.choices[0];
        expect(choice).toBeDefined();
        run = advanceRun(run, choice!.id, baseContent.events, baseContent.endings);
        steps += 1;
      }

      expect(run.status).toBe("ended");
      expect(run.endingId).not.toBeNull();
      expect(run.finalScore).not.toBeNull();
      expect(run.history.map((entry) => entry.age)).toEqual(
        Array.from({ length: run.history.length }, (_, age) => age),
      );
    }
  });
});
