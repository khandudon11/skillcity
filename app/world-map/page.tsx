"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

// Dynamic import for Leaflet to avoid SSR issues
const MapContainer = dynamic(() => import("react-leaflet").then(m => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(m => m.TileLayer), { ssr: false });
const CircleMarker = dynamic(() => import("react-leaflet").then(m => m.CircleMarker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then(m => m.Popup), { ssr: false });

const COUNTRIES = [
  { name: "USA", pos: [37.09, -95.71], score: 92, top: "AI/ML", color: "var(--accent-pink)" },
  { name: "India", pos: [20.59, 78.96], score: 88, top: "Fullstack", color: "var(--accent-yellow)" },
  { name: "Germany", pos: [51.16, 10.45], score: 85, top: "Security", color: "var(--accent-cyan)" },
  { name: "China", pos: [35.86, 104.19], score: 94, top: "Robotics", color: "var(--accent-green)" },
  { name: "UK", pos: [55.37, -3.43], score: 82, top: "FinTech", color: "var(--accent-orange)" },
  { name: "Singapore", pos: [1.35, 103.81], score: 89, top: "Cybersec", color: "var(--accent-blue)" },
];

export default function WorldMap() {
  const [mounted, setMounted] = useState(false);
  const [selected, setSelected] = useState<any>(null);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ marginBottom: 40, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 className="section-title">GLOBAL DEMAND MAP</h1>
          <p style={{ fontWeight: 800, fontSize: 18 }}>Geospatial heatmap of skill saturation indices</p>
        </div>
        <div style={{ background: "black", color: "white", padding: "10px 20px" }}>
          <span style={{ fontWeight: 900 }}>TOTAL HOTSPOTS: {COUNTRIES.length}</span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 350px", gap: 32 }}>
        <div className="brutalist-card" style={{ padding: 0, height: 600, overflow: "hidden", background: "white" }}>
          <MapContainer center={[20, 0] as any} zoom={2} style={{ height: "100%", width: "100%", background: "white" }}>
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {COUNTRIES.map((c, i) => (
              <CircleMarker 
                key={i}
                center={c.pos as any}
                radius={c.score / 5}
                pathOptions={{ 
                  fillColor: c.color, 
                  fillOpacity: 0.8, 
                  color: "black", 
                  weight: 3,
                }}
                eventHandlers={{
                  click: () => setSelected(c)
                }}
              >
                <Popup>
                  <div style={{ fontWeight: 900, textTransform: "uppercase" }}>
                    {c.name}<br />DEMAND: {c.score}
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div className="brutalist-card" style={{ background: "white", borderLeft: "15px solid black" }}>
            <h3 style={{ marginBottom: 15 }}>GEOSPATIAL INDEX</h3>
            {selected ? (
              <div>
                <div style={{ fontSize: 48, fontWeight: 900, lineHeight: 1 }}>{selected.name}</div>
                <div style={{ background: selected.color, border: "3px solid black", padding: "15px", marginTop: 20, boxShadow: "5px 5px 0px 0px black" }}>
                  <div style={{ fontSize: 12, fontWeight: 900 }}>TOP DOMAIN:</div>
                  <div style={{ fontSize: 28, fontWeight: 900 }}>{selected.top}</div>
                </div>
                <div style={{ marginTop: 20 }}>
                  <div style={{ fontWeight: 900, fontSize: 12, marginBottom: 5 }}>MARKET SATURATION:</div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${selected.score}%`, background: "black" }} />
                  </div>
                </div>
              </div>
            ) : (
              <p style={{ fontWeight: 800, opacity: 0.7 }}>SELECT A HOTSPOT ON THE MAP FOR GRANULAR REGIONAL ANALYSIS</p>
            )}
          </div>

          <div className="brutalist-card" style={{ background: "var(--accent-yellow)" }}>
            <h4 style={{ marginBottom: 5 }}>MAP SETTINGS</h4>
            <div style={{ display: "grid", gap: 8 }}>
              {["DEMAND", "SALARY", "GROWTH"].map(f => (
                <button key={f} className="brutalist-button" style={{ background: "white", width: "100%", fontSize: 12 }}>
                  VIEW: {f}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
