import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { getSub } from '@/data/taxonomy';
import { useLang, useT, useUI } from '@/lib/i18n';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import {
  Button, CtaBand, Reveal, SectionHeader, StageTag, WordReveal, accentVars,
} from '@/components/ui';
import { BackdropPhoto, Figure } from '@/components/Media';
import { LazyGridNetwork } from '@/components/three/Lazy3D';
import type { I18n } from '@/lib/types';

/**
 * P09 STRATEGIC PROGRAMME — brief §9.
 * The Grid is a cross-value-chain programme, not a portfolio of offerings, so it
 * gets the template §9 specifies rather than the generic sub-direction page it
 * was inheriting: purpose, architecture, geography, participation, standards,
 * progress, and the route out to dairygrid.ge (§15).
 */

const ARCHITECTURE: { n: string; label: I18n; body: I18n }[] = [
  {
    n: '01',
    label: { en: 'Farms', ka: 'ფერმები' },
    body: {
      en: 'Participating dairy farms operating to a shared quality and record-keeping standard, with access to inputs, genetics and technical support.',
      ka: 'მონაწილე ფერმები, რომლებიც მუშაობენ საერთო ხარისხისა და აღრიცხვის სტანდარტით, რესურსების, გენეტიკისა და ტექნიკური მხარდაჭერის ხელმისაწვდომობით.',
    },
  },
  {
    n: '02',
    label: { en: 'Collection', ka: 'შეგროვება' },
    body: {
      en: 'Cooled collection points and tested transport, so milk leaves the farm and reaches the plant inside one unbroken cold chain.',
      ka: 'გაცივებული შესაგროვებელი პუნქტები და ტესტირებული ტრანსპორტი — უწყვეტი ცივი ჯაჭვი ფერმიდან საწარმომდე.',
    },
  },
  {
    n: '03',
    label: { en: 'Processing', ka: 'გადამუშავება' },
    body: {
      en: 'Contracted and owned processing capacity converting Grid milk into products with traceable origin.',
      ka: 'საკონტრაქტო და საკუთარი გადამამუშავებელი სიმძლავრე, რომელიც Grid-ის რძეს აქცევს მიკვლევადი წარმოშობის პროდუქციად.',
    },
  },
  {
    n: '04',
    label: { en: 'Market access', ka: 'ბაზარზე წვდომა' },
    body: {
      en: 'Wholesale, retail and export channels that a single farm could not reach alone, opened to the network as a whole.',
      ka: 'საბითუმო, საცალო და საექსპორტო არხები, რომლებსაც ცალკეული ფერმა ვერ მიაღწევდა — ქსელისთვის ღიად.',
    },
  },
];

const PARTICIPANTS: { label: I18n; body: I18n; cta: 'grid-participation' | 'investment' | 'quote' }[] = [
  {
    label: { en: 'Dairy farms', ka: 'რძის ფერმები' },
    body: { en: 'Supply raw milk into the network and take the standards, inputs and offtake that come with it.', ka: 'მიაწოდეთ ნედლი რძე ქსელს და მიიღეთ სტანდარტები, რესურსები და გარანტირებული რეალიზაცია.' },
    cta: 'grid-participation',
  },
  {
    label: { en: 'Processors', ka: 'გადამამუშავებლები' },
    body: { en: 'Contract capacity into the Grid, or take consistent, tested milk out of it.', ka: 'ჩართეთ სიმძლავრე Grid-ში ან მიიღეთ სტაბილური, ტესტირებული რძე.' },
    cta: 'grid-participation',
  },
  {
    label: { en: 'Investors', ka: 'ინვესტორები' },
    body: { en: 'Fund farms, collection infrastructure or processing assets inside a coordinated network rather than in isolation.', ka: 'დააფინანსეთ ფერმები, ინფრასტრუქტურა ან საწარმოო აქტივები კოორდინირებულ ქსელში.' },
    cta: 'investment',
  },
  {
    label: { en: 'Suppliers & providers', ka: 'მომმარაგებლები და პროვაიდერები' },
    body: { en: 'Reach many farms through one relationship — equipment, inputs, veterinary and technical services.', ka: 'მიაღწიეთ ბევრ ფერმას ერთი ურთიერთობით — აღჭურვილობა, რესურსები, ვეტერინარული და ტექნიკური სერვისი.' },
    cta: 'quote',
  },
];

export default function DairyGrid() {
  const t = useT();
  const ui = useUI();
  const lang = useLang();
  const sub = getSub('production', 'grid')!;

  return (
    <div style={accentVars('production')}>
      {/* Hero — the one flagship page that opens dark. */}
      <section className="on-dark relative bg-graphite text-milk overflow-hidden border-b border-milk/10">
        <BackdropPhoto photo="grazingHill" opacity={0.26} />
        {/* The network diagram sits in the hero's right half — the programme's
            architecture stated before the copy explains it. */}
        <div className="hidden lg:block absolute inset-y-0 right-0 w-[52%] pointer-events-none">
          <LazyGridNetwork />
        </div>
        <div className="shell relative z-10">
          <Breadcrumbs
            trail={[
              { label: lang === 'ka' ? 'წარმოება' : 'Production', to: '/production' },
              { label: 'Dairy Grid' },
            ]}
          />
          <Reveal className="pb-16 md:pb-24 pt-6 max-w-2xl lg:max-w-xl xl:max-w-2xl">
            <p className="eyebrow text-signal flex items-center gap-3">
              <span aria-hidden className="w-8 h-px bg-signal" />
              {lang === 'ka' ? 'ფლაგმანური პროგრამა' : 'Flagship programme'}
            </p>
            <h1 className="h-display mt-5"><WordReveal text="Dairy Grid" /></h1>
            <p className="mt-6 text-[1.0625rem] md:text-[1.25rem] text-mist/70 font-light leading-[1.55] max-w-xl">
              {t(sub.purpose)}
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              {sub.stages.map((s) => <StageTag key={s} stage={s} />)}
            </div>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button to="/inquiry?type=grid-participation&direction=production&sub=grid" variant="inverse">
                {ui('cta.grid-participation')}
                <ArrowRight size={15} aria-hidden className="transition-transform duration-200 group-hover/btn:translate-x-0.5" />
              </Button>
              <Button href="https://dairygrid.ge" variant="ghost-inverse">dairygrid.ge</Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Architecture */}
      <section className="shell py-20 md:py-28">
        <SectionHeader
          index="01"
          eyebrow={lang === 'ka' ? 'არქიტექტურა' : 'Architecture'}
          title={lang === 'ka' ? 'როგორ არის აწყობილი Grid' : 'How the Grid is assembled'}
          lede={lang === 'ka'
            ? 'ოთხი რგოლი, რომელიც ერთმანეთს ისე უკავშირდება, რომ ცალკეული მონაწილე იღებს იმას, რასაც მარტო ვერ მიაღწევდა.'
            : 'Four links, connected so that each participant gets something they could not reach on their own.'}
        />
        <Reveal>
          <ol className="relative grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-line border border-line rounded-none overflow-hidden">
            {ARCHITECTURE.map((a) => (
              <li key={a.n} className="bg-milk p-6 md:p-7">
                <span className="eyebrow text-production-ink">{a.n}</span>
                <h3 className="mt-3 text-[1.125rem] font-semibold">{t(a.label)}</h3>
                <p className="mt-2.5 text-[0.875rem] text-slate leading-relaxed">{t(a.body)}</p>
              </li>
            ))}
          </ol>
        </Reveal>
      </section>

      {/* Participation */}
      <section className="bg-parchment/60 border-y border-line">
        <div className="shell py-20 md:py-28">
          <SectionHeader
            index="02"
            eyebrow={lang === 'ka' ? 'მონაწილეობა' : 'Participation'}
            title={lang === 'ka' ? 'ვინ ერთვება Grid-ში' : 'Who joins the Grid'}
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PARTICIPANTS.map((p, i) => (
              <Reveal key={p.label.en} delay={(i % 4) * 70}>
                <div className="h-full flex flex-col justify-between bg-milk border border-line rounded-none p-6">
                  <div>
                    <h3 className="h-card">{t(p.label)}</h3>
                    <p className="mt-2.5 text-[0.875rem] text-slate leading-relaxed">{t(p.body)}</p>
                  </div>
                  <Button
                    to={`/inquiry?type=${p.cta}&direction=production&sub=grid`}
                    variant="secondary"
                    className="mt-6 self-start"
                  >
                    {ui(`cta.${p.cta}` as never)}
                    <ArrowRight size={14} aria-hidden className="transition-transform duration-200 group-hover/btn:translate-x-0.5" />
                  </Button>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Standards & progress — §11.1: no projected figures presented as achieved. */}
      <section className="shell py-20 md:py-28">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
          <Reveal>
            <p className="eyebrow mb-4">{lang === 'ka' ? 'სტანდარტები' : 'Standards'}</p>
            <h2 className="h-section">
              {lang === 'ka' ? 'ქსელი ერთ სტანდარტს იცავს' : 'One standard across the network'}
            </h2>
            <p className="lede mt-4">
              {lang === 'ka'
                ? 'ხარისხის, ვეტერინარული და საოპერაციო მოთხოვნები, რომლებსაც ყველა მონაწილე იზიარებს — გამოქვეყნდება დამტკიცების შემდეგ.'
                : 'The quality, veterinary and operational requirements every participant holds to. Published once the technical owner has signed them off.'}
            </p>
            <Figure
              photo="labVials"
              ratio="16/9"
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="mt-8 rounded-none border border-line"
            />
          </Reveal>
          <Reveal delay={80}>
            <p className="eyebrow mb-4">{lang === 'ka' ? 'პროგრესი' : 'Progress'}</p>
            <div className="border border-dashed border-line-strong rounded-none p-6">
              <p className="text-[0.9375rem] text-slate leading-relaxed">
                {lang === 'ka'
                  ? 'მონაწილე ფერმების რაოდენობა, შეგროვების მოცულობა და დაფარული რეგიონები გამოქვეყნდება მხოლოდ დადასტურებული მონაცემებით. პროგნოზული ციფრი აქ არ განთავსდება.'
                  : 'Participating farms, collected volume and regions covered will be published from verified figures only. A projection will not be shown here as an achievement.'}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Dedicated platform (§15) */}
      <section className="shell pb-20 md:pb-28">
        <Reveal>
          <a
            href="https://dairygrid.ge"
            target="_blank"
            rel="noreferrer noopener"
            className="group relative flex flex-wrap items-center justify-between gap-6 border border-line bg-milk rounded-none p-7 md:p-9
              hover:border-line-strong hover:shadow-md-x transition-[border-color,box-shadow] duration-300"
          >
            <div>
              <p className="eyebrow">{ui('digitalEcosystem')}</p>
              <h2 className="mt-2 text-[1.5rem] font-semibold">dairygrid.ge</h2>
              <p className="mt-2 text-[0.9375rem] text-slate max-w-xl">
                {lang === 'ka'
                  ? 'Grid-ის სპეციალიზებული პლატფორმა — უფრო ღრმა მონაწილეობა, ტექნიკური და გეოგრაფიული ფუნქციონალი.'
                  : 'The dedicated Grid platform — deeper participation, technical and geographic functionality than a master-brand page should carry.'}
              </p>
            </div>
            <ArrowUpRight
              size={26}
              aria-hidden
              className="text-muted transition-all duration-300 group-hover:text-production-ink group-hover:-translate-y-1 group-hover:translate-x-1"
            />
          </a>
        </Reveal>
      </section>

      <CtaBand
        direction="production"
        title={lang === 'ka' ? 'შემოუერთდით Dairy Grid-ს' : 'Join the Dairy Grid'}
        body={lang === 'ka'
          ? 'გვითხარით ვინ ხართ და სად ხართ — მოთხოვნა Grid-ის გუნდს მიუვა.'
          : 'Tell us who you are and where you are. The inquiry reaches the Grid team directly.'}
        primary={{ cta: 'grid-participation' }}
        secondary={{ cta: 'investment' }}
      />
    </div>
  );
}
