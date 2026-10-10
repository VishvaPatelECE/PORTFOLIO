"use client";
import { useCallback, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Pause, Play } from "lucide-react";
import Entry from "@/components/entry/Entry";
import ReferenceField from "./ReferenceField";
import IgnitionLink from "./IgnitionLink";
import { useHomeMotion } from "./HomeMotion";
import AvatarScene from "./AvatarScene";

export default function LaboratoryHero() {
  const [intro, setIntro] = useState(true);
  const [opening, setOpening] = useState(false);
  const { paused, setPaused } = useHomeMotion();
  const reduced = useReducedMotion();
  const changeIntro = useCallback((active: boolean) => {
    setIntro(active);
    if (active) setOpening(false);
  }, []);
  const beginReveal = useCallback(() => setOpening(true), []);

  return (
    <section
      className={`signal-hero ${intro ? "intro-running" : ""}`}
      aria-label="Interactive engineering portfolio"
    >
      <ReferenceField kind="flow-field" paused={paused || (intro && !opening)} />
      <div className="signal-shade" aria-hidden="true" />
      <div className="signal-composition wrap">
        <div className="signal-identity">
          <h1 id="home-name" tabIndex={-1}>
            <span>VISHVA</span>
            <span>PATEL<span className="signal-dot">.</span></span>
          </h1>
          <p className="signal-role">Embedded &amp; Intelligent Systems Engineer</p>
          <p className="signal-statement">
            Engineering secure systems at the intersection of hardware and intelligence.
          </p>
          <div className="signal-actions">
            <IgnitionLink href="/#systems" paused={paused || (intro && !opening)}>
              Explore the work
            </IgnitionLink>
          </div>
        </div>
        <AvatarScene enabled={!intro} />
        <div className="signal-tools">
          <button
            className="signal-motion-toggle"
            aria-label={paused ? "Resume visual motion" : "Pause visual motion"}
            aria-pressed={paused}
            disabled={!!reduced}
            onClick={() => setPaused(!paused)}
          >
            {paused ? <Play size={16} /> : <Pause size={16} />}
          </button>
          <div className="signal-replay">
            <Entry onActiveChange={changeIntro} onReveal={beginReveal} />
          </div>
        </div>
      </div>
    </section>
  );
}
