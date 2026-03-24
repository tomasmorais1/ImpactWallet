import type { Expense } from '../App';

export function buildCumulativeByDay(
  expenses: Expense[],
  year: number,
  month: number,
): { cumulative: number[]; daysInMonth: number; currentDay: number } {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  const isThisMonth = today.getMonth() === month && today.getFullYear() === year;
  const currentDay = isThisMonth ? today.getDate() : daysInMonth;

  const byDay: Record<number, number> = {};
  for (const e of expenses) {
    const d = new Date(e.date);
    if (d.getMonth() !== month || d.getFullYear() !== year) continue;
    const day = d.getDate();
    byDay[day] = (byDay[day] || 0) + e.amount;
  }

  const cumulative: number[] = [];
  let sum = 0;
  for (let day = 1; day <= daysInMonth; day++) {
    sum += byDay[day] || 0;
    cumulative[day] = sum;
  }

  return { cumulative, daysInMonth, currentDay };
}

export function lastMonthTotal(expenses: Expense[], year: number, month: number): number {
  const d = new Date(year, month - 1, 1);
  const m = d.getMonth();
  const y = d.getFullYear();
  return expenses
    .filter((e) => {
      const x = new Date(e.date);
      return x.getMonth() === m && x.getFullYear() === y;
    })
    .reduce((s, e) => s + e.amount, 0);
}
