import type { LifeStage } from "./types";

export function getLifeStage(age: number): LifeStage {
  if (age <= 2) {
    return "baby";
  }

  if (age <= 12) {
    return "child";
  }

  if (age <= 18) {
    return "teen";
  }

  if (age <= 44) {
    return "adult";
  }

  if (age <= 64) {
    return "middle";
  }

  return "elder";
}
