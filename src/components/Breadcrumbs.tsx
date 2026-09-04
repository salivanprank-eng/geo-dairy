import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useHref, useUI } from '@/lib/i18n';

/** Breadcrumbs — brief §6: show structural location without crowding the menu. */
export function Breadcrumbs({ trail }: { trail: { label: string; to?: string }[] }) {
  const href = useHref();
  const ui = useUI();

  return (
    <nav aria-label={ui('youAreHere')} className="no-print py-4">
      <ol className="flex flex-wrap items-center gap-1.5 text-[0.8125rem] text-[var(--crumb)]">
        <li>
          <Link to={href('/')} className="hit-row hover:text-[var(--crumb-active)] transition-colors">{ui('home')}</Link>
        </li>
        {trail.map((item, i) => (
          <li key={`${item.label}-${i}`} className="flex items-center gap-1.5">
            <ChevronRight size={13} aria-hidden className="text-[var(--crumb-sep)]" />
            {item.to && i < trail.length - 1 ? (
              <Link to={href(item.to)} className="hit-row hover:text-[var(--crumb-active)] transition-colors">{item.label}</Link>
            ) : (
              <span className="text-[var(--crumb-active)] font-medium" aria-current="page">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
