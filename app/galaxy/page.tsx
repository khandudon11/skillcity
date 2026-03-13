"use client";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const SKILL_CLUSTERS = [
  {
    name: "AI Cluster", color: 0x3b82f6, center: [0, 0, 0],
    skills: [
      { name: "Python", size: 2.8 }, { name: "TensorFlow", size: 2.0 }, { name: "PyTorch", size: 2.1 },
      { name: "NLP", size: 1.9 }, { name: "LangChain", size: 2.5 }, { name: "Deep Learning", size: 2.3 },
      { name: "Data Science", size: 2.2 }, { name: "ML Ops", size: 1.7 },
    ],
  },
  {
    name: "Web Cluster", color: 0x8b5cf6, center: [25, 8, 10],
    skills: [
      { name: "React", size: 2.2 }, { name: "TypeScript", size: 2.0 }, { name: "Next.js", size: 1.9 },
      { name: "Node.js", size: 2.1 }, { name: "GraphQL", size: 1.6 }, { name: "Vue.js", size: 1.5 },
    ],
  },
  {
    name: "Cloud Cluster", color: 0x06b6d4, center: [-22, -10, 15],
    skills: [
      { name: "Kubernetes", size: 2.3 }, { name: "AWS", size: 2.4 }, { name: "Docker", size: 2.1 },
      { name: "Azure", size: 2.0 }, { name: "GCP", size: 1.9 }, { name: "Terraform", size: 1.8 },
    ],
  },
  {
    name: "Security Cluster", color: 0xef4444, center: [15, -20, -12],
    skills: [
      { name: "Cybersec", size: 2.4 }, { name: "PenTest", size: 2.0 }, { name: "Zero Trust", size: 1.8 },
      { name: "SIEM", size: 1.6 }, { name: "SOC", size: 1.5 },
    ],
  },
  {
    name: "Blockchain Cluster", color: 0xf59e0b, center: [-18, 18, -8],
    skills: [
      { name: "Blockchain", size: 1.8 }, { name: "Solidity", size: 1.7 }, { name: "Web3", size: 1.6 },
      { name: "Smart Contracts", size: 1.9 }, { name: "Rust", size: 2.0 },
    ],
  },
];

export default function GalaxyPage() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [auto, setAuto] = useState(true);

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const W = container.clientWidth;
    const H = container.clientHeight;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020817);
    scene.fog = new THREE.FogExp2(0x020817, 0.008);

    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 1000);
    camera.position.set(0, 15, 60);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Stars background
    const starGeo = new THREE.BufferGeometry();
    const starCount = 3000;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i++) {
      starPositions[i] = (Math.random() - 0.5) * 400;
    }
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.2, transparent: true, opacity: 0.8 });
    scene.add(new THREE.Points(starGeo, starMat));

    // Create skill planets
    const meshes: Array<{ mesh: THREE.Mesh; name: string; glow: THREE.Mesh }> = [];
    const labels: Array<{ pos: THREE.Vector3; name: string }> = [];

    SKILL_CLUSTERS.forEach(cluster => {
      const [cx, cy, cz] = cluster.center;

      // Cluster center star
      const starGeo2 = new THREE.SphereGeometry(3, 32, 32);
      const starMat2 = new THREE.MeshPhongMaterial({
        color: cluster.color, emissive: cluster.color, emissiveIntensity: 0.6,
        transparent: true, opacity: 0.9,
      });
      const starMesh = new THREE.Mesh(starGeo2, starMat2);
      starMesh.position.set(cx, cy, cz);
      scene.add(starMesh);

      // Cluster glow
      const glowGeo = new THREE.SphereGeometry(4.5, 32, 32);
      const glowMat = new THREE.MeshBasicMaterial({ color: cluster.color, transparent: true, opacity: 0.08 });
      scene.add(new THREE.Mesh(glowGeo, glowMat)).position.set(cx, cy, cz);

      // Orbital ring
      const ringGeo = new THREE.RingGeometry(7, 7.3, 64);
      const ringMat = new THREE.MeshBasicMaterial({ color: cluster.color, transparent: true, opacity: 0.15, side: THREE.DoubleSide });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2 + (Math.random() - 0.5) * 0.5;
      ring.position.set(cx, cy, cz);
      scene.add(ring);

      labels.push({ pos: new THREE.Vector3(cx, cy + 5, cz), name: cluster.name });

      // Skill planets orbiting the cluster
      cluster.skills.forEach((skill, si) => {
        const angle = (si / cluster.skills.length) * Math.PI * 2;
        const radius = 9 + Math.random() * 3;
        const px = cx + Math.cos(angle) * radius;
        const py = cy + (Math.random() - 0.5) * 6;
        const pz = cz + Math.sin(angle) * radius;

        const geo = new THREE.SphereGeometry(skill.size * 0.5, 20, 20);
        const mat = new THREE.MeshPhongMaterial({
          color: cluster.color,
          emissive: cluster.color,
          emissiveIntensity: 0.3,
          shininess: 80,
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(px, py, pz);
        scene.add(mesh);

        // Planet glow
        const glowG = new THREE.SphereGeometry(skill.size * 0.8, 16, 16);
        const glowM = new THREE.MeshBasicMaterial({ color: cluster.color, transparent: true, opacity: 0.12 });
        const glow = new THREE.Mesh(glowG, glowM);
        glow.position.copy(mesh.position);
        scene.add(glow);

        meshes.push({ mesh, name: skill.name, glow });
        labels.push({ pos: mesh.position.clone().add(new THREE.Vector3(0, skill.size * 0.5 + 0.5, 0)), name: skill.name });
      });
    });

    // Lighting
    scene.add(new THREE.AmbientLight(0x334155, 0.8));
    const point1 = new THREE.PointLight(0x3b82f6, 2, 100);
    point1.position.set(0, 20, 0);
    scene.add(point1);
    const point2 = new THREE.PointLight(0x8b5cf6, 1.5, 100);
    point2.position.set(-20, -10, 20);
    scene.add(point2);

    // Mouse interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / W) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / H) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObjects(meshes.map(m => m.mesh));
      setHovered(hits.length > 0 ? (meshes.find(m => m.mesh === hits[0].object)?.name || null) : null);
    };
    container.addEventListener("mousemove", handleMouseMove);

    // Drag rotation
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };
    container.addEventListener("mousedown", e => { isDragging = true; prevMouse = { x: e.clientX, y: e.clientY }; });
    container.addEventListener("mouseup", () => { isDragging = false; });
    container.addEventListener("mousemove", e => {
      if (!isDragging) return;
      const dx = (e.clientX - prevMouse.x) * 0.01;
      const dy = (e.clientY - prevMouse.y) * 0.01;
      scene.rotation.y += dx;
      scene.rotation.x += dy;
      prevMouse = { x: e.clientX, y: e.clientY };
    });
    container.addEventListener("wheel", e => {
      camera.position.z = Math.max(20, Math.min(120, camera.position.z + e.deltaY * 0.05));
    });

    // Animate
    let frame = 0;
    const animate = () => {
      const id = requestAnimationFrame(animate);
      frame++;
      (animate as any)._id = id;

      if (auto) {
        scene.rotation.y += 0.001;
      }

      // Pulse planets
      meshes.forEach((m, i) => {
        const pulse = 1 + Math.sin(frame * 0.03 + i * 0.7) * 0.05;
        m.glow.scale.setScalar(pulse);
      });

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      const W2 = container.clientWidth;
      const H2 = container.clientHeight;
      camera.aspect = W2 / H2;
      camera.updateProjectionMatrix();
      renderer.setSize(W2, H2);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame((animate as any)._id);
      container.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, [auto]);

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto", height: "calc(100vh - 100px)", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div>
          <h1 className="section-title gradient-text-blue">Skill Galaxy</h1>
          <p className="section-subtitle">A 3D universe of technology skills — explore clusters, planets, and star systems</p>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button className="btn-ghost" onClick={() => setAuto(!auto)} style={{ fontSize: 13 }}>
            {auto ? "⏸ Pause Orbit" : "▶ Resume Orbit"}
          </button>
        </div>
      </div>

      <div style={{ flex: 1, position: "relative", borderRadius: 16, overflow: "hidden" }}>
        <div ref={mountRef} style={{ width: "100%", height: "100%", cursor: "grab" }} />

        {/* Cluster legend */}
        <div style={{ position: "absolute", top: 16, left: 16, display: "flex", flexDirection: "column", gap: 8 }}>
          {SKILL_CLUSTERS.map((c, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 12px", background: "rgba(2,8,23,0.8)", borderRadius: 8, border: `1px solid #${c.color.toString(16).padStart(6,"0")}40` }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: `#${c.color.toString(16).padStart(6,"0")}`, boxShadow: `0 0 8px #${c.color.toString(16).padStart(6,"0")}` }} />
              <span style={{ fontSize: 12, color: "#f1f5f9", fontWeight: 600 }}>{c.name}</span>
              <span style={{ fontSize: 11, color: "#94a3b8" }}>{c.skills.length} skills</span>
            </div>
          ))}
        </div>

        {/* Hover tooltip */}
        {hovered && (
          <div style={{ position: "absolute", top: "50%", right: 24, transform: "translateY(-50%)", padding: "12px 16px", background: "rgba(15,26,46,0.95)", borderRadius: 10, border: "1px solid rgba(59,130,246,0.3)", backdropFilter: "blur(10px)" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9" }}>⚡ {hovered}</div>
            <div style={{ fontSize: 12, color: "#3b82f6", marginTop: 4 }}>Skill Planet</div>
          </div>
        )}

        {/* Controls hint */}
        <div style={{ position: "absolute", bottom: 16, right: 16, fontSize: 11, color: "#475569" }}>
          🖱️ Drag to rotate • Scroll to zoom
        </div>
      </div>
    </div>
  );
}
