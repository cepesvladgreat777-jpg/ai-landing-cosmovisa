import { SCREENSAVER_TIMING } from '../config';

interface IdleControllerOptions {
  isHeroVisible: () => boolean;
  onLock: () => void;
  onReturnToHero: () => void;
}

/** Owns activity subscriptions and one timer. UI animations never drive it. */
export function createIdleController({ isHeroVisible, onLock, onReturnToHero }: IdleControllerOptions) {
  let lastActivity = Date.now();
  let hasShown = false;
  let waiting = false;
  let timer: ReturnType<typeof setTimeout> | undefined;

  const checkIdle = () => {
    clearTimeout(timer);
    if (waiting || document.hidden) return;
    if (isHeroVisible()) lastActivity = Date.now();
    const delay = hasShown ? SCREENSAVER_TIMING.repeatIdleMs : SCREENSAVER_TIMING.firstIdleMs;
    const remaining = delay - (Date.now() - lastActivity);
    if (remaining <= 0) {
      hasShown = true;
      waiting = true;
      onLock();
    } else timer = setTimeout(checkIdle, remaining);
  };

  const resume = () => {
    waiting = false;
    lastActivity = Date.now();
    checkIdle();
  };

  const checkHeroBoundary = () => {
    if (!waiting || !isHeroVisible()) return;
    resume();
    onReturnToHero();
  };

  const onActivity = (event: Event) => {
    if (waiting) {
      if (event.type === 'scroll') checkHeroBoundary();
      return;
    }
    lastActivity = Date.now();
  };
  const onVisibility = () => {
    checkHeroBoundary();
    checkIdle();
  };
  const events = ['pointermove', 'pointerdown', 'keydown', 'wheel', 'touchstart', 'scroll'] as const;
  events.forEach((event) => window.addEventListener(event, onActivity, { capture: true, passive: true }));
  window.addEventListener('resize', checkHeroBoundary);
  document.addEventListener('visibilitychange', onVisibility);
  checkIdle();

  return {
    resume,
    destroy() {
      clearTimeout(timer);
      events.forEach((event) => window.removeEventListener(event, onActivity, true));
      window.removeEventListener('resize', checkHeroBoundary);
      document.removeEventListener('visibilitychange', onVisibility);
    },
  };
}
