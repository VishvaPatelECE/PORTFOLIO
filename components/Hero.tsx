'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, Variants } from 'framer-motion';

interface HeroProps {
  name?: string;
  tagline?: string;
  compact?: boolean;
  onViewProjects?: () => void;
  onContact?: () => void;
  onConnect?: () => void;
  isVerified?: boolean;
  onScanComplete?: () => void;
  lockAttemptSignal?: number;
}

const STEP_DELAY = 600;

const SCAN_STEPS = [
  'Initializing camera...',
  'Running MTCNN...',
  'Checking anti-spoof...',
  'Verifying liveness...',
  'Matching identity...',
];

export const Hero: React.FC<HeroProps> = ({
  name = 'Vishva Patel',
  tagline = 'Engineering Secure Systems at the Intersection of Hardware and Intelligence',
  compact = false,
  onViewProjects,
  onContact,
  onConnect,
  isVerified: verifiedFromProps = false,
  onScanComplete,
  lockAttemptSignal = 0,
}) => {
  const [mounted, setMounted] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [showScanPrompt, setShowScanPrompt] = useState(true);
  const [hasScanActivated, setHasScanActivated] = useState(false);
  const [isUnlockBurstVisible, setIsUnlockBurstVisible] = useState(false);
  const [isLockShakeActive, setIsLockShakeActive] = useState(false);
  const [matchConfidence, setMatchConfidence] = useState(92);
  const [processingTime, setProcessingTime] = useState(245);
  const onScanCompleteRef = useRef(onScanComplete);
  const isAccessVerified = isVerified || verifiedFromProps;

  const idleMessage = 'Awaiting verification...';
  const confidence = Math.max(0, Math.min(100, isAccessVerified ? matchConfidence : isScanning ? 82 + currentStepIndex * 4 : 0));
  const radius = 80;
  const stroke = 12;
  const ringLength = 502;

  const currentText = isScanning ? SCAN_STEPS[Math.min(currentStepIndex, SCAN_STEPS.length - 1)] : idleMessage;
  const shouldShowScanPrompt = showScanPrompt && !isScanning && !isAccessVerified;

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    onScanCompleteRef.current = onScanComplete;
  }, [onScanComplete]);

  useEffect(() => {
    if (!isAccessVerified) {
      const resetFrameId = window.requestAnimationFrame(() => {
        setIsUnlockBurstVisible(false);
      });
      return () => window.cancelAnimationFrame(resetFrameId);
    }

    const startFrameId = window.requestAnimationFrame(() => {
      setIsUnlockBurstVisible(true);
    });
    const timer = window.setTimeout(() => {
      setIsUnlockBurstVisible(false);
    }, 420);

    return () => {
      window.cancelAnimationFrame(startFrameId);
      window.clearTimeout(timer);
    };
  }, [isAccessVerified]);

  useEffect(() => {
    if (lockAttemptSignal === 0 || isAccessVerified || isScanning) {
      return;
    }

    const startFrameId = window.requestAnimationFrame(() => {
      setIsLockShakeActive(true);
    });
    const timer = window.setTimeout(() => {
      setIsLockShakeActive(false);
    }, 260);

    return () => {
      window.cancelAnimationFrame(startFrameId);
      window.clearTimeout(timer);
    };
  }, [lockAttemptSignal, isAccessVerified, isScanning]);

  useEffect(() => {
    if (!isScanning) return;
    let i = 0;
    let finishTimer: number | undefined;

    const interval = window.setInterval(() => {
      setCurrentStepIndex(i);
      i += 1;

      if (i >= SCAN_STEPS.length) {
        window.clearInterval(interval);
        finishTimer = window.setTimeout(() => {
          setMatchConfidence(Math.floor(Math.random() * 6) + 90);
          setProcessingTime(Math.floor(Math.random() * 11) + 240);
          setIsVerified(true);
          setIsScanning(false);
          onScanCompleteRef.current?.();
        }, 200);
      }
    }, STEP_DELAY);

    return () => {
      window.clearInterval(interval);
      if (finishTimer) {
        window.clearTimeout(finishTimer);
      }
    };
  }, [isScanning]);

  const handleStartScan = () => {
    if (isScanning || isAccessVerified) {
      return;
    }

    setShowScanPrompt(false);
    setMatchConfidence(90);
    setProcessingTime(240);
    setCurrentStepIndex(0);
    setIsVerified(false);
    setHasScanActivated(true);
    setIsScanning(true);
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.35,
        ease: 'easeOut',
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
  };

  const panelVariants: Variants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
  };

  const buttonVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
  };

  return (
    <section className={`relative flex w-full items-stretch justify-center overflow-hidden bg-transparent ${compact ? 'min-h-[60vh]' : 'min-h-[72vh] md:min-h-screen lg:h-screen'}`}>
      <motion.div
        className="absolute inset-0 -z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_0%,rgba(255,198,10,0.08)_0%,transparent_42%)]" />
      </motion.div>

      <motion.div
        className="relative z-10 flex w-full max-w-400 lg:h-full"
        variants={containerVariants}
        initial="hidden"
        animate={mounted ? 'visible' : 'hidden'}
      >
        <div className="flex w-full flex-col lg:h-full lg:flex-row">
          <motion.div
            className={`w-full flex flex-col justify-between overflow-hidden border-b border-white/10 bg-[#0d1b2a]/78 px-4 sm:px-6 md:px-8 lg:w-1/2 lg:border-b-0 lg:border-r lg:pr-10 ${compact ? 'py-6' : 'py-6 lg:py-8'} ${
              !isAccessVerified ? 'pointer-events-none select-none blur-sm opacity-30' : ''
            } transition-all duration-700`}
          >
            <div className="space-y-4 sm:space-y-6">
              <motion.div variants={itemVariants}>
                <div className="text-xs font-mono font-semibold uppercase tracking-[0.16em] text-[#778da9]">
                  EMBEDDED & INTELLIGENT SYSTEMS ENGINEER
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <h1 className={`font-bold leading-tight tracking-[0.02em] text-[#e0e1dd] ${compact ? 'text-3xl' : 'text-3xl sm:text-4xl md:text-5xl'}`}>
                  {name}
                </h1>
              </motion.div>

              <motion.div 
                variants={itemVariants}
                className="h-px bg-white/10"
              />

              <motion.div variants={itemVariants} className="space-y-3">
                <p className="max-w-[44ch] text-lg font-light leading-relaxed text-[#778da9] sm:text-xl">
                  {tagline}
                </p>
                <div className="h-0.5 w-10 rounded-full bg-[#ffc300]" />
              </motion.div>

              <motion.div variants={itemVariants}>
                <p className="text-sm font-mono font-bold tracking-[0.14em] text-[#4cc9f0]">
                  SECURITY × INTELLIGENCE × SYSTEM DESIGN
                </p>
              </motion.div>

              <motion.div 
                variants={itemVariants}
                className="h-px bg-white/10"
              />

              <motion.div variants={itemVariants}>
                <div className="max-w-[52ch] space-y-3 text-justify text-base font-mono tracking-tight leading-relaxed text-[#778da9] lg:text-lg">
                  <p>
                    I love to design systems where
                    <span className="font-medium text-[#ffc300]"> hardware logic </span>
                    and
                    <span className="font-medium text-[#00d4ff]"> AI verification </span>
                    work together to ensure real-world trust.
                  </p>
                  <p className="text-[15px] text-[#ffd60a]">
                    Driven by fast iteration, deep system understanding, and a constant focus on correctness under constraints.
                  </p>
                  <p className="text-[15px] text-[#f59e0b]">
                    I approach problems by breaking them into verifiable stages, analyzing trade-offs, and refining until the system behaves predictably.
                  </p>
                </div>
              </motion.div>
            </div>

            <motion.div
              className="flex flex-col gap-3 pt-4 sm:flex-row sm:pt-6"
              variants={containerVariants}
            >
              <motion.button
                className="btn-spectrum group text-base font-semibold"
                variants={buttonVariants}
                onClick={isAccessVerified ? onViewProjects : undefined}
              >
                <span className="btn-spectrum-layer" />
                <span className="btn-spectrum-text">Explore Systems</span>
              </motion.button>

              <motion.button
                className="btn-spectrum group text-base font-medium"
                variants={buttonVariants}
                onClick={isAccessVerified ? onContact : undefined}
              >
                <span className="btn-spectrum-layer" />
                <span className="btn-spectrum-text">About &amp; Research</span>
              </motion.button>

              <motion.button
                className="btn-spectrum group text-base font-medium"
                variants={buttonVariants}
                onClick={isAccessVerified ? onConnect : undefined}
              >
                <span className="btn-spectrum-layer" />
                <span className="btn-spectrum-text">Connect</span>
              </motion.button>
            </motion.div>
          </motion.div>

          <motion.div
            className="flex min-w-0 flex-col overflow-hidden bg-[#0b1628]/92 lg:w-1/2"
            variants={panelVariants}
            initial="hidden"
            animate={mounted ? 'visible' : 'hidden'}
          >
            <div className="flex h-full w-full min-w-0 flex-col overflow-hidden border-l-0 border-white/10 bg-[#0a1424]/90 backdrop-blur-sm lg:border-l">
              <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="text-sm font-mono font-medium text-[#4cc9f0]">
                    DARVS System Overview
                  </div>
                </div>
                <motion.div
                  className="w-2.5 h-2.5 rounded-full bg-green-500"
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
                />
              </div>

              <div className="flex flex-1 flex-col gap-5 overflow-hidden p-5">
                <motion.div 
                  className="flex h-[36%] min-h-0 flex-col space-y-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.35, ease: 'easeOut' }}
                >
                  <div className="text-xs font-mono font-medium uppercase tracking-[0.14em] text-[#778da9]">
                    Camera Feed
                  </div>
                  <div className="group relative flex-1 overflow-hidden rounded-xl border border-white/10 bg-[#415a77]/25 shadow-[0_12px_28px_rgba(13,27,42,0.45)]">
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(224,225,221,0.05),transparent)]" />

                    <svg className="absolute inset-0 w-full h-full opacity-3 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                      <filter id="noise">
                        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" result="noise" />
                      </filter>
                      <rect width="100%" height="100%" fill="white" filter="url(#noise)" opacity="0.05" />
                    </svg>

                    <motion.div
                      className="absolute inset-0 bg-white opacity-0"
                      animate={{ opacity: [0, 0.015, 0] }}
                      transition={{ duration: 0.15, repeat: Infinity, repeatDelay: 3.5 }}
                    />

                    <svg className="absolute inset-0 w-full h-full opacity-5 pointer-events-none">
                      <defs>
                        <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e0e1dd" strokeWidth="0.5"/>
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#grid-pattern)"/>
                    </svg>

                    {hasScanActivated && <div className="scan-line pointer-events-none" />}

                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        className="relative w-40 h-48"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                      >
                        <motion.div
                          className="pointer-events-none absolute inset-0 rounded border-2 border-[#ffc300]/55"
                          animate={{
                            opacity: [0.7, 1, 0.7],
                          }}
                          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
                        />

                        <motion.svg
                          className="absolute inset-0 h-full w-full text-[#e0e1dd]/70"
                          viewBox="0 0 160 192"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path
                            d="M 20 40 Q 20 20 40 20 L 120 20 Q 140 20 140 40"
                            fill="none"
                            stroke="inherit"
                            strokeWidth="1.5"
                          />
                          <path
                            d="M 20 152 Q 20 172 40 172 L 120 172 Q 140 172 140 152"
                            fill="none"
                            stroke="inherit"
                            strokeWidth="1.5"
                          />
                          <line x1="20" y1="40" x2="20" y2="152" strokeWidth="1.5" />
                          <line x1="140" y1="40" x2="140" y2="152" strokeWidth="1.5" />
                        </motion.svg>

                        <div className="absolute inset-0">
                          <motion.div
                            className="absolute top-0 left-0 h-4 w-4 border-l-2 border-t-2 border-[#ffc300]"
                            animate={{
                              opacity: [0.4, 0.8, 0.4],
                            }}
                            transition={{ duration: 2.2, repeat: Infinity }}
                          />
                          <motion.div
                            className="absolute top-0 right-0 h-4 w-4 border-r-2 border-t-2 border-[#ffc300]"
                            animate={{
                              opacity: [0.4, 0.8, 0.4],
                            }}
                            transition={{ duration: 2.2, repeat: Infinity, delay: 0.35 }}
                          />
                          <motion.div
                            className="absolute bottom-0 left-0 h-4 w-4 border-b-2 border-l-2 border-[#ffc300]"
                            animate={{
                              opacity: [0.4, 0.8, 0.4],
                            }}
                            transition={{ duration: 2.2, repeat: Infinity, delay: 0.7 }}
                          />
                          <motion.div
                            className="absolute bottom-0 right-0 h-4 w-4 border-b-2 border-r-2 border-[#ffc300]"
                            animate={{
                              opacity: [0.4, 0.8, 0.4],
                            }}
                            transition={{ duration: 2.2, repeat: Infinity, delay: 1.05 }}
                          />
                        </div>

                        <motion.div
                          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                          animate={{ opacity: [0.2, 0.5, 0.2] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <div className="relative w-8 h-8">
                            <div className="absolute left-1/2 top-0 h-8 w-0.5 -translate-x-1/2 transform bg-[#e0e1dd]/40" />
                            <div className="absolute left-0 top-1/2 h-0.5 w-8 -translate-y-1/2 transform bg-[#e0e1dd]/40" />
                            <div className="absolute inset-0 rounded-full border border-[#e0e1dd]/40" />
                          </div>
                        </motion.div>

                        <div className="absolute inset-2 pointer-events-none">
                          <motion.div
                            className="absolute h-1.5 w-1.5 rounded-full bg-[#ffd60a]"
                            style={{ top: '20%', left: '25%' }}
                            animate={{ opacity: [0.2, 0.6, 0.2] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          />
                          <motion.div
                            className="absolute h-1.5 w-1.5 rounded-full bg-[#ffd60a]"
                            style={{ top: '20%', right: '25%' }}
                            animate={{ opacity: [0.2, 0.6, 0.2] }}
                            transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                          />
                          <motion.div
                            className="absolute h-1.5 w-1.5 rounded-full bg-[#ffd60a]"
                            style={{ bottom: '20%', left: '25%' }}
                            animate={{ opacity: [0.2, 0.6, 0.2] }}
                            transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                          />
                          <motion.div
                            className="absolute h-1.5 w-1.5 rounded-full bg-[#ffd60a]"
                            style={{ bottom: '20%', right: '25%' }}
                            animate={{ opacity: [0.2, 0.6, 0.2] }}
                            transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
                          />
                        </div>
                      </motion.div>
                    </div>

                    <div className="absolute right-3 top-3 space-y-1 text-xs font-mono text-[#778da9]">
                      <div>RES: 1920x1440</div>
                      <div>FPS: 30</div>
                    </div>

                    <div className="absolute bottom-3 left-3 flex items-center gap-2">
                      <motion.div
                        className="w-2.5 h-2.5 rounded-full bg-red-500"
                        animate={{ opacity: [1, 0.35, 1] }}
                        transition={{ duration: 1.2, repeat: Infinity, ease: 'easeOut' }}
                      />
                      <motion.div
                        className="text-xs font-mono text-red-400 font-semibold"
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ duration: 1.2, repeat: Infinity, ease: 'easeOut' }}
                      >
                        RECORDING
                      </motion.div>
                    </div>
                  </div>
                </motion.div>

                <div className="h-px shrink-0 bg-white/10" />

                <motion.div 
                  className="flex min-h-0 flex-1 flex-col space-y-2 overflow-visible"
                  initial={{ opacity: 0, y: 10 }}
                  animate={
                    isUnlockBurstVisible
                      ? { opacity: 1, y: 0, scale: [1, 1.015, 1], filter: ['brightness(1)', 'brightness(1.11)', 'brightness(1)'] }
                      : { opacity: 1, y: 0, scale: 1, filter: 'brightness(1)' }
                  }
                  transition={{ delay: 0.18, duration: 0.35, ease: 'easeOut' }}
                >
                  <div className="relative z-30 mb-0.5 flex shrink-0 items-center justify-between">
                    <div className="text-xs font-mono font-medium uppercase tracking-[0.14em] text-[#778da9]">
                      System Status
                    </div>
                    <motion.button
                      onClick={handleStartScan}
                      disabled={isScanning || isAccessVerified}
                      className="btn-spectrum group relative z-30 px-3 py-1 text-xs font-mono font-semibold disabled:cursor-not-allowed disabled:opacity-50"
                      animate={
                        !isAccessVerified && !isScanning
                          ? {
                              scale: [1, 1.045, 1],
                              y: [0, -1, 0],
                              borderColor: ['rgba(255,255,255,0.12)', 'rgba(255,214,10,0.58)', 'rgba(255,255,255,0.12)'],
                              boxShadow: [
                                '0 10px 24px rgba(0,0,0,0.28), inset 0 -1px 0 rgba(255,255,255,0.06)',
                                '0 14px 32px rgba(255,195,0,0.22), 0 0 14px rgba(76,201,240,0.18), inset 0 -1px 0 rgba(255,255,255,0.18)',
                                '0 10px 24px rgba(0,0,0,0.28), inset 0 -1px 0 rgba(255,255,255,0.06)',
                              ],
                            }
                          : {
                              scale: 1,
                              y: 0,
                              borderColor: 'rgba(255,255,255,0.1)',
                              boxShadow: '0 10px 24px rgba(0,0,0,0.28), inset 0 -1px 0 rgba(255,255,255,0.06)',
                            }
                      }
                      transition={{ duration: 1.15, repeat: !isAccessVerified && !isScanning ? Infinity : 0, ease: 'easeInOut' }}
                    >
                      <span className="btn-spectrum-layer" />
                      <span className="btn-spectrum-text">
                        {isAccessVerified ? 'AUTHENTICATED' : isScanning ? 'SCANNING...' : 'SCAN'}
                      </span>
                    </motion.button>
                  </div>
                  <motion.div
                    className={`parent-container relative flex flex-1 min-h-0 flex-col gap-3 overflow-hidden pt-0.5 pb-2 ${
                      shouldShowScanPrompt ? 'select-none pointer-events-none' : ''
                    }`}
                    animate={isLockShakeActive ? { x: [0, -4, 4, -3, 3, 0] } : { x: 0 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                  >
                    {!isAccessVerified && (
                      <div className="scan-log relative shrink-0 rounded-lg border border-white/10 bg-[#0d1b2a]/85 px-3 py-2 font-mono text-sm text-[#e0e1dd]">
                        <motion.div
                          key={`${isScanning ? currentStepIndex : -1}-${currentText}`}
                          className="absolute left-3 right-3 top-1/2 -translate-y-1/2 overflow-hidden text-ellipsis whitespace-nowrap"
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, ease: 'easeOut' }}
                          style={{ color: isScanning ? '#ff6b35' : '#778da9' }}
                        >
                          {'▶ '} {currentText}
                        </motion.div>
                      </div>
                    )}
                    <div className="flex-1 min-h-0 overflow-y-auto">
                      <motion.div
                        className="grid h-full min-h-0 grid-cols-20 items-stretch gap-8 px-8 py-3"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.35, ease: 'easeOut' }}
                      >
                        <div className="col-span-11 flex min-h-0 justify-start">
                          <div className="flex h-full min-h-0 w-full flex-col gap-3">
                            <div className="panel-card flex min-h-0 flex-1 flex-col justify-center">
                              <p className="text-xs tracking-widest text-[#778da9]">STATUS</p>
                              <p className={`${isAccessVerified ? 'text-[#22c55e]' : isScanning ? 'text-[#facc15]' : 'text-[#778da9]'} mt-1 font-semibold`}>
                                ● {isAccessVerified ? 'AUTHENTICATED' : isScanning ? 'SCANNING' : 'IDLE'}
                              </p>
                            </div>

                            <div className="panel-card flex min-h-0 flex-1 flex-col justify-center">
                              <p className="text-xs tracking-widest text-[#778da9]">ANALYZER</p>
                              <p className={`${isScanning && !isAccessVerified ? 'text-[#f59e0b]' : 'text-[#facc15]'} mt-1`}>
                                {isScanning && !isAccessVerified ? 'ANALYZING' : 'LOW RISK'}
                              </p>
                            </div>

                            <div className="panel-card flex min-h-0 flex-1 flex-col justify-center">
                              <p className="text-xs tracking-widest text-[#778da9]">TIMING</p>
                              <p className="mt-1 text-[#38bdf8]">{isAccessVerified ? `${processingTime} ms` : '244 ms'}</p>
                            </div>
                          </div>
                        </div>

                        <div className="col-span-9 flex min-h-0 items-stretch justify-center">
                          <div className="panel-card flex h-full min-h-0 w-full flex-col items-center justify-start pt-5">
                            <p className="mb-5 text-xs tracking-widest text-[#778da9]">CONFIDENCE</p>

                            <svg width="180" height="180" viewBox="0 0 200 200">
                              <circle
                                cx="100"
                                cy="100"
                                r={radius}
                                stroke="#1b263b"
                                strokeWidth={stroke}
                                fill="none"
                              />

                              <motion.circle
                                cx="100"
                                cy="100"
                                r={radius}
                                stroke="url(#grad)"
                                strokeWidth={stroke}
                                fill="none"
                                strokeDasharray={ringLength}
                                animate={{ strokeDashoffset: ringLength - (confidence / 100) * ringLength }}
                                transition={{ duration: 0.6, ease: 'easeOut' }}
                                strokeLinecap="round"
                                transform="rotate(-90 100 100)"
                              />

                              <text
                                x="50%"
                                y="50%"
                                dominantBaseline="middle"
                                textAnchor="middle"
                                className="fill-white text-3xl font-bold"
                              >
                                {confidence}%
                              </text>

                              <defs>
                                <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                                  <stop offset="0%" stopColor="#ffc300" />
                                  <stop offset="100%" stopColor="#00d4ff" />
                                </linearGradient>
                              </defs>
                            </svg>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                    {shouldShowScanPrompt && (
                      <motion.div
                        className="pointer-events-auto absolute inset-0 z-20 flex items-center justify-center rounded-lg border border-[#4cc9f0]/35 bg-[#0d1b2a]/72 backdrop-blur-[2px]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                      >
                        <div className="mx-4 max-w-md rounded-xl border border-white/12 bg-[#1b263b]/88 px-5 py-4 text-center shadow-[0_12px_40px_rgba(0,0,0,0.45)]">
                          <p className="text-sm font-mono font-semibold tracking-wide text-[#e0e1dd] sm:text-base">
                            SCAN to Authenticate Your Identity
                          </p>
                          <p className="mt-2 text-xs font-mono text-[#4cc9f0] sm:text-sm">
                            Press the SCAN button above to proceed.
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
