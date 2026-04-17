'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';

type PipelineNode = {
  id: string;
  label: string;
  purpose: string;
  whyChosen: string;
  prevents: string;
};

type LogRow = {
  id: string;
  time: string;
  identity: string;
  result: 'SUCCESS' | 'REJECTED';
  contextTag: 'VERIFIED' | 'BLOCKED';
  confidence: string;
  device: string;
};

const LOG_INTERVAL_MS = 1500;
const TARGET_SUCCESS_RATIO = 0.66;

function formatLogTime(date: Date) {
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
}

function generateLogEntry({
  timestamp,
  result,
  baseConfidence,
}: {
  timestamp: Date;
  result?: 'SUCCESS' | 'REJECTED';
  baseConfidence: number;
}): LogRow {
  const resolvedResult = result ?? (Math.random() < TARGET_SUCCESS_RATIO ? 'SUCCESS' : 'REJECTED');
  const successConfidence = Math.max(90.1, Math.min(95, baseConfidence + (Math.random() * 1.4 - 0.3)));
  const id = `${timestamp.getTime()}-${Math.random().toString(16).slice(2, 7)}`;

  return {
    id,
    time: formatLogTime(timestamp),
    identity: resolvedResult === 'SUCCESS' ? 'VISHVA' : 'UNKNOWN',
    result: resolvedResult,
    contextTag: resolvedResult === 'SUCCESS' ? 'VERIFIED' : 'BLOCKED',
    confidence: resolvedResult === 'SUCCESS' ? `${successConfidence.toFixed(1)}%` : '0%',
    device: resolvedResult === 'SUCCESS' ? 'LAPTOP' : 'HP-OMEN',
  };
}

const NODES: PipelineNode[] = [
  {
    id: 'camera',
    label: 'Camera',
    purpose: 'Acquire live frame sequence',
    whyChosen: 'Enables temporal verification',
    prevents: 'Static image bypass',
  },
  {
    id: 'mtcnn',
    label: 'MTCNN',
    purpose: 'Detect face and landmarks',
    whyChosen: 'Stable under pose/lighting',
    prevents: 'Missed or false detection',
  },
  {
    id: 'antispoof',
    label: 'Anti-Spoof',
    purpose: 'Detect fake inputs',
    whyChosen: 'Filters non-live sources',
    prevents: 'Photo and screen attacks',
  },
  {
    id: 'liveness',
    label: 'Liveness',
    purpose: 'Verify real user presence',
    whyChosen: 'Movement + blink validation',
    prevents: 'Passive spoofing',
  },
  {
    id: 'facenet',
    label: 'FaceNet',
    purpose: 'Generate embeddings',
    whyChosen: 'Deterministic similarity match',
    prevents: 'Identity ambiguity',
  },
  {
    id: 'decision',
    label: 'Decision',
    purpose: 'Final authentication',
    whyChosen: 'Multi-stage gating logic',
    prevents: 'Partial-pass acceptance',
  },
];

const STATES = ['SCANNING', 'VERIFYING', 'AUTHENTICATED'] as const;

const VALIDATION_ROWS = [
  { ok: true, left: '[✓] Real User', right: 'AUTHORIZED' },
  { ok: false, left: '[✗] Photo Spoof', right: 'BLOCKED' },
  { ok: false, left: '[✗] Screen Replay', right: 'BLOCKED' },
  { ok: false, left: '[✗] No Liveness', right: 'REJECTED' },
] as const;

const sectionMotion = {
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.32, ease: 'easeOut' as const },
  viewport: { once: true, amount: 0.16 },
};

function LivePipeline({ nodes, systemState }: { nodes: PipelineNode[]; systemState: number }) {
  return (
    <div className="rounded-xl border border-[#ffc300]/20 bg-[#0d1b2a]/72 p-3">
      <p className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.12em] text-[#ffd60a]/90">
        <span>System Execution</span>
        <span className="ml-auto text-[12px] text-right text-[#4cc9f0] normal-case tracking-[0.02em]">
          Animation is matched with System's live Status
        </span>
      </p>
      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs sm:text-sm">
        {nodes.map((node, index) => {
          const isActive = systemState === index;
          return (
            <div key={node.id} className="flex items-center gap-2">
              <motion.div
                className={`rounded-md border px-2.5 py-1.5 font-semibold ${
                  isActive
                    ? 'border-[#ffc300] bg-[#ffc300]/14 text-[#ffd60a]'
                    : 'border-white/10 bg-[#001d3d]/45 text-[#9fb4ca]'
                }`}
                animate={
                  isActive
                    ? { boxShadow: ['0 0 0 rgba(255,195,0,0)', '0 0 16px rgba(255,195,0,0.25)', '0 0 0 rgba(255,195,0,0)'] }
                    : { boxShadow: '0 0 0 rgba(0,0,0,0)' }
                }
                transition={{ duration: 1.2, repeat: isActive ? Infinity : 0, ease: 'easeInOut' }}
              >
                {node.label}
              </motion.div>
              {index < nodes.length - 1 ? (
                <div className="relative h-0.5 w-7 overflow-hidden rounded bg-white/12">
                  <motion.div
                    className={`absolute inset-y-0 w-1/2 ${index < systemState ? 'bg-[#ffc300]/60' : 'bg-[#4cc9f0]/35'}`}
                    animate={{ x: ['-120%', '240%'] }}
                    transition={{ duration: 1.15, repeat: Infinity, ease: 'easeInOut', delay: index * 0.05 }}
                  />
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function InteractivePipeline({
  nodes,
  activeStep,
  onStepClick,
}: {
  nodes: PipelineNode[];
  activeStep: string | null;
  onStepClick: (id: string) => void;
}) {
  const selectedNode = nodes.find((node) => node.id === activeStep) ?? null;

  return (
    <div className="rounded-xl border border-[#4cc9f0]/28 bg-[#0d1b2a]/78 p-3">
      <p className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.12em] text-[#4cc9f0]">
        Interactive Breakdown <span className="ml-auto text-[12px] text-right text-[#ffd60a]">(Click on a step to understand it better.)</span>
      </p>
      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs sm:text-sm">
        {nodes.map((node) => {
          const isActive = activeStep === node.id;
          return (
            <motion.button
              key={node.id}
              type="button"
              onClick={() => onStepClick(node.id)}
              whileHover={{ scale: 1.03, y: -1 }}
              className={`rounded-md border px-2.5 py-1.5 font-semibold transition-all duration-200 ${
                isActive
                  ? 'border-[#4cc9f0] bg-[#4cc9f0]/18 text-[#d8f4ff]'
                  : 'border-white/10 bg-[#001d3d]/48 text-[#bad0e7] hover:border-[#4cc9f0]/60 hover:text-[#e5e5e5]'
              }`}
            >
              {node.label}
            </motion.button>
          );
        })}
      </div>

      <div className="mt-3 h-32 overflow-hidden rounded-xl border border-white/10 bg-[#0b1828]/88 p-2.5">
        <div className="h-full w-full flex items-center">
          <AnimatePresence mode="wait" initial={false}>
            {selectedNode ? (
              <motion.div
                key={selectedNode.id}
                className="w-full grid gap-2 md:grid-cols-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
              >
                <div className="rounded-lg border border-white/10 bg-[#1b263b]/45 p-3">
                  <p className="text-xs font-mono uppercase tracking-[0.12em] text-[#4cc9f0]">Purpose</p>
                  <p className="mt-1 text-sm text-[#c6d4e7]">{selectedNode.purpose}</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-[#1b263b]/45 p-3">
                  <p className="text-xs font-mono uppercase tracking-[0.12em] text-[#ffd60a]">Why Chosen</p>
                  <p className="mt-1 text-sm text-[#c6d4e7]">{selectedNode.whyChosen}</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-[#1b263b]/45 p-3">
                  <p className="text-xs font-mono uppercase tracking-[0.12em] text-[#ff6b35]">Prevents</p>
                  <p className="mt-1 text-sm text-[#c6d4e7]">{selectedNode.prevents}</p>
                </div>
              </motion.div>
            ) : (
              <motion.p
                key="pipeline-placeholder"
                className="w-full text-center text-sm text-[#93a8bf]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
              >
                Select a stage to inspect details.
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default function DARVSPage() {
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [systemState, setSystemState] = useState(0);
  const [activeStep, setActiveStep] = useState<string | null>(NODES[0].id);

  const [targetConfidence, setTargetConfidence] = useState(90);
  const [confidenceFluctuation, setConfidenceFluctuation] = useState(0);
  const [displayConfidence, setDisplayConfidence] = useState(90);
  const [targetTime, setTargetTime] = useState(246);
  const [displayTime, setDisplayTime] = useState(246);
  const [validationFlash, setValidationFlash] = useState<'PASS' | 'FAIL' | null>(null);
  const [newestLogId, setNewestLogId] = useState<string | null>(null);
  const [securityMetrics, setSecurityMetrics] = useState({
    totalAttempts: 42,
    successfulAuth: 28,
    rejectedAttacks: 14,
  });

  const [logs, setLogs] = useState<LogRow[]>([]);

  const logViewportRef = useRef<HTMLDivElement | null>(null);
  const systemStateRef = useRef(systemState);
  const displayConfidenceRef = useRef(displayConfidence);

  const statusLabel = systemState < 2 ? STATES[0] : systemState < 5 ? STATES[1] : STATES[2];
  const threatRejectionRate =
    securityMetrics.totalAttempts > 0
      ? Math.round((securityMetrics.rejectedAttacks / securityMetrics.totalAttempts) * 100)
      : 0;

  useEffect(() => {
    systemStateRef.current = systemState;
  }, [systemState]);

  useEffect(() => {
    displayConfidenceRef.current = displayConfidence;
  }, [displayConfidence]);

  useEffect(() => {
    let disposed = false;
    let timeoutId = 0;

    const nextNode = () => {
      if (disposed) {
        return;
      }

      setSystemState((prev) => (prev + 1) % NODES.length);

      timeoutId = window.setTimeout(nextNode, Math.floor(Math.random() * 201) + 300);
    };

    timeoutId = window.setTimeout(nextNode, 420);

    return () => {
      disposed = true;
      window.clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    let disposed = false;
    let timeoutId = 0;

    const updateConfidenceTarget = () => {
      if (disposed) {
        return;
      }
      setTargetConfidence(Number((Math.random() * 5 + 90).toFixed(1)));
      timeoutId = window.setTimeout(updateConfidenceTarget, Math.floor(Math.random() * 1001) + 1000);
    };

    timeoutId = window.setTimeout(updateConfidenceTarget, 1000);

    return () => {
      disposed = true;
      window.clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    const fluctuationInterval = window.setInterval(() => {
      setConfidenceFluctuation(Number(((Math.random() - 0.5) * 2).toFixed(2)));
    }, 700);

    return () => window.clearInterval(fluctuationInterval);
  }, []);

  useEffect(() => {
    let disposed = false;
    let timeoutId = 0;

    const updateProcessingTarget = () => {
      if (disposed) {
        return;
      }
      setTargetTime(Math.floor(Math.random() * 11) + 240);
      timeoutId = window.setTimeout(updateProcessingTarget, Math.floor(Math.random() * 1001) + 1000);
    };

    timeoutId = window.setTimeout(updateProcessingTarget, 1300);

    return () => {
      disposed = true;
      window.clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    const generateInitialLogs = () => {
      return Array.from({ length: 6 }).map(() =>
        generateLogEntry({
          timestamp: new Date(),
          result: Math.random() > 0.4 ? 'SUCCESS' : 'REJECTED',
          baseConfidence: 92,
        }),
      );
    };

    setLogs(generateInitialLogs());

    const stream = window.setInterval(() => {
      const now = new Date();
      const systemStatus = systemStateRef.current < 2 ? STATES[0] : systemStateRef.current < 5 ? STATES[1] : STATES[2];
      const isSystemPositive = systemStatus === 'AUTHENTICATED' && displayConfidenceRef.current > 90.7;
      const biasBoost = isSystemPositive ? 0.08 : -0.04;
      const nextResult: 'SUCCESS' | 'REJECTED' =
        Math.random() < Math.max(0.6, Math.min(0.72, TARGET_SUCCESS_RATIO + biasBoost)) ? 'SUCCESS' : 'REJECTED';

      const row = generateLogEntry({
        timestamp: now,
        result: nextResult,
        baseConfidence: displayConfidenceRef.current,
      });

      setValidationFlash(row.result === 'SUCCESS' ? 'PASS' : 'FAIL');
      setNewestLogId(row.id);
      setLogs((prev) => [...prev, row].slice(-12));
      setSecurityMetrics((prev) => ({
        totalAttempts: prev.totalAttempts + 1,
        successfulAuth: prev.successfulAuth + (row.result === 'SUCCESS' ? 1 : 0),
        rejectedAttacks: prev.rejectedAttacks + (row.result === 'REJECTED' ? 1 : 0),
      }));
    }, LOG_INTERVAL_MS);

    return () => window.clearInterval(stream);
  }, []);

  useEffect(() => {
    let frame = 0;
    const tick = () => {
      setDisplayConfidence((prev) => {
        const nextTarget = Math.max(90, Math.min(95, targetConfidence + confidenceFluctuation));
        return prev + (nextTarget - prev) * 0.1;
      });
      setDisplayTime((prev) => prev + (targetTime - prev) * 0.15);
      frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);

    return () => window.cancelAnimationFrame(frame);
  }, [targetConfidence, confidenceFluctuation, targetTime]);

  useEffect(() => {
    if (!validationFlash) {
      return;
    }

    const clearFlash = window.setTimeout(() => {
      setValidationFlash(null);
    }, 260);

    return () => window.clearTimeout(clearFlash);
  }, [validationFlash]);

  useEffect(() => {
    if (!logViewportRef.current) {
      return;
    }
    logViewportRef.current.scrollTo({ top: logViewportRef.current.scrollHeight, behavior: 'smooth' });
  }, [logs]);

  return (
    <main
      className="relative min-h-screen overflow-hidden bg-transparent px-6 py-8 text-[#e5e5e5] sm:px-8 lg:px-12"
      onMouseMove={(event) => setCursor({ x: event.clientX, y: event.clientY })}
    >
      <motion.div
        className="pointer-events-none fixed z-0 h-88 w-88 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255,195,0,0.09) 0%, rgba(255,107,53,0.06) 45%, rgba(8,20,36,0) 75%)',
        }}
        animate={{
          x: cursor.x - 176,
          y: cursor.y - 176,
          opacity: [0.05, 0.09, 0.06],
          filter: ['hue-rotate(0deg)', 'hue-rotate(8deg)', 'hue-rotate(-6deg)', 'hue-rotate(0deg)'],
        }}
        transition={{
          x: { type: 'spring', stiffness: 85, damping: 20, mass: 0.6 },
          y: { type: 'spring', stiffness: 85, damping: 20, mass: 0.6 },
          opacity: { duration: 2.8, repeat: Infinity, ease: 'easeInOut' },
          filter: { duration: 7.5, repeat: Infinity, ease: 'easeInOut' },
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-350 space-y-5">
        <motion.section className="panel-card p-5" {...sectionMotion}>
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h1 className="font-display text-3xl font-semibold leading-tight text-[#e5e5e5] sm:text-4xl">
                  DARVS - Deepfake Authentication &amp; Reality Verification System
                </h1>
                <Link
                  href="/#projects"
                  className="btn-spectrum inline-flex items-center px-3 py-1.5 text-xs font-medium"
                >
                  <span className="btn-spectrum-layer" />
                  <span className="btn-spectrum-text">Back to Portfolio</span>
                </Link>
              </div>

              <p className="text-sm text-[#778da9] sm:text-base">Verifies identity under physical presence constraints.</p>
              <p className="text-sm font-semibold text-[#ffd60a] sm:text-base">
                Authentication requires ALL conditions to pass. No partial success.
              </p>

            </div>

            <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[#0d1b2a]/78 p-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)]">
              <motion.div
                className="pointer-events-none absolute inset-0"
                style={{
                  backgroundImage:
                    'linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)',
                  backgroundSize: '18px 18px',
                }}
                animate={{ opacity: [0.02, 0.05, 0.03] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.div
                className="pointer-events-none absolute inset-0"
                animate={{ opacity: [0, 0.06, 0] }}
                transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}
                style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0))' }}
              />
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-mono uppercase tracking-[0.14em] text-[#778da9]">Live System Panel</p>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[11px] font-mono">
                  <motion.span
                    className={`h-2 w-2 rounded-full ${statusLabel === 'AUTHENTICATED' ? 'bg-green-400' : 'bg-[#4cc9f0]'}`}
                    animate={{ opacity: [0.45, 1, 0.45] }}
                    transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  STATUS: {statusLabel}
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-white/10 bg-[#001d3d]/55 px-3 py-2">
                  <p className="text-[11px] font-mono text-[#778da9]">Confidence</p>
                  <p className="text-lg font-semibold text-[#ffd60a]">{displayConfidence.toFixed(1)}%</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-[#001d3d]/55 px-3 py-2">
                  <p className="text-[11px] font-mono text-[#778da9]">Processing Time</p>
                  <p className="text-lg font-semibold text-[#4cc9f0]">{Math.round(displayTime)} ms</p>
                </div>
              </div>

              <div className="mt-3 rounded-lg border border-white/10 bg-[#001d3d]/45 px-3 py-2">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={statusLabel}
                    className="font-mono text-sm text-[#e5e5e5]"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0, textShadow: ['0 0 0 rgba(255,195,0,0)', '0 0 10px rgba(255,195,0,0.35)', '0 0 0 rgba(255,195,0,0)'] }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.24, ease: 'easeInOut' }}
                  >
                    STATE: {statusLabel}
                  </motion.p>
                </AnimatePresence>
              </div>

              <div className="mt-2 rounded-lg border border-red-500/30 bg-red-950/22 px-3 py-2">
                <p className="text-xs font-mono text-red-200">
                  Low FPS due to per-frame MTCNN inference (security prioritized over speed)
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section className="panel-card p-4" {...sectionMotion}>
          <h2 className="font-display text-2xl font-semibold text-[#e5e5e5]">Pipeline</h2>
          <div className="mt-3 space-y-3">
            <LivePipeline nodes={NODES} systemState={systemState} />
            <InteractivePipeline nodes={NODES} activeStep={activeStep} onStepClick={setActiveStep} />
          </div>
        </motion.section>

        <motion.section className="panel-card p-4" {...sectionMotion}>
          <h2 className="font-display text-2xl font-semibold text-[#e5e5e5]">System Validation</h2>
          <div className="relative mt-3 space-y-2 overflow-hidden rounded-lg font-mono text-sm">
            <motion.div
              className="pointer-events-none absolute inset-0"
              animate={
                validationFlash === 'PASS'
                  ? { opacity: [0, 0.16, 0] }
                  : validationFlash === 'FAIL'
                    ? { opacity: [0, 0.22, 0.08, 0] }
                    : { opacity: 0 }
              }
              transition={{ duration: 0.28, ease: 'easeInOut' }}
              style={{
                background:
                  validationFlash === 'PASS'
                    ? 'linear-gradient(90deg, rgba(34,197,94,0), rgba(34,197,94,0.22), rgba(34,197,94,0))'
                    : 'linear-gradient(90deg, rgba(239,68,68,0), rgba(239,68,68,0.24), rgba(239,68,68,0))',
              }}
            />
            {VALIDATION_ROWS.map((item) => (
              <motion.div
                key={item.left}
                className="relative flex items-center gap-2"
                animate={!item.ok && validationFlash === 'FAIL' ? { opacity: [1, 0.7, 1] } : { opacity: 1 }}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
              >
                <span className={item.ok ? 'text-green-400' : 'text-red-400'}>{item.left}</span>
                <span className="h-px flex-1 border-b border-dotted border-white/15" />
                <span className={item.ok ? 'text-green-300' : 'text-red-300'}>{item.right}</span>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section className="panel-card relative overflow-hidden border-[#4cc9f0]/20 p-4" {...sectionMotion}>
          <div className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-linear-to-r from-[#ffc300]/8 via-transparent to-[#00d4ff]/10" />
          <h2 className="relative z-10 font-display text-2xl font-semibold text-[#e5e5e5]">Security Logging</h2>
          <div className="relative z-10 mt-2 flex flex-wrap items-center gap-2 text-sm font-mono">
            <span className="rounded-md border border-[#4cc9f0]/25 bg-[#0d1b2a]/75 px-2.5 py-1 text-[#4cc9f0]">
              Threat Rejection Rate: <span className="text-[#22c55e]">{threatRejectionRate}%</span>
            </span>
            <span className="rounded-md border border-white/10 bg-[#0d1b2a]/75 px-2.5 py-1 text-[#a7bacd]">Total Attempts: {securityMetrics.totalAttempts}</span>
            <span className="rounded-md border border-white/10 bg-[#0d1b2a]/75 px-2.5 py-1 text-[#a7bacd]">
              Successful Auth: <span className="text-[#22c55e]">{securityMetrics.successfulAuth}</span>
            </span>
            <span className="rounded-md border border-white/10 bg-[#0d1b2a]/75 px-2.5 py-1 text-[#a7bacd]">
              Rejected Attacks: <span className="text-[#ef4444]">{securityMetrics.rejectedAttacks}</span>
            </span>
            <span className="rounded-md border border-white/10 bg-[#0d1b2a]/75 px-2.5 py-1 text-[#778da9]">Sample every {LOG_INTERVAL_MS / 1000}s</span>
          </div>
          <div
            ref={logViewportRef}
            className="relative z-10 mt-2 h-40 overflow-y-auto rounded-xl border border-[#4cc9f0]/20 bg-[#071425]/92 p-2 font-mono text-sm text-[#a9bbce] shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_0_18px_rgba(76,201,240,0.1)] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {logs.map((entry) => (
              <motion.div
                key={entry.id}
                className={`mb-1 rounded-sm px-1 py-0.5 leading-tight last:mb-0 ${entry.id === newestLogId ? 'bg-white/4' : ''}`}
                initial={{ opacity: 0.55, y: 4 }}
                animate={entry.id === newestLogId ? { opacity: [0.45, 1, 0.85], y: [2, 0, 0] } : { opacity: 0.85, y: 0 }}
                transition={{ duration: 0.26, ease: 'easeInOut' }}
              >
                <span className="text-[#778da9]">[{entry.time}]</span>{' '}
                <span className="text-[#d0d8e4]">{entry.identity}</span>{' '}
                <span className={entry.result === 'SUCCESS' ? 'text-[#22c55e]' : 'text-[#ef4444]'}>
                  | {entry.result} ({entry.contextTag}) |
                </span>{' '}
                <span className="text-[#d0d8e4]">{entry.confidence}</span>{' '}
                <span className="text-[#4cc9f0]">| {entry.device}</span>
              </motion.div>
            ))}
            <motion.div
              className="text-[#4cc9f0]/75"
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut' }}
            >
              &gt; _
            </motion.div>
          </div>
        </motion.section>

        <motion.section className="panel-card p-4" {...sectionMotion}>
          <h2 className="font-display text-2xl font-semibold text-[#e5e5e5]">Engineering Decisions</h2>
          <div className="mt-3 grid gap-2 text-sm text-[#c6d4e7] sm:grid-cols-3">
            <div className="rounded-lg border border-white/10 bg-[#0d1b2a]/70 px-3 py-2">MTCNN - robust face detection under pose and lighting variation.</div>
            <div className="rounded-lg border border-white/10 bg-[#0d1b2a]/70 px-3 py-2">FaceNet - embedding thresholding enables deterministic identity acceptance.</div>
            <div className="rounded-lg border border-white/10 bg-[#0d1b2a]/70 px-3 py-2">Pipeline - sequential multi-stage gating blocks partial-pass authentication.</div>
          </div>
        </motion.section>

        <motion.section className="panel-card p-4" {...sectionMotion}>
          <h2 className="font-display text-2xl font-semibold text-[#e5e5e5]">Security Philosophy</h2>
          <div className="mt-3 rounded-lg border border-[#4cc9f0]/28 bg-[#0d1b2a]/74 px-3 py-3 text-sm text-[#c6d4e7]">
            DARVS uses AI + sensing-based verification where identity is accepted only after liveness, anti-spoof,
            and embedding agreement pass in gated sequence.
          </div>
        </motion.section>

        <motion.section
          className="panel-card relative overflow-hidden border-[#4cc9f0]/22 p-4"
          style={{
            background:
              'linear-gradient(100deg, rgba(255,195,0,0.11) 0%, rgba(13,27,42,0.9) 48%, rgba(0,212,255,0.14) 100%)',
          }}
          {...sectionMotion}
        >
          <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-white/6 via-transparent to-black/30" />
          <div className="pointer-events-none absolute -inset-x-6 -top-10 h-20 bg-linear-to-r from-[#ffc300]/14 via-transparent to-[#00d4ff]/14 blur-xl" />
          <h2 className="font-display text-2xl font-semibold text-[#e5e5e5]">System Summary</h2>
          <div className="relative z-10 mt-3 overflow-hidden rounded-lg border border-white/15 bg-[#0b1a2a]/68 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_10px_24px_rgba(0,0,0,0.22)]">
            <div className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-linear-to-b from-[#ffc300]/60 to-[#00d4ff]/55" />
            <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-white/4 via-transparent to-black/20" />
            <p className="relative z-10 pl-1 text-[15px] leading-relaxed text-[#d4dfeb]">
              DARVS enforces identity verification through multi-stage gated execution combining liveness,
              anti-spoofing, and embedding-based matching.
            </p>
          </div>
        </motion.section>
      </div>
    </main>
  );
}
