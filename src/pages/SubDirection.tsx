import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { NotFound } from '@/pages/Misc';
import { getDirection, getSub } from '@/data/taxonomy';
import { domainsFor, offeringsFor } from '@/data/offerings';
import { useT, useUI, useLang } from '@/lib/i18n';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import {
  CardLink, CtaBand, FilterChips, Reveal, SectionHeader, StageTag, WordReveal, accentVars, Button,
} from '@/components/ui';
import { Glossed } from '@/components/Glossary';
import { Figure } from '@/components/Media';
import { ChainPosition } from '@/components/ChainPosition';
import { useFlip } from '@/lib/useFlip';
import { photoForSub } from '@/data/media';
import type { Stage } from '@/lib/types';

/**
 * P03 SUB-DIRECTION PORTFOLIO — brief §9.
 * Hero · definition · stage & domain filters · offering cards · related · CTA.
 * This is the template that lets the portfolio grow into the hundreds without
 * touching navigation (§19).
 */
export default function SubDirection() {
  const { direction, sub } = useParams();
  const d = getDirection(direction ?? '');
  const s = getSub(direction ?? '', sub ?? '');
  const t = useT();
  const ui = useUI();
  const lang = useLang();

  const [stage, setStage] = useState<Stage | null>(null);
  const [domain, setDomain] = useState<string | null>(null);

  const all = useMemo(() => (d && s ? offeringsFor(d.id, s.slug) : []), [d, s]);
  const domains = useMemo(() => (d && s ? domainsFor(d.id, s.slug) : []), [d, s]);

  const results = useMemo(
    () => all.filter((o) => (!stage || o.stages.includes(stage)) && (!domain || o.domains.includes(domain))),
    [all, stage, domain],
  );
  // Cards travel to their new positions instead of teleporting there.
  const gridRef = useFlip(results.map((o) => o.slug).join(','));

  if (!d || !s) return <NotFound />;

  return (
    <div style={accentVars(d.id)}>
      <section className="relative border-b border-line bg-milk overflow-hidden">
        <span aria-hidden className="absolute inset-x-0 top-0 h-1 bg-[var(--accent)]" />
        <div className="shell">
          <Breadcrumbs trail={[{ label: t(d.label), to: `/${d.id}` }, { label: t(s.label) }]} />
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center pb-14 md:pb-20 pt-4">
            <div className="lg:col-span-7">
              <p className="eyebrow text-[var(--accent-ink)]">{t(d.label)}</p>
              <h1 className="text-[clamp(2rem,4.6vw,3.75rem)] font-bold mt-3 tracking-[-0.028em]">
                <WordReveal text={t(s.label)} />
              </h1>
              <p className="lede mt-5"><Glossed text={t(s.purpose)} /></p>
              <div className="mt-8 max-w-md">
                <ChainPosition stages={s.stages} compact />
              </div>
            </div>
            <Reveal delay={100} className="lg:col-span-5">
              <Figure
                photo={photoForSub(d.id, s.slug)}
                ratio="4/3"
                priority
                sizes="(max-width: 1024px) 100vw, 38vw"
                className="rounded-none border border-line"
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Filters — §12.2: visible selected state, keyboard operable */}
      <section className="shell py-12 md:py-16">
        <div className="flex flex-col gap-4 pb-8 border-b border-line">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <span className="eyebrow">{ui('filterByStage')}</span>
            <FilterChips
              legend={ui('filterByStage')}
              options={s.stages}
              value={stage}
              onChange={setStage}
              renderLabel={(v) => ui(v as never)}
            />
          </div>
          {domains.length > 1 && (
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <span className="eyebrow">{ui('filterByDomain')}</span>
              <FilterChips
                legend={ui('filterByDomain')}
                options={domains}
                value={domain}
                onChange={setDomain}
                renderLabel={(v) => v.replace(/-/g, ' ')}
              />
            </div>
          )}
          <div className="flex items-center gap-4">
            <p className="text-[0.8125rem] text-muted" aria-live="polite">
              {results.length} {ui('resultCount')}
            </p>
            {(stage || domain) && (
              <button
                type="button"
                onClick={() => { setStage(null); setDomain(null); }}
                className="text-[0.8125rem] font-medium text-brand-deep hover:underline"
              >
                {ui('clearFilters')}
              </button>
            )}
          </div>
        </div>

        {results.length > 0 ? (
          <div ref={gridRef} className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map((o) => (
              <div key={o.slug} data-flip={o.slug} className="h-full">
                <CardLink
                  to={`/${o.direction}/${o.sub}/${o.slug}`}
                  direction={d.id}
                  title={t(o.title)}
                  description={t(o.summary)}
                  tags={[...o.stages.map((st) => ui(st as never)), ...o.domains.slice(0, 2)]}
                  shortlist={{ direction: o.direction, sub: o.sub, slug: o.slug }}
                  className="h-full"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-10 border border-dashed border-line rounded-none p-10 text-center">
            <p className="text-[0.9375rem] text-slate">{ui('noResults')}</p>
            <Button variant="secondary" className="mt-5" onClick={() => { setStage(null); setDomain(null); }}>
              {ui('clearFilters')}
            </Button>
          </div>
        )}
      </section>

      {/* Sibling sub-directions — cross-navigation without duplicating content (§12.3) */}
      <section className="bg-milk border-y border-line">
        <div className="shell py-14 md:py-20">
          <SectionHeader title={`${t(d.label)} · ${ui('subDirections')}`} />
          <ul className="flex flex-wrap gap-2">
            {d.subs.filter((x) => x.slug !== s.slug).map((x) => (
              <li key={x.slug}>
                <CardLink
                  to={`/${d.id}/${x.slug}`}
                  direction={d.id}
                  title={t(x.label)}
                  className="min-w-[14rem]"
                />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand
        direction={d.id}
        title={lang === 'ka' ? `${t(s.label)} — მოთხოვნა` : `Request ${t(s.label).toLowerCase()}`}
        body={t(s.definition)}
        primary={{ cta: s.primaryCta }}
        secondary={s.secondaryCta ? { cta: s.secondaryCta } : undefined}
      />
    </div>
  );
}
