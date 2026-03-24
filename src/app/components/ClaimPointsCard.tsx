import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Trophy } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';

interface ClaimPointsCardProps {
  potentialPoints: number;
  canClaim: boolean;
  onClaim: () => void;
}

export function ClaimPointsCard({ potentialPoints, canClaim, onClaim }: ClaimPointsCardProps) {
  const { formatCurrency } = useSettings();

  return (
    <Card className="overflow-hidden border-emerald-200/80 bg-gradient-to-br from-emerald-50/90 to-teal-50/50 dark:border-emerald-900 dark:from-emerald-950/40 dark:to-teal-950/20">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600 dark:bg-emerald-500/25 dark:text-emerald-400">
            <Trophy className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1 space-y-1">
            <p className="text-sm font-semibold text-foreground">Claim impact points</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Earn 1 point for every {formatCurrency(10)} you keep under budget this month. Claim when you have
              points available.
            </p>
          </div>
        </div>
        <Button
          type="button"
          disabled={!canClaim}
          onClick={onClaim}
          className="mt-4 h-11 w-full rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 font-semibold text-white shadow-md hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50"
        >
          {canClaim ? `Claim ${potentialPoints} points` : 'No points to claim yet'}
        </Button>
      </CardContent>
    </Card>
  );
}
