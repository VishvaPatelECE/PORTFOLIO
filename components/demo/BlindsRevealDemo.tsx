"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { featuredProjects } from "@/lib/content/projects";
import { projectCovers } from "@/lib/content/project-covers";
import { ArrowUpRight } from "lucide-react";
import styles from "./BlindsRevealDemo.module.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const BOX_COUNT = 90;

export default function BlindsRevealDemo() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const triggerRef = useRef<HTMLDivElement>(null);
  const boxesRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;

    const boxes = boxesRef.current.filter(Boolean);

    // Exact timeline and ScrollTrigger setup from elegantseagulls / FreeFrontend reference
    const tl = gsap
      .timeline({
        scrollTrigger: {
          trigger: trigger,
          scrub: 0.5,
          start: "top top",
          end: "+=150%",
        },
      })
      .to(boxes, {
        force3D: true,
        duration: 1,
        xPercent: 100,
        ease: "power1.inOut",
        stagger: { amount: 1 },
      })
      .to(boxes, { ease: "power1.out", duration: 1, rotation: "45deg" }, 0)
      .to(boxes, { ease: "power1.in", duration: 1, rotation: "0deg" }, 1);

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === trigger) st.kill();
      });
    };
  }, [selectedIdx]);

  const project = featuredProjects[selectedIdx];
  const cover = projectCovers[project.kind];

  return (
    <div className={styles.runway}>
      <section className={styles.trigger} ref={triggerRef}>
        <span className={styles.labelDown}>
          Scroll<br />Down
        </span>
        <span className={styles.labelUp}>
          Scroll<br />Up
        </span>

        {/* 90 Staggered Slat Boxes */}
        <div className={styles.blindsContainer}>
          {Array.from({ length: BOX_COUNT }).map((_, i) => (
            <div
              key={i}
              className={styles.box}
              ref={(el) => {
                if (el) boxesRef.current[i] = el;
              }}
            />
          ))}
        </div>

        {/* Revealed Content Under the Blinds */}
        <div className={styles.underLayer}>
          <div className={styles.projectInfo}>
            <span className={styles.tag}>{project.field}</span>
            <h2 className={styles.title}>{project.name}</h2>
            <p className={styles.line}>{project.line}</p>

            <Link href={project.href} className={styles.linkBtn}>
              {project.action}
              <ArrowUpRight size={15} />
            </Link>
          </div>

          <div className={styles.imageFrame}>
            <Image
              src={cover.image}
              alt={cover.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>
        </div>
      </section>

      {/* Switch between projects to inspect blinds on each */}
      <div className={styles.projectSelector}>
        {featuredProjects.map((p, i) => (
          <button
            key={p.name}
            type="button"
            className={`${styles.tabBtn} ${i === selectedIdx ? styles.tabBtnActive : ""}`}
            onClick={() => {
              setSelectedIdx(i);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            {p.name}
          </button>
        ))}
      </div>
    </div>
  );
}
