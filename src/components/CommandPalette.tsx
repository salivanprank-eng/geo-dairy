import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, CornerDownLeft, ArrowUp, ArrowDown, Compass } from 'lucide-react';
import { buildIndex, searchIndex, type Entry, type EntryKind } from '@/lib/searchIndex';
import { getDirection } from '@/data/taxonomy';
import { useHref, useLang, useT, useUI } from '@/lib/i18n';
import { accentVars } from '@/components/ui';
import type { I18n } from '@/lib/types';

/**
 * COMMAND PALETTE — ⌘K / Ctrl-K.
 *
 * The brief asks for site search across content, services, supplies, products,
 * projects and references (§6). A search *page* satisfies that literally; this
 * satisfies it in the way a person actually works — every route in the taxonomy
 * one keystroke away, without leaving the page they are reading.
 *
 * Results state their taxonomy position, so the palette teaches the structure
 * while it navigates: a visitor who searches "cheese" learns that it lives under
 * Trade → International before they arrive there.
 */

const KIND_LABEL: Record<EntryKind, I18n> = {
  direction: { en: 'Direction', ka: 'მიმართულება' },
  sub: { en: 'Sub-direction', ka: 'ქვემიმართულება' },
  offering: { en: 'Offering', ka: 'შეთავაზება' },
  page: { en: 'Page', ka: 'გვერდი' },
  intent: { en: 'Navigator', ka: 'ნავიგატორი' },
  audience: { en: 'Audience', ka: 'აუდიტორია' },
  term: { en: 'Terminology', ka: 'ტერმინოლოგია' },
  region: { en: 'Region', ka: 'რეგიონი' },
};

/** Group order for the resting state, before anything is typed. */
const DEFAULT_ORDER: EntryKind[] = ['intent', 'direction', 'sub', 'offering', 'region', 'audience', 'term', 'page'];

export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const restoreTo = useRef<HTMLElement | null>(null);
  const navigate = useNavigate();
  const href = useHref();
  const lang = useLang();
  const t = useT();
  const ui = useUI();

  const index = useMemo(() => buildIndex(), []);

  /** With no query, offer a route in rather than an empty box. */
  const suggestions = useMemo(
    () => index.filter((e) => e.kind === 'direction' || e.kind === 'intent').slice(0, 8),
    [index],
  );
  const results = useMemo(
    () => (query.trim() ? searchIndex(index, query, lang).slice(0, 24) : suggestions),
    [index, query, lang, suggestions],
  );

  useEffect(() => { setActive(0); }, [query]);

  useEffect(() => {
    if (!open) return;
    restoreTo.current = document.activeElement as HTMLElement;
    setQuery('');
    setActive(0);
    document.body.style.overflow = 'hidden';
    const id = window.setTimeout(() => inputRef.current?.focus(), 10);
    return () => {
      window.clearTimeout(id);
      document.body.style.overflow = '';
      restoreTo.current?.focus();
    };
  }, [open]);

  // Keep the highlighted row in view as the arrows move it.
  useEffect(() => {
    if (!open) return;
    listRef.current?.querySelector<HTMLElement>('[data-active="true"]')
      ?.scrollIntoView({ block: 'nearest' });
  }, [active, open]);

  if (!open) return null;

  const go = (entry: Entry) => {
    onClose();
    navigate(href(entry.to));
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { e.preventDefault(); onClose(); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => (a + 1) % Math.max(results.length, 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => (a - 1 + results.length) % Math.max(results.length, 1)); }
    else if (e.key === 'Enter' && results[active]) { e.preventDefault(); go(results[active]); }
  };

  // Grouped for display, but the keyboard walks one flat list — so the groups
  // must be ordered by their best match, not by a fixed kind order. Otherwise
  // the highlighted row (results[0]) is not the row the eye lands on first:
  // searching "cheese" put a sub-direction above the offering actually named
  // "Cheese production equipment".
  const order = query.trim()
    ? [...new Set(results.map((r) => r.kind))]
    : DEFAULT_ORDER;
  const grouped = order
    .map((kind) => ({ kind, rows: results.filter((r) => r.kind === kind) }))
    .filter((g) => g.rows.length > 0);

  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center p-4 pt-[10vh] md:pt-[14vh]">
      <div className="fixed inset-0 bg-ink/55 backdrop-blur-[2px]" onClick={onClose} aria-hidden />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={ui('search')}
        onKeyDown={onKeyDown}
        className="relative w-full max-w-2xl bg-cream border border-line rounded-[2px] shadow-lg-x overflow-hidden flex flex-col max-h-[70vh]"
      >
        <div className="flex items-center gap-3 px-5 border-b border-line">
          <Search size={18} aria-hidden className="text-muted shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={ui('searchPlaceholder')}
            aria-label={ui('search')}
            aria-activedescendant={results[active] ? `cp-${results[active].id}` : undefined}
            className="flex-1 bg-transparent py-4 text-[1rem] outline-none placeholder:text-muted/70"
          />
          <kbd className="hidden sm:block font-mono text-[0.6875rem] text-muted border border-line rounded-[2px] px-1.5 py-0.5">
            ESC
          </kbd>
        </div>

        <div ref={listRef} className="overflow-y-auto py-2" role="listbox">
          {results.length === 0 ? (
            <p className="px-5 py-10 text-center text-[0.9375rem] text-slate">
              {lang === 'ka'
                ? 'შედეგი ვერ მოიძებნა. სცადეთ ნავიგატორი.'
                : 'Nothing matched. The Navigator may find it faster than a keyword.'}
            </p>
          ) : (
            grouped.map((group) => (
              <div key={group.kind} className="px-2 pb-1">
                <p className="eyebrow px-3 pt-3 pb-1.5">{t(KIND_LABEL[group.kind])}</p>
                {group.rows.map((row) => {
                  const i = results.indexOf(row);
                  const d = row.direction ? getDirection(row.direction) : undefined;
                  return (
                    <button
                      key={row.id}
                      id={`cp-${row.id}`}
                      type="button"
                      role="option"
                      aria-selected={i === active}
                      data-active={i === active}
                      onMouseMove={() => setActive(i)}
                      onClick={() => go(row)}
                      style={accentVars(row.direction)}
                      className={`w-full text-left flex items-start gap-3 px-3 py-2.5 rounded-none transition-colors ${
                        i === active ? 'bg-milk shadow-sm-x' : 'hover:bg-milk/60'
                      }`}
                    >
                      <span
                        aria-hidden
                        className={`mt-1.5 w-1 h-6 shrink-0 rounded-[1px] ${
                          row.kind === 'intent' ? 'bg-brand' : 'bg-[var(--accent)]'
                        }`}
                      />
                      <span className="flex-1 min-w-0">
                        <span className="flex items-baseline gap-2">
                          <span className="text-[0.9375rem] font-medium truncate">{t(row.label)}</span>
                          {d && (
                            <span className="eyebrow shrink-0 text-[var(--accent-ink)]">{t(d.label)}</span>
                          )}
                        </span>
                        <span className="block text-[0.8125rem] text-slate truncate">{t(row.hint)}</span>
                      </span>
                      {row.kind === 'intent' && (
                        <Compass size={14} aria-hidden className="mt-1.5 shrink-0 text-brand-deep" />
                      )}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        <div className="flex items-center gap-4 px-5 py-2.5 border-t border-line bg-parchment/60">
          <Legend icon={<ArrowUp size={11} />} label={lang === 'ka' ? 'ნავიგაცია' : 'navigate'} extra={<ArrowDown size={11} />} />
          <Legend icon={<CornerDownLeft size={11} />} label={lang === 'ka' ? 'გახსნა' : 'open'} />
          <span className="ml-auto meta">{results.length}</span>
        </div>
      </div>
    </div>
  );
}

function Legend({ icon, label, extra }: { icon: React.ReactNode; label: string; extra?: React.ReactNode }) {
  return (
    <span className="flex items-center gap-1.5 meta">
      <span className="inline-flex items-center gap-0.5">
        <span className="inline-flex items-center justify-center w-4 h-4 border border-line rounded-[2px] bg-milk">{icon}</span>
        {extra && <span className="inline-flex items-center justify-center w-4 h-4 border border-line rounded-[2px] bg-milk">{extra}</span>}
      </span>
      {label}
    </span>
  );
}

/** Global ⌘K / Ctrl-K. Ignores the shortcut while the visitor is typing elsewhere. */
export function useCommandPalette() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = document.activeElement;
      const typing = el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement
        || (el instanceof HTMLElement && el.isContentEditable);
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === '/' && !typing && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setOpen(true);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  return { open, setOpen };
}
