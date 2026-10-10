"use client";
import { useEffect, useRef } from "react";
import { identityCard } from "@/lib/content/identity";
import {
  createHoloCard,
  type HoloController,
} from "@/three/holo/createHoloCard";
export default function HoloCard({
  paused,
  flipped,
  reset,
  available,
  onAvailabilityChange,
}: {
  paused: boolean;
  flipped: boolean;
  reset: number;
  available: boolean;
  onAvailabilityChange: (ready: boolean) => void;
}) {
  const canvas = useRef<HTMLCanvasElement>(null),
    controller = useRef<HoloController | null>(null);
  const current = useRef({ paused, flipped });
  useEffect(() => {
    current.current = { paused, flipped };
  }, [paused, flipped]);
  useEffect(() => {
    let cancelled = false;
    document.fonts.ready.then(() => {
      if (cancelled || !canvas.current) return;
      try {
        const instance = createHoloCard(canvas.current, () =>
          onAvailabilityChange(false),
        );
        controller.current = instance;
        instance.setPaused(current.current.paused);
        instance.setFlipped(current.current.flipped);
        onAvailabilityChange(true);
      } catch {
        onAvailabilityChange(false);
      }
    });
    return () => {
      cancelled = true;
      controller.current?.dispose();
      controller.current = null;
    };
  }, [onAvailabilityChange]);
  useEffect(() => {
    controller.current?.setPaused(paused);
  }, [paused]);
  useEffect(() => {
    controller.current?.setFlipped(flipped);
  }, [flipped]);
  useEffect(() => {
    controller.current?.reset();
  }, [reset]);
  return (
    <canvas
      ref={canvas}
      className="holo-canvas"
      role="img"
      tabIndex={available ? 0 : -1}
      aria-hidden={!available}
      aria-label={
        flipped
          ? `Vishva Patel identity card reverse: ${identityCard.stages.join(
              ", then ",
            )}. Arrow keys tilt the card; Home resets the view.`
          : "Holographic identity card for Vishva Patel. Arrow keys tilt the card; Home resets the view. Use the adjacent button to view the reverse."
      }
    />
  );
}
