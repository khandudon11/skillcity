"use client";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Box } from "lucide-react";

const clusters = [
  { name: "AI/ML", color: "#FF00FF", pos: [10, 5, 0], skills: ["LLMs", "PyTorch", "NLP", "Computer Vision"] },
  { name: "Systems", color: "#FFFF00", pos: [-10, -5, 5], skills: ["Rust", "C++", "Go", "Kernel"] },
  { name: "Cloud", color: "#00FFFF", pos: [0, 8, -10], skills: ["AWS", "Docker", "K8s", "Terraform"] },
  { name: "Security", color: "#00FF00", pos: [-5, 10, -5], skills: ["Pentesting", "Cryptography", "Identity"] },
];

export default function SkillGalaxy() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [activeCluster, setActiveCluster] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = 600;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 25;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    containerRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // Grid helper for brutalist feel
    const grid = new THREE.GridHelper(50, 50, 0x000000, 0x000000);
    grid.material.opacity = 0.2;
    grid.material.transparent = true;
    scene.add(grid);

    const points: THREE.Mesh[] = [];

    clusters.forEach(c => {
      // Cluster core
      const geo = new THREE.BoxGeometry(2, 2, 2);
      const mat = new THREE.MeshBasicMaterial({ color: c.color, wireframe: false });
      const mesh = new THREE.Mesh(geo, mat);
      
      // Outline for brutalism
      const edges = new THREE.EdgesGeometry(geo);
      const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 3 }));
      mesh.add(line);
      
      mesh.position.set(c.pos[0], c.pos[1], c.pos[2]);
      mesh.userData = c;
      scene.add(mesh);
      points.push(mesh);

      // Skill particles around cluster
      c.skills.forEach((s, idx) => {
        const sGeo = new THREE.SphereGeometry(0.3, 8, 8);
        const sMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
        const sMesh = new THREE.Mesh(sGeo, sMat);
        const angle = (idx / c.skills.length) * Math.PI * 2;
        sMesh.position.set(
          c.pos[0] + Math.cos(angle) * 4,
          c.pos[1] + Math.sin(angle) * 4,
          c.pos[2] + (Math.random() - 0.5) * 2
        );
        scene.add(sMesh);
      });
    });

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseMove = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / height) * 2 + 1;
    };

    const onClick = () => {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(points);
      if (intersects.length > 0) {
        setActiveCluster(intersects[0].object.userData);
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("click", onClick);

    const animate = () => {
      requestAnimationFrame(animate);
      points.forEach(p => {
        p.rotation.x += 0.01;
        p.rotation.y += 0.01;
      });
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("click", onClick);
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ marginBottom: 40, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 className="section-title">SKILL GALAXY (3D)</h1>
          <p style={{ fontWeight: 800, fontSize: 18 }}>Spatial visualization of technological star-clusters</p>
        </div>
        <div style={{ background: "black", color: "white", padding: "10px 20px", transform: "rotate(2deg)" }}>
          <span style={{ fontWeight: 900 }}>ENGINE: THREE.JS V183+</span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 350px", gap: 32 }}>
        <div className="brutalist-card" style={{ padding: 0, height: 600, background: "white", cursor: "crosshair" }} ref={containerRef} />

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div className="brutalist-card" style={{ background: "var(--accent-yellow)", height: "100%" }}>
            <h3 style={{ marginBottom: 20 }}>CLUSTER DATA</h3>
            {activeCluster ? (
              <div>
                <div style={{ fontSize: 32, fontWeight: 900, marginBottom: 5 }}>{activeCluster.name}</div>
                <div style={{ height: 4, background: "black", marginBottom: 20 }} />
                <h4 style={{ fontSize: 14, marginBottom: 10 }}>CORE TECHNOLOGIES:</h4>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                  {activeCluster.skills.map((s: any) => (
                    <div key={s} style={{ padding: "8px 12px", background: "white", border: "3px solid black", fontWeight: 800, fontSize: 12 }}>
                      {s}
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 40, padding: "15px", border: "3px solid black", background: "white", boxShadow: "5px 5px 0px 0px black" }}>
                  <div style={{ fontWeight: 900, fontSize: 12 }}>CLUSTER MOMENTUM</div>
                  <div style={{ fontSize: 24, fontWeight: 900, color: "var(--accent-pink)" }}>HIGH VELOCITY</div>
                </div>
              </div>
            ) : (
              <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
                <Box size={64} style={{ marginBottom: 20 }} />
                <p style={{ fontWeight: 900 }}>ORBIT AND SELECT A SYSTEM TO SCAN CONTENTS</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
