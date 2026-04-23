"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";

import { HOVER_SPRING } from "@/app/components/motion/hover";
import {
  getPerResolutionTally,
  getPluralityLabel,
  INVESTORS,
  VOTES,
  VOTE_TYPES,
  type PerResolutionTally,
  type Vote,
} from "@/app/data/votes";

const EASE = [0.22, 1, 0.36, 1] as const;

// Brand chart palette — mirrored from VotesChart so the mini 100% bar and the
// investor pills read as the same data in a different view.
const VOTE_COLOURS: Record<Vote, string> = {
  For: "#25C3B2",
  Against: "#9D013D",
  Abstain: "#E6AC12",
};

const container: Variants = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const cardReveal: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

// rest/hover variants used to cascade state from the outer card to the
// investor-row children — Framer only propagates named variants.
const cardState: Variants = {
  rest: { y: 0, scale: 1 },
  hover: {
    y: -8,
    scale: 1.02,
    transition: HOVER_SPRING,
  },
};

const investorRow: Variants = {
  rest: { opacity: 0, y: 6 },
  hover: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: EASE, staggerChildren: 0.04 },
  },
};

const investorPill: Variants = {
  rest: { opacity: 0, y: 4, scale: 0.9 },
  hover: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.2, ease: EASE },
  },
};

const tallies = getPerResolutionTally();

type MiniBarProps = {
  tally: PerResolutionTally;
};

function MiniTallyBar({ tally }: MiniBarProps) {
  return (
    <div
      className="flex h-2 w-full overflow-hidden rounded-full bg-canvas-alt"
      aria-hidden
    >
      {VOTE_TYPES.map((vote) => {
        const n = tally[vote];
        if (n === 0) return null;
        return (
          <span
            key={vote}
            className="block h-full"
            style={{
              width: `${(n / tally.total) * 100}%`,
              backgroundColor: VOTE_COLOURS[vote],
            }}
          />
        );
      })}
    </div>
  );
}

type InvestorPillsProps = {
  resolutionId: string;
  reduced: boolean;
};

function InvestorPills({ resolutionId, reduced }: InvestorPillsProps) {
  return (
    <motion.ul
      variants={reduced ? undefined : investorRow}
      className="mt-4 flex flex-wrap gap-1.5"
      aria-label="Per-investor votes"
    >
      {INVESTORS.map((inv) => {
        const letter = inv.replace("Investor ", "");
        const vote = VOTES[resolutionId][inv];
        return (
          <motion.li
            key={inv}
            variants={reduced ? undefined : investorPill}
            className="inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-[11px] font-semibold tracking-wide"
            style={{
              borderColor: `${VOTE_COLOURS[vote]}55`,
              backgroundColor: `${VOTE_COLOURS[vote]}1a`,
              color: VOTE_COLOURS[vote],
            }}
            title={`${inv}: ${vote}`}
          >
            <span aria-hidden className="font-mono">
              {letter}
            </span>
            <span className="sr-only">{inv}:</span>
            <span className="opacity-80">{vote}</span>
          </motion.li>
        );
      })}
    </motion.ul>
  );
}

type CardProps = {
  tally: PerResolutionTally;
  reduced: boolean;
};

function ResolutionCard({ tally, reduced }: CardProps) {
  const { resolution: r, For, Against, Abstain } = tally;
  const plurality = getPluralityLabel(tally);
  const pluralityAccent = plurality.includes("For")
    ? VOTE_COLOURS.For
    : plurality.includes("Against")
    ? VOTE_COLOURS.Against
    : VOTE_COLOURS.Abstain;

  return (
    <motion.li
      variants={reduced ? undefined : cardReveal}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-canvas-alt bg-surface p-5 shadow-sm transition-[box-shadow,border-color] duration-200 hover:border-blue-500/40 hover:shadow-xl focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 focus-within:ring-offset-surface dark:hover:shadow-black/40"
    >
      <motion.div
        variants={reduced ? undefined : cardState}
        initial="rest"
        animate="rest"
        whileHover="hover"
        whileFocus="hover"
        tabIndex={0}
        className="flex h-full flex-col outline-none"
      >
        <div className="flex items-start justify-between gap-3">
          <span className="inline-flex items-center rounded-md bg-blue-100 px-2 py-0.5 font-display text-sm text-blue-500 dark:bg-blue-500/15">
            {r.id}
          </span>
          <span
            className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em]"
            style={{
              backgroundColor: `${pluralityAccent}1a`,
              color: pluralityAccent,
            }}
          >
            {plurality}
          </span>
        </div>

        <p className="mt-3 font-display text-lg leading-snug text-ink sm:text-xl">
          {r.shortTitle}
        </p>

        {/* Accent only on the lower block (bar + tallies + investors) so it does not
            run full height beside the header — avoids the distracting double-line look. */}
        <div className="relative mt-3 pl-3">
          <span
            aria-hidden
            className="absolute bottom-0 left-0 top-0 w-0.5 origin-top scale-y-0 transition-transform duration-300 group-hover:scale-y-100 group-focus-within:scale-y-100"
            style={{ backgroundColor: pluralityAccent }}
          />
          <MiniTallyBar tally={tally} />

          <p className="mt-2 text-xs text-neutral">
            <span className="font-semibold" style={{ color: VOTE_COLOURS.For }}>
              {For} For
            </span>
            <span className="mx-1.5 opacity-40">·</span>
            <span
              className="font-semibold"
              style={{ color: VOTE_COLOURS.Against }}
            >
              {Against} Against
            </span>
            {Abstain > 0 && (
              <>
                <span className="mx-1.5 opacity-40">·</span>
                <span
                  className="font-semibold"
                  style={{ color: VOTE_COLOURS.Abstain }}
                >
                  {Abstain} Abstain
                </span>
              </>
            )}
          </p>

          <InvestorPills resolutionId={r.id} reduced={reduced} />
        </div>
      </motion.div>
    </motion.li>
  );
}

export default function ResolutionsSection() {
  const reduced = useReducedMotion();

  return (
    <motion.section
      className="mt-8 rounded-2xl border border-canvas-alt bg-surface/60 p-6 sm:mt-10 sm:p-8"
      variants={reduced ? undefined : container}
      initial={reduced ? false : "hidden"}
      whileInView={reduced ? undefined : "show"}
      viewport={{ once: true, margin: "-40px" }}
    >
      <motion.p
        variants={reduced ? undefined : cardReveal}
        className="text-[11px] font-semibold uppercase tracking-[0.22em] text-blue-500"
      >
        On the ballot
      </motion.p>
      <motion.h2
        variants={reduced ? undefined : cardReveal}
        className="mt-2 font-display text-xl text-ink sm:text-2xl"
      >
        The five resolutions.
      </motion.h2>
      <motion.p
        variants={reduced ? undefined : cardReveal}
        className="mt-1 max-w-2xl text-sm text-neutral"
      >
        Hover or focus a card to see how each investor cast their ballot.
      </motion.p>

      <ul className="mt-6 grid gap-4 sm:mt-8 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
        {tallies.map((t) => (
          <ResolutionCard key={t.resolution.id} tally={t} reduced={!!reduced} />
        ))}
      </ul>
    </motion.section>
  );
}
