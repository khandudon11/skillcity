"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";

const stats = [
  { label: "Total Skills Tracked", value: "2,847", icon: "🎯", color: "var(--accent-blue)", change: "+12.4%" },
  { label: "Avg Market Demand", value: "73.2", icon: "📊", color: "var(--accent-green)", change: "+8.1%" },
  { label: "Careers Simulated", value: "14,392", icon: "🚀", color: "var(--accent-pink)", change: "+23.7%" },
  { label: "Automation Risk Alerts", value: "428", icon: "⚠️", color: "var(--accent-orange)", change: "-3.2%" },
];

const trendingSkills = [
  { name: "LLM Engineering", score: 99, change: 12.4, category: "AI" },
  { name: "Rust", score: 89, change: 7.8, category: "Systems" },
  { name: "Cybersecurity", score: 92, change: 6.2, category: "Security" },
  { name: "Kubernetes", score: 88, change: 5.1, category: "Cloud" },
  { name: "Data Science", score: 87, change: 4.3, category: "AI" },
  { name: "Cloud AWS", score: 91, change: 3.9, category: "Cloud" },
];

const features = [
  { href: "/resume", icon: "📄", title: "Resume Analyzer", desc: "Upload your resume and extract skills using NLP", color: "var(--accent-blue)" },
  { href: "/skill-graph", icon: "🕸️", title: "Skill Graph", desc: "Explore skill relationships in an interactive graph", color: "var(--accent-pink)" },
  { href: "/career-sim", icon: "🚀", title: "Career Sim", desc: "Predict your salary and career path trajectory", color: "var(--accent-green)" },
  { href: "/skill-market", icon: "📈", title: "Skill Market", desc: "Track skill values like financial assets", color: "var(--accent-orange)" },
  { href: "/galaxy", icon: "🌌", title: "Skill Galaxy", desc: "3D universe of skills and their clusters", color: "var(--accent-cyan)" },
  { href: "/world-map", icon: "🌍", title: "Global Map", desc: "Worldwide skill demand heatmap by country", color: "var(--accent-pink)" },
  { href: "/portfolio", icon: "💼", title: "Portfolio", desc: "Build and track your skill investment portfolio", color: "var(--accent-orange)" },
  { href: "/automation", icon: "🤖", title: "AI Risk", desc: "Predict which skills AI will replace", color: "var(--accent-green)" },
];

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);
  const [barWidths, setBarWidths] = useState(trendingSkills.map(() => 0));
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    setMounted(true);
    const timeout = setTimeout(() => {
      setBarWidths(trendingSkills.map(s => s.score));
    }, 500);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const points = Array.from({ length: 15 }, (_, i) => ({
      x: (i / 14) * canvas.width,
      y: canvas.height * (0.2 + 0.6 * Math.random()),
    }));

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 4;
    ctx.beginPath();
    points.forEach((p, i) => {
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });
    ctx.stroke();

    // Sharp points for neo-brutalism
    points.forEach(p => {
      ctx.fillStyle = "white";
      ctx.strokeStyle = "black";
      ctx.lineWidth = 3;
      ctx.fillRect(p.x - 5, p.y - 5, 10, 10);
      ctx.strokeRect(p.x - 5, p.y - 5, 10, 10);
    });
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto" }}>
      {/* Hero */}
      <div style={{ marginBottom: 60, position: "relative" }}>
        <div style={{ 
          display: "inline-block", 
          background: "var(--accent-cyan)", 
          border: "4px solid black", 
          padding: "10px 20px", 
          boxShadow: "5px 5px 0px 0px black",
          marginBottom: 20,
          fontWeight: 900,
          transform: "rotate(-2deg)"
        }}>
          LIVE FROM THE GLOBAL TERMINAL
        </div>
        
        <h1 style={{ fontSize: "clamp(3rem, 8vw, 6rem)", lineHeight: 0.9, marginBottom: 20 }}>
          SKILL ECONOMY<br />
          <span style={{ background: "black", color: "white", padding: "0 10px" }}>SIMULATOR</span>
        </h1>
        
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "center" }}>
          <p style={{ fontSize: 24, fontWeight: 700, lineHeight: 1.2 }}>
            Treat skills like economic assets. Predict your career growth, salary trajectory, and future job demand powered by AI.
          </p>
          <div style={{ display: "flex", gap: 20 }}>
            <Link href="/resume">
              <button className="brutalist-button" style={{ background: "var(--accent-yellow)", fontSize: 24, padding: "20px 40px" }}>
                LAUNCH ANALYZER
              </button>
            </Link>
            <Link href="/career-sim">
              <button className="brutalist-button" style={{ background: "white", fontSize: 24, padding: "20px 40px" }}>
                RUN SIM
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24, marginBottom: 60 }}>
        {stats.map((s, i) => (
          <div key={i} className="brutalist-card" style={{ background: s.color }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div style={{ fontSize: 40, background: "white", border: "3px solid black", width: 60, height: 60, display: "grid", placeItems: "center", boxShadow: "4px 4px 0px 0px black" }}>{s.icon}</div>
              <span style={{ 
                fontSize: 14, fontWeight: 900, padding: "4px 12px", background: "black", color: "white"
              }}>
                {s.change}
              </span>
            </div>
            <div style={{ fontSize: 48, fontWeight: 900, color: "black", letterSpacing: -2 }}>
              {s.value}
            </div>
            <div style={{ fontSize: 16, fontWeight: 800, color: "black", opacity: 0.8, textTransform: "uppercase" }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, marginBottom: 60 }}>
        {/* Trending */}
        <div className="brutalist-card" style={{ background: "white" }}>
          <h2 style={{ fontSize: 24, marginBottom: 30, textDecoration: "underline" }}>🔥 HOT SKILLS INDEX</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {trendingSkills.map((s, i) => (
              <div key={i}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 18, fontWeight: 900 }}>{s.name}</span>
                    <span className="brutalist-badge" style={{ background: "var(--accent-cyan)" }}>{s.category}</span>
                  </div>
                  <div style={{ fontWeight: 900, fontSize: 20 }}>+{s.change}%</div>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${barWidths[i]}%`, background: "black" }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Market Health */}
        <div className="brutalist-card" style={{ background: "var(--accent-yellow)" }}>
          <h2 style={{ fontSize: 24, marginBottom: 20 }}>📈 MARKET PERFORMANCE</h2>
          <div style={{ background: "white", border: "4px solid black", height: 200, padding: 20, marginBottom: 20, position: "relative" }}>
            <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 900 }}>
            <span>Q1 2024</span>
            <span style={{ background: "black", color: "white", padding: "2px 10px" }}>STATUS: BULLISH</span>
            <span>Q1 2026</span>
          </div>
        </div>
      </div>

      {/* Features */}
      <div style={{ marginBottom: 100 }}>
        <h2 style={{ fontSize: 32, marginBottom: 30, background: "black", color: "white", display: "inline-block", padding: "5px 15px" }}>PLATFORM TERMINALS</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
          {features.map((f, i) => (
            <Link key={i} href={f.href} style={{ textDecoration: "none" }}>
              <div className="brutalist-card" style={{ background: "white", height: "100%" }}>
                <div style={{ fontSize: 48, marginBottom: 20 }}>{f.icon}</div>
                <h3 style={{ fontSize: 20, marginBottom: 10 }}>{f.title}</h3>
                <p style={{ fontWeight: 600, fontSize: 14 }}>{f.desc}</p>
                <div style={{ marginTop: 20, background: f.color, border: "3px solid black", color: "black", textAlign: "center", padding: "8px", fontWeight: 900 }}>
                  ACCESS
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
