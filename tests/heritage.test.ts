import { describe, it, expect } from 'vitest';
import { ORB_STATES, ORB_SIZES, ORB_VARIANTS } from '../src/heritage/types';
import { resolvePreset } from '../src/heritage/presets';
import { MODE_DRAWS, CONTOUR_MODE_DRAWS } from '../src/heritage/engine/registry';

describe('opt-in contour engine compatibility', () => {
  it('supports both renderers for every new engine state and size', () => {
    expect(ORB_STATES).toContain('idle');
    expect(ORB_STATES).toContain('responding');
    expect(ORB_VARIANTS).toEqual(['classic', 'contour']);
    for (const state of ORB_STATES) {
      for (const size of ORB_SIZES) {
        const preset = resolvePreset(state, size);
        expect(preset).toBeDefined();
        expect(typeof MODE_DRAWS[preset.mode]).toBe('function');
        expect(typeof CONTOUR_MODE_DRAWS[preset.mode]).toBe('function');
      }
    }
  });
});
