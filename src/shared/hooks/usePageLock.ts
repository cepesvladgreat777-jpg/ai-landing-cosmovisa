import { useEffect, type RefObject } from 'react';
import { lockPage } from '../lib/lockPage';

export function usePageLock(locked: boolean, focusTarget: RefObject<HTMLElement>) {
  useEffect(() => {
    if (locked) return lockPage(focusTarget.current);
  }, [locked, focusTarget]);
}
