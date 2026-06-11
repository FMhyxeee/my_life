import type { RunState } from "../engine/types";

const SAVE_VERSION = 1;
const CURRENT_RUN_KEY = "life-sim/current-run";
const ARCHIVE_KEY = "life-sim/archive";
const UNLOCKED_ENDINGS_KEY = "life-sim/unlocked-endings";

export type RunArchiveEntry = {
  runId: string;
  seed: string;
  name: string;
  endingId: string;
  finalScore: number;
  finishedAt: string;
};

type SaveEnvelope<T> = {
  version: number;
  data: T;
};

function createEnvelope<T>(data: T): SaveEnvelope<T> {
  return {
    version: SAVE_VERSION,
    data,
  };
}

function readEnvelope<T>(storage: Storage, key: string): T | null {
  const raw = storage.getItem(key);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<SaveEnvelope<T>>;
    if (parsed.version !== SAVE_VERSION || parsed.data === undefined) {
      return null;
    }

    return parsed.data;
  } catch {
    return null;
  }
}

function writeEnvelope<T>(storage: Storage, key: string, data: T): void {
  storage.setItem(key, JSON.stringify(createEnvelope(data)));
}

export function createSaveSystem(storage: Storage) {
  return {
    saveCurrentRun: (run: RunState) => {
      writeEnvelope(storage, CURRENT_RUN_KEY, run);
    },
    loadCurrentRun: (): RunState | null =>
      readEnvelope<RunState>(storage, CURRENT_RUN_KEY),
    clearCurrentRun: () => {
      storage.removeItem(CURRENT_RUN_KEY);
    },
    appendArchive: (entry: RunArchiveEntry) => {
      const archive = readEnvelope<RunArchiveEntry[]>(storage, ARCHIVE_KEY) ?? [];
      writeEnvelope(storage, ARCHIVE_KEY, [entry, ...archive]);
    },
    loadArchive: (): RunArchiveEntry[] =>
      readEnvelope<RunArchiveEntry[]>(storage, ARCHIVE_KEY) ?? [],
    unlockEnding: (endingId: string) => {
      const unlocked =
        readEnvelope<string[]>(storage, UNLOCKED_ENDINGS_KEY) ?? [];
      if (!unlocked.includes(endingId)) {
        writeEnvelope(storage, UNLOCKED_ENDINGS_KEY, [...unlocked, endingId]);
      }
    },
    loadUnlockedEndings: (): string[] =>
      readEnvelope<string[]>(storage, UNLOCKED_ENDINGS_KEY) ?? [],
  };
}
