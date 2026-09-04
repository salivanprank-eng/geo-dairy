import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Compass, UserRound, Menu, X, ChevronDown, ArrowRight, ClipboardList } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { DIRECTIONS } from '@/data/taxonomy';
import { featuredOfferings } from '@/data/offerings';
import { useHref, useT, useUI, useLang, useAltLangPath } from '@/lib/i18n';
import { accentVars } from '@/components/ui';
import type { DirectionId } from '@/lib/types';

/**
 * GLOBAL HEADER — brief §4.2 / §4.3.
 * The five directions visually dominate. Utility functions are small controls,
 * never additional main-menu items. Menus open on click AND hover, and every
 * menu is fully operable by keyboard (§12.4 — no hover-only navigation).
 */
export function Header({ onOpenNavigator, onOpenSearch }: { onOpenNavigator: () => void; onOpenSearch: () => void }) {
  const [open, setOpen] = useState<DirectionId | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  /** The mega-menu panel is a sibling of the nav row, so the outside-click guard
   *  has to be the whole header — guarding only the nav row closed the panel on
   *  mousedown and killed the click on its own links. */
  const headerRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number | undefined>(undefined);
  const { pathname } = useLocation();
  const t = useT();
  const ui = useUI();
  const href = useHref();
  const lang = useLang();
  const altPath = useAltLangPath(lang === 'en' ? 'ka' : 'en');

  // Close menus on navigation.
  useEffect(() => { setOpen(null); setMobileOpen(false); }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setOpen(null); setMobileOpen(false); }
    };
    const onClick = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) setOpen(null);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('mousedown', onClick); };
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const hoverOpen = (id: DirectionId) => {
    window.clearTimeout(closeTimer.current);
    setOpen(id);
  };
  const hoverClose = () => {
    // Long enough to cross the gap between the nav row and the panel without
    // hurrying the pointer — a menu that outruns the mouse is unusable.
    closeTimer.current = window.setTimeout(() => setOpen(null), 260);
  };

  return (
    <header
      ref={headerRef}
      onMouseLeave={hoverClose}
      className={`no-print sticky top-0 z-50 bg-cream/95 backdrop-blur-sm transition-shadow ${
        scrolled || open ? 'shadow-[0_1px_0_var(--color-line),0_10px_30px_-24px_rgba(11,26,20,0.5)]' : 'border-b border-line'
      }`}
    >
      <div className="shell">
        <div className="flex items-center justify-between h-[68px] md:h-[76px] gap-4">
          <Link to={href('/')} className="shrink-0" aria-label={`${ui('brand')} — ${ui('home')}`}>
            <Logo />
          </Link>

          {/* ---------- Primary navigation: the five directions only (§4.1) ---------- */}
          {/* No onMouseLeave here: moving the pointer anywhere inside the header,
              including down into the panel, must not start a close timer. */}
          <div ref={navRef} className="hidden lg:flex items-center h-full">
            <nav aria-label={ui('directions')} className="flex items-center h-full">
              {DIRECTIONS.map((d) => {
                const isOpen = open === d.id;
                const isActive = pathname.startsWith(href(`/${d.id}`));
                return (
                  <div key={d.id} className="h-full" onMouseEnter={() => hoverOpen(d.id)}>
                    {/* A link, not a toggle. Hover (or ArrowDown) opens the panel;
                        clicking goes to the direction landing page. A button here
                        fought itself: hover opened the panel and the click that
                        followed closed it again before it could be used. */}
                    <Link
                      to={href(`/${d.id}`)}
                      aria-expanded={isOpen}
                      aria-haspopup="true"
                      onFocus={() => hoverOpen(d.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'ArrowDown') {
                          e.preventDefault();
                          hoverOpen(d.id);
                          // Let the panel render, then hand it the focus.
                          window.setTimeout(() => panelRef.current?.querySelector<HTMLElement>('a')?.focus(), 0);
                        }
                      }}
                      style={accentVars(d.id)}
                      className={`relative h-full px-4 xl:px-5 flex items-center gap-1.5 text-[0.9375rem] font-medium transition-colors ${
                        isOpen || isActive ? 'text-ink' : 'text-slate hover:text-ink'
                      }`}
                    >
                      {t(d.label)}
                      <ChevronDown size={14} aria-hidden className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                      <span
                        aria-hidden
                        className={`absolute inset-x-3 bottom-0 h-[3px] bg-[var(--accent)] transition-transform origin-left ${
                          isOpen || isActive ? 'scale-x-100' : 'scale-x-0'
                        }`}
                      />
                    </Link>
                  </div>
                );
              })}
            </nav>
          </div>

          {/* ---------- Utility controls (§4.2) ---------- */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Sits beside the Navigator because it answers the neighbouring
                question: the Navigator routes by intent, this one assembles a
                project. Text rather than a second filled button — two primary
                actions in a header cancel each other out. */}
            <Link
              to={href('/plan')}
              className="hidden lg:inline-flex items-center gap-2 px-3 py-2.5 text-[0.8125rem] font-medium
                text-slate hover:text-ink hover:bg-milk border border-transparent hover:border-line
                rounded-none transition-colors"
            >
              <ClipboardList size={15} aria-hidden />
              {ui('planTitle')}
            </Link>

            <button
              type="button"
              onClick={onOpenNavigator}
              className="hidden sm:inline-flex items-center gap-2 bg-brand-deep text-milk font-semibold text-[0.8125rem] px-4 py-2.5 rounded-none hover:bg-ink transition-colors"
            >
              <Compass size={15} aria-hidden />
              {ui('navigator')}
            </button>

            {/* Opens the palette rather than a results page: the fastest search
                is the one that never leaves the page you are reading (§6). */}
            <button
              type="button"
              onClick={onOpenSearch}
              aria-label={ui('search')}
              className="group/s flex items-center gap-2 pl-3 pr-2 py-2 text-slate border border-transparent
                hover:text-ink hover:bg-milk hover:border-line rounded-none transition-colors"
            >
              <Search size={17} aria-hidden />
              <kbd className="hidden xl:block font-mono text-[0.625rem] tracking-[0.06em] text-muted
                border border-line rounded-[2px] px-1.5 py-0.5 bg-cream group-hover/s:border-line-strong">
                ⌘K
              </kbd>
            </button>

            <Link
              to={altPath}
              hrefLang={lang === 'en' ? 'ka' : 'en'}
              aria-label={ui('language')}
              className="px-2.5 py-2 text-[0.8125rem] font-semibold text-slate hover:text-ink hover:bg-mist rounded-none transition-colors"
            >
              {lang === 'en' ? 'ქა' : 'EN'}
            </Link>

            {/* Account is reserved for Phase 3 (§17) — visible, deliberately inert. */}
            <button
              type="button"
              disabled
              aria-label={`${ui('account')} — Phase 3`}
              title={`${ui('account')} — Phase 3`}
              className="hidden md:inline-flex p-2.5 text-muted/50 rounded-none cursor-not-allowed"
            >
              <UserRound size={18} aria-hidden />
            </button>

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label={ui('menu')}
              className="lg:hidden p-2.5 text-ink hover:bg-mist rounded-none transition-colors"
            >
              <Menu size={20} aria-hidden />
            </button>
          </div>
        </div>
      </div>

      {/* ---------- Mega menu: second-level categories only (§4.3) ---------- */}
      {open && (
        <div
          ref={panelRef}
          className="hidden lg:block absolute inset-x-0 top-full bg-milk border-y border-line shadow-[0_24px_48px_-32px_rgba(11,26,20,0.45)]"
          onMouseEnter={() => window.clearTimeout(closeTimer.current)}
          onMouseLeave={hoverClose}
        >
          <MegaMenu id={open} />
        </div>
      )}

      {mobileOpen && (
        <MobileMenu
          onClose={() => setMobileOpen(false)}
          onOpenNavigator={onOpenNavigator}
          onOpenSearch={onOpenSearch}
        />
      )}
    </header>
  );
}

/* -------------------------------------------------------------------------- */

function MegaMenu({ id }: { id: DirectionId }) {
  const d = DIRECTIONS.find((x) => x.id === id)!;
  const t = useT();
  const ui = useUI();
  const href = useHref();
  const featured = featuredOfferings().filter((o) => o.direction === id).slice(0, 3);

  return (
    <div className="shell py-10" style={accentVars(id)}>
      <div className="grid grid-cols-12 gap-10">
        <div className="col-span-3 menu-in">
          <p className="eyebrow text-[var(--accent-ink)]">{String(d.order).padStart(2, '0')}</p>
          <h2 className="mt-2 text-[1.75rem] font-semibold">{t(d.label)}</h2>
          <p className="mt-3 text-[0.9375rem] text-slate leading-relaxed">{t(d.definition)}</p>
          <Link
            to={href(`/${d.id}`)}
            className="mt-5 inline-flex items-center gap-2 text-[0.875rem] font-semibold text-[var(--accent-ink)] hover:gap-3 transition-all"
          >
            {ui('exploreDirection')} {t(d.label)} <ArrowRight size={15} aria-hidden />
          </Link>
        </div>

        <div
          style={{ ['--d' as string]: '55ms' }}
          className={`col-span-6 menu-in grid gap-x-8 gap-y-1 ${d.subs.length > 6 ? 'grid-cols-3' : 'grid-cols-2'}`}
        >
          {d.subs.map((s) => (
            <Link
              key={s.slug}
              to={href(`/${d.id}/${s.slug}`)}
              className="group py-2.5 border-b border-line/70 last:border-0"
            >
              <span className="link-sweep inline-block text-[0.9375rem] font-medium group-hover:text-[var(--accent-ink)] transition-colors">
                {t(s.label)}
              </span>
              <span className="block text-[0.8125rem] text-muted leading-snug mt-0.5 line-clamp-2">
                {t(s.definition)}
              </span>
            </Link>
          ))}
        </div>

        {featured.length > 0 && (
          <div style={{ ['--d' as string]: '110ms' }} className="col-span-3 menu-in border-l border-line pl-8">
            <p className="eyebrow mb-4">{ui('featured')}</p>
            <ul className="space-y-3">
              {featured.map((o) => (
                <li key={o.slug}>
                  <Link
                    to={href(`/${o.direction}/${o.sub}/${o.slug}`)}
                    className="group flex items-start gap-2 text-[0.875rem] font-medium hover:text-[var(--accent-ink)] transition-colors"
                  >
                    <ArrowRight size={14} aria-hidden className="mt-1 shrink-0 text-[var(--accent)]" />
                    {t(o.title)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function MobileMenu({ onClose, onOpenNavigator, onOpenSearch }: { onClose: () => void; onOpenNavigator: () => void; onOpenSearch: () => void }) {
  const [expanded, setExpanded] = useState<DirectionId | null>(null);
  const t = useT();
  const ui = useUI();
  const href = useHref();
  const lang = useLang();
  const altPath = useAltLangPath(lang === 'en' ? 'ka' : 'en');

  return (
    <div className="lg:hidden fixed inset-0 z-50 bg-cream flex flex-col">
      <div className="shell flex items-center justify-between h-[68px] border-b border-line">
        <Logo />
        <button type="button" onClick={onClose} aria-label={ui('close')} className="p-2.5 hover:bg-mist rounded-none">
          <X size={22} aria-hidden />
        </button>
      </div>

      <nav aria-label={ui('directions')} className="flex-1 overflow-y-auto shell py-6">
        {DIRECTIONS.map((d) => {
          const isOpen = expanded === d.id;
          return (
            <div key={d.id} style={accentVars(d.id)} className="border-b border-line">
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setExpanded(isOpen ? null : d.id)}
                className="w-full flex items-center justify-between py-4 text-left"
              >
                <span className="flex items-center gap-3">
                  <span aria-hidden className="w-1 h-6 bg-[var(--accent)]" />
                  <span className="text-[1.125rem] font-semibold">{t(d.label)}</span>
                </span>
                <ChevronDown size={18} aria-hidden className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </button>
              {isOpen && (
                <div className="pb-4 pl-4">
                  <p className="text-[0.875rem] text-slate mb-3">{t(d.definition)}</p>
                  <ul className="space-y-0.5">
                    {d.subs.map((s) => (
                      <li key={s.slug}>
                        <Link to={href(`/${d.id}/${s.slug}`)} className="block py-2 text-[0.9375rem]">
                          {t(s.label)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link
                    to={href(`/${d.id}`)}
                    className="mt-3 inline-flex items-center gap-2 text-[0.875rem] font-semibold text-[var(--accent-ink)]"
                  >
                    {ui('exploreDirection')} {t(d.label)} <ArrowRight size={14} aria-hidden />
                  </Link>
                </div>
              )}
            </div>
          );
        })}

        <div className="mt-8 space-y-3">
          <button
            type="button"
            onClick={() => { onClose(); onOpenNavigator(); }}
            className="w-full inline-flex items-center justify-center gap-2 bg-brand-deep text-milk font-semibold text-[0.9375rem] px-5 py-3.5 rounded-none"
          >
            <Compass size={16} aria-hidden /> {ui('navigatorFull')}
          </button>
          <Link
            to={href('/plan')}
            onClick={onClose}
            className="w-full inline-flex items-center justify-center gap-2 border border-line bg-milk
              font-semibold text-[0.9375rem] px-5 py-3.5 rounded-none"
          >
            <ClipboardList size={16} aria-hidden /> {ui('planTitle')}
          </Link>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => { onClose(); onOpenSearch(); }}
              className="flex-1 inline-flex items-center justify-center gap-2 border border-line bg-milk py-3 rounded-none text-[0.875rem] font-medium"
            >
              <Search size={15} aria-hidden /> {ui('search')}
            </button>
            <Link to={altPath} className="flex-1 inline-flex items-center justify-center border border-line bg-milk py-3 rounded-none text-[0.875rem] font-semibold">
              {lang === 'en' ? 'ქართული' : 'English'}
            </Link>
          </div>
          <Link to={href('/about')} className="block py-2 text-[0.9375rem] text-slate">
            {lang === 'ka' ? 'GEO Dairy-ის შესახებ' : 'About GEO Dairy'}
          </Link>
          <Link to={href('/inquiry')} className="block py-2 text-[0.9375rem] text-slate">
            {lang === 'ka' ? 'კონტაქტი' : 'Contact'}
          </Link>
        </div>
      </nav>
    </div>
  );
}
