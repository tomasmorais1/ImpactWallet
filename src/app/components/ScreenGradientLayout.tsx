import type { ReactNode } from 'react';
import { cn } from './ui/utils';

export type ScreenGradientVariant = 'default' | 'tall' | 'profile';

const VARIANT_HEIGHT: Record<ScreenGradientVariant, string> = {
  /** Home */
  default: 'min-h-[min(52vh,520px)]',
  /** Finance — banda um pouco mais longa */
  tall: 'min-h-[min(62vh,620px)]',
  /** Perfil — cobre hero + Standard / Convidar amigos (texto legível sobre o gradiente) */
  profile: 'min-h-[min(78vh,820px)]',
};

/**
 * Revolut-style top band: bluish greens → white (light) or deep blue-grey (dark).
 * Não usar `min-h-full` no wrapper — evita empurrar a barra inferior para fora do ecrã no flex.
 */
export function ScreenGradientLayout({
  children,
  className,
  variant = 'default',
}: {
  children: ReactNode;
  className?: string;
  variant?: ScreenGradientVariant;
}) {
  return (
    <div className={cn('relative', className)}>
      <div
        aria-hidden
        className={cn(
          'pointer-events-none absolute inset-x-0 top-0 z-0',
          VARIANT_HEIGHT[variant],
          'bg-gradient-to-b from-teal-500 via-emerald-500 to-background',
          'dark:from-teal-950 dark:via-emerald-950 dark:via-cyan-950/50 dark:to-slate-950',
        )}
      />
      <div className="relative z-[1]">{children}</div>
    </div>
  );
}
