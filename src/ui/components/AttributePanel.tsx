import type { Stats } from "../../engine/types";

const statLabels: Array<[keyof Stats, string]> = [
  ["health", "健康"],
  ["intelligence", "智力"],
  ["charm", "魅力"],
  ["wealth", "财富"],
  ["mindset", "心态"],
  ["luck", "运气"],
  ["education", "教育"],
  ["career", "事业"],
  ["family", "家庭"],
  ["relationships", "关系"],
  ["reputation", "名望"],
  ["risk", "风险"],
  ["stress", "压力"],
  ["classBackground", "阶层"],
];

type AttributePanelMode = "exact" | "qualitative";

type StatDescriptor = {
  label: string;
  fill: number;
};

function descriptorFromTiers(
  value: number,
  tiers: Array<[number, string]>,
): StatDescriptor {
  const tierIndex = tiers.findIndex(([limit]) => value <= limit);
  const index = tierIndex === -1 ? tiers.length - 1 : tierIndex;
  const [, label] = tiers[index];

  return {
    label,
    fill: ((index + 1) / tiers.length) * 100,
  };
}

function describeStat(key: keyof Stats, value: number): StatDescriptor {
  switch (key) {
    case "health":
      return descriptorFromTiers(value, [
        [34, "危险"],
        [59, "隐痛"],
        [79, "尚可"],
        [100, "充沛"],
      ]);
    case "wealth":
      return descriptorFromTiers(value, [
        [29, "困窘"],
        [49, "拮据"],
        [74, "稳定"],
        [100, "宽裕"],
      ]);
    case "stress":
      return descriptorFromTiers(value, [
        [24, "平稳"],
        [49, "紧绷"],
        [74, "很重"],
        [100, "快崩了"],
      ]);
    case "risk":
      return descriptorFromTiers(value, [
        [24, "低伏"],
        [49, "暗涌"],
        [74, "危险"],
        [100, "悬边"],
      ]);
    case "education":
      return descriptorFromTiers(value, [
        [24, "浅薄"],
        [49, "打底"],
        [74, "成形"],
        [100, "深厚"],
      ]);
    case "career":
      return descriptorFromTiers(value, [
        [24, "未稳"],
        [49, "起步"],
        [74, "站住"],
        [100, "成势"],
      ]);
    case "family":
      return descriptorFromTiers(value, [
        [24, "疏冷"],
        [49, "牵扯"],
        [74, "尚暖"],
        [100, "托底"],
      ]);
    case "relationships":
      return descriptorFromTiers(value, [
        [24, "孤立"],
        [49, "稀薄"],
        [74, "有人"],
        [100, "丰厚"],
      ]);
    case "reputation":
      return descriptorFromTiers(value, [
        [24, "无名"],
        [49, "小声"],
        [74, "被看见"],
        [100, "有声望"],
      ]);
    case "classBackground":
      return descriptorFromTiers(value, [
        [24, "低处"],
        [49, "普通"],
        [74, "有垫脚"],
        [100, "厚底"],
      ]);
    default:
      return descriptorFromTiers(value, [
        [24, "低"],
        [49, "偏弱"],
        [74, "尚可"],
        [100, "强"],
      ]);
  }
}

export function AttributePanel({
  mode = "exact",
  stats,
}: {
  mode?: AttributePanelMode;
  stats: Stats;
}) {
  return (
    <section className="panel attribute-panel" aria-label="属性">
      <div className="panel-heading">
        <h2>状态</h2>
      </div>
      <div className="stat-grid">
        {statLabels.map(([key, label]) => {
          const descriptor = describeStat(key, stats[key]);
          const valueLabel = mode === "qualitative" ? descriptor.label : stats[key];
          const fill = mode === "qualitative" ? descriptor.fill : stats[key];

          return (
            <div className="stat-row" key={key}>
              <div className="stat-label">
                <span>{label}</span>
                <strong>{valueLabel}</strong>
              </div>
              <div className="stat-track" aria-hidden="true">
                <div
                  className={`stat-fill stat-${key}`}
                  style={{ width: `${Math.max(0, Math.min(100, fill))}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
