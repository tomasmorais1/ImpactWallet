import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Award, TrendingUp, Target, Gem, Star, Crown, Zap, Heart, Globe, Users } from 'lucide-react';

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
  monthlyGoal: number;
  friendCount: number;
}

export function Achievements({ totalPoints, totalSaved, monthlyGoal, friendCount }: AchievementsProps) {
  // Calculate user level based on points
  const level = Math.floor(totalPoints / 100) + 1;
  const nextLevelPoints = level * 100;
  const levelProgress = (totalPoints % 100);

  // Determine saver tier
  const getSaverTier = () => {
    if (totalPoints >= 1000) return { name: 'Diamond Saver', icon: Gem, color: 'from-cyan-500 to-blue-600' };
    if (totalPoints >= 500) return { name: 'Platinum Saver', icon: Crown, color: 'from-purple-500 to-pink-600' };
    if (totalPoints >= 250) return { name: 'Gold Saver', icon: Star, color: 'from-amber-500 to-orange-600' };
    if (totalPoints >= 100) return { name: 'Silver Saver', icon: Award, color: 'from-gray-400 to-gray-600' };
    return { name: 'Beginner Saver', icon: Zap, color: 'from-green-500 to-emerald-600' };
  };

  const tier = getSaverTier();
  const TierIcon = tier.icon;

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
      description: 'Accumulate 500 Impact Points',
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
      title: 'Diamond Tier',
      description: 'Reach 1000 Impact Points',
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
      {/* Player Profile Card */}
      <Card className={`bg-gradient-to-r ${tier.color} border-0 text-white overflow-hidden shadow-lg`}>
        <CardContent className="pt-6 pb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="h-14 w-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <TierIcon className="h-7 w-7 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">{tier.name}</h3>
                <p className="text-white/80 text-sm">Level {level}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-white">{totalPoints}</p>
              <p className="text-xs text-white/80">Total Points</p>
            </div>
          </div>
          
          {/* Level Progress */}
          <div>
            <div className="flex justify-between text-xs text-white/90 mb-1.5">
              <span>Level {level}</span>
              <span>{levelProgress}/100 to Level {level + 1}</span>
            </div>
            <div className="h-2.5 rounded-full bg-white/20 overflow-hidden">
              <div 
                className="h-full bg-white rounded-full transition-all duration-500"
                style={{ width: `${levelProgress}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="pt-4 pb-4 text-center">
            <Award className="h-6 w-6 mx-auto mb-2 text-amber-500" />
            <p className="text-2xl font-bold">{unlockedAchievements.length}</p>
            <p className="text-xs text-muted-foreground">Unlocked</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4 text-center">
            <Target className="h-6 w-6 mx-auto mb-2 text-emerald-500" />
            <p className="text-2xl font-bold">{totalAchievements}</p>
            <p className="text-xs text-muted-foreground">Total</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4 text-center">
            <TrendingUp className="h-6 w-6 mx-auto mb-2 text-blue-500" />
            <p className="text-2xl font-bold">{Math.round((unlockedAchievements.length / totalAchievements) * 100)}%</p>
            <p className="text-xs text-muted-foreground">Complete</p>
          </CardContent>
        </Card>
      </div>

      {/* Achievement List */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Your Achievements</CardTitle>
              <CardDescription>Unlock rewards by completing challenges</CardDescription>
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
