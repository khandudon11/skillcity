"use client";
import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { useDropzone } from "react-dropzone";
import { Upload, FileType, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";

const DEMO_RESUMES = [
  { 
    name: "Alex_AI_Dev.pdf", 
    skills: [
      { name: "Python", category: "AI", score: 95, color: "var(--accent-yellow)" },
      { name: "PyTorch", category: "AI", score: 92, color: "var(--accent-pink)" },
      { name: "Docker", category: "Cloud", score: 85, color: "var(--accent-cyan)" },
      { name: "Rust", category: "Systems", score: 88, color: "var(--accent-orange)" },
    ],
    summary: "Senior AI Engineer with 5+ years experience in LLM development and system optimization."
  },
  { 
    name: "Sarah_Fullstack.pdf", 
    skills: [
      { name: "TypeScript", category: "Web", score: 98, color: "var(--accent-pink)" },
      { name: "React", category: "Web", score: 94, color: "var(--accent-cyan)" },
      { name: "PostgreSQL", category: "DB", score: 87, color: "var(--accent-green)" },
      { name: "Node.js", category: "Backend", score: 91, color: "var(--accent-yellow)" },
    ],
    summary: "Versatile full-stack developer focused on high-performance web applications and scalable architecture."
  }
];

export default function ResumePage() {
  const [file, setFile] = useState<File | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFile(acceptedFiles[0]);
    simulateExtraction(DEMO_RESUMES[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: { 'application/pdf': ['.pdf'], 'text/plain': ['.txt'] },
    multiple: false
  });

  const simulateExtraction = (demoData: any) => {
    setIsExtracting(true);
    setResults(null);
    setTimeout(() => {
      setResults(demoData);
      setIsExtracting(false);
    }, 2000);
  };

  if (!mounted) return null;

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto" }}>
      <div style={{ marginBottom: 40 }}>
        <h1 className="section-title">RESUME ANALYZER TERMINAL</h1>
        <p style={{ fontSize: 20, fontWeight: 700 }}>Extraction level: <span style={{ background: "var(--accent-yellow)", padding: "0 8px" }}>LEVEL 4 AI NLP</span></p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
        {/* Left Column: Upload */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div {...getRootProps()} className="brutalist-card" style={{
            height: 300,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            borderStyle: "dashed",
            background: isDragActive ? "var(--accent-cyan)" : "white",
            cursor: "pointer",
            textAlign: "center"
          }}>
            <input {...getInputProps()} />
            <div style={{ background: "black", color: "white", width: 80, height: 80, display: "grid", placeItems: "center", marginBottom: 20, boxShadow: "5px 5px 0px 0px var(--accent-pink)" }}>
              <Upload size={40} />
            </div>
            <h3 style={{ fontSize: 24, marginBottom: 10 }}>DROP RESUME HERE</h3>
            <p style={{ fontWeight: 700 }}>.PDF or .TXT formats supported</p>
          </div>

          <div className="brutalist-card" style={{ background: "var(--accent-yellow)" }}>
            <h3 style={{ fontSize: 18, marginBottom: 16 }}>QUICK DEMO OVERRIDE</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {DEMO_RESUMES.map((r, i) => (
                <button 
                  key={i} 
                  onClick={() => simulateExtraction(r)}
                  className="brutalist-button"
                  style={{ background: "white", width: "100%", justifyContent: "space-between" }}
                >
                  LOAD: {r.name} <ArrowRight size={18} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Results */}
        <div className="brutalist-card" style={{ minHeight: 450, background: "white", position: "relative" }}>
          {!file && !results && !isExtracting && (
            <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#666" }}>
              <FileType size={64} style={{ marginBottom: 20, opacity: 0.3 }} />
              <p style={{ fontWeight: 900, fontSize: 14 }}>AWAITING INPUT SIGNAL...</p>
            </div>
          )}

          {isExtracting && (
            <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: 100, height: 100, border: "8px solid black", borderTopColor: "var(--accent-pink)", animation: "spin 1s infinite linear" }} />
              <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
              <h3 style={{ marginTop: 20 }}>SCANNING ENTITIES...</h3>
            </div>
          )}

          {results && (
            <div style={{ animation: "fadeIn 0.5s ease" }}>
              <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                <CheckCircle2 color="var(--accent-green)" size={32} strokeWidth={3} />
                <h2 style={{ fontSize: 24, textDecoration: "underline" }}>EXTRACTION SUCCESS</h2>
              </div>
              
              <div style={{ background: "#f0f0f0", border: "3px solid black", padding: "15px", marginBottom: 24 }}>
                <div style={{ fontWeight: 900, fontSize: 12, marginBottom: 5 }}>AI SUMMARY:</div>
                <p style={{ fontWeight: 600, fontSize: 14, lineHeight: 1.4 }}>{results.summary}</p>
              </div>

              <h3 style={{ fontSize: 16, marginBottom: 16 }}>DETECTED SKILLS & SCORE:</h3>
              <div style={{ display: "grid", gap: 16 }}>
                {results.skills.map((s: any, i: number) => (
                  <div key={i} style={{ padding: "12px", border: "3px solid black", background: s.color, boxShadow: "4px 4px 0px 0px black" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, alignItems: "center" }}>
                      <span style={{ fontWeight: 900, fontSize: 16 }}>{s.name}</span>
                      <span style={{ background: "black", color: "white", padding: "2px 8px", fontSize: 10, fontWeight: 900 }}>{s.category}</span>
                    </div>
                    <div className="progress-bar" style={{ height: 16 }}>
                      <div className="progress-fill" style={{ width: `${s.score}%`, background: "black" }} />
                    </div>
                    <div style={{ textAlign: "right", fontWeight: 900, fontSize: 12, marginTop: 4 }}>MATCH: {s.score}%</div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 32, padding: "16px", background: "black", color: "white", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 900 }}>READY FOR SIMULATION</span>
                <Link href="/career-sim">
                  <button style={{ background: "var(--accent-yellow)", border: "2px solid white", padding: "5px 15px", fontWeight: 900, cursor: "pointer" }}>
                    PROCEED →
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
