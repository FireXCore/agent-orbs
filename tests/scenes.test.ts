import { describe, expect, it } from 'vitest';
import { buildScene } from '../src/scenes';
import { ORB_STATES, WAITING_VARIANTS } from '../src/types';
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
  it('renders distinct Waiting designs with scalable, continuous motion', () => {
    const regular = WAITING_VARIANTS.map(variant => buildScene('waiting', 0, false, variant));
    expect(regular[0]).toEqual(buildScene('waiting', 0));
    for (const [index, variant] of WAITING_VARIANTS.entries()) {
      for (const compact of [false, true]) {
        const frame = buildScene('waiting', 0, compact, variant);
        expect(frame).toEqual(buildScene('waiting', 5.6, compact, variant));
        expect(frame).not.toEqual(buildScene('waiting', 2.1, compact, variant));
        for (const { x, y, z, r, a, hot } of frame.dots) {
          expect([x, y, z, r, a, hot].every(Number.isFinite)).toBe(true);
          expect(Math.max(Math.abs(x), Math.abs(y), Math.abs(z))).toBeLessThan(1.2);
          expect(a).toBeGreaterThan(0);
          expect(a).toBeLessThanOrEqual(1);
        }
      }
      expect(buildScene('waiting', 0, true, variant).dots.length).toBeLessThan(regular[index].dots.length);
      for (const other of regular.slice(index + 1)) expect(regular[index]).not.toEqual(other);
    }
  });
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
