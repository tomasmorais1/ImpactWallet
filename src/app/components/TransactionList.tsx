import { Button } from './ui/button';
import type { Expense } from '../App';
import { ShoppingBag, Coffee, Home, Car, Heart, Gamepad2, Trash2 } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';

const categories = [
  { value: 'food', label: 'Food & Dining', icon: Coffee },
  { value: 'shopping', label: 'Shopping', icon: ShoppingBag },
  { value: 'home', label: 'Home & Utilities', icon: Home },
  { value: 'transport', label: 'Transportation', icon: Car },
  { value: 'health', label: 'Health & Wellness', icon: Heart },
  { value: 'entertainment', label: 'Entertainment', icon: Gamepad2 },
];

function getCategoryIcon(cat: string) {
  const category = categories.find((c) => c.value === cat);
  const Icon = category?.icon || ShoppingBag;
  return <Icon className="h-4 w-4" />;
}

interface TransactionListProps {
  expenses: Expense[];
  onDeleteExpense: (id: string) => void;
  maxHeightClass?: string;
  emptyHint?: string;
}

export function TransactionList({
  expenses,
  onDeleteExpense,
  maxHeightClass = 'max-h-[min(420px,55vh)]',
  emptyHint = 'No transactions this period.',
}: TransactionListProps) {
  const { formatCurrency } = useSettings();
  const sorted = [...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (sorted.length === 0) {
    return (
      <div className="rounded-xl border border-dashed py-10 text-center text-sm text-muted-foreground">{emptyHint}</div>
    );
  }

  return (
    <div className={`-mx-1 overflow-y-auto overscroll-contain px-1 ${maxHeightClass}`}>
      <div className="space-y-2 pr-2">
        {sorted.map((expense) => (
          <div
            key={expense.id}
            className="flex items-center justify-between rounded-xl bg-muted/40 p-3 transition-colors hover:bg-muted/60 dark:bg-muted/20"
          >
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-background shadow-sm">
                {getCategoryIcon(expense.category)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{expense.description}</p>
                <p className="text-xs capitalize text-muted-foreground">
                  {expense.category} ·{' '}
                  {new Date(expense.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <p className="font-bold tabular-nums">{formatCurrency(expense.amount)}</p>
              <Button
                variant="ghost"
                size="icon"
                type="button"
                onClick={() => onDeleteExpense(expense.id)}
                className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                aria-label="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
