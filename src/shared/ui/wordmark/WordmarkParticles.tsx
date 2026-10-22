import { motion } from 'framer-motion';
import { HERO_WORDMARK_SPARKS, WORDMARK_SPARKS } from './config';
import type { createWordmarkVariants } from './variants';

interface WordmarkParticlesProps {
  lightweight: boolean;
  variants: ReturnType<typeof createWordmarkVariants>;
}

export function WordmarkParticles({ lightweight, variants }: WordmarkParticlesProps) {
  const sparks = lightweight ? HERO_WORDMARK_SPARKS : WORDMARK_SPARKS;
  return (
    <>
      <motion.span className="rest-wordmark-ring" variants={variants.orbit} />
      {sparks.map((spark, index) => (
        <motion.i
          key={index}
          className="rest-wordmark-spark"
          style={{
            left: spark.left,
            top: spark.top,
            width: spark.size,
            height: spark.size,
            backgroundColor: spark.color,
            color: spark.color,
          }}
          variants={variants.particle(spark, index)}
        />
      ))}
    </>
  );
}
