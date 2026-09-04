import { useState } from 'react';

/**
 * GEO DAIRY LOGO.
 *
 * Renders the official mark from `public/brand/geo-dairy-mark.png`, paired with
 * the wordmark as live text so it stays selectable and translatable.
 *
 * The fallback to a type-only lockup stays: never a drawn approximation. An
 * earlier version of this component invented a droplet symbol, which looked
 * nothing like the real interlocking rings — a fabricated mark is worse than no
 * mark, because it ships as if it were the brand.
 */
export function Logo({ inverse = false, compact = false }: { inverse?: boolean; compact?: boolean }) {
  const [markMissing, setMarkMissing] = useState(false);

  const wordColor = inverse ? 'var(--color-milk)' : 'var(--color-brand-deep)';

  return (
    <span className="inline-flex items-center gap-2.5">
      {!markMissing && (
        <img
          src="/brand/geo-dairy-mark.png"
          alt=""
          aria-hidden
          width={34}
          height={34}
          onError={() => setMarkMissing(true)}
          className="w-[34px] h-[34px] shrink-0 select-none"
          style={inverse ? { filter: 'brightness(1.12)' } : undefined}
        />
      )}
      {(!compact || markMissing) && (
        <span
          className="font-display font-bold tracking-[0.01em] text-[1.125rem] uppercase leading-none"
          style={{ color: wordColor }}
        >
          GEO Dairy
        </span>
      )}
    </span>
  );
}
