---
name: Gym Progress Dashboard
description: A personal, phone-first gym logging tool built on shadcn/ui — cast-iron neutrals with a single brass accent reserved for data.
colors:
  warm-paper: "#FAF9F7"
  cast-iron: "#1C1A18"
  foundry-grey: "#EFECE8"
  iron-filings: "#71675E"
  hairline: "#E3DED8"
  foundry-brass: "#9A6913"
  alarm-red: "#EF4444"
typography:
  display:
    fontFamily: "IBM Plex Mono, ui-monospace, SFMono-Regular, monospace"
    fontSize: "2rem"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.25
rounded:
  sm: "2px"
  md: "4px"
  lg: "6px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "24px"
components:
  button-primary:
    backgroundColor: "{colors.cast-iron}"
    textColor: "{colors.warm-paper}"
    rounded: "{rounded.md}"
    padding: "10px 16px"
  button-primary-hover:
    backgroundColor: "{colors.cast-iron}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.cast-iron}"
    rounded: "{rounded.md}"
  button-destructive:
    backgroundColor: "{colors.alarm-red}"
    textColor: "{colors.warm-paper}"
    rounded: "{rounded.md}"
  card:
    backgroundColor: "{colors.warm-paper}"
    textColor: "{colors.cast-iron}"
    rounded: "{rounded.lg}"
  stat-figure:
    backgroundColor: "{colors.warm-paper}"
    textColor: "{colors.foundry-brass}"
    typography: "{typography.display}"
---

# Design System: Gym Progress Dashboard

## Overview

**Creative North Star: "The Foundry Log Book" — a workshop tool, not a fitness app.**

This is a personal gym-progress tracker, used one-handed, standing at the gym, between sets. It was originally built on an untouched shadcn/ui scaffold — every surface at 0%-saturation gray, with the two Recharts pages importing Recharts' own demo colors (`#8884d8`, `#0088FE`, `#00C49F`…) unrelated to the app's own `--chart-1..5` tokens. This document and its tokens are now **implemented**, applied via `/impeccable colorize` to `app/globals.css`, `tailwind.config.ts`, `app/layout.tsx` (IBM Plex Mono loaded alongside Inter), and the Recharts color props in `progress-content.tsx` / `exercise-detail-client.tsx`.

The governing image is a well-lit workbench: austere, but with good materials. Surfaces are cast iron — neutral grays with a deliberate whisper of warmth, never a stark, temperature-less gray. Exactly one warm accent exists in the whole system — a brass/amber tone, evoked by foundry metal rather than gym-branding orange — and it appears **only on data**: the current-weight figure, the personal-best figure, the strength-trend line. It never touches a button, a nav item, or any other piece of UI chrome. The numbers are the protagonist of every screen they appear on; everything else recedes to let them read at a glance, one-handed, mid-set.

**Key Characteristics:**
- Cast-iron neutrals (warm-tinted grays, never 0% saturation) for every surface, border, and body of text.
- One brass accent (`#9A6913`), used exclusively for data emphasis — never decorative, never on chrome.
- Heavy monospaced numerals (IBM Plex Mono, tabular by nature) for every weight/rep/set figure; Inter stays for UI labels and body copy.
- Flat surfaces separated primarily by a hairline border and whitespace, with a subtle shadow (kept from the incumbent shadcn defaults) doing the rest — never a nested card.
- Native dark mode from day one, not a bolted-on inversion.

## Colors

Cast iron with temperature: every neutral carries a faint warm (≈30° hue) cast rather than sitting at 0% saturation. The warmth is nearly imperceptible at the lightness extremes (paper-white, ink-black) and becomes visibly a "warm gray" — not a "gray gray" — in the mid-tones (borders, secondary surfaces, muted text). Exactly one saturated color exists in the system.

### Primary
- **Foundry Brass** (`#9A6913`): The single data accent. Used only for: the current-weight figure, the personal-best figure, and the strength-trend line/bar in Progreso. Never used on a button, link, active nav state, or any decorative surface. Deliberately darker than a typical "brass/gold" swatch — this is the value that clears WCAG AA (4.53:1) as *text* on Warm Paper, not just as a chart fill; a brighter gold reads well as a swatch but fails as a number you have to read mid-set.

### Neutral
- **Warm Paper** (`#FAF9F7`): Background, card, and popover surfaces; also the text color on top of Cast Iron (primary-foreground, dark-mode background).
- **Cast Iron** (`#1C1A18`): Body text, headings, default button background, focus ring.
- **Foundry Grey** (`#EFECE8`): Secondary surfaces, muted backgrounds, hover/accent state for ghost buttons and menu items.
- **Iron Filings** (`#71675E`): Muted/secondary text — captions, helper copy, placeholder text.
- **Hairline** (`#E3DED8`): Borders, input outlines, dividers, table row separators.

### Functional (unchanged from the incumbent system)
- **Alarm Red** (`#EF4444`): Destructive actions and error states only (delete confirmations, form validation). Deliberately outside the cast-iron/brass family so "dangerous" never reads as "brass" or vice versa.

### Data Series (Progreso charts)
A five-step bronze-to-gold ramp replaces Recharts' demo rainbow (`#8884d8`, `#0088FE`, `#00C49F`, `#FFBB28`, `#FF8042`) for category/series distinction (the muscle-group pie chart, the current-vs-best bar pair). The single-series strength-trend line always uses Foundry Brass directly, never the ramp.
- Deep Bronze `#472A15`
- Burnished Copper `#6D4217`
- Foundry Brass `#9A6913` (flagship — same token as the data accent above)
- Warm Gold `#DBA424`
- Pale Straw `#E2CD8D`

### Named Rules
**The Data-Only Accent Rule.** Foundry Brass appears exclusively where it represents a number: a current weight, a personal best, a trend line. It is never a button color, a link color, an active-state color, or a decorative flourish. If you're tempted to use brass on a piece of chrome, use Cast Iron instead.

## Typography

**Display Font:** IBM Plex Mono (with `ui-monospace, SFMono-Regular` fallback)
**Body Font:** Inter (with `ui-sans-serif, system-ui` fallback) — already wired via `next/font/google` in `app/layout.tsx`
**Character:** Inter carries every label, button, and sentence of copy — quiet and highly legible, doing no expressive work of its own. IBM Plex Mono is reserved entirely for numbers: its built-in tabular figures and slightly technical, gauge-readout character make every weight/rep/set value feel measured rather than typed.

### Hierarchy
- **Display** (700, 2rem–2.5rem, 1.1 line-height, IBM Plex Mono): The single dominant figure on a screen — "Peso actual" on the exercise detail page, the big stat in a dashboard KPI card. Should visibly out-weigh every other element on the screen it appears on.
- **Title** (600, 1.125rem, 1.3 line-height, Inter): Card titles, dialog titles, exercise names.
- **Body** (400, 1rem, 1.5 line-height, Inter): Descriptions, dialog copy, form helper text.
- **Numeric-Label** (500, 0.875rem–1rem, IBM Plex Mono): Smaller numeric contexts — table cells (set × reps), secondary KPI cards — where the number still deserves tabular alignment but isn't the screen's single protagonist.
- **Label** (500, 0.875rem, Inter, no letter-spacing): Form labels, nav items, button text.

### Named Rules
**The One Protagonist Rule.** Exactly one Display-scale figure may appear per screen. Every other number on that screen drops to Numeric-Label. A screen with four equally-sized "text-2xl font-bold" stat cards (as the current dashboard and exercise-detail pages both have today) violates this rule — one of the four is what the user actually opened the page to check; the layout should say so.

## Layout

Single-column on mobile (the primary usage context — logged from a phone mid-workout), widening to a 2–4 column grid at `md`/`lg` breakpoints for KPI cards and exercise grids. Category/section groups are separated by a heading + hairline rule and vertical whitespace (`space-y-6`), not by a wrapping card — cards are reserved for individual data records (one exercise, one KPI, one chart), never for grouping other cards. Density is comfortable, not tight: dialogs cap at `max-w-[425px]` on forms, tables scroll horizontally rather than compress. Standard spacing rhythm: `gap-2`/`gap-3` for tight inline groups (icon-button rows), `gap-4` for card grids, `space-y-6` between major page sections.

## Elevation & Depth

Hybrid, leaning flat: surfaces are primarily distinguished by a 1px Hairline border and whitespace, with a low, ambient shadow layered on top for cards (`shadow-sm`) and a stronger one for anything that floats above the page (dialogs, alert dialogs: `shadow-lg`). The shadow is structural, not decorative — it tells the user "this is a separate surface" or "this is floating above everything else," and never appears purely for texture. No card is ever nested inside another card; that job belongs to the heading + hairline pattern in Layout.

### Shadow Vocabulary
- **Resting surface** (`box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05)` — Tailwind's `shadow-sm`): Cards, per-exercise tiles.
- **Floating surface** (`box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)` — Tailwind's `shadow-lg`): Dialogs, alert dialogs, sheets.

### Named Rules
**The No-Nesting Rule.** A card never contains another card's chrome (border + shadow + padding) as its direct wrapper. Group with a heading and a hairline, not a second card.

## Shapes

Corners tighten from the shadcn default toward something more tool-like: `--radius` moves from 8px to **6px** (`rounded-lg` = 6px, `rounded-md` = 4px, `rounded-sm` = 2px). Still soft enough to feel humane on a touch device, but crisp enough to read as an instrument rather than a consumer app. Borders are always 1px Hairline; no double borders, no colored borders outside the destructive/alarm state.

## Components

### Buttons
- **Shape:** `rounded-md` (4px).
- **Primary:** Cast Iron background, Warm Paper text, `h-10 px-4` — the only button variant used for the default/primary action.
- **Destructive:** Alarm Red background, Warm Paper text — delete/remove actions only.
- **Ghost:** Transparent, Cast Iron text, Foundry Grey background on hover — used for icon-only actions (edit, delete-trigger, nav items in the sidebar).
- **Icon size:** Never below 40×40px (`size="icon"`, `h-10 w-10`) when it triggers a destructive or otherwise consequential action; this is a hard floor, not a default that can be shrunk with a `className` override.

### Cards / Containers
- **Corner Style:** `rounded-lg` (6px).
- **Background:** Warm Paper.
- **Shadow Strategy:** Resting-surface shadow (see Elevation).
- **Border:** 1px Hairline.
- **Internal Padding:** 24px (`p-6`) header/content, tightened to 16px (`p-4`) inside dense contexts like the per-set logging blocks.

### Inputs / Fields
- **Style:** 1px Hairline border, Warm Paper background, `rounded-md`.
- **Focus:** Cast Iron ring (`focus-visible:ring-2 focus-visible:ring-ring`), no border color change.
- **Numeric fields** (weight, reps, sets): use the Numeric-Label typography so what you're typing visually matches what you'll see once it's saved.

### Navigation
Sidebar (desktop) and Sheet (mobile) share the same pattern: ghost-style nav buttons, full-width, left-aligned icon + label, Foundry Grey hover state, no active-route highlighting today. Both currently render their own literal `<h1>` app-name string rather than reading a single shared constant — `"Weight Tracker"` in the sidebar and the mobile bar's collapsed state, `"Gym Progress"` in the mobile bar's expanded sheet — none of which match PRODUCT.md's "Luxor." This is a naming/copy inconsistency, not a visual-token issue; flag it for `/impeccable clarify` rather than fixing it here.

### Stat Figure (signature component)
The one component this system is built around: a large numeric value in Display typography, in Foundry Brass when it is the screen's single protagonist figure (current weight, personal best) or Cast Iron when it's a secondary/contextual number. Always paired with a small Iron-Filings caption below it stating what the number is and, where relevant, its unit.

## Do's and Don'ts

### Do:
- **Do** keep Foundry Brass to data only — current weight, personal best, the trend line. Everything else stays Cast Iron / Foundry Grey / Warm Paper.
- **Do** render every weight/rep/set number in IBM Plex Mono with tabular figures, even in dense table cells.
- **Do** separate grouped content with a heading + Hairline rule, never a wrapping card.
- **Do** keep icon-only buttons at a 40×40px floor, especially for destructive actions.
- **Do** keep every Recharts color prop pointed at `hsl(var(--chart-N))` / `hsl(var(--accent-data))` — never reintroduce a hardcoded hex like the old `#8884d8` demo purple.

### Don't:
- **Don't** use Foundry Brass on a button, a link, an active nav state, or any other piece of UI chrome — that's what Cast Iron is for.
- **Don't** nest a Card inside another Card's header/content as a grouping mechanism.
- **Don't** introduce a second accent hue for "variety" in the charts — the Data Series ramp is a single hue family (bronze→gold) on purpose.
- **Don't** reintroduce a plain `body { font-family: ... }` override in `app/globals.css` — Inter and IBM Plex Mono are both wired through `next/font`'s `variable`/`className` mechanism in `app/layout.tsx`; a hand-written CSS rule would silently fight it.
- **Don't** add gradients, glassmorphism, italic serif display type, achievement badges/streaks/confetti, hero sections/CTAs, or icon tiles above headings — all explicitly rejected in PRODUCT.md.
