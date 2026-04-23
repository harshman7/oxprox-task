"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { TooltipContentProps } from "recharts";
import { useReducedMotion } from "framer-motion";

import {
  getInvestorSummary,
  RESOLUTIONS,
  VOTE_TYPES,
  type InvestorSummaryRow,
  type Vote,
} from "@/app/data/votes";

const VOTE_COLOURS: Record<Vote, string> = {
  For: "#25C3B2",
  Against: "#9D013D",
  Abstain: "#E6AC12",
};

const data = getInvestorSummary();

type ChartDatum = InvestorSummaryRow & { label: string };

const chartData: ChartDatum[] = data.map((row) => ({
  ...row,
  label: row.investor.replace("Investor ", ""),
}));

function VotesTooltip({ active, payload }: TooltipContentProps) {
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
              <span
                aria-hidden
                className="mt-1 inline-block h-2.5 w-2.5 shrink-0 rounded-sm"
                style={{ backgroundColor: VOTE_COLOURS[vote] }}
              />
              <span className="flex-1">
                <span className="font-medium">{vote}</span>
                <span className="text-neutral">
                  {" "}
                  — {count} of {total} ({pct}%)
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

export default function VotesChart() {
  const reduced = useReducedMotion();
  const animate = !reduced;
  return (
    <div
      role="img"
      aria-label="Stacked bar chart of how investors A through E voted across five proposals, grouped by For, Against, and Abstain"
      className="h-[420px] w-full sm:h-[460px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 16, right: 24, bottom: 32, left: 8 }}
          barCategoryGap="28%"
        >
          <CartesianGrid stroke="#E8E4E1" vertical={false} />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={{ stroke: "#E8E4E1" }}
            tick={{ fill: "#0E2043", fontSize: 13 }}
            label={{
              value: "Investor",
              position: "insideBottom",
              offset: -16,
              fill: "#66625E",
              fontSize: 13,
            }}
          />
          <YAxis
            allowDecimals={false}
            domain={[0, 5]}
            ticks={[0, 1, 2, 3, 4, 5]}
            tickLine={false}
            axisLine={{ stroke: "#E8E4E1" }}
            tick={{ fill: "#0E2043", fontSize: 13 }}
            label={{
              value: `Votes (out of ${RESOLUTIONS.length})`,
              angle: -90,
              position: "insideLeft",
              offset: 16,
              fill: "#66625E",
              fontSize: 13,
              style: { textAnchor: "middle" },
            }}
          />
          <Tooltip
            content={(props) => <VotesTooltip {...props} />}
            cursor={{ fill: "#0E2043", fillOpacity: 0.04 }}
          />
          <Legend
            verticalAlign="top"
            align="right"
            height={32}
            iconType="circle"
            wrapperStyle={{ fontSize: 13, color: "#0E2043" }}
          />
          {VOTE_TYPES.map((vote, idx) => (
            <Bar
              key={vote}
              dataKey={vote}
              name={vote}
              stackId="votes"
              fill={VOTE_COLOURS[vote]}
              radius={
                idx === VOTE_TYPES.length - 1 ? [6, 6, 0, 0] : [0, 0, 0, 0]
              }
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
