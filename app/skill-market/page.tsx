"use client";
import { useState, useEffect } from "react";

const INITIAL_SKILLS = [
  { name: "Python", price: 94.2, change: 8.5, volume: "125K" },
  { name: "Rust", price: 87.5, change: 12.1, volume: "84K" },
  { name: "LLM Ops", price: 124.8, change: 24.6, volume: "310K" },
  { name: "Docker", price: 72.4, change: -1.2, volume: "92K" },
  { name: "React", price: 82.1, change: 4.3, volume: "150K" },
  { name: "Solidity", price: 54.3, change: -15.8, volume: "42K" },
  { name: "PyTorch", price: 92.6, change: 10.2, volume: "68K" },
  { name: "Go", price: 79.8, change: 5.4, volume: "55K" },
];

export default function SkillMarket() {
  const [skills, setSkills] = useState(INITIAL_SKILLS);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setSkills(prev => prev.map(s => ({
        ...s,
        price: +(s.price + (Math.random() - 0.5)).toFixed(2),
        change: +(s.change + (Math.random() - 0.5) * 0.2).toFixed(1)
      })));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ marginBottom: 40, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 className="section-title">SKILL STOCK EXCHANGE</h1>
          <p style={{ fontWeight: 800, fontSize: 18 }}>Real-time skill valuation based on supply & demand</p>
        </div>
        <div style={{ textAlign: "right", background: "black", color: "white", padding: "10px 20px" }}>
          <div style={{ fontSize: 10, fontWeight: 900 }}>MARKET STATUS</div>
          <div style={{ fontSize: 20, fontWeight: 900, color: "var(--accent-green)" }}>OPEN</div>
        </div>
      </div>

      <div className="brutalist-card" style={{ padding: 0, overflow: "hidden", background: "white" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "black", color: "white" }}>
              <th style={{ padding: "15px", textAlign: "left", fontSize: 14 }}>ASSET NAME</th>
              <th style={{ padding: "15px", textAlign: "right", fontSize: 14 }}>PRICE ($)</th>
              <th style={{ padding: "15px", textAlign: "right", fontSize: 14 }}>24H CHANGE</th>
              <th style={{ padding: "15px", textAlign: "right", fontSize: 14 }}>VOLUME</th>
              <th style={{ padding: "15px", textAlign: "center", fontSize: 14 }}>TRADE</th>
            </tr>
          </thead>
          <tbody>
            {skills.map((s, i) => (
              <tr key={i} style={{ borderBottom: "4px solid black", background: i % 2 === 0 ? "white" : "#f5f5f5" }}>
                <td style={{ padding: "15px", fontWeight: 900, fontSize: 18 }}>{s.name}</td>
                <td style={{ padding: "15px", textAlign: "right", fontWeight: 800, fontSize: 20, fontFamily: "Space Grotesk" }}>${s.price.toFixed(2)}</td>
                <td style={{ padding: "15px", textAlign: "right" }}>
                  <span style={{ 
                    background: s.change >= 0 ? "var(--accent-green)" : "var(--accent-pink)",
                    padding: "5px 12px",
                    border: "3px solid black",
                    fontWeight: 900,
                    fontSize: 14,
                    display: "inline-block"
                  }}>
                    {s.change >= 0 ? "▲" : "▼"} {Math.abs(s.change)}%
                  </span>
                </td>
                <td style={{ padding: "15px", textAlign: "right", fontWeight: 800 }}>{s.volume}</td>
                <td style={{ padding: "15px", textAlign: "center" }}>
                  <button className="brutalist-button" style={{ background: "var(--accent-yellow)", padding: "5px 15px", fontSize: 12 }}>
                    BUY
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24, marginTop: 40 }}>
        {[
          { title: "TOP GAINER", name: "LLM OPS", val: "+24.6%", color: "var(--accent-green)" },
          { title: "MOST ACTIVE", name: "PYTHON", val: "125K VOL", color: "var(--accent-cyan)" },
          { title: "BIGGEST DROP", name: "SOLIDITY", val: "-15.8%", color: "var(--accent-pink)" },
        ].map((stat, i) => (
          <div key={i} className="brutalist-card" style={{ background: stat.color }}>
            <div style={{ fontSize: 12, fontWeight: 900, marginBottom: 5 }}>{stat.title}</div>
            <div style={{ fontSize: 24, fontWeight: 900 }}>{stat.name}</div>
            <div style={{ fontSize: 32, fontWeight: 900 }}>{stat.val}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
