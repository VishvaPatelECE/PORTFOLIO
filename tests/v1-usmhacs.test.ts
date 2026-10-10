import test from "node:test";
import assert from "node:assert/strict";
import { INITIAL_STATE, reducer } from "../components/usmhacs/USMHACSPanel";

test("the copied V1 gate requires key and its completed delay", () => {
  let state = structuredClone(INITIAL_STATE);
  state = reducer(state, { type: "SET_KEY", physicalKey: true });
  state = reducer(state, { type: "SET_CODE", codeState: "correct" });
  assert.equal(state.doorOpen, false);
  assert.equal(state.delayStatus, "waiting");
  state = reducer(state, { type: "SET_DELAY", delayStatus: "ok" });
  assert.equal(state.doorOpen, true);
  state = reducer(state, { type: "SET_KEY", physicalKey: false });
  assert.equal(state.doorOpen, false);
});
test("the copied V1 wrong-code latch survives correcting the code", () => {
  let state = reducer(structuredClone(INITIAL_STATE), { type: "SET_CODE", codeState: "wrong" });
  assert.equal(state.isLatched, true);
  state = reducer(state, { type: "SET_CODE", codeState: "correct" });
  state = reducer(state, { type: "SET_KEY", physicalKey: true });
  state = reducer(state, { type: "SET_DELAY", delayStatus: "ok" });
  assert.equal(state.isLatched, true);
  assert.equal(state.doorOpen, false);
});
test("the copied V1 tamper and environmental inputs preserve fault memory", () => {
  for (const trigger of [
    { type: "SET_TAMPER", tamperDetected: true } as const,
    { type: "SET_SENSORS", sensors: { magnetic: true, temp: false, pressure: true, laser: true } } as const,
  ]) {
    let state = reducer(structuredClone(INITIAL_STATE), trigger);
    assert.equal(state.isLatched, true);
    state = reducer(state, { type: "SET_TAMPER", tamperDetected: false });
    state = reducer(state, { type: "SET_SENSORS", sensors: structuredClone(INITIAL_STATE.sensors) });
    assert.equal(state.isLatched, true);
    assert.equal(state.doorOpen, false);
  }
});
