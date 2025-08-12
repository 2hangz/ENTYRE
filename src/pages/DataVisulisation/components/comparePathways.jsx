import React, { useEffect, useMemo, useState } from "react";

// 5 dimension label mapping
const AXIS_LABELS = {
  human_health: "Human health",
  ecosystem: "Ecosystem",
  resources: "Resources",
  economic: "Economic",
  technical: "Technical"
};
const AXES = ["human_health", "ecosystem", "resources", "economic", "technical"];

// Label formatter
function fmtLabel(k) {
  return AXIS_LABELS[k] || k;
}

// Normalize all series scores to [0,1], each dimension normalized independently
function normalizeRadarSeries(series) {
  if (!series || !series.length) return [];
  // Calculate min/max for each axis
  const mins = {};
  const maxs = {};
  AXES.forEach(axis => {
    let values = series.map(s => s.scores?.[axis]).filter(v => typeof v === "number");
    if (values.length === 0) {
      mins[axis] = 0;
      maxs[axis] = 1;
    } else {
      mins[axis] = Math.min(...values);
      maxs[axis] = Math.max(...values);
      if (mins[axis] === maxs[axis]) {
        // All values the same, avoid divide by zero
        mins[axis] = 0;
      }
    }
  });
  // Normalize
  return series.map(s => ({
    ...s,
    scores: Object.fromEntries(
      AXES.map(axis => {
        const v = s.scores?.[axis];
        if (typeof v !== "number") return [axis, 0];
        const min = mins[axis];
        const max = maxs[axis];
        if (max === min) return [axis, 1]; // All the same
        return [axis, (v - min) / (max - min)];
      })
    )
  }));
}

// Bar chart (large, with rank, score, highlight selected)
function BarChartLarge({ data, selected, onSelect }) {
  if (!data || !data.length) return null;
  const max = Math.max(...data.map((d) => d.total ?? 0));
  return (
    <div style={{ width: 420, margin: "0 auto" }}>
      {data.map((d, i) => {
        const isChecked = selected.includes(d.name);
        const barWidth = max > 0 ? ((d.total ?? 0) / max) * 260 : 0;
        return (
          <div
            key={d.name}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 8,
              fontSize: 15,
              background: isChecked ? "#eaf1fb" : undefined,
              borderRadius: 8,
              padding: "2px 4px"
            }}
          >
            <input
              type="checkbox"
              checked={isChecked}
              onChange={() => onSelect(d.name)}
              style={{ width: 18, height: 18, accentColor: "#2563eb" }}
              aria-label={`Select ${d.name}`}
            />
            <span
              style={{
                width: 120,
                fontWeight: isChecked ? 600 : 400,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis"
              }}
              title={d.name}
            >
              {d.rank ? `${d.rank}. ` : ""}{d.name}
            </span>
            <div
              style={{
                height: 18,
                borderRadius: 6,
                background: "#60a5fa",
                width: barWidth,
                minWidth: 2,
                position: "relative",
                transition: "width 0.3s"
              }}
            >
              <span
                style={{
                  position: "absolute",
                  right: -48,
                  top: 0,
                  fontSize: 13,
                  color: "#333"
                }}
              >
                {(d.total ?? 0).toFixed(2)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Radar chart (large, with legend, 5 dimensions, normalized)
function RadarChartLarge({ series }) {
  if (!series || !series.length) return null;
  const axes = AXES;
  const labels = axes.map(fmtLabel);
  const size = 520; // Large
  const cx = size / 2;
  const cy = size / 2;
  const radius = 180;
  const palette = ["#4C78A8", "#F58518", "#54A24B", "#B279A2", "#FFB000", "#72B7B2"];
  const polygon = (scores) =>
    axes.map((k, i) => {
      const v = Math.max(0, Math.min(1, scores?.[k] ?? 0));
      const angle = (-Math.PI / 2) + (i * (2 * Math.PI / axes.length));
      const r = v * radius;
      return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
    });

  // Grid levels
  const gridLevels = [0.25, 0.5, 0.75, 1];

  return (
    <div style={{ position: "relative", width: size, margin: "0 auto" }}>
      <svg width={size} height={size} style={{ display: "block" }}>
        {/* Grid polygons */}
        {gridLevels.map((lv, i) => (
          <polygon
            key={lv}
            points={axes.map((_, j) => {
              const angle = (-Math.PI / 2) + (j * (2 * Math.PI / axes.length));
              const r = lv * radius;
              const x = cx + r * Math.cos(angle);
              const y = cy + r * Math.sin(angle);
              return `${x},${y}`;
            }).join(" ")}
            fill="none"
            stroke="#e5e7eb"
            strokeDasharray="4 2"
          />
        ))}
        {/* Axes */}
        {axes.map((_, i) => {
          const angle = (-Math.PI / 2) + (i * (2 * Math.PI / axes.length));
          const x = cx + radius * Math.cos(angle);
          const y = cy + radius * Math.sin(angle);
          return (
            <g key={i}>
              <line x1={cx} y1={cy} x2={x} y2={y} stroke="#bdbdbd" strokeWidth={1.2} />
              <text
                x={x}
                y={y}
                fontSize={17}
                fontWeight={500}
                textAnchor="middle"
                dy={y > cy ? 28 : -12}
                fill="#333"
              >
                {labels[i]}
              </text>
            </g>
          );
        })}
        {/* Series polygons */}
        {series.map((s, idx) => {
          const pts = polygon(s.scores);
          const d = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ") + " Z";
          return (
            <g key={s.name}>
              <path
                d={d}
                fill={palette[idx % palette.length] + "33"}
                stroke={palette[idx % palette.length]}
                strokeWidth={2.5}
              />
              {/* Vertex dots */}
              {pts.map((p, i) => (
                <circle
                  key={i}
                  cx={p.x}
                  cy={p.y}
                  r={5}
                  fill={palette[idx % palette.length]}
                  stroke="#fff"
                  strokeWidth={1.5}
                />
              ))}
            </g>
          );
        })}
      </svg>
      {/* Legend */}
      <div style={{
        position: "absolute",
        right: 0,
        top: 0,
        background: "rgba(255,255,255,0.92)",
        borderRadius: 8,
        padding: "10px 18px",
        boxShadow: "0 1px 4px #0001",
        fontSize: 16
      }}>
        {series.map((s, idx) => (
          <div key={s.name} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <span style={{
              display: "inline-block",
              width: 18,
              height: 18,
              borderRadius: 9,
              background: palette[idx % palette.length],
              marginRight: 2
            }} />
            <span style={{ fontWeight: 500 }}>{s.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Main component
export default function ComparePathways() {
  const [data, setData] = useState(null);
  const [scenarioId, setScenarioId] = useState("Econ_G");
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    const url = `${import.meta.env.BASE_URL}data/data.json`;
    fetch(url)
      .then(r => r.json())
      .then(setData)
      .catch(console.error);
  }, []);

  // Scenario list
  const allScenarioIds = useMemo(() =>
    [
      "Econ_G","Econ_L","Enviro_G","Enviro_L","Tech_G","Tech_L","Equal_G","Equal_L","Hier_G","Hier_L"
    ].filter(id => data?.scenarios?.some(s => s.id === id)), [data]
  );

  // Group scenarios by Global/Local
  const scenarioGroups = useMemo(() => {
    const groups = {
      Global: [],
      Local: []
    };
    allScenarioIds.forEach(id => {
      if (id.endsWith("_G")) {
        groups.Global.push(id);
      } else if (id.endsWith("_L")) {
        groups.Local.push(id);
      }
    });
    return groups;
  }, [allScenarioIds]);

  // Current scenario
  const scenario = useMemo(
    () => data?.scenarios?.find(s => s.id === scenarioId),
    [data, scenarioId]
  );

  // Ranking
  const ranking = useMemo(() => {
    if (!scenario) return [];
    return [...scenario.alternatives].sort((a, b) =>
      a.rank && b.rank ? a.rank - b.rank : (b.total ?? 0) - (a.total ?? 0)
    );
  }, [scenario]);

  // Radar chart series (normalized, 5 dimensions)
  const radarSeries = useMemo(() => {
    if (!scenario) return [];
    let baseSeries;
    if (selected.length > 0) {
      baseSeries = selected
        .map(name => scenario.alternatives.find(a => a.name === name))
        .filter(Boolean)
        .map(a => ({ name: a.name, scores: a.scores }));
    } else {
      baseSeries = ranking.slice(0, 3).map(a => ({ name: a.name, scores: a.scores }));
    }
    return normalizeRadarSeries(baseSeries);
  }, [scenario, selected, ranking]);

  // Selection handler
  const handleSelect = (name) => {
    setSelected(prev => {
      if (prev.includes(name)) return prev.filter(n => n !== name);
      if (prev.length >= 3) return [...prev.slice(1), name];
      return [...prev, name];
    });
  };

  // One-sentence explanation
  const whyText = useMemo(() => {
    if (!scenario || !scenario.alternatives?.length) return "";
    const top1 = [...scenario.alternatives].sort((a, b) => (a.rank && b.rank ? a.rank - b.rank : (b.total ?? 0) - (a.total ?? 0)))[0];
    if (!top1) return "";
    // Find top1's leading indicators
    const scores = top1.scores || {};
    // Only consider 5 dimensions
    const sortedAxes = AXES
      .map(k => [k, scores[k] ?? 0])
      .sort((a, b) => (b[1] ?? 0) - (a[1] ?? 0))
      .map(([k]) => fmtLabel(k));
    return `Under this scenario, ${top1.name} ranks first because it performs best in ${sortedAxes[0]} and ${sortedAxes[1]}, while maintaining strong performance in ${sortedAxes[2]}.`;
  }, [scenario]);

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 12px" }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 10 }}>Pathway Rankings</h2>
      <p style={{ color: "#444", marginTop: 0, marginBottom: 20 }}>
        Compare the top pathways under different scenarios. Select up to 3 for radar comparison.
      </p>
      {/* Scenario switch */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, margin: "0 0 20px" }}>
        {/* Global group */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontWeight: 600, color: "#2563eb", marginRight: 4 }}>Global:</span>
          {scenarioGroups.Global.map((id) => (
            <button
              key={id}
              onClick={() => { setScenarioId(id); setSelected([]); }}
              aria-pressed={scenarioId === id}
              style={{
                padding: "8px 18px",
                borderRadius: 8,
                border: "1px solid #bbb",
                background: scenarioId === id ? "#eef3fb" : "#fff",
                cursor: "pointer",
                fontSize: 16,
                fontWeight: scenarioId === id ? 600 : 400
              }}
              title={id.replace("_", " • ")}
            >
              {id.replace("_G", "").replace("_", " ")}
            </button>
          ))}
        </div>
        {/* Local group */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: 24 }}>
          <span style={{ fontWeight: 600, color: "#f59e42", marginRight: 4 }}>Local:</span>
          {scenarioGroups.Local.map((id) => (
            <button
              key={id}
              onClick={() => { setScenarioId(id); setSelected([]); }}
              aria-pressed={scenarioId === id}
              style={{
                padding: "8px 18px",
                borderRadius: 8,
                border: "1px solid #bbb",
                background: scenarioId === id ? "#eef3fb" : "#fff",
                cursor: "pointer",
                fontSize: 16,
                fontWeight: scenarioId === id ? 600 : 400
              }}
              title={id.replace("_", " • ")}
            >
              {id.replace("_L", "").replace("_", " ")}
            </button>
          ))}
        </div>
      </div>
      {/* Bar chart */}
      <div style={{ border: "1px solid #e5e5e5", borderRadius: 12, padding: 18, marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <h3 style={{ margin: 0, fontSize: 19 }}>Top pathways (composite score)</h3>
          <span style={{ fontSize: 15, color: "#666" }}>Select up to 3 for radar</span>
        </div>
        <BarChartLarge data={ranking.slice(0, 8)} selected={selected} onSelect={handleSelect} />
      </div>
      {/* Radar chart */}
      <div style={{ border: "1px solid #e5e5e5", borderRadius: 12, padding: 18, marginBottom: 22 }}>
        <h3 style={{ margin: 0, fontSize: 19, marginBottom: 12 }}>Radar Comparison (5 dimensions, normalized)</h3>
        <RadarChartLarge series={radarSeries} />
        <div style={{ fontSize: 13, color: "#888", marginTop: 8 }}>
          Each axis is normalized among the compared pathways for fair visual comparison.
        </div>
      </div>
      {/* One-sentence explanation */}
      <div style={{ background: "#F9FAFB", border: "1px solid #eee", borderRadius: 10, padding: 16 }}>
        <strong>Why #1?</strong>
        <p style={{ margin: "7px 0 0" }}>{whyText}</p>
      </div>
    </div>
  );
}
