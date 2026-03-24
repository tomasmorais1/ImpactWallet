import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Expense } from '../App';
import { DollarSign, PieChart } from 'lucide-react';
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useSettings } from '../contexts/SettingsContext';

interface ProgressDisplayProps {
  monthlyGoal: number;
  totalSpent: number;
  remainingBudget: number;
  percentageUsed: number;
  expensesByCategory: Expense[];
}

const categoryColors: Record<string, string> = {
  food: '#FF6B6B',
  shopping: '#4ECDC4',
  home: '#45B7D1',
  transport: '#FFA07A',
  health: '#98D8C8',
  entertainment: '#C77DFF',
};

export function ProgressDisplay({
  monthlyGoal,
  totalSpent,
  remainingBudget,
  percentageUsed,
  expensesByCategory,
}: ProgressDisplayProps) {
  const { formatCurrency } = useSettings();

  // Calculate category totals
  const categoryTotals = expensesByCategory.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(categoryTotals).map(([category, amount]) => ({
    name: category.charAt(0).toUpperCase() + category.slice(1),
    value: amount,
    color: categoryColors[category] || '#999',
  }));

  const isOverBudget = percentageUsed > 100;
  const pct = Math.min(percentageUsed, 100);

  if (monthlyGoal === 0) {
    return (
      <Card className="border-2 border-dashed">
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <DollarSign className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
            <h3>Set Your Goal</h3>
            <p className="text-muted-foreground mt-2 text-sm">
              Tap Goals to set your monthly budget
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="p-4">
          <CardDescription className="text-xs mb-1">Goal</CardDescription>
          <p className="font-bold text-lg">{formatCurrency(monthlyGoal)}</p>
        </Card>

        <Card className="p-4">
          <CardDescription className="text-xs mb-1">Spent</CardDescription>
          <p className={`font-bold text-lg ${isOverBudget ? 'text-destructive' : ''}`}>
            {formatCurrency(totalSpent)}
          </p>
        </Card>

        <Card className={`p-4 ${remainingBudget >= 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          <CardDescription className="text-xs mb-1">Left</CardDescription>
          <p className={`font-bold text-lg ${remainingBudget >= 0 ? 'text-green-600' : 'text-destructive'}`}>
            {formatCurrency(Math.abs(remainingBudget))}
          </p>
        </Card>
      </div>

      {/* Progress Bar */}
      <Card className="border-emerald-100/80 bg-gradient-to-br from-white to-emerald-50/40 dark:border-emerald-900/50 dark:from-card dark:to-emerald-950/20">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Budget Progress</CardTitle>
            <span className="text-sm font-bold tabular-nums text-emerald-700 dark:text-emerald-400">
              {percentageUsed.toFixed(0)}%
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="relative h-4 w-full overflow-hidden rounded-full bg-emerald-950/10 ring-1 ring-emerald-200/50 dark:bg-emerald-950/40 dark:ring-emerald-800/50">
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out ${
                isOverBudget
                  ? 'bg-gradient-to-r from-rose-500 to-red-600 shadow-[0_0_14px_rgba(244,63,94,0.35)]'
                  : percentageUsed > 90
                    ? 'bg-gradient-to-r from-amber-500 via-emerald-500 to-teal-500 shadow-[0_0_14px_rgba(16,185,129,0.35)]'
                    : 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 shadow-[0_0_14px_rgba(20,184,166,0.35)]'
              }`}
              style={{ width: `${pct}%` }}
            />
          </div>

          {isOverBudget && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 dark:border-red-900 dark:bg-red-950/30">
              <p className="text-sm text-red-900 dark:text-red-100">
                Over budget. Try to reduce spending 📉
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      {chartData.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-primary" />
              <CardTitle>By Category</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPie>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={70}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                </RechartsPie>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-2">
              {chartData.map((item) => (
                <div key={item.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm">{item.name}</span>
                  </div>
                  <span className="text-sm font-bold">{formatCurrency(item.value)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}