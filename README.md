# Aurum Design System

> Simple, minimal, and technical design system for web and mobile.
> Built with React, TypeScript, styled-components, and React Native.

Aurum is a cross-platform token-first design system inspired by the structure of [Tamagui](https://tamagui.dev/) — sharing a single source of truth between web and native — and the visual direction of automotive cockpit UIs (Hyundai Pleos Connect, Tesla). The result is a minimal, cool, technical surface with generous whitespace and no decorative noise.

---

## Brand Context

**Audience.** Product engineers and designers building React + React Native apps that need a single, no-nonsense visual language across both platforms.

**Personality.** Quiet, precise, instrument-like. The system gets out of the way. There are no flourishes, gradients, or warm tones; the only color in the palette is a single deep ocean teal that signals action.

**Reference points.**
- **Tamagui** — token architecture, `createTokens` shape, web/native parity.
- **Hyundai Pleos Connect** — cool dark canvas, surface elevation by tone (not shadow), generous spacing, monospace-adjacent precision in numbers and labels.
- **Tesla UI** — minimal chrome, large hit areas, restrained typography.

**Source materials given by the user.**
- Color palette (dark + light) — pasted in spec, see `tokens/color.ts`.
- Spacing / radius / type scales — pasted in spec, see `tokens/`.
- No codebase, no Figma file, no logo files were provided. Logos and full UI kits are intentionally **out of scope** for this initial pass; the user explicitly asked for *folder structure and tokens only, no components yet*.

---

## Index

```
.
├── README.md                  ← you are here
├── SKILL.md                   ← Agent Skill manifest
├── colors_and_type.css        ← CSS-var bridge for HTML previews
├── tokens/                    ← cross-platform token source of truth
│   ├── index.ts               ← public surface — re-exports everything
│   ├── color.ts               ← dark + light palettes, semantic colors
│   ├── space.ts               ← 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64
│   ├── radius.ts              ← 4 / 8 / 12 / 16 / 24
│   ├── size.ts                ← control heights, hit targets
│   ├── typography.ts          ← family / size / weight / lineHeight
│   ├── shadow.ts              ← minimal dark, subtle light
│   ├── zIndex.ts              ← layering scale
│   ├── animation.ts           ← duration + easing curves
│   └── themes.ts              ← assembled `light` + `dark` theme objects
├── src/
│   ├── theme/
│   │   ├── ThemeProvider.tsx  ← styled-components ThemeProvider wrapper
│   │   ├── GlobalStyle.ts     ← reset + body defaults (web only)
│   │   ├── styled.d.ts        ← styled-components DefaultTheme augmentation
│   │   └── useTheme.ts        ← hook re-export with typed theme
│   ├── platform/
│   │   ├── styled.web.ts      ← `import styled from 'styled-components'`
│   │   └── styled.native.ts   ← `import styled from 'styled-components/native'`
│   ├── tokens-rn/
│   │   └── index.ts           ← RN-flavored token export (numbers, no `px`)
│   └── components/
│       └── forms/             ← Button, Input/TextArea, Label, Form/FormField,
│                                 Checkbox, RadioGroup, Switch, ToggleGroup,
│                                 Select, Slider, Progress
│                                 (each shipped as `*.web.tsx` + `*.native.tsx`,
│                                  picked by bundler platform extension)
├── preview/                   ← cards rendered in the Design System tab
│   ├── colors-dark.html
│   ├── colors-light.html
│   ├── colors-semantic.html
│   ├── colors-primary.html
│   ├── type-scale.html
│   ├── type-anatomy.html
│   ├── spacing-scale.html
│   ├── radius-scale.html
│   ├── shadow-scale.html
│   └── tokens-architecture.html
└── assets/                    ← logos, icons, imagery (empty for now)
```

The codebase compiles to a tree of plain `.ts` token files plus a thin styled-components integration layer. Components are deferred to a follow-up pass.

---

## Content Fundamentals

Aurum's voice mirrors its visuals: short, factual, lower-stakes than marketing copy.

- **Casing.** Sentence case for everything — labels, buttons, headings. No Title Case. No ALL CAPS except for instrument-style numeric readouts (e.g. `KM/H`, `°C`) where it reinforces the cockpit metaphor.
- **Person.** Second person (`you`) when addressing the user; first person plural (`we`) is avoided. Empty states and errors describe the state, not the system's feelings — `No saved routes` not `You don't have any routes yet!`.
- **Punctuation.** No exclamation marks. Periods at the end of full sentences only; labels and buttons drop the period.
- **Numbers.** Always numerals, never spelled out. Units are uppercase and tight to the number: `120KM/H`, `24°C`, `8GB`. Currency uses ISO codes — `1,200 KRW`, `$49 USD`.
- **Emoji.** Never. Aurum substitutes geometric icons or omits the decoration entirely.
- **Tone examples.**
  - Button: `Save` / `Cancel` / `Connect` — single verbs preferred.
  - Confirmation: `Route saved.` (not `Great, your route is saved! 🎉`)
  - Error: `Connection lost. Retry.` (not `Oops! Something went wrong.`)
  - Empty state: `No vehicles paired.` (not `Looks like there's nothing here yet.`)
  - Section heading: `Climate` / `Charging` / `Account` — single nouns.

The vibe target is the language of an instrument cluster: declarative, terse, neutral.

---

## Visual Foundations

### Color
Aurum is a **two-mode, low-chroma** system. Both modes are anchored on near-neutral grays so the single accent (deep ocean teal `#0E7C7B`) carries all signal.

| Role          | Dark        | Light       | Notes |
|---------------|-------------|-------------|-------|
| `background`  | `#1E1E1E`   | `#F0F0EE`   | Page canvas |
| `surface`     | `#272727`   | `#F7F7F5`   | Sheets, modals, sticky bars |
| `card`        | `#313131`   | `#F7F7F5`   | Raised content blocks |
| `border`      | `#3A3A3A`   | `#D8D8D6`   | Hairline dividers |
| `input`       | `#272727`   | `#EEEEED`   | Inset fields — *darker than card to read as recessed* |
| `text`        | `#E8E8E8`   | `#1A1A1A`   | Soft white in dark, near-black in light |
| `subtext`     | `#888888`   | `#999999`   | Secondary copy |
| `placeholder` | `#666666`   | `#AAAAAA`   | Field placeholder only |
| `primary`     | `#0E7C7B`   | `#0E7C7B`   | Accent, identical across modes |
| `primary-hover` | `#0A6362` | `#0A6362`   | |
| `primary-subtle`| `#062525` | `#D0EFED`   | Tinted backgrounds for primary chips/badges |
| `primary-text`| `#0E7C7B`   | `#0A6362`   | Accent text on neutral surface |
| `success`     | `#1D9E75`   | `#1D9E75`   | |
| `error`       | `#E24B4A`   | `#E24B4A`   | |
| `warning`     | `#EF9F27`   | `#EF9F27`   | |

**Imagery vibe.** Cool, neutral, slightly desaturated; if photography is used, it leans toward dusk, fog, or studio gray. No warm/golden grading.

### Type
- **Family.** `'Inter'` (user-supplied variable fonts in `/fonts`) for UI, falling back to system sans (`-apple-system, Segoe UI, ...`). Numbers use the same family with `font-variant-numeric: tabular-nums` so digits never jitter — important for the instrument-cluster feel.
  - Variable axes available: `opsz` (optical size) and `wght` (100–900). Italic is shipped as a separate variable file.
- **Scale (px).** `11 / 13 / 15 / 18 / 22 / 28 / 36`. No size outside this scale.
- **Weights.** `400` body, `500` UI labels, `600` emphasis. No italics in UI.
- **Line height.** `1.45` for body copy, `1.2` for display sizes (`22+`), `1` for single-line numeric readouts.
- **Letter spacing.** `-0.01em` on display sizes (`22+`); `0` elsewhere; `0.04em` on small uppercase readouts.

### Spacing
A modular scale: `4 · 8 · 12 · 16 · 24 · 32 · 48 · 64`. Touch targets are 44px minimum on native, 40px on web. **Whitespace is the primary compositional tool** — pages should feel under-filled before they feel busy.

### Radius
`4 · 8 · 12 · 16 · 24`. Inputs and small chips use `8`; cards use `12`; modals and sheets use `16`; full-bleed media uses `24`. No fully-rounded pills except for status dots.

### Shadows
- **Dark mode:** essentially none. Elevation is communicated by *tone* (card lighter than surface, surface lighter than background). A single `shadow.sm` token exists for floating menus only: `0 2px 8px rgba(0,0,0,0.4)`.
- **Light mode:** subtle, single-direction. `shadow.sm = 0 1px 2px rgba(0,0,0,0.04)`, `shadow.md = 0 4px 12px rgba(0,0,0,0.06)`, `shadow.lg = 0 12px 32px rgba(0,0,0,0.08)`. No colored shadows.

### Borders
1px hairlines only. Borders carry more visual load than shadows in this system; a card is "raised" by being a lighter tone *and* having a border, not by a shadow.

### Backgrounds
Flat. No gradients, no patterns, no illustrations, no full-bleed photography in chrome. The canvas is one of the tokenized neutrals; that's it. Hero sections in marketing surfaces may use a single full-bleed photograph with a 30% black overlay, but never within product UI.

### Animation
- **Easing.** A single curve everywhere: `cubic-bezier(0.2, 0.8, 0.2, 1)` (approximate "standard" curve).
- **Durations.** `120ms` for micro-feedback (hover, press), `200ms` for component state transitions, `320ms` for sheet/modal entrances.
- **No bounces, no overshoots.** Motion is linear-feeling, mechanical.
- **Fades, not slides** for state changes within a surface; **slides, not fades** for navigation transitions.

### Hover & Press
- **Hover (web):** background steps one tone lighter (dark) or darker (light) — never opacity changes.
- **Press:** background goes to `primary-subtle` for primary controls; for neutrals, opacity drops to `0.85` for ~80ms then snaps back.
- **Focus:** 2px ring in `primary` at 2px offset. No glow.

### Layout rules
- Top app bar is `56px` on web, `48px` on native.
- Side gutter is `space.6` (32px) on desktop, `space.4` (16px) on mobile.
- Cards never butt against each other — minimum `space.3` (12px) gap.
- Numbers and units in metric displays align baseline-to-baseline; the unit is always `subtext` color.

### Transparency & Blur
Used sparingly. Sheets and overlays sit on a `rgba(0,0,0,0.5)` scrim (dark) or `rgba(0,0,0,0.3)` scrim (light). Backdrop blur of `20px` is applied only to floating top bars when content scrolls under them; never to cards or modals.

### Cards
Tone-shifted (`#313131` over `#272727`, or `#F7F7F5` over `#F0F0EE`), 1px border in `border` token, radius `12`, no shadow in dark, `shadow.sm` in light. Inner padding `space.5` (24px).

---

## Iconography

The user did not supply an icon set. **Aurum recommends [Lucide](https://lucide.dev/) loaded from CDN** as its closest visual match: 1.5px stroke, 24px grid, geometric, no fills. This matches the instrument-cluster, Pleos-Connect-adjacent aesthetic better than Heroicons (rounder) or Tabler (heavier).

- **Format.** SVGs, inline. Stroke-based. Never PNGs in product UI.
- **Stroke weight.** 1.5px at 24px nominal. Never recolored except to `currentColor`.
- **Sizing.** `16 / 20 / 24` only.
- **Emoji.** Not used.
- **Unicode glyphs.** Not used as icons. Bullet characters and arrows in body copy are fine.

**Substitution flag.** Lucide is a stand-in. If the user has a proprietary icon set (the Pleos Connect glyphs themselves are licensed), please drop the SVGs into `assets/icons/` and we will rewire the recommendation.

---

## Caveats & open questions

1. **Fonts.** Inter variable fonts (regular + italic) are shipped in `/fonts` and wired into `colors_and_type.css`. ✅
2. **No logo / brand assets.** Nothing was provided; `assets/` is empty by design.
3. **Components.** First component family — **Forms** — is now in `src/components/forms/` (Button, Input, Label, Form, Checkbox, RadioGroup, Switch, ToggleGroup, Select, Slider, Progress; each as paired `.web.tsx` + `.native.tsx`). Other families (overlays, navigation, data display) are deferred.
4. **No real codebase or Figma file** was attached, so the visual foundations were derived from the pasted color spec + "Pleos Connect / Tesla minimal" reference. If a real reference exists, attach it and we'll tighten the scale.

---

## Publishing as an npm package

Aurum is set up to ship as a single npm package with three subpath entries.

### Quickstart for consumers

```bash
npm install aurum-design-system styled-components react react-dom
```

```tsx
import { ThemeProvider, GlobalStyle, Button } from 'aurum-design-system';

export function App() {
  return (
    <ThemeProvider initialMode="dark">
      <GlobalStyle />
      <Button variant="primary">Hello, Aurum</Button>
    </ThemeProvider>
  );
}
```

Token-only consumers (RN, Tailwind plugin authors, design-token tooling) can pull tokens without React:

```ts
import { darkTheme, space, radius } from 'aurum-design-system/tokens';
```

React Native consumers either let Metro pick `*.native.tsx` from the package root automatically, or import explicitly from `aurum-design-system/native`.

### Build pipeline

| File | Purpose |
| --- | --- |
| `package.json` | Three `exports` entries (`.`, `./tokens`, `./native`), `peerDependencies` for React + styled-components, `sideEffects: false` for tree-shaking. |
| `tsconfig.json` | Strict TS, `moduleResolution: "Bundler"`, ES2020. Excludes `*.native.tsx` from the web typecheck. |
| `tsup.config.ts` | Three named entries × CJS/ESM × `.d.ts`. Externalizes `react`, `react-dom`, `react-native`, `styled-components`. |
| `.eslintrc.cjs` | TS + React + react-hooks rules. |

```bash
npm run lint        # eslint
npm run typecheck   # tsc --noEmit
npm run build       # tsup → dist/
npm pack --dry-run  # inspect the tarball before tagging
```

### GitHub Actions

Two workflows live in `.github/workflows/`:

- **`ci.yml`** — runs on every push to `main` and every PR. Matrix on Node 18 + 20: lint → typecheck → build → `npm pack --dry-run`.
- **`release.yml`** — triggers on `v*.*.*` Git tags. Verifies the tag matches `package.json` version, rebuilds, then `npm publish --access public --provenance`. Drafts a GitHub Release with auto-generated notes.

### One-time setup before the first publish

1. Create an npm **automation token** scoped to the package (`npmjs.com → Access Tokens → Granular`). Add it as `NPM_TOKEN` in `Settings → Secrets and variables → Actions`.
2. Update `repository.url`, `homepage`, and `bugs` in `package.json` to the real org/repo.
3. Pick the package name. The default is `aurum-design-system`; if that's taken on npm, switch to a scope (e.g. `@your-org/aurum`) and the `release.yml` `--access public` flag still applies.

### Cutting a release

```bash
npm version minor              # 0.1.0 → 0.2.0, writes a git tag locally
git push origin main --follow-tags
# release.yml runs: lint → typecheck → build → publish (with provenance) → GitHub Release
```

The job is idempotent — if any step fails, no publish happens.
