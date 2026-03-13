"use client";
import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const nodes = [
  { id: "Python", group: 1, val: 30, color: "var(--accent-yellow)" },
  { id: "LLMs", group: 1, val: 50, color: "var(--accent-pink)" },
  { id: "PyTorch", group: 1, val: 35, color: "var(--accent-cyan)" },
  { id: "Docker", group: 2, val: 25, color: "var(--accent-green)" },
  { id: "K8s", group: 2, val: 35, color: "var(--accent-orange)" },
  { id: "AWS", group: 2, val: 30, color: "var(--accent-blue)" },
  { id: "TypeScript", group: 3, val: 25, color: "var(--accent-pink)" },
  { id: "React", group: 3, val: 30, color: "var(--accent-cyan)" },
  { id: "Node.js", group: 3, val: 25, color: "var(--accent-green)" },
  { id: "Rust", group: 4, val: 40, color: "var(--accent-orange)" },
  { id: "Golang", group: 4, val: 30, color: "var(--accent-yellow)" },
];

const links = [
  { source: "Python", target: "LLMs" },
  { source: "Python", target: "PyTorch" },
  { source: "LLMs", target: "PyTorch" },
  { source: "Python", target: "Docker" },
  { source: "Docker", target: "K8s" },
  { source: "K8s", target: "AWS" },
  { source: "TypeScript", target: "React" },
  { source: "React", target: "Node.js" },
  { source: "Node.js", target: "Docker" },
  { source: "Rust", target: "Node.js" },
  { source: "Golang", target: "Docker" },
];

export default function SkillGraph() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!svgRef.current) return;

    const width = svgRef.current.clientWidth;
    const height = 600;

    const svg = d3.select(svgRef.current)
      .attr("viewBox", [0, 0, width, height]);

    svg.selectAll("*").remove();

    const simulation = d3.forceSimulation(nodes as any)
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2));

    const link = svg.append("g")
      .attr("stroke", "black")
      .attr("stroke-width", 3)
      .selectAll("line")
      .data(links)
      .join("line");

    const node = svg.append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .call(d3.drag<any, any>()
        .on("start", (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x; d.fy = d.y;
        })
        .on("drag", (event, d) => {
          d.fx = event.x; d.fy = event.y;
        })
        .on("end", (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null; d.fy = null;
        }) as any);

    // Neo-brutalist squares instead of circles
    node.append("rect")
      .attr("width", d => d.val)
      .attr("height", d => d.val)
      .attr("x", d => -d.val / 2)
      .attr("y", d => -d.val / 2)
      .attr("fill", d => d.color)
      .attr("stroke", "black")
      .attr("stroke-width", 3)
      .style("cursor", "pointer")
      .on("click", (event, d) => setSelectedNode(d));

    node.append("text")
      .text(d => d.id)
      .attr("x", 0)
      .attr("y", d => d.val / 2 + 15)
      .attr("text-anchor", "middle")
      .style("font-weight", "900")
      .style("font-size", "12px")
      .style("text-transform", "uppercase");

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node
        .attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

  }, [mounted]);

  if (!mounted) return null;

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ marginBottom: 40, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <h1 className="section-title">SKILL KNOWLEDGE GRAPH</h1>
          <p style={{ fontWeight: 800, fontSize: 18 }}>Interactive entity relationship map</p>
        </div>
        <div className="brutalist-badge" style={{ background: "var(--accent-yellow)" }}>
          NODES: {nodes.length} | LINKS: {links.length}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 32 }}>
        <div className="brutalist-card" style={{ background: "white", padding: 0, overflow: "hidden", height: 600 }}>
          <svg ref={svgRef} style={{ width: "100%", height: "100%" }} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div className="brutalist-card" style={{ background: "var(--accent-pink)" }}>
            <h3 style={{ marginBottom: 15 }}>NODE INSPECTOR</h3>
            {selectedNode ? (
              <div>
                <div style={{ fontSize: 32, fontWeight: 900, marginBottom: 10 }}>{selectedNode.id}</div>
                <div style={{ padding: "10px", background: "white", border: "3px solid black", marginBottom: 10 }}>
                  <div style={{ fontSize: 12, fontWeight: 800 }}>DEMAND LEVEL</div>
                  <div style={{ fontSize: 24, fontWeight: 900 }}>CRITICAL</div>
                </div>
                <p style={{ fontWeight: 600, fontSize: 14 }}>Detected as a primary growth node in the Q1 Skill Index.</p>
              </div>
            ) : (
              <p style={{ fontWeight: 700, opacity: 0.7 }}>SELECT A NODE TO ANALYZE REAL-TIME DATA</p>
            )}
          </div>

          <div className="brutalist-card" style={{ background: "var(--accent-cyan)" }}>
            <h3 style={{ marginBottom: 10 }}>LEGEND</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {["AI", "CLOUD", "WEB", "SYSTEMS"].map(cat => (
                <span key={cat} className="brutalist-badge" style={{ background: "white" }}>{cat}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
