import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import ProjectHero from "@/components/ProjectHero";
import DarvsInstrument from "@/components/darvs/DarvsInstrument";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { links } from "@/lib/content/site";
import {
  breadcrumbJsonLd,
  buildPageMetadata,
  projectJsonLd,
  serializeJsonLd,
} from "@/lib/seo/site";

const DARVS_DESCRIPTION =
  "A computer-vision identity-verification prototype using MTCNN, 2D movement challenges, a blink CNN with an unresolved runtime polarity issue, and FaceNet embeddings.";

export const metadata: Metadata = buildPageMetadata({
  title: "DARVS — Identity Verification & Challenge-Response Prototype",
  description: DARVS_DESCRIPTION,
  path: "/darvs",
  keywords: ["DARVS", "MTCNN", "FaceNet", "Biometric Liveness", "Computer Vision"],
});

export default function Darvs() {
  return (
    <main id="main" className="project-page-main">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd([
            projectJsonLd({
              name: "DARVS",
              description: DARVS_DESCRIPTION,
              path: "/darvs",
              keywords: ["Interactive Liveness", "MTCNN", "FaceNet 512-D", "Eye-State CNN"],
              codeRepository: links.darvs,
              programmingLanguage: ["Python"],
            }),
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Projects", path: "/#projects" },
              { name: "DARVS", path: "/darvs" },
            ]),
          ]),
        }}
      />
      <ProjectHero
        id="darvs"
        title="DARVS"
        subtitle="An identity-verification prototype separating 2D movement/blink challenges from biometric matching, with an unresolved blink runtime limitation."
        kind="vision"
        tags={["Interactive Liveness", "MTCNN Face Tracking", "FaceNet 512-D", "Custom Eye-State CNN"]}
        actionLink={{ href: links.darvs, label: "PROJECT SOURCE ↗", isExternal: true }}
      />

      <div className="wrap">
        {/* 1. Problem Statement / Tension */}
        <section className="editorial-thesis" aria-labelledby="darvs-thesis-title">
          <div className="editorial-thesis-meta">
            <span className="mono-kicker">THE PROBLEM · BIOMETRIC SPOOFING</span>
            <div className="editorial-thesis-tags">
              <span className="editorial-tag-item">Presentation / Spoof Attacks</span>
              <span className="editorial-tag-item">Identity vs. Physical Presence</span>
              <span className="editorial-tag-item">Challenge-Response State Machine</span>
              <span className="editorial-tag-item">Custom 84K Eye-State CNN</span>
            </div>
          </div>
          <div className="editorial-thesis-body">
            <h2 id="darvs-thesis-title">
              Who is there? Are they physically present?
              <br />
              These are two fundamentally different questions.
            </h2>
            <p>
              Identity matching alone does not establish liveness. A camera captures a frame,
              isolates a face, extracts an embedding such as FaceNet, and compares it with an
              enrolled reference. A high similarity score describes an identity match, not whether
              the presentation is a live person.
            </p>
            <p>
              Printed photographs, screen presentations and replayed video can provide facial features
              that an identity matcher alone does not establish as live. DARVS explores a separate
              challenge-response gate before identity extraction using 2D movement measurements and an
              eye-state CNN. This is a prototype, not a solved spoofing defense; the blink-model runtime
              interpretation has a serious unresolved polarity issue.
            </p>
          </div>
        </section>

        {/* Interactive Browser Demonstration of Multi-Stage Pipeline */}
        <DarvsInstrument />

        <div style={{ margin: "24px 0 48px" }}>
          <TrackedLink
            className="text-link"
            href="/darvs/demo"
            eventName="darvs_demo_open"
            eventParams={{ source_surface: "darvs_page_inline" }}
          >
            OPEN THE PIPELINE DIAGRAM &amp; INTERACTIVE DEMO ↗
          </TrackedLink>
        </div>

        {/* 2. The Insight */}
        <section className="editorial-grid" aria-labelledby="darvs-insight-title">
          <div className="editorial-sidebar">
            <span className="mono signal">THE INSIGHT</span>
            <h3 id="darvs-insight-title">Decoupling Presence from Recognition</h3>
            <p>
              Enforcing an unpredictable physical challenge-response sequence before initiating biometric matching.
            </p>
          </div>
          <div className="editorial-content">
            <div className="editorial-block">
              <h4>Challenge before identity</h4>
              <p>
                Rather than infer liveness from identity similarity alone, DARVS gates recognition on
                three randomized movement or blink prompts. Movement responses use 2D geometry, not
                measured depth; a completed challenge state does not independently prove physical presence.
              </p>
              <p>
                Moving a printed image or screen can change the same 2D measurements. Blink is not
                mandatory in every sequence, and its runtime interpretation remains unresolved. These
                constraints limit what the challenge-response mechanism establishes.
              </p>
            </div>
          </div>
        </section>

        {/* 3. System Architecture & How It Works */}
        <section className="editorial-grid" aria-labelledby="darvs-pipeline-title">
          <div className="editorial-sidebar">
            <span className="mono signal">HOW IT WORKS</span>
            <h3 id="darvs-pipeline-title">Four-Stage Decoupled Pipeline</h3>
            <p>
              Coordinating real-time computer vision, interactive state-machine logic, and embedded CNN inference.
            </p>
          </div>
          <div className="editorial-content">
            <div className="editorial-block">
              <h4>Stage 1: Video Acquisition &amp; Real-Time MTCNN Tracking</h4>
              <p>
                The incoming webcam stream is captured via OpenCV at 640 &times; 480 resolution and
                downsampled to 320 &times; 240. A Multi-Task Cascaded Convolutional Network (MTCNN) detects
                the primary facial bounding box and extracts five facial landmark coordinates (left eye,
                right eye, nose, mouth corners) on the half-resolution frame. This establishes the
                geometry used by subsequent challenges; no reproducible per-frame timing is reported.
              </p>
            </div>

            <div className="editorial-block">
              <h4>Stage 2: Randomized Challenge-Response State Machine</h4>
              <p>
                The runtime samples three prompts without replacement from <code>HEAD LEFT</code>,
                <code>HEAD RIGHT</code>, <code>HEAD UP</code>, <code>HEAD DOWN</code> and <code>BLINK</code>.
                Blink occurs in 60% of possible sequences and is absent in 40%; an independent
                2,000-trial sampling check observed 60.3% (1,206/2,000).
              </p>
              <ul>
                <li>
                  <strong>2D Geometric Thresholds:</strong> Horizontal face-center displacement uses <code>shift_ratio = 0.07</code> relative to frame width; vertical nose displacement uses <code>tilt_ratio = 0.05</code> relative to baseline face height. These are not 3D depth estimates.
                </li>
                <li>
                  <strong>Temporal Persistence:</strong> Two consecutive compliant movement frames are required. A 2D translation can satisfy these measurements; persistence is not proof of a live person.
                </li>
                <li>
                  <strong>Configured Timeout:</strong> A 6-second per-step timeout resets the challenge; three repeated timeouts trigger the code&apos;s spoof flag. This is a configured state-machine rule, not a measured session duration or confirmed attack classification.
                </li>
              </ul>
            </div>

            <div className="editorial-block">
              <h4>Stage 3: Custom 2-Layer CNN Eye-Blink Classifier</h4>
              <p>
                When a blink challenge is issued, the system crops 24 &times; 24 grayscale eye patches from
                the localized eye landmarks and feeds them into a custom convolutional neural network
                (<code>eye_model.h5</code>, 84,481 parameters). The temporal code requires two
                classified-closed frames followed by two frames with an open-eye interpretation.
                However, training labels are <strong>Open = 0, Closed = 1</strong>, while runtime
                treats <strong>model output &gt; 0.85 as open</strong>. This reverses the output
                polarity and remains unresolved; the code sequence is not validated live-blink evidence.
              </p>
            </div>

            <div className="editorial-block">
              <h4>Stage 4: 512-D FaceNet Embeddings &amp; Decision Smoothing</h4>
              <p>
                Only after all three liveness challenges pass does the system invoke Keras-FaceNet.
                FaceNet extracts a 512-dimensional L2-normalized embedding vector and compares it with
                enrolled embeddings in <code>encodings.pkl</code>; SQLite stores enrollment metadata.
                Recognition is sampled every seventh camera frame. A rolling average of up to the latest
                three sampled similarity scores is compared with threshold 78 on the cosine × 100 scale
                (0.78 cosine), not a measured accuracy percentage or three-consecutive-match requirement.
                Events are written to a local CSV with optional asynchronous Google Sheets logging.
              </p>
            </div>
          </div>
        </section>

        {/* 4. Engineering Decisions & Practical Trade-Offs */}
        <section className="editorial-grid" aria-labelledby="darvs-decisions-title">
          <div className="editorial-sidebar">
            <span className="mono signal">ENGINEERING DECISIONS</span>
            <h3 id="darvs-decisions-title">Workload &amp; Decision Trade-Offs</h3>
            <p>
              Downsampling, deferred extraction and sampled score averaging are source-level design choices,
              not measured performance improvements.
            </p>
          </div>
          <div className="editorial-content">
            <div className="editorial-block">
              <h4>Half-resolution downsampling</h4>
              <p>
                The camera requests 640 × 480 frames; MTCNN processes half-resolution 320 × 240
                input. This reduces the input size, but no reproducible hardware-specific inference
                or end-to-end session benchmark is available.
              </p>
            </div>

            <div className="editorial-block">
              <h4>Inference subsampling and deferred embedding extraction</h4>
              <p>
                Deferring FaceNet extraction until the challenge state completes avoids running identity
                comparison during movement prompts. Recognition then runs every seventh camera frame.
                These are source-level workload choices, not measured CPU, thermal or latency improvements.
              </p>
            </div>

            <div className="editorial-block">
              <h4>Rolling average buffer on similarity scores</h4>
              <p>
                The recognizer averages up to the latest three sampled cosine-similarity scores.
                This is decision smoothing, not a measured reduction in false rejections or an
                independent accuracy result; the buffer can initially contain fewer than three scores.
              </p>
            </div>
          </div>
        </section>

        {/* 5. Empirical Evidence & Operational Findings */}
        <section className="editorial-grid" aria-labelledby="darvs-evidence-title">
          <div className="editorial-sidebar">
            <span className="mono signal">EMPIRICAL EVIDENCE</span>
            <h3 id="darvs-evidence-title">Model Metrics &amp; Operational Logs</h3>
            <p>
              Empirical model performance, operational deployment records, and functional prototype testing.
            </p>
          </div>
          <div className="editorial-content">
            <div className="spec-table-wrap">
              <table className="spec-table">
                <thead>
                  <tr>
                    <th>Component / Metric</th>
                    <th>Observed Value</th>
                    <th>Evaluation Scope</th>
                    <th>Operational Context</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Custom Eye-State CNN Parameters</td>
                    <td className="highlight">84,481 parameters</td>
                    <td>2 conv layers + dense classifier</td>
                    <td>Lightweight inference on 24 &times; 24 eye crops</td>
                  </tr>
                  <tr>
                    <td>Offline Eye-State Accuracy</td>
                    <td className="highlight">87.90% (545 / 620)</td>
                    <td>All 620 development images, including training images</td>
                    <td>Single subject; Open = 0, Closed = 1; not held-out accuracy</td>
                  </tr>
                  <tr>
                    <td>Runtime-Rule Dataset Replay</td>
                    <td className="highlight">14.52% (90 / 620)</td>
                    <td>Runtime polarity applied offline to the same images</td>
                    <td>Output &gt; 0.85 treated as open; unresolved, not live-session accuracy</td>
                  </tr>
                  <tr>
                    <td>Biometric Feature Dimension</td>
                    <td className="highlight">512 dimensions</td>
                    <td>Keras-FaceNet embeddings</td>
                    <td>Threshold 78 on cosine × 100 scale (0.78 cosine)</td>
                  </tr>
                  <tr>
                    <td>Automated Geometry Checks</td>
                    <td className="highlight">2D displacement can satisfy movement thresholds</td>
                    <td>Movement code checks, separate from live photo/screen observations</td>
                    <td>Not a controlled PAD benchmark or attack-specific rejection rate</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="evidence-callout">
              <div className="evidence-callout-header">
                <span className="kicker">AUTHOR-REPORTED PROTOTYPE OBSERVATIONS</span>
                <span className="badge">NOT A CONTROLLED PAD BENCHMARK</span>
              </div>
              <div className="evidence-callout-body">
                <p>
                  <strong>Reported Photo &amp; Screen Rejections:</strong> Vishva reports that printed
                  photographs and phone-screen face presentations were rejected during functional
                  prototype testing. These observations are preserved as author reports, not independently
                  controlled presentation-attack-detection (PAD) measurements.
                </p>
                <p style={{ marginTop: 10 }}>
                  The available records do not identify attack-specific samples or establish why each
                  presentation was rejected. Automated geometry checks, offline CNN replay and event-log
                  counts are separate evidence streams; none turns these observations into a security guarantee.
                </p>
              </div>
            </div>

            <div className="editorial-block">
              <h4>Operational Event Log Audit</h4>
              <p>
                <code>security_log.csv</code> contains 45 rows: 4 administrative entries and
                41 authentication attempts, comprising <strong>16 successful attempts</strong>,
                <strong> 18 liveness failures</strong> and <strong>7 identity rejections</strong>.
                Successful attempts have mean similarity <strong>82.36</strong> on the cosine × 100
                scale. The log has no attack-type labels: it cannot establish genuine-versus-spoof
                trial counts, photo/screen rejection rates or recognition accuracy.
              </p>
            </div>
          </div>
        </section>

        {/* 6. Limitations, Threat Model & Next Steps */}
        <section className="editorial-grid" aria-labelledby="darvs-audit-title">
          <div className="editorial-sidebar">
            <span className="mono signal">SYSTEM BOUNDARIES</span>
            <h3 id="darvs-audit-title">Threat Model &amp; Scope</h3>
            <p>
              Clear demarcation between observed functional prototype testing and independent security benchmarks.
            </p>
          </div>
          <div className="editorial-content">
            <div className="limitation-callout">
              <div className="limitation-callout-header">
                <span className="kicker">EXPLICIT THREAT MODEL BOUNDARIES</span>
              </div>
              <div className="limitation-callout-body">
                <p>
                  <strong>Observations vs. Independent Benchmarks:</strong> The author-reported rejection
                  of photographs and mobile screens is functional prototype evidence, distinct from
                  automated checks and not an independently controlled evaluation on public
                  presentation-attack datasets such as SiW, OULU-NPU or CASIA-SURF.
                </p>
                <p style={{ marginTop: 12 }}>
                  <strong>Uncovered Threat Vectors:</strong> No blanket protection is claimed against
                  replay, interactive deepfakes, 3D masks or virtual-camera injection. The 2D challenge
                  measurements and unresolved blink interpretation do not independently validate defenses
                  against these attacks.
                </p>
                <p style={{ marginTop: 12 }}>
                  <strong>Dataset &amp; Runtime Boundary:</strong> The 620-image single-subject
                  development set contains 328 open-eye and 292 closed-eye images, including training
                  images. Its 87.90% offline score is not independent held-out accuracy. Applying
                  the inverted runtime rule to that same set gave 14.52%, not live-session accuracy.
                  The polarity issue has not been fixed; a separate upstream investigation and
                  independent validation are required before claiming reliable blink behavior.
                </p>
              </div>
            </div>

            <div className="editorial-block">
              <h4>Local Prototype vs. Production Hardening</h4>
              <p>
                The Flask/OpenCV application uses SQLite enrollment metadata, serialized face
                embeddings and local CSV event logs, with optional asynchronous Sheets logging.
                The administrative interface uses a password, but production-grade transport,
                authorization and packaging are not independently established. The separate
                <code> anti_spoof_engine.py</code> has no runtime callers in the inspected pipeline;
                its experimental flash/motion defenses are not integrated protections.
              </p>
            </div>
          </div>
        </section>

        {/* Footer Navigation */}
        <div className="inspection-footer">
          <div className="inspection-footer-left">
            <span className="kicker">INSPECT PHYSICAL HARDWARE LOGIC</span>
            <span className="title">See how deterministic security is implemented without microcontrollers in USMHACS</span>
          </div>
          <div className="inspection-footer-links">
            <TrackedLink
              className="button"
              href="/darvs/demo"
              eventName="darvs_demo_open"
              eventParams={{ source_surface: "darvs_page_footer" }}
            >
              DEMO DIAGRAM <ArrowUpRight size={16} />
            </TrackedLink>
            <TrackedLink
              className="button"
              href="/usmhacs"
              eventName="project_open"
              eventParams={{ project_slug: "usmhacs", source_surface: "darvs_page_footer" }}
            >
              NEXT PROJECT: USMHACS <ArrowUpRight size={16} />
            </TrackedLink>
          </div>
        </div>
      </div>
    </main>
  );
}
