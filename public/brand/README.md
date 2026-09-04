# Brand assets

| File | Used for |
|---|---|
| `geo-dairy-mark.png` | The mark — header, footer, mobile menu, apple-touch-icon |
| `favicon-64.png` / `favicon-32.png` | Browser tab |

Source: the 1600px RGBA original from the Recraft project, trimmed of its
transparent margin and resampled. `Logo` loads the mark and falls back to a
type-only lockup if it ever goes missing.

## Brand colours

Read from the artwork's own pixels, not estimated:

| Token | Value | Use |
|---|---|---|
| `--color-brand` | `#43A047` | logo green — fills, bars, accents |
| `--color-signal` | `#F4C543` | logo yellow — on dark surfaces only |
| `--color-brand-deep` | `#2A7230` | text, links, button grounds |

**Neither logo colour may carry body text.** The green is 3.03:1 on paper and
the yellow 1.49:1 — both below the 4.5:1 minimum. `brand-deep` is the text-safe
darkening of the green (5.42:1 on cream; white on it reads 5.92:1). The yellow
is 11:1 against ink, which is how the lockup itself uses it: a fill on dark.

## Still worth adding

A **vector** version. The mark currently ships as a 512px PNG, which is sharp at
every size the site uses it, but an SVG would be resolution-independent for print
and large-format placements. Export one from Recraft (it exports SVG) and drop it
in as `geo-dairy-mark.svg`; switch the `src` in `src/components/Logo.tsx`.

The full lockup (mark over the "GEO DAIRY" wordmark) is not used on the site —
the header pairs the mark with live text so it stays selectable and translatable.
