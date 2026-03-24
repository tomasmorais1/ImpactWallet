import type { Expense } from '../App';
import { useSettings } from '../contexts/SettingsContext';
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

interface MonthlySpendingChartProps {
  expenses: Expense[];
  monthlyGoal: number;
}

function buildCumulativeByDay(
  expenses: Expense[],
  year: number,
  month: number,
): { cumulative: number[]; daysInMonth: number; currentDay: number } {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  const isThisMonth = today.getMonth() === month && today.getFullYear() === year;
  const currentDay = isThisMonth ? today.getDate() : daysInMonth;

  const byDay: Record<number, number> = {};
  for (const e of expenses) {
    const d = new Date(e.date);
    if (d.getMonth() !== month || d.getFullYear() !== year) continue;
    const day = d.getDate();
    byDay[day] = (byDay[day] || 0) + e.amount;
  }

  const cumulative: number[] = [];
  let sum = 0;
  for (let day = 1; day <= daysInMonth; day++) {
    sum += byDay[day] || 0;
    cumulative[day] = sum;
  }

  return { cumulative, daysInMonth, currentDay };
}

function lastMonthTotal(expenses: Expense[], year: number, month: number): number {
  const d = new Date(year, month - 1, 1);
  const m = d.getMonth();
  const y = d.getFullYear();
  return expenses
    .filter((e) => {
      const x = new Date(e.date);
      return x.getMonth() === m && x.getFullYear() === y;
    })
    .reduce((s, e) => s + e.amount, 0);
}

export function MonthlySpendingChart({ expenses, monthlyGoal }: MonthlySpendingChartProps) {
  const { formatCurrency, darkMode } = useSettings();
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const { cumulative, daysInMonth, currentDay } = buildCumulativeByDay(expenses, year, month);
  const totalSpent = cumulative[currentDay] ?? 0;
  const prevTotal = lastMonthTotal(expenses, year, month);

  const delta = totalSpent - prevTotal;
  const spentLess = delta < 0;

  const projectedEnd =
    currentDay >= 1 ? (totalSpent / Math.max(currentDay, 1)) * daysInMonth : 0;

  const chartData: { day: number; actual: number | null; forecast: number | null }[] = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const cum = cumulative[day] ?? 0;
    if (day < currentDay) {
      chartData.push({ day, actual: cum, forecast: null });
    } else if (day === currentDay) {
      chartData.push({ day, actual: cum, forecast: cum });
    } else {
      const t = (day - currentDay) / Math.max(daysInMonth - currentDay, 1);
      const f = totalSpent + t * (projectedEnd - totalSpent);
      chartData.push({ day, actual: null, forecast: f });
    }
  }

  const maxY = Math.max(
    monthlyGoal || 0,
    totalSpent,
    projectedEnd,
    ...chartData.map((d) => Math.max(d.actual ?? 0, d.forecast ?? 0)),
  );
  const yMax = maxY * 1.12 || 1;

  const tickDays = [1, 6, 11, 16, 21, 26, 31].filter((t) => t <= daysInMonth);
  const axisTickFill = darkMode ? '#94a3b8' : '#64748b';
  const refLabelFill = darkMode ? '#94a3b8' : '#64748b';

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-md dark:border-slate-800/80 dark:bg-gradient-to-b dark:from-slate-900 dark:to-slate-950 dark:shadow-lg">
      <p className="text-sm font-medium text-muted-foreground dark:text-slate-400">Spending this month</p>
      <div className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="text-3xl font-bold tracking-tight tabular-nums text-foreground dark:text-white">
          {formatCurrency(totalSpent)}
        </span>
        {prevTotal > 0 && (
          <span
            className={`inline-flex items-center gap-0.5 text-sm font-semibold ${
              spentLess ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
            }`}
          >
            {spentLess ? (
              <TrendingDown className="h-4 w-4" strokeWidth={2.5} />
            ) : (
              <TrendingUp className="h-4 w-4" strokeWidth={2.5} />
            )}
            {formatCurrency(Math.abs(delta))}
            <span className="text-xs font-normal text-muted-foreground dark:text-slate-500">vs last month</span>
          </span>
        )}
      </div>

      <div className="mt-4 h-[180px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 8, right: 4, left: -12, bottom: 0 }}>
            <defs>
              <linearGradient id="spendAreaGreen" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#34d399" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#34d399" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="spendForecastFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#64748b" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#64748b" stopOpacity={0} />
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
                stroke="#64748b"
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
              fill="url(#spendAreaGreen)"
              connectNulls={false}
              isAnimationActive={false}
            />
            <Line
              type="stepAfter"
              dataKey="actual"
              stroke="#34d399"
              strokeWidth={2.5}
              dot={false}
              connectNulls={false}
              isAnimationActive={false}
            />
            <Area
              type="monotone"
              dataKey="forecast"
              stroke="none"
              fill="url(#spendForecastFill)"
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
  );
}
