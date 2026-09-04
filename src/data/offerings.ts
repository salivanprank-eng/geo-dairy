import type { Offering } from '@/lib/types';

/**
 * Portfolio seed data (P03 cards → P04–P08 offering pages).
 * Deliberately data-driven: the brief requires hundreds of offerings to be
 * addable through filters and reusable templates without touching navigation (§19).
 * These ~40 entries exist to prove the filtering and card system at design stage.
 */

export const OFFERINGS: Offering[] = [
  /* ------------------------------------------------------------ SERVICE / ADVISORY */
  {
    slug: 'dairy-farm-feasibility-study', direction: 'service', sub: 'advisory', featured: true,
    title: { en: 'Dairy farm feasibility study', ka: 'რძის ფერმის შესაძლებლობის კვლევა' },
    summary: { en: 'Herd size, land, feed base, capital requirement and milk-price sensitivity modelled before you commit.', ka: 'ნახირის ზომა, მიწა, საკვები ბაზა, კაპიტალის საჭიროება და რძის ფასის მგრძნობელობა — ჩადებამდე.' },
    stages: ['upstream'], domains: ['herd', 'finance', 'land'], audiences: ['farmer', 'investor'],
  },
  {
    slug: 'processing-plant-feasibility', direction: 'service', sub: 'advisory', featured: true,
    title: { en: 'Processing plant feasibility', ka: 'გადამამუშავებელი საწარმოს შესაძლებლობის კვლევა' },
    summary: { en: 'Product mix, throughput, raw-milk catchment, capex and payback for a new or expanded plant.', ka: 'პროდუქციის მიქსი, გამტარუნარიანობა, ნედლი რძის ზონა, კაპიტალური ხარჯი და უკუგება.' },
    stages: ['midstream'], domains: ['processing', 'finance'], audiences: ['processor', 'investor'],
  },
  {
    slug: 'farm-performance-audit', direction: 'service', sub: 'advisory',
    title: { en: 'Farm performance audit', ka: 'ფერმის ეფექტიანობის აუდიტი' },
    summary: { en: 'Yield, fertility, feed conversion, milk quality and cost per litre benchmarked against achievable targets.', ka: 'მოსავლიანობა, ნაყოფიერება, საკვების კონვერსია, რძის ხარისხი და ლიტრზე ხარჯი — მიღწევად სამიზნეებთან შედარებით.' },
    stages: ['upstream'], domains: ['herd', 'feed', 'quality'], audiences: ['farmer'],
  },
  {
    slug: 'market-entry-analysis', direction: 'service', sub: 'advisory',
    title: { en: 'Market entry analysis', ka: 'ბაზარზე შესვლის ანალიზი' },
    summary: { en: 'For international companies entering Georgia, and Georgian producers entering export markets.', ka: 'საერთაშორისო კომპანიებისთვის საქართველოში და ქართველი მწარმოებლებისთვის საექსპორტო ბაზრებზე.' },
    stages: ['downstream', 'cross-chain'], domains: ['market', 'trade'], audiences: ['international', 'processor'],
  },
  {
    slug: 'food-safety-compliance-review', direction: 'service', sub: 'advisory',
    title: { en: 'Food safety & compliance review', ka: 'სურსათის უვნებლობისა და შესაბამისობის მიმოხილვა' },
    summary: { en: 'HACCP, traceability and regulatory readiness assessed against Georgian and EU expectations.', ka: 'HACCP, მიკვლევადობა და მარეგულირებელი მზაობა ქართული და ევროპული მოთხოვნების მიხედვით.' },
    stages: ['midstream'], domains: ['quality', 'regulation'], audiences: ['processor'],
  },

  /* --------------------------------------------------------- SERVICE / ENGINEERING */
  {
    slug: 'dairy-farm-design', direction: 'service', sub: 'engineering', featured: true,
    title: { en: 'Dairy farm design', ka: 'რძის ფერმის დაპროექტება' },
    summary: { en: 'Barn layout, cow flow, milking parlour, ventilation, manure handling and utilities — buildable drawings.', ka: 'სადგომის განლაგება, ცხოველთა ნაკადი, საწველი დარბაზი, ვენტილაცია, ნაკელის მართვა და კომუნიკაციები.' },
    stages: ['upstream'], domains: ['facility', 'milking', 'ventilation'], audiences: ['farmer', 'investor'],
  },
  {
    slug: 'process-line-design', direction: 'service', sub: 'engineering', featured: true,
    title: { en: 'Process line design', ka: 'ტექნოლოგიური ხაზის დაპროექტება' },
    summary: { en: 'Pasteurisation, separation, fermentation, cheese and packaging lines specified to product and capacity.', ka: 'პასტერიზაცია, სეპარაცია, დუღილი, ყველისა და შეფუთვის ხაზები პროდუქტისა და სიმძლავრის მიხედვით.' },
    stages: ['midstream'], domains: ['processing', 'packaging'], audiences: ['processor'],
  },
  {
    slug: 'cold-chain-engineering', direction: 'service', sub: 'engineering',
    title: { en: 'Cold chain engineering', ka: 'ცივი ჯაჭვის ინჟინერია' },
    summary: { en: 'Milk cooling, cold stores, refrigerated transport and unbroken temperature control to the shelf.', ka: 'რძის გაცივება, სამაცივრე საწყობები, რეფრიჟერატორული ტრანსპორტი და უწყვეტი ტემპერატურული კონტროლი.' },
    stages: ['upstream', 'midstream', 'downstream'], domains: ['cold-chain', 'logistics'], audiences: ['processor', 'buyer'],
  },
  {
    slug: 'utilities-effluent-design', direction: 'service', sub: 'engineering',
    title: { en: 'Utilities & effluent design', ka: 'კომუნიკაციებისა და ნარჩენების დაპროექტება' },
    summary: { en: 'Water, steam, power, CIP and wastewater treatment sized for the plant that will actually run.', ka: 'წყალი, ორთქლი, ენერგია, CIP და ჩამდინარე წყლების გაწმენდა რეალური საწარმოს ზომაზე.' },
    stages: ['midstream'], domains: ['utilities', 'environment'], audiences: ['processor'],
  },

  /* ----------------------------------------------------- SERVICE / IMPLEMENTATION */
  {
    slug: 'turnkey-farm-construction', direction: 'service', sub: 'implementation', featured: true,
    title: { en: 'Turnkey farm construction', ka: 'ფერმის მშენებლობა გასაღების ჩაბარებით' },
    summary: { en: 'From site works to stocked barn — coordinated contractors, equipment installation and handover.', ka: 'სამშენებლო სამუშაოებიდან დასახლებულ სადგომამდე — კოორდინირებული კონტრაქტორები, მონტაჟი და გადაცემა.' },
    stages: ['upstream'], domains: ['facility', 'project-management'], audiences: ['farmer', 'investor'],
  },
  {
    slug: 'equipment-installation-commissioning', direction: 'service', sub: 'implementation',
    title: { en: 'Installation & commissioning', ka: 'მონტაჟი და ამოქმედება' },
    summary: { en: 'Mechanical and electrical installation, validation runs, operator training and documented handover.', ka: 'მექანიკური და ელექტრო მონტაჟი, სავალიდაციო გაშვებები, ოპერატორთა ტრენინგი და დოკუმენტირებული გადაცემა.' },
    stages: ['upstream', 'midstream'], domains: ['equipment', 'training'], audiences: ['processor', 'farmer'],
  },
  {
    slug: 'haccp-system-implementation', direction: 'service', sub: 'implementation',
    title: { en: 'HACCP system implementation', ka: 'HACCP სისტემის დანერგვა' },
    summary: { en: 'Documented food-safety system built, staff trained, and carried through to certification audit.', ka: 'დოკუმენტირებული სისტემა, პერსონალის ტრენინგი და სერტიფიცირების აუდიტამდე მიყვანა.' },
    stages: ['midstream'], domains: ['quality', 'regulation'], audiences: ['processor'],
  },

  /* --------------------------------------------------------- SERVICE / OPERATION */
  {
    slug: 'managed-farm-operation', direction: 'service', sub: 'operation', featured: true,
    title: { en: 'Managed farm operation', ka: 'ფერმის მართული ოპერირება' },
    summary: { en: 'GEO Dairy runs the farm against agreed production, quality and cost targets on your behalf.', ka: 'GEO Dairy მართავს ფერმას შეთანხმებული წარმოების, ხარისხისა და ხარჯის სამიზნეებით.' },
    stages: ['upstream'], domains: ['herd', 'operations'], audiences: ['investor', 'farmer'],
  },
  {
    slug: 'herd-health-programme', direction: 'service', sub: 'operation',
    title: { en: 'Herd health programme', ka: 'ნახირის ჯანმრთელობის პროგრამა' },
    summary: { en: 'Scheduled veterinary care, reproduction management, mastitis control and health record-keeping.', ka: 'გეგმიური ვეტერინარული მომსახურება, რეპროდუქციის მართვა, მასტიტის კონტროლი და ჩანაწერები.' },
    stages: ['upstream'], domains: ['veterinary', 'herd'], audiences: ['farmer'],
  },
  {
    slug: 'maintenance-contracts', direction: 'service', sub: 'operation',
    title: { en: 'Maintenance contracts', ka: 'ტექნიკური მომსახურების კონტრაქტები' },
    summary: { en: 'Planned servicing, spare-part supply and response times for milking, cooling and processing equipment.', ka: 'დაგეგმილი მომსახურება, სათადარიგო ნაწილები და რეაგირების ვადები აღჭურვილობისთვის.' },
    stages: ['upstream', 'midstream'], domains: ['equipment', 'operations'], audiences: ['farmer', 'processor'],
  },
  {
    slug: 'quality-lab-services', direction: 'service', sub: 'operation',
    title: { en: 'Quality & laboratory services', ka: 'ხარისხისა და ლაბორატორიული მომსახურება' },
    summary: { en: 'Routine milk and product testing, payment-by-quality schemes and independent verification.', ka: 'რძისა და პროდუქციის რუტინული ტესტირება, ხარისხზე დაფუძნებული ანგარიშსწორება და დამოუკიდებელი ვერიფიკაცია.' },
    stages: ['upstream', 'midstream'], domains: ['quality', 'laboratory'], audiences: ['farmer', 'processor'],
  },

  /* ------------------------------------------------------- SERVICE / DEVELOPMENT */
  {
    slug: 'new-product-development', direction: 'service', sub: 'development', featured: true,
    title: { en: 'New product development', ka: 'ახალი პროდუქტის შემუშავება' },
    summary: { en: 'Recipe, trial batch, shelf-life, packaging and launch plan for a dairy product that has to sell.', ka: 'რეცეპტი, საცდელი პარტია, ვარგისიანობა, შეფუთვა და გაშვების გეგმა.' },
    stages: ['midstream'], domains: ['product', 'processing'], audiences: ['processor'],
  },
  {
    slug: 'capacity-expansion', direction: 'service', sub: 'development',
    title: { en: 'Capacity expansion', ka: 'სიმძლავრის გაფართოება' },
    summary: { en: 'Debottlenecking and staged expansion of an existing farm or plant without stopping production.', ka: 'არსებული ფერმის ან საწარმოს ეტაპობრივი გაფართოება წარმოების შეჩერების გარეშე.' },
    stages: ['upstream', 'midstream'], domains: ['processing', 'facility'], audiences: ['processor', 'farmer'],
  },
  {
    slug: 'brand-channel-development', direction: 'service', sub: 'development',
    title: { en: 'Brand & channel development', ka: 'ბრენდისა და არხის განვითარება' },
    summary: { en: 'Positioning, packaging, pricing and the route to retail, HoReCa or export shelves.', ka: 'პოზიციონირება, შეფუთვა, ფასწარმოქმნა და გზა საცალო, HoReCa ან საექსპორტო თაროებამდე.' },
    stages: ['downstream'], domains: ['market', 'product'], audiences: ['processor', 'buyer'],
  },

  /* ------------------------------------------------------ SUPPLY / INFRASTRUCTURE */
  {
    slug: 'modular-milking-parlours', direction: 'supply', sub: 'infrastructure', featured: true,
    title: { en: 'Milking parlours', ka: 'საწველი დარბაზები' },
    summary: { en: 'Herringbone, parallel and rotary parlours sized from 20 to 1,200 cows, delivered and installed.', ka: 'ჰერინგბოუნი, პარალელური და როტარული დარბაზები 20-დან 1200 ძროხამდე.' },
    stages: ['upstream'], domains: ['milking', 'facility'], audiences: ['farmer'],
  },
  {
    slug: 'barns-livestock-structures', direction: 'supply', sub: 'infrastructure',
    title: { en: 'Barns & livestock structures', ka: 'სადგომები და ცხოველთა ნაგებობები' },
    summary: { en: 'Free-stall and loose-housing barns, calf housing, feed alleys and ventilation systems.', ka: 'თავისუფალი და ბოქსური სადგომები, ხბოს სადგომები, საკვები დერეფნები და ვენტილაცია.' },
    stages: ['upstream'], domains: ['facility', 'ventilation'], audiences: ['farmer'],
  },
  {
    slug: 'cold-stores', direction: 'supply', sub: 'infrastructure',
    title: { en: 'Cold stores', ka: 'სამაცივრე საწყობები' },
    summary: { en: 'Chilled and frozen storage rooms with monitoring, from farm tank room to distribution hub.', ka: 'გაცივებული და გაყინული საწყობები მონიტორინგით — ფერმიდან სადისტრიბუციო ჰაბამდე.' },
    stages: ['midstream', 'downstream'], domains: ['cold-chain', 'facility'], audiences: ['processor', 'buyer'],
  },

  /* ----------------------------------------------------------- SUPPLY / EQUIPMENT */
  {
    slug: 'milking-systems', direction: 'supply', sub: 'equipment', featured: true,
    title: { en: 'Milking systems', ka: 'საწველი სისტემები' },
    summary: { en: 'Pipeline, parlour and robotic milking with pulsation, cleaning and herd-management integration.', ka: 'მილსადენური, დარბაზული და რობოტული წველა პულსაციით, რეცხვითა და ნახირის მართვის ინტეგრაციით.' },
    stages: ['upstream'], domains: ['milking', 'automation'], audiences: ['farmer'],
  },
  {
    slug: 'milk-cooling-tanks', direction: 'supply', sub: 'equipment', featured: true,
    title: { en: 'Milk cooling tanks', ka: 'რძის გამაცივებელი ავზები' },
    summary: { en: 'Direct-expansion and ice-bank tanks from 300 to 30,000 litres with automatic cleaning.', ka: 'პირდაპირი გაფართოებისა და ყინულის ბანკის ავზები 300-დან 30 000 ლიტრამდე.' },
    stages: ['upstream'], domains: ['cold-chain', 'milking'], audiences: ['farmer'],
  },
  {
    slug: 'pasteurisers-separators', direction: 'supply', sub: 'equipment',
    title: { en: 'Pasteurisers & separators', ka: 'პასტერიზატორები და სეპარატორები' },
    summary: { en: 'Plate and tubular pasteurisers, cream separators, homogenisers and CIP skids.', ka: 'ფირფიტოვანი და მილოვანი პასტერიზატორები, სეპარატორები, ჰომოგენიზატორები და CIP.' },
    stages: ['midstream'], domains: ['processing'], audiences: ['processor'],
  },
  {
    slug: 'cheese-production-equipment', direction: 'supply', sub: 'equipment',
    title: { en: 'Cheese production equipment', ka: 'ყველის წარმოების აღჭურვილობა' },
    summary: { en: 'Vats, presses, brining systems and ripening rooms for Georgian and international cheese types.', ka: 'ვანები, პრესები, დამარილების სისტემები და მომწიფების ოთახები ქართული და საერთაშორისო ყველისთვის.' },
    stages: ['midstream'], domains: ['processing', 'product'], audiences: ['processor'],
  },
  {
    slug: 'packaging-lines', direction: 'supply', sub: 'equipment',
    title: { en: 'Filling & packaging lines', ka: 'ჩამოსხმისა და შეფუთვის ხაზები' },
    summary: { en: 'Bottle, pouch, cup and block packaging with date coding and end-of-line handling.', ka: 'ბოთლის, პაკეტის, ჭიქისა და ბლოკის შეფუთვა კოდირებითა და ხაზის ბოლოს დამუშავებით.' },
    stages: ['midstream'], domains: ['packaging'], audiences: ['processor'],
  },
  {
    slug: 'laboratory-instruments', direction: 'supply', sub: 'equipment',
    title: { en: 'Laboratory instruments', ka: 'ლაბორატორიული ხელსაწყოები' },
    summary: { en: 'Milk analysers, somatic cell counters, antibiotic tests and calibration support.', ka: 'რძის ანალიზატორები, სომატური უჯრედების მთვლელები, ანტიბიოტიკის ტესტები და კალიბრაცია.' },
    stages: ['upstream', 'midstream'], domains: ['laboratory', 'quality'], audiences: ['farmer', 'processor'],
  },
  {
    slug: 'refrigerated-transport', direction: 'supply', sub: 'equipment',
    title: { en: 'Refrigerated transport', ka: 'რეფრიჟერატორული ტრანსპორტი' },
    summary: { en: 'Milk tankers and refrigerated vehicles with temperature logging for compliant collection and delivery.', ka: 'რძის ავტოცისტერნები და რეფრიჟერატორები ტემპერატურის ჩაწერით.' },
    stages: ['downstream'], domains: ['cold-chain', 'logistics'], audiences: ['processor', 'buyer'],
  },

  /* -------------------------------------------------------------- SUPPLY / INPUTS */
  {
    slug: 'compound-feed', direction: 'supply', sub: 'inputs', featured: true,
    title: { en: 'Compound feed & forage', ka: 'კომბინირებული საკვები და ფურაჟი' },
    summary: { en: 'Ration-matched concentrates, minerals and forage supply with feeding-plan support.', ka: 'რაციონზე მორგებული კონცენტრატები, მინერალები და ფურაჟი კვების გეგმის მხარდაჭერით.' },
    stages: ['upstream'], domains: ['feed'], audiences: ['farmer'],
  },
  {
    slug: 'genetics-breeding-stock', direction: 'supply', sub: 'inputs', featured: true,
    title: { en: 'Genetics & breeding stock', ka: 'გენეტიკა და სანაშენე პირუტყვი' },
    summary: { en: 'Semen, embryos and imported heifers selected for Georgian conditions and target milk profile.', ka: 'თესლი, ემბრიონები და იმპორტირებული ფურ-ხბოები ქართულ პირობებზე შერჩეული.' },
    stages: ['upstream'], domains: ['genetics', 'herd'], audiences: ['farmer', 'investor'],
  },
  {
    slug: 'cultures-ingredients', direction: 'supply', sub: 'inputs',
    title: { en: 'Cultures & ingredients', ka: 'დედოები და ინგრედიენტები' },
    summary: { en: 'Starter cultures, rennet, stabilisers and functional ingredients for dairy manufacturing.', ka: 'სასტარტო დედოები, კვეთი, სტაბილიზატორები და ფუნქციური ინგრედიენტები.' },
    stages: ['midstream'], domains: ['processing', 'product'], audiences: ['processor'],
  },
  {
    slug: 'hygiene-veterinary-products', direction: 'supply', sub: 'inputs',
    title: { en: 'Hygiene & veterinary products', ka: 'ჰიგიენისა და ვეტერინარული პროდუქტები' },
    summary: { en: 'Teat care, CIP chemistry, disinfectants and veterinary consumables.', ka: 'ცურის მოვლა, CIP ქიმია, სადეზინფექციო საშუალებები და ვეტერინარული სახარჯი მასალა.' },
    stages: ['upstream', 'midstream'], domains: ['veterinary', 'quality'], audiences: ['farmer', 'processor'],
  },
  {
    slug: 'dairy-packaging-materials', direction: 'supply', sub: 'inputs',
    title: { en: 'Packaging materials', ka: 'შესაფუთი მასალები' },
    summary: { en: 'Film, bottles, cups, closures and printed packaging suited to dairy shelf life and cold chain.', ka: 'ფირი, ბოთლები, ჭიქები, თავსახურები და ბეჭდური შეფუთვა.' },
    stages: ['midstream'], domains: ['packaging'], audiences: ['processor'],
  },

  /* ------------------------------------------------------------- SUPPLY / CAPITAL */
  {
    slug: 'equipment-leasing', direction: 'supply', sub: 'capital',
    title: { en: 'Equipment leasing', ka: 'აღჭურვილობის ლიზინგი' },
    summary: { en: 'Leasing structures for milking, cooling and processing equipment matched to cash-flow seasonality.', ka: 'ლიზინგის სტრუქტურები აღჭურვილობისთვის, ფულადი ნაკადის სეზონურობაზე მორგებული.' },
    stages: ['upstream', 'midstream'], domains: ['finance'], audiences: ['farmer', 'processor'],
  },
  {
    slug: 'project-finance-facilitation', direction: 'supply', sub: 'capital', featured: true,
    title: { en: 'Project finance facilitation', ka: 'პროექტის დაფინანსების ფასილიტაცია' },
    summary: { en: 'Bankable documentation, lender introductions and structuring for dairy capital projects.', ka: 'საბანკოდ ვარგისი დოკუმენტაცია, კრედიტორებთან დაკავშირება და სტრუქტურირება.' },
    stages: ['cross-chain'], domains: ['finance'], audiences: ['investor', 'processor', 'farmer'],
  },

  /* ----------------------------------------------------------- SUPPLY / WORKFORCE */
  {
    slug: 'dairy-technologists', direction: 'supply', sub: 'workforce',
    title: { en: 'Dairy technologists', ka: 'რძის ტექნოლოგები' },
    summary: { en: 'Qualified production technologists placed permanently or on assignment.', ka: 'კვალიფიციური ტექნოლოგები მუდმივ ან დროებით პოზიციაზე.' },
    stages: ['midstream'], domains: ['workforce', 'processing'], audiences: ['processor'],
  },
  {
    slug: 'farm-operators-herd-managers', direction: 'supply', sub: 'workforce',
    title: { en: 'Farm operators & herd managers', ka: 'ფერმის ოპერატორები და ნახირის მენეჯერები' },
    summary: { en: 'Trained milking, feeding and herd-management staff, with induction and ongoing supervision.', ka: 'გაწვრთნილი მწველავი, მკვებავი და ნახირის მართვის პერსონალი.' },
    stages: ['upstream'], domains: ['workforce', 'herd'], audiences: ['farmer'],
  },

  /* ------------------------------------------------------------------------ TRADE */
  {
    slug: 'georgian-cheese-export', direction: 'trade', sub: 'international', featured: true,
    title: { en: 'Georgian cheese export programme', ka: 'ქართული ყველის საექსპორტო პროგრამა' },
    summary: { en: 'Sulguni, Imeruli and matured Georgian cheeses prepared, documented and shipped to export buyers.', ka: 'სულგუნი, იმერული და დავარგებული ქართული ყველი მომზადებული და გაგზავნილი საექსპორტო მყიდველებისთვის.' },
    stages: ['downstream'], domains: ['product', 'trade'], audiences: ['buyer', 'international'],
  },
  {
    slug: 'wholesale-dairy-catalog', direction: 'trade', sub: 'wholesale', featured: true,
    title: { en: 'Wholesale dairy catalog', ka: 'საბითუმო რძის კატალოგი' },
    summary: { en: 'Milk, cheese, butter, cream and yoghurt in trade formats for retail chains, HoReCa and institutions.', ka: 'რძე, ყველი, კარაქი, ნაღები და იოგურტი სავაჭრო ფორმატებში.' },
    stages: ['downstream'], domains: ['product', 'trade'], audiences: ['buyer'],
  },
  {
    slug: 'national-distribution', direction: 'trade', sub: 'distribution',
    title: { en: 'National distribution', ka: 'ეროვნული დისტრიბუცია' },
    summary: { en: 'Cold-chain distribution across Georgian regions for own and represented dairy brands.', ka: 'ცივი ჯაჭვის დისტრიბუცია საქართველოს რეგიონებში საკუთარი და წარმოდგენილი ბრენდებისთვის.' },
    stages: ['downstream'], domains: ['logistics', 'cold-chain'], audiences: ['buyer', 'international'],
  },

  /* ------------------------------------------------------------------- PRODUCTION */
  {
    slug: 'geo-dairy-farms', direction: 'production', sub: 'upstream', featured: true,
    title: { en: 'GEO Dairy farms', ka: 'GEO Dairy ფერმები' },
    summary: { en: 'Owned and controlled dairy farming operations producing raw milk to a defined quality standard.', ka: 'საკუთარი და კონტროლირებადი ფერმები, რომლებიც აწარმოებენ ნედლ რძეს განსაზღვრული ხარისხით.' },
    stages: ['upstream'], domains: ['herd', 'milking'], audiences: ['buyer', 'investor'],
  },
  {
    slug: 'processing-facilities', direction: 'production', sub: 'midstream', featured: true,
    title: { en: 'Processing facilities', ka: 'გადამამუშავებელი ობიექტები' },
    summary: { en: 'GEO Dairy manufacturing capacity — capacity, technology, certifications and product output.', ka: 'GEO Dairy-ის საწარმოო სიმძლავრე — ტექნოლოგია, სერტიფიკატები და პროდუქციის გამოშვება.' },
    stages: ['midstream'], domains: ['processing'], audiences: ['buyer', 'investor'],
  },
  {
    slug: 'private-label-manufacturing', direction: 'production', sub: 'contract',
    title: { en: 'Private label manufacturing', ka: 'კერძო ბრენდის წარმოება' },
    summary: { en: 'Your brand, produced on GEO Dairy lines to your specification and quality regime.', ka: 'თქვენი ბრენდი, წარმოებული GEO Dairy-ის ხაზებზე თქვენი სპეციფიკაციით.' },
    stages: ['midstream'], domains: ['processing', 'product'], audiences: ['buyer', 'processor'],
  },

  /* -------------------------------------------------------------------- ECOSYSTEM */
  {
    slug: 'dairy-academy', direction: 'ecosystem', sub: 'knowledge', featured: true,
    title: { en: 'Dairy Academy', ka: 'Dairy Academy' },
    summary: { en: 'Practical training for farm staff, technologists, veterinarians and dairy managers.', ka: 'პრაქტიკული ტრენინგი ფერმის პერსონალის, ტექნოლოგების, ვეტერინარებისა და მენეჯერებისთვის.' },
    stages: ['cross-chain'], domains: ['training'], audiences: ['farmer', 'processor', 'professional'],
  },
  {
    slug: 'dairy-market', direction: 'ecosystem', sub: 'marketplace', featured: true,
    title: { en: 'Dairy Market', ka: 'Dairy Market' },
    summary: { en: 'Buyer-seller matching platform where GEO Dairy facilitates rather than trades as principal.', ka: 'მყიდველ-გამყიდველის დაკავშირების პლატფორმა, სადაც GEO Dairy ფასილიტატორია.' },
    stages: ['cross-chain'], domains: ['market'], audiences: ['buyer', 'supplier', 'processor'],
  },
  {
    slug: 'industry-directory', direction: 'ecosystem', sub: 'reference',
    title: { en: 'Industry directory', ka: 'ინდუსტრიის ცნობარი' },
    summary: { en: 'Farms, processors, suppliers and service providers of the Georgian dairy sector, structured and searchable.', ka: 'ქართული რძის სექტორის ფერმები, გადამამუშავებლები, მომმარაგებლები და სერვისპროვაიდერები.' },
    stages: ['cross-chain'], domains: ['reference'], audiences: ['buyer', 'supplier', 'institution'],
  },
  {
    slug: 'farm-visits', direction: 'ecosystem', sub: 'experience',
    title: { en: 'Farm & plant visits', ka: 'ფერმისა და საწარმოს ვიზიტები' },
    summary: { en: 'Structured visits for buyers, students, investors and delegations — dairy seen rather than described.', ka: 'სტრუქტურირებული ვიზიტები მყიდველების, სტუდენტების, ინვესტორებისა და დელეგაციებისთვის.' },
    stages: ['upstream', 'midstream'], domains: ['training'], audiences: ['buyer', 'institution', 'investor'],
  },
];

export const offeringsFor = (direction: string, sub: string) =>
  OFFERINGS.filter((o) => o.direction === direction && o.sub === sub);

export const offeringsForDirection = (direction: string) =>
  OFFERINGS.filter((o) => o.direction === direction);

export const featuredOfferings = () => OFFERINGS.filter((o) => o.featured);

export const getOffering = (direction: string, sub: string, slug: string) =>
  OFFERINGS.find((o) => o.direction === direction && o.sub === sub && o.slug === slug);

/** Unique technical domains present under a sub-direction, for filter chips (§12.2). */
export const domainsFor = (direction: string, sub: string) =>
  [...new Set(offeringsFor(direction, sub).flatMap((o) => o.domains))].sort();
