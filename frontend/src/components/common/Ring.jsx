import { useEffect } from "react";

export default function Ring({ score, size = 110, id = "r", color = "#007a61" }) {
  const stroke = 9;
  const r = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;

  useEffect(() => {
    const el = document.getElementById(`arc-${id}`);
    if (el) {
      setTimeout(() => {
        el.style.strokeDasharray = `${(score / 100) * circ} ${circ}`;
      }, 500);
    }
  }, [score, circ, id]);

  return (
    <div
      style={{ position: "relative", width: size, height: size, flexShrink: 0 }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: "rotate(-90deg)", position: "absolute" }}
      >
        <defs>
          <linearGradient id={`g-${id}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={color} />
            <stop offset="100%" stopColor="#1a56db" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(0,122,97,0.10)"
          strokeWidth={stroke}
          strokeDasharray="3 5"
        />
        <circle
          id={`arc-${id}`}
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={`url(#g-${id})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`0 ${circ}`}
          style={{ transition: "stroke-dasharray 2s cubic-bezier(.4,0,.2,1)" }}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontFamily: "var(--fdisp)",
            fontStyle: "italic",
            fontSize: size * 0.24,
            color,
            lineHeight: 1,
          }}
        >
          {score}
        </div>
        <div
          style={{
            fontFamily: "var(--fmono)",
            fontSize: 11,
            color: "var(--muted)",
            marginTop: 2,
          }}
        >
          /100
        </div>
      </div>
    </div>
  );
}
