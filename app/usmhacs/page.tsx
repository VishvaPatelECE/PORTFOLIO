import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import ProjectHero from "@/components/ProjectHero";
import USMHACSPanel from "@/components/usmhacs/USMHACSPanel";
import {
  breadcrumbJsonLd,
  buildPageMetadata,
  projectJsonLd,
  serializeJsonLd,
} from "@/lib/seo/site";

const USMHACS_DESCRIPTION =
  "Ultra-Secure Multi-Layer Hardware Access Control System. Microcontroller-free physical security with deterministic fault latching and protected reset.";

export const metadata: Metadata = buildPageMetadata({
  title: "USMHACS — Microcontroller-Free Hardware Access Control System",
  description: USMHACS_DESCRIPTION,
  path: "/usmhacs",
  keywords: [
    "USMHACS",
    "Hardware Access Control",
    "Discrete Logic",
    "Fault Latching",
    "Digital Security",
  ],
});

export default function Hardware() {
  return (
    <main id="main" className="project-page-main">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd([
            projectJsonLd({
              name: "USMHACS",
              description: USMHACS_DESCRIPTION,
              path: "/usmhacs",
              type: "CreativeWork",
              keywords: [
                "Microcontroller-Free",
                "Persistent Fault Latch",
                "Protected Dual-Key Reset",
                "Discrete Logic",
                "Hardware Access Control",
              ],
            }),
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Projects", path: "/#projects" },
              { name: "USMHACS", path: "/usmhacs" },
            ]),
          ]),
        }}
      />
      <ProjectHero
        id="usmhacs"
        title="USMHACS"
        subtitle="Ultra-Secure Multi-Layer Hardware Access Control System. Microcontroller-free physical security with deterministic fault latching and protected reset."
        kind="hardware"
        tags={["Microcontroller-Free", "Persistent Fault Latch", "Protected Dual-Key Reset", "Discrete Logic"]}
        actionLink={{ href: "/#projects", label: "← ALL PROJECTS" }}
      />

      {/* Dedicated Viewport Simulator Stage ("One scroll thing like the projects section") */}
      <section
        id="simulator"
        className="min-h-screen py-6 sm:py-10 flex flex-col justify-center items-center relative isolation-isolate scroll-mt-0"
        aria-label="Interactive USMHACS Hardware Security Simulator"
      >
        <div className="wrap w-full">
          <USMHACSPanel />
        </div>
      </section>

      {/* Editorial Hardware Case Study & Architecture Specifications */}
      <div className="wrap">
        {/* Core Hardware Security Thesis */}
        <section className="editorial-thesis" aria-labelledby="hardware-thesis-title">
          <div className="editorial-thesis-meta">
            <span className="mono-kicker" style={{ color: "var(--gold)" }}>SECURITY THESIS</span>
            <div className="editorial-thesis-tags">
              <span className="editorial-tag-item">Zero-Firmware Attack Surface</span>
              <span className="editorial-tag-item">Bistable SR Fault Memory</span>
              <span className="editorial-tag-item">Deterministic Propagation</span>
              <span className="editorial-tag-item">Proteus Logic Provenance</span>
            </div>
          </div>
          <div className="editorial-thesis-body">
            <h2 id="hardware-thesis-title">
              A fault remembered
              <br />
              is a fault contained.
            </h2>
            <p>
              Unsafe environmental conditions, an incorrect access code, or casing tamper immediately
              assert a persistent hardware latch. Correcting or removing the physical input alone does
              not release the interlock; the fault remains physically held in silicon until an authorized,
              key-protected reset sequence is executed with all monitoring loops verified safe.
            </p>
            <p>
              Modern physical security architectures frequently rely on microcontrollers running software
              control loops—introducing firmware extractability, boot-time race conditions, and unverified
              memory corruption vectors. USMHACS explores a pure hardware-enforced paradigm where authorization
              is evaluated exclusively through discrete decoders, shift registers, and bistable SR latches,
              guaranteeing deterministic, nanosecond-scale state transitions without an operating system.
            </p>
          </div>
        </section>

        {/* Discrete Logic Execution Bus */}
        <section className="editorial-grid" aria-labelledby="logic-pipeline-title">
          <div className="editorial-sidebar">
            <span className="mono" style={{ color: "var(--gold)" }}>LOGIC PIPELINE</span>
            <h3 id="logic-pipeline-title">Deterministic Signal Cascade</h3>
            <p>
              Seven discrete hardware verification stages that must simultaneously assert valid logic
              high before solenoid relay actuation is authorized.
            </p>
          </div>
          <div className="editorial-content">
            <div className="hardware-bus-stream">
              <div className="hardware-bus-node">
                <span className="hardware-bus-tag">01 · SENSORS</span>
                <div className="hardware-bus-info">
                  <span className="hardware-bus-name">Environmental Comparator Bus</span>
                  <span className="hardware-bus-desc">Four-channel analog threshold monitoring (magnetic reed, thermal limit, pressure switch, optical laser barrier).</span>
                </div>
                <span className="hardware-bus-status">ACTIVE-LOW FAULT</span>
              </div>

              <div className="hardware-bus-node">
                <span className="hardware-bus-tag">02 · KEY</span>
                <div className="hardware-bus-info">
                  <span className="hardware-bus-name">Physical Cylinder Switch</span>
                  <span className="hardware-bus-desc">High-security mechanical cylinder interlock providing master bus DC supply excitation.</span>
                </div>
                <span className="hardware-bus-status">HARDWARE GATE</span>
              </div>

              <div className="hardware-bus-node">
                <span className="hardware-bus-tag">03 · CODE</span>
                <div className="hardware-bus-info">
                  <span className="hardware-bus-name">4-Bit Keypad BCD Decoder</span>
                  <span className="hardware-bus-desc">Clocked shift register sequence validation against hardwired BCD comparator matrix.</span>
                </div>
                <span className="hardware-bus-status">SEQUENCE CHECK</span>
              </div>

              <div className="hardware-bus-node">
                <span className="hardware-bus-tag">04 · DELAY</span>
                <div className="hardware-bus-info">
                  <span className="hardware-bus-name">RC Timing Rate Limiter</span>
                  <span className="hardware-bus-desc">Asymmetric 5-second resistor-capacitor charge curve physically throttling automated brute-force attempts.</span>
                </div>
                <span className="hardware-bus-status">5.0s RC DELAY</span>
              </div>

              <div className="hardware-bus-node">
                <span className="hardware-bus-tag">05 · TAMPER</span>
                <div className="hardware-bus-info">
                  <span className="hardware-bus-name">Chassis Microswitch Loop</span>
                  <span className="hardware-bus-desc">Normally-closed enclosure perimeter loop wired directly to bistable latch set lines.</span>
                </div>
                <span className="hardware-bus-status">INSTANT TRIP</span>
              </div>

              <div className="hardware-bus-node">
                <span className="hardware-bus-tag">06 · AND GATE</span>
                <div className="hardware-bus-info">
                  <span className="hardware-bus-name">Master Combinatorial Evaluator</span>
                  <span className="hardware-bus-desc">High-speed multi-input discrete gate enforcing the joint truth table: Key ∧ Delay ∧ ¬Tamper ∧ ¬Latch.</span>
                </div>
                <span className="hardware-bus-status">DECISION GATE</span>
              </div>

              <div className="hardware-bus-node">
                <span className="hardware-bus-tag">07 · RELAY</span>
                <div className="hardware-bus-info">
                  <span className="hardware-bus-name">Solenoid Deadbolt Strike</span>
                  <span className="hardware-bus-desc">Power driver circuit energizing electromechanical lock strike only while authorization remains continuously high.</span>
                </div>
                <span className="hardware-bus-status">ACTUATION</span>
              </div>
            </div>

            <p style={{ fontSize: "14.5px", lineHeight: 1.7, color: "var(--muted)", margin: 0 }}>
              Access is granted only when every independent gate verifies an uncompromised hardware condition.
              Any transient drop in authorization drops the solenoid relay within single-digit milliseconds.
            </p>
          </div>
        </section>

        {/* Threat Model & Hardware Interlock Matrix */}
        <section className="editorial-grid" aria-labelledby="threat-model-title">
          <div className="editorial-sidebar">
            <span className="mono" style={{ color: "var(--gold)" }}>THREAT MODEL</span>
            <h3 id="threat-model-title">Deterministic Fault Matrix</h3>
            <p>
              Hardware-level attack containment verified through discrete Proteus circuit simulation.
            </p>
          </div>
          <div className="editorial-content">
            <div className="spec-table-wrap">
              <table className="spec-table">
                <thead>
                  <tr>
                    <th>Attack Vector</th>
                    <th>Hardware Interlock</th>
                    <th>System Response</th>
                    <th>Latched State</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Brute Force Enumeration</td>
                    <td>5s RC Delay + Shift Lockout</td>
                    <td>Input bus grounded; lockout buzzer triggered</td>
                    <td className="highlight" style={{ color: "#ff5a5f" }}>LATCHED FAULT</td>
                  </tr>
                  <tr>
                    <td>Environmental Sensor Breach</td>
                    <td>Analog Comparator Bus</td>
                    <td>Instant bistable latch trip; path blocked</td>
                    <td className="highlight" style={{ color: "#ff5a5f" }}>LATCHED FAULT</td>
                  </tr>
                  <tr>
                    <td>Casing Tamper / Enclosure Probe</td>
                    <td>Chassis Microswitch Loop</td>
                    <td>Solenoid power severed immediately</td>
                    <td className="highlight" style={{ color: "#ff5a5f" }}>LATCHED FAULT</td>
                  </tr>
                  <tr>
                    <td>False Recovery Attempt</td>
                    <td>Asynchronous Reset Inhibit</td>
                    <td>Reset pulse blocked until sensors report safe</td>
                    <td className="highlight" style={{ color: "#ff5a5f" }}>INHIBITED</td>
                  </tr>
                  <tr>
                    <td>Authorized Credential Entry</td>
                    <td>All 7 Interlocks Satisfied + Key</td>
                    <td>Solenoid energized; deadbolt released</td>
                    <td className="highlight" style={{ color: "var(--gold)" }}>AUTHORIZED</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Engineering Decisions & Design Trade-offs */}
        <section className="editorial-grid" aria-labelledby="decisions-title">
          <div className="editorial-sidebar">
            <span className="mono" style={{ color: "var(--gold)" }}>SYSTEM ARCHITECTURE</span>
            <h3 id="decisions-title">Engineering Decisions</h3>
            <p>
              Deliberate architectural choices prioritizing deterministic fail-safe behavior over software convenience.
            </p>
          </div>
          <div className="editorial-content">
            <div className="editorial-block">
              <h4>1. Elimination of Software Attack Surface</h4>
              <p>
                Eliminating the microcontroller entirely removes firmware exploits, buffer overflows,
                JTAG injection ports, and memory corruption attacks. The access logic is physically hardwired
                in copper and silicon, meaning the system cannot be remotely re-flashed or altered by code injection.
              </p>
            </div>

            <div className="editorial-block">
              <h4>2. Persistent Bistable SR Memory</h4>
              <p>
                Transient alarms that automatically reset once an intruder retreats create dangerous blind spots.
                By implementing cross-coupled SR latches, fault conditions are held in stable silicon memory.
                Even if sensor signals return to nominal, the latch preserves the fault until an authorized keyholder
                performs a protected reset.
              </p>
            </div>

            <div className="editorial-block">
              <h4>3. Physical RC Delay as a Rate Limiter</h4>
              <p>
                Software-based delay loops can often be defeated by clock manipulation or power glitching.
                USMHACS enforces a physical 5-second delay through an analog resistor-capacitor (RC) charging curve.
                Password enumeration speed is constrained by the immutable physics of capacitor charge accumulation.
              </p>
            </div>

            <div className="editorial-block">
              <h4>4. Pure Combinatorial Determinism</h4>
              <p>
                Discrete logic gates operate with predictable propagation delays in the nanosecond range.
                The master authorization equation leaves zero room for unhandled exception states, thread contention,
                or operating system deadlocks.
              </p>
            </div>
          </div>
        </section>

        {/* Implementation Scope & Simulation Provenance */}
        <section className="editorial-grid" aria-labelledby="scope-title">
          <div className="editorial-sidebar">
            <span className="mono" style={{ color: "var(--gold)" }}>RESEARCH PROVENANCE</span>
            <h3 id="scope-title">Model Scope &amp; Provenance</h3>
            <p>
              Clarifying the experimental boundary between CAD logic simulation and browser behavioral modeling.
            </p>
          </div>
          <div className="editorial-content">
            <div className="limitation-callout">
              <div className="limitation-callout-header">
                <span className="kicker">DESIGN PROVENANCE &amp; SIMULATION BOUNDS</span>
                <span className="badge" style={{ borderColor: "rgba(185, 157, 115, 0.4)", color: "var(--gold)" }}>
                  PROTEUS VSM CAD
                </span>
              </div>
              <div className="limitation-callout-body">
                <p>
                  <strong>Design Provenance:</strong> The underlying USMHACS architecture was designed and simulated
                  in Proteus CAD using discrete TTL/CMOS logic blocks (decoders, BCD counters, SR flip-flops,
                  and analog RC networks).
                </p>
                <p style={{ marginTop: "12px" }}>
                  <strong>Browser Model Abstraction:</strong> The interactive simulator on this page demonstrates
                  the state-machine behavior using Boolean sensor states and a 3-state code abstraction. It is engineered
                  as an architectural visualization of hardware fault-latching principles, not a transistor-level
                  SPICE analog model or physical security certification.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Inspection Footer */}
        <footer className="inspection-footer">
          <div className="inspection-footer-left">
            <span className="kicker">SYSTEM PORTFOLIO</span>
            <span className="mono" style={{ fontSize: "14px", color: "var(--text)" }}>USMHACS · Hardware Access Control</span>
          </div>
          <div style={{ display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap" }}>
            <Link href="/#projects" className="navLink" data-theme="gold" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <span>← ALL PROJECTS</span>
            </Link>
            <Link href="/rangraph" className="navLink" data-theme="cyan" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <span>RANGRAPH</span>
              <ArrowUpRight size={13} aria-hidden="true" />
            </Link>
            <Link href="/graphmarl" className="navLink" data-theme="gold" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <span>GRAPHMARL</span>
              <ArrowUpRight size={13} aria-hidden="true" />
            </Link>
            <Link href="/darvs" className="navLink" data-theme="cyan" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <span>DARVS</span>
              <ArrowUpRight size={13} aria-hidden="true" />
            </Link>
          </div>
        </footer>
      </div>
    </main>
  );
}
