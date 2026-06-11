import type { Ending, RunState } from "./types";
import { areConditionsMet } from "./conditions";

export function calculateScore(state: RunState): number {
  const ageScore = Math.min(state.currentAge, 85) / 85;
  const lifeStatKeys = [
    "health",
    "wealth",
    "education",
    "career",
    "family",
    "relationships",
    "reputation",
  ] as const;
  const statAverage =
    lifeStatKeys.reduce((total, key) => total + state.stats[key], 0) /
    lifeStatKeys.length /
    100;
  const penalty = state.stats.risk / 400 + state.stats.stress / 500;
  const score = (ageScore * 0.3 + statAverage * 0.7 - penalty) * 100;

  return Math.max(0, Math.min(100, Math.round(score)));
}

export function selectEnding(state: RunState, endings: Ending[]): Ending {
  if (endings.length === 0) {
    throw new Error("At least one ending is required");
  }

  if (state.pendingEndingId) {
    const triggeredEnding = endings.find(
      (ending) => ending.id === state.pendingEndingId,
    );
    if (triggeredEnding) {
      return triggeredEnding;
    }
  }

  const matchingConditionalEndings = endings
    .filter(
      (ending) =>
        ending.conditions !== undefined &&
        ending.conditions.length > 0 &&
        areConditionsMet(ending.conditions, state),
    )
    .sort((first, second) => (second.priority ?? 0) - (first.priority ?? 0));

  if (matchingConditionalEndings[0]) {
    return matchingConditionalEndings[0];
  }

  const defaultEndings = endings
    .filter(
      (ending) =>
        ending.conditions === undefined || ending.conditions.length === 0,
    )
    .sort((first, second) => (first.priority ?? 0) - (second.priority ?? 0));

  return defaultEndings[0] ?? endings[0];
}
