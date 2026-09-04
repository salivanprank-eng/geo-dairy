import type { I18n } from '@/lib/types';

/**
 * PHOTOGRAPHY — brief §12.1.
 * "Balance human dairy-farming imagery with processing technology, logistics,
 * laboratories, trade and professional expertise." Every image below is a real,
 * verified Unsplash asset chosen to show work being done — barn aisles, bottling
 * lines, lab benches, cold chain — rather than the rustic-farmhouse and
 * milk-splash clichés §12.1 rules out.
 *
 * Served from images.unsplash.com with format/width negotiation. Before launch,
 * replace with commissioned photography of GEO Dairy's own farms and plants:
 * stock imagery of someone else's operation is a placeholder, not a proof (§10.1).
 */

export interface Photo {
  id: string;
  alt: I18n;
  /** object-position when the crop needs steering. */
  position?: string;
}

const p = (id: string, en: string, ka: string, position?: string): Photo => ({
  id, alt: { en, ka }, position,
});

export const PHOTOS = {
  /* Upstream */
  herdPasture: p('photo-1500595046743-cd271d694d30',
    'A dairy herd grazing on open pasture', 'რძის ნახირი ღია საძოვარზე'),
  barnAisle: p('photo-1782565569321-6351a53464be',
    'Cows feeding along the aisle of a modern free-stall barn', 'ძროხები თანამედროვე სადგომის დერეფანში'),
  barnHousing: p('photo-1636998980792-63f27ddea4e3',
    'Dairy cattle in a ventilated housing barn', 'რძის პირუტყვი ვენტილირებად სადგომში'),
  milkingHall: p('photo-1545468259-3061e564cf56',
    'A herd moving through a milking building', 'ნახირი საწველ შენობაში'),
  forage: p('photo-1782207296145-8fa9def37d10',
    'Baled forage across a cut field', 'დაპრესილი ფურაჟი მოთიბულ მინდორზე'),

  /* Midstream */
  processLine: p('photo-1513828646384-e4d8ec30d2bb',
    'Stainless process equipment on a production floor', 'უჟანგავი ტექნოლოგიური აღჭურვილობა საწარმოში'),
  bottlingLine: p('photo-1530037335614-e68828dcf258',
    'Glass bottles moving through a filling machine', 'შუშის ბოთლები ჩამოსხმის ხაზზე'),
  packagingLine: p('photo-1553530979-0f74d3d3fb34',
    'Cartons travelling along a packaging conveyor', 'შეფუთვის კონვეიერი'),
  labBench: p('photo-1602052577122-f73b9710adba',
    'A laboratory bench with analytical instruments', 'ლაბორატორიული მაგიდა ანალიზური ხელსაწყოებით'),
  labVials: p('photo-1578496479531-32e296d5c6e1',
    'Sample vials being filled for analysis', 'სინჯარები ანალიზისთვის'),

  /* Product & trade */
  cheeseAging: p('photo-1781785165275-6ac4deea7a9b',
    'Cheese wheels maturing on wooden shelves', 'ყველის ბორბლები ხის თაროებზე მწიფდება'),
  cheeseCounter: p('photo-1761983216043-2ccac73e3f19',
    'A cheese counter in a specialist shop', 'ყველის დახლი სპეციალიზებულ მაღაზიაში'),
  milkBottles: p('photo-1523473827533-2a64d0d36748',
    'Filled milk bottles in crates', 'ჩამოსხმული რძის ბოთლები ყუთებში'),
  milkPour: p('photo-1550583724-b2692b85b150',
    'Milk being poured into a glass', 'რძე იღვრება ჭიქაში'),

  /* Downstream */
  coldTruck: p('photo-1601467995997-ac1ae9a8fff4',
    'A refrigerated delivery vehicle at a loading building', 'რეფრიჟერატორი დატვირთვის შენობასთან'),
  warehouse: p('photo-1681514583213-7b8e47eb1953',
    'A delivery van loading inside a distribution warehouse', 'სატვირთო ფურგონი სადისტრიბუციო საწყობში'),

  /* Georgia */
  ushguli: p('photo-1788094749071-97f48e567d35',
    'Stone towers and houses in a Caucasus mountain village', 'ქვის კოშკები და სახლები კავკასიის მთის სოფელში'),
  valleyVillage: p('photo-1740548165574-778ef91779ac',
    'A village in a wide mountain valley', 'სოფელი ფართო მთის ხეობაში'),
  grazingHill: p('photo-1771634915026-5a778ee7be19',
    'Horses grazing on a hillside above a village', 'ცხენები ძოვენ სოფლის ზემოთ გორაკზე'),
} satisfies Record<string, Photo>;

export type PhotoKey = keyof typeof PHOTOS;

/** Unsplash delivery URL. `w` drives the CDN resize; the component builds a srcset. */
export const photoUrl = (id: string, w: number, q = 72) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=${q}`;

export const photoSrcSet = (id: string, widths = [640, 960, 1280, 1920]) =>
  widths.map((w) => `${photoUrl(id, w)} ${w}w`).join(', ');

/* -------------------------------------------------------------------------- */
/* Assignments — which photo illustrates which part of the taxonomy.           */
/* Kept as data so a real photo library slots in without touching components.  */
/* -------------------------------------------------------------------------- */

export const DIRECTION_PHOTO: Record<string, PhotoKey> = {
  ecosystem: 'valleyVillage',
  trade: 'cheeseCounter',
  service: 'labBench',
  supply: 'processLine',
  production: 'barnAisle',
};

export const STAGE_PHOTO = {
  upstream: 'herdPasture',
  midstream: 'bottlingLine',
  downstream: 'coldTruck',
} as const satisfies Record<string, PhotoKey>;

/** Sub-direction → photo. Anything unlisted falls back to its direction's photo. */
export const SUB_PHOTO: Record<string, PhotoKey> = {
  'ecosystem/knowledge': 'labBench',
  'ecosystem/reference': 'labVials',
  'ecosystem/experience': 'herdPasture',
  'ecosystem/marketplace': 'cheeseCounter',
  'trade/international': 'cheeseAging',
  'trade/wholesale': 'milkBottles',
  'trade/distribution': 'warehouse',
  'trade/retail': 'cheeseCounter',
  'trade/e-commerce': 'milkBottles',
  'service/engineering': 'processLine',
  'service/implementation': 'packagingLine',
  'service/operation': 'milkingHall',
  'service/development': 'bottlingLine',
  'supply/infrastructure': 'barnHousing',
  'supply/equipment': 'bottlingLine',
  'supply/inputs': 'forage',
  'supply/workforce': 'labVials',
  'supply/capital': 'valleyVillage',
  'production/upstream': 'herdPasture',
  'production/midstream': 'processLine',
  'production/contract': 'packagingLine',
  'production/grid': 'grazingHill',
};

export const photoForSub = (direction: string, sub: string): PhotoKey =>
  SUB_PHOTO[`${direction}/${sub}`] ?? DIRECTION_PHOTO[direction] ?? 'herdPasture';

/** Offering → photo, for the trade and production cards that carry imagery. */
export const OFFERING_PHOTO: Record<string, PhotoKey> = {
  'georgian-cheese-export': 'cheeseAging',
  'wholesale-dairy-catalog': 'milkBottles',
  'national-distribution': 'coldTruck',
  'geo-dairy-farms': 'herdPasture',
  'processing-facilities': 'processLine',
  'private-label-manufacturing': 'packagingLine',
  'milking-systems': 'milkingHall',
  'milk-cooling-tanks': 'processLine',
  'compound-feed': 'forage',
  'genetics-breeding-stock': 'barnHousing',
  'dairy-academy': 'labBench',
  'dairy-market': 'cheeseCounter',
};
