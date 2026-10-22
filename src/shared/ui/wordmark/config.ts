export const WORDMARK = { full: 'Cosmovisa', parts: ['Cosmo', 'visa'] } as const;
export const WORDMARK_DURATION = { enter: 2.2, exit: 2.4, reduced: 0.15 } as const;

export const WORDMARK_SPARKS = Array.from({ length: 44 }, (_, index) => {
  const angle = (index / 44) * Math.PI * 2;
  const distance = 100 + (index % 5) * 35;
  return {
    x: Math.cos(angle) * distance,
    y: Math.sin(angle) * distance * 0.7,
    left: `${8 + ((index * 37) % 84)}%`,
    top: `${30 + ((index * 19) % 45)}%`,
    size: 2 + (index % 3),
    color: ['#39f3ff', '#ed8dff', '#edffff'][index % 3],
  };
});
export type WordmarkSpark = (typeof WORDMARK_SPARKS)[number];
// The video hero uses fewer particles to leave headroom for decoding frames.
export const HERO_WORDMARK_SPARKS = WORDMARK_SPARKS.filter((_, index) => index % 3 === 0);
