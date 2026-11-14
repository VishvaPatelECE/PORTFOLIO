export const INTRO_DURATION = 6900;
const clamp01 = (value: number) => Math.max(0, Math.min(1, value));
const smooth = (value: number) => value * value * value * (value * (value * 6 - 15) + 10);
/** The subject waits visibly until the visitor deliberately starts scanning. */
export function scanFrame(elapsedMs: number | null) {
  if (elapsedMs === null) return { phase: "ready", scan: 0, reveal: 1, dissolve: 0, morph: 0, opening: 0, done: false };
  return {
    ...introFrame(elapsedMs), reveal: 1,
    morph: smooth(clamp01((elapsedMs - 4900) / 1600)),
    opening: smooth(clamp01((elapsedMs - 5350) / 1300)),
  };
}
export function introFrame(ms: number) {
  const phase =
    ms < 650
      ? "initializing"
      : ms < 1150
        ? "detected"
        : ms < 2650
          ? "up"
          : ms < 4150
            ? "down"
            : ms < 4900
              ? "verified"
              : "dissolve";
  const scan =
    ms < 1150
      ? 0
      : ms < 2650
        ? (ms - 1150) / 1500
        : ms < 4150
          ? 1 - (ms - 2650) / 1500
          : 0;
  return {
    phase,
    scan,
    reveal: Math.min(1, ms / 700),
    dissolve: Math.max(0, Math.min(1, (ms - 4900) / 1100)),
    done: ms >= INTRO_DURATION,
  };
}
