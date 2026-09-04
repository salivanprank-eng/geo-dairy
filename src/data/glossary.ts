import type { I18n } from '@/lib/types';

/**
 * CONTROLLED TERMINOLOGY — brief §12.3.
 *
 * The brief asks for a terminology dictionary as a compliance item: one agreed
 * translation per term, so KA and EN do not drift and so "მიწოდება" never means
 * two different things on two pages.
 *
 * Treating it only as a compliance item wastes it. An international buyer
 * reading about Georgian dairy, or a farmer reading a specification for the
 * first time, is doing vocabulary work either way — doing it on our page rather
 * than in a search tab is worth more than the glossary costs to maintain.
 *
 * So each entry carries a definition written to be read in passing: one or two
 * sentences, no circular definitions, and where the term has a commercial
 * consequence, the consequence is the sentence. `match` holds the surface forms
 * that get marked up in running prose — Georgian is inflected and the matcher is
 * literal, so the KA forms listed are the base forms that actually appear in the
 * copy, not every possible ending.
 */

export type GlossaryCategory = 'chain' | 'farm' | 'processing' | 'quality' | 'commercial';

export interface GlossaryTerm {
  id: string;
  term: I18n;
  /** Expanded form or common alternative, shown under the headword. */
  aka?: I18n;
  definition: I18n;
  category: GlossaryCategory;
  /** Surface forms marked up in prose. Longest match wins; first hit only. */
  match: { en: string[]; ka: string[] };
}

export const GLOSSARY_CATEGORIES: { id: GlossaryCategory; label: I18n }[] = [
  { id: 'chain', label: { en: 'Value chain', ka: 'ღირებულებათა ჯაჭვი' } },
  { id: 'farm', label: { en: 'Farm', ka: 'ფერმა' } },
  { id: 'processing', label: { en: 'Processing', ka: 'გადამუშავება' } },
  { id: 'quality', label: { en: 'Quality & compliance', ka: 'ხარისხი და შესაბამისობა' } },
  { id: 'commercial', label: { en: 'Commercial', ka: 'კომერცია' } },
];

export const GLOSSARY: GlossaryTerm[] = [
  /* ------------------------------------------------------------- value chain */
  {
    id: 'upstream',
    category: 'chain',
    term: { en: 'Upstream', ka: 'ზედა რგოლი' },
    definition: {
      en: 'Everything up to the point milk leaves the farm: breeding, feed, housing, milking and on-farm cooling.',
      ka: 'ყველაფერი იმ მომენტამდე, სანამ რძე ფერმას დატოვებს: მოშენება, კვება, სადგომი, წველა და ადგილზე გაცივება.',
    },
    match: { en: ['upstream'], ka: ['ზედა რგოლი'] },
  },
  {
    id: 'midstream',
    category: 'chain',
    term: { en: 'Midstream', ka: 'შუა რგოლი' },
    definition: {
      en: 'Collection, transport and processing — the stage where raw milk becomes a product with a shelf life.',
      ka: 'შეგროვება, ტრანსპორტირება და გადამუშავება — ეტაპი, სადაც ნედლი რძე ვარგისიანობის ვადის მქონე პროდუქტად იქცევა.',
    },
    match: { en: ['midstream'], ka: ['შუა რგოლი'] },
  },
  {
    id: 'downstream',
    category: 'chain',
    term: { en: 'Downstream', ka: 'ქვედა რგოლი' },
    definition: {
      en: 'Distribution, retail, food service and export — everything between the finished product and the person who eats it.',
      ka: 'დისტრიბუცია, საცალო ვაჭრობა, კვების სერვისი და ექსპორტი — ყველაფერი მზა პროდუქტსა და მომხმარებელს შორის.',
    },
    match: { en: ['downstream'], ka: ['ქვედა რგოლი'] },
  },
  {
    id: 'cross-chain',
    category: 'chain',
    term: { en: 'Cross-chain', ka: 'ჯვარედინი' },
    definition: {
      en: 'Applies at every stage rather than sitting at one — finance, knowledge, data and standards. It is a tag on an offering, not a fourth level of the chain.',
      ka: 'ეხება ყველა ეტაპს და არა ერთს — დაფინანსება, ცოდნა, მონაცემები და სტანდარტები. ეს არის ნიშნული, არა ჯაჭვის მეოთხე დონე.',
    },
    match: { en: ['cross-chain'], ka: ['ჯვარედინი'] },
  },
  {
    id: 'cold-chain',
    category: 'chain',
    term: { en: 'Cold chain', ka: 'ცივი ჯაჭვი' },
    definition: {
      en: 'The unbroken run of controlled temperature from the farm tank to the shelf. It is only as good as its weakest handover — most failures happen during loading, not in storage.',
      ka: 'კონტროლირებადი ტემპერატურის უწყვეტი ჯაჭვი ფერმის ავზიდან თაროებამდე. ის იმდენად საიმედოა, რამდენადაც მისი ყველაზე სუსტი რგოლი — უმეტესი ჩავარდნა დატვირთვისას ხდება და არა შენახვისას.',
    },
    match: { en: ['cold chain', 'cold-chain'], ka: ['ცივი ჯაჭვი'] },
  },
  {
    id: 'traceability',
    category: 'chain',
    term: { en: 'Traceability', ka: 'მიკვლევადობა' },
    definition: {
      en: 'Being able to follow a batch back to the farms and forward to the buyers. It is what makes a recall a targeted withdrawal instead of a total one.',
      ka: 'პარტიის უკან — ფერმებამდე და წინ — მყიდველებამდე მიკვლევის შესაძლებლობა. სწორედ ეს აქცევს გამოთხოვას მიზნობრივად და არა ტოტალურად.',
    },
    match: { en: ['traceability', 'traceable'], ka: ['მიკვლევადობა'] },
  },

  /* -------------------------------------------------------------------- farm */
  {
    id: 'milking-parlour',
    category: 'farm',
    term: { en: 'Milking parlour', ka: 'საწველი დარბაზი' },
    definition: {
      en: 'The room and equipment where the herd is milked. Its layout sets how many cows one person can milk per hour, which is the single largest labour decision on a dairy farm.',
      ka: 'ოთახი და აღჭურვილობა, სადაც ნახირი იწველება. მისი განლაგება განსაზღვრავს, რამდენ ძროხას მოწველის ერთი ადამიანი საათში — ფერმის ყველაზე მნიშვნელოვანი შრომითი გადაწყვეტილება.',
    },
    match: { en: ['milking parlour', 'milking parlours', 'parlour', 'parlours'], ka: ['საწველი დარბაზი'] },
  },
  {
    id: 'herringbone',
    category: 'farm',
    term: { en: 'Herringbone parlour', ka: 'ჰერინგბოუნი' },
    definition: {
      en: 'Cows stand at an angle in two facing rows, so the operator works a pit between them. The common choice from roughly 50 to 400 cows: cheap to build, simple to run.',
      ka: 'ძროხები დგანან დახრილად ორ მოპირდაპირე რიგში, ოპერატორი კი მათ შორის ორმოში მუშაობს. ჩვეული არჩევანი დაახლოებით 50-დან 400 ძროხამდე: იაფი ასაშენებელი და მარტივი სამართავი.',
    },
    match: { en: ['herringbone'], ka: ['ჰერინგბოუნი'] },
  },
  {
    id: 'rotary',
    category: 'farm',
    term: { en: 'Rotary parlour', ka: 'როტარული დარბაზი' },
    definition: {
      en: 'A turntable the cows step onto; they are attached once and milked as the platform rotates. High throughput per operator, and expensive enough that it only pays above several hundred cows.',
      ka: 'მბრუნავი პლატფორმა, რომელზეც ძროხა ადგება; აპარატი ერთხელ მიერთდება და წველა ბრუნვისას მიმდინარეობს. მაღალი წარმადობა ერთ ოპერატორზე და იმდენად ძვირი, რომ მხოლოდ რამდენიმე ასეული ძროხის შემდეგ ამართლებს.',
    },
    match: { en: ['rotary'], ka: ['როტარული'] },
  },
  {
    id: 'free-stall',
    category: 'farm',
    term: { en: 'Free-stall housing', ka: 'თავისუფალი სადგომი' },
    definition: {
      en: 'Loose housing where cows move freely and choose their own resting stall, rather than being tied in place. Better for udder health and for labour; needs more floor area per cow.',
      ka: 'თავისუფალი შენახვა, სადაც ძროხა თავად მოძრაობს და ირჩევს დასასვენებელ ბოქსს, ნაცვლად მიბმისა. უკეთესია ცურის ჯანმრთელობისა და შრომის თვალსაზრისით; მეტ ფართობს მოითხოვს.',
    },
    match: { en: ['free-stall', 'loose housing', 'loose-housing'], ka: ['თავისუფალი სადგომი'] },
  },
  {
    id: 'tmr',
    category: 'farm',
    term: { en: 'TMR', ka: 'TMR' },
    aka: { en: 'Total mixed ration', ka: 'სრული შერეული რაციონი' },
    definition: {
      en: 'Forage, grain, minerals and supplements mixed into one feed so every mouthful has the same composition. It stops cows sorting out the grain and leaving the fibre.',
      ka: 'უხეში საკვები, მარცვალი, მინერალები და დანამატები შერეული ერთ საკვებად, რომ ყოველი ულუფა ერთნაირი შემადგენლობის იყოს. ხელს უშლის ძროხას მარცვლის ამორჩევასა და ბოჭკოს დატოვებაში.',
    },
    match: { en: ['TMR', 'total mixed ration'], ka: ['სრული შერეული რაციონი'] },
  },
  {
    id: 'bulk-tank',
    category: 'farm',
    term: { en: 'Bulk milk cooling tank', ka: 'რძის გამაცივებელი ავზი' },
    definition: {
      en: 'The insulated on-farm tank that chills milk to about 4 °C within the collection window and holds it until the tanker arrives. Miss the window and the milk is downgraded or refused.',
      ka: 'ფერმის საიზოლაციო ავზი, რომელიც რძეს შეგროვების ფანჯარაში დაახლოებით 4 °C-მდე აცივებს და ინახავს ცისტერნის მოსვლამდე. ფანჯრის გაცდენა ნიშნავს რძის კლასის დაწევას ან უარყოფას.',
    },
    match: { en: ['cooling tank', 'cooling tanks', 'bulk tank'], ka: ['გამაცივებელი ავზი'] },
  },
  {
    id: 'genetics',
    category: 'farm',
    term: { en: 'Breeding stock', ka: 'სანაშენე პირუტყვი' },
    definition: {
      en: 'Animals, semen or embryos selected for the traits you want in the next generation — yield, fertility, udder conformation, longevity. A slow decision to reverse: you live with it for years.',
      ka: 'ცხოველები, სპერმა ან ემბრიონები, შერჩეული სასურველი ნიშნებით — მოსავლიანობა, ნაყოფიერება, ცურის აგებულება, სიცოცხლის ხანგრძლივობა. ძნელად შესაცვლელი გადაწყვეტილება: შედეგებთან წლების განმავლობაში იცხოვრებთ.',
    },
    match: { en: ['breeding stock', 'genetics'], ka: ['სანაშენე პირუტყვი', 'გენეტიკა'] },
  },
  {
    id: 'effluent',
    category: 'farm',
    term: { en: 'Effluent', ka: 'ნარჩენი წყლები' },
    definition: {
      en: 'Manure, wash water and dairy waste streams. It is a permitting question before it is an engineering one — the discharge consent often determines where a facility can be built at all.',
      ka: 'ნაკელი, სარეცხი წყალი და რძის ნარჩენები. ეს ჯერ ნებართვის და მერე საინჟინრო საკითხია — ჩაშვების ნებართვა ხშირად განსაზღვრავს, სად შეიძლება ობიექტის აშენება.',
    },
    match: { en: ['effluent'], ka: ['ნარჩენი წყლები'] },
  },

  /* -------------------------------------------------------------- processing */
  {
    id: 'raw-milk',
    category: 'processing',
    term: { en: 'Raw milk', ka: 'ნედლი რძე' },
    definition: {
      en: 'Milk as it leaves the animal — cooled, but not heat-treated. Everything a plant makes is priced back to what it pays for this.',
      ka: 'რძე ისეთი, როგორიც ცხოველისგან მიიღება — გაცივებული, მაგრამ თერმულად დაუმუშავებელი. საწარმოს ყველა პროდუქტის ფასი ბოლოს აქ ბრუნდება.',
    },
    match: { en: ['raw milk', 'raw-milk'], ka: ['ნედლი რძე'] },
  },
  {
    id: 'pasteurisation',
    category: 'processing',
    term: { en: 'Pasteurisation', ka: 'პასტერიზაცია' },
    definition: {
      en: 'A controlled heat treatment that kills pathogens while leaving the product recognisably milk. The time-and-temperature combination is a legal requirement, not a recipe choice.',
      ka: 'კონტროლირებადი თერმული დამუშავება, რომელიც კლავს პათოგენებს და პროდუქტს რძედვე ტოვებს. დროისა და ტემპერატურის კომბინაცია კანონით არის განსაზღვრული, არა რეცეპტით.',
    },
    match: { en: ['pasteurisation', 'pasteurization', 'pasteurised', 'pasteuriser', 'pasteurisers'], ka: ['პასტერიზაცია'] },
  },
  {
    id: 'separator',
    category: 'processing',
    term: { en: 'Separator', ka: 'სეპარატორი' },
    definition: {
      en: 'A centrifuge that splits milk into cream and skim, so fat can be standardised to whatever the product spec requires. Also removes some of the solid contamination as it goes.',
      ka: 'ცენტრიფუგა, რომელიც რძეს ნაღებად და მოხდილად ყოფს, რაც ცხიმის სტანდარტიზების საშუალებას იძლევა. ამავე დროს აშორებს მყარ დანაბინძურებას.',
    },
    match: { en: ['separator', 'separators'], ka: ['სეპარატორი'] },
  },
  {
    id: 'cip',
    category: 'processing',
    term: { en: 'CIP', ka: 'CIP' },
    aka: { en: 'Cleaning-in-place', ka: 'ადგილზე რეცხვა' },
    definition: {
      en: 'Cleaning the inside of tanks and pipework by circulating detergent through the closed system, without dismantling it. Retrofitting CIP into a line built without it is expensive, so it belongs in the first design.',
      ka: 'ავზებისა და მილების შიგნიდან რეცხვა დახურულ სისტემაში სარეცხი ხსნარის ცირკულაციით, დაშლის გარეშე. CIP-ის შემდგომი დამატება ძვირია, ამიტომ მას პირველივე პროექტში აქვს ადგილი.',
    },
    match: { en: ['CIP', 'cleaning-in-place'], ka: ['ადგილზე რეცხვა'] },
  },
  {
    id: 'culture',
    category: 'processing',
    term: { en: 'Starter culture', ka: 'დედო კულტურა' },
    definition: {
      en: 'The bacteria added to milk to acidify it and drive fermentation. Culture choice is most of what makes one yoghurt or cheese taste different from another made the same way.',
      ka: 'რძეში დამატებული ბაქტერიები, რომლებიც მას ამჟავებს და დუღილს იწვევს. სწორედ კულტურის არჩევა განსაზღვრავს, რატომ განსხვავდება ერთი იოგურტი ან ყველი მეორისგან.',
    },
    match: { en: ['starter culture', 'starter cultures', 'cultures'], ka: ['დედო კულტურა'] },
  },
  {
    id: 'rennet',
    category: 'processing',
    term: { en: 'Rennet', ka: 'კვეთი' },
    definition: {
      en: 'The enzyme that makes milk set into curd. Animal, microbial and fermentation-produced forms behave differently, and the choice affects both texture and which markets will accept the cheese.',
      ka: 'ფერმენტი, რომელიც რძეს კვეთს. ცხოველური, მიკრობული და ფერმენტაციით მიღებული ფორმები სხვადასხვაგვარად იქცევა და არჩევანი გავლენას ახდენს როგორც ტექსტურაზე, ისე იმაზე, რომელი ბაზარი მიიღებს ყველს.',
    },
    match: { en: ['rennet'], ka: ['კვეთი'] },
  },
  {
    id: 'brining',
    category: 'processing',
    term: { en: 'Brining', ka: 'დამარილება' },
    definition: {
      en: 'Holding fresh cheese in salt solution to season it, firm the rind and slow unwanted bacteria. For most Georgian cheeses this stage is the product, not a finishing touch.',
      ka: 'ახალი ყველის მარილწყალში დაყოვნება გემოს, ქერქის გამკვრივებისა და არასასურველი ბაქტერიების შეკავებისთვის. ქართული ყველების უმეტესობისთვის ეს ეტაპი თავად პროდუქტია და არა დამატება.',
    },
    match: { en: ['brining', 'brine'], ka: ['დამარილება'] },
  },
  {
    id: 'whey',
    category: 'processing',
    term: { en: 'Whey', ka: 'შრატი' },
    definition: {
      en: 'The liquid left after the curd is separated — roughly nine litres for every kilo of cheese. Treat it as a product and it earns; treat it as waste and it becomes an effluent problem.',
      ka: 'სითხე, რომელიც კვეთის გამოყოფის შემდეგ რჩება — დაახლოებით ცხრა ლიტრი ყოველ კილოგრამ ყველზე. თუ პროდუქტად მიიჩნევთ, შემოსავალს იძლევა; თუ ნარჩენად — ნარჩენი წყლების პრობლემად იქცევა.',
    },
    match: { en: ['whey'], ka: ['შრატი'] },
  },
  {
    id: 'commissioning',
    category: 'processing',
    term: { en: 'Commissioning', ka: 'ამოქმედება' },
    definition: {
      en: 'Bringing installed equipment into verified working order and proving it makes specification — not the day it is switched on, the day it is signed off.',
      ka: 'დამონტაჟებული აღჭურვილობის სამუშაო მდგომარეობაში მოყვანა და დადასტურება, რომ ის სპეციფიკაციას აკმაყოფილებს — არა ჩართვის, არამედ ჩაბარების დღე.',
    },
    match: { en: ['commissioning'], ka: ['ამოქმედება'] },
  },

  /* ------------------------------------------------------------------ quality */
  {
    id: 'haccp',
    category: 'quality',
    term: { en: 'HACCP', ka: 'HACCP' },
    aka: { en: 'Hazard Analysis and Critical Control Points', ka: 'რისკების ანალიზი და კრიტიკული საკონტროლო წერტილები' },
    definition: {
      en: 'A food-safety system that identifies where contamination can occur, sets a measurable limit at each of those points, and records that the limit was held. Every serious buyer and inspector asks to see it.',
      ka: 'უვნებლობის სისტემა, რომელიც ადგენს დაბინძურების შესაძლო წერტილებს, თითოეულზე ზღვარს განსაზღვრავს და აფიქსირებს მის დაცვას. ყველა სერიოზული მყიდველი და ინსპექტორი ითხოვს მას.',
    },
    match: { en: ['HACCP'], ka: ['HACCP'] },
  },
  {
    id: 'scc',
    category: 'quality',
    term: { en: 'Somatic cell count', ka: 'სომატური უჯრედების რაოდენობა' },
    aka: { en: 'SCC', ka: 'SCC' },
    definition: {
      en: 'The number of immune cells per millilitre of milk — in practice, a direct read on udder health. High counts cut the price paid, shorten shelf life and reduce cheese yield.',
      ka: 'იმუნური უჯრედების რაოდენობა რძის მილილიტრზე — პრაქტიკულად, ცურის ჯანმრთელობის პირდაპირი მაჩვენებელი. მაღალი მაჩვენებელი ამცირებს ფასს, ვარგისიანობის ვადას და ყველის გამოსავალს.',
    },
    match: { en: ['somatic cell count', 'somatic cell'], ka: ['სომატური უჯრედების'] },
  },
  {
    id: 'shelf-life',
    category: 'quality',
    term: { en: 'Shelf life', ka: 'ვარგისიანობის ვადა' },
    definition: {
      en: 'How long the product stays safe and to specification under stated storage conditions. It is a claim you must have evidence for, not an estimate — the date on the pack is a test result.',
      ka: 'რამდენ ხანს რჩება პროდუქტი უსაფრთხო და სპეციფიკაციის შესაბამისი მითითებულ პირობებში. ეს არის მტკიცებულებით გამყარებული განაცხადი და არა შეფასება — თარიღი შეფუთვაზე ანალიზის შედეგია.',
    },
    match: { en: ['shelf life', 'shelf-life'], ka: ['ვარგისიანობის ვადა'] },
  },
  {
    id: 'certificate-of-analysis',
    category: 'quality',
    term: { en: 'Certificate of analysis', ka: 'ანალიზის სერტიფიკატი' },
    aka: { en: 'CoA', ka: 'CoA' },
    definition: {
      en: 'The laboratory result that travels with a consignment, stating what was tested and what was found. Without it an export shipment is a claim; with it, it is evidence.',
      ka: 'ლაბორატორიული დასკვნა, რომელიც ტვირთს თან ახლავს და აღწერს, რა შემოწმდა და რა შედეგი მიიღეს. მის გარეშე საექსპორტო ტვირთი მხოლოდ განაცხადია.',
    },
    match: { en: ['certificate of analysis', 'certificates of analysis'], ka: ['ანალიზის სერტიფიკატი'] },
  },

  /* --------------------------------------------------------------- commercial */
  {
    id: 'toll-manufacturing',
    category: 'commercial',
    term: { en: 'Toll manufacturing', ka: 'დამკვეთის ნედლეულით წარმოება' },
    definition: {
      en: 'A plant processes raw material that belongs to the customer and charges for the conversion, not the product. The customer carries the milk price risk; the plant sells capacity.',
      ka: 'საწარმო ამუშავებს დამკვეთის კუთვნილ ნედლეულს და იღებს საფასურს გადამუშავებისთვის და არა პროდუქტისთვის. რძის ფასის რისკს დამკვეთი ატარებს, საწარმო კი სიმძლავრეს ყიდის.',
    },
    match: { en: ['toll manufacturing', 'toll processing'], ka: ['დამკვეთის ნედლეულით წარმოება'] },
  },
  {
    id: 'private-label',
    category: 'commercial',
    term: { en: 'Private label', ka: 'კერძო ბრენდი' },
    definition: {
      en: 'Manufacturing a product that goes to market under someone else’s brand — usually a retailer’s. It fills spare capacity, but the brand equity accrues to the buyer, not the maker.',
      ka: 'პროდუქტის წარმოება სხვისი ბრენდის ქვეშ — ჩვეულებრივ საცალო ქსელის. ავსებს თავისუფალ სიმძლავრეს, თუმცა ბრენდის ღირებულებას მყიდველი აგროვებს და არა მწარმოებელი.',
    },
    match: { en: ['private label', 'private-label'], ka: ['კერძო ბრენდი'] },
  },
  {
    id: 'offtake',
    category: 'commercial',
    term: { en: 'Offtake', ka: 'რეალიზაცია' },
    definition: {
      en: 'A committed buyer for what you will produce, usually agreed before the capacity is built. Lenders treat a signed offtake as the difference between a project and a hope.',
      ka: 'შეთანხმებული მყიდველი მომავალ პროდუქციაზე, როგორც წესი, სიმძლავრის აშენებამდე. დამფინანსებლისთვის ხელმოწერილი შეთანხმება პროექტსა და იმედს შორის ზღვარია.',
    },
    match: { en: ['offtake'], ka: ['რეალიზაცია'] },
  },
  {
    id: 'moq',
    category: 'commercial',
    term: { en: 'MOQ', ka: 'მინიმალური შეკვეთა' },
    aka: { en: 'Minimum order quantity', ka: 'მინიმალური შეკვეთის მოცულობა' },
    definition: {
      en: 'The smallest order a supplier will accept, usually set by a production run or a pallet. It decides whether a small buyer can trade with you at all.',
      ka: 'უმცირესი შეკვეთა, რომელსაც მომწოდებელი იღებს — ჩვეულებრივ განისაზღვრება საწარმოო ციკლით ან პალეტით. სწორედ ეს წყვეტს, შეძლებს თუ არა მცირე მყიდველი თქვენთან თანამშრომლობას.',
    },
    match: { en: ['MOQ', 'minimum order quantity'], ka: ['მინიმალური შეკვეთა'] },
  },
  {
    id: 'feasibility-study',
    category: 'commercial',
    term: { en: 'Feasibility study', ka: 'წინასაპროექტო კვლევა' },
    definition: {
      en: 'The work that establishes whether a project stands up before capital is committed: milk supply, site, capacity, market and the numbers that connect them. It is also what a bank reads first.',
      ka: 'სამუშაო, რომელიც კაპიტალის ჩადებამდე ადგენს, დგას თუ არა პროექტი ფეხზე: რძის მიწოდება, ნაკვეთი, სიმძლავრე, ბაზარი და მათი დამაკავშირებელი ციფრები. სწორედ ამას კითხულობს ბანკი პირველად.',
    },
    match: { en: ['feasibility study', 'feasibility'], ka: ['წინასაპროექტო კვლევა'] },
  },
];

export const getTerm = (id: string) => GLOSSARY.find((g) => g.id === id);

/**
 * Surface forms, longest first, paired with their term id.
 *
 * Longest-first matters: "cold chain engineering" must not be matched as
 * "chain", and "milking parlours" must beat "parlours".
 */
const surfaceCache: Record<'en' | 'ka', { id: string; surface: string }[] | null> = { en: null, ka: null };

const surfaces = (lang: 'en' | 'ka') => {
  const cached = surfaceCache[lang];
  if (cached) return cached;
  const built = GLOSSARY.flatMap((g) => g.match[lang].map((s) => ({ id: g.id, surface: s })))
    .sort((a, b) => b.surface.length - a.surface.length);
  surfaceCache[lang] = built;
  return built;
};

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * One regex per language, built once.
 *
 * `\b` is ASCII-only in JavaScript, so it silently fails on Georgian text. The
 * boundaries are therefore written as explicit lookarounds over a class that
 * includes the Georgian block — without them, "შრატი" would match inside a
 * longer word and mark up half of it.
 */
const BOUNDARY_BEFORE = '(?<![\\p{L}\\p{N}_-])';
const BOUNDARY_AFTER = '(?![\\p{L}\\p{N}_-])';

const patterns: Record<'en' | 'ka', { re: RegExp; ids: string[] } | null> = { en: null, ka: null };

function pattern(lang: 'en' | 'ka') {
  const cached = patterns[lang];
  if (cached) return cached;
  const list = surfaces(lang);
  const re = new RegExp(
    `${BOUNDARY_BEFORE}(${list.map((s) => escape(s.surface)).join('|')})${BOUNDARY_AFTER}`,
    lang === 'en' ? 'giu' : 'gu',
  );
  const built = { re, ids: list.map((s) => s.id) };
  patterns[lang] = built;
  return built;
}

export type GlossSegment = string | { id: string; text: string };

/**
 * Split running prose into plain strings and glossary hits.
 *
 * Only the FIRST occurrence of each term in a given block is marked. A paragraph
 * with "cold chain" four times should read as prose, not as a field of dotted
 * underlines — the reader needs the definition once.
 */
export function glossSegments(text: string, lang: 'en' | 'ka'): GlossSegment[] {
  const { re } = pattern(lang);
  const list = surfaces(lang);
  re.lastIndex = 0;
  const out: GlossSegment[] = [];
  const used = new Set<string>();
  let last = 0;

  for (const m of text.matchAll(re)) {
    const surface = m[1];
    const lower = surface.toLowerCase();
    const hit = list.find(
      (s) => (lang === 'en' ? s.surface.toLowerCase() === lower : s.surface === surface),
    );
    if (!hit || used.has(hit.id)) continue;
    used.add(hit.id);
    const at = m.index ?? 0;
    if (at > last) out.push(text.slice(last, at));
    out.push({ id: hit.id, text: surface });
    last = at + surface.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}
