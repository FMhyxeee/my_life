import { ArrowLeft, Dice5, Play } from "lucide-react";
import { useState } from "react";

function createSeed(): string {
  return Math.random().toString(36).slice(2, 10);
}

export function SetupScreen({
  onBack,
  onStart,
}: {
  onBack: () => void;
  onStart: (input: { seed: string; name: string }) => void;
}) {
  const [name, setName] = useState("无名之人");
  const [seed, setSeed] = useState(createSeed);

  return (
    <main className="app-shell narrow-layout">
      <header className="top-bar">
        <button className="icon-button" type="button" onClick={onBack}>
          <ArrowLeft aria-hidden="true" size={18} />
          <span>返回</span>
        </button>
      </header>
      <section className="setup-panel">
        <h1>创建人生</h1>
        <label className="field">
          <span>名字</span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </label>
        <label className="field">
          <span>随机种子</span>
          <div className="seed-row">
            <input
              value={seed}
              onChange={(event) => setSeed(event.target.value)}
            />
            <button
              className="icon-only-button"
              type="button"
              aria-label="生成种子"
              onClick={() => setSeed(createSeed())}
            >
              <Dice5 aria-hidden="true" size={18} />
            </button>
          </div>
        </label>
        <button
          className="primary-button full-width"
          type="button"
          onClick={() => onStart({ seed, name })}
        >
          <Play aria-hidden="true" size={18} />
          开始
        </button>
      </section>
    </main>
  );
}
