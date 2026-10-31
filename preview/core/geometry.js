export const TAU = Math.PI * 2;
export const clamp = (x, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, x));
export const mix = (a, b, t) => a + (b - a) * t;
export const smooth = (x) => { const t = clamp(x); return t * t * (3 - 2 * t); };
export const fract = (x) => x - Math.floor(x);
export const hash = (seed) => fract(Math.sin(seed * 127.1 + 78.23) * 43758.5453);
export const distAngle = (a, b) => Math.abs(Math.atan2(Math.sin(a - b), Math.cos(a - b)));
export const vec = (x, y, z) => ({ x, y, z });
export const sphere = (latitude, longitude) => vec(Math.cos(latitude) * Math.cos(longitude), Math.sin(latitude), Math.cos(latitude) * Math.sin(longitude));
export function rotate(p, yaw, pitch, roll = 0) {
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
export function fibonacciPoint(index, total) {
    const y = 1 - (2 * (index + 0.5)) / total;
    const theta = index * Math.PI * (3 - Math.sqrt(5));
    const radius = Math.sqrt(Math.max(0, 1 - y * y));
    return vec(Math.cos(theta) * radius, y, Math.sin(theta) * radius);
}
