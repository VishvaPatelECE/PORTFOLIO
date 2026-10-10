"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import styles from "./CloudTransition.module.css";

/** A scroll-driven, lightweight cloud seam between the portrait and interests. */
export default function CloudTransition() {
  const root = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: root, offset: ["start end", "end start"] });
  const farX = useTransform(scrollYProgress, [0, 1], ["-2.5%", "2.5%"]);
  const nearX = useTransform(scrollYProgress, [0, 1], ["2%", "-2%"]);
  const nearY = useTransform(scrollYProgress, [0, 1], ["3%", "-3%"]);

  return <section ref={root} className={styles.transition} aria-hidden="true">
    <motion.div className={styles.cloudFar} style={reduce ? undefined : { x: farX }} />
    <motion.div className={styles.cloudNear} style={reduce ? undefined : { x: nearX, y: nearY }} />
    <div className={styles.horizon} />
  </section>;
}
