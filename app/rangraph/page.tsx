import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import ProjectHero from "@/components/ProjectHero";
import RangraphInstrument from "@/components/rangraph/RangraphInstrument";
import {
  breadcrumbJsonLd,
  buildPageMetadata,
  projectJsonLd,
  serializeJsonLd,
} from "@/lib/seo/site";

const RANGRAPH_DESCRIPTION =
  "A domain-specific compiler and typed canonical intermediate representation converting heterogeneous RAN telemetry into verified, invariant-checked graph structures.";

export const metadata: Metadata = buildPageMetadata({
  title: "RANGraph — Semantic Compilation for Radio Access Network Telemetry",
  description: RANGRAPH_DESCRIPTION,
  path: "/rangraph",
  keywords: ["RANGraph", "O-RAN E2", "Canonical IR", "Domain-Specific Compiler", "Incremental Graph Compilation"],
});

export default function Rangraph() {
  return (
    <main id="main" className="project-page-main">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd([
            projectJsonLd({
              name: "RANGraph",
              description: RANGRAPH_DESCRIPTION,
              path: "/rangraph",
              keywords: ["O-RAN E2", "Canonical IR", "Invariant Validation", "Graph Compiler"],
              programmingLanguage: ["Python", "TypeScript"],
            }),
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Projects", path: "/#projects" },
              { name: "RANGraph", path: "/rangraph" },
            ]),
          ]),
        }}
      />
      <ProjectHero
        id="rangraph"
        code="SYSTEM · WIRELESS DATA & COMPILERS"
        title="RANGraph"
        subtitle="Compiling heterogeneous Radio Access Network observations into verified, invariant-checked canonical graph representations."
        kind="wireless"
        tags={["O-RAN E2", "Canonical IR", "Invariant Validation", "Graph Tensor"]}
        actionLink={{ href: "/#projects", label: "← ALL PROJECTS" }}
      />

      <div className="wrap">
      {/* Architectural Thesis & Problem Definition */}
      <section className="editorial-thesis" aria-labelledby="rangraph-thesis-title">
        <div className="editorial-thesis-meta">
          <span className="mono-kicker">PROBLEM STATEMENT</span>
          <div className="editorial-thesis-tags">
            <span className="editorial-tag-item">Heterogeneous O-RAN / 3GPP Telemetry</span>
            <span className="editorial-tag-item">Silent Semantic Drift</span>
            <span className="editorial-tag-item">Unverifiable Topology Inference</span>
            <span className="editorial-tag-item">Incremental Graph Compilation</span>
          </div>
        </div>
        <div className="editorial-thesis-body">
          <h2 id="rangraph-thesis-title">
            Every edge needs a reason to exist.
            <br />
            No association can be assumed.
          </h2>
          <p>
            In modern Radio Access Networks (RAN), cellular telemetry arrives from diverse, multi-vendor
            sources: O-RAN E2 service models (E2SM-KPM), 3GPP Minimization of Drive Tests (MDT), and
            proprietary base-station diagnostic dumps. Records can differ in names and units, reuse
            identifiers within different authority scopes, and carry unaligned timestamps or incomplete
            source provenance.
          </p>
          <p>
            Ad-hoc graph assembly can silently conflate incompatible measurements or merge locally scoped
            identities, corrupting downstream analysis and Graph Neural Network (GNN) training. RANGraph
            addresses this risk with a domain-specific semantic compiler: observations are checked against
            declared contracts and mapped into an immutable canonical Intermediate Representation (IR).
            Missing context remains explicit rather than being guessed.
          </p>
        </div>
      </section>

        {/* Interactive Browser Ingestion & Compiler Instrument */}
        <RangraphInstrument />

      {/* Compiler Architecture & Stages */}
      <section className="editorial-grid" aria-labelledby="pipeline-arch-title">
        <div className="editorial-sidebar">
          <span className="mono signal">SYSTEM ARCHITECTURE</span>
          <h3 id="pipeline-arch-title">Semantic Compilation &amp; Lowering</h3>
          <p>
            Source adapters map observations through semantic contracts and canonical IR into typed
            dependency scopes, selective recompilation, and downstream lowering. These three groupings
            summarize the architecture; the bounded browser demo has eight inspection views (00–07),
            not six compiler stages.
          </p>
        </div>
        <div className="editorial-content">
          <div className="editorial-block">
            <h4>1. Source Adapters &amp; Typed Observations</h4>
            <p>
              Heterogeneous inputs—including E2 indication messages, tabular CSV dumps, and streaming
              JSON packets—are ingested through modular source adapters. Rather than immediately parsing
              into graph nodes, records are mapped into strictly typed observation schemas with explicit
              temporal timestamps and physical provenance. Missing values remain explicitly typed as
              absent; no default coordinates or synthetic values are hallucinated.
            </p>
          </div>

          <div className="editorial-block">
            <h4>2. Semantic Compilation &amp; Canonical IR</h4>
            <p>
              The manuscript&apos;s canonical semantic observation is governed by four peer contract
              families, rather than only the browser&apos;s <code>(node_type, entity_id)</code> graph key:
            </p>
            <ul>
              <li>
                <strong>Identity &amp; Authority Scope:</strong> Preserve the scope in which an identifier is meaningful; do not merge unrelated identities.
              </li>
              <li>
                <strong>Dimensioned Measurements &amp; Channel Raster:</strong> Retain units and discrete channel semantics instead of conflating incompatible values.
              </li>
              <li>
                <strong>Calibrated Timebase &amp; Intervals:</strong> Make temporal context explicit before combining observations.
              </li>
              <li>
                <strong>Information Fate:</strong> Account for canonical attributes, extensions, provenance and warranted discards without guessing missing context.
              </li>
            </ul>
          </div>

          <div className="editorial-block">
            <h4>3. Independent Validation Engine &amp; Computational Lowering</h4>
            <p>
              Non-repairing validation reports violations of the declared contracts without silently
              mutating invalid observations. Typed dependency scopes identify affected work for selective
              recompilation and downstream lowering. Agreement under these contracts is not universal
              physical correctness or proof of deployment on live radio hardware.
            </p>
          </div>
        </div>
      </section>

      {/* Quantitative Evidence & Evaluation */}
      <section className="editorial-grid" aria-labelledby="eval-evidence-title">
        <div className="editorial-sidebar">
          <span className="mono signal">EMPIRICAL BENCHMARKS</span>
          <h3 id="eval-evidence-title">Reproducible Evaluation</h3>
          <p>
            Quantitative correctness and update-latency benchmarks verified against independent reference
            implementations.
          </p>
        </div>
        <div className="editorial-content">
          <div className="spec-table-wrap">
            <table className="spec-table">
              <thead>
                <tr>
                  <th>Evaluation Metric</th>
                  <th>Observed Result</th>
                  <th>Benchmark Baseline</th>
                  <th>Significance / Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Independent Oracle Agreement</td>
                  <td className="highlight">2,772 / 2,772 correctness cases</td>
                  <td>Six-system CSV: synthetic, Vienna &amp; UCCMISL</td>
                  <td>Zero stale, missing or extra outputs in tested cases</td>
                </tr>
                <tr>
                  <td>Separate Semantic-Safety Study</td>
                  <td className="highlight">250 / 250 safe RANGraph outcomes</td>
                  <td>Separate four-system comparative study</td>
                  <td>100% cryptographic receipts; zero unsafe merges, bridges or canons</td>
                </tr>
                <tr>
                  <td>Python Incremental Update (Median)</td>
                  <td className="highlight">0.0803 ms</td>
                  <td>Python FULL: 222.9141 ms; approximately 2,776.02× ratio</td>
                  <td>Synthetic chain, N=100,000, k=1; excludes construction, cold initialization &amp; oracle verification</td>
                </tr>
                <tr>
                  <td>Python Optimized Cold Initialization</td>
                  <td className="highlight">297.2901 ms</td>
                  <td>Synthetic chain, N=100,000</td>
                  <td>Separate initialization measurement, not incremental update time</td>
                </tr>
                <tr>
                  <td>Other Incremental Kernel Implementations</td>
                  <td className="highlight">Rust: 0.0913 ms; Differential Dataflow: 0.2545 ms</td>
                  <td>FAIR_NAIVE: 0.4263 ms; Salsa: 1.1190 ms</td>
                  <td>Same synthetic-chain N=100,000, k=1 workload</td>
                </tr>
                <tr>
                  <td>Dense Mutation Batch</td>
                  <td className="highlight">Python: 10.5707 ms; Differential Dataflow: 3.8924 ms</td>
                  <td>Synthetic chain, N=10,000, k=500</td>
                  <td>Differential Dataflow is faster in this benchmark cell</td>
                </tr>
                <tr>
                  <td>Vienna Telemetry-Field Workload</td>
                  <td className="highlight">Rust: 0.2738 ms; Python: 0.3587 ms</td>
                  <td>Python FULL: 6.2267 ms</td>
                  <td>k=10; pooled N=1,000 and 5,000; 42 measurements/system</td>
                </tr>
                <tr>
                  <td>UCCMISL Telemetry-Field Workload</td>
                  <td className="highlight">Rust: 0.1880 ms; Python: 0.2491 ms</td>
                  <td>Python FULL: 3.4238 ms</td>
                  <td>k=10; pooled N=1,000 and 5,000; 42 measurements/system</td>
                </tr>
                <tr>
                  <td>Golden Mock E2 Fixture</td>
                  <td className="highlight">Deterministic Pass</td>
                  <td>Browser TypeScript + Python</td>
                  <td>Bounded structural agreement; separate from both studies</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="evidence-callout">
            <div className="evidence-callout-header">
              <span className="kicker">COMPUTATIONAL DISCOVERY &amp; OPERATING BOUNDARY</span>
              <span className="badge">SELECTIVE PROPAGATION VS. DATAFLOW</span>
            </div>
            <div className="evidence-callout-body">
              <p>
                <strong>The Workload Boundary:</strong> The Python 0.0803 ms median is an incremental
                kernel measurement on a synthetic chain (N=100,000, k=1), not end-to-end processing
                latency. It runs from an input mutation delta to evaluated updated outputs, excluding
                graph construction, cold initialization and oracle verification. The comparison engines
                use translated common kernels; they do not establish identical semantic contracts.
              </p>
              <p style={{ marginTop: 10 }}>
                Scope-gated dependency propagation limits dirty-set work when mutations are local,
                declared scope invariance holds and cached state is trusted and immutable. With a dense
                mutation batch (N=10,000, k=500), more affected work reduces selectivity: Python takes
                10.5707 ms versus Differential Dataflow&apos;s 3.8924 ms. This measured crossover favors
                data-parallel batch handling; it is not evidence of AST tree-rebalancing overhead or
                universal RANGraph superiority.
              </p>
              <p style={{ marginTop: 10 }}>
                Vienna and UCCMISL use real telemetry fields with synthetically constructed dependency
                topology. Their pooled k=10 kernel measurements are separate from the synthetic-chain
                result and are not live end-to-end production pipelines.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Limitations, Boundaries & Integrity Statement */}
      <section className="editorial-grid" aria-labelledby="limitations-title">
        <div className="editorial-sidebar">
          <span className="mono signal">SYSTEM BOUNDARIES</span>
          <h3 id="limitations-title">Qualifications &amp; Scope</h3>
          <p>
            Clear demarcation between software compiler correctness and physical-layer radio testing.
          </p>
        </div>
        <div className="editorial-content">
          <div className="limitation-callout">
            <div className="limitation-callout-header">
              <span className="kicker">EXPLICIT ENGINEERING LIMITATIONS</span>
            </div>
            <div className="limitation-callout-body">
              <p>
                <strong>Software Correctness vs. Over-the-Air Validation:</strong> RANGraph is implemented
                as a domain-specific semantic compiler and graph data representation framework. It does
                <strong> not</strong> capture live over-the-air RF signals, execute baseband physical-layer
                decoding, or deploy as a real-time O-RAN Near-RT RIC xApp on production cellular hardware.
              </p>
              <p style={{ marginTop: 12 }}>
                <strong>Hypothesis Status:</strong> Contract checks bound the tested representation;
                whether canonical graphs yield statistically superior downstream GNN prediction over
                raw tabular telemetry remains a research hypothesis requiring further empirical
                validation across multi-vendor field datasets.
              </p>
              <p style={{ marginTop: 12 }}>
                <strong>Access Restrictions:</strong> The RANGraph source repository, test harness, and
                manuscript draft remain private during this phase. The interactive browser instrument above
                operates entirely client-side on the verified golden Mock E2 fixture.
              </p>
            </div>
          </div>

          <div className="editorial-block">
            <h4>Browser Model Implementation</h4>
            <p>
              The client-side TypeScript instrument uses a bounded golden Mock E2 fixture: two
              timesteps, three UEs, two gNBs and one handover. Association edges follow explicit serving
              references; full A3/A5 event rules, PCI range checks and PyTorch Geometric/NetworkX/DGL
              tensor lowering are not implemented here. Interference is disabled when coupling data
              is unavailable. JSON IR export is implemented without a remote Python backend.
              This fixture is not the full production compiler.
            </p>
          </div>
        </div>
      </section>

        {/* Footer Navigation */}
        <div className="inspection-footer">
          <div className="inspection-footer-left">
            <span className="kicker">SYSTEM PIPELINE</span>
            <span className="title">Explore how compiled graph representations connect to multi-agent learning</span>
          </div>
          <div className="inspection-footer-links">
            <Link className="button" href="/graphmarl">
              NEXT PROJECT: GRAPHMARL <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}