"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import styles from "./CloudTransition.module.css";

import ThreeCloudCanvas from "./ThreeCloudCanvas";

/** A scroll-driven, live Three.js cloud seam between the portrait and interests. */
export default function CloudTransition() {
  const root = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: root, offset: ["start end", "end start"] });
  const farX = useTransform(scrollYProgress, [0, 1], ["-2.5%", "2.5%"]);
  const nearX = useTransform(scrollYProgress, [0, 1], ["2%", "-2%"]);
  const nearY = useTransform(scrollYProgress, [0, 1], ["3%", "-3%"]);

  return <section ref={root} className={styles.transition} aria-hidden="true">
    <ThreeCloudCanvas />
    <div className={styles.horizon} />
  </section>;
}
