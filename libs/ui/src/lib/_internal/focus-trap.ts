/**
 * Shared focus-management helpers for overlay components (Dialog, Drawer).
 * Kept framework-agnostic and DOM-only so they are trivial to unit test.
 */

export const FOCUSABLE_SELECTOR =
  'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])';

/** All visible, focusable elements within `root`. */
export function getFocusable(root: HTMLElement, doc: Document): HTMLElement[] {
  return Array.from(
    root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
  ).filter((el) => el.offsetParent !== null || el === doc.activeElement);
}

/**
 * Cycle focus within `root` when Tab/Shift+Tab would otherwise leave it.
 * Call from a `keydown` handler; no-op for non-Tab keys.
 */
export function trapTabKey(
  event: KeyboardEvent,
  root: HTMLElement,
  doc: Document,
): void {
  if (event.key !== 'Tab') return;
  const focusable = getFocusable(root, doc);
  if (focusable.length === 0) {
    event.preventDefault();
    root.focus();
    return;
  }
  const first = focusable[0]!;
  const last = focusable[focusable.length - 1]!;
  const active = doc.activeElement;

  if (event.shiftKey && active === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && active === last) {
    event.preventDefault();
    first.focus();
  }
}

/** Move initial focus into `root` (first focusable, else the container). */
export function focusFirst(root: HTMLElement, doc: Document): void {
  (getFocusable(root, doc)[0] ?? root).focus();
}
