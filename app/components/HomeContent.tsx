"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";

import VotesChart from "@/app/components/VotesChart";
import { RESOLUTIONS } from "@/app/data/votes";

const EASE = [0.22, 1, 0.36, 1] as const;

const heroContainer: Variants = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.09, delayChildren: 0.05 },
  },
};

const heroItem: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
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

export default function HomeContent() {
  const reduced = useReducedMotion();

  const maybe = <T,>(variants: T): T | undefined =>
    reduced ? undefined : variants;

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10 sm:py-14">
      <motion.section
        className="mb-8 sm:mb-10"
        variants={maybe(heroContainer)}
        initial={reduced ? false : "hidden"}
        animate={reduced ? undefined : "show"}
      >
        <motion.p
          variants={maybe(heroItem)}
          className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-500"
        >
          Shareholder voting
        </motion.p>
        <motion.h1
          variants={maybe(heroItem)}
          className="mt-2 font-display text-4xl leading-tight text-ink sm:text-5xl"
        >
          How investors voted across five resolutions
        </motion.h1>
        <motion.p
          variants={maybe(heroItem)}
          className="mt-4 max-w-2xl text-base text-neutral sm:text-lg"
        >
          A snapshot of five fictional institutional investors and their votes
          on five proposals at a company shareholder meeting. Hover any bar to
          see the exact vote counts, percentages, and the resolutions behind
          them.
        </motion.p>
      </motion.section>

      <motion.section
        className="rounded-2xl border border-canvas-alt bg-surface p-4 shadow-sm sm:p-8"
        variants={maybe(revealItem)}
        initial={reduced ? false : "hidden"}
        whileInView={reduced ? undefined : "show"}
        viewport={{ once: true, margin: "-60px" }}
      >
        <VotesChart />
      </motion.section>

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
