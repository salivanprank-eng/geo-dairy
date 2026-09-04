import { DIRECTIONS, SUB_DIRECTIONS } from '@/data/taxonomy';
import { OFFERINGS } from '@/data/offerings';
import { PAGES } from '@/data/pages';
import { INTENTS } from '@/data/navigator';
import { GLOSSARY } from '@/data/glossary';
import { GEORGIA_REGIONS } from '@/data/regions';
import { REGION_PROFILES } from '@/data/region-profiles';
import { AUDIENCES } from '@/data/site';
import type { DirectionId, I18n, Lang, Stage } from '@/lib/types';

/**
 * One search index for the whole site — brief §6 / §15.
 * The command palette and the results page read the same rows, so a thing that
 * is findable in one is findable in the other. Rows carry their taxonomy, which
 * is what lets a result say *where it sits* rather than just what it is called.
 */

export type EntryKind = 'direction' | 'sub' | 'offering' | 'page' | 'intent' | 'audience' | 'term' | 'region';

export interface Entry {
  id: string;
  kind: EntryKind;
  to: string;
  label: I18n;
  hint: I18n;
  direction?: DirectionId;
  stages?: Stage[];
  /** Extra words that should match but are not displayed. */
  keywords?: string;
}

export function buildIndex(): Entry[] {
  const rows: Entry[] = [];

  for (const d of DIRECTIONS) {
    rows.push({
      id: `d:${d.id}`, kind: 'direction', to: `/${d.id}`, direction: d.id,
      label: d.label, hint: d.definition,
      stages: [...new Set(d.subs.flatMap((s) => s.stages))],
      keywords: d.subs.map((s) => `${s.label.en} ${s.label.ka}`).join(' '),
    });
  }

  for (const s of SUB_DIRECTIONS) {
    rows.push({
      id: `s:${s.direction}:${s.slug}`, kind: 'sub', to: `/${s.direction}/${s.slug}`,
      direction: s.direction, label: s.label, hint: s.definition, stages: s.stages,
      keywords: `${s.purpose.en} ${s.slug}`,
    });
  }

  for (const o of OFFERINGS) {
    rows.push({
      id: `o:${o.direction}:${o.slug}`, kind: 'offering', to: `/${o.direction}/${o.sub}/${o.slug}`,
      direction: o.direction, label: o.title, hint: o.summary, stages: o.stages,
      keywords: `${o.domains.join(' ')} ${o.audiences.join(' ')} ${o.slug}`,
    });
  }

  for (const p of PAGES) {
    rows.push({
      id: `p:${p.path}`, kind: 'page', to: p.path, label: p.title, hint: p.purpose,
      keywords: p.sections.map((x) => x.en).join(' '),
    });
  }

  // Terminology is searchable in its own right: someone who types "HACCP" or
  // "somatic cell" wants the definition, not the offerings that mention it.
  for (const g of GLOSSARY) {
    rows.push({
      id: `t:${g.id}`, kind: 'term', to: `/glossary#${g.id}`,
      label: g.term, hint: g.definition,
      keywords: `${g.aka?.en ?? ''} ${g.aka?.ka ?? ''} ${g.match.en.join(' ')} ${g.match.ka.join(' ')}`,
    });
  }

  for (const r of GEORGIA_REGIONS) {
    const profile = REGION_PROFILES[r.id];
    rows.push({
      id: `r:${r.id}`, kind: 'region', to: `/regions/${r.id}`,
      label: { en: r.en, ka: r.ka },
      hint: profile?.role ?? { en: 'Region', ka: 'რეგიონი' },
      keywords: `${profile?.context.en ?? ''} ${r.id.replace(/-/g, ' ')}`,
    });
  }

  for (const i of INTENTS) {
    rows.push({
      id: `i:${i.id}`, kind: 'intent',
      to: `/inquiry?type=${i.cta}&direction=${i.routes[0].direction}&sub=${i.routes[0].sub}&intent=${i.id}`,
      label: i.label,
      hint: {
        en: `Navigator · routes into ${i.routes.map((r) => r.sub).join(', ')}`,
        ka: `ნავიგატორი · მიემართება: ${i.routes.map((r) => r.sub).join(', ')}`,
      },
      keywords: i.id.replace(/-/g, ' '),
    });
  }

  for (const a of AUDIENCES) {
    rows.push({
      id: `a:${a.slug}`, kind: 'audience', to: `/work-with-us/${a.slug}`,
      label: a.label, hint: a.need, keywords: a.slug.replace(/-/g, ' '),
    });
  }

  return rows;
}

/* -------------------------------------------------------------------------- */
/* Scoring                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Deliberately small: an exact or prefix hit on the label always outranks a
 * loose hit in body text. A visitor typing "equip" wants Equipment first, not an
 * offering whose description happens to mention equipment.
 */
function substringScore(query: string, haystack: string, weight: number): number {
  const i = haystack.indexOf(query);
  if (i === -1) return 0;
  if (i === 0) return weight * 2;          // starts with it
  if (haystack[i - 1] === ' ') return weight * 1.5; // starts a word
  return weight;
}

/**
 * Typo/abbreviation tolerance — but ONLY on the short label, and only when the
 * matched letters sit close together.
 *
 * An unconstrained subsequence match is worse than no fuzziness at all: the
 * letters of "cheese" can be found scattered through almost any long sentence,
 * which is exactly how "cheese" came to return "Midstream" and "Knowledge".
 */
function compactSubsequenceScore(query: string, label: string, weight: number): number {
  let qi = 0;
  let start = -1;
  let end = -1;
  for (let i = 0; i < label.length && qi < query.length; i++) {
    if (label[i] === query[qi]) {
      if (qi === 0) start = i;
      end = i;
      qi++;
    }
  }
  if (qi !== query.length) return 0;
  const span = end - start + 1;
  // The letters must be nearly contiguous: "milkcool" may find "milk cooling",
  // "cheese" may not find "te-c-h-nical know-l-edg-e".
  return span <= query.length * 1.8 ? weight : 0;
}

const KIND_BIAS: Record<EntryKind, number> = {
  direction: 1.35, sub: 1.25, intent: 1.15, offering: 1, region: 1, audience: 1,
  // A definition is a good answer when it is what you asked for and a poor one
  // when you were looking for something to buy, so terminology sits just below
  // the commercial rows and just above the institutional pages.
  term: 0.95, page: 0.9,
};

export function searchIndex(rows: Entry[], raw: string, lang: Lang): Entry[] {
  const query = raw.trim().toLowerCase();
  if (!query) return [];
  const terms = query.split(/\s+/).filter(Boolean);

  return rows
    .map((row) => {
      const label = `${row.label[lang]} ${row.label.en}`.toLowerCase();
      const hint = `${row.hint[lang]} ${row.hint.en}`.toLowerCase();
      const extra = (row.keywords ?? '').toLowerCase();

      let score = 0;
      for (const term of terms) {
        let s =
          substringScore(term, label, 10) +
          substringScore(term, extra, 3) +
          substringScore(term, hint, 2);
        if (s === 0 && term.length >= 4) s = compactSubsequenceScore(term, label, 3);
        // Every term must match something, or the row is not a result at all.
        if (s === 0) return { row, score: 0 };
        score += s;
      }
      return { row, score: score * KIND_BIAS[row.kind] };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((r) => r.row);
}
