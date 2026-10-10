import test from "node:test";
import assert from "node:assert/strict";
import { NEUTRAL_FACE, pointerFacePose, keyFacePose } from "../lib/models/faceMotion";

test("face inspection supports both rotation axes and independent horizontal/vertical movement", () => {
  const right = keyFacePose(NEUTRAL_FACE, "ArrowRight");
  assert.ok(right.yaw > 0);
  const up = keyFacePose(right, "ArrowUp");
  assert.ok(up.pitch < 0);
  const moved = keyFacePose(keyFacePose(up, "ArrowRight", true), "ArrowUp", true);
  assert.ok(moved.x > 0 && moved.y > 0);
  assert.equal(moved.yaw, up.yaw);
  assert.equal(moved.pitch, up.pitch);
  assert.deepEqual(keyFacePose(moved, "Home"), NEUTRAL_FACE);
});
test("pointer and repeated keyboard inspection stay within face framing bounds", () => {
  for (const input of [-100, 100]) {
    const pose = pointerFacePose(input, input);
    assert.ok(Math.abs(pose.yaw) <= .65 && Math.abs(pose.pitch) <= .32);
    assert.ok(Math.abs(pose.x) <= .38 && Math.abs(pose.y) <= .28);
  }
  let pose = { ...NEUTRAL_FACE };
  for (let i = 0; i < 100; i++) {
    pose = keyFacePose(keyFacePose(pose, "ArrowLeft"), "ArrowDown");
    pose = keyFacePose(keyFacePose(pose, "ArrowLeft", true), "ArrowDown", true);
  }
  assert.equal(pose.yaw, -.65);
  assert.equal(pose.pitch, .32);
  assert.equal(pose.x, -.38);
  assert.equal(pose.y, -.28);
});
