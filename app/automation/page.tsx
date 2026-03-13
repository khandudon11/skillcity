"use client";
import { useState, useEffect, useRef } from "react";

const JOBS = [
  { title: "Data Entry Clerk", risk: 95, automation: "GPT-4 + RPA", timeline: "1-2 yrs", category: "Clerical", icon: "⌨️" },
  { title: "Manual QA Tester", risk: 85, automation: "AI Test Agents", timeline: "2-3 yrs", category: "Testing", icon: "🐛" },
  { title: "Basic Customer Support", risk: 90, automation: "LLM Chatbots", timeline: "1-2 yrs", category: "Service", icon: "📞" },
  { title: "Document Reviewer", risk: 88, automation: "LLM + RAG", timeline: "1-3 yrs", category: "Legal", icon: "📄" },
  { title: "Bookkeeper", risk: 82, automation: "AI Accounting", timeline: "2-4 yrs", category: "Finance", icon: "📒" },
  { title: "Junior Copywriter", risk: 75, automation: "Generative AI", timeline: "2-4 yrs", category: "Creative", icon: "✍️" },
  { title: "Web Designer", risk: 55, automation: "AI Design Tools", timeline: "4-6 yrs", category: "Design", icon: "🎨" },
  { title: "Financial Analyst", risk: 40, automation: "AI Quant Tools", timeline: "5-8 yrs", category: "Finance", icon: "📊" },
  { title: "Software Developer", risk: 25, automation: "GitHub Copilot", timeline: "8-12 yrs", category: "Tech", icon: "💻" },
  { title: "Product Manager", risk: 18, automation: "AI Assistants", timeline: ">10 yrs", category: "Business", icon: "📋" },
  { title: "ML Engineer", risk: 10, automation: "AutoML (partial)", timeline: ">15 yrs", category: "AI", icon: "🤖" },
  { title: "AI Researcher", risk: 5, automation: "Not imminent", timeline: "20+ yrs", category: "AI", icon: "🧠" },
  { title: "Cybersecurity Expert", risk: 8, automation: "AI assists only", timeline: ">15 yrs", category: "Security", icon: "🔐" },
  { title: "LLM Engineer", risk: 3, automation: "Builds the tools", timeline: "N/A", category: "AI", icon: "🌟" },
  { title: "Robotics Engineer", risk: 12, automation: "Collaborative AI", timeline: ">12 yrs", category: "Engineering", icon: "🦾" },
  { title: "Data Scientist", risk: 20, automation: "AutoML + Copilots", timeline: "6-10 yrs", category: "AI", icon: "📈" },
];

const SKILLS_RISK = [
  { name: "Python", risk: 12, category: "AI/ML" },
  { name: "LangChain", risk: 5, category: "AI" },
  { name: "Cybersecurity", risk: 8, category: "Security" },
  { name: "Rust", risk: 7, category: "Systems" },
  { name: "Cloud AWS", risk: 10, category: "Cloud" },
  { name: "Kubernetes", risk: 12, category: "Cloud" },
  { name: "React", risk: 20, category: "Web" },
  { name: "Java", risk: 28, category: "Backend" },
  { name: "SQL", risk: 22, category: "DB" },
  { name: "Manual Testing", risk: 85, category: "Testing" },
  { name: "COBOL", risk: 72, category: "Legacy" },
  { name: "Flash/ActionScript", risk: 99, category: "Legacy" },
  { name: "Excel Macros", risk: 65, category: "Office" },
  { name: "WordPress Dev", risk: 40, category: "Web" },
];

function GaugeChart({ value, color }: { value: number; color: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = 120;
    canvas.height = 70;

    // Background arc
    ctx.beginPath();
    ctx.arc(60, 65, 50, Math.PI, 2 * Math.PI);
    ctx.lineWidth = 10;
    ctx.strokeStyle = "rgba(255,255,255,0.05)";
    ctx.stroke();

    // Value arc
    const end = Math.PI + (value / 100) * Math.PI;
    ctx.beginPath();
    ctx.arc(60, 65, 50, Math.PI, end);
    ctx.lineWidth = 10;
    ctx.strokeStyle = color;
    ctx.lineCap = "round";
    ctx.stroke();

    // Center text
    ctx.fillStyle = "#f1f5f9";
    ctx.font = "bold 16px Orbitron, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`${value}%`, 60, 60);
  }, [value, color]);
  return <canvas ref={canvasRef} style={{ width: 120, height: 70 }} />;
}

function getRiskColor(risk: number) {
  if (risk >= 80) return "#ef4444";
  if (risk >= 60) return "#f97316";
  if (risk >= 40) return "#f59e0b";
  if (risk >= 20) return "#3b82f6";
  return "#10b981";
}
function getRiskLabel(risk: number) {
  if (risk >= 80) return "Critical";
  if (risk >= 60) return "High";
  if (risk >= 40) return "Medium";
  if (risk >= 20) return "Low";
  return "Minimal";
}

export default function AutomationPage() {
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"jobs" | "skills">("jobs");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const filteredJobs = JOBS
    .filter(j => j.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sortDir === "desc" ? b.risk - a.risk : a.risk - b.risk);

  const filteredSkills = SKILLS_RISK
    .filter(s => s.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sortDir === "desc" ? b.risk - a.risk : a.risk - b.risk);

  const highRisk = JOBS.filter(j => j.risk >= 70).length;
  const safe = JOBS.filter(j => j.risk < 20).length;
  const avgRisk = Math.round(JOBS.reduce((a, j) => a + j.risk, 0) / JOBS.length);

  return (
    <div style={{ maxWidth: 1300, margin: "0 auto" }}>
      <div style={{ marginBottom: 24 }}>
        <h1 className="section-title" style={{ background: "linear-gradient(135deg, #ef4444, #f97316)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Automation Risk Predictor
        </h1>
        <p className="section-subtitle">AI-powered analysis of automation probability for jobs and skills</p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { label: "High Risk Jobs", value: highRisk, color: "#ef4444", icon: "🔴" },
          { label: "Safe Jobs", value: safe, color: "#10b981", icon: "🟢" },
          { label: "Avg Risk Score", value: `${avgRisk}%`, color: "#f59e0b", icon: "📊" },
          { label: "Analysis Period", value: "2026-2035", color: "#3b82f6", icon: "📅" },
        ].map((s, i) => (
          <div key={i} className="glass-card" style={{ padding: 20 }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>{s.icon}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: s.color, fontFamily: "Orbitron, sans-serif" }}>{s.value}</div>
            <div style={{ fontSize: 12, color: "#94a3b8" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, alignItems: "center" }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="🔍 Search jobs or skills..."
          style={{
            flex: 1, background: "var(--bg-card)", border: "1px solid rgba(59,130,246,0.2)",
            borderRadius: 10, padding: "10px 16px", color: "#f1f5f9",
            fontSize: 14, outline: "none",
          }}
        />
        {(["jobs", "skills"] as const).map(v => (
          <button key={v} onClick={() => setView(v)} style={{
            padding: "8px 20px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer",
            background: view === v ? "rgba(239,68,68,0.2)" : "transparent",
            border: `1px solid ${view === v ? "#ef4444" : "#1e293b"}`,
            color: view === v ? "#ef4444" : "#94a3b8",
          }}>
            {v === "jobs" ? "💼 Jobs" : "⚡ Skills"}
          </button>
        ))}
        <button onClick={() => setSortDir(d => d === "desc" ? "asc" : "desc")} style={{
          padding: "8px 16px", borderRadius: 8, fontSize: 13, cursor: "pointer",
          background: "transparent", border: "1px solid #1e293b", color: "#94a3b8",
        }}>
          {sortDir === "desc" ? "↓ Highest Risk" : "↑ Lowest Risk"}
        </button>
      </div>

      {view === "jobs" ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
          {filteredJobs.map((job, i) => {
            const color = getRiskColor(job.risk);
            return (
              <div key={i} className="glass-card glass-card-hover" style={{ padding: 20, borderLeft: `4px solid ${color}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 28 }}>{job.icon}</span>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9" }}>{job.title}</div>
                      <div style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>{job.category}</div>
                    </div>
                  </div>
                  <GaugeChart value={job.risk} color={color} />
                </div>

                <div style={{ marginTop: 12, display: "flex", gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${job.risk}%`, background: `linear-gradient(90deg, ${color}80, ${color})` }} />
                    </div>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 800, color }}>{getRiskLabel(job.risk)}</span>
                </div>

                <div style={{ display: "flex", gap: 16, marginTop: 12, fontSize: 12, color: "#94a3b8" }}>
                  <span>🤖 {job.automation}</span>
                  <span>⏱️ {job.timeline}</span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div>
          <div className="glass-card" style={{ marginBottom: 20, padding: 0, overflow: "hidden" }}>
            <div style={{ padding: "12px 20px", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1.5fr", fontSize: 11, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: 1 }}>
              <span>Skill</span><span style={{ textAlign: "right" }}>Risk Score</span><span style={{ textAlign: "center" }}>Level</span><span style={{ textAlign: "right" }}>Automation Risk Bar</span>
            </div>
            {filteredSkills.map((s, i) => {
              const color = getRiskColor(s.risk);
              return (
                <div key={i} style={{ padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.03)", display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1.5fr", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#f1f5f9" }}>{s.name}</div>
                    <div style={{ fontSize: 11, color: "#475569" }}>{s.category}</div>
                  </div>
                  <div style={{ textAlign: "right", fontFamily: "Orbitron,sans-serif", fontSize: 15, fontWeight: 700, color }}>{s.risk}%</div>
                  <div style={{ textAlign: "center" }}>
                    <span style={{ fontSize: 10, padding: "3px 8px", borderRadius: 999, background: `${color}15`, color, fontWeight: 700 }}>
                      {getRiskLabel(s.risk)}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div className="progress-bar" style={{ flex: 1 }}>
                      <div className="progress-fill" style={{ width: `${s.risk}%`, background: color }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="glass-card" style={{ padding: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", marginBottom: 12 }}>💡 How to Reduce Automation Risk</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
              {[
                { icon: "🧠", title: "Learn AI/ML", desc: "Transition to AI tools and become an architect, not a performer" },
                { icon: "🔐", title: "Cybersecurity", desc: "Security requires human judgment — machines can't replace intuition" },
                { icon: "🚀", title: "Focus on Strategy", desc: "High-level decisions, creativity, and leadership are AI-resistant" },
              ].map((tip, i) => (
                <div key={i} style={{ padding: "14px", background: "rgba(59,130,246,0.05)", borderRadius: 10, border: "1px solid rgba(59,130,246,0.1)" }}>
                  <div style={{ fontSize: 24, marginBottom: 8 }}>{tip.icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#f1f5f9", marginBottom: 4 }}>{tip.title}</div>
                  <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.5 }}>{tip.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
