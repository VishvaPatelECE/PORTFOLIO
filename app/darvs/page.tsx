import { PageHeading } from "@/components/Shell";
import Link from "next/link";
import DarvsInstrument from "@/components/darvs/DarvsInstrument";
import { links } from "@/lib/content/site";
import ProjectCover from "@/components/ProjectCover";
export const metadata = { title: "DARVS — vision & identity" };
export default function Darvs() {
  return (
    <main id="main" className="wrap">
      <PageHeading
        code="SIGNATURE SYSTEM / COMPUTER VISION"
        title="DARVS"
        subtitle="A multi-stage authentication prototype. Explore how a camera input becomes a liveness challenge, an identity comparison and a decision."
      >
        <a
          className="text-link"
          href={links.darvs}
          target="_blank"
          rel="noreferrer"
        >
          PROJECT SOURCE ↗
        </a>
      </PageHeading>
      <ProjectCover kind="vision" />
      <DarvsInstrument />
      <Link className="text-link" href="/darvs/demo" style={{ marginTop: 28 }}>OPEN THE PIPELINE DIAGRAM &amp; EXAMPLE ↗</Link>
      <section className="technical-notes" id="engineering-notes">
        <div>
          <h2>
            Who is there?
            <br />
            Are they present?
          </h2>
        </div>
        <div className="prose">
          <p>
            These are different questions. Face detection locates an input.
            Liveness asks for a response. Embedding comparison supports identity
            matching. A state machine coordinates the conditions and timeouts.
          </p>
          <p>
            The local prototype uses Python, Flask, OpenCV, MTCNN and FaceNet.
            This portfolio explains that architecture through controlled
            examples; it does not capture biometric data or execute those
            models.
          </p>
          <details>
            <summary>Limits and open engineering work</summary>
            <p>
              The inspected source has an eye-state training/inference label
              discrepancy that needs resolution. No reproducible security or
              performance benchmark is presented here. Similarity thresholds are
              settings, not accuracy claims. The local backend needs separate
              hardening before public deployment.
            </p>
          </details>
        </div>
      </section>
    </main>
  );
}
