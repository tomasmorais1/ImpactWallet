import { useState, useEffect } from 'react';
import { GoalSetting } from './components/GoalSetting';
import { BankConnection } from './components/BankConnection';
import { ProgressDisplay } from './components/ProgressDisplay';
import { PointsDisplay } from './components/PointsDisplay';
import { Store } from './components/Store';
import { AppSettings } from './components/AppSettings';
import { Login } from './components/Login';
import { Friends } from './components/Friends';
import { Achievements } from './components/Achievements';
import { SettingsProvider, useSettings } from './contexts/SettingsContext';
import { Home, Building2, Target, ShoppingBag, Settings, Coins, Wallet, Users } from 'lucide-react';
import { Card, CardContent } from './components/ui/card';
import { toast } from 'sonner';
import { Toaster } from './components/ui/sonner';


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
  const { t, darkMode, formatCurrency } = useSettings();
  const [activeTab, setActiveTab] = useState('home');
  const [socialTab, setSocialTab] = useState<'friends' | 'achievements'>('friends');
  const [financeTab, setFinanceTab] = useState<'bank' | 'goals'>('bank');
  
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
  const potentialPoints = Math.floor(savedAmount / 10);

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
    if (potentialPoints > 0) setTotalPoints(prev => prev + potentialPoints);
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
      {/* App Header */}
     <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 text-white px-4 pt-10 pb-10">
  <div className="flex items-center justify-between">

    <div className="flex items-center gap-2.5">
      <div className="h-9 w-9 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
        <Wallet className="h-5 w-5 text-white" />
      </div>
      <div>
        <h1 className="text-white leading-tight">Impact Wallet</h1>
        <p className="text-emerald-100 text-xs">{t.appTagline}</p>
      </div>
    </div>

    {/* 👉 NOVO: Upgrade + Points */}
    <div className="flex items-center gap-2">

      <button
        onClick={() => setActiveTab('premium')}
        className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-semibold hover:bg-white/30"
      >
        Upgrade 🚀
      </button>

      <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5">
        <Coins className="h-4 w-4 text-amber-300" />
        <span className="text-sm font-bold text-white">{totalPoints.toLocaleString()}</span>
        <span className="text-xs text-emerald-100">pts</span>
      </div>

    </div>

  </div>
</div>
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto pb-20 px-4 pt-4">
        {/* HOME */}
{activeTab === 'home' && (
  <div className="space-y-4">
    <PointsDisplay
      totalPoints={totalPoints}
      potentialPoints={potentialPoints}
      onClaimPoints={claimPoints}
      canClaim={potentialPoints > 0 && remainingBudget > 0}
    />
    <ProgressDisplay
      monthlyGoal={monthlyGoal}
      totalSpent={totalSpent}
      remainingBudget={remainingBudget}
      percentageUsed={percentageUsed}
      expensesByCategory={thisMonthExpenses}
    />
  </div>
)}

{/* 👉 PREMIUM (FORA DO HOME) */}
{activeTab === 'premium' && (
  <div className="space-y-4">

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
  <div className="space-y-4">

    {/* Switch Bank / Goals */}
    <div className="flex rounded-xl bg-secondary p-1">

      <button
        onClick={() => setFinanceTab('bank')}
        className={`flex-1 py-2 text-sm rounded-lg ${
          financeTab === 'bank'
            ? 'bg-background shadow'
            : 'text-muted-foreground'
        }`}
      >
        Bank
      </button>

      <button
        onClick={() => setFinanceTab('goals')}
        className={`flex-1 py-2 text-sm rounded-lg ${
          financeTab === 'goals'
            ? 'bg-background shadow'
            : 'text-muted-foreground'
        }`}
      >
        Goals
      </button>

    </div>

    {/* Content */}
    {financeTab === 'bank' && (
      <BankConnection
        expenses={thisMonthExpenses}
        onDeleteExpense={deleteExpense}
        onSyncTransactions={syncTransactions}
      />
    )}

    {financeTab === 'goals' && (
      <GoalSetting
        monthlyGoal={monthlyGoal}
        onSetGoal={setMonthlyGoal}
      />
    )}

  </div>
)}

        {activeTab === 'store' && (
          <Store
            totalPoints={totalPoints}
            onRedeem={handleRedeem}
          />
        )}

        {activeTab === 'settings' && (
          <AppSettings />
        )}
        
        {activeTab === 'social' && (
          <div className="space-y-4">
            <Friends
              totalPoints={totalPoints}
              onSendPoints={handleSendPoints}
              onRequestPoints={handleRequestPoints}
            />
            <Achievements
              totalPoints={totalPoints}
              totalSaved={savedAmount}
              monthlyGoal={monthlyGoal}
              friendCount={friendCount}
            />
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