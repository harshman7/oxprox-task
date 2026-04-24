# OxProx - Investor Voting Visualisation

**Live demo:** <https://oxprox-task.vercel.app>

A small interactive web page that shows how five fictional institutional
investors voted across five shareholder resolutions. Built for the
OxProx Full Stack Developer take-home (Task 1 - Data Visualisation).

## What it does

- **Stacked bar chart** (votes per investor, grouped by For / Against /
  Abstain) drawn with Recharts and the OxProx **graph palette**.
- **Accessible chart encoding.** Each vote type is distinguished by both
  colour *and* fill pattern (solid, diagonal, dots), so the chart reads
  cleanly for colour-blind viewers. Pattern hints are shown in the
  legend and mirrored in the tooltip.
- **Interactive tooltip** on hover showing the exact counts,
  percentages, and the specific resolutions behind each block.
- **Dark and light mode** with a brand-kit toggle. The theme persists to
  `localStorage`, respects `prefers-color-scheme` on first load, and
  uses the CSS View Transitions API for a smooth crossfade.
- **Key insights section** - broadest support, broadest opposition,
  most contested resolution, and total ballot volume - rendered as
  animated count-ups over a locked dark-navy panel.
- **Per-resolution cards** (`P1`-`P5`) showing the carried outcome, a
  100% mini tally bar that reuses the same pattern fills as the main
  chart, and per-investor vote pills.
- **Responsive** layout - chart, legend, insights and resolution cards
  all reflow for narrow viewports.
- **Motion** via Framer Motion: masked hero reveal, staggered entries,
  animated bar grow, aggressive hover states. All motion is short-
  circuited by `useReducedMotion` / `prefers-reduced-motion`.
- **On-brand** typography (DM Serif Display for display, IBM Plex Sans
  for body, both via `next/font/google`) and brand assets (dark / light
  wordmark in the header, white wordmark over a low-opacity OxProx
  pattern in the footer).

## Tech stack

- **Framework:** Next.js 16 (App Router) + TypeScript
- **Styling:** Tailwind CSS v4 (`@theme` tokens + `@custom-variant dark`)
- **Charts:** Recharts 3
- **Animation:** Framer Motion 12
- **Icons:** lucide-react

## Project layout

```
app/
  components/
    chart/
      VotePatterns.tsx     # Shared SVG pattern defs + swatch primitive
    motion/
      CountUp.tsx          # Integer count-up respecting reduced motion
      hover.ts             # Shared hover / tap / spring presets
    HomeContent.tsx        # Hero, reading guide, chart, insights, resolutions
    KeyInsights.tsx        # Narrative insight panel with animated metrics
    ResolutionsSection.tsx # Per-resolution cards with mini tally bars
    SiteHeader.tsx         # Wordmark + kicker + theme toggle
    SiteFooter.tsx         # Dark-blue footer with pattern and white wordmark
    ThemeToggle.tsx        # Dark / light switch with View Transitions
    VotesChart.tsx         # Recharts stacked bar chart with custom tooltip
  data/
    votes.ts               # Typed dataset + summary / insight helpers
  hooks/
    useThemeTokens.ts      # Live CSS-variable subscription for Recharts
  globals.css              # Tailwind v4 theme tokens, dark overrides
  icon.svg                 # Favicon (OxProx X mark)
  layout.tsx               # Root layout, fonts, pre-hydration theme script
  page.tsx                 # Server component: header / main / footer
public/brand/              # Copied from the OxProx Brand Kit
```

## Run it locally

**Prerequisites:** Node.js 20+ (tested on Node 24), npm 10+.

```bash
npm install
npm run dev
```

Then open <http://localhost:3000>.

### Other scripts

```bash
npm run build   # production build
npm run start   # start the production server (after build)
npm run lint    # ESLint
```

## Deployment

Deployed on **Vercel** at <https://oxprox-task.vercel.app>. The project
uses zero custom Vercel configuration - push to the tracked branch and
Vercel picks up the detected Next.js settings automatically.

## Design notes

- **Chart choice.** A stacked bar per investor answers the most direct
  question from the brief: "How did each investor vote across the five
  resolutions?" The tooltip surfaces the per-resolution detail so the
  reader can drill in without adding a second chart.
- **Colours.** For / Against / Abstain are mapped to three distinct
  hues from the OxProx **graph palette** (`#25C3B2`, `#9D013D`,
  `#E6AC12`) and paired with SVG fill patterns so the encoding survives
  colour-blindness and monochrome printing.
- **Dark mode.** Tailwind v4 `@custom-variant dark` plus overridden
  `--color-*` and `--ox-*` CSS variables means every `text-ink`,
  `bg-surface`, `border-canvas-alt` utility flips automatically. The
  panels that must stay dark regardless of theme (Reading the chart,
  Key insights) are pinned to hex navy with a `dark:` ring.
- **Motion.** Subtle, short (<= 700 ms), and gated by
  `useReducedMotion` so it never fights accessibility preferences.
- **Brand use.** Dark wordmark in the header (swaps to the light
  wordmark in dark mode), white wordmark over a low-opacity pattern in
  the footer.

## Credits

- Fictional dataset supplied in the OxProx take-home brief.
- Colours, typography, and assets follow the **OxProx Brand Guidelines**
  (September 2025).
