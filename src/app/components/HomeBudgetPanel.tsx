import type { Expense } from '../App';
import { useSettings } from '../contexts/SettingsContext';
import { buildCumulativeByDay, lastMonthTotal } from './budgetChartUtils';
import {
  Area,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
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
  const { formatCurrency, darkMode } = useSettings();
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const { cumulative, daysInMonth, currentDay } = buildCumulativeByDay(expenses, year, month);
  const spentFromSeries = cumulative[currentDay] ?? 0;
  const prevTotal = lastMonthTotal(expenses, year, month);
  const delta = spentFromSeries - prevTotal;
  const spentLess = delta < 0;

  const projectedEnd =
    currentDay >= 1 ? (spentFromSeries / Math.max(currentDay, 1)) * daysInMonth : 0;

  const chartData: { day: number; actual: number | null; forecast: number | null }[] = [];
  for (let day = 1; day <= daysInMonth; day++) {
    const cum = cumulative[day] ?? 0;
    if (day < currentDay) {
      chartData.push({ day, actual: cum, forecast: null });
    } else if (day === currentDay) {
      chartData.push({ day, actual: cum, forecast: cum });
    } else {
      const t = (day - currentDay) / Math.max(daysInMonth - currentDay, 1);
      const f = spentFromSeries + t * (projectedEnd - spentFromSeries);
      chartData.push({ day, actual: null, forecast: f });
    }
  }

  const maxY = Math.max(
    monthlyGoal || 0,
    spentFromSeries,
    projectedEnd,
    ...chartData.map((d) => Math.max(d.actual ?? 0, d.forecast ?? 0)),
  );
  const yMax = maxY * 1.12 || 1;

  const tickDays = [1, 6, 11, 16, 21, 26, 31].filter((t) => t <= daysInMonth);
  const axisTickFill = darkMode ? '#94a3b8' : '#64748b';
  const refLabelFill = darkMode ? '#94a3b8' : '#64748b';

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

      <div className="border-t border-slate-100 px-2 pb-1 pt-2 dark:border-slate-800">
        <div className="h-[168px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 4, right: 4, left: -12, bottom: 0 }}>
              <defs>
                <linearGradient id="homeSpendAreaGreen" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#34d399" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#34d399" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="homeSpendForecastFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#94a3b8" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#94a3b8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="day"
                type="number"
                domain={[1, daysInMonth]}
                ticks={tickDays}
                tick={{ fill: axisTickFill, fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis hide domain={[0, yMax]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: '12px',
                  fontSize: '12px',
                }}
                labelFormatter={(d) => `Day ${d}`}
                formatter={(value: number | undefined) =>
                  value != null ? [formatCurrency(value), ''] : ['—', '']
                }
              />
              {monthlyGoal > 0 && (
                <ReferenceLine
                  y={monthlyGoal}
                  stroke="#94a3b8"
                  strokeDasharray="4 4"
                  label={{
                    value: formatCurrency(monthlyGoal),
                    position: 'insideTopRight',
                    fill: refLabelFill,
                    fontSize: 11,
                  }}
                />
              )}
              <Area
                type="stepAfter"
                dataKey="actual"
                stroke="none"
                fill="url(#homeSpendAreaGreen)"
                connectNulls={false}
                isAnimationActive={false}
              />
              <Line
                type="stepAfter"
                dataKey="actual"
                stroke="#10b981"
                strokeWidth={2.5}
                dot={false}
                connectNulls={false}
                isAnimationActive={false}
              />
              <Area
                type="monotone"
                dataKey="forecast"
                stroke="none"
                fill="url(#homeSpendForecastFill)"
                connectNulls
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="forecast"
                stroke="#94a3b8"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                connectNulls
                isAnimationActive={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {monthlyGoal === 0 && (
        <div className="border-t border-dashed border-slate-200 px-4 py-3 dark:border-slate-700">
          <p className="text-center text-xs text-muted-foreground">
            Set a monthly goal in <span className="font-semibold text-emerald-700 dark:text-emerald-400">Finance</span>{' '}
            to track progress and the budget line on the chart.
          </p>
        </div>
      )}
    </div>
  );
}
