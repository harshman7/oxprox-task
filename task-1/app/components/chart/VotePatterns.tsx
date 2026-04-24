/**
 * SVG pattern primitives for vote-category fills. Colours alone fail colour-blind
 * checks; pairing each vote type with a distinct hatch/dot pattern keeps bars,
 * legends, and tooltips decodable in monochrome. Used by VotesChart,
 * ResolutionsSection mini bars, and inline swatches.
 */

"use client";

import { useId } from "react";

import type { Vote } from "@/app/data/votes";

/**
 * Brand colours for the three vote categories. Duplicated here (instead of
 * importing from VotesChart) so this primitive stays free of client-side deps
 * and can be reused by both the Recharts SVG and plain inline swatches.
 */
export const VOTE_COLOURS: Record<Vote, string> = {
  For: "#25C3B2",
  Against: "#9D013D",
  Abstain: "#E6AC12",
};

/**
 * Namespace for SVG pattern `id`s so multiple `<defs>` on one page (chart +
 * tally + swatches) never collide. Each scope gets its own `ox-pattern-{scope}-*`.
 */
export type PatternScope = "chart" | "swatch" | "tally";

/** Stable id string for `fill="url(#...)"` references inside a given scope. */
export function patternId(vote: Vote, scope: PatternScope): string {
  return `ox-pattern-${scope}-${vote.toLowerCase()}`;
}

type DefsProps = {
  scope: PatternScope;
  overlayColor: string;
};

/**
 * SVG `<defs>` containing three pattern fills, one per vote type:
 *   For     — horizontal hatch (light, positive-feeling)
 *   Against — dense diagonal hatch
 *   Abstain — dotted grid
 *
 * Each pattern renders its own coloured background + a neutral overlay so the
 * pattern reads regardless of whether it's painted on a Recharts bar or a
 * small inline swatch. `overlayColor` should contrast with the vote colour —
 * pass a light rgba for dark themes, darker rgba for light themes.
 */
export function VotePatternDefs({ scope, overlayColor }: DefsProps) {
  return (
    <defs>
      <pattern
        id={patternId("For", scope)}
        patternUnits="userSpaceOnUse"
        width={8}
        height={8}
      >
        <rect width={8} height={8} fill={VOTE_COLOURS.For} />
        <path
          d="M0 4 H8"
          stroke={overlayColor}
          strokeWidth={1}
          strokeLinecap="square"
        />
      </pattern>

      <pattern
        id={patternId("Against", scope)}
        patternUnits="userSpaceOnUse"
        width={6}
        height={6}
        patternTransform="rotate(45)"
      >
        <rect width={6} height={6} fill={VOTE_COLOURS.Against} />
        <path
          d="M0 0 H6"
          stroke={overlayColor}
          strokeWidth={1.6}
          strokeLinecap="square"
        />
      </pattern>

      <pattern
        id={patternId("Abstain", scope)}
        patternUnits="userSpaceOnUse"
        width={6}
        height={6}
      >
        <rect width={6} height={6} fill={VOTE_COLOURS.Abstain} />
        <circle cx={1.5} cy={1.5} r={1} fill={overlayColor} />
      </pattern>
    </defs>
  );
}

type SwatchProps = {
  vote: Vote;
  size?: number;
  overlayColor: string;
  className?: string;
  rounded?: boolean;
};

/**
 * Tiny inline SVG showing the same pattern used in the chart. Used in tooltip
 * rows, legend items, and anywhere else a colour chip would be ambiguous for
 * colour-vision-deficient users. Each instance carries its own `<defs>` since
 * the parent DOM may or may not include the chart-scope `<defs>`.
 */
export function PatternSwatch({
  vote,
  size = 12,
  overlayColor,
  className,
  rounded = true,
}: SwatchProps) {
  // useId gives a hydration-stable unique id so multiple swatches can share
  // the same DOM without pattern-id collisions.
  const uniqueId = `${useId()}-${vote.toLowerCase()}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      aria-hidden
      className={className}
      style={{ flexShrink: 0 }}
    >
      <defs>
        <pattern
          id={uniqueId}
          patternUnits="userSpaceOnUse"
          width={vote === "For" ? 8 : 6}
          height={vote === "For" ? 8 : 6}
          patternTransform={vote === "Against" ? "rotate(45)" : undefined}
        >
          <rect
            width={vote === "For" ? 8 : 6}
            height={vote === "For" ? 8 : 6}
            fill={VOTE_COLOURS[vote]}
          />
          {vote === "For" && (
            <path
              d="M0 4 H8"
              stroke={overlayColor}
              strokeWidth={1}
              strokeLinecap="square"
            />
          )}
          {vote === "Against" && (
            <path
              d="M0 0 H6"
              stroke={overlayColor}
              strokeWidth={1.6}
              strokeLinecap="square"
            />
          )}
          {vote === "Abstain" && (
            <circle cx={1.5} cy={1.5} r={1} fill={overlayColor} />
          )}
        </pattern>
      </defs>
      <rect
        width={size}
        height={size}
        rx={rounded ? 2 : 0}
        fill={`url(#${uniqueId})`}
      />
    </svg>
  );
}

/**
 * Short one-word hint surfaced in the desktop legend so the pattern meaning is
 * legible without needing to sample colours. Hidden on small screens in the UI
 * but mirrored in `sr-only` for screen readers.
 */
export const PATTERN_HINT: Record<Vote, string> = {
  For: "Solid",
  Against: "Diagonal",
  Abstain: "Dots",
};
