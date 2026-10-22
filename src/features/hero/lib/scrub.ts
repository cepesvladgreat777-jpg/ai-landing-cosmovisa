import { HERO_SCRUB_RANGE, HERO_SCRUB } from '../config';

export function scrubTimeFromX(clientX: number, viewportWidth: number) {
  const position = Math.min(1, Math.max(0, clientX / Math.max(1, viewportWidth - 1)));
  const { left, center, right } = HERO_SCRUB_RANGE;

  return position <= 0.5
    ? left + (center - left) * position * 2
    : center + (right - center) * (position - 0.5) * 2;
}

export function smoothScrubTime(current: number, target: number, deltaMs: number) {
  // Match the response at different refresh rates and avoid a jump after tab inactivity.
  const elapsed = Math.min(50, Math.max(0, deltaMs));
  const blend = 1 - Math.exp(-elapsed / HERO_SCRUB.smoothingMs);
  return current + (target - current) * blend;
}
