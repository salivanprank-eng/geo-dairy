import type { Direction, DirectionId, SubDirection } from '@/lib/types';

/**
 * GEO DAIRY PERMANENT BUSINESS TAXONOMY — brief §5.
 * These five directions are the only primary business-navigation items (§19).
 * Georgian strings are structurally correct placeholders and must be reviewed
 * by the KA copywriter against the controlled terminology dictionary (§12.3).
 */

export const DIRECTIONS: Direction[] = [
  {
    id: 'ecosystem',
    order: 1,
    accent: 'var(--color-ecosystem)',
    accentInk: 'var(--color-ecosystem-ink)',
    label: { en: 'Ecosystem', ka: 'ეკოსისტემა' },
    definition: {
      en: 'The industry layer — information, knowledge, networks, platforms and reference that hold the dairy sector together.',
      ka: 'ინდუსტრიის ფენა — ინფორმაცია, ცოდნა, ქსელები, პლატფორმები და ცნობარი, რომელიც რძის სექტორს აერთიანებს.',
    },
    intro: {
      en: 'GEO Dairy builds the shared infrastructure the Georgian dairy industry runs on: intelligence, education, directories, networks, platforms and participation pathways. Ecosystem is where the industry meets itself.',
      ka: 'GEO Dairy ქმნის საერთო ინფრასტრუქტურას, რომელზეც ქართული რძის ინდუსტრია დგას: ინტელექტი, განათლება, ცნობარები, ქსელები, პლატფორმები და ჩართულობის გზები.',
    },
    subs: [],
  },
  {
    id: 'trade',
    order: 2,
    accent: 'var(--color-trade)',
    accentInk: 'var(--color-trade-ink)',
    label: { en: 'Trade', ka: 'ვაჭრობა' },
    definition: {
      en: 'Commercial movement and sale of market-ready dairy products across borders, channels and customers.',
      ka: 'მზა რძის პროდუქციის კომერციული მოძრაობა და გაყიდვა საზღვრებს, არხებსა და მომხმარებლებს შორის.',
    },
    intro: {
      en: 'Trade is where GEO Dairy acts as a commercial principal in finished dairy goods — exporting, importing, distributing, wholesaling and retailing. Inputs to the industry belong to Supply; Trade concerns market-ready output.',
      ka: 'ვაჭრობა არის მიმართულება, სადაც GEO Dairy მოქმედებს როგორც კომერციული პრინციპალი მზა რძის პროდუქციაში — ექსპორტი, იმპორტი, დისტრიბუცია, საბითუმო და საცალო.',
    },
    subs: [],
  },
  {
    id: 'service',
    order: 3,
    accent: 'var(--color-service)',
    accentInk: 'var(--color-service-ink)',
    label: { en: 'Service', ka: 'სერვისი' },
    definition: {
      en: 'Professional capability applied to dairy businesses — advisory, engineering, implementation, operation and development.',
      ka: 'პროფესიული შესაძლებლობა რძის ბიზნესებისთვის — კონსულტაცია, ინჟინერია, იმპლემენტაცია, ოპერირება და განვითარება.',
    },
    intro: {
      en: 'From feasibility study to commissioned plant to managed operation, Service covers the professional work that makes dairy assets viable. Every service is classified by value-chain stage and technical domain.',
      ka: 'შესაძლებლობის კვლევიდან ამოქმედებულ საწარმომდე და მართულ ოპერირებამდე — სერვისი მოიცავს პროფესიულ სამუშაოს, რომელიც რძის აქტივებს სიცოცხლისუნარიანს ხდის.',
    },
    subs: [],
  },
  {
    id: 'supply',
    order: 4,
    accent: 'var(--color-supply)',
    accentInk: 'var(--color-supply-ink)',
    label: { en: 'Supply', ka: 'მომარაგება' },
    definition: {
      en: 'Resources the dairy industry consumes — infrastructure, equipment, inputs, capital and workforce.',
      ka: 'რესურსები, რომელსაც რძის ინდუსტრია მოიხმარს — ინფრასტრუქტურა, აღჭურვილობა, საწარმოო რესურსები, კაპიტალი და სამუშაო ძალა.',
    },
    intro: {
      en: 'Supply is the input side of the industry. GEO Dairy sources, represents, finances and delivers what dairy farms, plants and distributors need to build and run — and onboards the manufacturers and suppliers behind it.',
      ka: 'მომარაგება არის ინდუსტრიის შემავალი მხარე. GEO Dairy ეძებს, წარმოადგენს, აფინანსებს და აწვდის იმას, რაც რძის ფერმებს, საწარმოებსა და დისტრიბუტორებს სჭირდებათ.',
    },
    subs: [],
  },
  {
    id: 'production',
    order: 5,
    accent: 'var(--color-production)',
    accentInk: 'var(--color-production-ink)',
    label: { en: 'Production', ka: 'წარმოება' },
    definition: {
      en: 'Dairy farming and manufacturing that GEO Dairy owns, controls, contracts or coordinates through the Grid.',
      ka: 'რძის მეურნეობა და წარმოება, რომელსაც GEO Dairy ფლობს, აკონტროლებს, აკონტრაქტებს ან კოორდინირებს Grid-ის მეშვეობით.',
    },
    intro: {
      en: 'Production is GEO Dairy operating as a producer: raw milk upstream, processing midstream, contract and private-label arrangements, and the Dairy Grid national integrated programme.',
      ka: 'წარმოება არის GEO Dairy როგორც მწარმოებელი: ნედლი რძე, გადამუშავება, საკონტრაქტო და კერძო ბრენდის მოწყობა და Dairy Grid ეროვნული ინტეგრირებული პროგრამა.',
    },
    subs: [],
  },
];

const SUBS: SubDirection[] = [
  /* ---------------------------------------------------------------- ECOSYSTEM (9) */
  {
    slug: 'information', direction: 'ecosystem', offeringPageType: 'platform',
    label: { en: 'Information', ka: 'ინფორმაცია' },
    definition: { en: 'Current industry information and market intelligence.', ka: 'მიმდინარე ინდუსტრიული ინფორმაცია და ბაზრის ინტელექტი.' },
    purpose: {
      en: 'Dairy news, price and market updates, alerts and sector intelligence. As dairy.ge matures, publishing gravity moves there while GEO Dairy keeps the commercial reading of the data.',
      ka: 'რძის სიახლეები, ფასებისა და ბაზრის განახლებები, შეტყობინებები და სექტორული ინტელექტი.',
    },
    stages: ['cross-chain'], primaryCta: 'contact',
  },
  {
    slug: 'knowledge', direction: 'ecosystem', offeringPageType: 'platform',
    label: { en: 'Knowledge', ka: 'ცოდნა' },
    definition: { en: 'Learning, education, technical knowledge and research.', ka: 'სწავლება, განათლება, ტექნიკური ცოდნა და კვლევა.' },
    purpose: {
      en: 'The Dairy Academy, training programmes, technical guides, research and the reference library that raise the competence level of the whole sector.',
      ka: 'Dairy Academy, სასწავლო პროგრამები, ტექნიკური სახელმძღვანელოები, კვლევა და საცნობარო ბიბლიოთეკა.',
    },
    stages: ['cross-chain'], primaryCta: 'contact', secondaryCta: 'provider-application',
  },
  {
    slug: 'network', direction: 'ecosystem', offeringPageType: 'platform',
    label: { en: 'Network', ka: 'ქსელი' },
    definition: { en: 'Structured connection between industry stakeholders.', ka: 'ინდუსტრიის მონაწილეთა სტრუქტურირებული კავშირი.' },
    purpose: {
      en: 'Farmer, processor, supplier, professional and institutional networks — membership, matching and structured cooperation rather than an open social feed.',
      ka: 'ფერმერთა, გადამამუშავებელთა, მომმარაგებელთა, პროფესიონალთა და ინსტიტუციური ქსელები.',
    },
    stages: ['cross-chain'], primaryCta: 'provider-application', secondaryCta: 'contact',
  },
  {
    slug: 'engagement', direction: 'ecosystem', offeringPageType: 'platform',
    label: { en: 'Engagement', ka: 'ჩართულობა' },
    definition: { en: 'Participation, events, forums and industry missions.', ka: 'მონაწილეობა, ღონისძიებები, ფორუმები და ინდუსტრიული მისიები.' },
    purpose: {
      en: 'Conferences, forums, awards, trade missions and working meetings where the industry decides things together.',
      ka: 'კონფერენციები, ფორუმები, ჯილდოები, სავაჭრო მისიები და სამუშაო შეხვედრები.',
    },
    stages: ['cross-chain'], primaryCta: 'contact',
  },
  {
    slug: 'visibility', direction: 'ecosystem', offeringPageType: 'platform',
    label: { en: 'Visibility', ka: 'ხილვადობა' },
    definition: { en: 'Exposure for industry companies, brands and products.', ka: 'ექსპოზიცია ინდუსტრიის კომპანიების, ბრენდებისა და პროდუქტებისთვის.' },
    purpose: {
      en: 'Showcases, directory presence, featured brands and exhibition participation that put Georgian dairy capability in front of buyers.',
      ka: 'ვიტრინები, ცნობარში ყოფნა, გამორჩეული ბრენდები და საგამოფენო მონაწილეობა.',
    },
    stages: ['cross-chain'], primaryCta: 'contact', secondaryCta: 'supplier-application',
  },
  {
    slug: 'marketplace', direction: 'ecosystem', offeringPageType: 'platform',
    label: { en: 'Marketplace', ka: 'მარკეტპლეისი' },
    definition: { en: 'Platform-mediated matching between buyers and sellers.', ka: 'პლატფორმით შუამავლობითი დაკავშირება მყიდველებსა და გამყიდველებს შორის.' },
    purpose: {
      en: 'Dairy Market — where GEO Dairy facilitates a transaction between two other parties. When GEO Dairy is the commercial principal instead, that is Trade.',
      ka: 'Dairy Market — სადაც GEO Dairy ხელს უწყობს გარიგებას ორ სხვა მხარეს შორის.',
    },
    stages: ['cross-chain'], primaryCta: 'contact', secondaryCta: 'supplier-application',
  },
  {
    slug: 'reference', direction: 'ecosystem', offeringPageType: 'reference',
    label: { en: 'Reference', ka: 'ცნობარი' },
    definition: { en: 'Structured facts, directories, standards and data.', ka: 'სტრუქტურირებული ფაქტები, ცნობარები, სტანდარტები და მონაცემები.' },
    purpose: {
      en: 'Company, farm and supplier directories, product catalogs, standards, statistics and the terminology dictionary the whole ecosystem cites.',
      ka: 'კომპანიების, ფერმებისა და მომმარაგებლების ცნობარები, კატალოგები, სტანდარტები, სტატისტიკა და ტერმინოლოგია.',
    },
    stages: ['cross-chain'], primaryCta: 'contact',
  },
  {
    slug: 'support', direction: 'ecosystem', offeringPageType: 'platform',
    label: { en: 'Support', ka: 'მხარდაჭერა' },
    definition: { en: 'Mechanisms that help stakeholders participate and solve needs.', ka: 'მექანიზმები, რომლებიც მონაწილეებს ჩართვასა და საჭიროებების გადაწყვეტაში ეხმარება.' },
    purpose: {
      en: 'Access pathways, facilitation and programmes that remove the practical obstacles between a stakeholder and the capability they need.',
      ka: 'წვდომის გზები, ფასილიტაცია და პროგრამები პრაქტიკული ბარიერების მოსახსნელად.',
    },
    stages: ['cross-chain'], primaryCta: 'contact',
  },
  {
    slug: 'experience', direction: 'ecosystem', offeringPageType: 'platform',
    label: { en: 'Experience', ka: 'გამოცდილება' },
    definition: { en: 'Physical and experiential engagement with dairy.', ka: 'ფიზიკური და გამოცდილებითი ჩართულობა.' },
    purpose: {
      en: 'Farm visits, plant tours, tasting, demonstrations and educational experiences — dairy explained by being seen.',
      ka: 'ფერმის ვიზიტები, საწარმოს ტურები, დეგუსტაცია, დემონსტრაციები და საგანმანათლებლო გამოცდილება.',
    },
    stages: ['upstream', 'midstream'], primaryCta: 'contact',
  },

  /* -------------------------------------------------------------------- TRADE (5) */
  {
    slug: 'international', direction: 'trade', offeringPageType: 'trade',
    label: { en: 'International', ka: 'საერთაშორისო' },
    definition: { en: 'Cross-border trade in market-ready dairy products.', ka: 'ტრანსსასაზღვრო ვაჭრობა მზა რძის პროდუქციით.' },
    purpose: {
      en: 'Export programmes for Georgian dairy, import of products the market needs, target-market portfolios and open trade opportunities.',
      ka: 'ქართული რძის პროდუქციის საექსპორტო პროგრამები, იმპორტი, სამიზნე ბაზრების პორტფელები და სავაჭრო შესაძლებლობები.',
    },
    stages: ['downstream'], primaryCta: 'trade-inquiry', secondaryCta: 'contact',
  },
  {
    slug: 'distribution', direction: 'trade', offeringPageType: 'trade',
    label: { en: 'Distribution', ka: 'დისტრიბუცია' },
    definition: { en: 'Commercial movement of dairy products as principal or distributor.', ka: 'რძის პროდუქციის კომერციული მოძრაობა როგორც პრინციპალი ან დისტრიბუტორი.' },
    purpose: {
      en: 'Distribution capability, covered territories, channel structure and partner programmes for brands entering the Georgian market.',
      ka: 'დისტრიბუციის შესაძლებლობა, დაფარული ტერიტორიები, არხების სტრუქტურა და პარტნიორული პროგრამები.',
    },
    stages: ['downstream'], primaryCta: 'trade-inquiry', secondaryCta: 'contact',
  },
  {
    slug: 'wholesale', direction: 'trade', offeringPageType: 'trade',
    label: { en: 'Wholesale', ka: 'საბითუმო' },
    definition: { en: 'B2B sale of dairy products at volume.', ka: 'რძის პროდუქციის B2B გაყიდვა მოცულობით.' },
    purpose: {
      en: 'Wholesale catalog, buyer programmes and institutional accounts for retail chains, HoReCa, processors and public buyers.',
      ka: 'საბითუმო კატალოგი, მყიდველთა პროგრამები და ინსტიტუციური ანგარიშები.',
    },
    stages: ['downstream'], primaryCta: 'trade-inquiry', secondaryCta: 'contact',
  },
  {
    slug: 'retail', direction: 'trade', offeringPageType: 'trade',
    label: { en: 'Retail', ka: 'საცალო' },
    definition: { en: 'Physical consumer-facing dairy commerce.', ka: 'ფიზიკური სამომხმარებლო რძის კომერცია.' },
    purpose: {
      en: 'Store concepts, locations and retail programmes where GEO Dairy sells dairy directly to consumers.',
      ka: 'მაღაზიის კონცეფციები, ლოკაციები და საცალო პროგრამები.',
    },
    stages: ['downstream'], primaryCta: 'trade-inquiry',
  },
  {
    slug: 'e-commerce', direction: 'trade', offeringPageType: 'trade',
    label: { en: 'E-Commerce', ka: 'ელექტრონული კომერცია' },
    definition: { en: 'Online B2B and B2C sale of dairy products.', ka: 'რძის პროდუქციის ონლაინ B2B და B2C გაყიდვა.' },
    purpose: {
      en: 'Online catalog and store, delivery and service areas, and digital offers for both business and consumer buyers.',
      ka: 'ონლაინ კატალოგი და მაღაზია, მიწოდების ზონები და ციფრული შეთავაზებები.',
    },
    stages: ['downstream'], primaryCta: 'trade-inquiry',
  },

  /* ------------------------------------------------------------------ SERVICE (5) */
  {
    slug: 'advisory', direction: 'service', offeringPageType: 'service',
    label: { en: 'Advisory', ka: 'კონსულტაცია' },
    definition: { en: 'Analysis, feasibility, strategy, assessment and planning.', ka: 'ანალიზი, შესაძლებლობის კვლევა, სტრატეგია, შეფასება და დაგეგმვა.' },
    purpose: {
      en: 'Before capital is committed: feasibility studies, farm and plant assessments, business plans, market-entry analysis and audits that decide whether and how a dairy project proceeds.',
      ka: 'კაპიტალის ჩადებამდე: შესაძლებლობის კვლევები, ფერმისა და საწარმოს შეფასება, ბიზნეს-გეგმები, ბაზარზე შესვლის ანალიზი და აუდიტი.',
    },
    stages: ['upstream', 'midstream', 'downstream', 'cross-chain'],
    primaryCta: 'service-request', secondaryCta: 'provider-application',
  },
  {
    slug: 'engineering', direction: 'service', offeringPageType: 'service',
    label: { en: 'Engineering', ka: 'ინჟინერია' },
    definition: { en: 'Technical design and specification of dairy facilities and systems.', ka: 'რძის ობიექტებისა და სისტემების ტექნიკური დიზაინი და სპეციფიკაცია.' },
    purpose: {
      en: 'Farm layouts, plant process design, utilities, cold chain, effluent, automation and the technical documentation a contractor can actually build from.',
      ka: 'ფერმის განლაგება, საწარმოს პროცესის დიზაინი, კომუნიკაციები, ცივი ჯაჭვი, ავტომატიზაცია და ტექნიკური დოკუმენტაცია.',
    },
    stages: ['upstream', 'midstream', 'downstream'],
    primaryCta: 'service-request', secondaryCta: 'provider-application',
  },
  {
    slug: 'implementation', direction: 'service', offeringPageType: 'service',
    label: { en: 'Implementation', ka: 'იმპლემენტაცია' },
    definition: { en: 'Construction coordination, installation, commissioning and launch.', ka: 'მშენებლობის კოორდინაცია, მონტაჟი, ამოქმედება და გაშვება.' },
    purpose: {
      en: 'Turning a design into a working asset — project management, installation, integration, commissioning, validation and handover.',
      ka: 'დიზაინის ამოქმედება — პროექტის მართვა, მონტაჟი, ინტეგრაცია, ამოქმედება, ვალიდაცია და გადაცემა.',
    },
    stages: ['upstream', 'midstream', 'downstream'],
    primaryCta: 'service-request', secondaryCta: 'provider-application',
  },
  {
    slug: 'operation', direction: 'service', offeringPageType: 'service',
    label: { en: 'Operation', ka: 'ოპერირება' },
    definition: { en: 'Recurring, managed and outsourced technical and business activity.', ka: 'განმეორებადი, მართული და აუთსორსული ტექნიკური და ბიზნეს-საქმიანობა.' },
    purpose: {
      en: 'Maintenance contracts, herd and production management, quality systems, managed operation and outsourced technical functions that run month after month.',
      ka: 'სარემონტო კონტრაქტები, ნახირისა და წარმოების მართვა, ხარისხის სისტემები, მართული ოპერირება.',
    },
    stages: ['upstream', 'midstream', 'downstream'],
    primaryCta: 'service-request', secondaryCta: 'provider-application',
  },
  {
    slug: 'development', direction: 'service', offeringPageType: 'service',
    label: { en: 'Development', ka: 'განვითარება' },
    definition: { en: 'Creation, expansion or transformation of dairy businesses and capabilities.', ka: 'რძის ბიზნესებისა და შესაძლებლობების შექმნა, გაფართოება ან ტრანსფორმაცია.' },
    purpose: {
      en: 'New product development, capacity expansion, brand and channel development, restructuring and the mandates where GEO Dairy builds a business alongside its owner.',
      ka: 'ახალი პროდუქტის შემუშავება, სიმძლავრის გაფართოება, ბრენდისა და არხის განვითარება, რესტრუქტურიზაცია.',
    },
    stages: ['upstream', 'midstream', 'downstream', 'cross-chain'],
    primaryCta: 'service-request', secondaryCta: 'investment',
  },

  /* ------------------------------------------------------------------- SUPPLY (5) */
  {
    slug: 'infrastructure', direction: 'supply', offeringPageType: 'supply',
    label: { en: 'Infrastructure', ka: 'ინფრასტრუქტურა' },
    definition: { en: 'Fixed facilities, structures and site or utility systems.', ka: 'ფიქსირებული ობიექტები, ნაგებობები და კომუნალური სისტემები.' },
    purpose: {
      en: 'Barns, milking parlours, processing buildings, cold stores, water, power, effluent and the site works a dairy operation is physically built from.',
      ka: 'სადგომები, საწველი დარბაზები, გადამამუშავებელი შენობები, სამაცივრე მეურნეობა, წყალი, ენერგია და ნარჩენები.',
    },
    stages: ['upstream', 'midstream', 'downstream'],
    primaryCta: 'quote', secondaryCta: 'supplier-application',
  },
  {
    slug: 'equipment', direction: 'supply', offeringPageType: 'supply',
    label: { en: 'Equipment', ka: 'აღჭურვილობა' },
    definition: { en: 'Machines, vehicles, instruments and technology assets.', ka: 'მანქანები, ტრანსპორტი, ხელსაწყოები და ტექნოლოგიური აქტივები.' },
    purpose: {
      en: 'Milking systems, cooling, processing and packaging lines, laboratory instruments, farm machinery, refrigerated transport and dairy software.',
      ka: 'საწველი სისტემები, გაგრილება, გადამამუშავებელი და შესაფუთი ხაზები, ლაბორატორიული ხელსაწყოები, ტექნიკა და პროგრამული უზრუნველყოფა.',
    },
    stages: ['upstream', 'midstream', 'downstream'],
    primaryCta: 'quote', secondaryCta: 'supplier-application',
  },
  {
    slug: 'inputs', direction: 'supply', offeringPageType: 'supply',
    label: { en: 'Inputs', ka: 'საწარმოო რესურსები' },
    definition: { en: 'Consumable, biological and production inputs.', ka: 'სახარჯი, ბიოლოგიური და საწარმოო რესურსები.' },
    purpose: {
      en: 'Feed and forage, genetics and breeding stock, veterinary and hygiene products, cultures and ingredients, packaging and consumables.',
      ka: 'საკვები და ფურაჟი, გენეტიკა და სანაშენე პირუტყვი, ვეტერინარული და ჰიგიენის პროდუქტები, დედოები და ინგრედიენტები, შეფუთვა.',
    },
    stages: ['upstream', 'midstream'],
    primaryCta: 'quote', secondaryCta: 'supplier-application',
  },
  {
    slug: 'capital', direction: 'supply', offeringPageType: 'supply',
    label: { en: 'Capital', ka: 'კაპიტალი' },
    definition: { en: 'Financial resources and structured financial or risk products.', ka: 'ფინანსური რესურსები და სტრუქტურირებული ფინანსური ან სარისკო პროდუქტები.' },
    purpose: {
      en: 'Investment, leasing, working-capital and insurance structures supplied or facilitated for dairy farms, plants and traders.',
      ka: 'ინვესტიცია, ლიზინგი, საბრუნავი კაპიტალი და დაზღვევის სტრუქტურები რძის ბიზნესებისთვის.',
    },
    stages: ['upstream', 'midstream', 'downstream', 'cross-chain'],
    primaryCta: 'investment', secondaryCta: 'contact',
  },
  {
    slug: 'workforce', direction: 'supply', offeringPageType: 'supply',
    label: { en: 'Workforce', ka: 'სამუშაო ძალა' },
    definition: { en: 'Human-resource capacity supplied to dairy businesses.', ka: 'ადამიანური რესურსის შესაძლებლობა რძის ბიზნესებისთვის.' },
    purpose: {
      en: 'Technologists, veterinarians, herd managers, plant operators, maintenance engineers and seasonal crews — recruited, trained and placed.',
      ka: 'ტექნოლოგები, ვეტერინარები, ნახირის მენეჯერები, ოპერატორები, ინჟინრები და სეზონური პერსონალი.',
    },
    stages: ['upstream', 'midstream', 'downstream'],
    primaryCta: 'quote', secondaryCta: 'career',
  },

  /* --------------------------------------------------------------- PRODUCTION (4) */
  {
    slug: 'upstream', direction: 'production', offeringPageType: 'production',
    label: { en: 'Upstream', ka: 'პირველადი წარმოება' },
    definition: { en: 'GEO Dairy-owned and controlled dairy farming and raw-milk production.', ka: 'GEO Dairy-ის საკუთრებაში არსებული მეურნეობა და ნედლი რძის წარმოება.' },
    purpose: {
      en: 'Cattle, sheep, goat and other dairy-animal farming operations, raw-milk output, herd programmes and farm by-products.',
      ka: 'მსხვილფეხა, ცხვრის, თხისა და სხვა რძის ცხოველების მეურნეობა, ნედლი რძის გამომუშავება და ფერმის თანაპროდუქტები.',
    },
    stages: ['upstream'],
    primaryCta: 'trade-inquiry', secondaryCta: 'investment',
  },
  {
    slug: 'midstream', direction: 'production', offeringPageType: 'production',
    label: { en: 'Midstream', ka: 'გადამუშავება' },
    definition: { en: 'GEO Dairy-owned and controlled processing and manufacturing.', ka: 'GEO Dairy-ის საკუთრებაში არსებული გადამუშავება და წარმოება.' },
    purpose: {
      en: 'Milk, cheese, butter, cream, yoghurt and other dairy manufacturing — capacity, technology, standards and output portfolios.',
      ka: 'რძე, ყველი, კარაქი, ნაღები, იოგურტი და სხვა რძის წარმოება — სიმძლავრე, ტექნოლოგია, სტანდარტები და პროდუქციის პორტფელი.',
    },
    stages: ['midstream'],
    primaryCta: 'trade-inquiry', secondaryCta: 'investment',
  },
  {
    slug: 'contract', direction: 'production', offeringPageType: 'production',
    label: { en: 'Contract', ka: 'საკონტრაქტო წარმოება' },
    definition: { en: 'Contract farming, contract manufacturing, private label and toll arrangements.', ka: 'საკონტრაქტო მეურნეობა და წარმოება, კერძო ბრენდი და მომსახურების საფასურით წარმოება.' },
    purpose: {
      en: 'Production capacity made available to third parties — and third-party capacity contracted by GEO Dairy. The commercial model may span upstream or midstream.',
      ka: 'საწარმოო სიმძლავრე მესამე მხარისთვის — და მესამე მხარის სიმძლავრე GEO Dairy-ის კონტრაქტით.',
    },
    stages: ['upstream', 'midstream'],
    primaryCta: 'trade-inquiry', secondaryCta: 'contact',
  },
  {
    slug: 'grid', direction: 'production', offeringPageType: 'grid',
    label: { en: 'Dairy Grid', ka: 'Dairy Grid' },
    definition: { en: 'The national integrated dairy production and network programme.', ka: 'ეროვნული ინტეგრირებული რძის წარმოებისა და ქსელის პროგრამა.' },
    purpose: {
      en: 'The flagship cross-value-chain programme: coordinated farms, collection, processing and market access operating as one national network, with a dedicated platform at dairygrid.ge.',
      ka: 'ფლაგმანური პროგრამა: კოორდინირებული ფერმები, შეგროვება, გადამუშავება და ბაზარზე წვდომა ერთ ეროვნულ ქსელად.',
    },
    stages: ['upstream', 'midstream', 'downstream', 'cross-chain'],
    primaryCta: 'grid-participation', secondaryCta: 'investment',
  },
];

// Attach sub-directions to their direction, preserving brief order.
for (const d of DIRECTIONS) {
  d.subs = SUBS.filter((s) => s.direction === d.id);
}

export const SUB_DIRECTIONS = SUBS;

export const getDirection = (id: string): Direction | undefined =>
  DIRECTIONS.find((d) => d.id === id);

export const getSub = (dir: string, slug: string): SubDirection | undefined =>
  SUBS.find((s) => s.direction === dir && s.slug === slug);

export const DIRECTION_IDS: DirectionId[] = DIRECTIONS.map((d) => d.id);
