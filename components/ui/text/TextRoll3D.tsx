"use client";

import { useState, useSyncExternalStore } from "react";
import { motion, useReducedMotion } from "framer-motion";

const emptySubscribe = () => () => {};
function useIsHydrated() {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
}

interface TextRoll3DProps {
  text: string;
  className?: string;
  accentColor?: string;
  stagger?: number;
  staggerOffset?: number;
  as?: "span" | "div" | "h2" | "h3";
  isActive?: boolean;
  isHovered?: boolean;
}

export default function TextRoll3D({
  text,
  className = "",
  accentColor,
  stagger = 0.02,
  staggerOffset = 0,
  as: Component = "span",
  isActive,
  isHovered,
}: TextRoll3DProps) {
  const isHydrated = useIsHydrated();
  const reduced = useReducedMotion();
  const [internalHover, setInternalHover] = useState(false);

  // If isActive is explicitly controlled, cursor hover is blocked
  const isControlled = isActive !== undefined || isHovered !== undefined;
  const isTriggered = isControlled
    ? (isActive ?? isHovered ?? false)
    : internalHover;

  if (!isHydrated || reduced) {
    return <Component className={className}>{text}</Component>;
  }

  // Split into words, keeping each word's characters together so words never break mid-letter
  const words = text.split(" ");
  const wordStarts = words.reduce<number[]>((acc, _w, i) => {
    acc.push(i === 0 ? 0 : acc[i - 1] + words[i - 1].length + 1);
    return acc;
  }, []);

  return (
    <Component
      className={className}
      onMouseEnter={isControlled ? undefined : () => setInternalHover(true)}
      onMouseLeave={isControlled ? undefined : () => setInternalHover(false)}
      style={{
        display: "inline-flex",
        flexWrap: "wrap",
        columnGap: "0.26em",
        rowGap: "0.12em",
        cursor: "inherit",
        lineHeight: "inherit",
        fontFamily: "inherit",
        fontSize: "inherit",
        fontWeight: "inherit",
      }}
    >
      {words.map((word, wordIdx) => {
        const wordChars = word.split("");
        const wordStartIndex = wordStarts[wordIdx];

        return (
          <span
            key={`word-${wordIdx}`}
            style={{
              display: "inline-flex",
              whiteSpace: "nowrap",
            }}
          >
            {wordChars.map((char, charIdx) => {
              const letterDelay = (wordStartIndex + charIdx + staggerOffset) * stagger;

              return (
                <span
                  key={`char-${wordIdx}-${charIdx}`}
                  style={{
                    perspective: "700px",
                    position: "relative",
                    display: "inline-block",
                    overflow: "hidden",
                  }}
                >
                  {/* Primary Neutral Face */}
                  <motion.span
                    animate={{
                      rotateX: isTriggered ? -90 : 0,
                      y: isTriggered ? "-100%" : "0%",
                    }}
                    transition={{
                      duration: 0.42,
                      delay: letterDelay,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    style={{
                      display: "inline-block",
                      transformStyle: "preserve-3d",
                      transformOrigin: "bottom center",
                    }}
                  >
                    {char}
                  </motion.span>

                  {/* Glowing Accent Face rolling in from below */}
                  <motion.span
                    aria-hidden="true"
                    animate={{
                      rotateX: isTriggered ? 0 : 90,
                      y: isTriggered ? "0%" : "100%",
                      opacity: isTriggered ? 1 : 0,
                    }}
                    transition={{
                      duration: 0.42,
                      delay: letterDelay,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      display: "inline-block",
                      transformStyle: "preserve-3d",
                      transformOrigin: "top center",
                      color: accentColor,
                      textShadow: accentColor ? `0 0 16px ${accentColor}` : undefined,
                      userSelect: "none",
                      pointerEvents: "none",
                    }}
                  >
                    {char}
                  </motion.span>
                </span>
              );
            })}
          </span>
        );
      })}
    </Component>
  );
}
