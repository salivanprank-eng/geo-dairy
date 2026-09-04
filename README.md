# geodairy-web

Design-reference build for **geodairy.ge**, implementing the *GEO Dairy Website Architecture & Design Brief v2.0 (30 August 2026)*.

Same role as the other `_inspect_*` / reference builds in this repo: a working React front end that fixes the information architecture, component system and conversion behaviour before anything is ported into the CMS.

```bash
npm install
npm run dev      # http://localhost:3100
npm run build
npm run lint     # tsc --noEmit
```

Vite 6 · React 19 · TypeScript · Tailwind 4 · react-router 7 · **three + @react-three/fiber 9**

---

## What is implemented

| Brief section | Status |
|---|---|
| §4 Global IA — 5 directions, mega menu, mobile accordion, utility bar, footer | Built |
| §5 Direction-level architecture — all 28 permanent second-level categories | Built (data-driven) |
| §6 Navigation — breadcrumbs, local page nav, filters, search, URL standard | Built, plus a ⌘K command palette |
| §7 GEO Dairy Navigator — intent → context → route → convert | Built through **Stage 2** (free-text intent matching) |
| §8 CTA & form architecture — controlled CTA taxonomy, per-type field sets, carried context | Built |
| §9 Page-type system — P01–P06, P08, P09, P10, P12, P13, P14, P15, P16, P17 | Built. P07 and P11 detail pages are shells |
| §11 Homepage — all 13 sections in the specified order | Built |
| §12 Design system, accessibility, performance | Built |
| §13 CMS content model | Typed in `src/lib/types.ts` |
| §15 Domain ecosystem — dairy.ge / dairygrid.ge routing | Built (footer + Grid section) |
| §17 Phase 1 minimum page set | Every route resolves; editorial content pending |

## Architecture

```
src/
  data/taxonomy.ts     5 directions × 28 sub-directions — the permanent business taxonomy
  data/offerings.ts    ~45 portfolio entries proving the filter + card system
  data/navigator.ts    16 Navigator intents and their taxonomy routes
  data/site.ts         audience paths, coverage module, proof points
  lib/types.ts         the CMS content model (§13)
  lib/i18n.tsx         KA/EN as URL-prefixed first-class versions
  lib/palette.ts       colours shared by CSS and WebGL
  components/three/    the react-three-fiber layer
  pages/               one component per page type, not per page
```

**Nothing about navigation changes when the portfolio grows.** Adding an offering means adding a row to `offerings.ts`; it appears in its sub-direction portfolio, in search, in the filters, and gets an offering page — with no new top-level menu item (§19).

**URLs** follow `/{lang}/{direction}/{sub-direction}/{offering}` with `/en/` and `/ka/` prefixes, canonical and hreflang maintained per route.

## The 3D layer

Four scenes, all deliberately restrained — the brief asks for diagrams where they explain a system better than photography (§12.1) and warns against novelty UI that costs institutional credibility.

- **`ValueChainScene`** — the Upstream → Midstream → Downstream diagram on the homepage. Abstract massing per stage, milk flowing along the chain, a Cross-Chain ring above all three. Hovering a stage highlights it in both the canvas and the HTML legend.
- **`GeorgiaMapScene`** — the coverage module: Georgia's twelve administrative regions, extruded from real boundaries (geoBoundaries ADM1, gbOpen licence), simplified and projected at build time. Regions rise by status, hovering either the map or the list beside it lifts and highlights the region in both, and pins stand on the operating ones. The geography is real; the operating status on it is still placeholder (§11.1).
- **`GridNetworkScene`** — the Dairy Grid page's architecture: farms feeding collection hubs, hubs feeding one processing centre, milk moving along the arcs. Deliberately *not* a map of Georgia — the real network geography is unverified, and drawing it would be a claim (§11.1).
- **`HeroGrid`** — a field of production nodes behind the hero, breathing slowly. Carries no information.

All four lean slightly toward the pointer and settle — parallax, not orbit, so a visitor can never lose the diagram.

Both are:
- lazy-loaded after idle and **skipped entirely** on narrow viewports, low-core devices and `saveData` connections;
- paused when off-screen and frozen under `prefers-reduced-motion`;
- label-free — every word is HTML beside the canvas, so the page reads correctly with WebGL absent.

The build splits three.js into its own chunk (~294 kB gzip) that never blocks first paint; the app shell is ~57 kB gzip.

## Design direction

Warm paper surfaces, layered cream neutrals, one green accent used as a signal, mono metadata and `01…05` markers. Elevation uses one layered neutral shadow scale; radii stay at 3px. Direction accents differentiate without ever outweighing the master brand.

The container guide lines and corner marks were **removed**: repeated on every section they read as a frame drawn around the page rather than as structure. Hierarchy now comes from surface, spacing and type alone.

### Motion

Every effect has one job; anything that only decorated was left out, because §12.1 rules out animation that costs institutional credibility.

| Effect | Where | Why |
|---|---|---|
| Masked word reveal | H1 only, one per page | Gives the page a first beat. On every heading it becomes a tic. |
| Fade-up on entry | Sections and card grids | The page settles rather than performs. Coarse by design — never per element. |
| Curtain wipe | Photographs | Doubles as the loading state, so there is never a flash of an undecoded image. |
| Hover: lift + accent sweep + arrow slide | Cards, buttons | Confirms the target is live and where it goes. |
| Image grade release | Photo hover | Rest state is graded toward the palette; hover returns full colour. |
| Column cascade | Mega menu | Reads the panel left to right in ~150ms total. |
| Route settle | Every navigation | Navigation reads as a move, not a jump. |
| Pointer parallax | The three WebGL scenes | Makes a diagram feel lit rather than printed. |

All of it collapses under `prefers-reduced-motion`.

### Interaction

- **⌘K command palette** (`/` also opens it) — fuzzy search over every direction, sub-direction, offering, institutional page, Navigator intent and audience route, from one index shared with the results page. Results state their taxonomy position, so the palette teaches the structure while it navigates. Arrow keys walk a flat list; groups are ordered by best match so the highlighted row is always the first row.
- **Chain position** — a miniature Upstream → Midstream → Downstream rail on every sub-direction and offering page, lit where that capability acts, linking into the industry reference for each stage. The brief's central claim, restated on the hundredth page as well as the first.
- **Navigator Stage 2** — describe the need in your own words ("I want to build a cheese factory") and the panel matches it to an intent and routes into the taxonomy. A keyword map rather than a model: inspectable, instant, bilingual, and replaced wholesale by Stage 3.
- **FLIP filtering** — filtered cards travel to their new positions instead of teleporting, so the eye stays attached to a card while the grid reflows.

### Photography

Real dairy-industry work — barn aisles, bottling lines, lab benches, cold chain, cheese maturing — rather than rustic-farmhouse or milk-splash stock, per §12.1. Images are lazy, width-negotiated via `srcSet`, reserve their aspect ratio, and carry bilingual alt text. Assignments live in `data/media.ts` as taxonomy → photo maps, so a real photo library slots in without touching a component.

## Known gaps — read before handing this to the design team

1. **Georgian copy is placeholder.** Every KA string is structurally correct but written for scaffolding, not for readers. It needs a Georgian copywriter working against a controlled terminology dictionary (§12.3), with attention to rhythm and idiom rather than uniform translated sentences.
2. **No SSR.** The brief requires server-rendered, indexable content (§12.5). This SPA cannot deliver that; the production site needs the WordPress port or a Next.js/SSG build. Structure, hreflang and canonical handling here are the specification for that port, not the delivery of it.
3. **Coverage data is fabricated placeholder structure**, flagged as such in the UI. Do not publish it — §11.1 forbids unverified claims.
4. **The photography is stock, and stock is a placeholder.** Every image shows someone else's operation. Commissioned photography of GEO Dairy's own farms and plants is required before launch — a picture of another company's bottling line is not proof of capability (§10.1).
5. **Offering page bodies are template scaffolds.** Each section names the CMS field it expects (toggle "Template annotations"). That is the §10.2/§10.3/§10.4 standard made visible, not finished content.
6. **Phase 2/3 surfaces are out of scope**: account/portal, marketplace transactions, personalised Navigator, CRM integration, maps.

## Accessibility & polish audit

Audited against the `ui-ux-pro-max` skill's rule set, measured in the running app rather than assumed. Four real defects found and fixed:

| Finding | Measured | Now |
|---|---|---|
| Tailwind v4's preflight sets `cursor: default` on `<button>`, so every button on the site showed an arrow | 15 buttons | 0 |
| `--color-muted` failed WCAG AA on every surface | 3.56–4.05:1 | `#5F6B65`, 4.72–5.37:1 |
| Stacked nav/footer links below the WCAG 2.2 target size (the inline-text exception does not cover a list of links) | 38 under 24×24px | 0 |
| Focus ring read as a browser default | 2px | 3px brand ring, 3px offset |

No horizontal overflow at 375 / 768 / 1024 / 1440 across home, portfolio, offering and Grid page types.

**WebGL mount race — fixed.** Canvases previously mounted as soon as the page was idle, so a fast route change or a scroll straight past could tear one down mid-initialisation and three would throw on a null `domElement`. Each canvas now mounts only once its section comes within 220px of the viewport: five rapid route changes through every 3D page now produce zero errors, and a page mounts only the canvas actually in view. `resolve.dedupe` pins one React/three instance so a second copy can never reach the custom renderer.

**Not adopted from the skill's output:** it proposed a navy/blue "Trust & Authority" palette. The warm-paper green direction is set by the brief and by prior review, and the anti-slop rule is to preserve a chosen art direction rather than swap it for a generic default. Its structural advice (proof placement, focus, targets, motion tier) was applied; its palette was not.

## Verification

`npm run lint` (tsc) and `npm run build` are clean. A link crawl of the running app visits **430–510 routes** per run (query-parameter variants vary with what each page renders) across both languages — every direction, sub-direction, offering, institutional page and CTA-context form — and checks each for a 404 fallback, an empty main, a missing or duplicated `h1`, a `<title>` that disagrees with the `h1`, images missing alt text, and uncaught JS errors. Current result: zero failures, zero images without alt text.

One caveat worth recording: crawling at ~5 pages/second produces occasional WebGL mount/unmount errors as canvases are torn down mid-initialisation. At human navigation speed the same routes are clean. If that ever shows up in real use, the fix is to hold the canvas mount until the route has settled.
