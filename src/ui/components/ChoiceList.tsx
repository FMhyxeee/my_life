import { ArrowRight } from "lucide-react";
import type { Choice } from "../../engine/types";

export function ChoiceList({
  choices,
  onChoose,
}: {
  choices: Choice[];
  onChoose: (choiceId: string) => void;
}) {
  return (
    <div className="choice-list">
      {choices.map((choice) => (
        <button
          className="choice-button"
          key={choice.id}
          type="button"
          onClick={() => onChoose(choice.id)}
        >
          <span>{choice.text}</span>
          <ArrowRight aria-hidden="true" size={18} />
        </button>
      ))}
    </div>
  );
}
