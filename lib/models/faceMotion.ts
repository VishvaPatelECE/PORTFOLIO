export type FacePose = { yaw: number; pitch: number; x: number; y: number };
export const NEUTRAL_FACE: FacePose = { yaw: 0, pitch: 0, x: 0, y: 0 };
const clamp = (n: number, limit: number) => Math.max(-limit, Math.min(limit, n));
export function boundFacePose(pose: FacePose): FacePose {
  return { yaw: clamp(pose.yaw, .65), pitch: clamp(pose.pitch, .32), x: clamp(pose.x, .38), y: clamp(pose.y, .28) };
}
export function pointerFacePose(x: number, y: number): FacePose {
  return boundFacePose({ yaw: x * .42, pitch: y * .24, x: x * .16, y: -y * .1 });
}
export function keyFacePose(pose: FacePose, key: string, pan = false): FacePose {
  if (key === "Home") return { ...NEUTRAL_FACE };
  const dx = key === "ArrowLeft" ? -1 : key === "ArrowRight" ? 1 : 0;
  const dy = key === "ArrowUp" ? 1 : key === "ArrowDown" ? -1 : 0;
  return boundFacePose(pan
    ? { ...pose, x: pose.x + dx * .1, y: pose.y + dy * .08 }
    : { ...pose, yaw: pose.yaw + dx * .12, pitch: pose.pitch - dy * .08 });
}
