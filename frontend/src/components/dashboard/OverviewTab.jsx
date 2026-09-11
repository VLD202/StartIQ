import Candles from "../common/Candles";
import RadarChart from "../common/RadarChart";
import { NAV_ITEMS } from "../../utils/constants";

export default function OverviewTab({ result, dims, radarData, setTab }) {
  return (
    <>
      {/* Dimension Stat Cards Row */}
      <div className="db-stats-row">
        {dims.map((d, i) => (
          <div
            key={i}
            className="db-stat-card"
            onClick={() => setTab(NAV_ITEMS[i + 1]?.id || "overview")}
            style={{ cursor: "pointer" }}
          >
            <div className="db-stat-header">
              <div>
                <div className="db-stat-label">{d.label} Score</div>
                <div className="db-stat-value" style={{ color: d.color }}>
                  {d.score}
                </div>
              </div>
              <div
                className="db-stat-icon"
                style={{ background: d.color + "15" }}
              >
                <span style={{ fontSize: 20 }}>{NAV_ITEMS[i + 1]?.icon}</span>
              </div>
            </div>
            <span className="db-stat-change up">↑ Strong Signal</span>
            <div className="db-stat-bar">
              <div
                className="db-stat-bar-fill"
                style={{
                  width: `${Math.min(d.score, 100)}%`,
                  background: d.color,
                }}
              />
            </div>
          </div>
        ))}

        {/* TAM Card */}
        <div className="db-stat-card">
          <div className="db-stat-header">
            <div>
              <div className="db-stat-label">Total Market (TAM)</div>
              <div className="db-stat-value" style={{ color: "#007a61" }}>
                {result.TAM}
              </div>
            </div>
            <div
              className="db-stat-icon"
              style={{ background: "rgba(0,122,97,0.10)" }}
            >
              🌍
            </div>
          </div>
          <span className="db-stat-change up">↑ +{result.yoy_growth}% YoY</span>
          <div className="db-stat-bar">
            <div
              className="db-stat-bar-fill"
              style={{ width: "88%", background: "#007a61" }}
            />
          </div>
        </div>
      </div>

      {/* Analytics + Strength Radar */}
      <div className="db-grid-3">
        <div className="db-card">
          <div className="db-card-header">
            <div>
              <div className="db-card-title">Market Signal</div>
              <div className="db-card-sub">
                Sector pricing & momentum simulation
              </div>
            </div>
            <span className="db-badge green">▲ Bullish</span>
          </div>
          <Candles h={210} />
          <div
            style={{
              display: "flex",
              gap: 0,
              borderTop: "1px solid var(--border)",
            }}
          >
            {[
              { l: "TAM", v: result.TAM, c: "#007a61" },
              { l: "SAM", v: result.SAM, c: "#1a56db" },
              { l: "SOM", v: result.SOM, c: "#d6004e" },
              { l: "YoY", v: `+${result.yoy_growth}%`, c: "#c47a00" },
            ].map((f) => (
              <div
                key={f.l}
                style={{
                  flex: 1,
                  textAlign: "center",
                  padding: "14px 0",
                  borderRight: "1px solid var(--border)",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--fmono)",
                    fontSize: 11,
                    color: "var(--muted)",
                    marginBottom: 4,
                    letterSpacing: "0.05em",
                  }}
                >
                  {f.l}
                </div>
                <div
                  style={{
                    fontFamily: "var(--fdisp)",
                    fontStyle: "italic",
                    fontSize: 16,
                    color: f.c,
                  }}
                >
                  {f.v}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="db-card">
          <div className="db-card-header">
            <div>
              <div className="db-card-title">Strength Radar</div>
              <div className="db-card-sub">
                5-Dimensional competency profile
              </div>
            </div>
          </div>
          <div style={{ padding: "16px 0" }}>
            <RadarChart data={radarData} size={210} />
          </div>
          <div style={{ padding: "0 20px 20px" }}>
            {dims.map((d, i) => (
              <div key={i} className="dim-row">
                <div className="dim-label">{d.label}</div>
                <div className="dim-track">
                  <div
                    className="dim-fill"
                    style={{
                      width: `${Math.min(d.score, 100)}%`,
                      background: d.color,
                    }}
                  />
                </div>
                <div className="dim-val" style={{ color: d.color }}>
                  {d.score}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SWOT Matrix */}
      <div className="db-card" style={{ marginBottom: 24 }}>
        <div className="db-card-header">
          <div>
            <div className="db-card-title">Competitive SWOT</div>
            <div className="db-card-sub">
              Synthesized multi-agent intelligence
            </div>
          </div>
        </div>
        <div className="swot-grid">
          {[
            {
              t: "💪 Strengths",
              items: result.swot?.strengths || [],
              bg: "rgba(0,122,97,0.06)",
              border: "rgba(0,122,97,0.18)",
              color: "#007a61",
            },
            {
              t: "⚠️ Weaknesses",
              items: result.swot?.weaknesses || [],
              bg: "rgba(214,0,78,0.05)",
              border: "rgba(214,0,78,0.18)",
              color: "#d6004e",
            },
            {
              t: "🚀 Opportunities",
              items: result.swot?.opportunities || [],
              bg: "rgba(26,86,219,0.05)",
              border: "rgba(26,86,219,0.18)",
              color: "#1a56db",
            },
            {
              t: "🔥 Threats",
              items: result.swot?.threats || [],
              bg: "rgba(196,122,0,0.05)",
              border: "rgba(196,122,0,0.18)",
              color: "#c47a00",
            },
          ].map((q) => (
            <div
              key={q.t}
              className="swot-cell"
              style={{
                background: q.bg,
                border: `1px solid ${q.border}`,
              }}
            >
              <div className="swot-cell-title" style={{ color: q.color }}>
                {q.t}
              </div>
              {q.items.map((item, i) => (
                <div key={i} className="swot-item">
                  <div className="swot-dot" style={{ background: q.color }} />
                  {item}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
