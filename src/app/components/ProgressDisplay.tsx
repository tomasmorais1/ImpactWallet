import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
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
  const progressColor = percentageUsed > 90 ? 'bg-destructive' : percentageUsed > 70 ? 'bg-chart-5' : 'bg-chart-2';

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
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Budget Progress</CardTitle>
            <span className="text-sm font-bold">{percentageUsed.toFixed(0)}%</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <Progress value={Math.min(percentageUsed, 100)} className="h-3" indicatorClassName={progressColor} />
          
          {remainingBudget >= 0 ? (
            <div className="p-3 bg-green-50 border border-green-200 rounded-xl">
              <p className="text-sm text-green-800">
                Great! Keep it up to earn points! 💪
              </p>
            </div>
          ) : (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-800">
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