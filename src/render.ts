import type { Dot, Scene } from './core-types';
import { clamp } from './geometry';

export interface DrawOptions { ink: string; accent: string; diameter: number; }
const project = (d: Dot, radius: number) => {
  const perspective = 2.9 / (2.9 - d.z * 0.45);
  return { x: d.x * radius * perspective, y: d.y * radius * perspective, scale: perspective };
};

/** Render one depth-sorted scene using the browser's 2D canvas. */
export function paint(ctx: CanvasRenderingContext2D, scene: Scene, opts: DrawOptions): void {
  const { diameter, ink, accent } = opts;
  const center = diameter / 2;
  const radius = diameter * 0.405;
  ctx.clearRect(0, 0, diameter, diameter);
  ctx.lineCap = 'round';
  for (const segment of scene.lines) {
    const a = project(segment.a, radius);
    const b = project(segment.b, radius);
    ctx.beginPath();
    ctx.strokeStyle = ink;
    ctx.globalAlpha = clamp(segment.opacity * (0.77 + (segment.a.z + segment.b.z) * 0.12));
    ctx.lineWidth = diameter > 40 ? 0.60 : 0.48;
    ctx.moveTo(center + a.x, center + a.y);
    ctx.lineTo(center + b.x, center + b.y);
    ctx.stroke();
  }
  for (const d of [...scene.dots].sort((a, b) => a.z - b.z)) {
    const p = project(d, radius);
    const near = clamp((d.z + 1) / 2);
    ctx.globalAlpha = clamp(d.a * (0.30 + near * 0.70));
    ctx.fillStyle = d.hot && d.hot > 0.32 ? accent : ink;
    ctx.beginPath();
    const r = (diameter > 40 ? 1.05 : 0.95) * d.r * (0.68 + near * 0.55) * p.scale;
    ctx.arc(center + p.x, center + p.y, Math.max(0.42, r), 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}
