import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Ticker from "@/components/Ticker";

export const metadata: Metadata = {
  title: "Skill Economy Simulator | Neo-Brutalist Edition",
  description: "Simulate how skills evolve in the global job market. Predict salary, job demand, and career growth with AI-powered analytics.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&family=Orbitron:wght@700;900&family=Space+Grotesk:wght@700&display=swap" rel="stylesheet" />
      </head>
      <body suppressHydrationWarning>
        <div style={{ display: "flex", minHeight: "100vh", background: "white" }}>
          <Sidebar />
          <div style={{ 
            flex: 1, 
            display: "flex", 
            flexDirection: "column", 
            marginLeft: "260px",
            background: "white",
            position: "relative"
          }}>
            <div className="bg-grid" />
            <Ticker />
            <main style={{ 
              flex: 1, 
              padding: "40px",
              position: "relative",
              zIndex: 1
            }}>
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
