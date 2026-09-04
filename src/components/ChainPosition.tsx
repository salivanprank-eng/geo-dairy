import { Link } from 'react-router-dom';
import { useHref, useLang, useUI } from '@/lib/i18n';
import type { Stage } from '@/lib/types';

/**
 * CHAIN POSITION — where this capability sits in the dairy value chain.
 *
 * The brief's single hardest idea to land is that GEO Dairy operates across
 * Upstream → Midstream → Downstream rather than at one point of it (§1.2, §11).
 * The homepage says it once, in a diagram. This restates it in miniature on
 * every sub-direction and offering page, so the claim is demonstrated on the
 * hundredth page as well as the first — and it doubles as navigation into the
 * industry reference for each stage (§12.2 "related content").
 *
 * Two layouts, because one does not survive both homes:
 *   compact → a horizontal rail, for the full-width hero column
 *   default → a vertical list, for the narrow sticky sidebar, where three
 *             side-by-side labels collide into each other
 */

const STAGES: Exclude<Stage, 'cross-chain'>[] = ['upstream', 'midstream', 'downstream'];

export function ChainPosition({ stages, compact = false }: { stages: Stage[]; compact?: boolean }) {
  const ui = useUI();
  const href = useHref();
  const lang = useLang();
  const crossChain = stages.includes('cross-chain');
  const active = new Set(stages);

  return (
    <figure className={compact ? '' : 'border border-line rounded-none bg-milk p-5'}>
      <figcaption className="eyebrow mb-4 flex flex-wrap items-center gap-x-2.5 gap-y-1">
        {ui('stageCoverage')}
        {crossChain && (
          <>
            <span aria-hidden className="w-4 h-px bg-line-strong" />
            <span className="text-ecosystem-ink">{ui('cross-chain')}</span>
          </>
        )}
      </figcaption>

      <ol className={compact ? 'grid grid-cols-3 gap-2' : 'space-y-2.5'}>
        {STAGES.map((s, i) => {
          const on = active.has(s);
          return (
            <li key={s}>
              <Link
                to={href(`/industry/${s}`)}
                aria-current={on ? 'step' : undefined}
                className={`group focus-visible:outline-offset-4 ${
                  compact ? 'block' : 'flex items-center gap-3'
                }`}
              >
                <span
                  aria-hidden
                  className={`shrink-0 rounded-[1px] transition-colors duration-300 ${
                    compact ? 'block h-[3px] w-full' : 'block h-[3px] w-8'
                  } ${on ? 'bg-brand' : 'bg-line'}`}
                />
                <span className={`flex items-baseline gap-1.5 ${compact ? 'mt-2' : ''}`}>
                  <span className={`font-mono text-[0.625rem] tracking-[0.1em] ${on ? 'text-brand-deep' : 'text-muted/70'}`}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span
                    className={`text-[0.8125rem] transition-colors ${
                      on ? 'text-ink font-medium group-hover:text-brand-deep' : 'text-muted'
                    }`}
                  >
                    {ui(s as never)}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ol>

      {!compact && (
        <p className="mt-4 text-[0.8125rem] text-muted leading-snug">
          {crossChain
            ? (lang === 'ka'
              ? 'მოქმედებს ჯაჭვის ყველა რგოლში.'
              : 'Applies across every stage of the chain.')
            : (lang === 'ka'
              ? 'მონიშნული რგოლები აჩვენებს, სად მოქმედებს ეს შესაძლებლობა.'
              : 'The lit segments show where this capability acts.')}
        </p>
      )}
    </figure>
  );
}
