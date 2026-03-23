import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ScrollArea } from './ui/scroll-area';
import { Expense } from '../App';
import { Plus, Trash2, ShoppingBag, Coffee, Home, Car, Heart, Gamepad2 } from 'lucide-react';

interface ExpenseTrackerProps {
  expenses: Expense[];
  onAddExpense: (expense: Omit<Expense, 'id'>) => void;
  onDeleteExpense: (id: string) => void;
  monthlyGoal: number;
  totalSpent: number;
}

const categories = [
  { value: 'food', label: 'Food & Dining', icon: Coffee },
  { value: 'shopping', label: 'Shopping', icon: ShoppingBag },
  { value: 'home', label: 'Home & Utilities', icon: Home },
  { value: 'transport', label: 'Transportation', icon: Car },
  { value: 'health', label: 'Health & Wellness', icon: Heart },
  { value: 'entertainment', label: 'Entertainment', icon: Gamepad2 },
];

export function ExpenseTracker({ 
  expenses, 
  onAddExpense, 
  onDeleteExpense,
  monthlyGoal,
  totalSpent
}: ExpenseTrackerProps) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('food');

  const handleAddExpense = () => {
    if (description && amount && !isNaN(parseFloat(amount)) && parseFloat(amount) > 0) {
      onAddExpense({
        description,
        amount: parseFloat(amount),
        date: new Date().toISOString(),
        category,
      });
      setDescription('');
      setAmount('');
      setCategory('food');
    }
  };

  const getCategoryIcon = (cat: string) => {
    const category = categories.find(c => c.value === cat);
    const Icon = category?.icon || ShoppingBag;
    return <Icon className="h-4 w-4" />;
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Add Expense</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">What did you buy?</Label>
            <Input
              id="description"
              placeholder="e.g., Coffee, Groceries, Gas"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="h-12"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category" className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => {
                    const Icon = cat.icon;
                    return (
                      <SelectItem key={cat.value} value={cat.value}>
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          {cat.label}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={handleAddExpense} className="w-full h-12 text-base">
            <Plus className="h-5 w-5 mr-2" />
            Add Expense
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Recent Expenses</CardTitle>
            <span className="text-sm text-muted-foreground">
              {expenses.length} total
            </span>
          </div>
        </CardHeader>
        <CardContent>
          {expenses.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <ShoppingBag className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No expenses yet</p>
              <p className="text-xs mt-1">Add your first expense above</p>
            </div>
          ) : (
            <ScrollArea className="h-[400px] -mx-2 px-2">
              <div className="space-y-2">
                {expenses
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((expense) => (
                    <div
                      key={expense.id}
                      className="flex items-center justify-between p-3 bg-muted/30 rounded-xl active:bg-muted transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="h-10 w-10 rounded-full bg-background flex items-center justify-center flex-shrink-0">
                          {getCategoryIcon(expense.category)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{expense.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(expense.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <p className="font-bold">${expense.amount.toFixed(2)}</p>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDeleteExpense(expense.id)}
                          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
