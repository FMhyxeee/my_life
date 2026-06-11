import type { Ending } from "../../engine/types";

export const baseEndings: Ending[] = [
  {
    id: "ordinary_life",
    title: "平凡命",
    body: "你的一生没有被写进宏大的叙事。多数时候你只是顺着日子往前走，被时代推一把，被家人拉一把，被身体提醒一把。临到最后，你想起那句老话：万般都是命，半点不由人。",
    priority: 1,
  },
  {
    id: "fulfilled_life",
    title: "有福之命",
    body: "你没能把每条路都走好，却守住了几段重要的关系。所谓福气，不是事事如愿，而是在命运翻脸时仍有人坐在你身边。",
    priority: 18,
    conditions: [
      { type: "stat", stat: "family", op: ">=", value: 68 },
      { type: "stat", stat: "relationships", op: ">=", value: 62 },
      { type: "stat", stat: "mindset", op: ">=", value: 58 },
    ],
  },
  {
    id: "legendary_life",
    title: "被时代托起",
    body: "你踩中过几次浪头，也接住过几次贵人递来的梯子。别人说你会选择，你自己知道，许多关键处其实是命运先开了门。",
    priority: 24,
    conditions: [
      { type: "stat", stat: "career", op: ">=", value: 72 },
      { type: "stat", stat: "wealth", op: ">=", value: 62 },
      { type: "stat", stat: "reputation", op: ">=", value: 52 },
    ],
  },
  {
    id: "family_pillar",
    title: "家族支柱",
    body: "你把很多想去的地方、想做的事换成了家里的安稳。有人因此轻松一点，有人因此多走一步。你的命没有显赫，却成了别人的地基。",
    priority: 22,
    conditions: [
      { type: "stat", stat: "family", op: ">=", value: 78 },
      { type: "tag", tag: "world_care_chain", present: true },
    ],
  },
  {
    id: "wanderer_life",
    title: "半生漂泊",
    body: "你离开过很多地方，也没有真正抵达哪里。城市、工作、关系都像临时站台。你以为自己在选择远方，其实从出生那天起，脚下就少了一块能落稳的地。",
    priority: 17,
    conditions: [
      { type: "tag", tag: "rootless_child", present: true },
      { type: "tag", tag: "floating_youth", present: true },
    ],
  },
  {
    id: "debt_life",
    title: "一生偿债",
    body: "钱债、人情债、身体债、家族债，一笔笔排队来到你面前。你不是没努力，只是命运给你的账本从来比别人厚。",
    priority: 21,
    conditions: [
      { type: "tag", tag: "world_family_debt", present: true },
      { type: "stat", stat: "stress", op: ">=", value: 55 },
    ],
  },
  {
    id: "late_bloom_ending",
    title: "迟开的花",
    body: "你没有在年轻时成为别人期待的样子。许多年后，命运绕了一圈，才把一小束光放到你手里。它来得晚，但确实来过。",
    priority: 20,
    conditions: [
      { type: "tag", tag: "late_bloom", present: true },
      { type: "stat", stat: "mindset", op: ">=", value: 60 },
    ],
  },
  {
    id: "reconciled_life",
    title: "与命和解",
    body: "到最后你不再追问为什么是我，也不再把每个遗憾都算成失败。你承认有些东西半点不由人，也承认自己曾在缝隙里尽力活过。",
    priority: 23,
    conditions: [
      { type: "stat", stat: "mindset", op: ">=", value: 72 },
      { type: "tag", tag: "reconciled_elder", present: true },
    ],
  },
  {
    id: "lonely_success",
    title: "孤高之命",
    body: "你赢过许多场现实里的仗，却在人群散去后常常沉默。命运把奖杯给了你，也悄悄拿走了一些能分享奖杯的人。",
    priority: 19,
    conditions: [
      { type: "stat", stat: "career", op: ">=", value: 70 },
      { type: "stat", stat: "relationships", op: "<=", value: 35 },
    ],
  },
  {
    id: "fragile_life",
    title: "透支之命",
    body: "你一路往前冲，把身体和精神都当作可以延期支付的账。命运没有当场催收，但利息一直在涨。",
    priority: 16,
    conditions: [
      { type: "stat", stat: "health", op: "<=", value: 28 },
      { type: "stat", stat: "stress", op: ">=", value: 62 },
    ],
  },
  {
    id: "missed_tide",
    title: "错潮之人",
    body: "你几次站在潮水边，却总是慢一步、犹豫一下、或者被别的事拖住。后来别人说那是选择，你知道那更像命。",
    priority: 15,
    conditions: [
      { type: "tag", tag: "missed_housing_tide", present: true },
      { type: "tag", tag: "missed_ai_tide", present: true },
    ],
  },
  {
    id: "legacy_keeper",
    title: "留灯的人",
    body: "你没有把自己活成传奇，却把很多经验、故事和温柔留给后来的人。命运没有放过你，你也没有让后来的人空手上路。",
    priority: 18,
    conditions: [
      { type: "tag", tag: "legacy_keeper", present: true },
      { type: "stat", stat: "relationships", op: ">=", value: 55 },
    ],
  },
  {
    id: "health_collapse",
    title: "命薄如纸",
    body: "一次严重健康危机提前结束了你的人生。你曾以为自己还能再撑一阵，但身体替命运落了最后一笔。",
    priority: 100,
  },
  {
    id: "accident",
    title: "横祸断命",
    body: "高风险选择带来了无法挽回的后果。你的故事在一瞬间停住，像有人从书里撕走了后半页。",
    priority: 100,
  },
];
