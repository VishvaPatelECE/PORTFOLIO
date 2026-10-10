"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useHomeMotion } from "./HomeMotion";
export type ReferenceFieldKind =
  | "flow-field"
  | "matrix-field"
  | "constellation-field"
  | "gateway-flow";

/** Actual MIT ThreeUI Community renderers, bounded to the visible section. */
export default function ReferenceField({
  kind,
  enabled = true,
  paused = false,
}: {
  kind: ReferenceFieldKind;
  enabled?: boolean;
  paused?: boolean;
}) {
  const root = useRef<HTMLDivElement>(null);
  const homeMotion = useHomeMotion();
  const [visible, setVisible] = useState(false);
  const [reduced, setReduced] = useState(true);
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const preference = () => setReduced(media.matches);
    const visibility = () => setHidden(document.hidden);
    preference();
    visibility();
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.05 },
    );
    if (root.current) observer.observe(root.current);
    media.addEventListener("change", preference);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      observer.disconnect();
      media.removeEventListener("change", preference);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);
  const sendControls = useCallback(
    () =>
      root.current?.querySelectorAll("iframe").forEach((frame) => {
        frame.tabIndex = -1;
        frame.setAttribute("aria-hidden", "true");
        frame.contentWindow?.postMessage(
          {
            type: "threeui-controls",
            controls: { speed: kind === "flow-field" ? 1 : 0.65 },
          },
          "*",
        );
      }),
    [kind],
  );
  useEffect(() => sendControls(), [sendControls]);
  const render =
    enabled && visible && !reduced && !hidden && !paused && !homeMotion.paused;
  return (
    <div
      ref={root}
      className={`reference-field reference-${kind}`}
      data-threeui-effect={kind}
      aria-hidden="true"
      inert
      onLoadCapture={sendControls}
    >
      {render && (
        <iframe
          key={kind}
          title={kind.replaceAll("-", " ")}
          src={`/threeui/${kind}.html`}
          sandbox="allow-scripts"
          tabIndex={-1}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
