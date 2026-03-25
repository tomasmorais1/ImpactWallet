import { useState, type Dispatch, type ReactNode, type SetStateAction } from 'react';
import {
  HelpCircle,
  FileText,
  Megaphone,
  Shield,
  Eye,
  Moon,
  Globe,
  Languages,
  Handshake,
  ChevronRight,
  Check,
  CreditCard,
  UserPlus,
  QrCode,
  Sparkles,
  Info,
} from 'lucide-react';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';
import { ScreenGradientLayout } from './ScreenGradientLayout';
import { cn } from './ui/utils';
import { GoalSetting } from './GoalSetting';
import { BankConnection } from './BankConnection';
import { ClaimPointsCard } from './ClaimPointsCard';
import { useSettings, CURRENCIES, LANGUAGES, type CurrencyCode, type LanguageCode } from '../contexts/SettingsContext';
import type { Expense } from '../App';
import type { BudgetTierInfo } from '../lib/impactPoints';
import { toast } from 'sonner';

type SheetId = null | 'help' | 'preferences' | 'partner';

interface ProfileScreenProps {
  userEmail: string;
  monthlyGoal: number;
  onSetGoal: (goal: number) => void;
  totalPoints: number;
  setTotalPoints: Dispatch<SetStateAction<number>>;
  thisMonthExpenses: Expense[];
  onDeleteExpense: (id: string) => void;
  onSyncTransactions: () => void;
  onUpgrade: () => void;
  onInviteFriends: () => void;
  tier: BudgetTierInfo;
  percentageUsed: number;
  hasGoal: boolean;
  potentialPoints: number;
  canClaim: boolean;
  claimedThisMonth: boolean;
  onClaim: () => void;
}

function displayNameFromEmail(email: string) {
  const stored = localStorage.getItem('profileDisplayName');
  if (stored) return stored;
  if (!email) return 'Tomás Morais';
  const local = email.split('@')[0];
  if (!local) return 'Tomás Morais';
  return local.charAt(0).toUpperCase() + local.slice(1);
}

function handleFromEmail(email: string) {
  const stored = localStorage.getItem('profileHandle');
  if (stored) return stored.replace(/^@/, '');
  if (!email) return 'tmorais';
  return email.split('@')[0] || 'tmorais';
}

export function ProfileScreen({
  userEmail,
  monthlyGoal,
  onSetGoal,
  totalPoints,
  setTotalPoints,
  thisMonthExpenses,
  onDeleteExpense,
  onSyncTransactions,
  onUpgrade,
  onInviteFriends,
  tier,
  percentageUsed,
  hasGoal,
  potentialPoints,
  canClaim,
  claimedThisMonth,
  onClaim,
}: ProfileScreenProps) {
  const { t, currency, setCurrencyCode, language, setLanguageCode, darkMode, toggleDarkMode } = useSettings();
  const [sheet, setSheet] = useState<SheetId>(null);
  const [activePicker, setActivePicker] = useState<'currency' | 'language' | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const [partnerType, setPartnerType] = useState<'ngo' | 'company' | null>(null);
  const [partnerName, setPartnerName] = useState('');
  const [partnerEmail, setPartnerEmail] = useState('');
  const [bugName, setBugName] = useState('');
  const [bugEmail, setBugEmail] = useState('');
  const [bugMessage, setBugMessage] = useState('');

  const name = displayNameFromEmail(userEmail);
  const handle = handleFromEmail(userEmail);
  const initials = name
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'TM';

  const claimTest100 = () => {
    setTotalPoints((p) => p + 100);
    toast.success('+100 pontos (teste infinito)');
  };

  return (
    <ScreenGradientLayout variant="profile">
      <div className="space-y-0 pb-8">
      {/* Hero — mesmo gradiente verde-azulado que Home / Finance */}
      <div className="relative overflow-hidden rounded-b-[1.75rem] px-4 pb-8 pt-3 text-white">
        <div className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 h-44 w-44 rounded-full bg-emerald-400/20 blur-2xl dark:bg-cyan-500/15" />

        <div className="relative flex items-center justify-between">
          <div className="w-10" aria-hidden />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onUpgrade}
            className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur hover:bg-white/20"
          >
            <Sparkles className="mr-1.5 h-3.5 w-3.5 text-emerald-100" />
            Fazer upgrade
          </Button>
        </div>

        <div className="relative mt-6 flex flex-col items-center">
          <div className="flex h-[5.25rem] w-[5.25rem] items-center justify-center rounded-full bg-white/15 text-2xl font-bold ring-4 ring-white/20">
            {initials}
          </div>
          <h1 className="mt-4 text-center text-2xl font-bold tracking-tight">{name}</h1>
          <div className="mt-1 flex items-center gap-2 text-sm text-white/75">
            <span>@{handle}</span>
            <QrCode className="h-4 w-4 opacity-80" aria-hidden />
          </div>
        </div>

        <div className="relative mt-8 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onUpgrade}
            className="flex flex-col rounded-2xl border border-white/15 bg-white/10 p-4 text-left backdrop-blur transition hover:bg-white/15"
          >
            <CreditCard className="mb-3 h-8 w-8 text-teal-100" />
            <span className="text-lg font-bold">Standard</span>
            <span className="text-xs text-white/70">O teu plano</span>
          </button>
          <button
            type="button"
            onClick={onInviteFriends}
            className="flex flex-col rounded-2xl border border-white/15 bg-white/10 p-4 text-left backdrop-blur transition hover:bg-white/15"
          >
            <UserPlus className="mb-3 h-8 w-8 text-emerald-200" />
            <span className="text-lg font-bold leading-tight">Convidar amigos</span>
            <span className="text-xs text-white/70">Ganha 5 pontos</span>
          </button>
        </div>
      </div>

      <div className="space-y-3 px-4 pt-5">
        {/* Group 1 */}
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <MenuRow icon={<HelpCircle className="h-5 w-5 text-violet-500" />} label="Ajuda" onClick={() => setSheet('help')} />
          <MenuRow
            icon={<FileText className="h-5 w-5 text-sky-500" />}
            label="Documentos e extratos"
            onClick={() => toast.info('Documentos em breve.')}
          />
          <MenuRow
            icon={<Megaphone className="h-5 w-5 text-amber-500" />}
            label="Caixa de entrada"
            badge={29}
            onClick={() => toast.info('Caixa de entrada — 29 novidades (demo).')}
          />
          <MenuRow
            icon={<Shield className="h-5 w-5 text-emerald-600" />}
            label="Segurança"
            onClick={() => toast.info('Definições de segurança em breve.')}
          />
          <MenuRow
            icon={<Eye className="h-5 w-5 text-cyan-500" />}
            label="Privacidade"
            onClick={() => toast.info('Política de privacidade em breve.')}
            last
          />
        </div>

        {/* Dark mode */}
        <div className="flex items-center justify-between rounded-2xl border border-border bg-card px-4 py-3.5 shadow-sm">
          <div className="flex items-center gap-3">
            <Moon className="h-5 w-5 text-indigo-500" />
            <div>
              <p className="text-sm font-medium">{darkMode ? t.darkMode : t.lightMode}</p>
              <p className="text-xs text-muted-foreground">Alternar tema da app</p>
            </div>
          </div>
          <Switch checked={darkMode} onCheckedChange={() => toggleDarkMode()} />
        </div>

        {/* Group 2 */}
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <MenuRow
            icon={<Globe className="h-5 w-5 text-blue-500" />}
            label="Preferências"
            onClick={() => {
              setSheet('preferences');
              setActivePicker(null);
            }}
          />
          <MenuRow
            icon={<Handshake className="h-5 w-5 text-emerald-600" />}
            label="Be a Partner"
            onClick={() => {
              setSheet('partner');
              setPartnerType(null);
            }}
            last
          />
        </div>

        {/* Bank */}
        <section className="space-y-2 pt-1">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t.bank}</h2>
          <BankConnection
            expenses={thisMonthExpenses}
            onDeleteExpense={onDeleteExpense}
            onSyncTransactions={onSyncTransactions}
          />
        </section>

        {/* Budget goal */}
        <section className="space-y-2">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t.goals}</h2>
          <GoalSetting monthlyGoal={monthlyGoal} onSetGoal={onSetGoal} />
        </section>

        {/* Claim */}
        <ClaimPointsCard
          tier={tier}
          percentageUsed={percentageUsed}
          hasGoal={hasGoal}
          potentialPoints={potentialPoints}
          canClaim={canClaim}
          claimedThisMonth={claimedThisMonth}
          onClaim={onClaim}
        />

        <Button
          type="button"
          variant="outline"
          className="h-12 w-full rounded-2xl border-dashed border-amber-400/80 bg-amber-50/50 font-semibold text-amber-900 hover:bg-amber-100 dark:border-amber-700 dark:bg-amber-950/30 dark:text-amber-100 dark:hover:bg-amber-950/50"
          onClick={claimTest100}
        >
          Claim 100 pontos (teste infinito)
        </Button>

        <div className="flex items-start gap-2 rounded-xl border border-dashed p-3 text-xs text-muted-foreground">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            Saldo atual: <strong className="text-foreground">{totalPoints.toLocaleString()}</strong> pontos · botão de
            teste não valida orçamento.
          </span>
        </div>
      </div>

      {/* Sheet: Help */}
      <Sheet open={sheet === 'help'} onOpenChange={(o) => !o && setSheet(null)}>
        <SheetContent side="bottom" className="max-h-[90vh] overflow-y-auto rounded-t-2xl sm:mx-auto sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Ajuda</SheetTitle>
          </SheetHeader>
          <div className="mt-4 space-y-3">
            <button
              type="button"
              onClick={() => setShowHelp(!showHelp)}
              className="flex w-full items-center justify-between rounded-xl border bg-muted/40 px-4 py-3 text-sm font-medium"
            >
              Como funciona
              <ChevronRight className={cn('h-4 w-4 transition', showHelp && 'rotate-90')} />
            </button>
            {showHelp && (
              <div className="space-y-4 rounded-xl border bg-muted/30 p-4 text-sm">
                <p>
                  <strong>Doações</strong> — Poupa no orçamento, ganha pontos e converte em impacto nas ONG.
                </p>
                <p>
                  <strong>Parcerias</strong> — Marcas e ONG podem integrar campanhas no Impact Wallet.
                </p>
                <div className="space-y-2 border-t pt-3">
                  <p className="font-semibold">Reportar um problema</p>
                  <input
                    className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                    placeholder="Nome"
                    value={bugName}
                    onChange={(e) => setBugName(e.target.value)}
                  />
                  <input
                    className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                    placeholder="Email"
                    value={bugEmail}
                    onChange={(e) => setBugEmail(e.target.value)}
                  />
                  <textarea
                    className="min-h-[80px] w-full rounded-lg border bg-background px-3 py-2 text-sm"
                    placeholder="Descrição"
                    value={bugMessage}
                    onChange={(e) => setBugMessage(e.target.value)}
                  />
                  <Button
                    className="w-full"
                    onClick={() => {
                      if (!bugName || !bugEmail || !bugMessage) {
                        toast.error('Preenche todos os campos.');
                        return;
                      }
                      toast.success('Relatório enviado (demo).');
                      setBugName('');
                      setBugEmail('');
                      setBugMessage('');
                    }}
                  >
                    Enviar
                  </Button>
                </div>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Sheet: Preferences */}
      <Sheet open={sheet === 'preferences'} onOpenChange={(o) => !o && setSheet(null)}>
        <SheetContent side="bottom" className="max-h-[90vh] overflow-y-auto rounded-t-2xl sm:mx-auto sm:max-w-md">
          <SheetHeader>
            <SheetTitle>{t.preferences}</SheetTitle>
          </SheetHeader>
          <div className="mt-4 space-y-2">
            <button
              type="button"
              onClick={() => setActivePicker(activePicker === 'currency' ? null : 'currency')}
              className="flex w-full items-center justify-between rounded-xl border bg-muted/40 px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700 dark:bg-emerald-950">
                  {currency.symbol}
                </span>
                <div className="text-left">
                  <p className="text-sm font-medium">{t.currency}</p>
                  <p className="text-xs text-muted-foreground">
                    {currency.name} ({currency.code})
                  </p>
                </div>
              </div>
              <ChevronRight className={cn('h-4 w-4', activePicker === 'currency' && 'rotate-90')} />
            </button>
            {activePicker === 'currency' && (
              <div className="overflow-hidden rounded-xl border">
                {CURRENCIES.map((c, i) => (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => {
                      setCurrencyCode(c.code as CurrencyCode);
                      setActivePicker(null);
                    }}
                    className={cn(
                      'flex w-full items-center justify-between px-4 py-3 hover:bg-muted',
                      i > 0 && 'border-t',
                    )}
                  >
                    <span className="text-sm">
                      {c.symbol} {c.name}
                    </span>
                    {currency.code === c.code && <Check className="h-4 w-4 text-emerald-600" />}
                  </button>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={() => setActivePicker(activePicker === 'language' ? null : 'language')}
              className="flex w-full items-center justify-between rounded-xl border bg-muted/40 px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-950">
                  <Languages className="h-5 w-5 text-blue-600" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium">{t.language}</p>
                  <p className="text-xs text-muted-foreground">
                    {language.flag} {language.name}
                  </p>
                </div>
              </div>
              <ChevronRight className={cn('h-4 w-4', activePicker === 'language' && 'rotate-90')} />
            </button>
            {activePicker === 'language' && (
              <div className="overflow-hidden rounded-xl border">
                {LANGUAGES.map((l, i) => (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => {
                      setLanguageCode(l.code as LanguageCode);
                      setActivePicker(null);
                    }}
                    className={cn(
                      'flex w-full items-center justify-between px-4 py-3 hover:bg-muted',
                      i > 0 && 'border-t',
                    )}
                  >
                    <span className="text-sm">
                      {l.flag} {l.name}
                    </span>
                    {language.code === l.code && <Check className="h-4 w-4 text-emerald-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Sheet: Partner */}
      <Sheet open={sheet === 'partner'} onOpenChange={(o) => !o && setSheet(null)}>
        <SheetContent side="bottom" className="max-h-[90vh] overflow-y-auto rounded-t-2xl sm:mx-auto sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Be a Partner</SheetTitle>
          </SheetHeader>
          <div className="mt-4 space-y-3">
            {!partnerType ? (
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="h-auto py-6" onClick={() => setPartnerType('ngo')}>
                  ONG
                </Button>
                <Button variant="outline" className="h-auto py-6" onClick={() => setPartnerType('company')}>
                  Empresa
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <input
                  className="w-full rounded-lg border px-3 py-2 text-sm"
                  placeholder={partnerType === 'ngo' ? 'Nome da ONG' : 'Nome da empresa'}
                  value={partnerName}
                  onChange={(e) => setPartnerName(e.target.value)}
                />
                <input
                  className="w-full rounded-lg border px-3 py-2 text-sm"
                  placeholder="Email"
                  type="email"
                  value={partnerEmail}
                  onChange={(e) => setPartnerEmail(e.target.value)}
                />
                <Button
                  className="w-full"
                  onClick={() => {
                    if (!partnerName || !partnerEmail) {
                      toast.error('Preenche nome e email.');
                      return;
                    }
                    toast.success('Pedido de parceria enviado (demo).');
                    setPartnerName('');
                    setPartnerEmail('');
                    setPartnerType(null);
                    setSheet(null);
                  }}
                >
                  Enviar pedido
                </Button>
                <Button variant="ghost" className="w-full" onClick={() => setPartnerType(null)}>
                  Voltar
                </Button>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
      </div>
    </ScreenGradientLayout>
  );
}

function MenuRow({
  icon,
  label,
  onClick,
  badge,
  last,
}: {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  badge?: number;
  last?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-3 px-4 py-3.5 text-left transition hover:bg-muted/60 active:bg-muted/80',
        !last && 'border-b border-border',
      )}
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted">{icon}</span>
      <span className="min-w-0 flex-1 text-sm font-medium">{label}</span>
      {badge != null && (
        <span className="rounded-full bg-red-500 px-2 py-0.5 text-[11px] font-bold text-white">{badge}</span>
      )}
      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
    </button>
  );
}
