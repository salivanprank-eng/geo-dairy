import type { I18n, Offering } from '@/lib/types';
import { OFFERINGS } from '@/data/offerings';

/**
 * PLAN YOUR BUILD — the configurator's rule base.
 *
 * The Navigator (§6) answers "where do I go?". This answers the question that
 * comes before it: "what do I even need?" A farmer who wants 200 cows does not
 * arrive knowing they need a feasibility study, an effluent design, a parlour, a
 * cooling tank, a herd-health programme and a finance route — and they should
 * not have to derive that from a 28-item taxonomy.
 *
 * So the taxonomy is inverted here. Instead of five directions the visitor has
 * to map onto their own project, they describe the project and the site returns
 * the bundle: which offerings, in which phase, and why each one is in the list.
 *
 * The rules are editorial, not computed. Each row exists because someone who has
 * built one of these decided it belongs — which is exactly the kind of judgement
 * a CMS field should hold, so this file is the shape the CMS entity needs to
 * take. `why` is the load-bearing field: a list without reasons is a catalogue.
 *
 * Deliberately absent: durations, budgets and lead times. They would have to be
 * invented, and §11.1 is explicit that projections must not be presented as
 * established fact. Sequence is knowable; the calendar is set at feasibility.
 */

export type PlanBuildId =
  | 'dairy-farm' | 'processing-plant' | 'cold-chain' | 'dairy-brand' | 'export-programme';

/** Scale is asked in each project's own units, so the ids stay generic. */
export type PlanScaleId = 's' | 'm' | 'l';

export type PlanStartId = 'greenfield' | 'expanding' | 'upgrading' | 'entering';

export type PlanPhaseId = 'decide' | 'design' | 'build' | 'operate' | 'grow' | 'fund';

export interface PlanPhase {
  id: PlanPhaseId;
  label: I18n;
  role: I18n;
}

/** The order is the sequence: each phase depends on the one before it. */
export const PLAN_PHASES: PlanPhase[] = [
  {
    id: 'decide',
    label: { en: 'Decide', ka: 'გადაწყვეტილება' },
    role: {
      en: 'Establish whether the project works before any capital is committed.',
      ka: 'დადგინდეს, მუშაობს თუ არა პროექტი, სანამ კაპიტალი დაიხარჯება.',
    },
  },
  {
    id: 'design',
    label: { en: 'Design', ka: 'დაპროექტება' },
    role: {
      en: 'Turn the decision into drawings, flows and specifications.',
      ka: 'გადაწყვეტილება გადაიზარდოს ნახაზებში, ნაკადებსა და სპეციფიკაციებში.',
    },
  },
  {
    id: 'build',
    label: { en: 'Build & equip', ka: 'აშენება და აღჭურვა' },
    role: {
      en: 'Structures, machinery, installation and commissioning.',
      ka: 'ნაგებობები, დანადგარები, მონტაჟი და ამოქმედება.',
    },
  },
  {
    id: 'operate',
    label: { en: 'Operate', ka: 'ოპერირება' },
    role: {
      en: 'Inputs, people, quality assurance and the maintenance that keeps it running.',
      ka: 'რესურსები, ადამიანები, ხარისხის უზრუნველყოფა და მოვლა-შენახვა.',
    },
  },
  {
    id: 'grow',
    label: { en: 'Sell & grow', ka: 'გაყიდვა და ზრდა' },
    role: {
      en: 'Where the output goes, and what the next stage of the business looks like.',
      ka: 'სად მიდის პროდუქცია და როგორია ბიზნესის შემდეგი ეტაპი.',
    },
  },
  {
    id: 'fund',
    label: { en: 'Fund it', ka: 'დაფინანსება' },
    role: {
      en: 'The capital route. Runs alongside the phases above, not after them.',
      ka: 'კაპიტალის გზა. მიმდინარეობს პარალელურად, არა ბოლოს.',
    },
  },
];

export const PLAN_STARTS: { id: PlanStartId; label: I18n; note: I18n }[] = [
  {
    id: 'greenfield',
    label: { en: 'Starting from nothing', ka: 'ნულიდან ვიწყებ' },
    note: { en: 'Land or a site, and an intention.', ka: 'მიწა ან ნაკვეთი და განზრახვა.' },
  },
  {
    id: 'expanding',
    label: { en: 'Expanding what I have', ka: 'არსებულს ვაფართოებ' },
    note: { en: 'An operation that works, and needs to be bigger.', ka: 'მოქმედი საწარმო, რომელსაც გაზრდა სჭირდება.' },
  },
  {
    id: 'upgrading',
    label: { en: 'Upgrading equipment', ka: 'აღჭურვილობას ვანახლებ' },
    note: { en: 'The building stays; what is inside it changes.', ka: 'შენობა რჩება, იცვლება მისი შიგთავსი.' },
  },
  {
    id: 'entering',
    label: { en: 'Entering a new market', ka: 'ახალ ბაზარზე შევდივარ' },
    note: { en: 'The production exists; the buyers do not yet.', ka: 'წარმოება არსებობს, მყიდველები ჯერ არა.' },
  },
];

export interface PlanRule {
  slug: string;
  phase: PlanPhaseId;
  /** Why this belongs in the plan. Shown on the row — never omit it. */
  why: I18n;
  /** Restrict to these scales; omitted means every scale. */
  scales?: PlanScaleId[];
  /** Restrict to these starting points; omitted means every one. */
  starts?: PlanStartId[];
}

export interface PlanBuild {
  id: PlanBuildId;
  label: I18n;
  summary: I18n;
  /** The scale question, asked in this project's own units. */
  scaleQuestion: I18n;
  scales: { id: PlanScaleId; label: I18n; note: I18n }[];
  /** Starting points that make sense for this project. */
  starts: PlanStartId[];
  rules: PlanRule[];
}

export const PLAN_BUILDS: PlanBuild[] = [
  /* ---------------------------------------------------------------- farm */
  {
    id: 'dairy-farm',
    label: { en: 'A dairy farm', ka: 'რძის ფერმა' },
    summary: {
      en: 'Milk production — housing, milking, cooling, herd and feed.',
      ka: 'რძის წარმოება — სადგომი, წველა, გაცივება, ნახირი და საკვები.',
    },
    scaleQuestion: { en: 'How many milking cows?', ka: 'რამდენი მეწველი ძროხა?' },
    scales: [
      { id: 's', label: { en: '20–80 cows', ka: '20–80 ძროხა' }, note: { en: 'Family or small commercial herd', ka: 'ოჯახური ან მცირე კომერციული ნახირი' } },
      { id: 'm', label: { en: '80–400 cows', ka: '80–400 ძროხა' }, note: { en: 'Commercial herd with hired staff', ka: 'კომერციული ნახირი დაქირავებული პერსონალით' } },
      { id: 'l', label: { en: '400+ cows', ka: '400+ ძროხა' }, note: { en: 'Industrial herd, often several units', ka: 'ინდუსტრიული ნახირი, ხშირად რამდენიმე ერთეული' } },
    ],
    starts: ['greenfield', 'expanding', 'upgrading'],
    rules: [
      { slug: 'dairy-farm-feasibility-study', phase: 'decide', why: { en: 'Settles herd size, land, feed base and the numbers before anything is committed.', ka: 'განსაზღვრავს ნახირის ზომას, მიწას, საკვებ ბაზას და ციფრებს ვალდებულებამდე.' } },
      { slug: 'farm-performance-audit', phase: 'decide', starts: ['expanding', 'upgrading'], why: { en: 'Measures what the existing herd actually delivers before you add to it.', ka: 'ზომავს, რას იძლევა არსებული ნახირი, სანამ მას გაზრდით.' } },
      { slug: 'dairy-farm-design', phase: 'design', why: { en: 'Barn layout, milking route, feed and manure flow drawn as one system rather than four.', ka: 'სადგომის განლაგება, წველის მარშრუტი, საკვები და ნაკელი — ერთი სისტემა.' } },
      { slug: 'utilities-effluent-design', phase: 'design', scales: ['m', 'l'], why: { en: 'Water, power and effluent stop being details somewhere around a hundred cows.', ka: 'წყალი, ენერგია და ნარჩენები ასი ძროხის შემდეგ კრიტიკული ხდება.' } },
      { slug: 'barns-livestock-structures', phase: 'build', starts: ['greenfield', 'expanding'], why: { en: 'Housing, calf accommodation, feed alleys and ventilation.', ka: 'სადგომი, ხბოს ადგილი, საკვები დერეფნები და ვენტილაცია.' } },
      { slug: 'modular-milking-parlours', phase: 'build', why: { en: 'The parlour sets your daily labour hours for the next fifteen years.', ka: 'საწველი დარბაზი განსაზღვრავს ყოველდღიურ შრომას მომდევნო თხუთმეტი წლის განმავლობაში.' } },
      { slug: 'milking-systems', phase: 'build', why: { en: 'Clusters, pulsation, cleaning and the metering the herd programme reads from.', ka: 'აპარატები, პულსაცია, რეცხვა და მრიცხველები, რომელთა მონაცემებზეც დგება პროგრამა.' } },
      { slug: 'milk-cooling-tanks', phase: 'build', why: { en: 'Cooling inside the collection window is what makes the milk sellable at all.', ka: 'შეგროვების ფანჯარაში გაცივება განსაზღვრავს, გაიყიდება თუ არა რძე.' } },
      { slug: 'turnkey-farm-construction', phase: 'build', scales: ['m', 'l'], starts: ['greenfield'], why: { en: 'One contract for site, structures and commissioning instead of coordinating five.', ka: 'ერთი კონტრაქტი ნაკვეთზე, ნაგებობებსა და ამოქმედებაზე, ხუთის ნაცვლად.' } },
      { slug: 'equipment-installation-commissioning', phase: 'build', starts: ['upgrading'], why: { en: 'Replacing equipment in a working parlour is a scheduling problem before it is a technical one.', ka: 'მოქმედ დარბაზში აღჭურვილობის შეცვლა ჯერ გრაფიკის, შემდეგ ტექნიკის საკითხია.' } },
      { slug: 'genetics-breeding-stock', phase: 'operate', why: { en: 'Genetics decide yield and longevity, and the decision is slow to reverse.', ka: 'გენეტიკა განსაზღვრავს მოსავლიანობასა და ხანგრძლივობას და ძნელად ბრუნდება უკან.' } },
      { slug: 'compound-feed', phase: 'operate', why: { en: 'Feed is the largest running cost and the fastest lever on yield.', ka: 'საკვები ყველაზე დიდი მიმდინარე ხარჯი და მოსავლიანობის ყველაზე სწრაფი ბერკეტია.' } },
      { slug: 'hygiene-veterinary-products', phase: 'operate', why: { en: 'Udder health and parlour hygiene are what the somatic cell count reports back.', ka: 'ცურის ჯანმრთელობა და ჰიგიენა აისახება სომატური უჯრედების მაჩვენებელში.' } },
      { slug: 'herd-health-programme', phase: 'operate', scales: ['m', 'l'], why: { en: 'At this size health has to be a programme, not a reaction to sick animals.', ka: 'ამ მასშტაბზე ჯანმრთელობა პროგრამაა, არა რეაქცია დაავადებაზე.' } },
      { slug: 'farm-operators-herd-managers', phase: 'operate', scales: ['m', 'l'], why: { en: 'Trained operators, because the parlour runs twice a day whether or not you are there.', ka: 'გაწვრთნილი ოპერატორები — დარბაზი დღეში ორჯერ მუშაობს თქვენი დასწრების გარეშეც.' } },
      { slug: 'managed-farm-operation', phase: 'operate', scales: ['l'], why: { en: 'Contracted management, for an owner who is an investor rather than an operator.', ka: 'კონტრაქტით მართვა მფლობელისთვის, რომელიც ინვესტორია და არა ოპერატორი.' } },
      { slug: 'maintenance-contracts', phase: 'operate', why: { en: 'A parlour breakdown is not a repair job, it is a milking you cannot do.', ka: 'დარბაზის გაჩერება არა შეკეთება, არამედ გამოტოვებული წველაა.' } },
      { slug: 'dairy-market', phase: 'grow', why: { en: 'Raw-milk offtake and inputs, listed where the buyers already are.', ka: 'ნედლი რძის რეალიზაცია და რესურსები იქ, სადაც მყიდველები უკვე არიან.' } },
      { slug: 'dairy-academy', phase: 'grow', why: { en: 'Training the people who will run it, in Georgian.', ka: 'იმ ადამიანების ტრენინგი, ვინც ამას მართავს — ქართულად.' } },
      { slug: 'project-finance-facilitation', phase: 'fund', why: { en: 'Structuring the case for banks and programme funding.', ka: 'საბანკო და პროგრამული დაფინანსების საქმის სტრუქტურირება.' } },
      { slug: 'equipment-leasing', phase: 'fund', scales: ['s', 'm'], why: { en: 'Keeps the parlour off the balance sheet while the herd builds up.', ka: 'ინარჩუნებს დარბაზს ბალანსის გარეთ, სანამ ნახირი იზრდება.' } },
    ],
  },

  /* --------------------------------------------------------------- plant */
  {
    id: 'processing-plant',
    label: { en: 'A processing plant', ka: 'გადამამუშავებელი საწარმო' },
    summary: {
      en: 'Milk in, product out — pasteurising, cheese, packaging and quality.',
      ka: 'რძე შედის, პროდუქტი გამოდის — პასტერიზაცია, ყველი, შეფუთვა, ხარისხი.',
    },
    scaleQuestion: { en: 'How much milk per day?', ka: 'რამდენი რძე დღეში?' },
    scales: [
      { id: 's', label: { en: 'Up to 5 t/day', ka: '5 ტ/დღეში-მდე' }, note: { en: 'Artisan or single-product plant', ka: 'ხელოსნური ან ერთპროდუქტიანი საწარმო' } },
      { id: 'm', label: { en: '5–30 t/day', ka: '5–30 ტ/დღეში' }, note: { en: 'Regional multi-product plant', ka: 'რეგიონული მრავალპროდუქტიანი საწარმო' } },
      { id: 'l', label: { en: '30+ t/day', ka: '30+ ტ/დღეში' }, note: { en: 'Industrial plant, several lines', ka: 'ინდუსტრიული საწარმო, რამდენიმე ხაზი' } },
    ],
    starts: ['greenfield', 'expanding', 'upgrading'],
    rules: [
      { slug: 'processing-plant-feasibility', phase: 'decide', why: { en: 'Milk supply, product mix and margin — the three things that decide whether a plant works.', ka: 'რძის მიწოდება, პროდუქტთა ნაკრები და მარჟა — სამი განმსაზღვრელი ფაქტორი.' } },
      { slug: 'food-safety-compliance-review', phase: 'decide', starts: ['expanding', 'upgrading'], why: { en: 'Establishes what the current plant would fail on before you spend on the extension.', ka: 'ადგენს, რაში ჩავარდება არსებული საწარმო, სანამ გაფართოებაში დახარჯავთ.' } },
      { slug: 'market-entry-analysis', phase: 'decide', starts: ['entering'], why: { en: 'Which shelf the product is going onto, and who is already on it.', ka: 'რომელ თაროზე მიდის პროდუქტი და ვინ დგას იქ უკვე.' } },
      { slug: 'process-line-design', phase: 'design', why: { en: 'Line layout, capacity balance and CIP designed together — retrofitting CIP is expensive.', ka: 'ხაზის განლაგება, სიმძლავრეთა ბალანსი და CIP ერთად — შემდგომი დამატება ძვირია.' } },
      { slug: 'cold-chain-engineering', phase: 'design', why: { en: 'Chilling, storage and dispatch temperatures, specified as one chain.', ka: 'გაცივება, შენახვა და გაგზავნის ტემპერატურა — ერთი ჯაჭვი.' } },
      { slug: 'utilities-effluent-design', phase: 'design', why: { en: 'Steam, water and dairy effluent, which is a permit question as much as an engineering one.', ka: 'ორთქლი, წყალი და რძის ნარჩენები — ნებართვის საკითხიც.' } },
      { slug: 'pasteurisers-separators', phase: 'build', why: { en: 'The thermal core of the plant, sized to the daily intake.', ka: 'საწარმოს თერმული ბირთვი, დღიურ მოცულობაზე გათვლილი.' } },
      { slug: 'cheese-production-equipment', phase: 'build', why: { en: 'Vats, presses, brining and ripening, where cheese is part of the mix.', ka: 'ავზები, პრესები, დამარილება და დამწიფება — თუ ყველი ნაკრებშია.' } },
      { slug: 'packaging-lines', phase: 'build', why: { en: 'Pack format is a commercial decision that arrives as an equipment decision.', ka: 'შეფუთვის ფორმატი კომერციული გადაწყვეტილებაა, რომელიც აღჭურვილობით ხორციელდება.' } },
      { slug: 'laboratory-instruments', phase: 'build', why: { en: 'You cannot release a batch you have not tested.', ka: 'პარტიას ვერ გაუშვებთ, თუ არ შეამოწმეთ.' } },
      { slug: 'cold-stores', phase: 'build', why: { en: 'Finished-goods storage at the right temperature, sized for the shelf life you are claiming.', ka: 'მზა პროდუქციის საწყობი სწორ ტემპერატურაზე, ვარგისიანობის ვადის შესაბამისად.' } },
      { slug: 'equipment-installation-commissioning', phase: 'build', why: { en: 'Installation, validation and the hand-over that proves the line makes specification.', ka: 'მონტაჟი, ვალიდაცია და ჩაბარება, რომელიც ადასტურებს ხაზის შესაბამისობას.' } },
      { slug: 'haccp-system-implementation', phase: 'operate', why: { en: 'The food-safety system every buyer and inspector will ask to see.', ka: 'უვნებლობის სისტემა, რომელსაც ყველა მყიდველი და ინსპექტორი მოითხოვს.' } },
      { slug: 'cultures-ingredients', phase: 'operate', why: { en: 'Cultures, rennet and additives — the recurring input the recipe depends on.', ka: 'დედო, კვეთი და დანამატები — რეცეპტის მუდმივი შემადგენელი.' } },
      { slug: 'quality-lab-services', phase: 'operate', why: { en: 'Routine and reference testing, including what you cannot run in-house.', ka: 'რუტინული და საკონტროლო ანალიზი, მათ შორის ის, რაც ადგილზე ვერ კეთდება.' } },
      { slug: 'dairy-technologists', phase: 'operate', why: { en: 'A technologist is the difference between a recipe and a consistent product.', ka: 'ტექნოლოგი განასხვავებს რეცეპტს სტაბილური პროდუქტისგან.' } },
      { slug: 'maintenance-contracts', phase: 'operate', why: { en: 'Planned maintenance, because unplanned downtime spoils raw material.', ka: 'დაგეგმილი მოვლა — გაუთვალისწინებელი გაჩერება ნედლეულს აფუჭებს.' } },
      { slug: 'new-product-development', phase: 'grow', why: { en: 'The second product is usually where the margin is.', ka: 'მეორე პროდუქტი ჩვეულებრივ იქ არის, სადაც მარჟაა.' } },
      { slug: 'private-label-manufacturing', phase: 'grow', why: { en: 'Filling spare capacity by manufacturing for other brands.', ka: 'თავისუფალი სიმძლავრის შევსება სხვისი ბრენდის წარმოებით.' } },
      { slug: 'wholesale-dairy-catalog', phase: 'grow', why: { en: 'Where the output is offered to trade buyers.', ka: 'სად სთავაზობთ პროდუქციას საბითუმო მყიდველებს.' } },
      { slug: 'project-finance-facilitation', phase: 'fund', why: { en: 'Plant capex is rarely funded from cash flow.', ka: 'საწარმოს კაპიტალდაბანდება იშვიათად ფინანსდება ბრუნვიდან.' } },
      { slug: 'equipment-leasing', phase: 'fund', scales: ['s', 'm'], why: { en: 'Line by line, so capacity can follow demand instead of preceding it.', ka: 'ხაზ-ხაზ, რომ სიმძლავრემ მოთხოვნას მიჰყვეს და არა წინ გაუსწროს.' } },
    ],
  },

  /* ----------------------------------------------------------- cold chain */
  {
    id: 'cold-chain',
    label: { en: 'Distribution & cold chain', ka: 'დისტრიბუცია და ცივი ჯაჭვი' },
    summary: {
      en: 'Moving dairy without breaking temperature — stores, vehicles, routes.',
      ka: 'რძის პროდუქტის გადაზიდვა ტემპერატურის დარღვევის გარეშე.',
    },
    scaleQuestion: { en: 'What are you covering?', ka: 'რას ფარავთ?' },
    scales: [
      { id: 's', label: { en: 'One hub', ka: 'ერთი ჰაბი' }, note: { en: 'A single store and local delivery', ka: 'ერთი საწყობი და ადგილობრივი მიწოდება' } },
      { id: 'm', label: { en: 'A regional network', ka: 'რეგიონული ქსელი' }, note: { en: 'Several stores, scheduled routes', ka: 'რამდენიმე საწყობი, გრაფიკიანი მარშრუტები' } },
      { id: 'l', label: { en: 'National coverage', ka: 'ეროვნული დაფარვა' }, note: { en: 'Hub-and-spoke across the country', ka: 'ჰაბებისა და მარშრუტების სისტემა ქვეყნის მასშტაბით' } },
    ],
    starts: ['greenfield', 'expanding', 'entering'],
    rules: [
      { slug: 'market-entry-analysis', phase: 'decide', why: { en: 'Volume, drop density and route economics decide whether the network pays.', ka: 'მოცულობა, წერტილების სიმჭიდროვე და მარშრუტის ეკონომიკა განსაზღვრავს მომგებიანობას.' } },
      { slug: 'food-safety-compliance-review', phase: 'decide', why: { en: 'Cold-chain custody is a legal obligation, not only a quality one.', ka: 'ცივი ჯაჭვის დაცვა სამართლებრივი ვალდებულებაა, არა მხოლოდ ხარისხის.' } },
      { slug: 'cold-chain-engineering', phase: 'design', why: { en: 'Temperature specified end to end, including the handover points where it usually breaks.', ka: 'ტემპერატურა ბოლომდე გაწერილი, გადაცემის წერტილების ჩათვლით, სადაც ჯაჭვი ყველაზე ხშირად წყდება.' } },
      { slug: 'utilities-effluent-design', phase: 'design', scales: ['l'], why: { en: 'Refrigeration load at national scale is a power-supply question.', ka: 'ეროვნულ მასშტაბზე გაცივების დატვირთვა ენერგომომარაგების საკითხია.' } },
      { slug: 'cold-stores', phase: 'build', why: { en: 'Chilled and frozen rooms with monitoring you can produce as evidence.', ka: 'გაცივებული და გაყინული საწყობები მონიტორინგით, რომელიც მტკიცებულებაა.' } },
      { slug: 'refrigerated-transport', phase: 'build', why: { en: 'Vehicles matched to route length and drop size, not to a brochure.', ka: 'ტრანსპორტი მარშრუტისა და პარტიის ზომაზე მორგებული.' } },
      { slug: 'equipment-installation-commissioning', phase: 'build', why: { en: 'Commissioning and temperature validation before the first load moves.', ka: 'ამოქმედება და ტემპერატურის ვალიდაცია პირველ რეისამდე.' } },
      { slug: 'maintenance-contracts', phase: 'operate', why: { en: 'A refrigeration failure is a written-off load, not a repair bill.', ka: 'გაცივების მწყობრიდან გამოსვლა ჩამოწერილი ტვირთია, არა შეკეთების ხარჯი.' } },
      { slug: 'quality-lab-services', phase: 'operate', why: { en: 'Verification testing at delivery, which is what settles disputes.', ka: 'შემოწმება მიწოდებისას — სწორედ ეს წყვეტს დავებს.' } },
      { slug: 'national-distribution', phase: 'grow', why: { en: 'Routes, retail coverage and the reporting behind it.', ka: 'მარშრუტები, საცალო დაფარვა და შესაბამისი ანგარიშგება.' } },
      { slug: 'wholesale-dairy-catalog', phase: 'grow', why: { en: 'Product to fill the network with, from day one.', ka: 'პროდუქცია ქსელის შესავსებად პირველივე დღიდან.' } },
      { slug: 'equipment-leasing', phase: 'fund', why: { en: 'Vehicles and refrigeration lease well; they hold resale value.', ka: 'ტრანსპორტი და მაცივრები კარგად ლიზინგდება — ინარჩუნებს ღირებულებას.' } },
      { slug: 'project-finance-facilitation', phase: 'fund', scales: ['m', 'l'], why: { en: 'A network is financed as one project, not as a series of purchases.', ka: 'ქსელი ფინანსდება როგორც ერთი პროექტი, არა როგორც შესყიდვების სერია.' } },
    ],
  },

  /* --------------------------------------------------------------- brand */
  {
    id: 'dairy-brand',
    label: { en: 'A dairy brand or product', ka: 'რძის ბრენდი ან პროდუქტი' },
    summary: {
      en: 'Recipe, pack, compliance and the channel it sells through.',
      ka: 'რეცეპტი, შეფუთვა, შესაბამისობა და გასაღების არხი.',
    },
    scaleQuestion: { en: 'How far are you taking it?', ka: 'რამდენად შორს მიგყავთ?' },
    scales: [
      { id: 's', label: { en: 'One product, one channel', ka: 'ერთი პროდუქტი, ერთი არხი' }, note: { en: 'A pilot you can afford to be wrong about', ka: 'საპილოტე, სადაც შეცდომა არ ღირს ძვირი' } },
      { id: 'm', label: { en: 'A full line', ka: 'სრული ხაზი' }, note: { en: 'Several SKUs under one brand', ka: 'რამდენიმე პოზიცია ერთი ბრენდით' } },
      { id: 'l', label: { en: 'National launch', ka: 'ეროვნული გაშვება' }, note: { en: 'Retail listing and supporting volume', ka: 'საცალო ქსელი და შესაბამისი მოცულობა' } },
    ],
    starts: ['greenfield', 'expanding', 'entering'],
    rules: [
      { slug: 'market-entry-analysis', phase: 'decide', why: { en: 'Whether there is a gap on the shelf, and what it is priced at.', ka: 'არსებობს თუ არა ადგილი თაროზე და რა ფასად.' } },
      { slug: 'processing-plant-feasibility', phase: 'decide', starts: ['greenfield'], why: { en: 'Only if you intend to make it yourself rather than contract it out.', ka: 'მხოლოდ თუ თავად აწარმოებთ და არ გადააბარებთ კონტრაქტით.' } },
      { slug: 'new-product-development', phase: 'design', why: { en: 'Recipe, shelf life and a specification a plant can actually run.', ka: 'რეცეპტი, ვარგისიანობა და სპეციფიკაცია, რომელსაც საწარმო რეალურად აწარმოებს.' } },
      { slug: 'food-safety-compliance-review', phase: 'design', why: { en: 'Labelling and composition rules shape the recipe, so read them first.', ka: 'ეტიკეტისა და შემადგენლობის წესები რეცეპტს განსაზღვრავს — ჯერ ისინი წაიკითხეთ.' } },
      { slug: 'private-label-manufacturing', phase: 'build', why: { en: 'Production capacity without building a plant — the usual way a brand starts.', ka: 'საწარმოო სიმძლავრე ქარხნის აშენების გარეშე — ბრენდის ჩვეული დასაწყისი.' } },
      { slug: 'dairy-packaging-materials', phase: 'build', why: { en: 'Pack, film and label — where most of the brand actually lives.', ka: 'შეფუთვა, აპკი და ეტიკეტი — სადაც ბრენდი ნამდვილად ცხოვრობს.' } },
      { slug: 'packaging-lines', phase: 'build', scales: ['l'], starts: ['greenfield'], why: { en: 'At national volume, contract filling stops being the cheaper option.', ka: 'ეროვნულ მოცულობაზე კონტრაქტით შეფუთვა აღარ არის იაფი.' } },
      { slug: 'cultures-ingredients', phase: 'operate', why: { en: 'Consistent inputs, because consistency is the whole promise of a brand.', ka: 'სტაბილური ნედლეული — სტაბილურობა ბრენდის მთავარი დაპირებაა.' } },
      { slug: 'quality-lab-services', phase: 'operate', why: { en: 'Batch release testing, and the shelf-life evidence behind the date on the pack.', ka: 'პარტიის შემოწმება და ვარგისიანობის მტკიცებულება შეფუთვაზე მითითებული თარიღისთვის.' } },
      { slug: 'haccp-system-implementation', phase: 'operate', scales: ['m', 'l'], why: { en: 'Retail chains audit their suppliers; arrive with the system already running.', ka: 'საცალო ქსელები ამოწმებენ მომწოდებლებს — მიდით უკვე მოქმედი სისტემით.' } },
      { slug: 'brand-channel-development', phase: 'grow', why: { en: 'Positioning, pricing and the route to the shelf.', ka: 'პოზიციონირება, ფასწარმოქმნა და გზა თაროსკენ.' } },
      { slug: 'national-distribution', phase: 'grow', why: { en: 'Getting it onto shelves and keeping it there.', ka: 'თაროზე მოხვედრა და იქ დარჩენა.' } },
      { slug: 'wholesale-dairy-catalog', phase: 'grow', why: { en: 'Trade buyers, for volume that does not depend on retail listings.', ka: 'საბითუმო მყიდველები — მოცულობა, რომელიც საცალო ქსელზე არ არის დამოკიდებული.' } },
      { slug: 'project-finance-facilitation', phase: 'fund', scales: ['l'], why: { en: 'A national launch is funded before it earns.', ka: 'ეროვნული გაშვება ფინანსდება შემოსავლამდე.' } },
    ],
  },

  /* -------------------------------------------------------------- export */
  {
    id: 'export-programme',
    label: { en: 'Export from Georgia', ka: 'ექსპორტი საქართველოდან' },
    summary: {
      en: 'Certification, pack, cold chain and buyers in the destination market.',
      ka: 'სერტიფიცირება, შეფუთვა, ცივი ჯაჭვი და მყიდველები დანიშნულების ბაზარზე.',
    },
    scaleQuestion: { en: 'What volume are you planning?', ka: 'რა მოცულობას გეგმავთ?' },
    scales: [
      { id: 's', label: { en: 'First shipments', ka: 'პირველი გადაზიდვები' }, note: { en: 'Proving the route and the paperwork', ka: 'მარშრუტისა და დოკუმენტაციის გამოცდა' } },
      { id: 'm', label: { en: 'A regular programme', ka: 'რეგულარული პროგრამა' }, note: { en: 'Repeat orders on a schedule', ka: 'განმეორებადი შეკვეთები გრაფიკით' } },
      { id: 'l', label: { en: 'Multi-market', ka: 'რამდენიმე ბაზარი' }, note: { en: 'Several destinations, several certifications', ka: 'რამდენიმე მიმართულება და სერტიფიკატი' } },
    ],
    starts: ['entering', 'expanding'],
    rules: [
      { slug: 'market-entry-analysis', phase: 'decide', why: { en: 'Which market, at what price, against which incumbent.', ka: 'რომელი ბაზარი, რა ფასად და ვის წინააღმდეგ.' } },
      { slug: 'food-safety-compliance-review', phase: 'decide', why: { en: 'Destination-market requirements decide what you may ship at all.', ka: 'დანიშნულების ბაზრის მოთხოვნები განსაზღვრავს, რის გაგზავნა შეგიძლიათ.' } },
      { slug: 'new-product-development', phase: 'design', scales: ['m', 'l'], why: { en: 'Shelf life, format and labelling rebuilt for the destination, not translated for it.', ka: 'ვარგისიანობა, ფორმატი და ეტიკეტი ხელახლა აწყობილი, არა თარგმნილი.' } },
      { slug: 'dairy-packaging-materials', phase: 'build', why: { en: 'Export packs carry different claims, languages and barrier requirements.', ka: 'საექსპორტო შეფუთვას სხვა წარწერები, ენები და ბარიერული მოთხოვნები აქვს.' } },
      { slug: 'cold-stores', phase: 'build', scales: ['m', 'l'], why: { en: 'Consolidation storage before dispatch, at the temperature the certificate states.', ka: 'დაგროვების საწყობი გაგზავნამდე, სერტიფიკატით განსაზღვრულ ტემპერატურაზე.' } },
      { slug: 'haccp-system-implementation', phase: 'operate', why: { en: 'No serious importer buys from a plant without a documented system.', ka: 'სერიოზული იმპორტიორი არ იყიდის დოკუმენტირებული სისტემის გარეშე.' } },
      { slug: 'quality-lab-services', phase: 'operate', why: { en: 'Certificates of analysis travel with the consignment.', ka: 'ანალიზის სერტიფიკატი ტვირთს თან ახლავს.' } },
      { slug: 'georgian-cheese-export', phase: 'grow', why: { en: 'Established export routes and buyers, rather than starting the relationship from scratch.', ka: 'დამკვიდრებული საექსპორტო მარშრუტები და მყიდველები, ნულიდან დაწყების ნაცვლად.' } },
      { slug: 'wholesale-dairy-catalog', phase: 'grow', why: { en: 'A catalogue an overseas buyer can order from.', ka: 'კატალოგი, საიდანაც უცხოელი მყიდველი შეუკვეთავს.' } },
      { slug: 'industry-directory', phase: 'grow', why: { en: 'Verified Georgian producers and certifications — what a buyer checks you against.', ka: 'დადასტურებული ქართველი მწარმოებლები და სერტიფიკატები — რითაც მყიდველი გამოწმებთ.' } },
      { slug: 'project-finance-facilitation', phase: 'fund', scales: ['l'], why: { en: 'Working capital, because export terms are paid late.', ka: 'საბრუნავი კაპიტალი — საექსპორტო ანგარიშსწორება გვიან ხდება.' } },
    ],
  },
];

export const getBuild = (id: string | null | undefined) =>
  PLAN_BUILDS.find((b) => b.id === id);

export interface PlanRow {
  offering: Offering;
  why: I18n;
}

export interface AssembledPhase {
  phase: PlanPhase;
  rows: PlanRow[];
}

/**
 * Resolve a configuration into the bundle.
 *
 * Rules that name a slug no longer in the portfolio are dropped rather than
 * rendered as a broken row — the taxonomy is expected to grow and be edited
 * under this file, and a retired offering should quietly leave the plans.
 */
export function assemblePlan(
  build: PlanBuild,
  scale: PlanScaleId,
  start: PlanStartId,
): AssembledPhase[] {
  const applicable = build.rules.filter(
    (r) => (!r.scales || r.scales.includes(scale)) && (!r.starts || r.starts.includes(start)),
  );

  return PLAN_PHASES.map((phase) => ({
    phase,
    rows: applicable
      .filter((r) => r.phase === phase.id)
      .map((r) => {
        const offering = OFFERINGS.find((o) => o.slug === r.slug);
        return offering ? { offering, why: r.why } : null;
      })
      .filter((x): x is PlanRow => x !== null),
  })).filter((p) => p.rows.length > 0);
}
