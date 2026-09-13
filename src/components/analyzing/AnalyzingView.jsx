import { useState, useEffect } from "react";
import { AGENT_STEPS } from "../../utils/constants";

export default function AnalyzingView({ idea }) {
  const [active, setActive] = useState(0);
  const [skel, setSkel] = useState(false);

  useEffect(() => {
    const t = setInterval(() => {
      setActive((p) => {
        if (p < AGENT_STEPS.length - 1) return p + 1;
        clearInterval(t);
        setTimeout(() => setSkel(true), 600);
        return p;
      });
    }, 440);
    return () => clearInterval(t);
  }, []);

  if (skel) {
    return (
      <div className="anpage">
        <p
          style={{
            fontFamily: "var(--fmono)",
            fontSize: 12,
            color: "var(--teal)",
            letterSpacing: "0.14em",
            marginBottom: 20,
            textTransform: "uppercase",
            fontWeight: 500,
          }}
        >
          Compiling evaluation report…
        </p>
        <div
          style={{
            width: "100%",
            maxWidth: 900,
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          <div className="skel" style={{ height: 140 }} />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4,1fr)",
              gap: 12,
            }}
          >
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="skel" style={{ height: 90 }} />
            ))}
          </div>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <div className="skel" style={{ height: 260 }} />
            <div className="skel" style={{ height: 260 }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="anpage">
      <div className="ancore">
        <div className="anring ar1" />
        <div className="anring ar2" />
        <div className="anring ar3" />
        <div className="anring ar4" />
        <div className="arctr" />
      </div>
      <h2 className="antitle">Analyzing Concept…</h2>
      <p className="anidea">
        "{idea.slice(0, 75)}
        {idea.length > 75 ? "…" : ""}"
      </p>
      <div className="slist">
        {AGENT_STEPS.map((s, i) => (
          <div
            key={i}
            className={`sitem${i < active ? " done" : i === active ? " active" : ""}`}
          >
            <div className="sico">{s.icon}</div>
            <div style={{ flex: 1 }}>
              <div className="slbl">{s.label}</div>
              <div className="sdesc">{s.desc}</div>
            </div>
            {i < active && <span className="sok">✓</span>}
            {i === active && <div className="sspin" />}
          </div>
        ))}
      </div>
    </div>
  );
}
