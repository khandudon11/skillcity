"use client";
import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

interface SkillNode {
  id: string;
  category: string;
  demand: number;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}
interface SkillLink { source: string | SkillNode; target: string | SkillNode; strength: number; }

const SKILL_GRAPH: { nodes: SkillNode[]; links: SkillLink[] } = {
  nodes: [
    { id: "Python", category: "AI", demand: 94 },
    { id: "Machine Learning", category: "AI", demand: 92 },
    { id: "Deep Learning", category: "AI", demand: 90 },
    { id: "NLP", category: "AI", demand: 89 },
    { id: "LangChain", category: "AI", demand: 95 },
    { id: "TensorFlow", category: "AI", demand: 87 },
    { id: "PyTorch", category: "AI", demand: 88 },
    { id: "Data Science", category: "AI", demand: 90 },
    { id: "JavaScript", category: "Web", demand: 85 },
    { id: "TypeScript", category: "Web", demand: 87 },
    { id: "React", category: "Web", demand: 85 },
    { id: "Next.js", category: "Web", demand: 84 },
    { id: "Node.js", category: "Web", demand: 82 },
    { id: "GraphQL", category: "Web", demand: 76 },
    { id: "Vue.js", category: "Web", demand: 73 },
    { id: "Docker", category: "Cloud", demand: 88 },
    { id: "Kubernetes", category: "Cloud", demand: 89 },
    { id: "AWS", category: "Cloud", demand: 91 },
    { id: "Azure", category: "Cloud", demand: 88 },
    { id: "GCP", category: "Cloud", demand: 85 },
    { id: "Terraform", category: "Cloud", demand: 83 },
    { id: "Cybersecurity", category: "Security", demand: 92 },
    { id: "Penetration Testing", category: "Security", demand: 85 },
    { id: "Zero Trust", category: "Security", demand: 82 },
    { id: "Rust", category: "Systems", demand: 78 },
    { id: "Go", category: "Systems", demand: 80 },
    { id: "C++", category: "Systems", demand: 72 },
    { id: "Blockchain", category: "Blockchain", demand: 62 },
    { id: "Smart Contracts", category: "Blockchain", demand: 60 },
    { id: "Solidity", category: "Blockchain", demand: 58 },
    { id: "PostgreSQL", category: "Database", demand: 80 },
    { id: "MongoDB", category: "Database", demand: 77 },
    { id: "Redis", category: "Database", demand: 78 },
    { id: "SQL", category: "Database", demand: 78 },
    { id: "Spark", category: "Data", demand: 82 },
    { id: "Kafka", category: "Data", demand: 80 },
  ],
  links: [
    { source: "Python", target: "Machine Learning", strength: 5 },
    { source: "Python", target: "Data Science", strength: 5 },
    { source: "Python", target: "NLP", strength: 4 },
    { source: "Python", target: "TensorFlow", strength: 5 },
    { source: "Python", target: "PyTorch", strength: 5 },
    { source: "Python", target: "LangChain", strength: 4 },
    { source: "Machine Learning", target: "Deep Learning", strength: 5 },
    { source: "Machine Learning", target: "NLP", strength: 4 },
    { source: "Deep Learning", target: "TensorFlow", strength: 4 },
    { source: "Deep Learning", target: "PyTorch", strength: 4 },
    { source: "NLP", target: "LangChain", strength: 5 },
    { source: "LangChain", target: "Machine Learning", strength: 3 },
    { source: "JavaScript", target: "TypeScript", strength: 5 },
    { source: "JavaScript", target: "React", strength: 5 },
    { source: "JavaScript", target: "Node.js", strength: 5 },
    { source: "TypeScript", target: "React", strength: 4 },
    { source: "React", target: "Next.js", strength: 5 },
    { source: "React", target: "GraphQL", strength: 3 },
    { source: "Node.js", target: "GraphQL", strength: 3 },
    { source: "NodeEjs", target: "Vue.js", strength: 2 },
    { source: "JavaScript", target: "Vue.js", strength: 3 },
    { source: "Docker", target: "Kubernetes", strength: 5 },
    { source: "Kubernetes", target: "AWS", strength: 4 },
    { source: "Kubernetes", target: "Azure", strength: 4 },
    { source: "Kubernetes", target: "GCP", strength: 4 },
    { source: "AWS", target: "Terraform", strength: 4 },
    { source: "Docker", target: "Terraform", strength: 3 },
    { source: "Cybersecurity", target: "Penetration Testing", strength: 4 },
    { source: "Cybersecurity", target: "Zero Trust", strength: 4 },
    { source: "Cybersecurity", target: "Kubernetes", strength: 3 },
    { source: "Rust", target: "Go", strength: 2 },
    { source: "Rust", target: "Blockchain", strength: 3 },
    { source: "Rust", target: "C++", strength: 3 },
    { source: "Blockchain", target: "Smart Contracts", strength: 5 },
    { source: "Smart Contracts", target: "Solidity", strength: 5 },
    { source: "PostgreSQL", target: "SQL", strength: 4 },
    { source: "MongoDB", target: "Redis", strength: 2 },
    { source: "PostgreSQL", target: "MongoDB", strength: 2 },
    { source: "Spark", target: "Kafka", strength: 4 },
    { source: "Spark", target: "Python", strength: 4 },
    { source: "Kafka", target: "AWS", strength: 3 },
    { source: "Data Science", target: "PostgreSQL", strength: 3 },
    { source: "Machine Learning", target: "Spark", strength: 3 },
  ],
};

const CATEGORY_COLORS: Record<string, string> = {
  "AI": "#3b82f6",
  "Web": "#8b5cf6",
  "Cloud": "#06b6d4",
  "Security": "#ef4444",
  "Systems": "#f97316",
  "Blockchain": "#f59e0b",
  "Database": "#10b981",
  "Data": "#ec4899",
};

export default function SkillGraphPage() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selected, setSelected] = useState<SkillNode | null>(null);
  const [filter, setFilter] = useState<string>("All");

  const categories = ["All", ...Object.keys(CATEGORY_COLORS)];

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    const filteredNodes = filter === "All"
      ? SKILL_GRAPH.nodes
      : SKILL_GRAPH.nodes.filter(n => n.category === filter);
    const filteredIds = new Set(filteredNodes.map(n => n.id));
    const filteredLinks = SKILL_GRAPH.links.filter(
      l => filteredIds.has(l.source as string) && filteredIds.has(l.target as string)
    );

    const g = svg.append("g");

    // Zoom
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 3])
      .on("zoom", (e) => g.attr("transform", e.transform));
    svg.call(zoom);

    // Defs: glow filter
    const defs = svg.append("defs");
    const filter_ = defs.append("filter").attr("id", "glow");
    filter_.append("feGaussianBlur").attr("stdDeviation", "4").attr("result", "coloredBlur");
    const merge = filter_.append("feMerge");
    merge.append("feMergeNode").attr("in", "coloredBlur");
    merge.append("feMergeNode").attr("in", "SourceGraphic");

    // Simulation
    const simulation = d3.forceSimulation(filteredNodes as any)
      .force("link", d3.forceLink(filteredLinks as any).id((d: any) => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide(40));

    // Links
    const link = g.append("g")
      .selectAll("line")
      .data(filteredLinks)
      .join("line")
      .attr("stroke", (d) => {
        const src = filteredNodes.find(n => n.id === (d.source as any).id || n.id === d.source);
        return src ? `${CATEGORY_COLORS[src.category]}60` : "#1e293b";
      })
      .attr("stroke-width", (d) => d.strength * 0.5)
      .attr("stroke-linecap", "round");

    // Nodes
    const node = g.append("g")
      .selectAll("g")
      .data(filteredNodes)
      .join("g")
      .style("cursor", "pointer")
      .call(d3.drag<SVGGElement, SkillNode>()
        .on("start", (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x; d.fy = d.y;
        })
        .on("drag", (event, d) => { d.fx = event.x; d.fy = event.y; })
        .on("end", (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null; d.fy = null;
        })
      )
      .on("click", (_event, d) => setSelected(d));

    // Outer glow circle
    node.append("circle")
      .attr("r", (d) => 8 + d.demand / 12)
      .attr("fill", (d) => `${CATEGORY_COLORS[d.category]}20`)
      .attr("filter", "url(#glow)");

    // Main circle
    node.append("circle")
      .attr("r", (d) => 6 + d.demand / 14)
      .attr("fill", (d) => CATEGORY_COLORS[d.category])
      .attr("stroke", (d) => `${CATEGORY_COLORS[d.category]}80`)
      .attr("stroke-width", 2);

    // Labels
    node.append("text")
      .text((d) => d.id)
      .attr("dy", (d) => -(10 + d.demand / 14))
      .attr("text-anchor", "middle")
      .attr("fill", "#94a3b8")
      .attr("font-size", "10px")
      .attr("font-family", "Inter, sans-serif");

    simulation.on("tick", () => {
      link
        .attr("x1", (d) => (d.source as any).x)
        .attr("y1", (d) => (d.source as any).y)
        .attr("x2", (d) => (d.target as any).x)
        .attr("y2", (d) => (d.target as any).y);
      node.attr("transform", (d) => `translate(${d.x},${d.y})`);
    });

    return () => { simulation.stop(); };
  }, [filter]);

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto", height: "calc(100vh - 100px)", display: "flex", flexDirection: "column" }}>
      <div style={{ marginBottom: 20 }}>
        <h1 className="section-title gradient-text-blue">Skill Knowledge Graph</h1>
        <p className="section-subtitle">Explore how skills interconnect across technology domains</p>
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
        {categories.map(cat => (
          <button key={cat} onClick={() => setFilter(cat)} style={{
            padding: "6px 16px", borderRadius: 999, fontSize: 13, fontWeight: 600,
            cursor: "pointer", transition: "all 0.2s",
            background: filter === cat ? (CATEGORY_COLORS[cat] || "#3b82f6") : "transparent",
            color: filter === cat ? "white" : "#94a3b8",
            border: `1px solid ${filter === cat ? (CATEGORY_COLORS[cat] || "#3b82f6") : "#1e293b"}`,
          }}>
            {cat}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", gap: 16, flex: 1 }}>
        <div className="glass-card" style={{ flex: 1, position: "relative", overflow: "hidden" }}>
          <svg ref={svgRef} style={{ width: "100%", height: "100%" }} />
          <div style={{ position: "absolute", bottom: 16, left: 16, fontSize: 11, color: "#475569" }}>
            🖱️ Drag nodes • Scroll to zoom • Click for details
          </div>
        </div>

        {selected && (
          <div className="glass-card" style={{ width: 240, padding: 20, flexShrink: 0 }}>
            <button onClick={() => setSelected(null)} style={{ float: "right", background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: 18 }}>×</button>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: `${CATEGORY_COLORS[selected.category]}20`, border: `2px solid ${CATEGORY_COLORS[selected.category]}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, marginBottom: 12 }}>
              ⚡
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9", marginBottom: 4 }}>{selected.id}</h3>
            <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 999, background: `${CATEGORY_COLORS[selected.category]}20`, color: CATEGORY_COLORS[selected.category], fontWeight: 700 }}>
              {selected.category}
            </span>
            <div style={{ marginTop: 16 }}>
              <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 6 }}>Market Demand</div>
              <div className="progress-bar" style={{ marginBottom: 6 }}>
                <div className="progress-fill" style={{ width: `${selected.demand}%`, background: CATEGORY_COLORS[selected.category] }} />
              </div>
              <div style={{ fontSize: 18, fontWeight: 800, color: CATEGORY_COLORS[selected.category] }}>{selected.demand}/100</div>
            </div>
            <div style={{ marginTop: 16, fontSize: 12, color: "#94a3b8", lineHeight: 1.8 }}>
              <div>📈 Growth: {selected.demand > 85 ? "High" : selected.demand > 70 ? "Medium" : "Low"}</div>
              <div>💼 Jobs: {Math.round(selected.demand * 820).toLocaleString()}+</div>
              <div>⚠️ Risk: {selected.demand > 85 ? "Very Low" : selected.demand > 70 ? "Low" : "Medium"}</div>
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="glass-card" style={{ width: 150, padding: 16, flexShrink: 0 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Categories</div>
          {Object.entries(CATEGORY_COLORS).map(([cat, color]) => (
            <div key={cat} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: color, boxShadow: `0 0 6px ${color}` }} />
              <span style={{ fontSize: 12, color: "#94a3b8" }}>{cat}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
