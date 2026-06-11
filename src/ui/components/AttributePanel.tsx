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

export function AttributePanel({ stats }: { stats: Stats }) {
  return (
    <section className="panel attribute-panel" aria-label="属性">
      <div className="panel-heading">
        <h2>状态</h2>
      </div>
      <div className="stat-grid">
        {statLabels.map(([key, label]) => (
          <div className="stat-row" key={key}>
            <div className="stat-label">
              <span>{label}</span>
              <strong>{stats[key]}</strong>
            </div>
            <div className="stat-track" aria-hidden="true">
              <div
                className={`stat-fill stat-${key}`}
                style={{ width: `${Math.max(0, Math.min(100, stats[key]))}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
