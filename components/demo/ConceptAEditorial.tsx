import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import styles from "./ConceptAEditorial.module.css";

const domains = [
  {
    num: "01",
    tag: "HARDWARE & DIGITAL LOGIC",
    title: "Deterministic State & Fault Latching",
    invariant: "Unsafe conditions latch the state register. Correcting the input alone does not release it; conditions must clear before protected reset.",
    scope: "Proteus simulation · SR latches · Discrete counter interlocks · ESP32 edge control",
    projects: [
      { name: "USMHACS", href: "/usmhacs", desc: "Hardware access control" },
      { name: "Hardware Stopwatch", href: "/about#hardware-stopwatch", desc: "Discrete timing logic" },
    ],
  },
  {
    num: "02",
    tag: "PERCEPTION & BIOMETRICS",
    title: "Active Challenge Before Identity Matching",
    invariant: "Presence and identity are decoupled. A face detection locates a candidate; an interactive 3D challenge verifies liveness before any embedding distance is evaluated.",
    scope: "OpenCV pipeline · FaceNet feature embeddings · Finite state challenge coordinator",
    projects: [
      { name: "DARVS", href: "/darvs", desc: "Multi-stage authentication" },
      { name: "Liveness Pipeline", href: "/darvs/demo", desc: "Interactive challenge demo" },
    ],
  },
  {
    num: "03",
    tag: "WIRELESS SYSTEMS & GRAPH AI",
    title: "Explicit Representation Over Spatial Guessing",
    invariant: "Graphs reflect source-reported telemetry, never proximity heuristics. Untrusted associations remain disconnected until validated through canonical IR.",
    scope: "O-RAN E2 telemetry · Immutable canonical IR · SUMO vehicle mobility · Multi-agent RL",
    projects: [
      { name: "RANGraph", href: "/rangraph", desc: "Typed wireless graph compiler" },
      { name: "GraphMARL", href: "/graphmarl", desc: "Decentralized allocation research" },
    ],
  },
];

export default function ConceptAEditorial() {
  return (
    <section className={styles.section} aria-labelledby="concept-a-title">
      <div className={styles.container}>
        {/* Left Column: Thesis & Architectural Stance */}
        <div className={styles.thesisCol}>
          <span className={styles.kicker}>CONCEPT A · EDITORIAL ARCHITECTURE</span>
          <h3 id="concept-a-title" className={styles.mainTitle}>
            State before decision.
            <br />
            <span>Proof before permission.</span>
          </h3>
          <p className={styles.thesisParagraph}>
            Every system in this portfolio operates on a hard invariant: hardware latches that remember faults, computer vision that demands active presence before running an identity metric, and graph pipelines that reject speculative topology.
          </p>
          <div className={styles.disciplineIndex}>
            <span className={styles.indexLabel}>DISCIPLINARY CORES</span>
            <ul className={styles.indexList}>
              <li>
                <span className={styles.indexNum}>01</span>
                <span>Hardware Logic &amp; Deterministic Interlocks</span>
              </li>
              <li>
                <span className={styles.indexNum}>02</span>
                <span>Computer Vision &amp; Liveness State Machines</span>
              </li>
              <li>
                <span className={styles.indexNum}>03</span>
                <span>Wireless Telemetry &amp; Structured Graph AI</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column: Three Stacked Architectural Records */}
        <div className={styles.recordsCol}>
          {domains.map((d) => (
            <article key={d.num} className={styles.recordItem}>
              <div className={styles.recordHeader}>
                <span className={styles.recordTag}>{d.tag}</span>
                <span className={styles.recordNum}>{d.num}</span>
              </div>

              <h4 className={styles.recordTitle}>{d.title}</h4>

              <div className={styles.invariantBlock}>
                <span className={styles.invariantLabel}>SYSTEM INVARIANT</span>
                <p className={styles.invariantText}>{d.invariant}</p>
              </div>

              <div className={styles.scopeRow}>
                <span className={styles.scopeLabel}>SCOPE</span>
                <p className={styles.scopeText}>{d.scope}</p>
              </div>

              <div className={styles.projectsRow}>
                {d.projects.map((p) => (
                  <Link key={p.name} href={p.href} className={styles.projectLink}>
                    <span className={styles.projectName}>{p.name}</span>
                    <span className={styles.projectDesc}>{p.desc}</span>
                    <ArrowUpRight size={14} className={styles.arrowIcon} />
                  </Link>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
