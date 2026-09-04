import type { I18n } from '@/lib/types';

/**
 * DIRECTION STORIES — editorial content, for review.
 * ==================================================
 *
 * Everything here is authored. It is derived from the taxonomy's own labels and
 * definitions and kept structural rather than promissory — "a facility that
 * runs", never "a facility that pays back in three years" — but it states things
 * the taxonomy only implies, and **GEO Dairy should sign it off before launch**.
 *
 * It lives in one file, apart from the components, so review is a single pass
 * over prose rather than an archaeology of JSX. Nothing here is a number, a
 * date, a price or a capacity: those would be invented precision, and §11.1
 * rules them out.
 *
 * One map. Trade needs a destination column because its own stage column would
 * print the same word five times; every other section says what it needs to say
 * with the taxonomy's own labels and definitions.
 *
 * Earlier passes added service deliverables and production control tiers here.
 * Those are kept in the scratchpad snapshot rather than left as dead exports.
 */

/* ========================================================================== */
/* Trade — where each channel's product ends up                              */
/* ========================================================================== */

/**
 * The destination is the useful column. Every Trade sub-direction is downstream,
 * so a stage column would print the same word five times — and a column where
 * every row agrees carries no information at all.
 */
export const TRADE_DESTINATION: Record<string, I18n> = {
  international: { en: 'Export markets', ka: 'საექსპორტო ბაზრები' },
  distribution: { en: 'National network', ka: 'ეროვნული ქსელი' },
  wholesale: { en: 'Trade buyers', ka: 'საბითუმო მყიდველები' },
  retail: { en: 'Shelves and counters', ka: 'თაროები და დახლები' },
  'e-commerce': { en: 'Doorsteps', ka: 'კარამდე' },
};
