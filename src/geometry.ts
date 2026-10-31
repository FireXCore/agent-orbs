/** Standalone mathematical primitives. Every function is deterministic and DOM-free. */
export type Vec3 = { x: number; y: number; z: number };
export const TAU = Math.PI * 2;
export const clamp = (x: number, lo = 0, hi = 1): number => Math.max(lo, Math.min(hi, x));
export const mix = (a: number, b: number, t: number): number => a + (b - a) * t;
export const smooth = (x: number): number => { const t = clamp(x); return t * t * (3 - 2 * t); };
export const fract = (x: number): number => x - Math.floor(x);
export const hash = (seed: number): number => fract(Math.sin(seed * 127.1 + 78.23) * 43758.5453);
export const distAngle = (a: number, b: number): number => Math.abs(Math.atan2(Math.sin(a - b), Math.cos(a - b)));
export const vec = (x: number, y: number, z: number): Vec3 => ({ x, y, z });
export const sphere = (latitude: number, longitude: number): Vec3 => vec(
  Math.cos(latitude) * Math.cos(longitude),
  Math.sin(latitude),
  Math.cos(latitude) * Math.sin(longitude)
);
export function rotate(p: Vec3, yaw: number, pitch: number, roll = 0): Vec3 {
  const cy = Math.cos(yaw), sy = Math.sin(yaw);
  const cp = Math.cos(pitch), sp = Math.sin(pitch);
  const cr = Math.cos(roll), sr = Math.sin(roll);
  const x = p.x * cy + p.z * sy;
  const z = -p.x * sy + p.z * cy;
  const y = p.y * cp - z * sp;
  const z2 = p.y * sp + z * cp;
  return vec(x * cr - y * sr, x * sr + y * cr, z2);
}
/** Golden-angle distribution, unrelated to external libraries. */
export function fibonacciPoint(index: number, total: number): Vec3 {
  const y = 1 - (2 * (index + 0.5)) / total;
  const theta = index * Math.PI * (3 - Math.sqrt(5));
  const radius = Math.sqrt(Math.max(0, 1 - y * y));
  return vec(Math.cos(theta) * radius, y, Math.sin(theta) * radius);
}
