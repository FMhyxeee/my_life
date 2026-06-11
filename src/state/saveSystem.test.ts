import { describe, expect, it } from "vitest";
import { createTestRunState } from "../test/factories";
import { createSaveSystem } from "./saveSystem";

class MemoryStorage implements Storage {
  private values = new Map<string, string>();

  get length(): number {
    return this.values.size;
  }

  clear(): void {
    this.values.clear();
  }

  getItem(key: string): string | null {
    return this.values.get(key) ?? null;
  }

  key(index: number): string | null {
    return Array.from(this.values.keys())[index] ?? null;
  }

  removeItem(key: string): void {
    this.values.delete(key);
  }

  setItem(key: string, value: string): void {
    this.values.set(key, value);
  }
}

describe("createSaveSystem", () => {
  it("saves, loads, and clears the current run with a versioned envelope", () => {
    const storage = new MemoryStorage();
    const saves = createSaveSystem(storage);
    const run = createTestRunState({ id: "run-save" });

    saves.saveCurrentRun(run);

    expect(storage.getItem("life-sim/current-run")).toContain('"version":1');
    expect(saves.loadCurrentRun()?.id).toBe("run-save");

    saves.clearCurrentRun();

    expect(saves.loadCurrentRun()).toBeNull();
  });

  it("appends and loads archived run summaries", () => {
    const saves = createSaveSystem(new MemoryStorage());

    saves.appendArchive({
      runId: "run-1",
      seed: "seed-1",
      name: "测试者",
      endingId: "ordinary_life",
      finalScore: 66,
      finishedAt: "2026-06-11T00:00:00.000Z",
    });

    expect(saves.loadArchive()).toEqual([
      {
        runId: "run-1",
        seed: "seed-1",
        name: "测试者",
        endingId: "ordinary_life",
        finalScore: 66,
        finishedAt: "2026-06-11T00:00:00.000Z",
      },
    ]);
  });

  it("persists unlocked endings without duplicates", () => {
    const saves = createSaveSystem(new MemoryStorage());

    saves.unlockEnding("ordinary_life");
    saves.unlockEnding("ordinary_life");
    saves.unlockEnding("legendary_life");

    expect(saves.loadUnlockedEndings()).toEqual([
      "ordinary_life",
      "legendary_life",
    ]);
  });

  it("handles corrupt JSON without throwing", () => {
    const storage = new MemoryStorage();
    storage.setItem("life-sim/current-run", "{not-json");
    storage.setItem("life-sim/archive", "{not-json");
    storage.setItem("life-sim/unlocked-endings", "{not-json");
    const saves = createSaveSystem(storage);

    expect(saves.loadCurrentRun()).toBeNull();
    expect(saves.loadArchive()).toEqual([]);
    expect(saves.loadUnlockedEndings()).toEqual([]);
  });
});
