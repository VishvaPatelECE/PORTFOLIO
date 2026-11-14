"use client";
import { useEffect, useRef } from "react";
import { createFace, type FaceController } from "@/three/face/createFace";
export default function FaceCanvas({
  onPhase,
  onDone,
  onError,
  started,
  onTransition,
}: {
  onPhase: (phase: string) => void;
  onDone: () => void;
  onError: () => void;
  started: boolean;
  onTransition: (morph: number, opening: number) => void;
}) {
  const host = useRef<HTMLDivElement>(null);
  const controller = useRef<FaceController | null>(null);
  const shouldStart = useRef(started);
  useEffect(() => {
    shouldStart.current = started;
    if (started) controller.current?.startScan();
  }, [started]);
  useEffect(() => {
    const abort = new AbortController();
    if (host.current)
      void createFace(
        host.current,
        onPhase,
        onDone,
        onError,
        abort.signal,
        onTransition,
      ).then((instance) => {
        if (abort.signal.aborted) { instance.dispose(); return; }
        controller.current = instance;
        if (shouldStart.current) instance.startScan();
      });
    return () => {
      abort.abort();
      controller.current?.dispose();
      controller.current = null;
    };
  }, [onPhase, onDone, onError, onTransition]);
  return (
    <div
      ref={host}
      className="face-canvas"
      tabIndex={0}
      role="img"
      aria-label="Interactive 3D face. Move or drag to look left, right, up and down. Arrow keys rotate; Shift plus arrows moves the face; Home or double-click resets. This is a visual demonstration without camera access."
    />
  );
}
