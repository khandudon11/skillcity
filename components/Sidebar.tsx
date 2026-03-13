"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, FileText, Share2, Rocket, 
  BarChart3, Globe, Box, Wallet, ShieldAlert,
  ChevronLeft, ChevronRight, Menu
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/", color: "var(--accent-yellow)" },
  { name: "Resume Upload", icon: FileText, href: "/resume", color: "var(--accent-cyan)" },
  { name: "Skill Graph", icon: Share2, href: "/skill-graph", color: "var(--accent-pink)" },
  { name: "Career Simulator", icon: Rocket, href: "/career-sim", color: "var(--accent-green)" },
  { name: "Skill Market", icon: BarChart3, href: "/skill-market", color: "var(--accent-orange)" },
  { name: "Skill Galaxy", icon: Box, href: "/galaxy", color: "var(--accent-yellow)" },
  { name: "Global Map", icon: Globe, href: "/world-map", color: "var(--accent-cyan)" },
  { name: "Portfolio", icon: Wallet, href: "/portfolio", color: "var(--accent-pink)" },
  { name: "Automation Risk", icon: ShieldAlert, href: "/automation", color: "var(--accent-green)" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div style={{ width: collapsed ? "80px" : "260px" }} />;

  return (
    <aside style={{
      width: collapsed ? "80px" : "260px",
      minHeight: "100vh",
      background: "white",
      borderRight: "4px solid black",
      display: "flex",
      flexDirection: "column",
      position: "fixed",
      left: 0,
      top: 0,
      transition: "width 0.2s ease",
      zIndex: 1000,
    }}>
      <div style={{ padding: "20px", borderBottom: "4px solid black", display: "flex", alignItems: "center", justifyContent: "space-between", background: "black", color: "white" }}>
        {!collapsed && (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, background: "var(--accent-yellow)", border: "2px solid white", display: "grid", placeItems: "center", transform: "rotate(5deg)" }}>
              <span style={{ color: "black", fontWeight: 900 }}>S</span>
            </div>
            <span style={{ fontWeight: 900, fontSize: 18, letterSpacing: -1 }}>SKILLCITY</span>
          </div>
        )}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          style={{ background: "var(--accent-cyan)", border: "2px solid white", cursor: "pointer", width: 32, height: 32, display: "grid", placeItems: "center" }}
        >
          {collapsed ? <ChevronRight size={18} color="black" /> : <ChevronLeft size={18} color="black" />}
        </button>
      </div>

      <nav style={{ padding: "16px", flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
        {!collapsed && <span style={{ fontSize: 10, fontWeight: 900, color: "black", textTransform: "uppercase", marginBottom: 4 }}>Main Terminal</span>}
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link key={item.name} href={item.href} style={{ textDecoration: "none" }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px",
                border: isActive ? "3px solid black" : "3px solid transparent",
                background: isActive ? item.color : "transparent",
                boxShadow: isActive ? "4px 4px 0px 0px black" : "none",
                color: "black",
                fontWeight: 800,
                transition: "all 0.1s ease",
                cursor: "pointer",
              }}
              className={!isActive ? "hover-neo" : ""}
              >
                <Icon size={22} strokeWidth={isActive ? 3 : 2} />
                {!collapsed && <span>{item.name}</span>}
              </div>
            </Link>
          );
        })}
      </nav>

      {!collapsed && (
        <div style={{ padding: "20px", borderTop: "4px solid black", background: "var(--accent-pink)" }}>
          <div style={{ fontWeight: 900, fontSize: 12, marginBottom: 4 }}>SYSTEM STATUS</div>
          <div style={{ padding: "8px", background: "white", border: "2px solid black", display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 8, height: 8, background: "var(--accent-green)", border: "1px solid black", borderRadius: "50%" }} />
            <span style={{ fontSize: 10, fontWeight: 800 }}>AI AGENTS ONLINE</span>
          </div>
        </div>
      )}
      
      <style jsx>{`
        .hover-neo:hover {
          background: #f0f0f0;
          border: 3px solid black;
          box-shadow: 3px 3px 0px 0px black;
          transform: translate(-1px, -1px);
        }
      `}</style>
    </aside>
  );
}
