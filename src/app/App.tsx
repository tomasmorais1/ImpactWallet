import { useState, useEffect } from 'react';
import { GoalSetting } from './components/GoalSetting';
import { BankConnection } from './components/BankConnection';
import { PointsDisplay } from './components/PointsDisplay';
import { HomeBudgetPanel } from './components/HomeBudgetPanel';
import { ClaimPointsCard } from './components/ClaimPointsCard';
import { FinanceScreen } from './components/FinanceScreen';
import { RecentTransactions } from './components/RecentTransactions';
import { Store } from './components/Store';
import { AppSettings } from './components/AppSettings';
import { Login } from './components/Login';
import { Friends } from './components/Friends';
import { Achievements } from './components/Achievements';
import { SettingsProvider, useSettings } from './contexts/SettingsContext';
import { Home, ShoppingBag, Settings, Wallet, Users, User } from 'lucide-react';
import { Button } from './components/ui/button';
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
  const { formatCurrency } = useSettings();
  const isOverBudget = remainingBudget < 0;
  const clampedPct = Math.min(percentageUsed, 100);
  const barColor = percentageUsed > 90 ? '#ef4444' : percentageUsed > 70 ? '#f97316' : '#10b981';

  return (
    <Card className="mx-4 -mt-5 shadow-xl border-0 overflow-hidden">
      <CardContent className="p-4">
        <p className="text-xs text-muted-foreground mb-3 font-medium uppercase tracking-wide">
          Budget Tracker · This Month
        </p>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {/* Goal */}
          <div className="text-center p-3 rounded-xl bg-secondary/50">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">Goal</p>
            <p className="font-bold text-base leading-tight">
              {monthlyGoal > 0 ? formatCurrency(monthlyGoal) : '—'}
            </p>
          </div>
          {/* Spent */}
          <div className="text-center p-3 rounded-xl bg-secondary/50">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">Spent</p>
            <p className={`font-bold text-base leading-tight ${isOverBudget ? 'text-red-500' : ''}`}>
              {formatCurrency(totalSpent)}
            </p>
          </div>
          {/* Left */}
          <div className={`text-center p-3 rounded-xl ${isOverBudget ? 'bg-red-50 dark:bg-red-950/30' : 'bg-emerald-50 dark:bg-emerald-950/30'}`}>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">Left</p>
            <p className={`font-bold text-base leading-tight ${isOverBudget ? 'text-red-500' : 'text-emerald-600'}`}>
              {monthlyGoal > 0 ? formatCurrency(Math.abs(remainingBudget)) : '—'}
            </p>
          </div>
        </div>

        {/* Progress bar */}
        {monthlyGoal > 0 && (
          <div>
            <div className="flex justify-between text-[10px] text-muted-foreground mb-1.5">
              <span>{percentageUsed.toFixed(0)}% used</span>
              <span>{isOverBudget ? 'Over budget!' : `${(100 - percentageUsed).toFixed(0)}% remaining`}</span>
            </div>
            <div className="h-2.5 rounded-full bg-secondary overflow-hidden">
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
  
  // Authentication state
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
    return saved ? parseInt(saved) : 0;
  });
  
  const [friendCount] = useState(5); // Mock friend count

  const [claimedImpactMonth, setClaimedImpactMonth] = useState(() => {
    return localStorage.getItem(IMPACT_POINTS_CLAIM_KEY) || '';
  });

  useEffect(() => { localStorage.setItem('monthlyGoal', monthlyGoal.toString()); }, [monthlyGoal]);
  useEffect(() => { localStorage.setItem('expenses', JSON.stringify(expenses)); }, [expenses]);
  useEffect(() => { localStorage.setItem('totalPoints', totalPoints.toString()); }, [totalPoints]);
  useEffect(() => { 
    localStorage.setItem('isAuthenticated', isAuthenticated.toString());
    localStorage.setItem('userEmail', userEmail);
  }, [isAuthenticated, userEmail]);

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const thisMonthExpenses = expenses.filter(expense => {
    const d = new Date(expense.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const totalSpent = thisMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
  const remainingBudget = monthlyGoal - totalSpent;
  const percentageUsed = monthlyGoal > 0 ? (totalSpent / monthlyGoal) * 100 : 0;
  const savedAmount = remainingBudget > 0 ? remainingBudget : 0;
  const budgetTier = getBudgetTierInfo(percentageUsed);
  const potentialPoints = monthlyGoal > 0 ? budgetTier.points : 0;
  const monthClaimKey = `${currentYear}-${currentMonth}`;
  const claimedThisMonth = claimedImpactMonth === monthClaimKey;
  const canClaimImpactPoints =
    monthlyGoal > 0 && potentialPoints > 0 && !claimedThisMonth;

  const deleteExpense = (id: string) => setExpenses(expenses.filter(e => e.id !== id));

  const syncTransactions = () => {
    const mock: Omit<Expense, 'id'>[] = [
      { description: 'Starbucks Coffee', amount: 5.75, date: new Date().toISOString(), category: 'food' },
      { description: 'Uber Ride', amount: 12.50, date: new Date(Date.now() - 86400000).toISOString(), category: 'transport' },
      { description: 'Amazon Purchase', amount: 34.99, date: new Date(Date.now() - 172800000).toISOString(), category: 'shopping' },
      { description: 'Grocery Store', amount: 67.32, date: new Date(Date.now() - 259200000).toISOString(), category: 'food' },
      { description: 'Netflix Subscription', amount: 15.99, date: new Date(Date.now() - 345600000).toISOString(), category: 'entertainment' },
    ];
    setExpenses(prev => [...prev, ...mock.map(tx => ({ ...tx, id: Date.now().toString() + Math.random() }))]);
  };

  const claimPoints = () => {
    if (!canClaimImpactPoints) return;
    setTotalPoints((prev) => prev + potentialPoints);
    localStorage.setItem(IMPACT_POINTS_CLAIM_KEY, monthClaimKey);
    setClaimedImpactMonth(monthClaimKey);
    toast.success(`+${potentialPoints} impact points claimed`);
  };

  const handleRedeem = (cost: number) => {
    setTotalPoints(prev => Math.max(0, prev - cost));
  };
  
  const handleLogin = (email: string) => {
    setUserEmail(email);
    setIsAuthenticated(true);
    toast.success(`Welcome back! Signed in as ${email}`);
  };
  
  const handleSendPoints = (friendId: string, amount: number) => {
    if (amount <= totalPoints) {
      setTotalPoints(prev => prev - amount);
      toast.success(`Successfully sent ${amount} points!`);
    } else {
      toast.error('Not enough points to send');
    }
  };
  
  const handleRequestPoints = (friendId: string, amount: number) => {
    toast.success('Point request sent successfully!');
  };
  
  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  const navItems = [
    { id: 'home', label: t.home, icon: Home },
    { id: 'social', label: 'Social', icon: Users },
    {id: 'finance', label: 'Finance', icon: Wallet },
    { id: 'store', label: 'Store', icon: ShoppingBag },
    { id: 'settings', label: t.settings, icon: Settings },
  ];

  return (
    <div className={`min-h-screen flex flex-col max-w-md mx-auto bg-background`}>
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto pb-20 pt-[max(0.75rem,env(safe-area-inset-top))]">
        {/* HOME */}
{activeTab === 'home' && (
  <div className="space-y-4">
    <div className="relative">
      <button
        type="button"
        onClick={() => setActiveTab('settings')}
        className="absolute left-4 top-[max(0.85rem,calc(env(safe-area-inset-top)+0.35rem))] z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/45 bg-white/20 text-white shadow-md backdrop-blur-md transition hover:bg-white/30"
        aria-label="Profile"
      >
        <User className="h-5 w-5" strokeWidth={2} />
      </button>
      <PointsDisplay
        totalPoints={totalPoints}
        onAddPoints={() => setActiveTab('settings')}
        onMove={() => setActiveTab('social')}
        onData={() => setActiveTab('finance')}
        onPremium={() => setActiveTab('premium')}
      />
    </div>
    <div className="px-4 space-y-4">
    <HomeBudgetPanel
      expenses={expenses}
      monthlyGoal={monthlyGoal}
      totalSpent={totalSpent}
      remainingBudget={remainingBudget}
      percentageUsed={percentageUsed}
    />
    <RecentTransactions
      expenses={thisMonthExpenses}
      onSeeAll={() => setActiveTab('finance')}
    />
    </div>
  </div>
)}

{/* 👉 PREMIUM (FORA DO HOME) */}
        {activeTab === 'premium' && (
  <div className="space-y-4 px-4 pt-4">

    <Card className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0">
      <CardContent className="p-6 text-center">
        <h2 className="text-xl font-bold mb-2">Go Premium 🚀</h2>
        <p className="text-sm opacity-90">
          Unlock the full power of Impact Wallet
        </p>
      </CardContent>
    </Card>

    <Card>
      <CardContent className="p-4 space-y-3 text-sm">
        <p>✅ Advanced analytics</p>
        <p>✅ Double reward points</p>
        <p>✅ Exclusive discounts</p>
        <p>✅ Priority support</p>
      </CardContent>
    </Card>

    <Card>
      <CardContent className="p-6 text-center space-y-3">
        <p className="text-2xl font-bold">19,99€ / month</p>

        <button
          onClick={() => alert('Premium activated!')}
          className="w-full bg-emerald-600 text-white py-3 rounded-xl hover:bg-emerald-700"
        >
          Upgrade Now
        </button>
      </CardContent>
    </Card>

  </div>
)}
        {activeTab === 'finance' && (
          <FinanceScreen
            thisMonthExpenses={thisMonthExpenses}
            monthlyGoal={monthlyGoal}
            totalSpent={totalSpent}
            remainingBudget={remainingBudget}
            percentageUsed={percentageUsed}
            onDeleteExpense={deleteExpense}
          />
        )}

        {activeTab === 'store' && (
          <div className="px-4 pt-4">
            <Store totalPoints={totalPoints} onRedeem={handleRedeem} />
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6 px-4 pt-4">
            <ClaimPointsCard
              tier={budgetTier}
              percentageUsed={percentageUsed}
              hasGoal={monthlyGoal > 0}
              potentialPoints={potentialPoints}
              canClaim={canClaimImpactPoints}
              claimedThisMonth={claimedThisMonth}
              onClaim={claimPoints}
            />
            <Button
              type="button"
              variant="outline"
              className="h-11 w-full rounded-xl border-emerald-300 bg-emerald-50/70 font-semibold text-emerald-800 hover:bg-emerald-100 dark:border-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-100 dark:hover:bg-emerald-950/60"
              onClick={() => setActiveTab('premium')}
            >
              Upgrade plan
            </Button>
            <section className="space-y-3">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{t.goals}</h2>
              <GoalSetting monthlyGoal={monthlyGoal} onSetGoal={setMonthlyGoal} />
            </section>
            <section className="space-y-3">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{t.bank}</h2>
              <BankConnection
                expenses={thisMonthExpenses}
                onDeleteExpense={deleteExpense}
                onSyncTransactions={syncTransactions}
              />
            </section>
            <AppSettings />
          </div>
        )}
        
        {activeTab === 'social' && (
          <div className="space-y-4 px-4 pt-4">
            <Friends
              totalPoints={totalPoints}
              onSendPoints={handleSendPoints}
              onRequestPoints={handleRequestPoints}
            />
            <Achievements totalPoints={totalPoints} totalSaved={savedAmount} friendCount={friendCount} />
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border shadow-lg max-w-md mx-auto">
        <div className="grid grid-cols-5 h-15">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                activeTab === id
                  ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30'
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