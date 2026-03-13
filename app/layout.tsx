import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Ticker from "@/components/Ticker";

export const metadata: Metadata = {
  title: "Skill Economy Simulator | AI-Powered Career Intelligence",
  description: "Simulate how skills evolve in the global job market. Predict salary, job demand, and career growth with AI-powered analytics.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg-primary)" }}>
          <Sidebar />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", marginLeft: "260px" }}>
            <Ticker />
            <main style={{ flex: 1, padding: "24px" }}>
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
