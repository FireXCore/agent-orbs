import type { ReactNode } from 'react';
import { AgentOrb } from './AgentOrb';
import type { AgentOrbProps } from './types';

export type AgentOrbLabelProps = Omit<AgentOrbProps, 'aria-label' | 'role'> & {
  children: ReactNode;
  gap?: number;
};

/** Use a single accessible status rather than announcing an ornamental image twice. */
export function AgentOrbLabel({ children, gap = 9, ...props }: AgentOrbLabelProps) {
  return <span role="status" aria-live="polite" style={{ display: 'inline-flex', gap, alignItems: 'center' }}>
    <AgentOrb size="small" {...props} aria-hidden="true" />
    <span>{children}</span>
  </span>;
}
