import { Award, Lock } from 'lucide-react';
import { ScreenGradientLayout } from './ScreenGradientLayout';
import {
  ACTIVE_IMPACT_CHALLENGES,
  challengeProgressLabelPt,
  type ImpactChallenge,
} from '../lib/challenges';
import { cn } from './ui/utils';
import impactPointsLogo from '../assets/impact-points-logo.png';

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

function MissionCard({ challenge }: { challenge: ImpactChallenge }) {
  const pct = Math.min(100, (challenge.progress / Math.max(challenge.target, 1)) * 100);

  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="flex gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-muted text-2xl">
          {challenge.icon}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-sm font-bold leading-tight text-foreground">{challenge.title}</h4>
            <span className="shrink-0 rounded-full bg-emerald-600 px-2.5 py-0.5 text-[11px] font-bold text-white dark:bg-emerald-500">
              +{challenge.rewardPoints} pts
            </span>
          </div>
          <p className="mt-1 text-xs leading-snug text-muted-foreground">{challenge.description}</p>
          <div className="relative mt-3">
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all dark:bg-emerald-400"
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="mt-1.5 text-right text-[11px] font-medium tabular-nums text-muted-foreground">
              {challengeProgressLabelPt(challenge)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function HeroAchievementCard({
  achievement,
}: {
  achievement: Achievement;
}) {
  const hasProgress =
    achievement.maxProgress != null && achievement.maxProgress > 0 && !achievement.unlocked;
  const pct = hasProgress
    ? Math.min(100, ((achievement.progress ?? 0) / achievement.maxProgress!) * 100)
    : 0;
  const locked = !achievement.unlocked && !hasProgress;

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border bg-card p-4 shadow-sm transition-all',
        achievement.unlocked &&
          'border-amber-400/60 bg-gradient-to-br from-amber-50/90 to-white ring-1 ring-amber-200/80 dark:from-amber-950/40 dark:to-card dark:ring-amber-800/50',
        hasProgress && 'border-border',
        locked && 'border-dashed border-muted-foreground/25 opacity-[0.72]',
      )}
    >
      <div className="flex gap-3">
        <div
          className={cn(
            'relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-muted text-2xl',
            locked && 'grayscale',
          )}
        >
          {achievement.icon}
          {locked && (
            <span className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-background shadow ring-1 ring-border">
              <Lock className="h-2.5 w-2.5 text-muted-foreground" strokeWidth={2.5} />
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h4
              className={cn(
                'text-sm font-bold leading-tight',
                locked ? 'text-muted-foreground' : 'text-foreground',
              )}
            >
              {achievement.title}
            </h4>
            <span
              className={cn(
                'shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-bold',
                achievement.unlocked
                  ? 'bg-emerald-600 text-white dark:bg-emerald-500'
                  : locked
                    ? 'bg-muted text-muted-foreground'
                    : 'bg-emerald-600/90 text-white dark:bg-emerald-500',
              )}
            >
              +{achievement.points} pts
            </span>
          </div>
          <p className="mt-1 text-xs leading-snug text-muted-foreground">{achievement.description}</p>

          {achievement.unlocked && (
            <p className="mt-3 text-right text-[11px] font-bold uppercase tracking-wide text-amber-600 dark:text-amber-400">
              Desbloqueado
            </p>
          )}

          {hasProgress && (
            <div className="mt-3">
              <div className="flex justify-between text-[11px] text-muted-foreground">
                <span>Progresso</span>
                <span className="tabular-nums">
                  {achievement.progress ?? 0}/{achievement.maxProgress}
                </span>
              </div>
              <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-emerald-500 dark:bg-emerald-400"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          )}

          {locked && (
            <p className="mt-3 text-right text-[11px] font-medium text-muted-foreground">Bloqueado</p>
          )}
        </div>
      </div>
    </div>
  );
}

export function Achievements({ totalPoints, totalSaved, friendCount }: AchievementsProps) {
  const achievements: Achievement[] = [
    {
      id: 'first-save',
      title: 'Primeiros passos',
      description: 'Completa o primeiro mês dentro do orçamento',
      icon: '🎯',
      unlocked: totalSaved > 0,
      rarity: 'common',
      points: 10,
      unlockedDate: totalSaved > 0 ? '2026-03-01' : undefined,
    },
    {
      id: 'point-collector',
      title: 'Colecionador de pontos',
      description: 'Atinge 100 Impact Points',
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
      title: 'Mestre do orçamento',
      description: 'Mantém-te dentro do orçamento 3 meses seguidos',
      icon: '🏅',
      unlocked: false,
      progress: 1,
      maxProgress: 3,
      rarity: 'epic',
      points: 50,
    },
    {
      id: 'social-butterfly',
      title: 'Borboleta social',
      description: 'Adiciona 5 amigos à tua rede',
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
      title: 'Alma generosa',
      description: 'Faz a primeira doação na Store',
      icon: '❤️',
      unlocked: false,
      rarity: 'rare',
      points: 20,
    },
    {
      id: 'point-trader',
      title: 'Trocador de pontos',
      description: 'Envia pontos a um amigo',
      icon: '🤝',
      unlocked: false,
      rarity: 'common',
      points: 15,
    },
    {
      id: 'mega-saver',
      title: 'Super poupador',
      description: 'Atinge 500 impact points',
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
      title: 'Clube dos mil',
      description: 'Atinge 1000 impact points',
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
      title: 'Influenciador',
      description: 'Ajuda 3 amigos a atingir os objetivos',
      icon: '🌟',
      unlocked: false,
      progress: 0,
      maxProgress: 3,
      rarity: 'epic',
      points: 75,
    },
    {
      id: 'streak-master',
      title: 'Mestre da consistência',
      description: 'Inicia sessão 30 dias seguidos',
      icon: '🔥',
      unlocked: false,
      progress: 12,
      maxProgress: 30,
      rarity: 'epic',
      points: 60,
    },
  ];

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const missionsActive = ACTIVE_IMPACT_CHALLENGES.filter((c) => c.progress < c.target).length;

  return (
    <ScreenGradientLayout>
      <div className="flex flex-col">
        {/* Topo — mesmo tipo de banda verde que o Home (gradiente via ScreenGradientLayout) */}
        <div className="relative px-4 pb-8 pt-10 text-white">
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute -left-10 bottom-0 h-40 w-40 rounded-full bg-emerald-400/15 blur-2xl dark:bg-teal-400/10" />

          <div className="relative flex items-center justify-center gap-3">
            <img
              src={impactPointsLogo}
              alt=""
              className="h-11 w-11 shrink-0 object-contain drop-shadow-[0_1px_2px_rgba(0,0,0,0.25)]"
            />
            <span className="text-[2.75rem] font-bold leading-none tabular-nums tracking-tight drop-shadow-sm">
              {totalPoints.toLocaleString('pt-PT')}
            </span>
          </div>
          <p className="relative mt-5 text-center text-sm font-medium text-white/95">
            A tua jornada:{' '}
            <span className="font-bold">
              {unlockedCount} {unlockedCount === 1 ? 'conquista desbloqueada' : 'conquistas desbloqueadas'}
            </span>
          </p>
          <p className="relative mt-1.5 text-center text-xs text-white/80">
            {missionsActive}{' '}
            {missionsActive === 1 ? 'missão semanal em progresso' : 'missões semanais em progresso'}.
          </p>
        </div>

        <div className="-mt-4 space-y-8 rounded-t-[1.75rem] bg-background px-4 pb-8 pt-6">
          <section>
            <h2 className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
              Missões semanais personalizadas
            </h2>
            <div className="mt-4 space-y-3">
              {ACTIVE_IMPACT_CHALLENGES.map((c) => (
                <MissionCard key={c.id} challenge={c} />
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-start gap-2">
              <Award className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <div>
                <h2 className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                  Conquistas
                </h2>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                  Desbloqueia marcos permanentes e ganha recompensas especiais no teu saldo.
                </p>
              </div>
            </div>
            <div className="mt-4 space-y-3">
              {achievements.map((a) => (
                <HeroAchievementCard key={a.id} achievement={a} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </ScreenGradientLayout>
  );
}
