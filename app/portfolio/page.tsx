"use client";
import { useState, useEffect } from "react";
import { Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement,
  ArcElement, Tooltip, Legend, Filler
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend, Filler);

const AVAILABLE_SKILLS = [
  { id: "llm", name: "LLM Engineering", category: "AI", score: 99, growth: 22, risk: 5, salary: 55, icon: "🤖" },
  { id: "cybersec", name: "Cybersecurity", category: "Security", score: 92, growth: 11, risk: 8, salary: 40, icon: "🔐" },
  { id: "cloud", name: "Cloud AWS", category: "Cloud", score: 91, growth: 8, risk: 10, salary: 35, icon: "☁️" },
  { id: "ds", name: "Data Science", category: "AI", score: 90, growth: 10, risk: 15, salary: 42, icon: "📊" },
  { id: "rust", name: "Rust", category: "Systems", score: 78, growth: 15, risk: 7, salary: 45, icon: "🦀" },
  { id: "react", name: "React", category: "Web", score: 85, growth: 5, risk: 20, salary: 25, icon: "⚛️" },
];

const CATEGORY_COLORS: Record<string, string> = {
  "AI": "#FF00FF", "Security": "#00FFFF", "Cloud": "#FFFF00",
  "Systems": "#00FF00", "Web": "#FF6B00",
};

export default function PortfolioPage() {
  const [portfolio, setPortfolio] = useState<string[]>(["llm", "cybersec", "cloud"]);
  const [months, setMonths] = useState(24);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const selectedSkills = AVAILABLE_SKILLS.filter(s => portfolio.includes(s.id));
  const totalValue = selectedSkills.reduce((a, s) => a + s.salary, 0);

  const toggle = (id: string) => {
    setPortfolio(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const lineData = {
    labels: Array.from({ length: 12 }, (_, i) => `M${i + 1}`),
    datasets: [{
      label: "Portfolio Growth",
      data: Array.from({ length: 12 }, (_, i) => totalValue * (1 + (i * 0.02))),
      borderColor: "black",
      backgroundColor: "var(--accent-green)",
      fill: true,
      borderWidth: 5,
      tension: 0,
    }],
  };

  const donutData = {
    labels: Array.from(new Set(selectedSkills.map(s => s.category))),
    datasets: [{
      data: Array.from(new Set(selectedSkills.map(s => s.category))).map(c => 
        selectedSkills.filter(s => s.category === c).reduce((a, s) => a + s.salary, 0)
      ),
      backgroundColor: ["#FF00FF", "#00FFFF", "#FFFF00", "#00FF00", "#FF6B00"],
      borderColor: "black",
      borderWidth: 3,
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { labels: { font: { weight: "900", size: 10 } } } },
    scales: {
      x: { grid: { color: "black" }, ticks: { color: "black", font: { weight: "900" } } },
      y: { grid: { color: "black" }, ticks: { color: "black", font: { weight: "900" } } },
    }
  };

  if (!mounted) return null;

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ marginBottom: 40 }}>
        <h1 className="section-title">SKILL ASSET PORTFOLIO</h1>
        <p style={{ fontWeight: 800, fontSize: 18 }}>Manage and track your skill equity like a hedge fund</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 24, marginBottom: 40 }}>
        {[
          { label: "ASSETS", val: selectedSkills.length, color: "var(--accent-cyan)" },
          { label: "NET VALUE", val: `$${totalValue}K`, color: "var(--accent-yellow)" },
          { label: "RISK LEVEL", val: "LOW", color: "var(--accent-green)" },
          { label: "YIELD (EST)", val: "+14.2%", color: "var(--accent-pink)" },
        ].map((s, i) => (
          <div key={i} className="brutalist-card" style={{ background: s.color }}>
            <div style={{ fontSize: 12, fontWeight: 900 }}>{s.label}</div>
            <div style={{ fontSize: 32, fontWeight: 900 }}>{s.val}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "350px 1fr", gap: 32 }}>
        <div className="brutalist-card" style={{ background: "white" }}>
          <h3 style={{ marginBottom: 20, textDecoration: "underline" }}>ASSET SELECTOR</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {AVAILABLE_SKILLS.map(s => {
              const active = portfolio.includes(s.id);
              return (
                <div key={s.id} onClick={() => toggle(s.id)} style={{
                  padding: "15px",
                  border: "3px solid black",
                  background: active ? CATEGORY_COLORS[s.category] : "white",
                  boxShadow: active ? "4px 4px 0px 0px black" : "none",
                  cursor: "pointer",
                  fontWeight: 900,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}>
                  <span>{s.icon} {s.name}</span>
                  {active && <span>✓</span>}
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          <div className="brutalist-card" style={{ background: "white", height: 300 }}>
             <h3 style={{ marginBottom: 15 }}>VALUATION FORECAST (12 MONTHS)</h3>
             <div style={{ height: 220 }}>
               <Line data={lineData} options={chartOptions as any} />
             </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 32 }}>
            <div className="brutalist-card" style={{ background: "white" }}>
              <h3 style={{ marginBottom: 15 }}>ALLOCATION</h3>
              <div style={{ height: 180 }}>
                <Doughnut data={donutData} options={{ responsive: true, maintainAspectRatio: false }} />
              </div>
            </div>
            <div className="brutalist-card" style={{ background: "black", color: "white" }}>
              <h3 style={{ marginBottom: 15, color: "var(--accent-yellow)" }}>STRATEGY REPORT</h3>
              <p style={{ fontWeight: 600, lineHeight: 1.5, fontSize: 14 }}>
                Current portfolio is heavily weighted in <span style={{ color: "var(--accent-pink)" }}>AI & DATA</span>. 
                Recommendation: Increase exposure to <span style={{ color: "var(--accent-cyan)" }}>CYBERSECURITY</span> to hedge against automation volatility.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
