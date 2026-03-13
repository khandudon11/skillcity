"use client";
import { useState, useEffect } from "react";

const JOBS = [
  { title: "Data Entry Clerk", risk: 95, color: "var(--accent-pink)" },
  { title: "Manual QA Tester", risk: 85, color: "var(--accent-pink)" },
  { title: "Document Reviewer", risk: 88, color: "var(--accent-pink)" },
  { title: "Financial Analyst", risk: 40, color: "var(--accent-yellow)" },
  { title: "Software Dev", risk: 25, color: "var(--accent-cyan)" },
  { title: "ML Engineer", risk: 10, color: "var(--accent-green)" },
  { title: "Cybersecurity Expert", risk: 8, color: "var(--accent-green)" },
];

export default function AutomationRisk() {
  const [mounted, setMounted] = useState(false);
  const [widths, setWidths] = useState(JOBS.map(() => 0));

  useEffect(() => {
    setMounted(true);
    setTimeout(() => {
      setWidths(JOBS.map(j => j.risk));
    }, 500);
  }, []);

  if (!mounted) return null;

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ marginBottom: 40 }}>
        <h1 className="section-title">AUTOMATION RISK RADAR</h1>
        <p style={{ fontWeight: 800, fontSize: 18 }}>Predicting AI replacement probability via neural analysis</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
        <div className="brutalist-card" style={{ background: "white" }}>
          <h2 style={{ fontSize: 24, marginBottom: 30, textDecoration: "underline" }}>RISK BY ROLE (2026-2030)</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>
            {JOBS.map((j, i) => (
              <div key={i}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, alignItems: "center" }}>
                  <span style={{ fontWeight: 900, fontSize: 20 }}>{j.title}</span>
                  <span style={{ 
                    background: j.risk > 70 ? "black" : j.color, 
                    color: j.risk > 70 ? "white" : "black",
                    padding: "4px 12px",
                    border: "3px solid black",
                    fontWeight: 900
                  }}>
                    {j.risk}% RISK
                  </span>
                </div>
                <div className="progress-bar" style={{ height: 32 }}>
                  <div className="progress-fill" style={{ 
                    width: `${widths[i]}%`, 
                    background: j.risk > 70 ? "var(--accent-pink)" : j.risk > 30 ? "var(--accent-yellow)" : "var(--accent-green)" 
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          <div className="brutalist-card" style={{ background: "black", color: "white" }}>
            <h3 style={{ marginBottom: 15, color: "var(--accent-yellow)" }}>AI ALERT TERMINAL</h3>
            <div style={{ border: "2px dashed white", padding: "15px", fontFamily: "monospace", fontSize: 13 }}>
              [SYSTEM] SCANNING JOBS...<br />
              [ALERT] LOW COMPLEXITY TASKS DETECTED<br />
              [ALERT] GENERATIVE AGENTS DEPLOYED IN CLERICAL SECTOR<br />
              [STATUS] RE-SKILLING STRONGLY ADVISED
            </div>
          </div>

          <div className="brutalist-card" style={{ background: "var(--accent-cyan)" }}>
            <h3 style={{ marginBottom: 15 }}>MITIGATION STRATEGY</h3>
            <div style={{ display: "grid", gap: 12 }}>
              {[
                "EMBRACE AI-CO-PILOTING",
                "FOCUS ON STRATEGIC INTUITION",
                "SPECIALIZE IN HARD SYSTEMS RUST/C++",
                "UPGRADE TO LLM ENGINEERING"
              ].map(s => (
                <div key={s} style={{ background: "white", padding: "10 px", border: "3px solid black", fontWeight: 900, fontSize: 14 }}>
                  → {s}
                </div>
              ))}
            </div>
          </div>

          <div className="brutalist-card" style={{ background: "var(--accent-yellow)", flex: 1 }}>
             <h3 style={{ marginBottom: 10 }}>AGGREGATE RISK INDEX</h3>
             <div style={{ fontSize: 72, fontWeight: 900, lineClamp: 1 }}>64.2%</div>
             <p style={{ fontWeight: 700 }}>HIGH PROBABILITY OF STRUCTURAL ECONOMIC SHIFT WITHIN 24 MONTHS</p>
          </div>
        </div>
      </div>
    </div>
  );
}
