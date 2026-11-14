"use client";

import { useState, useRef, useEffect, useCallback, MouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { featuredProjects } from "@/lib/content/projects";
import { projectCovers } from "@/lib/content/project-covers";
import { ArrowUpRight, Compass, Sparkles } from "lucide-react";
import styles from "./AccordionParallaxDemo.module.css";

const projectMoods = [
  { primary: "rgba(0, 174, 189, 0.18)", border: "rgba(0, 174, 189, 0.4)", tag: "WIRELESS GRAPH LAB" },
  { primary: "rgba(185, 157, 115, 0.18)", border: "rgba(185, 157, 115, 0.4)", tag: "MULTI-AGENT RL" },
  { primary: "rgba(0, 174, 189, 0.22)", border: "rgba(0, 174, 189, 0.45)", tag: "BIOMETRIC AUTH" },
  { primary: "rgba(185, 157, 115, 0.2)", border: "rgba(185, 157, 115, 0.45)", tag: "HARDWARE SECURITY" },
];

export default function AccordionParallaxDemo() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const runwayRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Scroll-Triggered Pinning & Active Slide Computation
  useEffect(() => {
    const onScroll = () => {
      const runway = runwayRef.current;
      if (!runway) return;

      const rect = runway.getBoundingClientRect();
      const scrollableDistance = runway.offsetHeight - window.innerHeight;
      if (scrollableDistance <= 0) return;

      // Progress from 0 to 1 as runway passes through viewport
      const currentScroll = -rect.top;
      const progress = Math.max(0, Math.min(1, currentScroll / scrollableDistance));
      setScrollProgress(progress);

      // Map progress to 4 projects: 0..0.25 -> 0, 0.25..0.5 -> 1, 0.5..0.75 -> 2, 0.75..1 -> 3
      const numProjects = featuredProjects.length;
      const nextIdx = Math.min(numProjects - 1, Math.floor(progress * numProjects));
      setActiveIdx(nextIdx);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Cursor Parallax Inspection on Active Card
  const handleMouseMove = useCallback((e: MouseEvent<HTMLDivElement>, idx: number) => {
    if (idx !== activeIdx) return;
    const card = cardRefs.current[idx];
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    card.style.setProperty("--mouse-parallax-x", `${x * 40}px`);
    card.style.setProperty("--mouse-parallax-y", `${y * 28}px`);
  }, [activeIdx]);

  const handleMouseLeave = useCallback((idx: number) => {
    const card = cardRefs.current[idx];
    if (!card) return;
    card.style.setProperty("--mouse-parallax-x", "0px");
    card.style.setProperty("--mouse-parallax-y", "0px");
  }, []);

  // Click on tab smoothly scrolls the runway to that project's region
  const jumpToProject = (idx: number) => {
    const runway = runwayRef.current;
    if (!runway) return;
    const scrollableDistance = runway.offsetHeight - window.innerHeight;
    const targetY = runway.offsetTop + (idx / featuredProjects.length) * scrollableDistance + 10;
    window.scrollTo({ top: targetY, behavior: "smooth" });
    setActiveIdx(idx);
  };

  const currentMood = projectMoods[activeIdx] || projectMoods[0];

  return (
    <div className={styles.runway} ref={runwayRef}>
      {/* Sticky Fullscreen Stage */}
      <div className={styles.stickyStage}>
        {/* Dynamic Atmosphere Aura synced to active project */}
        <div
          className={styles.ambientAura}
          style={{
            background: `radial-gradient(circle at 55% 45%, ${currentMood.primary} 0%, rgba(8, 7, 11, 0) 65%)`,
          }}
        />

        <div className={styles.stageContent}>
          {/* Header with Live Scroll Progress Indicator */}
          <div className={styles.header}>
            <div>
              <div className={styles.tagLine}>
                <Compass size={13} className={styles.tagIcon} />
                <span className={styles.tagText}>SCROLL-TRIGGERED ACCORDION · PARALLAX ENGINE</span>
              </div>
              <h1 className={styles.title}>Smooth Accordion with Parallax</h1>
            </div>

            <div className={styles.scrollTracker}>
              <div className={styles.scrollInfo}>
                <span className={styles.currentSlide}>0{activeIdx + 1}</span>
                <span className={styles.slash}>/</span>
                <span className={styles.totalSlides}>0{featuredProjects.length}</span>
              </div>
              <div className={styles.progressTrack}>
                <div
                  className={styles.progressBar}
                  style={{ width: `${Math.max(6, scrollProgress * 100)}%` }}
                />
              </div>
              <span className={styles.scrollHint}>SCROLL TO UNROLL</span>
            </div>
          </div>

          {/* Horizontal Accordion Deck */}
          <div className={styles.accordionContainer}>
            {featuredProjects.map((project, idx) => {
              const isActive = activeIdx === idx;
              const cover = projectCovers[project.kind];
              const mood = projectMoods[idx];

              // Scroll parallax image shift calculation
              const phase = (scrollProgress * featuredProjects.length) - idx;
              const scrollParallaxX = Math.max(-35, Math.min(35, phase * 28));

              return (
                <div
                  key={project.name}
                  ref={(el) => {
                    cardRefs.current[idx] = el;
                  }}
                  className={`${styles.panel} ${isActive ? styles.panelActive : styles.panelCollapsed}`}
                  onClick={() => jumpToProject(idx)}
                  onMouseMove={(e) => handleMouseMove(e, idx)}
                  onMouseLeave={() => handleMouseLeave(idx)}
                  aria-expanded={isActive}
                  style={{
                    borderColor: isActive ? mood.border : undefined,
                  }}
                >
                  {/* Parallax Image Background */}
                  <div className={styles.imageViewport}>
                    <div
                      className={styles.imageInner}
                      style={{
                        transform: `translate3d(calc(var(--mouse-parallax-x, 0px) + ${scrollParallaxX}px), var(--mouse-parallax-y, 0px), 0) scale(${isActive ? 1.14 : 1.25})`,
                      }}
                    >
                      <Image
                        src={cover.image}
                        alt={cover.alt}
                        fill
                        sizes="(max-width: 900px) 100vw, 1100px"
                        priority
                        className={styles.coverImg}
                      />
                    </div>
                    <div className={styles.scrimOverlay} />
                  </div>

                  {/* Collapsed Tab View */}
                  {!isActive && (
                    <div className={styles.collapsedBar}>
                      <span className={styles.collapsedIndex}>0{idx + 1}</span>
                      <span className={styles.collapsedTitle}>{project.name}</span>
                      <span className={styles.collapsedIndicator} />
                    </div>
                  )}

                  {/* Expanded Active Panel Content */}
                  {isActive && (
                    <div className={styles.expandedContent}>
                      <div className={styles.expandedHeader}>
                        <div className={styles.badgeCluster}>
                          <span className={styles.metaBadge}>{mood.tag}</span>
                          <span className={styles.categoryBadge}>{project.field}</span>
                        </div>
                        <span className={styles.syncStatus}>
                          <Sparkles size={13} />
                          <span>SYNCHRONIZED VIEW</span>
                        </span>
                      </div>

                      <div className={styles.expandedFooter}>
                        <div className={styles.infoCard}>
                          <h2 className={styles.projectHeading}>{project.name}</h2>
                          <p className={styles.projectLine}>{project.line}</p>

                          <div className={styles.metricsRow}>
                            <div className={styles.metricItem}>
                              <span className={styles.metricLabel}>VERIFICATION</span>
                              <span className={styles.metricVal}>Source Fixture</span>
                            </div>
                            <div className={styles.metricItem}>
                              <span className={styles.metricLabel}>ARCHITECTURE</span>
                              <span className={styles.metricVal}>Validated State</span>
                            </div>
                          </div>

                          <Link href={project.href} className={styles.actionBtn}>
                            <span>Open {project.name} Project</span>
                            <ArrowUpRight size={18} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Quick Click Jump Bar */}
          <div className={styles.tabNav}>
            {featuredProjects.map((p, idx) => (
              <button
                key={p.name}
                className={`${styles.tabBtn} ${activeIdx === idx ? styles.tabBtnActive : ""}`}
                onClick={() => jumpToProject(idx)}
              >
                <span className={styles.tabNum}>0{idx + 1}</span>
                <span className={styles.tabLabel}>{p.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
