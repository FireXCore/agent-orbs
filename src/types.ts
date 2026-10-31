import type { OrbState } from './core-types';
export { ORB_STATES } from './core-types';
export type { OrbState } from './core-types';
import type { CanvasHTMLAttributes } from 'react';

export type OrbTheme = 'auto' | 'dark' | 'light';
export type OrbSize = 'small' | 'regular' | number;

export interface AgentOrbProps extends Omit<CanvasHTMLAttributes<HTMLCanvasElement>, 'color'> {
  state?: OrbState;
  size?: OrbSize;
  /** Auto detects theme from the closest theme container or OS. */
  theme?: OrbTheme;
  /** Optional monochrome ink override, e.g. '#e2e8f0'. */
  color?: string;
  /** Optional accent color on active dots and traveling signals. */
  accent?: string;
  /** Motion speed multiplier; zero creates a static frame. */
  speed?: number;
  /** Pause at the current animation frame. */
  paused?: boolean;
}

