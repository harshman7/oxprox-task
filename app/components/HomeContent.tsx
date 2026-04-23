"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import dynamic from "next/dynamic";

import KeyInsights from "@/app/components/KeyInsights";
import { RESOLUTIONS } from "@/app/data/votes";

// Recharts' ResponsiveContainer needs a measured DOM parent; rendering it
// during SSR logs a benign width/height warning. Defer to the client so the
// container has real dimensions on first paint, with a same-size placeholder
// to keep layout stable.
const VotesChart = dynamic(() => import("@/app/components/VotesChart"), {
  ssr: false,
  loading: () => <div className="h-[360px] w-full sm:h-[440px]" aria-hidden />,
});

const EASE = [0.22, 1, 0.36, 1] as const;

const heroContainer: Variants = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
};

const heroEyebrow: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
};

const heroLine: Variants = {
  hidden: { y: "110%" },
  show: { y: "0%", transition: { duration: 0.75, ease: EASE } },
};

const heroLede: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE, delay: 0.1 } },
};

const revealItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

const listContainer: Variants = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const listItem: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
};

const readingGuide: {
  label: string;
  title: string;
  body: string;
}[] = [
  {
    label: "Each bar",
    title: "One investor",
    body: "Five fictional asset managers, side by side — A through E.",
  },
  {
    label: "Each segment",
    title: "For, Against, Abstain",
    body: "Stacks add up to five votes — the full ballot for each fund.",
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

export default function HomeContent() {
  const reduced = useReducedMotion();

  const maybe = <T,>(variants: T): T | undefined =>
    reduced ? undefined : variants;

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10 sm:py-14">
      <motion.section
        className="mb-10 sm:mb-12"
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
              <div key={g.label} className="border-t border-white/15 pt-4">
                <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-300">
                  {g.label}
                </dt>
                <p className="mt-2 font-display text-lg leading-snug sm:text-xl">
                  {g.title}
                </p>
                <dd className="mt-2 text-sm leading-relaxed text-white/75">
                  {g.body}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </motion.section>

      <motion.section
        className="relative mt-8 overflow-hidden rounded-2xl border border-canvas-alt bg-surface p-4 shadow-sm sm:mt-10 sm:p-8"
        variants={maybe(revealItem)}
        initial={reduced ? false : "hidden"}
        whileInView={reduced ? undefined : "show"}
        viewport={{ once: true, margin: "-60px" }}
      >
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-2xl"
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
          whileInView={reduced ? undefined : { opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, delay: 1.2, ease: EASE }}
        />
        <VotesChart />
      </motion.section>

      <KeyInsights />

      <motion.section
        className="mt-8 rounded-2xl border border-canvas-alt bg-surface/60 p-6 sm:mt-10 sm:p-8"
        variants={maybe(listContainer)}
        initial={reduced ? false : "hidden"}
        whileInView={reduced ? undefined : "show"}
        viewport={{ once: true, margin: "-40px" }}
      >
        <motion.h2
          variants={maybe(listItem)}
          className="font-display text-xl text-ink sm:text-2xl"
        >
          The five resolutions
        </motion.h2>
        <ol className="mt-4 grid gap-3 text-sm text-ink/90 sm:grid-cols-2 sm:text-base">
          {RESOLUTIONS.map((r) => (
            <motion.li
              key={r.id}
              variants={maybe(listItem)}
              className="flex items-start gap-3 rounded-lg bg-canvas-alt/40 px-3 py-2"
            >
              <span className="font-display text-base text-blue-500">
                {r.id}
              </span>
              <span>{r.title.replace(/^Proposal \d+ — /, "")}</span>
            </motion.li>
          ))}
        </ol>
      </motion.section>
    </div>
  );
}
