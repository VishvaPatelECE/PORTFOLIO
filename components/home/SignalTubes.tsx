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

    // Narrowly scoped geometry cache to avoid forced reflows on pointer movement
    let cachedFrameRect: DOMRect | null = null;
    let cachedBoundsRect: DOMRect | null = null;

    const updateGeometry = () => {
      if (!frame.current || !root.current) return;
      const f = frame.current.getBoundingClientRect();
      if (!f.width || !f.height) return;
      const wrapper = root.current.closest(".discovery-tubes-wrapper");
      const b = wrapper ? wrapper.getBoundingClientRect() : f;
      cachedFrameRect = f;
      cachedBoundsRect = b;
    };

    updateGeometry();

    const forwardCoords = (clientX: number, clientY: number, pointerType: string) => {
      if (!cachedFrameRect || !cachedBoundsRect) {
        updateGeometry();
      }
      const rect = cachedFrameRect;
      const boundsRect = cachedBoundsRect;
      if (!rect || !boundsRect || !rect.width || !rect.height) return;
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

    // Observers and listeners to keep geometry strictly fresh without polling
    const wrapper = root.current?.closest(".discovery-tubes-wrapper");
    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => {
        updateGeometry();
      });
      if (wrapper) resizeObserver.observe(wrapper);
      if (typeof document !== "undefined" && document.body) {
        resizeObserver.observe(document.body);
      }
    }

    let transitionRafId = 0;
    const onTransition = () => {
      updateGeometry();
      cancelAnimationFrame(transitionRafId);
      const pollTransition = (start: number) => {
        updateGeometry();
        if (performance.now() - start < 500) {
          transitionRafId = requestAnimationFrame(() => pollTransition(start));
        }
      };
      transitionRafId = requestAnimationFrame(() => pollTransition(performance.now()));
    };

    wrapper?.addEventListener("transitionrun", onTransition);
    wrapper?.addEventListener("transitionstart", onTransition);
    window.addEventListener("scroll", updateGeometry, { passive: true });
    window.addEventListener("resize", updateGeometry, { passive: true });
    window.addEventListener("pointerdown", pointer, { passive: true });
    window.addEventListener("pointermove", pointer, { passive: true });
    window.addEventListener("touchstart", touch, { passive: true });
    window.addEventListener("touchmove", touch, { passive: true });
    window.addEventListener("pointerleave", leave);
    window.addEventListener("message", ready);

    return () => {
      cancelAnimationFrame(transitionRafId);
      resizeObserver?.disconnect();
      wrapper?.removeEventListener("transitionrun", onTransition);
      wrapper?.removeEventListener("transitionstart", onTransition);
      window.removeEventListener("scroll", updateGeometry);
      window.removeEventListener("resize", updateGeometry);
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
