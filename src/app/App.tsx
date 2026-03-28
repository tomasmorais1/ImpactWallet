import { useEffect, useMemo, useState } from 'react';
import { PointsDisplay } from './components/PointsDisplay';
import { ScreenGradientLayout } from './components/ScreenGradientLayout';
import { HomeBudgetPanel } from './components/HomeBudgetPanel';
import { ImpactSnapshotSection } from './components/ImpactSnapshotSection';
import { FinanceScreen } from './components/FinanceScreen';
import { RecentTransactions } from './components/RecentTransactions';
import {
  Store,
  type GroupDonationVotePayload,
  type StoreGroupOption,
} from './components/Store';
import { ProfileScreen } from './components/ProfileScreen';
import { Login } from './components/Login';
import { Friends } from './components/Friends';
import { SettingsProvider, useSettings } from './contexts/SettingsContext';
import { Home, ShoppingBag, Wallet, Users, User, ArrowLeft } from 'lucide-react';
import { Card, CardContent } from './components/ui/card';
import { toast } from 'sonner';
import { Toaster } from './components/ui/sonner';
import { getBudgetTierInfo, IMPACT_POINTS_CLAIM_KEY } from './lib/impactPoints';

export interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
}

interface PendingGroupVote extends GroupDonationVotePayload {
  id: string;
  createdAt: string;
}

function BudgetTracker({
  monthlyGoal,
  totalSpent,
  remainingBudget,
  percentageUsed,
}: {
  monthlyGoal: number;
  totalSpent: number;
  remainingBudget: number;
  percentageUsed: number;
}) {
  const { formatCurrency, t } = useSettings();
  const isOverBudget = remainingBudget < 0;
  const clampedPct = Math.min(percentageUsed, 100);
  const barColor =
    percentageUsed > 90 ? '#ef4444' : percentageUsed > 70 ? '#f97316' : '#10b981';

  return (
    <Card className="mx-4 -mt-5 overflow-hidden border-0 shadow-xl">
      <CardContent className="p-4">
        <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {t.budgetTracker} · {t.thisMonth}
        </p>

        <div className="mb-4 grid grid-cols-3 gap-2">
          <div className="rounded-xl bg-secondary/50 p-3 text-center">
            <p className="mb-1 text-[10px] uppercase tracking-wide text-muted-foreground">
              {t.goal}
            </p>
            <p className="text-base font-bold leading-tight">
              {monthlyGoal > 0 ? formatCurrency(monthlyGoal) : '—'}
            </p>
          </div>

          <div className="rounded-xl bg-secondary/50 p-3 text-center">
            <p className="mb-1 text-[10px] uppercase tracking-wide text-muted-foreground">
              {t.spent}
            </p>
            <p className={`text-base font-bold leading-tight ${isOverBudget ? 'text-red-500' : ''}`}>
              {formatCurrency(totalSpent)}
            </p>
          </div>

          <div
            className={`rounded-xl p-3 text-center ${
              isOverBudget
                ? 'bg-red-50 dark:bg-red-950/30'
                : 'bg-emerald-50 dark:bg-emerald-950/30'
            }`}
          >
            <p className="mb-1 text-[10px] uppercase tracking-wide text-muted-foreground">
              {t.left}
            </p>
            <p
              className={`text-base font-bold leading-tight ${
                isOverBudget ? 'text-red-500' : 'text-emerald-600'
              }`}
            >
              {monthlyGoal > 0 ? formatCurrency(Math.abs(remainingBudget)) : '—'}
            </p>
          </div>
        </div>

        {monthlyGoal > 0 && (
          <div>
            <div className="mb-1.5 flex justify-between text-[10px] text-muted-foreground">
              <span>
                {percentageUsed.toFixed(0)}% {t.used}
              </span>
              <span>
                {isOverBudget
                  ? t.overBudget
                  : `${(100 - percentageUsed).toFixed(0)}% ${t.remaining}`}
              </span>
            </div>

            <div className="h-2.5 overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${clampedPct}%`, backgroundColor: barColor }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function AppContent() {
  const { t } = useSettings();
  const [activeTab, setActiveTab] = useState('home');

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });

  const [userEmail, setUserEmail] = useState(() => {
    return localStorage.getItem('userEmail') || '';
  });

  const [monthlyGoal, setMonthlyGoal] = useState<number>(() => {
    const saved = localStorage.getItem('monthlyGoal');
    return saved ? parseFloat(saved) : 0;
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem('expenses');
    return saved ? JSON.parse(saved) : [];
  });

  const [totalPoints, setTotalPoints] = useState<number>(() => {
    const saved = localStorage.getItem('totalPoints');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [claimedImpactMonth, setClaimedImpactMonth] = useState(() => {
    return localStorage.getItem(IMPACT_POINTS_CLAIM_KEY) || '';
  });

  const [pendingGroupVotes, setPendingGroupVotes] = useState<PendingGroupVote[]>([]);

  useEffect(() => {
    localStorage.setItem('monthlyGoal', monthlyGoal.toString());
  }, [monthlyGoal]);

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('totalPoints', totalPoints.toString());
  }, [totalPoints]);

  useEffect(() => {
    localStorage.setItem('isAuthenticated', isAuthenticated.toString());
    localStorage.setItem('userEmail', userEmail);
  }, [isAuthenticated, userEmail]);

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const thisMonthExpenses = expenses.filter((expense) => {
    const d = new Date(expense.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const totalSpent = thisMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
  const remainingBudget = monthlyGoal - totalSpent;
  const percentageUsed = monthlyGoal > 0 ? (totalSpent / monthlyGoal) * 100 : 0;
  const budgetTier = getBudgetTierInfo(percentageUsed);
  const potentialPoints = monthlyGoal > 0 ? budgetTier.points : 0;
  const monthClaimKey = `${currentYear}-${currentMonth}`;
  const claimedThisMonth = claimedImpactMonth === monthClaimKey;
  const canClaimImpactPoints = monthlyGoal > 0 && potentialPoints > 0 && !claimedThisMonth;

  const adminGroups: StoreGroupOption[] = useMemo(
    () => [
      { id: 'group-1', name: 'Close Friends' },
      { id: 'group-2', name: 'Family Circle' },
    ],
    []
  );

  const isGroupAdmin = adminGroups.length > 0;

  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  const syncTransactions = () => {
    const mock: Omit<Expense, 'id'>[] = [
      {
        description: 'Starbucks Coffee',
        amount: 5.75,
        date: new Date().toISOString(),
        category: 'food',
      },
      {
        description: 'Uber Ride',
        amount: 12.5,
        date: new Date(Date.now() - 86400000).toISOString(),
        category: 'transport',
      },
      {
        description: 'Amazon Purchase',
        amount: 34.99,
        date: new Date(Date.now() - 172800000).toISOString(),
        category: 'shopping',
      },
      {
        description: 'Grocery Store',
        amount: 67.32,
        date: new Date(Date.now() - 259200000).toISOString(),
        category: 'food',
      },
      {
        description: 'Netflix Subscription',
        amount: 15.99,
        date: new Date(Date.now() - 345600000).toISOString(),
        category: 'entertainment',
      },
    ];

    setExpenses((prev) => [
      ...prev,
      ...mock.map((tx) => ({
        ...tx,
        id: `${Date.now()}-${Math.random()}`,
      })),
    ]);
  };

  const claimPoints = () => {
    if (!canClaimImpactPoints) return;

    setTotalPoints((prev) => prev + potentialPoints);
    localStorage.setItem(IMPACT_POINTS_CLAIM_KEY, monthClaimKey);
    setClaimedImpactMonth(monthClaimKey);
    toast.success(`+${potentialPoints} ${t.impactPointsClaimed}`);
  };

  const handleRedeem = (cost: number, _label: string) => {
  setTotalPoints((prev) => Math.max(0, prev - cost));
};
const handleBuyPoints = (points: number, euroAmount: number) => {
  setTotalPoints((prev) => prev + points);
  toast.success(`${points} pontos comprados por ${euroAmount.toFixed(2)}€`);
};
  const handleLogin = (email: string) => {
    setUserEmail(email);
    setIsAuthenticated(true);
    toast.success(`${t.welcomeBackSignedIn} ${email}`);
  };

  const handleSendPoints = (_friendId: string, amount: number) => {
    if (amount <= totalPoints) {
      setTotalPoints((prev) => prev - amount);
      toast.success(`${amount} ${t.successfullySentPoints}`);
    } else {
      toast.error(t.notEnoughPoints);
    }
  };

  const handleRequestPoints = (_friendId: string, _amount: number) => {
    toast.success(t.pointRequestSent);
  };

  const handleCreateGroupDonationVote = (payload: GroupDonationVotePayload) => {
    const newVote: PendingGroupVote = {
      ...payload,
      id: `vote-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    setPendingGroupVotes((prev) => [newVote, ...prev]);

    toast.success(
      `${t.groupVoteCreatedFor} ${payload.ngoName} ${t.inGroup} ${
        adminGroups.find((group) => group.id === payload.groupId)?.name ?? t.groupFallback
      }`
    );
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  const navItems = [
    { id: 'home', label: t.home, icon: Home },
    { id: 'social', label: t.social, icon: Users },
    { id: 'finance', label: t.finance, icon: Wallet },
    { id: 'store', label: t.store, icon: ShoppingBag },
    { id: 'profile', label: t.profile, icon: User },
  ];

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-background">
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto pb-[calc(5rem+env(safe-area-inset-bottom))] pt-[max(0.75rem,env(safe-area-inset-top))]">
        {activeTab === 'home' && (
          <ScreenGradientLayout>
            <div className="space-y-4">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setActiveTab('profile')}
                  className="absolute left-4 top-[max(0.85rem,calc(env(safe-area-inset-top)+0.35rem))] z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/45 bg-white/20 text-white shadow-md backdrop-blur-md transition hover:bg-white/30"
                  aria-label={t.profile}
                >
                  <User className="h-5 w-5" strokeWidth={2} />
                </button>

                <PointsDisplay
                  totalPoints={totalPoints}
                  onAddPoints={() => setActiveTab('profile')}
                  onMove={() => setActiveTab('social')}
                  onData={() => setActiveTab('finance')}
                  onAchievements={() => setActiveTab('premium')}
                />
              </div>

              <div className="space-y-4 px-4 pb-6">
                <HomeBudgetPanel
                  expenses={expenses}
                  monthlyGoal={monthlyGoal}
                  totalSpent={totalSpent}
                  remainingBudget={remainingBudget}
                  percentageUsed={percentageUsed}
                />

                <ImpactSnapshotSection expenses={expenses} />

                <RecentTransactions
                  expenses={thisMonthExpenses}
                  onSeeAll={() => setActiveTab('finance')}
                />
              </div>
            </div>
          </ScreenGradientLayout>
        )}

        {activeTab === 'premium' && (
          <div className="space-y-4 px-4 pb-6 pt-4">
            <Card className="relative overflow-hidden border-0 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 text-white shadow-lg">
              <button
                type="button"
                onClick={() => setActiveTab('home')}
                className="absolute left-4 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/15 text-white backdrop-blur-sm transition hover:bg-white/20"
                aria-label={t.backToHome}
              >
                <ArrowLeft className="h-5 w-5" />
              </button>

              <CardContent className="px-6 pb-6 pt-16 text-center">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                  <span className="text-2xl">✨</span>
                </div>

                <h2 className="mb-2 text-2xl font-bold">{t.premiumTitle}</h2>
                <p className="text-sm text-white/90">{t.premiumSubtitle}</p>
              </CardContent>
            </Card>

            <Card className="border-border/80 shadow-sm">
              <CardContent className="space-y-3 p-5">
                <div className="flex items-start gap-3">
                  <span className="text-emerald-600">✅</span>
                  <p className="text-sm font-medium">{t.premiumBenefit1}</p>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-emerald-600">✅</span>
                  <p className="text-sm font-medium">{t.premiumBenefit2}</p>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-emerald-600">✅</span>
                  <p className="text-sm font-medium">{t.premiumBenefit3}</p>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-emerald-600">✅</span>
                  <p className="text-sm font-medium">{t.premiumBenefit4}</p>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-emerald-600">✅</span>
                  <p className="text-sm font-medium">{t.premiumBenefit5}</p>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-emerald-600">✅</span>
                  <p className="text-sm font-medium">{t.premiumBenefit6}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/80 shadow-sm">
              <CardContent className="space-y-4 p-6 text-center">
                <div>
                  <p className="text-sm text-muted-foreground">{t.monthlyPlan}</p>
                  <p className="mt-1 text-4xl font-bold tracking-tight">2,99€</p>
                  <p className="mt-1 text-sm text-muted-foreground">{t.perMonth}</p>
                </div>

                <button
                  type="button"
                  onClick={() => alert(t.premiumActivated)}
                  className="w-full rounded-2xl bg-emerald-600 py-3.5 text-base font-semibold text-white transition hover:bg-emerald-700"
                >
                  {t.upgradeNow}
                </button>

                <p className="text-xs text-muted-foreground">{t.cancelAnytime}</p>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'finance' && (
          <FinanceScreen
            expenses={expenses}
            thisMonthExpenses={thisMonthExpenses}
            monthlyGoal={monthlyGoal}
            totalSpent={totalSpent}
            remainingBudget={remainingBudget}
            percentageUsed={percentageUsed}
            onDeleteExpense={deleteExpense}
          />
        )}

        {activeTab === 'store' && (
  <Store
    totalPoints={totalPoints}
    onRedeem={handleRedeem}
    onBuyPoints={handleBuyPoints}
    isGroupAdmin={isGroupAdmin}
    adminGroups={adminGroups}
    onCreateGroupDonationVote={handleCreateGroupDonationVote}
  />
)}
        {activeTab === 'profile' && (
          <ProfileScreen
            userEmail={userEmail}
            monthlyGoal={monthlyGoal}
            onSetGoal={setMonthlyGoal}
            totalPoints={totalPoints}
            setTotalPoints={setTotalPoints}
            thisMonthExpenses={thisMonthExpenses}
            onDeleteExpense={deleteExpense}
            onSyncTransactions={syncTransactions}
            onUpgrade={() => setActiveTab('premium')}
            onInviteFriends={() => setActiveTab('social')}
            tier={budgetTier}
            percentageUsed={percentageUsed}
            hasGoal={monthlyGoal > 0}
            potentialPoints={potentialPoints}
            canClaim={canClaimImpactPoints}
            claimedThisMonth={claimedThisMonth}
            onClaim={claimPoints}
          />
        )}

        {activeTab === 'social' && (
          <Friends
            totalPoints={totalPoints}
            onSendPoints={handleSendPoints}
            onRequestPoints={handleRequestPoints}
          />
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-md border-t border-border bg-background pb-[env(safe-area-inset-bottom)] shadow-lg">
        <div className="grid h-15 grid-cols-5">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                activeTab === id
                  ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30'
                  : 'text-muted-foreground'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <SettingsProvider>
      <AppContent />
      <Toaster />
    </SettingsProvider>
  );
}