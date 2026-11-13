"use client";

import { useEffect, useState } from "react";
import { isDocumentVisited, subscribeDarvsState } from "@/lib/darvs-lifecycle";

export default function DarvsLoader() {
  // Always true during SSR so the initial frame 0 HTML contains the full opaque cover
  const [visible, setVisible] = useState(true);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    let exitTimer: ReturnType<typeof setTimeout> | undefined;
    const motionQuery = matchMedia("(prefers-reduced-motion: reduce)");

    const frame = requestAnimationFrame(() => {
      // If the visitor already completed the entry in this document session (e.g. client router nav)
      // or reduced motion is enabled, dismiss loader without animation
      if (isDocumentVisited() || motionQuery.matches) {
        setVisible(false);
      }
    });

    const unsubscribe = subscribeDarvsState((state) => {
      if (state.failed) {
        setExiting(true);
        clearTimeout(exitTimer);
        exitTimer = setTimeout(() => {
          setVisible(false);
        }, 100);
      } else if (state.ready) {
        setExiting(true);
        clearTimeout(exitTimer);
        // Match CSS opacity transition duration
        exitTimer = setTimeout(() => {
          setVisible(false);
        }, 420);
      }
    });


    // Safety fallback: ensure the loader never hangs indefinitely
    const safetyTimer = setTimeout(() => {
      setExiting(true);
      setTimeout(() => setVisible(false), 420);
    }, 8500);

    return () => {
      cancelAnimationFrame(frame);
      unsubscribe();
      clearTimeout(exitTimer);
      clearTimeout(safetyTimer);
    };
  }, []);


  if (!visible) return null;

  return (
    <div
      id="darvs-loader"
      className={`darvs-loader ${exiting ? "is-exiting" : ""}`}
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100svh",
        backgroundColor: "#08070b",
        zIndex: 99999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
      aria-hidden="true"
    >
      <div className="darvs-loader-content">
        <div className="darvs-loader-brand">
          <span className="darvs-loader-title">
            <span>VISHVA</span>
            <span className="darvs-loader-space" aria-hidden="true">&nbsp;</span>
            <span>PATEL</span>
          </span>
        </div>
      </div>
    </div>
  );
}
