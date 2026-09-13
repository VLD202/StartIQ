import { NAV_ITEMS } from "../../utils/constants";

export default function Sidebar({ tab, setTab, onReset, overallScore, rating }) {
  return (
    <aside className="db-sidebar">
      <div
        className="db-sidebar-logo"
        onClick={onReset}
        style={{ cursor: "pointer" }}
        title="Back to Landing Page"
        role="button"
        tabIndex={0}
      >
        <div className="db-sidebar-logo-text">
          Start<em>IQ</em>
        </div>
        <div className="db-sidebar-logo-sub">Startup Analyzer</div>
      </div>
      <nav className="db-nav">
        <div className="db-nav-section">Analysis</div>
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`db-nav-item${tab === item.id ? " active" : ""}`}
            onClick={() => setTab(item.id)}
          >
            <span className="ni">{item.icon}</span>
            {item.label}
            {item.badge && <span className="db-nav-badge">{item.badge}</span>}
          </button>
        ))}

        <div className="db-nav-section" style={{ marginTop: 20 }}>
          Actions
        </div>
        <button type="button" className="db-nav-item" onClick={onReset}>
          <span className="ni">＋</span>New Analysis
        </button>
      </nav>

      <div className="db-sidebar-score">
        <div className="db-sidebar-score-label">Overall Score</div>
        <div className="db-sidebar-score-val">{overallScore}</div>
        <div className="db-sidebar-score-sub">{rating}</div>
        <div className="db-sidebar-score-bar">
          <div
            className="db-sidebar-score-fill"
            style={{ width: `${Math.min(Math.max(overallScore || 0, 0), 100)}%` }}
          />
        </div>
      </div>
    </aside>
  );
}
