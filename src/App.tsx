import { useMemo, useState } from "react";
import { baseContent } from "./content/base";
import { advanceRun, createNewRun, startRun } from "./engine/gameLoop";
import type { Ending, RunState } from "./engine/types";
import {
  createSaveSystem,
  type RunArchiveEntry,
} from "./state/saveSystem";
import { ArchiveScreen } from "./ui/screens/ArchiveScreen";
import { EndingScreen } from "./ui/screens/EndingScreen";
import { PlayScreen } from "./ui/screens/PlayScreen";
import { SetupScreen } from "./ui/screens/SetupScreen";
import { StartScreen } from "./ui/screens/StartScreen";

type Screen = "start" | "setup" | "play" | "ending" | "archive";

function createArchiveEntry(run: RunState): RunArchiveEntry | null {
  if (!run.endingId || run.finalScore === null) {
    return null;
  }

  return {
    runId: run.id,
    seed: run.seed,
    name: run.name,
    endingId: run.endingId,
    finalScore: run.finalScore,
    finishedAt: new Date().toISOString(),
  };
}

function findEnding(endingId: string | null): Ending | null {
  if (!endingId) {
    return null;
  }

  return baseContent.endings.find((ending) => ending.id === endingId) ?? null;
}

export default function App() {
  const saveSystem = useMemo(() => createSaveSystem(window.localStorage), []);
  const [screen, setScreen] = useState<Screen>("start");
  const [run, setRun] = useState<RunState | null>(() =>
    saveSystem.loadCurrentRun(),
  );
  const [archive, setArchive] = useState<RunArchiveEntry[]>(() =>
    saveSystem.loadArchive(),
  );
  const [unlockedEndings, setUnlockedEndings] = useState<string[]>(() =>
    saveSystem.loadUnlockedEndings(),
  );

  const refreshMeta = () => {
    setArchive(saveSystem.loadArchive());
    setUnlockedEndings(saveSystem.loadUnlockedEndings());
  };

  const handleStart = (input: { seed: string; name: string }) => {
    const newRun = startRun(createNewRun(input), baseContent.events);
    saveSystem.saveCurrentRun(newRun);
    setRun(newRun);
    setScreen("play");
  };

  const handleChoice = (choiceId: string) => {
    if (!run) {
      return;
    }

    const nextRun = advanceRun(
      run,
      choiceId,
      baseContent.events,
      baseContent.endings,
    );
    setRun(nextRun);

    if (nextRun.status === "ended") {
      saveSystem.clearCurrentRun();
      const entry = createArchiveEntry(nextRun);
      if (entry) {
        saveSystem.appendArchive(entry);
        saveSystem.unlockEnding(entry.endingId);
      }
      refreshMeta();
      setScreen("ending");
      return;
    }

    saveSystem.saveCurrentRun(nextRun);
    setScreen("play");
  };

  const handleContinue = () => {
    const savedRun = saveSystem.loadCurrentRun();
    if (!savedRun) {
      return;
    }

    setRun(savedRun);
    setScreen(savedRun.status === "ended" ? "ending" : "play");
  };

  const handleArchive = () => {
    refreshMeta();
    setScreen("archive");
  };

  const handleRestart = () => {
    setRun(null);
    setScreen("setup");
  };

  if (screen === "setup") {
    return <SetupScreen onStart={handleStart} onBack={() => setScreen("start")} />;
  }

  if (screen === "play" && run) {
    return (
      <PlayScreen
        run={run}
        onArchive={handleArchive}
        onChoose={handleChoice}
        onRestart={handleRestart}
      />
    );
  }

  if (screen === "ending" && run) {
    return (
      <EndingScreen
        ending={findEnding(run.endingId)}
        run={run}
        onArchive={handleArchive}
        onRestart={handleRestart}
      />
    );
  }

  if (screen === "archive") {
    return (
      <ArchiveScreen
        archive={archive}
        endings={baseContent.endings}
        unlockedEndings={unlockedEndings}
        onBack={() => setScreen("start")}
      />
    );
  }

  return (
    <StartScreen
      archiveCount={archive.length}
      canContinue={run?.status === "playing"}
      unlockedCount={unlockedEndings.length}
      onArchive={handleArchive}
      onContinue={handleContinue}
      onNewLife={() => setScreen("setup")}
    />
  );
}
