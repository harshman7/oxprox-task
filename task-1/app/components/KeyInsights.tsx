/**
 * Narrative "what the chart says" section: four stacked insight cards with
 * animated count-ups. Background uses fixed hex navy (`#0e2043` / dark variant)
 * because `bg-ink` would flip to a light token in dark mode and wash out white text.
 */

"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { CheckSquare, Scale, TrendingDown, TrendingUp } from "lucide-react";
import type { ReactNode } from "react";

import CountUp from "@/app/components/motion/CountUp";
import {
  CARD_HOVER,
  CARD_TAP,
  HOVER_SPRING,
} from "@/app/components/motion/hover";
import { INVESTORS, VOTES, getKeyInsights, type Resolution } from "@/app/data/votes";

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

/** One row in the insight list: metric, prose, and accent colour for the rail + icon. */
type NarrativeInsight = {
  id: string;
  label: string;
  title: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  accent: string;
  metric: ReactNode;
  body: string;
  detail: string;
};

/**
 * Returns investor letters (A..E) who cast `vote` on the given resolution.
 * Used to personalise the narrative copy under each headline stat.
 */
function investorsFor(resolution: Resolution, vote: "For" | "Against" | "Abstain"): string[] {
  return INVESTORS.filter((inv) => VOTES[resolution.id][inv] === vote).map((inv) =>
    inv.replace("Investor ", "")
  );
}

const supportFor = investorsFor(insights.mostSupported.resolution, "For");
const opposeFor = investorsFor(insights.mostSupported.resolution, "Against");
const opposeAgainst = investorsFor(insights.mostOpposed.resolution, "Against");
const supportAgainst = investorsFor(insights.mostOpposed.resolution, "For");
const contestedFor = investorsFor(insights.mostDivided.resolution, "For");
const contestedAgainst = investorsFor(insights.mostDivided.resolution, "Against");

const narratives: NarrativeInsight[] = [
  {
    id: "support",
    label: "Broadest support",
    title: insights.mostSupported.resolution.shortTitle,
    icon: TrendingUp,
    accent: "#25C3B2",
    metric: (
      <>
        <CountUp value={insights.mostSupported.For} className="text-5xl text-white sm:text-6xl" />
        <span className="text-2xl text-white/55 sm:text-3xl"> / {insights.mostSupported.total}</span>
      </>
    ),
    body: `${insights.mostSupported.For} of ${insights.mostSupported.total} investors backed this proposal, making it the strongest consensus point on the ballot.`,
    detail: `Support came from ${supportFor.join(", ")}. Only ${opposeFor.join(", ")} voted against it.`,
  },
  {
    id: "opposition",
    label: "Broadest opposition",
    title: insights.mostOpposed.resolution.shortTitle,
    icon: TrendingDown,
    accent: "#9D013D",
    metric: (
      <>
        <CountUp value={insights.mostOpposed.Against} className="text-5xl text-white sm:text-6xl" />
        <span className="text-2xl text-white/55 sm:text-3xl"> / {insights.mostOpposed.total}</span>
      </>
    ),
    body: `${insights.mostOpposed.Against} of ${insights.mostOpposed.total} investors rejected this proposal, the clearest negative signal in the set.`,
    detail: `Opposition clustered around ${opposeAgainst.join(", ")}. Support was limited to ${supportAgainst.join(", ")}.`,
  },
  {
    id: "contested",
    label: "Most contested",
    title: insights.mostDivided.resolution.shortTitle,
    icon: Scale,
    accent: "#E6AC12",
    metric: (
      <>
        <CountUp value={insights.mostDivided.For} className="text-5xl text-white sm:text-6xl" />
        <span className="text-2xl text-white/55 sm:text-3xl"> - </span>
        <CountUp value={insights.mostDivided.Against} className="text-5xl text-white sm:text-6xl" />
      </>
    ),
    body: `The room split ${insights.mostDivided.For} For vs ${insights.mostDivided.Against} Against, which marks this as the closest call on the ballot.`,
    detail: `For: ${contestedFor.join(", ")}. Against: ${contestedAgainst.join(", ")}.`,
  },
  {
    id: "volume",
    label: "Ballot volume",
    title: "Votes cast",
    icon: CheckSquare,
    accent: "#527CEE",
    metric: <CountUp value={insights.totalVotes} className="text-5xl text-white sm:text-6xl" />,
    body: `${insights.investorCount} investors across ${insights.resolutionCount} proposals generated ${insights.totalVotes} total voting decisions.`,
    detail: `${insights.abstainCount} vote was an abstention, so almost every ballot still landed on a directional For or Against view.`,
  },
];

/** Full-width insight stack derived from `getKeyInsights()`. */
export default function KeyInsights() {
  const reduced = useReducedMotion();

  return (
    <motion.section
      className="rounded-2xl border border-[#132750] bg-[#0e2043] p-6 text-white shadow-sm dark:bg-[#0b1632] dark:ring-1 dark:ring-white/10 sm:p-8"
      variants={reduced ? undefined : container}
      initial={reduced ? false : "hidden"}
      whileInView={reduced ? undefined : "show"}
      viewport={{ once: true, margin: "-60px" }}
    >
      <motion.p
        variants={reduced ? undefined : card}
        className="text-[11px] font-semibold uppercase tracking-[0.22em] text-blue-300"
      >
        What the chart says
      </motion.p>
      <motion.h2
        variants={reduced ? undefined : card}
        className="mt-2 font-display text-2xl text-white sm:text-3xl"
      >
        Signals across the ballot.
      </motion.h2>

      <div className="mt-6 space-y-4 sm:mt-8 sm:space-y-5">
        {narratives.map((s) => {
          const Icon = s.icon;
          return (
            <motion.article
              key={s.id}
              variants={reduced ? undefined : card}
              whileHover={reduced ? undefined : CARD_HOVER}
              whileTap={reduced ? undefined : CARD_TAP}
              transition={HOVER_SPRING}
              className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-5 shadow-sm backdrop-blur-sm transition-[background-color,border-color,box-shadow,transform] duration-200 hover:border-white/30 hover:bg-white/10 hover:shadow-xl sm:p-6"
            >
              <span
                aria-hidden
                className="absolute inset-y-0 left-0 w-1"
                style={{ backgroundColor: s.accent }}
              />
              <div className="grid gap-5 pl-3 sm:grid-cols-[200px_minmax(0,1fr)] sm:items-start">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60">
                    {s.label}
                  </p>
                  <p className="mt-3 font-display leading-none text-white">{s.metric}</p>
                </div>
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-display text-2xl text-white sm:text-3xl">{s.title}</p>
                    <motion.span
                      aria-hidden
                      whileHover={reduced ? undefined : { rotate: 8, scale: 1.12 }}
                      transition={HOVER_SPRING}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-300 group-hover:h-9 group-hover:w-9"
                      style={{ backgroundColor: `${s.accent}22`, color: s.accent }}
                    >
                      <Icon size={16} />
                    </motion.span>
                  </div>
                  <p className="mt-2 text-[15px] leading-relaxed text-white/80">{s.body}</p>
                  <p className="mt-3 text-sm leading-relaxed text-white/65">{s.detail}</p>
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>
    </motion.section>
  );
}
