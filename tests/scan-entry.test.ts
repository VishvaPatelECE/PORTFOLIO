import test from "node:test";
import assert from "node:assert/strict";
import { scanFrame, INTRO_DURATION } from "../lib/models/intro";

test("the scan subject waits visibly without automatically completing entry", () => {
  for (let frame = 0; frame < 100; frame++) {
    const state = scanFrame(null);
    assert.equal(state.phase, "ready");
    assert.equal(state.reveal, 1);
    assert.equal(state.done, false);
    assert.equal(state.scan, 0);
  }
});
test("starting a scan preserves the subject through both sweeps and then releases entry", () => {
  assert.equal(scanFrame(0).reveal, 1);
  assert.equal(scanFrame(1900).phase, "up");
  assert.equal(scanFrame(3400).phase, "down");
  assert.ok(scanFrame(1900).scan > 0);
  assert.ok(scanFrame(3400).scan > 0);
  assert.equal(scanFrame(INTRO_DURATION - 1).done, false);
  assert.equal(scanFrame(INTRO_DURATION).done, true);
});
test("the particle morph prepares the hero before its aperture opens and finishes before disposal", () => {
  assert.equal(scanFrame(4899).morph, 0);
  assert.equal(scanFrame(4899).opening, 0);
  assert.ok(scanFrame(5200).morph > 0);
  assert.equal(scanFrame(5200).opening, 0);
  assert.ok(scanFrame(5700).opening > 0);
  assert.ok(scanFrame(5700).morph < 1);
  assert.equal(scanFrame(6650).morph, 1);
  assert.equal(scanFrame(6650).opening, 1);
  assert.equal(scanFrame(6650).done, false);
  assert.equal(scanFrame(INTRO_DURATION).done, true);
  let morph = 0, opening = 0;
  for (let t = 4900; t <= INTRO_DURATION; t += 25) {
    const frame = scanFrame(t);
    assert.ok(frame.morph >= morph && frame.morph <= 1);
    assert.ok(frame.opening >= opening && frame.opening <= 1);
    morph = frame.morph; opening = frame.opening;
  }
});
