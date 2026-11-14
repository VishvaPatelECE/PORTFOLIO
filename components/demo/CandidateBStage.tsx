"use client";

import { useState, useRef, useEffect, useCallback, KeyboardEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useReducedMotion } from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { featuredProjects } from "@/lib/content/projects";
import { projectCovers } from "@/lib/content/project-covers";
import styles from "./CandidateBStage.module.css";

const projectMoods = [
  { primary: "rgba(0, 174, 189, 0.16)", border: "rgba(0, 174, 189, 0.45)", tag: "WIRELESS GRAPH LAB" },
  { primary: "rgba(185, 157, 115, 0.16)", border: "rgba(185, 157, 115, 0.45)", tag: "MULTI-AGENT RL" },
  { primary: "rgba(0, 174, 189, 0.2)", border: "rgba(0, 174, 189, 0.5)", tag: "BIOMETRIC AUTH" },
  { primary: "rgba(185, 157, 115, 0.18)", border: "rgba(185, 157, 115, 0.5)", tag: "HARDWARE SECURITY" },
];

export default function CandidateBStage() {
  const [active, setActive] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isProgrammaticScroll = useRef(false);
  const reduced = useReducedMotion();

  // Scroll to designated card using native smooth scroll
  const scrollToCard = useCallback((idx: number) => {
    const nextIdx = Math.max(0, Math.min(featuredProjects.length - 1, idx));
    const targetCard = cardRefs.current[nextIdx];
    const track = trackRef.current;
    if (!targetCard || !track) return;

    isProgrammaticScroll.current = true;
    setActive(nextIdx);

    const trackWidth = track.clientWidth;
    const cardLeft = targetCard.offsetLeft;
    const cardWidth = targetCard.clientWidth;
    const scrollTarget = cardLeft - (trackWidth - cardWidth) / 2;

    track.scrollTo({
      left: scrollTarget,
      behavior: reduced ? "instant" : "smooth",
    });

    setTimeout(() => {
      isProgrammaticScroll.current = false;
    }, 450);
  }, [reduced]);

  // Synchronize active indicator using passive IntersectionObserver (Zero hot-loop scroll lag)
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (isProgrammaticScroll.current) return;
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idxStr = entry.target.getAttribute("data-index");
            if (idxStr !== null) {
              setActive(Number(idxStr));
            }
          }
        });
      },
      {
        root: track,
        threshold: 0.65, // Card must be predominantly centered to activate
      }
    );

    cardRefs.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      scrollToCard(active + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      scrollToCard(active - 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      scrollToCard(0);
    } else if (e.key === "End") {
      e.preventDefault();
      scrollToCard(featuredProjects.length - 1);
    }
  }, [active, scrollToCard]);

  const currentMood = projectMoods[active] || projectMoods[0];

  return (
    <div
      className={styles.container}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      role="region"
      aria-label="Candidate B: Cinematic Horizontal Stage"
    >
      {/* Dynamic Atmosphere Aura synced to active project */}
      <div
        className={styles.ambientAura}
        style={{
          background: `radial-gradient(circle at 55% 45%, ${currentMood.primary} 0%, rgba(8, 7, 11, 0) 65%)`,
        }}
      />

      {/* Header with Live Slide Indicator and Steppers */}
      <header className={styles.heading}>
        <div className={styles.headingLeft}>
          <div className={styles.badgeRow}>
            <span className={styles.candidateBadge}>CANDIDATE B</span>
            <span className={styles.candidateDesc}>CINEMATIC HORIZONTAL STAGE</span>
          </div>
          <h2 className={styles.title}>
            Selected work<span>.</span>
          </h2>
          <span className={styles.interactionHint}>SWIPE HORIZONTALLY, USE KEYS, OR CHEVRONS</span>
        </div>

        <div className={styles.tools}>
          <div className={styles.stepperGroup}>
            <button
              type="button"
              className={styles.stepBtn}
              onClick={() => scrollToCard(active - 1)}
              disabled={active === 0}
              aria-label="Previous project"
            >
              <ChevronLeft size={18} />
            </button>
            <div className={styles.indicatorPill}>
              <span className={styles.currentSlide}>0{active + 1}</span>
              <span className={styles.slash}>/</span>
              <span className={styles.totalSlides}>0{featuredProjects.length}</span>
            </div>
            <button
              type="button"
              className={styles.stepBtn}
              onClick={() => scrollToCard(active + 1)}
              disabled={active === featuredProjects.length - 1}
              aria-label="Next project"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Native Horizontal Scroll Snap Track — 100% GPU Composited */}
      <div ref={trackRef} className={styles.track}>
        {featuredProjects.map((project, idx) => {
          const isActive = active === idx;
          const cover = projectCovers[project.kind];
          const mood = projectMoods[idx];

          return (
            <div
              key={project.name}
              ref={(el) => {
                cardRefs.current[idx] = el;
              }}
              data-index={idx}
              className={`${styles.card} ${isActive ? styles.cardActive : styles.cardPeeking}`}
              onClick={() => scrollToCard(idx)}
              role="button"
              tabIndex={0}
              aria-label={`${project.name} - ${project.field}`}
              style={{
                borderColor: isActive ? mood.border : undefined,
              }}
            >
              {/* Image Viewport */}
              <div className={styles.imageViewport}>
                <Image
                  src={cover.image}
                  alt={cover.alt}
                  fill
                  sizes="(max-width: 900px) 90vw, 1100px"
                  priority={idx === 0}
                  className={styles.coverImg}
                />
                <div className={styles.scrimOverlay} />
              </div>

              {/* Badge cluster */}
              <div className={styles.badgeCluster}>
                <span className={styles.metaBadge}>{mood.tag}</span>
                <span className={styles.categoryBadge}>{project.field}</span>
              </div>

              {/* Content Box */}
              <div className={styles.contentBox}>
                <div className={styles.titleRow}>
                  <span className={styles.projectIndex}>0{idx + 1}</span>
                  <h3 className={styles.projectName}>{project.name}</h3>
                </div>

                <p className={styles.projectLine}>{project.line}</p>

                <div className={styles.actionRow}>
                  <Link
                    href={project.href}
                    className={styles.actionBtn}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span>{project.action}</span>
                    <ArrowUpRight size={15} />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
