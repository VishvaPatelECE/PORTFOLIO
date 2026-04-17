'use client';

import { useEffect } from 'react';

const ScrollDepthLayer = () => {
  useEffect(() => {
    const updateDepth = () => {
      const doc = document.documentElement;
      const maxScroll = Math.max(1, doc.scrollHeight - window.innerHeight);
      const ratio = Math.min(1, window.scrollY / maxScroll);
      doc.style.setProperty('--scroll-darken', String(ratio * 0.24));
    };

    updateDepth();
    window.addEventListener('scroll', updateDepth, { passive: true });
    window.addEventListener('resize', updateDepth);

    return () => {
      window.removeEventListener('scroll', updateDepth);
      window.removeEventListener('resize', updateDepth);
    };
  }, []);

  useEffect(() => {
    const glow = document.getElementById('cursor-glow');

    const move = (e: MouseEvent) => {
      if (!glow) {
        return;
      }

      glow.style.background = `radial-gradient(300px circle at ${e.clientX}px ${e.clientY}px, rgba(255,195,0,0.08), transparent 70%)`;
    };

    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  return <div className="pointer-events-none fixed inset-0 z-0" id="cursor-glow" />;
};

export default ScrollDepthLayer;
