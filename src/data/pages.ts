import type { I18n, PageType } from '@/lib/types';

/**
 * Institutional page registry — brief §4.4 / §9.
 * Every footer destination is a real, separately-titled page. Without this the
 * eight /about/* routes all rendered one heading while their <title> said
 * something else: the page said "About GEO Dairy" and the tab said "Strategy".
 */
export interface InstitutionalPage {
  path: string;
  kind: PageType;
  /** Which page-type template the design team should apply (§9). */
  template: string;
  title: I18n;
  purpose: I18n;
  /** Section headings this page owes the reader once content is written. */
  sections: I18n[];
  parent?: { path: string; label: I18n };
}

const ABOUT: I18n = { en: 'About GEO Dairy', ka: 'GEO Dairy-ის შესახებ' };
const INDUSTRY: I18n = { en: 'Dairy industry', ka: 'რძის ინდუსტრია' };
const LEGAL: I18n = { en: 'Legal & policy', ka: 'იურიდიული და პოლიტიკა' };

const s = (en: string, ka: string): I18n => ({ en, ka });

export const PAGES: InstitutionalPage[] = [
  /* ------------------------------------------------------ P13 CORPORATE */
  {
    path: '/about', kind: 'corporate', template: 'P13 Corporate', title: ABOUT,
    purpose: s(
      'Who GEO Dairy is, what it does across the dairy value chain, and why it is organised the way it is.',
      'ვინ არის GEO Dairy, რას აკეთებს რძის ღირებულების ჯაჭვში და რატომ არის ასე ორგანიზებული.',
    ),
    sections: [s('Company overview', 'კომპანიის მიმოხილვა'), s('What we do', 'რას ვაკეთებთ'), s('Leadership', 'ხელმძღვანელობა'), s('Facts & figures', 'ფაქტები და ციფრები')],
  },
  {
    path: '/about/mission', kind: 'corporate', template: 'P13 Corporate',
    title: s('Mission & Vision', 'მისია და ხედვა'),
    purpose: s(
      'The outcome GEO Dairy exists to produce for the Georgian dairy industry, and the state of the sector it is working towards.',
      'რა შედეგისთვის არსებობს GEO Dairy ქართული რძის ინდუსტრიისთვის და რომელი მდგომარეობისკენ მიდის სექტორი.',
    ),
    sections: [s('Mission', 'მისია'), s('Vision', 'ხედვა'), s('Values in practice', 'ღირებულებები პრაქტიკაში')],
    parent: { path: '/about', label: ABOUT },
  },
  {
    path: '/about/strategy', kind: 'corporate', template: 'P13 Corporate',
    title: s('Strategy', 'სტრატეგია'),
    purpose: s(
      'How the five directions compound into one integrated position, and the sequence in which capability is being built.',
      'როგორ გროვდება ხუთი მიმართულება ერთ ინტეგრირებულ პოზიციად და რა თანმიმდევრობით შენდება შესაძლებლობა.',
    ),
    sections: [s('Strategic position', 'სტრატეგიული პოზიცია'), s('Priorities', 'პრიორიტეტები'), s('Capability roadmap', 'შესაძლებლობების რუკა')],
    parent: { path: '/about', label: ABOUT },
  },
  {
    path: '/about/role', kind: 'corporate', template: 'P13 Corporate',
    title: s('Our Role in Georgia', 'ჩვენი როლი საქართველოში'),
    purpose: s(
      'What GEO Dairy carries on behalf of the sector that no single farm, processor or trader carries alone.',
      'რას იღებს GEO Dairy სექტორის სახელით, რასაც ცალკეული ფერმა, გადამამუშავებელი ან ტრეიდერი ვერ იღებს.',
    ),
    sections: [s('Industry development', 'ინდუსტრიის განვითარება'), s('Standards & competence', 'სტანდარტები და კომპეტენცია'), s('Institutional cooperation', 'ინსტიტუციური თანამშრომლობა')],
    parent: { path: '/about', label: ABOUT },
  },
  {
    path: '/about/business-model', kind: 'corporate', template: 'P13 Corporate',
    title: s('Business Model', 'ბიზნეს-მოდელი'),
    purpose: s(
      'Where GEO Dairy acts as principal, where as facilitator, and how the five directions earn.',
      'სად მოქმედებს GEO Dairy როგორც პრინციპალი, სად როგორც ფასილიტატორი და როგორ შემოაქვს შემოსავალი ხუთ მიმართულებას.',
    ),
    sections: [s('Commercial roles', 'კომერციული როლები'), s('Revenue logic', 'შემოსავლის ლოგიკა'), s('Partnership models', 'პარტნიორობის მოდელები')],
    parent: { path: '/about', label: ABOUT },
  },
  {
    path: '/about/governance', kind: 'corporate', template: 'P13 Corporate',
    title: s('Governance', 'მმართველობა'),
    purpose: s(
      'Ownership, decision rights, and the controls that apply to technical, commercial and financial claims.',
      'მფლობელობა, გადაწყვეტილების უფლებები და კონტროლი ტექნიკურ, კომერციულ და ფინანსურ განცხადებებზე.',
    ),
    sections: [s('Structure', 'სტრუქტურა'), s('Oversight', 'ზედამხედველობა'), s('Compliance', 'შესაბამისობა')],
    parent: { path: '/about', label: ABOUT },
  },
  {
    path: '/about/sustainability', kind: 'corporate', template: 'P13 Corporate',
    title: s('Sustainability', 'მდგრადობა'),
    purpose: s(
      'Environmental, animal-welfare and social commitments — stated only where they are measured.',
      'გარემოსდაცვითი, ცხოველთა კეთილდღეობისა და სოციალური ვალდებულებები — მხოლოდ იქ, სადაც იზომება.',
    ),
    sections: [s('Environmental footprint', 'გარემოზე ზეგავლენა'), s('Animal welfare', 'ცხოველთა კეთილდღეობა'), s('Communities', 'თემები')],
    parent: { path: '/about', label: ABOUT },
  },
  {
    path: '/about/locations', kind: 'corporate', template: 'P13 Corporate',
    title: s('Locations', 'ლოკაციები'),
    purpose: s(
      'Offices, farms, plants and coverage — published only once each entry is verified.',
      'ოფისები, ფერმები, საწარმოები და დაფარვა — გამოქვეყნებული მხოლოდ დადასტურების შემდეგ.',
    ),
    sections: [s('Head office', 'სათავო ოფისი'), s('Production sites', 'საწარმოო ობიექტები'), s('Regional presence', 'რეგიონული ყოფნა')],
    parent: { path: '/about', label: ABOUT },
  },
  {
    path: '/careers', kind: 'corporate', template: 'P14 Audience',
    title: s('Careers', 'კარიერა'),
    purpose: s(
      'Roles inside GEO Dairy, and the workforce register for technologists, veterinarians and farm staff placed through Supply.',
      'პოზიციები GEO Dairy-ში და სამუშაო ძალის რეესტრი ტექნოლოგებისთვის, ვეტერინარებისა და ფერმის პერსონალისთვის.',
    ),
    sections: [s('Open roles', 'ღია პოზიციები'), s('How we hire', 'როგორ ვასაქმებთ'), s('Workforce register', 'სამუშაო ძალის რეესტრი')],
  },

  /* ------------------------------------------ P12 INDUSTRY / REFERENCE */
  {
    path: '/industry', kind: 'reference', template: 'P12 Industry / Reference', title: INDUSTRY,
    purpose: s(
      'How the dairy industry works as a system — the shared explanation everything else on this site refers back to.',
      'როგორ მუშაობს რძის ინდუსტრია როგორც სისტემა — საერთო ახსნა, რომელსაც საიტის დანარჩენი ნაწილი ეყრდნობა.',
    ),
    sections: [s('The value chain', 'ღირებულების ჯაჭვი'), s('Economics', 'ეკონომიკა'), s('Standards landscape', 'სტანდარტების გარემო')],
  },
  {
    path: '/industry/upstream', kind: 'reference', template: 'P12 Industry / Reference',
    title: s('Upstream', 'პირველადი რგოლი'),
    purpose: s(
      'Dairy farming and raw-milk production: herds, feed, milking, quality and what determines cost per litre.',
      'რძის მეურნეობა და ნედლი რძის წარმოება: ნახირი, საკვები, წველა, ხარისხი და ლიტრზე ხარჯის განმსაზღვრელი ფაქტორები.',
    ),
    sections: [s('How it works', 'როგორ მუშაობს'), s('Key parameters', 'ძირითადი პარამეტრები'), s('Where GEO Dairy acts', 'სად მოქმედებს GEO Dairy')],
    parent: { path: '/industry', label: INDUSTRY },
  },
  {
    path: '/industry/midstream', kind: 'reference', template: 'P12 Industry / Reference',
    title: s('Midstream', 'გადამამუშავებელი რგოლი'),
    purpose: s(
      'Processing and manufacturing: intake, separation, heat treatment, culturing, packaging and yield.',
      'გადამუშავება და წარმოება: მიღება, სეპარაცია, თერმული დამუშავება, დუღილი, შეფუთვა და გამოსავალი.',
    ),
    sections: [s('How it works', 'როგორ მუშაობს'), s('Key parameters', 'ძირითადი პარამეტრები'), s('Where GEO Dairy acts', 'სად მოქმედებს GEO Dairy')],
    parent: { path: '/industry', label: INDUSTRY },
  },
  {
    path: '/industry/downstream', kind: 'reference', template: 'P12 Industry / Reference',
    title: s('Downstream', 'სადისტრიბუციო რგოლი'),
    purpose: s(
      'Cold chain, logistics, distribution, wholesale, retail and e-commerce — how dairy reaches a buyer intact.',
      'ცივი ჯაჭვი, ლოგისტიკა, დისტრიბუცია, საბითუმო, საცალო და ელექტრონული კომერცია.',
    ),
    sections: [s('How it works', 'როგორ მუშაობს'), s('Key parameters', 'ძირითადი პარამეტრები'), s('Where GEO Dairy acts', 'სად მოქმედებს GEO Dairy')],
    parent: { path: '/industry', label: INDUSTRY },
  },
  {
    path: '/industry/georgia', kind: 'reference', template: 'P12 Industry / Reference',
    title: s('Dairy in Georgia', 'რძე საქართველოში'),
    purpose: s(
      'The shape of the Georgian dairy sector: herd structure, processing capacity, consumption, imports and exports.',
      'ქართული რძის სექტორის სურათი: ნახირის სტრუქტურა, გადამუშავების სიმძლავრე, მოხმარება, იმპორტი და ექსპორტი.',
    ),
    sections: [s('Sector structure', 'სექტორის სტრუქტურა'), s('Trade balance', 'სავაჭრო ბალანსი'), s('Opportunities', 'შესაძლებლობები')],
    parent: { path: '/industry', label: INDUSTRY },
  },
  {
    path: '/industry/development', kind: 'reference', template: 'P12 Industry / Reference',
    title: s('Industry Development', 'ინდუსტრიის განვითარება'),
    purpose: s(
      'What has to change for Georgian dairy to compete, and the programmes working on it.',
      'რა უნდა შეიცვალოს, რომ ქართული რძე კონკურენტული გახდეს, და რომელი პროგრამები მუშაობს ამაზე.',
    ),
    sections: [s('Constraints', 'შეზღუდვები'), s('Programmes', 'პროგრამები'), s('Measured progress', 'გაზომილი პროგრესი')],
    parent: { path: '/industry', label: INDUSTRY },
  },

  /* ------------------------------------------------------- P11 PROJECTS */
  {
    path: '/projects', kind: 'project', template: 'P11 Project',
    title: s('Projects', 'პროექტები'),
    purpose: s(
      'Investment, development and implementation projects — context, scope, status, requirements and how to participate.',
      'საინვესტიციო, სამშენებლო და დანერგვის პროექტები — კონტექსტი, მოცულობა, სტატუსი, მოთხოვნები და მონაწილეობა.',
    ),
    sections: [s('Active projects', 'მიმდინარე პროექტები'), s('Pipeline', 'დაგეგმილი'), s('How to participate', 'როგორ ჩაერთოთ')],
  },

  /* ---------------------------------------------------------- P17 LEGAL */
  {
    path: '/legal/privacy', kind: 'legal', template: 'P17 Legal / Policy',
    title: s('Privacy', 'კონფიდენციალურობა'),
    purpose: s(
      'What personal and business information the inquiry forms collect, why, how long it is kept and who it reaches.',
      'რა პერსონალურ და ბიზნეს-ინფორმაციას აგროვებს ფორმები, რატომ, რამდენ ხანს ინახება და ვის მიუვა.',
    ),
    sections: [s('What we collect', 'რას ვაგროვებთ'), s('Why we collect it', 'რატომ'), s('Retention & deletion', 'შენახვა და წაშლა'), s('Your rights', 'თქვენი უფლებები')],
    parent: { path: '/legal/privacy', label: LEGAL },
  },
  {
    path: '/legal/cookies', kind: 'legal', template: 'P17 Legal / Policy',
    title: s('Cookies', 'ქუქიები'),
    purpose: s(
      'Which cookies and analytics this site sets, and how to refuse the non-essential ones.',
      'რომელ ქუქიებსა და ანალიტიკას იყენებს საიტი და როგორ უარვყოთ არასავალდებულო.',
    ),
    sections: [s('Essential cookies', 'აუცილებელი ქუქიები'), s('Analytics', 'ანალიტიკა'), s('Managing preferences', 'პარამეტრების მართვა')],
    parent: { path: '/legal/privacy', label: LEGAL },
  },
  {
    path: '/legal/terms', kind: 'legal', template: 'P17 Legal / Policy',
    title: s('Terms of Use', 'გამოყენების პირობები'),
    purpose: s(
      'The terms on which this site and its published information may be used.',
      'პირობები, რომლითაც შესაძლებელია საიტისა და მისი ინფორმაციის გამოყენება.',
    ),
    sections: [s('Use of this site', 'საიტის გამოყენება'), s('Accuracy of information', 'ინფორმაციის სიზუსტე'), s('Liability', 'პასუხისმგებლობა')],
    parent: { path: '/legal/privacy', label: LEGAL },
  },
  {
    path: '/legal/corporate', kind: 'legal', template: 'P17 Legal / Policy',
    title: s('Legal Information', 'იურიდიული ინფორმაცია'),
    purpose: s(
      'Registered entity, identification number, registered address and contact for legal correspondence.',
      'რეგისტრირებული სუბიექტი, საიდენტიფიკაციო ნომერი, იურიდიული მისამართი და საკონტაქტო ინფორმაცია.',
    ),
    sections: [s('Company details', 'კომპანიის დეტალები'), s('Registered address', 'იურიდიული მისამართი'), s('Legal contact', 'იურიდიული კონტაქტი')],
    parent: { path: '/legal/privacy', label: LEGAL },
  },
  {
    path: '/legal/accessibility', kind: 'legal', template: 'P17 Legal / Policy',
    title: s('Accessibility Statement', 'ხელმისაწვდომობის განაცხადი'),
    purpose: s(
      'The accessibility standard this site targets, what has been tested, what has not, and how to report a barrier.',
      'რომელ სტანდარტს იცავს საიტი, რა შემოწმდა, რა არა და როგორ შეგვატყობინოთ ბარიერის შესახებ.',
    ),
    sections: [s('Standard targeted', 'სამიზნე სტანდარტი'), s('Known limitations', 'ცნობილი შეზღუდვები'), s('Report a barrier', 'შეატყობინეთ ბარიერი')],
    parent: { path: '/legal/privacy', label: LEGAL },
  },
];

export const getPage = (path: string) => PAGES.find((p) => p.path === path);
