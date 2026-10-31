import { useEffect, useRef } from 'react';
import { useAppearance, useReduceMotion } from './appearance';
import { subscribeClock } from './clock';
import { buildScene } from './scenes';
import { paint } from './render';
import type { AgentOrbProps, OrbState } from './types';

const LABEL: Record<OrbState, string> = {
  working: 'Processing', searching: 'Searching', solving: 'Analyzing',
  listening: 'Listening', connecting: 'Connecting', weaving: 'Planning',
  composing: 'Composing', breathing: 'Waiting', shaping: 'Generating design'
};

/** Accessible, independent 3D-inspired canvas status ornament. */
export function AgentOrb({
  state = 'working', size = 'regular', theme = 'auto',
  speed = 1, paused = false, color, accent, style,
  'aria-label': ariaLabel, ...canvasProps
}: AgentOrbProps) {
  const ref = useRef<HTMLCanvasElement>(null);
  const mode = useAppearance(theme, ref);
  const reduced = useReduceMotion();
  const diameter = size === 'small' ? 24 : size === 'regular' ? 76 : Math.max(12, Math.min(256, Number.isFinite(size) ? size : 76));

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ratio = Math.min(2, Math.max(1, window.devicePixelRatio || 1));
    canvas.width = Math.round(diameter * ratio);
    canvas.height = Math.round(diameter * ratio);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const ink = color ?? (mode === 'dark' ? '#f4f7ff' : '#172332');
    const activeInk = accent ?? ink;
    const render = (seconds: number) => {
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      paint(ctx, buildScene(state, seconds, diameter < 40), { ink, accent: activeInk, diameter });
    };
    const now = () => typeof performance === 'undefined' ? 0 : performance.now() / 1000;
    // Initial deterministic paint: screenshots and reduced-motion are never blank.
    render(reduced ? 0.7 : now() * speed);
    if (reduced || paused || speed === 0) return;
    let unsubscribe: (() => void) | null = null;
    const stop = () => { unsubscribe?.(); unsubscribe = null; };
    const start = () => { if (!unsubscribe) unsubscribe = subscribeClock(t => render(t * speed)); };
    let observer: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(entries => entries[0]?.isIntersecting ? start() : stop(), { threshold: 0 });
      observer.observe(canvas);
    } else {
      start();
    }
    return () => { stop(); observer?.disconnect(); };
  }, [state, diameter, mode, speed, paused, reduced, color, accent]);

  return <canvas
    {...canvasProps}
    ref={ref}
    role="img"
    aria-label={ariaLabel ?? LABEL[state]}
    width={diameter}
    height={diameter}
    style={{ width: diameter, height: diameter, display: 'block', flex: 'none', ...style }}
  />;
}
