/**
 * Main landing content: hero, reading guide, dynamically loaded chart, key
 * insights, and per-resolution cards. Owns Framer Motion orchestration and
 * vertical rhythm (`space-y-*`) between sections.
 */

"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import dynamic from "next/dynamic";

import KeyInsights from "@/app/components/KeyInsights";
import ResolutionsSection from "@/app/components/ResolutionsSection";
import { HOVER_SPRING } from "@/app/components/motion/hover";

// Recharts' ResponsiveContainer needs a measured DOM parent; rendering it
// during SSR logs a benign width/height warning. Defer to the client so the
// container has real dimensions on first paint, with a same-size placeholder
// to keep layout stable.
const VotesChart = dynamic(() => import("@/app/components/VotesChart"), {
  ssr: false,
  loading: () => (
    <div className="h-[380px] w-full sm:h-[440px]" aria-hidden />
  ),
});

/** Shared easing curve for hero + reveal animations (matches brand motion feel). */
const EASE = [0.22, 1, 0.36, 1] as const;

/** Stagger container for the hero block only. */
const heroContainer: Variants = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
};

/** Eyebrow line fades up into place. */
const heroEyebrow: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
};

/**
 * Each headline line slides up from inside an `overflow-hidden` wrapper
 * (mask reveal). `y: "110%"` starts the text just below the clip edge.
 */
const heroLine: Variants = {
  hidden: { y: "110%" },
  show: { y: "0%", transition: { duration: 0.75, ease: EASE } },
};

/** Supporting paragraph under the hero. */
const heroLede: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE, delay: 0.1 } },
};

/** Scroll-triggered fade/slide for sections below the fold. */
const revealItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

/** Copy for the three-column reading guide on desktop (stacks on mobile). */
const readingGuide: {
  label: string;
  title: string;
  body: string;
}[] = [
  {
    label: "Each bar",
    title: "One investor",
    body: "Five fictional asset managers, side by side - A through E.",
  },
  {
    label: "Each segment",
    title: "For, Against, Abstain",
    body: "Stacks add up to five votes - the full ballot for each fund.",
  },
  {
    label: "On hover",
    title: "The resolutions behind the vote",
    body: "See exact counts, percentages, and which proposals sit in each block.",
  },
];

// Hero headline split across two lines so each can ride up from under a mask.
const HERO_LINES = [
  "How investors voted",
  "across five resolutions.",
];

/** Composes all primary sections of the home page between header and footer. */
export default function HomeContent() {
  const reduced = useReducedMotion();

  // When reduced motion is requested, drop variant objects entirely so children
  // mount in their final state without animation hooks firing.
  const maybe = <T,>(variants: T): T | undefined =>
    reduced ? undefined : variants;

  return (
    <div className="mx-auto w-full max-w-6xl space-y-20 px-6 py-14 sm:space-y-28 sm:py-20 lg:space-y-32 lg:py-24">
      <motion.section
        variants={maybe(heroContainer)}
        initial={reduced ? false : "hidden"}
        animate={reduced ? undefined : "show"}
      >
        <motion.p
          variants={maybe(heroEyebrow)}
          className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-500"
        >
          Shareholder voting
        </motion.p>
        <h1 className="mt-2 font-display text-4xl leading-[1.05] text-ink sm:text-6xl">
          {HERO_LINES.map((line, i) => (
            <span
              key={line}
              className="block overflow-hidden pb-[0.08em]"
              aria-hidden={reduced ? undefined : i === 0 ? undefined : true}
            >
              <motion.span
                variants={maybe(heroLine)}
                className="block will-change-transform"
              >
                {line}
              </motion.span>
            </span>
          ))}
          <span className="sr-only">{HERO_LINES.join(" ")}</span>
        </h1>
        <motion.p
          variants={maybe(heroLede)}
          className="mt-5 max-w-2xl text-base text-neutral sm:text-lg"
        >
          Large institutional investors cast votes on dozens of resolutions
          every proxy season. OxProx makes those records comparable. This is a
          compact look at five funds, five proposals, and the stance behind
          every ballot.
        </motion.p>
      </motion.section>

      <motion.section
        className="relative overflow-hidden rounded-2xl bg-ink text-white shadow-sm dark:bg-[#0b1632] dark:ring-1 dark:ring-white/10"
        variants={maybe(revealItem)}
        initial={reduced ? false : "hidden"}
        whileInView={reduced ? undefined : "show"}
        viewport={{ once: true, margin: "-60px" }}
      >
        <div className="relative p-6 sm:p-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-blue-300">
            Reading the chart
          </p>
          <h2 className="mt-2 max-w-2xl font-display text-2xl leading-tight sm:text-3xl">
            From ballot to bar, in three moves.
          </h2>
          <dl className="mt-8 grid gap-6 sm:grid-cols-3 sm:gap-8">
            {readingGuide.map((g) => (
              <motion.div
                key={g.label}
                whileHover={reduced ? undefined : { y: -4 }}
                transition={HOVER_SPRING}
                className="group relative rounded-lg border-t border-white/15 pt-4 transition-colors duration-200 hover:border-blue-300/60"
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 -top-px h-px origin-left scale-x-0 bg-blue-300 transition-transform duration-300 group-hover:scale-x-100"
                />
                <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-300 transition-colors group-hover:text-blue-100">
                  {g.label}
                </dt>
                <p className="mt-2 font-display text-lg leading-snug sm:text-xl">
                  {g.title}
                </p>
                <dd className="mt-2 text-sm leading-relaxed text-white/75 transition-colors group-hover:text-white">
                  {g.body}
                </dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </motion.section>

      <motion.section
        className="group relative overflow-hidden rounded-2xl border border-canvas-alt bg-surface p-4 shadow-sm transition-[border-color,box-shadow] duration-300 hover:border-blue-500/40 hover:shadow-2xl sm:p-8 dark:hover:shadow-black/40"
        variants={maybe(revealItem)}
        initial={reduced ? false : "hidden"}
        whileInView={reduced ? undefined : "show"}
        whileHover={reduced ? undefined : { scale: 1.005 }}
        transition={HOVER_SPRING}
        viewport={{ once: true, margin: "-60px" }}
      >
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-60 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background:
              "linear-gradient(135deg, rgba(82,124,238,0.35), rgba(138,188,255,0.0) 40%, rgba(37,195,178,0.25))",
            WebkitMask:
              "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
            padding: "1px",
          }}
          initial={reduced ? false : { opacity: 0 }}
          whileInView={reduced ? undefined : { opacity: 0.6 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, delay: 1.2, ease: EASE }}
        />
        <VotesChart />
        <p className="relative mt-3 text-center text-xs text-neutral sm:mt-4">
          Each segment is also encoded by fill pattern so the chart stays
          legible without relying on colour alone.
        </p>
      </motion.section>

      <KeyInsights />

      <ResolutionsSection />
    </div>
  );
}
