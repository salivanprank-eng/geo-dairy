import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useSearchParams } from 'react-router-dom';
import {
  EcosystemSection, TradeSection, ServiceSection, SupplySection, ProductionSection,
  type DirectionProps,
} from '@/components/home/Directions';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { useLang } from '@/lib/i18n';
import type { Stage } from '@/lib/types';

/**
 * THE FIVE DIRECTIONS, TWO WAYS.
 *
 * Both treatments render the same five components from the same data, switched
 * by `?directions=` so they can be judged on identical content rather than on
 * two different designs:
 *
 *   normal      no motion at all: everything already revealed, nothing drifts.
 *               The control against which the other two are judged, and the
 *               version anyone with `prefers-reduced-motion` effectively gets.
 *   lateral     (default) normal vertical scrolling; inside each section the
 *               parts drift sideways at different rates as it passes.
 *   horizontal  the five pin and travel sideways, then release.
 *
 * The horizontal treatment follows four rules, and they are the whole reason it
 * is defensible rather than annoying:
 *
 *   1. Length-honest. The wrapper is exactly as tall as the distance the track
 *      travels, so the scrollbar keeps predicting how much is left.
 *   2. Nothing hidden. Each panel fits one viewport; no panel scrolls inside
 *      itself. That is what `mode="panel"` enforces in the sections.
 *   3. Escape hatches. Five labels jump directly, arrow keys step, and the
 *      section releases the scroll cleanly at both ends.
 *   4. Honest fallback. Under reduced motion, or below the width where five
 *      full screens make sense, it renders the lateral version — not a
 *      squeezed copy of the horizontal one.
 */

type Mode = 'normal' | 'lateral' | 'horizontal';
const MODES: Mode[] = ['normal', 'lateral', 'horizontal'];

const PANELS: { id: string; stage: Stage; Component: (p: DirectionProps) => React.ReactElement }[] = [
  { id: 'ecosystem', stage: 'cross-chain', Component: EcosystemSection },
  { id: 'trade', stage: 'downstream', Component: TradeSection },
  { id: 'service', stage: 'cross-chain', Component: ServiceSection },
  { id: 'supply', stage: 'upstream', Component: SupplySection },
  { id: 'production', stage: 'midstream', Component: ProductionSection },
];

const LABELS: Record<string, { en: string; ka: string }> = {
  ecosystem: { en: 'Ecosystem', ka: 'ეკოსისტემა' },
  trade: { en: 'Trade', ka: 'ვაჭრობა' },
  service: { en: 'Service', ka: 'სერვისი' },
  supply: { en: 'Supply', ka: 'მომარაგება' },
  production: { en: 'Production', ka: 'წარმოება' },
};

/** Wide enough that five full screens are a considered choice, not a squeeze. */
const MIN_WIDTH = 1024;

function readMode(v: string | null): Mode {
  return (MODES as string[]).includes(v ?? '') ? (v as Mode) : 'lateral';
}

export function DirectionsShowcase() {
  const [params] = useSearchParams();
  const reduced = useReducedMotion();
  const [wide, setWide] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${MIN_WIDTH}px)`);
    const sync = () => setWide(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  const mode = readMode(params.get('directions'));
  // The horizontal treatment needs the width to be a choice rather than a
  // squeeze, and it is never the right answer under reduced motion.
  if (mode === 'horizontal' && wide && !reduced) return <HorizontalDirections />;
  return <StackedDirections motion={mode === 'lateral'} />;
}

/* -------------------------------------------------------------------------- */
/* Lateral — the default                                                      */
/* -------------------------------------------------------------------------- */

function StackedDirections({ motion }: { motion: boolean }) {
  return (
    <>
      {PANELS.map(({ id, stage, Component }) => (
        <div key={id} data-chain-stage={stage}>
          <Component motion={motion} />
        </div>
      ))}
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Horizontal — the alternative                                               */
/* -------------------------------------------------------------------------- */

function HorizontalDirections() {
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [pinned, setPinned] = useState(false);
  const lang = useLang();
  const travel = PANELS.length - 1;

  /** Scroll offset that puts panel `i` in the viewport. */
  const offsetFor = useCallback((i: number) => {
    const el = wrap.current;
    if (!el) return 0;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const distance = el.offsetHeight - window.innerHeight;
    return top + (i / travel) * distance;
  }, [travel]);

  useEffect(() => {
    const el = wrap.current;
    const tr = track.current;
    if (!el || !tr) return;

    let frame = 0;
    const measure = () => {
      frame = 0;
      const r = el.getBoundingClientRect();
      const distance = el.offsetHeight - window.innerHeight;
      const p = distance > 0 ? Math.min(1, Math.max(0, -r.top / distance)) : 0;
      // The track is moved with a custom property rather than React state: this
      // runs on every scroll frame, and re-rendering five panels — one of them
      // holding a WebGL canvas — at that rate is not survivable.
      tr.style.setProperty('--hz', String(p * travel));
      setIndex(Math.round(p * travel));
      setPinned(r.top <= 0 && r.bottom >= window.innerHeight);
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(measure); };

    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [travel]);

  // Left/Right step between panels while the section is pinned. Up/Down are
  // left alone: they are how a reader gets out of here.
  useEffect(() => {
    if (!pinned) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      const target = e.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
      e.preventDefault();
      const next = Math.min(travel, Math.max(0, index + (e.key === 'ArrowRight' ? 1 : -1)));
      window.scrollTo({ top: offsetFor(next), behavior: 'smooth' });
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [pinned, index, travel, offsetFor]);

  return (
    <div
      ref={wrap}
      data-chain-stage="cross-chain"
      /* Height is the travel distance plus the one screen that stays pinned.
         Any other number and the scrollbar starts lying. */
      style={{ height: `${PANELS.length * 100}vh` }}
      className="relative"
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <div ref={track} className="hz-track">
          {PANELS.map(({ id, Component }) => (
            <div key={id} className="hz-panel">
              <Component mode="panel" />
            </div>
          ))}
        </div>

        {/* Where you are, and a way out of order. */}
        <nav
          aria-label={lang === 'ka' ? 'მიმართულებები' : 'Directions'}
          className="absolute inset-x-0 bottom-0 z-20 flex items-center justify-center gap-1 pb-6"
        >
          {PANELS.map((p, i) => {
            const on = i === index;
            return (
              <button
                key={p.id}
                type="button"
                aria-current={on ? 'true' : undefined}
                onClick={() => window.scrollTo({ top: offsetFor(i), behavior: 'smooth' })}
                className={`px-3.5 py-2 rounded-full font-mono text-[0.625rem] uppercase tracking-[0.14em]
                  backdrop-blur-sm transition-colors duration-300
                  ${on
                    ? 'bg-ink text-milk'
                    : 'bg-milk/70 text-slate hover:bg-milk hover:text-ink border border-line'}`}
              >
                {String(i + 1).padStart(2, '0')} {lang === 'ka' ? LABELS[p.id].ka : LABELS[p.id].en}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

/**
 * PREVIEW SWITCH — temporary.
 *
 * Here so the two treatments can be compared on the real page rather than in
 * screenshots. It is not part of the design and should be deleted once the
 * choice is made; it is deliberately ugly enough that nobody forgets it.
 */
export function DirectionsModeSwitch() {
  const [params, setParams] = useSearchParams();
  const mode = readMode(params.get('directions'));

  const set = (m: Mode) => {
    const next = new URLSearchParams(params);
    if (m === 'lateral') next.delete('directions');
    else next.set('directions', m);
    setParams(next);
    window.scrollTo({ top: 0 });
  };

  // Portalled for the same reason as the chain rail: the page wrapper animates
  // a transform, and a transformed ancestor captures `position: fixed`.
  return createPortal(
    <div className="no-print fixed left-4 bottom-4 z-[70] flex items-center gap-1 rounded-full
      border border-dashed border-line-strong bg-milk/95 px-1.5 py-1.5 shadow-md-x backdrop-blur-sm">
      <span className="px-2 font-mono text-[0.5625rem] uppercase tracking-[0.14em] text-muted">
        preview
      </span>
      {MODES.map((m) => (
        <button
          key={m}
          type="button"
          onClick={() => set(m)}
          aria-pressed={mode === m}
          className={`px-3 py-1.5 rounded-full text-[0.75rem] font-medium transition-colors duration-200 ${
            mode === m ? 'bg-ink text-milk' : 'text-slate hover:text-ink hover:bg-mist'
          }`}
        >
          {m}
        </button>
      ))}
    </div>,
    document.body,
  );
}
