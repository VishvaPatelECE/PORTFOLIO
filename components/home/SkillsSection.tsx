"use client";

import { useRef, useState, useEffect, useSyncExternalStore, type CSSProperties } from "react";
import { motion, useScroll, useTransform, useReducedMotion, useMotionValueEvent, type Variants } from "framer-motion";
import {
  skillsHeader,
  kineticLines,
  disciplineCards,
  type DisciplineCard,
} from "@/lib/content/skills";
import { useHomeMotion } from "./HomeMotion";
import NeonBorder from "@/components/ui/NeonBorder";
import VariableProximityText from "@/components/ui/text/VariableProximityText";
import TextRoll3D from "@/components/ui/text/TextRoll3D";
import ShimmerText from "@/components/ui/text/ShimmerText";
import { TextFXProvider, useTextFX } from "@/components/ui/text/TextFXContext";
import styles from "./SkillsSection.module.css";

const emptySubscribe = () => () => {};
function useIsHydrated() {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
}

function DisciplineCardItem({
  card,
  index,
  reduced,
  isSelected,
  activeCardIndex,
}: {
  card: DisciplineCard;
  index: number;
  reduced: boolean | null;
  isSelected: boolean;
  activeCardIndex: number | null;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { config, headingStyle, headingSizePx } = useTextFX();

  const isGold = index % 2 === 1;
  const accentClass = isGold ? styles.cardGold : styles.cardCyan;
  const accentColor = isGold ? "var(--gold)" : "var(--signal)";

  const titleFontClass =
    headingStyle === "zarathustra"
      ? styles.titleZarathustra
      : headingStyle === "cakra"
      ? styles.titleCakra
      : headingStyle === "bluu-next"
      ? styles.titleBluuNext
      : headingStyle === "geom"
      ? styles.titleGeom
      : headingStyle === "bagnard"
      ? styles.titleBagnard
      : headingStyle === "nouveau"
      ? styles.titleNouveau
      : headingStyle === "getai-grotesk"
      ? styles.titleGetaiGrotesk
      : headingStyle === "melete"
      ? styles.titleMelete
      : headingStyle === "texturina"
      ? styles.titleTexturina
      : headingStyle === "fraunces"
      ? styles.titleFraunces
      : headingStyle === "instrument"
      ? styles.titleInstrument
      : headingStyle === "syne"
      ? styles.titleSyne
      : headingStyle === "anybody"
      ? styles.titleAnybody
      : styles.titleCakra;

  // Fluid Lens Card Transition:
  // When selected, card smoothly focuses with subtle expansion and zero blur.
  // Inactive cards gently recede with scale 0.91, opacity 0.38, and blur(2px).
  const cardAnimate = reduced
    ? { scale: 1, rotateY: 0, z: 0, opacity: 1, y: 0, filter: "blur(0px)" }
    : isSelected
    ? { scale: 1.04, rotateY: 0, z: 15, opacity: 1, y: 0, filter: "blur(0px)" }
    : activeCardIndex !== null
    ? { scale: 0.91, rotateY: 0, z: 0, opacity: 0.38, y: 0, filter: "blur(2px)" }
    : { scale: 0.96, rotateY: 0, z: 0, opacity: 0.75, y: 0, filter: "blur(0px)" };

  return (
    <motion.article
      ref={cardRef}
      className={`${styles.card} ${accentClass} ${isSelected ? styles.cardSelected : ""}`}
      initial={reduced ? false : { opacity: 0, y: 24 }}
      animate={cardAnimate}
      transition={{
        duration: 0.45,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {/* Traveling Neon Perimeter Beam: only when motion is active */}
      {isSelected && !reduced && (
        <NeonBorder
          color={isGold ? "#b99d73" : "#00aebd"}
          borderRadiusPx={22}
          thickness={5.5}
          borderSize={46}
          glow={25}
          speed={16}
        />
      )}

      {/* Top Header Row: Title on left, Watermark number on right */}
      <div className={styles.cardTop}>
        <h3
          className={`${styles.cardTitle} ${titleFontClass}`}
          style={{ "--card-title-size": `${headingSizePx}px` } as CSSProperties}
        >
          {config.textRoll3D ? (
            <TextRoll3D
              text={card.title}
              accentColor={accentColor}
              isActive={isSelected}
            />
          ) : (
            card.title
          )}
        </h3>
        <div className={styles.cardNumber} aria-hidden="true">
          {config.shimmer && isSelected ? (
            <ShimmerText text={card.index} theme={isGold ? "gold" : "cyan"} />
          ) : (
            card.index
          )}
        </div>
      </div>

      {/* Description: Pushed down close to the capabilities list */}
      <p className={styles.cardDesc}>{card.description}</p>

      {/* 3 Large, Clean Capability Points with Full-Width Hairline Dividers */}
      <div className={styles.capabilitiesList}>
        {card.items.map((item, itemIdx) => (
          <div key={`sub-${card.index}-${itemIdx}`} className={styles.capabilityRow}>
            <span className={styles.capabilityIndex}>0{itemIdx + 1}</span>
            <span className={styles.capabilityTitle}>{item.title}</span>
          </div>
        ))}
      </div>
    </motion.article>
  );
}

const kineticContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

const kineticLineVariants: Variants = {
  hidden: { y: "115%", opacity: 0.05, filter: "blur(8px)" },
  visible: {
    y: "0%",
    opacity: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.85,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

/** PART 1: Typographic Kinetic Stream directly beneath Hero (No tubes background = butter smooth scroll) */
export function SkillsKineticStream() {
  const kineticRef = useRef<HTMLDivElement>(null);
  const isHydrated = useIsHydrated();
  const reduced = useReducedMotion();
  const { paused } = useHomeMotion();
  const effectiveReduced = isHydrated && Boolean(reduced);

  const isMotionActive = isHydrated && !reduced && !paused;

  const { scrollYProgress: kineticProgress } = useScroll({
    target: kineticRef,
    offset: ["start end", "end start"],
  });

  const xLine1 = useTransform(kineticProgress, [0, 1], ["-3%", "4%"]);
  const xLine2 = useTransform(kineticProgress, [0, 1], ["4%", "-4%"]);
  const xLine3 = useTransform(kineticProgress, [0, 1], ["-4%", "4%"]);
  const xLine4 = useTransform(kineticProgress, [0, 1], ["4%", "-3%"]);

  const lineTransforms = [xLine1, xLine2, xLine3, xLine4];

  return (
    <section
      id="skills"
      className={styles.kineticSection}
      aria-label="Core Engineering Disciplines Kinetic Stream"
    >
      <motion.div
        ref={kineticRef}
        className={styles.kineticArea}
        initial={effectiveReduced ? false : "hidden"}
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={kineticContainerVariants}
      >
        {kineticLines.map((line, idx) => {
          const transform = isMotionActive ? lineTransforms[idx] : undefined;

          return (
            <div key={line.id} className={styles.lineMask}>
              <motion.div variants={effectiveReduced ? undefined : kineticLineVariants}>
                <motion.div
                  className={styles.kineticLine}
                  style={transform ? { x: transform } : undefined}
                >
                  {line.segments.map((seg, sIdx) => {
                    if ("bar" in seg && seg.bar) {
                      const barClass =
                        seg.color === "gold"
                          ? styles.accentBarGold
                          : styles.accentBarCyan;

                      return (
                        <span
                          key={`bar-${idx}-${sIdx}`}
                          className={`${styles.accentBar} ${barClass}`}
                          aria-hidden="true"
                        />
                      );
                    }

                    const isItalic = "style" in seg && seg.style === "italic";
                    return (
                      <span
                        key={`text-${idx}-${sIdx}`}
                        className={isItalic ? styles.italicText : undefined}
                      >
                        {"text" in seg ? seg.text : ""}
                      </span>
                    );
                  })}
                </motion.div>
              </motion.div>
            </div>
          );
        })}
      </motion.div>
    </section>
  );
}

/** PART 2: Pinned Horizontal Scroll Section with Staged First-Visit Reveal */
export function SkillsCarousel() {
  const carouselContainerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const [scrollDist, setScrollDist] = useState(0);
  const isHydrated = useIsHydrated();
  const reduced = useReducedMotion();
  const { paused } = useHomeMotion();

  const isStaticLayout = isHydrated && (Boolean(reduced) || paused);
  const isMotionActive = isHydrated && !reduced && !paused;

  // Measure exact horizontal travel distance for all 5 cards across desktop & mobile
  useEffect(() => {
    const updateDist = () => {
      if (trackRef.current) {
        const cards = trackRef.current.querySelectorAll("article");
        if (cards.length >= 2) {
          const firstCard = cards[0];
          const lastCard = cards[cards.length - 1];
          const dist = lastCard.offsetLeft - firstCard.offsetLeft;
          if (dist > 100) {
            setScrollDist(dist);
            return;
          }
        }
        const firstCard = trackRef.current.querySelector("article");
        const cardWidth = firstCard ? firstCard.offsetWidth : 520;
        setScrollDist(4 * (cardWidth + 32));
      }
    };
    updateDist();
    let observer: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined" && trackRef.current) {
      observer = new ResizeObserver(updateDist);
      observer.observe(trackRef.current);
    }
    window.addEventListener("resize", updateDist);
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", updateDist);
    };
  }, []);

  const { scrollYProgress: carouselProgress } = useScroll({
    target: carouselContainerRef,
    offset: ["start start", "end end"],
  });

  // Dynamic functional transform: Card 05 reaches center at 0.76 and dwells there through 0.96
  const xTrack = useTransform(carouselProgress, (latest) => {
    const dist = scrollDist > 0 ? scrollDist : 2144;
    const progress = Math.min(1, Math.max(0, (latest - 0.04) / (0.76 - 0.04)));
    return -progress * dist;
  });

  const [activeScrollIndex, setActiveScrollIndex] = useState<number | null>(null);

  useMotionValueEvent(carouselProgress, "change", (latest) => {
    // Only active while the visitor is pinned within the Skills carousel.
    // If above Skills (latest <= 0.005) or scrolled into Projects (latest >= 0.98),
    // no card in Skills should show a border!
    if (latest <= 0.005 || latest >= 0.98) {
      setActiveScrollIndex(null);
      return;
    }
    const norm = Math.min(1, Math.max(0, (latest - 0.04) / (0.76 - 0.04)));
    const nextIdx = Math.min(4, Math.max(0, Math.round(norm * 4)));
    setActiveScrollIndex(nextIdx);
  });

  // Strictly scroll-driven: cursor hover does NOT affect the cards; static/compact views keep all cards crisp
  const activeCardIndex = isMotionActive ? activeScrollIndex : null;

  const { config } = useTextFX();

  return (
    <div
      id="disciplines"
      ref={carouselContainerRef}
      className={styles.carouselContainer}
      data-static={isStaticLayout ? "true" : undefined}
      aria-labelledby="skills-heading"
    >
      <div className={styles.stickyStage}>
        {/* Section Header with Staged First-Visit Reveal */}
        <motion.header
          className={styles.headerBlock}
          initial={isStaticLayout ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.h2
            id="skills-heading"
            className={styles.title}
            initial={isStaticLayout ? false : { opacity: 0, y: 16, filter: "blur(6px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.12 }}
          >
            {config.variableProximity && !reduced ? (
              <>
                <VariableProximityText
                  text="Skills"
                  as="span"
                  fromWeight={440}
                  toWeight={860}
                  radius={160}
                />
                <span className={styles.titleDot}>.</span>
              </>
            ) : (
              <>
                {skillsHeader.title}
                <span className={styles.titleDot}>.</span>
              </>
            )}
          </motion.h2>

          <p className={styles.lead}>
            {skillsHeader.lead}
          </p>
        </motion.header>

        {/* Horizontal Track on Desktop Animated Mode; Grid or Swipe Track Otherwise */}
        <div className={styles.trackViewport}>
          <motion.div
            ref={trackRef}
            className={styles.cardsTrack}
            style={isMotionActive ? { x: xTrack } : undefined}
          >
            {disciplineCards.map((card, idx) => (
              <DisciplineCardItem
                key={card.index}
                card={card}
                index={idx}
                reduced={isStaticLayout}
                isSelected={activeCardIndex === idx}
                activeCardIndex={activeCardIndex}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function SkillsSection() {
  return (
    <TextFXProvider>
      <SkillsKineticStream />
      <SkillsCarousel />
    </TextFXProvider>
  );
}
