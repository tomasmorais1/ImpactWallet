import { useMemo } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { Wallet } from 'lucide-react';

const BALANCE_KEY = 'impactWallet_accountBalance';

function readOrSeedAccountBalance(): number {
  const raw = localStorage.getItem(BALANCE_KEY);
  if (raw) {
    const n = parseFloat(raw);
    if (!Number.isNaN(n)) return n;
  }
  const seed = 4980.25;
  localStorage.setItem(BALANCE_KEY, String(seed));
  return seed;
}

interface FinanceSummaryHeaderProps {
  monthlyGoal: number;
  totalSpent: number;
  remainingBudget: number;
  percentageUsed: number;
}

export function FinanceSummaryHeader({
  monthlyGoal,
  totalSpent,
  remainingBudget,
  percentageUsed,
}: FinanceSummaryHeaderProps) {
  const { formatCurrency } = useSettings();
  const accountBalance = useMemo(() => readOrSeedAccountBalance(), []);
  const hasGoal = monthlyGoal > 0;
  const pctBar = Math.min(Math.max(percentageUsed, 0), 100);

  return (
    <div className="px-1 pb-2 pt-1 text-white">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-white/75">Finance</p>
          <h1 className="mt-0.5 text-lg font-bold tracking-tight">Overview</h1>
        </div>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
          <Wallet className="h-5 w-5 text-white" />
        </div>
      </div>

      <div className="mt-5 rounded-xl bg-black/15 px-4 py-3 backdrop-blur-sm">
        <p className="text-[11px] font-medium uppercase tracking-wide text-white/70">Saldo na conta</p>
        <p className="mt-0.5 text-2xl font-bold tabular-nums tracking-tight">{formatCurrency(accountBalance)}</p>
        <p className="mt-1 text-[11px] text-white/60">Valor de referência · liga o banco em Definições para sincronizar</p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-white/10 px-3 py-2.5 backdrop-blur-sm">
          <p className="text-[11px] font-medium text-white/75">Gasto este mês</p>
          <p className="mt-0.5 text-lg font-bold tabular-nums">{formatCurrency(totalSpent)}</p>
        </div>
        <div className="rounded-xl bg-white/10 px-3 py-2.5 backdrop-blur-sm">
          <p className="text-[11px] font-medium text-white/75">{hasGoal ? 'Disponível (orçamento)' : 'Orçamento'}</p>
          <p className="mt-0.5 text-lg font-bold tabular-nums">
            {hasGoal ? formatCurrency(Math.max(0, remainingBudget)) : '—'}
          </p>
        </div>
      </div>

      {hasGoal && (
        <div className="mt-4">
          <div className="flex justify-between text-[11px] text-white/80">
            <span>{percentageUsed.toFixed(0)}% do objetivo</span>
            <span className="tabular-nums">{formatCurrency(monthlyGoal)}</span>
          </div>
          <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-black/25">
            <div
              className="h-full rounded-full bg-white transition-all duration-500"
              style={{ width: `${pctBar}%` }}
            />
          </div>
        </div>
      )}

      {!hasGoal && (
        <p className="mt-3 text-center text-xs text-white/75">
          Define um objetivo mensal em Definições para veres quanto ainda podes gastar.
        </p>
      )}
    </div>
  );
}
