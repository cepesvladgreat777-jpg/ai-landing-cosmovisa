import { useEffect, useRef, useState } from 'react';
import { createHeroVideoController } from '../lib/createHeroVideoController';
import type { HeroWordmarkHandle } from '../lib/createHeroWordmarkController';

export function useHeroVideo() {
  const heroRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const wordmarkRef = useRef<HeroWordmarkHandle>(null);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    const hero = heroRef.current;
    const video = videoRef.current;
    if (!hero || !video) return;
    return createHeroVideoController({
      hero,
      video,
      onReady: () => setVideoReady(true),
      onRestChange: (visible) => wordmarkRef.current?.setVisible(visible),
    });
  }, []);

  return { heroRef, videoRef, videoReady, wordmarkRef };
}
