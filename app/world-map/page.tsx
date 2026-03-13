"use client";
import { useEffect, useRef, useState } from "react";

const COUNTRY_DATA = [
  { name: "United States", lat: 38, lon: -97, top: ["AI/ML", "Cloud", "Cybersecurity", "LLM Eng"], score: 97, flag: "🇺🇸" },
  { name: "India", lat: 20, lon: 78, top: ["Software Eng", "Cloud", "Data Science", "DevOps"], score: 88, flag: "🇮🇳" },
  { name: "Germany", lat: 51, lon: 10, top: ["Robotics", "Embedded", "Industry 4.0", "AI"], score: 84, flag: "🇩🇪" },
  { name: "United Kingdom", lat: 51.5, lon: -0.1, top: ["FinTech", "AI", "Cybersecurity", "Cloud"], score: 86, flag: "🇬🇧" },
  { name: "China", lat: 35, lon: 105, top: ["AI", "Robotics", "5G", "Manufacturing"], score: 92, flag: "🇨🇳" },
  { name: "Japan", lat: 36, lon: 138, top: ["Robotics", "Embedded", "IoT", "AI"], score: 80, flag: "🇯🇵" },
  { name: "Canada", lat: 56, lon: -106, top: ["AI Research", "Cloud", "Biotech", "Gaming"], score: 82, flag: "🇨🇦" },
  { name: "Australia", lat: -25, lon: 133, top: ["Cloud", "Cybersecurity", "FinTech", "Data"], score: 78, flag: "🇦🇺" },
  { name: "Brazil", lat: -15, lon: -47, top: ["FinTech", "Web Dev", "Mobile", "Cloud"], score: 69, flag: "🇧🇷" },
  { name: "France", lat: 46, lon: 2, top: ["AI", "FinTech", "Gaming", "Aerospace"], score: 79, flag: "🇫🇷" },
  { name: "South Korea", lat: 37, lon: 127.5, top: ["Semiconductors", "5G", "Gaming", "Robotics"], score: 85, flag: "🇰🇷" },
  { name: "Israel", lat: 31, lon: 35, top: ["Cybersecurity", "AI", "FinTech", "Defense Tech"], score: 87, flag: "🇮🇱" },
  { name: "Singapore", lat: 1.35, lon: 103.8, top: ["FinTech", "AI", "Blockchain", "Cloud"], score: 88, flag: "🇸🇬" },
  { name: "Netherlands", lat: 52, lon: 5, top: ["Cloud", "AI", "Logistics Tech", "Cyber"], score: 80, flag: "🇳🇱" },
  { name: "Sweden", lat: 59, lon: 18, top: ["Gaming", "Telecom", "AI", "Green Tech"], score: 76, flag: "🇸🇪" },
  { name: "Nigeria", lat: 9, lon: 8, top: ["FinTech", "Mobile", "Web Dev", "E-commerce"], score: 58, flag: "🇳🇬" },
  { name: "UAE", lat: 24, lon: 54, top: ["Blockchain", "AI", "Smart City", "Cloud"], score: 74, flag: "🇦🇪" },
  { name: "Russia", lat: 61, lon: 105, top: ["Cybersecurity", "AI", "Systems Prog", "Crypto"], score: 72, flag: "🇷🇺" },
];

const SKILL_CATEGORIES = ["All Skills", "AI/ML", "Cloud", "Cybersecurity", "FinTech", "Robotics", "Blockchain", "Web Dev"];

function getScoreColor(score: number) {
  if (score >= 90) return "#10b981";
  if (score >= 80) return "#3b82f6";
  if (score >= 70) return "#f59e0b";
  if (score >= 60) return "#f97316";
  return "#ef4444";
}

export default function WorldMapPage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const [selected, setSelected] = useState<typeof COUNTRY_DATA[0] | null>(null);
  const [filter, setFilter] = useState("All Skills");
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted || !mapRef.current) return;

    import("leaflet").then(L => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }

      const map = L.map(mapRef.current!, {
        center: [20, 10],
        zoom: 2,
        zoomControl: true,
        scrollWheelZoom: true,
      });

      mapInstance.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 18,
      }).addTo(map);

      const filtered = filter === "All Skills"
        ? COUNTRY_DATA
        : COUNTRY_DATA.filter(c => c.top.some(t => t.toLowerCase().includes(filter.toLowerCase().split("/")[0].toLowerCase())));

      filtered.forEach(country => {
        const color = getScoreColor(country.score);
        const circle = L.circle([country.lat, country.lon], {
          radius: country.score * 12000,
          color,
          fillColor: color,
          fillOpacity: 0.35,
          weight: 2,
          opacity: 0.8,
        }).addTo(map);

        const marker = L.marker([country.lat, country.lon], {
          icon: L.divIcon({
            html: `<div style="font-size:20px;filter:drop-shadow(0 0 6px ${color})">${country.flag}</div>`,
            className: "",
            iconSize: [28, 28],
            iconAnchor: [14, 14],
          }),
        }).addTo(map);

        const popup = `
          <div style="font-family:Inter,sans-serif;background:#0f1a2e;color:#f1f5f9;padding:12px;border-radius:10px;min-width:180px;">
            <div style="font-size:16px;font-weight:700;margin-bottom:6px;">${country.flag} ${country.name}</div>
            <div style="font-size:12px;color:#94a3b8;margin-bottom:8px;">Market Score: <b style="color:${color}">${country.score}/100</b></div>
            <div style="font-size:11px;color:#94a3b8;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">Top Skills</div>
            ${country.top.map(t => `<div style="font-size:12px;color:#60a5fa;padding:2px 0">• ${t}</div>`).join("")}
          </div>
        `;
        marker.bindPopup(popup, { className: "custom-popup" });
        circle.on("click", () => setSelected(country));
        marker.on("click", () => setSelected(country));
      });
    });

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [mounted, filter]);

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto", height: "calc(100vh - 100px)", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div>
          <h1 className="section-title" style={{ background: "linear-gradient(135deg, #ec4899, #8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Global Skill Economy Map
          </h1>
          <p className="section-subtitle">Worldwide demand heatmap for skills by country and region</p>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {SKILL_CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setFilter(cat)} style={{
            padding: "6px 14px", borderRadius: 999, fontSize: 12, fontWeight: 600, cursor: "pointer",
            background: filter === cat ? "rgba(236,72,153,0.2)" : "transparent",
            border: `1px solid ${filter === cat ? "#ec4899" : "#1e293b"}`,
            color: filter === cat ? "#ec4899" : "#94a3b8",
          }}>
            {cat}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", gap: 16, flex: 1 }}>
        <div className="glass-card" style={{ flex: 1, overflow: "hidden", position: "relative" }}>
          {mounted ? (
            <div ref={mapRef} style={{ width: "100%", height: "100%", borderRadius: 16 }} />
          ) : (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
              <div style={{ fontSize: 24, color: "#94a3b8" }}>Loading map...</div>
            </div>
          )}

          {/* Score legend */}
          <div style={{ position: "absolute", bottom: 20, left: 20, background: "rgba(2,8,23,0.9)", padding: "12px 16px", borderRadius: 10, border: "1px solid rgba(59,130,246,0.2)", zIndex: 1000 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Demand Score</div>
            {[
              { range: "90-100", color: "#10b981", label: "Exceptional" },
              { range: "80-89", color: "#3b82f6", label: "High" },
              { range: "70-79", color: "#f59e0b", label: "Medium" },
              { range: "60-69", color: "#f97316", label: "Growing" },
              { range: "<60", color: "#ef4444", label: "Emerging" },
            ].map(l => (
              <div key={l.range} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <div style={{ width: 12, height: 12, borderRadius: 3, background: l.color }} />
                <span style={{ fontSize: 11, color: "#94a3b8" }}>{l.range}: {l.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ width: 260, display: "flex", flexDirection: "column", gap: 12 }}>
          {selected ? (
            <div className="glass-card" style={{ padding: 20 }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>{selected.flag}</div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9", marginBottom: 4 }}>{selected.name}</h3>
              <div style={{ fontSize: 24, fontWeight: 800, color: getScoreColor(selected.score), fontFamily: "Orbitron, sans-serif", marginBottom: 12 }}>
                {selected.score}/100
              </div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
                Top In-Demand Skills
              </div>
              {selected.top.map((skill, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", background: "rgba(59,130,246,0.05)", borderRadius: 8, marginBottom: 6, border: "1px solid rgba(59,130,246,0.1)" }}>
                  <span style={{ fontSize: 14, color: "#3b82f6", fontWeight: 700 }}>#{i + 1}</span>
                  <span style={{ fontSize: 13, color: "#f1f5f9", fontWeight: 600 }}>{skill}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-card" style={{ padding: 20, textAlign: "center" }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>🌍</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", marginBottom: 4 }}>Click a Country</div>
              <div style={{ fontSize: 12, color: "#94a3b8" }}>Select any country on the map to see its top skill demands</div>
            </div>
          )}

          <div className="glass-card" style={{ padding: 16 }}>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: "#f1f5f9", marginBottom: 12 }}>🏆 Global Rankings</h4>
            {[...COUNTRY_DATA].sort((a, b) => b.score - a.score).slice(0, 8).map((c, i) => (
              <div key={i} onClick={() => setSelected(c)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: "1px solid rgba(255,255,255,0.04)", cursor: "pointer" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 11, color: "#475569", width: 16 }}>#{i + 1}</span>
                  <span style={{ fontSize: 14 }}>{c.flag}</span>
                  <span style={{ fontSize: 12, color: "#f1f5f9" }}>{c.name}</span>
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: getScoreColor(c.score) }}>{c.score}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
