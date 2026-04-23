# OxProx — Investor Voting Visualisation

A small interactive web page that shows how five fictional institutional
investors voted across five shareholder resolutions. Built for the
OxProx Full Stack Developer take-home (Task 1 — Data Visualisation).

**Live demo:** [https://oxprox-task.vercel.app](https://oxprox-task.vercel.app)

**Direct link:** [Open the deployed app](https://oxprox-task.vercel.app)

## What it does

- Renders a **stacked bar chart** (votes per investor, grouped by
  For / Against / Abstain) using the OxProx **graph palette**.
- **Interactive tooltip** on hover shows the exact counts, percentages,
  and the specific resolutions that fall under each vote category.
- **Responsive** layout for desktop and mobile; the chart rescales and
  the branded footer reflows on narrow screens.
- **Animated** entrances powered by Framer Motion, with bar-grow
  animation in Recharts. All motion is short-circuited when the OS
  has `prefers-reduced-motion: reduce`.
- **On-brand** typography: DM Serif Display (headings) and IBM Plex
  Sans (body), loaded via `next/font/google`.
- **Brand assets** in use: dark wordmark in the header, white wordmark
  over a low-opacity OxProx pattern in the footer, core palette for UI
  surfaces.

## Tech stack

- **Framework:** Next.js 16 (App Router) + TypeScript
- **Styling:** Tailwind CSS v4 (`@theme` tokens for the OxProx palette)
- **Charts:** Recharts 3
- **Animation:** Framer Motion 12
- **Icons:** lucide-react (available, currently unused)

## Project layout

```
app/
  components/
    HomeContent.tsx   # Client component with staggered hero and reveals
    SiteHeader.tsx    # Brand wordmark + kicker
    SiteFooter.tsx    # Dark-blue footer with pattern and white wordmark
    VotesChart.tsx    # Recharts stacked bar chart with custom tooltip
  data/
    votes.ts          # Typed dataset and investor summary helper
  globals.css         # Tailwind v4 theme tokens + reduced-motion safety net
  layout.tsx          # Root layout, loads DM Serif Display and IBM Plex Sans
  page.tsx            # Server component; composes header / main / footer
public/brand/         # Copied from the OxProx Brand Kit
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

## Deploy

Deploys cleanly to **Vercel** with zero configuration.

1. Push this repo to GitHub.
2. Visit <https://vercel.com/new>, import the repo, and accept the
   detected Next.js settings.
3. Vercel will issue a `*.vercel.app` URL — drop it into the
   **Live demo** line at the top of this README.

## Design notes

- **Chart choice.** A stacked bar per investor answers the most direct
  question from the brief: "How did each investor vote across the five
  resolutions?" The tooltip surfaces the per-resolution detail so the
  reader can drill in without adding a second chart.
- **Colours.** For / Against / Abstain are mapped to three distinct
  hues from the OxProx **graph palette** (`#25C3B2`, `#9D013D`,
  `#E6AC12`) to keep the semantics readable and on-brand.
- **Motion.** Subtle, short (≤ 700 ms), and gated by
  `useReducedMotion` so it never fights accessibility preferences.
- **Brand restraint.** The `X` mark and gradient were left out in line
  with the brand guidelines ("use occasionally", "use sparingly").

## Credits

- Fictional dataset supplied in the OxProx take-home brief.
- Colours and typography follow the **OxProx Brand Guidelines**
  (September 2025).
