import { createContext, useContext, useCallback, type ReactNode } from 'react';
import { useParams, useLocation, Link, type LinkProps } from 'react-router-dom';
import type { I18n, Lang } from '@/lib/types';

/**
 * Bilingual layer — brief §3.1 / §6.1.
 * KA and EN are first-class versions with mirrored architecture; language lives
 * in the URL (/ka/…, /en/…) so every page is separately addressable and
 * hreflang-able rather than hidden behind client-side state.
 */

export const LANGS: Lang[] = ['en', 'ka'];
export const DEFAULT_LANG: Lang = 'en';

const LangContext = createContext<Lang>(DEFAULT_LANG);

export function LangProvider({ children }: { children: ReactNode }) {
  const { lang } = useParams<{ lang: string }>();
  const value: Lang = lang === 'ka' ? 'ka' : 'en';
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);

/** Resolve a bilingual value, falling back to EN if a KA string is not yet written. */
export function useT() {
  const lang = useLang();
  return useCallback((v: I18n | undefined) => (v ? v[lang] || v.en : ''), [lang]);
}

/** Build a language-prefixed path: href('/service/advisory') → '/ka/service/advisory'. */
export function useHref() {
  const lang = useLang();
  return useCallback((path: string) => `/${lang}${path === '/' ? '' : path}` || '/', [lang]);
}

/** Same route, other language — for the KA/EN switcher (§4.2). */
export function useAltLangPath(target: Lang) {
  const { pathname, search, hash } = useLocation();
  const rest = pathname.replace(/^\/(en|ka)(?=\/|$)/, '');
  return `/${target}${rest}${search}${hash}`;
}

/** Link that automatically carries the active language prefix. */
export function L({ to, ...rest }: Omit<LinkProps, 'to'> & { to: string }) {
  const href = useHref();
  return <Link to={href(to)} {...rest} />;
}

/* -------------------------------------------------------------------------- */
/* UI STRING DICTIONARY                                                       */
/* Georgian strings are placeholders pending the KA copywriter (§12.3).       */
/* -------------------------------------------------------------------------- */

export const UI = {
  brand: { en: 'GEO Dairy', ka: 'GEO Dairy' },
  tagline: {
    en: "Georgia's integrated dairy-industry company and ecosystem",
    ka: 'საქართველოს ინტეგრირებული რძის ინდუსტრიის კომპანია და ეკოსისტემა',
  },
  skipToContent: { en: 'Skip to main content', ka: 'ძირითად შინაარსზე გადასვლა' },
  navigator: { en: 'Navigator', ka: 'ნავიგატორი' },
  navigatorFull: { en: 'GEO Dairy Navigator', ka: 'GEO Dairy ნავიგატორი' },
  search: { en: 'Search', ka: 'ძიება' },
  searchPlaceholder: {
    en: 'Search services, supplies, products, projects…',
    ka: 'მოძებნე სერვისები, მომარაგება, პროდუქცია, პროექტები…',
  },
  account: { en: 'Account', ka: 'ანგარიში' },
  menu: { en: 'Menu', ka: 'მენიუ' },
  close: { en: 'Close', ka: 'დახურვა' },
  language: { en: 'Language', ka: 'ენა' },
  explore: { en: 'Explore', ka: 'იხილეთ' },
  exploreDirection: { en: 'Explore', ka: 'იხილეთ' },
  home: { en: 'Home', ka: 'მთავარი' },
  backTo: { en: 'Back to', ka: 'დაბრუნება' },
  youAreHere: { en: 'Breadcrumb', ka: 'ნავიგაციის გზა' },
  allStages: { en: 'All stages', ka: 'ყველა რგოლი' },
  filterByStage: { en: 'Filter by value-chain stage', ka: 'ფილტრი ღირებულების ჯაჭვის რგოლით' },
  filterByDomain: { en: 'Filter by technical domain', ka: 'ფილტრი ტექნიკური სფეროთი' },
  noResults: {
    en: 'No offerings match these filters yet. Clear a filter, or ask the Navigator.',
    ka: 'ამ ფილტრებით შეთავაზება ვერ მოიძებნა. მოხსენით ფილტრი ან ჰკითხეთ ნავიგატორს.',
  },
  clearFilters: { en: 'Clear filters', ka: 'ფილტრების გასუფთავება' },
  resultCount: { en: 'offerings', ka: 'შეთავაზება' },
  relatedCapabilities: { en: 'Related capabilities', ka: 'დაკავშირებული შესაძლებლობები' },
  subDirections: { en: 'Sub-directions', ka: 'ქვემიმართულებები' },
  featured: { en: 'Featured', ka: 'გამორჩეული' },
  stageCoverage: { en: 'Value-chain coverage', ka: 'ჯაჭვის დაფარვა' },
  directions: { en: 'Business directions', ka: 'ბიზნეს-მიმართულებები' },

  // Value chain
  upstream: { en: 'Upstream', ka: 'პირველადი რგოლი' },
  midstream: { en: 'Midstream', ka: 'გადამამუშავებელი რგოლი' },
  downstream: { en: 'Downstream', ka: 'სადისტრიბუციო რგოლი' },
  'cross-chain': { en: 'Cross-Chain', ka: 'ჯაჭვის გამჭოლი' },
  upstreamDef: { en: 'Dairy farming and raw-milk production.', ka: 'რძის მეურნეობა და ნედლი რძის წარმოება.' },
  midstreamDef: { en: 'Processing and manufacturing.', ka: 'გადამუშავება და წარმოება.' },
  downstreamDef: { en: 'Logistics, distribution, wholesale, retail and e-commerce.', ka: 'ლოგისტიკა, დისტრიბუცია, საბითუმო, საცალო და ელექტრონული კომერცია.' },
  'cross-chainDef': { en: 'Capabilities that apply across every stage.', ka: 'შესაძლებლობები, რომლებიც ყველა რგოლს ეხება.' },

  // CTA taxonomy (§8.1)
  'cta.service-request': { en: 'Request this service', ka: 'მოითხოვეთ სერვისი' },
  'cta.quote': { en: 'Request a quote', ka: 'მოითხოვეთ შეთავაზება' },
  'cta.trade-inquiry': { en: 'Trade inquiry', ka: 'სავაჭრო მოთხოვნა' },
  'cta.supplier-application': { en: 'Become a supplier', ka: 'გახდით მომმარაგებელი' },
  'cta.provider-application': { en: 'Join as a provider', ka: 'შემოგვიერთდით როგორც პროვაიდერი' },
  'cta.grid-participation': { en: 'Join Dairy Grid', ka: 'შემოუერთდით Dairy Grid-ს' },
  'cta.investment': { en: 'Investment inquiry', ka: 'საინვესტიციო მოთხოვნა' },
  'cta.career': { en: 'Register for work', ka: 'დარეგისტრირდით სამუშაოდ' },
  'cta.contact': { en: 'Contact GEO Dairy', ka: 'დაგვიკავშირდით' },

  // Forms (§8.2 / §8.3)
  formIntro: {
    en: 'We route inquiries by taxonomy, not to a shared mailbox — the fields below tell us who should answer you.',
    ka: 'მოთხოვნებს ვამისამართებთ ტაქსონომიით და არა საერთო ფოსტაზე — ქვემოთ მოცემული ველები გვეუბნება, ვინ უნდა გიპასუხოთ.',
  },
  fName: { en: 'Full name', ka: 'სახელი და გვარი' },
  fOrg: { en: 'Organization', ka: 'ორგანიზაცია' },
  fRole: { en: 'Role', ka: 'პოზიცია' },
  fCountry: { en: 'Country', ka: 'ქვეყანა' },
  fEmail: { en: 'Email', ka: 'ელფოსტა' },
  fPhone: { en: 'Phone', ka: 'ტელეფონი' },
  fMessage: { en: 'What do you need?', ka: 'რა გჭირდებათ?' },
  fScale: { en: 'Scale or capacity', ka: 'მასშტაბი ან სიმძლავრე' },
  fTiming: { en: 'Timing', ka: 'ვადები' },
  fLocation: { en: 'Location', ka: 'ლოკაცია' },
  fConsent: {
    en: 'I agree that GEO Dairy may process this information to respond to my inquiry.',
    ka: 'ვეთანხმები, რომ GEO Dairy დაამუშავებს ამ ინფორმაციას ჩემს მოთხოვნაზე პასუხისთვის.',
  },
  fSubmit: { en: 'Send inquiry', ka: 'გაგზავნა' },
  fRequired: { en: 'Required', ka: 'სავალდებულო' },
  fContext: { en: 'Carried page context', ka: 'გადმოტანილი კონტექსტი' },
  fContextNote: {
    en: 'These hidden fields travel with the form so the inquiry reaches the right commercial owner (§8.3).',
    ka: 'ეს ველები გადაჰყვება ფორმას, რომ მოთხოვნა სწორ კომერციულ მფლობელს მიაღწიოს.',
  },
  fSent: { en: 'Inquiry captured', ka: 'მოთხოვნა მიღებულია' },
  fSentBody: {
    en: 'This is a design prototype — no data left your browser. In production this creates a CRM lead carrying the context shown below.',
    ka: 'ეს დიზაინის პროტოტიპია — მონაცემები არსად გაგზავნილა. საბოლოო ვერსიაში იქმნება CRM ლიდი ქვემოთ ნაჩვენები კონტექსტით.',
  },

  // Navigator (§7)
  navIntentQ: { en: 'What would you like to do?', ka: 'რისი გაკეთება გსურთ?' },
  navIntentHelp: {
    en: 'Tell us the outcome you want. We translate it into the right part of GEO Dairy — you do not need to know our taxonomy.',
    ka: 'გვითხარით სასურველი შედეგი. ჩვენ გადავიყვანთ GEO Dairy-ის შესაბამის ნაწილში.',
  },
  navRecommend: { en: 'Recommended for you', ka: 'რეკომენდებული' },
  navRestart: { en: 'Start over', ka: 'თავიდან დაწყება' },
  navTypePlaceholder: {
    en: 'Describe it in your own words — "build a cheese factory", "sell milk"…',
    ka: 'აღწერეთ თქვენი სიტყვებით — „ავაშენო ყველის ქარხანა“, „გავყიდო რძე“…',
  },
  navOrPick: { en: 'or pick one', ka: 'ან აირჩიეთ' },
  navNoMatch: {
    en: 'No intent matched that. Pick the closest one below, or send us the question directly.',
    ka: 'შესაბამისობა ვერ მოიძებნა. აირჩიეთ ყველაზე ახლობელი ან მოგვწერეთ პირდაპირ.',
  },
  navOpen: { en: 'Open Navigator', ka: 'ნავიგატორის გახსნა' },
  navRoutesInto: { en: 'Routes into', ka: 'მიემართება' },

  // Shortlist
  slAdd: { en: 'Add to shortlist', ka: 'დაამატეთ სიაში' },
  slRemove: { en: 'Remove from shortlist', ka: 'ამოშალეთ სიიდან' },
  slTitle: { en: 'Your shortlist', ka: 'თქვენი სია' },
  slOpen: { en: 'Open shortlist', ka: 'სიის გახსნა' },
  slEmpty: {
    en: 'Nothing collected yet. Add services, supplies or products as you browse and send one inquiry for all of them.',
    ka: 'ჯერ არაფერია შერჩეული. დაამატეთ სერვისები, მომარაგება ან პროდუქცია და გააგზავნეთ ერთი მოთხოვნა ყველაზე.',
  },
  slSendAll: { en: 'Request all', ka: 'ყველას მოთხოვნა' },
  slClear: { en: 'Clear', ka: 'გასუფთავება' },
  slItems: { en: 'items', ka: 'პოზიცია' },
  slAdded: { en: 'Added to shortlist', ka: 'დაემატა სიაში' },
  slInInquiry: { en: 'Shortlisted items', ka: 'შერჩეული პოზიციები' },

  // Plan your build (configurator)
  planEyebrow: { en: 'Configurator', ka: 'კონფიგურატორი' },
  planTitle: { en: 'Plan your build', ka: 'დაგეგმეთ თქვენი პროექტი' },
  planLede: {
    en: 'Tell us what you are building and at what size. We will assemble the bundle — which services, which supplies, which capital route, in the order the work happens — and you send one inquiry for all of it.',
    ka: 'გვითხარით, რას აშენებთ და რა მასშტაბით. ჩვენ ავაწყობთ ნაკრებს — რომელი სერვისები, მომარაგება და დაფინანსების გზა, სამუშაოს თანმიმდევრობით — და ერთი მოთხოვნით გაგზავნით ყველაფერს.',
  },
  planQBuild: { en: 'What are you building?', ka: 'რას აშენებთ?' },
  planQStart: { en: 'Where are you starting from?', ka: 'საიდან იწყებთ?' },
  planQRegion: { en: 'Which region?', ka: 'რომელი რეგიონი?' },
  planOptional: { en: 'optional', ka: 'არასავალდებულო' },
  planResult: { en: 'Your build', ka: 'თქვენი პროექტი' },
  planResultNote: {
    en: '{n} items, grouped by the phase they belong to. Each one carries the reason it is in your plan.',
    ka: '{n} პოზიცია, ეტაპების მიხედვით დაჯგუფებული. თითოეულს თან ახლავს მიზეზი, რატომ არის სიაში.',
  },
  planAddAll: { en: 'Add all to shortlist', ka: 'ყველას დამატება სიაში' },
  planAllAdded: { en: 'All added', ka: 'ყველა დამატებულია' },
  planSend: { en: 'Send this plan', ka: 'გეგმის გაგზავნა' },
  planShareNote: {
    en: 'This plan is the address bar — copy the URL to send it to a colleague.',
    ka: 'ეს გეგმა მისამართის ველშია — დააკოპირეთ ბმული და გაუზიარეთ კოლეგას.',
  },
  planReset: { en: 'Start over', ka: 'თავიდან დაწყება' },
  planDisclaimer: {
    en: 'The sequence is indicative and the bundle is a starting point, not a quotation. Durations, capacities and costs are established at the feasibility stage, against your site and your numbers.',
    ka: 'თანმიმდევრობა საორიენტაციოა და ნაკრები საწყისი წერტილია, არა შეთავაზება. ვადები, სიმძლავრეები და ხარჯები დგინდება წინასაპროექტო ეტაპზე, თქვენს ობიექტსა და ციფრებზე.',
  },
  planEmpty: {
    en: 'Pick a project above and the plan assembles itself. If your situation does not match any of them, the Navigator asks the question differently and routes you by intent instead.',
    ka: 'აირჩიეთ პროექტი ზემოთ და გეგმა თავად აეწყობა. თუ თქვენი შემთხვევა არცერთს არ ემთხვევა, ნავიგატორი სხვაგვარად სვამს კითხვას და განზრახვის მიხედვით მიგმართავთ.',
  },
  planInInquiry: { en: 'Configured plan', ka: 'აწყობილი გეგმა' },
  planHomeNote: {
    en: 'Already know what you are building? Describe the project instead and we will assemble the bundle around it.',
    ka: 'დაახლოებით იცით, რას აშენებთ? აჭირეთ პროექტი და ნაკრებს ჩვენ ავაწყობთ.',
  },

  // Glossary (§12.3 controlled terminology)
  glossaryEyebrow: { en: 'Terminology', ka: 'ტერმინოლოგია' },
  glossaryTitle: { en: 'Dairy glossary', ka: 'რძის გლოსარი' },
  glossaryLede: {
    en: 'The vocabulary this industry runs on, defined once and translated once. Every term is also marked up where it appears in the text — hover or tap it and the definition comes to you.',
    ka: 'ინდუსტრიის ლექსიკონი, ერთხელ განსაზღვრული და ერთხელ ნათარგმნი. ტერმინები მონიშნულია თავად ტექსტშიც — მიაბრძანეთ კურსორი ან შეეხეთ და განმარტება გამოჩნდება.',
  },
  glossarySearch: { en: 'Search terms', ka: 'ტერმინის ძიება' },
  glossaryCategory: { en: 'Category', ka: 'კატეგორია' },

  // Regions (region-first navigation)
  regionsEyebrow: { en: 'Coverage', ka: 'დაფარვა' },
  regionsTitle: { en: 'Regions', ka: 'რეგიონები' },
  regionsAll: { en: 'All regions', ka: 'ყველა რეგიონი' },
  regionsLede: {
    en: 'Georgia’s twelve administrative regions, each with its own dairy geography — terrain, herd structure and the products the area is known for. Pick one and the site reorganises around it.',
    ka: 'საქართველოს თორმეტი ადმინისტრაციული რეგიონი, თითოეული საკუთარი რძის გეოგრაფიით — რელიეფი, ნახირის სტრუქტურა და პროდუქცია, რომლითაც მხარეა ცნობილი. აირჩიეთ ერთი და საიტი მის გარშემო გადაეწყობა.',
  },
  regionStatus: { en: 'GEO Dairy coverage', ka: 'GEO Dairy-ის დაფარვა' },
  regionStatusNote: {
    en: 'Placeholder status pending verified facility and programme data.',
    ka: 'სტატუსი დროებითია — ელოდება ობიექტებისა და პროგრამების დადასტურებულ მონაცემებს.',
  },
  regionStartHere: { en: 'Start here', ka: 'დაიწყეთ აქედან' },
  regionStartTitle: { en: 'Most relevant to {region}', ka: '{region}-ისთვის ყველაზე შესაფერისი' },
  regionStartLede: {
    en: 'Everything GEO Dairy does is delivered nationally. These are the parts of the portfolio that suit how this region is farmed.',
    ka: 'GEO Dairy-ის ყველა მიმართულება ქვეყნის მასშტაბით მუშაობს. ეს არის პორტფელის ის ნაწილი, რომელიც ამ რეგიონის მეურნეობის წყობას შეესაბამება.',
  },
  regionPlanNote: {
    en: 'Building something in {region}? The configurator will assemble the bundle with the region already set.',
    ka: 'აშენებთ რამეს {region}-ში? კონფიგურატორი ნაკრებს უკვე მითითებული რეგიონით აგროვებს.',
  },
  regionPlanCta: { en: 'Open the configurator', ka: 'კონფიგურატორის გახსნა' },
  regionCtaTitle: { en: 'Talk to us about {region}', ka: 'დაგვიკავშირდით {region}-ის შესახებ' },
  regionCtaBody: {
    en: 'The region travels with your message, so it reaches the people who cover it rather than a shared mailbox.',
    ka: 'რეგიონი თან გაჰყვება თქვენს შეტყობინებას და ის იმ გუნდს მიაღწევს, რომელიც ამ მხარეზე მუშაობს, და არა საერთო ფოსტას.',
  },
  regionOpen: { en: 'Open region', ka: 'რეგიონის გახსნა' },

  // Print / spec sheets
  printThis: { en: 'Print', ka: 'ბეჭდვა' },
  printSpec: { en: 'Print spec sheet', ka: 'სპეციფიკაციის ბეჭდვა' },
  printPlan: { en: 'Print this plan', ka: 'გეგმის ბეჭდვა' },
  printGlossary: { en: 'Print glossary', ka: 'გლოსარის ბეჭდვა' },
  printHint: {
    en: 'Opens your print dialog — choose “Save as PDF” to keep a copy.',
    ka: 'იხსნება ბეჭდვის ფანჯარა — აირჩიეთ „PDF-ად შენახვა“ ასლისთვის.',
  },
  printedFrom: { en: 'Source:', ka: 'წყარო:' },
  printKindSpec: { en: 'Specification sheet', ka: 'სპეციფიკაციის ფურცელი' },
  printKindPlan: { en: 'Project plan', ka: 'პროექტის გეგმა' },
  printKindGlossary: { en: 'Terminology reference', ka: 'ტერმინოლოგიის ცნობარი' },
  printKindRegion: { en: 'Regional profile', ka: 'რეგიონული პროფილი' },
  printFootnote: {
    en: 'This document is a description of scope, not a quotation. Specifications, capacities, lead times and prices are confirmed in writing against your project.',
    ka: 'ეს დოკუმენტი აღწერს მოცულობას და არ წარმოადგენს შეთავაზებას. სპეციფიკაცია, სიმძლავრე, ვადები და ფასები დასტურდება წერილობით თქვენს პროექტთან მიმართებით.',
  },
  printPlanFootnote: {
    en: 'An indicative bundle, not a quotation. The sequence is fixed by how the work depends on itself; durations and costs are established at the feasibility stage.',
    ka: 'საორიენტაციო ნაკრები და არა შეთავაზება. თანმიმდევრობა განისაზღვრება სამუშაოთა ურთიერთდამოკიდებულებით; ვადები და ხარჯები დგინდება წინასაპროექტო ეტაპზე.',
  },

  // Footer
  footerNote: {
    en: 'GEO Dairy is the master corporate and commercial brand. Dedicated platforms operate on their own domains.',
    ka: 'GEO Dairy არის ძირითადი კორპორატიული და კომერციული ბრენდი. სპეციალიზებული პლატფორმები საკუთარ დომენებზე მუშაობს.',
  },
  digitalEcosystem: { en: 'Digital ecosystem', ka: 'ციფრული ეკოსისტემა' },
  externalPlatform: { en: 'opens a dedicated platform', ka: 'იხსნება ცალკე პლატფორმა' },
  copyright: { en: 'All rights reserved.', ka: 'ყველა უფლება დაცულია.' },
} satisfies Record<string, I18n>;

export type UIKey = keyof typeof UI;

/** Convenience hook for UI strings: const t = useUI(); t('search') */
export function useUI() {
  const lang = useLang();
  return useCallback((key: UIKey) => UI[key][lang] || UI[key].en, [lang]);
}
