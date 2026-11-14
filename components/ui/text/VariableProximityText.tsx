"use client";

import { useRef, useEffect, useCallback, useSyncExternalStore } from "react";
import { useReducedMotion } from "framer-motion";

const emptySubscribe = () => () => { };
function useIsHydrated() {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
}

interface VariableProximityTextProps {
  text: string;
  className?: string;
  fromWeight?: number;
  toWeight?: number;
  width?: number;
  radius?: number;
  as?: "h1" | "h2" | "h3" | "span" | "div" | "p";
  dotColor?: string;
}

export default function VariableProximityText({
  text,
  className = "",
  fromWeight = 440,
  toWeight = 860,
  width = 106,
  radius = 160,
  as: Component = "span",
  dotColor,
}: VariableProximityTextProps) {
  const isHydrated = useIsHydrated();
  const reduced = useReducedMotion();
  const containerRef = useRef<HTMLElement>(null);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const dotRef = useRef<HTMLSpanElement | null>(null);
  const hoveringRef = useRef(false);

  const chars = text.split("");
  const charCount = chars.length;
  const currentWeightsRef = useRef<Float32Array>(new Float32Array(charCount).fill(fromWeight));
  const targetWeightsRef = useRef<Float32Array>(new Float32Array(charCount).fill(fromWeight));
  const dotCurrentWeightRef = useRef(fromWeight);
  const dotTargetWeightRef = useRef(fromWeight);
  const centersRef = useRef<{ x: number; y: number }[]>([]);
  const dotCenterRef = useRef<{ x: number; y: number } | null>(null);
  const lastMeasureRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  const measureCenters = useCallback(() => {
    const list: { x: number; y: number }[] = [];
    for (let i = 0; i < charCount; i++) {
      const el = letterRefs.current[i];
      if (!el) {
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

    if (dotRef.current) {
      const dRect = dotRef.current.getBoundingClientRect();
      dotCenterRef.current = {
        x: dRect.left + dRect.width / 2,
        y: dRect.top + dRect.height / 2,
      };
    }
  }, [charCount]);

  const requestStep = useCallback(() => {
    if (rafRef.current !== null) return;
    const step = () => {
      let needsNextFrame = false;
      const current = currentWeightsRef.current;
      const targets = targetWeightsRef.current;

      for (let i = 0; i < charCount; i++) {
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
          el.style.fontVariationSettings = `'wght' ${rounded}, 'wdth' ${width}`;
        }
      }

      // Handle dot if present
      if (dotRef.current) {
        const dDiff = dotTargetWeightRef.current - dotCurrentWeightRef.current;
        if (Math.abs(dDiff) > 0.4) {
          dotCurrentWeightRef.current += dDiff * 0.22;
          needsNextFrame = true;
        } else {
          dotCurrentWeightRef.current = dotTargetWeightRef.current;
        }
        const dRounded = Math.round(dotCurrentWeightRef.current);
        dotRef.current.style.fontVariationSettings = `'wght' ${dRounded}, 'wdth' ${width}`;
      }

      if (needsNextFrame) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        rafRef.current = null;
      }
    };

    rafRef.current = requestAnimationFrame(step);
  }, [charCount, width]);

  useEffect(() => {
    if (!isHydrated || reduced) return;
    const container = containerRef.current;
    if (!container) return;

    if (currentWeightsRef.current.length !== charCount) {
      currentWeightsRef.current = new Float32Array(charCount).fill(fromWeight);
      targetWeightsRef.current = new Float32Array(charCount).fill(fromWeight);
    }

    const updateTargets = (clientX: number, clientY: number) => {
      const now = performance.now();
      if (centersRef.current.length !== charCount || now - lastMeasureRef.current > 80) {
        measureCenters();
        lastMeasureRef.current = now;
      }
      const centers = centersRef.current;
      const targets = targetWeightsRef.current;

      for (let i = 0; i < charCount; i++) {
        const center = centers[i];
        if (!center || (center.x === 0 && center.y === 0)) continue;
        const dist = Math.hypot(clientX - center.x, clientY - center.y);
        if (dist < radius) {
          const power = Math.pow(1 - dist / radius, 1.4);
          targets[i] = fromWeight + power * (toWeight - fromWeight);
        } else {
          targets[i] = fromWeight;
        }
      }

      if (dotCenterRef.current) {
        const dDist = Math.hypot(clientX - dotCenterRef.current.x, clientY - dotCenterRef.current.y);
        if (dDist < radius) {
          const dPower = Math.pow(1 - dDist / radius, 1.4);
          dotTargetWeightRef.current = fromWeight + dPower * (toWeight - fromWeight);
        } else {
          dotTargetWeightRef.current = fromWeight;
        }
      }

      requestStep();
    };

    const handlePointerReset = () => {
      hoveringRef.current = false;
      targetWeightsRef.current.fill(fromWeight);
      dotTargetWeightRef.current = fromWeight;
      requestStep();
    };

    const handleGlobalPointerMove = (e: PointerEvent) => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const inRangeY = e.clientY >= rect.top - radius && e.clientY <= rect.bottom + radius;
      const inRangeX = e.clientX >= rect.left - radius && e.clientX <= rect.right + radius;

      if (inRangeY && inRangeX) {
        if (!hoveringRef.current) {
          hoveringRef.current = true;
          measureCenters();
          lastMeasureRef.current = performance.now();
        }
        updateTargets(e.clientX, e.clientY);
      } else if (hoveringRef.current) {
        handlePointerReset();
      }
    };

    window.addEventListener("pointermove", handleGlobalPointerMove, { passive: true });
    window.addEventListener("pointerdown", handleGlobalPointerMove, { passive: true });
    window.addEventListener("resize", measureCenters);
    window.addEventListener("scroll", measureCenters, { passive: true });

    const timer = setTimeout(measureCenters, 200);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("pointermove", handleGlobalPointerMove);
      window.removeEventListener("pointerdown", handleGlobalPointerMove);
      window.removeEventListener("resize", measureCenters);
      window.removeEventListener("scroll", measureCenters);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [isHydrated, reduced, charCount, fromWeight, toWeight, radius, measureCenters, requestStep]);

  // Split into word groups so multi-word headings wrap cleanly on narrow mobile viewports
  const wordGroups: { chars: { ch: string; idx: number }[]; hasSpaceAfter: boolean }[] = [];
  let cursor = 0;
  const words = text.split(" ");
  words.forEach((word, wIdx) => {
    const groupChars = word.split("").map((ch) => ({ ch, idx: cursor++ }));
    const hasSpaceAfter = wIdx < words.length - 1;
    if (hasSpaceAfter) cursor++; // account for the space index
    wordGroups.push({ chars: groupChars, hasSpaceAfter });
  });

  return (
    <Component
      ref={containerRef as React.Ref<never>}
      className={className}
      style={{
        display: "inline-block",
        cursor: "default",
        userSelect: "none",
        touchAction: "pan-y",
        fontFamily: "inherit",
        fontSize: "inherit",
        fontWeight: "inherit",
        lineHeight: "inherit",
        letterSpacing: "inherit",
        color: "inherit",
      }}
    >
      {wordGroups.map((group, gIdx) => (
        <span
          key={`wg-${gIdx}`}
          style={{
            display: "inline-block",
            whiteSpace: "nowrap",
            color: "inherit",
            fontFamily: "inherit",
            fontSize: "inherit",
            lineHeight: "inherit",
          }}
        >
          {group.chars.map(({ ch, idx }) => (
            <span
              key={`pv-${ch}-${idx}`}
              ref={(el) => {
                letterRefs.current[idx] = el;
              }}
              style={{
                display: "inline-block",
                fontVariationSettings: `'wght' ${fromWeight}, 'wdth' ${width}`,
                willChange: "font-variation-settings",
                fontFamily: "inherit",
                fontSize: "inherit",
                lineHeight: "inherit",
                color: "inherit",
              }}
            >
              {ch}
            </span>
          ))}
          {gIdx === wordGroups.length - 1 && dotColor && (
            <span
              ref={dotRef}
              style={{
                color: dotColor,
                display: "inline-block",
                fontFamily: "inherit",
                fontSize: "inherit",
                lineHeight: "inherit",
              }}
            >
              .
            </span>
          )}
          {group.hasSpaceAfter && (
            <span
              style={{
                display: "inline-block",
                width: "0.26em",
              }}
              aria-hidden="true"
            >
              {"\u00A0"}
            </span>
          )}
        </span>
      ))}
    </Component>
  );
}
