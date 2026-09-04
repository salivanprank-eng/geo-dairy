import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon } from 'lucide-react';
import { DIRECTIONS, SUB_DIRECTIONS, getDirection } from '@/data/taxonomy';
import { OFFERINGS } from '@/data/offerings';
import { useLang, useT, useUI } from '@/lib/i18n';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { CardLink, FilterChips, Tag } from '@/components/ui';
import type { DirectionId, Stage } from '@/lib/types';

/**
 * P15 SEARCH / RESULTS — brief §9.
 * Cross-site discovery over the taxonomy itself plus the offering portfolio,
 * filtered by direction and value-chain stage. Zero-result queries are logged
 * as a content-quality signal in production (§16.1).
 */

type Result = {
  key: string; to: string; kind: 'direction' | 'sub' | 'offering';
  direction: DirectionId; title: string; description: string; stages: Stage[]; haystack: string;
  /** Offering rows only — what the shortlist needs to store the result. */
  sub?: string; slug?: string;
};

export default function Search() {
  const [params, setParams] = useSearchParams();
  const q = params.get('q') ?? '';
  const [direction, setDirection] = useState<DirectionId | null>(null);
  const [stage, setStage] = useState<Stage | null>(null);
  const t = useT();
  const ui = useUI();
  const lang = useLang();

  const index: Result[] = useMemo(() => {
    const rows: Result[] = [];
    for (const d of DIRECTIONS) {
      rows.push({
        key: `d-${d.id}`, to: `/${d.id}`, kind: 'direction', direction: d.id,
        title: t(d.label), description: t(d.definition),
        stages: [...new Set(d.subs.flatMap((s) => s.stages))],
        haystack: `${d.label.en} ${d.label.ka} ${d.definition.en} ${d.definition.ka}`.toLowerCase(),
      });
    }
    for (const s of SUB_DIRECTIONS) {
      rows.push({
        key: `s-${s.direction}-${s.slug}`, to: `/${s.direction}/${s.slug}`, kind: 'sub', direction: s.direction,
        title: t(s.label), description: t(s.definition), stages: s.stages,
        haystack: `${s.label.en} ${s.label.ka} ${s.definition.en} ${s.definition.ka} ${s.purpose.en}`.toLowerCase(),
      });
    }
    for (const o of OFFERINGS) {
      rows.push({
        key: `o-${o.direction}-${o.slug}`, to: `/${o.direction}/${o.sub}/${o.slug}`, kind: 'offering', direction: o.direction,
        sub: o.sub, slug: o.slug,
        title: t(o.title), description: t(o.summary), stages: o.stages,
        haystack: `${o.title.en} ${o.title.ka} ${o.summary.en} ${o.summary.ka} ${o.domains.join(' ')}`.toLowerCase(),
      });
    }
    return rows;
  }, [t]);

  const results = useMemo(() => {
    const terms = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
    return index.filter((r) => {
      if (direction && r.direction !== direction) return false;
      if (stage && !r.stages.includes(stage)) return false;
      if (!terms.length) return true;
      return terms.every((term) => r.haystack.includes(term) || r.title.toLowerCase().includes(term));
    });
  }, [index, q, direction, stage]);

  const KIND_LABEL: Record<Result['kind'], string> = {
    direction: lang === 'ka' ? 'მიმართულება' : 'Direction',
    sub: lang === 'ka' ? 'ქვემიმართულება' : 'Sub-direction',
    offering: lang === 'ka' ? 'შეთავაზება' : 'Offering',
  };

  return (
    <>
      <section className="border-b border-line bg-milk">
        <div className="shell">
          <Breadcrumbs trail={[{ label: ui('search') }]} />
          <div className="pb-10 md:pb-14 pt-4">
            <h1 className="text-[clamp(1.875rem,4vw,3rem)] font-bold">{ui('search')}</h1>
            <div className="mt-6 relative max-w-2xl">
              <SearchIcon size={18} aria-hidden className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
              <label htmlFor="site-search" className="sr-only">{ui('search')}</label>
              <input
                id="site-search"
                type="search"
                value={q}
                onChange={(e) => setParams(e.target.value ? { q: e.target.value } : {}, { replace: true })}
                placeholder={ui('searchPlaceholder')}
                className="w-full bg-cream border border-line rounded-none pl-11 pr-4 py-3.5 text-[1rem] focus:border-brand transition-colors"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="shell py-10 md:py-14">
        <div className="flex flex-col gap-4 pb-7 border-b border-line">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <span className="eyebrow">{ui('directions')}</span>
            <FilterChips
              legend={ui('directions')}
              options={DIRECTIONS.map((d) => d.id)}
              value={direction}
              onChange={setDirection}
              renderLabel={(v) => t(getDirection(v)!.label)}
            />
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <span className="eyebrow">{ui('filterByStage')}</span>
            <FilterChips
              legend={ui('filterByStage')}
              options={['upstream', 'midstream', 'downstream', 'cross-chain'] as Stage[]}
              value={stage}
              onChange={setStage}
              renderLabel={(v) => ui(v as never)}
            />
          </div>
          <p className="text-[0.8125rem] text-muted" aria-live="polite">
            {results.length} {lang === 'ka' ? 'შედეგი' : 'results'}
          </p>
        </div>

        {results.length > 0 ? (
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map((r) => (
              <CardLink
                key={r.key}
                to={r.to}
                direction={r.direction}
                index={KIND_LABEL[r.kind]}
                title={r.title}
                description={r.description}
                tags={r.stages.map((s) => ui(s as never))}
                shortlist={r.sub && r.slug ? { direction: r.direction, sub: r.sub, slug: r.slug } : undefined}
              />
            ))}
          </div>
        ) : (
          <div className="mt-8 border border-dashed border-line rounded-none p-12 text-center">
            <p className="text-[0.9375rem] text-slate">
              {lang === 'ka'
                ? 'შედეგი ვერ მოიძებნა. სცადეთ ნავიგატორი.'
                : 'Nothing matched. The Navigator may find it faster than a keyword.'}
            </p>
          </div>
        )}
      </section>
    </>
  );
}
