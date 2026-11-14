import { test } from "node:test";
import assert from "node:assert/strict";
import { writeSignalTube } from "../lib/models/signalTube";

test("tube frames remain finite for coincident trail points and vertical tangents", () => {
  for (const points of [new Float32Array([1, 2, 3, 1, 2, 3, 1, 2, 3]), new Float32Array([0, 0, -1, 0, 0, 0, 0, 0, 1])]) {
    const vertices = new Float32Array(3 * 9 * 3), normals = new Float32Array(vertices.length);
    writeSignalTube(points, 4, vertices, normals);
    assert.ok(vertices.every(Number.isFinite));
    assert.ok(normals.every(Number.isFinite));
    for (let i = 0; i < normals.length; i += 3) assert.ok(Math.abs(Math.hypot(normals[i], normals[i + 1], normals[i + 2]) - 1) < 1e-5);
  }
});

test("tube geometry keeps its radius and closes the radial seam without reallocating", () => {
  const points = new Float32Array([0, 0, 0, 10, 4, 3, 20, -4, 6]);
  const vertices = new Float32Array(3 * 9 * 3), normals = new Float32Array(vertices.length);
  writeSignalTube(points, 5, vertices, normals);
  for (let i = 0; i < 3; i++) {
    const start = i * 27, last = start + 24;
    assert.ok(Math.abs(Math.hypot(vertices[start] - points[i * 3], vertices[start + 1] - points[i * 3 + 1], vertices[start + 2] - points[i * 3 + 2]) - 5) < 1e-5);
    assert.ok(Math.hypot(vertices[start] - vertices[last], vertices[start + 1] - vertices[last + 1], vertices[start + 2] - vertices[last + 2]) < 1e-5);
  }
  assert.throws(() => writeSignalTube(points, 5, new Float32Array(1), normals));
});
