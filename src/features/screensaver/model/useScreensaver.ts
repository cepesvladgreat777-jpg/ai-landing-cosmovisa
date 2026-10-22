import { useCallback, useEffect, useRef, useState } from 'react';
import { isHeroVisible } from '../../../shared/lib/dom';
import { usePageLock } from '../../../shared/hooks/usePageLock';
import { createIdleController } from './createIdleController';

export type ScreensaverPhase = 'active' | 'waiting' | 'closing';

export function useScreensaver() {
  const [phase, setPhase] = useState<ScreensaverPhase>('active');
  const activateButton = useRef<HTMLButtonElement>(null);
  const controller = useRef<ReturnType<typeof createIdleController> | null>(null);

  useEffect(() => {
    const idle = createIdleController({
      isHeroVisible,
      onLock: () => setPhase('waiting'),
      onReturnToHero: () => setPhase('active'),
    });
    controller.current = idle;
    return () => {
      idle.destroy();
      controller.current = null;
    };
  }, []);

  usePageLock(phase === 'waiting', activateButton);

  const activate = useCallback(() => {
    controller.current?.resume();
    setPhase('closing');
  }, []);
  const finishExit = useCallback(() => {
    setPhase((current) => (current === 'closing' ? 'active' : current));
  }, []);

  return { phase, activateButton, activate, finishExit };
}
