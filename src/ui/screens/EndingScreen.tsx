import { Archive, RotateCcw } from "lucide-react";
import type { Ending, RunState } from "../../engine/types";
import { AttributePanel } from "../components/AttributePanel";
import { FatePanel } from "../components/FatePanel";
import { LifeTimeline } from "../components/LifeTimeline";

export function EndingScreen({
  ending,
  onArchive,
  onRestart,
  run,
}: {
  ending: Ending | null;
  onArchive: () => void;
  onRestart: () => void;
  run: RunState;
}) {
  return (
    <main className="app-shell ending-layout">
      <section className="ending-summary">
        <span className="eyebrow">{run.currentAge} 岁</span>
        <h1>{ending?.title ?? "人生终章"}</h1>
        <p>{ending?.body ?? "这一段人生已经结束。"}</p>
        <div className="score-strip">
          <span>总评</span>
          <strong>{run.finalScore ?? 0}</strong>
        </div>
        <div className="primary-actions">
          <button className="primary-button" type="button" onClick={onRestart}>
            <RotateCcw aria-hidden="true" size={18} />
            再来一次
          </button>
          <button className="secondary-button" type="button" onClick={onArchive}>
            <Archive aria-hidden="true" size={18} />
            查看归档
          </button>
        </div>
      </section>
      <div className="ending-grid">
        <AttributePanel stats={run.stats} />
        <div className="side-column">
          <FatePanel run={run} />
          <LifeTimeline history={run.history} />
        </div>
      </div>
    </main>
  );
}
