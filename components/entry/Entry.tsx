"use client";
import dynamic from "next/dynamic";
import Image from "next/image";
import { createPortal } from "react-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUpRight, ScanLine } from "lucide-react";
import { isDocumentVisited, markDocumentVisited, updateDarvsState } from "@/lib/darvs-lifecycle";

const FaceCanvas = dynamic(() => import("./FaceCanvas"), { ssr: false });
const messages: Record<string, string> = {
  loading: "Preparing the optical subject…",
  ready: "Awaiting scan. Start when you’re ready.",
  initializing: "Initializing the scan sequence…",
  detected: "Subject resolved. Detection stage ready.",
  up: "Tracing upward. Liveness challenge stage.",
  down: "Tracing downward. Embedding stage.",
  verified: "Sequence complete. Opening the portfolio.",
  dissolve: "Welcome inside.",
};

export default function Entry({ onActiveChange, onReveal }: {
  onActiveChange?: (active: boolean) => void;
  onReveal?: () => void;
} = {}) {
  const [active, setActive] = useState(false);
  const [phase, setPhase] = useState("loading");
  const [started, setStarted] = useState(false);
  const [failed, setFailed] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [compact, setCompact] = useState(false);
  const [nudge, setNudge] = useState(false);
  const root = useRef<HTMLElement>(null);
  const scan = useRef<HTMLButtonElement>(null);
  const revealing = useRef(false);

  const transition = useCallback((morph: number, opening: number) => {
    if (!revealing.current) { revealing.current = true; onReveal?.(); }
    const radius = Math.hypot(innerWidth, innerHeight) * .56;
    root.current?.style.setProperty("--portal-scale", String(radius * opening));
    root.current?.style.setProperty("--entry-ui-opacity", String(Math.max(0, 1 - morph * 4)));
  }, [onReveal]);

  const finish = useCallback(() => {
    markDocumentVisited();
    setActive(false);
    updateDarvsState({ active: false, phase: "completed" });
    if (typeof document !== "undefined") {
      document.body.classList.remove("darvs-scan-active");
      document.body.removeAttribute("data-darvs-active");
    }
    onActiveChange?.(false);
    requestAnimationFrame(() => document.getElementById("home-name")?.focus({ preventScroll: true }));
  }, [onActiveChange]);

  const fail = useCallback(() => setFailed(true), []);

  useEffect(() => {
    updateDarvsState({ active });
    if (typeof document !== "undefined") {
      if (active) {
        document.body.classList.add("darvs-scan-active");
        document.body.setAttribute("data-darvs-active", "true");
      } else {
        document.body.classList.remove("darvs-scan-active");
        document.body.removeAttribute("data-darvs-active");
      }
    }
    return () => {
      if (typeof document !== "undefined") {
        document.body.classList.remove("darvs-scan-active");
        document.body.removeAttribute("data-darvs-active");
      }
    };
  }, [active]);

  useEffect(() => {
    if (phase === "ready") {
      updateDarvsState({ ready: true, phase: "ready" });
    } else if (failed) {
      updateDarvsState({ failed: true, phase: "failed" });
    } else if (reduced) {
      updateDarvsState({ ready: true, phase: "reduced" });
    }
  }, [phase, failed, reduced]);

  useEffect(() => {
    if (!active || (!failed && !reduced)) return;
    revealing.current = false;
    root.current?.style.setProperty("--portal-scale", "0");
    root.current?.style.setProperty("--entry-ui-opacity", "1");
  }, [active, failed, reduced]);

  // Client initialization: Synchronously activate entry on first document visit
  useEffect(() => {
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const size = matchMedia("(max-width: 760px), (max-height: 700px)");
    const update = () => { setReduced(motion.matches); setCompact(size.matches); };
    const frame = requestAnimationFrame(() => {
      update();
      const hasSectionHash = typeof window !== "undefined" && Boolean(window.location.hash && window.location.hash.length > 1 && window.location.hash !== "#home");
      if (!isDocumentVisited() && !hasSectionHash) {
        updateDarvsState({ active: true });
        if (typeof document !== "undefined") {
          document.body.classList.add("darvs-scan-active");
          document.body.setAttribute("data-darvs-active", "true");
        }
        setActive(true);
        onActiveChange?.(true);
      } else {
        if (hasSectionHash) {
          markDocumentVisited();
        }
        onActiveChange?.(false);
      }
    });
    motion.addEventListener("change", update);
    size.addEventListener("change", update);

    return () => {
      cancelAnimationFrame(frame);
      motion.removeEventListener("change", update);
      size.removeEventListener("change", update);
    };
  }, [onActiveChange]);


  useEffect(() => {
    if (!active) return;
    const covered = [...document.body.children].filter((element): element is HTMLElement =>
      element instanceof HTMLElement && !element.contains(root.current));
    const previous = covered.map(element => element.inert);
    covered.forEach(element => { element.inert = true; });
    const documentOverflow = document.documentElement.style.overflow;
    const bodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    window.scrollTo({ top: 0, behavior: "instant" });
    root.current?.focus({ preventScroll: true });
    return () => {
      covered.forEach((element, i) => { element.inert = previous[i]; });
      document.documentElement.style.overflow = documentOverflow;
      document.body.style.overflow = bodyOverflow;
    };
  }, [active]);

  useEffect(() => {
    if (active && (failed || reduced || (phase === "ready" && !started))) scan.current?.focus({ preventScroll: true });
  }, [active, phase, started, failed, reduced]);

  useEffect(() => {
    if (!active || phase !== "loading" || failed || reduced) return;
    const timer = setTimeout(fail, 8000);
    return () => clearTimeout(timer);
  }, [active, phase, failed, reduced, fail]);

  useEffect(() => {
    if (!active || !started || failed || reduced) return;
    const timer = setTimeout(fail, 12000);
    return () => clearTimeout(timer);
  }, [active, started, failed, reduced, fail]);

  useEffect(() => {
    if (!active) return;
    let resetNudge: ReturnType<typeof setTimeout> | undefined;
    const feedback = () => {
      if (compact || started) return;
      setNudge(true);
      clearTimeout(resetNudge);
      resetNudge = setTimeout(() => setNudge(false), 700);
    };
    const keyboard = (event: KeyboardEvent) => {
      if (event.key === "Escape" && (compact || failed || reduced)) finish();
      if (event.key !== "Tab") return;
      const controls = [...(root.current?.querySelectorAll<HTMLElement>("button:not(:disabled),a[href],[tabindex='0']") ?? [])]
        .filter(element => getComputedStyle(element).visibility !== "hidden");
      if (!controls.length) { event.preventDefault(); root.current?.focus(); return; }
      const first = controls[0], last = controls.at(-1)!;
      if (event.shiftKey && (document.activeElement === first || document.activeElement === root.current)) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || document.activeElement === root.current)) {
        event.preventDefault(); first.focus();
      }
    };
    window.addEventListener("wheel", feedback, { passive: true });
    window.addEventListener("keydown", keyboard);
    return () => {
      clearTimeout(resetNudge);
      window.removeEventListener("wheel", feedback);
      window.removeEventListener("keydown", keyboard);
    };
  }, [active, compact, started, failed, reduced, finish]);

  if (!active) return (
    <button
      type="button"
      className="replay mono"
      aria-label="Replay DARVS entry scan"
      onClick={() => {
        revealing.current = false;
        setFailed(false);
        setStarted(false);
        setPhase("loading");
        updateDarvsState({ active: true, phase: "loading", ready: false, failed: false });
        if (typeof document !== "undefined") {
          document.body.classList.add("darvs-scan-active");
          document.body.setAttribute("data-darvs-active", "true");
        }
        setActive(true);
        onActiveChange?.(true);
      }}
    >
      REPLAY ENTRY ↗
    </button>
  );

  const alternative = compact || failed || reduced;

  return createPortal(
    <section ref={root} tabIndex={-1} className={`entry scan-entry ${nudge ? "scan-nudge" : ""} ${phase === "dissolve" && !failed && !reduced ? "is-opening" : ""}`}
      role="dialog" aria-modal="true" aria-labelledby="scan-entry-title" aria-describedby="scan-entry-description" data-testid="entry" data-phase={phase} data-scan-started={started}>
      <svg className="entry-veil" aria-hidden="true" width="100%" height="100%">
        <defs><mask id="scan-reveal" maskUnits="userSpaceOnUse" x="0" y="0" width="100%" height="100%" style={{ maskType: "luminance" }}>
          <rect width="100%" height="100%" fill="white" />
          <circle className="entry-aperture" cx="50%" cy="50%" r="1" fill="black" />
        </mask></defs>
        <rect width="100%" height="100%" fill="#08070b" mask="url(#scan-reveal)" />
      </svg>
      <div className="scan-entry-header mono"><span>VISHVAPROJECTS</span><span className="scan-overview">DARVS System Overview</span></div>
      <div className="scan-entry-body">
        <div className="scan-entry-title"><h2 id="scan-entry-title">Scan to enter.</h2><p>Authenticate your identity</p></div>
        <div className="scan-chamber">
          {failed || reduced ? <div className="scan-poster"><Image src="/face/head-poster.png" alt="Illustrative 3D head" width={700} height={700} unoptimized /></div>
            : <FaceCanvas started={started} onPhase={setPhase} onDone={finish} onError={fail} onTransition={transition} />}
          <div className="scan-target" aria-hidden="true"><i /><i /><i /><i /></div>
        </div>
        <div className="scan-control-deck">
          <span className="entry-sr-only" role="status">{failed ? "The preview is unavailable. Continue to the portfolio." : reduced ? "Motion is reduced. Continue to the portfolio." : messages[phase]}</span>
          {(failed || reduced) && <p className="scan-fallback-message">{failed ? "Preview unavailable. You can still enter." : "Reduced motion is enabled."}</p>}
          <div className="scan-entry-actions">
            <button type="button" ref={scan} className="button scan-trigger" disabled={!failed && !reduced && (started || phase === "loading")}
              onClick={() => failed || reduced ? finish() : setStarted(true)}>
              <ScanLine size={19} /> {failed || reduced ? "ENTER PORTFOLIO" : started ? "SCANNING…" : phase === "loading" ? "PREPARING…" : "SCAN"} <ArrowUpRight size={17} />
            </button>
            {alternative && <button type="button" className="text-button scan-skip" onClick={finish}>Skip intro →</button>}
          </div>
          <p id="scan-entry-description" className="entry-sr-only">An interactive visual scan demonstration. No camera access or biometric authentication is performed.</p>
        </div>
      </div>
    </section>, document.body,
  );
}

