'use client';

import React from 'react';
import Link from 'next/link';

const AdditionalImplementedCard: React.FC<{
  title: string;
  typeLabel: string;
  summary: string;
  tags: string[];
}> = ({ title, typeLabel, summary, tags }) => {
  return (
    <article className="group rounded-xl border border-white/10 bg-[#1b263b]/90 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#ffc300]/40 hover:shadow-[0_10px_30px_rgba(0,0,0,0.32),0_0_16px_rgba(255,195,0,0.09)]">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h4 className="font-display text-lg font-semibold text-[#e0e1dd]">{title}</h4>
        <span className="shrink-0 text-xs font-mono uppercase tracking-[0.12em] text-[#ffc300]">{typeLabel}</span>
      </div>
      <p className="mb-4 text-sm leading-relaxed text-[#778da9]">{summary}</p>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-[#c6d4e7] transition-colors duration-300 group-hover:border-[#4cc9f0]/35"
          >
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
};

export const Projects: React.FC = () => {
  return (
    <section id="projects" className="min-h-[60vh] w-full px-6 py-24 sm:px-8 md:min-h-0 lg:px-12">
      <div className="mx-auto w-full max-w-370 space-y-14 px-2 sm:px-4">
        <header className="space-y-3 border-b border-white/10 pb-6">
          <p className="text-xs font-mono uppercase tracking-[0.14em] text-[#778da9]">Engineering Work</p>
          <h2 className="text-3xl font-semibold text-[#e0e1dd] sm:text-4xl">Selected Systems &amp; Architectures</h2>
          <p className="max-w-4xl whitespace-nowrap text-base leading-relaxed text-[#ffc300]">
            Engineered systems emphasizing layered security, real-time decision pipelines, and hardware-aware intelligent processing.
          </p>
        </header>

        <article className="panel-card space-y-6! px-6! py-5! sm:py-6!">
          <div className="space-y-2 border-b border-white/10 pb-4">
            <h3 className="text-2xl font-semibold text-[#e0e1dd]">
              DARVS (Deepfake Authentication &amp; Reality Verification System)
            </h3>
            <p className="max-w-3xl text-sm leading-relaxed text-[#778da9]">
              Multi-layer biometric authentication pipeline verifying <span className="text-[#ffc300]">identity</span>{' '}
              and <span className="text-[#4cc9f0]">real-world presence</span> under adversarial conditions.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-7 lg:grid-cols-2 lg:items-start">
            <div className="space-y-5">
              <div className="w-full rounded-lg border border-white/10 bg-[#415a77]/25 p-3">
                <div className="flex items-center gap-1 text-[13px] font-semibold whitespace-nowrap">
                  <span className="rounded-md border border-[#ffc300]/40 bg-[#ffc300]/12 px-2.5 py-1 text-[#ffd60a]">Camera</span>
                  <span className="text-[#778da9]">→</span>
                  <span className="rounded-md border border-[#4cc9f0]/40 bg-[#4cc9f0]/12 px-2.5 py-1 text-[#4cc9f0]">MTCNN</span>
                  <span className="text-[#778da9]">→</span>
                  <span className="rounded-md border border-[#ff6b35]/40 bg-[#ff6b35]/12 px-2.5 py-1 text-[#ff6b35]">Anti-Spoof</span>
                  <span className="text-[#778da9]">→</span>
                  <span className="rounded-md border border-green-500/40 bg-green-500/12 px-2.5 py-1 text-green-400">Liveness</span>
                  <span className="text-[#778da9]">→</span>
                  <span className="rounded-md border border-[#4cc9f0]/40 bg-[#4cc9f0]/12 px-2.5 py-1 text-[#4cc9f0]">FaceNet</span>
                  <span className="text-[#778da9]">→</span>
                  <span className="rounded-md border border-[#ffc300]/40 bg-[#ffc300]/12 px-2.5 py-1 text-[#ffd60a]">Decision</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
                <div className="rounded-lg border border-white/10 bg-[#1b263b]/50 px-3 py-2">
                  <p className="text-xs font-semibold text-[#e0e1dd]">~3-4 FPS</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-[#1b263b]/50 px-3 py-2">
                  <p className="text-xs font-semibold text-[#e0e1dd]">FaceNet</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-[#1b263b]/50 px-3 py-2">
                  <p className="text-xs font-semibold text-[#e0e1dd]">MTCNN</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-[#1b263b]/50 px-3 py-2">
                  <p className="text-xs font-semibold text-[#e0e1dd]">Movement + Blink</p>
                </div>
              </div>

              <div className="flex justify-center">
                <Link href="/darvs" className="inline-flex">
                  <button
                    type="button"
                    className="btn-spectrum group text-sm font-semibold"
                  >
                    <span className="btn-spectrum-layer" />
                    <span className="btn-spectrum-text">View Full System</span>
                  </button>
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 content-start gap-3">
              <article className="panel-card h-fit p-4!">
                <h4 className="text-sm font-semibold text-[#e0e1dd]">Liveness Verification</h4>
                <p className="mt-2 text-xs leading-relaxed text-[#778da9]">
                  Movement + blink based real-world presence validation.
                </p>
              </article>
              <article className="panel-card h-fit p-4!">
                <h4 className="text-sm font-semibold text-[#e0e1dd]">Anti-Spoof Detection</h4>
                <p className="mt-2 text-xs leading-relaxed text-[#778da9]">
                  Prevents replay, screen, and deepfake-based attacks.
                </p>
              </article>
            </div>
          </div>
        </article>

        <article className="panel-card space-y-8 p-6 sm:p-8">
          <div className="space-y-2 border-b border-white/10 pb-5">
            <h3 className="text-2xl font-semibold text-[#e0e1dd]">USMHACS (Ultra Secure Multi-layer Hardware Access Control System)</h3>
            <p className="text-sm font-medium text-[#ffd60a]">Hardware-Level Secure Access Control System</p>
          </div>

          <div className="grid gap-10 lg:grid-cols-2">
            <div className="max-w-3xl space-y-6 text-left">
              <ul className="space-y-4 text-sm leading-relaxed text-[#778da9] sm:text-[15px]">
                <li className="flex items-start gap-3">
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#ffc300]" />
                  <span className="text-[#778da9]">Multi-layer verification using sensors, key, code, delay, and tamper detection.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#ffc300]" />
                  <span className="text-[#778da9]">Deterministic hardware logic with zero software dependency.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#ffc300]" />
                  <span className="text-[#778da9]">Fail-safe lockout system with real-time signal simulation.</span>
                </li>
              </ul>
            </div>

            <div className="space-y-6 lg:pt-1">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-md border border-[#ff6b35]/40 bg-[#ff6b35]/12 px-2.5 py-1 text-xs font-semibold text-[#ff6b35]">Hardware Only</span>
                <span className="rounded-md border border-[#4cc9f0]/40 bg-[#4cc9f0]/12 px-2.5 py-1 text-xs font-semibold text-[#4cc9f0]">NO Microcontroller/Processor</span>
                <span className="rounded-md border border-[#7ae582]/40 bg-[#7ae582]/12 px-2.5 py-1 text-xs font-semibold text-[#7ae582]">Real-Time Simulation</span>
              </div>

              <div className="rounded-xl border border-white/10 bg-[#415a77]/24 p-5 sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-[#e0e1dd]">USMHACS Full Simulator</p>
                    <p className="text-xs text-[#778da9]">Best viewed as a full-page engineering tool environment.</p>
                  </div>
                  <Link
                    href="/usmhacs"
                    className="btn-spectrum group inline-flex w-fit items-center text-sm font-semibold"
                  >
                    <span className="btn-spectrum-layer" />
                    <span className="btn-spectrum-text">Launch Simulator</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </article>

        <section className="space-y-4">
          <div className="space-y-1">
            <h3 className="font-display text-3xl font-semibold text-[#e0e1dd]">Additional Implemented Systems</h3>
            <p className="text-sm text-[#778da9]">Compact implementations demonstrating embedded architecture and digital logic depth.</p>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <AdditionalImplementedCard
              title="Autonomous Robo Car"
              typeLabel="Embedded System"
              summary="Multi-modal robotic platform integrating real-time control switching across assisted and autonomous modes."
              tags={['ESP32', 'Voice Control', 'Bluetooth', 'Gesture', 'Line Follow', 'Obstacle Avoidance', 'Human Follow']}
            />
            <AdditionalImplementedCard
              title="Hardware Stopwatch (IC-Based)"
              typeLabel="Digital Logic"
              summary="Hardware-only stopwatch architecture using discrete timing and counting ICs for deterministic mm:ss progression."
              tags={['Timer IC', '74LS90', '4511 Decoder', '7-Segment', '00:00-59:59', 'No Microcontroller']}
            />
          </div>
        </section>
      </div>
    </section>
  );
};
