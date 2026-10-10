"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type MouseEvent, type PointerEvent } from "react";
import { motion, useInView, useMotionTemplate, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { identityCard, identityStageCopy } from "@/lib/content/identity";
import { useHomeMotion } from "./HomeMotion";

export default function AvatarScene({ enabled }: { enabled: boolean }) {
  const root = useRef<HTMLElement>(null);
  const visible = useInView(root, { amount: .15 });
  const reduced = useReducedMotion();
  const { paused } = useHomeMotion();
  const [showMethod, setShowMethod] = useState(false);
  const [instant, setInstant] = useState(false);
  const [hidden, setHidden] = useState(false);
  const x = useMotionValue(0), y = useMotionValue(0);
  const lightX = useMotionValue(50), lightY = useMotionValue(40);
  const smoothX = useSpring(x, { stiffness: 180, damping: 32, mass: .7 });
  const smoothY = useSpring(y, { stiffness: 180, damping: 32, mass: .7 });
  const light = useMotionTemplate`radial-gradient(ellipse at ${lightX}% ${lightY}%, #b99d731a, #00aebd0a 40%, transparent 70%)`;
  const canMove = enabled && visible && !hidden && !paused && !reduced && !showMethod;

  useEffect(() => {
    const change = () => setHidden(document.hidden);
    change();
    document.addEventListener("visibilitychange", change);
    return () => document.removeEventListener("visibilitychange", change);
  }, []);
  useEffect(() => {
    if (canMove) return;
    x.set(0); y.set(0);
    smoothX.jump(0); smoothY.jump(0);
    lightX.set(50); lightY.set(40);
  }, [canMove, x, y, smoothX, smoothY, lightX, lightY]);

  const move = (event: PointerEvent<HTMLElement>) => {
    if (!canMove || !["mouse", "pen"].includes(event.pointerType)) return;
    const rect = event.currentTarget.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const nx = Math.max(-1, Math.min(1, (event.clientX - rect.left) / rect.width * 2 - 1));
    const ny = Math.max(-1, Math.min(1, (event.clientY - rect.top) / rect.height * 2 - 1));
    x.set(nx * 6); y.set(ny * 4);
    lightX.set(50 + nx * 12); lightY.set(40 + ny * 10);
  };
  const reset = () => { x.set(0); y.set(0); lightX.set(50); lightY.set(40); };
  const toggle = (event: MouseEvent<HTMLButtonElement>) => {
    setInstant(event.detail === 0);
    setShowMethod(value => !value);
  };

  return (
    <figure ref={root} className="signal-avatar" data-method-open={showMethod} onPointerMove={move} onPointerLeave={reset}>
      <motion.div className="avatar-light" aria-hidden="true" style={{ background: light }} />
      <motion.div
        className="avatar-visual"
        aria-hidden={showMethod}
        style={{ x: smoothX, y: smoothY, pointerEvents: showMethod ? "none" : "auto" }}
        animate={{ opacity: showMethod ? 0 : 1 }}
        transition={{ duration: reduced || paused || instant ? 0 : .18 }}
        onDoubleClick={() => { if (enabled) { setInstant(false); setShowMethod(true); } }}
      >
        <Image
          src="/avatar/vishva-avatar-first.png"
          alt="Stylized portrait of Vishva Patel"
          width={1024}
          height={1536}
          sizes="(max-width: 760px) 80vw, (max-width: 1100px) 42vw, 600px"
          priority
          draggable={false}
        />
      </motion.div>
        <section id="avatar-method" className="avatar-method" aria-labelledby="avatar-method-title" hidden={!showMethod}>
          <h2 id="avatar-method-title">How I build.</h2>
          <ol>
            {identityCard.stages.map(stage => (
              <li key={stage}><strong>{stage}</strong><p>{identityStageCopy[stage]}</p></li>
            ))}
          </ol>
        </section>
      <button className="avatar-method-toggle" onClick={toggle} disabled={!enabled} aria-expanded={showMethod} aria-controls="avatar-method">
        {showMethod ? "Show portrait" : "How I build"} <ArrowUpRight size={15} />
      </button>
    </figure>
  );
}
