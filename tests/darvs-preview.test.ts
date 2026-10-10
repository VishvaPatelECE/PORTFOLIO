import test from "node:test";
import assert from "node:assert/strict";
import { initialDarvsPreview, darvsPreviewReducer as reduce, darvsPreviewDecision as decision, runDarvsPreviewExample } from "../lib/models/darvsPreview";

test("preview identity matching remains gated until all challenge responses", () => {
  let state = { ...initialDarvsPreview };
  for (let i = 0; i < 3; i++) {
    assert.equal(reduce(state, { type: "toggle-match" }).match, false);
    state = reduce(state, { type: "respond" });
  }
  state = reduce(state, { type: "toggle-match" });
  assert.equal(decision(state), "ACCEPT");
});

test("losing a face region clears liveness and identity rather than retaining acceptance", () => {
  const state = reduce({ region: true, responses: 3, match: true }, { type: "toggle-region" });
  assert.deepEqual(state, { region: false, responses: 0, match: false });
  assert.equal(decision(state), "NO INPUT");
  assert.equal(reduce(state, { type: "respond" }), state);
});

test("responses are bounded and restarting challenges revokes an existing match", () => {
  let state = { ...initialDarvsPreview };
  for (let i = 0; i < 30; i++) state = reduce(state, { type: "respond" });
  assert.equal(state.responses, 3);
  state = reduce(state, { type: "toggle-match" });
  state = reduce(state, { type: "reset-challenges" });
  assert.equal(decision(state), "CHALLENGE REQUIRED");
  assert.equal(state.match, false);
});

test("a contradictory matched example cannot bypass absent input or incomplete liveness", () => {
  assert.equal(decision({ region: false, responses: 3, match: true }), "NO INPUT");
  assert.equal(decision({ region: true, responses: 1, match: true }), "CHALLENGE REQUIRED");
});

test("cancelled presentation cannot advance a newly selected or reset stage", context => {
  context.mock.timers.enable({ apis: ["setTimeout"] });
  const seen: number[] = [];
  let done = false;
  const cancel = runDarvsPreviewExample(step => seen.push(step.stage), () => { done = true; });
  context.mock.timers.tick(700);
  assert.deepEqual(seen, [0, 1]);
  cancel();
  context.mock.timers.tick(5000);
  assert.deepEqual(seen, [0, 1]);
  assert.equal(done, false);
});
