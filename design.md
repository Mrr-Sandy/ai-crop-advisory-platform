# Design: AI Crop Advisory Platform

The locked system. Every Hallmark run reads this first and pages share it. Change it on purpose; the file is the rule.

## System
- Concept: Season Clock, V2 Instrument (custom direction, from the owner's briefs)
- Idea: advice is a matter of timing; every crop belongs to a season, and the site always knows which month it is
- Vibe: precise instrument, cinematic field, almanac
- Axes: light/display-heavy/chromatic-yellow · posture: full palette (night field, brass signal, three season roles)
- Signature: the season made physical, a three.js wheat crop in its soil profile with a ring of season arcs and this month lit, beside the live month band and the user's in-season crops; every AI answer laid out as a five-part consultation

## Tokens
`frontend/src/tokens.css` is the source of truth; dark mode lives under `:root[data-mode="dark"]` in `frontend/src/index.css`.
```css
:root {
  --color-night: oklch(15% 0.014 155);  --color-night-2: oklch(19.5% 0.014 155);  --color-on-night: oklch(95% 0.015 92);
  --color-paper: oklch(97.2% 0.012 95);  --color-ink: oklch(23% 0.035 155);  --color-muted: oklch(46% 0.03 128);  --color-rule: oklch(87.5% 0.02 110);
  --color-accent: oklch(75% 0.115 80);  --color-accent-ink: oklch(23% 0.035 155);
  --color-kharif: oklch(63% 0.06 190);  --color-rabi: oklch(75% 0.115 80);  --color-zaid: oklch(61% 0.07 125);
  --radius-card: 2px;  --radius-key: 2px;  /* photographs and full-bleed surfaces: 0 */
  --font-display: "Clash Display", sans-serif;  --font-body: "Switzer", sans-serif;  --font-outlier: "Sentient", serif;
}
```
Faces load from Fontshare (Clash Display 500, Switzer 400 and 500, Sentient 400). Sentient has one role: editorial leads and statements. Tailwind utilities use the token names; never the stock palette.

## Seasons
`frontend/src/lib/seasons.js` holds the typical windows (Kharif June to October, Rabi November to March, Zaid April and May) and this month's field note. Every surface that shows them says they are typical and shift by region and with the rains. Records map to a season through its aliases (ravi is Rabi).

## Controls
- Primary: `.key.key--primary`, brass fill with forest ink, 2px radius, 52px (40px with `key--app`)
- Secondary: `.key` outline; `.key--on-field` over photographs; `.key--ink` filled forest inside ivory sections
- Season tabs (`.seasontab`): giant display words with a season-coloured rule; crop chips (`.cropchip`), crop rows (`.cropline`)

## Surfaces
- Night bands and photographs alternate with ivory; one transition is a photograph cut on the bias (`.bias`)
- The almanac strip (`.almanac`), the month band (`.monthband`), the season calendar (`.yearcal`), the soil and water matrix (`.matrix`)
- App shell: a fixed night rail (`.rail`); the assistant console (`.console`) with a context panel

## Geometry
- 2px radii on controls and panels, 0 on photographs; 1px hairlines separate, never card shadows; icons stand plain, never in tiles.

## 3D
- `frontend/src/three/wheatScene.js` (three.js, lazy-loaded by `components/SoilPlant.jsx`) draws the crop in its soil profile from the colour tokens; it loads only at 60rem and wider with WebGL and motion allowed, carries a pause control, and stops off screen.

## Motion
- Purposeful only: the hero settles in and its layers part at three speeds on scroll; photographs unveil and section heads rise as they enter (CSS scroll-driven); answer parts stagger in; the 3D sways under a pause control. Everything ends at once under reduced motion.

## Exports
`frontend/src/tokens.css`, written as a Tailwind v4 `@theme static` block.
