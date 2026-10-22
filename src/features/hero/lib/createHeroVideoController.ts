import { HERO_SCRUB_RANGE, HERO_SCRUB } from '../config';
import { scrubTimeFromX, smoothScrubTime } from './scrub';

interface HeroVideoControllerOptions {
  hero: HTMLElement;
  video: HTMLVideoElement;
  onReady: () => void;
  onRestChange: (visible: boolean) => void;
}

/** Owns input listeners, one seek queue and one rAF loop. Returns full cleanup. */
export function createHeroVideoController({
  hero,
  video,
  onReady,
  onRestChange,
}: HeroVideoControllerOptions) {
  let targetTime: number = HERO_SCRUB_RANGE.center;
  let smoothTime: number = HERO_SCRUB_RANGE.center;
  const hasDuration = () => Number.isFinite(video.duration) && video.duration > 0;
  const clampTime = (time: number) => Math.min(Math.max(0, video.duration - 1 / 30), Math.max(0, time));
  const viewportWidth = () => document.documentElement.clientWidth || window.innerWidth;

  let restingRequested = true;
  let lastScrubAt = -Infinity;
  let frameTime = 0;
  let wordmarkShown = false;
  onRestChange(false);

  const showWordmark = (visible: boolean) => {
    if (wordmarkShown === visible) return;
    wordmarkShown = visible;
    onRestChange(visible);
  };

  const resetToCenter = () => {
    video.pause();
    restingRequested = true;
    if (hasDuration()) targetTime = clampTime(HERO_SCRUB_RANGE.center);
  };

  // The forward-facing pose is at 4.6s, rather than the middle of the clip.
  const onMeta = () => {
    if (!hasDuration()) return;
    video.pause();
    const center = clampTime(HERO_SCRUB_RANGE.center);
    restingRequested = true;
    showWordmark(false);
    targetTime = center;
    smoothTime = center;
    video.currentTime = center;
  };

  // Fade the video in once the centered frame is actually decoded.
  const onLoaded = () => {
    onReady();
  };

  // The browser processes one seek at a time. When a seek finishes, if the
  // smoothed target has moved on, chain another seek so none are dropped.
  const onSeeked = () => {
    requestSeek();
  };

  const requestSeek = () => {
    if (!hasDuration() || video.seeking) return;
    const nextTime = clampTime(smoothTime);
    const threshold =
      smoothTime === targetTime ? HERO_SCRUB.settledSeekTolerance : HERO_SCRUB.movingSeekTolerance;
    if (Math.abs(nextTime - video.currentTime) < threshold) return;
    video.currentTime = nextTime;
  };

  // Capture input across the hero, including over navigation and text.
  // Exclude the scrollbar width so the last content pixel reaches the right pose.
  const setTargetFromX = (clientX: number) => {
    if (!hasDuration()) return;
    restingRequested = false;
    lastScrubAt = frameTime;
    targetTime = clampTime(scrubTimeFromX(clientX, viewportWidth()));
    showWordmark(false);
  };

  const setTargetFromPoint = (clientX: number, clientY: number, hover: boolean) => {
    const heroBounds = hero.getBoundingClientRect();
    if (
      clientY <= heroBounds.top ||
      clientY >= heroBounds.bottom ||
      clientY <= 0 ||
      clientY >= window.innerHeight
    ) {
      resetToCenter();
      return;
    }

    const videoBounds = video.getBoundingClientRect();
    if (
      hover &&
      clientX >= videoBounds.left &&
      clientX <= videoBounds.right &&
      clientY >= videoBounds.top &&
      clientY <= videoBounds.bottom
    ) {
      resetToCenter();
      return;
    }

    setTargetFromX(clientX);
  };

  const onPointerMove = (e: PointerEvent) =>
    setTargetFromPoint(e.clientX, e.clientY, e.pointerType !== 'touch');

  const onVideoEnter = (e: PointerEvent) => {
    if (e.pointerType !== 'touch') resetToCenter();
  };

  const onHeroLeave = (e: PointerEvent) => {
    const bounds = hero.getBoundingClientRect();
    if (e.clientY <= bounds.top || e.clientY >= bounds.bottom) resetToCenter();
  };

  // Touch: same absolute mapping. Never preventDefault, so vertical scroll
  // stays native (the container also sets touch-action: pan-y).
  const onTouchMove = (e: TouchEvent) => {
    if (e.touches.length) {
      setTargetFromPoint(e.touches[0].clientX, e.touches[0].clientY, false);
    }
  };

  // Keep side exits at the profile pose; vertical exits return to neutral.
  const onPointerOut = (e: PointerEvent) => {
    if (e.relatedTarget !== null) return;
    const bounds = hero.getBoundingClientRect();
    if (
      e.clientY <= 0 ||
      e.clientY >= window.innerHeight - 1 ||
      e.clientY <= bounds.top ||
      e.clientY >= bounds.bottom
    ) {
      resetToCenter();
      return;
    }
    if (e.clientX <= 0) setTargetFromX(0);
    else if (e.clientX >= viewportWidth() - 1) setTargetFromX(viewportWidth() - 1);
  };

  // rAF loop: ease smoothTime toward targetTime, then seek to it.
  let rafId = 0;
  let previousFrame: number | undefined;
  const tick = (time: number) => {
    frameTime = time;
    const deltaMs = previousFrame === undefined ? 1000 / 60 : time - previousFrame;
    previousFrame = time;
    if (hasDuration()) {
      smoothTime = smoothScrubTime(smoothTime, targetTime, deltaMs);
      if (Math.abs(smoothTime - targetTime) < HERO_SCRUB.settleTolerance) {
        smoothTime = targetTime;
      }
      requestSeek();
      const settled =
        !video.seeking &&
        Math.abs(smoothTime - targetTime) < HERO_SCRUB.settleTolerance &&
        Math.abs(video.currentTime - targetTime) < HERO_SCRUB.movingSeekTolerance;
      showWordmark(
        video.readyState >= 2 &&
          settled &&
          (restingRequested || time - lastScrubAt >= HERO_SCRUB.wordmarkIdleMs),
      );
    }
    rafId = requestAnimationFrame(tick);
  };
  rafId = requestAnimationFrame(tick);

  video.addEventListener('loadedmetadata', onMeta);
  video.addEventListener('loadeddata', onLoaded);
  video.addEventListener('seeked', onSeeked);
  video.addEventListener('pointerenter', onVideoEnter);
  hero.addEventListener('pointerleave', onHeroLeave);
  window.addEventListener('pointermove', onPointerMove, { capture: true, passive: true });
  window.addEventListener('pointerdown', onPointerMove, { capture: true, passive: true });
  window.addEventListener('pointerout', onPointerOut, { capture: true, passive: true });
  window.addEventListener('touchstart', onTouchMove, { capture: true, passive: true });
  window.addEventListener('touchmove', onTouchMove, { capture: true, passive: true });
  window.addEventListener('scroll', resetToCenter, { passive: true });
  window.addEventListener('resize', resetToCenter, { passive: true });
  window.addEventListener('blur', resetToCenter);

  // Already buffered (e.g. fast cache / hot reload).
  if (video.readyState >= 1) onMeta();
  if (video.readyState >= 2) onLoaded();

  return () => {
    cancelAnimationFrame(rafId);
    video.removeEventListener('loadedmetadata', onMeta);
    video.removeEventListener('loadeddata', onLoaded);
    video.removeEventListener('seeked', onSeeked);
    video.removeEventListener('pointerenter', onVideoEnter);
    hero.removeEventListener('pointerleave', onHeroLeave);
    window.removeEventListener('pointermove', onPointerMove, true);
    window.removeEventListener('pointerdown', onPointerMove, true);
    window.removeEventListener('pointerout', onPointerOut, true);
    window.removeEventListener('touchstart', onTouchMove, true);
    window.removeEventListener('touchmove', onTouchMove, true);
    window.removeEventListener('scroll', resetToCenter);
    window.removeEventListener('resize', resetToCenter);
    window.removeEventListener('blur', resetToCenter);
  };
}
