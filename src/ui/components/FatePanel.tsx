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
  world_learning_track: "世界线：学习之路",
  world_honest_ladder: "世界线：正路积累",
  world_gray_money: "世界线：偏门钱路",
  world_tech_venture: "世界线：科技创业",
  world_legal_path: "世界线：法律之路",
  exam_focused: "分数烙印",
  unspoken_love: "未寄出的信",
  megacity_path: "大城路径",
  mortgage_chain: "房贷锁链",
  built_family: "筑家之人",
  caregiving_burden: "照护之责",
  late_bloom: "迟来开花",
  reconciled_elder: "晚年和解",
  legacy_keeper: "留灯之人",
  hidden_fate_line_found: "纸背暗线",
  study_encouraged: "被鼓励过",
  study_anxious: "惧怕点名",
  study_grit: "苦读痕迹",
  study_balanced: "保住节奏",
  study_second_chance: "重考一年",
  study_unfinished: "未竟学业",
  study_changed_path: "改换方向",
  study_pragmatic: "务实求证",
  love_brave_first: "勇敢告白",
  love_unsent_message: "未发送的心意",
  love_long_distance_kept: "两城相守",
  love_let_go: "体面放手",
  love_built_home: "共同成家",
  love_delayed_marriage: "婚事延后",
  love_repaired_middle: "中年修复",
  love_parallel_life: "并行生活",
  work_overtime_mark: "通宵加班",
  work_boundary_set: "工作边界",
  work_swallowed_grievance: "忍下委屈",
  work_left_bad_boss: "离开坏上司",
  work_promoted: "小小晋升",
  work_specialist_path: "专业路径",
  work_prepared_exit: "预备退路",
  work_layoff_hit: "裁撤波及",
  illness_child_survived: "童年高烧",
  illness_weak_constitution: "体质偏弱",
  illness_lifestyle_changed: "调整作息",
  illness_warning_ignored: "忽视警讯",
  illness_regular_screening: "规律筛查",
  illness_screening_avoided: "回避检查",
  illness_surgery_recovered: "术后恢复",
  illness_surgery_feared: "惧怕手术",
  travel_first_distance: "第一次远方",
  travel_homebound: "恋家旅人",
  travel_train_departure: "夜车远行",
  travel_returned_early: "中途折返",
  travel_restored_by_sea: "被海修复",
  travel_could_not_rest: "假期仍忙",
  travel_foreign_morning: "异城清晨",
  travel_kept_close: "谨慎旅程",
  wealth_honest_income: "正当收入",
  wealth_cash_shortcut: "现金捷径",
  wealth_clean_side_job: "清白副业",
  wealth_gray_income: "偏门钱路",
  wealth_risk_mark: "钱路风险",
  wealth_tech_degree: "技术学位",
  wealth_code_skill: "代码手艺",
  wealth_practical_skill: "实用手艺",
  wealth_tech_startup: "科技创业",
  wealth_technical_consulting: "技术顾问",
  wealth_lawyer_path: "法律职业",
  wealth_legal_assistant: "律所助理",
  wealth_clean_law_practice: "清白执业",
  wealth_legal_gray_edge: "法律灰线",
  wealth_clean_books: "账本清楚",
  wealth_hidden_books: "账本阴影",
  wealth_compound_interest: "复利慢路",
  wealth_leverage_bet: "杠杆赌局",
  stage_childhood_end_seen: "童年落幕",
  stage_teen_end_seen: "少年退场",
  stage_young_adult_end_seen: "青年余温",
  stage_middle_arrival_seen: "中年旧账",
  stage_elder_arrival_seen: "晚年回声",
  weather_soft_rain: "天气：细雨偏移",
  weather_clear_sun: "天气：晴日抬头",
  weather_hard_wind: "天气：大风改道",
  weather_sudden_cold: "天气：寒意压身",
  scene_neighborhood_corner: "场景：巷口停顿",
  scene_school_yard: "场景：操场边缘",
  scene_station_platform: "场景：站台岔路",
  scene_hospital_corridor: "场景：医院走廊",
  scene_old_street: "场景：旧街回声",
  era_policy_notice: "时代：政策通知",
  era_city_rebuild: "时代：城市更新",
  era_market_shift: "时代：市场转向",
  era_public_event: "时代：公共波动",
  fate_late_bus: "命运：晚到一班车",
  fate_wrong_turn: "命运：绕错路",
  fate_unexpected_help: "命运：意外援手",
  fate_missed_signal: "命运：错过信号",
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
  read_the_hidden_fate_line: "读到纸背那句话",
  teacher_sentence_kept: "记住老师那句话",
  burned_late_library: "自习室的灯",
  stood_before_exam_again: "再次站到考场前",
  first_heart_sent: "第一份心意发出",
  kept_two_city_love: "守过两座城市",
  middle_years_spoke_again: "中年重新开口",
  first_all_nighter: "第一次通宵",
  first_promotion_letter: "第一封晋升邮件",
  fever_left_shadow: "高烧留下影子",
  family_history_faced: "面对家族病史",
  first_trip_opened_world: "第一次看见远方",
  heard_sea_between_years: "在年份之间听海",
  first_clean_paycheck: "第一笔清白工资",
  tech_degree_earned: "拿到技术学位",
  first_product_launched: "第一个产品上线",
  law_exam_passed: "通过法律考试",
  clean_books_kept: "守住清楚账本",
  childhood_closed_quietly: "童年悄悄关门",
  teen_years_folded_away: "少年被折进风里",
  youth_warmth_kept: "收好青年余温",
  middle_years_accounts_opened: "摊开中年旧账",
  elder_echoes_arrived: "晚年回声抵达",
};

function humanize(value: string): string {
  return value
    .replace(/^world_/, "世界线：")
    .replace(/^weather_/, "天气：")
    .replace(/^scene_/, "场景：")
    .replace(/^era_/, "时代：")
    .replace(/^fate_/, "命运：")
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
