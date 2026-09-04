import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Compass, ArrowRight, RotateCcw, Search } from 'lucide-react';
import { INTENTS, CONTEXT_QUESTION, matchIntents } from '@/data/navigator';
import { getDirection, getSub } from '@/data/taxonomy';
import { useHref, useT, useUI } from '@/lib/i18n';
import { accentVars, Button } from '@/components/ui';
import type { NavigatorIntent } from '@/lib/types';

/**
 * GEO DAIRY NAVIGATOR — brief §7.
 * Intent → (optional context) → route → convert. Horizontal routing layer that
 * lets a visitor find a solution WITHOUT understanding the five-direction
 * taxonomy (§19). Stage 1: rule-based. The step contract survives into Stage 3.
 */

/**
 * `embedded` is for the homepage section, where the surrounding layout already
 * carries the Navigator title — repeating it inside the panel reads as a bug.
 */
export function NavigatorPanel({ onClose, embedded = false }: { onClose?: () => void; embedded?: boolean }) {
  const [intent, setIntent] = useState<NavigatorIntent | null>(null);
  const [context, setContext] = useState<string | null>(null);
  const [typed, setTyped] = useState('');
  const t = useT();
  const ui = useUI();
  const href = useHref();

  // §7.3 Stage 2 — what the visitor typed, translated into our intents.
  const matches = useMemo(() => matchIntents(typed), [typed]);
  const typing = typed.trim().length >= 2;
  const shown = typing ? matches : INTENTS;

  const reset = () => { setIntent(null); setContext(null); setTyped(''); };
  const showHeader = !embedded || !!intent;

  return (
    <div className="flex flex-col max-h-full">
      {showHeader && (
        <div className="flex items-start justify-between gap-4 p-6 md:p-8 border-b border-line">
          <div>
            {!embedded && (
              <p className="eyebrow flex items-center gap-2">
                <Compass size={14} aria-hidden /> {ui('navigatorFull')}
              </p>
            )}
            <h2 className={`text-[1.5rem] md:text-[1.75rem] font-semibold ${embedded ? '' : 'mt-2'}`}>
              {intent ? t(intent.label) : ui('navIntentQ')}
            </h2>
            {!intent && !embedded && (
              <p className="mt-2 text-[0.9375rem] text-slate max-w-xl">{ui('navIntentHelp')}</p>
            )}
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {intent && (
              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center gap-1.5 text-[0.8125rem] font-medium text-slate hover:text-ink px-3 py-2 rounded-none hover:bg-mist transition-colors"
              >
                <RotateCcw size={14} aria-hidden /> {ui('navRestart')}
              </button>
            )}
            {onClose && (
              <button type="button" onClick={onClose} aria-label={ui('close')} className="p-2.5 hover:bg-mist rounded-none">
                <X size={20} aria-hidden />
              </button>
            )}
          </div>
        </div>
      )}

      <div className="overflow-y-auto p-6 md:p-8">
        {/* Step 1 — intent, said in the visitor's own words or picked from ours */}
        {!intent && (
          <>
            <div className="relative mb-5">
              <Search size={17} aria-hidden className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
              <label htmlFor="nav-intent" className="sr-only">{ui('navIntentQ')}</label>
              <input
                id="nav-intent"
                type="text"
                value={typed}
                onChange={(e) => setTyped(e.target.value)}
                placeholder={ui('navTypePlaceholder')}
                className="w-full bg-milk border border-line rounded-none pl-11 pr-4 py-3.5 text-[0.9375rem]
                  focus:border-brand transition-colors placeholder:text-muted/70"
              />
            </div>
            <p className="eyebrow mb-3" aria-live="polite">
              {typing
                ? (matches.length ? ui('navRecommend') : ui('navNoMatch'))
                : ui('navOrPick')}
            </p>
          </>
        )}
        {!intent && (
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {(shown.length ? shown : INTENTS).map((i) => (
              <li key={i.id}>
                <button
                  type="button"
                  onClick={() => setIntent(i)}
                  className="group w-full text-left flex items-center justify-between gap-3 bg-milk border border-line rounded-none px-4 py-3.5 hover:border-brand hover:bg-brand-soft/40 transition-colors"
                >
                  <span className="text-[0.9375rem] font-medium">{t(i.label)}</span>
                  <ArrowRight size={15} aria-hidden className="shrink-0 text-muted group-hover:text-brand-deep group-hover:translate-x-0.5 transition-all" />
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Step 2 — one qualifying question, only because it changes routing */}
        {intent && !context && (
          <div>
            <p className="text-[0.9375rem] font-medium mb-4">{t(CONTEXT_QUESTION.question)}</p>
            <div className="flex flex-wrap gap-2.5">
              {CONTEXT_QUESTION.options.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => setContext(o.id)}
                  className="bg-milk border border-line rounded-none px-5 py-3 text-[0.9375rem] font-medium hover:border-brand hover:bg-brand-soft/40 transition-colors"
                >
                  {t(o.label)}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Steps 3 + 4 — route and convert */}
        {intent && context && (
          <div>
            <p className="eyebrow mb-4">{ui('navRecommend')}</p>
            <ul className="space-y-2.5">
              {intent.routes.map((r) => {
                const d = getDirection(r.direction)!;
                const s = getSub(r.direction, r.sub)!;
                return (
                  <li key={`${r.direction}/${r.sub}`}>
                    <Link
                      to={href(`/${r.direction}/${r.sub}`)}
                      style={accentVars(r.direction)}
                      className="group flex items-start gap-4 bg-milk border border-line rounded-none p-4 hover:border-[var(--accent)] transition-colors"
                    >
                      <span aria-hidden className="mt-1 w-1 self-stretch bg-[var(--accent)]" />
                      <span className="flex-1">
                        <span className="block eyebrow text-[var(--accent-ink)]">{t(d.label)}</span>
                        <span className="block text-[1.0625rem] font-semibold mt-1">{t(s.label)}</span>
                        <span className="block text-[0.875rem] text-slate mt-1">{t(s.definition)}</span>
                      </span>
                      <ArrowRight size={16} aria-hidden className="mt-1 shrink-0 text-muted group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* §7.1 step 5 — prefill the form from Navigator choices */}
            <div className="mt-7 pt-7 border-t border-line flex flex-wrap items-center gap-3">
              <Button
                to={`/inquiry?type=${intent.cta}&direction=${intent.routes[0].direction}&sub=${intent.routes[0].sub}&intent=${intent.id}&context=${context}`}
              >
                {ui(`cta.${intent.cta}` as never)} <ArrowRight size={15} aria-hidden />
              </Button>
              <p className="text-[0.8125rem] text-muted">
                {ui('navRoutesInto')}: {intent.routes.map((r) => t(getSub(r.direction, r.sub)!.label)).join(' · ')}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/** Modal wrapper — focus-trapped, Escape closes, restores focus on exit. */
export function NavigatorDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const restoreTo = useRef<HTMLElement | null>(null);
  const ui = useUI();

  useEffect(() => {
    if (!open) return;
    restoreTo.current = document.activeElement as HTMLElement;
    document.body.style.overflow = 'hidden';
    ref.current?.querySelector<HTMLElement>('button, a')?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key !== 'Tab' || !ref.current) return;
      const items = ref.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      restoreTo.current?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center p-4 md:p-10 overflow-y-auto">
      <div className="fixed inset-0 bg-ink/55 backdrop-blur-[2px]" onClick={onClose} aria-hidden />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={ui('navigatorFull')}
        className="relative w-full max-w-4xl bg-cream rounded-none shadow-[0_40px_80px_-30px_rgba(11,26,20,0.6)] max-h-[calc(100vh-2rem)] md:max-h-[calc(100vh-5rem)] flex flex-col"
      >
        <NavigatorPanel onClose={onClose} />
      </div>
    </div>
  );
}
