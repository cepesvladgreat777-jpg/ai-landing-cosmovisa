import { useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { WordmarkParticles } from './WordmarkParticles';
import { createWordmarkVariants } from './variants';

interface WordmarkPartProps {
  text: string;
  visible: boolean;
  lightweight: boolean;
  reducedMotion: boolean;
  onExitComplete?: () => void;
}

export function WordmarkPart({
  text,
  visible,
  lightweight,
  reducedMotion,
  onExitComplete,
}: WordmarkPartProps) {
  const variants = useMemo(
    () => createWordmarkVariants(reducedMotion, lightweight),
    [reducedMotion, lightweight],
  );
  return (
    <AnimatePresence onExitComplete={onExitComplete}>
      {visible && (
        <motion.div
          key="rest-wordmark"
          className="rest-wordmark"
          initial="hidden"
          animate="visible"
          exit="burst"
          variants={variants.container}
        >
          <span className="rest-wordmark-float">
            {[...text].map((letter, index) => (
              <motion.span key={index} className="rest-wordmark-letter" variants={variants.letter(index)}>
                {letter}
              </motion.span>
            ))}
          </span>
          {!reducedMotion && <WordmarkParticles lightweight={lightweight} variants={variants} />}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
