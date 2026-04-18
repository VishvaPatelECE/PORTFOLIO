'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

type Intent = {
  id: 'research' | 'internship' | 'discussion' | 'demo';
  title: string;
  description: string;
  intentMessage: string;
};

const LINKEDIN_URL = 'https://www.linkedin.com/in/vishva-patel-ece';
const RECIPIENT_EMAIL = 'vishva.viking@gmail.com';

const INTENTS: Intent[] = [
  {
    id: 'research',
    title: 'Research Collaboration',
    description: 'Explore secure intelligent systems and verification research paths.',
    intentMessage: 'I am interested in discussing research directions in secure intelligent systems.',
  },
  {
    id: 'internship',
    title: 'Internship / Opportunity',
    description: 'Discuss internship roles and system-focused engineering opportunities.',
    intentMessage: 'I am reaching out regarding an internship/opportunity aligned with secure systems engineering.',
  },
  {
    id: 'discussion',
    title: 'Technical Discussion',
    description: 'Start an architecture-level conversation on DARVS or USMHACS.',
    intentMessage: 'I would like to start a technical discussion on architecture, trade-offs, and validation strategy.',
  },
  {
    id: 'demo',
    title: 'System Demo Request',
    description: 'Request a walkthrough of system execution and design rationale.',
    intentMessage: 'I would like to request access to a DARVS/USMHACS demo and architecture walkthrough.',
  },
];

const METHODS = [
  {
    id: 'mailto',
    label: 'Open in Email Client',
    note: 'Fallback via mailto protocol',
  },
  {
    id: 'gmail',
    label: 'Gmail',
    note: 'Preferred compose workflow',
  },
  {
    id: 'copy',
    label: 'Copy Email Template',
    note: 'Copy message to clipboard',
  },
] as const;

type MethodId = (typeof METHODS)[number]['id'];

const FEEDBACK_SEQUENCE = [
  'Establishing secure channel...',
  'Encrypting request...',
  'Transmission ready \u2713',
] as const;

type SecureCommunicationProps = {
  open: boolean;
  onClose: () => void;
};

function buildMessage(intentMessage: string) {
  return [
    'Hello Vishva,',
    '',
    'I came across your work on DARVS and hardware-secure systems.',
    '',
    intentMessage,
    '',
    'Looking forward to connecting.',
  ].join('\n');
}

function encodeMailValue(value: string) {
  return encodeURIComponent(value);
}

export default function SecureCommunication({ open, onClose }: SecureCommunicationProps) {
  const [selectedIntent, setSelectedIntent] = useState<Intent['id']>('research');
  const [selectedMethod, setSelectedMethod] = useState<MethodId>('gmail');
  const [messageText, setMessageText] = useState<string>(buildMessage(INTENTS[0].intentMessage));
  const [feedbackIndex, setFeedbackIndex] = useState<number | null>(null);
  const feedbackTimersRef = useRef<number[]>([]);

  const activeIntent = useMemo(() => INTENTS.find((intent) => intent.id === selectedIntent) ?? INTENTS[0], [selectedIntent]);

  const subject = useMemo(() => `[${activeIntent.title}] - Inquiry from Portfolio`, [activeIntent.title]);

  const gmailUrl = useMemo(() => {
    const su = encodeMailValue(subject);
    const body = encodeMailValue(messageText);
    const to = encodeMailValue(RECIPIENT_EMAIL);
    return `https://mail.google.com/mail/?view=cm&fs=1&to=${to}&su=${su}&body=${body}`;
  }, [subject, messageText]);

  const mailtoUrl = useMemo(() => {
    const su = encodeMailValue(subject);
    const body = encodeMailValue(messageText);
    return `mailto:${RECIPIENT_EMAIL}?subject=${su}&body=${body}`;
  }, [subject, messageText]);

  useEffect(() => {
    return () => {
      feedbackTimersRef.current.forEach((timerId) => window.clearTimeout(timerId));
    };
  }, []);

  useEffect(() => {
    setMessageText(buildMessage(activeIntent.intentMessage));
  }, [activeIntent.intentMessage]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;

    if (open) {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', onKeyDown);
    }

    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousBodyOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onClose]);

  const triggerFeedback = () => {
    feedbackTimersRef.current.forEach((timerId) => window.clearTimeout(timerId));
    feedbackTimersRef.current = [];
    setFeedbackIndex(0);

    const second = window.setTimeout(() => setFeedbackIndex(1), 650);
    const third = window.setTimeout(() => setFeedbackIndex(2), 1320);
    const reset = window.setTimeout(() => setFeedbackIndex(null), 3000);

    feedbackTimersRef.current = [second, third, reset];
  };

  const initiateConnection = async () => {
    triggerFeedback();

    if (selectedMethod === 'gmail') {
      window.open(gmailUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    if (selectedMethod === 'mailto') {
      window.location.href = mailtoUrl;
      return;
    }

    const template = `Subject: ${subject}\n\n${messageText}`;
    try {
      await navigator.clipboard.writeText(template);
    } catch {
      const tempArea = document.createElement('textarea');
      tempArea.value = template;
      document.body.appendChild(tempArea);
      tempArea.select();
      document.execCommand('copy');
      document.body.removeChild(tempArea);
    }
  };

  if (!open) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-90 h-full w-full overflow-y-auto bg-[#0d1b2a] px-0 py-0 sm:px-8 sm:py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
      >
        <div className="mx-auto h-full w-full max-w-none sm:max-w-7xl">
          <div className="panel-card relative min-h-dvh overflow-hidden rounded-none border-x-0 border-y-0 border-[#1f3954] bg-[#10243a] p-4 shadow-[0_12px_30px_rgba(0,0,0,0.34),inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-md sm:min-h-0 sm:rounded-2xl sm:border sm:p-6 sm:shadow-[0_20px_46px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.05)]">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_96%_2%,rgba(0,212,255,0.08),transparent_40%)]" />
            <div className="pointer-events-none absolute -left-12 top-6 h-28 w-28 rounded-full bg-[#22c55e]/8 blur-3xl" />

            <div className="relative z-10 space-y-4">
              <header className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <h2 className="font-display text-2xl font-semibold text-[#e0e1dd] sm:text-3xl">SECURE COMMUNICATION TERMINAL</h2>
                  <p className="mt-1 text-sm font-mono uppercase tracking-[0.14em] text-[#4cc9f0]">Initialize connection protocol</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="rounded-lg border border-white/10 bg-[#0d1b2a]/80 px-3 py-2 text-right">
                    <p className="text-[11px] font-mono uppercase tracking-[0.12em] text-[#22c55e]">STATUS: ONLINE</p>
                    <p className="mt-1 text-[11px] font-mono uppercase tracking-[0.12em] text-[#4cc9f0]">CHANNEL: READY</p>
                  </div>
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-lg border border-white/15 bg-[#0d1b2a]/80 px-3 py-2 text-xs font-mono uppercase tracking-[0.12em] text-[#b8c5d6] transition-all duration-200 hover:border-[#4cc9f0]/50 hover:text-[#4cc9f0]"
                  >
                    X Close Terminal
                  </button>
                </div>
              </header>

              <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
                <div className="space-y-4">
                  <section className="panel-card rounded-xl border border-[#1f3954] bg-[#12304b] p-4 shadow-[0_14px_34px_rgba(0,0,0,0.36),inset_0_1px_0_rgba(255,255,255,0.05)]">
                    <p className="text-sm font-mono uppercase tracking-[0.13em] text-[#4cc9f0]">Intent Selection</p>
                    <div className="mt-3 rounded-xl border border-[#0c1f34]/90 bg-[#0a1b2d]/82 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.04),inset_0_-14px_20px_rgba(0,0,0,0.22)]">
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {INTENTS.map((intent) => {
                          const isActive = intent.id === selectedIntent;
                          return (
                            <motion.button
                              key={intent.id}
                              type="button"
                              whileHover={{ y: -2, scale: 1.01 }}
                              whileTap={{ scale: 0.995 }}
                              animate={
                                isActive
                                  ? {
                                      boxShadow: [
                                        '0 0 0 rgba(0,212,255,0)',
                                        '0 0 28px rgba(0,212,255,0.34), 0 0 42px rgba(255,214,10,0.16)',
                                        '0 0 0 rgba(0,212,255,0)'
                                      ],
                                    }
                                  : { boxShadow: '0 0 0 rgba(0,0,0,0)' }
                              }
                              transition={{
                                boxShadow: { duration: 1.8, repeat: isActive ? Infinity : 0, ease: 'easeInOut' },
                              }}
                              onClick={() => setSelectedIntent(intent.id)}
                              className={`panel-card relative text-left p-4 transition-all duration-200 ${
                                isActive
                                  ? 'border-[#00d4ff]/85 bg-[#173754] ring-1 ring-[#ffd60a]/45 shadow-[0_16px_32px_rgba(0,0,0,0.44),0_0_24px_rgba(0,212,255,0.36),0_0_14px_rgba(255,214,10,0.2)]'
                                  : 'border-[#294866] bg-[#112b43] shadow-[0_14px_26px_rgba(0,0,0,0.34),inset_0_1px_0_rgba(255,255,255,0.04)] hover:border-[#22c55e]/40 hover:shadow-[0_16px_30px_rgba(0,0,0,0.38),0_0_14px_rgba(34,197,94,0.1)]'
                              }`}
                            >
                              {isActive ? (
                                <span className="pointer-events-none absolute right-3 top-3 rounded-sm border border-[#ffd60a]/50 bg-[#ffd60a]/14 px-2 py-0.5 text-[10px] font-mono uppercase tracking-[0.12em] text-[#ffd60a]">
                                  Selected
                                </span>
                              ) : null}
                              <p className="font-mono text-[13px] uppercase tracking-[0.13em] text-[#ffd60a]">{intent.title}</p>
                              <p className="mt-2 text-sm leading-relaxed text-[#b8c5d6]">{intent.description}</p>
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>
                  </section>

                  <section className="panel-card rounded-xl border border-[#1f3954] bg-[#10243a] p-4 shadow-[0_12px_30px_rgba(0,0,0,0.34),inset_0_1px_0_rgba(255,255,255,0.04)]">
                    <div className="grid gap-4 lg:grid-cols-[1fr_1.3fr]">
                      <div className="space-y-3">
                        <p className="text-sm font-mono uppercase tracking-[0.13em] text-[#4cc9f0]">Email Method Selection</p>
                        <div className="grid gap-2">
                          {METHODS.map((method) => {
                            const isActive = selectedMethod === method.id;
                            return (
                              <button
                                key={method.id}
                                type="button"
                                onClick={() => setSelectedMethod(method.id)}
                                className={`rounded-lg border px-3 py-2 text-left transition-all duration-200 ${
                                  isActive
                                    ? 'border-[#22c55e]/55 bg-[#133325]/35 shadow-[0_10px_24px_rgba(0,0,0,0.3),0_0_14px_rgba(34,197,94,0.14)]'
                                    : 'border-[#1f3954] bg-[#0f2238]/88 shadow-[0_8px_20px_rgba(0,0,0,0.26),inset_0_1px_0_rgba(255,255,255,0.03)] hover:border-[#4cc9f0]/45'
                                }`}
                              >
                                <p className="text-sm font-semibold text-[#e0e1dd]">{method.label}</p>
                                <p className="text-xs text-[#778da9]">{method.note}</p>
                              </button>
                            );
                          })}
                        </div>
                        <a
                          href={LINKEDIN_URL}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex rounded-lg border border-[#4cc9f0]/35 bg-[#0d1b2a]/70 px-3 py-2 text-xs font-mono uppercase tracking-[0.12em] text-[#4cc9f0] transition-all duration-200 hover:border-[#4cc9f0]/58 hover:bg-[#12314d]"
                        >
                          Connect on LinkedIn
                        </a>
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm font-mono uppercase tracking-[0.13em] text-[#4cc9f0]">Message Template</p>
                        <div className="rounded-lg border border-[#1f3954] bg-[#0b1d31]/94 p-2.5 shadow-[0_10px_24px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.03)]">
                          <p className="mb-2 text-sm font-mono uppercase tracking-[0.12em] text-[#ffd60a]">{subject}</p>
                          <textarea
                            value={messageText}
                            onChange={(event) => setMessageText(event.target.value)}
                            className="h-36 w-full resize-none rounded-md border border-[#284563] bg-[#0a1b2d] px-3 py-2 text-sm leading-relaxed text-[#c6d4e7] outline-none transition-all duration-200 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden focus:border-[#4cc9f0]/65 focus:shadow-[0_0_0_1px_rgba(76,201,240,0.28)]"
                          />
                        </div>
                      </div>
                    </div>
                  </section>

                  <section className="panel-card rounded-xl border border-[#1f3954] bg-[#10243a] p-4 shadow-[0_12px_30px_rgba(0,0,0,0.34),inset_0_1px_0_rgba(255,255,255,0.04)]">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={initiateConnection}
                        className="btn-spectrum group text-sm font-semibold"
                      >
                        <span className="btn-spectrum-layer" />
                        <span className="btn-spectrum-text">INITIATE CONNECTION</span>
                      </button>
                      <a
                        href="/Vishva_Patel_CV.pdf"
                        download
                        className="rounded-lg border border-[#22c55e]/35 bg-[#0d1b2a]/80 px-4 py-2 text-sm font-medium text-[#22c55e] transition-all duration-200 hover:border-[#22c55e]/58 hover:bg-[#133325]"
                      >
                        Download CV
                      </a>
                    </div>
                    <div className="mt-3 min-h-5">
                      <AnimatePresence mode="wait" initial={false}>
                        {feedbackIndex !== null ? (
                          <motion.p
                            key={FEEDBACK_SEQUENCE[feedbackIndex]}
                            className="text-xs font-mono uppercase tracking-[0.12em] text-[#ffd60a]"
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            transition={{ duration: 0.2, ease: 'easeInOut' }}
                          >
                            {FEEDBACK_SEQUENCE[feedbackIndex]}
                          </motion.p>
                        ) : (
                          <motion.p
                            key="feedback-idle"
                            className="text-xs font-mono uppercase tracking-[0.12em] text-[#778da9]"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2, ease: 'easeInOut' }}
                          >
                            Terminal waiting for initiation command.
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  </section>
                </div>

                <aside className="panel-card h-fit rounded-xl border border-[#1f3954] bg-[#10243a] p-4 shadow-[0_12px_30px_rgba(0,0,0,0.34),inset_0_1px_0_rgba(255,255,255,0.04)]">
                  <p className="text-sm font-mono uppercase tracking-[0.13em] text-[#ffd60a]">How to use</p>
                  <ul className="mt-3 space-y-2 text-sm leading-relaxed text-[#b8c5d6]">
                    <li>1. Select intent</li>
                    <li>2. Choose email method (Gmail recommended)</li>
                    <li>3. Edit message if needed</li>
                    <li>4. Click initiate</li>
                  </ul>
                  <p className="mt-4 rounded-md border border-[#4cc9f0]/24 bg-[#0d1b2a]/80 px-3 py-2 text-xs leading-relaxed text-[#9db2c8]">
                    If mail client opens incorrectly, use Gmail or Copy option.
                  </p>
                </aside>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
