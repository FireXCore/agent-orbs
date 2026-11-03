export { AgentOrb } from './AgentOrb';
export { AgentOrbLabel } from './AgentOrbLabel';
export { ORB_STATES } from './types';
export type { AgentOrbProps, OrbState, OrbTheme, OrbSize } from './types';

/** Optional nine-state contour/interactive engine, adapted under MIT from Schoolees/thinking-orbs. */
export { InteractiveOrb } from './InteractiveOrb';
export type { InteractiveOrbProps } from './InteractiveOrb';
export { ThinkingOrb, createThinkingOrb } from './heritage/thinking-orb';
export { ThinkingOrbElement, defineThinkingOrb } from './heritage/thinking-orb-element';
export {
  ORB_STATES as INTERACTIVE_ORB_STATES,
  ORB_SIZES as INTERACTIVE_ORB_SIZES,
  ORB_VARIANTS as INTERACTIVE_ORB_VARIANTS
} from './heritage/types';
export type {
  OrbState as InteractiveOrbState,
  OrbSize as InteractiveOrbSize,
  OrbVariant as InteractiveOrbVariant,
  ThinkingOrbOptions,
  ThinkingOrbSnapshot,
  ThinkingOrbTarget
} from './heritage/types';
