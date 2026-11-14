import type { HardwareState } from "@/lib/models/usmhacs";
import { sensorsSafe } from "@/lib/models/usmhacs";
export default function Circuit({ state }: { state: HardwareState }) {
  const nodes = [
    {
      x: 85,
      y: 80,
      label: "SENSORS",
      value: sensorsSafe(state) ? "SAFE" : "BREACH",
      active: sensorsSafe(state),
      fault: !sensorsSafe(state),
    },
    {
      x: 280,
      y: 80,
      label: "KEY",
      value: state.physicalKey ? "PRESENT" : "ABSENT",
      active: state.physicalKey,
    },
    {
      x: 475,
      y: 80,
      label: "CODE",
      value: state.codeState.toUpperCase(),
      active: state.codeState === "correct",
      fault: state.codeState === "wrong",
    },
    {
      x: 670,
      y: 80,
      label: "DELAY",
      value: state.delayStatus.toUpperCase(),
      active: state.delayStatus === "ok",
    },
    {
      x: 865,
      y: 80,
      label: "TAMPER",
      value: state.tamperDetected ? "DETECTED" : "CLEAR",
      active: !state.tamperDetected,
      fault: state.tamperDetected,
    },
    {
      x: 280,
      y: 280,
      label: "LATCH",
      value: state.isLatched ? "SET" : "CLEAR",
      active: !state.isLatched,
      fault: state.isLatched,
    },
    {
      x: 575,
      y: 280,
      label: "INTERLOCK",
      value: state.doorOpen ? "ALLOW" : "HOLD",
      active: state.doorOpen,
    },
    {
      x: 865,
      y: 280,
      label: "DOOR",
      value: state.doorOpen ? "OPEN" : "CLOSED",
      active: state.doorOpen,
    },
  ];
  const paths = [
    { d: "M85 112V280H240", active: !sensorsSafe(state), fault: true },
    {
      d: "M475 112V190H280V240",
      active: state.codeState === "wrong",
      fault: true,
    },
    { d: "M865 112V205H320V240", active: state.tamperDetected, fault: true },
    { d: "M280 112V155H530V265", active: state.physicalKey },
    { d: "M515 80H630", active: state.codeState === "correct" },
    { d: "M670 112V175H600V240", active: state.delayStatus === "ok" },
    { d: "M320 280H535", active: !state.isLatched },
    { d: "M615 280H825", active: state.doorOpen },
  ];
  return (
    <div className="circuit-diagram">
      <svg
        viewBox="0 0 950 360"
        role="img"
        aria-label={`Circuit: sensors ${sensorsSafe(state) ? "safe" : "unsafe"}, latch ${state.isLatched ? "set" : "clear"}, door ${state.doorOpen ? "open" : "closed"}. Operate inputs using the controls below.`}
      >
        <defs>
          <pattern
            id="circuitDots"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <circle r=".7" cx="1" cy="1" fill="#3a393c" />
          </pattern>
        </defs>
        <rect width="950" height="360" fill="url(#circuitDots)" />
        <g fill="none" strokeWidth="1.5">
          {paths.map((p, i) => (
            <path
              key={`${i}-${state.eventId}`}
              d={p.d}
              stroke={
                p.active
                  ? p.fault
                    ? "var(--fault)"
                    : "var(--signal)"
                  : "#353438"
              }
              className={p.active ? "signal-path" : ""}
            />
          ))}
        </g>
        {nodes.map((n) => (
          <g key={n.label}>
            <rect
              x={n.x - 40}
              y={n.y - 30}
              width="80"
              height="60"
              rx="3"
              fill="#111114"
              stroke={
                n.fault
                  ? "var(--fault)"
                  : n.active
                    ? "var(--signal)"
                    : "#555257"
              }
            />
            <text
              x={n.x}
              y={n.y - 3}
              textAnchor="middle"
              fill={
                n.fault
                  ? "var(--fault)"
                  : n.active
                    ? "var(--text)"
                    : "var(--muted)"
              }
              fontSize="11"
            >
              {n.label}
            </text>
            <text
              x={n.x}
              y={n.y + 16}
              textAnchor="middle"
              fill={
                n.fault
                  ? "var(--fault)"
                  : n.active
                    ? "var(--signal)"
                    : "var(--muted)"
              }
              fontSize="9"
            >
              {n.value}
            </text>
          </g>
        ))}
        <text x="80" y="344" fill="var(--muted)" fontSize="10">
          STATE-DRIVEN LOGIC DIAGRAM · SCHEMATIC REPRESENTATION
        </text>
      </svg>
    </div>
  );
}
