export type Vote = "For" | "Against" | "Abstain";

export const VOTE_TYPES: Vote[] = ["For", "Against", "Abstain"];

export type Investor =
  | "Investor A"
  | "Investor B"
  | "Investor C"
  | "Investor D"
  | "Investor E";

export type Resolution = {
  id: string;
  title: string;
  shortTitle: string;
};

export const RESOLUTIONS: Resolution[] = [
  { id: "P1", title: "Proposal 1 — Board Diversity", shortTitle: "Board Diversity" },
  { id: "P2", title: "Proposal 2 — CEO Pay Ratio", shortTitle: "CEO Pay Ratio" },
  { id: "P3", title: "Proposal 3 — Climate Disclosure", shortTitle: "Climate Disclosure" },
  { id: "P4", title: "Proposal 4 — Independent Chair", shortTitle: "Independent Chair" },
  { id: "P5", title: "Proposal 5 — Share Buyback", shortTitle: "Share Buyback" },
];

export const INVESTORS: Investor[] = [
  "Investor A",
  "Investor B",
  "Investor C",
  "Investor D",
  "Investor E",
];

/**
 * Raw voting matrix from the task brief.
 * Rows are resolutions (P1..P5); columns are investors (A..E).
 */
export const VOTES: Record<string, Record<Investor, Vote>> = {
  P1: {
    "Investor A": "For",
    "Investor B": "For",
    "Investor C": "Against",
    "Investor D": "Abstain",
    "Investor E": "For",
  },
  P2: {
    "Investor A": "Against",
    "Investor B": "For",
    "Investor C": "Against",
    "Investor D": "Against",
    "Investor E": "For",
  },
  P3: {
    "Investor A": "For",
    "Investor B": "For",
    "Investor C": "For",
    "Investor D": "For",
    "Investor E": "Against",
  },
  P4: {
    "Investor A": "For",
    "Investor B": "Against",
    "Investor C": "For",
    "Investor D": "For",
    "Investor E": "For",
  },
  P5: {
    "Investor A": "Against",
    "Investor B": "Against",
    "Investor C": "For",
    "Investor D": "Against",
    "Investor E": "Against",
  },
};

export type InvestorSummaryRow = {
  investor: Investor;
  For: number;
  Against: number;
  Abstain: number;
  total: number;
  breakdown: Record<Vote, Resolution[]>;
};

/**
 * Aggregates the raw VOTES matrix into one row per investor, suitable for
 * a stacked bar chart. Counts are integers; total is always RESOLUTIONS.length.
 */
export function getInvestorSummary(): InvestorSummaryRow[] {
  return INVESTORS.map((investor) => {
    const breakdown: Record<Vote, Resolution[]> = {
      For: [],
      Against: [],
      Abstain: [],
    };

    for (const resolution of RESOLUTIONS) {
      const vote = VOTES[resolution.id][investor];
      breakdown[vote].push(resolution);
    }

    return {
      investor,
      For: breakdown.For.length,
      Against: breakdown.Against.length,
      Abstain: breakdown.Abstain.length,
      total: RESOLUTIONS.length,
      breakdown,
    };
  });
}
