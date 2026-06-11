import type { LifeEvent, RunState } from "./types";
import type { SeededRng } from "./rng";
import { isTriggerMet } from "./conditions";

export function isEventEligible(event: LifeEvent, state: RunState): boolean {
  if (event.stage !== "any" && event.stage !== state.currentStage) {
    return false;
  }

  if (event.once && state.seenEventIds.includes(event.id)) {
    return false;
  }

  return isTriggerMet(event.trigger, state);
}

export function getEligibleEvents(
  state: RunState,
  events: LifeEvent[],
): LifeEvent[] {
  return events.filter(
    (event) => !event.fallback && isEventEligible(event, state),
  );
}

export function pickNextEvent(
  state: RunState,
  events: LifeEvent[],
  rng: SeededRng,
): LifeEvent {
  const eligibleEvents = getEligibleEvents(state, events);

  if (eligibleEvents.length > 0) {
    return rng.weightedPick(eligibleEvents, (event) => event.weight);
  }

  const fallbackEvent = events.find(
    (event) => event.fallback && isEventEligible(event, state),
  );

  if (!fallbackEvent) {
    throw new Error("No eligible life event and no fallback event available");
  }

  return fallbackEvent;
}
