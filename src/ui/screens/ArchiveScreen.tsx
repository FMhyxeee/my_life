import { ArrowLeft } from "lucide-react";
import type { Ending } from "../../engine/types";
import type { RunArchiveEntry } from "../../state/saveSystem";

function endingTitle(endings: Ending[], endingId: string): string {
  return endings.find((ending) => ending.id === endingId)?.title ?? endingId;
}

export function ArchiveScreen({
  archive,
  endings,
  onBack,
  unlockedEndings,
}: {
  archive: RunArchiveEntry[];
  endings: Ending[];
  onBack: () => void;
  unlockedEndings: string[];
}) {
  return (
    <main className="app-shell archive-layout">
      <header className="top-bar">
        <button className="icon-button" type="button" onClick={onBack}>
          <ArrowLeft aria-hidden="true" size={18} />
          <span>返回</span>
        </button>
        <div className="archive-counts">
          <span>{archive.length} 段人生</span>
          <span>{unlockedEndings.length} 个结局</span>
        </div>
      </header>
      <section className="archive-section">
        <h1>人生归档</h1>
        {archive.length === 0 ? (
          <p className="empty-text">暂无归档</p>
        ) : (
          <div className="archive-list">
            {archive.map((entry) => (
              <article className="archive-item" key={entry.runId}>
                <div>
                  <strong>{entry.name}</strong>
                  <span>{endingTitle(endings, entry.endingId)}</span>
                </div>
                <strong>{entry.finalScore}</strong>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
