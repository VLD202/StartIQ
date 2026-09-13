const AGENT_FEATURES = [
  {
    icon: "💡",
    label: "Idea Agent",
    desc: "Extracts problem-solution clarity and innovation score",
  },
  {
    icon: "📊",
    label: "Market Agent",
    desc: "Sizes TAM, SAM, SOM with live sector benchmarks",
  },
  {
    icon: "🔍",
    label: "Competitor Agent",
    desc: "Maps rivals and finds market whitespace",
  },
  {
    icon: "⚠️",
    label: "SWOT Agent",
    desc: "Builds comprehensive strengths & weaknesses matrix",
  },
  {
    icon: "💰",
    label: "Finance Agent",
    desc: "Models revenue, break-even and unit economics",
  },
  {
    icon: "🏆",
    label: "Final Scoring Agent",
    desc: "Aggregates all signals into VC-ready score",
  },
];

export default function OrbitalSection({ orbitalRef }) {
  return (
    <section ref={orbitalRef} className="orbital-section">
      <div className="orbital-inner">
        <div className="orbital-text">
          <div className="sect-eyebrow">How it works</div>
          <h2 className="sect-title">
            6 agents.
            <br />
            One <em>verdict.</em>
          </h2>
          <p className="sect-sub">
            Each specialized AI agent analyzes a unique dimension of your
            startup. They converge into a single investor-grade report in under
            60 seconds.
          </p>
          {AGENT_FEATURES.map((f, i) => (
            <div
              key={i}
              className="agent-feature"
              style={{ transitionDelay: `${0.3 + i * 0.07}s` }}
            >
              <div className="agent-icon">{f.icon}</div>
              <div>
                <div className="agent-label">{f.label}</div>
                <div className="agent-desc">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="orbital-img-col">
          <div className="orbital-img-wrap">
            <div className="orbital-glow" />
            <img src="/agents.png" alt="6 Agents" className="orbital-img" />
            <div className="orbital-badge">
              <div className="bdot" />
              <div>
                <div
                  style={{
                    fontFamily: "var(--fmono)",
                    fontSize: 11,
                    color: "var(--muted)",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  Analysis running
                </div>
                <div
                  style={{
                    fontFamily: "var(--fdisp)",
                    fontSize: 20,
                    fontStyle: "italic",
                    color: "var(--teal)",
                    lineHeight: 1.1,
                  }}
                >
                  78.7 / 100
                </div>
              </div>
            </div>
            <div className="orbital-pill">⚡ &lt; 60 seconds</div>
          </div>
        </div>
      </div>
    </section>
  );
}
