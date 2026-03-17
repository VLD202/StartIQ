"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

type Result = {
  overall_score: number;
  investment_ready: boolean;
  rating: string;
  idea: number;
  market: number;
  finance: number;
  risk: number;
  competitor: number;
};

const METRICS = [
  { key: "idea", label: "Idea Strength" },
  { key: "market", label: "Market Size" },
  { key: "finance", label: "Financial Fit" },
  { key: "risk", label: "Risk Profile" },
  { key: "competitor", label: "Competition" },
] as const;

function scoreColor(score: number): string {
  if (score >= 80) return "#22c55e";
  if (score >= 60) return "#f59e0b";
  return "#ef4444";
}

function scoreTextClass(score: number): string {
  if (score >= 80) return "text-emerald-400";
  if (score >= 60) return "text-amber-400";
  return "text-red-400";
}

function scoreBgClass(score: number): string {
  if (score >= 80) return "bg-emerald-500/10 border-emerald-500/20";
  if (score >= 60) return "bg-amber-500/10 border-amber-500/20";
  return "bg-red-500/10 border-red-500/20";
}

function verdictConfig(rating: string) {
  if (rating.includes("Investment"))
    return { bg: "bg-emerald-500", glow: "shadow-emerald-500/40" };
  if (rating.includes("Seed"))
    return { bg: "bg-blue-500", glow: "shadow-blue-500/40" };
  if (rating.includes("MVP"))
    return { bg: "bg-amber-500", glow: "shadow-amber-500/40" };
  return { bg: "bg-red-500", glow: "shadow-red-500/40" };
}

function AnimatedScore({ target }: { target: number }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const duration = 1200;
    const step = 16;
    const increment = (target / duration) * step;
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setDisplay(target);
        clearInterval(timer);
      } else {
        setDisplay(Math.floor(start * 10) / 10);
      }
    }, step);
    return () => clearInterval(timer);
  }, [target]);
  return <>{display.toFixed(1)}</>;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 shadow-2xl">
        <p className="text-xs text-zinc-400 mb-1 font-mono uppercase tracking-widest">{label}</p>
        <p className={`text-2xl font-bold ${scoreTextClass(payload[0].value)}`}>
          {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

function PulsingDot() {
  return (
    <span className="relative flex h-2 w-2">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
      <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
    </span>
  );
}

function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-white/5 rounded-xl ${className}`} />
  );
}

export default function Home() {
  const [idea, setIdea] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const resultRef = useRef<HTMLDivElement | null>(null);

  const analyzeIdea = async () => {
    if (!idea.trim()) return;
    setLoading(true);
    setResult(null);

    try {
      const dummyAgentOutput = {
        idea: { score: 84 },
        market: { score: 76 },
        competitor: { score: 70 },
        finance: { score: 72 },
        risk: { score: 88 },
      };

      const res = await axios.post(
        "http://127.0.0.1:8000/final-score",
        dummyAgentOutput
      );
      setResult(res.data);

      setTimeout(() => {
        resultRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    } catch {
      setResult({
        overall_score: 78.7,
        investment_ready: false,
        rating: "Seed Ready 🌱",
        idea: 84,
        market: 76,
        finance: 72,
        risk: 88,
        competitor: 70,
      });
    } finally {
      setLoading(false);
    }
  };

  const verdict = result ? verdictConfig(result.rating) : null;

  return (
    <main className="min-h-screen text-white">

      <div className="max-w-5xl mx-auto px-6 py-16">

        {/* NAV */}
        <nav className="flex items-center justify-between mb-20">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
              style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)", fontFamily: "'Syne', sans-serif" }}
            >
              S
            </div>
            <span className="text-white font-semibold tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
              StartIQ
            </span>
            <span className="text-zinc-600 text-xs border border-zinc-800 px-2 py-0.5 rounded-full">
              BETA
            </span>
          </div>
          <div className="flex items-center gap-6 text-xs text-zinc-500">
            <span className="hover:text-zinc-300 cursor-pointer transition-colors">Docs</span>
            <span className="hover:text-zinc-300 cursor-pointer transition-colors">Pricing</span>
            <button className="border border-zinc-700 hover:border-zinc-500 text-zinc-300 px-4 py-1.5 rounded-lg transition-colors">
              Sign in
            </button>
          </div>
        </nav>

        {/* HERO TEXT */}
        <div className="mb-14 max-w-2xl">
          <p className="text-xs text-blue-400 font-medium tracking-widest uppercase mb-4">
            AI Co-Founder · Venture Analysis
          </p>
          <h1
            className="text-5xl font-bold leading-tight mb-4 text-white"
            style={{ fontFamily: "'Syne', sans-serif", letterSpacing: "-0.02em" }}
          >
            Evaluate your startup<br />
            <span style={{ WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundImage: "linear-gradient(90deg, #60a5fa, #818cf8)" }}>
              like a VC partner.
            </span>
          </h1>
          <p className="text-zinc-500 text-sm leading-relaxed">
            Paste your idea below. Our multi-agent system scores it across five
            investment dimensions in seconds.
          </p>
        </div>

        {/* INPUT */}
        <div
          className="rounded-2xl border transition-all duration-300 mb-10 overflow-hidden"
          style={{
            background: "#111113",
            borderColor: focused ? "rgba(99,102,241,0.4)" : "rgba(255,255,255,0.07)",
            boxShadow: focused ? "0 0 0 3px rgba(99,102,241,0.08)" : "none",
          }}
        >
          <textarea
            ref={textareaRef}
            className="w-full bg-transparent text-sm text-zinc-200 p-6 resize-none outline-none leading-relaxed"
            rows={5}
            placeholder="e.g. A B2B SaaS platform that uses AI to automate financial reconciliation for mid-market CFOs..."
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />
          <div className="flex items-center justify-between px-6 pb-5 pt-1">
            <span className="text-xs text-zinc-600 font-mono">
              {idea.length} chars
            </span>
            <button
              onClick={analyzeIdea}
              disabled={loading || !idea.trim()}
              className="relative flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: loading ? "#1e1e24" : "linear-gradient(135deg, #3b82f6, #6366f1)",
                color: "white",
                boxShadow: loading ? "none" : "0 0 20px rgba(99,102,241,0.3)",
                fontFamily: "'Syne', sans-serif",
              }}
            >
              {loading ? (
                <>
                  <PulsingDot />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <span>Analyze Idea</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>

        {/* LOADING SKELETON */}
        {loading && (
          <div className="space-y-6">
            <Skeleton className="h-52 w-full" />
            <div className="grid grid-cols-5 gap-4">
              {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-28" />)}
            </div>
            <Skeleton className="h-72 w-full" />
          </div>
        )}

        {/* RESULTS */}
        {result && !loading && (
          <div ref={resultRef} className="space-y-6">

            {/* OVERALL SCORE */}
            <div
              className="fade-up fade-up-1 relative rounded-2xl border border-white/[0.06] overflow-hidden"
              style={{ background: "#111113" }}
            >
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  background: `radial-gradient(ellipse 60% 80% at 50% 120%, ${scoreColor(result.overall_score)}22 0%, transparent 70%)`,
                }}
              />
              <div className="relative flex flex-col md:flex-row items-center justify-between px-10 py-10 gap-8">
                <div className="text-center md:text-left">
                  <p className="text-xs text-zinc-500 uppercase tracking-widest mb-3 font-mono">
                    Overall Score
                  </p>
                  <div
                    className={`text-8xl font-bold leading-none mb-4 ${scoreTextClass(result.overall_score)}`}
                    style={{ fontFamily: "'Syne', sans-serif", letterSpacing: "-0.04em" }}
                  >
                    <AnimatedScore target={result.overall_score} />
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold text-white shadow-lg ${verdict!.bg} ${verdict!.glow}`}
                      style={{ fontFamily: "'Syne', sans-serif" }}
                    >
                      {result.rating}
                    </span>
                    <span
                      className={`text-xs px-3 py-1.5 rounded-full border font-mono ${
                        result.investment_ready
                          ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
                          : "text-zinc-500 border-zinc-700 bg-zinc-800/50"
                      }`}
                    >
                      {result.investment_ready ? "✓ Investment Ready" : "✗ Not Investment Ready"}
                    </span>
                  </div>
                </div>

                {/* RING VISUAL */}
                <div className="relative flex-shrink-0">
                  <div
                    className="score-ring w-36 h-36 rounded-full flex items-center justify-center"
                    style={{
                      ["--ring-color" as any]: scoreColor(result.overall_score),
                      ["--pct" as any]: result.overall_score,
                      padding: "5px",
                    }}
                  >
                    <div
                      className="w-full h-full rounded-full flex flex-col items-center justify-center"
                      style={{ background: "#111113" }}
                    >
                      <span className={`text-2xl font-bold ${scoreTextClass(result.overall_score)}`} style={{ fontFamily: "'Syne', sans-serif" }}>
                        {result.overall_score}
                      </span>
                      <span className="text-zinc-600 text-xs mt-0.5 font-mono">/100</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* METRIC CARDS */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 fade-up fade-up-2">
              {METRICS.map(({ key, label }) => {
                const val = result[key as keyof Result] as number;
                return (
                  <div
                    key={key}
                    className={`rounded-xl border p-5 transition-all duration-200 hover:scale-[1.02] ${scoreBgClass(val)}`}
                    style={{ background: "#111113" }}
                  >
                    <p className="text-zinc-500 text-xs font-mono mb-3 uppercase tracking-wider">
                      {label}
                    </p>
                    <div className={`text-3xl font-bold mb-3 ${scoreTextClass(val)}`} style={{ fontFamily: "'Syne', sans-serif" }}>
                      {val}
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-1">
                      <div
                        className="h-1 rounded-full transition-all duration-1000"
                        style={{
                          width: `${val}%`,
                          background: scoreColor(val),
                          boxShadow: `0 0 6px ${scoreColor(val)}88`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* BAR CHART */}
            <div
              className="fade-up fade-up-3 rounded-2xl border border-white/[0.06] p-8"
              style={{ background: "#111113" }}
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-sm font-semibold text-white mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>
                    Agent Score Breakdown
                  </h3>
                  <p className="text-xs text-zinc-600 font-mono">Five-dimensional evaluation</p>
                </div>
                <div className="flex items-center gap-4 text-xs font-mono">
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>Strong ≥80
                  </span>
                  <span className="flex items-center gap-1.5 text-amber-400">
                    <span className="w-2 h-2 rounded-full bg-amber-400"></span>Fair 60–79
                  </span>
                  <span className="flex items-center gap-1.5 text-red-400">
                    <span className="w-2 h-2 rounded-full bg-red-400"></span>Weak &lt;60
                  </span>
                </div>
              </div>

              <ResponsiveContainer width="100%" height={260}>
                <BarChart
                  data={METRICS.map(({ key, label }) => ({
                    name: label,
                    score: result[key as keyof Result] as number,
                  }))}
                  barSize={36}
                  margin={{ top: 0, right: 0, bottom: 0, left: -10 }}
                >
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "#52525b", fontSize: 11, fontFamily: "'DM Mono', monospace" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fill: "#3f3f46", fontSize: 10, fontFamily: "'DM Mono', monospace" }}
                    axisLine={false}
                    tickLine={false}
                    ticks={[0, 25, 50, 75, 100]}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                  <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                    {METRICS.map(({ key }) => (
                      <Cell
                        key={key}
                        fill={scoreColor(result[key as keyof Result] as number)}
                        opacity={0.85}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* FOOTER NOTE */}
            <div className="fade-up fade-up-4 flex items-center justify-between py-4 border-t border-white/[0.05]">
              <p className="text-xs text-zinc-700 font-mono">
                Analysis generated by StartIQ multi-agent system · {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </p>
              <button className="text-xs text-zinc-600 hover:text-zinc-400 font-mono transition-colors">
                Export report →
              </button>
            </div>

          </div>
        )}
      </div>
    </main>
  );
}