"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";

const stats = [
  { label: "Total Skills Tracked", value: "2,847", icon: "🎯", color: "#3b82f6", change: "+12.4%" },
  { label: "Avg Market Demand", value: "73.2", icon: "📊", color: "#10b981", change: "+8.1%" },
  { label: "Careers Simulated", value: "14,392", icon: "🚀", color: "#8b5cf6", change: "+23.7%" },
  { label: "Automation Risk Alerts", value: "428", icon: "⚠️", color: "#f59e0b", change: "-3.2%" },
];

const trendingSkills = [
  { name: "LLM Engineering", score: 99, change: 12.4, category: "AI" },
  { name: "Rust", score: 89, change: 7.8, category: "Systems" },
  { name: "Cybersecurity", score: 92, change: 6.2, category: "Security" },
  { name: "Kubernetes", score: 88, change: 5.1, category: "Cloud" },
  { name: "Data Science", score: 87, change: 4.3, category: "AI" },
  { name: "Cloud AWS", score: 91, change: 3.9, category: "Cloud" },
];

const decliningSkills = [
  { name: "Manual QA", score: 38, change: -4.8 },
  { name: "Flash Dev", score: 12, change: -18.4 },
  { name: "COBOL", score: 22, change: -11.2 },
  { name: "Web3/DApps", score: 55, change: -2.1 },
];

const features = [
  { href: "/resume", icon: "📄", title: "Resume Analyzer", desc: "Upload your resume and extract skills using NLP", color: "#3b82f6" },
  { href: "/skill-graph", icon: "🕸️", title: "Skill Knowledge Graph", desc: "Explore skill relationships in an interactive graph", color: "#8b5cf6" },
  { href: "/career-sim", icon: "🚀", title: "Career Simulator", desc: "Predict your salary and career path trajectory", color: "#10b981" },
  { href: "/skill-market", icon: "📈", title: "Skill Stock Market", desc: "Track skill values like financial assets", color: "#f59e0b" },
  { href: "/galaxy", icon: "🌌", title: "Skill Galaxy", desc: "3D universe of skills and their relationships", color: "#06b6d4" },
  { href: "/world-map", icon: "🌍", title: "Global Demand Map", desc: "Worldwide skill demand heatmap by country", color: "#ec4899" },
  { href: "/portfolio", icon: "💼", title: "Skill Portfolio", desc: "Build and track your skill investment portfolio", color: "#f97316" },
  { href: "/automation", icon: "🤖", title: "Automation Risk", desc: "Predict which skills AI will replace", color: "#ef4444" },
];

const categoryColors: Record<string, string> = {
  "AI": "rgba(59,130,246,0.15)",
  "Systems": "rgba(139,92,246,0.15)",
  "Security": "rgba(236,72,153,0.15)",
  "Cloud": "rgba(6,182,212,0.15)",
};

const categoryTextColors: Record<string, string> = {
  "AI": "#3b82f6",
  "Systems": "#8b5cf6",
  "Security": "#ec4899",
  "Cloud": "#06b6d4",
};

export default function Dashboard() {
  const [counters, setCounters] = useState(stats.map(() => 0));
  const [barWidths, setBarWidths] = useState(trendingSkills.map(() => 0));
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Animate counters
    const timeout = setTimeout(() => {
      setBarWidths(trendingSkills.map(s => s.score));
    }, 300);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    // Mini sparkline canvas
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const points = Array.from({ length: 50 }, (_, i) => ({
      x: (i / 49) * canvas.width,
      y: canvas.height * (0.3 + 0.5 * Math.sin(i * 0.3) * Math.random()),
    }));

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const grad = ctx.createLinearGradient(0, 0, canvas.width, 0);
    grad.addColorStop(0, "#3b82f6");
    grad.addColorStop(0.5, "#06b6d4");
    grad.addColorStop(1, "#8b5cf6");

    ctx.beginPath();
    ctx.strokeStyle = "#3b82f640";
    ctx.lineWidth = 1;
    points.forEach((p, i) => {
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 2;
    const smooth = points.map((p, i, arr) => ({
      x: p.x,
      y: arr.slice(Math.max(0, i - 3), i + 1).reduce((a, b) => a + b.y, 0) / Math.min(i + 1, 3),
    }));
    smooth.forEach((p, i) => {
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });
    ctx.stroke();
  }, []);

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto" }}>
      {/* Hero */}
      <div style={{ marginBottom: 32, position: "relative", overflow: "hidden" }}>
        <div className="orb" style={{ width: 400, height: 400, background: "#3b82f6", top: -200, right: -100 }} />
        <div className="orb" style={{ width: 300, height: 300, background: "#8b5cf6", top: -100, right: 200 }} />
        
        <div style={{ position: "relative" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px",
            background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.3)",
            borderRadius: 999, marginBottom: 16
          }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981", display: "inline-block", boxShadow: "0 0 8px #10b981" }} />
            <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 500 }}>Live Market Data Active</span>
          </div>
          <h1 className="section-title gradient-text-blue" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", marginBottom: 12 }}>
            Skill Economy Simulator
          </h1>
          <p style={{ fontSize: 18, color: "#94a3b8", maxWidth: 600, lineHeight: 1.7, marginBottom: 24 }}>
            Treat skills like economic assets. Predict your career growth, salary trajectory, and future job demand powered by AI.
          </p>
          <div style={{ display: "flex", gap: 12 }}>
            <Link href="/resume">
              <button className="btn-primary">
                🚀 Start Career Analysis
              </button>
            </Link>
            <Link href="/career-sim">
              <button className="btn-ghost">
                📊 Simulate Career
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
        {stats.map((s, i) => (
          <div key={i} className="glass-card glass-card-hover" style={{ padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <div style={{ fontSize: 28 }}>{s.icon}</div>
              <span style={{
                fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 999,
                color: s.change.startsWith("+") ? "#10b981" : "#ef4444",
                background: s.change.startsWith("+") ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
              }}>
                {s.change}
              </span>
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, color: s.color, fontFamily: "Orbitron, sans-serif" }}>
              {s.value}
            </div>
            <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Main content */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
        {/* Trending Skills */}
        <div className="glass-card" style={{ padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9" }}>🔥 Trending Skills</h2>
            <Link href="/skill-market" style={{ fontSize: 12, color: "#3b82f6", textDecoration: "none" }}>View Market →</Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {trendingSkills.map((s, i) => (
              <div key={i}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: "#f1f5f9" }}>{s.name}</span>
                    <span style={{
                      fontSize: 10, padding: "2px 7px", borderRadius: 999, fontWeight: 700,
                      background: categoryColors[s.category] || "rgba(59,130,246,0.1)",
                      color: categoryTextColors[s.category] || "#3b82f6",
                    }}>
                      {s.category}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#f1f5f9" }}>{s.score}</span>
                    <span style={{ fontSize: 12, color: "#10b981", fontWeight: 700 }}>▲ {s.change}%</span>
                  </div>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{
                    width: `${barWidths[i]}%`,
                    background: `linear-gradient(90deg, ${categoryTextColors[s.category] || "#3b82f6"}80, ${categoryTextColors[s.category] || "#3b82f6"})`,
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Declining Skills + Career Index */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div className="glass-card" style={{ padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9" }}>📉 Declining Skills</h2>
              <Link href="/automation" style={{ fontSize: 12, color: "#ef4444", textDecoration: "none" }}>Risk Analysis →</Link>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {decliningSkills.map((s, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", background: "rgba(239,68,68,0.05)", borderRadius: 8, border: "1px solid rgba(239,68,68,0.1)" }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#f1f5f9" }}>{s.name}</div>
                    <div style={{ fontSize: 11, color: "#94a3b8" }}>Demand Score: {s.score}</div>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#ef4444" }}>▼ {Math.abs(s.change)}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card" style={{ padding: 24 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9", marginBottom: 12 }}>📈 Market Health Index</h2>
            <canvas ref={canvasRef} style={{ width: "100%", height: 80 }} />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
              <span style={{ fontSize: 12, color: "#94a3b8" }}>Jan 2024</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: "#10b981" }}>↑ Bullish Market</span>
              <span style={{ fontSize: 12, color: "#94a3b8" }}>Mar 2026</span>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div style={{ marginBottom: 8 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: "#f1f5f9" }}>🧭 Platform Features</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {features.map((f, i) => (
            <Link key={i} href={f.href} style={{ textDecoration: "none" }}>
              <div className="glass-card glass-card-hover" style={{ padding: 20, cursor: "pointer" }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>{f.icon}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", marginBottom: 6 }}>{f.title}</div>
                <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.5 }}>{f.desc}</div>
                <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: f.color, fontWeight: 600 }}>
                  Explore <span>→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
