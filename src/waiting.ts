import type { Dot, Scene, WaitingVariant } from './core-types';
import { TAU, distAngle, hash, mix, rotate, sphere, vec } from './geometry';

export const WAITING_DESIGNS = {
  fold: { label: 'Particle Fold', description: 'A light travels along a folded particle surface.' },
  aperture: { label: 'Particle Aperture', description: 'A four-lobed volume gently opens and relaxes.' },
  wave: { label: 'Inner Wave', description: 'A moving wave lights up the inside of a stable particle volume.' }
} as const satisfies Record<WaitingVariant, { label: string; description: string }>;

const PERIOD = 5.6;

function intensity(angle: number, phase: number): number {
  return Math.exp(-((distAngle(angle, phase) / 0.58) ** 2));
}

/** All variants share a continuous cycle and the original depth-sorted particle renderer. */
export function buildWaitingScene(variant: WaitingVariant, seconds: number, compact: boolean): Scene {
  const phase = (seconds % PERIOD) / PERIOD * TAU;
  const dots: Dot[] = [];
  const columns = compact ? 14 : 30;
  const rows = compact ? 6 : 14;
  const yaw = 0.15 + 0.08 * Math.sin(phase);
  const add = (x: number, y: number, z: number, roll: number, hot: number, opacity = 0.60) => {
    const point = rotate(vec(x, y, z), yaw, -0.20, roll);
    const variation = hash(dots.length);
    dots.push({ ...point, r: (compact ? 0.73 : 0.61) + 0.18 * variation + 0.23 * hot, a: opacity + 0.30 * hot, hot });
  };

  switch (variant) {
    case 'aperture':
      // The four bulges taper into the center opening of a tilted particle torus.
      for (let i = 0; i < columns; i++) {
        const around = i / columns * TAU;
        const lobe = 0.5 + 0.5 * Math.cos(4 * around + 0.45);
        const centerRadius = 0.55 + 0.075 * lobe;
        const thickness = 0.12 + 0.15 * lobe + 0.025 * Math.sin(phase);
        for (let j = 0; j < rows; j++) {
          const cross = (j + (i % 2) / 2) / rows * TAU;
          const radius = centerRadius + Math.cos(cross) * thickness;
          const hot = intensity(around, phase) * (0.3 + 0.7 * (1 - Math.cos(cross)) / 2);
          add(radius * Math.cos(around), radius * Math.sin(around), Math.sin(cross) * thickness * 1.18, 0.20, hot);
        }
      }
      break;
    case 'wave':
      // Three nested layers keep the travelling wave inside the lenticular volume.
      for (const layer of compact ? [0.95, 0.62] : [1, 0.77, 0.54]) {
        const count = Math.round(columns * layer);
        for (let i = 0; i < count; i++) {
          const longitude = (i + layer * 0.23) / count * TAU;
          const wave = 0.31 * Math.sin(2 * longitude - phase);
          for (let j = 0; j < rows; j++) {
            const latitude = mix(-1.35, 1.35, (j + 0.5 * (i % 2)) / (rows - 0.5));
            const point = sphere(latitude, longitude);
            const band = Math.exp(-((latitude - wave) ** 2) / 0.075);
            const hot = band * intensity(longitude, phase) * (layer < 0.9 ? 1 : 0.35);
            add(0.97 * point.x * layer, 0.51 * point.y * layer, 0.77 * point.z * layer, -0.26, hot, layer < 0.9 ? 0.42 : 0.62);
          }
        }
      }
      break;
    default:
      // A rolled particle membrane creates an S-shaped crease with no solid surface.
      for (let i = 0; i < columns; i++) {
        const along = mix(-1, 1, i / (columns - 1));
        const twist = 1.40 * along + 0.14 * Math.sin(phase + 2 * along);
        const width = 0.60 * (0.69 + 0.31 * Math.sin((along + 1) / 2 * Math.PI));
        for (let j = 0; j < rows; j++) {
          const across = mix(-1, 1, (j + 0.5 * (i % 2)) / (rows - 0.5));
          const bend = 0.20 * Math.sin(Math.PI * across);
          const y = across * width * Math.cos(twist) - bend * Math.sin(twist);
          const z = across * width * Math.sin(twist) + bend * Math.cos(twist);
          const crease = Math.exp(-((across + 0.17 * Math.sin(3 * along)) ** 2) / 0.14);
          const hot = crease * intensity(along * Math.PI, phase);
          add(0.82 * along, y, z, 0.35, hot);
        }
      }
  }
  return { dots, lines: [] };
}
