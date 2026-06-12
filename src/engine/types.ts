export type LifeStage = "baby" | "child" | "teen" | "adult" | "middle" | "elder";

export type CoreStatKey =
  | "health"
  | "intelligence"
  | "charm"
  | "wealth"
  | "mindset"
  | "luck";

export type LongTermStatKey =
  | "education"
  | "career"
  | "family"
  | "relationships"
  | "reputation"
  | "risk"
  | "stress"
  | "classBackground";

export type StatKey = CoreStatKey | LongTermStatKey;

export type Stats = Record<StatKey, number>;

export type CompareOperator = ">" | ">=" | "<" | "<=" | "==" | "!=";

export type StatCondition = {
  type: "stat";
  stat: StatKey;
  op: CompareOperator;
  value: number;
};

export type TagCondition = {
  type: "tag";
  tag: string;
  present: boolean;
};

export type EventHistoryCondition = {
  type: "eventHappened";
  eventId: string;
  happened: boolean;
};

export type AgeCondition = {
  type: "age";
  min?: number;
  max?: number;
};

export type Condition =
  | StatCondition
  | TagCondition
  | EventHistoryCondition
  | AgeCondition;

export type StatEffect = {
  type: "stat";
  stat: StatKey;
  delta?: number;
  set?: number;
};

export type TagEffect = {
  type: "tag";
  tag: string;
  action: "add" | "remove";
};

export type MilestoneEffect = {
  type: "milestone";
  milestone: string;
};

export type AdvanceTimeEffect = {
  type: "advanceTime";
  years: number;
};

export type TriggerEndingEffect = {
  type: "triggerEnding";
  endingId: string;
};

export type Effect =
  | StatEffect
  | TagEffect
  | MilestoneEffect
  | AdvanceTimeEffect
  | TriggerEndingEffect;

export type Choice = {
  id: string;
  text: string;
  effects: Effect[];
};

export type EventTrigger = {
  minAge?: number;
  maxAge?: number;
  conditions?: Condition[];
};

export type LifeEvent = {
  id: string;
  stage: LifeStage | "any";
  title: string;
  body: string;
  trigger?: EventTrigger;
  weight: number;
  choices: Choice[];
  once?: boolean;
  milestone?: boolean;
  fallback?: boolean;
  hidden?: boolean;
};

export type Ending = {
  id: string;
  title: string;
  body: string;
  conditions?: Condition[];
  priority?: number;
};

export type LifeHistoryEntry = {
  age: number;
  stage: LifeStage;
  eventId: string;
  eventTitle: string;
  choiceId: string;
  choiceText: string;
};

export type RunStatus = "playing" | "ended";

export type RunState = {
  id: string;
  seed: string;
  rngState: number;
  name: string;
  currentAge: number;
  currentStage: LifeStage;
  stats: Stats;
  tags: string[];
  milestones: string[];
  seenEventIds: string[];
  history: LifeHistoryEntry[];
  currentEvent: LifeEvent | null;
  pendingEndingId: string | null;
  endingId: string | null;
  finalScore: number | null;
  status: RunStatus;
  createdAt: string;
  updatedAt: string;
};
