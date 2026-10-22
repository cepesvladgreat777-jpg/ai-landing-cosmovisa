// Clip-specific poses: exclude the return-to-center tail at the right edge.
export const HERO_SCRUB_RANGE = { left: 3.2, center: 4.6, right: 6.7 } as const;
export const HERO_SCRUB = {
  smoothingMs: 240,
  settleTolerance: 0.001,
  movingSeekTolerance: 0.005,
  settledSeekTolerance: 0.0001,
  wordmarkIdleMs: 180,
} as const;
export const HERO_MEDIA = {
  foreground: '/hero-sharp.mp4',
  background: '/hero-background.mp4',
  poster: '/hero-background.png',
} as const;
