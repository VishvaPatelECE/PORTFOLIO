"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useReducer, useRef, useState, type MouseEvent, type PointerEvent } from "react";
import { motion, useInView, useMotionTemplate, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowRight, ArrowUpRight, Camera, Check, ChevronDown, Fingerprint, Pause, Play, RotateCcw, ScanFace, ScanLine, ShieldCheck } from "lucide-react";
import { darvsStages } from "@/lib/content/darvs";
import { darvsPreviewDecision, darvsPreviewReducer, initialDarvsPreview, previewChallenges, previewExampleSteps, runDarvsPreviewExample, type DarvsPreviewState } from "@/lib/models/darvsPreview";
import { useHomeMotion } from "./HomeMotion";

const stageIcons = [ScanFace, ScanLine, Fingerprint, ShieldCheck];
const summaries = ["Locate a face region before identity matching.", "Presence needs a completed response.", "Compare representations, not appearances.", "Liveness and identity must both hold."];

function pipelineStates(state: DarvsPreviewState) {
  const live = state.responses === previewChallenges.length;
  return [state.region ? "FRAME PRESENT" : "EMPTY FRAME", state.region ? "REGION FOUND" : "NO REGION", `${state.responses} / 3 RESPONSES`, live ? state.match ? "MATCH" : "NO MATCH" : "GATED", darvsPreviewDecision(state)];
}

function Pipeline({ state, stage }: { state: DarvsPreviewState; stage: number }) {
  const id = useId().replaceAll(":", "");
  const names = ["CAMERA", ...darvsStages.map(item => item.name)];
  const icons = [Camera, ...stageIcons];
  const values = pipelineStates(state);
  const completed = [state.region, state.region, state.responses === 3, state.match && state.responses === 3, darvsPreviewDecision(state) === "ACCEPT"];
  return (
    <div className="showcase-pipeline">
      <svg className="showcase-pipeline-wide" viewBox="0 0 960 265" role="img" aria-labelledby={`${id}-title ${id}-desc`}>
        <title id={`${id}-title`}>DARVS architecture example</title>
        <desc id={`${id}-desc`}>Camera to MTCNN, liveness, FaceNet and decision. {values.join(". ")}. This is an illustrative state, not camera inference.</desc>
        <defs>
          <marker id={`${id}-arrow`} markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto"><path d="M0 0L6 3.5L0 7" fill="none" stroke="currentColor" /></marker>
        </defs>
        {names.slice(0, -1).map((name, i) => (
          <path key={name} className={`pipeline-connection ${completed[i] ? "is-reached" : ""}`} d={`M${132 + i * 196} 123H${224 + i * 196}`} markerEnd={`url(#${id}-arrow)`} />
        ))}
        {names.map((name, i) => {
          const Icon = icons[i];
          const x = 88 + i * 196;
          return (
            <g key={name} className={`pipeline-node ${stage + 1 === i ? "is-selected" : ""} ${completed[i] ? "is-reached" : ""}`}>
              <circle className="pipeline-orbit" cx={x} cy="123" r="51" />
              <circle className="pipeline-core" cx={x} cy="123" r="35" />
              <Icon x={x - 16} y={107} width={32} height={32} strokeWidth={1.2} />
              <text className="pipeline-name" x={x} y="207" textAnchor="middle">{name}</text>
              <text className="pipeline-value" x={x} y="232" textAnchor="middle">{values[i]}</text>
              {completed[i] && <Check x={x + 25} y={75} width={17} height={17} strokeWidth={1.5} />}
            </g>
          );
        })}
      </svg>
      <ol className="showcase-pipeline-compact" aria-label="DARVS architecture example">
        {names.map((name, i) => {
          const Icon = icons[i];
          return <li key={name} className={stage + 1 === i ? "is-selected" : ""}><Icon size={22} strokeWidth={1.2} /><strong>{name}</strong><span>{values[i]}</span></li>;
        })}
      </ol>
    </div>
  );
}

export default function DarvsShowcase({ headingLevel = "h3" }: { headingLevel?: "h2" | "h3" }) {
  const root = useRef<HTMLElement>(null);
  const visible = useInView(root, { amount: .12 });
  const reduced = useReducedMotion();
  const { paused, setPaused } = useHomeMotion();
  const [stage, setStage] = useState(0);
  const [state, dispatch] = useReducer(darvsPreviewReducer, initialDarvsPreview);
  const [hidden, setHidden] = useState(false);
  const [keyboard, setKeyboard] = useState(false);
  const [finePointer, setFinePointer] = useState(false);
  const cancel = useRef<(() => void) | null>(null);
  const x = useMotionValue(0), y = useMotionValue(0);
  const lightX = useMotionValue(50), lightY = useMotionValue(35);
  const pointerX = useSpring(x, { stiffness: 160, damping: 30, mass: .8 });
  const pointerY = useSpring(y, { stiffness: 160, damping: 30, mass: .8 });
  const { scrollYProgress } = useScroll({ target: root, offset: ["start end", "center center"] });
  const arrivalAngle = useTransform(scrollYProgress, [0, 1], [10, 0]);
  const arrivalY = useTransform(scrollYProgress, [0, 1], [35, 0]);
  const moveAllowed = finePointer && visible && !reduced && !paused && !hidden && !keyboard;
  const rotateX = useTransform(() => moveAllowed ? arrivalAngle.get() + pointerY.get() : 0);
  const rotateY = useTransform(() => moveAllowed ? pointerX.get() : 0);
  const offsetY = useTransform(() => moveAllowed ? arrivalY.get() : 0);
  const light = useMotionTemplate`radial-gradient(ellipse at ${lightX}% ${lightY}%, #b99d7325, #00aebd0b 45%, transparent 75%)`;
  const current = darvsStages[stage];
  const Icon = stageIcons[stage];
  const Heading = headingLevel;
  const StageHeading = headingLevel === "h2" ? "h3" : "h4";
  const stop = useCallback(() => { cancel.current?.(); cancel.current = null; }, []);

  useEffect(() => () => cancel.current?.(), []);
  useEffect(() => {
    const change = () => setHidden(document.hidden);
    change();
    document.addEventListener("visibilitychange", change);
    return () => document.removeEventListener("visibilitychange", change);
  }, []);
  useEffect(() => {
    const media = matchMedia("(hover: hover) and (pointer: fine)");
    const change = () => setFinePointer(media.matches);
    change();
    media.addEventListener("change", change);
    return () => media.removeEventListener("change", change);
  }, []);
  useEffect(() => {
    if (!visible || hidden || paused || reduced) stop();
  }, [visible, hidden, paused, reduced, stop]);
  useEffect(() => {
    if (moveAllowed) return;
    x.set(0); y.set(0); pointerX.jump(0); pointerY.jump(0);
    lightX.set(50); lightY.set(35);
  }, [moveAllowed, x, y, pointerX, pointerY, lightX, lightY]);

  const select = (index: number) => { stop(); setStage(index); };
  const move = (event: PointerEvent<HTMLDivElement>) => {
    if (!moveAllowed || !["mouse", "pen"].includes(event.pointerType)) return;
    const box = event.currentTarget.getBoundingClientRect();
    if (!box.width || !box.height) return;
    const nx = Math.max(-1, Math.min(1, (event.clientX - box.left) / box.width * 2 - 1));
    const ny = Math.max(-1, Math.min(1, (event.clientY - box.top) / box.height * 2 - 1));
    x.set(nx * 4); y.set(-ny * 3);
    lightX.set(50 + nx * 25); lightY.set(35 + ny * 20);
  };
  const resetPose = () => { x.set(0); y.set(0); lightX.set(50); lightY.set(35); };
  const example = (event: MouseEvent<HTMLButtonElement>) => {
    stop();
    const step = (item: typeof previewExampleSteps[number]) => { setStage(item.stage); item.actions.forEach(dispatch); };
    if (reduced || paused || event.detail === 0) {
      previewExampleSteps.forEach(step);
      return;
    }
    cancel.current = runDarvsPreviewExample(step, () => { cancel.current = null; });
  };
  const reset = () => { stop(); dispatch({ type: "reset" }); setStage(0); };

  return (
    <article ref={root} id="darvs-demo" className="project-feature darvs-feature darvs-showcase" data-still={!moveAllowed}
      onPointerEnter={() => setKeyboard(false)} onKeyDownCapture={event => { if (["Tab", "Enter", " "].includes(event.key)) setKeyboard(true); }}>
      <header className="showcase-heading">
        <div><Heading>DARVS<span>.</span></Heading><p>Presence before permission.</p></div>
        <Link className="text-link" href="/darvs">Open project <ArrowUpRight size={17} /></Link>
      </header>
      <div className="showcase-stage-rail" aria-label="Select a pipeline stage">
        {darvsStages.map((item, i) => <button key={item.name} aria-pressed={stage === i} onClick={() => select(i)}>{item.name}<ArrowRight size={15} /></button>)}
      </div>
      <div className="showcase-layout">
        <div className="showcase-perspective" onPointerMove={move} onPointerLeave={resetPose}>
          <motion.div className="showcase-plane" style={{ rotateX, rotateY, y: offsetY }}>
            <motion.div className="showcase-light" aria-hidden="true" style={{ background: light }} />
            <div className="showcase-plane-top"><span>CAMERA → DECISION</span><span>ARCHITECTURE EXAMPLE</span></div>
            <div className="showcase-plane-title"><Icon size={30} strokeWidth={1.1} /><strong>{current.name}</strong></div>
            <Pipeline state={state} stage={stage} />
            <div className="showcase-plane-footer"><span>ILLUSTRATIVE · NO CAMERA / MODEL INFERENCE</span><span className={darvsPreviewDecision(state) === "ACCEPT" ? "signal" : "gold"}>{darvsPreviewDecision(state)}</span></div>
          </motion.div>
        </div>
        <aside className="showcase-inspection" aria-live="polite">
          <StageHeading>{current.title}</StageHeading>
          <p>{summaries[stage]}</p>
          <div className="showcase-example-control">
            {stage === 0 && <button className="button" aria-pressed={state.region} onClick={() => { stop(); dispatch({ type: "toggle-region" }); }}>{state.region ? "Show empty frame" : "Show face region"}<ScanFace size={16} /></button>}
            {stage === 1 && <><strong className="showcase-challenge">{state.responses < 3 ? previewChallenges[state.responses] : "SEQUENCE COMPLETE"}</strong><button className="button" disabled={!state.region} onClick={() => { stop(); dispatch({ type: state.responses < 3 ? "respond" : "reset-challenges" }); }}>{state.responses < 3 ? "Mark example response" : "Retry challenges"}<Check size={16} /></button></>}
            {stage === 2 && <><p className="showcase-gate-note">{state.responses < 3 ? "Complete the example challenges to enable comparison." : state.match ? "An identity match is selected in this example." : "A match is still required."}</p><button className="button" disabled={!state.region || state.responses < 3} aria-pressed={state.match} onClick={() => { stop(); dispatch({ type: "toggle-match" }); }}>{state.match ? "Show no match" : "Select example match"}<Fingerprint size={16} /></button></>}
            {stage === 3 && <dl className="showcase-conditions"><div><dt>Liveness</dt><dd>{state.responses === 3 ? "Complete" : "Incomplete"}</dd></div><div><dt>Identity</dt><dd>{state.match ? "Match" : "No match"}</dd></div><div><dt>Decision</dt><dd>{darvsPreviewDecision(state)}</dd></div></dl>}
          </div>
          <div className="showcase-run-controls"><button className="text-button" onClick={example}>Run example<Play size={14} /></button><button className="showcase-reset" onClick={reset} aria-label="Reset DARVS example"><RotateCcw size={16} /></button></div>
          <button className="showcase-pause" aria-pressed={paused} disabled={!!reduced} onClick={() => setPaused(!paused)}>{paused ? <Play size={14} /> : <Pause size={14} />}{paused ? "Resume motion" : "Pause motion"}</button>
        </aside>
      </div>
      <div className="showcase-notes">
        <details name="darvs-showcase-notes"><summary>Problem<ChevronDown size={16} /></summary><p>Finding a face does not establish identity. The system must coordinate presence, challenge responses and a match before reaching a decision.</p></details>
        <details name="darvs-showcase-notes" onToggle={event => { if (event.currentTarget.open) select(1); }}><summary>Approach<ChevronDown size={16} /></summary><p>The local prototype connects OpenCV camera input, MTCNN face detection, movement/eye-liveness challenges and FaceNet embedding comparison through a state machine.</p></details>
        <details name="darvs-showcase-notes"><summary>Evidence<ChevronDown size={16} /></summary><p>{current.body}</p><p>{current.note}</p><Link className="text-link" href="/darvs">Inspect the complete walkthrough <ArrowUpRight size={15} /></Link></details>
      </div>
    </article>
  );
}
