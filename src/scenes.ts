import type { Dot, OrbState, Scene } from './core-types';
import { TAU, clamp, distAngle, fibonacciPoint, hash, mix, rotate, smooth, sphere, vec } from './geometry';

const make = (): Scene => ({ dots: [], lines: [] });
const dot = (scene: Scene, x: number, y: number, z: number, r = 1, a = 1, hot = 0): Dot => {
  const result = { x, y, z, r, a: clamp(a), hot: clamp(hot) };
  scene.dots.push(result);
  return result;
};
const from3 = (scene: Scene, p: {x: number; y: number; z: number}, r = 1, a = 1, hot = 0) => dot(scene, p.x, p.y, p.z, r, a, hot);

/** Build a full animation frame in normalized -1..1 coordinates; no Canvas or React imports. */
export function buildScene(state: OrbState, seconds: number, compact = false): Scene {
  const t = Number.isFinite(seconds) ? seconds : 0;
  const s = make();
  const density = compact ? 0.55 : 1;
  switch (state) {
    case 'working': {
      // Nested precessing orbital tracks, each with its own satellite wake.
      for (let ring = 0; ring < 4; ring++) {
        const count = Math.round(33 * density);
        const inclination = (ring - 1.5) * 0.51;
        for (let j = 0; j < count; j++) {
          const a = (j / count) * TAU + t * (0.23 + ring * 0.07) * (ring % 2 ? -1 : 1);
          const p = rotate(vec(Math.cos(a) * 0.85, Math.sin(a) * 0.85, 0), ring * 0.87 + t * 0.10, inclination, ring * 0.21);
          const lead = distAngle(a, t * (0.85 + ring * 0.12));
          from3(s, p, 0.75 + 0.3 * hash(j + ring * 30), 0.50 + 0.42 * (1 - lead / Math.PI), clamp(1 - lead / 0.5));
        }
      }
      break;
    }
    case 'searching': {
      // Geodetic grid with a continuously traveling illuminated longitude.
      const latitudes = compact ? 9 : 13, longitudes = compact ? 13 : 21;
      const beam = t * 0.85;
      for (let i = 0; i < latitudes; i++) {
        const lat = mix(-1.35, 1.35, i / (latitudes - 1));
        for (let j = 0; j < longitudes; j++) {
          const lon = (j / longitudes) * TAU;
          const p = rotate(sphere(lat, lon), t * 0.15, 0.17);
          const hot = Math.exp(-Math.pow(distAngle(lon, beam) / 0.33, 2));
          from3(s, p, 0.7, 0.36 + 0.36 * hot, hot);
        }
      }
      break;
    }
    case 'solving': {
      // Ordered lattice periodically disperses and reassembles into concentric layers.
      const n = Math.round(170 * density);
      const cycle = (t / 3.8) % 1;
      const disorder = smooth(Math.sin(cycle * Math.PI) ** 4);
      for (let i = 0; i < n; i++) {
        const p = fibonacciPoint(i, n);
        const lane = Math.round(p.y * 5) / 5;
        const base = vec(p.x, mix(p.y, lane, 0.50), p.z);
        const drift = vec((hash(i + 7) - 0.5) * 0.46, (hash(i + 79) - 0.5) * 0.46, (hash(i + 137) - 0.5) * 0.46);
        const mixed = vec(base.x + drift.x * disorder, base.y + drift.y * disorder, base.z + drift.z * disorder);
        from3(s, rotate(mixed, 0.28 * t, 0.2), 0.78, 0.48 + 0.35 * (1 - disorder), 0.12 + (1 - disorder) * 0.3);
      }
      break;
    }
    case 'listening': {
      // A voice-like travelling pressure wave distorts concentric latitude loops.
      const rows = compact ? 8 : 13;
      const columns = compact ? 13 : 19;
      for (let i = 0; i < rows; i++) {
        const latitude = mix(-1.25, 1.25, i / (rows - 1));
        for (let j = 0; j < columns; j++) {
          const lon = (j / columns) * TAU;
          const ripple = 0.07 * Math.sin(9 * latitude + 3 * lon - 4 * t) + 0.03 * Math.sin(20 * longitudeWave(lon, t));
          const p = sphere(latitude + ripple, lon);
          const v = rotate(p, t * 0.14, -0.1);
          from3(s, v, 0.72, 0.60 + ripple * 2.2, Math.min(0.85, Math.abs(ripple) * 6));
        }
      }
      break;
    }
    case 'connecting': {
      // Independent 3D graph with time-gated nearest-neighbor connections.
      const n = compact ? 24 : 42;
      const nodes = Array.from({ length: n }, (_, i) => {
        const p = fibonacciPoint(i, n);
        return rotate(p, t * 0.16, Math.sin(t * 0.2) * 0.24);
      });
      for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
          const a = nodes[i], b = nodes[j];
          const distance = Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
          if (distance > (compact ? 0.78 : 0.58) || hash(i * 91 + j * 13) > 0.59) continue;
          const pulse = 0.5 + 0.5 * Math.cos(t * 2.4 - (i + j) * 0.17);
          s.lines.push({ a: { ...a, r: 0, a: 1 }, b: { ...b, r: 0, a: 1 }, opacity: 0.12 + 0.22 * pulse });
        }
      }
      nodes.forEach((p, i) => from3(s, p, 0.82 + hash(i * 3) * 0.32, 0.80, Math.pow(Math.max(0, Math.sin(t * 1.7 - i * 0.45)), 7)));
      break;
    }
    case 'weaving': {
      // Three independent spiral threads thread across the surface of a sphere.
      const n = Math.round(77 * density);
      for (let strand = 0; strand < 3; strand++) {
        for (let i = 0; i < n; i++) {
          const progress = i / (n - 1);
          const latitude = mix(-1.38, 1.38, progress);
          const longitude = progress * TAU * 2.5 + strand * TAU / 3 + t * 0.54;
          const p = rotate(sphere(latitude, longitude), t * 0.13, 0.20);
          from3(s, p, 0.84, 0.67, strand === 1 ? 0.18 : 0);
        }
      }
      break;
    }
    case 'composing': {
      // Layered ribbons wrap around a transparent volume like written lines.
      const bands = compact ? 7 : 11;
      const n = Math.round(32 * density);
      for (let band = 0; band < bands; band++) {
        for (let i = 0; i < n; i++) {
          const x = mix(-0.91, 0.91, i / (n - 1));
          const y = mix(-0.75, 0.75, band / (bands - 1));
          const envelope = Math.sqrt(Math.max(0, 1 - (x * x) / 1.01));
          const z = envelope * 0.30 * Math.sin(x * 5.4 + band * 0.5 - t * 1.15);
          const waveY = y + Math.sin(x * 4.7 - t * 1.75 + band * 0.34) * 0.13 * envelope;
          const p = rotate(vec(x, waveY, z), t * 0.09, -0.1);
          from3(s, p, 0.74, 0.72, Math.max(0, Math.sin(x * 2.5 - t * 2 + band)) * 0.2);
        }
      }
      break;
    }
    case 'breathing': {
      // One quiet toroidal halo with two harmonic breathing frequencies.
      const n = Math.round(94 * density);
      const breath = 0.80 + 0.06 * Math.sin(t * 0.9);
      for (let i = 0; i < n; i++) {
        const a = i / n * TAU;
        const local = breath + Math.sin(5 * a + t * 0.47) * 0.021;
        dot(s, Math.cos(a) * local, Math.sin(a) * local, 0.13 * Math.sin(3 * a + t * 0.25), 0.84, 0.44 + Math.sin(a * 2 + t * 0.40) * 0.15, 0.07);
      }
      break;
    }
    case 'shaping': {
      // Entirely procedural outline interpolating among circle, square and triangle.
      const n = Math.round(90 * density);
      const cycle = (t / 3.0) % 3;
      const fromShape = Math.floor(cycle);
      const morph = smooth(cycle - fromShape);
      for (let i = 0; i < n; i++) {
        const a = i / n * TAU - Math.PI / 2;
        const r0 = shapeRadius(fromShape, a);
        const r1 = shapeRadius((fromShape + 1) % 3, a);
        const radius = mix(r0, r1, morph) * 0.88;
        dot(s, Math.cos(a) * radius, Math.sin(a) * radius, 0, 0.90, 0.78, 0.14);
      }
      break;
    }
  }
  return s;
}

function longitudeWave(lon: number, seconds: number): number { return lon - seconds * 0.12; }

function shapeRadius(shape: number, a: number): number {
  if (shape === 0) return 0.83;
  if (shape === 1) {
    // Ray intersection with a centered square.
    return 0.68 / Math.max(Math.abs(Math.cos(a)), Math.abs(Math.sin(a)));
  }
  // Ray intersection with the sides of a regular triangle.
  const sides = [-Math.PI / 2, -Math.PI / 2 + TAU / 3, -Math.PI / 2 + TAU * 2 / 3];
  let hit = Infinity;
  for (let i = 0; i < 3; i++) {
    const b = sides[i], c = sides[(i + 1) % 3];
    const x1 = Math.cos(b), y1 = Math.sin(b), x2 = Math.cos(c), y2 = Math.sin(c);
    const dx = x2 - x1, dy = y2 - y1;
    const ux = Math.cos(a), uy = Math.sin(a);
    const denom = ux * dy - uy * dx;
    if (Math.abs(denom) < 1e-9) continue;
    const ray = (x1 * dy - y1 * dx) / denom;
    const edge = (x1 * uy - y1 * ux) / denom;
    if (ray > 0 && edge >= -1e-6 && edge <= 1 + 1e-6) hit = Math.min(hit, ray);
  }
  return Number.isFinite(hit) ? hit : 0.83;
}
