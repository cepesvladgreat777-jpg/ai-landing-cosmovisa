/** Lock background interaction and restore the exact previous state on cleanup. */
export function lockPage(focusTarget: HTMLElement | null) {
  const root = document.getElementById('root');
  const previousInert = root?.inert ?? false;
  const previousOverflow = document.body.style.overflow;
  const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  if (root) root.inert = true;
  document.body.style.overflow = 'hidden';
  focusTarget?.focus({ preventScroll: true });
  return () => {
    if (root) root.inert = previousInert;
    document.body.style.overflow = previousOverflow;
    if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
  };
}
