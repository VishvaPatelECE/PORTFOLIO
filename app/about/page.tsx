import type { Metadata } from "next";
import { PageHeading } from "@/components/Shell";
import { links } from "@/lib/content/site";
import { ArrowUpRight } from "lucide-react";
export const metadata: Metadata = { title: "About Vishva" };
export default function About() {
  return (
    <main id="main" className="wrap">
      <PageHeading
        code="ENGINEER / BACKGROUND"
        title="A systems mindset."
        subtitle="I’m Vishva Patel, an Electronics & Communication Engineering student working across hardware, computer vision and wireless data systems."
      />
      <section className="about-layout">
        <div className="about-monogram" aria-hidden="true">
          VP<span>HARDWARE ↔ INTELLIGENCE</span>
        </div>
        <div className="prose">
          <h2>
            Understand the system.
            <br />
            Then build it.
          </h2>
          <p>
            My work connects physical inputs with deliberate decisions: a
            liveness challenge before an identity match, an interlock before a
            door opens, or an explicit data contract before a graph is built.
          </p>
          <p>
            I’m interested in embedded systems, computer vision, secure
            intelligent systems and wireless communication. This portfolio shows
            implementations, simulations and research prototypes with their
            boundaries intact.
          </p>
          <a
            className="button"
            href={links.cv}
            target="_blank"
            rel="noreferrer"
          >
            READ THE CV <ArrowUpRight size={17} />
          </a>
        </div>
      </section>
      <section className="education-grid">
        <h2>
          Education &<br />
          practice.
        </h2>
        <div>
          <dl className="fact-list">
            <div>
              <dt>EDUCATION</dt>
              <dd>B.Tech, Electronics & Communication Engineering</dd>
            </div>
            <div>
              <dt>INSTITUTION</dt>
              <dd>Dharmsinh Desai University, India</dd>
            </div>
            <div>
              <dt>EXPECTED GRADUATION</dt>
              <dd>2027</dd>
            </div>
            <div>
              <dt>ACADEMIC SNAPSHOT</dt>
              <dd>
                9.13 / 10 CGPA <span className="muted">through Semester 5</span>
              </dd>
            </div>
          </dl>
          <p className="small muted">
            Academic information reflects the supplied CV, rather than an
            automatically updated record.
          </p>
        </div>
      </section>
      <section className="practice-grid">
        <div>
          <h3>Hardware & embedded</h3>
          <p>
            ESP32, Arduino, Raspberry Pi, sensor integration, digital logic,
            I²C, UART and SPI.
          </p>
        </div>
        <div>
          <h3>Software & perception</h3>
          <p>
            Python, C/C++, computer vision, biometric matching and state-driven
            system design.
          </p>
        </div>
        <div>
          <h3>Simulation & research</h3>
          <p>
            Proteus, system verification, explicit data semantics and wireless
            representation.
          </p>
        </div>
      </section>
      <section className="workbench-explanations" aria-label="Additional projects">
        <article id="robo-car"><h2>Autonomous Robo Car</h2><p>An embedded ESP32 platform for line following, obstacle avoidance and Bluetooth control.</p></article>
        <article id="hardware-stopwatch"><h2>Hardware Stopwatch</h2><p>Digital logic using discrete timing and counting ICs to drive a seven-segment display.</p></article>
      </section>
    </main>
  );
}
