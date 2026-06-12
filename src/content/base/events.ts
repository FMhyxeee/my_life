import { getLifeStage } from "../../engine/stage";
import type { Effect, LifeEvent, LifeStage, StatKey } from "../../engine/types";

const stat = (key: StatKey, delta: number): Effect => ({
  type: "stat",
  stat: key,
  delta,
});

const tag = (name: string): Effect => ({
  type: "tag",
  tag: name,
  action: "add",
});

const milestone = (name: string): Effect => ({
  type: "milestone",
  milestone: name,
});

const years = (_value: number): Effect => ({ type: "advanceTime", years: 1 });
const end = (endingId: string): Effect => ({ type: "triggerEnding", endingId });

const stageAnnualTitles: Record<LifeStage, string> = {
  baby: "襁褓余声",
  child: "院墙与课本",
  teen: "分数与风",
  adult: "城中微澜",
  middle: "旧账新债",
  elder: "暮色长明",
};

const annualBodies: Record<LifeStage, string[]> = {
  baby: [
    "这一年，你还不懂命是什么，只记得灯光、手心和忽远忽近的哭声。大人替你做决定，命也替你把路往前推了一寸。",
    "这一年，家里人的语气比天气更能决定你的世界。你学会用哭声回应饥饿，也学会在安静里等人靠近。",
    "这一年，你在许多怀抱之间长大。有人说小孩子没有记忆，可命运已经把温度和缺口都记在了身上。",
  ],
  child: [
    "这一年，作业本、巷口和饭桌上的话一起长进你的身体。你以为自己在挑选爱好，其实很多门已经先替你开了或关了。",
    "这一年，你开始知道比较。别人的新书包、自己的旧铅笔、老师的一句夸奖，都像小石子落进命里的水面。",
    "这一年，童年没有大事，却有许多小小的偏向。你朝某个人靠近，离另一条路远了一点。",
  ],
  teen: [
    "这一年，分数像一把尺，量你，也量你的家。你努力把未来握紧，可命运总从指缝里漏出几粒沙。",
    "这一年，你开始和自己较劲。喜欢、羞耻、野心和恐惧挤在同一张课桌上，谁也不肯先让座。",
    "这一年，很多话没有说出口。它们沉下去，变成日后某次选择时忽然冒出的念头。",
  ],
  adult: [
    "这一年，你在城市的缝隙里赶路。工资、房租、人情和身体轮流催促，你以为是在选择，其实是在偿还前面的命数。",
    "这一年，机会来得不响，压力走得也不响。你把许多委屈折起来收好，像收一张暂时还不能兑现的票。",
    "这一年，世界线轻轻偏了一下。没有人宣布改变，可你已经站在另一种生活的入口边。",
  ],
  middle: [
    "这一年，旧账开始有回声。身体、家庭、事业和未完成的愿望一起坐到桌前，等你给一个交代。",
    "这一年，你更少谈梦想，更多计算风险。命运不再像门外的风，倒像屋里的钟，一声一声催人。",
    "这一年，你发现许多选择不是为了赢，只是为了不让某些东西继续塌下去。",
  ],
  elder: [
    "这一年，日子慢下来，许多往事却走得更近。你回看一生，才发现有些岔路从来不是自己修的。",
    "这一年，你把名字、旧物和几句叮嘱留给后来的人。命运收走力气，也留下回声。",
    "这一年，风从窗边过去。你不再急着证明什么，只偶尔想起当年若是另一场雨，人生会不会不同。",
  ],
};

const annualEffects = (stage: LifeStage): Effect[] => {
  const effectsByStage: Record<LifeStage, Effect[]> = {
    baby: [stat("family", 1), stat("stress", 1)],
    child: [stat("education", 2), stat("relationships", 1), stat("stress", 1)],
    teen: [stat("education", 2), stat("mindset", -1), stat("stress", 2)],
    adult: [stat("career", 2), stat("wealth", 1), stat("health", -1), stat("stress", 2)],
    middle: [stat("family", 1), stat("career", 1), stat("health", -2), stat("stress", 1)],
    elder: [stat("mindset", 1), stat("family", 1), stat("health", -2), stat("reputation", 1)],
  };

  return [...effectsByStage[stage], tag("ordinary_years_accumulated"), years(1)];
};

const annualFallbackEvents: LifeEvent[] = Array.from(
  { length: 89 },
  (_, index) => {
    const age = index + 1;
    const stage = getLifeStage(age);
    const bodies = annualBodies[stage];

    return {
      id: `annual_year_${age}`,
      stage,
      title: `${age}岁：${stageAnnualTitles[stage]}`,
      body: bodies[age % bodies.length],
      trigger: { minAge: age, maxAge: age },
      weight: 1,
      fallback: true,
      choices: [
        {
          id: "follow_this_year",
          text: "顺着这一年的命数走",
          effects: annualEffects(stage),
        },
      ],
    };
  },
);

export const baseEvents: LifeEvent[] = [
  {
    id: "birth_fate_lot",
    stage: "baby",
    title: "命盘初定",
    body: "你出生那天，窗外下着小雨。长辈说孩子哭声亮，命硬；母亲只觉得日子还长。很多东西在你还不会说话时就已经落定，万般都是命，半点不由人。",
    trigger: { minAge: 0, maxAge: 2 },
    weight: 100,
    once: true,
    milestone: true,
    choices: [
      {
        id: "held_by_many_hands",
        text: "被许多双手稳稳接住",
        effects: [
          stat("family", 10),
          stat("mindset", 6),
          stat("classBackground", 5),
          tag("supportive_family"),
          tag("world_kind_home"),
          milestone("first_luck_was_shelter"),
          years(4),
        ],
      },
      {
        id: "born_between_moves",
        text: "在搬家和欠账声里长大",
        effects: [
          stat("stress", 10),
          stat("luck", 4),
          stat("classBackground", -8),
          tag("rootless_child"),
          tag("world_family_debt"),
          milestone("first_lesson_was_debt"),
          years(4),
        ],
      },
      {
        id: "frail_first_winter",
        text: "熬过一场虚弱的初冬",
        effects: [
          stat("health", -8),
          stat("family", 6),
          stat("risk", 6),
          tag("frail_start"),
          tag("world_body_debt"),
          milestone("first_winter_survived"),
          years(4),
        ],
      },
    ],
  },
  {
    id: "child_hometown_roads",
    stage: "child",
    title: "巷口的路",
    body: "你家门口有两条路。一条通向学校，一条通向车站。你不知道自己以后会反复在这两条路之间做选择。",
    trigger: { minAge: 3, maxAge: 9 },
    weight: 28,
    once: true,
    choices: [
      {
        id: "stay_in_lane",
        text: "沿着熟悉的路去学校",
        effects: [
          stat("education", 8),
          stat("family", 4),
          tag("hometown_tie"),
          tag("world_hometown_gravity"),
          years(3),
        ],
      },
      {
        id: "watch_the_station",
        text: "站在车站边看远方的人",
        effects: [
          stat("mindset", 5),
          stat("charm", 3),
          stat("relationships", -2),
          tag("wanderer_seed"),
          tag("world_departure_signal"),
          years(3),
        ],
      },
    ],
  },
  {
    id: "child_books_or_yard",
    stage: "child",
    title: "书页与院子",
    body: "有些下午适合读书，有些下午适合奔跑。你以为这只是兴趣，后来才知道，人会被童年的注意力牵着走很久。",
    trigger: { minAge: 5, maxAge: 12 },
    weight: 24,
    once: true,
    choices: [
      {
        id: "bookish_child",
        text: "把自己藏进书页里",
        effects: [
          stat("intelligence", 9),
          stat("education", 10),
          stat("relationships", -2),
          tag("bookish_child"),
          milestone("learned_to_hide_in_books"),
          years(3),
        ],
      },
      {
        id: "yard_child",
        text: "跟着孩子们跑遍院子",
        effects: [
          stat("health", 6),
          stat("charm", 6),
          stat("relationships", 7),
          tag("social_child"),
          milestone("learned_to_read_people"),
          years(3),
        ],
      },
    ],
  },
  {
    id: "child_parent_layoff",
    stage: "child",
    title: "饭桌上的沉默",
    body: "某天晚饭，父亲或母亲比平时回来得早。大人们不说发生了什么，但你听懂了碗筷之间的沉默。",
    trigger: { minAge: 7, maxAge: 12 },
    weight: 18,
    once: true,
    choices: [
      {
        id: "become_sensible",
        text: "早早学会懂事",
        effects: [
          stat("stress", 9),
          stat("family", 5),
          stat("mindset", -2),
          tag("early_sensible"),
          tag("world_factory_winter"),
          years(3),
        ],
      },
      {
        id: "pretend_not_to_know",
        text: "假装什么都没听见",
        effects: [
          stat("mindset", 4),
          stat("family", -4),
          stat("relationships", 2),
          tag("avoidant_heart"),
          tag("world_silent_home"),
          years(3),
        ],
      },
    ],
  },
  {
    id: "child_teacher_notice",
    stage: "child",
    title: "被老师点名",
    body: "老师把你的作业拿给全班看。那一刻你分不清是骄傲还是害怕，只觉得命运忽然看了你一眼。",
    trigger: {
      minAge: 8,
      maxAge: 12,
      conditions: [{ type: "stat", stat: "education", op: ">=", value: 8 }],
    },
    weight: 20,
    once: true,
    choices: [
      {
        id: "accept_attention",
        text: "接住这份期待",
        effects: [
          stat("education", 8),
          stat("reputation", 4),
          stat("stress", 4),
          tag("teacher_expectation"),
          tag("world_education_track"),
          years(2),
        ],
      },
      {
        id: "fear_attention",
        text: "开始害怕被看见",
        effects: [
          stat("education", 4),
          stat("mindset", -4),
          stat("stress", 6),
          tag("fear_of_attention"),
          years(2),
        ],
      },
    ],
  },
  {
    id: "teen_exam_machine",
    stage: "teen",
    title: "升学机器",
    body: "排名、补课、志愿表和亲戚的比较挤在一起。所有人都说努力能改命，但没有人说起点不同会让努力变得多重。",
    trigger: { minAge: 13, maxAge: 18 },
    weight: 34,
    once: true,
    milestone: true,
    choices: [
      {
        id: "grind_for_score",
        text: "把自己拧进分数里",
        effects: [
          stat("education", 18),
          stat("stress", 12),
          stat("health", -4),
          tag("exam_focused"),
          tag("world_exam_machine"),
          milestone("burned_for_the_exam"),
          years(4),
        ],
      },
      {
        id: "keep_breathing",
        text: "保住节奏，也保住自己",
        effects: [
          stat("education", 9),
          stat("mindset", 6),
          stat("relationships", 4),
          tag("balanced_teen"),
          years(4),
        ],
      },
      {
        id: "leave_the_track",
        text: "不愿被一张卷子定义",
        effects: [
          stat("charm", 7),
          stat("mindset", 8),
          stat("education", -3),
          stat("risk", 7),
          tag("independent_teen"),
          tag("world_side_path"),
          years(4),
        ],
      },
    ],
  },
  {
    id: "teen_friend_fork",
    stage: "teen",
    title: "同桌的岔路",
    body: "你的同桌忽然退学，去跟亲戚学手艺。你们在校门口分别，谁也不知道哪条路更像出路。",
    trigger: { minAge: 14, maxAge: 18 },
    weight: 16,
    once: true,
    choices: [
      {
        id: "stay_with_books",
        text: "留在课桌前",
        effects: [
          stat("education", 8),
          stat("relationships", -3),
          tag("stayed_on_track"),
          milestone("watched_a_friend_leave"),
          years(2),
        ],
      },
      {
        id: "envy_other_road",
        text: "第一次羡慕另一种活法",
        effects: [
          stat("mindset", 5),
          stat("risk", 5),
          tag("envied_side_road"),
          tag("world_side_path"),
          years(2),
        ],
      },
    ],
  },
  {
    id: "teen_first_love",
    stage: "teen",
    title: "未寄出的信",
    body: "你喜欢上一个人，信写了三遍都没寄出去。青春像一列误点的车，你追不上，也舍不得走。",
    trigger: { minAge: 15, maxAge: 18 },
    weight: 14,
    once: true,
    choices: [
      {
        id: "hide_the_letter",
        text: "把信夹进书里",
        effects: [
          stat("mindset", -2),
          stat("education", 4),
          tag("unspoken_love"),
          milestone("first_unsent_letter"),
          years(2),
        ],
      },
      {
        id: "send_the_letter",
        text: "把信递出去",
        effects: [
          stat("charm", 5),
          stat("relationships", 6),
          stat("stress", 3),
          tag("brave_first_love"),
          years(2),
        ],
      },
    ],
  },
  {
    id: "teen_policy_shift",
    stage: "teen",
    title: "政策风向",
    body: "某年，考试政策和城市招生名额突然调整。你第一次感到，所谓选择，经常只是时代先替你挪了棋盘。",
    trigger: { minAge: 16, maxAge: 19 },
    weight: 12,
    once: true,
    choices: [
      {
        id: "chase_new_rule",
        text: "立刻跟着新规则调整",
        effects: [
          stat("education", 7),
          stat("stress", 6),
          tag("rule_follower"),
          tag("world_policy_shift"),
          years(2),
        ],
      },
      {
        id: "miss_new_rule",
        text: "慢了一步，错过窗口",
        effects: [
          stat("education", -5),
          stat("mindset", -4),
          stat("luck", -3),
          tag("missed_policy_window"),
          tag("world_policy_shift"),
          years(2),
        ],
      },
    ],
  },
  {
    id: "adult_city_gate",
    stage: "adult",
    title: "城市的门",
    body: "你拖着行李站在大城市的出口。灯很亮，人很多，机会和房租一起张开嘴。",
    trigger: { minAge: 19, maxAge: 30 },
    weight: 30,
    once: true,
    milestone: true,
    choices: [
      {
        id: "enter_megacity",
        text: "留下来，挤进这座城",
        effects: [
          stat("career", 12),
          stat("wealth", -5),
          stat("stress", 8),
          tag("megacity_path"),
          tag("world_city_gate"),
          milestone("entered_megacity"),
          years(5),
        ],
      },
      {
        id: "return_hometown",
        text: "回去，先站稳脚跟",
        effects: [
          stat("family", 8),
          stat("wealth", 3),
          stat("career", 4),
          tag("hometown_return"),
          tag("world_hometown_gravity"),
          years(5),
        ],
      },
      {
        id: "float_between",
        text: "两边都不舍得，先漂着",
        effects: [
          stat("risk", 8),
          stat("mindset", 4),
          stat("relationships", -5),
          tag("floating_youth"),
          tag("world_departure_signal"),
          years(5),
        ],
      },
    ],
  },
  {
    id: "adult_first_job",
    stage: "adult",
    title: "第一份长期工作",
    body: "你拿到一份看起来稳定的工作。合同很薄，现实很厚。有人说这是开始，有人说这就是一辈子。",
    trigger: { minAge: 21, maxAge: 34 },
    weight: 26,
    once: true,
    choices: [
      {
        id: "steady_job",
        text: "接受稳定，把日子排好",
        effects: [
          stat("career", 14),
          stat("wealth", 8),
          stat("stress", 5),
          tag("steady_worker"),
          milestone("first_stable_job"),
          years(6),
        ],
      },
      {
        id: "jump_for_growth",
        text: "跳去更快的行业",
        effects: [
          stat("career", 10),
          stat("wealth", 4),
          stat("risk", 10),
          tag("growth_chaser"),
          tag("world_capital_wind"),
          years(6),
        ],
      },
    ],
  },
  {
    id: "adult_housing_tide",
    stage: "adult",
    title: "房价浪潮",
    body: "房价像潮水一样涨上来。你不买，像错过；你买，又像被套住。很多人的命运从一纸贷款开始转弯。",
    trigger: { minAge: 25, maxAge: 40 },
    weight: 22,
    once: true,
    choices: [
      {
        id: "take_mortgage",
        text: "咬牙上车",
        effects: [
          stat("wealth", 8),
          stat("stress", 14),
          stat("risk", 8),
          tag("mortgage_chain"),
          tag("world_housing_tide"),
          milestone("signed_mortgage"),
          years(6),
        ],
      },
      {
        id: "rent_and_wait",
        text: "继续租房，等一个更好的时机",
        effects: [
          stat("wealth", -3),
          stat("mindset", 5),
          stat("luck", 3),
          tag("missed_housing_tide"),
          tag("world_housing_tide"),
          years(6),
        ],
      },
    ],
  },
  {
    id: "adult_relationship_crossroad",
    stage: "adult",
    title: "亲密关系的账",
    body: "爱不是只在心里发生。它会落到城市、房子、父母、孩子、时间和钱上。",
    trigger: { minAge: 26, maxAge: 42 },
    weight: 20,
    once: true,
    choices: [
      {
        id: "build_family",
        text: "把两个人过成一家人",
        effects: [
          stat("family", 14),
          stat("relationships", 8),
          stat("stress", 6),
          tag("built_family"),
          tag("world_care_chain"),
          milestone("built_a_home"),
          years(7),
        ],
      },
      {
        id: "stay_single",
        text: "把人生先交还给自己",
        effects: [
          stat("mindset", 9),
          stat("career", 5),
          stat("family", -5),
          tag("self_kept"),
          years(7),
        ],
      },
    ],
  },
  {
    id: "adult_noble_person",
    stage: "adult",
    title: "贵人或偶然",
    body: "一个前辈在饭局上替你说了句话。你知道自己努力过，但也知道这句话不来，门就不会开。",
    trigger: {
      minAge: 24,
      maxAge: 42,
      conditions: [{ type: "stat", stat: "luck", op: ">=", value: 55 }],
    },
    weight: 14,
    once: true,
    choices: [
      {
        id: "accept_help",
        text: "接住这次顺风",
        effects: [
          stat("career", 14),
          stat("reputation", 8),
          stat("relationships", 5),
          tag("patron_found"),
          tag("world_capital_wind"),
          milestone("door_opened_by_another"),
          years(4),
        ],
      },
      {
        id: "refuse_favor",
        text: "不想欠这份人情",
        effects: [
          stat("mindset", 8),
          stat("career", 3),
          stat("relationships", -4),
          tag("clean_hands"),
          years(4),
        ],
      },
    ],
  },
  {
    id: "adult_startup_bet",
    stage: "adult",
    title: "创业局",
    body: "朋友说风口来了，再晚就没有位置。你看着存款和机会，忽然明白所谓逆天改命，多半先要把自己押上去。",
    trigger: { minAge: 26, maxAge: 38 },
    weight: 18,
    once: true,
    choices: [
      {
        id: "bet_on_startup",
        text: "押上几年，赌一次",
        effects: [
          stat("career", 12),
          stat("wealth", -10),
          stat("risk", 20),
          stat("reputation", 6),
          tag("risk_taker"),
          tag("world_capital_wind"),
          milestone("made_a_large_bet"),
          years(5),
        ],
      },
      {
        id: "keep_salary",
        text: "留在工资里慢慢攒",
        effects: [
          stat("wealth", 8),
          stat("career", 5),
          stat("risk", -3),
          tag("salary_anchor"),
          years(5),
        ],
      },
    ],
  },
  {
    id: "adult_ai_tide",
    stage: "adult",
    title: "新技术潮",
    body: "一场技术浪潮忽然越过行业边界。有人被托起，有人被替代。它不像命运，却比命运来得更快。",
    trigger: { minAge: 28, maxAge: 48 },
    weight: 18,
    once: true,
    choices: [
      {
        id: "learn_new_tool",
        text: "硬着头皮重新学习",
        effects: [
          stat("education", 8),
          stat("career", 10),
          stat("stress", 5),
          tag("adapted_to_ai"),
          tag("world_ai_tide"),
          years(4),
        ],
      },
      {
        id: "wait_it_out",
        text: "相信风会过去",
        effects: [
          stat("career", -6),
          stat("mindset", -3),
          stat("risk", 8),
          tag("missed_ai_tide"),
          tag("world_ai_tide"),
          years(4),
        ],
      },
    ],
  },
  {
    id: "adult_parent_illness",
    stage: "adult",
    title: "父母的病历",
    body: "一张病历把你从自己的计划里拽出来。你忽然发现，人生不是一条个人曲线，它还连着上一代的身体。",
    trigger: { minAge: 30, maxAge: 48 },
    weight: 16,
    once: true,
    choices: [
      {
        id: "become_caregiver",
        text: "把时间让给照护",
        effects: [
          stat("family", 14),
          stat("career", -6),
          stat("stress", 12),
          stat("wealth", -8),
          tag("caregiving_burden"),
          tag("world_care_chain"),
          years(5),
        ],
      },
      {
        id: "pay_for_care",
        text: "用钱换专业照护",
        effects: [
          stat("wealth", -14),
          stat("career", 4),
          stat("family", 5),
          tag("paid_for_care"),
          tag("world_care_chain"),
          years(5),
        ],
      },
    ],
  },
  {
    id: "adult_public_health_wave",
    stage: "adult",
    title: "公共健康风波",
    body: "城市忽然慢下来。办公室、医院、亲友群和新闻推送一起挤进生活。世界线不是背景，它会直接伸手推你。",
    trigger: { minAge: 25, maxAge: 55 },
    weight: 12,
    once: true,
    choices: [
      {
        id: "protect_family",
        text: "优先保护家人",
        effects: [
          stat("family", 8),
          stat("health", 5),
          stat("career", -4),
          stat("stress", 8),
          tag("family_first_crisis"),
          tag("world_health_wave"),
          years(3),
        ],
      },
      {
        id: "keep_working",
        text: "继续保住工作节奏",
        effects: [
          stat("career", 8),
          stat("health", -5),
          stat("stress", 10),
          tag("worked_through_crisis"),
          tag("world_health_wave"),
          years(3),
        ],
      },
    ],
  },
  {
    id: "middle_recession_notice",
    stage: "middle",
    title: "寒意通知",
    body: "公司群里发出一封措辞客气的邮件。时代不说自己冷，只让每个人回家数存款。",
    trigger: { minAge: 45, maxAge: 60 },
    weight: 22,
    once: true,
    choices: [
      {
        id: "accept_cut",
        text: "接受降薪，先活下来",
        effects: [
          stat("wealth", -8),
          stat("career", -4),
          stat("stress", 8),
          tag("survived_paycut"),
          tag("world_slow_recession"),
          years(4),
        ],
      },
      {
        id: "leave_company",
        text: "离开这条船",
        effects: [
          stat("career", -10),
          stat("risk", 10),
          stat("mindset", 6),
          tag("midlife_departure"),
          tag("world_slow_recession"),
          years(4),
        ],
      },
    ],
  },
  {
    id: "middle_body_warning",
    stage: "middle",
    title: "体检红字",
    body: "体检报告上出现几个红色箭头。你盯着它们，像盯着命运提前写好的批注。",
    trigger: { minAge: 42, maxAge: 64 },
    weight: 20,
    once: true,
    choices: [
      {
        id: "change_rhythm",
        text: "真正调整生活节奏",
        effects: [
          stat("health", 14),
          stat("stress", -8),
          stat("career", -4),
          tag("health_reckoning"),
          milestone("listened_to_the_body"),
          years(5),
        ],
      },
      {
        id: "ignore_warning",
        text: "先忙完这一阵再说",
        effects: [
          stat("health", -12),
          stat("career", 8),
          stat("stress", 10),
          tag("ignored_body_warning"),
          years(5),
        ],
      },
    ],
  },
  {
    id: "middle_child_or_legacy",
    stage: "middle",
    title: "下一代的门票",
    body: "如果你有孩子，教育像一场新的长跑；如果没有，你也会把某种期待投向后来的人。",
    trigger: { minAge: 42, maxAge: 60 },
    weight: 16,
    once: true,
    choices: [
      {
        id: "invest_next_generation",
        text: "把资源压到下一代",
        effects: [
          stat("wealth", -12),
          stat("family", 12),
          stat("stress", 6),
          tag("next_generation_bet"),
          tag("world_education_track"),
          years(5),
        ],
      },
      {
        id: "teach_without_owning",
        text: "把经验交给更年轻的人",
        effects: [
          stat("reputation", 8),
          stat("relationships", 8),
          stat("mindset", 6),
          tag("mentor_late_life"),
          years(5),
        ],
      },
    ],
  },
  {
    id: "middle_old_love_message",
    stage: "middle",
    title: "旧人来信",
    body: "多年未见的人发来消息。你们都绕了很远的路，才发现当年的遗憾没有消失，只是换了名字。",
    trigger: {
      minAge: 40,
      maxAge: 62,
      conditions: [{ type: "tag", tag: "unspoken_love", present: true }],
    },
    weight: 12,
    once: true,
    choices: [
      {
        id: "reply_gently",
        text: "温和地回信",
        effects: [
          stat("mindset", 8),
          stat("relationships", 4),
          tag("made_peace_with_youth"),
          milestone("answered_the_old_letter"),
          years(3),
        ],
      },
      {
        id: "leave_unread",
        text: "不再打开那扇门",
        effects: [
          stat("mindset", -3),
          stat("family", 4),
          tag("sealed_old_door"),
          years(3),
        ],
      },
    ],
  },
  {
    id: "middle_debt_returns",
    stage: "middle",
    title: "旧债回来",
    body: "年轻时欠下的账单，以另一种形式回来。它可能是钱，可能是关系，也可能是身体。",
    trigger: {
      minAge: 42,
      maxAge: 64,
      conditions: [{ type: "tag", tag: "world_family_debt", present: true }],
    },
    weight: 15,
    once: true,
    choices: [
      {
        id: "pay_old_debt",
        text: "一点点偿还",
        effects: [
          stat("wealth", -10),
          stat("family", 8),
          stat("mindset", 3),
          tag("debt_paid_in_middle_age"),
          milestone("old_debt_returned"),
          years(4),
        ],
      },
      {
        id: "roll_debt_forward",
        text: "把债往后推",
        effects: [
          stat("wealth", 4),
          stat("risk", 12),
          stat("stress", 10),
          tag("debt_rolled_forward"),
          years(4),
        ],
      },
    ],
  },
  {
    id: "middle_second_bloom",
    stage: "middle",
    title: "迟来的开花",
    body: "你以为一些门早已关上，直到某天，一个小机会从门缝里递进来。命运偶尔也会迟到。",
    trigger: {
      minAge: 45,
      maxAge: 64,
      conditions: [{ type: "stat", stat: "mindset", op: ">=", value: 62 }],
    },
    weight: 14,
    once: true,
    choices: [
      {
        id: "try_again",
        text: "再试一次",
        effects: [
          stat("career", 10),
          stat("reputation", 8),
          stat("stress", 4),
          tag("late_bloom"),
          milestone("bloomed_late"),
          years(5),
        ],
      },
      {
        id: "keep_small_happiness",
        text: "不追了，守住小日子",
        effects: [
          stat("mindset", 10),
          stat("family", 5),
          stat("health", 5),
          tag("small_happiness_kept"),
          years(5),
        ],
      },
    ],
  },
  {
    id: "elder_old_city",
    stage: "elder",
    title: "旧城拆迁",
    body: "你年轻时走过的街被围挡遮住。城市更新很快，记忆没有安置房。",
    trigger: { minAge: 65 },
    weight: 18,
    once: true,
    choices: [
      {
        id: "keep_photos",
        text: "把旧地方拍下来",
        effects: [
          stat("mindset", 5),
          stat("relationships", 3),
          tag("memory_keeper"),
          tag("world_old_city"),
          years(5),
        ],
      },
      {
        id: "do_not_return",
        text: "不再回头看",
        effects: [
          stat("mindset", -2),
          stat("health", 3),
          tag("cut_from_old_city"),
          tag("world_old_city"),
          years(5),
        ],
      },
    ],
  },
  {
    id: "elder_family_table",
    stage: "elder",
    title: "年夜饭的座位",
    body: "年夜饭桌上，有人缺席，有人新来。你突然明白，家族不是一棵树，而是一阵风吹过几代人的影子。",
    trigger: { minAge: 66 },
    weight: 20,
    once: true,
    choices: [
      {
        id: "speak_softly",
        text: "把话说软一点",
        effects: [
          stat("family", 9),
          stat("relationships", 7),
          stat("mindset", 5),
          tag("reconciled_elder"),
          milestone("softened_at_family_table"),
          years(6),
        ],
      },
      {
        id: "keep_old_rules",
        text: "还是按老规矩来",
        effects: [
          stat("family", -5),
          stat("reputation", 3),
          stat("mindset", -3),
          tag("old_rules_kept"),
          years(6),
        ],
      },
    ],
  },
  {
    id: "elder_apprentice",
    stage: "elder",
    title: "后来的人",
    body: "一个年轻人来问你当年怎么熬过来。你想了很久，发现能讲的不是成功，而是很多次没得选。",
    trigger: { minAge: 68 },
    weight: 16,
    once: true,
    choices: [
      {
        id: "tell_truth",
        text: "告诉他命运的重量",
        effects: [
          stat("reputation", 9),
          stat("relationships", 5),
          stat("mindset", 4),
          tag("legacy_keeper"),
          milestone("told_the_weight_of_fate"),
          years(6),
        ],
      },
      {
        id: "tell_hope",
        text: "只把希望讲给他听",
        effects: [
          stat("mindset", 6),
          stat("relationships", 6),
          stat("reputation", 4),
          tag("hope_teller"),
          years(6),
        ],
      },
    ],
  },
  {
    id: "elder_hospital_corridor",
    stage: "elder",
    title: "医院走廊",
    body: "医院走廊的灯永远很白。年轻时你以为身体由自己支配，老了才知道身体也是命的一部分。",
    trigger: { minAge: 70 },
    weight: 14,
    once: true,
    choices: [
      {
        id: "accept_treatment",
        text: "认真治疗，慢慢走",
        effects: [
          stat("health", 8),
          stat("wealth", -8),
          stat("mindset", 3),
          tag("accepted_aging"),
          years(6),
        ],
      },
      {
        id: "refuse_tubes",
        text: "不想把最后交给管子",
        effects: [
          stat("health", -10),
          stat("mindset", 8),
          stat("family", -4),
          tag("chose_dignity_over_length"),
          years(6),
        ],
      },
    ],
  },
  {
    id: "fate_lucky_break",
    stage: "any",
    title: "命里的偏财",
    body: "一笔意外的钱落到你手里，不多不少，刚好能让某个困局松动。你很难说这是选择，还是命数。",
    trigger: {
      minAge: 20,
      maxAge: 70,
      conditions: [{ type: "stat", stat: "luck", op: ">=", value: 66 }],
    },
    weight: 8,
    once: true,
    choices: [
      {
        id: "save_windfall",
        text: "存起来，给未来留余地",
        effects: [
          stat("wealth", 14),
          stat("risk", -6),
          tag("windfall_saved"),
          milestone("luck_arrived_as_money"),
          years(2),
        ],
      },
      {
        id: "spend_windfall",
        text: "花掉它，换一口气",
        effects: [
          stat("mindset", 9),
          stat("wealth", 4),
          stat("relationships", 3),
          tag("windfall_spent"),
          years(2),
        ],
      },
    ],
  },
  {
    id: "fate_low_luck_misstep",
    stage: "any",
    title: "差一步",
    body: "你几乎赶上了那趟车、那个窗口、那份名单。可命运常常不需要把门关死，只要让你晚到一点。",
    trigger: {
      minAge: 18,
      maxAge: 70,
      conditions: [{ type: "stat", stat: "luck", op: "<=", value: 34 }],
    },
    weight: 8,
    once: true,
    choices: [
      {
        id: "swallow_miss",
        text: "把错过咽下去",
        effects: [
          stat("mindset", -5),
          stat("stress", 6),
          tag("fateful_miss"),
          milestone("missed_by_one_step"),
          years(2),
        ],
      },
      {
        id: "rage_against_miss",
        text: "不服，硬闯另一扇门",
        effects: [
          stat("risk", 10),
          stat("career", 4),
          stat("stress", 8),
          tag("fought_miss"),
          years(2),
        ],
      },
    ],
  },
  {
    id: "risk_accident",
    stage: "any",
    title: "横祸",
    body: "有些事没有预兆。前一秒你还在盘算明天，后一秒命运已经换了语气。",
    trigger: {
      minAge: 20,
      conditions: [{ type: "stat", stat: "risk", op: ">=", value: 82 }],
    },
    weight: 10,
    once: true,
    choices: [
      {
        id: "step_back_from_edge",
        text: "临门收手",
        effects: [
          stat("risk", -25),
          stat("mindset", 3),
          tag("stepped_back_from_edge"),
          years(2),
        ],
      },
      {
        id: "one_more_bet",
        text: "再赌一次",
        effects: [tag("last_bet"), end("accident")],
      },
    ],
  },
  {
    id: "health_collapse_event",
    stage: "any",
    title: "身体讨债",
    body: "身体终于来讨旧账。那些你以为能熬过去的夜晚，都排着队回来。",
    trigger: {
      minAge: 35,
      conditions: [{ type: "stat", stat: "health", op: "<=", value: 18 }],
    },
    weight: 10,
    once: true,
    choices: [
      {
        id: "full_stop_recovery",
        text: "停下来，全力恢复",
        effects: [
          stat("health", 20),
          stat("career", -8),
          stat("wealth", -12),
          tag("survived_body_debt"),
          years(4),
        ],
      },
      {
        id: "body_breaks",
        text: "这次撑不过去了",
        effects: [tag("body_debt_collected"), end("health_collapse")],
      },
    ],
  },
  ...annualFallbackEvents,
  {
    id: "ordinary_years",
    stage: "any",
    title: "平常的一年",
    body: "没有戏剧性的转折。日子像水一样从指缝里过去，可水也会慢慢改河道。命数不总是轰然落下，有时只是把这一年悄悄垫在脚下。",
    weight: 1,
    fallback: true,
    choices: [
      {
        id: "let_time_pass",
        text: "顺着命数往前走",
        effects: [
          stat("health", -2),
          stat("stress", 1),
          stat("mindset", 1),
          tag("ordinary_years_accumulated"),
          years(3),
        ],
      },
    ],
  },
];
