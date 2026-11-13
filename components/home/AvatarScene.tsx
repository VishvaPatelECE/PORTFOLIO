"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState, type PointerEvent } from "react";
import { motion, useInView, useMotionTemplate, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { identityCard, identityStageCopy } from "@/lib/content/identity";
import { useHomeMotion } from "./HomeMotion";

const STAGE_ANGLES_DEG = [-90, -18, 54, 126, 198] as const;
const STAGE_SLOTS = ["design", "build", "test", "refine", "ship"] as const;
const ORBIT_VIEWBOX = 300;
const ORBIT_CENTER = ORBIT_VIEWBOX / 2;
const ORBIT_RADIUS = 114;
const ARC_GAP_DEG = 10.5;
const STAGE_STEP_DEG = 72;

function toPoint(angleDeg: number, radius = ORBIT_RADIUS) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: ORBIT_CENTER + radius * Math.cos(rad),
    y: ORBIT_CENTER + radius * Math.sin(rad),
    rad,
  };
}

function buildArcSegment(index: number) {
  const startDeg = STAGE_ANGLES_DEG[index] + ARC_GAP_DEG;
  const endDeg = STAGE_ANGLES_DEG[index] + STAGE_STEP_DEG - ARC_GAP_DEG;
  const start = toPoint(startDeg);
  const end = toPoint(endDeg);
  // Tangent unit vector pointing clockwise along the circle at endDeg, plus outward normal.
  const tx = -Math.sin(end.rad);
  const ty = Math.cos(end.rad);
  const nx = Math.cos(end.rad);
  const ny = Math.sin(end.rad);

  const tipX = end.x + tx * 3.2;
  const tipY = end.y + ty * 3.2;
  const leftX = end.x - tx * 9.8 + nx * 5.2;
  const leftY = end.y - ty * 9.8 + ny * 5.2;
  const notchX = end.x - tx * 6.6;
  const notchY = end.y - ty * 6.6;
  const rightX = end.x - tx * 9.8 - nx * 5.2;
  const rightY = end.y - ty * 9.8 - ny * 5.2;

  return {
    d: `M ${start.x.toFixed(2)} ${start.y.toFixed(2)} A ${ORBIT_RADIUS} ${ORBIT_RADIUS} 0 0 1 ${end.x.toFixed(2)} ${end.y.toFixed(2)}`,
    arrowPoints: `${tipX.toFixed(2)},${tipY.toFixed(2)} ${leftX.toFixed(2)},${leftY.toFixed(2)} ${notchX.toFixed(2)},${notchY.toFixed(2)} ${rightX.toFixed(2)},${rightY.toFixed(2)}`,
  };
}

const ORBIT_NODES = STAGE_ANGLES_DEG.map((angle, index) => {
  const pt = toPoint(angle);
  const labelPt = toPoint(angle, ORBIT_RADIUS + 20);
  return {
    index,
    slot: STAGE_SLOTS[index],
    x: pt.x,
    y: pt.y,
    labelX: labelPt.x,
    labelY: labelPt.y,
    arc: buildArcSegment(index),
  };
});

interface AvatarSceneProps {
  enabled: boolean;
  showMethod: boolean;
  instant: boolean;
  onOpenMethod: () => void;
}

export default function AvatarScene({
  enabled,
  showMethod,
  instant,
  onOpenMethod,
}: AvatarSceneProps) {
  const root = useRef<HTMLElement>(null);
  const visible = useInView(root, { amount: 0.15 });
  const reduced = useReducedMotion();
  const { paused } = useHomeMotion();
  const glowFilterId = useId();
  const [hidden, setHidden] = useState(false);
  const [cycleIndex, setCycleIndex] = useState(0);
  const [pinnedIndex, setPinnedIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const x = useMotionValue(0),
    y = useMotionValue(0);
  const lightX = useMotionValue(50),
    lightY = useMotionValue(40);
  const smoothX = useSpring(x, { stiffness: 180, damping: 32, mass: 0.7 });
  const smoothY = useSpring(y, { stiffness: 180, damping: 32, mass: 0.7 });
  const light = useMotionTemplate`radial-gradient(ellipse at ${lightX}% ${lightY}%, #b99d731a, #00aebd0a 40%, transparent 70%)`;
  const canMove = enabled && visible && !hidden && !paused && !reduced && !showMethod;
  const activeStageIndex = hoveredIndex ?? pinnedIndex ?? cycleIndex;
  const animateMethod = showMethod && !reduced && !paused && !instant;

  useEffect(() => {
    const change = () => setHidden(document.hidden);
    change();
    document.addEventListener("visibilitychange", change);
    return () => document.removeEventListener("visibilitychange", change);
  }, []);

  useEffect(() => {
    if (!showMethod || hidden || paused || reduced || pinnedIndex !== null) return;
    const timer = window.setInterval(() => {
      setCycleIndex((prev) => (prev + 1) % identityCard.stages.length);
    }, 2400);
    return () => window.clearInterval(timer);
  }, [showMethod, hidden, paused, reduced, pinnedIndex]);
  useEffect(() => {
    if (canMove) return;
    x.set(0);
    y.set(0);
    smoothX.jump(0);
    smoothY.jump(0);
    lightX.set(50);
    lightY.set(40);
  }, [canMove, x, y, smoothX, smoothY, lightX, lightY]);

  const move = (event: PointerEvent<HTMLElement>) => {
    if (!canMove || !["mouse", "pen", "touch"].includes(event.pointerType)) return;
    const rect = event.currentTarget.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const nx = Math.max(-1, Math.min(1, ((event.clientX - rect.left) / rect.width) * 2 - 1));
    const ny = Math.max(-1, Math.min(1, ((event.clientY - rect.top) / rect.height) * 2 - 1));
    x.set(nx * 6);
    y.set(ny * 4);
    lightX.set(50 + nx * 12);
    lightY.set(40 + ny * 10);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
    lightX.set(50);
    lightY.set(40);
  };

  return (
    <figure
      ref={root}
      className="signal-avatar"
      data-method-open={showMethod}
      style={{ touchAction: "pan-y" }}
      onPointerDown={move}
      onPointerMove={move}
      onPointerUp={reset}
      onPointerCancel={reset}
      onPointerLeave={reset}
    >
      <motion.div className="avatar-light" aria-hidden="true" style={{ background: light }} />
      <motion.div
        className="avatar-visual"
        aria-hidden={showMethod}
        style={{ x: smoothX, y: smoothY, pointerEvents: showMethod ? "none" : "auto" }}
        animate={{ opacity: showMethod ? 0 : 1 }}
        transition={{ duration: reduced || paused || instant ? 0 : 0.18 }}
        onDoubleClick={() => {
          if (enabled) onOpenMethod();
        }}
      >
        <Image
          src="/avatar/vishva-avatar-3d.png"
          alt="3D stylized portrait of Vishva Patel"
          width={935}
          height={1024}
          sizes="(max-width: 760px) 90vw, (max-width: 1100px) 42vw, 600px"
          priority
          draggable={false}
        />
      </motion.div>
      <section
        id="avatar-method"
        className="avatar-method"
        aria-labelledby="avatar-method-title"
        hidden={!showMethod}
      >
        <div className="orbit-stage">
          <div className="orbit-dial">
            <svg
              className="orbit-svg"
              viewBox={`0 0 ${ORBIT_VIEWBOX} ${ORBIT_VIEWBOX}`}
              fill="none"
              aria-hidden="true"
            >
              <defs>
                <radialGradient id={glowFilterId} cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#00aebd" stopOpacity="0.14" />
                  <stop offset="58%" stopColor="#b99d73" stopOpacity="0.05" />
                  <stop offset="100%" stopColor="#08070b" stopOpacity="0" />
                </radialGradient>
              </defs>

              <circle
                cx={ORBIT_CENTER}
                cy={ORBIT_CENTER}
                r={ORBIT_RADIUS - 12}
                fill={`url(#${glowFilterId})`}
              />

              {/* Precision laboratory calibration tracks */}
              <circle
                cx={ORBIT_CENTER}
                cy={ORBIT_CENTER}
                r={ORBIT_RADIUS + 14}
                stroke="#b99d73"
                strokeOpacity="0.13"
                strokeWidth="0.75"
                strokeDasharray="2 6"
              />
              <circle
                cx={ORBIT_CENTER}
                cy={ORBIT_CENTER}
                r={ORBIT_RADIUS - 16}
                stroke="#00aebd"
                strokeOpacity="0.09"
                strokeWidth="0.75"
              />

              {/* 5 clockwise directional orbital arcs + arrowheads */}
              {ORBIT_NODES.map((node) => {
                const isActiveArc = showMethod && node.index === activeStageIndex;
                return (
                  <g key={`arc-${node.slot}`}>
                    {isActiveArc && (
                      <motion.path
                        d={node.arc.d}
                        stroke="#00aebd"
                        strokeWidth={6}
                        strokeLinecap="round"
                        initial={false}
                        animate={{ opacity: 0.2 }}
                        transition={{ duration: animateMethod ? 0.35 : 0 }}
                      />
                    )}
                    <motion.path
                      d={node.arc.d}
                      stroke={isActiveArc ? "#00e5ff" : "rgba(217, 163, 61, 0.45)"}
                      strokeWidth={isActiveArc ? 2.8 : 1.6}
                      strokeLinecap="round"
                      initial={false}
                      animate={{
                        pathLength: showMethod ? 1 : 0,
                        strokeOpacity: showMethod ? (isActiveArc ? 1 : 0.65) : 0,
                      }}
                      transition={{
                        pathLength: {
                          duration: animateMethod ? 0.55 : 0,
                          delay: animateMethod ? node.index * 0.08 : 0,
                          ease: [0.22, 1, 0.36, 1],
                        },
                        strokeOpacity: { duration: animateMethod ? 0.3 : 0 },
                      }}
                      filter={isActiveArc ? "drop-shadow(0 0 6px rgba(0, 229, 255, 0.65))" : undefined}
                    />
                    {isActiveArc && animateMethod && (
                      <motion.path
                        key={`comet-${node.index}`}
                        d={node.arc.d}
                        pathLength={1}
                        stroke="#d6fbff"
                        strokeWidth={3}
                        strokeLinecap="round"
                        strokeDasharray="0.24 1"
                        initial={{ strokeDashoffset: 0.24, opacity: 0.95 }}
                        animate={{ strokeDashoffset: [0.24, -1], opacity: [0.35, 1, 0.35] }}
                        transition={{
                          duration: 1.8,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                    )}
                    <motion.polygon
                      points={node.arc.arrowPoints}
                      fill={isActiveArc ? "#00e5ff" : "#d9a33d"}
                      initial={false}
                      animate={{
                        opacity: showMethod ? (isActiveArc ? 1 : 0.8) : 0,
                      }}
                      transition={{
                        duration: animateMethod ? 0.3 : 0,
                        delay: animateMethod ? 0.16 + node.index * 0.08 : 0,
                      }}
                      filter={isActiveArc ? "drop-shadow(0 0 6px rgba(0, 229, 255, 0.8))" : undefined}
                    />
                  </g>
                );
              })}

              {/* 5 prominent node bullet points along the orbital perimeter */}
              {ORBIT_NODES.map((node) => {
                const isActiveNode = showMethod && node.index === activeStageIndex;
                return (
                  <g
                    key={`node-${node.slot}`}
                    className="orbit-svg-node"
                    onClick={() =>
                      setPinnedIndex((prev) => (prev === node.index ? null : node.index))
                    }
                    onMouseEnter={() => setHoveredIndex(node.index)}
                    onMouseLeave={() => setHoveredIndex((prev) => (prev === node.index ? null : prev))}
                  >
                    <circle cx={node.x} cy={node.y} r={22} fill="transparent" />
                    {isActiveNode && animateMethod && (
                      <motion.circle
                        cx={node.x}
                        cy={node.y}
                        r={11}
                        stroke="#00e5ff"
                        strokeWidth={1.8}
                        initial={{ r: 10, opacity: 0.85 }}
                        animate={{ r: 24, opacity: 0 }}
                        transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
                      />
                    )}
                    {isActiveNode && (
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={15}
                        fill="#00e5ff"
                        fillOpacity={0.18}
                      />
                    )}
                    {/* Outer Node Ring */}
                    <motion.circle
                      cx={node.x}
                      cy={node.y}
                      r={9.5}
                      fill="#08070b"
                      stroke={isActiveNode ? "#00e5ff" : "#d9a33d"}
                      strokeWidth={isActiveNode ? 2.8 : 1.8}
                      initial={false}
                      animate={{
                        scale: showMethod ? (isActiveNode ? 1.18 : 1) : 0.6,
                        opacity: showMethod ? 1 : 0,
                      }}
                      transition={{
                        duration: animateMethod ? 0.3 : 0,
                        delay: animateMethod ? node.index * 0.06 : 0,
                      }}
                      style={{ transformOrigin: `${node.x}px ${node.y}px` }}
                      filter={isActiveNode ? "drop-shadow(0 0 8px rgba(0, 229, 255, 0.75))" : undefined}
                    />
                    {/* Inner Glowing Bullet Point Core */}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={isActiveNode ? 4.2 : 2.8}
                      fill={isActiveNode ? "#00e5ff" : "#f6d36f"}
                    />
                  </g>
                );
              })}
            </svg>

            <h2 id="avatar-method-title" className="orbit-center-title">
              How I build<span className="orbit-title-dot">.</span>
            </h2>

            {/* Compact radial stage tags shown inside the dial margin on mobile viewports */}
            <div className="orbit-mobile-tags" aria-hidden="true">
              {identityCard.stages.map((stage, index) => {
                const node = ORBIT_NODES[index];
                const isActive = showMethod && index === activeStageIndex;
                return (
                  <span
                    key={`mtag-${stage}`}
                    className="orbit-mobile-tag"
                    data-slot={node.slot}
                    data-active={isActive}
                  >
                    {stage}
                  </span>
                );
              })}
            </div>
          </div>

          <ol className="orbit-stages">
            {identityCard.stages.map((stage, index) => {
              const node = ORBIT_NODES[index];
              const isActive = showMethod && index === activeStageIndex;
              const isPinned = pinnedIndex === index;
              return (
                <motion.li
                  key={stage}
                  className="orbit-stage-item"
                  data-slot={node.slot}
                  data-active={isActive}
                  initial={false}
                  animate={{
                    opacity: showMethod ? 1 : 0,
                    y: showMethod ? 0 : 8,
                  }}
                  transition={{
                    duration: animateMethod ? 0.42 : 0,
                    delay: animateMethod ? 0.1 + index * 0.06 : 0,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <button
                    type="button"
                    className="orbit-stage-button"
                    aria-pressed={isPinned}
                    onClick={() => setPinnedIndex((prev) => (prev === index ? null : index))}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex((prev) => (prev === index ? null : prev))}
                    onFocus={() => setHoveredIndex(index)}
                    onBlur={() => setHoveredIndex((prev) => (prev === index ? null : prev))}
                  >
                    <strong className="orbit-stage-name">{stage}</strong>
                    <p className="orbit-stage-copy">{identityStageCopy[stage]}</p>
                  </button>
                </motion.li>
              );
            })}
          </ol>
        </div>
      </section>
    </figure>
  );
}
