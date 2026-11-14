"use client";

import { Fragment, useRef, useSyncExternalStore } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import VariableProximityText from "@/components/ui/text/VariableProximityText";
import { useHomeMotion } from "./HomeMotion";
import { aboutPreviewContent } from "@/lib/content/about";
import styles from "./AboutPreview.module.css";

const emptySubscribe = () => () => {};

interface WordRun {
  readonly text: string;
  readonly className?: string;
}

function ScrubWord({
  word,
  index,
  total,
  progress,
  range,
  className,
  trailingSpace = true,
}: {
  word: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
  range: readonly [number, number];
  className?: string;
  trailingSpace?: boolean;
}) {
  const [start, end] = range;
  const span = end - start;
  const wStart = start + (index / total) * span;
  const wEnd = start + ((index + 1) / total) * span;
  const opacity = useTransform(progress, [wStart, wEnd], [0.22, 1]);
  const y = useTransform(progress, [wStart, wEnd], [4, 0]);

  return (
    <motion.span
      style={{ opacity, y, display: "inline-block", willChange: "opacity, transform" }}
      className={className}
    >
      {word}
      {trailingSpace ? "\u00A0" : null}
    </motion.span>
  );
}

function EditorialParagraph({
  runs,
  className,
  progress,
  range,
  motionEnabled,
}: {
  runs: readonly WordRun[];
  className: string;
  progress: MotionValue<number>;
  range: readonly [number, number];
  motionEnabled: boolean;
}) {
  if (!motionEnabled) {
    return (
      <p className={className}>
        {runs.map((run, idx) =>
          run.className ? (
            <span key={idx} className={run.className}>
              {run.text}
            </span>
          ) : (
            <Fragment key={idx}>{run.text}</Fragment>
          ),
        )}
      </p>
    );
  }

  // Pre-calculate total tokens for normalized scrub progress across entire paragraph
  const runTokenLists: Array<{ className?: string; words: string[] }> = [];
  let totalTokens = 0;

  for (const run of runs) {
    const parts = run.text.trim().split(/\s+/).filter(Boolean);
    const words: string[] = [];
    for (const part of parts) {
      if (words.length > 0 && /^[,.:;!?)]+$/.test(part)) {
        words[words.length - 1] += part;
      } else if (words.length === 0 && runTokenLists.length > 0 && /^[,.:;!?)]+$/.test(part)) {
        const prevList = runTokenLists[runTokenLists.length - 1];
        if (prevList.words.length > 0) {
          prevList.words[prevList.words.length - 1] += part;
        } else {
          words.push(part);
          totalTokens++;
        }
      } else {
        words.push(part);
        totalTokens++;
      }
    }
    runTokenLists.push({ className: run.className, words });
  }

  let globalTokenIndex = 0;

  return (
    <p className={className}>
      {runTokenLists.map((runItem, rIdx) => {
        const runContent = runItem.words.map((word, wIdx) => {
          const idx = globalTokenIndex++;
          const isLastInRun = wIdx === runItem.words.length - 1;
          const isLastOverall = idx === totalTokens - 1;
          return (
            <ScrubWord
              key={`${idx}-${word}`}
              word={word}
              index={idx}
              total={totalTokens}
              progress={progress}
              range={range}
              trailingSpace={!isLastOverall && (!isLastInRun || rIdx < runTokenLists.length - 1)}
            />
          );
        });

        return runItem.className ? (
          <span key={rIdx} className={runItem.className}>
            {runContent}
          </span>
        ) : (
          <Fragment key={rIdx}>{runContent}</Fragment>
        );
      })}
    </p>
  );
}

export default function AboutPreview() {
  const sectionRef = useRef<HTMLElement>(null);
  const isHydrated = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const reduced = useReducedMotion();
  const { paused } = useHomeMotion();
  const motionEnabled = isHydrated && !reduced && !paused;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.9", "start 0.12"],
  });

  const portraitY = useTransform(scrollYProgress, [0, 1], [18, -14]);
  const portraitScale = useTransform(scrollYProgress, [0, 0.7], [0.98, 1]);

  return (
    <section
      ref={sectionRef}
      id="about"
      className={styles.section}
      aria-labelledby="about-preview-heading"
    >
      <span id="about-preview" aria-hidden="true" style={{ position: "absolute", top: 0 }} />
      <div className={styles.inner}>
        <header className={styles.heading}>
          <h2 id="about-preview-heading" className={styles.sectionTitle}>
            <VariableProximityText
              text={aboutPreviewContent.heading}
              as="span"
              fromWeight={440}
              toWeight={860}
              radius={180}
              dotColor="var(--gold, #b99d73)"
            />
          </h2>
        </header>

        <div className={styles.canvas}>
          <div className={styles.leadBlock}>
            <EditorialParagraph
              className={styles.leadStatement}
              progress={scrollYProgress}
              range={[0.04, 0.34]}
              motionEnabled={motionEnabled}
              runs={[
                { text: aboutPreviewContent.lead.before },
                { text: aboutPreviewContent.lead.emphasis, className: styles.leadEmphasis },
                { text: aboutPreviewContent.lead.after },
              ]}
            />
          </div>

          <motion.figure
            className={styles.portraitPlate}
            aria-label="Portrait of Vishva Patel"
            style={motionEnabled ? { y: portraitY, scale: portraitScale } : undefined}
          >
            <div className={styles.portraitAura} aria-hidden="true" />
            <Image
              src="/avatar/vishva-avatar-3d.png"
              alt="Stylized portrait of Vishva Patel"
              width={935}
              height={1024}
              className={styles.portraitImage}
            />
          </motion.figure>

          <div className={styles.bodyBlock}>
            <EditorialParagraph
              className={styles.bodyStatement}
              progress={scrollYProgress}
              range={[0.30, 0.64]}
              motionEnabled={motionEnabled}
              runs={[
                { text: aboutPreviewContent.body.intro },
                { text: aboutPreviewContent.body.spaceHighlight, className: styles.bodyGold },
                { text: aboutPreviewContent.body.middle1 },
                { text: aboutPreviewContent.body.theoryHighlight, className: styles.bodyCyan },
                { text: aboutPreviewContent.body.middle2 },
                { text: aboutPreviewContent.body.systemsHighlight, className: styles.bodyGold },
                { text: aboutPreviewContent.body.conclusion },
              ]}
            />
          </div>

          <div className={styles.convictionBlock}>
            <EditorialParagraph
              className={styles.convictionStatement}
              progress={scrollYProgress}
              range={[0.60, 0.94]}
              motionEnabled={motionEnabled}
              runs={[
                { text: aboutPreviewContent.conviction.intro, className: styles.convictionIntro },
                { text: aboutPreviewContent.conviction.statement, className: styles.convictionStrong },
              ]}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
