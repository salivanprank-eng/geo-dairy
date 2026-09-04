import { useEffect, useRef, useState, type ReactNode } from 'react';
import { PHOTOS, photoSrcSet, photoUrl, type PhotoKey } from '@/data/media';
import { useT } from '@/lib/i18n';

/**
 * IMAGE SYSTEM — brief §12.1 / §12.5.
 *
 * Three rules the component enforces so photography can never be dropped in
 * carelessly later:
 *   1. Every image is lazy, width-negotiated and reserves its aspect ratio, so
 *      adding pictures cannot cost layout shift or first paint.
 *   2. Images are graded slightly toward the palette at rest and resolve to full
 *      colour on hover — photographs join the design system rather than shout
 *      over it.
 *   3. The reveal is a single mask wipe on entry. One gesture, not a show.
 */

type Ratio = '16/9' | '4/3' | '3/2' | '1/1' | '4/5' | '21/9';

export function Figure({
  photo, ratio = '4/3', className = '', sizes = '(max-width: 768px) 100vw, 45vw',
  priority = false, overlay = 'none', children, interactive = true, fill = false,
}: {
  photo: PhotoKey;
  ratio?: Ratio;
  /** Fill the parent instead of holding a ratio — for full-bleed columns. */
  fill?: boolean;
  className?: string;
  sizes?: string;
  priority?: boolean;
  /** 'scrim' darkens for text on top; 'tint' warms the image into the palette. */
  overlay?: 'none' | 'scrim' | 'tint';
  children?: ReactNode;
  interactive?: boolean;
}) {
  const t = useT();
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(priority);
  const [loaded, setLoaded] = useState(false);
  const p = PHOTOS[photo];

  useEffect(() => {
    if (priority) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect(); } },
      { rootMargin: '120px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [priority]);

  return (
    <div
      ref={ref}
      data-shown={shown}
      data-loaded={loaded}
      className={`media-frame ${interactive ? 'is-interactive' : ''} group/media relative overflow-hidden bg-mist
        ${fill ? 'w-full h-full' : ''} ${className}`}
      /* An aspect ratio and a fixed height fight: given `h-full`, the ratio
         derives the *width* from it, and the frame overflows its column by
         however far the two disagree. `fill` drops the ratio entirely. */
      style={fill ? undefined : { aspectRatio: ratio.replace('/', ' / ') }}
    >
      <img
        src={photoUrl(p.id, 1280)}
        srcSet={photoSrcSet(p.id)}
        sizes={sizes}
        alt={t(p.alt)}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        onLoad={() => setLoaded(true)}
        style={p.position ? { objectPosition: p.position } : undefined}
        className="media-img absolute inset-0 w-full h-full object-cover" 
      />
      {overlay === 'scrim' && (
        <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/35 to-ink/5" />
      )}
      {overlay === 'tint' && (
        <span aria-hidden className="absolute inset-0 bg-brand-deep/10 mix-blend-multiply" />
      )}
      {/* Hairline inset keeps the photo inside the same drawing system as the cards. */}
      <span aria-hidden className="absolute inset-0 ring-1 ring-inset ring-ink/10" />
      {children}
    </div>
  );
}

/** Full-bleed background image for a dark section. Text always sits above a scrim. */
export function BackdropPhoto({ photo, opacity = 0.4 }: { photo: PhotoKey; opacity?: number }) {
  const t = useT();
  const p = PHOTOS[photo];
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none">
      <img
        src={photoUrl(p.id, 1920, 62)}
        srcSet={photoSrcSet(p.id, [1280, 1920, 2400])}
        sizes="100vw"
        alt={t(p.alt)}
        loading="lazy"
        decoding="async"
        className="w-full h-full object-cover"
        style={{ opacity }}
      />
      <span className="absolute inset-0 bg-gradient-to-r from-graphite via-graphite/90 to-graphite/55" />
    </div>
  );
}
