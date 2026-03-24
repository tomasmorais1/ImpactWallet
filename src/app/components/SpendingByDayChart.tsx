import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import type { Expense } from '../App';
import { useSettings } from '../contexts/SettingsContext';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { CalendarRange } from 'lucide-react';

function buildDailySeries(expenses: Expense[], year: number, month: number) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const byDay: number[] = Array.from({ length: daysInMonth + 1 }, () => 0);
  for (const e of expenses) {
    const d = new Date(e.date);
    if (d.getMonth() !== month || d.getFullYear() !== year) continue;
    const day = d.getDate();
    byDay[day] += e.amount;
  }
  return Array.from({ length: daysInMonth }, (_, i) => ({
    day: i + 1,
    amount: byDay[i + 1],
  }));
}

interface SpendingByDayChartProps {
  expenses: Expense[];
}

export function SpendingByDayChart({ expenses }: SpendingByDayChartProps) {
  const { formatCurrency, darkMode } = useSettings();
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const data = buildDailySeries(expenses, year, month);
  const maxAmount = Math.max(...data.map((d) => d.amount), 1);
  const yMax = Math.ceil(maxAmount * 1.12);
  const tickFill = darkMode ? '#94a3b8' : '#64748b';

  const hasAny = data.some((d) => d.amount > 0);

  if (!hasAny) {
    return (
      <Card className="border-emerald-200/60 bg-gradient-to-b from-white to-slate-50/40 dark:border-emerald-900 dark:from-slate-950 dark:to-slate-900/40">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 text-white shadow-sm">
              <CalendarRange className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-base">Daily spending</CardTitle>
              <CardDescription>Gasto por dia (mês atual)</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="py-8 text-center text-sm text-muted-foreground">
          Sem movimentos este mês — os teus gastos por dia aparecem aqui.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-emerald-200/70 bg-gradient-to-b from-white to-slate-50/50 shadow-md dark:border-emerald-900/60 dark:from-slate-950 dark:to-slate-900/30">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 text-white shadow-sm">
            <CalendarRange className="h-4 w-4" />
          </div>
          <div>
            <CardTitle className="text-base">Daily spending</CardTitle>
            <CardDescription>Distribuição ao longo do mês · máx. {formatCurrency(maxAmount)} num dia</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="h-[240px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 4 }} barCategoryGap="12%">
              <defs>
                <linearGradient id="barEmerald" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#14b8a6" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.6} vertical={false} />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 10, fill: tickFill }}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
                minTickGap={24}
              />
              <YAxis
                tick={{ fontSize: 10, fill: tickFill }}
                tickLine={false}
                axisLine={false}
                width={44}
                tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(1)}k` : `${v}`)}
                domain={[0, yMax]}
              />
              <Tooltip
                cursor={{ fill: 'hsl(var(--muted) / 0.12)' }}
                formatter={(v: number) => [formatCurrency(v), 'Gasto']}
                labelFormatter={(day) => `Dia ${day}`}
              />
              <Bar
                dataKey="amount"
                fill="url(#barEmerald)"
                radius={[6, 6, 0, 0]}
                maxBarSize={28}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
