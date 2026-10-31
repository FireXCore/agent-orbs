/** A single requestAnimationFrame driver is shared by every mounted visible orb. */
type Subscriber = (seconds: number) => void;
const subscribers = new Set<Subscriber>();
let raf = 0;
let listening = false;

function loop(ms: number): void {
  raf = 0;
  if (typeof document !== 'undefined' && document.hidden) return;
  for (const subscriber of subscribers) subscriber(ms / 1000);
  start();
}
function start(): void {
  if (raf || subscribers.size === 0 || typeof requestAnimationFrame === 'undefined') return;
  if (typeof document !== 'undefined' && document.hidden) return;
  raf = requestAnimationFrame(loop);
}
function onVisibility(): void { if (typeof document !== 'undefined' && !document.hidden) start(); }
export function subscribeClock(callback: Subscriber): () => void {
  subscribers.add(callback);
  if (!listening && typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', onVisibility);
    listening = true;
  }
  start();
  return () => {
    subscribers.delete(callback);
    if (!subscribers.size) {
      cancelAnimationFrame(raf);
      raf = 0;
      if (listening && typeof document !== 'undefined') {
        document.removeEventListener('visibilitychange', onVisibility);
        listening = false;
      }
    }
  };
}
