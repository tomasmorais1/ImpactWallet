import { useCallback, useMemo, useRef, useState } from 'react';
import { Heart, Leaf, PiggyBank, Coffee } from 'lucide-react';
import type { Expense } from '../App';
import { useSettings } from '../contexts/SettingsContext';
import { buildImpactSnapshot, type ImpactSnapshot } from '../lib/impactHomeStats';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from './ui/sheet';
import { cn } from './ui/utils';

const CARD_PX = 172;

function coffeeTitle(
  snapshot: ImpactSnapshot,
  formatCurrency: (n: number) => string,
  t: ReturnType<typeof useSettings>['t']
) {
  if (!snapshot.hasCoffeeData) {
    return `${t.saved} ${formatCurrency(34)} ${t.inCoffeeThisMonth}`;
  }

  const { coffeeThisMonth, coffeeAvg3m } = snapshot;
  const saved = Math.max(0, coffeeAvg3m - coffeeThisMonth);

  if (coffeeAvg3m > 0 && saved > 0) {
    return `${t.saved} ${formatCurrency(saved)} ${t.inCoffeeThisMonth}`;
  }

  return `${t.thisMonthLabel}: ${formatCurrency(coffeeThisMonth)} ${t.inCoffee}`;
}

function coffeeSubtitle(
  snapshot: ImpactSnapshot,
  formatCurrency: (n: number) => string,
  t: ReturnType<typeof useSettings>['t']
) {
  if (!snapshot.hasCoffeeData) {
    return t.vsAverageLast3Months;
  }

  return `${t.vsAverageLast3Months} (${formatCurrency(snapshot.coffeeAvg3m)})`;
}

interface ImpactSnapshotSectionProps {
  expenses: Expense[];
}

export function ImpactSnapshotSection({ expenses }: ImpactSnapshotSectionProps) {
  const { formatCurrency, t } = useSettings();
  const snapshot = useMemo(() => buildImpactSnapshot(expenses), [expenses]);
  const [open, setOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const orgLine = useMemo(
    () => snapshot.institutions.map((o) => o.name).join(' · '),
    [snapshot.institutions],
  );

  const cards = useMemo(() => {
    return [
      {
        key: 'donations',
        icon: Heart,
        accent: 'from-rose-500/15 to-amber-500/10',
        title: `${formatCurrency(snapshot.donationsTotal)} ${t.donatedToCausesYouChose}`,
        subtitle: orgLine,
      },
      {
        key: 'savings',
        icon: PiggyBank,
        accent: 'from-emerald-500/15 to-teal-500/10',
        title: `${formatCurrency(snapshot.savingsVsNoBudget)} ${t.savedOnUnnecessaryExpenses}`,
        subtitle: t.vsMonthsWithoutBudget,
      },
      {
        key: 'coffee',
        icon: Coffee,
        accent: 'from-amber-500/15 to-orange-500/10',
        title: coffeeTitle(snapshot, formatCurrency, t),
        subtitle: coffeeSubtitle(snapshot, formatCurrency, t),
      },
    ];
  }, [snapshot, formatCurrency, orgLine, t]);

  const onScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const i = Math.round(el.scrollTop / CARD_PX);
    setActive(Math.max(0, Math.min(i, cards.length - 1)));
  }, [cards.length]);

  return (
    <>
      <div className="space-y-2">
        <div className="flex items-end justify-between gap-2 px-0.5">
          <div>
            <h2 className="text-sm font-semibold tracking-tight text-foreground">{t.impact}</h2>
            <p className="text-xs text-muted-foreground">{t.swipeUpToSeeMore}</p>
          </div>
          <Leaf className="h-4 w-4 shrink-0 text-emerald-600 opacity-80" aria-hidden />
        </div>

        <div
          ref={scrollRef}
          onScroll={onScroll}
          className="max-h-[172px] snap-y snap-mandatory overflow-y-auto overscroll-y-contain rounded-2xl border border-emerald-200/60 bg-muted/20 shadow-sm [scrollbar-width:none] [-ms-overflow-style:none] dark:border-emerald-900/60 [&::-webkit-scrollbar]:hidden"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {cards.map((card) => {
            const Icon = card.icon;

            return (
              <button
                key={card.key}
                type="button"
                onClick={() => setOpen(true)}
                className={cn(
                  'flex min-h-[172px] w-full snap-start flex-col items-start justify-center gap-2 border-b border-emerald-100/80 bg-gradient-to-br px-4 py-3 text-left last:border-b-0 dark:border-emerald-900/40',
                  card.accent,
                )}
              >
                <div className="flex w-full items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/80 text-emerald-700 shadow-sm dark:bg-slate-900/80 dark:text-emerald-400">
                    <Icon className="h-5 w-5" strokeWidth={2} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[15px] font-semibold leading-snug text-foreground">{card.title}</p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{card.subtitle}</p>
                  </div>
                </div>

                <p className="w-full text-center text-[11px] font-medium text-emerald-700/90 dark:text-emerald-400/90">
                  {t.viewFullStats}
                </p>
              </button>
            );
          })}
        </div>

        <div className="flex justify-center gap-1.5 pt-0.5" aria-hidden>
          {cards.map((c, i) => (
            <span
              key={c.key}
              className={cn(
                'h-1.5 rounded-full transition-all',
                i === active ? 'w-7 bg-emerald-600' : 'w-1.5 bg-muted-foreground/35',
              )}
            />
          ))}
        </div>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="bottom"
          className="max-h-[92vh] overflow-y-auto rounded-t-2xl px-4 pb-8 pt-2 sm:mx-auto sm:max-w-md"
        >
          <SheetHeader className="pb-2 text-left">
            <SheetTitle className="text-lg">{t.yourImpact}</SheetTitle>
            <SheetDescription>{t.impactSummaryDescription}</SheetDescription>
          </SheetHeader>

          <div className="space-y-4 pb-2">
            <section className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-3 dark:border-emerald-900 dark:bg-emerald-950/30">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800 dark:text-emerald-200">
                {t.donations}
              </p>
              <p className="mt-1 text-lg font-bold tabular-nums text-emerald-900 dark:text-emerald-100">
                {formatCurrency(snapshot.donationsTotal)}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{orgLine}</p>
            </section>

            <section className="rounded-xl border border-slate-200/80 bg-slate-50/80 p-3 dark:border-slate-800 dark:bg-slate-900/40">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {t.estimatedSavings}
              </p>
              <p className="mt-1 text-lg font-bold tabular-nums">
                {formatCurrency(snapshot.savingsVsNoBudget)}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{t.vsMonthsWithoutBudget}</p>
            </section>

            <section className="rounded-xl border border-amber-100 bg-amber-50/50 p-3 dark:border-amber-900/50 dark:bg-amber-950/20">
              <p className="text-xs font-semibold uppercase tracking-wide text-amber-900 dark:text-amber-200">
                {t.coffees}
              </p>
              <p className="mt-1 text-sm text-foreground">{coffeeTitle(snapshot, formatCurrency, t)}</p>
              <p className="mt-1 text-sm text-muted-foreground">{coffeeSubtitle(snapshot, formatCurrency, t)}</p>
            </section>

            <section>
              <h3 className="text-sm font-semibold text-foreground">{t.supportedOrganizations}</h3>
              <ul className="mt-3 space-y-3">
                {snapshot.institutions.map((org) => (
                  <li
                    key={org.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-card px-3 py-2.5 dark:border-slate-800"
                  >
                    <div className="flex min-w-0 items-center gap-2.5">
                      <span className="text-xl" aria-hidden>
                        {org.emoji}
                      </span>
                      <div className="min-w-0">
                        <p className="font-medium leading-tight">{org.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {org.donationCount} {t.donationsCount} · {formatCurrency(org.totalAmount)} {t.total}
                        </p>
                      </div>
                    </div>
                    <span className="shrink-0 text-sm font-semibold tabular-nums text-emerald-700 dark:text-emerald-400">
                      {formatCurrency(org.totalAmount)}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}