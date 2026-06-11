import type { Effect, RunState } from "./types";
import { getLifeStage } from "./stage";

const MIN_STAT = 0;
const MAX_STAT = 100;

export function clampStat(value: number): number {
  return Math.max(MIN_STAT, Math.min(MAX_STAT, value));
}

export function applyEffects(state: RunState, effects: Effect[]): RunState {
  let nextState: RunState = {
    ...state,
    stats: { ...state.stats },
    tags: [...state.tags],
    milestones: [...state.milestones],
    updatedAt: new Date().toISOString(),
  };

  for (const effect of effects) {
    switch (effect.type) {
      case "stat": {
        const currentValue = nextState.stats[effect.stat];
        const nextValue =
          effect.set !== undefined ? effect.set : currentValue + (effect.delta ?? 0);
        nextState = {
          ...nextState,
          stats: {
            ...nextState.stats,
            [effect.stat]: clampStat(nextValue),
          },
        };
        break;
      }
      case "tag": {
        const tags = new Set(nextState.tags);
        if (effect.action === "add") {
          tags.add(effect.tag);
        } else {
          tags.delete(effect.tag);
        }

        nextState = {
          ...nextState,
          tags: Array.from(tags),
        };
        break;
      }
      case "milestone": {
        const milestones = new Set(nextState.milestones);
        milestones.add(effect.milestone);
        nextState = {
          ...nextState,
          milestones: Array.from(milestones),
        };
        break;
      }
      case "advanceTime": {
        const currentAge = Math.max(0, nextState.currentAge + effect.years);
        nextState = {
          ...nextState,
          currentAge,
          currentStage: getLifeStage(currentAge),
        };
        break;
      }
      case "triggerEnding":
        nextState = {
          ...nextState,
          pendingEndingId: effect.endingId,
        };
        break;
      default:
        break;
    }
  }

  return nextState;
}
