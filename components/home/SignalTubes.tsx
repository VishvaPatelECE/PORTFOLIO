"use client";
import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { useHomeMotion } from "./HomeMotion";

/** Original cursor runtime in a disposable document; strictly confined to discovery section; never touches hero. */
export default function SignalTubes() {
  const root = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const visible = useInView(root, { amount: 0.05 });
  const reduced = useReducedMotion();
  const { paused } = useHomeMotion();
  const [hidden, setHidden] = useState(false);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    const change = () => setHidden(document.hidden);
    change();
    document.addEventListener("visibilitychange", change);
    return () => document.removeEventListener("visibilitychange", change);
  }, []);

  const active = visible && !reduced && !paused && !hidden && !unavailable;

  useEffect(() => {
    if (!active) return;
    let latest: { kind: string; x: number; y: number; pointerType?: string } | null = null;
    const send = (data: NonNullable<typeof latest>) =>
      frame.current?.contentWindow?.postMessage(
        { type: "vishva-tubes-input", ...data },
        location.origin,
      );

    const forwardCoords = (clientX: number, clientY: number, pointerType: string) => {
      const rect = frame.current?.getBoundingClientRect();
      if (!rect || !rect.width || !rect.height) return;
      const boundsRect = root.current?.closest(".discovery-tubes-wrapper")?.getBoundingClientRect() ?? rect;
      const inside =
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom &&
        clientY >= boundsRect.top &&
        clientY <= boundsRect.bottom;
      latest = {
        kind: inside ? "pointermove" : "pointerleave",
        x: clientX - rect.left,
        y: clientY - rect.top,
        pointerType,
      };
      send(latest);
    };

    const pointer = (event: PointerEvent) => {
      forwardCoords(event.clientX, event.clientY, event.pointerType);
    };

    const touch = (event: TouchEvent) => {
      const pt = event.touches[0] ?? event.changedTouches[0];
      if (!pt) return;
      forwardCoords(pt.clientX, pt.clientY, "touch");
    };

    const leave = () => {
      latest = { kind: "pointerleave", x: 0, y: 0 };
      send(latest);
    };

    const ready = (event: MessageEvent) => {
      if (event.source !== frame.current?.contentWindow || event.origin !== location.origin)
        return;
      if (event.data?.type === "vishva-tubes-ready" && latest) send(latest);
      if (event.data?.type === "vishva-tubes-error") setUnavailable(true);
    };

    window.addEventListener("pointerdown", pointer, { passive: true });
    window.addEventListener("pointermove", pointer, { passive: true });
    window.addEventListener("touchstart", touch, { passive: true });
    window.addEventListener("touchmove", touch, { passive: true });
    window.addEventListener("pointerleave", leave);
    window.addEventListener("message", ready);
    return () => {
      window.removeEventListener("pointerdown", pointer);
      window.removeEventListener("pointermove", pointer);
      window.removeEventListener("touchstart", touch);
      window.removeEventListener("touchmove", touch);
      window.removeEventListener("pointerleave", leave);
      window.removeEventListener("message", ready);
    };
  }, [active]);

  return (
    <div
      ref={root}
      className="project-tubes-field"
      aria-hidden="true"
      data-source="kevin-levron-tubes-cursor-0.0.19"
    >
      {active && (
        <iframe
          ref={frame}
          src="/vendor/tubes/0.0.19/frame.html"
          title="Decorative Tubes Cursor"
          sandbox="allow-scripts allow-same-origin"
          tabIndex={-1}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
