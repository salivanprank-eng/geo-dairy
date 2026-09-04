import { Fragment, useEffect, useRef, useState, type ReactNode, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { useHref, useUI, useT, type UIKey } from '@/lib/i18n';
import type { CtaType, DirectionId, I18n, Stage } from '@/lib/types';
import { getDirection } from '@/data/taxonomy';
import { Figure } from '@/components/Media';
import type { PhotoKey } from '@/data/media';
import type { ShortlistItem } from '@/lib/shortlist';
import { ShortlistToggle } from '@/components/Shortlist';

/* ========================================================================== */
/* Direction accent helper                                                    */
/* ========================================================================== */

export function accentVars(direction?: DirectionId): CSSProperties {
  const d = direction ? getDirection(direction) : undefined;
  return {
    ['--accent' as string]: d?.accent ?? 'var(--color-brand)',
    ['--accent-ink' as string]: d?.accentInk ?? 'var(--color-brand-deep)',
  };
}

/* ========================================================================== */
/* Pointer tracking for the card spotlight                                    */
/* ========================================================================== */

/**
 * Feeds the pointer's position into the card as CSS custom properties.
 *
 * Writes are coalesced into one rAF per frame: without that, a fast drag across
 * a grid of cards fires a style write per mousemove event and the whole grid
 * judders. Nothing here runs unless the pointer is actually over a card.
 */
export function useCardPointer<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const frame = useRef(0);

  const onPointerMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || frame.current) return;
    const { clientX, clientY } = e;
    frame.current = requestAnimationFrame(() => {
      frame.current = 0;
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${((clientX - r.left) / r.width) * 100}%`);
      el.style.setProperty('--my', `${((clientY - r.top) / r.height) * 100}%`);
    });
  };

  useEffect(() => () => { if (frame.current) cancelAnimationFrame(frame.current); }, []);

  return { ref, onPointerMove };
}

/* ========================================================================== */
/* Reveal — one calm fade-up as a block enters view.                          */
/* Deliberately coarse: applied to sections and card grids, never to every    */
/* element, so the page settles instead of performing (§12.1).                */
/* ========================================================================== */

export function Reveal({
  children, delay = 0, as: Tag = 'div', className = '',
}: { children: ReactNode; delay?: number; as?: 'div' | 'section' | 'li'; className?: string }) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect(); } },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.06 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as never}
      data-shown={shown}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={`reveal ${className}`}
    >
      {children}
    </Tag>
  );
}

/* ========================================================================== */
/* Button — low radius, hairline borders, one elevation per state (§12.2)     */
/* ========================================================================== */

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'ghost-inverse' | 'inverse';

const BTN_BASE =
  'group/btn inline-flex items-center justify-center gap-2 font-medium text-[0.875rem] tracking-[-0.005em] ' +
  'px-5 py-3 rounded-none transition-[background-color,color,border-color,box-shadow,transform] duration-200 ' +
  'disabled:opacity-40 disabled:pointer-events-none active:translate-y-px whitespace-nowrap';

const BTN_VARIANT: Record<ButtonVariant, string> = {
  primary:
    'bg-[var(--accent-ink,var(--color-brand-deep))] text-milk shadow-sm-x hover:bg-ink',
  secondary:
    'bg-milk text-ink border border-line hover:border-line-strong hover:bg-parchment shadow-sm-x',
  ghost: 'text-ink hover:bg-mist',
  'ghost-inverse': 'text-milk border border-milk/25 hover:bg-milk/10 hover:border-milk/50',
  inverse: 'bg-milk text-ink hover:bg-signal shadow-sm-x',
};

export function Button({
  children, variant = 'primary', to, href, onClick, type = 'button', className = '', style, ...rest
}: {
  children: ReactNode;
  variant?: ButtonVariant;
  to?: string;
  href?: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
  className?: string;
  style?: CSSProperties;
} & Record<string, unknown>) {
  const langHref = useHref();
  const cls = `${BTN_BASE} ${BTN_VARIANT[variant]} ${className}`;

  if (to) return <Link to={langHref(to)} className={cls} style={style} {...rest}>{children}</Link>;
  if (href) {
    return (
      <a href={href} className={cls} style={style} target="_blank" rel="noreferrer noopener" {...rest}>
        {children}<ArrowUpRight size={15} aria-hidden />
      </a>
    );
  }
  return <button type={type} onClick={onClick} className={cls} style={style} {...rest}>{children}</button>;
}

/** A CTA rendered from the controlled taxonomy (§8.1) — never a bare "Contact us". */
export function CtaButton({
  cta, direction, sub, offering, variant = 'primary',
}: {
  cta: CtaType; direction?: string; sub?: string; offering?: string; variant?: ButtonVariant;
}) {
  const t = useUI();
  // §8.3.1 — the CTA carries page context into the form as query params.
  const params = new URLSearchParams({ type: cta });
  if (direction) params.set('direction', direction);
  if (sub) params.set('sub', sub);
  if (offering) params.set('offering', offering);

  return (
    <Button to={`/inquiry?${params.toString()}`} variant={variant}>
      {t(`cta.${cta}` as UIKey)}
      <ArrowRight size={15} aria-hidden className="transition-transform duration-200 group-hover/btn:translate-x-0.5" />
    </Button>
  );
}

/* ========================================================================== */
/* Tags — mono, quiet, architectural                                          */
/* ========================================================================== */

export function Tag({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'accent' }) {
  const base =
    'inline-block font-mono text-[0.6875rem] font-medium tracking-[0.08em] uppercase px-2 py-[0.1875rem] rounded-[2px] border';
  return (
    <span className={tone === 'accent'
      ? `${base} text-milk bg-[var(--accent,var(--color-brand))] border-transparent`
      : `${base} text-[var(--tag-fg)] bg-[var(--tag-bg)] border-[var(--tag-border)]`}>
      {children}
    </span>
  );
}

/** Value-chain stage tag — Upstream / Midstream / Downstream / Cross-Chain (§10.1). */
export function StageTag({ stage }: { stage: Stage }) {
  const t = useUI();
  return <Tag>{t(stage as UIKey)}</Tag>;
}

/* ========================================================================== */
/* Section header                                                              */
/* ========================================================================== */

export function SectionHeader({
  eyebrow, title, lede, action, id, index,
}: { eyebrow?: string; title: string; lede?: string; action?: ReactNode; id?: string; index?: string }) {
  return (
    <Reveal className="flex flex-wrap items-end justify-between gap-6 mb-10 md:mb-14">
      <div className="max-w-3xl">
        {(eyebrow || index) && (
          <p className="eyebrow mb-3 flex items-center gap-2.5">
            {index && <span className="text-[var(--accent-ink,var(--color-brand-deep))]">{index}</span>}
            {index && eyebrow && <span aria-hidden className="w-5 h-px bg-line-strong" />}
            {eyebrow}
          </p>
        )}
        <h2 id={id} className="h-section">{title}</h2>
        {lede && <p className="lede mt-4">{lede}</p>}
      </div>
      {action}
    </Reveal>
  );
}

/* ========================================================================== */
/* Card — modular, CMS-driven, no text-heavy mini-pages inside (§12.2)        */
/* ========================================================================== */

export function CardLink({
  to, title, description, tags, index, direction, className = '', photo, ratio = '4/3', cta, shortlist,
}: {
  to: string; title: string; description?: string; tags?: string[];
  index?: string; direction?: DirectionId; className?: string;
  photo?: PhotoKey; ratio?: '16/9' | '4/3' | '3/2'; cta?: string;
  /** Present on offerings, which can be collected; absent on everything else. */
  shortlist?: ShortlistItem;
}) {
  const href = useHref();
  const ui = useUI();
  const { ref, onPointerMove } = useCardPointer<HTMLDivElement>();

  return (
    <div
      ref={ref}
      onPointerMove={onPointerMove}
      style={accentVars(direction)}
      className={`card-i group flex flex-col bg-milk border border-line rounded-[2px] overflow-hidden ${className}`}
    >
      <span aria-hidden className="card-rule" />

      {photo && (
        <span className="relative block">
          <Figure photo={photo} ratio={ratio} sizes="(max-width: 768px) 100vw, 30vw" />
          {index && (
            <span className="absolute left-4 top-4 z-10 inline-block rounded-none bg-milk/92 px-2 py-1
              font-mono text-[0.625rem] font-medium uppercase tracking-[0.12em] text-[var(--accent-ink)]">
              {index}
            </span>
          )}
        </span>
      )}

      <span className="flex flex-col flex-1 p-6 md:p-7">
        {index && !photo && <span className="eyebrow mb-3 text-[var(--accent-ink)]">{index}</span>}
        <h3 className="card-title text-[1.1875rem] md:text-[1.3125rem] font-semibold leading-[1.25] tracking-[-0.015em]">
          <Link to={href(to)} className="card-link-stretch">{title}</Link>
        </h3>
        {description && (
          <span className="mt-3 block text-[0.9375rem] text-slate leading-[1.6]">{description}</span>
        )}
        {tags && tags.length > 0 && (
          <span className="mt-5 flex flex-wrap gap-1.5">{tags.map((tg) => <Tag key={tg}>{tg}</Tag>)}</span>
        )}

        <span className="mt-auto pt-5 flex items-center justify-between gap-3 border-t border-line/70">
          <span className="text-[0.8125rem] font-medium text-[var(--accent-ink)]">
            {cta ?? ui('explore')}
          </span>
          <span className="card-arrow text-[var(--accent-ink)]" aria-hidden>
            <ArrowRight size={15} />
            <ArrowRight size={15} />
          </span>
        </span>
      </span>

      {shortlist && (
        <ShortlistToggle item={shortlist} className="absolute right-3 top-3 z-20" />
      )}
    </div>
  );
}

/**
 * The card interaction without the card layout — for families that need their
 * own internals (the five directions, the audience routes) but should feel
 * identical under the pointer.
 */
export function CardShell({
  to, direction, className = '', flush = false, stubRule = false, children,
}: {
  to: string; direction?: DirectionId; className?: string;
  flush?: boolean; stubRule?: boolean; children: ReactNode;
}) {
  const href = useHref();
  const { ref, onPointerMove } = useCardPointer<HTMLAnchorElement>();
  return (
    <Link
      ref={ref}
      to={href(to)}
      onPointerMove={onPointerMove}
      style={accentVars(direction)}
      className={`card-i group ${flush ? 'is-flush' : ''} ${className}`}
    >
      <span aria-hidden className={`card-rule ${stubRule ? 'is-stub' : ''}`} />
      {children}
    </Link>
  );
}

/* ========================================================================== */
/* Filter chips — §12.2, visible selected state + keyboard operable            */
/* ========================================================================== */

export function FilterChips<T extends string>({
  legend, options, value, onChange, renderLabel,
}: {
  legend: string;
  options: T[];
  value: T | null;
  onChange: (v: T | null) => void;
  renderLabel: (v: T) => string;
}) {
  return (
    <fieldset className="flex flex-wrap items-center gap-2">
      <legend className="sr-only">{legend}</legend>
      {options.map((opt) => {
        const active = value === opt;
        return (
          <button
            key={opt}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(active ? null : opt)}
            className={`text-[0.8125rem] px-3.5 py-1.5 rounded-full border transition-colors duration-200 ${
              active
                ? 'bg-ink text-milk border-ink font-medium'
                : 'bg-milk text-slate border-line hover:border-line-strong hover:text-ink'
            }`}
          >
            {renderLabel(opt)}
          </button>
        );
      })}
    </fieldset>
  );
}

/* ========================================================================== */
/* CTA band — §12.2: one dominant conversion message                          */
/* ========================================================================== */

export function CtaBand({
  title, body, primary, secondary, direction,
}: {
  title: string; body?: string;
  primary: { cta: CtaType }; secondary?: { cta: CtaType };
  direction?: DirectionId; sub?: string;
}) {
  return (
    <section style={accentVars(direction)} className="no-print on-dark relative overflow-hidden bg-ink text-milk">
      <span aria-hidden className="absolute inset-x-0 top-0 h-[3px] bg-[var(--accent)]" />
      <div className="shell py-16 md:py-24">
        <Reveal className="max-w-3xl">
          <h2 className="h-section">{title}</h2>
          {body && <p className="mt-4 text-[1.0625rem] leading-relaxed text-mist/65 font-light max-w-2xl">{body}</p>}
          <div className="mt-8 flex flex-wrap gap-3">
            <CtaButton cta={primary.cta} direction={direction} variant="inverse" />
            {secondary && (
              <CtaButton cta={secondary.cta} direction={direction} variant="ghost-inverse" />
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ========================================================================== */
/* Bilingual text helper                                                       */
/* ========================================================================== */

export function T({ value }: { value: I18n }) {
  const t = useT();
  return <>{t(value)}</>;
}

/* ========================================================================== */
/* WordReveal — a masked, staggered entrance for one headline per page.       */
/* Reserved for H1s: on every heading it becomes a tic, not a treatment.      */
/* ========================================================================== */

export function WordReveal({
  text, accentFrom, className = '', step = 45,
}: { text: string; accentFrom?: number; className?: string; step?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(false);
  const words = text.split(' ');

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Headlines are usually above the fold, so reveal on the next frame rather
    // than waiting for an intersection that already happened.
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect(); } },
      { threshold: 0.1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <span ref={ref} data-shown={shown} className={`word-reveal ${className}`}>
      {words.map((w, i) => (
        // The space belongs BETWEEN the masks, not inside one: an inline-block
        // with overflow:hidden swallows its own trailing space and the headline
        // renders as one run-together word.
        <Fragment key={`${w}-${i}`}>
          <span className="w">
            <span
              style={{ ['--d' as string]: `${i * step}ms` }}
              className={accentFrom !== undefined && i >= accentFrom ? 'text-brand' : undefined}
            >
              {w}
            </span>
          </span>
          {i < words.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </span>
  );
}
