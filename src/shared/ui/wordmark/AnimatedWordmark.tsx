import { useReducedMotion } from 'framer-motion';
import { WORDMARK } from './config';
import { WordmarkPart } from './WordmarkPart';

interface AnimatedWordmarkProps {
  visible: boolean;
  split?: boolean;
  onExitComplete?: () => void;
}

/** Shared visual effect; has no knowledge of video input or idle timers. */
export function AnimatedWordmark({ visible, split = true, onExitComplete }: AnimatedWordmarkProps) {
  const reducedMotion = !!useReducedMotion();
  const parts = split ? WORDMARK.parts : [WORDMARK.full];
  return (
    <div className="rest-wordmark-overlay" aria-hidden="true">
      {parts.map((text, index) => (
        <div
          key={text}
          className={`rest-wordmark-anchor rest-wordmark-anchor--${split ? (index === 0 ? 'left' : 'right') : 'whole'}`}
        >
          <WordmarkPart
            text={text}
            visible={visible}
            lightweight={split}
            reducedMotion={reducedMotion}
            onExitComplete={onExitComplete}
          />
        </div>
      ))}
    </div>
  );
}
