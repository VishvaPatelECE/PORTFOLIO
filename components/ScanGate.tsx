'use client';

import React, { useEffect, useRef, useState } from 'react';

interface ScanGateProps {
  onComplete: () => void;
}

const SCAN_STAGES = [
  'Initializing camera',
  'Running face detection (MTCNN)',
  'Anti-spoof check',
  'Liveness verification',
  'Face recognition (FaceNet)',
  'AUTHENTICATED',
] as const;

export const ScanGate: React.FC<ScanGateProps> = ({ onComplete }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [completedLines, setCompletedLines] = useState<string[]>([]);
  const [isVerified, setIsVerified] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isScanning) {
      return;
    }

    let stageIndex = 0;

    const runStage = () => {
      const nextLine = SCAN_STAGES[stageIndex];
      setCompletedLines((prev) => [...prev, `[OK] ${nextLine}`]);

      if (stageIndex === SCAN_STAGES.length - 1) {
        setIsScanning(false);
        setIsVerified(true);
        onComplete();
        return;
      }

      stageIndex += 1;
      timeoutRef.current = setTimeout(runStage, 650);
    };

    timeoutRef.current = setTimeout(runStage, 350);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isScanning, onComplete]);

  const handleScanStart = () => {
    if (isScanning || isVerified) {
      return;
    }

    setCompletedLines([]);
    setIsScanning(true);
  };

  return (
    <section className="mx-auto w-full max-w-350 px-6 pt-10 sm:px-8 lg:px-12">
      <div className="panel-card p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-mono uppercase tracking-wider text-[#4cc9f0]">ScanGate</p>
          <button
            type="button"
            onClick={handleScanStart}
            disabled={isScanning || isVerified}
            className="btn-spectrum group px-3 py-1.5 font-mono text-xs disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="btn-spectrum-layer" />
            <span className="btn-spectrum-text">INITIATE SCAN</span>
          </button>
        </div>

        <div className="mt-4 min-h-36 rounded-md border border-white/10 bg-[#0d1b2a]/70 p-3 font-mono text-xs leading-6 text-[#778da9]">
          {completedLines.length === 0 ? (
            <p>System idle. Awaiting verification trigger.</p>
          ) : (
            completedLines.map((line, index) => (
              <p key={`${line}-${index}`} className="text-green-400">
                {line}
              </p>
            ))
          )}
        </div>
      </div>
    </section>
  );
};
