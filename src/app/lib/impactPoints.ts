/** % of monthly budget already spent (spent / goal × 100). */
export type BudgetTierId = 'none' | 'ideal' | 'steady' | 'tight' | 'edge' | 'over';

export interface BudgetTierInfo {
  id: BudgetTierId;
  points: number;
  /** Short label for chips / hero */
  label: string;
  /** One line for tooltips / secondary text */
  subtitle: string;
}

/**
 * Reward tiers by share of budget used (not “saved”).
 * 60–70% → 30 · 70–80% → 25 · 80–90% → 15 · 90–100% → 10 · otherwise 0.
 */
export function getBudgetTierInfo(percentUsed: number): BudgetTierInfo {
  const pct = percentUsed;
  if (pct > 100) {
    return {
      id: 'over',
      points: 0,
      label: 'Over budget',
      subtitle: 'No points while above your monthly limit.',
    };
  }
  if (pct >= 90) {
    return {
      id: 'edge',
      points: 10,
      label: 'Almost at limit',
      subtitle: 'You are using 90–100% of your budget.',
    };
  }
  if (pct >= 80) {
    return {
      id: 'tight',
      points: 15,
      label: 'Tight',
      subtitle: 'You are using 80–90% of your budget.',
    };
  }
  if (pct >= 70) {
    return {
      id: 'steady',
      points: 25,
      label: 'Steady',
      subtitle: 'You are using 70–80% of your budget.',
    };
  }
  if (pct >= 60) {
    return {
      id: 'ideal',
      points: 30,
      label: 'Balanced',
      subtitle: 'You are using 60–70% of your budget.',
    };
  }
  return {
    id: 'none',
    points: 0,
    label: 'Below 60%',
    subtitle: 'Reach 60% of budget used to unlock monthly points.',
  };
}

export const IMPACT_POINTS_CLAIM_KEY = 'impactWallet_claimedMonth';
