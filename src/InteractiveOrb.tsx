import { useEffect, useRef } from 'react';
import type { CanvasHTMLAttributes } from 'react';
import { ThinkingOrb } from './heritage/thinking-orb';
import type { ThinkingOrbOptions } from './heritage/types';

/** React bridge for the opt-in classic/contour thinking-orb engine. */
export interface InteractiveOrbProps extends
  Omit<CanvasHTMLAttributes<HTMLCanvasElement>, 'size' | 'color' | 'children'>,
  ThinkingOrbOptions {}

export function InteractiveOrb({
  state = 'working', size = 64, theme = 'auto', variant = 'contour',
  speed = 1, paused = false, interactive = false,
  ariaLabel, className, style, ...canvasProps
}: InteractiveOrbProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controllerRef = useRef<ThinkingOrb | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const orb = new ThinkingOrb(canvasRef.current, {
      state, size, theme, variant, speed, paused, interactive,
      ariaLabel: ariaLabel ?? null
    });
    controllerRef.current = orb;
    return () => {
      orb.destroy();
      if (controllerRef.current === orb) controllerRef.current = null;
    };
  }, []);

  useEffect(() => {
    controllerRef.current?.update({
      state, size, theme, variant, speed, paused, interactive,
      ariaLabel: ariaLabel ?? null
    });
  }, [state, size, theme, variant, speed, paused, interactive, ariaLabel]);

  return <canvas
    {...canvasProps}
    ref={canvasRef}
    className={className}
    width={size}
    height={size}
    aria-label={ariaLabel ?? undefined}
    style={{ width: size, height: size, display: 'block', ...style }}
  />;
}
