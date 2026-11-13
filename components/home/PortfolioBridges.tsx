import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import styles from "./PortfolioBridges.module.css";

const systemDomains = [
  {
    code: "DOMAIN 01",
    title: "Hardware & Digital Logic",
    subtitle: "Deterministic access control & state-driven timing",
    contract: "SENSORS ── TAMPER LATCH ── TIMING INTERLOCK ── ACTUATOR",
    focus: "Proteus simulation · Logic state latches · ESP32 & discrete counting",
    systems: [
      { name: "USMHACS", href: "/usmhacs" },
      { name: "Hardware Stopwatch", href: "/about#hardware-stopwatch" },
    ],
  },
  {
    code: "DOMAIN 02",
    title: "Perception & Biometrics",
    subtitle: "Liveness verification before identity authentication",
    contract: "OPTICAL CAPTURE ── 3D CHALLENGE ── EMBEDDING ── MATCH",
    focus: "OpenCV · FaceNet embeddings · Liveness state machine · Challenge bounds",
    systems: [
      { name: "DARVS", href: "/darvs" },
      { name: "Liveness Demo", href: "/darvs/demo" },
    ],
  },
  {
    code: "DOMAIN 03",
    title: "Wireless Systems & Graph AI",
    subtitle: "Explicit data representations for heterogeneous networks",
    contract: "RAW TELEMETRY ── CANONICAL IR ── TYPED GRAPH ── VALIDATION",
    focus: "Heterogeneous RAN telemetry · SUMO mobility · Decentralized RL allocation",
    systems: [
      { name: "RANGraph", href: "/rangraph" },
      { name: "GraphMARL", href: "/graphmarl" },
    ],
  },
];

export function PortfolioInterests() {
  return (
    <section className={`${styles.matrixSection} wrap`} aria-labelledby="matrix-title">
      <header className={styles.matrixHeader}>
        <span className={styles.matrixEyebrow}>SYSTEMS &amp; DOMAINS · DISCIPLINARY CONTRACTS</span>
        <h2 id="matrix-title">
          Systems architecture<span>.</span>
        </h2>
        <p className={styles.matrixLead}>
          Every project connects physical inputs with verified decisions: a tamper condition before an interlock, a liveness challenge before an identity match, or declared semantics before a graph is compiled.
        </p>
      </header>

      <div className={styles.matrixGrid}>
        {systemDomains.map((domain) => (
          <article key={domain.code} className={styles.domainCard}>
            <div className={styles.cardHeader}>
              <span className={styles.domainCode}>{domain.code}</span>
              <div className={styles.cardCorner} aria-hidden="true" />
            </div>

            <h3 className={styles.domainTitle}>{domain.title}</h3>
            <p className={styles.domainSubtitle}>{domain.subtitle}</p>

            <div className={styles.contractBox}>
              <span className={styles.contractLabel}>PIPELINE CONTRACT</span>
              <p className={styles.contractFlow}>{domain.contract}</p>
            </div>

            <div className={styles.focusBox}>
              <span className={styles.focusLabel}>VERIFIED FOCUS</span>
              <p className={styles.focusText}>{domain.focus}</p>
            </div>

            <div className={styles.cardFooter}>
              <span className={styles.systemsLabel}>IMPLEMENTATIONS</span>
              <div className={styles.systemLinks}>
                {domain.systems.map((sys) => (
                  <Link key={sys.name} href={sys.href} className={styles.systemLink}>
                    <span>{sys.name}</span>
                    <ArrowUpRight size={13} />
                  </Link>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function EngineeringNotes() {
  return (
    <section className={`${styles.notes} wrap`} aria-labelledby="notes-title">
      <header className={styles.notesHeader}>
        <span className={styles.matrixEyebrow}>RESEARCH RATIONALE · IMPLEMENTATION BOUNDARIES</span>
        <h2 id="notes-title">
          Inside the work<span>.</span>
        </h2>
      </header>
      <div className={styles.notesGrid}>
        <Link href="/rangraph#engineering-notes" className={styles.noteItem} prefetch={false}>
          <div>
            <span className={styles.noteCode}>RANGRAPH</span>
            <h4>Every edge needs a reason to exist.</h4>
            <p>Explicit source associations over spatial guessing.</p>
          </div>
          <ArrowUpRight size={20} className={styles.noteArrow} />
        </Link>
        <Link href="/darvs#engineering-notes" className={styles.noteItem} prefetch={false}>
          <div>
            <span className={styles.noteCode}>DARVS</span>
            <h4>Identity and presence are separate questions.</h4>
            <p>Active challenge response before embedding comparison.</p>
          </div>
          <ArrowUpRight size={20} className={styles.noteArrow} />
        </Link>
        <Link href="/usmhacs#engineering-notes" className={styles.noteItem} prefetch={false}>
          <div>
            <span className={styles.noteCode}>USMHACS</span>
            <h4>A fault remembered is a fault contained.</h4>
            <p>Persistent state latch requires conditions cleared first.</p>
          </div>
          <ArrowUpRight size={20} className={styles.noteArrow} />
        </Link>
      </div>
    </section>
  );
}
