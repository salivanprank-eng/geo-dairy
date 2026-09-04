import type { I18n } from '@/lib/types';
import { GEORGIA_REGIONS } from '@/data/regions';

/**
 * REGIONAL PROFILES
 *
 * These describe the dairy geography of each region — terrain, climate, herd
 * structure, the products the area is known for. They are NOT statements about
 * GEO Dairy's assets, facilities or activity, and nothing here should be read as
 * one: the company's own coverage lives in COVERAGE_PLACEHOLDER, is marked as
 * placeholder, and is the field the client has to fill.
 *
 * The separation is the point. A region page that invented facilities would be
 * the exact failure §11.1 warns against; a region page that describes the
 * country honestly is useful to a buyer on day one and stays true once the real
 * coverage data lands on top of it.
 *
 * `starts` is editorial routing rather than measured demand — the entry points
 * that suit the region's structure, chosen the way someone on the commercial
 * desk would choose them.
 */

export interface RegionProfile {
  /** Two or three words placing the region in the industry. */
  role: I18n;
  context: I18n;
  /** Suggested entry points into the taxonomy: [direction, sub-direction]. */
  starts: [string, string][];
}

export const REGION_PROFILES: Record<string, RegionProfile> = {
  kakheti: {
    role: { en: 'Arable east', ka: 'სახნავი აღმოსავლეთი' },
    context: {
      en: 'Warm, dry lowlands with the country’s deepest arable base, which means forage can be grown rather than bought in. Herds run larger and more commercially here than the national pattern, and Tbilisi is close enough that fresh milk reaches the market the same day.',
      ka: 'თბილი, მშრალი დაბლობი ქვეყნის ყველაზე ღრმა სახნავი ბაზით — საკვების მოყვანა შესაძლებელია და არა შეძენა. აქ ნახირები საშუალოზე დიდი და კომერციულია, თბილისი კი იმდენად ახლოსაა, რომ ახალი რძე იმავე დღეს აღწევს ბაზარზე.',
    },
    starts: [['production', 'upstream'], ['supply', 'infrastructure'], ['service', 'engineering']],
  },
  'kvemo-kartli': {
    role: { en: 'Processing corridor', ka: 'გადამამუშავებელი დერეფანი' },
    context: {
      en: 'Lowland farming districts sitting on the industrial and logistics corridor south of Tbilisi. Proximity to the capital, to Rustavi’s industry and to the Armenian and Azerbaijani borders makes this a natural place to put processing capacity rather than pasture.',
      ka: 'დაბლობი სასოფლო რაიონები თბილისის სამხრეთით მდებარე ინდუსტრიულ და სალოგისტიკო დერეფანში. დედაქალაქთან, რუსთავის მრეწველობასთან და სომხეთ-აზერბაიჯანის საზღვრებთან სიახლოვე ამ ადგილს გადამუშავებისთვის უფრო ბუნებრივს ხდის, ვიდრე საძოვრებისთვის.',
    },
    starts: [['production', 'midstream'], ['supply', 'equipment'], ['trade', 'distribution']],
  },
  imereti: {
    role: { en: 'Dense mixed farming', ka: 'მჭიდრო შერეული მეურნეობა' },
    context: {
      en: 'Central Georgia’s hill and valley country, densely settled and worked in small mixed holdings. Imeruli — the fresh cheese most widely made in the country — takes its name from here, and small-scale cheesemaking is ordinary household economics rather than a speciality.',
      ka: 'ცენტრალური საქართველოს ბორცვები და ხეობები, მჭიდროდ დასახლებული და მცირე შერეული მეურნეობებით დამუშავებული. იმერული — ქვეყანაში ყველაზე გავრცელებული ახალი ყველი — სწორედ აქედან იღებს სახელს, ხოლო მცირემასშტაბიანი ყველის კეთება ჩვეულებრივი საოჯახო ეკონომიკის ნაწილია.',
    },
    starts: [['supply', 'inputs'], ['service', 'advisory'], ['ecosystem', 'knowledge']],
  },
  samegrelo: {
    role: { en: 'Sulguni country', ka: 'სულგუნის მხარე' },
    context: {
      en: 'Humid western lowlands rising into Zemo Svaneti. Sulguni is the region’s name in the dairy world — a brined pasta filata cheese made here long before it was made elsewhere in Georgia — and the technique remains its strongest commercial asset.',
      ka: 'ნოტიო დასავლური დაბლობი, რომელიც ზემო სვანეთისკენ იწევს. სულგუნი რეგიონის სახელია რძის სამყაროში — მარილწყალში დამწიფებული ბოჭკოვანი ყველი, რომელიც აქ მზადდებოდა ბევრად ადრე, ვიდრე საქართველოს სხვა კუთხეში — და სწორედ ეს ტექნიკაა მხარის უძლიერესი კომერციული აქტივი.',
    },
    starts: [['production', 'contract'], ['trade', 'international'], ['service', 'development']],
  },
  'samtskhe-javakheti': {
    role: { en: 'High pasture', ka: 'მაღალმთის საძოვრები' },
    context: {
      en: 'A cold volcanic plateau with long winters and extensive summer grazing. Cattle keeping carries the rural economy here in a way it does nowhere else in Georgia, and the binding constraints are collection, storage and winter feed rather than milk itself.',
      ka: 'ცივი ვულკანური პლატო გრძელი ზამთრითა და ვრცელი საზაფხულო საძოვრებით. მესაქონლეობა აქ სოფლის ეკონომიკის საყრდენია ისე, როგორც არსად საქართველოში, ხოლო შემზღუდველი ფაქტორი თავად რძე კი არა, მისი შეგროვება, შენახვა და ზამთრის საკვებია.',
    },
    starts: [['production', 'grid'], ['supply', 'infrastructure'], ['service', 'operation']],
  },
  'shida-kartli': {
    role: { en: 'Central corridor', ka: 'ცენტრალური დერეფანი' },
    context: {
      en: 'Irrigated lowland along the country’s main east–west route, better known for orchards than for herds. Its dairy advantage is position: anything produced here is a short run from both Tbilisi and the western markets.',
      ka: 'მორწყვადი დაბლობი ქვეყნის მთავარი აღმოსავლეთ-დასავლეთის მაგისტრალის გასწვრივ, უფრო ბაღებით ცნობილი, ვიდრე ნახირებით. რძის სექტორში მისი უპირატესობა მდებარეობაა: აქ ნაწარმოები პროდუქცია მოკლე მანძილზეა როგორც თბილისთან, ისე დასავლეთის ბაზრებთან.',
    },
    starts: [['trade', 'distribution'], ['supply', 'equipment'], ['service', 'implementation']],
  },
  'mtskheta-mtianeti': {
    role: { en: 'Valley and mountain', ka: 'ხეობა და მთა' },
    context: {
      en: 'The Aragvi valley running up into the high Caucasus, with grazing on the summer pastures above it. Close enough to Tbilisi to sell fresh; remote enough at the head of the valley that collection logistics decide what is viable.',
      ka: 'არაგვის ხეობა, რომელიც მაღალ კავკასიონში ადის, ზემოთ კი საზაფხულო საძოვრები. თბილისთან იმდენად ახლოა, რომ ახალი პროდუქცია იყიდება, ხეობის სათავეში კი იმდენად შორს, რომ შეგროვების ლოგისტიკა წყვეტს, რა არის სიცოცხლისუნარიანი.',
    },
    starts: [['supply', 'infrastructure'], ['production', 'grid'], ['ecosystem', 'experience']],
  },
  adjara: {
    role: { en: 'Coast and highland', ka: 'ზღვისპირეთი და მთიანეთი' },
    context: {
      en: 'Two regions in one: a humid subtropical coast around Batumi, and a mountainous interior where herds move to summer pasture. Demand is unusual here — seasonal tourism concentrates a great deal of dairy consumption into a few months.',
      ka: 'ორი რეგიონი ერთში: ნოტიო სუბტროპიკული ზღვისპირეთი ბათუმის გარშემო და მთიანი შიდა ნაწილი, სადაც ნახირი საზაფხულო საძოვრებზე გადადის. მოთხოვნა აქ არატიპურია — სეზონური ტურიზმი რძის მოხმარების დიდ ნაწილს რამდენიმე თვეში კრავს.',
    },
    starts: [['trade', 'retail'], ['supply', 'inputs'], ['service', 'advisory']],
  },
  guria: {
    role: { en: 'Small western holdings', ka: 'მცირე დასავლური მეურნეობები' },
    context: {
      en: 'Humid lowland between Samegrelo and Adjara, worked in small mixed holdings where dairy sits alongside tea and citrus rather than replacing them. Scale comes from aggregation here, not from individual farm size.',
      ka: 'ნოტიო დაბლობი სამეგრელოსა და აჭარას შორის, მცირე შერეული მეურნეობებით, სადაც რძის მეურნეობა ჩაისა და ციტრუსის გვერდით დგას და არა მათ ნაცვლად. მასშტაბი აქ გაერთიანებით მიიღწევა და არა ცალკეული ფერმის ზომით.',
    },
    starts: [['production', 'grid'], ['supply', 'inputs'], ['ecosystem', 'network']],
  },
  'racha-lechkhumi': {
    role: { en: 'Mountain artisanal', ka: 'მთის ხელოსნური' },
    context: {
      en: 'High, sparsely populated mountain country with a small herd base and a long artisanal tradition. Volume will never be the argument here; origin, seasonality and provenance are.',
      ka: 'მაღალი, მეჩხრად დასახლებული მთიანეთი მცირე ნახირითა და ხანგრძლივი ხელოსნური ტრადიციით. მოცულობა აქ არასდროს იქნება არგუმენტი — წარმოშობა, სეზონურობა და ადგილი კი დიახ.',
    },
    starts: [['trade', 'retail'], ['ecosystem', 'visibility'], ['service', 'development']],
  },
  tbilisi: {
    role: { en: 'The market', ka: 'ბაზარი' },
    context: {
      en: 'Not a production region but the demand centre: a large share of the country lives here, and the retail, food-service and import decisions that set prices nationally are taken in the city. What is built elsewhere is usually sold here first.',
      ka: 'არა საწარმოო რეგიონი, არამედ მოთხოვნის ცენტრი: ქვეყნის მოსახლეობის დიდი ნაწილი აქ ცხოვრობს და საცალო, კვების სერვისისა და იმპორტის გადაწყვეტილებები, რომლებიც ფასებს ქვეყნის მასშტაბით განსაზღვრავს, ქალაქში მიიღება. სხვაგან აშენებული ჩვეულებრივ ჯერ აქ იყიდება.',
    },
    starts: [['trade', 'retail'], ['trade', 'wholesale'], ['ecosystem', 'marketplace']],
  },
  abkhazia: {
    role: { en: 'No published data', ka: 'გამოქვეყნებული მონაცემები არ არის' },
    context: {
      en: 'GEO Dairy publishes no coverage, facility or programme data for this region. It appears on the map because the map is of Georgia, and leaving it off would itself be a statement.',
      ka: 'GEO Dairy არ აქვეყნებს ამ რეგიონის დაფარვის, ობიექტების ან პროგრამების მონაცემებს. რუკაზე ის იმიტომ ჩანს, რომ რუკა საქართველოსია, და მისი გამოტოვება თავად იქნებოდა განცხადება.',
    },
    starts: [],
  },
};

export const getRegion = (id: string | undefined) =>
  GEORGIA_REGIONS.find((r) => r.id === id);

export const getRegionProfile = (id: string | undefined) =>
  (id ? REGION_PROFILES[id] : undefined);
