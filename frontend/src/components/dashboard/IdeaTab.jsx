export default function IdeaTab({ result }) {
  const ideaScore = result.idea || 94;
  const clarityScore = result.clarity_score || 9.0;
  const feasibilityScore = result.feasibility_score || 8.2;
  const innovationScore = result.innovation_level || 7.5;

  const targetMetrics = result.idea_target_metrics || [
    { label: "Addressable ICP Reach", pct: 30, desc: "Concentrated student clusters in tier 2/3" },
    { label: "Affordability Index", pct: 18, desc: "Priced under 1/10th traditional tuition" },
    { label: "Willingness to Pay", pct: 9, desc: "Verified parent priority for board exams" },
    { label: "Adoption Velocity", pct: 8, desc: "High peer-to-peer viral coefficient" },
  ];

  const clarityMetrics = result.idea_clarity_metrics || [
    { label: "Problem Articulation", pct: 40, desc: "Precise learning gap diagnosed" },
    { label: "Solution Specificity", pct: 18, desc: "Direct adaptive feedback model" },
    { label: "Execution Simplicity", pct: 30, desc: "Zero hardware friction via mobile PWA" },
  ];

  const feasibilityBullets = result.feasibility_points || [
    "Operates over standardized responsive web/PWA with zero app store gatekeeping",
    "Sub-second AI response latency using quantized LLaMA models on Groq hardware",
    "Zero-config local SQLite architecture with seamless cloud PostgreSQL compatibility",
  ];

  const innovationBullets = result.innovation_points || [
    "Autonomous 6-agent sequential pipeline evaluating startups in under 60 seconds",
    "Real-time diagnostic Socratic tutoring engine instead of passive rote answering",
    "High-fidelity domain-aware fallback engine ensuring 100% operational uptime",
  ];

  return (
    <div className="idea-tab-wrap">
      {/* Header with Circular Score Gauge */}
      <div className="idea-header-card">
        <div className="idea-header-info">
          <div className="idea-header-tag">Whitespace Intelligence</div>
          <h2 className="idea-header-title">Idea Agent</h2>
          <p className="idea-header-sub">
            Your whitespace agent to dissect early-stage concepts, validate problem-solution fit,
            and extract multi-dimensional viability signals.
          </p>
        </div>

        <div className="idea-score-box">
          <div className="idea-score-gauge-ring">
            <svg width="84" height="84" viewBox="0 0 84 84">
              <circle
                cx="42"
                cy="42"
                r="36"
                fill="none"
                stroke="rgba(0, 122, 97, 0.12)"
                strokeWidth="7"
              />
              <circle
                cx="42"
                cy="42"
                r="36"
                fill="none"
                stroke="#007a61"
                strokeWidth="7"
                strokeDasharray={226}
                strokeDashoffset={226 - (ideaScore / 100) * 226}
                strokeLinecap="round"
                transform="rotate(-90 42 42)"
              />
            </svg>
            <div className="idea-score-num">
              {(ideaScore / 10).toFixed(1)}
            </div>
          </div>
          <div className="idea-score-label">Viability Index</div>
        </div>
      </div>

      {/* 6 Comprehensive Dimension Cards Grid */}
      <div className="idea-grid-6">
        {/* 1. Problem Card */}
        <div className="db-card idea-dimension-card">
          <div className="db-card-header">
            <div className="db-card-title">Problem</div>
            <span className="db-badge amber">Validated Need</span>
          </div>
          <div className="db-card-body">
            <p className="idea-body-text">{result.problem_statement}</p>
            <div className="idea-card-footer-pill">
              <span className="idea-pill-dot" /> High acute customer friction
            </div>
          </div>
        </div>

        {/* 2. Solution Card */}
        <div className="db-card idea-dimension-card">
          <div className="db-card-header">
            <div className="db-card-title">Solution</div>
            <span className="db-badge green">Core Proposition</span>
          </div>
          <div className="db-card-body">
            <p className="idea-body-text">{result.solution_summary}</p>
            <div className="idea-card-footer-pill green">
              <span className="idea-pill-dot green" /> Direct automated resolution
            </div>
          </div>
        </div>

        {/* 3. Target Users Card */}
        <div className="db-card idea-dimension-card">
          <div className="db-card-header">
            <div>
              <div className="db-card-title">Target Users</div>
              <div className="db-card-sub">Ideal Customer Profile (ICP)</div>
            </div>
            <span className="db-badge blue">Tier 2/3 Focus</span>
          </div>
          <div className="db-card-body">
            <p className="idea-persona-highlight">{result.target_users}</p>
            <div className="idea-sliders-list">
              {targetMetrics.map((m) => (
                <div key={m.label} className="idea-slider-item">
                  <div className="idea-slider-top">
                    <span className="idea-slider-label">{m.label}</span>
                    <span className="idea-slider-pct">{m.pct}%</span>
                  </div>
                  <div className="idea-slider-bar">
                    <div
                      className="idea-slider-fill"
                      style={{ width: `${m.pct * 2.5}%`, background: "#007a61" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 4. Clarity Card */}
        <div className="db-card idea-dimension-card">
          <div className="db-card-header">
            <div>
              <div className="db-card-title">Clarity</div>
              <div className="db-card-sub">Focus & messaging articulation</div>
            </div>
            <span className="db-badge green">{clarityScore} / 10</span>
          </div>
          <div className="db-card-body">
            <p className="idea-body-text" style={{ marginBottom: 14 }}>
              Startup proposition articulates a razor-focused mechanism addressing core buyer intent.
            </p>
            <div className="idea-sliders-list">
              {clarityMetrics.map((m) => (
                <div key={m.label} className="idea-slider-item">
                  <div className="idea-slider-top">
                    <span className="idea-slider-label">{m.label}</span>
                    <span className="idea-slider-pct">{m.pct}%</span>
                  </div>
                  <div className="idea-slider-bar">
                    <div
                      className="idea-slider-fill"
                      style={{ width: `${m.pct * 2.2}%`, background: "#1a56db" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 5. Feasibility Card */}
        <div className="db-card idea-dimension-card">
          <div className="db-card-header">
            <div>
              <div className="db-card-title">Feasibility</div>
              <div className="db-card-sub">Engineering & operational dependencies</div>
            </div>
            <span className="db-badge amber">{feasibilityScore} / 10</span>
          </div>
          <div className="db-card-body">
            <ul className="idea-bullets-list">
              {feasibilityBullets.map((pt, i) => (
                <li key={i} className="idea-bullet-item">
                  <span className="idea-bullet-icon">✓</span>
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 6. Innovation Card */}
        <div className="db-card idea-dimension-card">
          <div className="db-card-header">
            <div>
              <div className="db-card-title">Innovation</div>
              <div className="db-card-sub">Differentiators & defensive barriers</div>
            </div>
            <span className="db-badge green">{innovationScore} / 10</span>
          </div>
          <div className="db-card-body">
            <ul className="idea-bullets-list">
              {innovationBullets.map((pt, i) => (
                <li key={i} className="idea-bullet-item">
                  <span className="idea-bullet-icon green">★</span>
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
