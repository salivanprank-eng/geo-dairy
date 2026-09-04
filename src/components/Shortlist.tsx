import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, BookmarkCheck, X, ArrowRight, Trash2 } from 'lucide-react';
import { useShortlist, type ShortlistItem } from '@/lib/shortlist';
import { getOffering } from '@/data/offerings';
import { getDirection, getSub } from '@/data/taxonomy';
import { useHref, useT, useUI } from '@/lib/i18n';
import { accentVars } from '@/components/ui';

/**
 * The control that puts something on the shortlist.
 *
 * Rendered as a sibling of the card's link rather than inside it: a button
 * nested in an anchor is invalid, and more practically the click would be
 * swallowed by the link on its way up.
 */
export function ShortlistToggle({
  item, className = '', label = false,
}: { item: ShortlistItem; className?: string; label?: boolean }) {
  const { has, toggle } = useShortlist();
  const ui = useUI();
  const on = has(item.slug);
  const text = on ? ui('slRemove') : ui('slAdd');

  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label={label ? undefined : text}
      title={label ? undefined : text}
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(item); }}
      className={`no-print inline-flex items-center gap-2 rounded-[2px] border transition-colors duration-200
        ${label ? 'px-4 py-3 text-[0.875rem] font-medium' : 'p-2'}
        ${on
          ? 'bg-brand-soft border-brand/40 text-brand-deep'
          : 'bg-milk/92 border-line text-slate hover:border-line-strong hover:text-ink'} ${className}`}
    >
      {on ? <BookmarkCheck size={16} aria-hidden /> : <Bookmark size={16} aria-hidden />}
      {label && <span>{text}</span>}
    </button>
  );
}

/* -------------------------------------------------------------------------- */

/** The tray: a persistent count, and a panel listing what has been collected. */
export function ShortlistTray() {
  const { items, count, remove, clear, lastAdded } = useShortlist();
  const [open, setOpen] = useState(false);
  const [pulse, setPulse] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const t = useT();
  const ui = useUI();
  const href = useHref();

  // A short pulse on the count is the only feedback an "add" gets from across
  // the page, so it has to be noticeable without stealing focus.
  useEffect(() => {
    if (!lastAdded) return;
    setPulse(true);
    const id = window.setTimeout(() => setPulse(false), 600);
    return () => window.clearTimeout(id);
  }, [lastAdded]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    const onClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, [open]);

  // Nothing collected and nothing open: the tray stays out of the way entirely.
  if (count === 0 && !open) {
    return (
      <p className="sr-only" aria-live="polite">
        {`0 ${ui('slItems')}`}
      </p>
    );
  }

  const params = new URLSearchParams({ type: 'quote' });
  if (items[0]) { params.set('direction', items[0].direction); params.set('sub', items[0].sub); }
  params.set('shortlist', items.map((i) => i.slug).join(','));

  return (
    <div ref={panelRef} className="no-print fixed bottom-5 right-5 z-[60] flex flex-col items-end gap-3">
      {open && (
        <div className="w-[min(24rem,calc(100vw-2.5rem))] bg-cream border border-line rounded-[2px] shadow-lg-x overflow-hidden">
          <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-line">
            <p className="text-[0.9375rem] font-semibold">{ui('slTitle')}</p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={ui('close')}
              className="p-1.5 rounded-none hover:bg-mist transition-colors"
            >
              <X size={17} aria-hidden />
            </button>
          </div>

          <ul className="max-h-[46vh] overflow-y-auto divide-y divide-line">
            {items.map((i) => {
              const o = getOffering(i.direction, i.sub, i.slug);
              const d = getDirection(i.direction);
              const sd = getSub(i.direction, i.sub);
              if (!o || !d || !sd) return null;
              return (
                <li key={i.slug} style={accentVars(d.id)} className="flex items-start gap-3 px-5 py-3">
                  <span aria-hidden className="mt-1.5 w-1 h-6 shrink-0 rounded-[1px] bg-[var(--accent)]" />
                  <span className="flex-1 min-w-0">
                    <Link
                      to={href(`/${i.direction}/${i.sub}/${i.slug}`)}
                      onClick={() => setOpen(false)}
                      className="block text-[0.9375rem] font-medium leading-snug hover:text-[var(--accent-ink)] transition-colors"
                    >
                      {t(o.title)}
                    </Link>
                    <span className="meta block mt-0.5 truncate">{t(d.label)} · {t(sd.label)}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => remove(i.slug)}
                    aria-label={`${ui('slRemove')}: ${t(o.title)}`}
                    className="p-1.5 rounded-none text-muted hover:text-ink hover:bg-mist transition-colors"
                  >
                    <X size={15} aria-hidden />
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2 px-5 py-4 border-t border-line bg-parchment/60">
            <Link
              to={`${href('/inquiry')}?${params.toString()}`}
              onClick={() => setOpen(false)}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-brand-deep text-milk
                text-[0.875rem] font-medium px-4 py-3 rounded-[2px] hover:bg-ink transition-colors"
            >
              {ui('slSendAll')} <ArrowRight size={15} aria-hidden />
            </Link>
            <button
              type="button"
              onClick={clear}
              aria-label={ui('slClear')}
              className="p-3 rounded-[2px] border border-line text-slate hover:text-ink hover:border-line-strong transition-colors"
            >
              <Trash2 size={16} aria-hidden />
            </button>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className={`inline-flex items-center gap-2.5 bg-ink text-milk pl-4 pr-3 py-3 rounded-[2px]
          shadow-md-x hover:bg-graphite transition-[background-color,transform] duration-200
          ${pulse ? 'scale-[1.06]' : 'scale-100'}`}
      >
        <Bookmark size={16} aria-hidden />
        <span className="text-[0.875rem] font-medium">{ui('slTitle')}</span>
        <span className="min-w-6 h-6 inline-flex items-center justify-center rounded-full bg-signal text-ink font-mono text-[0.75rem] font-medium px-1.5">
          {count}
        </span>
      </button>

      <p className="sr-only" aria-live="polite">{`${count} ${ui('slItems')}`}</p>
    </div>
  );
}
