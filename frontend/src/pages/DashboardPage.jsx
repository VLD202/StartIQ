import { useState, useEffect } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";
import OverviewTab from "../components/dashboard/OverviewTab";
import IdeaTab from "../components/dashboard/IdeaTab";
import MarketTab from "../components/dashboard/MarketTab";
import CompetitorsTab from "../components/dashboard/CompetitorsTab";
import RiskTab from "../components/dashboard/RiskTab";
import FinanceTab from "../components/dashboard/FinanceTab";
import { COLORS } from "../utils/constants";

export default function DashboardPage({ result, onReset }) {
  const [tab, setTab] = useState("overview");
  const [loading, setLoading] = useState(true);

  const dims = [
    { label: "Idea", score: result.idea, color: COLORS.idea },
    { label: "Market", score: result.market, color: COLORS.market },
    { label: "Finance", score: result.finance, color: COLORS.finance },
    { label: "Risk", score: result.risk, color: COLORS.risk },
    { label: "Competitor", score: result.competitor, color: COLORS.competitor },
  ];

  const radarData = dims.map((d) => ({ label: d.label, score: d.score }));

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 450);
    return () => clearTimeout(t);
  }, [tab]);

  return (
    <div className="db-wrap">
      {/* Subtle Dashboard Background Texture Overlay */}
      <div className="db-bg-overlay" />

      {/* Navigation Sidebar */}
      <Sidebar
        tab={tab}
        setTab={setTab}
        onReset={onReset}
        overallScore={result.overall_score}
        rating={result.rating}
      />

      {/* Main Content Area */}
      <main className="db-main">
        <Topbar tab={tab} result={result} />

        <div className="db-content">
          {loading && (
            <div>
              <div className="db-skel-row">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="db-skel-card" style={{ flex: 1 }}>
                    <div
                      className="db-skeleton"
                      style={{ height: 14, width: "60%", marginBottom: 14 }}
                    />
                    <div
                      className="db-skeleton"
                      style={{ height: 32, width: "40%", marginBottom: 12 }}
                    />
                    <div
                      className="db-skeleton"
                      style={{ height: 6, width: "100%" }}
                    />
                  </div>
                ))}
              </div>
              <div className="db-skel-row">
                <div className="db-skel-card" style={{ flex: 2 }}>
                  <div
                    className="db-skeleton"
                    style={{ height: 14, width: "30%", marginBottom: 18 }}
                  />
                  <div
                    className="db-skeleton"
                    style={{ height: 210, width: "100%" }}
                  />
                </div>
                <div className="db-skel-card" style={{ flex: 1 }}>
                  <div
                    className="db-skeleton"
                    style={{ height: 14, width: "50%", marginBottom: 18 }}
                  />
                  <div
                    className="db-skeleton"
                    style={{
                      height: 200,
                      width: "100%",
                      borderRadius: "50%",
                      margin: "0 auto",
                    }}
                  />
                </div>
              </div>
              <div className="db-skel-card">
                <div
                  className="db-skeleton"
                  style={{ height: 14, width: "25%", marginBottom: 18 }}
                />
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 14,
                  }}
                >
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="db-skeleton"
                      style={{ height: 110 }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {!loading && (
            <div style={{ animation: "contentFade 0.4s ease both" }}>
              {tab === "overview" && (
                <OverviewTab
                  result={result}
                  dims={dims}
                  radarData={radarData}
                  setTab={setTab}
                />
              )}
              {tab === "idea" && <IdeaTab result={result} />}
              {tab === "market" && <MarketTab result={result} />}
              {tab === "comp" && (
                <CompetitorsTab result={result} radarData={radarData} />
              )}
              {tab === "risk" && <RiskTab result={result} />}
              {tab === "finance" && <FinanceTab result={result} />}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
