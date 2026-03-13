"use client";
import { useEffect, useState } from "react";

const MOCK_DATA = [
  { name: "LLM Engineering", price: 99.4, change: 12.4, trend: "up" },
  { name: "Cybersecurity", price: 91.2, change: 6.5, trend: "up" },
  { name: "Blockchain", price: 62.7, change: -2.0, trend: "down" },
  { name: "TypeScript", price: 85.1, change: 3.2, trend: "up" },
  { name: "Golang", price: 81.0, change: 5.1, trend: "up" },
  { name: "Cloud AWS", price: 93.8, change: 3.9, trend: "up" },
  { name: "Rust", price: 87.5, change: 7.8, trend: "up" },
  { name: "Kubernetes", price: 88.2, change: 5.1, trend: "up" },
];

export default function Ticker() {
  const [data, setData] = useState(MOCK_DATA);

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => prev.map(item => ({
        ...item,
        price: +(item.price + (Math.random() - 0.5) * 0.5).toFixed(1),
        change: +(item.change + (Math.random() - 0.5) * 0.1).toFixed(1)
      })));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="ticker-container" style={{
      height: "48px",
      display: "flex",
      alignItems: "center",
      zIndex: 900,
      position: "sticky",
      top: 0
    }}>
      <div style={{
        background: "black",
        color: "white",
        height: "100%",
        padding: "0 20px",
        display: "flex",
        alignItems: "center",
        fontWeight: 900,
        fontSize: 14,
        letterSpacing: 2,
        borderRight: "4px solid var(--accent-yellow)",
        marginRight: "-4px"
      }}>
        SKILL MARKET
      </div>
      <div style={{ flex: 1, overflow: "hidden", height: "100%", display: "flex", alignItems: "center" }}>
        <div className="ticker-inner animate-ticker">
          {[...data, ...data].map((item, i) => (
            <div key={i} style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: 8, 
              padding: "0 20px",
              borderRight: "3px solid black",
              height: "20px",
              fontWeight: 800,
              fontSize: 13,
            }}>
              <span style={{ color: "black" }}>{item.name}</span>
              <span style={{ fontFamily: "Space Grotesk, sans-serif" }}>${item.price}</span>
              <span style={{ 
                color: item.change >= 0 ? "white" : "white",
                background: item.change >= 0 ? "var(--accent-green)" : "var(--accent-pink)",
                padding: "2px 6px",
                border: "2px solid black",
                fontSize: 10,
                fontWeight: 900
              }}>
                {item.change >= 0 ? "▲" : "▼"} {Math.abs(item.change)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
