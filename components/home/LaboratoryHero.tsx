"use client";
import { useCallback, useState, useSyncExternalStore } from "react";
import { useReducedMotion } from "framer-motion";
import { ArrowUpRight, Pause, Play } from "lucide-react";
import Entry from "@/components/entry/Entry";
import ReferenceField from "./ReferenceField";
import IgnitionLink from "./IgnitionLink";
import { useHomeMotion } from "./HomeMotion";
import AvatarScene from "./AvatarScene";
import HeroNameAnimated from "./HeroNameAnimated";

const emptySubscribe = () => () => {};

export default function LaboratoryHero() {
  const [intro, setIntro] = useState(true);
  const [opening, setOpening] = useState(false);
  const [showMethod, setShowMethod] = useState(false);
  const [methodInstant, setMethodInstant] = useState(false);
  const { paused, setPaused } = useHomeMotion();
  const isHydrated = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const reduced = useReducedMotion();
  const effectiveReduced = isHydrated ? !!reduced : false;
  const changeIntro = useCallback((active: boolean) => {
    setIntro(active);
    if (active) setOpening(false);
  }, []);
  const beginReveal = useCallback(() => setOpening(true), []);
  const toggleMethod = useCallback((detail: number) => {
    setMethodInstant(detail === 0);
    setShowMethod((value) => {
      const next = !value;
      if (next && typeof window !== "undefined" && window.innerWidth <= 760) {
        requestAnimationFrame(() => {
          document.getElementById("avatar-method")?.scrollIntoView({
            block: "nearest",
            behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
              ? "auto"
              : "smooth",
          });
        });
      }
      return next;
    });
  }, []);

  return (
    <section
      className={`signal-hero ${intro ? "intro-running" : ""} ${opening ? "hero-opening" : ""}`}
      aria-label="Interactive engineering portfolio"
    >
      <ReferenceField kind="flow-field" paused={paused || (intro && !opening)} />
      <div className="signal-shade" aria-hidden="true" />
      <div className="signal-composition wrap">
        <div className="signal-tools">
          <button
            className="signal-motion-toggle"
            aria-label={paused ? "Resume visual motion" : "Pause visual motion"}
            aria-pressed={paused}
            disabled={effectiveReduced}
            onClick={() => setPaused(!paused)}
          >
            {paused ? <Play size={16} /> : <Pause size={16} />}
          </button>
          <div className="signal-replay">
            <Entry onActiveChange={changeIntro} onReveal={beginReveal} />
          </div>
        </div>
        <AvatarScene
          enabled={!intro}
          showMethod={showMethod}
          instant={methodInstant}
          onOpenMethod={() => {
            setMethodInstant(false);
            setShowMethod(true);
          }}
        />
        <div className="signal-identity">
          <h1 id="home-name" tabIndex={-1} style={{ outline: "none" }}>
            <HeroNameAnimated active={!intro || opening} />
          </h1>
          <div className="signal-actions">
            <IgnitionLink href="/#projects" paused={paused || (intro && !opening)}>
              EXPLORE MY PROJECTS
            </IgnitionLink>
          </div>
        </div>
        <button
          type="button"
          className="avatar-method-toggle"
          onClick={(e) => toggleMethod(e.detail)}
          disabled={intro}
          aria-expanded={showMethod}
          aria-controls="avatar-method"
        >
          {showMethod ? "Show portrait" : "How I build"} <ArrowUpRight size={15} />
        </button>
      </div>
    </section>
  );
}
