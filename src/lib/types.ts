/** Core content model — brief §13 (CMS & Content-Model Architecture). */

export type Lang = 'en' | 'ka';

/** Bilingual string. KA and EN are first-class versions (§3.1). */
export type I18n = Record<Lang, string>;

export type DirectionId = 'ecosystem' | 'trade' | 'service' | 'supply' | 'production';

/** §1.2 — Cross-Chain is a tag, not a fourth value-chain level. */
export type Stage = 'upstream' | 'midstream' | 'downstream' | 'cross-chain';

export type PageType =
  | 'direction' | 'sub-direction' | 'service' | 'supply' | 'trade' | 'product'
  | 'production' | 'grid' | 'platform' | 'project' | 'reference' | 'corporate'
  | 'audience' | 'search' | 'contact' | 'legal';

export type Audience =
  | 'farmer' | 'processor' | 'buyer' | 'supplier' | 'professional'
  | 'investor' | 'institution' | 'consumer' | 'international';

/** §8.1 — controlled CTA taxonomy. Generic "Contact us" is deliberately last-resort. */
export type CtaType =
  | 'service-request' | 'quote' | 'trade-inquiry' | 'supplier-application'
  | 'provider-application' | 'grid-participation' | 'investment' | 'career' | 'contact';

export interface SubDirection {
  slug: string;
  direction: DirectionId;
  label: I18n;
  /** One-line definition shown in the mega menu (§4.3). */
  definition: I18n;
  /** Longer purpose statement for the portfolio landing hero (§5). */
  purpose: I18n;
  /** Value-chain stages this sub-direction typically covers. */
  stages: Stage[];
  primaryCta: CtaType;
  secondaryCta?: CtaType;
  /** Page type the offerings under this sub-direction render as (§9). */
  offeringPageType: PageType;
}

export interface Direction {
  id: DirectionId;
  order: number;
  label: I18n;
  definition: I18n;
  /** Landing-page positioning paragraph (P02). */
  intro: I18n;
  /** CSS custom-property name for the direction accent. */
  accent: string;
  accentInk: string;
  subs: SubDirection[];
}

/** A card in a sub-direction portfolio (P03) → offering page (P04–P08). */
export interface Offering {
  slug: string;
  direction: DirectionId;
  sub: string;
  title: I18n;
  summary: I18n;
  stages: Stage[];
  /** Technical domain tag — genetics, feed, milking, processing, cold chain… (§13) */
  domains: string[];
  audiences: Audience[];
  featured?: boolean;
}

export interface NavigatorIntent {
  id: string;
  label: I18n;
  /** Directions this intent routes into — may be more than one (§7.1 step 3). */
  routes: { direction: DirectionId; sub: string }[];
  cta: CtaType;
}
