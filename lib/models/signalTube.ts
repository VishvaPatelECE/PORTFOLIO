/** Builds a tube's reusable vertex buffers, including a stable frame at coincident points. */
export function writeSignalTube(points: Float32Array, radius: number, positions: Float32Array, normals: Float32Array, sides = 8) {
  const count = points.length / 3;
  if (count < 2 || !Number.isInteger(count) || sides < 3 || !Number.isInteger(sides) || radius <= 0 || !Number.isFinite(radius)) throw new Error("Invalid signal tube dimensions");
  const size = count * (sides + 1) * 3;
  if (positions.length !== size || normals.length !== size) throw new Error("Signal tube buffers must match the point count");
  for (let i = 0; i < count; i++) {
    const previous = Math.max(0, i - 1) * 3, next = Math.min(count - 1, i + 1) * 3;
    let tx = points[next] - points[previous], ty = points[next + 1] - points[previous + 1], tz = points[next + 2] - points[previous + 2];
    const length = Math.hypot(tx, ty, tz);
    if (length < 1e-6) { tx = 1; ty = 0; tz = 0; } else { tx /= length; ty /= length; tz /= length; }
    let nx = Math.abs(tz) > .9 ? -tz : ty, ny = Math.abs(tz) > .9 ? 0 : -tx, nz = Math.abs(tz) > .9 ? tx : 0;
    const normalLength = Math.hypot(nx, ny, nz);
    nx /= normalLength; ny /= normalLength; nz /= normalLength;
    const bx = ty * nz - tz * ny, by = tz * nx - tx * nz, bz = tx * ny - ty * nx;
    for (let j = 0; j <= sides; j++) {
      const angle = j / sides * Math.PI * 2, cosine = Math.cos(angle), sine = Math.sin(angle);
      const index = (i * (sides + 1) + j) * 3;
      const vx = nx * cosine + bx * sine, vy = ny * cosine + by * sine, vz = nz * cosine + bz * sine;
      normals[index] = vx; normals[index + 1] = vy; normals[index + 2] = vz;
      positions[index] = points[i * 3] + vx * radius;
      positions[index + 1] = points[i * 3 + 1] + vy * radius;
      positions[index + 2] = points[i * 3 + 2] + vz * radius;
    }
  }
}
