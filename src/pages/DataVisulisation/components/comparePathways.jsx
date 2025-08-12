import React, { useEffect, useMemo, useState } from "react";

const API_BASE = "https://mcda-analysis.onrender.com";
const SCENARIOS = [
  "Econ_G",
  "Econ_L",
  "Enviro_G",
  "Enviro_L",
  "Tech_G",
  "Tech_L",
  "Equal_G",
  "Equal_L",
  "Hier_G",
  "Hier_L",
];

function BarChartLarge({ data, selected, onSelect }) {
  if (!data || !data.length) return null;
  const max = Math.max(...data.map((d) => d.total ?? 0));
  return (
    <div style={{ width: 420, margin: "0 auto" }}>
      {data.map((d) => {
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
              padding: "2px 4px",
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
                textOverflow: "ellipsis",
              }}
              title={d.name}
            >
              {d.rank ? `${d.rank}. ` : ""}
              {d.name}
            </span>
            <div
              style={{
                height: 18,
                borderRadius: 6,
                background: "#60a5fa",
                width: barWidth,
                minWidth: 2,
                position: "relative",
                transition: "width 0.3s",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  right: -48,
                  top: 0,
                  fontSize: 13,
                  color: "#333",
                }}
              >
                {(d.total ?? 0).toFixed(3)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function ComparePathways() {
  const [scenarioId, setScenarioId] = useState("Test");
  const [selected, setSelected] = useState([]);
  const [raw, setRaw] = useState(null); // Raw data from the tool
  const [error, setError] = useState("");

  // Fetch Weighted Sum Stacked Bar results (only use total/parts)
  useEffect(() => {
    let cancelled = false;
    async function load() {
      setError("");
      setRaw(null);
      try {
        // // Assume this endpoint exists: /api/wsm?scenario=xx
        // const url = `${API_BASE}/api/wsm?scenario=${encodeURIComponent(
        //   scenarioId
        // )}`;
        const url = `${API_BASE}/api/wsm?file=Test_Data`;
        const r = await fetch(url, { mode: "cors" });
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const data = await r.json();
        if (!cancelled) setRaw(data);
      } catch (e) {
        if (!cancelled)
          setError(
            "Failed to fetch ranking data from MCDA tool (possibly CORS or service is down)."
          );
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [scenarioId]);

  // Sort alternatives and assign rank
  const ranking = useMemo(() => {
    const alts = raw?.alternatives || [];
    const sorted = [...alts].sort((a, b) => (b.total ?? 0) - (a.total ?? 0));
    return sorted.map((a, i) => ({ ...a, rank: i + 1 }));
  }, [raw]);

  // Why #1: Generate a sentence based on the contribution of parts
  const whyText = useMemo(() => {
    if (!ranking.length) return "";
    const top1 = ranking[0];
    const parts = Array.isArray(top1.parts) ? top1.parts : [];
    const top3 = [...parts]
      .sort((a, b) => (b.value ?? 0) - (a.value ?? 0))
      .slice(0, 3);
    if (!top3.length) return `${top1.name} has the highest overall score.`;
    const names = top3.map((p) => p.label);
    if (names.length === 1) {
      return `${top1.name} ranks #1 mainly due to higher contribution in ${names[0]}.`;
    }
    if (names.length === 2) {
      return `${top1.name} ranks #1 mainly due to higher contributions in ${names[0]} and ${names[1]}.`;
    }
    return `${top1.name} ranks #1 mainly due to higher contributions in ${names[0]} and ${names[1]}, and also maintains stable performance in ${names[2]}.`;
  }, [ranking]);

  const handleSelect = (name) => {
    setSelected((prev) =>
      prev.includes(name)
        ? prev.filter((n) => n !== name)
        : prev.length >= 3
        ? [...prev.slice(1), name]
        : [...prev, name]
    );
  };

  const scenarioGroups = useMemo(
    () => ({
      Global: SCENARIOS.filter((id) => id.endsWith("_G")),
      Local: SCENARIOS.filter((id) => id.endsWith("_L")),
    }),
    []
  );

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 12px" }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 10 }}>
        Pathway Rankings
      </h2>

      {/* Scenario Switch */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          margin: "0 0 20px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              fontWeight: 600,
              color: "#2563eb",
              marginRight: 4,
            }}
          >
            Global:
          </span>
          {scenarioGroups.Global.map((id) => (
            <button
              key={id}
              onClick={() => {
                setScenarioId(id);
                setSelected([]);
              }}
              aria-pressed={scenarioId === id}
              style={{
                padding: "8px 18px",
                borderRadius: 8,
                border: "1px solid #bbb",
                background: scenarioId === id ? "#eef3fb" : "#fff",
                cursor: "pointer",
                fontSize: 16,
                fontWeight: scenarioId === id ? 600 : 400,
              }}
            >
              {id.replace("_G", "")}
            </button>
          ))}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginLeft: 24,
          }}
        >
          <span
            style={{
              fontWeight: 600,
              color: "#f59e42",
              marginRight: 4,
            }}
          >
            Local:
          </span>
          {scenarioGroups.Local.map((id) => (
            <button
              key={id}
              onClick={() => {
                setScenarioId(id);
                setSelected([]);
              }}
              aria-pressed={scenarioId === id}
              style={{
                padding: "8px 18px",
                borderRadius: 8,
                border: "1px solid #bbb",
                background: scenarioId === id ? "#eef3fb" : "#fff",
                cursor: "pointer",
                fontSize: 16,
                fontWeight: scenarioId === id ? 600 : 400,
              }}
            >
              {id.replace("_L", "")}
            </button>
          ))}
        </div>
      </div>

      {/* Ranking Bar Chart (no stacking, only show total and rank) */}
      <div
        style={{
          border: "1px solid #e5e5e5",
          borderRadius: 12,
          padding: 18,
          marginBottom: 28,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <h3 style={{ margin: 0, fontSize: 19 }}>
            Top pathways (Weighted Sum)
          </h3>
          <span style={{ fontSize: 15, color: "#666" }}>Select up to 3 to highlight</span>
        </div>
        {error ? (
          <div style={{ color: "#b91c1c", fontSize: 14 }}>{error}</div>
        ) : null}
        <BarChartLarge
          data={ranking.slice(0, 8)}
          selected={selected}
          onSelect={handleSelect}
        />
      </div>

      {/* Why #1 */}
      <div
        style={{
          background: "#F9FAFB",
          border: "1px solid #eee",
          borderRadius: 10,
          padding: 16,
        }}
      >
        <strong>Why #1?</strong>
        <p style={{ margin: "7px 0 0" }}>{whyText}</p>
      </div>
    </div>
  );
}