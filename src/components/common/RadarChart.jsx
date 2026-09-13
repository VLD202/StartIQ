import { useEffect, useRef } from "react";

export default function RadarChart({ data, size = 200 }) {
  const ref = useRef(null);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    c.width = size;
    c.height = size;

    const cx = size / 2;
    const cy = size / 2;
    const R = size * 0.32;
    const n = data.length;
    const angs = data.map((_, i) => -Math.PI / 2 + (2 * Math.PI * i) / n);
    let start = null;
    let animId = null;

    const draw = (ts) => {
      if (!start) start = ts;
      const prog = Math.min((ts - start) / 1400, 1);
      ctx.clearRect(0, 0, size, size);

      for (let r = 1; r <= 5; r++) {
        ctx.beginPath();
        angs.forEach((a, i) => {
          const x = cx + Math.cos(a) * ((R * r) / 5);
          const y = cy + Math.sin(a) * ((R * r) / 5);
          i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        });
        ctx.closePath();
        ctx.strokeStyle = "rgba(0,122,97,0.12)";
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      angs.forEach((a) => {
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R);
        ctx.strokeStyle = "rgba(0,122,97,0.08)";
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      const ease = 1 - Math.pow(1 - prog, 3);
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, R);
      g.addColorStop(0, "rgba(0,210,130,0.25)");
      g.addColorStop(1, "rgba(26,86,219,0.06)");

      ctx.beginPath();
      angs.forEach((a, i) => {
        const d = (data[i].score / 100) * R * ease;
        const x = cx + Math.cos(a) * d;
        const y = cy + Math.sin(a) * d;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      });
      ctx.closePath();
      ctx.fillStyle = g;
      ctx.fill();
      ctx.strokeStyle = "#007a61";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      angs.forEach((a, i) => {
        const d = (data[i].score / 100) * R * ease;
        const x = cx + Math.cos(a) * d;
        const y = cy + Math.sin(a) * d;
        ctx.beginPath();
        ctx.arc(x, y, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = "#007a61";
        ctx.fill();

        const lx = cx + Math.cos(a) * (R + 18);
        const ly = cy + Math.sin(a) * (R + 18);
        ctx.font = "10px 'JetBrains Mono',monospace";
        ctx.fillStyle = "rgba(61,96,85,0.9)";
        ctx.textAlign = "center";
        ctx.fillText(data[i].label, lx, ly + 3.5);
      });

      if (prog < 1) {
        animId = requestAnimationFrame(draw);
      }
    };

    const timer = setTimeout(() => {
      animId = requestAnimationFrame(draw);
    }, 300);

    return () => {
      clearTimeout(timer);
      if (animId) cancelAnimationFrame(animId);
    };
  }, [data, size]);

  return (
    <canvas
      ref={ref}
      style={{
        display: "block",
        width: "100%",
        maxWidth: size,
        margin: "0 auto",
      }}
    />
  );
}
