"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import * as THREE from "three";
import { featuredProjects } from "@/lib/content/projects";
import { projectCovers } from "@/lib/content/project-covers";
import { ArrowUpRight, Gauge, Layers, Palette } from "lucide-react";
import styles from "./DepthGalleryDemo.module.css";

interface MoodData {
  background: string;
  blob1: string;
  blob2: string;
  pms: string;
  cmyk: string;
  hex: string;
}

const projectMoods: MoodData[] = [
  {
    background: "#08070b",
    blob1: "#00aebd",
    blob2: "#b99d73",
    pms: "PMS 3115 C / 7562 C",
    cmyk: "C100 M0 Y20 K0 / C10 M28 Y62 K24",
    hex: "#00AEBD / #B99D73",
  },
  {
    background: "#0a0a14",
    blob1: "#b99d73",
    blob2: "#2d5f9b",
    pms: "PMS 7562 C / 2154 C",
    cmyk: "C10 M28 Y62 K24 / C85 M55 Y10 K15",
    hex: "#B99D73 / #2D5F9B",
  },
  {
    background: "#070c12",
    blob1: "#00aebd",
    blob2: "#40647c",
    pms: "PMS 3115 C / 7699 C",
    cmyk: "C100 M0 Y20 K0 / C70 M40 Y25 K30",
    hex: "#00AEBD / #40647C",
  },
  {
    background: "#0b0c0d",
    blob1: "#b99d73",
    blob2: "#00aebd",
    pms: "PMS 7562 C / 3115 C",
    cmyk: "C10 M28 Y62 K24 / C100 M0 Y20 K0",
    hex: "#B99D73 / #00AEBD",
  },
];

// Codrops GLSL background shader by Houmahani Kane
const moodVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const moodFragmentShader = `
  uniform float uTime;
  uniform vec3 uBgColor;
  uniform vec3 uBlob1Color;
  uniform vec3 uBlob2Color;
  uniform float uVelocityIntensity;
  uniform float uBlobRadius;
  uniform float uBlobRadiusSecondary;
  uniform float uBlobStrength;
  uniform float uNoiseStrength;
  varying vec2 vUv;

  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  }

  void main() {
    // 1. Flat background base
    vec3 color = uBgColor;

    // Animated blob centers
    vec2 blob1Center = vec2(
      0.35 + 0.15 * sin(uTime * 0.45),
      0.50 + 0.12 * cos(uTime * 0.35)
    );
    vec2 blob2Center = vec2(
      0.68 + 0.12 * cos(uTime * 0.38),
      0.45 + 0.14 * sin(uTime * 0.52)
    );

    // 2. Two soft organic blobs
    float blob1 = smoothstep(uBlobRadius, 0.0, distance(vUv, blob1Center));
    float blob2 = smoothstep(uBlobRadiusSecondary, 0.0, distance(vUv, blob2Center));

    // 3. Blend blobs into background
    vec3 blob1SoftColor = mix(uBlob1Color, uBgColor, 0.35);
    vec3 blob2SoftColor = mix(uBlob2Color, uBgColor, 0.35);
    color = mix(color, blob1SoftColor, blob1 * uBlobStrength);
    color = mix(color, blob2SoftColor, blob2 * uBlobStrength);

    // 4. Velocity lifts brightness slightly on fast scroll
    color += uVelocityIntensity * 0.10;

    // 5. Film grain for tangible editorial texture
    float grain = random(vUv * vec2(1387.13, 947.91)) - 0.5;
    color += grain * uNoiseStrength;

    gl_FragColor = vec4(color, 1.0);
  }
`;

export default function DepthGalleryDemo() {
  const runwayRef = useRef<HTMLDivElement>(null);
  const canvasHolderRef = useRef<HTMLDivElement>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollVelocity, setScrollVelocity] = useState(0);
  const [, setScrollProgress] = useState(0);

  const targetProgress = useRef(0);
  const currentProgress = useRef(0);
  const lastScrollY = useRef(0);
  const velocity = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });

  const jumpToProject = useCallback((idx: number) => {
    const runway = runwayRef.current;
    if (!runway) return;
    const scrollableDistance = runway.offsetHeight - window.innerHeight;
    const targetY = runway.offsetTop + (idx / (featuredProjects.length - 1)) * scrollableDistance;
    window.scrollTo({ top: targetY, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const container = canvasHolderRef.current;
    const runway = runwayRef.current;
    if (!container || !runway) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 0, 4.2);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const loader = new THREE.TextureLoader();
    const cardMeshes: THREE.Mesh[] = [];
    const cardGroup = new THREE.Group();
    scene.add(cardGroup);

    const SPACING = 4.5;

    featuredProjects.forEach((proj, i) => {
      const cover = projectCovers[proj.kind];
      const texture = loader.load(cover.image.src);
      texture.colorSpace = THREE.SRGBColorSpace;

      const geometry = new THREE.PlaneGeometry(3.6, 2.05, 32, 32);
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 0.95,
        side: THREE.DoubleSide,
      });

      const mesh = new THREE.Mesh(geometry, material);
      // Alternate subtle X compositions as described by Codrops
      const xOffset = i % 2 === 0 ? -0.25 : 0.25;
      mesh.position.set(xOffset, 0, -i * SPACING);
      cardMeshes.push(mesh);
      cardGroup.add(mesh);
    });

    // Mood background shader plane
    const bgGeo = new THREE.PlaneGeometry(42, 28);
    const bgMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uBgColor: { value: new THREE.Color("#08070b") },
        uBlob1Color: { value: new THREE.Color("#00aebd") },
        uBlob2Color: { value: new THREE.Color("#b99d73") },
        uVelocityIntensity: { value: 0 },
        uBlobRadius: { value: 0.65 },
        uBlobRadiusSecondary: { value: 0.55 },
        uBlobStrength: { value: 0.42 },
        uNoiseStrength: { value: 0.035 },
      },
      vertexShader: moodVertexShader,
      fragmentShader: moodFragmentShader,
      depthWrite: false,
    });
    const bgMesh = new THREE.Mesh(bgGeo, bgMat);
    bgMesh.position.set(0, 0, -20);
    scene.add(bgMesh);

    const handlePointerMove = (e: MouseEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handlePointerMove, { passive: true });

    const handleWindowScroll = () => {
      const rect = runway.getBoundingClientRect();
      const scrollableDistance = runway.offsetHeight - window.innerHeight;
      if (scrollableDistance <= 0) return;

      const currentScroll = -rect.top;
      const progress = Math.max(0, Math.min(1, currentScroll / scrollableDistance));
      targetProgress.current = progress;
      setScrollProgress(progress);

      const nowScrollY = window.scrollY;
      const dY = Math.abs(nowScrollY - lastScrollY.current);
      velocity.current = Math.min(1.5, velocity.current + dY * 0.004);
      lastScrollY.current = nowScrollY;
    };

    window.addEventListener("scroll", handleWindowScroll, { passive: true });
    handleWindowScroll();

    let animId = 0;
    const animate = () => {
      currentProgress.current += (targetProgress.current - currentProgress.current) * 0.085;
      velocity.current *= 0.90;
      if (velocity.current < 0.001) velocity.current = 0;
      setScrollVelocity(Math.round(velocity.current * 100));

      const totalZTravel = (featuredProjects.length - 1) * SPACING;
      cardGroup.position.z = currentProgress.current * totalZTravel;

      const exactCardIndex = currentProgress.current * (featuredProjects.length - 1);
      const closest = Math.max(0, Math.min(featuredProjects.length - 1, Math.round(exactCardIndex)));
      setActiveIndex(closest);

      // Micro-motion: mouse parallax, breath tilt, scale pulse
      cardMeshes.forEach((mesh, idx) => {
        const worldZ = mesh.position.z + cardGroup.position.z;
        const distFromFocus = Math.abs(worldZ);

        // 1. Mouse Parallax with depth influence
        const depthFactor = Math.max(0.4, 1.2 - idx * 0.18);
        const targetX = (idx % 2 === 0 ? -0.25 : 0.25) + pointer.current.x * 0.18 * depthFactor;
        const targetY = pointer.current.y * 0.12 * depthFactor;
        mesh.position.x += (targetX - mesh.position.x) * 0.1;
        mesh.position.y += (targetY - mesh.position.y) * 0.1;

        // 2. Breath tilt and pulse driven by velocity
        mesh.rotation.y = Math.sin(worldZ * 0.3) * 0.06;
        mesh.rotation.x = -velocity.current * 0.28;
        const scalePulse = (1 + velocity.current * 0.05) * Math.max(0.7, 1 - distFromFocus * 0.08);
        mesh.scale.set(scalePulse, scalePulse, 1);

        const mat = mesh.material as THREE.MeshBasicMaterial;
        mat.opacity = Math.max(0.12, Math.min(1, 1 - (distFromFocus - 0.4) * 0.28));
      });

      // Background palette interpolation between adjacent moods
      const moodA = projectMoods[closest] || projectMoods[0];
      const nextIdx = Math.min(projectMoods.length - 1, closest + 1);
      const moodB = projectMoods[nextIdx];
      const blend = Math.max(0, Math.min(1, exactCardIndex - closest));

      const colBg = new THREE.Color(moodA.background).lerp(new THREE.Color(moodB.background), blend);
      const colB1 = new THREE.Color(moodA.blob1).lerp(new THREE.Color(moodB.blob1), blend);
      const colB2 = new THREE.Color(moodA.blob2).lerp(new THREE.Color(moodB.blob2), blend);

      bgMat.uniforms.uBgColor.value.lerp(colBg, 0.08);
      bgMat.uniforms.uBlob1Color.value.lerp(colB1, 0.08);
      bgMat.uniforms.uBlob2Color.value.lerp(colB2, 0.08);
      bgMat.uniforms.uVelocityIntensity.value = velocity.current;
      bgMat.uniforms.uTime.value = performance.now() * 0.001;

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    const onResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("scroll", handleWindowScroll);
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      bgGeo.dispose();
      bgMat.dispose();
      if (renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
    };
  }, []);

  const project = featuredProjects[activeIndex];
  const mood = projectMoods[activeIndex];

  return (
    <div className={styles.runway} ref={runwayRef}>
      <div className={styles.stickyCanvas} ref={canvasHolderRef}>
        {/* Editorial Top Overlay */}
        <div className={styles.topBar}>
          <div>
            <span className={styles.tag}>CODROPS SPATIAL DEPTH ARCHITECTURE</span>
            <h1 className={styles.heading}>Scroll-Reactive 3D Gallery</h1>
          </div>

          <div className={styles.diagnostics}>
            <div className={styles.diagBadge}>
              <Gauge size={13} className={styles.diagIcon} />
              <span>VELOCITY: {scrollVelocity}%</span>
            </div>
            <div className={styles.diagBadge}>
              <Layers size={13} className={styles.diagIcon} />
              <span>0{activeIndex + 1} / 0{featuredProjects.length}</span>
            </div>
          </div>
        </div>

        {/* Editorial Color Chip Layer inspired by @thisislandscape / Codrops */}
        <div className={styles.colorChipBox}>
          <div className={styles.chipHeader}>
            <Palette size={12} className={styles.chipIcon} />
            <span>MOOD SPECTRUM</span>
          </div>
          <div className={styles.chipColors}>
            <div className={styles.chipSwatch} style={{ background: mood.blob1 }} />
            <div className={styles.chipSwatch} style={{ background: mood.blob2 }} />
          </div>
          <div className={styles.chipSpecs}>
            <div><span>HEX:</span> {mood.hex}</div>
            <div><span>PMS:</span> {mood.pms}</div>
            <div><span>CMYK:</span> {mood.cmyk}</div>
          </div>
        </div>

        {/* Focal Project Details */}
        <div className={styles.bottomCard}>
          <div className={styles.projectPill}>
            <span className={styles.projectKind}>{project.field}</span>
            <h2 className={styles.projectTitle}>{project.name}</h2>
            <p className={styles.projectLine}>{project.line}</p>
          </div>

          <Link href={project.href} className={styles.exploreBtn}>
            {project.action}
            <ArrowUpRight size={15} />
          </Link>
        </div>

        {/* Interactive Bottom Project Stepper */}
        <div className={styles.stepper}>
          {featuredProjects.map((p, i) => (
            <button
              key={p.name}
              type="button"
              className={`${styles.stepBtn} ${i === activeIndex ? styles.stepBtnActive : ""}`}
              onClick={() => jumpToProject(i)}
            >
              0{i + 1} · {p.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
