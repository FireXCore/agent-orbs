import { InteractiveOrb } from './InteractiveOrb';
import type { InteractiveOrbProps } from './InteractiveOrb';

/**
 * Faithful monochrome halftone family using the upstream ThinkingOrb classic
 * renderer and its state/size-specific native 32/64/96/128px profiles.
 *
 * This component is an opt-in named API for the MIT-attributed Schoolees /
 * Jakub Antalik implementation retained in src/heritage. It does not use
 * the original FireXCore glow palette or contour visual treatment.
 */
export type MonoLatticeOrbProps = Omit<InteractiveOrbProps, 'variant'>;

export function MonoLatticeOrb(props: MonoLatticeOrbProps) {
  return <InteractiveOrb {...props} variant="classic" />;
}
