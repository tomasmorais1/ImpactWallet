import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  ArrowLeft,
  ChevronRight,
  Heart,
  Info,
  Leaf,
  Repeat,
  Sparkles,
  Users,
  Share2,
  MapPin,
} from 'lucide-react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Switch } from './ui/switch';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';
import { cn } from './ui/utils';
import { useSettings } from '../contexts/SettingsContext';
import impactPointsLogo from '../assets/impact-points-logo.png';
import {
  CHARITIES,
  DISCOUNT_OFFERS,
  DONATION_EURO_AMOUNTS,
  LEIRIA_CAMPAIGN_ABOUT,
  LEIRIA_CAMPAIGN_GOAL_EUR,
  LEIRIA_CAMPAIGN_GOAL_POINTS,
  LEIRIA_CAMPAIGN_ID,
  MOCK_GLOBAL_CONTRIBUTORS,
  addLeiriaCampaignPoints,
  getLeiriaCampaignRaisedPoints,
  MOCK_GLOBAL_DONATIONS_EUR,
  POINTS_PER_EURO,
  USER_DONATION_BY_CHARITY_KEY,
  USER_DONATION_TOTAL_KEY,
  type Charity,
  type DiscountOffer,
  eurosToPoints,
  pointsToEuros,
} from '../lib/storeCatalog';
import { toast } from 'sonner';

export interface StoreGroupOption {
  id: string;
  name: string;
}

export interface GroupDonationVotePayload {
  groupId: string;
  ngoId: string;
  ngoName: string;
  euroAmount: number;
  points: number;
}

interface StoreProps {
  totalPoints: number;
  onRedeem: (cost: number, label: string) => void;
  isGroupAdmin?: boolean;
  adminGroups?: StoreGroupOption[];
  onCreateGroupDonationVote?: (payload: GroupDonationVotePayload) => void;
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

function LeiriaCampaignCard({ onOpen }: { onOpen: () => void }) {
  const raised = getLeiriaCampaignRaisedPoints();
  const goal = LEIRIA_CAMPAIGN_GOAL_POINTS;
  const pct = Math.min(100, (raised / goal) * 100);
  const raisedEur = pointsToEuros(raised);

  return (
    <button
      type="button"
      onClick={onOpen}
      className={cn(
        'relative w-full overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-br p-4 text-left text-white shadow-lg transition hover:opacity-[0.98] active:scale-[0.99]',
        'from-teal-700/95 via-emerald-800/95 to-teal-950/90 dark:from-teal-950 dark:via-emerald-950 dark:to-zinc-950',
      )}
    >
      <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/10 blur-xl" />
      <div className="pointer-events-none absolute -bottom-6 left-1/3 h-20 w-20 rounded-full bg-amber-400/15 blur-xl" />

      <div className="relative flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
          <MapPin className="h-5 w-5 text-white" strokeWidth={2.25} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-bold leading-tight tracking-tight">Ajuda Leiria</h3>
          <p className="mt-1 text-xs leading-snug text-white/85">
            Contribuição global da comunidade Impact Wallet para apoiar projetos na região.
          </p>
        </div>
        <ChevronRight className="mt-1 h-5 w-5 shrink-0 text-white/70" aria-hidden />
      </div>

      <div className="relative mt-4 space-y-2">
        <div className="flex items-baseline justify-between gap-2 text-xs font-medium tabular-nums">
          <span className="text-white">
            {raised.toLocaleString('pt-PT')} pts
            <span className="ml-1 font-normal text-white/70">
              (~{raisedEur.toLocaleString('pt-PT', { maximumFractionDigits: 0 })} €)
            </span>
          </span>
          <span className="shrink-0 text-white/80">
            {goal.toLocaleString('pt-PT')} pts · {LEIRIA_CAMPAIGN_GOAL_EUR.toLocaleString('pt-PT')} €
          </span>
        </div>
        <Progress value={pct} className="h-2.5 bg-white/20" indicatorClassName="bg-white shadow-sm" />
      </div>
    </button>
  );
}

export function Store({
  totalPoints,
  onRedeem,
  isGroupAdmin = false,
  adminGroups = [],
  onCreateGroupDonationVote,
}: StoreProps) {
  const { formatCurrency } = useSettings();

  const [tab, setTab] = useState<StoreTab>('donations');
  const [detail, setDetail] = useState<Charity | null>(null);
  const [leiriaDetailOpen, setLeiriaDetailOpen] = useState(false);
  const [donateOpen, setDonateOpen] = useState(false);
  const [groupDonateOpen, setGroupDonateOpen] = useState(false);
  const [selectedEur, setSelectedEur] = useState<number>(10);
  const [recurring, setRecurring] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<string>('');
  const [userDonationEur, setUserDonationEur] = useState(readUserDonationEur);
  const [leiriaProgressKey, setLeiriaProgressKey] = useState(0);

  const refreshUserTotal = useCallback(() => setUserDonationEur(readUserDonationEur()), []);

  useEffect(() => {
    if (tab === 'contribution') refreshUserTotal();
  }, [tab, refreshUserTotal]);

  const charityUserTotal = useMemo(() => {
    if (!detail) return 0;
    return readDonationByCharity()[detail.id] || 0;
  }, [detail, userDonationEur]);

  const userLeiriaCampaignEur = useMemo(
    () => readDonationByCharity()[LEIRIA_CAMPAIGN_ID] || 0,
    [userDonationEur],
  );

  const donationRecipient = useMemo(() => {
    if (detail) return { id: detail.id, name: detail.name };
    if (leiriaDetailOpen) return { id: LEIRIA_CAMPAIGN_ID, name: 'Ajuda Leiria' };
    return null;
  }, [detail, leiriaDetailOpen]);

  const selectedGroup = useMemo(
    () => adminGroups.find((group) => group.id === selectedGroupId) ?? null,
    [adminGroups, selectedGroupId],
  );

  const openDonate = () => setDonateOpen(true);
  const openDonateInGroup = () => setGroupDonateOpen(true);

  const netToCharity = (eur: number) => Math.max(0, eur * 0.865);

  const confirmDonation = () => {
    const recipient = donationRecipient;
    if (!recipient) return;

    const pts = eurosToPoints(selectedEur);

    if (totalPoints < pts) {
      toast.error('Não tens pontos suficientes.');
      return;
    }

    onRedeem(pts, `Doação ${selectedEur} € · ${recipient.name}`);
    persistDonation(recipient.id, selectedEur);

    if (recipient.id === LEIRIA_CAMPAIGN_ID) {
      addLeiriaCampaignPoints(pts);
      setLeiriaProgressKey((k) => k + 1);
    }

    refreshUserTotal();

    toast.success(
      recurring
        ? `Doação recorrente ativada: ${selectedEur} € / mês em pontos para ${recipient.name}`
        : `Doação de ${selectedEur} € registada para ${recipient.name}`,
    );

    setDonateOpen(false);
    setRecurring(false);
  };

  const confirmGroupDonationVote = () => {
    const recipient = donationRecipient;
    if (!recipient) return;

    if (!selectedGroupId) {
      toast.error('Seleciona um grupo.');
      return;
    }

    const pts = eurosToPoints(selectedEur);

    if (totalPoints < pts) {
      toast.error('Não tens pontos suficientes.');
      return;
    }

    onCreateGroupDonationVote?.({
      groupId: selectedGroupId,
      ngoId: recipient.id,
      ngoName: recipient.name,
      euroAmount: selectedEur,
      points: pts,
    });

    toast.success(`Votação criada no chat do grupo para ${recipient.name}`);
    setGroupDonateOpen(false);
    setSelectedGroupId('');
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
    <div className="pb-4">
      <div className="relative overflow-hidden rounded-b-[1.75rem] bg-gradient-to-b from-teal-500 via-emerald-500 via-emerald-600 to-teal-800 px-4 pb-5 pt-4 text-white dark:from-teal-950 dark:via-emerald-950 dark:via-cyan-950/40 dark:to-emerald-950">
        <div className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-12 h-48 w-48 rounded-full bg-emerald-400/25 blur-2xl dark:bg-cyan-500/20" />

        <div className="relative flex items-center justify-between gap-3">
          <h1 className="text-xl font-bold tracking-tight text-white drop-shadow-sm">Store</h1>
          <div className="flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-3 py-1.5 shadow-sm backdrop-blur-sm">
            <img
              src={impactPointsLogo}
              alt=""
              className="h-6 w-6 object-contain drop-shadow-[0_1px_3px_rgba(0,0,0,0.35)]"
            />
            <span className="text-base font-bold tabular-nums text-white">
              {totalPoints.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="relative mt-4 flex rounded-2xl border border-white/20 bg-black/15 p-1 backdrop-blur-md dark:bg-black/25">
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
                setLeiriaDetailOpen(false);
              }}
              className={cn(
                'flex-1 rounded-xl py-2.5 text-center text-sm transition-all',
                tab === id
                  ? 'bg-white font-bold text-teal-900 shadow-md dark:bg-white/20 dark:text-white dark:shadow-none'
                  : 'font-medium text-white/80 hover:text-white dark:text-white/70',
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4 px-4 pt-4">
        {tab === 'donations' && !detail && !leiriaDetailOpen && (
          <section className="space-y-3">
            <p className="text-sm text-muted-foreground">Campanha</p>
            <LeiriaCampaignCard
              key={leiriaProgressKey}
              onOpen={() => {
                setDetail(null);
                setLeiriaDetailOpen(true);
              }}
            />

            <p className="text-sm text-muted-foreground">Instituições de caridade</p>
            <div className="grid grid-cols-2 gap-3">
              {CHARITIES.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    setLeiriaDetailOpen(false);
                    setDetail(c);
                  }}
                  className="group relative aspect-[4/5] overflow-hidden rounded-2xl border border-border/60 text-left shadow-sm transition hover:opacity-[0.98] active:scale-[0.99]"
                >
                  {c.image ? (
                    <>
                      <img
                        src={c.image}
                        alt={c.name}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/25" />
                    </>
                  ) : (
                    <div className={cn('absolute inset-0 bg-gradient-to-br', c.gradient)} />
                  )}

                  <div className="absolute left-3 top-3 flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-white/95 p-1 shadow-md dark:bg-zinc-900/90">
                    {c.logo ? (
                      <img src={c.logo} alt={c.name} className="h-6 w-6 object-contain" />
                    ) : (
                      <span className="text-xl">{c.logoEmoji}</span>
                    )}
                  </div>

                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-3 pt-10">
                    <p className="line-clamp-2 text-sm font-bold leading-tight text-white">{c.name}</p>
                    <p className="mt-1 line-clamp-2 text-[11px] leading-snug text-white/85">
                      {c.tagline}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {tab === 'donations' && leiriaDetailOpen && !detail && (
          <LeiriaCampaignDetail
            userToCampaignEur={userLeiriaCampaignEur}
            globalUserTotalEur={userDonationEur}
            formatCurrency={formatCurrency}
            onBack={() => setLeiriaDetailOpen(false)}
            onDonate={openDonate}
            onDonateInGroup={openDonateInGroup}
            onSelectCharity={(c) => {
              setLeiriaDetailOpen(false);
              setDetail(c);
            }}
            isGroupAdmin={isGroupAdmin}
            adminGroups={adminGroups}
          />
        )}

        {tab === 'donations' && detail && (
          <CharityDetail
            charity={detail}
            userToThisCharityEur={charityUserTotal}
            formatCurrency={formatCurrency}
            onBack={() => setDetail(null)}
            onDonate={openDonate}
            onDonateInGroup={openDonateInGroup}
            onSelectCharity={(c) => setDetail(c)}
            globalUserTotalEur={userDonationEur}
            isGroupAdmin={isGroupAdmin}
            adminGroups={adminGroups}
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
            onRefresh={refreshUserTotal}
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
                {detail?.name ?? (leiriaDetailOpen ? 'Ajuda Leiria' : 'Instituição')} · equivalência{' '}
                {POINTS_PER_EURO} pts = 1 €
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
                <strong className="text-foreground">
                  {formatCurrency(netToCharity(selectedEur))}
                </strong>{' '}
                após taxas (valor indicativo).
              </span>
            </div>

            <Button
              type="button"
              className="mt-5 h-12 w-full rounded-2xl bg-foreground text-background hover:bg-foreground/90"
              onClick={confirmDonation}
              disabled={!donationRecipient || totalPoints < eurosToPoints(selectedEur)}
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

        <Sheet open={groupDonateOpen} onOpenChange={setGroupDonateOpen}>
          <SheetContent
            side="bottom"
            className="max-h-[88vh] overflow-y-auto rounded-t-2xl border-t bg-background px-4 pb-8 pt-3 sm:mx-auto sm:max-w-md"
          >
            <SheetHeader className="space-y-1 text-left">
              <SheetTitle className="text-lg">Doar em grupo</SheetTitle>
              <p className="text-sm text-muted-foreground">
                Cria uma votação no chat do grupo para{' '}
                {detail?.name ?? (leiriaDetailOpen ? 'Ajuda Leiria' : 'a instituição selecionada')}
              </p>
            </SheetHeader>

            <div className="mt-4 space-y-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">Seleciona o grupo</label>

                {adminGroups.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-border bg-muted/30 p-3 text-sm text-muted-foreground">
                    Não tens grupos onde sejas admin.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {adminGroups.map((group) => {
                      const isSelected = selectedGroupId === group.id;

                      return (
                        <button
                          key={group.id}
                          type="button"
                          onClick={() => setSelectedGroupId(group.id)}
                          className={cn(
                            'flex w-full items-center justify-between rounded-xl border p-3 text-left transition',
                            isSelected
                              ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30'
                              : 'border-border bg-muted/20 hover:bg-muted/40',
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                              <Users className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">{group.name}</p>
                              <p className="text-xs text-muted-foreground">Admin group</p>
                            </div>
                          </div>

                          {isSelected && <span className="text-xs font-semibold text-emerald-600">Selecionado</span>}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="rounded-xl border border-dashed border-border bg-muted/20 p-3 text-xs text-muted-foreground">
                Vai ser criada uma votação no chat do grupo para aprovar a doação de{' '}
                <strong className="text-foreground">{selectedEur} €</strong>{' '}
                ({eurosToPoints(selectedEur).toLocaleString()} pts)
                {selectedGroup ? (
                  <>
                    {' '}para o grupo <strong className="text-foreground">{selectedGroup.name}</strong>.
                  </>
                ) : (
                  '.'
                )}
              </div>

              <Button
                type="button"
                className="h-12 w-full rounded-2xl bg-emerald-600 text-white hover:bg-emerald-700"
                onClick={confirmGroupDonationVote}
                disabled={!donationRecipient || adminGroups.length === 0 || !selectedGroupId}
              >
                Criar votação no grupo
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}

function LeiriaCampaignDetail({
  userToCampaignEur,
  globalUserTotalEur,
  formatCurrency,
  onBack,
  onDonate,
  onDonateInGroup,
  onSelectCharity,
  isGroupAdmin,
  adminGroups,
}: {
  userToCampaignEur: number;
  globalUserTotalEur: number;
  formatCurrency: (n: number) => string;
  onBack: () => void;
  onDonate: () => void;
  onDonateInGroup: () => void;
  onSelectCharity: (c: Charity) => void;
  isGroupAdmin: boolean;
  adminGroups: StoreGroupOption[];
}) {
  const raised = getLeiriaCampaignRaisedPoints();
  const goal = LEIRIA_CAMPAIGN_GOAL_POINTS;
  const pct = Math.min(100, (raised / goal) * 100);
  const raisedEur = pointsToEuros(raised);
  const others = CHARITIES.slice(0, 6);
  const networkTotalDemo = 89_732.5;

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

        <button
          type="button"
          className="ml-auto flex h-9 w-9 items-center justify-center rounded-full bg-muted"
          aria-label="Partilhar"
        >
          <Share2 className="h-4 w-4" />
        </button>
      </div>

      <div
        className={cn(
          'relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br p-6 text-white shadow-lg',
          'from-teal-700 via-emerald-800 to-teal-950 dark:from-teal-950 dark:via-emerald-950 dark:to-zinc-950',
        )}
      >
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-10 left-1/4 h-32 w-32 rounded-full bg-amber-400/15 blur-2xl" />

        <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-white/20 backdrop-blur">
          <MapPin className="h-7 w-7 text-white" strokeWidth={2.25} />
        </div>

        <h2 className="mt-4 text-2xl font-bold leading-tight">Ajuda Leiria</h2>
        <p className="mt-2 text-sm leading-snug text-white/85">
          Objetivo da comunidade: {goal.toLocaleString('pt-PT')} pts ·{' '}
          {LEIRIA_CAMPAIGN_GOAL_EUR.toLocaleString('pt-PT')} €
        </p>

        <div className="relative mt-4 space-y-2">
          <div className="flex justify-between text-xs font-medium tabular-nums text-white/90">
            <span>
              {raised.toLocaleString('pt-PT')} pts (~
              {raisedEur.toLocaleString('pt-PT', { maximumFractionDigits: 0 })} €)
            </span>
            <span className="text-white/75">global</span>
          </div>
          <Progress value={pct} className="h-2.5 bg-white/20" indicatorClassName="bg-white shadow-sm" />
        </div>

        <p className="relative mt-4 text-3xl font-bold tabular-nums">
          {formatCurrency(userToCampaignEur)}
        </p>
        <p className="relative mt-1 text-xs text-white/80">Contribuído por ti para esta campanha</p>

        <div className="relative mt-5 flex gap-2">
          <Button
            type="button"
            onClick={onDonate}
            className="h-11 rounded-full bg-white/20 px-6 text-white backdrop-blur hover:bg-white/30"
          >
            <Heart className="mr-2 h-4 w-4 fill-white/30" />
            Doar
          </Button>

          {isGroupAdmin && adminGroups.length > 0 && (
            <Button
              type="button"
              onClick={onDonateInGroup}
              className="h-11 rounded-full bg-white px-6 text-teal-900 hover:bg-white/90"
            >
              <Users className="mr-2 h-4 w-4" />
              Doar em grupo
            </Button>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold">Mais formas de doar</h3>
        <div className="mt-2 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
          <RowAction
            icon={<img src={impactPointsLogo} alt="" className="h-5 w-5 object-contain" />}
            title="Doar com pontos"
            subtitle="Escolhe o montante em euros e paga em pontos (100 pts = 1 €)"
            onClick={onDonate}
          />
          <RowAction
            icon={<Repeat className="h-5 w-5 text-sky-500" />}
            title="Doação recorrente"
            subtitle="No ecrã de doação, ativa a renovação mensal em pontos"
            onClick={onDonate}
          />
          {isGroupAdmin && adminGroups.length > 0 && (
            <RowAction
              icon={<Users className="h-5 w-5 text-emerald-600" />}
              title="Doar em grupo"
              subtitle="Cria uma votação no chat do grupo"
              onClick={onDonateInGroup}
            />
          )}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold">Sobre a campanha</h3>
        <p className="mt-2 whitespace-pre-line rounded-2xl border border-border bg-muted/40 p-4 text-sm leading-relaxed text-muted-foreground">
          {LEIRIA_CAMPAIGN_ABOUT}
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-muted/30 p-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Contribuições Impact Wallet a esta campanha</span>
        </div>
        <div className="mt-2 flex items-end justify-between gap-2">
          <span className="text-sm text-muted-foreground">Total angariado (demonstrativo)</span>
          <span className="text-lg font-bold tabular-nums">{formatCurrency(networkTotalDemo)}</span>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          O teu total global em doações (todas as instituições e campanhas):{' '}
          <strong className="text-foreground">{formatCurrency(globalUserTotalEur)}</strong>
        </p>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Instituições de caridade</h3>
        </div>
        <div className="mt-3 flex gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {others.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => onSelectCharity(c)}
              className="w-36 shrink-0 overflow-hidden rounded-xl border border-border text-left shadow-sm"
            >
              {c.image ? (
                <img src={c.image} alt="" className="h-24 w-full object-cover" />
              ) : (
                <div className={cn('h-24 bg-gradient-to-br', c.gradient)} />
              )}
              <div className="p-2">
                <p className="text-xs font-semibold leading-tight">{c.name}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <p className="text-center text-[10px] text-muted-foreground">
        Valores demonstrativos · Impact Wallet
      </p>
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
  onDonateInGroup,
  onSelectCharity,
  isGroupAdmin,
  adminGroups,
}: {
  charity: Charity;
  userToThisCharityEur: number;
  globalUserTotalEur: number;
  formatCurrency: (n: number) => string;
  onBack: () => void;
  onDonate: () => void;
  onDonateInGroup: () => void;
  onSelectCharity: (c: Charity) => void;
  isGroupAdmin: boolean;
  adminGroups: StoreGroupOption[];
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

        <button
          type="button"
          className="ml-auto flex h-9 w-9 items-center justify-center rounded-full bg-muted"
          aria-label="Partilhar"
        >
          <Share2 className="h-4 w-4" />
        </button>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-white/10 shadow-lg">
        {charity.image ? (
          <img
            src={charity.image}
            alt={charity.name}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className={cn('absolute inset-0 bg-gradient-to-br', charity.gradient)} />
        )}

        <div className="absolute inset-0 bg-black/50" />

        <div className="relative p-6 text-white">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/95 text-2xl shadow-md dark:bg-zinc-900/90">
            {charity.logo ? (
              <img src={charity.logo} alt={charity.name} className="h-8 w-8 object-contain" />
            ) : (
              charity.logoEmoji
            )}
          </div>

          <h2 className="mt-4 text-2xl font-bold leading-tight">{charity.name}</h2>
          <p className="mt-2 text-3xl font-bold tabular-nums">{formatCurrency(userToThisCharityEur)}</p>
          <p className="mt-1 text-xs text-white/80">Contribuído por ti para esta instituição</p>

          <div className="mt-5 flex gap-2">
            <Button
              type="button"
              onClick={onDonate}
              className="h-11 rounded-full bg-white/20 px-6 text-white backdrop-blur hover:bg-white/30"
            >
              <Heart className="mr-2 h-4 w-4 fill-white/30" />
              Doar
            </Button>

            {isGroupAdmin && adminGroups.length > 0 && (
              <Button
                type="button"
                onClick={onDonateInGroup}
                className="h-11 rounded-full bg-white px-6 text-teal-900 hover:bg-white/90"
              >
                <Users className="mr-2 h-4 w-4" />
                Doar em grupo
              </Button>
            )}
          </div>
        </div>
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
          {isGroupAdmin && adminGroups.length > 0 && (
            <RowAction
              icon={<Users className="h-5 w-5 text-emerald-600" />}
              title="Doar em grupo"
              subtitle="Cria uma votação no chat do grupo"
              onClick={onDonateInGroup}
            />
          )}
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
          O teu total global em doações:{' '}
          <strong className="text-foreground">{formatCurrency(globalUserTotalEur)}</strong>
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

      <p className="text-center text-[10px] text-muted-foreground">
        Valores demonstrativos · Impact Wallet
      </p>
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
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
        {icon}
      </span>
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
        <span className="inline-block rounded-full bg-background/80 px-2 py-0.5 text-[10px] font-medium">
          {offer.badge}
        </span>
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
          <button
            type="button"
            className="text-xs font-medium text-sky-600 dark:text-sky-400"
            onClick={onRefresh}
          >
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
