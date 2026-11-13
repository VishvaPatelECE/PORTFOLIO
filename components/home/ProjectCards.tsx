"use client";

import { useState, useRef, useCallback, useSyncExternalStore, MouseEvent, KeyboardEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useReducedMotion } from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { featuredProjects } from "@/lib/content/projects";
import { projectCovers } from "@/lib/content/project-covers";
import { projectSlugFromHref, trackPortfolioEvent } from "@/lib/analytics/ga4";
import { useHomeMotion } from "./HomeMotion";
import SignalTubes from "./SignalTubes";
import NeonBorder from "@/components/ui/NeonBorder";
import VariableProximityText from "@/components/ui/text/VariableProximityText";
import styles from "./ProjectCards.module.css";

const projectMoods = [
  { primary: "rgba(0, 174, 189, 0.16)", border: "rgba(0, 174, 189, 0.45)", tag: "WIRELESS GRAPH LAB" },
  { primary: "rgba(185, 157, 115, 0.16)", border: "rgba(185, 157, 115, 0.45)", tag: "MULTI-AGENT RL" },
  { primary: "rgba(0, 174, 189, 0.2)", border: "rgba(0, 174, 189, 0.5)", tag: "BIOMETRIC AUTH" },
  { primary: "rgba(185, 157, 115, 0.18)", border: "rgba(185, 157, 115, 0.5)", tag: "HARDWARE SECURITY" },
];

const emptySubscribe = () => () => {};

export default function ProjectCards({ showTubes = true }: { showTubes?: boolean } = {}) {
  const router = useRouter();
  const root = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mouseRafId = useRef(0);
  const [active, setActive] = useState(0);
  const isHydrated = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const reduced = useReducedMotion();
  const effectiveReduced = isHydrated ? !!reduced : false;
  const { paused, setPaused } = useHomeMotion();

  // Kinetic Cursor Hover — instant, self-stabilizing expansion
  const handleCardPointerEnter = useCallback((idx: number) => {
    setActive(idx);
  }, []);

  const handleCardClick = useCallback((idx: number, href: string) => {
    if (idx === active) {
      const slug = projectSlugFromHref(href);
      if (slug) {
        trackPortfolioEvent("project_open", {
          project_slug: slug,
          source_surface: "home_gallery",
        });
      }
      if (typeof document !== "undefined" && "startViewTransition" in document) {
        document.startViewTransition(() => {
          router.push(href);
        });
      } else {
        router.push(href);
      }
    } else {
      setActive(idx);
    }
  }, [active, router]);

  // Stepper / Keyboard Selection
  const selectCard = useCallback((idx: number) => {
    const nextIdx = Math.max(0, Math.min(featuredProjects.length - 1, idx));
    setActive(nextIdx);
  }, []);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLElement>) => {
    if (e.target !== e.currentTarget) return;
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

  // Cursor Parallax Inspection on Active Card (GPU transform, throttled via rAF)
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

      card.style.setProperty("--mouse-parallax-x", `${x * 28}px`);
      card.style.setProperty("--mouse-parallax-y", `${y * 18}px`);
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

  const currentMood = projectMoods[active] || projectMoods[0];

  return (
    <section
      ref={root}
      id="projects"
      className={styles.section}
      aria-labelledby="project-cards-title"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <span id="systems" aria-hidden="true" className={styles.anchor} />
      <span id="research" aria-hidden="true" className={styles.anchor} />
      {showTubes && <SignalTubes />}

      {/* Atmosphere Aura synced to active project */}
      <div
        className={styles.ambientAura}
        style={{
          background: `radial-gradient(circle at 55% 45%, ${currentMood.primary} 0%, rgba(8, 7, 11, 0) 65%)`,
        }}
      />

      <div className={`${styles.stageInner} wrap`}>
        {/* Section Header with live counter and tactile motion controls */}
        <header className={styles.heading}>
          <div className={styles.headingLeft}>
            <h2 id="project-cards-title">
              <VariableProximityText
                text="Projects"
                as="span"
                fromWeight={440}
                toWeight={860}
                radius={180}
                dotColor="var(--gold, #b99d73)"
              />
            </h2>
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
              disabled={effectiveReduced}
              aria-pressed={paused}
              aria-label={paused ? "Resume motion" : "Pause motion"}
              className={styles.pauseBtn}
            >
              {paused ? <Play size={16} /> : <Pause size={16} />}
            </button>
          </div>
        </header>

        {/* Kinetic Horizontal Accordion Deck — Normal Document Flow */}
        <div className={styles.accordionContainer}>
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
                onClick={(e) => {
                  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
                  handleCardClick(idx, project.href);
                }}
                onKeyDown={(e) => {
                  if (e.target !== e.currentTarget) return;
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    if (!e.repeat) handleCardClick(idx, project.href);
                  } else {
                    handleKeyDown(e);
                  }
                }}
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
                {/* Travelling Neon Perimeter Beam when selected / active */}
                {isActive && !effectiveReduced && (
                  <NeonBorder
                    color={idx % 2 === 0 ? "#00aebd" : "#b99d73"}
                    borderRadiusPx={20}
                    thickness={5.5}
                    borderSize={46}
                    glow={25}
                    speed={16}
                  />
                )}

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
                  className={`${styles.badgeCluster} ${isActive ? styles.badgeActive : styles.badgeCollapsed
                    }`}
                >
                  <span className={styles.metaBadge}>{mood.tag}</span>
                  <span className={styles.categoryBadge}>{project.field}</span>
                </div>

                {/* Typography Layer: Centered vertical titles for closed cards, horizontal for active */}
                <div className={styles.typographyStage}>
                  <div
                    className={`${styles.morphTitle} ${isActive ? styles.titleActive : styles.titleCollapsed
                      }`}
                  >
                    <span className={styles.projectIndex}>0{idx + 1}</span>
                    <h3 className={styles.projectName}>{project.name}</h3>
                  </div>

                  {/* Staged Tagline & Action Button */}
                  <div
                    aria-hidden={!isActive}
                    inert={!isActive}
                    className={`${styles.slidingContainer} ${isActive ? styles.slidingActive : styles.slidingCollapsed
                      }`}
                  >
                    <p className={styles.projectLine}>{project.line}</p>
                    <Link
                      href={project.href}
                      tabIndex={isActive ? 0 : -1}
                      className={styles.actionBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
                        e.preventDefault();
                        handleCardClick(idx, project.href);
                      }}
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
    </section>
  );
}
