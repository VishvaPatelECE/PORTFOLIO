"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { systems } from "@/lib/content/site";
export default function SystemIndex() {
  const [selected, setSelected] = useState(0);
  const system = systems[selected];
  return (
    <div className="system-index">
      <div className="index-top">
        <span className="mono muted">SYSTEM INDEX</span>
        <div className="index-tabs" aria-label="Select a system">
          {systems.map((s, i) => (
            <button
              key={s.id}
              aria-pressed={i === selected}
              onClick={() => setSelected(i)}
            >
              {s.name}
            </button>
          ))}
        </div>
        <span className="index-count mono">0{selected + 1} / 03</span>
      </div>
      <div
        className="topology"
        aria-label={`${system.name} overview: ${system.stages.join(" to ")}`}
      >
        <svg
          viewBox="0 0 1040 154"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            className="topology-ghost"
            d="M20 76H1020M130 30v94M330 30v94M520 10v134M710 30v94M910 30v94"
          />
          <path
            className="topology-route"
            key={system.id}
            d="M20 76H160L205 36H400L445 76H585L630 112H825L870 76H1020"
          />
          <circle cx="520" cy="76" r="32" className="topology-core" />
          <circle cx="520" cy="76" r="6" fill="var(--signal)" />
        </svg>
        <div className="topology-labels">
          {system.stages.map((stage, i) => (
            <span key={stage} className={i === 2 ? "signal" : ""}>
              <i />
              {stage}
            </span>
          ))}
        </div>
      </div>
      <div className="index-bottom">
        <motion.p
          key={system.id}
          initial={{ opacity: 0.5, y: 3 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18 }}
        >
          {system.description}
        </motion.p>
        <Link href={system.href}>
          EXPLORE {system.name.toUpperCase()} <ArrowUpRight size={16} />
        </Link>
      </div>
    </div>
  );
}
