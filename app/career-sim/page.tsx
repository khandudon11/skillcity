"use client";
import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const ROLES = [
  { id: "ai", title: "AI Engineer", salary: 120000, growth: 15, color: "var(--accent-pink)" },
  { id: "devops", title: "DevOps Architect", salary: 140000, growth: 8, color: "var(--accent-cyan)" },
  { id: "web", title: "Fullstack Lead", salary: 110000, growth: 10, color: "var(--accent-yellow)" },
  { id: "sec", title: "CISO", salary: 160000, growth: 12, color: "var(--accent-green)" },
];

export default function CareerSim() {
  const [role, setRole] = useState(ROLES[0]);
  const [years, setYears] = useState(10);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const generateData = () => {
    const labels = Array.from({ length: years + 1 }, (_, i) => `Y${i}`);
    const data = labels.map((_, i) => role.salary * Math.pow(1 + role.growth / 100, i));

    return {
      labels,
      datasets: [
        {
          label: "Predicted Salary (USD)",
          data,
          borderColor: "black",
          backgroundColor: role.color,
          fill: true,
          tension: 0, // Straighter lines for brutalism
          borderWidth: 5,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "black",
        titleFont: { size: 16, weight: "900" },
        bodyFont: { size: 14, weight: "700" },
        padding: 12,
        cornerRadius: 0,
      }
    },
    scales: {
      x: { grid: { display: true, color: "black", lineWidth: 1 }, ticks: { color: "black", font: { weight: "900" } } },
      y: { grid: { display: true, color: "black", lineWidth: 1 }, ticks: { color: "black", font: { weight: "900" } } },
    }
  };

  if (!mounted) return null;

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ marginBottom: 40 }}>
        <h1 className="section-title">CAREER TRAJECTORY SIMULATOR</h1>
        <p style={{ fontSize: 20, fontWeight: 800 }}>Projected growth based on current market velocity</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "350px 1fr", gap: 32 }}>
        {/* Controls */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div className="brutalist-card" style={{ background: "white" }}>
            <h3 style={{ marginBottom: 15 }}>SELECT ROLE</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {ROLES.map(r => (
                <button 
                  key={r.id} 
                  onClick={() => setRole(r)}
                  className="brutalist-button"
                  style={{ 
                    background: role.id === r.id ? r.color : "white",
                    width: "100%",
                    fontSize: 16
                  }}
                >
                  {r.title}
                </button>
              ))}
            </div>
          </div>

          <div className="brutalist-card" style={{ background: "var(--accent-yellow)" }}>
            <h3 style={{ marginBottom: 10 }}>SIMULATION PERIOD</h3>
            <input 
              type="range" min="5" max="25" value={years} 
              onChange={(e) => setYears(parseInt(e.target.value))}
              style={{ width: "100%", cursor: "pointer", height: 20, accentColor: "black" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 900, marginTop: 10 }}>
              <span>5Y</span>
              <span style={{ background: "black", color: "white", padding: "2px 8px" }}>{years} YEARS</span>
              <span>25Y</span>
            </div>
          </div>

          <div className="brutalist-card" style={{ background: "black", color: "white" }}>
            <div style={{ fontSize: 12, fontWeight: 800 }}>ESTIMATED YEAR {years} VALUE:</div>
            <div style={{ fontSize: 32, fontWeight: 900, color: "var(--accent-green)" }}>
              ${Math.round(role.salary * Math.pow(1 + role.growth / 100, years)).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="brutalist-card" style={{ background: "white", minHeight: 450, padding: 30 }}>
          <div style={{ height: "100%" }}>
            <Line data={generateData() as any} options={chartOptions as any} />
          </div>
        </div>
      </div>
    </div>
  );
}
