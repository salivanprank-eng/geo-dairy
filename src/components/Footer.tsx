import { Link } from 'react-router-dom';
import { ArrowUpRight, Linkedin, Facebook, Instagram, Youtube } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { DIRECTIONS } from '@/data/taxonomy';
import { useHref, useT, useUI, useLang } from '@/lib/i18n';
import type { I18n } from '@/lib/types';

/** Footer architecture — brief §4.4. Institutional, industry, participation, legal, ecosystem. */

type FLink = { label: I18n; to?: string; href?: string };

const COLUMNS: { heading: I18n; links: FLink[] }[] = [
  {
    heading: { en: 'GEO Dairy', ka: 'GEO Dairy' },
    links: [
      { label: { en: 'About GEO Dairy', ka: 'ჩვენ შესახებ' }, to: '/about' },
      { label: { en: 'Mission & Vision', ka: 'მისია და ხედვა' }, to: '/about/mission' },
      { label: { en: 'Strategy', ka: 'სტრატეგია' }, to: '/about/strategy' },
      { label: { en: 'Our Role in Georgia', ka: 'ჩვენი როლი საქართველოში' }, to: '/about/role' },
      { label: { en: 'Business Model', ka: 'ბიზნეს-მოდელი' }, to: '/about/business-model' },
      { label: { en: 'Governance', ka: 'მმართველობა' }, to: '/about/governance' },
      { label: { en: 'Sustainability', ka: 'მდგრადობა' }, to: '/about/sustainability' },
      { label: { en: 'Locations', ka: 'ლოკაციები' }, to: '/about/locations' },
      { label: { en: 'Careers', ka: 'კარიერა' }, to: '/careers' },
    ],
  },
  {
    heading: { en: 'Industry', ka: 'ინდუსტრია' },
    links: [
      { label: { en: 'Dairy Industry Overview', ka: 'რძის ინდუსტრიის მიმოხილვა' }, to: '/industry' },
      { label: { en: 'Upstream', ka: 'პირველადი რგოლი' }, to: '/industry/upstream' },
      { label: { en: 'Midstream', ka: 'გადამამუშავებელი რგოლი' }, to: '/industry/midstream' },
      { label: { en: 'Downstream', ka: 'სადისტრიბუციო რგოლი' }, to: '/industry/downstream' },
      { label: { en: 'Dairy in Georgia', ka: 'რძე საქართველოში' }, to: '/industry/georgia' },
      { label: { en: 'Industry Development', ka: 'ინდუსტრიის განვითარება' }, to: '/industry/development' },
      { label: { en: 'Standards & Reference', ka: 'სტანდარტები და ცნობარი' }, to: '/ecosystem/reference' },
    ],
  },
  {
    heading: { en: 'Projects & Participation', ka: 'პროექტები და მონაწილეობა' },
    links: [
      { label: { en: 'Projects', ka: 'პროექტები' }, to: '/projects' },
      { label: { en: 'Dairy Grid', ka: 'Dairy Grid' }, to: '/production/grid' },
      { label: { en: 'Work with GEO Dairy', ka: 'ითანამშრომლეთ ჩვენთან' }, to: '/work-with-us' },
      { label: { en: 'Become a Supplier', ka: 'გახდით მომმარაგებელი' }, to: '/inquiry?type=supplier-application' },
      { label: { en: 'Join as Service Provider', ka: 'შემოგვიერთდით როგორც პროვაიდერი' }, to: '/inquiry?type=provider-application' },
      { label: { en: 'Investment & Partnership', ka: 'ინვესტიცია და პარტნიორობა' }, to: '/inquiry?type=investment' },
    ],
  },
  {
    heading: { en: 'Support', ka: 'მხარდაჭერა' },
    links: [
      { label: { en: 'GEO Dairy Navigator', ka: 'GEO Dairy ნავიგატორი' }, to: '/navigator' },
      { label: { en: 'Plan your build', ka: 'დაგეგმეთ თქვენი პროექტი' }, to: '/plan' },
      { label: { en: 'Dairy glossary', ka: 'რძის გლოსარი' }, to: '/glossary' },
      { label: { en: 'Regions', ka: 'რეგიონები' }, to: '/regions' },
      { label: { en: 'Contact', ka: 'კონტაქტი' }, to: '/inquiry?type=contact' },
      { label: { en: 'Business Inquiry', ka: 'ბიზნეს-მოთხოვნა' }, to: '/inquiry' },
      { label: { en: 'Search', ka: 'ძიება' }, to: '/search' },
    ],
  },
];

const LEGAL: FLink[] = [
  { label: { en: 'Privacy', ka: 'კონფიდენციალურობა' }, to: '/legal/privacy' },
  { label: { en: 'Cookies', ka: 'ქუქიები' }, to: '/legal/cookies' },
  { label: { en: 'Terms of Use', ka: 'გამოყენების პირობები' }, to: '/legal/terms' },
  { label: { en: 'Legal Information', ka: 'იურიდიული ინფორმაცია' }, to: '/legal/corporate' },
  { label: { en: 'Accessibility', ka: 'ხელმისაწვდომობა' }, to: '/legal/accessibility' },
];

const PLATFORMS = [
  { name: 'geodairy.ge', role: { en: 'Master corporate & commercial hub', ka: 'ძირითადი კორპორატიული და კომერციული ჰაბი' }, current: true },
  { name: 'dairy.ge', role: { en: 'Industry information, knowledge & reference', ka: 'ინდუსტრიული ინფორმაცია, ცოდნა და ცნობარი' }, href: 'https://dairy.ge' },
  { name: 'dairygrid.ge', role: { en: 'Dedicated Dairy Grid platform', ka: 'Dairy Grid-ის სპეციალიზებული პლატფორმა' }, href: 'https://dairygrid.ge' },
];

const SOCIAL = [
  { Icon: Linkedin, name: 'LinkedIn', href: 'https://www.linkedin.com/' },
  { Icon: Facebook, name: 'Facebook', href: 'https://www.facebook.com/' },
  { Icon: Instagram, name: 'Instagram', href: 'https://www.instagram.com/' },
  { Icon: Youtube, name: 'YouTube', href: 'https://www.youtube.com/' },
];

export function Footer() {
  const t = useT();
  const ui = useUI();
  const href = useHref();
  const lang = useLang();

  return (
    <footer className="no-print on-dark bg-graphite text-mist/75">
      <div className="shell py-16 md:py-20">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-8 gap-y-12">
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <Logo inverse />
            <p className="mt-5 text-[0.875rem] leading-relaxed max-w-xs">{ui('tagline')}</p>
          </div>

          {/* Business column mirrors the five directions (§4.4) */}
          <nav aria-labelledby="f-business">
            <h2 id="f-business" className="text-milk text-[0.8125rem] font-semibold tracking-[0.12em] uppercase mb-4">
              {lang === 'ka' ? 'ბიზნესი' : 'Business'}
            </h2>
            <ul className="space-y-0.5">
              {DIRECTIONS.map((d) => (
                <li key={d.id}>
                  <Link to={href(`/${d.id}`)} className="hit-row text-[0.875rem] hover:text-milk transition-colors">
                    {t(d.label)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {COLUMNS.map((col) => (
            <nav key={col.heading.en} aria-labelledby={`f-${col.heading.en.replace(/\W/g, '')}`}>
              <h2
                id={`f-${col.heading.en.replace(/\W/g, '')}`}
                className="text-milk text-[0.8125rem] font-semibold tracking-[0.12em] uppercase mb-4"
              >
                {t(col.heading)}
              </h2>
              <ul className="space-y-0.5">
                {col.links.map((l) => (
                  <li key={l.label.en}>
                    <Link to={href(l.to!)} className="hit-row text-[0.875rem] hover:text-milk transition-colors">
                      {t(l.label)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Digital ecosystem (§15) */}
        <div className="mt-16 pt-10 border-t border-milk/10">
          <h2 className="text-milk text-[0.8125rem] font-semibold tracking-[0.12em] uppercase mb-5">
            {ui('digitalEcosystem')}
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {PLATFORMS.map((p) => (
              <div key={p.name} className="border border-milk/10 rounded-none p-4">
                {p.current ? (
                  <span className="flex items-center gap-2 text-milk font-semibold text-[0.9375rem]">
                    {p.name}
                    <span className="text-[0.625rem] font-bold tracking-[0.1em] uppercase bg-signal text-ink px-1.5 py-0.5 rounded-none">
                      {lang === 'ka' ? 'აქ ხართ' : 'You are here'}
                    </span>
                  </span>
                ) : (
                  <a
                    href={p.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-1.5 text-milk font-semibold text-[0.9375rem] hover:text-signal transition-colors"
                  >
                    {p.name}
                    <ArrowUpRight size={14} aria-hidden />
                    <span className="sr-only">— {ui('externalPlatform')}</span>
                  </a>
                )}
                <p className="mt-1.5 text-[0.8125rem] leading-snug">{t(p.role)}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 text-[0.8125rem] max-w-2xl">{ui('footerNote')}</p>
        </div>

        {/* Legal + social */}
        <div className="mt-12 pt-8 border-t border-milk/10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {LEGAL.map((l) => (
              <li key={l.label.en}>
                <Link to={href(l.to!)} className="hit-row text-[0.8125rem] hover:text-milk transition-colors">
                  {t(l.label)}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2">
            {SOCIAL.map(({ Icon, name, href: h }) => (
              <a
                key={name}
                href={h}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={name}
                className="p-2.5 border border-milk/10 rounded-none hover:border-milk/40 hover:text-milk transition-colors"
              >
                <Icon size={17} aria-hidden />
              </a>
            ))}
          </div>
        </div>

        <p className="mt-8 text-[0.75rem] text-mist/45">
          © {new Date().getFullYear()} GEO Dairy. {ui('copyright')}
        </p>
      </div>
    </footer>
  );
}
