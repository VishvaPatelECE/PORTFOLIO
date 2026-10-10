import type { HardwareAction } from "../models/usmhacs";
export type Scenario = "perfect" | "brute" | "breach";
export interface Clock {
  set: (fn: () => void, ms: number) => unknown;
  clear: (handle: unknown) => void;
}
const browserClock: Clock = {
  set: (fn, ms) => setTimeout(fn, ms),
  clear: (handle) => clearTimeout(handle as ReturnType<typeof setTimeout>),
};
export function createScenarioScheduler(
  dispatch: (action: HardwareAction) => void,
  clock: Clock = browserClock,
) {
  let generation = 0;
  const timers = new Set<unknown>();
  const cancel = () => {
    generation++;
    timers.forEach((t) => clock.clear(t));
    timers.clear();
  };
  const run = (scenario: Scenario) => {
    cancel();
    const current = generation;
    dispatch({ type: "clear" });
    dispatch({
      type: "log",
      message: `Scenario: ${scenario === "perfect" ? "Perfect entry" : scenario === "brute" ? "Wrong-code lockout" : "Environment breach"}.`,
    });
    const actions: { after: number; action: HardwareAction }[] =
      scenario === "breach"
        ? [
            {
              after: 1200,
              action: { type: "sensor", sensor: "temp", safe: false },
            },
          ]
        : [
            { after: 200, action: { type: "key", value: true } },
            {
              after: 1200,
              action: {
                type: "code",
                value: scenario === "perfect" ? "correct" : "wrong",
              },
            },
          ];
    for (const { after, action } of actions) {
      const handle = clock.set(() => {
        timers.delete(handle);
        if (generation === current) dispatch(action);
      }, after);
      timers.add(handle);
    }
  };
  return { run, cancel };
}
