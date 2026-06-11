import type { Ending } from "../../engine/types";

export const baseEndings: Ending[] = [
  {
    id: "ordinary_life",
    title: "平凡一生",
    body: "你的一生没有被写进宏大的叙事，但也真实地走过了许多选择、关系和遗憾。",
    priority: 1,
  },
  {
    id: "fulfilled_life",
    title: "丰盛人生",
    body: "你没有得到所有东西，但健康、关系和心态最终保持在一个相对圆满的位置。",
    priority: 12,
    conditions: [
      { type: "stat", stat: "family", op: ">=", value: 68 },
      { type: "stat", stat: "relationships", op: ">=", value: 62 },
      { type: "stat", stat: "mindset", op: ">=", value: 60 },
    ],
  },
  {
    id: "legendary_life",
    title: "传奇人生",
    body: "你的财富、名望和事业成就让许多人记住了你，但其中的代价只有你自己最清楚。",
    priority: 20,
    conditions: [
      { type: "stat", stat: "career", op: ">=", value: 72 },
      { type: "stat", stat: "wealth", op: ">=", value: 65 },
      { type: "stat", stat: "reputation", op: ">=", value: 55 },
    ],
  },
  {
    id: "fragile_life",
    title: "透支人生",
    body: "你一路往前冲，却让身体和精神长期处在欠债状态。人生最终变得脆弱而沉重。",
    priority: 9,
    conditions: [
      { type: "stat", stat: "health", op: "<=", value: 28 },
      { type: "stat", stat: "stress", op: ">=", value: 65 },
    ],
  },
  {
    id: "health_collapse",
    title: "健康崩塌",
    body: "一次严重健康危机提前结束了你的人生。那些被忽视的信号，最终变成无法回避的结局。",
    priority: 100,
  },
  {
    id: "accident",
    title: "意外终止",
    body: "高风险选择带来了无法挽回的后果。你的人生在一次意外中突然停止。",
    priority: 100,
  },
];
