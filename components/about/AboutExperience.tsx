"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type KeyboardEvent } from "react";
import { ArrowLeft, ArrowUpRight, Download } from "lucide-react";
import { TrackedAnchor, TrackedLink } from "@/components/analytics/TrackedLink";
import { aboutPageContent } from "@/lib/content/about";
import { links } from "@/lib/content/site";
import styles from "./AboutRedesign.module.css";

type CapabilityFilter = "all" | (typeof aboutPageContent.capabilities)[number]["id"];

const FILTER_OPTIONS: ReadonlyArray<{ id: CapabilityFilter; label: string }> = [
  { id: "all", label: "All Disciplines" },
  { id: "wireless", label: "Wireless & Telecom" },
  { id: "compilers", label: "Compilers & Graphs" },
  { id: "vision", label: "Vision & ML" },
  { id: "hardware", label: "Digital Hardware" },
];

export default function AboutExperience() {
  const [selectedFilter, setSelectedFilter] = useState<CapabilityFilter>("all");

  const visibleCapabilities =
    selectedFilter === "all"
      ? aboutPageContent.capabilities
      : aboutPageContent.capabilities.filter((item) => item.id === selectedFilter);

  const handleTabKeyDown = (e: KeyboardEvent<HTMLButtonElement>, idx: number) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      setSelectedFilter(FILTER_OPTIONS[(idx + 1) % FILTER_OPTIONS.length].id);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      setSelectedFilter(
        FILTER_OPTIONS[(idx - 1 + FILTER_OPTIONS.length) % FILTER_OPTIONS.length].id
      );
    } else if (e.key === "Home") {
      e.preventDefault();
      setSelectedFilter(FILTER_OPTIONS[0].id);
    } else if (e.key === "End") {
      e.preventDefault();
      setSelectedFilter(FILTER_OPTIONS[FILTER_OPTIONS.length - 1].id);
    }
  };

  return (
    <main id="main" className={`${styles.pageMain} wrap`}>
      <Link href="/" className={styles.backLink}>
        <ArrowLeft size={14} aria-hidden="true" />
        <span>Return to Index</span>
      </Link>

      {/* 1. Engineering Manifesto & Portrait Header */}
      <section aria-labelledby="about-hero-title">
        <div className={styles.heroGrid}>
          <div>
            <span className={styles.kicker}>{aboutPageContent.hero.code}</span>
            <h1 id="about-hero-title" className={styles.heroTitle}>
              {aboutPageContent.hero.title}
            </h1>
            <p className={styles.heroSubtitle}>{aboutPageContent.hero.subtitle}</p>

            <div className={styles.highlightsGrid}>
              {aboutPageContent.hero.highlights.map((item) => (
                <div key={item.label} className={styles.highlightCard}>
                  <span className={styles.highlightLabel}>{item.label}</span>
                  <span className={styles.highlightValue}>{item.value}</span>
                </div>
              ))}
            </div>

            <div className={styles.heroActions}>
              <TrackedAnchor
                className="button"
                href={links.cv}
                target="_blank"
                rel="noreferrer"
                eventName="cv_download"
                eventParams={{ source_surface: "about_hero" }}
              >
                Download CV (PDF) <Download size={16} aria-hidden="true" />
              </TrackedAnchor>
              <TrackedLink
                className="text-link"
                href="/experience/svnit"
                eventName="cta_click"
                eventParams={{
                  cta_id: "about_svnit_record",
                  target: "/experience/svnit",
                  source_surface: "about_hero",
                }}
              >
                SVNIT Internship Record <ArrowUpRight size={15} aria-hidden="true" />
              </TrackedLink>
            </div>
          </div>

          <aside className={styles.portraitFrame} aria-label="Portrait and location summary">
            <Image
              src="/avatar/vishva-avatar-3d.png"
              alt="Portrait illustration of Vishva Patel"
              width={935}
              height={1024}
              priority
              className={styles.portraitImage}
            />
            <div className={styles.portraitMeta}>
              <span>Gujarat, India</span>
              <span>Expected May 2027</span>
            </div>
          </aside>
        </div>
      </section>

      {/* 2. Academic Foundations & Verified Credentials */}
      <section className={styles.section} aria-labelledby="about-credentials-title">
        <div className={styles.sectionHeader}>
          <span className={styles.kicker}>02 · ACADEMIC CREDENTIALS</span>
          <h2 id="about-credentials-title" className={styles.sectionTitle}>
            Verified Academic &amp; Examination Record
          </h2>
          <p className={styles.sectionLead}>
            Institutional standing documented directly from university grade transcripts and official national examination scorecards.
          </p>
        </div>

        <div className={styles.twoColGrid}>
          {aboutPageContent.credentials.map((cred) => (
            <article key={cred.id} className={styles.card}>
              <span className={styles.cardKicker}>{cred.kicker}</span>
              <h3 className={styles.cardTitle}>{cred.title}</h3>
              <span className={styles.cardMeta}>
                {cred.organization} · {cred.period}
              </span>
              <div className={styles.metricList}>
                {cred.metrics.map((metric) => (
                  <div key={metric.label} className={styles.metricRow}>
                    <span className={styles.metricLabel}>{metric.label}</span>
                    <span className={styles.metricValue}>{metric.value}</span>
                  </div>
                ))}
              </div>
              <p className={styles.cardNote}>{cred.note}</p>
            </article>
          ))}
        </div>
      </section>

      {/* 3. Research Experience & Empirical Audit Discipline */}
      <section className={styles.section} aria-labelledby="about-research-title">
        <div className={styles.sectionHeader}>
          <span className={styles.kicker}>03 · RESEARCH PROVENANCE</span>
          <h2 id="about-research-title" className={styles.sectionTitle}>
            Certified SVNIT Internship vs. August Continuation
          </h2>
          <p className={styles.sectionLead}>
            Formal faculty-supervised internship work at SVNIT Surat is explicitly separated from subsequent independent paired-seed auditing in August 2026.
          </p>
        </div>

        <div className={styles.twoColGrid}>
          {[
            aboutPageContent.researchTimeline.internship,
            aboutPageContent.researchTimeline.continuation,
          ].map((block) => (
            <article key={block.kicker} className={styles.card}>
              <span className={styles.cardKicker}>{block.kicker}</span>
              <h3 className={styles.cardTitle}>{block.title}</h3>
              <ul className={styles.bulletList}>
                {block.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
              <div className={styles.inlineAction}>
                <TrackedLink
                  href={block.href}
                  className="text-link"
                  eventName="cta_click"
                  eventParams={{
                    cta_id: `about_${block.href.replace(/[^a-z0-9]/gi, "_")}`,
                    target: block.href,
                    source_surface: "about_research_timeline",
                  }}
                >
                  {block.ctaLabel} <ArrowUpRight size={15} aria-hidden="true" />
                </TrackedLink>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 4. Featured Systems Architecture Matrix */}
      <section className={styles.section} aria-labelledby="about-systems-title">
        <div className={styles.sectionHeader}>
          <span className={styles.kicker}>04 · SYSTEMS ARCHITECTURE</span>
          <h2 id="about-systems-title" className={styles.sectionTitle}>
            Four Core Engineering Systems
          </h2>
          <p className={styles.sectionLead}>
            From semantic graph compilation and vehicular scheduling audits to biometric challenge states and combinational access logic.
          </p>
        </div>

        <div className={styles.matrixGrid}>
          {aboutPageContent.systemsMatrix.map((system) => (
            <article key={system.name} className={styles.card}>
              <span className={styles.cardKicker}>{system.domain}</span>
              <h3 className={styles.cardTitle}>{system.name}</h3>
              <p className={styles.cardNote}>{system.role}</p>
              <div className={styles.inlineAction}>
                <TrackedLink
                  href={system.href}
                  className="text-link"
                  eventName="project_open"
                  eventParams={{
                    project_slug: system.slug,
                    source_surface: "about_systems_matrix",
                  }}
                >
                  Inspect {system.name} <ArrowUpRight size={15} aria-hidden="true" />
                </TrackedLink>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 5. Verified Technical Capabilities & Toolchain */}
      <section className={styles.section} aria-labelledby="about-capabilities-title">
        <div className={styles.sectionHeader}>
          <span className={styles.kicker}>05 · VERIFIED CAPABILITIES</span>
          <h2 id="about-capabilities-title" className={styles.sectionTitle}>
            Disciplines Grounded in Implemented Repositories
          </h2>
          <p className={styles.sectionLead}>
            Filter by engineering domain. Every listed method maps directly to code, simulation fixtures, or schematic circuits authored across these projects.
          </p>
        </div>

        <div className={styles.tabBar} role="tablist" aria-label="Filter capabilities by discipline">
          {FILTER_OPTIONS.map((option, idx) => {
            const active = selectedFilter === option.id;
            return (
              <button
                key={option.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setSelectedFilter(option.id)}
                onKeyDown={(e) => handleTabKeyDown(e, idx)}
                className={`${styles.tabButton} ${active ? styles.tabButtonActive : ""}`}
              >
                {option.label}
              </button>
            );
          })}
        </div>

        <div className={styles.capabilityGrid}>
          {visibleCapabilities.map((group) => (
            <article key={group.id} className={styles.card}>
              <span className={styles.cardKicker}>{group.code}</span>
              <h3 className={styles.cardTitle}>{group.discipline}</h3>
              <span className={styles.cardMeta}>{group.focus}</span>
              <ul className={styles.bulletList}>
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p className={styles.cardNote}>{group.provenance}</p>
            </article>
          ))}
        </div>
      </section>

      {/* 6. Hardware Workbench (#robo-car & #hardware-stopwatch preserved) */}
      <section className={styles.section} aria-labelledby="about-workbench-title">
        <div className={styles.sectionHeader}>
          <span className={styles.kicker}>06 · HARDWARE WORKBENCH</span>
          <h2 id="about-workbench-title" className={styles.sectionTitle}>
            Physical Builds &amp; Discrete Lab Instruments
          </h2>
          <p className={styles.sectionLead}>
            Supporting hardware builds preserved as direct workbench references without invented oscilloscope telemetry.
          </p>
        </div>

        <div className={styles.twoColGrid}>
          {aboutPageContent.workbench.map((item) => (
            <article
              key={item.id}
              id={item.id}
              className={`${styles.card} ${styles.workbenchAnchor}`}
            >
              <span className={styles.cardKicker}>{item.kicker}</span>
              <h3 className={styles.cardTitle}>{item.title}</h3>
              <p className={styles.cardNote}>{item.summary}</p>
              <div className={styles.metricList}>
                {item.specs.map((spec) => (
                  <div key={spec.label} className={styles.metricRow}>
                    <span className={styles.metricLabel}>{spec.label}</span>
                    <span className={styles.metricValue}>{spec.value}</span>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 7. Engineering Methodology & Collaboration CTA */}
      <section className={styles.section} aria-labelledby="about-methodology-title">
        <div className={styles.methodPanel}>
          <span className={styles.kicker}>{aboutPageContent.methodology.kicker}</span>
          <h2 id="about-methodology-title" className={styles.methodHeadline}>
            {aboutPageContent.methodology.headline}
          </h2>
          <p className={styles.methodBody}>{aboutPageContent.methodology.body}</p>

          <div className={styles.contactActions}>
            <TrackedAnchor
              className="button"
              href={links.email}
              eventName="contact_click"
              eventParams={{ channel: "email", source_surface: "about_footer" }}
            >
              Email Vishva <ArrowUpRight size={16} aria-hidden="true" />
            </TrackedAnchor>
            <TrackedAnchor
              className="button"
              href={links.github}
              target="_blank"
              rel="noreferrer"
              eventName="contact_click"
              eventParams={{ channel: "github", source_surface: "about_footer" }}
            >
              GitHub <ArrowUpRight size={16} aria-hidden="true" />
            </TrackedAnchor>
            <TrackedAnchor
              className="button"
              href={links.linkedin}
              target="_blank"
              rel="noreferrer"
              eventName="contact_click"
              eventParams={{ channel: "linkedin", source_surface: "about_footer" }}
            >
              LinkedIn <ArrowUpRight size={16} aria-hidden="true" />
            </TrackedAnchor>
            <Link className="text-link" href="/credits">
              Colophon &amp; Sources <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
