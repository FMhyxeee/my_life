import type { Ending, LifeEvent, RunState } from "./types";
import { applyEffects, clampStat } from "./effects";
import { pickNextEvent } from "./eventPicker";
import { createRng, hashSeed } from "./rng";
import { calculateScore, selectEnding } from "./scoring";
import { getLifeStage } from "./stage";

export type NewRunInput = {
  seed: string;
  name?: string;
};

function createDefaultStats(seed: string): RunState["stats"] {
  const rng = createRng(`${seed}:stats`);
  const varied = (base: number, spread = 12) =>
    clampStat(base + rng.nextInt(spread * 2 + 1) - spread);

  return {
    health: varied(68),
    intelligence: varied(52),
    charm: varied(50),
    wealth: varied(38),
    mindset: varied(58),
    luck: varied(50, 20),
    education: 0,
    career: 0,
    family: varied(55),
    relationships: varied(48),
    reputation: 0,
    risk: varied(12, 8),
    stress: varied(18, 8),
    classBackground: varied(45, 20),
  };
}

function uniqueAppend(items: string[], item: string): string[] {
  return items.includes(item) ? items : [...items, item];
}

function finishRun(state: RunState, endings: Ending[]): RunState {
  const ending = selectEnding(state, endings);
  return {
    ...state,
    currentEvent: null,
    endingId: ending.id,
    finalScore: calculateScore(state),
    status: "ended",
    updatedAt: new Date().toISOString(),
  };
}

export function createNewRun(input: NewRunInput): RunState {
  const seed = input.seed.trim() || crypto.randomUUID();
  const now = new Date().toISOString();

  return {
    id: `run-${hashSeed(seed).toString(36)}-${Date.now().toString(36)}`,
    seed,
    rngState: hashSeed(seed),
    name: input.name?.trim() || "无名之人",
    currentAge: 0,
    currentStage: getLifeStage(0),
    stats: createDefaultStats(seed),
    tags: [],
    milestones: [],
    seenEventIds: [],
    history: [],
    currentEvent: null,
    pendingEndingId: null,
    endingId: null,
    finalScore: null,
    status: "playing",
    createdAt: now,
    updatedAt: now,
  };
}

export function startRun(state: RunState, events: LifeEvent[]): RunState {
  const rng = createRng(state.rngState);
  const currentEvent = pickNextEvent(state, events, rng);

  return {
    ...state,
    currentEvent,
    rngState: rng.getState(),
    updatedAt: new Date().toISOString(),
  };
}

export function advanceRun(
  state: RunState,
  choiceId: string,
  events: LifeEvent[],
  endings: Ending[],
): RunState {
  if (state.status === "ended") {
    return state;
  }

  if (!state.currentEvent) {
    throw new Error("Cannot advance a run without a current event");
  }

  const currentEvent = state.currentEvent;
  const choice = currentEvent.choices.find((item) => item.id === choiceId);

  if (!choice) {
    throw new Error(`Choice "${choiceId}" does not exist on event "${currentEvent.id}"`);
  }

  const withHistory: RunState = {
    ...state,
    seenEventIds: uniqueAppend(state.seenEventIds, currentEvent.id),
    history: [
      ...state.history,
      {
        age: state.currentAge,
        stage: state.currentStage,
        eventId: currentEvent.id,
        eventTitle: currentEvent.title,
        choiceId: choice.id,
        choiceText: choice.text,
      },
    ],
    currentEvent: null,
    updatedAt: new Date().toISOString(),
  };

  const afterEffects = applyEffects(withHistory, choice.effects);

  if (afterEffects.pendingEndingId || afterEffects.currentAge >= 90) {
    return finishRun(afterEffects, endings);
  }

  return startRun(afterEffects, events);
}
