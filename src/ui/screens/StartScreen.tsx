import { Archive, Play, RotateCcw, Sparkles } from "lucide-react";

export function StartScreen({
  archiveCount,
  canContinue,
  unlockedCount,
  onArchive,
  onContinue,
  onNewLife,
}: {
  archiveCount: number;
  canContinue: boolean;
  unlockedCount: number;
  onArchive: () => void;
  onContinue: () => void;
  onNewLife: () => void;
}) {
  return (
    <main className="app-shell start-layout">
      <section className="start-main">
        <div className="brand-mark" aria-hidden="true">
          <Sparkles size={28} />
        </div>
        <h1>人生模拟器</h1>
        <p className="lead">
          从出生开始，在选择、运气和长期状态里走完一段人生。
        </p>
        <div className="primary-actions">
          <button className="primary-button" type="button" onClick={onNewLife}>
            <Play aria-hidden="true" size={18} />
            新的人生
          </button>
          <button
            className="secondary-button"
            type="button"
            onClick={onContinue}
            disabled={!canContinue}
          >
            <RotateCcw aria-hidden="true" size={18} />
            继续
          </button>
          <button className="secondary-button" type="button" onClick={onArchive}>
            <Archive aria-hidden="true" size={18} />
            归档
          </button>
        </div>
      </section>
      <aside className="start-stats">
        <div>
          <span>已解锁结局</span>
          <strong>{unlockedCount}</strong>
        </div>
        <div>
          <span>归档人生</span>
          <strong>{archiveCount}</strong>
        </div>
      </aside>
    </main>
  );
}
