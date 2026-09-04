import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, ClipboardList, Compass } from 'lucide-react';
import { DIRECTIONS } from '@/data/taxonomy';
import { featuredOfferings, OFFERINGS } from '@/data/offerings';
import { AUDIENCES, COVERAGE_PLACEHOLDER, PROOF_POINTS } from '@/data/site';
import { useHref, useT, useUI, useLang } from '@/lib/i18n';
import {
  Button, CardLink, CardShell, CtaButton, Reveal, SectionHeader, Tag, WordReveal, accentVars,
} from '@/components/ui';
import { Figure, BackdropPhoto } from '@/components/Media';
import { OFFERING_PHOTO, STAGE_PHOTO } from '@/data/media';
import { LazyHeroGrid, LazyValueChain, LazyGeorgiaMap } from '@/components/three/Lazy3D';
import { GEORGIA_REGIONS } from '@/data/regions';
import { NavigatorPanel } from '@/components/Navigator';
import { DirectionsShowcase, DirectionsModeSwitch } from '@/components/home/DirectionsShowcase';
import type { ChainStage } from '@/components/three/ValueChainScene';

/** P01 HOME — brief §11. Section order and exclusions follow the sequence table. */
export default function Home({ onOpenNavigator }: { onOpenNavigator: () => void }) {
  const t = useT();
  const ui = useUI();
  const href = useHref();
  const navigate = useNavigate();
  const lang = useLang();
  const [stage, setStage] = useState<ChainStage | null>(null);
  const [region, setRegion] = useState<string | null>(null);

  return (
    <>
      <DirectionsModeSwitch />

      {/* 01 — HERO. One H1, one value statement, two actions. Nothing more (§11.1). */}
      <section data-chain-stage="upstream" className="relative overflow-hidden border-b border-line">
        {/* The node field is confined to the lower-right quadrant so it can never
            sit behind the H1 or the lede — a backdrop that costs reading contrast
            is not a backdrop worth having (§12.4). */}
        <div className="hidden lg:block absolute bottom-0 right-0 w-[56%] h-[72%] pointer-events-none">
          <LazyHeroGrid />
        </div>
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(100deg, var(--color-cream) 0%, var(--color-cream) 46%, rgba(246,245,240,0.55) 62%, rgba(246,245,240,0) 88%),' +
              'linear-gradient(to bottom, var(--color-cream) 8%, rgba(246,245,240,0) 42%, rgba(246,245,240,0) 78%, var(--color-cream) 100%)',
          }}
        />
        <div className="shell relative py-24 md:py-36 lg:py-44">
          <Reveal>
            <p className="eyebrow mb-6 flex items-center gap-3">
              <span aria-hidden className="w-8 h-px bg-brand" />
              {lang === 'ka' ? 'საქართველოს რძის ინდუსტრია' : "Georgia's dairy industry"}
            </p>
            <h1 className="h-display max-w-5xl">
              {lang === 'ka'
                ? <WordReveal text="რძის ინდუსტრია, როგორც ერთი სისტემა" accentFrom={2} />
                : <WordReveal text="The dairy industry, operated as one system" accentFrom={3} />}
            </h1>
            <p className="lede mt-7">
              {lang === 'ka'
                ? 'GEO Dairy არის საქართველოს ინტეგრირებული რძის ინდუსტრიის კომპანია და ეკოსისტემა — აკავშირებს წარმოებას, მომარაგებას, სერვისს, ვაჭრობას, ცოდნას, ინფრასტრუქტურასა და ბაზრის განვითარებას.'
                : 'GEO Dairy is Georgia’s integrated dairy-industry company and ecosystem — connecting production, supply, service, trade, knowledge, infrastructure and market development across the dairy value chain.'}
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button to="/ecosystem" variant="primary">
                {lang === 'ka' ? 'გაეცანით GEO Dairy-ს' : 'Explore GEO Dairy'}
                <ArrowRight size={15} aria-hidden className="transition-transform duration-200 group-hover/btn:translate-x-0.5" />
              </Button>
              <Button variant="secondary" onClick={onOpenNavigator}>
                <Compass size={15} aria-hidden /> {ui('navigatorFull')}
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 02 — WHAT GEO DAIRY IS */}
      <section data-chain-stage="upstream" className="shell py-20 md:py-28">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <p className="eyebrow mb-4">{lang === 'ka' ? 'ჩვენ შესახებ' : 'What GEO Dairy is'}</p>
            <h2 className="h-section">
              {lang === 'ka'
                ? 'ერთი კომპანია, რომელიც მთელ ჯაჭვს ფარავს'
                : 'One company across the whole chain'}
            </h2>
          </Reveal>
          <Reveal delay={80} className="lg:col-span-7">
            <p className="text-[1.0625rem] md:text-[1.1875rem] leading-[1.6] text-slate font-light prose-measure">
              {lang === 'ka'
                ? 'ქართული რძის სექტორი ფრაგმენტულია: ფერმა ერთ ადგილას, გადამუშავება მეორეში, ბაზარზე გასვლა — მესამეში. GEO Dairy მუშაობს ხუთი მუდმივი მიმართულებით, რომელიც ერთმანეთს ავსებს — და სწორედ ეს კავშირი ქმნის ღირებულებას.'
                : 'The Georgian dairy sector is fragmented — the farm in one place, processing in another, market access in a third. GEO Dairy works through five permanent directions that reinforce each other, and it is the connection between them, more than any single one, that produces the value.'}
            </p>
            <div className="relative mt-9 grid sm:grid-cols-3 gap-px bg-line border border-line rounded-none overflow-hidden">
              {([
                { k: 'upstream', n: '01' },
                { k: 'midstream', n: '02' },
                { k: 'downstream', n: '03' },
              ] as const).map(({ k, n }) => (
                <div key={k} className="group/media bg-milk">
                  <Figure photo={STAGE_PHOTO[k]} ratio="3/2" sizes="(max-width: 640px) 100vw, 22vw" />
                  <div className="p-5 md:p-6">
                    <span className="eyebrow text-brand-deep">{n}</span>
                    <h3 className="mt-2.5 text-[1.0625rem] font-semibold">{ui(k as never)}</h3>
                    <p className="mt-1.5 text-[0.875rem] text-slate leading-snug">{ui(`${k}Def` as never)}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* 03 — DAIRY VALUE CHAIN. Moved ahead of the directions: it is the
              legend the spine and the five sections both read from. 3D diagram; every label is HTML beside it. */}
      <section className="shell py-20 md:py-28">
        <SectionHeader
          index="03"
          eyebrow={lang === 'ka' ? 'ღირებულების ჯაჭვი' : 'Value chain'}
          title={lang === 'ka' ? 'სად მოქმედებს GEO Dairy' : 'Where GEO Dairy operates'}
          lede={lang === 'ka'
            ? 'პირველადი წარმოებიდან გადამუშავებამდე და ბაზრამდე. ჯაჭვის გამჯოლი შესაძლებლობები ძველა რგოლს ეხება.'
            : 'From raw milk through processing to the market. Cross-chain capabilities sit above every stage rather than inside one.'}
        />
      </section>

      <div className="shell">
        <Reveal>
          <div className="rounded-[2px] border border-line bg-gradient-to-b from-milk to-parchment/50 overflow-hidden shadow-sm-x">
            <div className="relative h-[300px] md:h-[400px]">
              <LazyValueChain active={stage} onActiveChange={setStage} />
            </div>
            <div className="grid grid-cols-3 border-t border-line">
              {(['upstream', 'midstream', 'downstream'] as ChainStage[]).map((sName, i) => (
                <button
                  key={sName}
                  type="button"
                  onMouseEnter={() => setStage(sName)}
                  onMouseLeave={() => setStage(null)}
                  onFocus={() => setStage(sName)}
                  onBlur={() => setStage(null)}
                  className={`text-left p-5 md:p-6 border-r border-line last:border-r-0 transition-colors duration-300 ${
                    stage === sName ? 'bg-parchment' : 'hover:bg-parchment/60'
                  }`}
                >
                  <span className="eyebrow flex items-center gap-2">
                    <span className="text-brand-deep">{String(i + 1).padStart(2, '0')}</span>
                    {ui(sName as never)}
                  </span>
                  <span className="block mt-1.5 text-[0.875rem] text-slate leading-snug">
                    {ui(`${sName}Def` as never)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </Reveal>
        <p className="mt-4 flex items-center gap-2.5 text-[0.8125rem] text-muted">
          <Tag>{ui('cross-chain')}</Tag>
          <span>{ui('cross-chainDef')}</span>
        </p>
      </div>

      {/* 04–08 — THE FIVE DIRECTIONS, one section each.

              They are the only primary business navigation on the site (§19),
              and rendering them as five identical cards said they were five
              identical things. They are not: Ecosystem is a network, Trade moves
              goods to destinations, Service is a ladder a client walks down,
              Supply is a catalogue you browse, and Production is the one place
              GEO Dairy is the operator rather than the intermediary. Each gets
              the composition its own nature asks for; the numerals, type scale,
              accent mechanism and closing link keep them one family.

              The chain stage on each wrapper is the truth about that direction,
              not a tidy descent — the five spanning the chain in different
              places is precisely the claim the page is making. */}
      <DirectionsShowcase />

      {/* 05 — NAVIGATOR. Prominent, interactive, reusable (§7). */}
      <section className="bg-brand-soft/50 border-y border-line">
        <div className="shell py-20 md:py-28">
          <div className="grid lg:grid-cols-12 gap-10">
            <Reveal className="lg:col-span-4">
              <p className="eyebrow mb-4 flex items-center gap-2">
                <Compass size={13} aria-hidden /> {ui('navigatorFull')}
              </p>
              <h2 className="h-section">{ui('navIntentQ')}</h2>
              <p className="lede mt-4">{ui('navIntentHelp')}</p>

              {/* The configurator answers the neighbouring question — not "where
                  do I go?" but "what do I need?" — so it belongs beside the
                  Navigator rather than in a section of its own. */}
              <div className="mt-8 pt-7 border-t border-line">
                <p className="text-[0.9375rem] text-slate leading-[1.65]">{ui('planHomeNote')}</p>
                <Link
                  to={href('/plan')}
                  className="mt-3 inline-flex items-center gap-2 text-[0.9375rem] font-semibold
                    text-brand-deep hover:text-ink transition-colors"
                >
                  <ClipboardList size={16} aria-hidden />
                  {ui('planTitle')}
                  <ArrowRight size={15} aria-hidden />
                </Link>
              </div>
            </Reveal>
            <Reveal delay={80} className="lg:col-span-8">
              <div className="bg-milk border border-line rounded-none shadow-sm-x">
                <NavigatorPanel embedded />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 06 — FEATURED CAPABILITIES, drawn from every direction. */}
      <section className="shell py-20 md:py-28">
        <SectionHeader
          index="07"
          eyebrow={lang === 'ka' ? 'შესაძლებლობები' : 'Capabilities'}
          title={lang === 'ka' ? 'გამორჩეული შეთავაზებები' : 'Featured capabilities'}
          lede={lang === 'ka'
            ? 'შერჩეული სერვისები, მომარაგება, ვაჭრობა და წარმოება — სრული პორტფელი მიმართულებების შიგნითაა.'
            : 'A curated slice of Service, Supply, Trade, Production and Ecosystem. The full portfolio lives inside each direction.'}
          action={
            <Button to="/search" variant="secondary">
              {lang === 'ka' ? 'ყველა შესაძლებლობა' : 'All capabilities'}
              <ArrowRight size={15} aria-hidden className="transition-transform duration-200 group-hover/btn:translate-x-0.5" />
            </Button>
          }
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredOfferings().slice(0, 8).map((o, i) => (
            <Reveal key={`${o.direction}-${o.slug}`} delay={(i % 4) * 70}>
              <CardLink
                to={`/${o.direction}/${o.sub}/${o.slug}`}
                direction={o.direction}
                index={t(DIRECTIONS.find((d) => d.id === o.direction)!.label)}
                title={t(o.title)}
                description={t(o.summary)}
                tags={o.stages.map((s) => ui(s as never))}
                shortlist={{ direction: o.direction, sub: o.sub, slug: o.slug }}
                className="h-full"
              />
            </Reveal>
          ))}
        </div>
      </section>

      {/* 07 — DAIRY GRID, with the route to its dedicated platform (§15).
              The one dark contrast moment in a mostly light composition. */}
      <section style={accentVars('production')} className="on-dark relative bg-graphite text-milk overflow-hidden">
        <BackdropPhoto photo="barnAisle" opacity={0.32} />
        <span aria-hidden className="absolute inset-x-0 top-0 h-[3px] bg-signal z-10" />
        <div className="shell relative z-10 py-20 md:py-28">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            <Reveal className="lg:col-span-7">
              <p className="eyebrow text-signal">{lang === 'ka' ? 'ფლაგმანური პროგრამა' : 'Flagship programme'}</p>
              <h2 className="h-section mt-3">Dairy Grid</h2>
              <p className="mt-5 text-[1.0625rem] md:text-[1.1875rem] text-mist/70 font-light leading-[1.6] prose-measure">
                {lang === 'ka'
                  ? 'კოორდინირებული ფერმები, შეგროვება, გადამუშავება და ბაზარზე წვდომა, რომლებიც ერთ ეროვნულ ქსელად მუშაობს. Grid კვეთს ჯაჭვის ყველა რგოლს — ამიტომაც აქვს საკუთარი პლატფორმა.'
                  : 'Coordinated farms, collection, processing and market access operating as one national network. The Grid cuts across every stage of the chain — which is why it has a platform of its own.'}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button to="/production/grid" variant="inverse">
                  {lang === 'ka' ? 'Grid-ის შესახებ' : 'About the Grid'}
                  <ArrowRight size={15} aria-hidden className="transition-transform duration-200 group-hover/btn:translate-x-0.5" />
                </Button>
                <Button href="https://dairygrid.ge" variant="ghost-inverse">dairygrid.ge</Button>
              </div>
            </Reveal>
            <Reveal delay={80} className="lg:col-span-5">
              <div className="relative grid grid-cols-2 gap-px bg-milk/10 border border-milk/12 rounded-none overflow-hidden">
                {[
                  { en: 'Farms', ka: 'ფერმები' },
                  { en: 'Collection', ka: 'შეგროვება' },
                  { en: 'Processing', ka: 'გადამუშავება' },
                  { en: 'Market access', ka: 'ბაზარზე წვდომა' },
                ].map((n, i) => (
                  <div key={n.en} className="bg-graphite p-5 md:p-6">
                    <span className="eyebrow text-signal/80">{String(i + 1).padStart(2, '0')}</span>
                    <span className="block mt-2.5 text-[0.9375rem] font-medium text-milk">{t(n)}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 08 — GEO DAIRY IN GEORGIA.
              A real extruded map of the country's twelve administrative regions,
              hover-linked to the list beside it. The brief allows a map only
              where location materially matters (§6) — coverage is exactly that
              case, and the shape is the country's own, not an impression. */}
      <section className="shell py-20 md:py-28">
        <SectionHeader
          index="08"
          eyebrow={lang === 'ka' ? 'დაფარვა' : 'Coverage'}
          title={lang === 'ka' ? 'GEO Dairy საქართველოში' : 'GEO Dairy in Georgia'}
          lede={t(COVERAGE_PLACEHOLDER.note)}
        />
        <Reveal>
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
            <div className="lg:col-span-8 relative min-h-[300px] md:min-h-[400px] rounded-none bg-gradient-to-b from-parchment/70 to-cream overflow-hidden">
              <LazyGeorgiaMap
                statuses={COVERAGE_PLACEHOLDER.status}
                hovered={region}
                onHover={setRegion}
                onSelect={(id) => navigate(href(`/regions/${id}`))}
              />
              <p className="absolute left-5 bottom-4 meta pointer-events-none">
                {lang === 'ka' ? 'ადმინისტრაციული რეგიონები · 12' : 'Administrative regions · 12'}
              </p>
            </div>

            <div className="lg:col-span-4">
              <ul className="divide-y divide-line border border-line rounded-none bg-milk overflow-hidden">
                {GEORGIA_REGIONS.map((r) => {
                  const status = COVERAGE_PLACEHOLDER.status[r.id] ?? 'none';
                  const on = region === r.id;
                  return (
                    <li key={r.id}>
                      {/* A link, not a button: the map is the pointer shortcut,
                          and this list is the route that works without one. */}
                      <Link
                        to={href(`/regions/${r.id}`)}
                        onMouseEnter={() => setRegion(r.id)}
                        onMouseLeave={() => setRegion(null)}
                        onFocus={() => setRegion(r.id)}
                        onBlur={() => setRegion(null)}
                        className={`w-full text-left flex items-center justify-between gap-3 px-4 py-2.5 transition-colors duration-200 ${
                          on ? 'bg-brand-soft/60' : 'hover:bg-parchment/60'
                        }`}
                      >
                        <span className="text-[0.875rem] font-medium">{lang === 'ka' ? r.ka : r.en}</span>
                        <span className={`flex items-center gap-1.5 font-mono text-[0.625rem] tracking-[0.08em] uppercase shrink-0 ${
                          status === 'operating' ? 'text-brand-deep'
                            : status === 'development' ? 'text-slate' : 'text-muted'
                        }`}>
                          <span aria-hidden className={`w-1.5 h-1.5 rounded-full ${
                            status === 'operating' ? 'bg-brand'
                              : status === 'development' ? 'bg-supply'
                              : status === 'planned' ? 'bg-line-strong'
                              : 'bg-transparent border border-line-strong'
                          }`} />
                          {t(COVERAGE_PLACEHOLDER.statusLabels[status])}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </Reveal>
      </section>

      {/* 09 — WORK WITH GEO DAIRY. Audience routing without audience menu items (§3). */}
      <section className="bg-parchment/60 border-y border-line">
        <div className="shell py-20 md:py-28">
          <SectionHeader
            index="09"
            eyebrow={lang === 'ka' ? 'მონაწილეობა' : 'Participation'}
            title={lang === 'ka' ? 'იმუშავეთ GEO Dairy-სთან' : 'Work with GEO Dairy'}
            lede={lang === 'ka'
              ? 'იპოვეთ თქვენი გზა — ტაქსონომიის ცოდნის გარეშე.'
              : 'Find your route in without needing to know how we are organised.'}
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {AUDIENCES.map((a, i) => (
              <Reveal key={a.slug} delay={(i % 4) * 70}>
                <CardShell
                  to={`/work-with-us/${a.slug}`}
                  className="h-full flex flex-col justify-between bg-milk border border-line rounded-[2px] p-6 min-h-[13.5rem]"
                >
                  <span>
                    <h3 className="h-card card-title">{t(a.label)}</h3>
                    <span className="block mt-2.5 text-[0.875rem] text-slate leading-relaxed">{t(a.need)}</span>
                  </span>
                  <span className="mt-5 inline-flex items-center gap-2 text-[0.8125rem] font-medium text-brand-deep">
                    {ui(`cta.${a.cta}` as never)}
                    <span className="card-arrow" aria-hidden>
                      <ArrowRight size={15} />
                      <ArrowRight size={15} />
                    </span>
                  </span>
                </CardShell>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 10 — COMMERCIAL HIGHLIGHTS. Selected, never a consumer catalog (§11.1). */}
      <section className="shell py-20 md:py-28">
        <SectionHeader
          index="10"
          eyebrow={lang === 'ka' ? 'კომერციული' : 'Commercial'}
          title={lang === 'ka' ? 'პროდუქცია და ვაჭრობა' : 'Products & trade'}
          action={
            <Button to="/trade" variant="secondary">
              {t(DIRECTIONS[1].label)}
              <ArrowRight size={15} aria-hidden className="transition-transform duration-200 group-hover/btn:translate-x-0.5" />
            </Button>
          }
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {OFFERINGS.filter((o) => o.direction === 'trade' || o.direction === 'production').slice(0, 6).map((o, i) => (
            <Reveal key={`${o.direction}-${o.slug}`} delay={(i % 3) * 70}>
              <CardLink
                to={`/${o.direction}/${o.sub}/${o.slug}`}
                direction={o.direction}
                index={t(DIRECTIONS.find((d) => d.id === o.direction)!.label)}
                title={t(o.title)}
                description={t(o.summary)}
                photo={OFFERING_PHOTO[o.slug]}
                shortlist={{ direction: o.direction, sub: o.sub, slug: o.slug }}
                className="h-full"
              />
            </Reveal>
          ))}
        </div>
      </section>

      {/* 11 — AUTHORITY / PROOF. Not a news feed (§11.1). */}
      <section className="bg-mist/50 border-y border-line">
        <div className="shell py-20 md:py-28">
          <SectionHeader
            index="11"
            eyebrow={lang === 'ka' ? 'პრინციპები' : 'How we work'}
            title={lang === 'ka' ? 'რაზე დგას GEO Dairy' : 'What GEO Dairy stands on'}
          />
          <Reveal>
            <div className="relative grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-line border border-line rounded-none overflow-hidden">
              {PROOF_POINTS.map((p, i) => (
                <div key={p.label.en} className="bg-milk p-6 md:p-7">
                  <span className="eyebrow text-brand-deep">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="mt-3 text-[1.0625rem] font-semibold">{t(p.label)}</h3>
                  <p className="mt-2.5 text-[0.875rem] text-slate leading-relaxed">{t(p.body)}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* 12 — INTERNATIONAL / GEORGIA ADVANTAGE */}
      <section className="shell py-20 md:py-28">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <Reveal className="lg:col-span-6">
            <p className="eyebrow mb-4">{lang === 'ka' ? 'საერთაშორისო' : 'International'}</p>
            <h2 className="h-section">
              {lang === 'ka' ? 'საქართველო, როგორც რძის ბაზარი და წყარო' : 'Georgia as a dairy market and a source'}
            </h2>
            <p className="lede mt-5">
              {lang === 'ka'
                ? 'საერთაშორისო კომპანიებისთვის საქართველო ორივეა: ბაზარი, სადაც შემოდიხართ, და წყარო, საიდანაც შეისყიდით. GEO Dairy ორივე მიმართულებით მუშაობს.'
                : 'For an international company Georgia is two things at once: a market to enter and a source to buy from. GEO Dairy works in both directions — technology and brands coming in, Georgian dairy going out.'}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <CtaButton cta="trade-inquiry" direction="trade" sub="international" />
              <CtaButton cta="supplier-application" direction="supply" variant="secondary" />
            </div>
          </Reveal>
          <Reveal delay={80} className="lg:col-span-6">
            <div className="grid sm:grid-cols-2 gap-px bg-line border border-line rounded-none overflow-hidden">
              {[
                { t: { en: 'Enter Georgia', ka: 'შემოდით საქართველოში' }, b: { en: 'Market entry analysis, distribution partnership and local representation.', ka: 'ბაზარზე შესვლის ანალიზი, სადისტრიბუციო პარტნიორობა და ადგილობრივი წარმომადგენლობა.' }, to: '/trade/distribution' },
                { t: { en: 'Source from Georgia', ka: 'შეისყიდეთ საქართველოდან' }, b: { en: 'Georgian cheese and dairy prepared, documented and shipped to export buyers.', ka: 'ქართული ყველი და რძის პროდუქცია მომზადებული და გაგზავნილი მყიდველებისთვის.' }, to: '/trade/international' },
                { t: { en: 'Supply technology', ka: 'მიაწოდეთ ტექნოლოგია' }, b: { en: 'Represent your equipment or inputs across the Georgian dairy industry.', ka: 'წარმოადგინეთ თქვენი აღჭურვილობა ან რესურსები ქართულ ინდუსტრიაში.' }, to: '/supply/equipment' },
                { t: { en: 'Invest in the chain', ka: 'დააბანდეთ ჯაჭვში' }, b: { en: 'Production assets, projects and Dairy Grid participation.', ka: 'საწარმოო აქტივები, პროექტები და Dairy Grid-ში მონაწილეობა.' }, to: '/supply/capital' },
              ].map((c) => (
                <Link
                  key={c.t.en}
                  to={href(c.to)}
                  className="group bg-milk p-5 md:p-6 transition-colors duration-300 hover:bg-parchment/70"
                >
                  <h3 className="text-[1rem] font-semibold flex items-center gap-1.5">
                    {t(c.t)}
                    <ArrowUpRight size={15} aria-hidden className="text-muted transition-all duration-300 group-hover:text-brand-deep group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </h3>
                  <p className="mt-2 text-[0.875rem] text-slate leading-relaxed">{t(c.b)}</p>
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* 13 — FINAL CTA */}
      <section className="on-dark relative overflow-hidden bg-ink text-milk">
        <span aria-hidden className="absolute inset-x-0 top-0 h-[3px] bg-brand" />
        <div className="shell py-20 md:py-28">
          <Reveal className="max-w-3xl">
            <h2 className="h-section">
              {lang === 'ka' ? 'დაიწყეთ საუბარი, რომელსაც მნიშვნელობა აქვს' : 'Start the conversation that matters'}
            </h2>
            <p className="mt-5 text-[1.0625rem] text-mist/65 font-light leading-relaxed prose-measure">
              {lang === 'ka'
                ? 'გვითხარით რა გჭირდებათ — ან მიეცით ნავიგატორს ამის გარკვევის საშუალება.'
                : 'Tell us what you need, or let the Navigator work out where it belongs.'}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <CtaButton cta="contact" variant="inverse" />
              <Button variant="ghost-inverse" onClick={onOpenNavigator}>
                <Compass size={15} aria-hidden /> {ui('navOpen')}
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
