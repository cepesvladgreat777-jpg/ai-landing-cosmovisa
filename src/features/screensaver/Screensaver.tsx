import { createPortal } from 'react-dom';
import { AnimatedWordmark } from '../../shared/ui/wordmark';
import { SCREENSAVER_COPY } from './config';
import { useScreensaver } from './model/useScreensaver';

export function Screensaver() {
  const { phase, activateButton, activate, finishExit } = useScreensaver();
  if (phase === 'active') return null;
  const waiting = phase === 'waiting';
  const closing = phase === 'closing';

  return createPortal(
    <div
      className={`page-idle-wordmark${closing ? ' page-idle-wordmark--closing' : ''}`}
      role={waiting ? 'dialog' : undefined}
      aria-modal={waiting || undefined}
      aria-hidden={closing || undefined}
      aria-label={SCREENSAVER_COPY.label}
      data-lenis-prevent
    >
      <AnimatedWordmark visible={waiting} split={false} onExitComplete={finishExit} />
      <button
        ref={activateButton}
        type="button"
        disabled={closing}
        tabIndex={closing ? -1 : 0}
        className="page-idle-activate"
        onClick={activate}
      >
        <span className="page-idle-prompt">{SCREENSAVER_COPY.activate}</span>
      </button>
    </div>,
    document.body,
  );
}
