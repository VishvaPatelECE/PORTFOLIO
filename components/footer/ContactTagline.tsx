"use client";

import { cormorantGaramond, martianMono } from "@/lib/fonts";
import styles from "./ContactTagline.module.css";

interface InViewProps {
  isVisible?: boolean;
}

export function ContactHeroTagline({ isVisible = true }: InViewProps) {
  return (
    <h2 className={styles.heroTagline}>
      <span
        className={`${styles.heroLineA} ${cormorantGaramond.className} ${
          isVisible ? styles.visibleA : styles.hiddenA
        }`}
        style={{
          fontFamily: `${cormorantGaramond.style.fontFamily}, 'Cormorant Garamond', Garamond, serif`,
        }}
      >
        Some see a limit.
      </span>
      <span
        className={`${styles.heroLineB} ${
          isVisible ? styles.visibleB : styles.hiddenB
        }`}
      >
        I see a starting line.
      </span>
    </h2>
  );
}

export function ContactSupportingHeadline({ isVisible = true }: InViewProps) {
  return (
    <p
      className={`${styles.supportingHeadline} ${
        isVisible ? styles.visibleSupporting : styles.hiddenSupporting
      }`}
    >
      <span className={styles.supportingCream}>Let’s build</span>
      <span className={styles.supportingMuted}>something real.</span>
    </p>
  );
}

export function ContactInternshipLine({
  isVisible = true,
  text = "LOOKING FOR A 6 MONTHS INTERNSHIP",
}: InViewProps & { text?: string }) {
  return (
    <p
      className={`${styles.internshipLine} ${martianMono.className} ${
        isVisible ? styles.visibleInternship : styles.hiddenInternship
      }`}
      style={{
        fontFamily: `${martianMono.style.fontFamily}, 'Martian Mono', monospace`,
      }}
    >
      <span>{text}</span>
    </p>
  );
}

export default function ContactTagline({ isVisible = true }: InViewProps) {
  return (
    <>
      <ContactHeroTagline isVisible={isVisible} />
      <ContactSupportingHeadline isVisible={isVisible} />
    </>
  );
}
