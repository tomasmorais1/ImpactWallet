import { Plus, ArrowLeftRight, Landmark, Trophy } from 'lucide-react';
import impactPointsLogo from '../assets/impact-points-logo.png';
import { useSettings } from '../contexts/SettingsContext';

interface PointsDisplayProps {
  totalPoints: number;
  onAddPoints: () => void;
  onMove: () => void;
  onData: () => void;
  onAchievements: () => void;
}

export function PointsDisplay({
  totalPoints,
  onAddPoints,
  onMove,
  onData,
  onAchievements,
}: PointsDisplayProps) {
  const { t } = useSettings();

  const actions = [
    { label: t.addPoints, icon: Plus, onClick: onAddPoints },
    { label: t.move, icon: ArrowLeftRight, onClick: onMove },
    { label: t.data, icon: Landmark, onClick: onData },
    { label: t.achievements, icon: Trophy, onClick: onAchievements },
  ] as const;

  return (
    <div className="relative px-4 pb-7 pt-12 text-white">
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
      <div className="pointer-events-none absolute -left-10 bottom-0 h-40 w-40 rounded-full bg-emerald-400/15 blur-2xl dark:bg-teal-400/10" />

      <p className="relative text-center text-sm font-medium text-white/90 drop-shadow-sm">
        {t.impactPoints}
      </p>

      <div className="relative mt-6 flex items-center justify-center gap-3">
        <img
          src={impactPointsLogo}
          alt={t.impactPointsLogoAlt}
          className="h-[3.25rem] w-[3.25rem] shrink-0 object-contain drop-shadow-[0_1px_2px_rgba(0,0,0,0.25)]"
        />
        <span className="text-[3.25rem] font-bold leading-none tracking-tight tabular-nums">
          {totalPoints.toLocaleString()}
        </span>
      </div>

      <div className="relative mt-7 flex justify-center gap-1 px-0.5 sm:gap-1.5">
        {actions.map(({ label, icon: Icon, onClick }) => (
          <button
            key={label}
            type="button"
            onClick={onClick}
            className="group flex min-w-0 max-w-[24%] flex-1 flex-col items-center gap-1.5 rounded-xl py-0.5 transition active:scale-[0.98] hover:opacity-[0.97]"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/30 bg-white/[0.18] shadow-[inset_0_1px_0_rgba(255,255,255,0.22)] backdrop-blur-[2px] sm:h-11 sm:w-11">
              <Icon className="h-[17px] w-[17px] text-white sm:h-[18px] sm:w-[18px]" strokeWidth={2.25} />
            </span>
            <span className="w-full max-w-[5.25rem] px-0.5 text-center text-[11px] font-semibold leading-[1.2] tracking-wide text-white drop-shadow-sm sm:text-xs sm:leading-snug">
              {label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}