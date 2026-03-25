import type { Expense } from '../App';
import { ScreenGradientLayout } from './ScreenGradientLayout';
import { FinanceSummaryHeader } from './FinanceSummaryHeader';
import { FinanceInsights } from './FinanceInsights';
import { FinanceMovements } from './FinanceMovements';
import { CategorySpendingChart } from './CategorySpendingChart';
import { SpendingByDayChart } from './SpendingByDayChart';

interface FinanceScreenProps {
  thisMonthExpenses: Expense[];
  monthlyGoal: number;
  totalSpent: number;
  remainingBudget: number;
  percentageUsed: number;
  onDeleteExpense: (id: string) => void;
}

export function FinanceScreen({
  thisMonthExpenses,
  monthlyGoal,
  totalSpent,
  remainingBudget,
  percentageUsed,
  onDeleteExpense,
}: FinanceScreenProps) {
  return (
    <ScreenGradientLayout variant="tall">
      <div className="space-y-6 px-4 pb-6 pt-4">
        <FinanceSummaryHeader
          monthlyGoal={monthlyGoal}
          totalSpent={totalSpent}
          remainingBudget={remainingBudget}
          percentageUsed={percentageUsed}
        />

        <FinanceMovements expenses={thisMonthExpenses} onDeleteExpense={onDeleteExpense} previewCount={4} />

        <FinanceInsights expenses={thisMonthExpenses} />

        <CategorySpendingChart expenses={thisMonthExpenses} />

        <SpendingByDayChart expenses={thisMonthExpenses} />

        <p className="text-center text-xs text-muted-foreground">
          Liga o banco e sincroniza movimentos em{' '}
          <span className="font-semibold text-emerald-700 dark:text-emerald-400">Perfil</span>.
        </p>
      </div>
    </ScreenGradientLayout>
  );
}
