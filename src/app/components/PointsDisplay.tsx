import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Trophy, Star, Award, Zap } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';

interface PointsDisplayProps {
  totalPoints: number;
  potentialPoints: number;
  onClaimPoints: () => void;
  canClaim: boolean;
}

export function PointsDisplay({ 
  totalPoints, 
  potentialPoints, 
  onClaimPoints,
  canClaim 
}: PointsDisplayProps) {
  const { formatCurrency } = useSettings();
  const getLevel = (points: number) => {
    if (points >= 1000) return { name: 'Diamond Saver', icon: Trophy, color: 'text-cyan-600' };
    if (points >= 500) return { name: 'Gold Saver', icon: Award, color: 'text-yellow-600' };
    if (points >= 250) return { name: 'Silver Saver', icon: Star, color: 'text-gray-600' };
    if (points >= 100) return { name: 'Bronze Saver', icon: Zap, color: 'text-orange-600' };
    return { name: 'Beginner', icon: Star, color: 'text-blue-600' };
  };

  const level = getLevel(totalPoints);
  const LevelIcon = level.icon;
  
  const nextMilestone = totalPoints < 100 ? 100 : 
                        totalPoints < 250 ? 250 : 
                        totalPoints < 500 ? 500 : 
                        totalPoints < 1000 ? 1000 : null;

  return (
    <Card className="bg-gradient-to-r from-purple-50 via-pink-50 to-blue-50 border-purple-200">
      <CardContent className="pt-5 pb-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-14 w-14 rounded-full bg-white flex items-center justify-center shadow-lg">
            <LevelIcon className={`h-7 w-7 ${level.color}`} />
          </div>
          <div className="flex-1">
            <Badge variant="secondary" className={`${level.color} mb-1`}>
              {level.name}
            </Badge>
            <p className="text-sm text-muted-foreground">
              {nextMilestone 
                ? `${nextMilestone - totalPoints} points to next level`
                : 'Max level! 🎉'}
            </p>
          </div>
        </div>

        {canClaim && (
          <div className="space-y-2 mt-2">
            <Button 
              onClick={onClaimPoints} 
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 h-14 text-base shadow-lg"
            >
              <Trophy className="h-5 w-5 mr-2" />
              Claim {potentialPoints} Impact Points!
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              You're saving {formatCurrency(potentialPoints * 10)} this month! 🎉
            </p>
          </div>
        )}

        {!canClaim && potentialPoints === 0 && totalPoints > 0 && (
          <div className="text-center p-4 bg-white/50 rounded-xl mt-2">
            <p className="text-sm text-muted-foreground">
              Keep tracking to see your savings
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}