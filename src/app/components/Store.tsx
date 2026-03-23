import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import {
  Coins, Heart, Leaf, Droplets, GraduationCap, Users,
  Tag, ShoppingBag, CheckCircle2, Zap, Trophy, Star, Award,
} from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';

interface StoreProps {
  totalPoints: number;
  onRedeem: (cost: number, label: string) => void;
}

interface Product {
  id: string;
  type: 'donation' | 'discount';
  title: string;
  subtitle: string;
  description: string;
  cost: number;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  badge: string;
  badgeColor: string;
  actionLabel: string;
}

const PRODUCTS: Product[] = [
  {
    id: 'p1',
    type: 'donation',
    title: '$1 Donation',
    subtitle: 'Save the Children',
    description: 'Fund education & emergency relief for children worldwide.',
    cost: 50,
    icon: Heart,
    iconBg: 'bg-red-100 dark:bg-red-900',
    iconColor: 'text-red-600',
    badge: 'Children & Health',
    badgeColor: 'bg-red-50 text-red-700 border-red-200',
    actionLabel: 'Donate',
  },
  {
    id: 'p2',
    type: 'donation',
    title: '$3 Donation',
    subtitle: 'Save the Children',
    description: 'Provide meals, vaccines, and schooling to three children.',
    cost: 130,
    icon: Heart,
    iconBg: 'bg-red-100 dark:bg-red-900',
    iconColor: 'text-red-600',
    badge: 'Children & Health',
    badgeColor: 'bg-red-50 text-red-700 border-red-200',
    actionLabel: 'Donate',
  },
  {
    id: 'p3',
    type: 'donation',
    title: '$1 Donation',
    subtitle: 'World Wildlife Fund',
    description: 'Help protect endangered species and critical habitats.',
    cost: 50,
    icon: Leaf,
    iconBg: 'bg-green-100 dark:bg-green-900',
    iconColor: 'text-green-600',
    badge: 'Environment',
    badgeColor: 'bg-green-50 text-green-700 border-green-200',
    actionLabel: 'Donate',
  },
  {
    id: 'p4',
    type: 'donation',
    title: '$3 Donation',
    subtitle: 'WWF',
    description: 'Support conservation in 3 critical biodiversity hotspots.',
    cost: 130,
    icon: Leaf,
    iconBg: 'bg-green-100 dark:bg-green-900',
    iconColor: 'text-green-600',
    badge: 'Environment',
    badgeColor: 'bg-green-50 text-green-700 border-green-200',
    actionLabel: 'Donate',
  },
  {
    id: 'p5',
    type: 'donation',
    title: '$1 Donation',
    subtitle: 'Water.org',
    description: 'Bring clean water access to families in need.',
    cost: 50,
    icon: Droplets,
    iconBg: 'bg-cyan-100 dark:bg-cyan-900',
    iconColor: 'text-cyan-600',
    badge: 'Clean Water',
    badgeColor: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    actionLabel: 'Donate',
  },
  {
    id: 'p6',
    type: 'donation',
    title: '$3 Donation',
    subtitle: 'UNICEF',
    description: 'Support nutrition and education programs for children.',
    cost: 130,
    icon: GraduationCap,
    iconBg: 'bg-purple-100 dark:bg-purple-900',
    iconColor: 'text-purple-600',
    badge: 'Education',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    actionLabel: 'Donate',
  },
  {
    id: 'p7',
    type: 'donation',
    title: '$5 Donation',
    subtitle: 'Feeding America',
    description: 'Provide 50 meals through the national food bank network.',
    cost: 200,
    icon: Users,
    iconBg: 'bg-orange-100 dark:bg-orange-900',
    iconColor: 'text-orange-600',
    badge: 'Hunger Relief',
    badgeColor: 'bg-orange-50 text-orange-700 border-orange-200',
    actionLabel: 'Donate',
  },
  {
    id: 'p8',
    type: 'discount',
    title: '15% Discount',
    subtitle: 'Patagonia',
    description: 'One-time use discount on sustainable outdoor clothing & gear.',
    cost: 175,
    icon: Tag,
    iconBg: 'bg-teal-100 dark:bg-teal-900',
    iconColor: 'text-teal-600',
    badge: 'Eco Fashion',
    badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
    actionLabel: 'Redeem',
  },
  {
    id: 'p9',
    type: 'discount',
    title: '20% Discount',
    subtitle: 'Allbirds',
    description: 'Save on carbon-neutral sneakers made from natural materials.',
    cost: 220,
    icon: Tag,
    iconBg: 'bg-indigo-100 dark:bg-indigo-900',
    iconColor: 'text-indigo-600',
    badge: 'Sustainable',
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    actionLabel: 'Redeem',
  },
  {
    id: 'p10',
    type: 'discount',
    title: '10% Discount',
    subtitle: 'Grove Collaborative',
    description: 'Discount on plastic-free, eco-friendly home essentials.',
    cost: 120,
    icon: ShoppingBag,
    iconBg: 'bg-lime-100 dark:bg-lime-900',
    iconColor: 'text-lime-700',
    badge: 'Home & Living',
    badgeColor: 'bg-lime-50 text-lime-700 border-lime-200',
    actionLabel: 'Redeem',
  },
];

function getLevel(points: number) {
  if (points >= 1000) return { name: 'Diamond Saver', icon: Trophy, color: 'text-cyan-500' };
  if (points >= 500) return { name: 'Gold Saver', icon: Award, color: 'text-yellow-500' };
  if (points >= 250) return { name: 'Silver Saver', icon: Star, color: 'text-slate-500' };
  if (points >= 100) return { name: 'Bronze Saver', icon: Zap, color: 'text-orange-500' };
  return { name: 'Beginner', icon: Star, color: 'text-blue-500' };
}

type FilterType = 'all' | 'donation' | 'discount';

export function Store({ totalPoints, onRedeem }: StoreProps) {
  const { t } = useSettings();
  const [filter, setFilter] = useState<FilterType>('all');
  const [redeemedId, setRedeemedId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState('');

  const level = getLevel(totalPoints);
  const LevelIcon = level.icon;

  const nextMilestone =
    totalPoints < 100 ? 100 :
    totalPoints < 250 ? 250 :
    totalPoints < 500 ? 500 :
    totalPoints < 1000 ? 1000 : null;

  const filtered = PRODUCTS.filter(p => filter === 'all' || p.type === filter);

  const handleRedeem = (product: Product) => {
    if (totalPoints >= product.cost) {
      onRedeem(product.cost, product.title + ' – ' + product.subtitle);
      setRedeemedId(product.id);
      setSuccessMsg(`${product.actionLabel === 'Donate' ? 'Donated' : 'Redeemed'}: ${product.title} – ${product.subtitle}`);
      setTimeout(() => {
        setRedeemedId(null);
        setSuccessMsg('');
      }, 2500);
    }
  };

  return (
    <div className="space-y-4">
      {/* Points Balance Hero */}
      <Card className="bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 border-0 overflow-hidden relative">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-2 right-4 text-[80px] select-none">⭐</div>
        </div>
        <CardContent className="pt-6 pb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-11 w-11 rounded-full bg-white/20 flex items-center justify-center">
              <LevelIcon className={`h-6 w-6 text-white`} />
            </div>
            <div>
              <p className="text-white/80 text-xs">Your Level</p>
              <p className="text-white font-semibold">{level.name}</p>
            </div>
          </div>
          <p className="text-white/70 text-sm mb-1">Your Balance</p>
          <div className="flex items-end gap-2">
            <p className="text-5xl font-bold text-white leading-none">{totalPoints.toLocaleString()}</p>
            <p className="text-white/80 text-lg pb-0.5">Impact Points</p>
          </div>
          {nextMilestone && (
            <div className="mt-4">
              <div className="flex justify-between text-xs text-white/70 mb-1">
                <span>{totalPoints} pts</span>
                <span>{nextMilestone} pts to next level</span>
              </div>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all"
                  style={{ width: `${Math.min((totalPoints / nextMilestone) * 100, 100)}%` }}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Success Toast */}
      {successMsg && (
        <Card className="bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-emerald-900 dark:text-emerald-100">Success!</p>
                <p className="text-xs text-emerald-700 dark:text-emerald-300">{successMsg}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {(['all', 'donation', 'discount'] as FilterType[]).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
              filter === f
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-secondary text-muted-foreground'
            }`}
          >
            {f === 'all' ? 'All' : f === 'donation' ? '❤️ Donations' : '🏷️ Discounts'}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-base">Rewards Marketplace</h3>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Coins className="h-3.5 w-3.5" />
            <span>{totalPoints.toLocaleString()} pts available</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {filtered.map((product) => {
            const Icon = product.icon;
            const canAfford = totalPoints >= product.cost;
            const isRedeemed = redeemedId === product.id;

            return (
              <Card
                key={product.id}
                className={`overflow-hidden transition-all ${
                  isRedeemed ? 'ring-2 ring-emerald-400' : ''
                } ${!canAfford ? 'opacity-60' : ''}`}
              >
                <CardContent className="p-3 flex flex-col gap-2 h-full">
                  {/* Icon + Badge */}
                  <div className="flex items-start justify-between">
                    <div className={`h-10 w-10 rounded-xl ${product.iconBg} flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`h-5 w-5 ${product.iconColor}`} />
                    </div>
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full border ${product.badgeColor}`}>
                      {product.badge}
                    </span>
                  </div>

                  {/* Title */}
                  <div className="flex-1">
                    <p className="font-semibold text-sm leading-tight">{product.title}</p>
                    <p className="text-xs text-muted-foreground">{product.subtitle}</p>
                    <p className="text-xs text-muted-foreground mt-1 leading-snug">{product.description}</p>
                  </div>

                  {/* Cost + Button */}
                  <div className="space-y-2 mt-1">
                    <div className="flex items-center gap-1">
                      <Coins className="h-3.5 w-3.5 text-amber-500" />
                      <span className="text-xs font-bold text-amber-600">{product.cost} pts</span>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleRedeem(product)}
                      disabled={!canAfford || !!redeemedId}
                      className={`w-full h-8 text-xs ${
                        canAfford
                          ? product.type === 'donation'
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white'
                            : 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white'
                          : 'bg-secondary text-muted-foreground'
                      }`}
                    >
                      {isRedeemed ? (
                        <><CheckCircle2 className="h-3 w-3 mr-1" /> Done!</>
                      ) : canAfford ? (
                        product.actionLabel
                      ) : (
                        `Need ${product.cost - totalPoints} more pts`
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* How to earn */}
      <Card className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-amber-200 dark:border-amber-800">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Coins className="h-4 w-4 text-amber-600" />
            <CardTitle className="text-sm">How to Earn Impact Points</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-1.5">
          {[
            'Stay under your monthly budget goal',
            'Earn 1 point for every $10 saved',
            'Claim your points from the Home tab',
            'Spend them here on donations & discounts',
          ].map((tip, i) => (
            <div key={i} className="flex items-start gap-2">
              <div className="h-4 w-4 rounded-full bg-amber-200 dark:bg-amber-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-[9px] font-bold text-amber-800 dark:text-amber-200">{i + 1}</span>
              </div>
              <p className="text-xs text-amber-900 dark:text-amber-100">{tip}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
