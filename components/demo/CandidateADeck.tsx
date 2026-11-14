"use client";

import { useState, useRef, useCallback, MouseEvent, KeyboardEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useReducedMotion } from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { featuredProjects } from "@/lib/content/projects";
import { projectCovers } from "@/lib/content/project-covers";
import styles from "./CandidateADeck.module.css";

const projectMoods = [
  { primary: "rgba(0, 174, 189, 0.16)", border: "rgba(0, 174, 189, 0.45)", tag: "WIRELESS GRAPH LAB" },
  { primary: "rgba(185, 157, 115, 0.16)", border: "rgba(185, 157, 115, 0.45)", tag: "MULTI-AGENT RL" },
  { primary: "rgba(0, 174, 189, 0.2)", border: "rgba(0, 174, 189, 0.5)", tag: "BIOMETRIC AUTH" },
  { primary: "rgba(185, 157, 115, 0.18)", border: "rgba(185, 157, 115, 0.5)", tag: "HARDWARE SECURITY" },
];

export default function CandidateADeck() {
  const router = useRouter();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mouseRafId = useRef(0);
  const reduced = useReducedMotion();

  // Cursor-Triggered Kinetic Hover: instantly maximizes the hovered card with zero jitter
  const handleCardPointerEnter = useCallback((idx: number) => {
    setActive(idx);
  }, []);

  const handleCardClick = useCallback((idx: number, href: string) => {
    if (idx === active) {
      router.push(href);
    } else {
      setActive(idx);
    }
  }, [active, router]);

  // Subtle Mouse Parallax Inspection on Active Card (GPU transform, throttled to rAF)
  const handleMouseMove = useCallback((e: MouseEvent<HTMLDivElement>, idx: number) => {
    if (idx !== active || paused || reduced) return;
    const card = cardRefs.current[idx];
    if (!card) return;

    if (mouseRafId.current) return;
    const clientX = e.clientX;
    const clientY = e.clientY;

    mouseRafId.current = requestAnimationFrame(() => {
      mouseRafId.current = 0;
      const rect = card.getBoundingClientRect();
      const x = (clientX - rect.left) / rect.width - 0.5;
      const y = (clientY - rect.top) / rect.height - 0.5;

      card.style.setProperty("--mouse-parallax-x", `${x * 24}px`);
      card.style.setProperty("--mouse-parallax-y", `${y * 16}px`);
    });
  }, [active, paused, reduced]);

  const handleMouseLeave = useCallback((idx: number) => {
    const card = cardRefs.current[idx];
    if (!card) return;
    if (mouseRafId.current) {
      cancelAnimationFrame(mouseRafId.current);
      mouseRafId.current = 0;
    }
    card.style.setProperty("--mouse-parallax-x", "0px");
    card.style.setProperty("--mouse-parallax-y", "0px");
  }, []);

  // Direct In-Place Card Selection (steppers & keyboards)
  const selectCard = useCallback((idx: number) => {
    const nextIdx = Math.max(0, Math.min(featuredProjects.length - 1, idx));
    setActive(nextIdx);
  }, []);

  // Keyboard navigation on accordion container
  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      selectCard((active + 1) % featuredProjects.length);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      selectCard((active - 1 + featuredProjects.length) % featuredProjects.length);
    } else if (e.key === "Home") {
      e.preventDefault();
      selectCard(0);
    } else if (e.key === "End") {
      e.preventDefault();
      selectCard(featuredProjects.length - 1);
    }
  }, [active, selectCard]);

  const currentMood = projectMoods[active] || projectMoods[0];

  return (
    <div
      className={styles.container}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      role="region"
      aria-label="Candidate A: Tactile Kinetic Deck"
    >
      {/* Atmosphere Aura synced to active project */}
      <div
        className={styles.ambientAura}
        style={{
          background: `radial-gradient(circle at 55% 45%, ${currentMood.primary} 0%, rgba(8, 7, 11, 0) 65%)`,
        }}
      />

      {/* Header with Live Slide Indicator and Tactile Steppers */}
      <header className={styles.heading}>
        <div className={styles.headingLeft}>
          <div className={styles.badgeRow}>
            <span className={styles.candidateBadge}>CANDIDATE A</span>
            <span className={styles.candidateDesc}>TACTILE KINETIC DECK</span>
          </div>
          <h2 className={styles.title}>
            Selected work<span>.</span>
          </h2>
          <span className={styles.interactionHint}>HOVER OR CLICK CARD TO EXPLORE</span>
        </div>

        <div className={styles.tools}>
          <div className={styles.stepperGroup}>
            <button
              type="button"
              className={styles.stepBtn}
              onClick={() => selectCard(active - 1)}
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
              onClick={() => selectCard(active + 1)}
              disabled={active === featuredProjects.length - 1}
              aria-label="Next project"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <button
            type="button"
            onClick={() => setPaused(!paused)}
            disabled={!!reduced}
            aria-pressed={paused}
            aria-label={paused ? "Resume parallax motion" : "Pause parallax motion"}
            className={styles.pauseBtn}
          >
            {paused ? <Play size={15} /> : <Pause size={15} />}
          </button>
        </div>
      </header>

      {/* Horizontal Accordion Deck — Normal Document Flow */}
      <div className={styles.deck}>
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
              className={`${styles.panel} ${isActive ? styles.panelActive : styles.panelCollapsed}`}
              onPointerEnter={() => handleCardPointerEnter(idx)}
              onClick={() => handleCardClick(idx, project.href)}
              onMouseMove={(e) => handleMouseMove(e, idx)}
              onMouseLeave={() => handleMouseLeave(idx)}
              role="button"
              tabIndex={0}
              aria-expanded={isActive}
              aria-label={`${project.name} - ${project.field}`}
              style={{
                borderColor: isActive ? mood.border : undefined,
              }}
            >
              {/* Parallax Image Background */}
              <div className={styles.imageViewport}>
                <div
                  className={styles.imageInner}
                  style={{
                    transform: "translate3d(var(--mouse-parallax-x, 0px), var(--mouse-parallax-y, 0px), 0)",
                  }}
                >
                  <Image
                    src={cover.image}
                    alt={cover.alt}
                    fill
                    sizes="(max-width: 900px) 100vw, 1200px"
                    priority={idx === 0}
                    className={styles.coverImg}
                  />
                </div>
                <div className={styles.scrimOverlay} />
              </div>

              {/* Top Badges */}
              <div
                className={`${styles.badgeCluster} ${
                  isActive ? styles.badgeActive : styles.badgeCollapsed
                }`}
              >
                <span className={styles.metaBadge}>{mood.tag}</span>
                <span className={styles.categoryBadge}>{project.field}</span>
              </div>

              {/* Typography Layer: Un-squished text with deliberate opacity & translation staging */}
              <div className={styles.typographyStage}>
                {/* Project Title: Rotated upright when collapsed, horizontal when active */}
                <div
                  className={`${styles.morphTitle} ${
                    isActive ? styles.titleActive : styles.titleCollapsed
                  }`}
                >
                  <span className={styles.projectIndex}>0{idx + 1}</span>
                  <h3 className={styles.projectName}>{project.name}</h3>
                </div>

                {/* Content Block: Stable non-wrapping geometry that glides in only when active */}
                <div
                  className={`${styles.contentReveal} ${
                    isActive ? styles.revealActive : styles.revealCollapsed
                  }`}
                >
                  <div className={styles.contentInner}>
                    <p className={styles.projectLine}>{project.line}</p>
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
            </div>
          );
        })}
      </div>
    </div>
  );
}
