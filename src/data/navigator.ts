import type { NavigatorIntent } from '@/lib/types';

/**
 * GEO DAIRY NAVIGATOR — brief §7.
 * A horizontal, intent-based routing layer. NOT a sixth direction (§1.2).
 * Stage 1 is deliberately rule-based: intent → one or more taxonomy routes → CTA.
 * Stage 3 replaces the lookup with free-text understanding; the contract stays.
 */

export const INTENTS: NavigatorIntent[] = [
  {
    id: 'start-a-farm',
    label: { en: 'Start a dairy farm', ka: 'დავიწყო რძის ფერმა' },
    routes: [
      { direction: 'service', sub: 'advisory' },
      { direction: 'service', sub: 'engineering' },
      { direction: 'supply', sub: 'infrastructure' },
      { direction: 'supply', sub: 'capital' },
    ],
    cta: 'service-request',
  },
  {
    id: 'upgrade-my-farm',
    label: { en: 'Upgrade my dairy farm', ka: 'გავაუმჯობესო ჩემი ფერმა' },
    routes: [
      { direction: 'service', sub: 'advisory' },
      { direction: 'supply', sub: 'equipment' },
      { direction: 'service', sub: 'operation' },
    ],
    cta: 'service-request',
  },
  {
    id: 'build-a-factory',
    label: { en: 'Build a dairy factory', ka: 'ავაშენო რძის ქარხანა' },
    routes: [
      { direction: 'service', sub: 'engineering' },
      { direction: 'service', sub: 'implementation' },
      { direction: 'supply', sub: 'equipment' },
    ],
    cta: 'service-request',
  },
  {
    id: 'buy-equipment',
    label: { en: 'Buy dairy equipment', ka: 'შევიძინო აღჭურვილობა' },
    routes: [
      { direction: 'supply', sub: 'equipment' },
      { direction: 'supply', sub: 'capital' },
    ],
    cta: 'quote',
  },
  {
    id: 'source-inputs',
    label: { en: 'Source feed or inputs', ka: 'მოვიპოვო საკვები ან რესურსები' },
    routes: [{ direction: 'supply', sub: 'inputs' }],
    cta: 'quote',
  },
  {
    id: 'sell-raw-milk',
    label: { en: 'Sell or supply raw milk', ka: 'გავყიდო ან მივაწოდო ნედლი რძე' },
    routes: [
      { direction: 'production', sub: 'grid' },
      { direction: 'production', sub: 'contract' },
    ],
    cta: 'grid-participation',
  },
  {
    id: 'buy-dairy-products',
    label: { en: 'Buy dairy products', ka: 'შევიძინო რძის პროდუქცია' },
    routes: [
      { direction: 'trade', sub: 'wholesale' },
      { direction: 'trade', sub: 'e-commerce' },
    ],
    cta: 'trade-inquiry',
  },
  {
    id: 'become-distributor',
    label: { en: 'Become a distributor', ka: 'გავხდე დისტრიბუტორი' },
    routes: [{ direction: 'trade', sub: 'distribution' }],
    cta: 'trade-inquiry',
  },
  {
    id: 'export-georgian-dairy',
    label: { en: 'Export Georgian dairy products', ka: 'გავიტანო ქართული პროდუქცია ექსპორტზე' },
    routes: [
      { direction: 'trade', sub: 'international' },
      { direction: 'ecosystem', sub: 'visibility' },
    ],
    cta: 'trade-inquiry',
  },
  {
    id: 'import-into-georgia',
    label: { en: 'Import dairy into Georgia', ka: 'შემოვიტანო პროდუქცია საქართველოში' },
    routes: [
      { direction: 'trade', sub: 'international' },
      { direction: 'trade', sub: 'distribution' },
    ],
    cta: 'trade-inquiry',
  },
  {
    id: 'join-dairy-grid',
    label: { en: 'Join Dairy Grid', ka: 'შემოვუერთდე Dairy Grid-ს' },
    routes: [{ direction: 'production', sub: 'grid' }],
    cta: 'grid-participation',
  },
  {
    id: 'invest-in-dairy',
    label: { en: 'Invest in dairy', ka: 'დავაბანდო რძის სექტორში' },
    routes: [
      { direction: 'supply', sub: 'capital' },
      { direction: 'production', sub: 'grid' },
      { direction: 'service', sub: 'development' },
    ],
    cta: 'investment',
  },
  {
    id: 'find-training',
    label: { en: 'Find training', ka: 'მოვძებნო ტრენინგი' },
    routes: [{ direction: 'ecosystem', sub: 'knowledge' }],
    cta: 'contact',
  },
  {
    id: 'find-a-professional',
    label: { en: 'Find a professional', ka: 'მოვძებნო პროფესიონალი' },
    routes: [
      { direction: 'ecosystem', sub: 'network' },
      { direction: 'supply', sub: 'workforce' },
    ],
    cta: 'quote',
  },
  {
    id: 'become-a-supplier',
    label: { en: 'Become a supplier', ka: 'გავხდე მომმარაგებელი' },
    routes: [
      { direction: 'supply', sub: 'equipment' },
      { direction: 'supply', sub: 'inputs' },
    ],
    cta: 'supplier-application',
  },
  {
    id: 'provide-services',
    label: { en: 'Provide services to GEO Dairy', ka: 'შევთავაზო სერვისი GEO Dairy-ს' },
    routes: [
      { direction: 'service', sub: 'advisory' },
      { direction: 'ecosystem', sub: 'network' },
    ],
    cta: 'provider-application',
  },
];

/**
 * Optional qualifying question — §7.1 step 2 asks 1–3 questions ONLY when they
 * change the routing or the receiving team. One question is enough at launch.
 */
export const CONTEXT_QUESTION = {
  question: { en: 'Where are you based?', ka: 'სად ხართ დაფუძნებული?' },
  options: [
    { id: 'georgia', label: { en: 'In Georgia', ka: 'საქართველოში' } },
    { id: 'international', label: { en: 'Outside Georgia', ka: 'საქართველოს გარეთ' } },
  ],
};

export const getIntent = (id: string) => INTENTS.find((i) => i.id === id);

/**
 * §7.3 Stage 2 — free-text intent matching.
 *
 * Stage 1 makes the visitor choose from our list. This lets them say it in their
 * own words and still land in the taxonomy, which is the whole point of the
 * Navigator (§19: "a visitor does not need to understand GEO Dairy's taxonomy").
 * Deliberately a keyword map rather than a model: it is inspectable, instant,
 * works offline and in both languages, and Stage 3 replaces it wholesale.
 */
const INTENT_KEYWORDS: Record<string, string> = {
  'start-a-farm': 'start begin new farm dairy cattle cows open build barn ფერმა დაწყება ახალი',
  'upgrade-my-farm': 'upgrade improve expand modernise modernize existing farm yield efficiency გაუმჯობესება',
  'build-a-factory': 'build factory plant processing facility cheese yoghurt production line construct ქარხანა საწარმო',
  'buy-equipment': 'buy purchase equipment machine machinery milking cooling tank pasteuriser packaging აღჭურვილობა შეძენა',
  'source-inputs': 'feed forage silage genetics semen packaging cultures ingredients supplies inputs საკვები რესურსი',
  'sell-raw-milk': 'sell supply raw milk offtake collection buyer for my milk რძის გაყიდვა მიწოდება',
  'buy-dairy-products': 'buy purchase cheese butter yoghurt milk products wholesale order შეძენა პროდუქცია',
  'become-distributor': 'distributor distribute reseller channel partner territory დისტრიბუტორი',
  'export-georgian-dairy': 'export exporting sell abroad international overseas foreign market ექსპორტი',
  'import-into-georgia': 'import bring into georgia foreign brand entry იმპორტი',
  'join-dairy-grid': 'grid network join programme program membership participate გრიდი შემოერთება',
  'invest-in-dairy': 'invest investment capital funding finance investor returns ინვესტიცია დაფინანსება',
  'find-training': 'training train course academy learn education skills teach ტრენინგი სწავლება',
  'find-a-professional': 'find hire professional expert consultant vet veterinarian technologist staff specialist სპეციალისტი',
  'become-a-supplier': 'become supplier vendor sell to you represent brand manufacturer მომმარაგებელი',
  'provide-services': 'provide offer services contractor partner work with you provider სერვისი შეთავაზება',
};

export function matchIntents(text: string, limit = 4): NavigatorIntent[] {
  const q = text.trim().toLowerCase();
  if (q.length < 2) return [];
  const words = q.split(/[^\p{L}\p{N}]+/u).filter((w) => w.length > 2);
  if (!words.length) return [];

  return INTENTS
    .map((intent) => {
      const hay = `${intent.label.en} ${intent.label.ka} ${INTENT_KEYWORDS[intent.id] ?? ''}`.toLowerCase();
      let score = 0;
      for (const w of words) {
        if (hay.includes(w)) score += w.length >= 5 ? 3 : 2;
        else if (w.length > 4 && hay.includes(w.slice(0, Math.max(4, w.length - 2)))) score += 1;
      }
      return { intent, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((r) => r.intent);
}
