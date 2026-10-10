"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import ArchitectureOverview from "./ArchitectureOverview";
const Assembly = dynamic(() => import("./Assembly"), { ssr: false });
export default function ProjectAssembly({
  system,
  stage,
}: {
  system: number;
  stage: number;
}) {
  const host = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!host.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          observer.disconnect();
        }
      },
      { rootMargin: "150px" },
    );
    observer.observe(host.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div
      className={`project-assembly ${ready ? "scene-ready" : ""}`}
      ref={host}
    >
      {near && (
        <Assembly
          system={system}
          stage={stage}
          paused
          reset={0}
          interactive={false}
          onAvailabilityChange={setReady}
        />
      )}
      {!ready && <ArchitectureOverview system={system} />}
    </div>
  );
}
