'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Hero, Projects, SecureCommunication } from '@/components';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const router = useRouter();
  const { isVerified, setIsVerified } = useAuth();
  const [lockAttemptSignal, setLockAttemptSignal] = useState(0);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [showLockNotice, setShowLockNotice] = useState(!isVerified);
  const lastLockNudgeRef = useRef(0);

  const handleViewProjects = () => {
    const section = document.getElementById('projects');
    section?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleContact = () => {
    router.push('/about');
  };

  const handleConnect = () => {
    window.history.pushState({ secureCommunicationOpen: true }, '');
    setIsTerminalOpen(true);
  };

  const handleCloseTerminal = () => {
    setIsTerminalOpen(false);
  };

  const handleVerified = () => {
    setIsVerified(true);
  };

  useEffect(() => {
    if (!isVerified) {
      // Keep the hero in view before applying lock so refresh does not trap users mid-page.
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';

      const bumpLockFeedback = () => {
        const now = Date.now();
        if (now - lastLockNudgeRef.current < 220) {
          return;
        }
        lastLockNudgeRef.current = now;
        setLockAttemptSignal((prev) => prev + 1);
      };

      const onWheel = (event: WheelEvent) => {
        if (event.deltaY !== 0 || event.deltaX !== 0) {
          event.preventDefault();
          bumpLockFeedback();
        }
      };

      const onTouchMove = (event: TouchEvent) => {
        event.preventDefault();
        bumpLockFeedback();
      };

      const onKeyDown = (event: KeyboardEvent) => {
        const blockedKeys = ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '];
        if (blockedKeys.includes(event.key)) {
          event.preventDefault();
          bumpLockFeedback();
        }
      };

      window.addEventListener('wheel', onWheel, { passive: false });
      window.addEventListener('touchmove', onTouchMove, { passive: false });
      window.addEventListener('keydown', onKeyDown);

      return () => {
        window.removeEventListener('wheel', onWheel);
        window.removeEventListener('touchmove', onTouchMove);
        window.removeEventListener('keydown', onKeyDown);
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
      };
    }

    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';

    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, [isVerified]);

  useEffect(() => {
    if (isVerified) {
      return;
    }

    const timer = window.setTimeout(() => {
      setShowLockNotice(false);
    }, 5200);

    return () => {
      window.clearTimeout(timer);
    };
  }, [isVerified]);

  useEffect(() => {
    const handlePopState = () => {
      setIsTerminalOpen(false);
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  return (
    <main className="w-full bg-transparent">
      {!isVerified && showLockNotice ? (
        <div className="pointer-events-none fixed inset-x-0 top-4 z-40 flex justify-center px-4">
          <p className="rounded-lg border border-[#4cc9f0]/35 bg-[#0d1b2a]/88 px-4 py-2 text-center text-xs font-mono uppercase tracking-[0.08em] text-[#c6d4e7] shadow-[0_8px_20px_rgba(0,0,0,0.35)] sm:text-sm">
            Best viewing experience is Laptop/PC. If using mobile, use desktop site and landscape mode.
          </p>
        </div>
      ) : null}

      <section>
        <Hero
          onViewProjects={handleViewProjects}
          onContact={handleContact}
          onConnect={handleConnect}
          isVerified={isVerified}
          onScanComplete={handleVerified}
          lockAttemptSignal={lockAttemptSignal}
        />
      </section>

      <div>
        <div
        className={`${!isVerified ? 'blur-md opacity-30 pointer-events-none' : ''} transition-all duration-700`}
        >
          <Projects />
        </div>
      </div>

      {isTerminalOpen && <SecureCommunication open={isTerminalOpen} onClose={handleCloseTerminal} />}
    </main>
  );
}
