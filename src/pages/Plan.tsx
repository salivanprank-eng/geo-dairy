import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, Check, Link2, RotateCcw } from 'lucide-react';
import {
  PLAN_BUILDS, PLAN_PHASES, PLAN_STARTS, assemblePlan, getBuild,
  type PlanScaleId, type PlanStartId,
} from '@/data/plans';
import { GEORGIA_REGIONS } from '@/data/regions';
import { COVERAGE_PLACEHOLDER } from '@/data/site';
import { getDirection, getSub } from '@/data/taxonomy';
import { useHref, useLang, useT, useUI } from '@/lib/i18n';
import { useShortlist } from '@/lib/shortlist';
import { ShortlistToggle } from '@/components/Shortlist';
import { Glossed } from '@/components/Glossary';
import { PrintButton, PrintFootnote, PrintHeader } from '@/components/Print';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Button, Reveal, Tag, accentVars, useCardPointer } from '@/components/ui';

/**
 * P17 PLAN YOUR BUILD — the configurator.
 *
 * The rest of the site is organised the way the business is organised. This page
 * is organised the way a project is: you say what you are building, at what size,
 * from what starting point, and it returns the bundle in the order the work
 * actually happens — with a reason attached to every line.
 *
 * The whole configuration lives in the query string, so a plan is a URL. That is
 * deliberate: these decisions are made by two or three people, and the one who
 * assembles it is rarely the one who signs it off. `/en/plan?build=dairy-farm&
 * scale=m&start=greenfield` can be pasted into an email.
 *
 * Nothing here invents commercial facts. The rules come from data/plans.ts; the
 * offerings, links and titles come from the same portfolio every other page
 * reads. No durations, no budgets — see the note in that file.
 */

const SCALE_KEYS: PlanScaleId[] = ['s', 'm', 'l'];

export default function Plan() {
  const [params, setParams] = useSearchParams();
  const t = useT();
  const ui = useUI();
  const lang = useLang();
  const href = useHref();
  const { toggle, has } = useShortlist();

  const build = getBuild(params.get('build'));
  const scaleParam = params.get('scale');
  const startParam = params.get('start');
  const region = params.get('region');

  const scale = build && SCALE_KEYS.includes(scaleParam as PlanScaleId)
    ? (scaleParam as PlanScaleId) : null;
  const start = build && build.starts.includes(startParam as PlanStartId)
    ? (startParam as PlanStartId) : null;

  /** Every control writes the same way: set one key, drop what it invalidates. */
  const set = (key: string, value: string | null, clear: string[] = []) => {
    const next = new URLSearchParams(params);
    if (value === null || next.get(key) === value) next.delete(key);
    else next.set(key, value);
    clear.forEach((k) => next.delete(k));
    setParams(next, { replace: false });
  };

  const plan = useMemo(
    () => (build && scale && start ? assemblePlan(build, scale, start) : null),
    [build, scale, start],
  );

  const allItems = useMemo(
    () => (plan ?? []).flatMap((p) => p.rows.map((r) => ({
      direction: r.offering.direction, sub: r.offering.sub, slug: r.offering.slug,
    }))),
    [plan],
  );
  const total = allItems.length;
  const allAdded = total > 0 && allItems.every((i) => has(i.slug));

  const regionRow = GEORGIA_REGIONS.find((r) => r.id === region);
  const regionStatus = region ? COVERAGE_PLACEHOLDER.status[region] : undefined;

  const inquiryHref = () => {
    const q = new URLSearchParams({ type: 'quote' });
    if (build) q.set('build', build.id);
    if (scale) q.set('scale', scale);
    if (start) q.set('start', start);
    if (region) q.set('region', region);
    if (allItems[0]) { q.set('direction', allItems[0].direction); q.set('sub', allItems[0].sub); }
    q.set('shortlist', allItems.map((i) => i.slug).join(','));
    return `${href('/inquiry')}?${q.toString()}`;
  };

  return (
    <div>
      {/* Hero */}
      <section className="no-print relative border-b border-line bg-milk overflow-hidden">
        <span aria-hidden className="absolute inset-x-0 top-0 h-1 bg-brand" />
        <div className="shell">
          <Breadcrumbs trail={[{ label: ui('planTitle') }]} />
          <div className="pb-12 md:pb-16 pt-4 max-w-3xl">
            <p className="eyebrow text-brand-deep">{ui('planEyebrow')}</p>
            <h1 className="h-display mt-4 text-[clamp(2.25rem,5vw,3.75rem)]">{ui('planTitle')}</h1>
            <p className="lede mt-5">{ui('planLede')}</p>
          </div>
        </div>
      </section>

      <div className="shell py-12 md:py-16">
        <div className="no-print">
        {/* ---------------------------------------------------------- step 1 */}
        <Step n={1} label={ui('planQBuild')} />
        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PLAN_BUILDS.map((b) => (
            <ChoiceCard
              key={b.id}
              selected={build?.id === b.id}
              title={t(b.label)}
              note={t(b.summary)}
              onClick={() => set('build', b.id, ['scale', 'start'])}
            />
          ))}
        </div>

        {/* ---------------------------------------------------------- step 2 */}
        {build && (
          <Reveal key={`scale-${build.id}`}>
            <div className="mt-14">
              <Step n={2} label={t(build.scaleQuestion)} />
              <div className="mt-6 grid sm:grid-cols-3 gap-4">
                {build.scales.map((sc) => (
                  <ChoiceCard
                    key={sc.id}
                    selected={scale === sc.id}
                    title={t(sc.label)}
                    note={t(sc.note)}
                    onClick={() => set('scale', sc.id)}
                  />
                ))}
              </div>
            </div>
          </Reveal>
        )}

        {/* ---------------------------------------------------------- step 3 */}
        {build && scale && (
          <Reveal key={`start-${build.id}`}>
            <div className="mt-14">
              <Step n={3} label={ui('planQStart')} />
              <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {PLAN_STARTS.filter((st) => build.starts.includes(st.id)).map((st) => (
                  <ChoiceCard
                    key={st.id}
                    selected={start === st.id}
                    title={t(st.label)}
                    note={t(st.note)}
                    onClick={() => set('start', st.id)}
                  />
                ))}
              </div>
            </div>
          </Reveal>
        )}

        {/* ---------------------------------------------------- step 4 (opt) */}
        {plan && (
          <Reveal>
            <div className="mt-14">
              <Step n={4} label={ui('planQRegion')} optional={ui('planOptional')} />
              <div className="mt-6 flex flex-wrap gap-2">
                {GEORGIA_REGIONS.map((r) => {
                  const on = region === r.id;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      aria-pressed={on}
                      onClick={() => set('region', r.id)}
                      className={`hit-row px-3.5 py-2 rounded-[2px] border text-[0.8125rem] transition-colors duration-200
                        ${on ? 'bg-brand-deep border-brand-deep text-milk'
                             : 'bg-milk border-line text-slate hover:border-line-strong hover:text-ink'}`}
                    >
                      {lang === 'ka' ? r.ka : r.en}
                    </button>
                  );
                })}
              </div>
              {regionRow && (
                <p className="meta mt-4">
                  {lang === 'ka' ? regionRow.ka : regionRow.en} ·{' '}
                  {t(COVERAGE_PLACEHOLDER.statusLabels[regionStatus ?? 'none'])}
                </p>
              )}
            </div>
          </Reveal>
        )}

        </div>

        {/* ------------------------------------------------------- the bundle */}
        {plan && build && scale && start && (
          <>
          <PrintHeader
            kind={ui('printKindPlan')}
            title={`${t(build.label)} · ${t(build.scales.find((x) => x.id === scale)!.label)}`}
            meta={[
              t(PLAN_STARTS.find((x) => x.id === start)!.label),
              regionRow ? (lang === 'ka' ? regionRow.ka : regionRow.en) : null,
              ui('planResultNote').replace('{n}', String(total)).split('.')[0],
            ].filter(Boolean).join(' · ')}
          />
          <Reveal>
            <div className="mt-16 pt-14 border-t border-line">
              <div className="flex flex-wrap items-end justify-between gap-6">
                <div className="no-print max-w-2xl">
                  <p className="eyebrow text-brand-deep">{ui('planResult')}</p>
                  <h2 className="h-section mt-3">
                    {t(build.label)} · {t(build.scales.find((x) => x.id === scale)!.label)}
                  </h2>
                  <p className="mt-4 text-[0.9375rem] text-slate">
                    {ui('planResultNote').replace('{n}', String(total))}
                  </p>
                </div>
                <div className="no-print flex flex-wrap gap-3">
                  <Button
                    variant="secondary"
                    onClick={() => allItems.forEach((i) => { if (has(i.slug) === allAdded) toggle(i); })}
                  >
                    {allAdded ? <Check size={16} aria-hidden /> : null}
                    {allAdded ? ui('planAllAdded') : ui('planAddAll')}
                  </Button>
                  <PrintButton label={ui('printPlan')} />
                  <Link
                    to={inquiryHref()}
                    className="inline-flex items-center gap-2 bg-brand-deep text-milk text-[0.875rem]
                      font-medium px-5 py-3 rounded-[2px] hover:bg-ink transition-colors"
                  >
                    {ui('planSend')} <ArrowRight size={15} aria-hidden />
                  </Link>
                </div>
              </div>

              <p className="no-print mt-5 flex items-center gap-2 meta">
                <Link2 size={13} aria-hidden /> {ui('planShareNote')}
              </p>

              <ol className="mt-10 space-y-10">
                {plan.map(({ phase, rows }) => {
                  const n = PLAN_PHASES.findIndex((p) => p.id === phase.id) + 1;
                  return (
                    <li key={phase.id} className="grid lg:grid-cols-12 gap-6 lg:gap-10">
                      <div className="lg:col-span-3">
                        <div className="lg:sticky lg:top-28">
                          <p className="eyebrow">
                            {String(n).padStart(2, '0')} · {t(phase.label)}
                          </p>
                          <p className="mt-3 text-[0.875rem] text-slate leading-[1.6]">{t(phase.role)}</p>
                        </div>
                      </div>
                      <ul className="lg:col-span-9 border-t border-line">
                        {rows.map(({ offering: o, why }) => {
                          const d = getDirection(o.direction);
                          const sd = getSub(o.direction, o.sub);
                          return (
                            <li
                              key={o.slug}
                              style={accentVars(o.direction)}
                              className="group relative flex items-start gap-4 py-5 border-b border-line
                                transition-colors duration-300 hover:bg-milk"
                            >
                              <span aria-hidden className="mt-1.5 w-1 h-8 shrink-0 rounded-[1px] bg-[var(--accent)]" />
                              <div className="flex-1 min-w-0 pr-12">
                                <h3 className="text-[1.0625rem] font-semibold leading-snug">
                                  {/* Deliberately NOT a stretched link: the
                                      reason line below carries glossary terms,
                                      and a link covering the row would sit on
                                      top of them. */}
                                  <Link
                                    to={href(`/${o.direction}/${o.sub}/${o.slug}`)}
                                    className="group-hover:text-[var(--accent-ink)] transition-colors"
                                  >
                                    {t(o.title)}
                                  </Link>
                                </h3>
                                <p className="mt-1.5 text-[0.9375rem] text-slate leading-[1.6]"><Glossed text={t(why)} /></p>
                                {d && sd && (
                                  <p className="meta mt-2">{t(d.label)} · {t(sd.label)}</p>
                                )}
                              </div>
                              <ShortlistToggle
                                item={{ direction: o.direction, sub: o.sub, slug: o.slug }}
                                className="absolute right-0 top-4 z-20"
                              />
                            </li>
                          );
                        })}
                      </ul>
                    </li>
                  );
                })}
              </ol>

              <div className="no-print mt-12 flex flex-wrap items-center gap-4">
                <Link
                  to={inquiryHref()}
                  className="inline-flex items-center gap-2 bg-brand-deep text-milk text-[0.875rem]
                    font-medium px-5 py-3 rounded-[2px] hover:bg-ink transition-colors"
                >
                  {ui('planSend')} <ArrowRight size={15} aria-hidden />
                </Link>
                <button
                  type="button"
                  onClick={() => setParams(new URLSearchParams())}
                  className="hit-row inline-flex items-center gap-2 text-[0.875rem] text-slate hover:text-ink transition-colors"
                >
                  <RotateCcw size={15} aria-hidden /> {ui('planReset')}
                </button>
              </div>

              <p className="no-print mt-10 max-w-3xl text-[0.8125rem] text-muted leading-relaxed">
                {ui('planDisclaimer')}
              </p>
              <PrintFootnote text={ui('printPlanFootnote')} />
            </div>
          </Reveal>
          </>
        )}

        {/* Nothing chosen yet — say what the page is for rather than showing a void. */}
        {!build && (
          <div className="mt-14 border border-dashed border-line rounded-none p-10 max-w-3xl">
            <p className="text-[0.9375rem] text-slate leading-[1.7]">{ui('planEmpty')}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Tag>{ui('navigator')}</Tag>
              <Link to={href('/navigator')} className="hit-row text-[0.875rem] font-medium text-brand-deep hover:text-ink transition-colors">
                {ui('navOpen')} →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function Step({ n, label, optional }: { n: number; label: string; optional?: string }) {
  return (
    <div className="flex items-baseline gap-4">
      <span
        aria-hidden
        className="shrink-0 w-8 h-8 inline-flex items-center justify-center rounded-full
          border border-line-strong font-mono text-[0.75rem] text-slate"
      >
        {n}
      </span>
      <h2 className="h-card font-semibold">
        {label}
        {optional && <span className="meta ml-3 font-normal">{optional}</span>}
      </h2>
    </div>
  );
}

/**
 * A choice is a button, not a card that happens to be clickable: it changes the
 * page's state rather than navigating, so it has to announce its pressed state.
 */
function ChoiceCard({
  selected, title, note, onClick,
}: { selected: boolean; title: string; note: string; onClick: () => void }) {
  const { ref, onPointerMove } = useCardPointer<HTMLButtonElement>();
  return (
    <button
      ref={ref}
      onPointerMove={onPointerMove}
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`card-i text-left p-6 rounded-[2px] border
        ${selected
          ? 'bg-brand-soft border-brand/50'
          : 'bg-milk border-line hover:border-line-strong'}`}
    >
      <span className="flex items-start justify-between gap-3">
        <span className="text-[1.0625rem] font-semibold leading-snug">{title}</span>
        <span
          aria-hidden
          className={`mt-0.5 shrink-0 w-5 h-5 rounded-full border inline-flex items-center justify-center
            transition-colors duration-200
            ${selected ? 'bg-brand-deep border-brand-deep text-milk' : 'border-line-strong text-transparent'}`}
        >
          <Check size={12} />
        </span>
      </span>
      <span className="mt-2 block text-[0.875rem] text-slate leading-[1.6]">{note}</span>
    </button>
  );
}
