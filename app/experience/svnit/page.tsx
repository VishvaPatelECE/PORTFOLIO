import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ArrowLeft, Download, FileText, CheckCircle2, ShieldCheck } from "lucide-react";
import { PageHeading } from "@/components/Shell";
import CertificateViewer from "@/components/experience/CertificateViewer";
import styles from "@/components/experience/ExperienceDetail.module.css";
import {
  breadcrumbJsonLd,
  buildPageMetadata,
  experiencePageJsonLd,
  serializeJsonLd,
} from "@/lib/seo/site";
import { TrackedAnchor } from "@/components/analytics/TrackedLink";

export const metadata: Metadata = buildPageMetadata({
  title: "AI Research Intern — Department of Artificial Intelligence, SVNIT",
  description:
    "Comprehensive research record for AI research internship at SVNIT Surat: GraphMARL decentralized wireless scheduling, SUMO/TraCI co-simulation, and paired-seed empirical baselines.",
  path: "/experience/svnit",
  keywords: ["SVNIT Surat", "AI Research Intern", "GraphMARL", "C-V2X Simulation", "Vishva Patel"],
});

export default function SVNITExperiencePage() {
  return (
    <main id="main" className={styles.pageWrap}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd([
            experiencePageJsonLd({
              title: "AI Research Intern — Department of Artificial Intelligence, SVNIT",
              description:
                "Comprehensive research record for AI research internship at SVNIT Surat: GraphMARL decentralized wireless scheduling, SUMO/TraCI co-simulation, and paired-seed empirical baselines.",
              path: "/experience/svnit",
              organization: "Sardar Vallabhbhai National Institute of Technology (SVNIT), Surat",
            }),
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Experience", path: "/#experience" },
              { name: "SVNIT AI Research Internship", path: "/experience/svnit" },
            ]),
          ]),
        }}
      />
      <PageHeading
        code="EXPERIENCE DOSSIER · APPLIED RESEARCH PRACTICUM"
        title="AI Research Intern"
        subtitle="Department of Artificial Intelligence, Sardar Vallabhbhai National Institute of Technology (SVNIT), Surat · May 18 – July 17, 2026"
      >
        <Link className="text-link" href="/#experience">
          ← BACK TO HOMEPAGE EXPERIENCE
        </Link>
      </PageHeading>

      {/* Sticky Quick-Navigation Spine */}
      <nav className={styles.subnav} aria-label="Internship sections navigation">
        <a href="#overview" className={styles.subnavLink}>Overview</a>
        <a href="#objectives" className={styles.subnavLink}>Objectives &amp; Problem</a>
        <a href="#simulation" className={styles.subnavLink}>Simulation Architecture</a>
        <a href="#graphmarl" className={styles.subnavLink}>GraphMARL Hierarchy</a>
        <a href="#evaluation" className={styles.subnavLink}>Empirical Findings</a>
        <a href="#certificate" className={`${styles.subnavLink} ${styles.subnavCert}`}>
          ★ Certificate
        </a>
      </nav>

      {/* Meta Callout Banner */}
      <div className={styles.metaBanner}>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Institution</span>
          <span className={styles.metaValue}>SVNIT Surat</span>
          <span className={styles.metaSub}>Institute of National Importance, MoE</span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Department &amp; Programme</span>
          <span className={styles.metaValue}>Artificial Intelligence (DoAI)</span>
          <span className={styles.metaSub}>Summer Internship Programme (SSIP 2026)</span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Mentorship &amp; Leadership</span>
          <span className={styles.metaValue}>Dr. Nitesh A. Funde</span>
          <span className={styles.metaSub}>HOD: Dr. Tanmoy Hazra</span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Primary Research Focus</span>
          <span className={styles.metaValue}>GraphMARL in C-V2X</span>
          <span className={styles.metaSub}>Decentralized 6G Sidelink Resource Allocation</span>
        </div>
      </div>

      {/* 1. Overview & Research Context */}
      <section id="overview" className={styles.detailSection} aria-labelledby="overview-title">
        <div className={styles.sidebar}>
          <span className={styles.sidebarKicker}>RESEARCH CONTEXT</span>
          <h2 id="overview-title" className={styles.sidebarTitle}>Internship Overview</h2>
          <p className={styles.sidebarDesc}>
            Applied artificial intelligence practicum conducted at the Department of Artificial Intelligence, SVNIT Surat.
          </p>
        </div>
        <div className={styles.content}>
          <div className={styles.editorialBlock}>
            <h3 className={styles.blockTitle}>Academic Provenance &amp; Mentorship</h3>
            <p className={styles.blockBody}>
              During the summer of 2026 (May 18 to July 17, 2026), I was selected as an AI Research Intern under the
              <strong> SVNIT Summer Internship Programme (SSIP 2026)</strong> at the{" "}
              <strong>Department of Artificial Intelligence, Sardar Vallabhbhai National Institute of Technology (SVNIT), Surat</strong>.
              The internship was supervised under the academic mentorship of <strong>Dr. Nitesh A. Funde</strong> (Assistant Professor, DoAI)
              and endorsed by <strong>Dr. Tanmoy Hazra</strong> (Head of Department, DoAI).
            </p>
            <p className={styles.blockBody}>
              The primary research objective was the investigation of decentralized coordination mechanisms on rapidly shifting
              vehicular communication topologies, developing the internship research system entitled{" "}
              <strong>GraphMARL: Intelligent Radio Resource Allocation for 6G Vehicular Networks</strong>.
              The August 27–29, 2026 <code>olympus-v3</code> evaluation was a subsequent independent continuation,
              outside this certified internship and its institutional mentorship.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Research Objectives & Problem Statement */}
      <section id="objectives" className={styles.detailSection} aria-labelledby="objectives-title">
        <div className={styles.sidebar}>
          <span className={styles.sidebarKicker}>PROBLEM FORMULATION</span>
          <h2 id="objectives-title" className={styles.sidebarTitle}>Objectives &amp; Challenges</h2>
          <p className={styles.sidebarDesc}>
            Decentralized radio resource block allocation in dense C-V2X vehicular mobility.
          </p>
        </div>
        <div className={styles.content}>
          <div className={styles.editorialBlock}>
            <h3 className={styles.blockTitle}>The Decentralized Wireless Scheduling Bottleneck</h3>
            <p className={styles.blockBody}>
              In Cellular Vehicle-to-Everything (C-V2X Mode 4 sidelink) communications, vehicles communicate directly with neighboring
              vehicles without relying on cellular base station scheduling. Safety-related messaging motivates studying latency,
              interference and coordination overhead; this simulation does not establish a universal sub-10 ms guarantee or
              show that all centralized schedulers are unsuitable.
            </p>
            <p className={styles.blockBody}>
              However, decentralized scheduling introduces two critical mathematical bottlenecks:
            </p>
            <ul style={{ paddingLeft: 20, margin: "8px 0", color: "rgba(232, 224, 210, 0.85)", lineHeight: 1.6 }}>
              <li>
                <strong>Mutual Co-Channel Interference:</strong> When multiple uncoordinated transmitters select the same Physical Resource Block (PRB)
                at overlapping time slots, co-channel interference spikes, dropping packet signal-to-interference-plus-noise ratios (SINR) below decoding thresholds.
              </li>
              <li>
                <strong>Rapid Topological Non-Stationarity:</strong> Vehicles travel at high velocities in urban canyons, constantly altering spatial
                distances, shadowing profiles, and neighbor sets. Independent learners face a changing environment:
                the conditions seen by vehicle <var>i</var> shift when vehicle <var>j</var> changes its allocation.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 3. Technical Contributions & Simulation Architecture */}
      <section id="simulation" className={styles.detailSection} aria-labelledby="simulation-title">
        <div className={styles.sidebar}>
          <span className={styles.sidebarKicker}>SYSTEM ARCHITECTURE</span>
          <h2 id="simulation-title" className={styles.sidebarTitle}>Simulation &amp; Tech Stack</h2>
          <p className={styles.sidebarDesc}>
            Coupling microscopic vehicular traffic physics with realistic 3GPP radio channel dynamics.
          </p>
        </div>
        <div className={styles.content}>
          <div className={styles.editorialBlock}>
            <h3 className={styles.blockTitle}>Integrated Co-Simulation Pipeline</h3>
            <p className={styles.blockBody}>
              The internship co-simulation loop coupled <strong>Simulation of Urban MObility (SUMO)</strong>
              with selected wireless propagation, shadowing and fading models. It is a simulation study,
              not a complete standards-compliant radio emulator or an over-the-air testbed.
            </p>

            <div className={styles.archFlow}>
              <div className={styles.archStep}>
                <span className={styles.stepNum}>STEP 01</span>
                <span className={styles.stepTitle}>SUMO Micro-Traffic</span>
                <span className={styles.stepDesc}>Urban grid network, car-following kinematics, and realistic velocity vectors.</span>
              </div>
              <div className={styles.archStep}>
                <span className={styles.stepNum}>STEP 02</span>
                <span className={styles.stepTitle}>Python TraCI Loop</span>
                <span className={styles.stepDesc}>Bidirectional socket API retrieving real-time vehicle spatial coordinates and speed.</span>
              </div>
              <div className={styles.archStep}>
                <span className={styles.stepNum}>STEP 03</span>
                <span className={styles.stepTitle}>3GPP UMi Physics</span>
                <span className={styles.stepDesc}>TR 38.901 path loss, correlated log-normal shadowing, and Rayleigh fast fading.</span>
              </div>
              <div className={styles.archStep}>
                <span className={styles.stepNum}>STEP 04</span>
                <span className={styles.stepTitle}>Interference Matrix</span>
                <span className={styles.stepDesc}>N × N mutual interference calculation across concurrent subchannels.</span>
              </div>
            </div>
          </div>

          <div className={styles.editorialBlock}>
            <h3 className={styles.blockTitle}>Core Technology Stack</h3>
            <div className={styles.techGrid}>
              <div className={styles.techCard}>
                <span className={styles.techCategory}>Mobility Engine</span>
                <span className={styles.techName}>SUMO &amp; TraCI</span>
                <span className={styles.techDetail}>Microscopic urban street grids, lane geometries &amp; vehicle kinematics</span>
              </div>
              <div className={styles.techCard}>
                <span className={styles.techCategory}>Channel Physics</span>
                <span className={styles.techName}>3GPP TR 38.901 UMi</span>
                <span className={styles.techDetail}>Urban micro-cellular path loss, log-normal shadowing, fast fading</span>
              </div>
              <div className={styles.techCard}>
                <span className={styles.techCategory}>Graph Neural Nets</span>
                <span className={styles.techName}>GraphSAGE + TGN</span>
                <span className={styles.techDetail}>PyTorch Geometric, multi-hop neighbor aggregation &amp; edge memory</span>
              </div>
              <div className={styles.techCard}>
                <span className={styles.techCategory}>Multi-Agent RL</span>
                <span className={styles.techName}>MAPPO &amp; MATD3</span>
                <span className={styles.techDetail}>Centralized training with decentralized actor execution (CTDE)</span>
              </div>
            </div>
          </div>

          {/* Visual Figures */}
          <div className={styles.figureGrid}>
            <div className={styles.figureCard}>
              <Image
                src="/projects/graphmarl-sumo-mobility-v4.png"
                alt="Microscopic vehicular traffic simulation in SUMO coupled with C-V2X sidelink channel dynamics"
                width={1672}
                height={941}
                className={styles.figureImg}
              />
              <div className={styles.figureCaption}>
                <span className={styles.figureKicker}>FIGURE 1 · SIMULATION ARTIFACT</span>
                <p className={styles.figureText}>
                  Microscopic vehicular mobility co-simulation coupling SUMO via the TraCI API with custom C-V2X sidelink channel physics and mutual interference calculations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. GraphMARL Architecture & Methodology */}
      <section id="graphmarl" className={styles.detailSection} aria-labelledby="graphmarl-title">
        <div className={styles.sidebar}>
          <span className={styles.sidebarKicker}>METHODOLOGY</span>
          <h2 id="graphmarl-title" className={styles.sidebarTitle}>GraphMARL Architecture</h2>
          <p className={styles.sidebarDesc}>
            Hierarchical multi-agent reinforcement learning on dynamic communication graphs.
          </p>
        </div>
        <div className={styles.content}>
          <div className={styles.editorialBlock}>
            <h3 className={styles.blockTitle}>Two-Tier Coordination &amp; Spatio-Temporal GNNs</h3>
            <p className={styles.blockBody}>
              Vehicles and their communication links were modeled as a dynamic graph{" "}
              <var>G</var><sub>t</sub> = (<var>V</var><sub>t</sub>, <var>E</var><sub>t</sub>), with
              transmitter features including SINR history, queue backlog, speed and location.
            </p>
            <p className={styles.blockBody}>
              The internship explored a two-stage spatio-temporal representation using GraphSAGE and TGN,
              with MAPPO/MATD3 experiments. These historical versions are distinct from the August independent model:
            </p>
            <ul style={{ paddingLeft: 20, margin: "8px 0", color: "rgba(232, 224, 210, 0.85)", lineHeight: 1.6 }}>
              <li>
                <strong>Spatial Feature Aggregation (GraphSAGE):</strong> Aggregated channel state information (CSI) and queue urgency from 1-hop and 2-hop topological neighbors.
              </li>
              <li>
                <strong>Temporal Memory (TGN):</strong> Maintained continuous node and edge memory states to track rapid channel degradation and mobility drift across successive transmission time slots.
              </li>
              <li>
                <strong>Historical Hierarchy Experiments:</strong> Internship versions explored cluster-level subchannel allocation and local vehicular agents. This is not proof that August&apos;s evaluated policy delivered dynamic adaptive-power control.
              </li>
            </ul>
          </div>

          <div className={styles.figureGrid}>
            <div className={styles.figureCard}>
              <Image
                src="/projects/graphmarl-cooperation-concept-v2.png"
                alt="GraphMARL spatio-temporal graph modeling and hierarchical multi-agent coordination concept"
                width={1672}
                height={941}
                className={styles.figureImg}
              />
              <div className={styles.figureCaption}>
                <span className={styles.figureKicker}>FIGURE 2 · HISTORICAL COORDINATION CONCEPT</span>
                <p className={styles.figureText}>
                  Conceptual illustration of graph-based coordination explored during the internship;
                  it is not proof of the evaluated August architecture or its performance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Experimental Evaluation, Findings & Limitations */}
      <section id="evaluation" className={styles.detailSection} aria-labelledby="evaluation-title">
        <div className={styles.sidebar}>
          <span className={styles.sidebarKicker}>EMPIRICAL RESULTS</span>
          <h2 id="evaluation-title" className={styles.sidebarTitle}>Findings &amp; Boundaries</h2>
          <p className={styles.sidebarDesc}>
            Paired-seed evaluation across identical traffic seeds to isolate learning from random fluctuations.
          </p>
        </div>
        <div className={styles.content}>
          <div className={styles.editorialBlock}>
            <h3 className={styles.blockTitle}>August Independent Continuation — Controlled Evaluation</h3>
            <p className={styles.blockBody}>
              After the May 18–July 17 certified internship, I independently evaluated
              <code> olympus-v3</code> with Hetero-GATv2 + TGN + LOP/Beta during August 27–29, 2026.
              The campaign used 50 paired evaluation seeds, N=48 vehicles and K=4 PRBs;
              throughput below is mean per-vehicle Mbps. These are post-internship results, not
              findings certified by the SVNIT internship certificate.
            </p>
          </div>

          {/* Evaluation Table */}
          <div className={styles.specTableWrap}>
            <table className={styles.specTable}>
              <thead>
                <tr>
                  <th>Evaluated Policy / Mechanism</th>
                  <th>Observed Throughput Impact</th>
                  <th>Statistical Significance</th>
                  <th>Engineering Interpretation</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Unwrapped O3 vs. State-Matched Random</td>
                  <td className={styles.highlightCell}>0.157873 vs. 0.158865 Mbps (−0.628%)</td>
                  <td>Reported Holm-adjusted Wilcoxon: p = 0.8238</td>
                  <td>No statistically significant learned-policy advantage demonstrated; not equivalence</td>
                </tr>
                <tr>
                  <td>Shared D6 Wrapper</td>
                  <td className={styles.highlightCell}>Reported +10.8% to +11.7% range</td>
                  <td>Learned, random and comparator policies benefit</td>
                  <td>Shared-wrapper result, not unique learned-policy gain</td>
                </tr>
                <tr>
                  <td>Equal-Wrapper Comparison</td>
                  <td className={styles.highlightCell}>Random+D6 ≈ 0.1760; O3+D6 ≈ 0.1749 Mbps</td>
                  <td>Reported random lead ≈ 0.65%</td>
                  <td>Learned-policy superiority interpretation withdrawn</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Honest Finding Callout */}
          <div className={styles.honestCallout}>
            <div className={styles.calloutHeader}>
              <ShieldCheck size={16} />
              <span>Negative Finding &amp; Engineering Significance</span>
            </div>
            <p className={styles.calloutText}>
              The independent comparison did not demonstrate a statistically significant learned-policy advantage.
              Recomputed paired t-test p = 0.398138 and SciPy Wilcoxon p = 0.404258 are separate from
              the report&apos;s Holm-adjusted Wilcoxon p = 0.8238; non-significance is not equivalence.
              D6 uses serving-RSU ranking, finite −2 logit bias per conflicting reservation and stochastic
              categorical sampling, discouraging rather than eliminating collisions. D4 one-hop intent alone
              reduced throughput by 2.031%. Native power was nearly constant (0.4192 ± 0.0110 W), while
              the canonical comparison fixed power at 0.1000 W; dynamic adaptive-power control was not demonstrated.
              <Link className="text-link" href="/graphmarl"> Read the detailed GraphMARL methods and limitations ↗</Link>
            </p>
          </div>
        </div>
      </section>

      {/* 6. Dedicated Certificate Section */}
      <section id="certificate" className={styles.certSection} aria-labelledby="certificate-title">
        <div className={styles.certHeader}>
          <div className={styles.certTitleGroup}>
            <div className={styles.certKicker}>
              <CheckCircle2 size={14} />
              <span>OFFICIAL CREDENTIAL &amp; VERIFICATION</span>
            </div>
            <h2 id="certificate-title" className={styles.certTitle}>
              Internship Certificate
            </h2>
            <p style={{ color: "var(--muted)", margin: 0, fontSize: 14 }}>
              Awarded by the Department of Artificial Intelligence, Sardar Vallabhbhai National Institute of Technology (SVNIT), Surat.
            </p>
          </div>

          <div className={styles.certActions}>
            <TrackedAnchor
              href="/certificates/SVNIT_Internship_Certificate.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.certActionPrimary}
              aria-label="Open original SVNIT Internship Certificate PDF in a new tab"
              eventName="cta_click"
              eventParams={{
                cta_id: "svnit_cert_pdf",
                target: "/certificates/SVNIT_Internship_Certificate.pdf",
                source_surface: "svnit_experience_page",
              }}
            >
              <FileText size={14} />
              <span>Open Original PDF ↗</span>
            </TrackedAnchor>
            <TrackedAnchor
              href="/certificates/SVNIT_Internship_Certificate.pdf"
              download="SVNIT_Internship_Certificate.pdf"
              className={styles.certActionSecondary}
              aria-label="Download original SVNIT Internship Certificate PDF file"
              eventName="cta_click"
              eventParams={{
                cta_id: "svnit_cert_download",
                target: "/certificates/SVNIT_Internship_Certificate.pdf",
                source_surface: "svnit_experience_page",
              }}
            >
              <Download size={14} />
              <span>Download PDF ↓</span>
            </TrackedAnchor>
          </div>
        </div>

        {/* Certificate Visual Showcase Component with Lightbox */}
        <CertificateViewer />
      </section>

      {/* Inspection & Navigation Footer */}
      <footer className={styles.detailFooter}>
        <Link href="/#experience" className={styles.detailFooterLink}>
          <ArrowLeft size={14} />
          <span>Return to Homepage Experience</span>
        </Link>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link href="/graphmarl" className={styles.detailFooterLink}>
            <span>Explore GraphMARL Case Study</span>
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </footer>
    </main>
  );
}

