import { Link, useParams } from 'react-router-dom';
import { ArrowRight, ClipboardList, MapPin } from 'lucide-react';
import { GEORGIA_REGIONS } from '@/data/regions';
import { getRegion, getRegionProfile, REGION_PROFILES } from '@/data/region-profiles';
import { COVERAGE_PLACEHOLDER } from '@/data/site';
import { getDirection, getSub } from '@/data/taxonomy';
import { useHref, useLang, useT, useUI } from '@/lib/i18n';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Glossed } from '@/components/Glossary';
import { PrintButton, PrintHeader } from '@/components/Print';
import { CardLink, Reveal, SectionHeader, accentVars } from '@/components/ui';
import { NotFound } from '@/pages/Misc';

/**
 * P19 REGION — the map turned into a way in.
 *
 * A map that only colours itself is decoration. This makes each of the twelve
 * regions an address: a page that says what the region is in dairy terms, what
 * GEO Dairy's published coverage status there is, and which parts of the
 * portfolio suit it — then hands the region on to the configurator and the
 * inquiry form as carried context.
 *
 * The honest boundary is drawn in region-profiles.ts: geography is described,
 * company activity is not invented. Where the status is placeholder the page
 * says so rather than dressing it up.
 */

const STATUS_TONE: Record<string, string> = {
  operating: 'bg-brand-soft border-brand/40 text-brand-deep',
  development: 'bg-mist border-line-strong text-slate',
  planned: 'bg-milk border-line text-muted',
  none: 'bg-milk border-line text-muted',
};

export default function Region() {
  const { region } = useParams();
  const r = getRegion(region);
  const profile = getRegionProfile(region);
  const t = useT();
  const ui = useUI();
  const lang = useLang();
  const href = useHref();

  if (!r || !profile) return <NotFound />;

  const status = COVERAGE_PLACEHOLDER.status[r.id] ?? 'none';
  const name = lang === 'ka' ? r.ka : r.en;

  return (
    <div>
      <PrintHeader
        kind={ui('printKindRegion')}
        title={name}
        meta={`${t(profile.role)} · ${t(COVERAGE_PLACEHOLDER.statusLabels[status])}`}
      />

      <section className="relative border-b border-line bg-milk overflow-hidden">
        <span aria-hidden className="absolute inset-x-0 top-0 h-1 bg-brand" />
        <div className="shell">
          <Breadcrumbs
            trail={[{ label: ui('regionsTitle'), to: '/regions' }, { label: name }]}
          />
          <div className="pb-12 md:pb-16 pt-4">
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-end">
              <div className="lg:col-span-7">
                <p className="no-print eyebrow flex items-center gap-2 text-brand-deep">
                  <MapPin size={13} aria-hidden /> {t(profile.role)}
                </p>
                <h1 className="no-print h-display mt-4 text-[clamp(2.25rem,5vw,3.75rem)]">{name}</h1>
                <p className="lede mt-5">
                  <Glossed text={t(profile.context)} />
                </p>
              </div>

              <div className="lg:col-span-5">
                <div className={`border rounded-[2px] p-6 ${STATUS_TONE[status]}`}>
                  <p className="eyebrow">{ui('regionStatus')}</p>
                  <p className="mt-2 text-[1.375rem] font-semibold font-display tracking-[-0.015em]">
                    {t(COVERAGE_PLACEHOLDER.statusLabels[status])}
                  </p>
                  <p className="mt-3 text-[0.8125rem] leading-relaxed opacity-80">
                    {ui('regionStatusNote')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Entry points — routing, not a claim about what is built here. */}
      {profile.starts.length > 0 && (
        <section className="shell py-14 md:py-20">
          <SectionHeader
            eyebrow={ui('regionStartHere')}
            title={ui('regionStartTitle').replace('{region}', name)}
            lede={ui('regionStartLede')}
          />
          <div className="mt-10 grid md:grid-cols-3 gap-5">
            {profile.starts.map(([dirId, subSlug], i) => {
              const d = getDirection(dirId);
              const s = getSub(dirId, subSlug);
              if (!d || !s) return null;
              return (
                <Reveal key={`${dirId}-${subSlug}`} delay={i * 70}>
                  <CardLink
                    to={`/${d.id}/${s.slug}`}
                    direction={d.id}
                    index={t(d.label)}
                    title={t(s.label)}
                    description={t(s.definition)}
                    className="h-full"
                  />
                </Reveal>
              );
            })}
          </div>
        </section>
      )}

      {/* Carry the region forward rather than making the visitor restate it. */}
      <section className="shell pb-14 md:pb-20">
        <div className="border border-line rounded-[2px] bg-milk p-8 md:p-10 grid lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7">
            <p className="eyebrow flex items-center gap-2 text-brand-deep">
              <ClipboardList size={13} aria-hidden /> {ui('planTitle')}
            </p>
            <p className="mt-3 text-[1.0625rem] leading-[1.55]">
              {ui('regionPlanNote').replace('{region}', name)}
            </p>
          </div>
          <div className="no-print lg:col-span-5 flex lg:justify-end gap-3">
            <PrintButton />
            <Link
              to={`${href('/plan')}?region=${r.id}`}
              className="inline-flex items-center gap-2 bg-brand-deep text-milk text-[0.875rem]
                font-medium px-5 py-3 rounded-[2px] hover:bg-ink transition-colors"
            >
              {ui('regionPlanCta')} <ArrowRight size={15} aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      {/* Neighbours, so the map is navigable without going back to it. */}
      <section className="no-print shell pb-16 md:pb-24">
        <h2 className="eyebrow pb-3 border-b border-line">{ui('regionsAll')}</h2>
        <ul className="mt-5 flex flex-wrap gap-2">
          {GEORGIA_REGIONS.map((x) => {
            const on = x.id === r.id;
            return (
              <li key={x.id}>
                <Link
                  to={href(`/regions/${x.id}`)}
                  aria-current={on ? 'page' : undefined}
                  className={`hit-row inline-block px-3.5 py-2 rounded-[2px] border text-[0.8125rem]
                    transition-colors duration-200 ${
                      on ? 'bg-ink border-ink text-milk'
                         : 'bg-milk border-line text-slate hover:border-line-strong hover:text-ink'
                    }`}
                >
                  {lang === 'ka' ? x.ka : x.en}
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Written out rather than reusing CtaBand: that component addresses a CTA
          by taxonomy type, and this one has to carry the region in the query
          string so the form arrives already knowing where the enquiry is from. */}
      <section className="no-print on-dark relative overflow-hidden bg-ink text-milk">
        <span aria-hidden className="absolute inset-x-0 top-0 h-[3px] bg-brand" />
        <div className="shell py-16 md:py-24">
          <Reveal className="max-w-3xl">
            <h2 className="h-section">{ui('regionCtaTitle').replace('{region}', name)}</h2>
            <p className="mt-4 text-[1.0625rem] leading-relaxed text-mist/65 font-light max-w-2xl">
              {ui('regionCtaBody')}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to={`${href('/inquiry')}?type=contact&region=${r.id}`}
                className="inline-flex items-center gap-2 bg-milk text-ink text-[0.875rem] font-medium
                  px-5 py-3 rounded-[2px] hover:bg-signal transition-colors"
              >
                {ui('cta.contact')} <ArrowRight size={15} aria-hidden />
              </Link>
              <Link
                to={href('/navigator')}
                className="inline-flex items-center gap-2 border border-milk/25 text-milk text-[0.875rem]
                  font-medium px-5 py-3 rounded-[2px] hover:bg-milk/10 transition-colors"
              >
                {ui('navigatorFull')}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

/** The index: twelve regions with their published status, as a way into the map. */
export function Regions() {
  const t = useT();
  const ui = useUI();
  const lang = useLang();
  const href = useHref();

  return (
    <div>
      <section className="border-b border-line bg-milk">
        <div className="shell">
          <Breadcrumbs trail={[{ label: ui('regionsTitle') }]} />
          <div className="pb-12 md:pb-16 pt-4 max-w-3xl">
            <p className="eyebrow text-brand-deep">{ui('regionsEyebrow')}</p>
            <h1 className="h-display mt-4 text-[clamp(2.25rem,5vw,3.75rem)]">{ui('regionsTitle')}</h1>
            <p className="lede mt-5">{ui('regionsLede')}</p>
          </div>
        </div>
      </section>

      <div className="shell py-12 md:py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {GEORGIA_REGIONS.map((r, i) => {
            // Note on the excerpt below: it carries `line-clamp-3` and NOT
            // `block`. Both set `display`, the display utility wins on source
            // order, and with both present the clamp silently did nothing and
            // the cards came out ragged.
            const profile = REGION_PROFILES[r.id];
            const status = COVERAGE_PLACEHOLDER.status[r.id] ?? 'none';
            return (
              <Reveal key={r.id} delay={(i % 3) * 60}>
                <Link
                  to={href(`/regions/${r.id}`)}
                  style={accentVars('production')}
                  className="card-i group flex flex-col h-full bg-milk border border-line rounded-[2px] p-6"
                >
                  <span aria-hidden className="card-rule" />
                  <span className="flex items-start justify-between gap-3">
                    <span className="eyebrow text-[var(--accent-ink)]">
                      {profile ? t(profile.role) : ''}
                    </span>
                    <span className={`shrink-0 font-mono text-[0.625rem] uppercase tracking-[0.08em] px-2 py-1
                      rounded-none border ${STATUS_TONE[status]}`}>
                      {t(COVERAGE_PLACEHOLDER.statusLabels[status])}
                    </span>
                  </span>
                  <span className="card-title mt-4 block text-[1.1875rem] font-semibold leading-snug">
                    {lang === 'ka' ? r.ka : r.en}
                  </span>
                  {profile && (
                    <span className="mt-2.5 text-[0.9375rem] text-slate leading-[1.6] line-clamp-3">
                      {t(profile.context)}
                    </span>
                  )}
                  <span className="mt-auto pt-5 flex items-center justify-between gap-3 border-t border-line/70">
                    <span className="text-[0.8125rem] font-medium text-[var(--accent-ink)]">
                      {ui('explore')}
                    </span>
                    <span className="card-arrow text-[var(--accent-ink)]" aria-hidden>
                      <ArrowRight size={15} />
                      <ArrowRight size={15} />
                    </span>
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>

        <p className="mt-10 max-w-3xl text-[0.8125rem] text-muted leading-relaxed">
          {t(COVERAGE_PLACEHOLDER.note)}
        </p>
      </div>
    </div>
  );
}
