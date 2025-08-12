import React, { useEffect, useMemo, useState } from "react";

// —— 工具函数 —— //
function dominantAxes(scores) {
  // 这里使用 human_health / ecosystem / resources 三类
  const entries = Object.entries(scores || {});
  const sorted = entries
    .filter(([, v]) => typeof v === "number")
    .sort((a, b) => b[1] - a[1]);
  return sorted.slice(0, 3).map(([k]) => k);
}

function fmtLabel(k) {
  if (k === "human_health") return "Human health";
  if (k === "ecosystem") return "Ecosystem";
  if (k === "resources") return "Resources";
  return k;
}

// —— 简化柱状图（无库，SVG 占位） —— //
function BarChart({ data }) {
  // data: [{ name, total, rank }]
  if (!data || !data.length) return null;
  const max = Math.max(...data.map((d) => (d.total ?? 0)));
  const barHeight = 28;
  const gap = 8;
  const width = 680;
  const height = data.length * (barHeight + gap) + 20;

  return (
    <svg width="100%" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Ranking bar chart">
      {data.map((d, i) => {
        const w = max > 0 ? (d.total / max) * (width - 200) : 0; // 给右侧留空间写数值
        const y = i * (barHeight + gap) + 10;
        const x = 180;
        const isTop1 = d.rank === 1;
        return (
          <g key={d.name} transform={`translate(0, ${y})`}>
            {/* 名称（左侧） */}
            <text x={0} y={barHeight * 0.7} fontSize="12" style={{ fontWeight: isTop1 ? 700 : 500 }}>
              {d.rank}. {d.name}
            </text>
            {/* 柱条 */}
            <rect
              x={x}
              y={0}
              width={Math.max(2, w)}
              height={barHeight}
              fill={isTop1 ? "#4C78A8" : "#72B7B2"}
              stroke="#333"
              strokeWidth="0.5"
              rx="4"
            />
            {/* 数值标签 */}
            <text x={x + Math.max(4, w) + 6} y={barHeight * 0.7} fontSize="12">
              {(d.total ?? 0).toFixed(3)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// —— 简化雷达图（无库，SVG 占位） —— //
function RadarChart({ series }) {
  // series: [{ name, scores: {human_health, ecosystem, resources} }]
  if (!series || !series.length) return null;
  const axes = ["human_health", "ecosystem", "resources"];
  const labels = axes.map(fmtLabel);
  const size = 360;
  const cx = size / 2;
  const cy = size / 2;
  const radius = 130;

  const axisPoints = axes.map((_, i) => {
    const angle = (-Math.PI / 2) + (i * (2 * Math.PI / axes.length));
    return { x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) };
  });

  const polygon = (scores) => {
    return axes.map((k, i) => {
      const v = Math.max(0, Math.min(1, scores[k] ?? 0)); // 保底 0-1
      const angle = (-Math.PI / 2) + (i * (2 * Math.PI / axes.length));
      const r = v * radius;
      return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
    });
  };

  const palette = ["#4C78A8", "#F58518", "#54A24B"]; // 规避红绿撞色
  return (
    <svg width="100%" viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Top 3 radar chart">
      {/* 轴与网格 */}
      {axisPoints.map((p, i) => (
        <g key={`axis-${i}`}>
          <line x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="#999" strokeDasharray="4 4" />
          <text x={p.x} y={p.y} fontSize="12" dx={p.x > cx ? 6 : -6} dy={p.y > cy ? 12 : -6} textAnchor={p.x > cx ? "start" : "end"}>
            {labels[i]}
          </text>
        </g>
      ))}
      {/* 多边形系列 */}
      {series.map((s, idx) => {
        const pts = polygon(s.scores);
        const d = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x},${p.y}`).join(" ") + " Z";
        return (
          <g key={`poly-${idx}`}>
            <path d={d} fill={palette[idx] + "55"} stroke={palette[idx]} strokeWidth="2" />
            <text x={cx} y={size - 10} fontSize="12" dx={idx * 90 - 90} fill={palette[idx]}>
              {s.name}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// —— 主组件 —— //
export default function ScenarioRanking() {
  const [data, setData] = useState(null);
  const [scenarioId, setScenarioId] = useState("Econ_G");
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const url = `${import.meta.env.BASE_URL}data/data.json`;
    fetch(url)
    .then((r) => r.json())
    .then(setData);
  }, []);

  const scenario = useMemo(() => data?.scenarios?.find((s) => s.id === scenarioId), [data, scenarioId]);

  const ranking = useMemo(() => {
    if (!scenario) return [];
    const arr = [...scenario.alternatives].sort((a, b) => {
      // 以 rank 为准，rank 空就按 total 降序
      if (a.rank && b.rank) return a.rank - b.rank;
      return (b.total ?? 0) - (a.total ?? 0);
    });
    return showAll ? arr : arr.slice(0, 5);
  }, [scenario, showAll]);

  const top3ForRadar = useMemo(() => {
    if (!scenario) return [];
    return [...scenario.alternatives]
      .sort((a, b) => (a.rank && b.rank ? a.rank - b.rank : (b.total ?? 0) - (a.total ?? 0)))
      .slice(0, 3)
      .map((a) => ({ name: a.name, scores: a.scores }));
  }, [scenario]);

  const whyText = useMemo(() => {
    if (!scenario || !scenario.alternatives?.length) return "";
    const top1 = [...scenario.alternatives].sort((a, b) => (a.rank && b.rank ? a.rank - b.rank : (b.total ?? 0) - (a.total ?? 0)))[0];
    const axes = dominantAxes(top1.scores).map(fmtLabel);
    if (!top1) return "";
    return `Under this scenario, ${top1.name} ranks first because it performs best in ${axes[0]} and ${axes[1]}, while maintaining strong performance in ${axes[2]}.`;
  }, [scenario]);

  const allScenarioIds = [
    "Econ_G","Econ_L","Enviro_G","Enviro_L","Tech_G","Tech_L","Equal_G","Equal_L","Hier_G","Hier_L"
  ].filter(id => data?.scenarios?.some(s => s.id === id));

  return (
    <div className="ranking-wrapper" style={{ maxWidth: 980, margin: "0 auto", padding: "16px 12px" }}>
      <h2 style={{ marginBottom: 8 }}>Pathway rankings</h2>
      <p style={{ marginTop: 0, color: "#444" }}>
        Rankings use default weights for each scenario. To adjust methods or weights, open the full MCDA tool.
      </p>

      {/* 场景切换 */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, margin: "12px 0 16px" }}>
        {allScenarioIds.map((id) => (
          <button
            key={id}
            onClick={() => setScenarioId(id)}
            aria-pressed={scenarioId === id}
            style={{
              padding: "6px 12px",
              borderRadius: 8,
              border: "1px solid #bbb",
              background: scenarioId === id ? "#eef3fb" : "#fff",
              cursor: "pointer",
              fontSize: 13
            }}
            title={id.replace("_", " • ")}
          >
            {id.replace("_", " • ")}
          </button>
        ))}
      </div>

      {/* Top5 柱状图 */}
      <div style={{ border: "1px solid #e5e5e5", borderRadius: 12, padding: 12, marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h3 style={{ margin: 0, fontSize: 16 }}>Top {showAll ? "All" : "5"} pathways (composite score)</h3>
          <button onClick={() => setShowAll((s) => !s)} style={{ fontSize: 13, padding: "4px 10px", borderRadius: 6, border: "1px solid #bbb", background: "#fff" }}>
            {showAll ? "Show top 5" : "Show all"}
          </button>
        </div>
        <BarChart data={ranking.map(a => ({ name: a.name, total: a.total ?? 0, rank: a.rank }))} />
      </div>

      {/* Top3 雷达图 */}
      <div style={{ border: "1px solid #e5e5e5", borderRadius: 12, padding: 12, marginBottom: 12 }}>
        <h3 style={{ marginTop: 0, fontSize: 16 }}>How the top 3 compare (Tech/Econ/Env)</h3>
        <RadarChart series={top3ForRadar} />
      </div>

      {/* 一句话解释 */}
      <div style={{ background: "#F9FAFB", border: "1px solid #eee", borderRadius: 10, padding: 12 }}>
        <strong>Why #1?</strong>
        <p style={{ margin: "6px 0 0" }}>{whyText}</p>
      </div>
    </div>
  );
}
