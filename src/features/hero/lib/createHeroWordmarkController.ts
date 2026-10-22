import { HERO_WORDMARK_SPARKS, WORDMARK_DURATION } from '../../../shared/ui/wordmark/config';

export interface HeroWordmarkHandle {
  setVisible: (visible: boolean) => void;
}

/** Browser-managed transform/opacity animations. No per-frame JS or React updates. */
export function createHeroWordmarkController(root: HTMLElement) {
  const letters = [...root.querySelectorAll<HTMLElement>('[data-letter-index]')];
  const orbits = [...root.querySelectorAll<HTMLElement>('.rest-wordmark-ring')];
  const sparks = [...root.querySelectorAll<HTMLElement>('[data-spark-index]')];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let visible = false;
  let animations: Animation[] = [];

  const cancel = () => {
    animations.forEach((animation) => animation.cancel());
    animations = [];
  };
  const animate = (element: HTMLElement, frames: Keyframe[], options: KeyframeAnimationOptions) => {
    animations.push(element.animate(frames, { fill: 'both', ...options }));
  };

  return {
    setVisible(next: boolean) {
      if (visible === next) return;
      visible = next;
      const reduced = reducedMotion.matches;
      // Snapshot before cancellation lets a fast direction change resume smoothly.
      const current = letters.map((letter) => {
        const style = getComputedStyle(letter);
        return {
          opacity: style.opacity,
          transform: reduced ? 'translate3d(0, 0, 0) rotate(0deg) scale(1)' : style.transform,
        };
      });
      cancel();
      letters.forEach((letter, position) => {
        const index = Number(letter.dataset.letterIndex);
        const x = (index - 4) * 28 + Math.sin(index * 1.7) * 24;
        const y = -60 - (index % 3) * 26 + (index % 2 ? 25 : -12);
        animate(
          letter,
          [
            current[position],
            {
              opacity: next ? 1 : 0,
              transform:
                reduced || next
                  ? 'translate3d(0, 0, 0) rotate(0deg) scale(1)'
                  : `translate3d(${x}px, ${y}px, 0) rotate(${(index - 4) * 4}deg) scale(1.12)`,
            },
          ],
          {
            duration: (reduced ? WORDMARK_DURATION.reduced : WORDMARK_DURATION.enter) * 1000,
            delay: reduced ? 0 : index * (next ? 60 : 25),
            easing: next ? 'cubic-bezier(0.22, 0.61, 0.36, 1)' : 'cubic-bezier(0.4, 0, 0.6, 1)',
          },
        );
      });
      if (next || reduced) return;

      orbits.forEach((orbit) =>
        animate(
          orbit,
          [
            { opacity: 0, transform: 'rotate(-24deg) scale(0.65)', offset: 0 },
            { opacity: 0.95, transform: 'rotate(-14deg) scale(1)', offset: 0.18 },
            { opacity: 0.65, transform: 'rotate(0deg) scale(1.35)', offset: 0.55 },
            { opacity: 0, transform: 'rotate(14deg) scale(1.8)', offset: 1 },
          ],
          { duration: WORDMARK_DURATION.exit * 1000, easing: 'ease-in-out' },
        ),
      );

      sparks.forEach((element) => {
        const index = Number(element.dataset.sparkIndex);
        const spark = HERO_WORDMARK_SPARKS[index];
        animate(
          element,
          [
            { opacity: 0, transform: 'translate3d(0, 0, 0) scale(0.4)', offset: 0 },
            { opacity: 0.65, offset: 0.35 },
            { opacity: 0, transform: `translate3d(${spark.x}px, ${spark.y}px, 0) scale(0)`, offset: 1 },
          ],
          { duration: 2000 + (index % 4) * 100, easing: 'ease-in-out' },
        );
      });
    },
    destroy: cancel,
  };
}
