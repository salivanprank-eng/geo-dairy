import {
  createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode,
} from 'react';

/**
 * SHORTLIST — the visitor's working set.
 *
 * B2B buyers never evaluate one thing. A processor pricing a new line wants a
 * pasteuriser, a filler, a lab instrument and the engineering to install them,
 * and today that means four separate inquiries or one vague message. The
 * shortlist lets them collect across the site and send once.
 *
 * That also changes what the commercial team receives: not "asked about milk
 * tanks" but "is specifying a 200-cow parlour" — which is the difference between
 * a lead and a qualified one (§8.3, §16.1).
 *
 * Stored per browser. It is a convenience, never a record: nothing here is sent
 * anywhere until the visitor submits the form themselves.
 */

export interface ShortlistItem {
  direction: string;
  sub: string;
  slug: string;
}

interface ShortlistApi {
  items: ShortlistItem[];
  count: number;
  has: (slug: string) => boolean;
  toggle: (item: ShortlistItem) => void;
  remove: (slug: string) => void;
  clear: () => void;
  /** Set by the tray so a newly added item can be announced once. */
  lastAdded: string | null;
}

const KEY = 'geodairy.shortlist.v1';

const ShortlistContext = createContext<ShortlistApi | null>(null);

function read(): ShortlistItem[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Defend against a stale or hand-edited value: keep only well-formed rows.
    return parsed.filter(
      (i): i is ShortlistItem =>
        !!i && typeof i.slug === 'string' && typeof i.direction === 'string' && typeof i.sub === 'string',
    );
  } catch {
    return [];
  }
}

export function ShortlistProvider({ children }: { children: ReactNode }) {
  /* Seeded straight from storage rather than filled in by a mount effect.
     That ordering matters: with an empty initial state, the persist effect below
     runs before the state carrying the stored value lands, so it writes `[]` over
     what was saved. A `hydrated` guard does not fix it either — StrictMode
     invokes both effects twice in the same commit, so the flag is already true
     when the persist effect clobbers storage. `read()` cannot throw, so calling
     it during render is safe here; it would need revisiting under SSR, where the
     server has no localStorage and the markup must match on hydration. */
  const [items, setItems] = useState<ShortlistItem[]>(read);
  const [lastAdded, setLastAdded] = useState<string | null>(null);

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(items)); } catch { /* storage unavailable */ }
  }, [items]);

  const has = useCallback((slug: string) => items.some((i) => i.slug === slug), [items]);

  const toggle = useCallback((item: ShortlistItem) => {
    setItems((prev) => {
      const exists = prev.some((i) => i.slug === item.slug);
      if (exists) return prev.filter((i) => i.slug !== item.slug);
      setLastAdded(item.slug);
      return [...prev, item];
    });
  }, []);

  const remove = useCallback((slug: string) => {
    setItems((prev) => prev.filter((i) => i.slug !== slug));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<ShortlistApi>(
    () => ({ items, count: items.length, has, toggle, remove, clear, lastAdded }),
    [items, has, toggle, remove, clear, lastAdded],
  );

  return <ShortlistContext.Provider value={value}>{children}</ShortlistContext.Provider>;
}

export function useShortlist(): ShortlistApi {
  const ctx = useContext(ShortlistContext);
  if (!ctx) throw new Error('useShortlist must be used inside <ShortlistProvider>');
  return ctx;
}
