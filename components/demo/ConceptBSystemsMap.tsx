import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import styles from "./ConceptBSystemsMap.module.css";

const layers = [
  {
    phase: "PHASE 01 · PHYSICAL LAYER",
    title: "Deterministic Logic & Latches",
    system: "USMHACS",
    href: "/usmhacs",
    input: "Sensors, Key, Tamper lines",
    gate: "SR latch locks on fault. Unsafe inputs prevent reset.",
    output: "Validated actuator release",
  },
  {
    phase: "PHASE 02 · PERCEPTION LAYER",
    title: "Active Challenge & Identity",
    system: "DARVS",
    href: "/darvs",
    input: "Monocular camera feed",
    gate: "3D pose response verified before embedding distance.",
    output: "Authenticated identity token",
  },
  {
    phase: "PHASE 03 · NETWORK GRAPH LAYER",
    title: "Structured IR & Decentralized RL",
    system: "RANGraph + GraphMARL",
    href: "/rangraph",
    input: "O-RAN E2 telemetry / SUMO vehicles",
    gate: "Explicit telemetry relationships; zero spatial guessing.",
    output: "Typed graph & decentralized policy",
  },
];

const crossCuttingInvariants = [
  {
    domain: "Hardware Control",
    code: "USMHACS",
    rule: "Fault latched until physical sensors cleared",
    target: "Solenoid Interlock",
  },
  {
    domain: "Computer Vision",
    code: "DARVS",
    rule: "Active liveness challenge response required",
    target: "FaceNet Match",
  },
  {
    domain: "Wireless Representation",
    code: "RANGRAPH",
    rule: "Explicit source references over proximity guessing",
    target: "Canonical Graph IR",
  },
  {
    domain: "Multi-Agent Mobility",
    code: "GRAPHMARL",
    rule: "SUMO mobility constraints before policy allocation",
    target: "Decentralized RL",
  },
];

export default function ConceptBSystemsMap() {
  return (
    <section className={styles.section} aria-labelledby="concept-b-title">
      <div className={styles.container}>
        <header className={styles.header}>
          <span className={styles.kicker}>CONCEPT B · SYSTEMS TOPOLOGY MAP</span>
          <h3 id="concept-b-title" className={styles.title}>
            Systems pipeline &amp; invariant matrix<span>.</span>
          </h3>
          <p className={styles.subtitle}>
            A horizontal topology connecting deterministic physical hardware, active biometric verification, and structured graph intelligence.
          </p>
        </header>

        {/* 3-Phase Architectural Continuum */}
        <div className={styles.flowStages}>
          {layers.map((layer, idx) => (
            <div key={layer.phase} className={styles.stageCard}>
              <div className={styles.stageTop}>
                <span className={styles.phaseTag}>{layer.phase}</span>
                <Link href={layer.href} className={styles.systemTag}>
                  <span>{layer.system}</span>
                  <ArrowUpRight size={13} />
                </Link>
              </div>

              <h4 className={styles.stageTitle}>{layer.title}</h4>

              <div className={styles.stageSpec}>
                <div className={styles.specRow}>
                  <span className={styles.specKey}>INPUT</span>
                  <span className={styles.specVal}>{layer.input}</span>
                </div>
                <div className={styles.specRow}>
                  <span className={styles.specKey}>GATE</span>
                  <span className={styles.specVal}>{layer.gate}</span>
                </div>
                <div className={styles.specRow}>
                  <span className={styles.specKey}>OUTPUT</span>
                  <span className={styles.specVal}>{layer.output}</span>
                </div>
              </div>

              {idx < layers.length - 1 && (
                <div className={styles.flowConnector} aria-hidden="true">
                  <span>TRANSITION</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Invariant Matrix Table */}
        <div className={styles.matrixWrapper}>
          <div className={styles.matrixHeading}>
            <span className={styles.matrixKicker}>VERIFIED COMPUTATIONAL BOUNDARIES</span>
            <h4>System Invariant Matrix</h4>
          </div>

          <div className={styles.tableResponsive}>
            <table className={styles.matrixTable}>
              <thead>
                <tr>
                  <th scope="col">Domain</th>
                  <th scope="col">System</th>
                  <th scope="col">Enforced Invariant</th>
                  <th scope="col">Validated Decision</th>
                </tr>
              </thead>
              <tbody>
                {crossCuttingInvariants.map((inv) => (
                  <tr key={inv.code}>
                    <td className={styles.tdDomain}>{inv.domain}</td>
                    <td className={styles.tdCode}>{inv.code}</td>
                    <td className={styles.tdRule}>{inv.rule}</td>
                    <td className={styles.tdTarget}>{inv.target}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
