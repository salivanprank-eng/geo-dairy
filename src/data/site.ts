import type { CtaType, DirectionId, I18n } from '@/lib/types';

/** Homepage and audience content — brief §3, §11. */

export interface AudiencePath {
  slug: string;
  label: I18n;
  need: I18n;
  routes: { direction: DirectionId; sub: string }[];
  cta: CtaType;
}

/** §3 audience architecture — routed through "Work with GEO Dairy", never the main menu. */
export const AUDIENCES: AudiencePath[] = [
  {
    slug: 'farmers',
    label: { en: 'Dairy farmers & farm investors', ka: 'ფერმერები და ფერმის ინვესტორები' },
    need: { en: 'Start, upgrade or operate a dairy farm — animals, feed, equipment, services and the Grid.', ka: 'დაიწყეთ, გააუმჯობესეთ ან მართეთ რძის ფერმა — ცხოველები, საკვები, აღჭურვილობა, სერვისები და Grid.' },
    routes: [{ direction: 'service', sub: 'advisory' }, { direction: 'supply', sub: 'equipment' }, { direction: 'production', sub: 'grid' }],
    cta: 'service-request',
  },
  {
    slug: 'processors',
    label: { en: 'Processors & manufacturers', ka: 'გადამამუშავებლები და მწარმოებლები' },
    need: { en: 'Plant development, processing equipment, ingredients, compliance and product development.', ka: 'საწარმოს განვითარება, აღჭურვილობა, ინგრედიენტები, შესაბამისობა და პროდუქტის შემუშავება.' },
    routes: [{ direction: 'service', sub: 'engineering' }, { direction: 'supply', sub: 'equipment' }, { direction: 'service', sub: 'development' }],
    cta: 'service-request',
  },
  {
    slug: 'buyers',
    label: { en: 'Distributors, retailers & HoReCa', ka: 'დისტრიბუტორები, საცალო და HoReCa' },
    need: { en: 'Products, cold chain, channel development and reliable supply at volume.', ka: 'პროდუქცია, ცივი ჯაჭვი, არხის განვითარება და საიმედო მიწოდება.' },
    routes: [{ direction: 'trade', sub: 'wholesale' }, { direction: 'trade', sub: 'distribution' }],
    cta: 'trade-inquiry',
  },
  {
    slug: 'suppliers',
    label: { en: 'Suppliers & technology companies', ka: 'მომმარაგებლები და ტექნოლოგიური კომპანიები' },
    need: { en: 'Sell or represent equipment, inputs, infrastructure and software in the Georgian dairy market.', ka: 'გაყიდეთ ან წარმოადგინეთ აღჭურვილობა, რესურსები, ინფრასტრუქტურა და პროგრამული უზრუნველყოფა.' },
    routes: [{ direction: 'supply', sub: 'equipment' }, { direction: 'ecosystem', sub: 'visibility' }],
    cta: 'supplier-application',
  },
  {
    slug: 'professionals',
    label: { en: 'Professionals & service providers', ka: 'პროფესიონალები და სერვისპროვაიდერები' },
    need: { en: 'Deliver advisory, engineering, veterinary and operational work through the GEO Dairy network.', ka: 'შეასრულეთ საკონსულტაციო, საინჟინრო, ვეტერინარული და საოპერაციო სამუშაო ჩვენი ქსელით.' },
    routes: [{ direction: 'ecosystem', sub: 'network' }, { direction: 'service', sub: 'operation' }],
    cta: 'provider-application',
  },
  {
    slug: 'investors',
    label: { en: 'Investors & financiers', ka: 'ინვესტორები და დამფინანსებლები' },
    need: { en: 'Projects, production assets, capital requirements and Dairy Grid opportunities.', ka: 'პროექტები, საწარმოო აქტივები, კაპიტალის საჭიროებები და Dairy Grid-ის შესაძლებლობები.' },
    routes: [{ direction: 'supply', sub: 'capital' }, { direction: 'production', sub: 'grid' }],
    cta: 'investment',
  },
  {
    slug: 'international',
    label: { en: 'International companies', ka: 'საერთაშორისო კომპანიები' },
    need: { en: 'Enter Georgia, source Georgian dairy, supply technology or build a distribution partnership.', ka: 'შემოდით საქართველოში, შეისყიდეთ ქართული პროდუქცია, მიაწოდეთ ტექნოლოგია ან შექმენით პარტნიორობა.' },
    routes: [{ direction: 'trade', sub: 'international' }, { direction: 'service', sub: 'advisory' }],
    cta: 'trade-inquiry',
  },
  {
    slug: 'institutions',
    label: { en: 'Government, institutions & academia', ka: 'სახელმწიფო, ინსტიტუციები და აკადემია' },
    need: { en: 'Industry development, standards, data, cooperation programmes and education.', ka: 'ინდუსტრიის განვითარება, სტანდარტები, მონაცემები, თანამშრომლობის პროგრამები და განათლება.' },
    routes: [{ direction: 'ecosystem', sub: 'reference' }, { direction: 'ecosystem', sub: 'knowledge' }],
    cta: 'contact',
  },
];

/**
 * Coverage module (§11 sequence 08). The brief permits this section only "when
 * reliable data is available" and forbids unverified national claims (§11.1),
 * so the design ships with the structure and an explicit placeholder flag.
 */
export const COVERAGE_PLACEHOLDER = {
  note: {
    en: 'The geography is real — administrative boundaries from geoBoundaries (gbOpen). The operating status on each region is placeholder: replace with verified facility, project and Grid data before launch (§11.1).',
    ka: 'გეოგრაფია რეალურია — ადმინისტრაციული საზღვრები geoBoundaries-დან. რეგიონების სტატუსი ესკიზურია: გაშვებამდე ჩაანაცვლეთ დადასტურებული მონაცემებით.',
  },
  /** Region ids match src/data/georgia-regions.json. */
  status: {
    kakheti: 'operating',
    'kvemo-kartli': 'operating',
    imereti: 'operating',
    tbilisi: 'operating',
    'shida-kartli': 'development',
    'samtskhe-javakheti': 'development',
    'mtskheta-mtianeti': 'development',
    samegrelo: 'planned',
    guria: 'planned',
    adjara: 'planned',
    'racha-lechkhumi': 'planned',
    // Abkhazia is left without a status rather than assigned one.
    abkhazia: 'none',
  } as Record<string, 'operating' | 'development' | 'planned' | 'none'>,
  statusLabels: {
    operating: { en: 'Operating', ka: 'მოქმედი' },
    development: { en: 'In development', ka: 'განვითარებაში' },
    planned: { en: 'Planned', ka: 'დაგეგმილი' },
    none: { en: 'No data', ka: 'მონაცემები არ არის' },
  } as Record<string, I18n>,
};

/**
 * Proof module (§11 sequence 11). Substantiated items only (§10.1) — every entry
 * here needs a technical or commercial owner to sign it off before publication.
 */
export const PROOF_POINTS: { label: I18n; body: I18n }[] = [
  {
    label: { en: 'Full value chain', ka: 'სრული ღირებულების ჯაჭვი' },
    body: { en: 'Capability declared and delivered across upstream, midstream and downstream rather than at a single point.', ka: 'შესაძლებლობა დეკლარირებული და მიწოდებული ჯაჭვის სამივე რგოლში.' },
  },
  {
    label: { en: 'Standards-led', ka: 'სტანდარტებზე დაფუძნებული' },
    body: { en: 'Food-safety, veterinary and engineering standards named on the pages where they apply, not asserted in general.', ka: 'სურსათის უვნებლობის, ვეტერინარული და საინჟინრო სტანდარტები დასახელებული იქ, სადაც მოქმედებს.' },
  },
  {
    label: { en: 'One taxonomy', ka: 'ერთი ტაქსონომია' },
    body: { en: 'The same five directions govern the website, the CRM, campaign routing and every future platform.', ka: 'ერთი და იგივე ხუთი მიმართულება მართავს ვებსაიტს, CRM-ს, კამპანიებს და მომავალ პლატფორმებს.' },
  },
  {
    label: { en: 'Built to scale', ka: 'მასშტაბისთვის აგებული' },
    body: { en: 'Hundreds of offerings can be added through filters and templates without a new top-level menu item.', ka: 'ასობით შეთავაზების დამატება ფილტრებითა და შაბლონებით, ახალი მენიუს გარეშე.' },
  },
];
