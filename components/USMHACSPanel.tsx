"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import { Activity, Clock, Cpu, DoorClosed, DoorOpen, Fingerprint, Key, Shield, ShieldAlert } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type CodeState = "idle" | "correct" | "wrong";
type DelayStatus = "idle" | "waiting" | "ok";
type LogType = "info" | "success" | "warn" | "error";
type PathColor = "slate" | "green" | "red" | "orange" | "gold";
type ScenarioType = "perfect" | "brute" | "breach";
type PosKey =
  | "env"
  | "sens"
  | "key"
  | "code"
  | "delay"
  | "tamper"
  | "reset"
  | "latch"
  | "and"
  | "solenoid"
  | "door";

interface SensorState {
  magnetic: boolean;
  temp: boolean;
  pressure: boolean;
  laser: boolean;
}

interface LogEntry {
  time: string;
  msg: string;
  type: LogType;
}

interface SystemState {
  sensors: SensorState;
  physicalKey: boolean;
  codeState: CodeState;
  tamperDetected: boolean;
  delayStatus: DelayStatus;
  isLatched: boolean;
  doorOpen: boolean;
  logs: LogEntry[];
}

interface PathDef {
  id: string;
  d: string;
  color: PathColor;
  active: boolean;
  dash?: boolean;
}

interface LabelDef {
  text: string;
  x: number;
  y: number;
  color: string;
}

interface DiagramNodeProps {
  pos: [number, number];
  children: React.ReactNode;
}

interface StatusDiamondProps {
  title: string;
  status: "ok" | "error" | "warn" | "idle";
  icon: LucideIcon;
  pulsing?: boolean;
  onClick?: () => void;
  hint?: string;
}

type Action =
  | { type: "SET_SENSORS"; sensors: SensorState }
  | { type: "SET_KEY"; physicalKey: boolean }
  | { type: "SET_CODE"; codeState: CodeState }
  | { type: "SET_TAMPER"; tamperDetected: boolean }
  | { type: "SET_DELAY"; delayStatus: DelayStatus }
  | { type: "SET_LATCH"; isLatched: boolean }
  | { type: "RESET_BASE" }
  | { type: "ADD_LOG"; msg: string; level?: LogType };

const INITIAL_STATE: SystemState = {
  sensors: { magnetic: true, temp: true, pressure: true, laser: true },
  physicalKey: false,
  codeState: "idle",
  tamperDetected: false,
  delayStatus: "idle",
  isLatched: false,
  doorOpen: false,
  logs: [],
};

const TOP_ROW_Y = 120;
const TOP_ROW_START_X = 230;
const TOP_ROW_STEP = 170;
const DIAMOND_EDGE_X = 46;

const POS: Record<PosKey, [number, number]> = {
  env: [80, TOP_ROW_Y],
  sens: [TOP_ROW_START_X, TOP_ROW_Y],
  key: [TOP_ROW_START_X + TOP_ROW_STEP, TOP_ROW_Y],
  code: [TOP_ROW_START_X + TOP_ROW_STEP * 2, TOP_ROW_Y],
  delay: [TOP_ROW_START_X + TOP_ROW_STEP * 3, TOP_ROW_Y],
  tamper: [TOP_ROW_START_X + TOP_ROW_STEP * 4, TOP_ROW_Y],
  reset: [80, 470],
  latch: [320, 400],
  and: [620, 400],
  solenoid: [820, 400],
  door: [980, 400],
};

const addLog = (state: SystemState, msg: string, level: LogType = "info"): SystemState => ({
  ...state,
  logs: [{ time: new Date().toLocaleTimeString(), msg, type: level }, ...state.logs].slice(0, 8),
});

const applyHardwareRules = (prev: SystemState, draft: SystemState): SystemState => {
  let next = draft;
  const sensorsOk = Object.values(next.sensors).every((v) => v);

  if (!next.isLatched && !sensorsOk) {
    next = addLog({ ...next, isLatched: true, doorOpen: false }, "SYSTEM LOCKOUT TRIGGERED: Unusual environmental condition detected by sensors.", "error");
  } else if (!next.isLatched && next.codeState === "wrong") {
    next = addLog({ ...next, isLatched: true, doorOpen: false }, "SYSTEM LOCKOUT TRIGGERED: Incorrect 4-bit code entered.", "error");
  } else if (!next.isLatched && next.tamperDetected) {
    next = addLog({ ...next, isLatched: true, doorOpen: false }, "SYSTEM LOCKOUT TRIGGERED: Physical tamper detected on system casing.", "error");
  }

  const isSafeToOpen = next.physicalKey && next.delayStatus === "ok" && !next.tamperDetected && !next.isLatched;

  if (isSafeToOpen && !prev.doorOpen) {
    next = addLog({ ...next, doorOpen: true }, "ALL SIGNALS GREEN. AND Gate authorized door strike. Door opened.", "success");
  } else if (!isSafeToOpen && prev.doorOpen) {
    next = addLog({ ...next, doorOpen: false }, "Authorization signal lost. Solenoid relay dropped. Door closed.", "warn");
  }

  return next;
};

const reducer = (state: SystemState, action: Action): SystemState => {
  switch (action.type) {
    case "SET_SENSORS":
      return applyHardwareRules(state, { ...state, sensors: action.sensors });
    case "SET_KEY":
      return applyHardwareRules(state, { ...state, physicalKey: action.physicalKey });
    case "SET_CODE": {
      const delayStatus = action.codeState === "correct" ? "waiting" : "idle";
      const base = applyHardwareRules(state, { ...state, codeState: action.codeState, delayStatus });
      if (action.codeState === "correct") return addLog(base, "Correct code entered. Initializing 5-second security delay...", "warn");
      return base;
    }
    case "SET_TAMPER":
      return applyHardwareRules(state, { ...state, tamperDetected: action.tamperDetected });
    case "SET_DELAY":
      return applyHardwareRules(state, { ...state, delayStatus: action.delayStatus });
    case "SET_LATCH":
      return applyHardwareRules(state, { ...state, isLatched: action.isLatched });
    case "RESET_BASE":
      return applyHardwareRules(state, {
        ...state,
        sensors: { magnetic: true, temp: true, pressure: true, laser: true },
        physicalKey: false,
        codeState: "idle",
        tamperDetected: false,
        delayStatus: "idle",
        isLatched: false,
        doorOpen: false,
      });
    case "ADD_LOG":
      return addLog(state, action.msg, action.level ?? "info");
    default:
      return state;
  }
};

const makeVPath = (sx: number, sy: number, ex: number, ey: number): string =>
  `M ${sx} ${sy} C ${sx} ${(sy + ey) / 2}, ${ex} ${(sy + ey) / 2}, ${ex} ${ey}`;

const makeHPath = (sx: number, sy: number, ex: number, ey: number): string =>
  `M ${sx} ${sy} C ${(sx + ex) / 2} ${sy}, ${(sx + ex) / 2} ${ey}, ${ex} ${ey}`;

const getColorHex = (c: PathColor): string => {
  switch (c) {
    case "green":
      return "#22c55e";
    case "red":
      return "#ef4444";
    case "orange":
      return "#f59e0b";
    case "gold":
      return "#ffc300";
    default:
      return "#778da9";
  }
};

const DiagramNode = ({ pos, children }: DiagramNodeProps) => (
  <div className="absolute z-10 -translate-x-1/2 -translate-y-1/2 transform" style={{ left: `${pos[0]}px`, top: `${pos[1]}px` }}>
    {children}
  </div>
);

const StatusDiamond = ({ title, status, icon: Icon, pulsing, onClick, hint }: StatusDiamondProps) => {
  const baseColor =
    status === "ok"
      ? "border-green-500 text-green-400"
      : status === "error"
        ? "border-red-500 text-red-400"
        : status === "warn"
          ? "border-orange-500 text-orange-300"
          : "border-white/20 text-[#778da9] bg-[#1b263b]";

  return (
    <div className={`group flex flex-col items-center ${onClick ? "cursor-pointer" : ""}`} onClick={onClick}>
      <div className={`h-16 w-16 rotate-45 border-2 bg-[#0d1b2a] transition-all duration-300 ${onClick ? "hover:scale-105" : ""} ${baseColor} ${pulsing ? "animate-pulse" : ""} flex items-center justify-center`}>
        <div className="-rotate-45 flex flex-col items-center">
          <Icon size={20} />
        </div>
      </div>
      <span className="mt-4 w-24 text-center font-mono text-xs text-[#e0e1dd]">{title}</span>
      {hint ? <span className="absolute -bottom-4 text-[9px] text-[#ffd60a] opacity-0 group-hover:opacity-100">{hint}</span> : null}
    </div>
  );
};

const USMHACSPanel = () => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const [isMuted, setIsMuted] = useState(false);
  const scenarioTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const delayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lockoutRepeatTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const previousLatchedRef = useRef(false);
  const previousDoorOpenRef = useRef(false);

  const sensorsOk = Object.values(state.sensors).every((v) => v);

  useEffect(() => {
    if (delayTimerRef.current) {
      clearTimeout(delayTimerRef.current);
      delayTimerRef.current = null;
    }

    if (state.codeState === "correct") {
      delayTimerRef.current = setTimeout(() => {
        dispatch({ type: "SET_DELAY", delayStatus: "ok" });
        dispatch({ type: "ADD_LOG", msg: "Delay block cleared. Signal passed.", level: "success" });
      }, 5000);
    }

    return () => {
      if (delayTimerRef.current) {
        clearTimeout(delayTimerRef.current);
        delayTimerRef.current = null;
      }
    };
  }, [state.codeState]);

  useEffect(() => {
    return () => {
      if (scenarioTimerRef.current) clearTimeout(scenarioTimerRef.current);
      if (delayTimerRef.current) clearTimeout(delayTimerRef.current);
      if (lockoutRepeatTimerRef.current) {
        clearInterval(lockoutRepeatTimerRef.current);
        lockoutRepeatTimerRef.current = null;
      }
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        void audioContextRef.current.close();
      }
    };
  }, []);

  const ensureAudioContext = (): AudioContext | null => {
    if (typeof window === "undefined") {
      return null;
    }

    if (!audioContextRef.current || audioContextRef.current.state === "closed") {
      audioContextRef.current = new window.AudioContext();
    }

    if (audioContextRef.current.state === "suspended") {
      void audioContextRef.current.resume();
    }

    return audioContextRef.current;
  };

  const stopContinuousAlarm = (): void => {
    if (lockoutRepeatTimerRef.current) {
      clearInterval(lockoutRepeatTimerRef.current);
      lockoutRepeatTimerRef.current = null;
    }
  };

  const startContinuousAlarm = (): void => {
    if (isMuted || lockoutRepeatTimerRef.current) {
      return;
    }

    playLockoutBurst();
    lockoutRepeatTimerRef.current = setInterval(() => {
      playLockoutBurst();
    }, 1300);
  };

  const playLockoutBurst = (): void => {
    if (isMuted) {
      return;
    }

    const context = ensureAudioContext();
    if (!context) {
      return;
    }

    const startTime = context.currentTime;
    const pulseOffsets = [0, 0.16, 0.32];

    pulseOffsets.forEach((offset) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();

      oscillator.type = "square";
      oscillator.frequency.setValueAtTime(960, startTime + offset);

      gain.gain.setValueAtTime(0.0001, startTime + offset);
      gain.gain.exponentialRampToValueAtTime(0.14, startTime + offset + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + offset + 0.13);

      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(startTime + offset);
      oscillator.stop(startTime + offset + 0.13);
    });
  };

  const playSuccessChime = (): void => {
    if (isMuted) {
      return;
    }

    const context = ensureAudioContext();
    if (!context) {
      return;
    }

    const startTime = context.currentTime;
    const notes = [523.25, 659.25, 783.99];

    notes.forEach((freq, index) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      const offset = index * 0.09;

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(freq, startTime + offset);

      gain.gain.setValueAtTime(0.0001, startTime + offset);
      gain.gain.exponentialRampToValueAtTime(0.08, startTime + offset + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + offset + 0.2);

      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(startTime + offset);
      oscillator.stop(startTime + offset + 0.21);
    });
  };

  useEffect(() => {
    const enteredLockout = state.isLatched && !previousLatchedRef.current;
    previousLatchedRef.current = state.isLatched;

    if (enteredLockout) {
      try {
        playLockoutBurst();
      } catch {
        // Ignore audio failures (autoplay permissions or unavailable audio context).
      }
    }

    if (state.isLatched && !isMuted) {
      startContinuousAlarm();
    } else {
      stopContinuousAlarm();
    }
  }, [state.isLatched, isMuted]);

  useEffect(() => {
    const openedNow = state.doorOpen && !previousDoorOpenRef.current;
    previousDoorOpenRef.current = state.doorOpen;

    if (!openedNow || state.isLatched) {
      return;
    }

    try {
      playSuccessChime();
    } catch {
      // Ignore audio failures (autoplay permissions or unavailable audio context).
    }
  }, [state.doorOpen, state.isLatched, isMuted]);

  const handleReset = (): void => {
    dispatch({ type: "ADD_LOG", msg: "Attempting Protected Reset Logic...", level: "info" });

    if (!sensorsOk || state.codeState === "wrong" || state.tamperDetected) {
      const reasons: string[] = [];
      if (!sensorsOk) reasons.push("Sensors faulty");
      if (state.codeState === "wrong") reasons.push("Wrong code active");
      if (state.tamperDetected) reasons.push("Tamper active");
      dispatch({ type: "ADD_LOG", msg: `Reset FAILED! Unsafe conditions remain: ${reasons.join(", ")}.`, level: "error" });
      return;
    }

    dispatch({ type: "SET_LATCH", isLatched: false });
    dispatch({ type: "ADD_LOG", msg: "System successfully reset and normalized.", level: "success" });
  };

  const runScenario = (type: ScenarioType): void => {
    dispatch({ type: "RESET_BASE" });

    if (scenarioTimerRef.current) {
      clearTimeout(scenarioTimerRef.current);
      scenarioTimerRef.current = null;
    }

    scenarioTimerRef.current = setTimeout(() => {
      if (type === "perfect") {
        dispatch({ type: "ADD_LOG", msg: "--- STARTING SCENARIO: PERFECT ENTRY ---", level: "info" });
        dispatch({ type: "SET_KEY", physicalKey: true });
        setTimeout(() => dispatch({ type: "SET_CODE", codeState: "correct" }), 1000);
      }

      if (type === "brute") {
        dispatch({ type: "ADD_LOG", msg: "--- STARTING SCENARIO: BRUTE FORCE ---", level: "info" });
        dispatch({ type: "SET_KEY", physicalKey: true });
        setTimeout(() => dispatch({ type: "SET_CODE", codeState: "wrong" }), 1000);
      }

      if (type === "breach") {
        dispatch({ type: "ADD_LOG", msg: "--- STARTING SCENARIO: ENV BREACH ---", level: "info" });
        setTimeout(
          () =>
            dispatch({
              type: "SET_SENSORS",
              sensors: { ...state.sensors, temp: false },
            }),
          1000,
        );
      }
    }, 200);
  };

  const handleSensorToggle = (): void => {
    const allSafe = Object.values(state.sensors).every((v) => v);
    dispatch({
      type: "SET_SENSORS",
      sensors: { magnetic: !allSafe, temp: !allSafe, pressure: !allSafe, laser: !allSafe },
    });
  };

  const handleCodeToggle = (): void => {
    if (state.codeState === "idle") dispatch({ type: "SET_CODE", codeState: "correct" });
    else if (state.codeState === "correct") dispatch({ type: "SET_CODE", codeState: "wrong" });
    else dispatch({ type: "SET_CODE", codeState: "idle" });
  };

  const paths: PathDef[] = [
    { id: "env-sens", d: makeHPath(POS.env[0] + 70, POS.env[1], POS.sens[0] - 45, POS.sens[1]), color: "slate", active: true },
    { id: "sens-latch", d: makeVPath(POS.sens[0], POS.sens[1] + 30, POS.latch[0], POS.latch[1] - 40), color: "red", active: !sensorsOk },
    { id: "code-latch", d: makeVPath(POS.code[0], POS.code[1] + 30, POS.latch[0], POS.latch[1] - 40), color: "red", active: state.codeState === "wrong" },
    { id: "tamper-latch", d: makeVPath(POS.tamper[0] - 10, POS.tamper[1] + 30, POS.latch[0] + 80, POS.latch[1] - 40), color: "red", active: state.tamperDetected },
    { id: "key-and", d: makeVPath(POS.key[0], POS.key[1] + 30, POS.and[0] - 30, POS.and[1] - 55), color: "green", active: state.physicalKey },
    { id: "code-delay", d: makeHPath(POS.code[0] + DIAMOND_EDGE_X, POS.code[1], POS.delay[0] - DIAMOND_EDGE_X, POS.delay[1]), color: "orange", active: state.codeState === "correct" },
    { id: "delay-and", d: makeVPath(POS.delay[0], POS.delay[1] + 30, POS.and[0] + 10, POS.and[1] - 55), color: "green", active: state.delayStatus === "ok" },
    { id: "tamper-and", d: makeVPath(POS.tamper[0] + 10, POS.tamper[1] + 30, POS.and[0] + 30, POS.and[1] - 55), color: "green", active: !state.tamperDetected },
    { id: "latch-and", d: makeHPath(POS.latch[0] + 112, POS.latch[1], POS.and[0] - 48, POS.and[1]), color: "green", active: !state.isLatched },
    { id: "reset-latch", d: makeHPath(POS.reset[0] + 80, POS.reset[1], POS.latch[0] - 112, POS.latch[1]), color: "gold", active: true, dash: true },
    { id: "and-solenoid", d: makeHPath(POS.and[0] + 50, POS.and[1], POS.solenoid[0] - 50, POS.solenoid[1]), color: "green", active: state.doorOpen },
    { id: "solenoid-door", d: makeHPath(POS.solenoid[0] + 50, POS.solenoid[1], POS.door[0] - 40, POS.door[1]), color: "green", active: state.doorOpen },
  ];

  const labels: LabelDef[] = [];

  return (
    <div className="w-full bg-transparent p-4 font-sans text-[#e0e1dd] flex flex-col items-center">
      <style>{`
        @keyframes flow { from { stroke-dashoffset: 24; } to { stroke-dashoffset: 0; } }
        .path-active { animation: flow 0.8s linear infinite; }
      `}</style>

      <div className="w-full max-w-7xl flex flex-wrap justify-between items-center mb-4 gap-4">
        <h1 className="text-xl font-bold text-[#e0e1dd] font-mono">USMHACS HARDWARE SECURITY DIAGRAM</h1>
        <div className="flex gap-2">
          <button onClick={() => runScenario("perfect")} className="btn-spectrum group flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-green-400">
            <span className="btn-spectrum-layer" />
            <span className="btn-spectrum-text flex items-center gap-2"><Shield size={14} /> Perfect Entry</span>
          </button>
          <button onClick={() => runScenario("brute")} className="btn-spectrum group flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-red-400">
            <span className="btn-spectrum-layer" />
            <span className="btn-spectrum-text flex items-center gap-2"><ShieldAlert size={14} /> Brute Force</span>
          </button>
          <button onClick={() => runScenario("breach")} className="btn-spectrum group flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-orange-300">
            <span className="btn-spectrum-layer" />
            <span className="btn-spectrum-text flex items-center gap-2"><Activity size={14} /> Env Breach</span>
          </button>
          <button
            onClick={() => {
              ensureAudioContext();
              setIsMuted((prev) => {
                const next = !prev;
                if (next) {
                  stopContinuousAlarm();
                } else if (state.isLatched) {
                  startContinuousAlarm();
                }
                return next;
              });
            }}
            className={`btn-spectrum group flex items-center gap-2 px-3 py-1.5 text-xs font-medium ${isMuted ? "text-[#778da9]" : "text-[#4cc9f0]"}`}
          >
            <span className="btn-spectrum-layer" />
            <span className="btn-spectrum-text">{isMuted ? "Sound: OFF" : "Sound: ON"}</span>
          </button>
        </div>
      </div>

      <div className="w-full max-w-7xl overflow-x-auto rounded-xl border border-white/5 bg-linear-to-br from-[#0d1b2a] to-[#1b263b] shadow-[0_10px_26px_rgba(13,27,42,0.28)] custom-scrollbar">
        <div className="relative w-260 h-140 mx-auto">
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 1040 560">
            {paths.map((p) => (
              <path
                key={p.id}
                d={p.d}
                fill="none"
                stroke={getColorHex(p.color)}
                strokeWidth={p.active ? "4" : "2"}
                strokeDasharray={p.active || p.dash ? "12 12" : "none"}
                className={`transition-all duration-300 ${p.active ? "path-active opacity-100" : "opacity-20"}`}
              />
            ))}
          </svg>

          {labels.map((lbl, i) => (
            <div key={i} className={`absolute text-[10px] font-mono font-bold whitespace-nowrap bg-[#1b263b]/80 px-1.5 py-0.5 rounded transform -translate-x-1/2 -translate-y-1/2 z-0 ${lbl.color}`} style={{ left: `${lbl.x}px`, top: `${lbl.y}px` }}>
              {lbl.text}
            </div>
          ))}

          <DiagramNode pos={POS.env}>
            <div className="w-35 rounded border border-white/10 bg-[#1b263b] p-3">
              <h3 className="mb-2 text-center text-[10px] font-bold text-[#e0e1dd]">MONITORED ENV.</h3>
              <div className="space-y-1">
                {Object.entries(state.sensors).map(([k, safe]) => (
                  <div key={k} className="flex justify-between border-b border-white/10 pb-0.5 text-[9px]">
                    <span className="capitalize">{k}</span>
                    <span className={safe ? "text-green-400" : "text-red-400"}>{safe ? "SAFE" : "FAULT"}</span>
                  </div>
                ))}
              </div>
            </div>
          </DiagramNode>

          <DiagramNode pos={POS.sens}>
            <StatusDiamond title="Sensors" icon={Activity} status={sensorsOk ? "ok" : "error"} onClick={handleSensorToggle} hint="Click: Toggle" />
          </DiagramNode>

          <DiagramNode pos={POS.key}>
            <StatusDiamond title="Physical Key" icon={Key} status={state.physicalKey ? "ok" : "idle"} onClick={() => dispatch({ type: "SET_KEY", physicalKey: !state.physicalKey })} hint="Click: Toggle" />
          </DiagramNode>

          <DiagramNode pos={POS.code}>
            <StatusDiamond title={`4-Bit Code (${state.codeState})`} icon={Fingerprint} status={state.codeState === "correct" ? "ok" : state.codeState === "wrong" ? "error" : "idle"} onClick={handleCodeToggle} hint="Click: Cycle" />
          </DiagramNode>

          <DiagramNode pos={POS.delay}>
            <StatusDiamond title="Delay Block" icon={Clock} status={state.delayStatus === "ok" ? "ok" : state.delayStatus === "waiting" ? "warn" : "idle"} pulsing={state.delayStatus === "waiting"} />
          </DiagramNode>

          <DiagramNode pos={POS.tamper}>
            <StatusDiamond title="Tamper Det." icon={ShieldAlert} status={state.tamperDetected ? "error" : "ok"} onClick={() => dispatch({ type: "SET_TAMPER", tamperDetected: !state.tamperDetected })} hint="Click: Toggle" />
          </DiagramNode>

          <DiagramNode pos={POS.reset}>
            <button onClick={handleReset} className="btn-spectrum group w-40 border-dashed px-4 py-3 text-xs font-mono font-semibold text-[#ffd60a] active:scale-95">
              <span className="btn-spectrum-layer" />
              <span className="btn-spectrum-text">PROTECTED RESET</span>
            </button>
          </DiagramNode>

          <DiagramNode pos={POS.latch}>
            <div className={`w-56 rounded-lg border p-5 text-center transition-all ${state.isLatched ? "bg-red-950/35 border-red-500" : "bg-[#1b263b] border-white/15"}`}>
              <h4 className={`mb-1 text-sm font-bold font-mono ${state.isLatched ? "text-red-400" : "text-[#778da9]"}`}>System Lockout</h4>
              <p className="mb-2 text-[10px] text-[#778da9]">Buzzer</p>
              {state.isLatched ? <div className="absolute top-3 right-3 h-3 w-3 animate-ping rounded-full bg-red-500"></div> : null}
            </div>
          </DiagramNode>

          <DiagramNode pos={POS.and}>
            <div className={`flex h-28 w-24 flex-col items-center justify-center rounded-l-lg rounded-r-[40px] border-2 transition-all ${state.doorOpen ? "bg-green-900/30 border-green-500" : "bg-[#1b263b] border-white/15"}`}>
              <Cpu size={32} className={state.doorOpen ? "text-green-400" : "text-[#778da9]"} />
              <span className="mt-2 text-sm font-mono font-bold text-[#e0e1dd]">AND</span>
            </div>
          </DiagramNode>

          <DiagramNode pos={POS.solenoid}>
            <div className="w-25 rounded-lg border border-white/15 bg-[#1b263b] p-3 text-center">
              <span className="block text-xs font-mono text-[#e0e1dd]">solenoid</span>
              <span className="block text-xs font-mono text-[#e0e1dd]">relay lock</span>
            </div>
          </DiagramNode>

          <DiagramNode pos={POS.door}>
            <div className={`h-32 w-20 rounded-lg border-2 p-4 flex flex-col items-center justify-center transition-all ${state.doorOpen ? "border-green-500 bg-green-900/20 text-green-400" : "border-white/15 bg-[#1b263b] text-[#778da9]"}`}>
              {state.doorOpen ? <DoorOpen size={36} /> : <DoorClosed size={36} />}
              <span className="text-xs font-bold mt-2">{state.doorOpen ? "OPEN" : "DOOR"}</span>
            </div>
          </DiagramNode>
        </div>
      </div>

      <div className="mt-5 w-full max-w-7xl rounded-xl border border-white/5 bg-linear-to-br from-[#0d1b2a] to-[#1b263b] p-4">
        <h3 className="mb-2 font-mono text-[0.9rem] font-semibold uppercase tracking-[0.12em] text-[#778da9]">System Console Log</h3>
        <div className="space-y-1 h-32 overflow-y-auto pr-2 font-mono text-[0.9rem] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {state.logs.map((log, i) => (
            <div key={`${log.time}-${i}`} className={`p-1.5 rounded border-l-2 ${
              log.type === "error"
                ? "bg-red-950/30 border-red-500 text-red-300"
                : log.type === "success"
                  ? "bg-green-950/30 border-green-500 text-green-300"
                  : log.type === "warn"
                    ? "bg-orange-950/30 border-orange-500 text-orange-300"
                    : "bg-[#415a77]/25 border-[#ffc300] text-[#e0e1dd]"
            }`}>
              <span className="mr-2 opacity-55 text-[#8ea0b4]">[{log.time}]</span>
              {log.msg}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 grid w-full max-w-7xl gap-4 lg:grid-cols-2">
        <article className="rounded-xl border border-white/5 bg-linear-to-br from-[#0d1b2a] to-[#1b263b] p-4">
          <p className="font-mono text-[0.9rem] font-semibold uppercase tracking-[0.12em] text-[#4cc9f0]">Logic Execution Flow</p>
          <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[0.9rem] font-semibold">
            <span className="rounded-md border border-[#4cc9f0]/40 bg-[#4cc9f0]/12 px-2 py-0.5 text-[#00d4ff]">Sensors</span>
            <span className="text-[#778da9]">-&gt;</span>
            <span className="rounded-md border border-[#ffd60a]/40 bg-[#ffd60a]/12 px-2 py-0.5 text-[#ffd60a]">Key</span>
            <span className="text-[#778da9]">-&gt;</span>
            <span className="rounded-md border border-[#4cc9f0]/40 bg-[#4cc9f0]/12 px-2 py-0.5 text-[#00d4ff]">Code</span>
            <span className="text-[#778da9]">-&gt;</span>
            <span className="rounded-md border border-[#ff6b35]/40 bg-[#ff6b35]/12 px-2 py-0.5 text-[#ff6b35]">Delay</span>
            <span className="text-[#778da9]">-&gt;</span>
            <span className="rounded-md border border-[#ef4444]/40 bg-[#ef4444]/12 px-2 py-0.5 text-[#ef4444]">Tamper</span>
            <span className="text-[#778da9]">-&gt;</span>
            <span className="rounded-md border border-[#ffd60a]/40 bg-[#ffd60a]/12 px-2 py-0.5 text-[#ffd60a]">AND</span>
            <span className="text-[#778da9]">-&gt;</span>
            <span className="rounded-md border border-[#22c55e]/40 bg-[#22c55e]/12 px-2 py-0.5 text-[#22c55e]">Unlock</span>
          </div>
          <p className="mt-2 text-[0.95rem] font-normal text-[#b8c5d6]">
            Access is granted only when every gate reports a valid hardware condition.
          </p>
        </article>

        <article className="rounded-xl border border-white/5 bg-linear-to-br from-[#0d1b2a] to-[#1b263b] p-4">
          <p className="font-mono text-[0.9rem] font-semibold uppercase tracking-[0.12em] text-[#ef4444]">Attack Handling</p>
          <ul className="mt-2 space-y-1 text-[0.95rem] font-normal text-[#b8c5d6]">
            <li>Brute force attempt -&gt; lockout latch triggered.</li>
            <li>Environment breach -&gt; tamper latch preserved until safe reset.</li>
            <li>Wrong code sequence -&gt; authentication rejected and path blocked.</li>
          </ul>
        </article>

        <article className="rounded-xl border border-white/5 bg-linear-to-br from-[#0d1b2a] to-[#1b263b] p-4">
          <p className="font-mono text-[0.9rem] font-semibold uppercase tracking-[0.12em] text-[#ffd60a]">Engineering Decisions</p>
          <ul className="mt-2 space-y-1 text-[0.95rem] font-normal text-[#b8c5d6]">
            <li className="text-[#d0d8e4]"><span className="text-[#ffd60a] font-semibold">No MCU</span> -&gt; eliminates software attack surface</li>
            <li>SR latch -&gt; persistent tamper memory.</li>
            <li>Delay block -&gt; prevents rapid retry abuse.</li>
            <li><span className="text-[#00d4ff]">Decoder/logic path</span> -&gt; deterministic access behavior.</li>
          </ul>
        </article>

        <article className="rounded-xl border border-white/5 bg-linear-to-br from-[#0d1b2a] to-[#1b263b] p-4">
          <p className="font-mono text-[0.9rem] font-semibold uppercase tracking-[0.12em] text-[#4cc9f0]">Security Philosophy</p>
          <p className="mt-2 text-[0.95rem] font-normal text-[#b8c5d6]">
            Hardware-enforced deterministic security eliminates software vulnerabilities and ensures predictable
            system behavior.
          </p>
        </article>
      </div>
    </div>
  );
};

export default USMHACSPanel;
