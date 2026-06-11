import type { CompareOperator, Condition, EventTrigger, RunState } from "./types";

function compareNumber(
  actual: number,
  op: CompareOperator,
  expected: number,
): boolean {
  switch (op) {
    case ">":
      return actual > expected;
    case ">=":
      return actual >= expected;
    case "<":
      return actual < expected;
    case "<=":
      return actual <= expected;
    case "==":
      return actual === expected;
    case "!=":
      return actual !== expected;
    default:
      return false;
  }
}

export function evaluateCondition(condition: Condition, state: RunState): boolean {
  switch (condition.type) {
    case "stat":
      return compareNumber(
        state.stats[condition.stat],
        condition.op,
        condition.value,
      );
    case "tag":
      return state.tags.includes(condition.tag) === condition.present;
    case "eventHappened":
      return state.seenEventIds.includes(condition.eventId) === condition.happened;
    case "age": {
      const aboveMin = condition.min === undefined || state.currentAge >= condition.min;
      const belowMax = condition.max === undefined || state.currentAge <= condition.max;
      return aboveMin && belowMax;
    }
    default:
      return false;
  }
}

export function areConditionsMet(
  conditions: Condition[] | undefined,
  state: RunState,
): boolean {
  return (conditions ?? []).every((condition) => evaluateCondition(condition, state));
}

export function isTriggerMet(
  trigger: EventTrigger | undefined,
  state: RunState,
): boolean {
  if (!trigger) {
    return true;
  }

  if (trigger.minAge !== undefined && state.currentAge < trigger.minAge) {
    return false;
  }

  if (trigger.maxAge !== undefined && state.currentAge > trigger.maxAge) {
    return false;
  }

  return areConditionsMet(trigger.conditions, state);
}
