import type { Variants } from 'framer-motion';
import { WORDMARK_DURATION, type WordmarkSpark } from './config';

export function createWordmarkVariants(reduced: boolean, lightweight: boolean) {
  const { enter, exit, reduced: short } = WORDMARK_DURATION;
  const container: Variants = {
    hidden: { opacity: 0, y: reduced ? 0 : 36, scale: reduced ? 1 : 0.94 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: reduced ? short : enter, ease: [0.22, 0.61, 0.36, 1] },
    },
    burst: { opacity: 0, transition: { delay: reduced ? 0 : 1.6, duration: reduced ? short : 0.8 } },
  };
  const letter = (index: number): Variants => ({
    hidden: {
      opacity: 0,
      y: reduced ? 0 : 18,
      scale: reduced ? 1 : 0.94,
      filter: reduced || lightweight ? 'blur(0px)' : 'blur(14px)',
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      rotate: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        delay: reduced ? 0 : index * 0.06,
        duration: reduced ? short : enter,
        ease: [0.22, 0.61, 0.36, 1],
      },
    },
    burst: reduced
      ? { opacity: 0, transition: { duration: short } }
      : {
          x: (index - 4) * 28 + Math.sin(index * 1.7) * 24,
          y: -60 - (index % 3) * 26 + (index % 2 ? 25 : -12),
          rotate: (index - 4) * 4,
          scale: 1.12,
          opacity: 0,
          filter: lightweight ? 'blur(0px)' : 'blur(18px)',
          transition: { duration: enter, delay: index * 0.025, ease: [0.4, 0, 0.6, 1] },
        },
  });
  const orbit: Variants = {
    hidden: { opacity: 0, scale: 0.65, rotate: -24 },
    visible: { opacity: 0, scale: 0.65, rotate: -24 },
    burst: {
      opacity: [0, 0.95, 0.65, 0],
      scale: [0.65, 1, 1.35, 1.8],
      rotate: [-24, -14, 0, 14],
      transition: { duration: exit, times: [0, 0.18, 0.55, 1], ease: 'easeInOut' },
    },
  };
  const particle = (spark: WordmarkSpark, index: number): Variants => ({
    hidden: { opacity: 0, x: 0, y: 0, scale: 0 },
    visible: { opacity: 0, x: 0, y: 0, scale: 0 },
    burst: {
      opacity: [0, 0.65, 0],
      x: [0, spark.x],
      y: [0, spark.y],
      scale: [0.4, 1.3, 0],
      transition: { duration: 2 + (index % 4) * 0.1, ease: 'easeInOut' },
    },
  });
  return { container, letter, orbit, particle };
}
