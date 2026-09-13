import Candles from "../common/Candles";

export default function FinanceTab({ result }) {
  // Top 4 Financial KPI Cards
  const kpiCards = [
    {
      label: "Monthly Costs",
      val: result.monthly_costs || "$173.95K",
      change: result.monthly_costs_growth || "+1.15%",
      sub: "Early-stage operational burn rate",
      color: "#007a61",
      badge: "Managed Burn",
    },
    {
      label: "Revenue Potential",
      val: result.revenue_potential || "$37.88M",
      change: result.revenue_potential_growth || "+0.86%",
      sub: "Estimated 3-year market capture",
      color: "#009e7d",
      badge: "High Upside",
    },
    {
      label: "Break-even Time",
      val: result.break_even_time || "14 Months",
      change: result.break_even_margin || "47.4%",
      sub: "Estimated path to cash-flow positive",
      color: "#1a56db",
      badge: "Fast Ramp",
    },
    {
      label: "Funding Requirements",
      val: result.funding_requirements || "$2,657,800",
      change: result.funding_stage || "Pre-Seed / Seed",
      sub: "Target round capitalization",
      color: "#c47a00",
      badge: "Seed Ready",
    },
  ];

  // Revenue projection cost breakdown
  const projectionBreakdown = result.revenue_projection_breakdown || [
    { label: "Operating Costs", pct: 8.4, val: "$14.6K/mo", color: "#007a61" },
    { label: "Sales & Marketing", pct: 31.1, val: "$54.1K/mo", color: "#009e7d" },
    { label: "Capital Exp", pct: 3.0, val: "$5.2K/mo", color: "#1a56db" },
    { label: "R&D & Engineering", pct: 43.8, val: "$76.2K/mo", color: "#c47a00" },
  ];

  // 5-Year Financial Trajectory (simulation data)
  const trajectoryData = result.revenue_simulation || [
    { year: "2024", revenue: 48, costs: 24 },
    { year: "2025", revenue: 95, costs: 42 },
    { year: "2026", revenue: 180, costs: 68 },
    { year: "2027", revenue: 310, costs: 105 },
    { year: "2028", revenue: 490, costs: 145 },
    { year: "2029", revenue: 750, costs: 190 },
  ];

  const maxVal = Math.max(...trajectoryData.map((d) => d.revenue));

  // Market metrics integration
  const marketBreakdown = [
    { l: "Total Market (TAM)", v: result.TAM || "$45B", c: "#007a61", sub: "Total addressable market" },
    { l: "Serviceable Market (SAM)", v: result.SAM || "$8B", c: "#1a56db", sub: "Segment reachable" },
    { l: "Obtainable Target (SOM)", v: result.SOM || "$500M", c: "#d6004e", sub: "Year 1-2 objective" },
    { l: "Projected YoY Growth", v: `+${result.yoy_growth || 28}%`, c: "#c47a00", sub: "Category annual CAGR" },
  ];

  return (
    <div className="fin-tab-wrap">
      {/* 4 Top KPI Cards */}
      <div className="fin-kpi-grid">
        {kpiCards.map((c) => (
          <div key={c.label} className="fin-kpi-card">
            <div className="fin-kpi-header">
              <span className="fin-kpi-label">{c.label}</span>
              <span className="fin-kpi-badge">{c.badge}</span>
            </div>
            <div className="fin-kpi-val" style={{ color: c.color }}>
              {c.val}
            </div>
            <div className="fin-kpi-sub">
              <span className="fin-kpi-change">{c.change}</span>
              <span>{c.sub}</span>
            </div>
            <div className="fin-kpi-bar">
              <div
                className="fin-kpi-bar-fill"
                style={{ background: c.color, width: "65%" }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Middle Analytical Grid (3 Columns) */}
      <div className="fin-analytics-grid">
        {/* Left: Revenue Projection & Cost Allocation */}
        <div className="db-card">
          <div className="db-card-header">
            <div>
              <div className="db-card-title">Revenue & Cost Structure</div>
              <div className="db-card-sub">Operational expenditure allocation</div>
            </div>
            <span className="db-badge green">82% Gross Margin</span>
          </div>
          <div className="db-card-body">
            <div className="fin-proj-list">
              {projectionBreakdown.map((p) => (
                <div key={p.label} className="fin-proj-item">
                  <div className="fin-proj-row">
                    <span className="fin-proj-name">{p.label}</span>
                    <span className="fin-proj-pct">{p.pct}%</span>
                  </div>
                  <div className="fin-proj-track">
                    <div
                      className="fin-proj-fill"
                      style={{ width: `${p.pct}%`, background: p.color }}
                    />
                  </div>
                  <div className="fin-proj-val">{p.val}</div>
                </div>
              ))}
            </div>
            <div className="fin-model-pill">
              <strong>Pricing Model:</strong> {result.pricing_model || "Freemium + Usage-based B2B Tiering"}
            </div>
          </div>
        </div>

        {/* Middle: Revenue Simulation & Growth Trajectory Chart */}
        <div className="db-card">
          <div className="db-card-header">
            <div>
              <div className="db-card-title">Revenue & Market Trajectory</div>
              <div className="db-card-sub">5-Year Growth vs. Operational Burn ($k)</div>
            </div>
            <div className="fin-chart-legend">
              <span className="legend-item">
                <span className="legend-dot" style={{ background: "#007a61" }} />
                Revenue
              </span>
              <span className="legend-item">
                <span className="legend-dot" style={{ background: "#a3c2b8" }} />
                Burn
              </span>
            </div>
          </div>
          <div className="db-card-body">
            <div className="fin-bars-chart">
              {trajectoryData.map((d) => {
                const revHeight = Math.round((d.revenue / maxVal) * 160);
                const costHeight = Math.round((d.costs / maxVal) * 160);
                return (
                  <div key={d.year} className="fin-bar-group">
                    <div className="fin-bar-pair">
                      <div
                        className="fin-bar-col rev"
                        style={{ height: `${revHeight}px` }}
                        title={`Revenue: $${d.revenue}k`}
                      />
                      <div
                        className="fin-bar-col cost"
                        style={{ height: `${costHeight}px` }}
                        title={`Costs: $${d.costs}k`}
                      />
                    </div>
                    <span className="fin-bar-year">{d.year}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Valuation Target & Unit Economics */}
        <div className="db-card">
          <div className="db-card-header">
            <div>
              <div className="db-card-title">StartIQ Capital Metrics</div>
              <div className="db-card-sub">Early-stage investor profile</div>
            </div>
            <span className="db-badge green">▲ Strong</span>
          </div>
          <div className="db-card-body">
            <div className="fin-target-wrap">
              <div className="fin-target-label">Target Pre-Money Valuation</div>
              <div className="fin-target-val">{result.target_valuation || "$7,500,000"}</div>
            </div>

            <div className="fin-metrics-table">
              <div className="fin-metric-row">
                <span className="fin-metric-name">Operating Runway</span>
                <span className="fin-metric-val">{result.runway_months || "22 Months"}</span>
              </div>
              <div className="fin-metric-row">
                <span className="fin-metric-name">LTV / CAC Ratio</span>
                <span className="fin-metric-val">{result.ltv_cac || "4.85x"}</span>
              </div>
              <div className="fin-metric-row">
                <span className="fin-metric-name">Target Gross Margin</span>
                <span className="fin-metric-val">{result.gross_margin || "82%"}</span>
              </div>
              <div className="fin-metric-row">
                <span className="fin-metric-name">Finance Score</span>
                <span className="fin-metric-val" style={{ color: "#007a61" }}>
                  {result.finance || 72}/100
                </span>
              </div>
            </div>

            <button
              type="button"
              className="fin-export-btn"
              onClick={() => alert("Pro-Forma financial model export is available in StartIQ Pro.")}
            >
              Export Pro-Forma Model ↗
            </button>
          </div>
        </div>
      </div>

      {/* Bottom: TAM, SAM, SOM & Price Discovery Simulation */}
      <div className="db-card" style={{ marginTop: 24 }}>
        <div className="db-card-header">
          <div>
            <div className="db-card-title">Addressable Market Sizing & Price Discovery</div>
            <div className="db-card-sub">
              Monte-Carlo market simulation & addressable capture targets
            </div>
          </div>
          <span className="db-badge green">▲ Bullish</span>
        </div>
        <Candles h={210} />
        <div className="fin-market-grid">
          {marketBreakdown.map((f) => (
            <div key={f.l} className="fin-market-item">
              <div className="fin-market-label">{f.l}</div>
              <div className="fin-market-val" style={{ color: f.c }}>
                {f.v}
              </div>
              <div className="fin-market-sub">{f.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
