import { useState } from "react";
import Candles from "../common/Candles";

export default function MarketTab({ result }) {
  const [activeFilter, setActiveFilter] = useState("All");

  const filterTabs = ["All", "Idea", "News", "Social", "Channels"];

  const seriesData = result.market_details_series || [
    { month: "Apr 28", volume: 180, demand: 240, sentiment: 320 },
    { month: "May 12", volume: 340, demand: 420, sentiment: 460 },
    { month: "Jun 04", volume: 590, demand: 610, sentiment: 580 },
    { month: "Jul 18", volume: 740, demand: 820, sentiment: 790 },
    { month: "Aug 26", volume: 920, demand: 950, sentiment: 910 },
  ];

  const maxSeriesVal = 1000;

  return (
    <div className="mkt-tab-wrap">
      {/* Top 3 TAM / SAM / SOM Cards with secondary metrics */}
      <div className="mkt-top-grid">
        {/* TAM Card */}
        <div className="db-card mkt-tier-card">
          <div className="mkt-tier-header">
            <span className="mkt-tier-tag">TAM</span>
            <span className="mkt-badge-green">Global Ceiling</span>
          </div>
          <div className="mkt-tier-val" style={{ color: "#007a61" }}>
            {result.TAM || "$45B"}
          </div>
          <div className="mkt-tier-meta-row">
            <span className="mkt-meta-label">Market Size</span>
            <span className="mkt-meta-val">{result.market_tam_multiplier || "400.75%"}</span>
          </div>
          <div className="mkt-tier-bar">
            <div
              className="mkt-tier-bar-fill"
              style={{ width: result.market_tam_penetration || "50%", background: "#007a61" }}
            />
          </div>
          <div className="mkt-tier-footer-sub">
            50% addressable segment penetration headroom
          </div>
        </div>

        {/* SAM Card */}
        <div className="db-card mkt-tier-card">
          <div className="mkt-tier-header">
            <span className="mkt-tier-tag">SAM</span>
            <span className="mkt-badge-blue">Serviceable</span>
          </div>
          <div className="mkt-tier-val" style={{ color: "#1a56db" }}>
            {result.SAM || "$8B"}
          </div>
          <div className="mkt-tier-meta-row">
            <span className="mkt-meta-label">Reference Volume</span>
            <span className="mkt-meta-val">{result.market_sam_multiplier || "425%"}</span>
          </div>
          <div className="mkt-mini-bars">
            <span className="mini-bar" style={{ height: "40%", background: "#1a56db" }} />
            <span className="mini-bar" style={{ height: "65%", background: "#1a56db" }} />
            <span className="mini-bar" style={{ height: "85%", background: "#1a56db" }} />
            <span className="mini-bar" style={{ height: "100%", background: "#1a56db" }} />
          </div>
          <div className="mkt-tier-footer-sub">
            {result.market_sam_reference || "$0.3K"} core target segment index
          </div>
        </div>

        {/* SOM Card */}
        <div className="db-card mkt-tier-card">
          <div className="mkt-tier-header">
            <span className="mkt-tier-tag">SOM</span>
            <span className="mkt-badge-amber">Obtainable Target</span>
          </div>
          <div className="mkt-tier-val" style={{ color: "#d6004e" }}>
            {result.SOM || "$500M"}
          </div>
          <div className="mkt-tier-meta-row">
            <span className="mkt-meta-label">Near-term Velocity</span>
            <span className="mkt-meta-val" style={{ color: "#007a61" }}>
              {result.market_som_rate || "+2.00%"}
            </span>
          </div>
          <div className="mkt-mini-bars">
            <span className="mini-bar" style={{ height: "30%", background: "#d6004e" }} />
            <span className="mini-bar" style={{ height: "50%", background: "#d6004e" }} />
            <span className="mini-bar" style={{ height: "75%", background: "#d6004e" }} />
            <span className="mini-bar" style={{ height: "95%", background: "#d6004e" }} />
          </div>
          <div className="mkt-tier-footer-sub">
            Target Year 1-2 capture: {result.market_som_volume || "$0.1M"}
          </div>
        </div>
      </div>

      {/* Middle Section: Market Details Time-Series Simulation */}
      <div className="db-card" style={{ marginTop: 24 }}>
        <div className="db-card-header">
          <div>
            <div className="db-card-title">Market Details & Demand Index</div>
            <div className="db-card-sub">
              Multi-channel signal volume and search velocity trajectory
            </div>
          </div>
          <div className="mkt-header-actions">
            <div className="mkt-filter-tabs">
              {filterTabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  className={`mkt-filter-tab ${activeFilter === tab ? "active" : ""}`}
                  onClick={() => setActiveFilter(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
            <span className="db-badge green">▲ +{result.yoy_growth || 28}% CAGR</span>
          </div>
        </div>

        <div className="db-card-body">
          <div className="mkt-time-chart">
            <div className="mkt-chart-y-axis">
              <span>1000</span>
              <span>750</span>
              <span>500</span>
              <span>250</span>
              <span>0</span>
            </div>
            <div className="mkt-chart-bars-wrap">
              {seriesData.map((s, i) => {
                const heightPct = Math.round((s.volume / maxSeriesVal) * 160);
                const isHighlight = i === seriesData.length - 2 || i === seriesData.length - 1;
                return (
                  <div key={s.month} className="mkt-chart-col-group">
                    <div className="mkt-col-val">{s.volume}</div>
                    <div
                      className={`mkt-chart-bar ${isHighlight ? "highlight" : ""}`}
                      style={{ height: `${heightPct}px` }}
                    />
                    <span className="mkt-chart-month">{s.month}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Macro Trends & Strategic Whitespace */}
      <div className="db-grid-2" style={{ marginTop: 24 }}>
        {/* Macro Tailwinds & Audience */}
        <div className="db-card">
          <div className="db-card-header">
            <div>
              <div className="db-card-title">Market Trends & Drivers</div>
              <div className="db-card-sub">Key structural tailwinds propelling adoption</div>
            </div>
            <span className="db-badge green">Macro Tailwinds</span>
          </div>
          <div className="db-card-body">
            <div className="mkt-pills-list">
              {(result.market_trends || []).map((t, i) => (
                <span key={i} className="mkt-pill-tag">
                  <span className="mkt-pill-dot" />
                  {t}
                </span>
              ))}
            </div>

            <div className="mkt-audience-section">
              <div className="mkt-audience-title">Target Customer Segments</div>
              <div className="mkt-audience-grid">
                {(result.target_audience_segments || []).map((seg, idx) => (
                  <div key={idx} className="mkt-audience-item">
                    <span className="mkt-seg-num">0{idx + 1}</span>
                    <span className="mkt-seg-text">{seg}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Market Signal Simulation & Strategic Insight */}
        <div className="db-card">
          <div className="db-card-header">
            <div>
              <div className="db-card-title">Market Discovery & Opportunity</div>
              <div className="db-card-sub">Monte-Carlo pricing dynamics & insight</div>
            </div>
            <span className="db-badge green">▲ Bullish</span>
          </div>
          <div className="db-card-body">
            <Candles h={160} />
            <div className="insight-box" style={{ marginTop: 16 }}>
              <div className="insight-label">Key Strategic Market Insight</div>
              <div className="insight-text">
                {result.key_insight ||
                  "Market is propelled by rapid digitization in non-metro areas with a 28% YoY expansion rate."}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
