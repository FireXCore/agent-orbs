import { describe, expect, it } from 'vitest';
import { buildScene } from '../src/scenes';
import { ORB_STATES } from '../src/types';
import { fibonacciPoint, rotate, smooth } from '../src/geometry';

describe('agent orb frame geometry', () => {
  for (const state of ORB_STATES) {
    it(`${state} produces finite and deterministic scenes at both presets`, () => {
      for (const compact of [false, true]) {
        for (const t of [0, 0.75, 8.25]) {
          const frame = buildScene(state, t, compact);
          expect(frame.dots.length).toBeGreaterThan(10);
          expect(frame).toEqual(buildScene(state, t, compact));
          expect(frame.dots.length).toBeLessThan(600);
          for (const d of frame.dots) {
            for (const k of ['x', 'y', 'z', 'r', 'a', 'hot'] as const) expect(Number.isFinite(d[k] ?? 0)).toBe(true);
            expect(d.a).toBeGreaterThanOrEqual(0);
            expect(d.a).toBeLessThanOrEqual(1);
          }
          for (const l of frame.lines) expect(Number.isFinite(l.opacity)).toBe(true);
        }
      }
    });
  }
  it('small preset reduces geometry count', () => {
    for (const state of ORB_STATES) expect(buildScene(state, 1, true).dots.length).toBeLessThan(buildScene(state, 1, false).dots.length);
  });
  it('shape path evolves over time', () => expect(buildScene('shaping', 0)).not.toEqual(buildScene('shaping', 2.7)));
  it('smooth step clamps inputs', () => { expect(smooth(-2)).toBe(0); expect(smooth(2)).toBe(1); });
  it('sphere distribution is normalized', () => {
    for (let i = 0; i < 30; i++) {
      const { x, y, z } = rotate(fibonacciPoint(i, 30), 1.5, -0.4);
      expect(Math.hypot(x, y, z)).toBeCloseTo(1, 9);
    }
  });
});
