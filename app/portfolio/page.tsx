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
  { id: "k8s", name: "Kubernetes", category: "Cloud", score: 89, growth: 9, risk: 12, salary: 38, icon: "⚙️" },
  { id: "rust", name: "Rust", category: "Systems", score: 78, growth: 15, risk: 7, salary: 45, icon: "🦀" },
  { id: "react", name: "React", category: "Web", score: 85, growth: 5, risk: 20, salary: 25, icon: "⚛️" },
  { id: "ts", name: "TypeScript", category: "Web", score: 87, growth: 7, risk: 18, salary: 28, icon: "📝" },
  { id: "blockchain", name: "Blockchain", category: "Crypto", score: 62, growth: -2, risk: 30, salary: 35, icon: "⛓️" },
  { id: "manualqa", name: "Manual QA", category: "Testing", score: 38, growth: -5, risk: 80, salary: 8, icon: "🐛" },
  { id: "python", name: "Python", category: "AI", score: 94, growth: 8, risk: 12, salary: 35, icon: "🐍" },
  { id: "go", name: "Golang", category: "Systems", score: 80, growth: 5, risk: 14, salary: 38, icon: "🐹" },
];

const CATEGORY_COLORS: Record<string, string> = {
  "AI": "#3b82f6", "Security": "#ef4444", "Cloud": "#06b6d4",
  "Systems": "#8b5cf6", "Web": "#a78bfa", "Crypto": "#f59e0b",
  "Testing": "#94a3b8",
};

function generatePortfolioHistory(skills: typeof AVAILABLE_SKILLS, months: number) {
  const history: number[] = [];
  let value = skills.reduce((a, s) => a + s.salary, 0);
  for (let m = 0; m <= months; m++) {
    const drift = skills.reduce((a, s) => a + s.growth / 12, 0) / skills.length;
    const noise = (Math.random() - 0.5) * 3;
    value = Math.max(0, value * (1 + drift / 100) + noise);
    history.push(Math.round(value * 10) / 10);
  }
  return history;
}

export default function PortfolioPage() {
  const [portfolio, setPortfolio] = useState<string[]>(["llm", "cybersec", "cloud", "ds"]);
  const [months, setMonths] = useState(24);
  const [history, setHistory] = useState<number[]>([]);

  const selectedSkills = AVAILABLE_SKILLS.filter(s => portfolio.includes(s.id));

  useEffect(() => {
    if (selectedSkills.length > 0) {
      setHistory(generatePortfolioHistory(selectedSkills, months));
    }
  }, [portfolio, months]);

  const toggle = (id: string) => {
    setPortfolio(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const totalValue = selectedSkills.reduce((a, s) => a + s.salary, 0);
  const avgGrowth = selectedSkills.length > 0
    ? selectedSkills.reduce((a, s) => a + s.growth, 0) / selectedSkills.length
    : 0;
  const avgRisk = selectedSkills.length > 0
    ? selectedSkills.reduce((a, s) => a + s.risk, 0) / selectedSkills.length
    : 0;

  const lineData = {
    labels: Array.from({ length: history.length }, (_, i) => {
      const d = new Date(2024, 0, 1);
      d.setMonth(d.getMonth() + i);
      return d.toLocaleString("default", { month: "short", year: "2-digit" });
    }),
    datasets: [{
      label: "Portfolio Value",
      data: history,
      borderColor: "#10b981",
      backgroundColor: "rgba(16,185,129,0.1)",
      fill: true, tension: 0.4, borderWidth: 3, pointRadius: 0,
    }],
  };

  const categoryBreakdown = Object.entries(
    selectedSkills.reduce((acc, s) => {
      acc[s.category] = (acc[s.category] || 0) + s.salary;
      return acc;
    }, {} as Record<string, number>)
  );

  const donutData = {
    labels: categoryBreakdown.map(([c]) => c),
    datasets: [{
      data: categoryBreakdown.map(([, v]) => v),
      backgroundColor: categoryBreakdown.map(([c]) => `${CATEGORY_COLORS[c] || "#94a3b8"}cc`),
      borderColor: categoryBreakdown.map(([c]) => CATEGORY_COLORS[c] || "#94a3b8"),
      borderWidth: 2,
    }],
  };

  const chartOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { backgroundColor: "#0f1a2e", borderColor: "rgba(59,130,246,0.3)", borderWidth: 1, titleColor: "#f1f5f9", bodyColor: "#94a3b8" } },
    scales: {
      x: { grid: { color: "rgba(255,255,255,0.05)" }, ticks: { color: "#94a3b8", font: { size: 10 }, maxTicksLimit: 12 } },
      y: { grid: { color: "rgba(255,255,255,0.05)" }, ticks: { color: "#94a3b8", font: { size: 10 }, callback: (v: any) => `₹${v}L` } },
    },
  };

  return (
    <div style={{ maxWidth: 1300, margin: "0 auto" }}>
      <div style={{ marginBottom: 24 }}>
        <h1 className="section-title" style={{ background: "linear-gradient(135deg, #f97316, #f59e0b)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Skill Investment Portfolio
        </h1>
        <p className="section-subtitle">Build and track your skill portfolio like financial investments</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: 20 }}>
        {/* Skill picker */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="glass-card" style={{ padding: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", marginBottom: 14 }}>📋 Select Skills to Invest</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {AVAILABLE_SKILLS.map(s => {
                const inPortfolio = portfolio.includes(s.id);
                const color = CATEGORY_COLORS[s.category] || "#94a3b8";
                return (
                  <div key={s.id} onClick={() => toggle(s.id)} style={{
                    padding: "10px 12px", borderRadius: 10, cursor: "pointer",
                    background: inPortfolio ? `${color}10` : "rgba(255,255,255,0.02)",
                    border: `1px solid ${inPortfolio ? color : "#1e293b"}`,
                    transition: "all 0.2s",
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 18 }}>{s.icon}</span>
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 600, color: inPortfolio ? "#f1f5f9" : "#94a3b8" }}>{s.name}</div>
                          <div style={{ fontSize: 10, color: "#475569" }}>Growth: <span style={{ color: s.growth > 0 ? "#10b981" : "#ef4444" }}>{s.growth > 0 ? "+" : ""}{s.growth}%</span></div>
                        </div>
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: inPortfolio ? color : "#475569" }}>
                        ₹{s.salary}L
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="glass-card" style={{ padding: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 13, color: "#94a3b8" }}>Forecast period</span>
              <span style={{ fontSize: 14, fontWeight: 800, color: "#f97316" }}>{months}M</span>
            </div>
            <input type="range" min={6} max={60} step={6} value={months} onChange={e => setMonths(+e.target.value)}
              style={{ width: "100%", accentColor: "#f97316" }} />
          </div>
        </div>

        {/* Portfolio view */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* KPIs */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
            {[
              { label: "Portfolio Skills", value: selectedSkills.length, color: "#3b82f6", icon: "📦" },
              { label: "Combined Value", value: `₹${totalValue}L`, color: "#10b981", icon: "💰" },
              { label: "Avg Growth", value: `${avgGrowth.toFixed(1)}%/yr`, color: "#f97316", icon: "📈" },
              { label: "Avg Risk", value: `${avgRisk.toFixed(0)}%`, color: avgRisk > 50 ? "#ef4444" : "#f59e0b", icon: "⚠️" },
            ].map((s, i) => (
              <div key={i} className="glass-card" style={{ padding: 16 }}>
                <div style={{ fontSize: 20, marginBottom: 6 }}>{s.icon}</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: s.color, fontFamily: "Orbitron, sans-serif" }}>{s.value}</div>
                <div style={{ fontSize: 11, color: "#94a3b8" }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Growth chart */}
          <div className="glass-card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", marginBottom: 16 }}>📈 Portfolio Growth Forecast ({months} months)</h3>
            <div style={{ height: 220 }}>
              {history.length > 0 ? <Line data={lineData} options={chartOptions as any} /> : (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#475569" }}>
                  Select skills to see portfolio forecast
                </div>
              )}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {/* Allocation */}
            <div className="glass-card" style={{ padding: 24 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", marginBottom: 16 }}>🎯 Category Allocation</h3>
              {selectedSkills.length > 0 ? (
                <div style={{ height: 180 }}>
                  <Doughnut data={donutData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "bottom", labels: { color: "#94a3b8", font: { size: 11 } } } } }} />
                </div>
              ) : (
                <div style={{ height: 180, display: "flex", alignItems: "center", justifyContent: "center", color: "#475569" }}>
                  No skills selected
                </div>
              )}
            </div>

            {/* Risk Analysis */}
            <div className="glass-card" style={{ padding: 24 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", marginBottom: 16 }}>⚠️ Risk Analysis</h3>
              {selectedSkills.map(s => (
                <div key={s.id} style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 12, color: "#94a3b8" }}>{s.icon} {s.name}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: s.risk < 20 ? "#10b981" : s.risk < 50 ? "#f59e0b" : "#ef4444" }}>
                      {s.risk}%
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{
                      width: `${s.risk}%`,
                      background: s.risk < 20 ? "#10b981" : s.risk < 50 ? "#f59e0b" : "#ef4444"
                    }} />
                  </div>
                </div>
              ))}
              {selectedSkills.length === 0 && <div style={{ color: "#475569", fontSize: 13 }}>No skills in portfolio</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
