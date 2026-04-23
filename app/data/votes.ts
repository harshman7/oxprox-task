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

export type PerResolutionTally = {
  resolution: Resolution;
  For: number;
  Against: number;
  Abstain: number;
  total: number;
};

/**
 * Short human label for the strongest signal on a resolution.
 * - "Carried: For" / "Carried: Against" when one side has a strict majority (>= half + 1).
 * - "Leans For/Against" when it's the largest bucket but not a majority.
 * - "Split" on an exact For/Against tie.
 */
export function getPluralityLabel(t: PerResolutionTally): string {
  const majority = Math.floor(t.total / 2) + 1;
  if (t.For >= majority) return "Carried: For";
  if (t.Against >= majority) return "Carried: Against";
  if (t.For > t.Against) return "Leans For";
  if (t.Against > t.For) return "Leans Against";
  return "Split";
}

/**
 * Inverts the matrix: one row per resolution with counts across investors.
 */
export function getPerResolutionTally(): PerResolutionTally[] {
  return RESOLUTIONS.map((resolution) => {
    const tally = { For: 0, Against: 0, Abstain: 0 } as Record<Vote, number>;
    for (const investor of INVESTORS) {
      const v = VOTES[resolution.id][investor];
      tally[v] += 1;
    }
    return {
      resolution,
      For: tally.For,
      Against: tally.Against,
      Abstain: tally.Abstain,
      total: INVESTORS.length,
    };
  });
}

export type KeyInsights = {
  totalVotes: number;
  investorCount: number;
  resolutionCount: number;
  abstainCount: number;
  mostSupported: PerResolutionTally;
  mostOpposed: PerResolutionTally;
  mostDivided: PerResolutionTally;
};

/**
 * Derives headline signals from the vote matrix. Deterministic — ties are
 * broken by resolution order in RESOLUTIONS.
 */
export function getKeyInsights(): KeyInsights {
  const tallies = getPerResolutionTally();
  const investorCount = INVESTORS.length;
  const resolutionCount = RESOLUTIONS.length;

  let mostSupported = tallies[0];
  let mostOpposed = tallies[0];
  let mostDivided = tallies[0];
  let abstainCount = 0;

  // Divided score: how balanced For vs Against are (ignoring abstain).
  // Lower |For - Against| = more divided; ties broken by higher total engaged.
  const dividedScore = (t: PerResolutionTally) =>
    Math.abs(t.For - t.Against) - (t.For + t.Against) / 1000;

  for (const t of tallies) {
    if (t.For > mostSupported.For) mostSupported = t;
    if (t.Against > mostOpposed.Against) mostOpposed = t;
    if (dividedScore(t) < dividedScore(mostDivided)) mostDivided = t;
    abstainCount += t.Abstain;
  }

  return {
    totalVotes: investorCount * resolutionCount,
    investorCount,
    resolutionCount,
    abstainCount,
    mostSupported,
    mostOpposed,
    mostDivided,
  };
}
