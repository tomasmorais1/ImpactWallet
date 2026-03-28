import type { Expense } from '../App';
import { useSettings } from '../contexts/SettingsContext';
import { buildCumulativeByDay, lastMonthTotal } from './budgetChartUtils';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { ImpactZoneStrip } from './ImpactZoneStrip';
import { getBudgetTierInfo } from '../lib/impactPoints';

interface HomeBudgetPanelProps {
  expenses: Expense[];
  monthlyGoal: number;
  totalSpent: number;
  remainingBudget: number;
  percentageUsed: number;
}

export function HomeBudgetPanel({
  expenses,
  monthlyGoal,
  totalSpent,
  remainingBudget,
  percentageUsed,
}: HomeBudgetPanelProps) {
  const { formatCurrency } = useSettings();
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const { cumulative, currentDay } = buildCumulativeByDay(expenses, year, month);
  const spentFromSeries = cumulative[currentDay] ?? 0;
  const prevTotal = lastMonthTotal(expenses, year, month);
  const delta = spentFromSeries - prevTotal;
  const spentLess = delta < 0;

  const isOverBudget = percentageUsed > 100;
  const tierInfo = getBudgetTierInfo(percentageUsed);

  const cardClass =
    'overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-md dark:border-slate-800/80 dark:bg-gradient-to-b dark:from-slate-900 dark:to-slate-950 dark:shadow-lg';

  return (
    <div className={cardClass}>
      <div className="p-4 pb-3">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-base font-semibold tracking-tight text-foreground dark:text-white">This month</h2>
          </div>
          {prevTotal > 0 && (
            <span
              className={`mt-1 inline-flex items-center gap-1 self-start rounded-full px-2.5 py-1 text-xs font-semibold sm:mt-0 ${
                spentLess
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'
                  : 'bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400'
              }`}
            >
              {spentLess ? (
                <TrendingDown className="h-3.5 w-3.5" strokeWidth={2.5} />
              ) : (
                <TrendingUp className="h-3.5 w-3.5" strokeWidth={2.5} />
              )}
              {formatCurrency(Math.abs(delta))} vs last month
            </span>
          )}
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-3 dark:border-slate-800 dark:bg-slate-900/50">
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Goal</p>
            <p className="mt-1 text-base font-bold tabular-nums text-foreground dark:text-white">
              {monthlyGoal > 0 ? formatCurrency(monthlyGoal) : '—'}
            </p>
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-3 dark:border-slate-800 dark:bg-slate-900/50">
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Spent</p>
            <p
              className={`mt-1 text-base font-bold tabular-nums ${
                isOverBudget ? 'text-destructive' : 'text-foreground dark:text-white'
              }`}
            >
              {formatCurrency(totalSpent)}
            </p>
          </div>
          <div
            className={`rounded-xl border p-3 ${
              remainingBudget >= 0
                ? 'border-emerald-200/90 bg-emerald-50/90 dark:border-emerald-800 dark:bg-emerald-950/35'
                : 'border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30'
            }`}
          >
            <p
              className={`text-[11px] font-medium uppercase tracking-wide ${
                remainingBudget >= 0 ? 'text-emerald-800 dark:text-emerald-400' : 'text-red-800 dark:text-red-400'
              }`}
            >
              Left
            </p>
            <p
              className={`mt-1 text-base font-bold tabular-nums ${
                remainingBudget >= 0 ? 'text-emerald-700 dark:text-emerald-300' : 'text-destructive'
              }`}
            >
              {monthlyGoal > 0 ? formatCurrency(Math.abs(remainingBudget)) : '—'}
            </p>
          </div>
        </div>

        <ImpactZoneStrip
          percentageUsed={percentageUsed}
          hasGoal={monthlyGoal > 0}
          tier={tierInfo}
        />
      </div>
    </div>
  );
}
