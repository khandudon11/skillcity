"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", icon: "🏠", label: "Dashboard" },
  { href: "/resume", icon: "📄", label: "Resume Upload" },
  { href: "/skill-graph", icon: "🕸️", label: "Skill Graph" },
  { href: "/career-sim", icon: "🚀", label: "Career Simulator" },
  { href: "/skill-market", icon: "📈", label: "Skill Market" },
  { href: "/galaxy", icon: "🌌", label: "Skill Galaxy" },
  { href: "/world-map", icon: "🌍", label: "Global Map" },
  { href: "/portfolio", icon: "💼", label: "Portfolio" },
  { href: "/automation", icon: "🤖", label: "Automation Risk" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside style={{
      position: "fixed",
      top: 0,
      left: 0,
      height: "100vh",
      width: collapsed ? "72px" : "260px",
      background: "rgba(13, 18, 37, 0.95)",
      backdropFilter: "blur(20px)",
      borderRight: "1px solid rgba(59, 130, 246, 0.15)",
      display: "flex",
      flexDirection: "column",
      padding: "20px 12px",
      transition: "width 0.3s ease",
      zIndex: 100,
      overflow: "hidden",
    }}>
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32, padding: "0 4px" }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10, flexShrink: 0,
          background: "linear-gradient(135deg, #3b82f6, #06b6d4)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 20, boxShadow: "0 0 20px rgba(59,130,246,0.4)"
        }}>⚡</div>
        {!collapsed && (
          <div>
            <div style={{ fontFamily: "Orbitron, sans-serif", fontSize: 14, fontWeight: 700, color: "#f1f5f9", lineHeight: 1.2 }}>
              SKILL ECONOMY
            </div>
            <div style={{ fontFamily: "Orbitron, sans-serif", fontSize: 10, color: "#06b6d4", letterSpacing: 2 }}>
              SIMULATOR
            </div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            marginLeft: "auto",
            background: "none", border: "none",
            color: "#475569", cursor: "pointer",
            fontSize: 18, padding: 4,
            flexShrink: 0,
            borderRadius: 6,
          }}
        >
          {collapsed ? "›" : "‹"}
        </button>
      </div>

      {/* Nav Label */}
      {!collapsed && (
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: "#475569", textTransform: "uppercase", padding: "0 8px", marginBottom: 8 }}>
          Navigation
        </div>
      )}

      {/* Nav Items */}
      <nav style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-link ${isActive ? "active" : ""}`}
              style={{
                justifyContent: collapsed ? "center" : "flex-start",
                background: isActive ? "rgba(59, 130, 246, 0.15)" : "transparent",
                border: isActive ? "1px solid rgba(59, 130, 246, 0.3)" : "1px solid transparent",
                color: isActive ? "#60a5fa" : "#94a3b8",
              }}
              title={collapsed ? item.label : undefined}
            >
              <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
              {!collapsed && <span style={{ fontSize: 13, fontWeight: 500 }}>{item.label}</span>}
              {isActive && !collapsed && (
                <span style={{
                  marginLeft: "auto", width: 6, height: 6,
                  borderRadius: "50%", background: "#3b82f6",
                  boxShadow: "0 0 8px #3b82f6"
                }} />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      {!collapsed && (
        <div style={{ padding: "16px 8px 0", borderTop: "1px solid rgba(59,130,246,0.1)" }}>
          <div style={{ fontSize: 10, color: "#475569", textAlign: "center" }}>
            Skill Economy Simulator v1.0
          </div>
          <div style={{ fontSize: 10, color: "#3b82f6", textAlign: "center", marginTop: 2 }}>
            AI-Powered Career Intelligence
          </div>
        </div>
      )}
    </aside>
  );
}
