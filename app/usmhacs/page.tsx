import { PageHeading } from "@/components/Shell";
import USMHACSPanel from "@/components/usmhacs/USMHACSPanel";
import ProjectCover from "@/components/ProjectCover";
export const metadata = { title: "USMHACS — hardware access logic" };
export default function Hardware() {
  return (
    <main id="main" className="wrap">
      <PageHeading
        code="SIGNATURE SYSTEM / DIGITAL LOGIC"
        title="USMHACS"
        subtitle="Ultra-Secure Multi-Layer Hardware Access Control System. A hardware concept, made inspectable through an interactive logic simulation."
      />
      <ProjectCover kind="hardware" />
      <USMHACSPanel />
      <section className="technical-notes" id="engineering-notes">
        <div>
          <h2>
            A fault remembered
            <br />
            is a fault contained.
          </h2>
        </div>
        <div className="prose">
          <p>
            Unsafe sensors, a wrong code or casing tamper set a persistent
            latch. Correcting the input alone does not release it. Protected
            reset requires the unsafe conditions to be cleared first.
          </p>
          <p>
            The original project explores hardware-only control with decoders,
            counters and SR latches, simulated in Proteus. This browser model
            uses Boolean sensor inputs and a three-state code abstraction; it is
            not a transistor-level circuit or a physical security validation.
          </p>
          <details>
            <summary>What the simulator represents</summary>
            <p>
              Correct code starts a five-second delay. A key, completed delay,
              cleared tamper and released latch allow the door to open. “Brute
              force” demonstrates wrong-code lockout; this model does not
              implement an attempt counter. Restart resets the demonstration,
              while Protected Reset preserves the current inputs. This page
              uses the original V1 diagram, scenario controls, alarm and console.
            </p>
          </details>
        </div>
      </section>
    </main>
  );
}
