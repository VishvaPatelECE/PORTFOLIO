"use client";

import { useRef, useSyncExternalStore } from "react";
import { motion, useScroll, useTransform, useReducedMotion, type MotionValue } from "framer-motion";

const emptySubscribe = () => () => {};
function useIsHydrated() {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
}

interface ScrollRevealTextProps {
  text: string;
  className?: string;
  wordClassName?: string;
  /** Pass an external MotionValue progress from a pinned parent, or let it track its own viewport scroll */
  progress?: MotionValue<number>;
  /** Range within progress [start, end] where reveal happens */
  range?: [number, number];
  as?: "p" | "div" | "h2" | "h3";
}

function Word({
  word,
  index,
  total,
  progress,
  range,
  className,
}: {
  word: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
  range: [number, number];
  className?: string;
}) {
  const [rangeStart, rangeEnd] = range;
  const totalRange = rangeEnd - rangeStart;
  const wordStart = rangeStart + (index / total) * totalRange;
  const wordEnd = rangeStart + ((index + 1) / total) * totalRange;

  const opacity = useTransform(progress, [wordStart, wordEnd], [0.18, 1]);
  const y = useTransform(progress, [wordStart, wordEnd], [3, 0]);
  const blur = useTransform(progress, [wordStart, wordEnd], ["blur(1.5px)", "blur(0px)"]);

  return (
    <motion.span
      style={{
        opacity,
        y,
        filter: blur,
        display: "inline-block",
        willChange: "opacity, transform, filter",
      }}
      className={className}
    >
      {word}
      {"\u00A0"}
    </motion.span>
  );
}

export default function ScrollRevealText({
  text,
  className = "",
  wordClassName = "",
  progress: externalProgress,
  range = [0.02, 0.35],
  as: Component = "p",
}: ScrollRevealTextProps) {
  const internalRef = useRef<HTMLDivElement>(null);
  const isHydrated = useIsHydrated();
  const reduced = useReducedMotion();

  const { scrollYProgress: internalProgress } = useScroll({
    target: internalRef,
    offset: ["start 0.85", "start 0.35"],
  });

  const activeProgress = externalProgress || internalProgress;
  const words = text.split(/\s+/);

  if (!isHydrated || reduced) {
    return (
      <Component ref={internalRef as React.Ref<never>} className={className}>
        {text}
      </Component>
    );
  }

  return (
    <Component ref={internalRef as React.Ref<never>} className={className}>
      {words.map((word, idx) => (
        <Word
          key={`${word}-${idx}`}
          word={word}
          index={idx}
          total={words.length}
          progress={activeProgress}
          range={range}
          className={wordClassName}
        />
      ))}
    </Component>
  );
}

