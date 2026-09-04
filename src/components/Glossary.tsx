import { Fragment, useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { getTerm, glossSegments } from '@/data/glossary';
import { useLang, useT } from '@/lib/i18n';
import { useReducedMotion } from '@/lib/useReducedMotion';

/**
 * INLINE GLOSSARY — brief §12.3.
 *
 * Two decisions worth stating, because both were the other way round first.
 *
 * The panel holds no links or controls. A hover-opened tooltip containing
 * something interactive is a trap: a keyboard user can reach the term but not
 * what is inside it, and a pointer user has to cross a gap to click it. Anything
 * you might want to click lives on the glossary page instead, so the panel can
 * stay a plain `role="tooltip"` that describes its trigger.
 *
 * The panel is portalled to the body and positioned fixed. Sections on this site
 * clip their overflow — the hero bands, the card grids — and an absolutely
 * positioned panel inside them gets its bottom half cut off.
 */

const OPEN_DELAY = 110;
const CLOSE_DELAY = 180;

export function Term({ id, children }: { id: string; children: string }) {
  const entry = getTerm(id);
  const t = useT();
  const reduced = useReducedMotion();
  const panelId = useId();
  const ref = useRef<HTMLButtonElement>(null);
  const timer = useRef<number | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ x: number; y: number; above: boolean } | null>(null);

  const place = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    // Flip above the term when there is not room below it, and clamp the centre
    // so a term at the edge of the viewport does not push the panel off-screen.
    const width = Math.min(340, window.innerWidth - 32);
    const above = r.bottom + 170 > window.innerHeight && r.top > 190;
    const x = Math.min(Math.max(r.left + r.width / 2, width / 2 + 16), window.innerWidth - width / 2 - 16);
    setPos({ x, y: above ? r.top - 10 : r.bottom + 10, above });
  }, []);

  const show = useCallback(() => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => { place(); setOpen(true); }, OPEN_DELAY);
  }, [place]);

  const hide = useCallback((immediate = false) => {
    window.clearTimeout(timer.current);
    if (immediate) setOpen(false);
    else timer.current = window.setTimeout(() => setOpen(false), CLOSE_DELAY);
  }, []);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') hide(true); };
    // Scrolling moves the trigger out from under a fixed panel, so close rather
    // than chase it. Capture, because the scroll may be inside a nested region.
    const onScroll = () => hide(true);
    document.addEventListener('keydown', onKey);
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', onScroll);
    return () => {
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', onScroll);
    };
  }, [open, hide]);

  if (!entry) return <>{children}</>;

  return (
    <>
      <button
        ref={ref}
        type="button"
        aria-describedby={open ? panelId : undefined}
        aria-expanded={open}
        // Hover is for pointers only; a touch "hover" would open the panel and
        // then immediately toggle it shut on the click that follows.
        onPointerEnter={(e) => { if (e.pointerType === 'mouse') show(); }}
        onPointerLeave={(e) => { if (e.pointerType === 'mouse') hide(); }}
        // Only keyboard focus opens it. Without the :focus-visible guard a mouse
        // click opened the panel on focus and the click handler closed it again
        // one render later, so clicking a term appeared to do nothing.
        onFocus={(e) => { if (e.currentTarget.matches(':focus-visible')) { place(); setOpen(true); } }}
        onBlur={() => hide(true)}
        onClick={() => { window.clearTimeout(timer.current); place(); setOpen((o) => !o); }}
        className="term"
      >
        {children}
      </button>

      {open && pos && createPortal(
        <span
          id={panelId}
          role="tooltip"
          onMouseEnter={() => window.clearTimeout(timer.current)}
          onMouseLeave={() => hide()}
          style={{
            left: pos.x,
            top: pos.y,
            transform: `translate(-50%, ${pos.above ? '-100%' : '0'})`,
          }}
          className={`fixed z-[80] w-[min(21.25rem,calc(100vw-2rem))] bg-ink text-milk rounded-[2px]
            px-4 py-3.5 shadow-lg-x pointer-events-auto ${reduced ? '' : 'term-panel-in'}`}
        >
          <span className="block font-display text-[0.9375rem] font-semibold leading-snug">
            {t(entry.term)}
          </span>
          {entry.aka && (
            <span className="block mt-0.5 font-mono text-[0.6875rem] tracking-[0.06em] text-milk/55">
              {t(entry.aka)}
            </span>
          )}
          <span className="block mt-2 text-[0.8125rem] leading-[1.55] text-milk/85">
            {t(entry.definition)}
          </span>
        </span>,
        document.body,
      )}
    </>
  );
}

/**
 * Marks glossary terms inside a plain string.
 *
 * Takes a string rather than children on purpose: it must not walk a React tree
 * and risk marking up text that is already inside a link or a heading.
 */
export function Glossed({ text }: { text: string }) {
  const lang = useLang();
  const segments = useMemo(() => glossSegments(text, lang), [text, lang]);

  return (
    <>
      {segments.map((seg, i) =>
        typeof seg === 'string'
          ? <Fragment key={i}>{seg}</Fragment>
          : <Term key={i} id={seg.id}>{seg.text}</Term>,
      )}
    </>
  );
}
