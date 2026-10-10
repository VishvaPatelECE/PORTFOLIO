"use client";
import { useEffect, useRef } from "react";
import {
  createAssembly,
  type AssemblyController,
} from "@/three/assembly/createAssembly";

export default function Assembly({
  system,
  stage,
  paused,
  reset,
  interactive = true,
  onAvailabilityChange,
}: {
  system: number;
  stage: number;
  paused: boolean;
  reset: number;
  interactive?: boolean;
  onAvailabilityChange?: (ready: boolean) => void;
}) {
  const host = useRef<HTMLDivElement>(null);
  const controller = useRef<AssemblyController | null>(null);
  useEffect(() => {
    if (!host.current) return;
    try {
      controller.current = createAssembly(host.current, () =>
        onAvailabilityChange?.(false),
      );
      onAvailabilityChange?.(true);
    } catch {
      host.current.dataset.fallback = "true";
      onAvailabilityChange?.(false);
    }
    return () => {
      controller.current?.dispose();
      controller.current = null;
    };
  }, [onAvailabilityChange]);
  useEffect(() => controller.current?.select(system, stage), [system, stage]);
  useEffect(() => controller.current?.pause(paused), [paused]);
  useEffect(() => controller.current?.reset(), [reset]);
  return (
    <div
      className="assembly-renderer"
      ref={host}
      tabIndex={interactive ? 0 : undefined}
      role="img"
      aria-label={
        interactive
          ? "Interactive 3D architecture sculpture. Use arrow keys or drag to change the viewpoint. Select a system and stage using the adjacent buttons."
          : "Procedural 3D architecture schematic, rendered from the same geometry as the home instrument."
      }
      style={interactive ? undefined : { pointerEvents: "none" }}
    />
  );
}
