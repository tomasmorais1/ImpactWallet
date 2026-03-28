/** Challenges ativos na Home e referência no ecrã Conquistas. */

export type ChallengeUnit = 'days' | 'purchases';

export type ImpactChallenge = {
  id: string;
  title: string;
  description: string;
  rewardPoints: number;
  progress: number;
  target: number;
  unit: ChallengeUnit;
  icon: string;
};

export const ACTIVE_IMPACT_CHALLENGES: ImpactChallenge[] = [
  {
    id: 'noubereats-week',
    title: 'NoUberEats Week',
    description: 'Cook at home this week',
    rewardPoints: 10,
    progress: 0,
    target: 7,
    unit: 'days',
    icon: '🥡',
  },
  {
    id: 'eco-shop-partner',
    title: 'Eco-Shop Partner',
    description: 'Shop at an eco-store partner',
    rewardPoints: 15,
    progress: 0,
    target: 1,
    unit: 'purchases',
    icon: '🌿',
  },
];

export function challengeProgressLabel(c: ImpactChallenge): string {
  const u = c.unit === 'days' ? 'days' : 'purchases';
  return `${c.progress}/${c.target} ${u}`;
}

export function challengeProgressLabelPt(c: ImpactChallenge): string {
  const u = c.unit === 'days' ? 'dias' : 'compras';
  return `${c.progress}/${c.target} ${u}`;
}
