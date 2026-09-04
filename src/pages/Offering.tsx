import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { NotFound } from '@/pages/Misc';
import { ChevronDown, Info } from 'lucide-react';
import { getDirection, getSub } from '@/data/taxonomy';
import { getOffering, offeringsFor } from '@/data/offerings';
import { useT, useUI, useLang } from '@/lib/i18n';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { CardLink, CtaBand, CtaButton, Reveal, SectionHeader, StageTag, Tag, accentVars } from '@/components/ui';
import { ShortlistToggle } from '@/components/Shortlist';
import { Glossed } from '@/components/Glossary';
import { PrintButton, PrintFootnote, PrintHeader } from '@/components/Print';
import { Figure } from '@/components/Media';
import { ChainPosition } from '@/components/ChainPosition';
import { OFFERING_PHOTO, photoForSub } from '@/data/media';
import type { I18n, PageType } from '@/lib/types';

/**
 * OFFERING TEMPLATE — P04 Service, P05 Supply, P06/P07 Trade, P08 Production.
 * One component, section set chosen by the sub-direction's offeringPageType, so
 * the standards in §10.2 / §10.3 / §10.4 are enforced by the template rather
 * than by each author remembering them.
 *
 * Section content here is scaffold: the headings are the required CMS fields.
 * "Template annotations" name the field each block expects — this build is a
 * design reference for the content team, not the populated site.
 */

type SectionDef = { id: string; heading: I18n; field: I18n };

const SECTIONS: Record<string, SectionDef[]> = {
  service: [
    { id: 'who', heading: { en: 'Who it is for', ka: 'ვისთვის არის' }, field: { en: 'Target users, facility types and value-chain stages.', ka: 'სამიზნე მომხმარებლები, ობიექტების ტიპები და ჯაჭვის რგოლები.' } },
    { id: 'outcome', heading: { en: 'Need & outcome', ka: 'საჭიროება და შედეგი' }, field: { en: 'Problems addressed and the business or technical outcome delivered.', ka: 'გადასაჭრელი პრობლემები და მიღწეული ბიზნეს/ტექნიკური შედეგი.' } },
    { id: 'scope', heading: { en: 'Scope', ka: 'მოცულობა' }, field: { en: 'Explicit inclusions AND exclusions.', ka: 'ცხადი ჩართული და გამორიცხული სამუშაოები.' } },
    { id: 'deliverables', heading: { en: 'Deliverables', ka: 'მისაწოდებელი' }, field: { en: 'What the client physically receives.', ka: 'რას იღებს კლიენტი.' } },
    { id: 'process', heading: { en: 'Process', ka: 'პროცესი' }, field: { en: 'Typical steps from inquiry to completion.', ka: 'ტიპური ნაბიჯები მოთხოვნიდან დასრულებამდე.' } },
    { id: 'standards', heading: { en: 'Technical standards', ka: 'ტექნიკური სტანდარტები' }, field: { en: 'Engineering, quality, veterinary or food-safety standards that apply.', ka: 'მოქმედი საინჟინრო, ხარისხის, ვეტერინარული ან უვნებლობის სტანდარტები.' } },
    { id: 'commercial', heading: { en: 'Commercial model', ka: 'კომერციული მოდელი' }, field: { en: 'Project, fixed fee, recurring or managed — without inventing public pricing.', ka: 'პროექტი, ფიქსირებული, განმეორებადი ან მართული — საჯარო ფასის გამოგონების გარეშე.' } },
  ],
  supply: [
    { id: 'applications', heading: { en: 'Applications', ka: 'გამოყენება' }, field: { en: 'Where and for whom this supply is used.', ka: 'სად და ვისთვის გამოიყენება.' } },
    { id: 'variants', heading: { en: 'Categories & variants', ka: 'კატეგორიები და ვარიანტები' }, field: { en: 'Models, grades, capacities, formats or solution types.', ka: 'მოდელები, კლასები, სიმძლავრეები, ფორმატები.' } },
    { id: 'specs', heading: { en: 'Specifications', ka: 'სპეციფიკაცია' }, field: { en: 'Technical and commercial parameters for this product class.', ka: 'ტექნიკური და კომერციული პარამეტრები.' } },
    { id: 'standards', heading: { en: 'Standards & compliance', ka: 'სტანდარტები და შესაბამისობა' }, field: { en: 'Standards, certifications and origin information.', ka: 'სტანდარტები, სერტიფიკატები და წარმოშობა.' } },
    { id: 'sourcing', heading: { en: 'Sourcing & delivery', ka: 'მოწოდება და მიწოდება' }, field: { en: 'Availability, order model, lead time and delivery conditions.', ka: 'ხელმისაწვდომობა, შეკვეთის მოდელი, ვადა და მიწოდების პირობები.' } },
    { id: 'service', heading: { en: 'Associated service', ka: 'თანმხლები სერვისი' }, field: { en: 'Engineering, installation, commissioning, maintenance or training required.', ka: 'საჭირო ინჟინერია, მონტაჟი, ამოქმედება, მომსახურება ან ტრენინგი.' } },
  ],
  trade: [
    { id: 'commercial', heading: { en: 'Commercial data', ka: 'კომერციული მონაცემები' }, field: { en: 'Pack sizes, B2B/B2C, MOQ where public, channels, markets, availability.', ka: 'შეფუთვის ზომები, B2B/B2C, მინიმალური შეკვეთა, არხები, ბაზრები.' } },
    { id: 'technical', heading: { en: 'Technical data', ka: 'ტექნიკური მონაცემები' }, field: { en: 'Composition, storage, shelf life, nutrition, certifications.', ka: 'შემადგენლობა, შენახვა, ვარგისიანობა, კვებითი ღირებულება, სერტიფიკატები.' } },
    { id: 'origin', heading: { en: 'Origin & production', ka: 'წარმოშობა და წარმოება' }, field: { en: 'Facility or region and the production story where useful.', ka: 'ობიექტი ან რეგიონი და წარმოების ისტორია.' } },
    { id: 'logistics', heading: { en: 'Logistics', ka: 'ლოგისტიკა' }, field: { en: 'Cold-chain, storage and shipping information for this buyer type.', ka: 'ცივი ჯაჭვი, შენახვა და ტრანსპორტირება.' } },
  ],
  production: [
    { id: 'overview', heading: { en: 'Overview', ka: 'მიმოხილვა' }, field: { en: 'What this production activity is and how it is controlled.', ka: 'რა არის ეს საწარმოო საქმიანობა და როგორ კონტროლდება.' } },
    { id: 'capacity', heading: { en: 'Location & capacity', ka: 'ლოკაცია და სიმძლავრე' }, field: { en: 'Where it operates and at what scale.', ka: 'სად მუშაობს და რა მასშტაბით.' } },
    { id: 'technology', heading: { en: 'Technology & standards', ka: 'ტექნოლოგია და სტანდარტები' }, field: { en: 'Process technology, certifications and quality regime.', ka: 'ტექნოლოგია, სერტიფიკატები და ხარისხის რეჟიმი.' } },
    { id: 'outputs', heading: { en: 'Outputs', ka: 'პროდუქცია' }, field: { en: 'Products produced and where they go commercially.', ka: 'წარმოებული პროდუქცია და მისი კომერციული გზა.' } },
    { id: 'opportunities', heading: { en: 'Opportunities', ka: 'შესაძლებლობები' }, field: { en: 'Offtake, supply, contract or investment opportunities.', ka: 'რეალიზაციის, მომარაგების, კონტრაქტის ან ინვესტიციის შესაძლებლობები.' } },
  ],
  /* P10 Ecosystem entity / platform (§9). Without this, Dairy Academy and Dairy
     Market fell through to the service set and asked for "Scope", "Deliverables"
     and a "Commercial model" — fields a participation platform does not have. */
  platform: [
    { id: 'purpose', heading: { en: 'Purpose', ka: 'დანიშნულება' }, field: { en: 'What this platform exists to do for the industry.', ka: 'რისთვის არსებობს ეს პლატფორმა ინდუსტრიისთვის.' } },
    { id: 'users', heading: { en: 'Who uses it', ka: 'ვინ იყენებს' }, field: { en: 'Participant types and what each one gets out of it.', ka: 'მონაწილეთა ტიპები და რას იღებს თითოეული.' } },
    { id: 'features', heading: { en: 'What it offers', ka: 'რას გთავაზობთ' }, field: { en: 'Tools, content and functions available today.', ka: 'ხელმისაწვდომი ინსტრუმენტები, შინაარსი და ფუნქციები.' } },
    { id: 'participation', heading: { en: 'How to participate', ka: 'როგორ ჩაერთოთ' }, field: { en: 'Joining, listing, contributing or subscribing — with the entry requirements.', ka: 'გაწევრიანება, განთავსება, წვლილის შეტანა ან გამოწერა — მოთხოვნებით.' } },
    { id: 'platform', heading: { en: 'Dedicated platform', ka: 'სპეციალიზებული პლატფორმა' }, field: { en: 'Whether this moves to its own domain, and what stays here (§15).', ka: 'გადავა თუ არა საკუთარ დომენზე და რა რჩება აქ.' } },
  ],
  /* P12 Reference — structured facts, not a sales page. */
  reference: [
    { id: 'contains', heading: { en: 'What this contains', ka: 'რას შეიცავს' }, field: { en: 'Scope of the directory, catalog, dataset or standard set.', ka: 'ცნობარის, კატალოგის, მონაცემთა ბაზის ან სტანდარტების მოცულობა.' } },
    { id: 'structure', heading: { en: 'How it is structured', ka: 'როგორ არის სტრუქტურირებული' }, field: { en: 'Entities, fields and the classification used.', ka: 'ერთეულები, ველები და გამოყენებული კლასიფიკაცია.' } },
    { id: 'sources', heading: { en: 'Sources & maintenance', ka: 'წყაროები და განახლება' }, field: { en: 'Where the data comes from, who owns it and how often it is reviewed (§13).', ka: 'საიდან მოდის მონაცემები, ვინ არის მფლობელი და რა პერიოდულობით მოწმდება.' } },
    { id: 'use', heading: { en: 'How to use it', ka: 'როგორ გამოვიყენოთ' }, field: { en: 'Search, filter, citation and access conditions.', ka: 'ძიება, ფილტრი, ციტირება და წვდომის პირობები.' } },
  ],
  /* P09 Strategic programme — the Grid and anything like it. */
  grid: [
    { id: 'programme', heading: { en: 'Programme purpose', ka: 'პროგრამის დანიშნულება' }, field: { en: 'The industry problem the programme exists to solve.', ka: 'ინდუსტრიული პრობლემა, რომლის გადაწყვეტისთვისაც არსებობს პროგრამა.' } },
    { id: 'architecture', heading: { en: 'Architecture', ka: 'არქიტექტურა' }, field: { en: 'How farms, collection, processing and market access connect.', ka: 'როგორ უკავშირდება ერთმანეთს ფერმები, შეგროვება, გადამუშავება და ბაზარი.' } },
    { id: 'geography', heading: { en: 'Geography', ka: 'გეოგრაფია' }, field: { en: 'Regions covered and the sequence of rollout.', ka: 'დაფარული რეგიონები და გაშლის თანმიმდევრობა.' } },
    { id: 'participation', heading: { en: 'Participation', ka: 'მონაწილეობა' }, field: { en: 'Participant types, entry requirements and obligations.', ka: 'მონაწილეთა ტიპები, შესვლის მოთხოვნები და ვალდებულებები.' } },
    { id: 'standards', heading: { en: 'Standards', ka: 'სტანდარტები' }, field: { en: 'Quality, veterinary and operational standards the network holds to.', ka: 'ხარისხის, ვეტერინარული და საოპერაციო სტანდარტები.' } },
    { id: 'progress', heading: { en: 'Progress', ka: 'პროგრესი' }, field: { en: 'Verified milestones only — no projected figures presented as achieved.', ka: 'მხოლოდ დადასტურებული ეტაპები — პროგნოზი არ წარმოდგინდეს მიღწევად.' } },
  ],
};

const FALLBACK: SectionDef[] = SECTIONS.service;

export default function Offering() {
  const { direction, sub, slug } = useParams();
  const d = getDirection(direction ?? '');
  const s = getSub(direction ?? '', sub ?? '');
  const o = getOffering(direction ?? '', sub ?? '', slug ?? '');
  const [annotate, setAnnotate] = useState(true);
  const t = useT();
  const ui = useUI();
  const lang = useLang();

  if (!d || !s || !o) return <NotFound />;

  const sections = SECTIONS[s.offeringPageType as PageType] ?? FALLBACK;
  const related = offeringsFor(d.id, s.slug).filter((x) => x.slug !== o.slug).slice(0, 3);

  return (
    <div style={accentVars(d.id)}>
      <PrintHeader
        kind={ui('printKindSpec')}
        title={t(o.title)}
        meta={`${t(d.label)} · ${t(s.label)} · ${o.domains.join(', ')}`}
      />
      {/* Hero — §10.2/10.3: name, outcome, tags, primary CTA, network CTA */}
      <section className="relative border-b border-line bg-milk overflow-hidden">
        <span aria-hidden className="absolute inset-x-0 top-0 h-1 bg-[var(--accent)]" />
        <div className="shell">
          <Breadcrumbs
            trail={[
              { label: t(d.label), to: `/${d.id}` },
              { label: t(s.label), to: `/${d.id}/${s.slug}` },
              { label: t(o.title) },
            ]}
          />
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center pb-14 md:pb-20 pt-4">
            <div className="lg:col-span-7">
              <p className="no-print eyebrow text-[var(--accent-ink)]">{t(d.label)} · {t(s.label)}</p>
              <h1 className="no-print text-[clamp(1.875rem,4.2vw,3.25rem)] font-bold mt-3">{t(o.title)}</h1>
              <p className="lede mt-5"><Glossed text={t(o.summary)} /></p>
              <div className="mt-6 flex flex-wrap gap-2">
                {o.stages.map((st) => <StageTag key={st} stage={st} />)}
                {o.domains.map((dm) => <Tag key={dm}>{dm.replace(/-/g, ' ')}</Tag>)}
              </div>
              <div className="no-print mt-8 flex flex-wrap gap-3">
                <CtaButton cta={s.primaryCta} direction={d.id} sub={s.slug} offering={o.slug} />
                {s.secondaryCta && (
                  <CtaButton cta={s.secondaryCta} direction={d.id} sub={s.slug} offering={o.slug} variant="secondary" />
                )}
                {/* Collecting is deliberately a peer of the CTAs, not a third
                    call to action: a buyer specifying a line adds four things
                    here and sends one inquiry from the tray. */}
                <ShortlistToggle label item={{ direction: d.id, sub: s.slug, slug: o.slug }} />
                <PrintButton label={ui('printSpec')} />
              </div>
            </div>
            <Reveal delay={100} className="lg:col-span-5">
              <Figure
                photo={OFFERING_PHOTO[o.slug] ?? photoForSub(d.id, s.slug)}
                ratio="4/3"
                priority
                sizes="(max-width: 1024px) 100vw, 38vw"
                className="rounded-none border border-line"
              />
            </Reveal>
          </div>
        </div>
      </section>

      <div className="shell py-12 md:py-16">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
          {/* Local page navigation (§6) */}
          <aside className="lg:col-span-3">
            <div className="lg:sticky lg:top-28">
              <ChainPosition stages={o.stages} />
              <p className="no-print eyebrow mb-3 mt-8">{lang === 'ka' ? 'ამ გვერდზე' : 'On this page'}</p>
              <nav className="no-print" aria-label={lang === 'ka' ? 'გვერდის სექციები' : 'Page sections'}>
                <ul className="space-y-1 border-l border-line">
                  {sections.map((sec) => (
                    <li key={sec.id}>
                      <a
                        href={`#${sec.id}`}
                        className="block pl-4 py-1.5 -ml-px border-l-2 border-transparent text-[0.875rem] text-slate hover:text-ink hover:border-[var(--accent)] transition-colors"
                      >
                        {t(sec.heading)}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>

              <label className="no-print mt-8 flex items-start gap-2.5 text-[0.8125rem] text-slate cursor-pointer">
                <input
                  type="checkbox"
                  checked={annotate}
                  onChange={(e) => setAnnotate(e.target.checked)}
                  className="mt-0.5 accent-[var(--color-brand)]"
                />
                <span>{lang === 'ka' ? 'შაბლონის ანოტაციები' : 'Template annotations'}</span>
              </label>
            </div>
          </aside>

          {/* Section scaffold */}
          <div className="lg:col-span-9 space-y-12">
            {sections.map((sec) => (
              <section key={sec.id} id={sec.id} className="scroll-mt-28">
                <h2 className="text-[1.375rem] md:text-[1.625rem] font-semibold">{t(sec.heading)}</h2>
                <div className="mt-4 rounded-none border border-line bg-milk p-6">
                  {annotate ? (
                    <p className="flex items-start gap-2.5 text-[0.9375rem] text-slate">
                      <Info size={16} aria-hidden className="mt-0.5 shrink-0 text-[var(--accent-ink)]" />
                      <span>
                        <span className="font-semibold text-ink">
                          {lang === 'ka' ? 'CMS ველი: ' : 'CMS field: '}
                        </span>
                        {t(sec.field)}
                      </span>
                    </p>
                  ) : (
                    <p className="text-[0.9375rem] text-muted italic">
                      {lang === 'ka' ? 'შინაარსი მომზადების პროცესშია.' : 'Content in preparation.'}
                    </p>
                  )}
                </div>
              </section>
            ))}

            {/* Network CTA — how specialists or suppliers participate (§10.2/10.3) */}
            <section className="no-print rounded-none border border-line bg-mist/50 p-6 md:p-8">
              <h2 className="text-[1.25rem] font-semibold">
                {s.offeringPageType === 'supply'
                  ? (lang === 'ka' ? 'მომმარაგებელთა ქსელი' : 'Supplier network')
                  : (lang === 'ka' ? 'პროვაიდერთა ქსელი' : 'Provider network')}
              </h2>
              <p className="mt-2 text-[0.9375rem] text-slate max-w-2xl">
                {s.offeringPageType === 'supply'
                  ? (lang === 'ka'
                    ? 'მწარმოებლები, ბრენდები და მომმარაგებლები, რომლებსაც სურთ ამ კატეგორიაში მონაწილეობა.'
                    : 'Manufacturers, brands and suppliers who want to participate in this category.')
                  : (lang === 'ka'
                    ? 'კვალიფიციური სპეციალისტები და კომპანიები, რომლებიც ამ სერვისს ასრულებენ.'
                    : 'Qualified specialists and companies who deliver work in this service line.')}
              </p>
              <div className="mt-5">
                <CtaButton
                  cta={s.offeringPageType === 'supply' ? 'supplier-application' : 'provider-application'}
                  direction={d.id}
                  sub={s.slug}
                  variant="secondary"
                />
              </div>
            </section>
          </div>
        </div>
      </div>

      <PrintFootnote />

      {related.length > 0 && (
        <section className="bg-milk border-t border-line">
          <div className="shell py-14 md:py-20">
            <SectionHeader title={ui('relatedCapabilities')} />
            <div className="grid sm:grid-cols-3 gap-4">
              {related.map((r) => (
                <CardLink
                  key={r.slug}
                  to={`/${r.direction}/${r.sub}/${r.slug}`}
                  direction={d.id}
                  title={t(r.title)}
                  description={t(r.summary)}
                  shortlist={{ direction: r.direction, sub: r.sub, slug: r.slug }}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaBand
        direction={d.id}
        title={t(o.title)}
        body={t(o.summary)}
        primary={{ cta: s.primaryCta }}
        secondary={s.secondaryCta ? { cta: s.secondaryCta } : undefined}
      />
    </div>
  );
}
