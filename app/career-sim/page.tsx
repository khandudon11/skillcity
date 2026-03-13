"use client";
import { useState, useEffect, useRef } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, Title, Tooltip, Legend, Filler
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const ROLES: Record<string, { base: number; growth: number; icon: string; color: string }> = {
  "Software Developer": { base: 8, growth: 1.8, icon: "💻", color: "#3b82f6" },
  "Data Scientist": { base: 12, growth: 2.4, icon: "📊", color: "#8b5cf6" },
  "ML Engineer": { base: 14, growth: 3.1, icon: "🤖", color: "#06b6d4" },
  "AI Engineer": { base: 16, growth: 4.2, icon: "🧠", color: "#10b981" },
  "DevOps Engineer": { base: 10, growth: 2.2, icon: "⚙️", color: "#f59e0b" },
  "Cloud Architect": { base: 18, growth: 3.5, icon: "☁️", color: "#ec4899" },
  "Cybersecurity Analyst": { base: 11, growth: 2.8, icon: "🔐", color: "#ef4444" },
  "LLM Engineer": { base: 20, growth: 5.1, icon: "🌟", color: "#f97316" },
};

const SKILL_POOLS = {
  "AI/ML": ["Python", "TensorFlow", "PyTorch", "Scikit-learn", "NLP"],
  "Cloud": ["AWS", "Azure", "GCP", "Kubernetes", "Docker"],
  "Web": ["React", "TypeScript", "Next.js", "Node.js", "GraphQL"],
  "Data": ["SQL", "Spark", "Kafka", "BigQuery", "Pandas"],
  "Security": ["Pen Testing", "Zero Trust", "SIEM", "SOC", "Crypto"],
};

function generateCareerPath(role: string, years: number, skillBoost: number) {
  const roleData = ROLES[role] || ROLES["Software Developer"];
  const path = [];
  let currentSalary = roleData.base;
  const titles = getCareerTitles(role);

  for (let y = 1; y <= years; y++) {
    const boost = 1 + (skillBoost / 100) * 0.3;
    const noise = (Math.random() - 0.5) * 1.5;
    currentSalary = currentSalary * (1 + roleData.growth / 100) * boost + noise;
    currentSalary = Math.max(roleData.base, currentSalary);
    const titleIdx = Math.min(Math.floor(y / (years / titles.length)), titles.length - 1);

    path.push({
      year: y,
      salary: Math.round(currentSalary * 10) / 10,
      title: titles[titleIdx],
      demand: Math.min(100, 50 + y * 4 + skillBoost / 5),
      skills: Math.min(50, 3 + y * 3 + Math.floor(skillBoost / 15)),
    });
  }
  return path;
}

function getCareerTitles(role: string): string[] {
  const map: Record<string, string[]> = {
    "Software Developer": ["Junior Dev", "Mid Dev", "Senior Dev", "Staff Engineer", "Principal Engineer"],
    "Data Scientist": ["Junior DS", "Data Scientist", "Senior DS", "Lead DS", "Chief Data Officer"],
    "ML Engineer": ["Junior MLE", "ML Engineer", "Senior MLE", "ML Lead", "ML Director"],
    "AI Engineer": ["AI Developer", "AI Engineer", "Senior AI Engineer", "AI Lead", "VP of AI"],
    "DevOps Engineer": ["Junior DevOps", "DevOps Eng", "Senior DevOps", "DevOps Lead", "Platform Director"],
    "Cloud Architect": ["Cloud Engineer", "Cloud Architect", "Senior Architect", "Principal Architect", "CTO"],
    "Cybersecurity Analyst": ["Jr Analyst", "SOC Analyst", "Security Engineer", "Security Lead", "CISO"],
    "LLM Engineer": ["LLM Dev", "LLM Engineer", "Senior LLM Eng", "AI Platform Lead", "Head of AI"],
  };
  return map[role] || ["Junior", "Mid-level", "Senior", "Lead", "Principal"];
}

export default function CareerSimPage() {
  const [role, setRole] = useState("ML Engineer");
  const [years, setYears] = useState(7);
  const [skillBoost, setSkillBoost] = useState(50);
  const [selectedSkills, setSelectedSkills] = useState<string[]>(["Python", "TensorFlow", "AWS"]);
  const [path, setPath] = useState<ReturnType<typeof generateCareerPath>>([]);

  useEffect(() => {
    setPath(generateCareerPath(role, years, skillBoost + selectedSkills.length * 5));
  }, [role, years, skillBoost, selectedSkills]);

  const toggleSkill = (s: string) => {
    setSelectedSkills(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };

  const chartData = {
    labels: path.map(p => `Year ${p.year}`),
    datasets: [
      {
        label: "Salary (LPA)",
        data: path.map(p => p.salary),
        borderColor: ROLES[role]?.color || "#3b82f6",
        backgroundColor: `${ROLES[role]?.color || "#3b82f6"}20`,
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 8,
        borderWidth: 3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#0f1a2e",
        borderColor: "rgba(59,130,246,0.3)",
        borderWidth: 1,
        titleColor: "#f1f5f9",
        bodyColor: "#94a3b8",
        callbacks: {
          label: (ctx: any) => `₹${ctx.raw.toFixed(1)} LPA`,
        },
      },
    },
    scales: {
      x: { grid: { color: "rgba(255,255,255,0.05)" }, ticks: { color: "#94a3b8", font: { size: 11 } } },
      y: {
        grid: { color: "rgba(255,255,255,0.05)" },
        ticks: { color: "#94a3b8", font: { size: 11 }, callback: (v: any) => `₹${v}L` },
      },
    },
  };

  const finalYear = path[path.length - 1];

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ marginBottom: 24 }}>
        <h1 className="section-title gradient-text-green">Career Simulator</h1>
        <p className="section-subtitle">Simulate your career trajectory based on skills, target role, and time</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 20 }}>
        {/* Controls */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="glass-card" style={{ padding: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", marginBottom: 16 }}>🎯 Target Role</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {Object.entries(ROLES).map(([r, data]) => (
                <button key={r} onClick={() => setRole(r)} style={{
                  padding: "10px 14px", borderRadius: 10, cursor: "pointer",
                  textAlign: "left", transition: "all 0.2s",
                  background: role === r ? `${data.color}15` : "transparent",
                  border: `1px solid ${role === r ? data.color : "#1e293b"}`,
                  color: role === r ? data.color : "#94a3b8",
                  fontSize: 13, fontWeight: 600,
                }}>
                  {data.icon} {r}
                </button>
              ))}
            </div>
          </div>

          <div className="glass-card" style={{ padding: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", marginBottom: 16 }}>⏱️ Simulation Period</h3>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 13, color: "#94a3b8" }}>Years to simulate</span>
              <span style={{ fontSize: 16, fontWeight: 800, color: "#3b82f6" }}>{years}Y</span>
            </div>
            <input type="range" min={3} max={10} value={years} onChange={e => setYears(+e.target.value)}
              style={{ width: "100%", accentColor: "#3b82f6" }} />

            <div style={{ marginTop: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: "#94a3b8" }}>Learning Speed</span>
                <span style={{ fontSize: 16, fontWeight: 800, color: "#10b981" }}>{skillBoost}%</span>
              </div>
              <input type="range" min={10} max={100} value={skillBoost} onChange={e => setSkillBoost(+e.target.value)}
                style={{ width: "100%", accentColor: "#10b981" }} />
            </div>
          </div>

          <div className="glass-card" style={{ padding: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", marginBottom: 12 }}>🛠️ Skills to Learn</h3>
            {Object.entries(SKILL_POOLS).map(([cat, skills]) => (
              <div key={cat} style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 11, color: "#475569", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>{cat}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {skills.map(s => (
                    <button key={s} onClick={() => toggleSkill(s)} style={{
                      fontSize: 11, padding: "3px 10px", borderRadius: 999,
                      cursor: "pointer", transition: "all 0.2s",
                      background: selectedSkills.includes(s) ? "rgba(59,130,246,0.2)" : "rgba(255,255,255,0.03)",
                      color: selectedSkills.includes(s) ? "#60a5fa" : "#475569",
                      border: `1px solid ${selectedSkills.includes(s) ? "#3b82f6" : "#1e293b"}`,
                      fontWeight: selectedSkills.includes(s) ? 700 : 400,
                    }}>{s}</button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Results */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {finalYear && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
              {[
                { label: "Peak Salary", value: `₹${finalYear.salary} LPA`, color: "#10b981", icon: "💰" },
                { label: "Final Title", value: finalYear.title, color: "#3b82f6", icon: "🏆" },
                { label: "Demand Score", value: `${finalYear.demand}/100`, color: "#8b5cf6", icon: "📈" },
                { label: "Skills Mastered", value: finalYear.skills, color: "#f59e0b", icon: "⚡" },
              ].map((s, i) => (
                <div key={i} className="glass-card" style={{ padding: 16 }}>
                  <div style={{ fontSize: 20, marginBottom: 8 }}>{s.icon}</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: "#94a3b8" }}>{s.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* Chart */}
          <div className="glass-card" style={{ padding: 24, height: 280 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", marginBottom: 16 }}>
              📈 Salary Trajectory — {role}
            </h3>
            <div style={{ height: 210 }}>
              <Line data={chartData} options={chartOptions as any} />
            </div>
          </div>

          {/* Career Timeline */}
          <div className="glass-card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", marginBottom: 20 }}>
              🗓️ Career Milestones Timeline
            </h3>
            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", left: 28, top: 0, bottom: 0, width: 2, background: "rgba(59,130,246,0.2)", borderRadius: 1 }} />
              {path.filter((_, i) => i % Math.max(1, Math.floor(path.length / 5)) === 0 || i === path.length - 1).map((m, i) => (
                <div key={i} style={{ display: "flex", gap: 20, marginBottom: 20, alignItems: "flex-start", position: "relative" }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: "50%", flexShrink: 0,
                    background: `${ROLES[role]?.color || "#3b82f6"}20`,
                    border: `2px solid ${ROLES[role]?.color || "#3b82f6"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "Orbitron, sans-serif", fontSize: 11, fontWeight: 700,
                    color: ROLES[role]?.color || "#3b82f6", zIndex: 1,
                  }}>Y{m.year}</div>
                  <div style={{ flex: 1, background: "rgba(59,130,246,0.05)", border: "1px solid rgba(59,130,246,0.1)", borderRadius: 10, padding: "12px 16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9" }}>{m.title}</div>
                      <div style={{ fontSize: 15, fontWeight: 800, color: "#10b981" }}>₹{m.salary} LPA</div>
                    </div>
                    <div style={{ display: "flex", gap: 12, marginTop: 4, fontSize: 12, color: "#94a3b8" }}>
                      <span>📊 Demand: {m.demand}/100</span>
                      <span>⚡ Skills: {m.skills}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
