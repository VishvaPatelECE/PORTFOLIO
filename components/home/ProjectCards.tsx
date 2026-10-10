"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, LayoutList, Pause, Play } from "lucide-react";
import { featuredProjects, workbenchProjects } from "@/lib/content/projects";
import { projectCovers } from "@/lib/content/project-covers";
import { useHomeMotion } from "./HomeMotion";
import SignalTubes from "./SignalTubes";
import styles from "./ProjectCards.module.css";

const positionKey = "vishva-project-deck-position";

export default function ProjectCards() {
  const root = useRef<HTMLElement>(null), track = useRef<HTMLOListElement>(null);
  const current = useRef(0), pending = useRef(false), restored = useRef(false);
  const reduced = useReducedMotion(), visible = useInView(root, { amount: .05 });
  const { paused, setPaused } = useHomeMotion();
  const [active, setActive] = useState(0), [viewAll, setViewAll] = useState(false), [hidden, setHidden] = useState(false);
  const moving = visible && !reduced && !paused && !hidden;
  const remember = useCallback((index: number) => {
    current.current = index; setActive(index);
    try { sessionStorage.setItem(positionKey, String(index)); } catch { /* Storage is optional. */ }
  }, []);
  const select = useCallback((index: number, instant: boolean) => {
    const list = track.current;
    if (!list || !list.children[1]) return;
    const first = list.children[0] as HTMLElement, second = list.children[1] as HTMLElement;
    const next = Math.max(0, Math.min(featuredProjects.length - 1, index));
    pending.current = true; remember(next);
    list.scrollTo({ left: next * (second.offsetLeft - first.offsetLeft), behavior: instant ? "instant" : "smooth" });
    if (instant) pending.current = false;
  }, [remember]);
  useEffect(() => {
    const change = () => setHidden(document.hidden);
    change(); document.addEventListener("visibilitychange", change);
    return () => document.removeEventListener("visibilitychange", change);
  }, []);
  useEffect(() => {
    const list = track.current;
    if (!list || viewAll) return;
    if (!restored.current) {
      restored.current = true;
      try { const saved = Number(sessionStorage.getItem(positionKey)); if (Number.isInteger(saved)) current.current = Math.max(0, Math.min(3, saved)); } catch { /* Native first cover remains available. */ }
    }
    select(current.current, true);
    let frame = 0, settle: ReturnType<typeof setTimeout> | undefined;
    const measure = () => {
      if (pending.current) return;
      const first = list.children[0] as HTMLElement, second = list.children[1] as HTMLElement;
      const step = second.offsetLeft - first.offsetLeft;
      if (step > 0) {
        const next = Math.max(0, Math.min(3, Math.round(list.scrollLeft / step)));
        if (current.current !== next) remember(next);
      }
    };
    const done = () => {
      pending.current = false; measure();
    };
    const scroll = () => {
      if (!frame) frame = requestAnimationFrame(() => { frame = 0; measure(); });
      clearTimeout(settle); settle = setTimeout(done, 140);
    };
    const interrupt = () => { pending.current = false; };
    const resize = new ResizeObserver(() => select(current.current, true));
    resize.observe(list);
    list.addEventListener("scroll", scroll, { passive: true }); list.addEventListener("scrollend", done);
    list.addEventListener("touchstart", interrupt, { passive: true }); list.addEventListener("wheel", interrupt, { passive: true });
    return () => {
      resize.disconnect(); cancelAnimationFrame(frame); clearTimeout(settle);
      list.removeEventListener("scroll", scroll); list.removeEventListener("scrollend", done);
      list.removeEventListener("touchstart", interrupt); list.removeEventListener("wheel", interrupt);
    };
  }, [viewAll, remember, select]);
  useEffect(() => { if (!moving && !viewAll) select(current.current, true); }, [moving, viewAll, select]);
  const keyboard = (event: KeyboardEvent<HTMLOListElement>) => {
    if (viewAll || event.altKey || event.ctrlKey || event.metaKey) return;
    const target = event.key === "ArrowRight" ? current.current + 1 : event.key === "ArrowLeft" ? current.current - 1 : event.key === "Home" ? 0 : event.key === "End" ? 3 : null;
    if (target !== null) {
      event.preventDefault();
      const next = Math.max(0, Math.min(3, target));
      select(next, true);
      track.current?.children[next]?.querySelector<HTMLAnchorElement>("a")?.focus({ preventScroll: true });
    }
  };
  return <section ref={root} id="systems" className={styles.section} aria-labelledby="project-cards-title" data-moving={moving} data-view-all={viewAll}>
    <span id="research" className={styles.anchor} />
    <SignalTubes />
    <header className={`${styles.heading} wrap`}>
      <h2 id="project-cards-title">Selected work<span>.</span></h2>
      <div className={styles.tools}>
        <button onClick={() => setViewAll(!viewAll)} aria-pressed={viewAll} aria-label={viewAll ? "Show project deck" : "View all projects"}><LayoutList size={17} /><span>{viewAll ? "Show deck" : "View all"}</span></button>
        <button onClick={() => setPaused(!paused)} disabled={!!reduced} aria-pressed={paused} aria-label={paused ? "Resume project motion" : "Pause project motion"}>{paused ? <Play size={17} /> : <Pause size={17} />}</button>
      </div>
    </header>
    <div className={`${styles.window} wrap`}>
      <ol ref={track} className={styles.track} tabIndex={viewAll ? undefined : 0} aria-label="Project deck. Use left and right arrows to browse." onKeyDown={keyboard}>
        {featuredProjects.map((project, index) => {
          const cover = projectCovers[project.kind];
          return <li key={project.name} className={styles.slide}>
            <Link href={project.href} prefetch={false} className={styles.cover} aria-label={`Open ${project.name} project`} onFocus={() => { if (!viewAll) select(index, true); }}>
              <Image src={cover.image} alt={cover.alt} fill sizes="(max-width: 600px) 85vw, (max-width: 900px) 90vw, 1080px" placeholder="blur" draggable={false} />
              <h3>{project.name}</h3>
            </Link>
          </li>;
        })}
      </ol>
      {!viewAll && <div className={styles.navigation}>
        <div className={styles.positions} role="group" aria-label="Choose a project">{featuredProjects.map((project, index) => <button key={project.name} aria-label={`Show ${project.name}`} aria-pressed={active === index} onClick={event => select(index, event.detail === 0 || !moving)}><span /></button>)}</div>
        <div className={styles.arrows}><button aria-label="Previous project" disabled={active === 0} onClick={event => select(current.current - 1, event.detail === 0 || !moving)}><ArrowLeft size={21} /></button><button aria-label="Next project" disabled={active === 3} onClick={event => select(current.current + 1, event.detail === 0 || !moving)}><ArrowRight size={21} /></button></div>
        <p className="sr-only" role="status" aria-live="polite">{featuredProjects[active].name}, {active + 1} of 4</p>
      </div>}
      <div className={styles.supporting}>{workbenchProjects.map(project => <Link key={project.name} prefetch={false} href={project.href}>{project.name}</Link>)}</div>
    </div>
  </section>;
}
