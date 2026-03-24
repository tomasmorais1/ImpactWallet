import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Award } from 'lucide-react';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedDate?: string;
  progress?: number;
  maxProgress?: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
}

interface AchievementsProps {
  totalPoints: number;
  totalSaved: number;
  friendCount: number;
}

export function Achievements({ totalPoints, totalSaved, friendCount }: AchievementsProps) {
  const achievements: Achievement[] = [
    {
      id: 'first-save',
      title: 'First Steps',
      description: 'Complete your first month under budget',
      icon: '🎯',
      unlocked: totalSaved > 0,
      rarity: 'common',
      points: 10,
      unlockedDate: totalSaved > 0 ? '2026-03-01' : undefined,
    },
    {
      id: 'point-collector',
      title: 'Point Collector',
      description: 'Earn 100 Impact Points',
      icon: '💎',
      unlocked: totalPoints >= 100,
      progress: Math.min(totalPoints, 100),
      maxProgress: 100,
      rarity: 'rare',
      points: 25,
      unlockedDate: totalPoints >= 100 ? '2026-03-05' : undefined,
    },
    {
      id: 'budget-master',
      title: 'Budget Master',
      description: 'Stay under budget for 3 consecutive months',
      icon: '🏆',
      unlocked: false,
      progress: 1,
      maxProgress: 3,
      rarity: 'epic',
      points: 50,
    },
    {
      id: 'social-butterfly',
      title: 'Social Butterfly',
      description: 'Add 5 friends to your network',
      icon: '🦋',
      unlocked: friendCount >= 5,
      progress: Math.min(friendCount, 5),
      maxProgress: 5,
      rarity: 'rare',
      points: 30,
      unlockedDate: friendCount >= 5 ? '2026-03-08' : undefined,
    },
    {
      id: 'generous-soul',
      title: 'Generous Soul',
      description: 'Make your first donation in the Store',
      icon: '❤️',
      unlocked: false,
      rarity: 'rare',
      points: 20,
    },
    {
      id: 'point-trader',
      title: 'Point Trader',
      description: 'Trade points with a friend',
      icon: '🤝',
      unlocked: false,
      rarity: 'common',
      points: 15,
    },
    {
      id: 'mega-saver',
      title: 'Mega Saver',
      description: 'Reach 500 impact points',
      icon: '⭐',
      unlocked: totalPoints >= 500,
      progress: Math.min(totalPoints, 500),
      maxProgress: 500,
      rarity: 'epic',
      points: 100,
      unlockedDate: totalPoints >= 500 ? '2026-03-10' : undefined,
    },
    {
      id: 'diamond-tier',
      title: 'Thousand Club',
      description: 'Reach 1000 impact points',
      icon: '💠',
      unlocked: totalPoints >= 1000,
      progress: Math.min(totalPoints, 1000),
      maxProgress: 1000,
      rarity: 'legendary',
      points: 200,
      unlockedDate: totalPoints >= 1000 ? '2026-03-12' : undefined,
    },
    {
      id: 'influencer',
      title: 'Influencer',
      description: 'Help 3 friends achieve their goals',
      icon: '🌟',
      unlocked: false,
      progress: 0,
      maxProgress: 3,
      rarity: 'epic',
      points: 75,
    },
    {
      id: 'streak-master',
      title: 'Streak Master',
      description: 'Log in for 30 consecutive days',
      icon: '🔥',
      unlocked: false,
      progress: 12,
      maxProgress: 30,
      rarity: 'epic',
      points: 60,
    },
  ];

  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'legendary': return 'border-purple-500 bg-purple-50 dark:bg-purple-950/30';
      case 'epic': return 'border-pink-500 bg-pink-50 dark:bg-pink-950/30';
      case 'rare': return 'border-blue-500 bg-blue-50 dark:bg-blue-950/30';
      default: return 'border-gray-300 bg-gray-50 dark:bg-gray-950/30';
    }
  };

  const getRarityBadgeColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'legendary': return 'bg-purple-500 text-white';
      case 'epic': return 'bg-pink-500 text-white';
      case 'rare': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const totalAchievements = achievements.length;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-emerald-600" />
            <div>
              <CardTitle className="text-base">Achievements</CardTitle>
              <CardDescription>
                Complete challenges to earn impact points — each unlock adds points to your balance.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {achievements.map((achievement) => (
            <div 
              key={achievement.id}
              className={`p-4 rounded-xl border-2 transition-all ${
                achievement.unlocked 
                  ? getRarityColor(achievement.rarity)
                  : 'border-dashed border-gray-300 bg-gray-50/50 dark:bg-gray-900/20 opacity-60'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`text-3xl ${!achievement.unlocked && 'grayscale opacity-40'}`}>
                  {achievement.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="font-semibold text-sm">{achievement.title}</h4>
                    <Badge className={`text-xs ${getRarityBadgeColor(achievement.rarity)}`}>
                      +{achievement.points}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{achievement.description}</p>
                  
                  {achievement.maxProgress && (
                    <div className="mb-2">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Progress</span>
                        <span>{achievement.progress}/{achievement.maxProgress}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            achievement.unlocked ? 'bg-emerald-500' : 'bg-gray-400'
                          }`}
                          style={{ width: `${((achievement.progress || 0) / achievement.maxProgress) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                  
                  {achievement.unlocked && achievement.unlockedDate && (
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                      ✓ Unlocked on {new Date(achievement.unlockedDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
