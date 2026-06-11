import type { LifeHistoryEntry } from "../../engine/types";

export function LifeTimeline({ history }: { history: LifeHistoryEntry[] }) {
  return (
    <section className="panel timeline-panel" aria-label="人生记录">
      <div className="panel-heading">
        <h2>记录</h2>
      </div>
      {history.length === 0 ? (
        <p className="empty-text">尚无记录</p>
      ) : (
        <ol className="timeline-list">
          {history
            .slice()
            .reverse()
            .slice(0, 8)
            .map((entry, index) => (
              <li key={`${entry.eventId}-${entry.choiceId}-${index}`}>
                <span>{entry.age} 岁</span>
                <strong>{entry.eventTitle}</strong>
                <p>{entry.choiceText}</p>
              </li>
            ))}
        </ol>
      )}
    </section>
  );
}
