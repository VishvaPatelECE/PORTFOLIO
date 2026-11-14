"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { projectCovers, type ProjectCoverKind } from "@/lib/content/project-covers";
import { markDocumentVisited } from "@/lib/darvs-lifecycle";
import styles from "./ProjectHero.module.css";

export interface ProjectHeroProps {
  id: string;
  code?: string;
  title: string;
  subtitle: string;
  kind: ProjectCoverKind;
  tags?: string[];
  actionLink?: {
    href: string;
    label: string;
    isExternal?: boolean;
  };
  metrics?: { label: string; value: string }[];
  instrumentTargetId?: string;
}

export default function ProjectHero({
  id,
  title,
  subtitle,
  kind,
  tags = [],
  actionLink,
}: ProjectHeroProps) {
  const cover = projectCovers[kind];
  const isGold = kind === "hardware" || kind === "research" || id === "usmhacs" || id === "graphmarl";
  const theme = isGold ? "gold" : "cyan";

  return (
    <header className={styles.heroWrapper} aria-label={`${title} Project Overview`}>
      {/* --------------------------------------------------------------------
          EXPANDED FULL-BLEED SPLIT HORIZON HERO (Unenclosed, starts at top: 0)
          Seamless integration: No card borders, no rounded container, no numbering
          -------------------------------------------------------------------- */}
      <div className={styles.stage}>
        {/* Full-Bleed Artwork on Right with Soft Feather Mask */}
        <div className={styles.imageViewport}>
          <Image
            src={cover.image}
            alt={cover.alt}
            fill
            priority
            sizes="(max-width: 900px) 100vw, 65vw"
            className={`${styles.heroImage} project-cover-morph`}
          />
        </div>

        {/* Ambient Obsidian Gradient Scrim Ramp */}
        <div className={styles.scrimLayer} aria-hidden="true" />

        {/* Inner Content Constrained to Standard Site Grid */}
        <div className={styles.innerContainer}>
          <div className={styles.splitLeftCol}>
            {/* Optional Action Navigation (Return to index removed per user request) */}
            {actionLink && (
              <nav className={styles.navRow} aria-label="Project Navigation">
                {actionLink.isExternal ? (
                  <a
                    href={actionLink.href}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.navLink}
                    data-theme={theme}
                  >
                    <span>{actionLink.label}</span>
                    <ArrowUpRight size={13} aria-hidden="true" />
                  </a>
                ) : (
                  <Link
                    href={actionLink.href}
                    className={styles.navLink}
                    data-theme={theme}
                    onClick={() => {
                      if (actionLink.href.startsWith("/#") || actionLink.href.startsWith("#")) {
                        markDocumentVisited();
                      }
                    }}
                  >
                    <span>{actionLink.label}</span>
                  </Link>
                )}
              </nav>
            )}

            {/* Editorial Title & Thesis Cluster (Kicker code title removed per user request) */}
            <div className={styles.titleCluster}>
              <h1 className={styles.projectTitle}>{title}</h1>
              <p className={styles.projectSubtitle}>{subtitle}</p>

              {tags.length > 0 && (
                <div className={styles.tagCluster} data-theme={theme}>
                  {tags.map((tag) => (
                    <span key={tag} className={styles.tagChip} data-theme={theme}>
                      <span className={styles.tagDot} aria-hidden="true" />
                      <span>{tag}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
