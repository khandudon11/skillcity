"use client";
import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, Tooltip, Filler
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

const INITIAL_SKILLS = [
  { id: "llm-eng", name: "LLM Engineering", base: 99.1, trend: 0.12, category: "AI", icon: "🤖", vol: 0.04 },
  { id: "rust", name: "Rust", base: 78.5, trend: 0.08, category: "Systems", icon: "⚙️", vol: 0.05 },
  { id: "cybersec", name: "Cybersecurity", base: 91.7, trend: 0.06, category: "Security", icon: "🔐", vol: 0.03 },
  { id: "k8s", name: "Kubernetes", base: 88.9, trend: 0.05, category: "Cloud", icon: "☁️", vol: 0.03 },
  { id: "ds", name: "Data Science", base: 89.5, trend: 0.05, category: "AI", icon: "📊", vol: 0.04 },
  { id: "aws", name: "Cloud AWS", base: 92.8, trend: 0.04, category: "Cloud", icon: "⛅", vol: 0.02 },
  { id: "ts", name: "TypeScript", base: 85.6, trend: 0.04, category: "Web", icon: "📝", vol: 0.03 },
  { id: "go", name: "Golang", base: 80.1, trend: 0.05, category: "Systems", icon: "🐹", vol: 0.04 },
  { id: "react", name: "React", base: 82.4, trend: 0.02, category: "Web", icon: "⚛️", vol: 0.03 },
  { id: "java", name: "Java", base: 71.4, trend: 0.01, category: "Backend", icon: "☕", vol: 0.02 },
  { id: "blockchain", name: "Blockchain", base: 62.3, trend: -0.02, category: "Crypto", icon: "⛓️", vol: 0.08 },
  { id: "manualqa", name: "Manual QA", base: 38.2, trend: -0.05, category: "Testing", icon: "🐛", vol: 0.03 },
  { id: "python", name: "Python", base: 94.2, trend: 0.03, category: "AI", icon: "🐍", vol: 0.02 },
  { id: "next", name: "Next.js", base: 84.1, trend: 0.04, category: "Web", icon: "▲", vol: 0.03 },
  { id: "swift", name: "Swift", base: 74.8, trend: 0.02, category: "Mobile", icon: "🍎", vol: 0.03 },
];

const CATEGORY_COLORS: Record<string, string> = {
  "AI": "#3b82f6", "Systems": "#8b5cf6", "Security": "#ef4444",
  "Cloud": "#06b6d4", "Web": "#a78bfa", "Backend": "#10b981",
  "Crypto": "#f59e0b", "Testing": "#94a3b8", "Mobile": "#ec4899",
};

function sparklineData(history: number[]) {
  return {
    labels: history.map((_, i) => i.toString()),
    datasets: [{
      data: history,
      borderColor: history[history.length - 1] > history[0] ? "#10b981" : "#ef4444",
      backgroundColor: history[history.length - 1] > history[0] ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
      fill: true, tension: 0.4, pointRadius: 0, borderWidth: 2,
    }],
  };
}

const sparkOpts = {
  responsive: true, maintainAspectRatio: false,
  plugins: { legend: { display: false }, tooltip: { enabled: false } },
  scales: { x: { display: false }, y: { display: false } },
};

export default function SkillMarketPage() {
  const [skills, setSkills] = useState(() =>
    INITIAL_SKILLS.map(s => ({
      ...s,
      price: s.base,
      change24h: 0,
      history: [s.base],
      volume: Math.floor(Math.random() * 50000 + 10000),
    }))
  );
  const [sortBy, setSortBy] = useState<"price" | "change" | "volume">("price");
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setSkills(prev => prev.map(s => {
        const drift = s.trend * 0.02;
        const noise = (Math.random() - 0.5) * s.vol * 2;
        const newPrice = Math.max(5, Math.min(100, s.price + drift + noise));
        const change24h = ((newPrice - s.base) / s.base) * 100;
        return {
          ...s,
          price: newPrice,
          change24h,
          history: [...s.history.slice(-30), newPrice],
          volume: s.volume + Math.floor((Math.random() - 0.5) * 500),
        };
      }));
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  const sorted = [...skills].sort((a, b) => {
    if (sortBy === "price") return b.price - a.price;
    if (sortBy === "change") return b.change24h - a.change24h;
    return b.volume - a.volume;
  });

  const selectedSkill = skills.find(s => s.id === selected);

  return (
    <div style={{ maxWidth: 1300, margin: "0 auto" }}>
      <div style={{ marginBottom: 24 }}>
        <h1 className="section-title gradient-text-gold">Skill Stock Market</h1>
        <p className="section-subtitle">Skills as financial assets — track real-time value, trends, and volatility</p>
      </div>

      {/* Market Overview */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Market Cap", value: `$${(skills.reduce((a, s) => a + s.price * 1000, 0) / 1e6).toFixed(2)}M`, color: "#3b82f6", icon: "💹" },
          { label: "Total Volume", value: skills.reduce((a, s) => a + s.volume, 0).toLocaleString(), color: "#10b981", icon: "📦" },
          { label: "Gainers", value: skills.filter(s => s.change24h > 0).length, color: "#10b981", icon: "📈" },
          { label: "Losers", value: skills.filter(s => s.change24h < 0).length, color: "#ef4444", icon: "📉" },
        ].map((s, i) => (
          <div key={i} className="glass-card" style={{ padding: 16 }}>
            <div style={{ fontSize: 20, marginBottom: 6 }}>{s.icon}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: s.color, fontFamily: "Orbitron, sans-serif" }}>{s.value}</div>
            <div style={{ fontSize: 12, color: "#94a3b8" }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20 }}>
        {/* Table */}
        <div className="glass-card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: "1px solid rgba(59,130,246,0.1)" }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9" }}>📊 Skill Market Board</h3>
            <div style={{ display: "flex", gap: 8 }}>
              {(["price", "change", "volume"] as const).map(s => (
                <button key={s} onClick={() => setSortBy(s)} style={{
                  padding: "4px 12px", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer",
                  background: sortBy === s ? "rgba(59,130,246,0.2)" : "transparent",
                  border: `1px solid ${sortBy === s ? "#3b82f6" : "#1e293b"}`,
                  color: sortBy === s ? "#60a5fa" : "#94a3b8",
                }}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Header */}
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1.5fr 1fr 1.2fr", padding: "10px 20px", borderBottom: "1px solid rgba(255,255,255,0.03)", fontSize: 11, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: 1 }}>
            <span>Skill</span><span style={{ textAlign: "right" }}>Price</span><span style={{ textAlign: "center" }}>24h Change</span><span style={{ textAlign: "right" }}>Volume</span><span style={{ textAlign: "center" }}>Trend</span>
          </div>

          {sorted.map(s => (
            <div key={s.id} onClick={() => setSelected(s.id === selected ? null : s.id)} style={{
              display: "grid", gridTemplateColumns: "2fr 1fr 1.5fr 1fr 1.2fr",
              padding: "14px 20px", cursor: "pointer",
              background: selected === s.id ? "rgba(59,130,246,0.06)" : "transparent",
              borderBottom: "1px solid rgba(255,255,255,0.02)",
              transition: "all 0.15s",
            }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(59,130,246,0.04)")}
              onMouseLeave={e => (e.currentTarget.style.background = selected === s.id ? "rgba(59,130,246,0.06)" : "transparent")}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 20 }}>{s.icon}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#f1f5f9" }}>{s.name}</div>
                  <span style={{
                    fontSize: 10, padding: "1px 6px", borderRadius: 999,
                    background: `${CATEGORY_COLORS[s.category] || "#94a3b8"}15`,
                    color: CATEGORY_COLORS[s.category] || "#94a3b8",
                    fontWeight: 700,
                  }}>{s.category}</span>
                </div>
              </div>
              <div style={{ textAlign: "right", fontFamily: "Orbitron, sans-serif", fontSize: 14, fontWeight: 700, color: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                {s.price.toFixed(1)}
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{
                  padding: "3px 10px", borderRadius: 6, fontSize: 12, fontWeight: 700,
                  background: s.change24h >= 0 ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
                  color: s.change24h >= 0 ? "#10b981" : "#ef4444",
                }}>
                  {s.change24h >= 0 ? "▲" : "▼"} {Math.abs(s.change24h).toFixed(2)}%
                </span>
              </div>
              <div style={{ textAlign: "right", fontSize: 12, color: "#94a3b8", display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                {s.volume.toLocaleString()}
              </div>
              <div style={{ height: 40, display: "flex", alignItems: "center" }}>
                <Line data={sparklineData(s.history)} options={sparkOpts as any} />
              </div>
            </div>
          ))}
        </div>

        {/* Detail panel */}
        <div>
          {selectedSkill ? (
            <div className="glass-card" style={{ padding: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                <div style={{ fontSize: 40 }}>{selectedSkill.icon}</div>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: "#f1f5f9" }}>{selectedSkill.name}</h3>
                  <span style={{ fontSize: 12, color: CATEGORY_COLORS[selectedSkill.category] || "#94a3b8" }}>{selectedSkill.category}</span>
                </div>
              </div>
              <div style={{ fontSize: 36, fontWeight: 900, color: "#f1f5f9", fontFamily: "Orbitron, sans-serif", marginBottom: 4 }}>
                {selectedSkill.price.toFixed(2)}
              </div>
              <div style={{ fontSize: 14, marginBottom: 24, fontWeight: 700, color: selectedSkill.change24h >= 0 ? "#10b981" : "#ef4444" }}>
                {selectedSkill.change24h >= 0 ? "▲" : "▼"} {Math.abs(selectedSkill.change24h).toFixed(2)}% today
              </div>

              <div style={{ height: 120, marginBottom: 20 }}>
                <Line data={sparklineData(selectedSkill.history)} options={sparkOpts as any} />
              </div>

              {[
                { label: "All-time High", value: Math.max(...selectedSkill.history).toFixed(1) },
                { label: "All-time Low", value: Math.min(...selectedSkill.history).toFixed(1) },
                { label: "24h Volume", value: selectedSkill.volume.toLocaleString() },
                { label: "Category", value: selectedSkill.category },
              ].map((row, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <span style={{ fontSize: 13, color: "#94a3b8" }}>{row.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#f1f5f9" }}>{row.value}</span>
                </div>
              ))}

              <div style={{ marginTop: 20 }}>
                <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 8 }}>Skill Value Formula</div>
                <div style={{ padding: "12px 14px", background: "rgba(59,130,246,0.05)", borderRadius: 8, border: "1px solid rgba(59,130,246,0.1)" }}>
                  <div style={{ fontSize: 11, color: "#94a3b8", fontFamily: "monospace" }}>
                    Value = (Demand × Salary × Growth)<br />
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;÷ (AutoRisk × Supply)
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-card" style={{ padding: 24, textAlign: "center" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📊</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9", marginBottom: 8 }}>Select a Skill</div>
              <div style={{ fontSize: 13, color: "#94a3b8" }}>Click any skill in the market board to view detailed analytics</div>
            </div>
          )}

          <div className="glass-card" style={{ padding: 20, marginTop: 16 }}>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: "#f1f5f9", marginBottom: 12 }}>🔥 Top Movers</h4>
            {[...skills].sort((a, b) => b.change24h - a.change24h).slice(0, 4).map(s => (
              <div key={s.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span>{s.icon}</span>
                  <span style={{ fontSize: 13, color: "#f1f5f9" }}>{s.name}</span>
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: s.change24h >= 0 ? "#10b981" : "#ef4444" }}>
                  {s.change24h >= 0 ? "▲" : "▼"} {Math.abs(s.change24h).toFixed(2)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
