export type SeededRng = {
  getState: () => number;
  nextFloat: () => number;
  nextInt: (max: number) => number;
  pick: <T>(items: T[]) => T;
  weightedPick: <T>(items: T[], getWeight: (item: T) => number) => T;
};

export function hashSeed(seed: string): number {
  let hash = 2166136261;

  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0 || 1;
}

export function createRng(seedOrState: string | number): SeededRng {
  let state =
    typeof seedOrState === "number" ? seedOrState >>> 0 : hashSeed(seedOrState);

  const nextFloat = () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };

  return {
    getState: () => state,
    nextFloat,
    nextInt: (max) => {
      if (!Number.isInteger(max) || max <= 0) {
        throw new Error("max must be a positive integer");
      }

      return Math.floor(nextFloat() * max);
    },
    pick: (items) => {
      if (items.length === 0) {
        throw new Error("Cannot pick from an empty list");
      }

      return items[Math.floor(nextFloat() * items.length)];
    },
    weightedPick: (items, getWeight) => {
      if (items.length === 0) {
        throw new Error("Cannot pick from an empty list");
      }

      const weights = items.map((item) => Math.max(0, getWeight(item)));
      const totalWeight = weights.reduce((total, weight) => total + weight, 0);

      if (totalWeight <= 0) {
        return items[0];
      }

      let cursor = nextFloat() * totalWeight;
      for (let index = 0; index < items.length; index += 1) {
        cursor -= weights[index];
        if (cursor <= 0) {
          return items[index];
        }
      }

      return items[items.length - 1];
    },
  };
}
