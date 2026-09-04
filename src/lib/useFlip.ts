import { useLayoutEffect, useRef } from 'react';

/**
 * FLIP — animate a filtered list from its previous layout to its new one.
 *
 * Filtering a portfolio normally teleports the surviving cards to new positions,
 * which forces the reader to re-find what they were looking at. Measuring before
 * and after and playing the difference keeps the eye attached to a card while it
 * moves (§12.2 — filters must have a visible, legible state change).
 *
 * Reduced motion skips straight to the new layout.
 */
export function useFlip<T>(deps: T, selector = '[data-flip]') {
  const container = useRef<HTMLDivElement>(null);
  const positions = useRef(new Map<string, DOMRect>());

  useLayoutEffect(() => {
    const root = container.current;
    if (!root) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const items = Array.from(root.querySelectorAll<HTMLElement>(selector));
    const next = new Map<string, DOMRect>();

    for (const el of items) {
      const key = el.dataset.flip!;
      const box = el.getBoundingClientRect();
      next.set(key, box);

      const prev = positions.current.get(key);
      if (reduced) continue;

      if (!prev) {
        // New arrival: fade it up rather than popping it into place.
        el.animate(
          [{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }],
          { duration: 380, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'both' },
        );
        continue;
      }

      const dx = prev.left - box.left;
      const dy = prev.top - box.top;
      if (Math.abs(dx) < 1 && Math.abs(dy) < 1) continue;

      el.animate(
        [{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'none' }],
        { duration: 460, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },
      );
    }

    positions.current = next;
  }, [deps, selector]);

  return container;
}
