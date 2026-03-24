import type { BudgetTierInfo } from '../lib/impactPoints';

interface ImpactZoneStripProps {
  percentageUsed: number;
  hasGoal: boolean;
  tier: BudgetTierInfo;
}

/**
 * Spending share of monthly budget (€), not points — lives in the budget card.
 * Colours: neutral base + emerald → teal → cyan (app palette).
 */
export function ImpactZoneStrip({ percentageUsed, hasGoal, tier }: ImpactZoneStripProps) {
  const pct = Math.min(Math.max(percentageUsed, 0), 100);

  if (!hasGoal) {
    return (
      <div className="mt-4 rounded-xl border border-dashed border-emerald-200/80 bg-emerald-50/40 px-3 py-3 text-center dark:border-emerald-800 dark:bg-emerald-950/20">
        <p className="text-xs leading-snug text-muted-foreground">
          Set a monthly budget in <span className="font-semibold text-emerald-700 dark:text-emerald-400">Finance</span>{' '}
          to see how much of your budget you have used and which reward zone you are in.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-4 rounded-xl border border-emerald-100/90 bg-gradient-to-br from-emerald-50/50 to-teal-50/30 p-3 dark:border-emerald-900/50 dark:from-emerald-950/30 dark:to-teal-950/20">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-800/90 dark:text-emerald-400/90">
        Budget used this month
      </p>
      <p className="mt-0.5 text-xs text-muted-foreground">Share of your goal in € — ties to monthly impact points</p>

      <div className="relative mt-3">
        <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-slate-200/90 shadow-inner ring-1 ring-slate-200/80 dark:bg-slate-800 dark:ring-slate-700">
          {/* 0–60%: no points — neutral */}
          <div className="w-[60%] bg-slate-300/70 dark:bg-slate-600/80" title="0–60%" />
          {/* Reward bands: single cool gradient family */}
          <div className="w-[10%] bg-emerald-400/95 dark:bg-emerald-500/90" title="60–70%" />
          <div className="w-[10%] bg-emerald-500 dark:bg-emerald-600" title="70–80%" />
          <div className="w-[10%] bg-teal-500 dark:bg-teal-600" title="80–90%" />
          <div className="w-[10%] bg-cyan-600 dark:bg-cyan-600" title="90–100%" />
        </div>
        <div
          className="pointer-events-none absolute -top-1 z-10 flex w-4 -translate-x-1/2 flex-col items-center"
          style={{ left: `${pct}%` }}
        >
          <div className="h-0 w-0 border-x-[5px] border-x-transparent border-b-[6px] border-b-emerald-700 dark:border-b-emerald-400" />
          <div className="-mt-px h-4 w-1 rounded-full bg-emerald-700 shadow-sm ring-1 ring-emerald-600/40 dark:bg-emerald-400 dark:ring-emerald-300/30" />
        </div>
      </div>

      <div className="mt-1.5 flex items-center justify-between gap-2 px-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
        <span>0%</span>
        <span>60%</span>
        <span>100%</span>
      </div>

      <p className="mt-2 text-center text-[12px] font-semibold leading-tight text-foreground">
        {tier.points > 0 ? (
          <>
            <span>{tier.label}</span>
            <span className="mx-1 text-muted-foreground">·</span>
            <span className="text-emerald-700 dark:text-emerald-400">+{tier.points} pts</span>
            <span className="mt-1 block text-[11px] font-normal text-muted-foreground">{tier.subtitle}</span>
          </>
        ) : (
          <>
            <span>{tier.label}</span>
            <span className="mt-1 block text-[11px] font-normal text-muted-foreground">{tier.subtitle}</span>
          </>
        )}
      </p>
    </div>
  );
}
