export default function RiskTab({ result }) {
  const riskScore = typeof result.risk_score === "number" ? result.risk_score : 6.4;
  const riskLevel = result.overall_risk_level || "Medium";
  const isSafe = riskLevel === "Low";
  const isHigh = riskLevel === "High";
  const riskColor = isSafe ? "#007a61" : isHigh ? "#d6004e" : "#c47a00";

  // Arc calculation for semi-circular gauge (0 to 10 scale)
  // Half circle arc length = PI * r = 3.14159 * 65 ≈ 204.2
  const radius = 65;
  const circumference = Math.PI * radius;
  const normalizedScore = Math.min(Math.max(riskScore, 0), 10);
  const strokeDashoffset = circumference - (normalizedScore / 10) * circumference;

  // Challenges breakdown from reference image
  const challengesBreakdown = result.challenges_breakdown || [
    { label: "Operational Complexity", pct: 16.1, level: "Moderate" },
    { label: "Technical & AI Scaling", pct: 7.8, level: "Low" },
    { label: "Market Adoption Friction", pct: 12.5, level: "Moderate" },
    { label: "Regulatory Compliance", pct: 7.0, level: "Low" },
  ];

  // Innovation uniqueness breakdown from reference image
  const uniquenessBreakdown = result.uniqueness_breakdown || [
    { label: "IP & Algorithmic Moat", pct: 18.5, level: "High Defensibility" },
    { label: "Market Insulation", pct: 11.75, level: "Strong" },
    { label: "Switching Cost Barrier", pct: 14.2, level: "Growing" },
  ];

  // 4-quadrant SWOT Matrix
  const swotSections = [
    {
      t: "💪 Strengths",
      items: result.swot?.strengths || [],
      bg: "rgba(0, 122, 97, 0.05)",
      border: "rgba(0, 122, 97, 0.18)",
      color: "#007a61",
    },
    {
      t: "⚠️ Weaknesses",
      items: result.swot?.weaknesses || [],
      bg: "rgba(214, 0, 78, 0.04)",
      border: "rgba(214, 0, 78, 0.18)",
      color: "#d6004e",
    },
    {
      t: "🚀 Opportunities",
      items: result.swot?.opportunities || [],
      bg: "rgba(26, 86, 219, 0.04)",
      border: "rgba(26, 86, 219, 0.18)",
      color: "#1a56db",
    },
    {
      t: "🔥 Threats",
      items: result.swot?.threats || [],
      bg: "rgba(196, 122, 0, 0.04)",
      border: "rgba(196, 122, 0, 0.18)",
      color: "#c47a00",
    },
  ];

  return (
    <div className="risk-tab-wrap">
      {/* Top 3 Analytical Dimension Cards */}
      <div className="risk-top-grid">
        {/* Card 1: Semi-Circular Risk Score Speedometer Gauge */}
        <div className="db-card risk-gauge-card">
          <div className="db-card-header">
            <div>
              <div className="db-card-title">Risk Score Gauge</div>
              <div className="db-card-sub">Synthesized executive risk index</div>
            </div>
            <span
              className={`db-badge ${isSafe ? "green" : isHigh ? "red" : "amber"}`}
            >
              {riskLevel} Risk
            </span>
          </div>
          <div className="db-card-body" style={{ textAlign: "center" }}>
            <div className="risk-gauge-svg-wrap">
              <svg width="200" height="115" viewBox="0 0 160 95">
                {/* Background track */}
                <path
                  d="M 15 85 A 65 65 0 0 1 145 85"
                  fill="none"
                  stroke="rgba(0, 122, 97, 0.12)"
                  strokeWidth="14"
                  strokeLinecap="round"
                />
                {/* Progress arc */}
                <path
                  d="M 15 85 A 65 65 0 0 1 145 85"
                  fill="none"
                  stroke={riskColor}
                  strokeWidth="14"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  style={{ transition: "stroke-dashoffset 1s ease" }}
                />
              </svg>
              <div className="risk-gauge-overlay">
                <div className="risk-gauge-num" style={{ color: riskColor }}>
                  {riskScore}
                </div>
                <div className="risk-gauge-sub">Scale 0 - 10</div>
              </div>
            </div>

            <div className="risk-gauge-footer">
              <span className="risk-gauge-indicator">
                <span className="risk-dot" style={{ background: riskColor }} />
                {isSafe ? "Defensible Venture" : isHigh ? "Elevated Vulnerabilities" : "Controlled Exposure"}
              </span>
              <span className="risk-audit-badge">
                Risk Score: {result.risk || 64}/100
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Execution Challenges Breakdown */}
        <div className="db-card">
          <div className="db-card-header">
            <div>
              <div className="db-card-title">Execution Challenges</div>
              <div className="db-card-sub">Operational & scaling friction metrics</div>
            </div>
            <span className="db-badge amber">Audit Active</span>
          </div>
          <div className="db-card-body">
            <div className="risk-metric-sliders">
              {challengesBreakdown.map((c) => (
                <div key={c.label} className="risk-slider-item">
                  <div className="risk-slider-row">
                    <span className="risk-slider-name">{c.label}</span>
                    <span className="risk-slider-val">{c.pct}%</span>
                  </div>
                  <div className="risk-slider-track">
                    <div
                      className="risk-slider-fill"
                      style={{
                        width: `${Math.min(c.pct * 3, 100)}%`,
                        background: c.pct > 15 ? "#d6004e" : "#c47a00",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="risk-insight-tag">
              Focused Vulnerability: <strong>Retention Month 1 & Content Scaling</strong>
            </div>
          </div>
        </div>

        {/* Card 3: Innovation Uniqueness & Moat Index */}
        <div className="db-card">
          <div className="db-card-header">
            <div>
              <div className="db-card-title">Innovation Uniqueness</div>
              <div className="db-card-sub">Defensibility & competitive moat</div>
            </div>
            <span className="db-badge green">
              {result.innovation_uniqueness || 8.1} / 10
            </span>
          </div>
          <div className="db-card-body">
            <div className="risk-metric-sliders">
              {uniquenessBreakdown.map((u) => (
                <div key={u.label} className="risk-slider-item">
                  <div className="risk-slider-row">
                    <span className="risk-slider-name">{u.label}</span>
                    <span className="risk-slider-val" style={{ color: "#007a61" }}>
                      {u.pct}%
                    </span>
                  </div>
                  <div className="risk-slider-track">
                    <div
                      className="risk-slider-fill"
                      style={{
                        width: `${Math.min(u.pct * 3.5, 100)}%`,
                        background: "#007a61",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="risk-insight-tag green">
              Competitive Moat: <strong>Proprietary vernacular tuning & offline PWA</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Challenges & Mitigations Grid */}
      <div className="db-grid-2" style={{ marginTop: 24 }}>
        <div className="db-card">
          <div className="db-card-header">
            <div>
              <div className="db-card-title">Execution Challenges List</div>
              <div className="db-card-sub">Operational bottlenecks identified by Risk Agent</div>
            </div>
            <span className="db-badge amber">Operational</span>
          </div>
          <div className="risk-list">
            {(result.execution_challenges || []).map((ch, i) => (
              <div key={i} className="risk-item challenge">
                <span className="risk-icon">⚠️</span>
                <span>{ch}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="db-card">
          <div className="db-card-header">
            <div>
              <div className="db-card-title">Mitigation Strategies Roadmap</div>
              <div className="db-card-sub">Founder action playbook to de-risk venture</div>
            </div>
            <span className="db-badge green">Actionable</span>
          </div>
          <div className="risk-list">
            {(result.mitigation_strategies || []).map((s, i) => (
              <div key={i} className="risk-item strategy">
                <span className="risk-icon">✓</span>
                <span>{s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4-Quadrant SWOT Matrix */}
      <div className="db-card" style={{ marginTop: 24 }}>
        <div className="db-card-header">
          <div>
            <div className="db-card-title">SWOT Assessment Matrix</div>
            <div className="db-card-sub">Internal capabilities vs. external market threats</div>
          </div>
          <span className="db-badge green">4-Quadrant Audit</span>
        </div>
        <div className="swot-grid">
          {swotSections.map((q) => (
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
                  <span>{item}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
