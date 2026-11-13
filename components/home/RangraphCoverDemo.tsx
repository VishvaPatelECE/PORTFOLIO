"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { motion, useInView, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Pause, Play } from "lucide-react";
import type { GraphSequence, RanGraph } from "@/lib/rangraph";
import { featuredProjects, workbenchProjects } from "@/lib/content/projects";
import { useHomeMotion } from "./HomeMotion";
import SignalTubes from "./SignalTubes";
import styles from "./RangraphCoverDemo.module.css";

type Point = readonly [number, number];
// Presentation coordinates only. UE positions are not supplied by this fixture.
const wideLayout: Record<string, Point> = { "gnb-1": [300, 355], "gnb-2": [885, 355], "ue-1": [610, 220], "ue-2": [600, 520], "ue-3": [1060, 200] };
const compactLayout: Record<string, Point> = { "gnb-1": [170, 325], "gnb-2": [510, 325], "ue-1": [285, 170], "ue-2": [350, 480], "ue-3": [605, 170] };

function associationPath(source: Point, target: Point) {
  const dx = target[0] - source[0], dy = target[1] - source[1], length = Math.hypot(dx, dy) || 1;
  const start = [source[0] + dx / length * 24, source[1] + dy / length * 24];
  const end = [target[0] - dx / length * 52, target[1] - dy / length * 52];
  const middle = (start[0] + end[0]) / 2;
  return `M ${start[0]} ${start[1]} C ${middle} ${start[1]}, ${middle} ${end[1]}, ${end[0]} ${end[1]}`;
}

function GraphArtwork({ graph, compact, animated, handoverUe }: { graph: RanGraph; compact: boolean; animated: boolean; handoverUe?: string }) {
  const id = useId().replace(/:/g, ""), layout = compact ? compactLayout : wideLayout;
  return <svg className={compact ? styles.compact : styles.wide} viewBox={compact ? "0 0 700 600" : "0 0 1200 640"} aria-hidden="true">
    <defs>
      {(["gold", "signal"] as const).map(color => <marker key={color} id={`${id}-${color}`} markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto" markerUnits="userSpaceOnUse"><path d="M 1 1 L 6 4 L 1 7" fill="none" stroke={`var(--${color})`} strokeWidth="1.5" /></marker>)}
    </defs>
    {graph.edges.filter(edge => edge.type === "association").map(edge => {
      const source = layout[edge.source.entityId], target = layout[edge.target.entityId];
      if (!source || !target) return null;
      const color = edge.source.entityId === handoverUe ? "gold" : "signal";
      const d = associationPath(source, target);
      return <motion.path key={`${edge.type}:${edge.source.entityId}`} className={styles.edge} initial={false} animate={{ d }} transition={{ duration: animated ? .42 : 0, ease: [.22, 1, .36, 1] }} stroke={`var(--${color})`} markerEnd={`url(#${id}-${color})`} data-source={edge.source.entityId} data-target={edge.target.entityId} data-edge-type={edge.type} />;
    })}
    {graph.nodes.map(node => {
      const point = layout[node.key.entityId];
      if (!point) return null;
      const station = node.key.nodeType === "gNB", detached = !station && node.references.serving_gnb_id === null;
      const anchor = point[0] > (compact ? 570 : 1000) ? "end" : "middle";
      return <g key={node.key.entityId} transform={`translate(${point[0]} ${point[1]})`} className={station ? styles.station : styles.device} data-entity={node.key.entityId}>
        {station ? <><circle className={styles.stationOuter} r="76" /><circle className={styles.stationInner} r="54" /><circle className={styles.nodeDisc} r="34" /><circle className={styles.nodeCore} r="8" /></> : <><circle className={styles.nodeDisc} r="21" strokeDasharray={detached ? "3 5" : undefined} /><circle className={styles.nodeCore} r="5" /></>}
        <text className={styles.nodeLabel} y={station ? 112 : -39} textAnchor={anchor}>{node.key.entityId}</text>
        {detached && <text className={styles.nodeNote} y="49" textAnchor={anchor}>Unassociated</text>}
      </g>;
    })}
  </svg>;
}

const emptySubscribe = () => () => {};

export default function RangraphCoverDemo({ sequence }: { sequence: GraphSequence }) {
  const cover = useRef<HTMLElement>(null);
  const isHydrated = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const reduced = useReducedMotion(), visible = useInView(cover, { amount: .05 });
  const effectiveReduced = isHydrated ? !!reduced : false;
  const { paused, setPaused } = useHomeMotion();
  const [time, setTime] = useState(0), [instant, setInstant] = useState(true), [hidden, setHidden] = useState(false), [focused, setFocused] = useState(false);
  const { scrollYProgress } = useScroll({ target: cover, offset: ["start end", "start .2"] });
  const graphY = useTransform(scrollYProgress, [0, 1], [32, 0]);
  const reveal = useTransform(scrollYProgress, [0, 1], ["inset(0 0 7% 0)", "inset(0 0 0% 0)"]);
  useEffect(() => {
    const change = () => setHidden(document.hidden); change();
    document.addEventListener("visibilitychange", change);
    return () => document.removeEventListener("visibilitychange", change);
  }, []);
  const enabled = !reduced && !paused && !hidden && visible && !focused;
  const graph = sequence.graphs[time], handover = sequence.handoverEvents[0];
  const serving = graph.nodes.find(node => node.key.entityId === handover?.ueId)?.references.serving_gnb_id;
  const timestamp = graph.nodes[0].timestamp;
  return <main id="main" className={styles.demo}>
    <SignalTubes />
    <div className={styles.container}>
      <header className={styles.pageHeading}>
        <h1>Selected work<span>.</span></h1>
        <button className={styles.pause} onClick={() => setPaused(!paused)} aria-pressed={paused} aria-label={paused ? "Resume demo motion" : "Pause demo motion"} disabled={effectiveReduced}>{paused ? <Play size={16} /> : <Pause size={16} />}<span>{paused ? "Resume motion" : "Pause motion"}</span></button>
      </header>
      <article ref={cover} className={styles.cover} data-motion-enabled={enabled}>
        <Link className={styles.coverLink} href="/rangraph" prefetch={false} aria-label="Open RANGraph project" onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}>
          <div className={styles.projectHeading}><h2>RANGraph</h2><p>Radio access networks, represented as graphs.</p></div>
          <motion.div className={styles.artwork} style={{ y: enabled ? graphY : 0, clipPath: enabled ? reveal : "none" }}>
            <GraphArtwork graph={graph} compact={false} animated={enabled && !instant} handoverUe={handover?.ueId} />
            <GraphArtwork graph={graph} compact animated={enabled && !instant} handoverUe={handover?.ueId} />
          </motion.div>
          <div className={styles.projectAction}><span>Open project</span><ArrowUpRight size={25} strokeWidth={1.3} /></div>
        </Link>
        <div className={styles.snapshotControl} role="group" aria-label="Fixture timestep">
          {sequence.graphs.map((snapshot, index) => {
            const second = snapshot.nodes[0].timestamp;
            return <button key={second} aria-label={`Show fixture at ${second} ${second === 1 ? "second" : "seconds"}`} aria-pressed={time === index} onClick={event => { setInstant(event.detail === 0 || !!reduced || paused); setTime(index); }}>{second}s</button>;
          })}
        </div>
      </article>
      <div className={styles.coverCaption}>
        <p role="status" aria-live="polite">{handover ? <><span>{handover.ueId}</span> is served by <span>{String(serving)}</span> at {timestamp}s.</> : "Relationships from the source fixture."}</p>
        <p>Golden fixture · Schematic layout</p>
      </div>
      <nav className={styles.nextProjects} aria-label="More projects">
        {featuredProjects.slice(1).map(project => <Link key={project.name} href={project.href} prefetch={false}><span>{project.name}</span><span>{project.field}</span><ArrowUpRight size={18} /></Link>)}
      </nav>
      <div className={styles.supporting}>{workbenchProjects.map(project => <Link key={project.name} href={project.href} prefetch={false}>{project.name}</Link>)}</div>
    </div>
  </main>;
}
