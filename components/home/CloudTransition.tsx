"use client";

import styles from "./CloudTransition.module.css";
import ThreeCloudCanvas from "./ThreeCloudCanvas";

/** A scroll-driven, live Three.js cloud seam between the portrait and interests with seamless edges. */
export default function CloudTransition() {
  return (
    <section className={styles.transition} aria-label="Atmospheric cloud transition">
      <ThreeCloudCanvas />
    </section>
  );
}
