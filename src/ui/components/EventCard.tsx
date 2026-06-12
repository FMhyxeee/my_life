import type { LifeEvent, RunState } from "../../engine/types";
import { ChoiceList } from "./ChoiceList";

const stageLabels: Record<RunState["currentStage"], string> = {
  baby: "婴幼年",
  child: "童年",
  teen: "少年",
  adult: "成年",
  middle: "中年",
  elder: "晚年",
};

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
    <section className={event.interlude ? "event-card interlude-card" : "event-card"}>
      <div className="event-meta">
        <span>{run.currentAge} 岁</span>
        <span>{event.interlude ? "人生阶段" : stageLabels[run.currentStage]}</span>
      </div>
      <h2>{event.title}</h2>
      <p>{event.body}</p>
      <ChoiceList choices={event.choices} onChoose={onChoose} />
    </section>
  );
}
