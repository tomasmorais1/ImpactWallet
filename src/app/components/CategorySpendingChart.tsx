import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import type { Expense } from '../App';
import { useSettings } from '../contexts/SettingsContext';
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart as RechartsPie,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Layers } from 'lucide-react';

/** Emerald / teal / cyan — aligned with app theme */
const PALETTE = ['#10b981', '#14b8a6', '#06b6d4', '#059669', '#0d9488'];
const OTHERS_COLOR = '#94a3b8';

const TOP_N = 5;

function labelCategory(key: string) {
  return key.charAt(0).toUpperCase() + key.slice(1);
}

/** Top N categories; remaining spend grouped as "Others". */
function aggregateWithOthers(categoryTotals: Record<string, number>) {
  const total = Object.values(categoryTotals).reduce((a, b) => a + b, 0);
  const sorted = Object.entries(categoryTotals)
    .map(([category, amount]) => ({
      key: category,
      name: labelCategory(category),
      value: amount,
    }))
    .sort((a, b) => b.value - a.value);

  if (sorted.length <= TOP_N) {
    return sorted.map((row, i) => ({
      ...row,
      pct: total > 0 ? (row.value / total) * 100 : 0,
      color: PALETTE[i % PALETTE.length],
    }));
  }

  const top = sorted.slice(0, TOP_N);
  const restSum = sorted.slice(TOP_N).reduce((s, r) => s + r.value, 0);
  const rows = [
    ...top.map((row, i) => ({
      ...row,
      pct: total > 0 ? (row.value / total) * 100 : 0,
      color: PALETTE[i % PALETTE.length],
    })),
    {
      key: 'others',
      name: 'Others',
      value: restSum,
      pct: total > 0 ? (restSum / total) * 100 : 0,
      color: OTHERS_COLOR,
    },
  ];
  return rows.sort((a, b) => b.value - a.value);
}

interface CategorySpendingChartProps {
  expenses: Expense[];
}

export function CategorySpendingChart({ expenses }: CategorySpendingChartProps) {
  const { formatCurrency } = useSettings();

  const categoryTotals = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {} as Record<string, number>);

  const total = Object.values(categoryTotals).reduce((a, b) => a + b, 0);

  const chartData = aggregateWithOthers(categoryTotals);

  if (chartData.length === 0) {
    return (
      <Card className="border-emerald-200/60 bg-gradient-to-br from-emerald-50/40 to-teal-50/20 dark:border-emerald-900 dark:from-emerald-950/20 dark:to-teal-950/10">
        <CardContent className="py-10 text-center text-sm text-muted-foreground">
          No category data yet — add spending to see this breakdown.
        </CardContent>
      </Card>
    );
  }

  const pieData = chartData.map((d) => ({ name: d.name, value: d.value, fill: d.color }));

  const barChartHeight = Math.min(220, Math.max(96, chartData.length * 26 + 20));

  return (
    <Card className="gap-0 border-emerald-200/70 bg-gradient-to-b from-white to-emerald-50/30 shadow-md dark:border-emerald-900/60 dark:from-slate-950 dark:to-emerald-950/20">
      <CardHeader className="px-4 pb-2 pt-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-sm">
            <Layers className="h-3.5 w-3.5" />
          </div>
          <div>
            <CardTitle className="text-base leading-snug">Spending by category</CardTitle>
            <CardDescription className="text-xs">Share of this month&apos;s total</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 px-4 pb-4 pt-0">
        <div className="grid gap-3 sm:grid-cols-2 sm:items-start sm:gap-4">
          <div className="relative mx-auto aspect-square w-full max-w-[260px] sm:max-w-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPie margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius="50%"
                  outerRadius="86%"
                  paddingAngle={2}
                  dataKey="value"
                  stroke="transparent"
                  strokeWidth={0}
                >
                  {pieData.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => formatCurrency(v)} />
              </RechartsPie>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
              <p className="text-[9px] font-semibold uppercase tracking-wide text-muted-foreground">Total</p>
              <p className="mt-0.5 text-base font-bold tabular-nums text-emerald-800 dark:text-emerald-300 sm:text-lg">
                {formatCurrency(total)}
              </p>
            </div>
          </div>

          <div className="w-full" style={{ height: barChartHeight }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={chartData}
                margin={{ top: 0, right: 4, left: 0, bottom: 0 }}
                barCategoryGap={4}
              >
                <XAxis type="number" hide domain={[0, 'dataMax']} />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={72}
                  tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                  axisLine={false}
                  tickLine={false}
                  interval={0}
                />
                <Tooltip
                  cursor={{ fill: 'hsl(var(--muted) / 0.15)' }}
                  formatter={(v: number) => [formatCurrency(v), '']}
                />
                <Bar dataKey="value" radius={[0, 6, 6, 0]} maxBarSize={18}>
                  {chartData.map((entry, i) => (
                    <Cell key={entry.key} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-2 border-t border-emerald-200/40 pt-3 dark:border-emerald-900/50">
          {chartData.map((row) => (
            <div key={row.key} className="space-y-0.5">
              <div className="flex items-center justify-between text-sm leading-tight">
                <span className="font-medium text-foreground">{row.name}</span>
                <span className="tabular-nums text-muted-foreground">
                  {formatCurrency(row.value)}{' '}
                  <span className="text-emerald-700 dark:text-emerald-400">({row.pct.toFixed(0)}%)</span>
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-emerald-950/10 dark:bg-emerald-950/40">
                <div className="h-full rounded-full transition-all" style={{ width: `${row.pct}%`, backgroundColor: row.color }} />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
