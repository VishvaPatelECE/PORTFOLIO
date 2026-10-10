"use client";
import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { useHomeMotion } from "./HomeMotion";

/** Original cursor runtime in a disposable document; no physics/rendering modifications. */
export default function SignalTubes() {
  const root = useRef<HTMLDivElement>(null), frame = useRef<HTMLIFrameElement>(null);
  const visible = useInView(root, { amount: .05 });
  const reduced = useReducedMotion();
  const { paused } = useHomeMotion();
  const [hidden, setHidden] = useState(false), [unavailable, setUnavailable] = useState(false);
  useEffect(() => {
    const change = () => setHidden(document.hidden); change();
    document.addEventListener("visibilitychange", change);
    return () => document.removeEventListener("visibilitychange", change);
  }, []);
  const active = visible && !reduced && !paused && !hidden && !unavailable;
  useEffect(() => {
    if (!active) return;
    let latest: { kind: string; x: number; y: number; pointerType?: string } | null = null;
    const send = (data: NonNullable<typeof latest>) => frame.current?.contentWindow?.postMessage({ type: "vishva-tubes-input", ...data }, location.origin);
    const pointer = (event: PointerEvent) => {
      const rect = frame.current?.getBoundingClientRect();
      if (!rect || !rect.width || !rect.height) return;
      const inside = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
      latest = { kind: inside ? "pointermove" : "pointerleave", x: event.clientX - rect.left, y: event.clientY - rect.top, pointerType: event.pointerType };
      send(latest);
    };
    const leave = () => { latest = { kind: "pointerleave", x: 0, y: 0 }; send(latest); };
    const click = (event: MouseEvent) => {
      const rect = frame.current?.getBoundingClientRect();
      if (!rect || event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) return;
      send({ kind: "click", x: event.clientX - rect.left, y: event.clientY - rect.top });
    };
    const ready = (event: MessageEvent) => {
      if (event.source !== frame.current?.contentWindow || event.origin !== location.origin) return;
      if (event.data?.type === "vishva-tubes-ready" && latest) send(latest);
      if (event.data?.type === "vishva-tubes-error") setUnavailable(true);
    };
    window.addEventListener("pointermove", pointer, { passive: true });
    window.addEventListener("pointerleave", leave);
    window.addEventListener("click", click, { passive: true });
    window.addEventListener("message", ready);
    return () => {
      window.removeEventListener("pointermove", pointer); window.removeEventListener("pointerleave", leave);
      window.removeEventListener("click", click); window.removeEventListener("message", ready);
    };
  }, [active]);
  return <div ref={root} className="project-tubes-field" aria-hidden="true" data-source="kevin-levron-tubes-cursor-0.0.19">
    {active && <iframe ref={frame} src="/vendor/tubes/0.0.19/frame.html" title="Decorative Tubes Cursor" sandbox="allow-scripts allow-same-origin" tabIndex={-1} aria-hidden="true" />}
  </div>;
}
