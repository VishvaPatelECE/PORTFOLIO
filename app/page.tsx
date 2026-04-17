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
  const lastLockNudgeRef = useRef(0);

  const handleViewProjects = () => {
    const section = document.getElementById('projects');
    section?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleContact = () => {
    router.push('/about');
  };

  const handleConnect = () => {
    setIsTerminalOpen(true);
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

  return (
    <main className="w-full bg-transparent">
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

      <SecureCommunication open={isTerminalOpen} onClose={() => setIsTerminalOpen(false)} />
    </main>
  );
}
