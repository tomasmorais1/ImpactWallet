import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Target, TrendingDown, Sparkles } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';

interface GoalSettingProps {
  monthlyGoal: number;
  onSetGoal: (goal: number) => void;
}

export function GoalSetting({ monthlyGoal, onSetGoal }: GoalSettingProps) {
  const { formatCurrency, currency } = useSettings();
  const [goalInput, setGoalInput] = useState(monthlyGoal.toString());

  const handleSaveGoal = () => {
    const newGoal = parseFloat(goalInput);
    if (!isNaN(newGoal) && newGoal > 0) {
      onSetGoal(newGoal);
    }
  };

  const suggestedGoals = [1000, 1500, 2000, 2500, 3000];

  return (
    <div className="space-y-4">
      <Card className="border-2 border-primary/20">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Target className="h-6 w-6 text-primary" />
            <CardTitle>Monthly Budget Goal</CardTitle>
          </div>
          <CardDescription className="text-sm">
            Set your budget. Stay under to earn Impact Points!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="goal">Monthly Budget ({currency.code})</Label>
            <div className="flex gap-2">
              <Input
                id="goal"
                type="number"
                placeholder="Enter amount"
                value={goalInput}
                onChange={(e) => setGoalInput(e.target.value)}
                className="flex-1 h-12 text-lg"
              />
              <Button onClick={handleSaveGoal} className="h-12 px-6">
                Save
              </Button>
            </div>
          </div>

          {monthlyGoal > 0 && (
            <div className="p-4 bg-primary/5 rounded-xl border border-primary/20 text-center">
              <p className="text-sm text-muted-foreground">Current Goal</p>
              <p className="text-2xl font-bold text-primary">
                {formatCurrency(monthlyGoal)}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-chart-2" />
            <CardTitle>Quick Select</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {suggestedGoals.map((amount) => (
              <Button
                key={amount}
                variant="outline"
                onClick={() => {
                  setGoalInput(amount.toString());
                  onSetGoal(amount);
                }}
                className="h-16 flex flex-col gap-1"
              >
                <TrendingDown className="h-4 w-4 text-muted-foreground" />
                <span className="font-bold">{formatCurrency(amount)}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-200 dark:border-blue-800">
        <CardHeader className="pb-3">
          <CardTitle>How It Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            'Set your monthly spending goal',
            'Connect your bank & track expenses',
            'Earn 1 Impact Point per $10 saved',
            'Redeem points in the Store for donations & discounts!',
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-primary font-bold">{i + 1}</span>
              </div>
              <p className="text-sm pt-1">{step}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}