import { describe, expect, it } from "vitest";
import { createTestEvent, createTestRunState } from "../test/factories";
import { createRng } from "./rng";
import {
  getEligibleEvents,
  isEventEligible,
  pickNextEvent,
} from "./eventPicker";

describe("eventPicker", () => {
  it("filters by stage and age trigger", () => {
    const state = createTestRunState({ currentAge: 16, currentStage: "teen" });
    const teenEvent = createTestEvent({
      id: "teen_exam",
      stage: "teen",
      trigger: { minAge: 13, maxAge: 18 },
    });
    const adultEvent = createTestEvent({
      id: "adult_job",
      stage: "adult",
      trigger: { minAge: 19 },
    });

    expect(isEventEligible(teenEvent, state)).toBe(true);
    expect(isEventEligible(adultEvent, state)).toBe(false);
    expect(getEligibleEvents(state, [teenEvent, adultEvent])).toEqual([
      teenEvent,
    ]);
  });

  it("filters by tags and one-time event history", () => {
    const state = createTestRunState({
      tags: ["elite_school"],
      seenEventIds: ["already_seen"],
    });
    const taggedEvent = createTestEvent({
      id: "tagged_event",
      trigger: {
        conditions: [{ type: "tag", tag: "elite_school", present: true }],
      },
    });
    const missingTagEvent = createTestEvent({
      id: "missing_tag_event",
      trigger: {
        conditions: [{ type: "tag", tag: "artist", present: true }],
      },
    });
    const seenOnceEvent = createTestEvent({
      id: "already_seen",
      once: true,
    });

    expect(getEligibleEvents(state, [taggedEvent, missingTagEvent, seenOnceEvent])).toEqual([
      taggedEvent,
    ]);
  });

  it("uses a fallback event when no specific event is eligible", () => {
    const state = createTestRunState({ currentAge: 16, currentStage: "teen" });
    const blockedEvent = createTestEvent({
      id: "blocked",
      trigger: { minAge: 80 },
    });
    const fallbackEvent = createTestEvent({
      id: "fallback",
      stage: "any",
      fallback: true,
    });

    expect(pickNextEvent(state, [blockedEvent, fallbackEvent], createRng("x"))).toEqual(
      fallbackEvent,
    );
  });

  it("selects events deterministically for the same seed", () => {
    const state = createTestRunState();
    const events = [
      createTestEvent({ id: "common", weight: 10 }),
      createTestEvent({ id: "rare", weight: 1 }),
    ];

    const first = pickNextEvent(state, events, createRng("stable-seed"));
    const second = pickNextEvent(state, events, createRng("stable-seed"));

    expect(first.id).toBe(second.id);
  });
});
