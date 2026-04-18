'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

const DOSSIER_BOOT = 'ACCESSING ENGINEERING DOSSIER...';

const panelClass =
  'panel-card rounded-xl border border-[#1f3954] bg-[#10243a] p-5 shadow-[0_12px_30px_rgba(0,0,0,0.34),inset_0_1px_0_rgba(255,255,255,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#00d4ff]/40 hover:shadow-[0_16px_34px_rgba(0,0,0,0.38),0_0_18px_rgba(0,212,255,0.1),inset_0_1px_0_rgba(255,255,255,0.06)]';

const enterMotion = {
  initial: { opacity: 0, y: 10 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.32, ease: 'easeOut' as const },
};

const systemArchitectureThinking = [
  'Decompose each problem into independently verifiable execution stages',
  'Separate control path, data path, and failure path to preserve determinism',
  'Instrument each stage with measurable signals for debug and validation',
  'Integrate security gating into the primary execution path, not as an afterthought',
];

const researchInterests = [
  {
    title: 'Secure Intelligent Systems',
    points: [
      'Liveness-aware authentication pipelines',
      'Adversarial robustness in perception systems',
    ],
  },
  {
    title: 'Hardware-Software Co-Design',
    points: [
      'Deterministic control + intelligent adaptation layers',
      'Embedded + AI hybrid system architecture',
    ],
  },
  {
    title: 'Signal Processing & Communication',
    points: [
      'Channel behavior modeling and response analysis',
      'OFDM / 5G / 6G intelligent communication direction',
    ],
  },
  {
    title: 'Machine Learning Systems',
    points: [
      'Computer vision pipelines for constrained environments',
      'Learning-based decision and verification systems',
      'Theory-to-deployment translation',
    ],
  },
];

const stackGroups = [
  {
    title: 'HARDWARE & EMBEDDED',
    items: [
      'Digital logic design using IC-level architectures (74xx series, counters, decoders)',
      'Embedded system development with ESP32 and microcontroller toolchains (Keil uVision)',
      'Sensor integration, real-time control, and hardware debugging',
    ],
    color: 'text-[#ffd60a]',
  },
  {
    title: 'SYSTEM DESIGN & VERIFICATION',
    items: [
      'Circuit simulation and validation using Proteus (8/9 Professional)',
      'Exposure to VLSI workflows using Cadence Virtuoso',
      'FPGA design and synthesis using Quartus II',
    ],
    color: 'text-[#00d4ff]',
  },
  {
    title: 'SOFTWARE & INTELLIGENCE',
    items: [
      'Python and C/C++ for system-level integration',
      'Computer vision pipelines for identity and liveness verification (DARVS)',
      'Signal processing and system modeling using Scilab',
    ],
    color: 'text-[#22c55e]',
  },
];

export default function AboutDossier() {
  const router = useRouter();
  const { isVerified } = useAuth();
  const [typedBoot, setTypedBoot] = useState('');

  useEffect(() => {
    if (!isVerified) {
      return;
    }

    let index = 0;
    const interval = window.setInterval(() => {
      index += 1;
      setTypedBoot(DOSSIER_BOOT.slice(0, index));
      if (index >= DOSSIER_BOOT.length) {
        window.clearInterval(interval);
      }
    }, 24);

    return () => window.clearInterval(interval);
  }, [isVerified]);

  if (!isVerified) {
    return (
      <main className="min-h-screen w-full bg-[#0d1b2a] px-6 py-10 text-[#e0e1dd] sm:px-8 lg:px-12">
        <div className="mx-auto flex min-h-[75vh] w-full max-w-7xl items-center justify-center">
          <section className={`${panelClass} w-full max-w-2xl text-center`}>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#b8c5d6]">Dossier Control</p>
            <h1 className="mt-3 text-2xl font-semibold text-[#e0e1dd] sm:text-3xl">ACCESS RESTRICTED</h1>
            <p className="mt-4 font-mono text-sm text-[#b8c5d6]">{'>'} Verification required to access engineering dossier</p>
            <button
              type="button"
              onClick={() => router.push('/')}
              className="btn-spectrum group mt-6 text-sm font-semibold"
            >
              <span className="btn-spectrum-layer" />
              <span className="btn-spectrum-text">Initiate Verification</span>
            </button>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full bg-[#0d1b2a] px-6 py-7 text-[#e0e1dd] sm:px-8 lg:px-12">
      <div className="mx-auto w-full max-w-7xl space-y-4">
        <motion.section className={panelClass} {...enterMotion}>
          <div className="flex items-center justify-between gap-3">
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#00d4ff]">{typedBoot || DOSSIER_BOOT}</p>
            <Link href="/" className="btn-spectrum group text-xs font-semibold">
              <span className="btn-spectrum-layer" />
              <span className="btn-spectrum-text">Back to Portfolio</span>
            </Link>
          </div>

          <h1 className="mt-5 text-center text-3xl font-bold uppercase leading-tight tracking-[0.02em] text-[#e0e1dd] sm:text-4xl md:text-5xl">VISHVA NIRAL PATEL</h1>
          <p className="mt-2 text-center text-base font-mono uppercase tracking-[0.12em] text-[#778da9] sm:text-lg">Electronics &amp; Communication Engineer</p>
          <p className="mt-3 text-center text-base font-medium leading-relaxed text-[#ffd60a] sm:text-lg">System-first engineer for secure and intelligent architectures</p>
          <p className="mt-2 text-center text-sm leading-relaxed text-[#b8c5d6] sm:text-base">
            Working at the intersection of embedded execution, verification logic, and AI-driven perception pipelines
          </p>
          <p className="mt-1 text-center text-sm leading-relaxed text-[#b8c5d6] sm:text-base">
            Building systems that remain correct under adversarial and real-world constraints
          </p>

          <div className="mt-5 space-y-1.5 text-center text-sm leading-relaxed text-[#b8c5d6] sm:text-base">
            <p className="text-[#f59e0b]">Strong interest in mathematics-driven engineering domains</p>
            <p className="text-[#00d4ff]">Fascinated by the theoretical foundations of ML and its application in real-world systems</p>
          </div>
        </motion.section>

        <motion.section className={panelClass} {...enterMotion}>
          <p className="font-mono text-[14px] font-semibold uppercase tracking-[0.16em] text-[#00d4ff]">RESEARCH DIRECTIVES</p>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            {researchInterests.map((item) => (
              <article
                key={item.title}
                className="rounded-lg border border-[#284563] bg-[#0b1d31] p-4 shadow-[0_8px_22px_rgba(0,0,0,0.26),inset_0_1px_0_rgba(255,255,255,0.03)]"
              >
                <p className="font-mono text-[13px] font-semibold uppercase tracking-[0.14em] text-[#ffd60a]">{item.title}</p>
                <div className="mt-3 space-y-1.5 text-[15px] leading-relaxed text-[#b8c5d6]">
                  {item.points.map((point) => (
                    <p key={point}>• {point}</p>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </motion.section>

        <motion.section className={panelClass} {...enterMotion}>
          <p className="font-mono text-[13px] uppercase tracking-[0.16em] text-[#778da9]">ACADEMIC TELEMETRY</p>
          <div className="mt-3 space-y-1.5 text-sm leading-relaxed text-[#b8c5d6] sm:text-base">
            <p>B.Tech - Electronics &amp; Communication Engineering</p>
            <p className="text-[#ffd60a]">Dharmsinh Desai University</p>
            <p className="pt-1">CGPA: <span className="font-semibold text-[#22c55e]">9.13 / 10</span></p>
            <p className="text-[#f59e0b]">GATE EC 2026 AIR 6931</p>
            <p>Expected Graduation: May 2027</p>
            <p className="text-[#00d4ff]">Status: Research-Focused</p>
          </div>
        </motion.section>

        <motion.section className={panelClass} {...enterMotion}>
          <p className="font-mono text-[14px] font-semibold uppercase tracking-[0.16em] text-[#00d4ff]">SYSTEM ARCHITECTURE THINKING</p>
          <div className="mt-4 space-y-2 text-[15px] leading-relaxed text-[#b8c5d6]">
            {systemArchitectureThinking.map((point) => (
              <p key={point}>• {point}</p>
            ))}
          </div>
        </motion.section>

        <motion.section className={panelClass} {...enterMotion}>
          <p className="font-mono text-[14px] font-semibold uppercase tracking-[0.16em] text-[#22c55e]">ENGINEERING CAPABILITIES</p>
          <p className="mt-2 text-sm font-medium text-[#ffd60a]">
            Applied across simulation, verification, and real-time system implementation
          </p>
          <p className="mt-2 font-mono text-[13px] uppercase tracking-[0.12em] text-[#9db2c8]">
            Tools and frameworks applied in system design, verification, and intelligent processing
          </p>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
            {stackGroups.map((group) => (
              <article
                key={group.title}
                className="rounded-lg border border-[#284563] bg-[#0b1d31] p-4 shadow-[0_8px_22px_rgba(0,0,0,0.26),inset_0_1px_0_rgba(255,255,255,0.03)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#00d4ff]/40 hover:shadow-[0_10px_24px_rgba(0,0,0,0.3),0_0_14px_rgba(0,212,255,0.1)]"
              >
                <p className={`font-mono text-[14px] uppercase tracking-[0.13em] ${group.color}`}>{group.title}</p>
                <ul className="mt-3 space-y-2 text-sm leading-relaxed text-[#b8c5d6]">
                  {group.items.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </motion.section>

        <motion.section className={`${panelClass} flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between`} {...enterMotion}>
          <div>
            <p className="font-mono text-[13px] uppercase tracking-[0.16em] text-[#ffd60a]">DOSSIER EXPORT</p>
            <p className="mt-2 text-base font-semibold text-[#e0e1dd]">Curriculum Vitae - verified academic and project record</p>
          </div>
          <Link href="/Vishva_Patel_CV.pdf" target="_blank" download className="btn-spectrum group text-sm font-semibold">
            <span className="btn-spectrum-layer" />
            <span className="btn-spectrum-text">View Research CV</span>
          </Link>
        </motion.section>
      </div>
    </main>
  );
}
