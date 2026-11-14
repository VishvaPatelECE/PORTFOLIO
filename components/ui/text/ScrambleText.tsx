"use client";

import { useEffect, useRef, useState, useCallback, useSyncExternalStore } from "react";
import { useReducedMotion } from "framer-motion";

const emptySubscribe = () => () => {};
function useIsHydrated() {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
}

interface ScrambleTextProps {
  text: string;
  className?: string;
  speed?: number; // ms per tick
  trigger?: "view" | "hover" | "both" | "manual";
  chars?: string;
  as?: "span" | "div" | "h1" | "h2" | "h3" | "p";
  replayOnHover?: boolean;
}

const DEFAULT_CHARS = "0123456789ABCDEF$#@%&*<>{}[]/~=";

export default function ScrambleText({
  text,
  className = "",
  speed = 32,
  trigger = "both",
  chars = DEFAULT_CHARS,
  as: Component = "span",
  replayOnHover = true,
}: ScrambleTextProps) {
  const isHydrated = useIsHydrated();
  const reduced = useReducedMotion();
  const [displayText, setDisplayText] = useState(text);
  const containerRef = useRef<HTMLElement>(null);
  const isScramblingRef = useRef(false);
  const frameRef = useRef<number | null>(null);

  const startScramble = useCallback(() => {
    if (reduced || isScramblingRef.current) return;
    isScramblingRef.current = true;

    let iteration = 0;
    const totalChars = text.length;
    let lastTick = performance.now();

    const tick = (now: number) => {
      if (now - lastTick >= speed) {
        lastTick = now;
        iteration += 0.45; // Speed of resolving letters

        const scrambled = text
          .split("")
          .map((char, index) => {
            if (char === " " || char === "\n") return char;
            if (index < iteration) return text[index];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("");

        setDisplayText(scrambled);

        if (iteration >= totalChars) {
          setDisplayText(text);
          isScramblingRef.current = false;
          return;
        }
      }

      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);
  }, [text, speed, chars, reduced]);

  // Viewport trigger
  useEffect(() => {
    if (!isHydrated || reduced) return;
    if (trigger === "hover" || trigger === "manual") return;

    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          startScramble();
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [isHydrated, trigger, startScramble, reduced]);

  const handleMouseEnter = () => {
    if ((trigger === "hover" || trigger === "both" || replayOnHover) && !isScramblingRef.current) {
      startScramble();
    }
  };

  return (
    <Component
      ref={containerRef as React.Ref<never>}
      className={className}
      onMouseEnter={handleMouseEnter}
      style={{ userSelect: "none" }}
    >
      {isHydrated ? displayText : text}
    </Component>
  );
}

