"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
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

// In a stacked column, the "visible top" is the last category (in stack order
// bottom → top) that actually has a non-zero value for that row. We round the
// top corners of that segment only - so bars whose topmost category is
// For or Against still get rounded caps.
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

function CustomLegend({ overlayColor, textColor }: LegendContentProps) {
  return (
    <ul
      className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 pb-2"
      style={{ color: textColor, fontSize: 13 }}
    >
      {VOTE_TYPES.map((vote) => (
        <li key={vote} className="flex items-center gap-2">
          <PatternSwatch vote={vote} size={14} overlayColor={overlayColor} />
          <span className="font-medium">{vote}</span>
          <span className="text-xs uppercase tracking-[0.12em] opacity-60">
            {PATTERN_HINT[vote]}
          </span>
        </li>
      ))}
    </ul>
  );
}

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
      className="h-[360px] w-full sm:h-[440px]"
    >
      <ResponsiveContainer
        width="100%"
        height="100%"
        initialDimension={{ width: 800, height: 400 }}
      >
        <BarChart
          data={chartData}
          margin={{ top: 24, right: 16, bottom: 32, left: 0 }}
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
          <Legend
            verticalAlign="top"
            align="center"
            height={40}
            content={() => (
              <CustomLegend
                overlayColor={overlayColor}
                textColor={tokens.ink}
              />
            )}
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
  );
}

export { VOTE_COLOURS };
