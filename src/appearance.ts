import { useEffect, useState } from 'react';
import type { RefObject } from 'react';
import type { OrbTheme } from './types';

function inspectTheme(node: HTMLElement | null): 'dark' | 'light' {
  if (typeof window === 'undefined') return 'light';
  let ancestor: HTMLElement | null = node;
  while (ancestor) {
    const attr = ancestor.getAttribute('data-theme');
    if (attr === 'dark' || attr === 'light') return attr;
    if (ancestor.classList.contains('dark')) return 'dark';
    if (ancestor.classList.contains('light')) return 'light';
    ancestor = ancestor.parentElement;
  }
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function useAppearance(theme: OrbTheme, target: RefObject<HTMLCanvasElement>): 'dark' | 'light' {
  const [resolved, setResolved] = useState<'dark' | 'light'>(() => theme === 'auto' ? 'light' : theme);
  useEffect(() => {
    if (theme !== 'auto') { setResolved(theme); return; }
    const update = () => setResolved(inspectTheme(target.current));
    update();
    const mq = window.matchMedia?.('(prefers-color-scheme: dark)');
    mq?.addEventListener?.('change', update);
    const observer = typeof MutationObserver !== 'undefined' ? new MutationObserver(update) : null;
    if (observer) observer.observe(document.documentElement, { subtree: true, attributes: true, attributeFilter: ['class', 'data-theme'] });
    return () => { mq?.removeEventListener?.('change', update); observer?.disconnect(); };
  }, [theme, target]);
  return theme === 'auto' ? resolved : theme;
}

export function useReduceMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const query = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!query) return;
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener?.('change', update);
    return () => query.removeEventListener?.('change', update);
  }, []);
  return reduced;
}
