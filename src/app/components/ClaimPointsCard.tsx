import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { ChevronDown, CheckCircle2 } from 'lucide-react';
import type { BudgetTierInfo } from '../lib/impactPoints';
import impactPointsLogo from '../assets/impact-points-logo.png';

interface ClaimPointsCardProps {
  tier: BudgetTierInfo;
  percentageUsed: number;
  hasGoal: boolean;
  potentialPoints: number;
  canClaim: boolean;
  claimedThisMonth: boolean;
  onClaim: () => void;
}

export function ClaimPointsCard({
  tier,
  percentageUsed,
  hasGoal,
  potentialPoints,
  canClaim,
  claimedThisMonth,
  onClaim,
}: ClaimPointsCardProps) {
  const pctLabel = `${Math.min(percentageUsed, 999).toFixed(0)}% of budget used`;

  return (
    <Card className="overflow-hidden border-emerald-200/70 shadow-sm dark:border-emerald-900">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-sm">
            <img src={impactPointsLogo} alt="Impact Points logo" className="h-7 w-7 object-contain" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-base font-semibold text-foreground">Monthly impact points</p>
            {!hasGoal ? (
              <p className="mt-1 text-sm text-muted-foreground">
                Set a monthly budget below to unlock reward zones and points.
              </p>
            ) : claimedThisMonth ? (
              <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-emerald-700 dark:text-emerald-400">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                You already claimed points for this month.
              </p>
            ) : tier.id === 'over' ? (
              <p className="mt-1 text-sm text-muted-foreground">
                You are over budget — no points while above 100% of your goal.
              </p>
            ) : (
              <>
                <p className="mt-0.5 text-2xl font-bold tabular-nums text-emerald-700 dark:text-emerald-400">
                  +{potentialPoints}{' '}
                  <span className="text-base font-semibold text-muted-foreground">pts available</span>
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{tier.label}</span>
                  <span className="text-muted-foreground"> · {pctLabel}</span>
                </p>
              </>
            )}
          </div>
        </div>

        <Button
          type="button"
          disabled={!canClaim}
          onClick={onClaim}
          className="mt-4 h-12 w-full rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-base font-semibold text-white shadow-md hover:from-emerald-700 hover:to-teal-700 disabled:pointer-events-none disabled:opacity-40"
        >
          {claimedThisMonth
            ? 'Claimed for this month'
            : !hasGoal
              ? 'Set a budget first'
              : canClaim
                ? `Claim ${potentialPoints} points`
                : tier.id === 'over'
                  ? 'No points (over budget)'
                  : 'Not in a reward band yet'}
        </Button>

        <Collapsible className="mt-3">
          <CollapsibleTrigger className="flex w-full items-center justify-center gap-1 rounded-lg py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/40">
            How points work
            <ChevronDown className="h-4 w-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="data-[state=open]:animate-in">
            <ul className="mt-2 space-y-2 rounded-xl border border-emerald-100 bg-emerald-50/50 p-3 text-xs leading-relaxed text-emerald-950 dark:border-emerald-900 dark:bg-emerald-950/25 dark:text-emerald-100">
              <li>
                <span className="font-semibold">Balanced band (60–70% used)</span> → 30 points
              </li>
              <li>
                <span className="font-semibold">Steady (70–80%)</span> → 25 points
              </li>
              <li>
                <span className="font-semibold">Tight (80–90%)</span> → 15 points
              </li>
              <li>
                <span className="font-semibold">Almost at limit (90–100%)</span> → 10 points
              </li>
              <li className="pt-1 text-muted-foreground dark:text-emerald-200/80">
                Under 60% or over 100% of budget → 0 points. Claim once per month while you are in a reward band.
              </li>
            </ul>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}
