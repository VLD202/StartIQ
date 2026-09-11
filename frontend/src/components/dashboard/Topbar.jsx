const PAGE_TITLES = {
  overview: "Dashboard Overview",
  idea: "Idea Analysis",
  market: "Market Research",
  comp: "Competitor Analysis",
  risk: "Risk & SWOT",
  finance: "Financial Model",
};

export default function Topbar({ tab, result }) {
  const isSafe = result?.overall_risk_level === "Low";
  const isHighRisk = result?.overall_risk_level === "High";

  return (
    <header className="db-topbar" key={tab}>
      <div className="db-topbar-left">
        <h1 className="db-topbar-title">{PAGE_TITLES[tab] || "Dashboard"}</h1>
        <div className="db-topbar-breadcrumb">
          StartIQ · Get a 360° AI analysis of your startup.
        </div>
      </div>
      <div className="db-topbar-right">
        <span className="db-badge green">
          <span className="badge-dot" /> {result.rating || "Investment Ready"}
        </span>
        <span
          className={`db-badge ${
            isSafe ? "green" : isHighRisk ? "red" : "amber"
          }`}
        >
          <span className="badge-dot" /> {result.overall_risk_level || "Medium"}{" "}
          Risk
        </span>
        <span className="db-badge-score">
          Score: {result.overall_score}/100
        </span>
      </div>
    </header>
  );
}
