import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { DIRECTIONS } from '@/data/taxonomy';
import { photoForSub, DIRECTION_PHOTO } from '@/data/media';
import { Figure, BackdropPhoto } from '@/components/Media';
import { LazyGridNetwork } from '@/components/three/Lazy3D';
import { Reveal, StageTag, accentVars } from '@/components/ui';
import { Glossed } from '@/components/Glossary';
import { useHref, useLang, useT, useUI } from '@/lib/i18n';
import { useSectionProgress } from '@/lib/useSectionProgress';
import { TRADE_DESTINATION } from '@/data/direction-stories';
import type { Direction, DirectionId } from '@/lib/types';

/**
 * THE FIVE DIRECTIONS — five sections, not one component rendered five times.
 *
 * The five directions are the only primary business navigation on the site
 * (§19), and rendering them as five identical cards said they were five
 * equivalent units of the same kind of thing. They are five different *kinds*
 * of business, and a reader should feel the difference before they have
 * finished reading the names. So each gets the composition its own nature asks
 * for:
 *
 *   Ecosystem   a network, on dark, with the nodes visible
 *   Trade       a manifest — coded rows, and where each one's product ends up
 *   Service     a ladder of engagement, advisory down to development
 *   Supply      a parts catalogue, coded and photographed
 *   Production  one photograph and very few words, because it is ours
 *
 * What holds them together as a family rather than five pastiches: the same
 * index block, the same display scale, the same accent mechanism, the same
 * closing link, and the rule that the sub-directions are always listed in full.
 * Vary the composition, never the vocabulary.
 */

const byId = (id: DirectionId) => DIRECTIONS.find((d) => d.id === id)!;

export type DirectionMode = 'flow' | 'panel';

export interface DirectionProps {
  mode?: DirectionMode;
  /** false = the "normal" treatment: no drift, everything already revealed. */
  motion?: boolean;
}

const shellFor = (mode: DirectionMode, flow: string) =>
  mode === 'panel' ? 'shell relative w-full py-0' : 'shell relative ' + flow;

const drift = (motion: boolean, cls: string) => (motion ? cls : '');

/* -------------------------------------------------------------------------- */
/* Shared vocabulary                                                          */
/* -------------------------------------------------------------------------- */

function DirectionMasthead({ d, tone = 'light' }: { d: Direction; tone?: 'light' | 'dark' }) {
  const t = useT();
  return (
    <div className="flex items-start gap-5 md:gap-7">
      {/* Ink on accent, never white: three of the five accents are mid-tone,
          and white on them fails contrast while dark text clears it on all. */}
      <span
        aria-hidden
        className="shrink-0 grid place-items-center w-12 h-12 md:w-16 md:h-16 bg-[var(--accent)] text-ink
          font-display text-[1.125rem] md:text-[1.5rem] font-extrabold leading-none"
      >
        {String(d.order).padStart(2, '0')}
      </span>
      <div className="min-w-0">
        <p className={`font-mono text-[0.6875rem] uppercase tracking-[0.2em] ${
          tone === 'dark' ? 'text-[var(--accent)]' : 'text-[var(--accent-ink)]'}`}>
          {d.id}
        </p>
        {/* Sized to the narrowest column this masthead sits in, not to the
            viewport. At 7.5vw "Ecosystem" ran 560px wide inside a 494px column
            and printed straight over the sub-direction list beside it. */}
        <h2 className="mt-2 font-display font-extrabold leading-[0.9] tracking-[-0.042em]
          text-[clamp(2.25rem,5vw,4.5rem)]">
          {t(d.label)}
        </h2>
      </div>
    </div>
  );
}

function DirectionLink({ d, tone = 'light' }: { d: Direction; tone?: 'light' | 'dark' }) {
  const t = useT();
  const ui = useUI();
  const href = useHref();
  return (
    <Link
      to={href(`/${d.id}`)}
      className={`group/dl inline-flex items-center gap-3 text-[1rem] font-semibold transition-colors duration-300
        ${tone === 'dark' ? 'text-milk hover:text-[var(--accent)]' : 'text-ink hover:text-[var(--accent-ink)]'}`}
    >
      {ui('exploreDirection')} {t(d.label)}
      <span
        aria-hidden
        className={`grid place-items-center w-9 h-9 rounded-full border transition-all duration-300 group-hover/dl:translate-x-1
          ${tone === 'dark'
            ? 'border-milk/25 group-hover/dl:border-[var(--accent)] group-hover/dl:bg-[var(--accent)]/15'
            : 'border-line-strong group-hover/dl:border-[var(--accent)] group-hover/dl:bg-[var(--accent)]/10'}`}
      >
        <ArrowRight size={16} />
      </span>
    </Link>
  );
}

function StageRow({ d, tone = 'light' }: { d: Direction; tone?: 'light' | 'dark' }) {
  const stages = [...new Set(d.subs.flatMap((s) => s.stages))];
  return (
    <div className={`flex flex-wrap gap-1.5 ${tone === 'dark' ? 'on-dark' : ''}`}>
      {stages.map((s) => <StageTag key={s} stage={s} />)}
    </div>
  );
}

/* ========================================================================== */
/* 01 · ECOSYSTEM — the network, on dark                                      */
/* ========================================================================== */

export function EcosystemSection({ mode = 'flow', motion = true }: DirectionProps) {
  const d = byId('ecosystem');
  const ref = useSectionProgress<HTMLDivElement>(motion);
  const t = useT();
  const href = useHref();
  const [hot, setHot] = useState<string | null>(null);

  return (
    <div
      ref={ref}
      style={accentVars('ecosystem')}
      className={`lat on-dark relative overflow-hidden bg-ink text-milk ${mode === 'panel' ? 'h-full flex items-center' : ''}`}
    >
      {/* The node field is the section's argument, not its wallpaper: Ecosystem
          is the connective layer, so the connections are what you look at. */}
      <div aria-hidden className={`${drift(motion, 'lat lat-back')} absolute -inset-x-12 inset-y-0 opacity-[0.55]`}>
        <LazyGridNetwork />
      </div>
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(120% 80% at 20% 30%, rgba(11,26,20,0.92) 0%, rgba(11,26,20,0.72) 45%, rgba(11,26,20,0.55) 100%)',
        }}
      />

      <div className={shellFor(mode, 'py-24 md:py-36')}>
        <div className={`grid lg:grid-cols-12 gap-12 ${mode === 'panel' ? 'lg:gap-12' : 'lg:gap-16'}`}>
          <Reveal className="lg:col-span-5">
            <div className={drift(motion, 'lat lat-name')}><DirectionMasthead d={d} tone="dark" /></div>
            <p className={`${drift(motion, 'lat lat-lede')} mt-7 text-[1.0625rem] md:text-[1.1875rem] leading-[1.6] text-mist/75 font-light max-w-lg`}>
              <Glossed text={t(d.definition)} />
            </p>
            <div className="mt-8"><StageRow d={d} tone="dark" /></div>
            <div className="mt-10"><DirectionLink d={d} tone="dark" /></div>
          </Reveal>

          {/* Nine sub-directions as a node list: each one lights its own line. */}
          <Reveal delay={90} className="lg:col-span-7">
            <ul className={`${drift(motion, 'lat lat-body')} grid gap-x-10 ${mode === 'panel' ? 'sm:grid-cols-3' : 'sm:grid-cols-2'}`}>
              {d.subs.map((s, i) => {
                const on = hot === s.slug;
                return (
                  <li key={s.slug} className="relative">
                    <Link
                      to={href(`/${d.id}/${s.slug}`)}
                      onMouseEnter={() => setHot(s.slug)}
                      onMouseLeave={() => setHot(null)}
                      onFocus={() => setHot(s.slug)}
                      onBlur={() => setHot(null)}
                      className="group/n block py-4 border-b border-milk/12"
                    >
                      <span className="flex items-baseline gap-3">
                        <span
                          aria-hidden
                          className={`shrink-0 w-1.5 h-1.5 rounded-full translate-y-[-2px] transition-all duration-300
                            ${on ? 'bg-[var(--accent)] shadow-[0_0_0_4px_rgba(31,122,140,0.25)]' : 'bg-milk/30'}`}
                        />
                        <span className="font-mono text-[0.625rem] tracking-[0.14em] text-milk/45">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span className={`text-[1.0625rem] font-medium transition-colors duration-300
                          ${on ? 'text-[var(--accent)]' : 'text-milk'}`}>
                          {t(s.label)}
                        </span>
                        <ArrowUpRight
                          size={14}
                          aria-hidden
                          className={`ml-auto shrink-0 transition-all duration-300
                            ${on ? 'opacity-100 text-[var(--accent)]' : 'opacity-0'}`}
                        />
                      </span>
                      <span
                        className={`block pl-[1.65rem] text-[0.875rem] leading-snug text-mist/60
                          overflow-hidden transition-all duration-400 ease-out
                          ${on ? 'max-h-16 opacity-100 mt-1.5' : 'max-h-0 opacity-0'}`}
                      >
                        {t(s.definition)}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </Reveal>
        </div>
      </div>
    </div>
  );
}

/* ========================================================================== */
/* 02 · TRADE — the manifest                                                  */
/* ========================================================================== */

export function TradeSection({ mode = 'flow', motion = true }: DirectionProps) {
  const d = byId('trade');
  const ref = useSectionProgress<HTMLDivElement>(motion);
  const t = useT();
  const lang = useLang();
  const href = useHref();
  const [hot, setHot] = useState<string | null>(null);
  const shown = hot ?? d.subs[0].slug;

  return (
    <div
      ref={ref}
      style={accentVars('trade')}
      className={`lat relative bg-parchment/70 border-y border-line overflow-hidden ${mode === 'panel' ? 'h-full flex items-center' : ''}`}
    >
      <div className={shellFor(mode, 'py-24 md:py-32')}>
        <Reveal className="max-w-4xl">
          <div className={drift(motion, 'lat lat-name')}><DirectionMasthead d={d} /></div>
          <p className={`${drift(motion, 'lat lat-lede')} mt-7 text-[1.0625rem] md:text-[1.1875rem] leading-[1.6] text-slate font-light max-w-2xl`}>
            <Glossed text={t(d.definition)} />
          </p>
        </Reveal>

        {/* A manifest, not a card grid: Trade moves goods to destinations, and a
            document with columns says that better than five boxes.

            The right-hand column is the destination rather than the value-chain
            stage. Every Trade sub-direction is downstream, so a stage column
            printed the same word five times — and a column where every row
            agrees is decoration wearing a header. */}
        <Reveal delay={80}>
          <div className={`${drift(motion, 'lat lat-body')} mt-14 grid lg:grid-cols-12 gap-px bg-line border border-line overflow-hidden`}>
            <div className="lg:col-span-7 bg-milk">
              <div className="flex items-center gap-6 px-6 py-3 border-b border-line bg-parchment/60">
                <span className="eyebrow">{lang === 'ka' ? 'არხი' : 'Channel'}</span>
                <span className="eyebrow ml-auto">{lang === 'ka' ? 'სად მიდის' : 'Goes to'}</span>
              </div>
              <ul>
                {d.subs.map((s, i) => {
                  const on = hot === s.slug;
                  return (
                    <li key={s.slug}>
                      <Link
                        to={href(`/${d.id}/${s.slug}`)}
                        onMouseEnter={() => setHot(s.slug)}
                        onMouseLeave={() => setHot(null)}
                        onFocus={() => setHot(s.slug)}
                        onBlur={() => setHot(null)}
                        className={`group/r flex items-center gap-5 px-6 py-5 border-b border-line last:border-b-0
                          transition-colors duration-300 ${on ? 'bg-[var(--accent)]/[0.08]' : 'hover:bg-parchment/50'}`}
                      >
                        <span
                          aria-hidden
                          className={`w-[3px] self-stretch transition-colors duration-300
                            ${on ? 'bg-[var(--accent)]' : 'bg-transparent'}`}
                        />
                        <span className="font-mono text-[0.6875rem] tracking-[0.12em] text-muted shrink-0">
                          {`TR-${String(i + 1).padStart(2, '0')}`}
                        </span>
                        <span className="min-w-0">
                          <span className="block font-display font-bold text-[1.25rem] md:text-[1.5rem]
                            leading-none tracking-[-0.025em]">
                            {t(s.label)}
                          </span>
                          <span className="block mt-1.5 text-[0.875rem] text-slate leading-snug">
                            {t(s.definition)}
                          </span>
                        </span>
                        <span className={`ml-auto shrink-0 text-right font-display font-semibold text-[0.9375rem]
                          transition-colors duration-300 ${on ? 'text-[var(--accent-ink)]' : 'text-muted'}`}>
                          {t(TRADE_DESTINATION[s.slug])}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* The destination panel: the row you are reading, photographed. */}
            <div className="lg:col-span-5 bg-milk relative min-h-[22rem]">
              {d.subs.map((s) => (
                <div
                  key={s.slug}
                  className={`absolute inset-0 transition-opacity duration-700 ${shown === s.slug ? 'opacity-100' : 'opacity-0'}`}
                >
                  <Figure fill photo={photoForSub(d.id, s.slug)} sizes="(max-width: 1024px) 100vw, 34vw" />
                </div>
              ))}
              <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/85 to-transparent" />
              <p className="absolute left-6 bottom-5 right-6 font-display font-extrabold text-[1.5rem]
                leading-tight tracking-[-0.03em] text-milk">
                {t(d.subs.find((s) => s.slug === shown)!.label)}
              </p>
            </div>
          </div>
        </Reveal>

        <div className="mt-12"><DirectionLink d={d} /></div>
      </div>
    </div>
  );
}

/* ========================================================================== */
/* 03 · SERVICE — the ladder                                                  */
/* ========================================================================== */

export function ServiceSection({ mode = 'flow', motion = true }: DirectionProps) {
  const d = byId('service');
  const ref = useSectionProgress<HTMLDivElement>(motion);
  const t = useT();
  const lang = useLang();
  const href = useHref();

  return (
    <div
      ref={ref}
      style={accentVars('service')}
      className={`lat relative bg-cream ${mode === 'panel' ? 'h-full flex items-center' : ''}`}
    >
      <div className={shellFor(mode, 'py-24 md:py-32')}>
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
          {/* Pinned, because a ladder needs something to lean against. */}
          <div className="lg:col-span-4">
            <div className={mode === 'panel' ? '' : 'lg:sticky lg:top-32'}>
              <Reveal>
                <div className={drift(motion, 'lat lat-name')}><DirectionMasthead d={d} /></div>
                <p className={`${drift(motion, 'lat lat-lede')} mt-7 text-[1.0625rem] leading-[1.65] text-slate font-light`}>
                  <Glossed text={t(d.definition)} />
                </p>
                <div className="mt-7"><StageRow d={d} /></div>
                <div className="mt-9"><DirectionLink d={d} /></div>
              </Reveal>
            </div>
          </div>

          <div className="lg:col-span-8">
            <p className="eyebrow mb-8">
              {lang === 'ka' ? 'ჩართულობის კიბე' : 'The engagement ladder'}
            </p>
            <ol className={`${drift(motion, 'lat lat-body')} relative`}>
              {/* One continuous rule behind the rungs: the five are a sequence,
                  and a client usually walks down it in order. It fills as the
                  section passes, so the order is felt before it is read. */}
              <span aria-hidden className="absolute left-[1.6rem] top-3 bottom-3 w-px bg-line-strong/60" />
              <span aria-hidden className="svc-progress absolute left-[1.6rem] top-3 w-px bg-[var(--accent)]" />

              {d.subs.map((s, i) => (
                <li key={s.slug}>
                  <Reveal delay={i * 60}>
                    <Link
                      to={href(`/${d.id}/${s.slug}`)}
                      className="group/step relative flex items-start gap-6 py-7 pl-0 pr-4
                        border-b border-line transition-[padding] duration-500 ease-out hover:pl-3"
                    >
                      <span
                        aria-hidden
                        className="relative z-10 shrink-0 grid place-items-center w-[3.2rem] h-[3.2rem]
                          rounded-full bg-milk border border-line-strong font-mono text-[0.8125rem]
                          text-slate transition-all duration-400
                          group-hover/step:border-[var(--accent)] group-hover/step:text-[var(--accent-ink)]
                          group-hover/step:shadow-[0_0_0_6px_rgba(61,90,128,0.08)]"
                      >
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="min-w-0 flex-1 pt-1.5">
                        <span className="flex items-center gap-3">
                          <span className="font-display font-bold text-[1.5rem] md:text-[1.875rem] leading-tight
                            tracking-[-0.03em] transition-colors duration-300 group-hover/step:text-[var(--accent-ink)]">
                            {t(s.label)}
                          </span>
                          <span
                            aria-hidden
                            className="h-px flex-1 bg-line-strong origin-left scale-x-0
                              transition-transform duration-500 ease-out group-hover/step:scale-x-100"
                          />
                          <ArrowRight
                            size={17}
                            aria-hidden
                            className="shrink-0 text-muted transition-all duration-400
                              group-hover/step:text-[var(--accent-ink)] group-hover/step:translate-x-1"
                          />
                        </span>
                        <span className="block mt-2 text-[0.9375rem] text-slate leading-[1.6] max-w-xl">
                          <Glossed text={t(s.definition)} />
                        </span>
                      </span>
                    </Link>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ========================================================================== */
/* 04 · SUPPLY — the catalogue                                                */
/* ========================================================================== */

export function SupplySection({ mode = 'flow', motion = true }: DirectionProps) {
  const d = byId('supply');
  const ref = useSectionProgress<HTMLDivElement>(motion);
  const t = useT();
  const lang = useLang();
  const href = useHref();

  return (
    <div
      ref={ref}
      style={accentVars('supply')}
      className={`lat relative bg-mist/40 border-y border-line ${mode === 'panel' ? 'h-full flex items-center' : ''}`}
    >
      <div className={shellFor(mode, 'py-24 md:py-32')}>
        <div className="flex flex-wrap items-end justify-between gap-8">
          <Reveal className="max-w-2xl">
            <div className={drift(motion, 'lat lat-name')}><DirectionMasthead d={d} /></div>
            <p className={`${drift(motion, 'lat lat-lede')} mt-7 text-[1.0625rem] md:text-[1.1875rem] leading-[1.6] text-slate font-light`}>
              <Glossed text={t(d.definition)} />
            </p>
          </Reveal>
          <Reveal delay={60}>
            <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted">
              {lang === 'ka' ? 'კატალოგი' : 'Catalogue'} · {String(d.subs.length).padStart(2, '0')}
            </p>
          </Reveal>
        </div>

        {/* Specimen cells: coded, photographed, hairline-ruled. Supply is the
            direction you browse like a parts book, so it is laid out as one. */}
        <Reveal delay={90}>
          <div className={`${drift(motion, 'lat lat-body')} mt-14 grid gap-px bg-line border border-line overflow-hidden ${
            mode === 'panel' ? 'sm:grid-cols-3 lg:grid-cols-6' : 'sm:grid-cols-2 lg:grid-cols-3'}`}>
            {d.subs.map((s, i) => (
              <Link
                key={s.slug}
                to={href(`/${d.id}/${s.slug}`)}
                className="group/cell relative bg-milk p-7 md:p-8 min-h-[16rem] flex flex-col
                  transition-colors duration-500 hover:bg-parchment/40"
              >
                {/* The photograph lives under the text and surfaces on hover, so
                    the grid reads as a catalogue at rest and as material on
                    approach. */}
                <span
                  aria-hidden
                  className="absolute inset-0 opacity-0 transition-opacity duration-700 group-hover/cell:opacity-100"
                >
                  <Figure fill photo={photoForSub(d.id, s.slug)} sizes="(max-width: 1024px) 100vw, 24vw" />
                  <span className="absolute inset-0 bg-milk/82" />
                </span>

                <span className="relative flex items-center justify-between gap-3">
                  <span className="font-mono text-[0.6875rem] tracking-[0.14em] text-[var(--accent-ink)]">
                    {`SUP-${String(i + 1).padStart(2, '0')}`}
                  </span>
                  <ArrowUpRight
                    size={15}
                    aria-hidden
                    className="text-muted transition-all duration-400
                      group-hover/cell:text-[var(--accent-ink)] group-hover/cell:-translate-y-0.5 group-hover/cell:translate-x-0.5"
                  />
                </span>
                <span className="relative mt-5 font-display font-bold text-[1.5rem] leading-none tracking-[-0.028em]
                  transition-colors duration-300 group-hover/cell:text-[var(--accent-ink)]">
                  {t(s.label)}
                </span>
                <span className="relative mt-3 text-[0.875rem] text-slate leading-[1.6]">
                  {t(s.definition)}
                </span>
                <span className="relative mt-auto pt-6 flex flex-wrap gap-1.5">
                  {s.stages.map((st) => <StageTag key={st} stage={st} />)}
                </span>
                <span
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 h-[2px] bg-[var(--accent)] origin-left scale-x-0
                    transition-transform duration-500 ease-out group-hover/cell:scale-x-100"
                />
              </Link>
            ))}

            {/* The last cell is not a gap: it is where the catalogue continues. */}
            <Link
              to={href(`/${d.id}`)}
              className="group/more relative bg-parchment/50 p-7 md:p-8 min-h-[16rem]
                flex flex-col justify-end transition-colors duration-500 hover:bg-[var(--accent)]/10"
            >
              <span className="font-mono text-[0.6875rem] tracking-[0.14em] text-muted">
                {lang === 'ka' ? 'სრული კატალოგი' : 'Full catalogue'}
              </span>
              <span className="mt-3 flex items-center gap-3 font-display font-bold text-[1.5rem] tracking-[-0.028em]">
                {t(d.label)}
                <ArrowRight
                  size={18}
                  aria-hidden
                  className="transition-transform duration-400 group-hover/more:translate-x-1.5"
                />
              </span>
            </Link>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

/* ========================================================================== */
/* 05 · PRODUCTION — the photograph                                           */
/* ========================================================================== */

export function ProductionSection({ mode = 'flow', motion = true }: DirectionProps) {
  const d = byId('production');
  const ref = useSectionProgress<HTMLDivElement>(motion);
  const t = useT();
  const lang = useLang();
  const href = useHref();

  return (
    <div
      ref={ref}
      style={accentVars('production')}
      className={`lat on-dark relative overflow-hidden bg-graphite text-milk ${mode === 'panel' ? 'h-full flex items-center' : ''}`}
    >
      <div aria-hidden className={`${drift(motion, 'lat lat-back')} absolute -inset-x-16 inset-y-0`}>
        <BackdropPhoto photo={DIRECTION_PHOTO.production} opacity={0.42} />
      </div>
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(to right, rgba(22,36,30,0.94) 0%, rgba(22,36,30,0.78) 45%, rgba(22,36,30,0.35) 100%)',
        }}
      />
      <span aria-hidden className="absolute inset-x-0 top-0 h-[3px] bg-[var(--accent)] z-10" />

      <div className={`${shellFor(mode, 'py-28 md:py-40')} z-10`}>
        <Reveal className="max-w-3xl">
          <div className={drift(motion, 'lat lat-name')}><DirectionMasthead d={d} tone="dark" /></div>
          <p className={`${drift(motion, 'lat lat-lede')} mt-7 text-[1.125rem] md:text-[1.3125rem] leading-[1.55] text-mist/75 font-light max-w-2xl`}>
            <Glossed text={t(d.definition)} />
          </p>
        </Reveal>

        {/* Four wide links rather than cards. This is the direction where GEO
            Dairy is the operator, so the section is confident and nearly empty:
            one photograph, one statement, four doors. */}
        <Reveal delay={100}>
          <ul className={`${drift(motion, 'lat lat-body')} border-t border-milk/15 ${mode === 'panel' ? 'mt-8' : 'mt-16'}`}>
            {d.subs.map((s, i) => (
              <li key={s.slug}>
                <Link
                  to={href(`/${d.id}/${s.slug}`)}
                  className="group/p flex items-center gap-6 py-7 border-b border-milk/15
                    transition-[padding,background-color] duration-500 hover:pl-4 hover:bg-milk/[0.05]"
                >
                  <span className="font-mono text-[0.6875rem] tracking-[0.14em] text-milk/55 shrink-0">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="font-display font-extrabold text-[1.625rem] md:text-[2.25rem] leading-none
                    tracking-[-0.03em] transition-colors duration-300 group-hover/p:text-[var(--accent)]">
                    {t(s.label)}
                  </span>
                  <span className="hidden md:block text-[0.9375rem] text-mist/60 leading-snug max-w-md">
                    {t(s.definition)}
                  </span>
                  <span
                    aria-hidden
                    className="ml-auto shrink-0 grid place-items-center w-10 h-10 rounded-full
                      border border-milk/20 transition-all duration-400
                      group-hover/p:border-[var(--accent)] group-hover/p:bg-[var(--accent)] group-hover/p:text-ink
                      group-hover/p:translate-x-1"
                  >
                    <ArrowRight size={17} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>

        <p className="mt-10 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-milk/60">
          {lang === 'ka' ? 'GEO Dairy-ის საკუთარი ოპერაციები' : 'GEO Dairy’s own operations'}
        </p>
      </div>
    </div>
  );
}
