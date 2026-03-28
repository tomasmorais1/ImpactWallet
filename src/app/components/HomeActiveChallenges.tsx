import { ACTIVE_IMPACT_CHALLENGES, challengeProgressLabelPt, type ImpactChallenge } from '../lib/challenges';
import { cn } from './ui/utils';

function ChallengeCard({ challenge, className }: { challenge: ImpactChallenge; className?: string }) {
  const pct = Math.min(100, (challenge.progress / Math.max(challenge.target, 1)) * 100);

  return (
    <div
      className={cn(
        'flex w-[min(100%,11.5rem)] shrink-0 flex-col rounded-2xl border border-slate-200/90 bg-white p-3 shadow-sm dark:border-slate-700 dark:bg-slate-900/80',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-2xl leading-none" aria-hidden>
          {challenge.icon}
        </span>
        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-900 dark:bg-amber-950/60 dark:text-amber-200">
          +{challenge.rewardPoints} pts
        </span>
      </div>
      <p className="mt-2 text-sm font-bold leading-tight text-foreground">{challenge.title}</p>
      <p className="mt-1 line-clamp-2 text-[11px] leading-snug text-muted-foreground">{challenge.description}</p>
      <div className="mt-3">
        <div className="flex justify-between text-[10px] font-medium text-muted-foreground">
          <span>{challengeProgressLabelPt(challenge)}</span>
        </div>
        <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
          <div
            className="h-full rounded-full bg-slate-400 transition-all dark:bg-slate-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export function HomeActiveChallenges() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-md dark:border-slate-800/80 dark:bg-gradient-to-b dark:from-slate-900 dark:to-slate-950">
      <div className="px-4 pb-3 pt-4">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
          Desafios ativos
        </h2>
        <div className="mt-3 flex gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {ACTIVE_IMPACT_CHALLENGES.map((c) => (
            <ChallengeCard key={c.id} challenge={c} />
          ))}
        </div>
      </div>
    </div>
  );
}
