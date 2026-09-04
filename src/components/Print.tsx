import { Printer } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useLang, useUI } from '@/lib/i18n';

/**
 * PRINT & SPEC SHEETS.
 *
 * B2B buying is not done alone. A specification gets printed, marked up, and
 * put in front of a technical director, a bank or a procurement committee —
 * people who were never on the website and are not going to be sent a link.
 * A site that cannot survive a printer loses the argument in the room where the
 * decision is actually made.
 *
 * There is no PDF generator here on purpose. The browser already has one: the
 * print dialog saves to PDF on every desktop platform, and the output is
 * selectable, searchable text at the reader's own page size. Shipping a
 * client-side PDF library to reproduce that badly would cost a few hundred
 * kilobytes and lose the text layer.
 *
 * So the deliverable is a real print stylesheet plus these three pieces: a
 * button that opens the dialog, a document header that only exists on paper,
 * and a footer that puts the source URL on the page — because a printout with
 * no address is a dead end.
 */

/** Absolute URL of the current view, including query — the printout's address. */
export function useDocumentUrl() {
  const { pathname, search } = useLocation();
  const origin = typeof window === 'undefined' ? 'https://geodairy.ge' : window.location.origin;
  return `${origin}${pathname}${search}`;
}

export function PrintButton({ label }: { label?: string }) {
  const ui = useUI();
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="print:hidden inline-flex items-center gap-2 border border-line bg-milk text-ink
        text-[0.875rem] font-medium px-4 py-3 rounded-[2px]
        hover:border-line-strong hover:bg-mist transition-colors"
    >
      <Printer size={15} aria-hidden />
      {label ?? ui('printThis')}
    </button>
  );
}

/**
 * The masthead of the printed document. Invisible on screen.
 *
 * On screen the header, the breadcrumbs and the address bar say what this page
 * is and where it came from. On paper all three are gone, so this block has to
 * carry the same information in one strip: whose document, what kind, when it
 * was taken, and from where.
 */
export function PrintHeader({ kind, title, meta }: { kind: string; title: string; meta?: string }) {
  const lang = useLang();
  const ui = useUI();
  const url = useDocumentUrl();
  const date = new Date().toLocaleDateString(lang === 'ka' ? 'ka-GE' : 'en-GB', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <div className="print-only print-header" aria-hidden>
      <div className="print-header-top">
        <img src="/brand/geo-dairy-mark.png" alt="" width={28} height={28} />
        <span className="print-brand">GEO Dairy</span>
        <span className="print-kind">{kind}</span>
        <span className="print-date">{date}</span>
      </div>
      {/* A <p>, not an <h1>: the page already has its heading, and a second
          one here would be picked up by DocumentMeta as the document title. */}
      <p className="print-title">{title}</p>
      {meta && <p className="print-meta">{meta}</p>}
      <p className="print-url">
        {ui('printedFrom')} {url}
      </p>
    </div>
  );
}

/**
 * Closing note on the printed page. Says what the document is not: a quotation.
 * On screen the surrounding page carries that context; on paper it does not.
 */
export function PrintFootnote({ text }: { text?: string }) {
  const ui = useUI();
  return (
    <p className="print-only print-footnote" aria-hidden>
      {text ?? ui('printFootnote')}
    </p>
  );
}
