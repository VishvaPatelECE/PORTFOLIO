import type { Metadata } from "next";
import ConceptAEditorial from "@/components/demo/ConceptAEditorial";
import ConceptBSystemsMap from "@/components/demo/ConceptBSystemsMap";
import styles from "./concepts.module.css";

export const metadata: Metadata = {
  title: { absolute: "Vishva Patel | Systems & ECE" },
  robots: { index: false, follow: false },
};

export default function ArchitectureConceptsPage() {
  return (
    <main className={styles.page}>
      <header className={styles.introHeader}>
        <div className="wrap">
          <span className={styles.eyebrow}>ISOLATED ART DIRECTION REVIEW</span>
          <h1 className={styles.pageTitle}>Systems Architecture Alternatives</h1>
          <p className={styles.pageLead}>
            Comparing two isolated visual strategies to replace the generic 3-card uniform layout with an authentic laboratory engineering composition.
          </p>
        </div>
      </header>

      {/* CONCEPT A */}
      <div className={styles.conceptSection}>
        <div className="wrap">
          <div className={styles.conceptBanner}>
            <span className={styles.conceptBadge}>OPTION A</span>
            <div>
              <h2>Editorial Architecture Composition</h2>
              <p>Asymmetric broadsheet layout using typography, deliberate negative space, fine technical rules, and explicit invariant definitions.</p>
            </div>
          </div>
        </div>
        <ConceptAEditorial />
      </div>

      <div className={styles.divider} />

      {/* CONCEPT B */}
      <div className={styles.conceptSection}>
        <div className="wrap">
          <div className={styles.conceptBanner}>
            <span className={styles.conceptBadge}>OPTION B</span>
            <div>
              <h2>Systems Topology &amp; Invariant Matrix</h2>
              <p>Horizontal 3-phase continuum linking physical inputs to graph representations, backed by a structured tabular invariant matrix.</p>
            </div>
          </div>
        </div>
        <ConceptBSystemsMap />
      </div>
    </main>
  );
}
