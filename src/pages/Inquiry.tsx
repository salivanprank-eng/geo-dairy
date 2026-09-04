import { useMemo, useState, type FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Check, Lock } from 'lucide-react';
import { getDirection, getSub } from '@/data/taxonomy';
import { OFFERINGS } from '@/data/offerings';
import { getBuild, PLAN_STARTS } from '@/data/plans';
import { GEORGIA_REGIONS } from '@/data/regions';
import { getIntent } from '@/data/navigator';
import { useLang, useT, useUI, type UIKey } from '@/lib/i18n';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Button, Tag, accentVars } from '@/components/ui';
import type { CtaType, DirectionId } from '@/lib/types';

/**
 * P16 CONTACT / FORM — brief §8.2 and §8.3.
 * The form asks only what is needed to qualify and route. The CTA that opened it
 * carries direction, sub-direction, offering, Navigator intent and language as
 * hidden context, so the inquiry can reach a taxonomy owner rather than a shared
 * mailbox. Nothing is transmitted in this prototype.
 */

type FieldKey =
  | 'fName' | 'fOrg' | 'fRole' | 'fCountry' | 'fEmail' | 'fPhone'
  | 'fLocation' | 'fScale' | 'fTiming' | 'fMessage';

/** §8.2 — the field set is chosen by form type, never one long generic form. */
const FIELDS: Record<CtaType, FieldKey[]> = {
  'service-request': ['fName', 'fOrg', 'fEmail', 'fPhone', 'fLocation', 'fScale', 'fTiming', 'fMessage'],
  quote: ['fName', 'fOrg', 'fEmail', 'fPhone', 'fLocation', 'fScale', 'fTiming', 'fMessage'],
  'trade-inquiry': ['fName', 'fOrg', 'fCountry', 'fEmail', 'fPhone', 'fScale', 'fMessage'],
  'supplier-application': ['fName', 'fOrg', 'fRole', 'fCountry', 'fEmail', 'fPhone', 'fMessage'],
  'provider-application': ['fName', 'fOrg', 'fRole', 'fCountry', 'fEmail', 'fPhone', 'fMessage'],
  'grid-participation': ['fName', 'fOrg', 'fLocation', 'fEmail', 'fPhone', 'fScale', 'fMessage'],
  investment: ['fName', 'fOrg', 'fRole', 'fCountry', 'fEmail', 'fPhone', 'fMessage'],
  career: ['fName', 'fRole', 'fLocation', 'fEmail', 'fPhone', 'fMessage'],
  contact: ['fName', 'fOrg', 'fCountry', 'fEmail', 'fPhone', 'fMessage'],
};

const REQUIRED: FieldKey[] = ['fName', 'fEmail', 'fMessage'];

export default function Inquiry() {
  const [params] = useSearchParams();
  const [sent, setSent] = useState(false);
  const t = useT();
  const ui = useUI();
  const lang = useLang();

  const type = (params.get('type') ?? 'contact') as CtaType;
  const directionId = params.get('direction') as DirectionId | null;
  const subSlug = params.get('sub');
  const offering = params.get('offering');
  const intentId = params.get('intent');
  const shortlistParam = params.get('shortlist');
  // An inquiry that came out of the configurator carries the configuration
  // itself, not just its output — 'a 200-cow greenfield farm in Kakheti' is
  // the qualifying detail, and it is lost if only the item list travels.
  const planBuild = getBuild(params.get('build'));
  const planScale = planBuild?.scales.find((x) => x.id === params.get('scale'));
  const planStart = PLAN_STARTS.find((x) => x.id === params.get('start'));
  const planRegion = GEORGIA_REGIONS.find((r) => r.id === params.get('region'));
  const contextId = params.get('context');

  const d = directionId ? getDirection(directionId) : undefined;
  const s = directionId && subSlug ? getSub(directionId, subSlug) : undefined;
  const intent = intentId ? getIntent(intentId) : undefined;

  const fields = FIELDS[type] ?? FIELDS.contact;

  /* An inquiry that arrives from the shortlist tray is asking about several
     things at once. Resolving the slugs here means the visitor can see exactly
     what they are about to send, and the commercial team receives a specified
     scope rather than one line of prose. Unknown slugs are dropped silently:
     the parameter is user-editable and a stale link should not break the form. */
  const shortlisted = useMemo(() => {
    if (!shortlistParam) return [];
    const wanted = shortlistParam.split(',').map((x) => x.trim()).filter(Boolean);
    return wanted
      .map((slug) => OFFERINGS.find((o) => o.slug === slug))
      .filter((o): o is (typeof OFFERINGS)[number] => !!o);
  }, [shortlistParam]);

  /** §8.3.1 — the hidden context that travels with the submission into CRM. */
  const context = useMemo(() => {
    const rows: { k: string; v: string }[] = [
      { k: 'form_type', v: type },
      { k: 'language', v: lang },
    ];
    if (directionId) rows.push({ k: 'direction', v: directionId });
    if (subSlug) rows.push({ k: 'sub_direction', v: subSlug });
    if (offering) rows.push({ k: 'offering', v: offering });
    if (s) rows.push({ k: 'value_chain_stage', v: s.stages.join(', ') });
    if (intentId) rows.push({ k: 'navigator_intent', v: intentId });
    if (contextId) rows.push({ k: 'navigator_context', v: contextId });
    if (planBuild) rows.push({ k: 'plan_build', v: planBuild.id });
    if (planScale) rows.push({ k: 'plan_scale', v: planScale.label.en });
    if (planStart) rows.push({ k: 'plan_start', v: planStart.id });
    if (planRegion) rows.push({ k: 'region', v: planRegion.en });
    // Both of these arrive very long from the configurator — eighteen slugs, then
    // the same eighteen again URL-encoded inside source_page. The panel is a
    // readable preview of what production sends as hidden fields, so it shows the
    // shape, not the payload: the items themselves are listed above by name.
    if (shortlisted.length) {
      rows.push({ k: 'shortlist', v: `${shortlisted.length} ${ui('slItems')}` });
    }
    rows.push({ k: 'source_page', v: window.location.pathname });
    return rows;
  }, [type, lang, ui, directionId, subSlug, offering, s, intentId, contextId, shortlisted,
      planBuild, planScale, planStart, planRegion]);

  const heading = ui(`cta.${type}` as UIKey);

  return (
    <div style={accentVars(directionId ?? undefined)}>
      <section className="border-b border-line bg-milk">
        <div className="shell">
          <Breadcrumbs
            trail={[
              ...(d ? [{ label: t(d.label), to: `/${d.id}` }] : []),
              ...(d && s ? [{ label: t(s.label), to: `/${d.id}/${s.slug}` }] : []),
              { label: heading },
            ]}
          />
          <div className="pb-12 md:pb-16 pt-4 max-w-3xl">
            <p className="eyebrow text-[var(--accent-ink)]">
              {d && s ? `${t(d.label)} · ${t(s.label)}` : lang === 'ka' ? 'ბიზნეს-მოთხოვნა' : 'Business inquiry'}
            </p>
            <h1 className="text-[clamp(1.875rem,4vw,3rem)] font-bold mt-3">{heading}</h1>
            <p className="lede mt-4">{ui('formIntro')}</p>
            {intent && (
              <p className="mt-5 flex flex-wrap items-center gap-2 text-[0.875rem] text-slate">
                <Tag tone="accent">{ui('navigator')}</Tag>
                {t(intent.label)}
              </p>
            )}
          </div>
        </div>
      </section>

      <div className="shell py-12 md:py-16">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-7">
            {sent ? (
              <div className="border border-brand/40 bg-brand-soft rounded-none p-8">
                <p className="flex items-center gap-2.5 text-[1.125rem] font-semibold text-brand-deep">
                  <Check size={20} aria-hidden /> {ui('fSent')}
                </p>
                <p className="mt-3 text-[0.9375rem] text-slate">{ui('fSentBody')}</p>
                <Button variant="secondary" className="mt-6" onClick={() => setSent(false)}>
                  {lang === 'ka' ? 'ფორმაზე დაბრუნება' : 'Back to the form'}
                </Button>
              </div>
            ) : (
              <form
                onSubmit={(e: FormEvent) => { e.preventDefault(); setSent(true); }}
                className="space-y-5"
                noValidate={false}
              >
                <div className="grid sm:grid-cols-2 gap-5">
                  {fields.filter((f) => f !== 'fMessage').map((f) => (
                    <Field key={f} name={f} required={REQUIRED.includes(f)} />
                  ))}
                </div>
                <Field name="fMessage" required multiline />

                {/* §8.3.7 — privacy notice and consent */}
                <label className="flex items-start gap-3 text-[0.875rem] text-slate">
                  <input type="checkbox" required className="mt-1 accent-[var(--color-brand)]" />
                  <span>{ui('fConsent')}</span>
                </label>

                <Button type="submit">{ui('fSubmit')}</Button>
              </form>
            )}
          </div>

          {/* Visible for the design team; hidden inputs in production */}
          <aside className="lg:col-span-5">
            <div className="border border-line bg-mist/50 rounded-none p-6 lg:sticky lg:top-28">
              <p className="eyebrow flex items-center gap-2">
                <Lock size={13} aria-hidden /> {ui('fContext')}
              </p>
              {planBuild && (
                <div className="mt-4 border border-brand/40 bg-brand-soft rounded-none p-4">
                  <p className="eyebrow text-brand-deep">{ui('planInInquiry')}</p>
                  <p className="mt-2 text-[0.9375rem] font-semibold leading-snug">
                    {t(planBuild.label)}
                    {planScale ? ` · ${t(planScale.label)}` : ''}
                  </p>
                  <p className="meta mt-1">
                    {[planStart && t(planStart.label), planRegion && (lang === 'ka' ? planRegion.ka : planRegion.en)]
                      .filter(Boolean)
                      .join(' · ')}
                  </p>
                </div>
              )}

              {shortlisted.length > 0 && (
                <div className="mt-4 border border-line bg-milk rounded-none p-4">
                  <p className="text-[0.8125rem] font-semibold">
                    {ui('slInInquiry')} <span className="meta">({shortlisted.length})</span>
                  </p>
                  <ul className="mt-3 space-y-2 max-h-[18rem] overflow-y-auto pr-1">
                    {shortlisted.map((o) => {
                      const od = getDirection(o.direction);
                      const os = getSub(o.direction, o.sub);
                      return (
                        <li key={o.slug} style={accentVars(o.direction)} className="flex items-start gap-2.5">
                          <span aria-hidden className="mt-1.5 w-1 h-5 shrink-0 rounded-[1px] bg-[var(--accent)]" />
                          <span className="min-w-0">
                            <span className="block text-[0.875rem] font-medium leading-snug">{t(o.title)}</span>
                            {od && os && (
                              <span className="meta block mt-0.5 truncate">{t(od.label)} · {t(os.label)}</span>
                            )}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              <dl className="mt-4 space-y-2.5">
                {context.map((row) => (
                  <div key={row.k} className="flex items-baseline justify-between gap-4 border-b border-line/70 pb-2.5 last:border-0">
                    <dt className="text-[0.75rem] font-mono text-muted">{row.k}</dt>
                    <dd className="text-[0.8125rem] font-medium text-right break-all">{row.v}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-5 text-[0.8125rem] text-muted leading-relaxed">{ui('fContextNote')}</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function Field({ name, required, multiline }: { name: FieldKey; required?: boolean; multiline?: boolean }) {
  const ui = useUI();
  const id = `f-${name}`;
  const label = ui(name as UIKey);
  const cls =
    'w-full bg-milk border border-line rounded-none px-4 py-3 text-[0.9375rem] ' +
    'placeholder:text-muted/70 focus:border-brand transition-colors';

  return (
    <div className={multiline ? '' : ''}>
      <label htmlFor={id} className="block text-[0.8125rem] font-semibold mb-2">
        {label}
        {required && <span className="text-brand-deep ml-1" aria-hidden>*</span>}
        {required && <span className="sr-only"> ({ui('fRequired')})</span>}
      </label>
      {multiline ? (
        <textarea id={id} name={name} required={required} rows={5} className={cls} />
      ) : (
        <input
          id={id}
          name={name}
          required={required}
          type={name === 'fEmail' ? 'email' : name === 'fPhone' ? 'tel' : 'text'}
          autoComplete={
            name === 'fName' ? 'name' : name === 'fEmail' ? 'email' : name === 'fPhone' ? 'tel'
              : name === 'fOrg' ? 'organization' : name === 'fCountry' ? 'country-name' : 'off'
          }
          className={cls}
        />
      )}
    </div>
  );
}
