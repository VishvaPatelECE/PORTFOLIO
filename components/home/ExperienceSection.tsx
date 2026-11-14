"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import NeonBorder from "@/components/ui/NeonBorder";
import VariableProximityText from "@/components/ui/text/VariableProximityText";
import { useHomeMotion } from "./HomeMotion";
import { trackPortfolioEvent } from "@/lib/analytics/ga4";
import styles from "./ExperienceSection.module.css";

export default function ExperienceSection() {
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { paused } = useHomeMotion();

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      {
        threshold: 0.35,
        rootMargin: "-10% 0px -15% 0px",
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const isBorderActive = isInView && !reduced;

  return (
    <section
      ref={sectionRef}
      id="experience"
      className={styles.section}
      aria-labelledby="experience-title"
      tabIndex={-1}
    >
      {/* Atmosphere Aura synced with Projects */}
      <div className={styles.ambientAura} aria-hidden="true" />

      <div className={styles.stageInner}>
        {/* Section Header: Title with Proximity Font-Weight Ripple Hover */}
        <header className={styles.heading}>
          <div className={styles.headingLeft}>
            <h2 id="experience-title" className={styles.sectionTitle}>
              <VariableProximityText
                text="Experience"
                as="span"
                fromWeight={440}
                toWeight={860}
                radius={180}
                dotColor="var(--gold, #b99d73)"
              />
            </h2>
          </div>
        </header>

        {/* Experience Card with Stable Golden Neon Border matching Skills & Projects */}
        <article
          className={`${styles.experienceCard} ${isBorderActive ? styles.cardActive : ""}`}
          aria-labelledby="experience-role-title"
        >
          {/* Travelling Golden Neon Perimeter Beam: only active when viewer is on Experience section */}
          {isBorderActive && (
            <NeonBorder
              color="#b99d73"
              borderRadiusPx={24}
              thickness={5.5}
              borderSize={46}
              glow={26}
              speed={16}
              paused={paused}
            />
          )}

          {/* Card Content Layer */}
          <div className={styles.cardContent}>
            {/* Header Structure: Clean Two-Column Hierarchy (No divider lines) */}
            <div className={styles.entryHeader}>
              <div className={styles.roleGroup}>
                <h3 id="experience-role-title" className={styles.roleTitle}>
                  AI Research Intern
                </h3>
                <div className={styles.affiliationBlock}>
                  <p className={styles.deptName}>
                    Department of Artificial Intelligence (DoAI)
                  </p>
                  <p className={styles.instituteName}>
                    Sardar Vallabhbhai National Institute of Technology (SVNIT)
                  </p>
                </div>
              </div>

              {/* Right Meta Block: Dates and Location centered */}
              <div className={styles.metaBlock}>
                <span className={styles.dateRangeWhite}>May 2026 - July 2026</span>
                <span className={styles.locationGold}>Surat, Gujarat</span>
              </div>
            </div>

            {/* Research Focus */}
            <div className={styles.sectionBlock}>
              <h4 className={styles.subheadLabel}>
                Research Focus<span className={styles.subheadDot}>.</span>
              </h4>
              <p className={styles.overviewText}>
                Graph-based multi-agent learning for decentralized radio resource allocation in vehicular wireless networks.
              </p>
            </div>

            {/* Key Contributions */}
            <div className={styles.sectionBlock}>
              <h4 className={styles.subheadLabel}>Key Contributions</h4>
              <ul className={styles.bulletList} aria-label="Key internship contributions">
                <li className={styles.bulletItem}>
                  <span className={styles.bulletDot} aria-hidden="true" />
                  <p className={styles.bulletText}>
                    Architected and developed a C-V2X simulation environment integrating SUMO/TraCI mobility with 3GPP-based wireless channel modelling.
                  </p>
                </li>
                <li className={styles.bulletItem}>
                  <span className={styles.bulletDot} aria-hidden="true" />
                  <p className={styles.bulletText}>
                    Investigated graph-based multi-agent reinforcement learning for decentralized radio resource allocation.
                  </p>
                </li>
                <li className={styles.bulletItem}>
                  <span className={styles.bulletDot} aria-hidden="true" />
                  <p className={styles.bulletText}>
                    Designed paired-seed benchmarking against state-matched baselines, evaluating learned-policy performance and the limits of learned coordination.
                  </p>
                </li>
              </ul>
            </div>

            {/* Action: Minimalist Editorial Certificate Link */}
            <div className={styles.actionsRow}>
              <Link
                href="/certificates/SVNIT_Internship_Certificate.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.editorialCertLink}
                aria-label="View SVNIT Internship Certificate PDF (opens in new tab)"
                onClick={() => {
                  trackPortfolioEvent("cta_click", {
                    cta_id: "experience_view_certificate",
                    target: "/certificates/SVNIT_Internship_Certificate.pdf",
                    source_surface: "home_experience",
                  });
                }}
              >
                <span>View Certificate (PDF)</span>
                <ArrowUpRight className={styles.editorialArrow} size={15} />
              </Link>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
