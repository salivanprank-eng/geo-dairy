import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/lib/useReducedMotion';

/**
 * Reports how far a section has travelled across the viewport, as a CSS
 * variable on the element itself.
 *
 * `--p` (drift, rest 0.5) and `--r` (reveal, rest 1) both run 0 → 1 from "the section's top edge is at the bottom of the
 * viewport" to "its bottom edge is at the top". Everything that wants to move
 * laterally reads that one number, so the whole section shares a single clock
 * and the parts stay in step.
 *
 * It writes a custom property rather than React state on purpose. Scroll fires
 * dozens of times a second, and re-rendering a section full of photographs and
 * a WebGL canvas at that rate is how a page that looks expensive starts feeling
 * cheap. The variable is set on the DOM node; the compositor does the rest.
 *
 * Under `prefers-reduced-motion` the listener is never attached and `--p` stays
 * at its rest value, so every `translate` derived from it evaluates to zero.
 */
export function useSectionProgress<T extends HTMLElement>(enabled = true) {
  const ref = useRef<T>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Disabled means "show the finished state", not "show nothing": anything
    // that reveals itself as `--p` climbs has to already be revealed.
    // Two variables, because "at rest" means opposite things to the two kinds
    // of effect that read them. Drift wants the midpoint, where every
    // translate evaluates to zero; a reveal wants the end, fully drawn.
    if (!enabled || reduced) {
      el.style.setProperty('--p', '0.5');
      el.style.setProperty('--r', '1');
      return;
    }

    let frame = 0;
    const measure = () => {
      frame = 0;
      const r = el.getBoundingClientRect();
      const span = window.innerHeight + r.height;
      // 0 when the section is about to enter, 1 when it has just left.
      const p = span > 0 ? (window.innerHeight - r.top) / span : 0.5;
      const c = Math.min(1, Math.max(0, p));
      el.style.setProperty('--p', String(c));
      el.style.setProperty('--r', String(c));
    };
    // Coalesced to one write per frame: scroll events arrive faster than the
    // compositor can use them, and reading layout on every one of them is what
    // makes parallax janky rather than the transform itself.
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(measure); };

    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [reduced, enabled]);

  return ref;
}
