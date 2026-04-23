"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { CheckSquare, Scale, TrendingDown, TrendingUp } from "lucide-react";

import CountUp from "@/app/components/motion/CountUp";
import {
  CARD_HOVER,
  CARD_TAP,
  HOVER_SPRING,
} from "@/app/components/motion/hover";
import { getKeyInsights } from "@/app/data/votes";

const EASE = [0.22, 1, 0.36, 1] as const;

const container: Variants = {
  hidden: { opacity: 1 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const card: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

const insights = getKeyInsights();

type Stat =
  | {
      kind: "fraction";
      label: string;
      numerator: number;
      denominator: number;
      title: string;
      description: string;
      icon: React.ComponentType<{ size?: number; className?: string }>;
      accent: string;
    }
  | {
      kind: "count";
      label: string;
      value: number;
      title: string;
      description: string;
      icon: React.ComponentType<{ size?: number; className?: string }>;
      accent: string;
    };

const stats: Stat[] = [
  {
    kind: "fraction",
    label: "Broadest support",
    numerator: insights.mostSupported.For,
    denominator: insights.mostSupported.total,
    title: insights.mostSupported.resolution.shortTitle,
    description: "investors voted For — the widest agreement on the ballot.",
    icon: TrendingUp,
    accent: "#25C3B2",
  },
  {
    kind: "fraction",
    label: "Broadest opposition",
    numerator: insights.mostOpposed.Against,
    denominator: insights.mostOpposed.total,
    title: insights.mostOpposed.resolution.shortTitle,
    description: "investors voted Against — the clearest rejection.",
    icon: TrendingDown,
    accent: "#9D013D",
  },
  {
    kind: "count",
    label: "Most contested",
    value: insights.mostDivided.For,
    title: insights.mostDivided.resolution.shortTitle,
    description: `${insights.mostDivided.For} For · ${insights.mostDivided.Against} Against — the room is split.`,
    icon: Scale,
    accent: "#E6AC12",
  },
  {
    kind: "count",
    label: "Total ballots",
    value: insights.totalVotes,
    title: "Votes cast",
    description: `${insights.investorCount} investors × ${insights.resolutionCount} resolutions, including ${insights.abstainCount} abstain.`,
    icon: CheckSquare,
    accent: "#527CEE",
  },
];

export default function KeyInsights() {
  const reduced = useReducedMotion();

  return (
    <motion.section
      className="mt-8 rounded-2xl border border-canvas-alt bg-surface p-6 shadow-sm sm:mt-10 sm:p-8"
      variants={reduced ? undefined : container}
      initial={reduced ? false : "hidden"}
      whileInView={reduced ? undefined : "show"}
      viewport={{ once: true, margin: "-60px" }}
    >
      <motion.p
        variants={reduced ? undefined : card}
        className="text-[11px] font-semibold uppercase tracking-[0.22em] text-blue-500"
      >
        What the chart says
      </motion.p>
      <motion.h2
        variants={reduced ? undefined : card}
        className="mt-2 font-display text-2xl text-ink sm:text-3xl"
      >
        Signals across the ballot.
      </motion.h2>

      <div className="mt-6 grid gap-4 sm:mt-8 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.label}
              variants={reduced ? undefined : card}
              whileHover={reduced ? undefined : CARD_HOVER}
              whileTap={reduced ? undefined : CARD_TAP}
              transition={HOVER_SPRING}
              className="group relative overflow-hidden rounded-xl border border-canvas-alt bg-canvas/40 p-5 shadow-sm transition-[background-color,border-color,box-shadow] duration-200 hover:border-blue-500/30 hover:bg-canvas/80 hover:shadow-xl dark:hover:shadow-black/40"
            >
              <span
                aria-hidden
                className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-75 transition-transform duration-300 group-hover:scale-x-100"
                style={{ backgroundColor: s.accent }}
              />
              <div className="flex items-start justify-between gap-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral">
                  {s.label}
                </p>
                <motion.span
                  aria-hidden
                  whileHover={reduced ? undefined : { rotate: 8, scale: 1.12 }}
                  transition={HOVER_SPRING}
                  className="inline-flex h-7 w-7 items-center justify-center rounded-full transition-colors duration-300 group-hover:h-8 group-hover:w-8"
                  style={{ backgroundColor: `${s.accent}22`, color: s.accent }}
                >
                  <Icon size={14} />
                </motion.span>
              </div>
              <p className="mt-4 font-display leading-none text-ink">
                {s.kind === "fraction" ? (
                  <>
                    <CountUp
                      value={s.numerator}
                      className="text-5xl sm:text-6xl"
                    />
                    <span className="text-2xl text-neutral sm:text-3xl">
                      {" "}
                      / {s.denominator}
                    </span>
                  </>
                ) : (
                  <CountUp value={s.value} className="text-5xl sm:text-6xl" />
                )}
              </p>
              <p className="mt-3 font-display text-lg text-ink sm:text-xl">
                {s.title}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-neutral">
                {s.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}
