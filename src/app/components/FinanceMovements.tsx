import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import type { Expense } from '../App';
import { useSettings } from '../contexts/SettingsContext';
import { ShoppingBag, Coffee, Home, Car, Heart, Gamepad2, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

const categories = [
  { value: 'food', icon: Coffee },
  { value: 'shopping', icon: ShoppingBag },
  { value: 'home', icon: Home },
  { value: 'transport', icon: Car },
  { value: 'health', icon: Heart },
  { value: 'entertainment', icon: Gamepad2 },
];

function getCategoryIcon(cat: string) {
  const c = categories.find((x) => x.value === cat);
  const Icon = c?.icon || ShoppingBag;
  return <Icon className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />;
}

interface FinanceMovementsProps {
  expenses: Expense[];
  onDeleteExpense: (id: string) => void;
  previewCount?: number;
}

export function FinanceMovements({ expenses, onDeleteExpense, previewCount = 4 }: FinanceMovementsProps) {
  const { formatCurrency } = useSettings();
  const [expanded, setExpanded] = useState(false);

  const sorted = [...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const hasMore = sorted.length > previewCount;
  const preview = sorted.slice(0, previewCount);
  const listToRender = expanded ? sorted : preview;

  return (
    <Card className="border-emerald-200/70 bg-white shadow-md dark:border-emerald-900/50 dark:bg-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Movements</CardTitle>
        <CardDescription>This month · {sorted.length} total</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {sorted.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No transactions yet. Sync your bank in Settings.
          </p>
        ) : (
          <>
            <div
              className={
                expanded && hasMore
                  ? 'max-h-[min(70vh,560px)] space-y-2 overflow-y-auto overscroll-contain pr-1'
                  : 'space-y-2'
              }
            >
              {listToRender.map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between gap-2 rounded-xl border border-slate-100 bg-slate-50/80 p-3 dark:border-slate-800 dark:bg-slate-900/40"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/50">
                      {getCategoryIcon(expense.category)}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-medium">{expense.description}</p>
                      <p className="text-xs capitalize text-muted-foreground">
                        {expense.category} ·{' '}
                        {new Date(expense.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <span className="font-semibold tabular-nums">{formatCurrency(expense.amount)}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:bg-destructive/10"
                      onClick={() => onDeleteExpense(expense.id)}
                      aria-label="Remove"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {hasMore && (
              <Button
                type="button"
                variant="outline"
                className="w-full border-emerald-200 bg-emerald-50/50 font-semibold text-emerald-900 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-100 dark:hover:bg-emerald-950/50"
                onClick={() => setExpanded((e) => !e)}
              >
                {expanded ? (
                  <>
                    <ChevronUp className="mr-2 h-4 w-4" />
                    Recolher
                  </>
                ) : (
                  <>
                    <ChevronDown className="mr-2 h-4 w-4" />
                    Ver mais ({sorted.length - previewCount})
                  </>
                )}
              </Button>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
