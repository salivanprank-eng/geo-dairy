import { useEffect, useState } from 'react';
import {
  BrowserRouter, Navigate, Outlet, Route, Routes, useLocation, useOutletContext, useParams,
} from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { NavigatorDialog } from '@/components/Navigator';
import { CommandPalette, useCommandPalette } from '@/components/CommandPalette';
import { ShortlistProvider } from '@/lib/shortlist';
import { ShortlistTray } from '@/components/Shortlist';
import { LangProvider, useUI, DEFAULT_LANG } from '@/lib/i18n';
import Home from '@/pages/Home';
import DirectionLanding from '@/pages/DirectionLanding';
import SubDirection from '@/pages/SubDirection';
import Offering from '@/pages/Offering';
import Inquiry from '@/pages/Inquiry';
import Search from '@/pages/Search';
import Plan from '@/pages/Plan';
import Glossary from '@/pages/Glossary';
import Region, { Regions } from '@/pages/Region';
import { GenericPage, NavigatorPage, NotFound, WorkWithUs } from '@/pages/Misc';
import DairyGrid from '@/pages/DairyGrid';

/**
 * ROUTING — brief §6.1.
 * Short, permanent, semantic URLs built from the business taxonomy:
 *   /{lang}/{direction}/{sub-direction}/{offering}
 * Language is a path prefix so KA and EN are separately addressable and can
 * carry hreflang, canonical and sitemap entries.
 */

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    if (!window.location.hash) window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

/** Keeps <title>, canonical and hreflang in step with the route (§12.5). */
function DocumentMeta() {
  // `search` matters: /inquiry?type=quote and /inquiry?type=investment are
  // different pages with different headings. Keying on pathname alone left the
  // previous form's title in the tab.
  const { pathname, search } = useLocation();
  const { lang } = useParams<{ lang: string }>();
  const active = lang === 'ka' ? 'ka' : 'en';

  useEffect(() => {
    const rest = pathname.replace(/^\/(en|ka)/, '');
    document.documentElement.lang = active;

    // Take the title from the rendered H1 so the tab can never disagree with the
    // page — a slug-derived title said "Mission" while the page said "About".
    const heading = document.querySelector('main h1')?.textContent?.trim();
    const fallback = rest
      .split('/')
      .filter(Boolean)
      .map((s) => s.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()))
      .reverse()
      .join(' — ');
    const name = heading || fallback;
    document.title = rest && name ? `${name} | GEO Dairy` : "GEO Dairy — Georgia's Integrated Dairy Industry Company";

    const lede = document.querySelector('main .lede')?.textContent?.trim();
    if (lede) {
      let desc = document.head.querySelector<HTMLMetaElement>('meta[name="description"]');
      if (!desc) {
        desc = document.createElement('meta');
        desc.setAttribute('name', 'description');
        document.head.appendChild(desc);
      }
      desc.setAttribute('content', lede.slice(0, 300));
    }

    const set = (selector: string, attrs: Record<string, string>) => {
      let el = document.head.querySelector<HTMLLinkElement>(selector);
      if (!el) {
        el = document.createElement('link');
        document.head.appendChild(el);
      }
      Object.entries(attrs).forEach(([k, v]) => el!.setAttribute(k, v));
    };
    set('link[rel="canonical"]', { rel: 'canonical', href: `https://geodairy.ge/${active}${rest}` });
    set('link[rel="alternate"][hreflang="en"]', { rel: 'alternate', hreflang: 'en', href: `https://geodairy.ge/en${rest}` });
    set('link[rel="alternate"][hreflang="ka"]', { rel: 'alternate', hreflang: 'ka', href: `https://geodairy.ge/ka${rest}` });
  }, [pathname, search, active]);

  return null;
}

function Shell() {
  const [navigatorOpen, setNavigatorOpen] = useState(false);
  const palette = useCommandPalette();
  const { pathname } = useLocation();
  const ui = useUI();

  return (
    <>
      <a href="#main" className="skip-link">{ui('skipToContent')}</a>
      <DocumentMeta />
      <ScrollToTop />
      <Header onOpenNavigator={() => setNavigatorOpen(true)} onOpenSearch={() => palette.setOpen(true)} />
      <main id="main">
        {/* Keyed on the path so each route settles in rather than snapping. */}
        <div key={pathname} className="page-enter">
          <Outlet context={{ onOpenNavigator: () => setNavigatorOpen(true) }} />
        </div>
      </main>
      <Footer />
      <NavigatorDialog open={navigatorOpen} onClose={() => setNavigatorOpen(false)} />
      <CommandPalette open={palette.open} onClose={() => palette.setOpen(false)} />
      <ShortlistTray />
    </>
  );
}

function LangLayout() {
  const { lang } = useParams<{ lang: string }>();
  if (lang !== 'en' && lang !== 'ka') return <Navigate to={`/${DEFAULT_LANG}`} replace />;
  return (
    <LangProvider>
      <ShortlistProvider>
        <Shell />
      </ShortlistProvider>
    </LangProvider>
  );
}

/** Home needs the Navigator opener; the layout owns the single dialog instance. */
function HomeRoute() {
  const { onOpenNavigator } = useOutletContext<{ onOpenNavigator: () => void }>();
  return <Home onOpenNavigator={onOpenNavigator} />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={`/${DEFAULT_LANG}`} replace />} />
        <Route path="/:lang" element={<LangLayout />}>
          <Route index element={<HomeRoute />} />

          {/* Utility and institutional routes — declared before the taxonomy
              wildcards so a static segment always wins the match. */}
          <Route path="navigator" element={<NavigatorPage />} />
          <Route path="search" element={<Search />} />
          <Route path="inquiry" element={<Inquiry />} />
          <Route path="plan" element={<Plan />} />
          <Route path="glossary" element={<Glossary />} />
          <Route path="regions" element={<Regions />} />
          <Route path="regions/:region" element={<Region />} />
          <Route path="work-with-us" element={<WorkWithUs />} />
          <Route path="work-with-us/:audience" element={<WorkWithUs />} />
          <Route path="about/*" element={<GenericPage kind="corporate" />} />
          <Route path="industry/*" element={<GenericPage kind="industry" />} />
          <Route path="legal/*" element={<GenericPage kind="legal" />} />
          <Route path="projects/*" element={<GenericPage kind="projects" />} />
          <Route path="careers" element={<GenericPage kind="careers" />} />

          {/* Dairy Grid is a strategic programme (P09), not a portfolio page —
              declared ahead of the taxonomy wildcards so it wins the match. */}
          <Route path="production/grid" element={<DairyGrid />} />

          {/* Business taxonomy (§6.1) */}
          <Route path=":direction" element={<DirectionLanding />} />
          <Route path=":direction/:sub" element={<SubDirection />} />
          <Route path=":direction/:sub/:slug" element={<Offering />} />

          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="*" element={<Navigate to={`/${DEFAULT_LANG}`} replace />} />
      </Routes>
    </BrowserRouter>
  );
}
