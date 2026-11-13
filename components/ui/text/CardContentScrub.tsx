"use client";

import { useSyncExternalStore } from "react";
import { motion, useTransform, useReducedMotion, type MotionValue } from "framer-motion";

const emptySubscribe = () => () => {};
function useIsHydrated() {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
}

interface CapabilityItem {
  title: string;
}

interface CardContentScrubProps {
  description: string;
  items: readonly CapabilityItem[];
  cardIndex: number; // 0 to 4
  progress: MotionValue<number>;
  isHovered: boolean;
  isSelected: boolean;
  enabled: boolean;
  styles: {
    cardDesc: string;
    capabilitiesList: string;
    capabilityRow: string;
    capabilityIndex: string;
    capabilityTitle: string;
  };
}

function ScrubbedWord({
  word,
  index,
  total,
  range,
  progress,
  isHovered,
  enabled,
}: {
  word: string;
  index: number;
  total: number;
  range: [number, number, number, number];
  progress: MotionValue<number>;
  isHovered: boolean;
  enabled: boolean;
}) {
  const [enterStart, enterEnd, dwellEnd, exitEnd] = range;
  const enterSpan = enterEnd - enterStart;
  const wordStart = enterStart + (index / total) * enterSpan;
  const wordEnd = enterStart + ((index + 1) / total) * enterSpan;

  const opacity = useTransform(progress, (latest) => {
    if (isHovered || !enabled) return 1;
    if (latest < wordStart) return 0.28;
    if (latest <= wordEnd) {
      const frac = (latest - wordStart) / (wordEnd - wordStart);
      return 0.28 + frac * 0.72;
    }
    if (latest <= dwellEnd) return 1.0;
    if (latest <= exitEnd) {
      const frac = (latest - dwellEnd) / (exitEnd - dwellEnd);
      return 1.0 - frac * 0.65;
    }
    return 0.35;
  });

  const y = useTransform(progress, (latest) => {
    if (isHovered || !enabled) return 0;
    if (latest < wordStart) return 3;
    if (latest <= wordEnd) {
      const frac = (latest - wordStart) / (wordEnd - wordStart);
      return 3 * (1 - frac);
    }
    return 0;
  });

  return (
    <motion.span
      style={{
        display: "inline-block",
        opacity,
        y,
        willChange: "opacity, transform",
      }}
    >
      {word}
      {"\u00A0"}
    </motion.span>
  );
}

function ScrubbedCapabilityRow({
  item,
  index,
  range,
  progress,
  isHovered,
  enabled,
  styles,
}: {
  item: CapabilityItem;
  index: number;
  range: [number, number, number, number];
  progress: MotionValue<number>;
  isHovered: boolean;
  enabled: boolean;
  styles: CardContentScrubProps["styles"];
}) {
  const [start, end, dwellEnd, exitEnd] = range;

  const opacity = useTransform(progress, (latest) => {
    if (isHovered || !enabled) return 1;
    if (latest < start) return 0.28;
    if (latest <= end) {
      const frac = (latest - start) / (end - start);
      return 0.28 + frac * 0.72;
    }
    if (latest <= dwellEnd) return 1.0;
    if (latest <= exitEnd) {
      const frac = (latest - dwellEnd) / (exitEnd - dwellEnd);
      return 1.0 - frac * 0.65;
    }
    return 0.35;
  });

  const x = useTransform(progress, (latest) => {
    if (isHovered || !enabled) return 0;
    if (latest < start) return 6;
    if (latest <= end) {
      const frac = (latest - start) / (end - start);
      return 6 * (1 - frac);
    }
    return 0;
  });

  return (
    <motion.div
      className={styles.capabilityRow}
      style={{
        opacity,
        x,
        willChange: "opacity, transform",
      }}
    >
      <span className={styles.capabilityIndex}>0{index + 1}</span>
      <span className={styles.capabilityTitle}>{item.title}</span>
    </motion.div>
  );
}

export default function CardContentScrub({
  description,
  items,
  cardIndex,
  progress,
  isHovered,
  enabled,
  styles,
}: CardContentScrubProps) {
  const isHydrated = useIsHydrated();
  const reduced = useReducedMotion();

  // Strictly non-decreasing ranges for each card's scroll timeline
  let descRange: [number, number, number, number];
  let capRanges: [number, number, number, number][];

  if (cardIndex === 0) {
    descRange = [0.005, 0.035, 0.12, 0.18];
    capRanges = [
      [0.020, 0.035, 0.12, 0.18],
      [0.035, 0.050, 0.12, 0.18],
      [0.050, 0.065, 0.12, 0.18],
    ];
  } else if (cardIndex === 4) {
    descRange = [0.64, 0.73, 0.96, 0.99];
    capRanges = [
      [0.70, 0.73, 0.96, 0.99],
      [0.72, 0.75, 0.96, 0.99],
      [0.74, 0.77, 0.96, 0.99],
    ];
  } else {
    const base = 0.10 + (cardIndex - 1) * 0.18;
    descRange = [base, base + 0.08, base + 0.16, base + 0.23];
    capRanges = [
      [base + 0.06, base + 0.09, base + 0.16, base + 0.23],
      [base + 0.08, base + 0.11, base + 0.16, base + 0.23],
      [base + 0.10, base + 0.13, base + 0.16, base + 0.23],
    ];
  }

  const words = description.split(/\s+/);

  if (!isHydrated || reduced) {
    return (
      <>
        <p className={styles.cardDesc}>{description}</p>
        <div className={styles.capabilitiesList}>
          {items.map((item, itemIdx) => (
            <div key={`sub-${cardIndex}-${itemIdx}`} className={styles.capabilityRow}>
              <span className={styles.capabilityIndex}>0{itemIdx + 1}</span>
              <span className={styles.capabilityTitle}>{item.title}</span>
            </div>
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      {/* Description with Scroll Scrub Light-Up per Word */}
      <p className={styles.cardDesc}>
        {words.map((word, wIdx) => (
          <ScrubbedWord
            key={`cw-${cardIndex}-${wIdx}`}
            word={word}
            index={wIdx}
            total={words.length}
            range={descRange}
            progress={progress}
            isHovered={isHovered}
            enabled={enabled}
          />
        ))}
      </p>

      {/* 3 Capability Points with Sequential Scroll Scrub Light-Up */}
      <div className={styles.capabilitiesList}>
        {items.map((item, itemIdx) => (
          <ScrubbedCapabilityRow
            key={`sub-${cardIndex}-${itemIdx}`}
            item={item}
            index={itemIdx}
            range={capRanges[itemIdx] || capRanges[0]}
            progress={progress}
            isHovered={isHovered}
            enabled={enabled}
            styles={styles}
          />
        ))}
      </div>
    </>
  );
}
