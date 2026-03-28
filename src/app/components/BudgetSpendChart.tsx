import type { Expense } from '../App';
import { useSettings } from '../contexts/SettingsContext';
import { buildCumulativeByDay } from './budgetChartUtils';
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

interface BudgetSpendChartProps {
  expenses: Expense[];
  monthlyGoal: number;
}

/**
 * Gráfico de gasto cumulativo do mês (área + linha de meta). Antes na Home; agora no Finance.
 */
export function BudgetSpendChart({ expenses, monthlyGoal }: BudgetSpendChartProps) {
  const { formatCurrency, darkMode } = useSettings();
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const { cumulative, daysInMonth, currentDay } = buildCumulativeByDay(expenses, year, month);
  const spentFromSeries = cumulative[currentDay] ?? 0;

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

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-md dark:border-slate-800/80 dark:bg-gradient-to-b dark:from-slate-900 dark:to-slate-950 dark:shadow-lg">
      <div className="border-b border-slate-100 px-4 pb-2 pt-3 dark:border-slate-800">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Monthly spend curve</p>
        <p className="text-[11px] text-muted-foreground">Actual vs projected · goal line</p>
      </div>
      <div className="border-t border-slate-100 px-2 pb-1 pt-2 dark:border-slate-800">
        <div className="h-[168px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 4, right: 4, left: -12, bottom: 0 }}>
              <defs>
                <linearGradient id="financeSpendAreaGreen" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#34d399" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#34d399" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="financeSpendForecastFill" x1="0" y1="0" x2="0" y2="1">
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
                fill="url(#financeSpendAreaGreen)"
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
                fill="url(#financeSpendForecastFill)"
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
            Define um objetivo mensal em <span className="font-semibold text-emerald-700 dark:text-emerald-400">Perfil</span>{' '}
            para veres a linha de orçamento no gráfico.
          </p>
        </div>
      )}
    </div>
  );
}
