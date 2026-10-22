import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { HERO_WORDMARK_SPARKS, WORDMARK } from '../../../shared/ui/wordmark/config';
import { createHeroWordmarkController, type HeroWordmarkHandle } from '../lib/createHeroWordmarkController';

export const HeroWordmark = forwardRef<HeroWordmarkHandle>(function HeroWordmark(_, ref) {
  const root = useRef<HTMLDivElement>(null);
  const controller = useRef<ReturnType<typeof createHeroWordmarkController> | null>(null);

  useImperativeHandle(ref, () => ({ setVisible: (visible) => controller.current?.setVisible(visible) }), []);
  useEffect(() => {
    if (!root.current) return;
    const effect = createHeroWordmarkController(root.current);
    controller.current = effect;
    return () => {
      effect.destroy();
      controller.current = null;
    };
  }, []);

  return (
    <div
      ref={root}
      className="rest-wordmark-overlay hero-native-wordmark"
      data-native-wordmark
      aria-hidden="true"
    >
      {WORDMARK.parts.map((part, partIndex) => (
        <div
          key={part}
          className={`rest-wordmark-anchor rest-wordmark-anchor--${partIndex === 0 ? 'left' : 'right'}`}
        >
          <div className="rest-wordmark">
            <span className="rest-wordmark-float">
              {[...part].map((letter, index) => (
                <span key={index} className="rest-wordmark-letter" data-letter-index={index}>
                  {letter}
                </span>
              ))}
            </span>
            <span className="rest-wordmark-ring" />
            {HERO_WORDMARK_SPARKS.map((spark, index) => (
              <i
                key={index}
                className="rest-wordmark-spark"
                data-spark-index={index}
                style={{
                  left: spark.left,
                  top: spark.top,
                  width: spark.size,
                  height: spark.size,
                  backgroundColor: spark.color,
                  color: spark.color,
                }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
});
