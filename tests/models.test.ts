import test from "node:test";
import assert from "node:assert/strict";
import {
  hardwareReducer as reduce,
  initialHardware,
  type HardwareAction,
  type HardwareState,
} from "../lib/models/usmhacs";
import {
  createScenarioScheduler,
  type Clock,
} from "../lib/schedulers/scenarios";
import {
  runPipeline,
  withDanglingReference,
  GOLDEN_TRACE,
} from "../lib/rangraph";
import { introFrame, INTRO_DURATION } from "../lib/models/intro";
const fresh = (): HardwareState => structuredClone(initialHardware);
test("door requires key and completed delay; removing key closes it", () => {
  let s = fresh();
  s = reduce(s, { type: "key", value: true });
  assert.equal(s.doorOpen, false);
  s = reduce(s, { type: "code", value: "correct" });
  assert.equal(s.delayStatus, "waiting");
  assert.equal(s.doorOpen, false);
  s = reduce(s, { type: "delay", token: s.delayToken });
  assert.equal(s.doorOpen, true);
  s = reduce(s, { type: "key", value: false });
  assert.equal(s.doorOpen, false);
});
for (const action of [
  { type: "sensor", sensor: "laser", safe: false },
  { type: "code", value: "wrong" },
  { type: "tamper", value: true },
] as HardwareAction[])
  test(`fault latches and unsafe reset fails: ${action.type}`, () => {
    let s = reduce(fresh(), action);
    assert.equal(s.isLatched, true);
    s = reduce(s, { type: "reset" });
    assert.equal(s.isLatched, true);
    assert.match(s.logs[0].message, /refused/);
  });
test("clearing tamper retains latch until protected reset", () => {
  let s = reduce(fresh(), { type: "tamper", value: true });
  s = reduce(s, { type: "tamper", value: false });
  assert.equal(s.isLatched, true);
  s = reduce(s, { type: "reset" });
  assert.equal(s.isLatched, false);
});
test("stale delay cannot unlock a reset or changed code", () => {
  let s = reduce(fresh(), { type: "code", value: "correct" });
  const token = s.delayToken;
  s = reduce(s, { type: "clear" });
  s = reduce(s, { type: "key", value: true });
  s = reduce(s, { type: "delay", token });
  assert.equal(s.doorOpen, false);
  assert.equal(s.delayStatus, "idle");
});
function fakeClock() {
  let now = 0,
    id = 0;
  const jobs = new Map<number, { at: number; fn: () => void }>();
  const clock: Clock = {
    set: (fn, ms) => {
      const k = ++id;
      jobs.set(k, { at: now + ms, fn });
      return k;
    },
    clear: (k) => {
      jobs.delete(k as number);
    },
  };
  return {
    clock,
    advance: (until: number) => {
      while (true) {
        const job = [...jobs]
          .filter(([, j]) => j.at <= until)
          .sort((a, b) => a[1].at - b[1].at)[0];
        if (!job) break;
        now = job[1].at;
        jobs.delete(job[0]);
        job[1].fn();
      }
      now = until;
    },
    jobs,
  };
}
test("switching Brute Force to Perfect Entry cancels every old action", () => {
  const c = fakeClock();
  let state = fresh();
  const scheduler = createScenarioScheduler((a) => {
    state = reduce(state, a);
  }, c.clock);
  scheduler.run("brute");
  c.advance(500);
  scheduler.run("perfect");
  c.advance(1200);
  assert.equal(state.isLatched, false);
  assert.equal(state.codeState, "idle");
  c.advance(1700);
  assert.equal(state.codeState, "correct");
  assert.equal(state.isLatched, false);
  assert.equal(c.jobs.size, 0);
});
test("cancel/unmount prevents pending scenario actions", () => {
  const c = fakeClock();
  let state = fresh();
  const scheduler = createScenarioScheduler((a) => {
    state = reduce(state, a);
  }, c.clock);
  scheduler.run("breach");
  scheduler.cancel();
  c.advance(5000);
  assert.equal(state.sensors.temp, true);
  assert.equal(c.jobs.size, 0);
});
test("golden fixture derives graph, conversion and one handover", () => {
  const run = runPipeline();
  assert.equal(run.errorFree, true);
  assert.equal(run.sequence.graphs.length, 2);
  assert.equal(run.sequence.graphs[0].nodes.length, 5);
  assert.equal(run.sequence.handoverEvents.length, 1);
  const ue = run.entities.find((n) => n.id === "ue-1" && n.timestamp === 1)!;
  assert.equal(ue.attributes.sinr, 20);
  assert.equal(
    run.sequence.graphs[0].edges.some((e) => e.type === "interference"),
    false,
  );
});
test("fault is injected at source and produces validation errors without mutating fixture", () => {
  const before = JSON.stringify(GOLDEN_TRACE);
  const run = runPipeline(withDanglingReference());
  assert.equal(run.errorFree, false);
  assert.ok(run.report.findings.some((f) => f.severity === "error"));
  assert.equal(JSON.stringify(GOLDEN_TRACE), before);
});
test("intro covers upward and downward mesh range and terminates", () => {
  assert.equal(introFrame(1150).scan, 0);
  assert.equal(introFrame(2650).scan, 1);
  assert.equal(introFrame(4150).scan, 0);
  assert.equal(introFrame(1900).scan, 0.5);
  assert.equal(introFrame(3400).scan, 0.5);
  assert.equal(introFrame(INTRO_DURATION).done, true);
  assert.equal(introFrame(INTRO_DURATION).dissolve, 1);
});
