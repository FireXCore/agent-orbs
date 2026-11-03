import { describe, expect, it } from 'vitest';
import { MonoLatticeOrb } from '../src/MonoLatticeOrb';
import { ORB_SIZES, ORB_STATES } from '../src/heritage/types';
import { resolvePreset } from '../src/heritage/presets';

describe('named Mono Lattice visual family', () => {
  it('forces classic upstream dots and retains native React props', () => {
    const element = MonoLatticeOrb({ state: 'listening', size: 128, interactive: true });
    expect(element.props.variant).toBe('classic');
    expect(element.props.state).toBe('listening');
    expect(element.props.size).toBe(128);
    expect(element.props.interactive).toBe(true);
  });
  it('provides original upstream native tuning for all nine states and all four sizes', () => {
    expect(ORB_SIZES).toEqual([32, 64, 96, 128]);
    expect(ORB_STATES).toHaveLength(9);
    for (const state of ORB_STATES) for (const size of ORB_SIZES) {
      const preset = resolvePreset(state, size);
      expect(preset.speed).toBeGreaterThan(0);
      expect(preset.mode).toBeDefined();
      expect(preset.opts).toBeDefined();
    }
    expect(resolvePreset('listening', 128).opts).not.toEqual(resolvePreset('listening', 32).opts);
  });
});
