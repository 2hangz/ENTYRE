import React, { useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";

const API_BASE = "https://entyre-backend.onrender.com";

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

const SCENARIO_NAMES = {
  Econ_G: "Global Economic",
  Econ_L: "Local Economic",
  Enviro_G: "Global Environmental",
  Enviro_L: "Local Environmental",
  Tech_G: "Global Technological",
  Tech_L: "Local Technological",
  Equal_G: "Global Equality",
  Equal_L: "Local Equality",
  Hier_G: "Global Hierarchy",
  Hier_L: "Local Hierarchy",
};

const SCENARIO_DESCRIPTIONS = {
  Econ_G: "Global scenario with economic-focused weights, prioritising cost, revenue, and financial return indicators.",
  Econ_L: "Local scenario with economic-focused weights, optimised for regional cost, revenue, and local economic benefits.",
  Enviro_G: "Global scenario with environmental-focused weights, prioritising global climate impact, emissions reduction, and resource conservation.",
  Enviro_L: "Local scenario with environmental-focused weights, targeting local pollution control, ecosystem protection, and resource efficiency.",
  Tech_G: "Global scenario with technology-focused weights, favouring innovation level, technical readiness, and global scalability.",
  Tech_L: "Local scenario with technology-focused weights, favouring locally applicable technologies and ease of implementation in regional contexts.",
  Equal_G: "Global scenario with equal weights for all indicators, treating economic, environmental, and technical criteria as equally important.",
  Equal_L: "Local scenario with equal weights for all indicators, treating economic, environmental, and technical criteria as equally important within the local context.",
  Hier_G: "Global scenario with hierarchical weighting, where some criteria are prioritised over others based on structured global decision rules.",
  Hier_L: "Local scenario with hierarchical weighting, where some criteria are prioritised over others based on structured local decision rules."
};

function pickFileForScenario(files, scenarioId) {
  if (!Array.isArray(files) || !files.length || !scenarioId) return null;
  const [themeRaw, scopeRaw] = String(scenarioId).split("_");
  const theme = themeRaw?.trim();
  const scope = scopeRaw?.trim();

  const KEY = {
    Econ: ["econ", "economic"],
    Enviro: ["enviro", "environmental", "env"],
    Tech: ["tech", "technical"],
    Equal: ["equal"],
    Hier: ["hier", "hierarchy"],
  };

  const themeKeys = (KEY[theme] || [theme || ""]).map((s) => s.toLowerCase());
  const scopeKeys = scope === "G" ? ["_g", "global"] : scope === "L" ? ["_l", "local"] : [];

  const toL = (s) => String(s || "").toLowerCase();

  let candidates = files.filter((f) => {
    const lf = toL(f);
    const hitTheme = themeKeys.some((k) => lf.includes(k));
    const hitScope = scopeKeys.length ? scopeKeys.some((k) => lf.includes(k)) : true;
    return hitTheme && hitScope;
  });

  if (!candidates.length) {
    candidates = files.filter((f) => {
      const lf = toL(f);
      return themeKeys.some((k) => lf.includes(k));
    });
  }

  if (!candidates.length) return null;
  candidates.sort((a, b) => a.length - b.length);
  return candidates[0];
}

function computeWeightedSumFromExcelBuffer(arrayBuffer) {
  const wb = XLSX.read(arrayBuffer, { type: "array" });
  const firstSheetName = wb.SheetNames[0];
  const ws = wb.Sheets[firstSheetName];

  const aoa = XLSX.utils.sheet_to_json(ws, { header: 1, defval: null, raw: true });
  if (!Array.isArray(aoa) || aoa.length < 4) return { alternatives: [] };

  const headerRow = aoa[2] || [];
  if (headerRow.length < 2) return { alternatives: [] };

  const criteriaLabels = headerRow.slice(1, -1).map((c, i) => {
    const s = (c ?? "").toString().trim();
    return s || `Criterion ${i + 1}`;
  });

  const weightsRowIndex = aoa.findIndex(
    (row) => (row?.[0] ?? "").toString().trim() === "Criteria Weight"
  );
  if (weightsRowIndex === -1) return { alternatives: [] };

  const weightsRow = aoa[weightsRowIndex] || [];
  const rawWeights = criteriaLabels.map((_, idx) => {
    const v = parseFloat(weightsRow[idx + 1]);
    return Number.isFinite(v) ? v : 0;
  });
  const sumW = rawWeights.reduce((a, b) => a + b, 0);
  const weights = rawWeights.map((w) => (sumW > 0 ? w / sumW : 0));

  const dataRows = aoa.slice(3, weightsRowIndex);

  const alternatives = [];
  dataRows.forEach((row, rIdx) => {
    const nameCell = row?.[0];
    const name = (nameCell ?? "").toString().trim();
    if (!name) return;

    const values = criteriaLabels.map((_, idx) => {
      const v = parseFloat(row[idx + 1]);
      return Number.isFinite(v) ? v : 0;
    });

    let total = 0;
    const parts = criteriaLabels.map((label, i) => {
      const contrib = values[i] * (weights[i] || 0);
      total += contrib;
      return { label, value: contrib, raw: values[i], weight: weights[i] };
    });

    alternatives.push({ name, total, parts });
  });

  alternatives.sort((a, b) => b.total - a.total);
  return { alternatives };
}

function slugify(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function BarChartLarge({ data, selected, onSelect, onViewWorkflow }) {
  if (!data || !data.length) return null;
  const safeTotals = data.map((d) => (Number.isFinite(d.total) ? d.total : 0));
  const max = Math.max(0, ...safeTotals);

  return (
    <div style={{ width: 700, margin: "0 auto" }}>
      {data.map((d) => {
        const isChecked = selected.includes(d.name);
        const total = Number.isFinite(d.total) ? d.total : 0;
        const barWidth = max > 0 ? (total / max) * 300 : 0;
        return (
          <div
            key={d.name}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginBottom: 12,
              fontSize: 15,
              background: isChecked ? "#eaf1fb" : undefined,
              borderRadius: 8,
              padding: "6px 8px",
            }}
          >
            <input
              type="checkbox"
              checked={isChecked}
              onChange={() => onSelect(d.name)}
              style={{ width: 18, height: 18, accentColor: "#2563eb" }}
              aria-label={`Select ${d.name}`}
            />

            {/* pathway name inline with bar */}
            <div
              title={d.name}
              style={{
                fontWeight: 600,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: 260,
                flexShrink: 0,
              }}
            >
              {d.rank ? `${d.rank}. ` : ""}
              <span>{d.name}</span>
            </div>

            <div
              style={{
                flex: 1,
                minWidth: 100,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
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
                aria-label={`Score bar for ${d.name}`}
              />
              <span
                style={{
                  fontSize: 13,
                  color: "#333",
                  minWidth: 56,
                  textAlign: "right",
                  display: "inline-block",
                }}
                title={`Total score: ${total}`}
              >
                {total.toFixed(3)}
              </span>
            </div>

            <div style={{ alignSelf: "start" }}>
              {isChecked && (
                <button
                  onClick={() => onViewWorkflow?.(d.name)}
                  style={{
                    padding: "6px 10px",
                    borderRadius: 6,
                    border: "1px solid #cbd5e1",
                    background: "#fff",
                    cursor: "pointer",
                    fontSize: 13,
                  }}
                >
                  View Workflow
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function AnalysisPanel({ ranking, selected }) {
  const selectedItems = useMemo(
    () => ranking.filter((r) => selected.includes(r.name)),
    [ranking, selected]
  );

  if (!selectedItems.length) return null;

  return (
    <div
      style={{
        border: "1px solid #e5e5e5",
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
        background: "#fafafa",
      }}
    >
      <h4 style={{ margin: "0 0 8px" }}>Selected Pathways — Quick Analysis</h4>
      <div style={{ display: "grid", gap: 12 }}>
        {selectedItems.map((item) => {
          const topParts = [...(item.parts || [])]
            .sort((a, b) => (b?.value || 0) - (a?.value || 0))
            .slice(0, 3);

          const total = item.total || 1;
          const lines = topParts.map((p) => {
            const pct = total > 0 ? ((p.value / total) * 100).toFixed(1) : "0.0";
            return `${p.label} (${pct}%)`;
          });

          const summary =
            topParts.length === 0
              ? `${item.name} ranks #${item.rank}.`
              : `${item.name} ranks #${item.rank}, mainly driven by ${lines.join(
                  ", "
                )}.`;

          return (
            <div
              key={item.name}
              style={{
                border: "1px solid #eee",
                borderRadius: 10,
                padding: 12,
                background: "#fff",
              }}
            >
              <div style={{ fontWeight: 600, marginBottom: 6 }}>
                #{item.rank} · {item.name}
              </div>
              <div style={{ fontSize: 14, color: "#374151" }}>{summary}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function ComparePathways() {
  const [scenarioId, setScenarioId] = useState(SCENARIOS[0]);
  const [selected, setSelected] = useState([]);
  const [files, setFiles] = useState([]);
  const [raw, setRaw] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const scenarioGroups = useMemo(
    () => ({
      Global: SCENARIOS.filter((id) => id.endsWith("_G")),
      Local: SCENARIOS.filter((id) => id.endsWith("_L")),
    }),
    []
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setError("");
        setLoading(true);
        const r = await fetch(`${API_BASE}/api/files`, { mode: "cors" });
        if (!r.ok) {
          const msg = await r.text().catch(() => "");
          throw new Error(`List files failed: HTTP ${r.status} ${msg}`);
        }
        const list = await r.json();
        if (!Array.isArray(list)) throw new Error("Unexpected /api/files response (not array)");
        if (!cancelled) setFiles(list);
      } catch (e) {
        if (!cancelled) setError(`Load files failed: ${e?.message || String(e)}`);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!files.length) return;
      try {
        setError("");
        setLoading(true);

        const targetFile = pickFileForScenario(files, scenarioId);
        if (!targetFile) throw new Error(`No matching file for "${scenarioId}".`);

        const fileUrl = `${API_BASE}/data/${encodeURIComponent(targetFile)}`;
        const resp = await fetch(fileUrl, { mode: "cors" });
        if (!resp.ok) {
          const msg = await resp.text().catch(() => "");
          throw new Error(`Download failed: HTTP ${resp.status} ${msg}`);
        }
        const buf = await resp.arrayBuffer();

        const result = computeWeightedSumFromExcelBuffer(buf);
        setSelected([]);
        if (!cancelled) setRaw(result);
      } catch (e) {
        if (!cancelled) setRaw(null);
        if (!cancelled) setError(`Compute failed: ${e?.message || String(e)}`);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [scenarioId, files]);

  const ranking = useMemo(() => {
    const alts = Array.isArray(raw?.alternatives) ? raw.alternatives : [];
    return alts.map((a, i) => ({
      name: a?.name ?? `Alternative ${i + 1}`,
      total: Number.isFinite(a?.total) ? a.total : 0,
      parts: Array.isArray(a?.parts) ? a.parts : [],
      rank: i + 1,
    }));
  }, [raw]);

  const whyText = useMemo(() => {
    if (!ranking.length) return "";
    const top1 = ranking[0];
    const parts = Array.isArray(top1.parts) ? top1.parts : [];
    const top3 = [...parts].sort((a, b) => (b?.value || 0) - (a?.value || 0)).slice(0, 3);
    if (!top3.length) return `${top1.name} has the highest overall score.`;
    const names = top3.map((p) => p?.label ?? "factor");
    if (names.length === 1) return `${top1.name} ranks #1 mainly due to higher contribution in ${names[0]}.`;
    if (names.length === 2) return `${top1.name} ranks #1 mainly due to higher contributions in ${names[0]} and ${names[1]}.`;
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

  const openWorkflow = (name) => {
    const url = `#/workflow?pathway=${encodeURIComponent(name)}`;
    window.dispatchEvent(new CustomEvent("mcda:selectPathway", { detail: { name } }));
    window.open(url, "_blank");
  };

  const scenarioDescription = SCENARIO_DESCRIPTIONS[scenarioId] || "";
  const scenarioName = SCENARIO_NAMES[scenarioId] || scenarioId;

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 12px" }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 10 }}>
        Pathway Rankings
      </h2>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, margin: "0 0 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontWeight: 600, color: "#2563eb", marginRight: 4 }}>Global:</span>
          {scenarioGroups.Global.map((id) => (
            <button
              key={id}
              onClick={() => { setScenarioId(id); }}
              aria-pressed={scenarioId === id}
              style={{
                padding: "8px 18px", borderRadius: 8, border: "1px solid #bbb",
                background: scenarioId === id ? "#eef3fb" : "#fff",
                cursor: "pointer", fontSize: 16, fontWeight: scenarioId === id ? 600 : 400,
              }}
              title={SCENARIO_DESCRIPTIONS[id]}
            >
              {id.replace("_G", "")}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: 24 }}>
          <span style={{ fontWeight: 600, color: "#f59e42", marginRight: 4 }}>Local:</span>
          {scenarioGroups.Local.map((id) => (
            <button
              key={id}
              onClick={() => { setScenarioId(id); }}
              aria-pressed={scenarioId === id}
              style={{
                padding: "8px 18px", borderRadius: 8, border: "1px solid #bbb",
                background: scenarioId === id ? "#eef3fb" : "#fff",
                cursor: "pointer", fontSize: 16, fontWeight: scenarioId === id ? 600 : 400,
              }}
              title={SCENARIO_DESCRIPTIONS[id]}
            >
              {id.replace("_L", "")}
            </button>
          ))}
        </div>
      </div>

      {scenarioDescription && (
        <div
          style={{
            background: "#f3f4f6",
            border: "1px solid #e5e7eb",
            borderRadius: 8,
            padding: "12px 18px",
            marginBottom: 18,
            fontSize: 16,
            color: "#374151",
          }}
        >
          <strong>{scenarioName}: </strong>
          <span>{scenarioDescription}</span>
        </div>
      )}

      {loading && <div style={{ fontSize: 14, color: "#555", marginBottom: 8 }}>Loading…</div>}
      {error && (
        <div style={{ color: "#b91c1c", fontSize: 14, marginBottom: 8 }}>
          {error}
          {Array.isArray(files) && files.length > 0 && (
            <details style={{ marginTop: 8 }}>
              <summary>Available files from /api/files</summary>
              <ul style={{ marginTop: 6 }}>
                {files.map((f) => (
                  <li key={f} style={{ fontFamily: "monospace" }}>{f}</li>
                ))}
              </ul>
            </details>
          )}
        </div>
      )}

      <div style={{ border: "1px solid #e5e5e5", borderRadius: 12, padding: 18, marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <h3 style={{ margin: 0, fontSize: 19 }}>Top pathways (Weighted Sum)</h3>
          <span style={{ fontSize: 15, color: "#666" }}>Select up to 3 to highlight</span>
        </div>

        <BarChartLarge
          data={ranking.slice(0, 8)}
          selected={selected}
          onSelect={handleSelect}
          onViewWorkflow={(name) => openWorkflow(name)}
        />
      </div>

      <AnalysisPanel ranking={ranking} selected={selected} />

      <div style={{ background: "#F9FAFB", border: "1px solid #eee", borderRadius: 10, padding: 16 }}>
        <strong>Why #1?</strong>
        <p style={{ margin: "7px 0 0" }}>{whyText}</p>
      </div>
    </div>
  );
}
