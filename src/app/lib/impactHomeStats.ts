import type { Expense } from '../App';

export type SupportedInstitution = {
  id: string;
  emoji: string;
  name: string;
  donationCount: number;
  totalAmount: number;
};

export type ImpactSnapshot = {
  donationsTotal: number;
  institutions: SupportedInstitution[];
  savingsVsNoBudget: number;
  coffeeThisMonth: number;
  coffeeAvg3m: number;
  hasCoffeeData: boolean;
};

function isCoffeeExpense(e: Expense): boolean {
  if (e.category !== 'food') return false;
  const d = e.description.toLowerCase();
  return /coffee|café|cafe|starbucks|nespresso|expresso|espresso/.test(d);
}

function sumCoffeeInMonth(expenses: Expense[], year: number, month: number): number {
  return expenses
    .filter((e) => {
      const x = new Date(e.date);
      return x.getFullYear() === year && x.getMonth() === month && isCoffeeExpense(e);
    })
    .reduce((s, e) => s + e.amount, 0);
}

/** Snapshot for home impact cards + detail sheet (mix of demo org data + expense-derived coffee). */
export function buildImpactSnapshot(expenses: Expense[]): ImpactSnapshot {
  const now = new Date();
  const cy = now.getFullYear();
  const cm = now.getMonth();

  const thisCoffee = sumCoffeeInMonth(expenses, cy, cm);

  const prevMonths: { y: number; m: number }[] = [];
  for (let i = 1; i <= 3; i++) {
    const d = new Date(cy, cm - i, 1);
    prevMonths.push({ y: d.getFullYear(), m: d.getMonth() });
  }

  const coffeePast = prevMonths.map(({ y, m }) => sumCoffeeInMonth(expenses, y, m));
  const hasAnyCoffeeHistory = coffeePast.some((x) => x > 0) || thisCoffee > 0;
  const coffeeAvg =
    coffeePast.length > 0 ? coffeePast.reduce((a, b) => a + b, 0) / coffeePast.length : 0;

  const institutions: SupportedInstitution[] = [
    { id: 'wwf', emoji: '🌿', name: 'WWF', donationCount: 3, totalAmount: 9 },
    { id: 'stc', emoji: '❤️', name: 'Save the Children', donationCount: 5, totalAmount: 15 },
    { id: 'cv', emoji: '🩹', name: 'Cruz Vermelha', donationCount: 2, totalAmount: 10 },
  ];

  const donationsTotal = institutions.reduce((s, x) => s + x.totalAmount, 0);

  const savingsVsNoBudget = 180;

  return {
    donationsTotal,
    institutions,
    savingsVsNoBudget,
    coffeeThisMonth: thisCoffee,
    coffeeAvg3m: coffeeAvg,
    hasCoffeeData: hasAnyCoffeeHistory,
  };
}
