/**
 * Primary data visualisation: 100% stacked bar chart of votes per investor
 * (For / Against / Abstain) using Recharts. Legend is rendered as plain HTML
 * above the chart so wrapped rows never overlap the plot (Recharts' built-in
 * Legend used a fixed height). Segments use SVG pattern fills from
 * VotePatterns for colour-blind accessibility; only the topmost non-zero
 * segment gets rounded corners via a custom `shape`.
 */

"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Rectangle,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { TooltipContentProps } from "recharts";
import { useReducedMotion } from "framer-motion";

import {
  PATTERN_HINT,
  PatternSwatch,
  VOTE_COLOURS,
  VotePatternDefs,
  patternId,
} from "@/app/components/chart/VotePatterns";
import {
  getInvestorSummary,
  RESOLUTIONS,
  VOTE_TYPES,
  type InvestorSummaryRow,
  type Vote,
} from "@/app/data/votes";
import { useThemeTokens } from "@/app/hooks/useThemeTokens";

const data = getInvestorSummary();

type ChartDatum = InvestorSummaryRow & { label: string };

const chartData: ChartDatum[] = data.map((row) => ({
  ...row,
  label: row.investor.replace("Investor ", ""),
}));

/**
 * In a stacked column, the visible top is the last category in stack order
 * (bottom to top) with a non-zero value. Used to apply corner radius only to
 * that segment so every bar gets a clean cap, not just the "For" layer.
 */
function topVoteFor(row: ChartDatum): Vote | null {
  for (let i = VOTE_TYPES.length - 1; i >= 0; i -= 1) {
    if (row[VOTE_TYPES[i]] > 0) return VOTE_TYPES[i];
  }
  return null;
}

type BarShapeProps = {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  fill?: string;
  payload?: ChartDatum;
};

/**
 * Factory returning a Recharts `<Rectangle>` shape that rounds only the top
 * edge when this segment is the stack's visible top. Also draws a 1px stroke
 * in `strokeColor` so adjacent segments separate cleanly in both themes.
 */
function makeRoundedTopShape(vote: Vote, strokeColor: string) {
  const Shape = (props: BarShapeProps) => {
    const { payload } = props;
    const isTop = payload ? topVoteFor(payload) === vote : false;
    const radius = isTop ? [6, 6, 0, 0] : [0, 0, 0, 0];
    return (
      <Rectangle
        {...props}
        radius={radius as [number, number, number, number]}
        stroke={strokeColor}
        strokeWidth={1}
      />
    );
  };
  Shape.displayName = `RoundedTop(${vote})`;
  return Shape;
}

type VotesTooltipProps = TooltipContentProps & {
  overlayColor: string;
};

/** Rich tooltip: investor name, vote buckets with pattern swatches, resolution list. */
function VotesTooltip({ active, payload, overlayColor }: VotesTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  const row = payload[0].payload as ChartDatum;
  const total = row.total;

  return (
    <div
      role="tooltip"
      className="rounded-md border border-canvas-alt bg-surface px-4 py-3 text-sm text-ink shadow-lg"
    >
      <p className="font-display text-base leading-tight">{row.investor}</p>
      <p className="mt-0.5 text-xs text-neutral">
        {total} resolutions voted
      </p>
      <ul className="mt-2 space-y-1.5">
        {VOTE_TYPES.map((vote) => {
          const count = row[vote];
          if (count === 0) return null;
          const pct = Math.round((count / total) * 100);
          const resolutions = row.breakdown[vote]
            .map((r) => r.shortTitle)
            .join(", ");
          return (
            <li key={vote} className="flex items-start gap-2">
              <span className="mt-[3px]">
                <PatternSwatch
                  vote={vote}
                  size={12}
                  overlayColor={overlayColor}
                />
              </span>
              <span className="flex-1">
                <span className="font-medium">{vote}</span>
                <span className="text-neutral">
                  {" "}
                  - {count} of {total} ({pct}%)
                </span>
                <span className="block text-xs text-neutral/80">
                  {resolutions}
                </span>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

type LegendContentProps = {
  overlayColor: string;
  textColor: string;
};

/**
 * HTML legend above the chart. Pattern hints show from `sm:` up; on narrow
 * screens only swatch + label appear to save horizontal space (`sr-only` keeps
 * hints for assistive tech).
 */
function CustomLegend({ overlayColor, textColor }: LegendContentProps) {
  return (
    <ul
      className="flex w-full flex-wrap items-center justify-center gap-x-4 gap-y-2 px-1 sm:gap-x-5"
      style={{ color: textColor, fontSize: 13 }}
    >
      {VOTE_TYPES.map((vote) => (
        <li key={vote} className="flex items-center gap-2">
          <PatternSwatch vote={vote} size={14} overlayColor={overlayColor} />
          <span className="font-medium">{vote}</span>
          <span className="hidden text-xs uppercase tracking-[0.12em] opacity-60 sm:inline">
            {PATTERN_HINT[vote]}
          </span>
          <span className="sr-only">{PATTERN_HINT[vote]}</span>
        </li>
      ))}
    </ul>
  );
}

/** Stacked bar chart wired to live theme tokens and reduced-motion preferences. */
export default function VotesChart() {
  const reduced = useReducedMotion();
  const tokens = useThemeTokens();
  const animate = !reduced;

  // Hatch/dot overlay colour flips with theme so patterns stay legible on both
  // dark and light canvases. Lighter alpha keeps the brand hue dominant.
  const overlayColor = tokens.isDark
    ? "rgba(255, 255, 255, 0.4)"
    : "rgba(14, 32, 67, 0.35)";
  // Stroke between stacked segments - pick the canvas so borders read as a
  // subtle separator rather than an additional colour.
  const segmentStroke = tokens.surface;

  return (
    <div
      role="img"
      aria-label="Stacked bar chart of how investors A through E voted across five proposals, grouped by For, Against, and Abstain. Segments are also distinguished by fill pattern - For uses horizontal lines, Against uses dense diagonals, Abstain uses dots - so the chart remains readable without relying on colour alone."
      className="w-full"
    >
      <CustomLegend overlayColor={overlayColor} textColor={tokens.ink} />
      {/* Explicit pixel height: ResponsiveContainer uses % height; parent must
          have definite height or the chart collapses to 0 on mobile. */}
      <div className="mt-3 h-[340px] w-full sm:h-[400px]">
        <ResponsiveContainer
          width="100%"
          height="100%"
          // Avoids SSR / first-paint width(-1) warnings when the container is not yet measured.
          initialDimension={{ width: 800, height: 360 }}
        >
          <BarChart
            data={chartData}
            margin={{ top: 8, right: 12, bottom: 32, left: 4 }}
            barCategoryGap="28%"
          >
            <VotePatternDefs scope="chart" overlayColor={overlayColor} />
            <CartesianGrid stroke={tokens.canvasAlt} vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={{ stroke: tokens.canvasAlt }}
              tick={{ fill: tokens.ink, fontSize: 13 }}
              label={{
                value: "Investor",
                position: "insideBottom",
                offset: -16,
                fill: tokens.neutral,
                fontSize: 13,
              }}
            />
            <YAxis
              allowDecimals={false}
              domain={[0, 5]}
              ticks={[0, 1, 2, 3, 4, 5]}
              tickLine={false}
              axisLine={{ stroke: tokens.canvasAlt }}
              tick={{ fill: tokens.ink, fontSize: 13 }}
              width={56}
              label={{
                value: `Votes (out of ${RESOLUTIONS.length})`,
                angle: -90,
                position: "insideLeft",
                offset: 16,
                fill: tokens.neutral,
                fontSize: 13,
                style: { textAnchor: "middle" },
              }}
            />
            <Tooltip
              content={(props) => (
                <VotesTooltip {...props} overlayColor={overlayColor} />
              )}
              cursor={{
                fill: tokens.ink,
                fillOpacity: tokens.isDark ? 0.12 : 0.04,
              }}
              allowEscapeViewBox={{ x: false, y: false }}
              wrapperStyle={{ outline: "none" }}
            />
            {VOTE_TYPES.map((vote, idx) => (
              <Bar
                key={vote}
                dataKey={vote}
                name={vote}
                stackId="votes"
                fill={`url(#${patternId(vote, "chart")})`}
                maxBarSize={72}
                shape={makeRoundedTopShape(vote, segmentStroke)}
                isAnimationActive={animate}
                animationBegin={200 + idx * 120}
                animationDuration={700}
                animationEasing="ease-out"
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/** Re-export for callers that only need hex colours without importing VotePatterns. */
export { VOTE_COLOURS };
