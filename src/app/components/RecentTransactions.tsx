import type { ElementType } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { ChevronRight } from 'lucide-react';
import type { Expense } from '../App';
import { useSettings } from '../contexts/SettingsContext';
import { ShoppingBag, Coffee, Home, Car, Heart, Gamepad2 } from 'lucide-react';

const catIcons: Record<string, ElementType> = {
  food: Coffee,
  shopping: ShoppingBag,
  home: Home,
  transport: Car,
  health: Heart,
  entertainment: Gamepad2,
};

interface RecentTransactionsProps {
  expenses: Expense[];
  onSeeAll: () => void;
  limit?: number;
}

export function RecentTransactions({ expenses, onSeeAll, limit = 3 }: RecentTransactionsProps) {
  const { formatCurrency } = useSettings();
  const sorted = [...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const recent = sorted.slice(0, limit);

  return (
    <Card className="border-slate-200/90 shadow-sm dark:border-slate-800">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold">Recent activity</CardTitle>
        {sorted.length > limit && (
          <Button variant="ghost" size="sm" className="h-8 gap-0.5 text-emerald-700 dark:text-emerald-400" onClick={onSeeAll}>
            See all
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-1">
        {recent.length === 0 ? (
          <p className="py-4 text-center text-sm text-muted-foreground">No movements this month yet.</p>
        ) : (
          recent.map((e) => {
            const Icon = catIcons[e.category] || ShoppingBag;
            return (
              <div
                key={e.id}
                className="flex items-center justify-between gap-3 rounded-lg py-2.5 pl-1 pr-2 transition-colors hover:bg-muted/50"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/50">
                    <Icon className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{e.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(e.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                </div>
                <p className="shrink-0 text-sm font-semibold tabular-nums">{formatCurrency(e.amount)}</p>
              </div>
            );
          })
        )}
        {recent.length > 0 && sorted.length <= limit && (
          <Button variant="link" className="h-auto w-full justify-center pt-2 text-emerald-700 dark:text-emerald-400" onClick={onSeeAll}>
            Open Finance for full activity
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
