import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Expense } from '../App';
import { 
  Building2, 
  CheckCircle2, 
  RefreshCw, 
  Trash2, 
  ShoppingBag, 
  Coffee, 
  Home, 
  Car, 
  Heart, 
  Gamepad2,
  Link as LinkIcon,
  Shield
} from 'lucide-react';

interface BankConnectionProps {
  expenses: Expense[];
  onDeleteExpense: (id: string) => void;
  onSyncTransactions: () => void;
}

const categories = [
  { value: 'food', label: 'Food & Dining', icon: Coffee },
  { value: 'shopping', label: 'Shopping', icon: ShoppingBag },
  { value: 'home', label: 'Home & Utilities', icon: Home },
  { value: 'transport', label: 'Transportation', icon: Car },
  { value: 'health', label: 'Health & Wellness', icon: Heart },
  { value: 'entertainment', label: 'Entertainment', icon: Gamepad2 },
];

const mockBanks = [
  { id: '1', name: 'Chase Bank', logo: '🏦', color: 'bg-blue-50 border-blue-200' },
  { id: '2', name: 'Bank of America', logo: '🏛️', color: 'bg-red-50 border-red-200' },
  { id: '3', name: 'Wells Fargo', logo: '🏢', color: 'bg-yellow-50 border-yellow-200' },
  { id: '4', name: 'Capital One', logo: '💳', color: 'bg-purple-50 border-purple-200' },
];

export function BankConnection({ 
  expenses, 
  onDeleteExpense,
  onSyncTransactions
}: BankConnectionProps) {
  const [connectedBank, setConnectedBank] = useState<string | null>('Chase Bank');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleConnectBank = (bankName: string) => {
    setIsConnecting(true);
    // Simulate bank connection process
    setTimeout(() => {
      setConnectedBank(bankName);
      setIsConnecting(false);
    }, 1500);
  };

  const handleSync = () => {
    setIsSyncing(true);
    onSyncTransactions();
    setTimeout(() => {
      setIsSyncing(false);
    }, 1000);
  };

  const getCategoryIcon = (cat: string) => {
    const category = categories.find(c => c.value === cat);
    const Icon = category?.icon || ShoppingBag;
    return <Icon className="h-4 w-4" />;
  };

  return (
    <div className="space-y-4">
      {/* Bank Connection Status */}
      {connectedBank ? (
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center text-2xl shadow-sm">
                  🏦
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base">{connectedBank}</CardTitle>
                    <Badge className="bg-green-600 text-white">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Connected
                    </Badge>
                  </div>
                  <CardDescription className="text-xs">
                    Auto-syncing transactions
                  </CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button 
              onClick={handleSync}
              variant="outline" 
              className="w-full h-11 bg-white"
              disabled={isSyncing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Syncing...' : 'Sync Transactions'}
            </Button>
            <Button 
              onClick={() => setConnectedBank(null)}
              variant="ghost" 
              className="w-full h-11 text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              Disconnect Bank
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-2 border-dashed">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <LinkIcon className="h-5 w-5 text-primary" />
              <CardTitle>Connect Your Bank</CardTitle>
            </div>
            <CardDescription className="text-sm">
              Securely link your bank account to auto-track expenses
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              {mockBanks.map((bank) => (
                <Button
                  key={bank.id}
                  onClick={() => handleConnectBank(bank.name)}
                  variant="outline"
                  className={`h-20 flex flex-col gap-1 ${bank.color}`}
                  disabled={isConnecting}
                >
                  <span className="text-2xl">{bank.logo}</span>
                  <span className="text-xs">{bank.name}</span>
                </Button>
              ))}
            </div>
            
            <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-xl border border-blue-200">
              <Shield className="h-5 w-5 text-blue-600 flex-shrink-0" />
              <p className="text-xs text-blue-800">
                Bank-level encryption. We never store your login credentials.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Synced Transactions */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Synced Transactions</CardTitle>
            <span className="text-sm text-muted-foreground">
              {expenses.length} total
            </span>
          </div>
          <CardDescription className="text-xs">
            {connectedBank ? 'Auto-updated from your bank' : 'Connect a bank to see transactions'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {expenses.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Building2 className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No transactions yet</p>
              <p className="text-xs mt-1">
                {connectedBank ? 'Sync to fetch transactions' : 'Connect your bank to get started'}
              </p>
            </div>
          ) : (
            <ScrollArea className="h-[400px] -mx-2 px-2">
              <div className="space-y-2">
                {expenses
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((expense) => (
                    <div
                      key={expense.id}
                      className="flex items-center justify-between p-3 bg-muted/30 rounded-xl active:bg-muted transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="h-10 w-10 rounded-full bg-background flex items-center justify-center flex-shrink-0">
                          {getCategoryIcon(expense.category)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{expense.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(expense.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <p className="font-bold">${expense.amount.toFixed(2)}</p>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDeleteExpense(expense.id)}
                          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* Open Banking Info */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">About Open Banking</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs">Secure, read-only access to your transactions</p>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs">Automatically categorizes your spending</p>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs">Real-time budget tracking</p>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs">Bank-grade encryption & security</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
