import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import type { Expense } from '../App';
import { useSettings } from '../contexts/SettingsContext';
import { BarChart3, CalendarDays, TrendingUp } from 'lucide-react';

interface FinanceInsightsProps {
  expenses: Expense[];
}

export function FinanceInsights({ expenses }: FinanceInsightsProps) {
  const { formatCurrency } = useSettings();
  const now = new Date();
  const dayOfMonth = now.getDate();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const daysLeft = Math.max(0, daysInMonth - dayOfMonth);

  const total = expenses.reduce((s, e) => s + e.amount, 0);
  const avgDaily = dayOfMonth > 0 ? total / dayOfMonth : 0;

  const byCat = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {} as Record<string, number>);
  const topEntry = Object.entries(byCat).sort((a, b) => b[1] - a[1])[0];
  const topCategory = topEntry ? topEntry[0].charAt(0).toUpperCase() + topEntry[0].slice(1) : '—';
  const topAmount = topEntry ? topEntry[1] : 0;

  if (expenses.length === 0) {
    return (
      <Card className="border-slate-200/90 dark:border-slate-800">
        <CardContent className="py-6 text-center text-sm text-muted-foreground">
          No spending recorded this month yet — sync or add activity from Settings → Bank.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-slate-200/90 dark:border-slate-800">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-emerald-600" />
          <CardTitle className="text-base">This month · insights</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-3 dark:border-slate-800 dark:bg-slate-900/40">
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <TrendingUp className="h-3.5 w-3.5" />
              Avg. per day
            </div>
            <p className="mt-1 text-lg font-bold tabular-nums">{formatCurrency(avgDaily)}</p>
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-3 dark:border-slate-800 dark:bg-slate-900/40">
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <BarChart3 className="h-3.5 w-3.5" />
              Top category
            </div>
            <p className="mt-1 truncate text-lg font-bold">{topCategory}</p>
            <p className="text-xs text-muted-foreground">{formatCurrency(topAmount)} total</p>
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-3 dark:border-slate-800 dark:bg-slate-900/40">
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <CalendarDays className="h-3.5 w-3.5" />
              Days left
            </div>
            <p className="mt-1 text-lg font-bold tabular-nums">{daysLeft}</p>
            <p className="text-xs text-muted-foreground">in this month</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
