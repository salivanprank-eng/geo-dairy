import { Link, useParams } from 'react-router-dom';
import { NotFound } from '@/pages/Misc';
import { ArrowRight } from 'lucide-react';
import { DIRECTIONS, getDirection } from '@/data/taxonomy';
import { offeringsForDirection } from '@/data/offerings';
import { useHref, useT, useUI, useLang } from '@/lib/i18n';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { CardLink, CtaBand, Reveal, SectionHeader, StageTag, WordReveal, accentVars } from '@/components/ui';
import { Glossed } from '@/components/Glossary';
import { Figure } from '@/components/Media';
import { DIRECTION_PHOTO, photoForSub } from '@/data/media';
import type { Stage } from '@/lib/types';

/**
 * P02 DIRECTION LANDING — brief §9.
 * Hero · definition · sub-direction cards · featured capabilities · stage coverage ·
 * Navigator route · CTA. One template serves all five directions.
 */
export default function DirectionLanding() {
  const { direction } = useParams();
  const d = getDirection(direction ?? '');
  const t = useT();
  const ui = useUI();
  const href = useHref();
  const lang = useLang();

  if (!d) return <NotFound />;

  const featured = offeringsForDirection(d.id).filter((o) => o.featured).slice(0, 6);
  const stages = [...new Set(d.subs.flatMap((s) => s.stages))] as Stage[];
  const others = DIRECTIONS.filter((x) => x.id !== d.id);

  return (
    <div style={accentVars(d.id)}>
      {/* Hero */}
      <section className="relative border-b border-line bg-milk overflow-hidden">
        <span aria-hidden className="absolute inset-x-0 top-0 h-1 bg-[var(--accent)]" />
        <div className="shell">
          <Breadcrumbs trail={[{ label: t(d.label) }]} />
          <div className="grid lg:grid-cols-12 gap-10 pb-16 md:pb-24 pt-6">
            <div className="lg:col-span-7">
              <p className="eyebrow text-[var(--accent-ink)]">
                {String(d.order).padStart(2, '0')} · {ui('directions')}
              </p>
              <h1 className="h-display mt-4"><WordReveal text={t(d.label)} /></h1>
              <p className="lede mt-6 max-w-2xl"><Glossed text={t(d.definition)} /></p>
              <div className="mt-8 flex flex-wrap gap-2">
                {stages.map((s) => <StageTag key={s} stage={s} />)}
              </div>
            </div>
            <div className="lg:col-span-5 lg:pt-16">
              <p className="text-[1.0625rem] leading-relaxed text-slate font-light">{t(d.intro)}</p>
              <Reveal delay={120} className="mt-8">
                <Figure
                  photo={DIRECTION_PHOTO[d.id]}
                  ratio="3/2"
                  priority
                  sizes="(max-width: 1024px) 100vw, 38vw"
                  className="rounded-none border border-line"
                />
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Sub-directions — the permanent second level (§4.1) */}
      <section className="shell py-16 md:py-24">
        <SectionHeader
          eyebrow={ui('subDirections')}
          title={lang === 'ka' ? `${t(d.label)} — სტრუქტურა` : `How ${t(d.label)} is organised`}
          lede={lang === 'ka'
            ? 'თითოეული ქვემიმართულება ატარებს საკუთარ პორტფელს, ფილტრებით და შესაბამისი კონვერსიით.'
            : 'Each sub-direction carries its own portfolio, filtered by value-chain stage and technical domain.'}
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {d.subs.map((s, i) => (
            <CardLink
              key={s.slug}
              to={`/${d.id}/${s.slug}`}
              direction={d.id}
              index={String(i + 1).padStart(2, '0')}
              title={t(s.label)}
              description={t(s.definition)}
              tags={s.stages.map((st) => ui(st as never))}
              photo={photoForSub(d.id, s.slug)}
            />
          ))}
        </div>
      </section>

      {/* Featured capabilities */}
      {featured.length > 0 && (
        <section className="bg-milk border-y border-line">
          <div className="shell py-16 md:py-24">
            <SectionHeader
              eyebrow={ui('featured')}
              title={lang === 'ka' ? 'გამორჩეული შესაძლებლობები' : 'Featured capabilities'}
            />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {featured.map((o) => (
                <CardLink
                  key={o.slug}
                  to={`/${o.direction}/${o.sub}/${o.slug}`}
                  direction={d.id}
                  index={t(d.subs.find((s) => s.slug === o.sub)!.label)}
                  title={t(o.title)}
                  description={t(o.summary)}
                  tags={o.domains.slice(0, 3)}
                  shortlist={{ direction: o.direction, sub: o.sub, slug: o.slug }}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Cross-navigation to the other four directions (§10.1) */}
      <section className="shell py-16 md:py-24">
        <SectionHeader title={ui('relatedCapabilities')} />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {others.map((o) => (
            <Link
              key={o.id}
              to={href(`/${o.id}`)}
              style={accentVars(o.id)}
              className="group bg-milk border border-line rounded-none p-5 hover:border-[var(--accent)] hover:-translate-y-[3px] hover:shadow-md-x transition-[border-color,transform,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
            >
              <span aria-hidden className="block w-8 h-[3px] bg-[var(--accent)] mb-4" />
              <h3 className="text-[1.0625rem] font-semibold">{t(o.label)}</h3>
              <p className="mt-2 text-[0.875rem] text-slate leading-snug line-clamp-3">{t(o.definition)}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-[0.8125rem] font-semibold text-[var(--accent-ink)]">
                {ui('explore')} <ArrowRight size={14} aria-hidden className="transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <CtaBand
        direction={d.id}
        title={lang === 'ka' ? `${t(d.label)} — დაიწყეთ საუბარი` : `Talk to the ${t(d.label)} team`}
        body={lang === 'ka'
          ? 'აღწერეთ თქვენი საჭიროება და მოთხოვნა პირდაპირ შესაბამის კომერციულ მფლობელს მიუვა.'
          : 'Describe what you need and the inquiry reaches the commercial owner for this direction directly.'}
        primary={{ cta: d.subs[0].primaryCta }}
        secondary={d.subs[0].secondaryCta ? { cta: d.subs[0].secondaryCta } : undefined}
      />
    </div>
  );
}
