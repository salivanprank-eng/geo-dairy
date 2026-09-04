import { useMemo, useState } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import { GLOSSARY, GLOSSARY_CATEGORIES, type GlossaryCategory } from '@/data/glossary';
import { useLang, useT, useUI } from '@/lib/i18n';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { FilterChips, Reveal } from '@/components/ui';
import { PrintButton, PrintHeader } from '@/components/Print';

/**
 * P18 GLOSSARY — the terminology dictionary of §12.3, as a page.
 *
 * The inline popovers are the useful half; this is the half that makes the
 * vocabulary citable. It is also the maintenance surface: one list, one agreed
 * KA translation per term, so nobody has to hunt for how "cross-chain" was
 * rendered last time.
 *
 * Both languages are shown on every entry rather than only the active one. A
 * Georgian processor writing an English spec sheet and an importer reading a
 * Georgian certificate have the same problem, and it is the pairing that solves
 * it — not either column alone.
 */
export default function Glossary() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<GlossaryCategory | null>(null);
  const t = useT();
  const ui = useUI();
  const lang = useLang();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return GLOSSARY.filter((g) => {
      if (category && g.category !== category) return false;
      if (!q) return true;
      const hay = [
        g.term.en, g.term.ka, g.aka?.en, g.aka?.ka, g.definition.en, g.definition.ka,
        ...g.match.en, ...g.match.ka,
      ].join(' ').toLowerCase();
      return hay.includes(q);
    });
  }, [query, category]);

  const grouped = GLOSSARY_CATEGORIES
    .map((c) => ({ category: c, terms: results.filter((g) => g.category === c.id) }))
    .filter((g) => g.terms.length > 0);

  return (
    <div>
      <PrintHeader
        kind={ui('printKindGlossary')}
        title={ui('glossaryTitle')}
        meta={`${results.length} / ${GLOSSARY.length}`}
      />

      <section className="no-print border-b border-line bg-milk">
        <div className="shell">
          <Breadcrumbs trail={[{ label: ui('glossaryTitle') }]} />
          <div className="pb-12 md:pb-16 pt-4 max-w-3xl">
            <p className="eyebrow text-brand-deep">{ui('glossaryEyebrow')}</p>
            <h1 className="h-display mt-4 text-[clamp(2.25rem,5vw,3.75rem)]">{ui('glossaryTitle')}</h1>
            <p className="lede mt-5">{ui('glossaryLede')}</p>
            <div className="mt-7">
              <PrintButton label={ui('printGlossary')} />
            </div>
          </div>
        </div>
      </section>

      <div className="shell py-12 md:py-16">
        <div className="no-print flex flex-wrap items-center gap-x-8 gap-y-5">
          <label className="relative flex-1 min-w-[16rem] max-w-md">
            <span className="sr-only">{ui('glossarySearch')}</span>
            <SearchIcon
              size={16}
              aria-hidden
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={ui('glossarySearch')}
              className="w-full bg-milk border border-line rounded-none pl-10 pr-4 py-3 text-[0.9375rem]
                placeholder:text-muted/70 focus:border-brand transition-colors"
            />
          </label>

          <FilterChips
            legend={ui('glossaryCategory')}
            options={GLOSSARY_CATEGORIES.map((c) => c.id)}
            value={category}
            onChange={setCategory}
            renderLabel={(id) => t(GLOSSARY_CATEGORIES.find((c) => c.id === id)!.label)}
          />
        </div>

        <p className="no-print meta mt-6">
          {results.length} / {GLOSSARY.length}
        </p>

        {grouped.length === 0 ? (
          <div className="mt-8 border border-dashed border-line rounded-none p-12 text-center">
            <p className="text-[0.9375rem] text-slate">{ui('noResults')}</p>
          </div>
        ) : (
          <div className="mt-10 space-y-14">
            {grouped.map(({ category: c, terms }) => (
              <section key={c.id}>
                <h2 className="eyebrow pb-3 border-b border-line">{t(c.label)}</h2>
                <dl className="mt-2">
                  {terms.map((g) => (
                    <Reveal key={g.id}>
                      <div
                        id={g.id}
                        className="grid md:grid-cols-12 gap-x-8 gap-y-2 py-6 border-b border-line
                          transition-colors duration-300 hover:bg-milk scroll-mt-28"
                      >
                        <dt className="md:col-span-4">
                          <span className="block text-[1.0625rem] font-semibold leading-snug">
                            {t(g.term)}
                          </span>
                          {g.aka && <span className="meta block mt-1">{t(g.aka)}</span>}
                          {/* The other language, always. The pairing is the point. */}
                          <span className="block mt-2 text-[0.875rem] text-muted">
                            {lang === 'ka' ? g.term.en : g.term.ka}
                          </span>
                        </dt>
                        <dd className="md:col-span-8 text-[0.9375rem] text-slate leading-[1.65]">
                          {t(g.definition)}
                        </dd>
                      </div>
                    </Reveal>
                  ))}
                </dl>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
