import type { RunState } from "../../engine/types";

const tagLabels: Record<string, string> = {
  supportive_family: "稳固家底",
  rootless_child: "漂泊底色",
  frail_start: "体弱开局",
  world_kind_home: "世界线：温厚之家",
  world_family_debt: "世界线：旧债随身",
  world_body_debt: "世界线：身体欠账",
  world_hometown_gravity: "世界线：故乡牵引",
  world_departure_signal: "世界线：远行召唤",
  world_factory_winter: "世界线：厂区寒意",
  world_silent_home: "世界线：沉默家庭",
  world_education_track: "世界线：教育竞速",
  world_exam_machine: "世界线：升学机器",
  world_side_path: "世界线：旁路人生",
  world_policy_shift: "世界线：政策改道",
  world_city_gate: "世界线：城市门槛",
  world_housing_tide: "世界线：房价浪潮",
  world_capital_wind: "世界线：资本风口",
  world_care_chain: "世界线：照护锁链",
  world_ai_tide: "世界线：技术潮汐",
  world_health_wave: "世界线：公共风波",
  world_slow_recession: "世界线：缓慢衰退",
  world_old_city: "世界线：旧城消失",
  exam_focused: "分数烙印",
  unspoken_love: "未寄出的信",
  megacity_path: "大城路径",
  mortgage_chain: "房贷锁链",
  built_family: "筑家之人",
  caregiving_burden: "照护之责",
  late_bloom: "迟来开花",
  reconciled_elder: "晚年和解",
  legacy_keeper: "留灯之人",
};

const milestoneLabels: Record<string, string> = {
  first_luck_was_shelter: "最初的运气是被接住",
  first_lesson_was_debt: "最早学会债会传下去",
  first_winter_survived: "熬过第一场寒冬",
  burned_for_the_exam: "为考试燃烧过",
  entered_megacity: "进入大城",
  signed_mortgage: "签下长期债约",
  made_a_large_bet: "押上过一段人生",
  old_debt_returned: "旧债在中年回来",
  bloomed_late: "迟来的开花",
  told_the_weight_of_fate: "把命运的重量讲给后来者",
};

function humanize(value: string): string {
  return value
    .replace(/^world_/, "世界线：")
    .replaceAll("_", " ");
}

function uniqueRecent(values: string[], limit: number): string[] {
  return Array.from(new Set(values)).slice(-limit).reverse();
}

export function FatePanel({ run }: { run: RunState }) {
  const tags = uniqueRecent(run.tags, 10);
  const milestones = uniqueRecent(run.milestones, 5);

  return (
    <section className="panel fate-panel" aria-label="命运线">
      <div className="panel-heading">
        <h2>命运线</h2>
      </div>
      {tags.length === 0 && milestones.length === 0 ? (
        <p className="empty-text">命数尚未显影</p>
      ) : (
        <div className="fate-list">
          {tags.map((item) => (
            <span
              className={item.startsWith("world_") ? "fate-pill world" : "fate-pill"}
              key={item}
            >
              {tagLabels[item] ?? humanize(item)}
            </span>
          ))}
          {milestones.map((item) => (
            <span className="fate-pill milestone" key={item}>
              {milestoneLabels[item] ?? humanize(item)}
            </span>
          ))}
        </div>
      )}
    </section>
  );
}
