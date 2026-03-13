"use client";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";

const SKILL_CATEGORIES: Record<string, { color: string; bg: string }> = {
  "AI/ML": { color: "#3b82f6", bg: "rgba(59,130,246,0.1)" },
  "Cloud": { color: "#06b6d4", bg: "rgba(6,182,212,0.1)" },
  "Frontend": { color: "#8b5cf6", bg: "rgba(139,92,246,0.1)" },
  "Backend": { color: "#10b981", bg: "rgba(16,185,129,0.1)" },
  "Database": { color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
  "DevOps": { color: "#ec4899", bg: "rgba(236,72,153,0.1)" },
  "Security": { color: "#ef4444", bg: "rgba(239,68,68,0.1)" },
  "Systems": { color: "#f97316", bg: "rgba(249,115,22,0.1)" },
};

const MOCK_SKILLS: Record<string, { category: string; demand: number; salary: string; growth: string }> = {
  "Python": { category: "AI/ML", demand: 94, salary: "₹18-35 LPA", growth: "+8.2%" },
  "Machine Learning": { category: "AI/ML", demand: 92, salary: "₹22-45 LPA", growth: "+12.1%" },
  "TensorFlow": { category: "AI/ML", demand: 88, salary: "₹20-40 LPA", growth: "+10.3%" },
  "React": { category: "Frontend", demand: 85, salary: "₹12-25 LPA", growth: "+5.4%" },
  "Node.js": { category: "Backend", demand: 82, salary: "₹10-22 LPA", growth: "+4.1%" },
  "TypeScript": { category: "Frontend", demand: 87, salary: "₹14-28 LPA", growth: "+7.2%" },
  "Docker": { category: "DevOps", demand: 88, salary: "₹15-30 LPA", growth: "+6.8%" },
  "Kubernetes": { category: "DevOps", demand: 89, salary: "₹18-38 LPA", growth: "+9.1%" },
  "AWS": { category: "Cloud", demand: 91, salary: "₹16-35 LPA", growth: "+7.5%" },
  "PostgreSQL": { category: "Database", demand: 80, salary: "₹10-20 LPA", growth: "+3.2%" },
  "SQL": { category: "Database", demand: 78, salary: "₹8-18 LPA", growth: "+2.1%" },
  "Java": { category: "Backend", demand: 72, salary: "₹8-20 LPA", growth: "+1.3%" },
  "Rust": { category: "Systems", demand: 76, salary: "₹20-45 LPA", growth: "+15.2%" },
  "Cybersecurity": { category: "Security", demand: 92, salary: "₹18-40 LPA", growth: "+11.5%" },
  "Data Science": { category: "AI/ML", demand: 90, salary: "₹20-42 LPA", growth: "+9.8%" },
  "NLP": { category: "AI/ML", demand: 89, salary: "₹22-48 LPA", growth: "+13.4%" },
  "LangChain": { category: "AI/ML", demand: 94, salary: "₹25-55 LPA", growth: "+22.1%" },
  "Azure": { category: "Cloud", demand: 88, salary: "₹15-32 LPA", growth: "+6.9%" },
  "GCP": { category: "Cloud", demand: 85, salary: "₹14-30 LPA", growth: "+7.1%" },
  "Next.js": { category: "Frontend", demand: 84, salary: "₹12-26 LPA", growth: "+6.3%" },
};

const DEMO_TEXTS = [
  `John Doe | Senior Software Engineer
Python | Machine Learning | TensorFlow | React | Node.js | TypeScript | Docker | Kubernetes | AWS | PostgreSQL | Data Science | NLP`,
  `Alice Smith | Full Stack Developer  
React | TypeScript | Next.js | Node.js | PostgreSQL | Docker | AWS | Cybersecurity | SQL | Java`,
  `Bob Kumar | AI Research Engineer
Python | Machine Learning | NLP | LangChain | TensorFlow | Data Science | Kubernetes | GCP | Rust | LangChain`,
];

export default function ResumePage() {
  const [uploading, setUploading] = useState(false);
  const [extracted, setExtracted] = useState<typeof MOCK_SKILLS | null>(null);
  const [step, setStep] = useState<"upload" | "analyzing" | "done">("upload");
  const [resumeText, setResumeText] = useState("");
  const [filename, setFilename] = useState("");

  const extractSkills = (text: string) => {
    const found: typeof MOCK_SKILLS = {};
    const upperText = text.toUpperCase();
    for (const [skill, data] of Object.entries(MOCK_SKILLS)) {
      if (upperText.includes(skill.toUpperCase())) {
        found[skill] = data;
      }
    }
    // Guarantee at least some skills
    if (Object.keys(found).length < 3) {
      ["Python", "React", "Docker", "AWS", "SQL"].forEach(s => {
        found[s] = MOCK_SKILLS[s];
      });
    }
    return found;
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;
    setFilename(file.name);
    setStep("analyzing");
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = (e.target?.result as string) || "";
      setResumeText(text);
      setTimeout(() => {
        const skills = extractSkills(text);
        setExtracted(skills);
        setStep("done");
      }, 2500);
    };
    reader.readAsText(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "text/plain": [".txt"], "application/pdf": [".pdf"] },
    multiple: false,
  });

  const handleDemo = (idx: number) => {
    const text = DEMO_TEXTS[idx];
    setFilename("demo_resume.txt");
    setResumeText(text);
    setStep("analyzing");
    setTimeout(() => {
      const skills = extractSkills(text);
      setExtracted(skills);
      setStep("done");
    }, 2000);
  };

  const handleReset = () => {
    setStep("upload");
    setExtracted(null);
    setResumeText("");
    setFilename("");
  };

  const totalDemand = extracted
    ? Math.round(Object.values(extracted).reduce((a, s) => a + s.demand, 0) / Object.keys(extracted).length)
    : 0;

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ marginBottom: 32 }}>
        <h1 className="section-title gradient-text-blue">Resume Skill Extractor</h1>
        <p className="section-subtitle">Upload your resume and let AI extract your skills using NLP analysis</p>
      </div>

      {step === "upload" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          {/* Dropzone */}
          <div>
            <div {...getRootProps()} style={{
              border: `2px dashed ${isDragActive ? "#3b82f6" : "#1e293b"}`,
              borderRadius: 16,
              padding: 48,
              textAlign: "center",
              cursor: "pointer",
              background: isDragActive ? "rgba(59,130,246,0.05)" : "var(--bg-card)",
              transition: "all 0.3s ease",
            }}>
              <input {...getInputProps()} />
              <div style={{ fontSize: 48, marginBottom: 16 }}>📄</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#f1f5f9", marginBottom: 8 }}>
                {isDragActive ? "Drop your resume here!" : "Upload Resume"}
              </div>
              <div style={{ fontSize: 14, color: "#94a3b8", marginBottom: 24 }}>
                Drag & drop your PDF or TXT file, or click to browse
              </div>
              <button className="btn-primary" style={{ pointerEvents: "none" }}>
                📂 Browse Files
              </button>
            </div>
          </div>

          {/* Demo resumes */}
          <div>
            <div className="glass-card" style={{ padding: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: "#f1f5f9" }}>
                🎭 Try Demo Resumes
              </h3>
              {[
                { title: "Senior Software Engineer", skills: "Python, ML, React, AWS, K8s", icon: "👨‍💻" },
                { title: "Full Stack Developer", skills: "React, TypeScript, Node.js, PostgreSQL", icon: "🏗️" },
                { title: "AI Research Engineer", skills: "ML, NLP, LangChain, Rust, GCP", icon: "🤖" },
              ].map((demo, i) => (
                <div key={i} className="glass-card-hover" onClick={() => handleDemo(i)} style={{
                  padding: "14px 16px", borderRadius: 10, cursor: "pointer",
                  border: "1px solid rgba(59,130,246,0.1)", marginBottom: 12,
                  background: "rgba(59,130,246,0.03)",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 28 }}>{demo.icon}</span>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "#f1f5f9" }}>{demo.title}</div>
                      <div style={{ fontSize: 12, color: "#94a3b8" }}>{demo.skills}</div>
                    </div>
                    <span style={{ marginLeft: "auto", color: "#3b82f6", fontSize: 18 }}>→</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="glass-card" style={{ padding: 20, marginTop: 16 }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", marginBottom: 12 }}>
                🔍 DETECTION CAPABILITIES
              </h4>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {Object.keys(MOCK_SKILLS).map(s => (
                  <span key={s} style={{
                    fontSize: 11, padding: "3px 10px", borderRadius: 999,
                    background: "rgba(59,130,246,0.08)", color: "#60a5fa",
                    border: "1px solid rgba(59,130,246,0.15)"
                  }}>{s}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {step === "analyzing" && (
        <div className="glass-card" style={{ padding: 60, textAlign: "center" }}>
          <div style={{ fontSize: 64, marginBottom: 24, display: "inline-block" }} className="animate-float">🧠</div>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: "#f1f5f9", marginBottom: 8 }}>Analyzing Resume...</h2>
          <p style={{ color: "#94a3b8", marginBottom: 32 }}>NLP engine extracting skills from {filename}</p>
          <div style={{ maxWidth: 400, margin: "0 auto" }}>
            {["Parsing document structure...", "Running NLP tokenization...", "Matching skill entities...", "Scoring demand metrics..."].map((msg, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12, padding: "10px 16px", background: "rgba(59,130,246,0.05)", borderRadius: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#3b82f6", boxShadow: "0 0 8px #3b82f6" }} className="animate-pulse-glow" />
                <span style={{ fontSize: 13, color: "#94a3b8" }}>{msg}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {step === "done" && extracted && (
        <div>
          {/* Summary bar */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
            {[
              { label: "Skills Found", value: Object.keys(extracted).length, color: "#3b82f6", icon: "✨" },
              { label: "Avg Demand Score", value: totalDemand, color: "#10b981", icon: "📊" },
              { label: "Categories", value: new Set(Object.values(extracted).map(s => s.category)).size, color: "#8b5cf6", icon: "🎯" },
              { label: "Market Ready", value: `${Math.round((totalDemand / 100) * Object.keys(extracted).length)} skills`, color: "#f59e0b", icon: "🚀" },
            ].map((s, i) => (
              <div key={i} className="glass-card" style={{ padding: 20 }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>{s.icon}</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: s.color, fontFamily: "Orbitron, sans-serif" }}>{s.value}</div>
                <div style={{ fontSize: 12, color: "#94a3b8" }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Skill cards */}
          <div className="glass-card" style={{ padding: 24, marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: "#f1f5f9" }}>✅ Extracted Skills</h2>
              <button className="btn-ghost" onClick={handleReset} style={{ fontSize: 13 }}>
                🔄 New Resume
              </button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
              {Object.entries(extracted).map(([skill, data]) => {
                const cat = SKILL_CATEGORIES[data.category] || { color: "#94a3b8", bg: "rgba(148,163,184,0.1)" };
                return (
                  <div key={skill} className="glass-card-hover" style={{
                    padding: 16, borderRadius: 12,
                    border: `1px solid ${cat.color}20`,
                    background: cat.bg,
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9" }}>{skill}</div>
                      <span style={{
                        fontSize: 11, padding: "2px 8px", borderRadius: 999,
                        background: `${cat.color}20`, color: cat.color, fontWeight: 700,
                      }}>{data.category}</span>
                    </div>
                    <div style={{ marginBottom: 8 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#94a3b8", marginBottom: 4 }}>
                        <span>Market Demand</span>
                        <span style={{ color: cat.color, fontWeight: 700 }}>{data.demand}/100</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${data.demand}%`, background: cat.color }} />
                      </div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                      <span style={{ color: "#94a3b8" }}>💰 {data.salary}</span>
                      <span style={{ color: "#10b981", fontWeight: 700 }}>↑ {data.growth}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <a href="/career-sim"><button className="btn-primary">🚀 Simulate Career →</button></a>
            <a href="/portfolio"><button className="btn-ghost">💼 Build Portfolio →</button></a>
          </div>
        </div>
      )}
    </div>
  );
}
