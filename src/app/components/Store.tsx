import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  ArrowLeft,
  ChevronRight,
  Heart,
  Info,
  Leaf,
  Repeat,
  Sparkles,
  Tag,
  Coins,
  Users,
  Share2,
} from 'lucide-react';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';
import { cn } from './ui/utils';
import { useSettings } from '../contexts/SettingsContext';
import impactPointsLogo from '../assets/impact-points-logo.png';
import {
  CHARITIES,
  DISCOUNT_OFFERS,
  DONATION_EURO_AMOUNTS,
  MOCK_GLOBAL_CONTRIBUTORS,
  MOCK_GLOBAL_DONATIONS_EUR,
  POINTS_PER_EURO,
  USER_DONATION_BY_CHARITY_KEY,
  USER_DONATION_TOTAL_KEY,
  type Charity,
  type DiscountOffer,
  eurosToPoints,
} from '../lib/storeCatalog';
import { toast } from 'sonner';

interface StoreProps {
  totalPoints: number;
  onRedeem: (cost: number, label: string) => void;
}

type StoreTab = 'donations' | 'discounts' | 'contribution';

function readUserDonationEur(): number {
  const v = parseFloat(localStorage.getItem(USER_DONATION_TOTAL_KEY) || '0');
  return Number.isFinite(v) ? v : 0;
}

function readDonationByCharity(): Record<string, number> {
  try {
    const raw = localStorage.getItem(USER_DONATION_BY_CHARITY_KEY);
    if (!raw) return {};
    const o = JSON.parse(raw) as Record<string, number>;
    return typeof o === 'object' && o ? o : {};
  } catch {
    return {};
  }
}

function persistDonation(charityId: string, euroAmount: number) {
  const total = readUserDonationEur() + euroAmount;
  localStorage.setItem(USER_DONATION_TOTAL_KEY, String(total));
  const by = readDonationByCharity();
  by[charityId] = (by[charityId] || 0) + euroAmount;
  localStorage.setItem(USER_DONATION_BY_CHARITY_KEY, JSON.stringify(by));
}

export function Store({ totalPoints, onRedeem }: StoreProps) {
  const { formatCurrency } = useSettings();
  const [tab, setTab] = useState<StoreTab>('donations');
  const [detail, setDetail] = useState<Charity | null>(null);
  const [donateOpen, setDonateOpen] = useState(false);
  const [selectedEur, setSelectedEur] = useState<number>(10);
  const [recurring, setRecurring] = useState(false);
  const [userDonationEur, setUserDonationEur] = useState(readUserDonationEur);

  const refreshUserTotal = useCallback(() => setUserDonationEur(readUserDonationEur()), []);

  useEffect(() => {
    if (tab === 'contribution') refreshUserTotal();
  }, [tab, refreshUserTotal]);

  const charityUserTotal = useMemo(() => {
    if (!detail) return 0;
    return readDonationByCharity()[detail.id] || 0;
  }, [detail, userDonationEur]);

  const openDonate = () => setDonateOpen(true);

  const netToCharity = (eur: number) => Math.max(0, eur * 0.865);

  const confirmDonation = () => {
    if (!detail) return;
    const pts = eurosToPoints(selectedEur);
    if (totalPoints < pts) {
      toast.error('Não tens pontos suficientes.');
      return;
    }
    onRedeem(pts, `Doação ${selectedEur} € · ${detail.name}`);
    persistDonation(detail.id, selectedEur);
    refreshUserTotal();
    toast.success(
      recurring
        ? `Doação recorrente ativada: ${selectedEur} € / mês em pontos para ${detail.name}`
        : `Doação de ${selectedEur} € registada para ${detail.name}`,
    );
    setDonateOpen(false);
    setRecurring(false);
  };

  const redeemDiscount = (offer: DiscountOffer) => {
    if (totalPoints < offer.costPoints) {
      toast.error('Não tens pontos suficientes.');
      return;
    }
    onRedeem(offer.costPoints, `Desconto ${offer.brand} · ${offer.title}`);
    toast.success(`Código enviado: ${offer.brand} — ${offer.title}`);
  };

  return (
    <div className="space-y-4 pb-4">
      {/* Points header — Revolut-style pill */}
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-bold tracking-tight">Store</h1>
        <div className="flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1.5 shadow-sm">
          <img src={impactPointsLogo} alt="" className="h-6 w-6 object-contain" />
          <span className="text-base font-bold tabular-nums">{totalPoints.toLocaleString()}</span>
        </div>
      </div>

      {/* Main tabs */}
      <div className="flex rounded-2xl bg-muted/70 p-1 dark:bg-zinc-900/80">
        {(
          [
            { id: 'donations' as const, label: 'Doações' },
            { id: 'discounts' as const, label: 'Descontos' },
            { id: 'contribution' as const, label: 'Contribuição' },
          ] as const
        ).map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => {
              setTab(id);
              setDetail(null);
            }}
            className={cn(
              'flex-1 rounded-xl py-2.5 text-center text-sm transition-all',
              tab === id
                ? 'bg-background font-bold text-foreground shadow-sm dark:bg-zinc-800 dark:text-white'
                : 'font-medium text-muted-foreground dark:text-zinc-500',
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'donations' && !detail && (
        <section className="space-y-3">
          <p className="text-sm text-muted-foreground">Instituições de caridade</p>
          <div className="grid grid-cols-2 gap-3">
            {CHARITIES.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setDetail(c)}
                className="group relative aspect-[4/5] overflow-hidden rounded-2xl border border-border/60 text-left shadow-sm transition hover:opacity-[0.98] active:scale-[0.99]"
              >
                <div className={cn('absolute inset-0 bg-gradient-to-br', c.gradient)} />
                <div className="absolute left-3 top-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-xl shadow-md dark:bg-zinc-900/90">
                  {c.logoEmoji}
                </div>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-3 pt-10">
                  <p className="line-clamp-2 text-sm font-bold leading-tight text-white">{c.name}</p>
                  <p className="mt-1 line-clamp-2 text-[11px] leading-snug text-white/85">{c.tagline}</p>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {tab === 'donations' && detail && (
        <CharityDetail
          charity={detail}
          userToThisCharityEur={charityUserTotal}
          formatCurrency={formatCurrency}
          onBack={() => setDetail(null)}
          onDonate={openDonate}
          onSelectCharity={(c) => setDetail(c)}
          globalUserTotalEur={userDonationEur}
        />
      )}

      {tab === 'discounts' && (
        <section className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Ofertas fixas — resgata com pontos; o desconto já está definido pela marca.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {DISCOUNT_OFFERS.map((offer) => (
              <DiscountCard
                key={offer.id}
                offer={offer}
                totalPoints={totalPoints}
                onRedeem={() => redeemDiscount(offer)}
              />
            ))}
          </div>
        </section>
      )}

      {tab === 'contribution' && (
        <ContributionPanel
          userTotalEur={userDonationEur}
          formatCurrency={formatCurrency}
          onRefresh={() => refreshUserTotal()}
        />
      )}

      <Sheet open={donateOpen} onOpenChange={setDonateOpen}>
        <SheetContent
          side="bottom"
          className="max-h-[88vh] overflow-y-auto rounded-t-2xl border-t bg-background px-4 pb-8 pt-3 sm:mx-auto sm:max-w-md"
        >
          <SheetHeader className="space-y-1 text-left">
            <SheetTitle className="text-lg">Doar com pontos</SheetTitle>
            <p className="text-sm text-muted-foreground">
              {detail?.name ?? 'Instituição'} · equivalência {POINTS_PER_EURO} pts = 1 €
            </p>
          </SheetHeader>

          <div className="mt-4 grid grid-cols-2 gap-2.5">
            {DONATION_EURO_AMOUNTS.map((eur) => {
              const pts = eurosToPoints(eur);
              const selected = selectedEur === eur;
              return (
                <button
                  key={eur}
                  type="button"
                  onClick={() => setSelectedEur(eur)}
                  className={cn(
                    'flex flex-col items-center justify-center rounded-2xl border-2 py-3 transition',
                    selected
                      ? 'border-violet-500 bg-violet-500/10 dark:border-violet-400'
                      : 'border-border bg-muted/30 hover:bg-muted/50',
                  )}
                >
                  <span className="text-lg font-bold tabular-nums">{eur} €</span>
                  <span className="mt-1 flex items-center gap-1 text-xs font-medium text-muted-foreground">
                    <img src={impactPointsLogo} alt="" className="h-3.5 w-3.5 opacity-80" />
                    {pts.toLocaleString()} pts
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex items-center justify-between rounded-xl border border-border bg-muted/30 px-3 py-2.5">
            <div className="flex items-center gap-2">
              <Repeat className="h-4 w-4 text-emerald-600" />
              <div>
                <p className="text-sm font-medium">Doação recorrente</p>
                <p className="text-xs text-muted-foreground">Renova todos os meses em pontos</p>
              </div>
            </div>
            <Switch checked={recurring} onCheckedChange={setRecurring} />
          </div>

          <div className="mt-4 flex gap-2 rounded-xl border border-dashed border-border bg-muted/20 p-3 text-xs text-muted-foreground">
            <Info className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              Estimativa: a instituição recebe cerca de{' '}
              <strong className="text-foreground">{formatCurrency(netToCharity(selectedEur))}</strong> após
              taxas (valor indicativo).
            </span>
          </div>

          <Button
            type="button"
            className="mt-5 h-12 w-full rounded-2xl bg-foreground text-background hover:bg-foreground/90"
            onClick={confirmDonation}
            disabled={!detail || totalPoints < eurosToPoints(selectedEur)}
          >
            Confirmar doação · {eurosToPoints(selectedEur).toLocaleString()} pts
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="mt-2 w-full text-sm"
            onClick={() => toast.info('Brevemente: ganhar mais pontos no orçamento.')}
          >
            Obter mais pontos
          </Button>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function CharityDetail({
  charity,
  userToThisCharityEur,
  globalUserTotalEur,
  formatCurrency,
  onBack,
  onDonate,
  onSelectCharity,
}: {
  charity: Charity;
  userToThisCharityEur: number;
  globalUserTotalEur: number;
  formatCurrency: (n: number) => string;
  onBack: () => void;
  onDonate: () => void;
  onSelectCharity: (c: Charity) => void;
}) {
  const others = CHARITIES.filter((c) => c.id !== charity.id).slice(0, 6);
  const networkTotalDemo = 216_116.35;

  return (
    <div className="space-y-5 pb-6">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onBack}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-muted"
          aria-label="Voltar"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <button type="button" className="ml-auto flex h-9 w-9 items-center justify-center rounded-full bg-muted" aria-label="Partilhar">
          <Share2 className="h-4 w-4" />
        </button>
      </div>

      <div
        className={cn(
          'relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br p-6 text-white shadow-lg',
          charity.gradient,
        )}
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/95 text-2xl shadow-md dark:bg-zinc-900/90">
          {charity.logoEmoji}
        </div>
        <h2 className="mt-4 text-2xl font-bold leading-tight">{charity.name}</h2>
        <p className="mt-2 text-3xl font-bold tabular-nums">{formatCurrency(userToThisCharityEur)}</p>
        <p className="mt-1 text-xs text-white/75">Contribuído por ti para esta instituição</p>
        <Button
          type="button"
          onClick={onDonate}
          className="mt-5 h-11 rounded-full bg-white/20 px-6 text-white backdrop-blur hover:bg-white/30"
        >
          <Heart className="mr-2 h-4 w-4 fill-white/30" />
          Doar
        </Button>
      </div>

      <div>
        <h3 className="text-sm font-semibold">Mais formas de doar</h3>
        <div className="mt-2 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
          <RowAction
            icon={<img src={impactPointsLogo} alt="" className="h-5 w-5 object-contain" />}
            title="Doar com pontos"
            subtitle="Usa os teus pontos para fazer o bem"
            onClick={onDonate}
          />
          <RowAction
            icon={<Repeat className="h-5 w-5 text-sky-500" />}
            title="Doação recorrente"
            subtitle="Define um valor mensal em pontos"
            onClick={onDonate}
          />
          <RowAction
            icon={<Coins className="h-5 w-5 text-amber-500" />}
            title="Trocos"
            subtitle="Arredonda os teus gastos diários"
            onClick={() => toast.info('Brevemente: arredondamento de trocos.')}
          />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold">Sobre a instituição de caridade</h3>
        <p className="mt-2 rounded-2xl border border-border bg-muted/40 p-4 text-sm leading-relaxed text-muted-foreground">
          {charity.about}
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-muted/30 p-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Doações dos utilizadores Impact Wallet</span>
        </div>
        <div className="mt-2 flex items-end justify-between gap-2">
          <span className="text-sm text-muted-foreground">Montante total doado (estimado)</span>
          <span className="text-lg font-bold tabular-nums">{formatCurrency(networkTotalDemo)}</span>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          O teu total global em doações: <strong className="text-foreground">{formatCurrency(globalUserTotalEur)}</strong>
        </p>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Mais instituições para descobrir</h3>
        </div>
        <div className="mt-3 flex gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {others.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => onSelectCharity(c)}
              className="w-36 shrink-0 overflow-hidden rounded-xl border border-border text-left shadow-sm"
            >
              <div className={cn('h-24 bg-gradient-to-br', c.gradient)} />
              <div className="p-2">
                <p className="text-xs font-semibold leading-tight">{c.name}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <p className="text-center text-[10px] text-muted-foreground">Valores demonstrativos · Impact Wallet</p>
    </div>
  );
}

function RowAction({
  icon,
  title,
  subtitle,
  onClick,
}: {
  icon: ReactNode;
  title: string;
  subtitle: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 px-3 py-3 text-left transition hover:bg-muted/50"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
    </button>
  );
}

function DiscountCard({
  offer,
  totalPoints,
  onRedeem,
}: {
  offer: DiscountOffer;
  totalPoints: number;
  onRedeem: () => void;
}) {
  const ok = totalPoints >= offer.costPoints;
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="bg-gradient-to-br from-indigo-500/20 to-violet-500/10 px-3 py-3">
        <span className="inline-block rounded-full bg-background/80 px-2 py-0.5 text-[10px] font-medium">{offer.badge}</span>
        <p className="mt-2 text-sm font-bold leading-tight">{offer.brand}</p>
        <p className="text-lg font-bold text-emerald-700 dark:text-emerald-400">{offer.title}</p>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-3">
        <p className="flex-1 text-xs text-muted-foreground">{offer.description}</p>
        <div className="flex items-center gap-1 text-xs font-semibold text-amber-600">
          <Leaf className="h-3.5 w-3.5" />
          {offer.costPoints} pts
        </div>
        <Button size="sm" className="w-full rounded-xl" disabled={!ok} onClick={onRedeem}>
          {ok ? 'Resgatar' : `Faltam ${offer.costPoints - totalPoints} pts`}
        </Button>
      </div>
    </div>
  );
}

function ContributionPanel({
  userTotalEur,
  formatCurrency,
  onRefresh,
}: {
  userTotalEur: number;
  formatCurrency: (n: number) => string;
  onRefresh: () => void;
}) {
  return (
    <section className="space-y-4">
      <div className="rounded-2xl border border-border bg-gradient-to-br from-emerald-500/10 to-teal-500/5 p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-sm font-semibold">Impacto global</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {MOCK_GLOBAL_CONTRIBUTORS.toLocaleString()} pessoas contribuíram
            </p>
          </div>
          <button type="button" className="text-xs font-medium text-sky-600 dark:text-sky-400" onClick={() => onRefresh()}>
            Atualizar
          </button>
        </div>
        <p className="mt-3 break-all text-2xl font-bold tabular-nums leading-tight">
          {formatCurrency(MOCK_GLOBAL_DONATIONS_EUR)}
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold">A tua contribuição</p>
          <Users className="h-4 w-4 text-muted-foreground" />
        </div>
        <p className="mt-1 text-xs text-muted-foreground">Total doado por ti (via Store)</p>
        <p className="mt-2 text-3xl font-bold tabular-nums">{formatCurrency(userTotalEur)}</p>
      </div>

      <div className="flex gap-2 rounded-xl border border-dashed border-border p-3 text-xs text-muted-foreground">
        <Sparkles className="h-4 w-4 shrink-0 text-amber-500" />
        Os valores globais são demonstrativos; o teu total é guardado neste dispositivo.
      </div>
    </section>
  );
}
