"use client";
import { useEffect, useState } from "react";

const skills = [
  { name: "Python", change: 2.4, price: 94.2 },
  { name: "Rust", change: 5.7, price: 78.5 },
  { name: "AI/ML", change: 8.1, price: 97.3 },
  { name: "React", change: 1.2, price: 82.4 },
  { name: "Kubernetes", change: 3.8, price: 88.9 },
  { name: "Cybersecurity", change: 6.2, price: 91.7 },
  { name: "Blockchain", change: -2.1, price: 62.3 },
  { name: "TypeScript", change: 3.1, price: 85.6 },
  { name: "Go", change: 4.5, price: 80.1 },
  { name: "Cloud AWS", change: 2.9, price: 92.8 },
  { name: "Data Science", change: 4.3, price: 89.5 },
  { name: "DevOps", change: 2.7, price: 84.3 },
  { name: "Manual QA", change: -4.8, price: 38.2 },
  { name: "Java", change: 0.3, price: 71.4 },
  { name: "Swift", change: 1.9, price: 74.8 },
  { name: "LLM Engineering", change: 12.4, price: 99.1 },
  { name: "Web3", change: -1.4, price: 55.7 },
];

export default function Ticker() {
  const [data, setData] = useState(skills);

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => prev.map(s => ({
        ...s,
        price: Math.max(10, Math.min(100, s.price + (Math.random() - 0.5) * 0.5)),
        change: s.change + (Math.random() - 0.5) * 0.2,
      })));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const doubled = [...data, ...data];

  return (
    <div style={{
      background: "rgba(13, 18, 37, 0.95)",
      borderBottom: "1px solid rgba(59, 130, 246, 0.15)",
      padding: "8px 0",
      overflow: "hidden",
      position: "sticky",
      top: 0,
      zIndex: 50,
    }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <div style={{
          background: "linear-gradient(135deg, #3b82f6, #06b6d4)",
          padding: "4px 14px",
          fontSize: 11,
          fontWeight: 700,
          color: "white",
          fontFamily: "Orbitron, sans-serif",
          letterSpacing: 1,
          whiteSpace: "nowrap",
          flexShrink: 0,
          marginRight: 16,
        }}>
          SKILL MARKET
        </div>
        <div className="ticker-container" style={{ flex: 1 }}>
          <div className="ticker-inner animate-ticker">
            {doubled.map((s, i) => (
              <div key={i} style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#f1f5f9" }}>{s.name}</span>
                <span style={{ fontSize: 12, color: "#94a3b8" }}>{s.price.toFixed(1)}</span>
                <span style={{
                  fontSize: 11, fontWeight: 700,
                  color: s.change >= 0 ? "#10b981" : "#ef4444"
                }}>
                  {s.change >= 0 ? "▲" : "▼"} {Math.abs(s.change).toFixed(1)}%
                </span>
                <span style={{ color: "#1e293b", marginLeft: 8 }}>|</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
