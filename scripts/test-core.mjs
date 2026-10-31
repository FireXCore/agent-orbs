import assert from 'node:assert/strict';
import { buildScene } from '../preview/core/scenes.js';
import { ORB_STATES } from '../preview/core/core-types.js';
import { fibonacciPoint, rotate } from '../preview/core/geometry.js';

let checked = 0;
for (const state of ORB_STATES) {
  for (const compact of [true, false]) {
    for (const t of [0, 0.1, 0.75, 1.2, 2.7, 5, 8.5, 20]) {
      const frame = buildScene(state, t, compact);
      assert(frame.dots.length > 10 && frame.dots.length < 600, `${state}: invalid dot count`);
      assert.deepEqual(frame, buildScene(state, t, compact), `${state}: not deterministic`);
      for (const d of frame.dots) {
        assert([d.x, d.y, d.z, d.r, d.a, d.hot].every(Number.isFinite), `${state}: nonfinite`);
        assert(d.a >= 0 && d.a <= 1, `${state}: out-of-range opacity`);
      }
      for (const line of frame.lines) assert(Number.isFinite(line.opacity));
      checked++;
    }
  }
  assert(buildScene(state, 1, true).dots.length < buildScene(state, 1, false).dots.length);
}
for (let i = 0; i < 60; i++) {
  const { x, y, z } = rotate(fibonacciPoint(i, 60), 1.5, -0.4);
  assert(Math.abs(Math.hypot(x, y, z) - 1) < 1e-9);
}
assert.notDeepEqual(buildScene('shaping', 0), buildScene('shaping', 2.7));
console.log(`PASS: ${checked} independent geometry frame checks, all 9 states, 2 sizes`);
