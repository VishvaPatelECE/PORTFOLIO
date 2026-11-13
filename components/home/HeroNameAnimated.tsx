"use client";

import {
  useRef,
  useEffect,
  useState,
  useCallback,
  useSyncExternalStore,
} from "react";
import { useReducedMotion } from "framer-motion";

const emptySubscribe = () => () => {};
function useIsHydrated() {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
}

interface HeroNameAnimatedProps {
  active?: boolean;
  className?: string;
  fromWeight?: number;
  toWeight?: number;
  radius?: number;
  intensity?: number;
  duration?: number;
  color?: string;
  dotColor?: string;
}

// 13 total items: "VISHVA PATEL" (12 chars with space) + "." (golden dot)
const FULL_NAME = "VISHVA PATEL.";

// Optical kerning pairs for Anybody Variable to ensure 100% even letter spacing
const OPTICAL_KERNING: Record<number, React.CSSProperties> = {
  0: { marginRight: "-0.02em" }, // V
  1: { marginLeft: "-0.01em", marginRight: "0.01em" }, // I
  2: {}, // S
  3: {}, // H
  4: { marginRight: "-0.02em" }, // V
  5: { marginLeft: "-0.025em" }, // A
  6: { width: "0.28em" }, // space between VISHVA and PATEL
  7: { marginRight: "-0.015em" }, // P
  8: { marginLeft: "-0.015em", marginRight: "-0.055em" }, // A (tightens gap before T)
  9: { marginLeft: "-0.055em" }, // T (tucks over A's lower leg)
  10: { marginLeft: "-0.01em" }, // E
  11: {}, // L
  12: { marginLeft: "0.02em" }, // . (signature golden dot)
};

// Smoky Text keyframe generator — Originkit
function buildSmokyKF(color: string, dotColor: string, intensity: number) {
  const n = (Math.max(1, Math.min(20, intensity)) - 1) / 19;
  const r = (v: number) => +v.toFixed(2);

  const peakB = Math.round(8 + n * 160);
  const initB = Math.round(3 + n * 50);

  const layers = 1 + Math.round(n * 3);
  const stack = (blur: number, c: string) =>
    Array.from(
      { length: layers },
      (_, i) => `0 0 ${Math.round((blur * (i + 1)) / layers)}px ${c}`
    ).join(",");

  const peak = stack(peakB, color);
  const init = stack(initB, color);

  const peakDot = stack(peakB, dotColor);
  const initDot = stack(initB, dotColor);

  const d = 0.8 + n * 0.4;

  return `
@keyframes smt-hero-bl-a{
  0%{opacity:0;text-shadow:${init};transform:translate3d(${r(-3.5 * d)}rem,${r(3 * d)}rem,0) rotate(18deg) skewX(-28deg) scale(0.85);filter:blur(4px)}
  45%{opacity:0.85;text-shadow:${peak};filter:blur(2px)}
  100%{opacity:1;text-shadow:0 0 0 ${color};transform:none;filter:blur(0)}
}
@keyframes smt-hero-bl-b{
  0%{opacity:0;text-shadow:${init};transform:translate3d(${r(-4 * d)}rem,${r(3.5 * d)}rem,0) rotate(20deg) skewX(28deg) scale(0.8);filter:blur(4px)}
  45%{opacity:0.85;text-shadow:${peak};filter:blur(2px)}
  100%{opacity:1;text-shadow:0 0 0 ${color};transform:none;filter:blur(0)}
}
@keyframes smt-hero-dot{
  0%{opacity:0;text-shadow:${initDot};transform:translate3d(${r(-2 * d)}rem,${r(2.5 * d)}rem,0) scale(0.7);filter:blur(3px)}
  45%{opacity:0.85;text-shadow:${peakDot};filter:blur(1px)}
  100%{opacity:1;text-shadow:0 0 0 ${dotColor};transform:none;filter:blur(0)}
}
`;
}

export default function HeroNameAnimated({
  active = true,
  className = "",
  fromWeight = 440,
  toWeight = 860,
  radius = 160,
  intensity = 10,
  duration = 1.8,
  color = "#f2ede4",
  dotColor = "#b99d73",
}: HeroNameAnimatedProps) {
  const isHydrated = useIsHydrated();
  const reduced = useReducedMotion();

  const containerRef = useRef<HTMLSpanElement>(null);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const kfStyleRef = useRef<HTMLStyleElement | null>(null);

  // Smoky Text animation phases: "hidden" | "appearing" | "visible"
  const [rawPhase, setRawPhase] = useState<"hidden" | "appearing" | "visible">("hidden");
  const phase: "hidden" | "appearing" | "visible" =
    isHydrated && reduced ? "visible" : rawPhase;

  // Proximity weights: 13 total items (12 letters/space + 1 dot)
  const totalItems = FULL_NAME.length;
  const currentWeightsRef = useRef<Float32Array>(new Float32Array(totalItems).fill(fromWeight));
  const targetWeightsRef = useRef<Float32Array>(new Float32Array(totalItems).fill(fromWeight));
  const centersRef = useRef<{ x: number; y: number }[]>([]);
  const proximityRafRef = useRef<number | null>(null);

  // Inject dynamic keyframes for Smoky Text
  useEffect(() => {
    kfStyleRef.current = document.createElement("style");
    kfStyleRef.current.id = "originkit-hero-smoky-keyframes";
    document.head.appendChild(kfStyleRef.current);
    return () => {
      kfStyleRef.current?.remove();
      kfStyleRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (kfStyleRef.current) {
      kfStyleRef.current.textContent = buildSmokyKF(color, dotColor, intensity);
    }
  }, [color, dotColor, intensity]);

  // Measure letter centers for cursor proximity calculation
  const measureCenters = useCallback(() => {
    const list: { x: number; y: number }[] = [];
    for (let i = 0; i < totalItems; i++) {
      const el = letterRefs.current[i];
      if (!el || el.style.opacity === "0") {
        list.push({ x: 0, y: 0 });
        continue;
      }
      const rect = el.getBoundingClientRect();
      list.push({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      });
    }
    centersRef.current = list;
  }, [totalItems]);

  // Spring animation loop for variable font-weight interpolation
  const requestStep = useCallback(() => {
    const step = () => {
      let needsNextFrame = false;
      const current = currentWeightsRef.current;
      const targets = targetWeightsRef.current;

      for (let i = 0; i < totalItems; i++) {
        const diff = targets[i] - current[i];
        if (Math.abs(diff) > 0.4) {
          current[i] += diff * 0.22;
          needsNextFrame = true;
        } else {
          current[i] = targets[i];
        }

        const el = letterRefs.current[i];
        if (el) {
          const rounded = Math.round(current[i]);
          el.style.fontVariationSettings = `'wght' ${rounded}, 'wdth' 106`;
        }
      }

      if (needsNextFrame) {
        proximityRafRef.current = requestAnimationFrame(step);
      } else {
        proximityRafRef.current = null;
      }
    };

    if (proximityRafRef.current === null) {
      proximityRafRef.current = requestAnimationFrame(step);
    }
  }, [totalItems]);

  // Smoky Text trigger lifecycle
  useEffect(() => {
    if (!isHydrated || reduced) return;

    if (active) {
      let finishTimer: ReturnType<typeof setTimeout> | undefined;
      const resetTimer = setTimeout(() => setRawPhase("hidden"), 0);
      const startTimer = setTimeout(() => {
        setRawPhase("appearing");
        finishTimer = setTimeout(() => {
          setRawPhase("visible");
          measureCenters();
        }, duration * 1000 + 150);
      }, 80);

      return () => {
        clearTimeout(resetTimer);
        clearTimeout(startTimer);
        if (finishTimer) clearTimeout(finishTimer);
      };
    } else {
      const hideTimer = setTimeout(() => setRawPhase("hidden"), 0);
      return () => clearTimeout(hideTimer);
    }
  }, [isHydrated, active, reduced, duration, measureCenters]);

  // Re-measure letter centers when visible or on resize
  useEffect(() => {
    if (phase === "visible") {
      measureCenters();
    }
  }, [phase, measureCenters]);

  // Proximity pointer event listeners (mouse, pen, and touch finger-slide) for weight hover
  useEffect(() => {
    if (!isHydrated || reduced) return;
    const container = containerRef.current;
    if (!container) return;

    const updateTargets = (clientX: number, clientY: number) => {
      const centers = centersRef.current;
      const targets = targetWeightsRef.current;

      for (let i = 0; i < totalItems; i++) {
        const center = centers[i];
        if (!center || (center.x === 0 && center.y === 0)) continue;

        const dist = Math.hypot(clientX - center.x, clientY - center.y);
        if (dist < radius) {
          const power = Math.pow(1 - dist / radius, 1.8);
          targets[i] = fromWeight + power * (toWeight - fromWeight);
        } else {
          targets[i] = fromWeight;
        }
      }

      requestStep();
    };

    const handlePointerDown = (e: PointerEvent) => {
      measureCenters();
      updateTargets(e.clientX, e.clientY);
    };

    const handlePointerMove = (e: PointerEvent) => {
      updateTargets(e.clientX, e.clientY);
    };

    const handlePointerReset = () => {
      targetWeightsRef.current.fill(fromWeight);
      requestStep();
    };

    container.addEventListener("pointerenter", measureCenters);
    container.addEventListener("pointerdown", handlePointerDown);
    container.addEventListener("pointermove", handlePointerMove);
    container.addEventListener("pointerup", handlePointerReset);
    container.addEventListener("pointercancel", handlePointerReset);
    container.addEventListener("pointerleave", handlePointerReset);
    window.addEventListener("resize", measureCenters);

    const timer = setTimeout(measureCenters, 200);

    return () => {
      clearTimeout(timer);
      container.removeEventListener("pointerenter", measureCenters);
      container.removeEventListener("pointerdown", handlePointerDown);
      container.removeEventListener("pointermove", handlePointerMove);
      container.removeEventListener("pointerup", handlePointerReset);
      container.removeEventListener("pointercancel", handlePointerReset);
      container.removeEventListener("pointerleave", handlePointerReset);
      window.removeEventListener("resize", measureCenters);
      if (proximityRafRef.current) {
        cancelAnimationFrame(proximityRafRef.current);
      }
    };
  }, [isHydrated, reduced, totalItems, radius, fromWeight, toWeight, measureCenters, requestStep]);

  // Stagger calculations for Smoky Text (Originkit S = 0.1)
  const S = 0.09;
  const maxRaw = (totalItems - 1) * S;

  // Render static accessible text during SSR or before hydration
  if (!isHydrated) {
    return (
      <span className={`hero-name-static ${className}`} aria-label="VISHVA PATEL.">
        <span>VISHVA PATEL</span>
        <span className="signal-dot">.</span>
      </span>
    );
  }

  return (
    <span
      ref={containerRef}
      className={`hero-name-smoky-hover ${className}`}
      role="text"
      aria-label="VISHVA PATEL."
      style={{
        display: "inline-flex",
        alignItems: "baseline",
        whiteSpace: "nowrap",
        cursor: "default",
        userSelect: "none",
        touchAction: "pan-y",
        position: "relative",
      }}
    >
      <span
        className="hero-name-glyphs"
        aria-hidden="true"
        style={{
          display: "inline-flex",
          alignItems: "baseline",
          whiteSpace: "nowrap",
        }}
      >
        {FULL_NAME.split("").map((char, index) => {
          const isSpace = char === " ";
          const isDot = char === ".";
          const opticalStyle = OPTICAL_KERNING[index] || {};

          // Smoky Text animation timing per character
          const e = index % 2 === 0;
          const anim = isDot ? "smt-hero-dot" : e ? "smt-hero-bl-a" : "smt-hero-bl-b";
          const rawD = index * S;
          const charDur = duration * 0.55;
          const delay = (rawD * (duration * 0.45)) / maxRaw;

          const baseStyle: React.CSSProperties = {
            display: "inline-block",
            fontVariationSettings: `'wght' ${fromWeight}, 'wdth' 106`,
            color: isDot ? dotColor : color,
            transition: "color 0.2s ease",
            ...(isSpace ? { width: "0.28em" } : {}),
            ...opticalStyle,
          };

          if (phase === "hidden") {
            return (
              <span
                key={`name-char-${index}`}
                ref={(el) => {
                  letterRefs.current[index] = el;
                }}
                style={{
                  ...baseStyle,
                  opacity: 0,
                }}
              >
                {isSpace ? "\u00A0" : char}
              </span>
            );
          }

          if (phase === "visible") {
            return (
              <span
                key={`name-char-${index}`}
                ref={(el) => {
                  letterRefs.current[index] = el;
                }}
                style={{
                  ...baseStyle,
                  opacity: 1,
                  textShadow: `0 0 0 ${isDot ? dotColor : color}`,
                }}
              >
                {isSpace ? "\u00A0" : char}
              </span>
            );
          }

          // phase === "appearing"
          return (
            <span
              key={`name-char-${index}`}
              ref={(el) => {
                letterRefs.current[index] = el;
              }}
              style={{
                ...baseStyle,
                animation: `${anim} ${charDur}s ${delay}s cubic-bezier(0, 0, 0.58, 1) both`,
              }}
            >
              {isSpace ? "\u00A0" : char}
            </span>
          );
        })}
      </span>

      {/* Screen reader accessible text */}
      <span
        aria-live="polite"
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: "hidden",
          clip: "rect(0, 0, 0, 0)",
          whiteSpace: "nowrap",
          border: 0,
        }}
      >
        VISHVA PATEL.
      </span>
    </span>
  );
}
