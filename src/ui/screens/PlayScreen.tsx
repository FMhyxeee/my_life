import { Archive, RotateCcw } from "lucide-react";
import type { RunState } from "../../engine/types";
import { AttributePanel } from "../components/AttributePanel";
import { EventCard } from "../components/EventCard";
import { FatePanel } from "../components/FatePanel";
import { LifeTimeline } from "../components/LifeTimeline";

export function PlayScreen({
  onArchive,
  onChoose,
  onRestart,
  run,
}: {
  onArchive: () => void;
  onChoose: (choiceId: string) => void;
  onRestart: () => void;
  run: RunState;
}) {
  return (
    <main className="app-shell play-layout">
      <header className="top-bar play-top-bar">
        <div>
          <span className="eyebrow">当前人生</span>
          <h1>{run.name}</h1>
        </div>
        <div className="top-actions">
          <button className="icon-button" type="button" onClick={onRestart}>
            <RotateCcw aria-hidden="true" size={18} />
            <span>重开</span>
          </button>
          <button className="icon-button" type="button" onClick={onArchive}>
            <Archive aria-hidden="true" size={18} />
            <span>归档</span>
          </button>
        </div>
      </header>
      <div className="play-grid">
        <AttributePanel mode="qualitative" stats={run.stats} />
        <div className="main-column">
          {run.currentEvent ? (
            <EventCard event={run.currentEvent} run={run} onChoose={onChoose} />
          ) : (
            <section className="event-card">
              <h2>人生暂停</h2>
            </section>
          )}
        </div>
        <div className="side-column">
          <FatePanel run={run} />
          <LifeTimeline history={run.history} />
        </div>
      </div>
    </main>
  );
}
