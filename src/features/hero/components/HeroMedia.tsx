import type { RefObject } from 'react';
import { publicAsset } from '../../../shared/lib/publicAsset';
import { HERO_MEDIA } from '../config';
import { HeroWordmark } from './HeroWordmark';
import type { HeroWordmarkHandle } from '../lib/createHeroWordmarkController';

interface HeroMediaProps {
  videoRef: RefObject<HTMLVideoElement>;
  videoReady: boolean;
  wordmarkRef: RefObject<HeroWordmarkHandle>;
}

export function HeroMedia({ videoRef, videoReady, wordmarkRef }: HeroMediaProps) {
  return (
    <>
      <video
        src={publicAsset(HERO_MEDIA.background)}
        poster={publicAsset(HERO_MEDIA.poster)}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
        tabIndex={-1}
        className="hero-background-video absolute inset-0 z-0 w-full h-full object-cover pointer-events-none select-none"
      />

      {/* Full-height foreground; feathered sides blend into the turquoise halo. */}
      <div
        className="hero-video-wrap absolute inset-0 z-10 flex justify-center items-center"
        style={{ touchAction: 'pan-y' }}
      >
        <div className="hero-video-frame">
          <div className="hero-video-halo" aria-hidden="true" />
          <video
            ref={videoRef}
            src={publicAsset(HERO_MEDIA.foreground)}
            muted
            playsInline
            preload="auto"
            className={`hero-video object-contain mx-auto select-none max-w-none ${
              videoReady ? 'video-in' : 'opacity-0'
            }`}
          />
          <HeroWordmark ref={wordmarkRef} />
        </div>
      </div>
    </>
  );
}
