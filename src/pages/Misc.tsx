import { Link, useLocation, useParams } from 'react-router-dom';
import { ArrowRight, Compass, FileText } from 'lucide-react';
import { AUDIENCES } from '@/data/site';
import { getDirection, getSub, DIRECTIONS } from '@/data/taxonomy';
import { PAGES, getPage } from '@/data/pages';
import { useHref, useLang, useT, useUI } from '@/lib/i18n';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { NavigatorPanel } from '@/components/Navigator';
import {
  Button, CardLink, CtaButton, Reveal, SectionHeader, Tag, accentVars,
} from '@/components/ui';

/* ========================================================================== */
/* Navigator page — the same panel, addressable and linkable (§6)             */
/* ========================================================================== */

export function NavigatorPage() {
  const ui = useUI();
  return (
    <>
      <PageHero
        eyebrow={ui('navigatorFull')}
        title={ui('navIntentQ')}
        lede={ui('navIntentHelp')}
        trail={[{ label: ui('navigatorFull') }]}
      />
      <div className="shell py-10 md:py-16">
        <Reveal>
          {/* embedded: the page hero above already carries the Navigator title. */}
          <div className="bg-milk border border-line rounded-none shadow-sm-x p-1">
            <NavigatorPanel embedded />
          </div>
        </Reveal>
      </div>
    </>
  );
}

/* ========================================================================== */
/* Shared page hero                                                           */
/* ========================================================================== */

function PageHero({
  eyebrow, title, lede, trail, meta,
}: {
  eyebrow?: string; title: string; lede?: string;
  trail: { label: string; to?: string }[]; meta?: string;
}) {
  return (
    <section className="relative border-b border-line bg-milk overflow-hidden">
      <span aria-hidden className="absolute inset-x-0 top-0 h-[3px] bg-[var(--accent,var(--color-brand))]" />
      <div className="shell">
        <Breadcrumbs trail={trail} />
        <Reveal className="pb-12 md:pb-16 pt-4 max-w-3xl">
          {eyebrow && (
            <p className="eyebrow flex items-center gap-3">
              <span aria-hidden className="w-6 h-px bg-[var(--accent,var(--color-brand))]" />
              {eyebrow}
            </p>
          )}
          <h1 className="text-[clamp(1.875rem,4vw,3.25rem)] font-bold mt-3 tracking-[-0.028em]">{title}</h1>
          {lede && <p className="lede mt-4">{lede}</p>}
          {meta && <p className="meta mt-6">{meta}</p>}
        </Reveal>
      </div>
    </section>
  );
}

/* ========================================================================== */
/* P14 Audience / Work With Us                                                */
/* ========================================================================== */

export function WorkWithUs() {
  const { audience } = useParams();
  const t = useT();
  const ui = useUI();
  const href = useHref();
  const lang = useLang();
  const one = AUDIENCES.find((a) => a.slug === audience);
  const rootLabel = lang === 'ka' ? 'ითანამშრომლეთ ჩვენთან' : 'Work with GEO Dairy';

  if (!one) {
    return (
      <>
        <PageHero
          eyebrow={lang === 'ka' ? 'მონაწილეობა' : 'Participation'}
          title={rootLabel}
          lede={lang === 'ka'
            ? 'აირჩიეთ თქვენი როლი და ნახეთ, რომელი შესაძლებლობები ეხება პირდაპირ თქვენ.'
            : 'Pick the role that describes you and see only the capabilities that apply to it.'}
          trail={[{ label: rootLabel }]}
        />
        <section className="shell py-14 md:py-20">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {AUDIENCES.map((a, i) => (
              <Reveal key={a.slug} delay={(i % 4) * 70}>
                <CardLink
                  to={`/work-with-us/${a.slug}`}
                  index={String(i + 1).padStart(2, '0')}
                  title={t(a.label)}
                  description={t(a.need)}
                  className="h-full"
                />
              </Reveal>
            ))}
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHero
        eyebrow={lang === 'ka' ? 'აუდიტორია' : 'Audience'}
        title={t(one.label)}
        lede={t(one.need)}
        trail={[{ label: rootLabel, to: '/work-with-us' }, { label: t(one.label) }]}
      />
      <section className="shell py-14 md:py-20">
        <div className="mb-10"><CtaButton cta={one.cta} /></div>
        <SectionHeader title={lang === 'ka' ? 'რეკომენდებული გზები' : 'Recommended routes'} />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {one.routes.map((r, i) => {
            const d = getDirection(r.direction)!;
            const sd = getSub(r.direction, r.sub)!;
            return (
              <Reveal key={`${r.direction}-${r.sub}`} delay={i * 70}>
                <CardLink
                  to={`/${r.direction}/${r.sub}`}
                  direction={r.direction}
                  index={t(d.label)}
                  title={t(sd.label)}
                  description={t(sd.definition)}
                  className="h-full"
                />
              </Reveal>
            );
          })}
        </div>
      </section>
    </>
  );
}

/* ========================================================================== */
/* P11 / P12 / P13 / P17 — institutional pages, each with its own identity     */
/* ========================================================================== */

export function GenericPage({ kind }: { kind: 'corporate' | 'industry' | 'legal' | 'projects' | 'careers' }) {
  const { pathname } = useLocation();
  const t = useT();
  const ui = useUI();
  const href = useHref();
  const lang = useLang();

  const path = pathname.replace(/^\/(en|ka)/, '').replace(/\/$/, '') || '/';
  const page = getPage(path);

  // An unregistered child path still deserves its own name rather than its parent's.
  const fallbackTitle = path.split('/').filter(Boolean).pop()?.replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase()) ?? 'GEO Dairy';

  const title = page ? t(page.title) : fallbackTitle;
  const purpose = page ? t(page.purpose) : '';
  const siblings = page ? PAGES.filter((p) => p.parent?.path === page.parent?.path && p.path !== page.path && p.parent) : [];

  const trail = [
    ...(page?.parent ? [{ label: t(page.parent.label), to: page.parent.path }] : []),
    { label: title },
  ];

  return (
    <>
      <PageHero
        eyebrow={page?.template ?? kind}
        title={title}
        lede={purpose}
        trail={trail}
        meta={page?.kind === 'legal'
          ? (lang === 'ka' ? 'ვერსია 0.1 · ძალაში შესვლის თარიღი: გამოქვეყნებამდე' : 'Version 0.1 · Effective date: pending publication')
          : undefined}
      />

      <section className="shell py-14 md:py-20">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-8">
            {/* The section skeleton this page owes the reader (§10.1). */}
            {page && (
              <Reveal>
                <ol className="relative border border-line rounded-none bg-milk divide-y divide-line">
                  {page.sections.map((sec, i) => (
                    <li key={sec.en} className="flex items-baseline gap-5 p-5 md:p-6">
                      <span className="eyebrow text-brand-deep shrink-0">{String(i + 1).padStart(2, '0')}</span>
                      <span className="text-[1.0625rem] font-medium">{t(sec)}</span>
                    </li>
                  ))}
                </ol>
              </Reveal>
            )}

            <Reveal delay={80}>
              <div className="mt-8 flex items-start gap-3 border border-dashed border-line-strong rounded-none p-5 md:p-6">
                <FileText size={16} aria-hidden className="mt-0.5 shrink-0 text-muted" />
                <p className="text-[0.9375rem] text-slate leading-relaxed prose-measure">
                  {lang === 'ka'
                    ? 'სტრუქტურა, ნავიგაცია, ჯვარედინი ბმულები და კონვერსიის ქცევა განსაზღვრულია. რედაქციული შინაარსი იწერება Phase 1-ის ფარგლებში, დანიშნული შინაარსის მფლობელისა და მიმოხილვის თარიღით.'
                    : 'Structure, navigation, cross-linking and conversion behaviour are defined. The editorial content is written during Phase 1 (§17), against a named content owner and review date (§13).'}
                </p>
              </div>
            </Reveal>

            {siblings.length > 0 && (
              <div className="mt-12">
                <p className="eyebrow mb-4">{page?.parent ? t(page.parent.label) : ''}</p>
                <ul className="flex flex-wrap gap-2">
                  {siblings.map((sib) => (
                    <li key={sib.path}>
                      <Link
                        to={href(sib.path)}
                        className="inline-flex items-center gap-2 bg-milk border border-line rounded-none px-4 py-2.5 text-[0.875rem]
                          hover:border-line-strong hover:bg-parchment transition-colors duration-200"
                      >
                        {t(sib.title)}
                        <ArrowRight size={13} aria-hidden className="text-muted" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-28 space-y-3">
              <p className="eyebrow">{ui('directions')}</p>
              {DIRECTIONS.map((d) => (
                <Link
                  key={d.id}
                  to={href(`/${d.id}`)}
                  style={accentVars(d.id)}
                  className="group flex items-center justify-between gap-3 bg-milk border border-line rounded-none px-4 py-3
                    hover:border-[var(--accent)] transition-colors duration-200"
                >
                  <span className="flex items-center gap-3">
                    <span aria-hidden className="w-1 h-5 bg-[var(--accent)]" />
                    <span className="text-[0.9375rem] font-medium">{t(d.label)}</span>
                  </span>
                  <ArrowRight size={14} aria-hidden className="text-muted transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              ))}
              <div className="pt-3">
                <Button to="/navigator" variant="secondary" className="w-full">
                  <Compass size={15} aria-hidden /> {ui('navigatorFull')}
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}

/* ========================================================================== */

export function NotFound() {
  const lang = useLang();
  const ui = useUI();
  return (
    <section className="shell py-24 md:py-36">
      <p className="eyebrow">404</p>
      <h1 className="h-display mt-4 max-w-3xl">
        {lang === 'ka' ? 'ეს გვერდი არ არსებობს' : 'That page does not exist'}
      </h1>
      <p className="lede mt-5">
        {lang === 'ka'
          ? 'შესაძლოა შეთავაზება არქივირდა ან მისამართი შეიცვალა. ნავიგატორი გიპოვით სწორ ადგილს.'
          : 'The offering may have been archived or the address changed. The Navigator will find where it belongs now.'}
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button to="/">{ui('home')}</Button>
        <Button to="/navigator" variant="secondary">
          <Compass size={15} aria-hidden /> {ui('navigatorFull')}
        </Button>
        <Button to="/search" variant="secondary">{ui('search')}</Button>
      </div>
    </section>
  );
}

export { PageHero };
