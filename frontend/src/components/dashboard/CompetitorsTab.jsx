import RadarChart from "../common/RadarChart";

export default function CompetitorsTab({ result, radarData }) {
  const directList = result.direct_competitors_detailed || [
    {
      name: "Byju's (Think & Learn)",
      share: "42.5%",
      threat: "High",
      strength: "Massive brand footprint & institutional tie-ups",
      weakness: "High customer acquisition cost & aggressive sales fatigue",
    },
    {
      name: "Vedantu Live",
      share: "28.0%",
      threat: "Medium",
      strength: "Proprietary interactive whiteboard wave architecture",
      weakness: "High operational cost of live human instructors",
    },
    {
      name: "Unacademy",
      share: "18.5%",
      threat: "Medium",
      strength: "Expansive celebrity educator network",
      weakness: "Generic one-to-many broadcast lectures without adaptive pacing",
    },
  ];

  const indirectList = result.indirect_competitors_detailed || [
    {
      name: "YouTube Education",
      share: "40.0%",
      threat: "Medium",
      strength: "Completely free, frictionless global reach",
      weakness: "Passive video watching without diagnostic assessment",
    },
    {
      name: "Khan Academy",
      share: "25.0%",
      threat: "Low",
      strength: "Global non-profit trust, world-class mastery trees",
      weakness: "Limited regional vernacular nuance & conversational assistance",
    },
    {
      name: "Private Local Tutors",
      share: "20.0%",
      threat: "High",
      strength: "In-person empathy and parent familiarity",
      weakness: "Prohibitively expensive ($25–$60/month), unscalable",
    },
  ];

  const combinedTable = [
    ...directList.map((d) => ({ ...d, type: "Direct" })),
    ...indirectList.map((i) => ({ ...i, type: "Indirect" })),
  ];

  return (
    <div className="comp-tab-wrap">
      {/* Top 3 Competitor Landscape Cards */}
      <div className="comp-top-grid">
        {/* Card 1: Direct Competitors */}
        <div className="db-card">
          <div className="db-card-header">
            <div>
              <div className="db-card-title">Direct Competitors</div>
              <div className="db-card-sub">Competing for exact customer budget</div>
            </div>
            <span className="db-badge red">Direct Rivals</span>
          </div>
          <div className="db-card-body">
            <div className="comp-items-list">
              {directList.map((c) => (
                <div key={c.name} className="comp-item-row">
                  <div className="comp-avatar direct">
                    {c.name.charAt(0)}
                  </div>
                  <div className="comp-info-col">
                    <div className="comp-name-line">
                      <span className="comp-title-text">{c.name}</span>
                      <span className="comp-verified-check">✓</span>
                    </div>
                    <div className="comp-strength-sub">{c.strength}</div>
                  </div>
                  <div className="comp-share-badge">{c.share}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Card 2: Indirect Competitors */}
        <div className="db-card">
          <div className="db-card-header">
            <div>
              <div className="db-card-title">Indirect Competitors</div>
              <div className="db-card-sub">Alternative workflows & substitutes</div>
            </div>
            <span className="db-badge blue">Substitutes</span>
          </div>
          <div className="db-card-body">
            <div className="comp-items-list">
              {indirectList.map((c) => (
                <div key={c.name} className="comp-item-row">
                  <div className="comp-avatar indirect">
                    {c.name.charAt(0)}
                  </div>
                  <div className="comp-info-col">
                    <div className="comp-name-line">
                      <span className="comp-title-text">{c.name}</span>
                    </div>
                    <div className="comp-strength-sub">{c.strength}</div>
                  </div>
                  <div className="comp-share-badge blue">{c.share}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Card 3: StartIQ Positioning & Whitespace */}
        <div className="db-card">
          <div className="db-card-header">
            <div>
              <div className="db-card-title">StartIQ Positioning</div>
              <div className="db-card-sub">Core moat & differentiation factor</div>
            </div>
            <span className="db-badge green">
              Score: {result.competitor || 70}/100
            </span>
          </div>
          <div className="db-card-body">
            <div className="comp-moat-box">
              <div className="comp-moat-label">Defensive Moat Vector</div>
              <div className="comp-moat-text">
                {result.competitive_advantage ||
                  "Ultra-low cost vernacular AI agent tutoring with continuous Socratic diagnosis and offline-first PWA sync."}
              </div>
            </div>

            <div className="comp-threat-metric-row">
              <span className="comp-threat-label">Overall Competitive Threat:</span>
              <span className="db-badge amber">
                {result.competitor_threat_level || "Medium"} Threat
              </span>
            </div>

            <div className="comp-whitespace-pill">
              ★ Blue Ocean Whitespace Identified
            </div>
          </div>
        </div>
      </div>

      {/* Middle: Comprehensive Comparison Matrix */}
      <div className="db-card" style={{ marginTop: 24 }}>
        <div className="db-card-header">
          <div>
            <div className="db-card-title">Comprehensive Competitor Comparison Matrix</div>
            <div className="db-card-sub">
              Benchmarking incumbents by market share, core edge, and vulnerability
            </div>
          </div>
          <span className="db-badge green">Competitive Audit</span>
        </div>
        <div className="comp-table-enhanced-wrap">
          <table className="comp-matrix-table">
            <thead>
              <tr>
                <th>Competitor</th>
                <th>Category</th>
                <th>Est. Share</th>
                <th>Core Strength</th>
                <th>Critical Vulnerability</th>
                <th>Threat</th>
              </tr>
            </thead>
            <tbody>
              {combinedTable.map((c) => (
                <tr key={c.name}>
                  <td className="comp-tbl-name">
                    <span className={`comp-tbl-dot ${c.type.toLowerCase()}`} />
                    {c.name}
                  </td>
                  <td>
                    <span className={`comp-type ${c.type.toLowerCase()}`}>{c.type}</span>
                  </td>
                  <td className="comp-tbl-share">{c.share}</td>
                  <td className="comp-tbl-desc">{c.strength}</td>
                  <td className="comp-tbl-vuln">{c.weakness}</td>
                  <td>
                    <span
                      className={`db-badge ${
                        c.threat === "High" ? "red" : c.threat === "Low" ? "green" : "amber"
                      }`}
                    >
                      {c.threat}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom: Whitespace Gap Deep-Dive & Radar Chart */}
      <div className="db-grid-2" style={{ marginTop: 24 }}>
        {/* Market Whitespace */}
        <div className="db-card">
          <div className="db-card-header">
            <div>
              <div className="db-card-title">Market Gap & Underserved Whitespace</div>
              <div className="db-card-sub">What existing incumbents fail to deliver</div>
            </div>
            <span className="db-badge green">Whitespace</span>
          </div>
          <div className="db-card-body">
            <div className="comp-whitespace-box">
              <div className="comp-ws-badge">Founder Opportunity</div>
              <p className="comp-ws-text">
                {result.market_gap || result.whitespace_summary}
              </p>
            </div>
            <div className="comp-differentiation-tags">
              <span className="comp-diff-tag">✓ 10x Cheaper Unit Economics</span>
              <span className="comp-diff-tag">✓ Regional Dialect Support</span>
              <span className="comp-diff-tag">✓ Zero Hardware Requirement</span>
            </div>
          </div>
        </div>

        {/* Strength Radar */}
        <div className="db-card">
          <div className="db-card-header">
            <div>
              <div className="db-card-title">Competitive Radar Profile</div>
              <div className="db-card-sub">Venture defensibility across 5 core dimensions</div>
            </div>
            <span className="db-badge green">Defensible</span>
          </div>
          <div className="db-card-body" style={{ display: "flex", justifyContent: "center" }}>
            <RadarChart data={radarData} size={220} />
          </div>
        </div>
      </div>
    </div>
  );
}
