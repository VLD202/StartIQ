import { useEffect, useRef } from "react";

export default function Candles({ h = 160 }) {
  const ref = useRef(null);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    const W = c.parentElement?.offsetWidth || 400;
    c.width = W;
    c.height = h;

    const data = [];
    let price = 100;
    for (let i = 0; i < 32; i++) {
      const o = price;
      const ch = (Math.random() - 0.44) * 7;
      const cl = o + ch;
      data.push({
        open: o,
        close: cl,
        high: Math.max(o, cl) + Math.random() * 4,
        low: Math.min(o, cl) - Math.random() * 3,
      });
      price = cl;
    }

    const mn = Math.min(...data.map((d) => d.low));
    const mx = Math.max(...data.map((d) => d.high));
    const rng = mx - mn || 1;
    const pad = 10;
    const cw = (W - pad * 2) / data.length;
    const ty = (v) => h - pad - ((v - mn) / rng) * (h - pad * 2 - 20);

    let fr = 0;
    let animId = null;

    const draw = () => {
      ctx.clearRect(0, 0, W, h);

      for (let r = 1; r <= 4; r++) {
        const y = pad + (r / 4) * (h - pad * 2 - 20);
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.strokeStyle = "rgba(0,122,97,0.07)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      const vis = Math.min(Math.ceil((fr / 50) * data.length), data.length);
      data.slice(0, vis + 1).forEach((d, i) => {
        const x = pad + i * cw + cw * 0.15;
        const bw = cw * 0.7;
        const isUp = d.close >= d.open;
        const col = isUp ? "#007a61" : "#d6004e";
        const al = i === vis ? (fr % 50) / 50 : 1;

        ctx.globalAlpha = al;
        ctx.beginPath();
        ctx.moveTo(x + bw / 2, ty(d.high));
        ctx.lineTo(x + bw / 2, ty(d.low));
        ctx.strokeStyle = col;
        ctx.lineWidth = 1;
        ctx.stroke();

        const top = ty(Math.max(d.open, d.close));
        const bh = Math.max(2, Math.abs(ty(d.open) - ty(d.close)));
        ctx.fillStyle = col + "cc";
        ctx.fillRect(x, top, bw, bh);
        ctx.globalAlpha = 1;
      });

      fr++;
      if (fr < 50 + data.length) {
        animId = requestAnimationFrame(draw);
      }
    };

    const timer = setTimeout(() => {
      animId = requestAnimationFrame(draw);
    }, 200);

    return () => {
      clearTimeout(timer);
      if (animId) cancelAnimationFrame(animId);
    };
  }, [h]);

  return <canvas ref={ref} style={{ width: "100%", height: h }} />;
}
