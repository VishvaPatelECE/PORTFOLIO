"use client";

import dynamic from "next/dynamic";
import styles from "./CloudTransition.module.css";

/**
 * Dynamically import ThreeCloudCanvas with ssr: false.
 * This code-splits Three.js (~517 KB) out of the initial homepage bundle
 * and loads it only on the client when the CloudTransition section mounts.
 */
const ThreeCloudCanvas = dynamic(
  () => import("./ThreeCloudCanvas"),
  { ssr: false }
);

/** A scroll-driven, live Three.js cloud seam between the portrait and interests with seamless edges. */
export default function CloudTransition() {
  return (
    <section className={styles.transition} aria-label="Atmospheric cloud transition">
      <ThreeCloudCanvas />
    </section>
  );
}
