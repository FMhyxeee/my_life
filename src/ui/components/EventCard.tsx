import type { LifeEvent, RunState } from "../../engine/types";
import { ChoiceList } from "./ChoiceList";

export function EventCard({
  event,
  run,
  onChoose,
}: {
  event: LifeEvent;
  run: RunState;
  onChoose: (choiceId: string) => void;
}) {
  return (
    <section className="event-card">
      <div className="event-meta">
        <span>{run.currentAge} 岁</span>
        <span>{run.currentStage}</span>
      </div>
      <h2>{event.title}</h2>
      <p>{event.body}</p>
      <ChoiceList choices={event.choices} onChoose={onChoose} />
    </section>
  );
}
