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
  CheckCircle2,
  Plus,
  CreditCard,
} from 'lucide-react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Switch } from './ui/switch';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';
import { cn } from './ui/utils';
import { useSettings, type Translations } from '../contexts/SettingsContext';
import impactPointsLogo from '../assets/impact-points-logo.png';
import {
  CHARITIES,
  COMPLETED_CAMPAIGNS,
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
  type CompletedCampaign,
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
  onBuyPoints: (points: number, euroAmount: number) => void;
  isGroupAdmin?: boolean;
  adminGroups?: StoreGroupOption[];
  onCreateGroupDonationVote?: (payload: GroupDonationVotePayload) => void;
}

type StoreTab = 'donations' | 'discounts' | 'contribution';

type BuyPointsPack = {
  id: string;
  euro: number;
  points: number;
  labelKey: 'starter' | 'popular' | 'bestValue' | 'premiumTitle';
};

const BUY_POINTS_PACKS: BuyPointsPack[] = [
  { id: 'pack-5', euro: 4.99, points: 500, labelKey: 'starter' },
  { id: 'pack-10', euro: 9.99, points: 1000, labelKey: 'popular' },
  { id: 'pack-25', euro: 24.99, points: 2500, labelKey: 'bestValue' },
  { id: 'pack-50', euro: 49.99, points: 5000, labelKey: 'premiumTitle' },
];

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

function makeFormatPoints(formatNumber: (n: number, options?: Intl.NumberFormatOptions) => string) {
  return (value: number) => formatNumber(value, { maximumFractionDigits: 0 });
}

function CompletedCampaignRow({
  campaign,
  t,
  formatPoints,
}: {
  campaign: CompletedCampaign;
  t: Translations;
  formatPoints: (n: number) => string;
}) {
  const pct = Math.min(100, (campaign.raisedPoints / campaign.goalPoints) * 100);

  return (
    <div className="rounded-xl border border-border bg-muted/30 p-3 dark:bg-zinc-900/40">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-semibold leading-tight">{campaign.name}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{campaign.subtitle}</p>
        </div>
        <span className="flex shrink-0 items-center gap-0.5 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-medium text-emerald-800 dark:text-emerald-300">
          <CheckCircle2 className="h-3 w-3" aria-hidden />
          {t.completed}
        </span>
      </div>
      <div className="mt-2 flex items-center justify-between gap-2 text-[11px] text-muted-foreground">
        <span>
          {formatPoints(campaign.raisedPoints)} / {formatPoints(campaign.goalPoints)} {t.pointsShort}
        </span>
        <span>{campaign.completedLabel}</span>
      </div>
      <Progress
        value={pct}
        className="mt-1.5 h-1.5 bg-muted"
        indicatorClassName="bg-emerald-600 dark:bg-emerald-500"
      />
    </div>
  );
}

function LeiriaCampaignCard({
  onOpen,
  t,
  formatPoints,
  formatCurrency,
}: {
  onOpen: () => void;
  t: Translations;
  formatPoints: (n: number) => string;
  formatCurrency: (n: number) => string;
}) {
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
            {t.contributionGlobalCommunityLeiria}
          </p>
        </div>
        <ChevronRight className="mt-1 h-5 w-5 shrink-0 text-white/70" aria-hidden />
      </div>

      <div className="relative mt-4 space-y-2">
        <div className="flex items-baseline justify-between gap-2 text-xs font-medium tabular-nums">
          <span className="text-white">
            {formatPoints(raised)} {t.pointsShort}
            <span className="ml-1 font-normal text-white/70">(~{formatCurrency(raisedEur)})</span>
          </span>
          <span className="shrink-0 text-white/80">
            {formatPoints(goal)} {t.pointsShort} · {formatCurrency(LEIRIA_CAMPAIGN_GOAL_EUR)}
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
  onBuyPoints,
  isGroupAdmin = false,
  adminGroups = [],
  onCreateGroupDonationVote,
}: StoreProps) {
  const { formatCurrency, formatNumber, t } = useSettings();
  const formatPoints = makeFormatPoints(formatNumber);

  const [tab, setTab] = useState<StoreTab>('donations');
  const [detail, setDetail] = useState<Charity | null>(null);
  const [leiriaDetailOpen, setLeiriaDetailOpen] = useState(false);
  const [donateOpen, setDonateOpen] = useState(false);
  const [groupDonateOpen, setGroupDonateOpen] = useState(false);
  const [buyPointsOpen, setBuyPointsOpen] = useState(false);
  const [selectedPack, setSelectedPack] = useState<BuyPointsPack>(BUY_POINTS_PACKS[1]);
  const [selectedEur, setSelectedEur] = useState<number>(10);
  const [recurring, setRecurring] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<string>('');
  const [userDonationEur, setUserDonationEur] = useState(readUserDonationEur);
  const [leiriaProgressKey, setLeiriaProgressKey] = useState(0);
  const [pastCampaignsOpen, setPastCampaignsOpen] = useState(false);

  const refreshUserTotal = useCallback(() => setUserDonationEur(readUserDonationEur()), []);

  const goToContributionCampanhas = useCallback(() => {
    setPastCampaignsOpen(false);
    setDetail(null);
    setLeiriaDetailOpen(false);
    setTab('contribution');
  }, []);

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
  const openBuyPoints = () => setBuyPointsOpen(true);

  const netToCharity = (eur: number) => Math.max(0, eur * 0.865);

  const handleConfirmBuyPoints = () => {
    onBuyPoints(selectedPack.points, selectedPack.euro);
    toast.success(`${t.buyPoints}: ${formatPoints(selectedPack.points)} ${t.pointsShort}`);
    setBuyPointsOpen(false);
  };

  const confirmDonation = () => {
    const recipient = donationRecipient;
    if (!recipient) return;

    const pts = eurosToPoints(selectedEur);

    if (totalPoints < pts) {
      toast.error(t.enoughPointsBuyMore);
      setDonateOpen(false);
      setBuyPointsOpen(true);
      return;
    }

    onRedeem(pts, `${t.donateWithPoints} · ${recipient.name}`);
    persistDonation(recipient.id, selectedEur);

    if (recipient.id === LEIRIA_CAMPAIGN_ID) {
      addLeiriaCampaignPoints(pts);
      setLeiriaProgressKey((k) => k + 1);
    }

    refreshUserTotal();

    toast.success(
      recurring
        ? `${t.recurringDonationActivatedFor} ${recipient.name}: ${formatCurrency(selectedEur)} ${t.perMonthText}`
        : `${t.donationRegisteredFor} ${recipient.name}: ${formatCurrency(selectedEur)}`,
    );

    setDonateOpen(false);
    setRecurring(false);
  };

  const confirmGroupDonationVote = () => {
    const recipient = donationRecipient;
    if (!recipient) return;

    if (!selectedGroupId) {
      toast.error(t.selectAGroup);
      return;
    }

    const pts = eurosToPoints(selectedEur);

    if (totalPoints < pts) {
      toast.error(t.enoughPointsBuyMore);
      setGroupDonateOpen(false);
      setBuyPointsOpen(true);
      return;
    }

    onCreateGroupDonationVote?.({
      groupId: selectedGroupId,
      ngoId: recipient.id,
      ngoName: recipient.name,
      euroAmount: selectedEur,
      points: pts,
    });

    toast.success(`${t.voteCreatedInGroupFor} ${recipient.name}`);
    setGroupDonateOpen(false);
    setSelectedGroupId('');
  };

  const redeemDiscount = (offer: DiscountOffer) => {
    if (totalPoints < offer.costPoints) {
      toast.error(t.notEnoughPoints);
      return;
    }

    onRedeem(offer.costPoints, `${t.storeDiscountsTab} ${offer.brand} · ${offer.title}`);
    toast.success(`${t.codeSent}: ${offer.brand} — ${offer.title}`);
  };

  return (
    <div className="pb-4">
      <div className="relative overflow-hidden rounded-b-[1.75rem] bg-gradient-to-b from-teal-500 via-emerald-500 via-emerald-600 to-teal-800 px-4 pb-5 pt-4 text-white dark:from-teal-950 dark:via-emerald-950 dark:via-cyan-950/40 dark:to-emerald-950">
        <div className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-12 h-48 w-48 rounded-full bg-emerald-400/25 blur-2xl dark:bg-cyan-500/20" />

        <div className="relative flex items-center justify-between gap-3">
          <h1 className="text-xl font-bold tracking-tight text-white drop-shadow-sm">{t.store}</h1>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={openBuyPoints}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-white/15 text-white shadow-sm backdrop-blur-sm transition hover:bg-white/20"
              aria-label={t.buyPoints}
            >
              <Plus className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-3 py-1.5 shadow-sm backdrop-blur-sm">
              <img
                src={impactPointsLogo}
                alt=""
                className="h-6 w-6 object-contain drop-shadow-[0_1px_3px_rgba(0,0,0,0.35)]"
              />
              <span className="text-base font-bold tabular-nums text-white">
                {formatPoints(totalPoints)}
              </span>
            </div>
          </div>
        </div>

        <div className="relative mt-4 flex rounded-2xl border border-white/20 bg-black/15 p-1 backdrop-blur-md dark:bg-black/25">
          {(
            [
              { id: 'donations' as const, label: t.storeDonationsTab },
              { id: 'discounts' as const, label: t.storeDiscountsTab },
              { id: 'contribution' as const, label: t.storeContributionTab },
            ] as const
          ).map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => {
                setTab(id);
                setDetail(null);
                setLeiriaDetailOpen(false);
                if (id !== 'donations') setPastCampaignsOpen(false);
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
            <button
              type="button"
              onClick={() => setPastCampaignsOpen((o) => !o)}
              className="flex w-full items-center justify-between gap-2 rounded-lg py-0.5 text-left text-sm text-muted-foreground transition hover:text-foreground"
            >
              <span className="flex items-center gap-1.5 font-medium">
                {t.campaigns}
                <span
                  className={cn(
                    'inline-block font-mono text-sm text-muted-foreground/90 transition-transform duration-300 ease-out',
                    pastCampaignsOpen && 'rotate-90',
                  )}
                  aria-hidden
                >
                  &gt;
                </span>
              </span>
            </button>

            <LeiriaCampaignCard
              key={leiriaProgressKey}
              onOpen={() => {
                setDetail(null);
                setLeiriaDetailOpen(true);
              }}
              t={t}
              formatPoints={formatPoints}
              formatCurrency={formatCurrency}
            />

            <div
              className={cn(
                'grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none',
                pastCampaignsOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
              )}
            >
              <div className="min-h-0 overflow-hidden">
                <div className="space-y-2 pt-1">
                  {COMPLETED_CAMPAIGNS.slice(0, 2).map((c) => (
                    <CompletedCampaignRow
                      key={c.id}
                      campaign={c}
                      t={t}
                      formatPoints={formatPoints}
                    />
                  ))}
                  <div className="flex justify-center pt-0.5">
                    <button
                      type="button"
                      onClick={goToContributionCampanhas}
                      className="text-xs font-medium text-teal-700 underline-offset-4 hover:underline dark:text-teal-400"
                    >
                      {t.seeMore}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-sm text-muted-foreground">{t.charities}</p>
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
                      <img src={c.image} alt={c.name} className="absolute inset-0 h-full w-full object-cover" />
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
                    <p className="mt-1 line-clamp-2 text-[11px] leading-snug text-white/85">{c.tagline}</p>
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
            formatPoints={formatPoints}
            onBack={() => setLeiriaDetailOpen(false)}
            onDonate={openDonate}
            onDonateInGroup={openDonateInGroup}
            onSelectCharity={(c) => {
              setLeiriaDetailOpen(false);
              setDetail(c);
            }}
            isGroupAdmin={isGroupAdmin}
            adminGroups={adminGroups}
            t={t}
          />
        )}

        {tab === 'donations' && detail && (
          <CharityDetail
            charity={detail}
            userToThisCharityEur={charityUserTotal}
            globalUserTotalEur={userDonationEur}
            formatCurrency={formatCurrency}
            onBack={() => setDetail(null)}
            onDonate={openDonate}
            onDonateInGroup={openDonateInGroup}
            onSelectCharity={(c) => setDetail(c)}
            isGroupAdmin={isGroupAdmin}
            adminGroups={adminGroups}
            t={t}
          />
        )}

        {tab === 'discounts' && (
          <section className="space-y-3">
            <p className="text-sm text-muted-foreground">{t.fixedOffersDescription}</p>
            <div className="grid grid-cols-2 gap-3">
              {DISCOUNT_OFFERS.map((offer) => (
                <DiscountCard
                  key={offer.id}
                  offer={offer}
                  totalPoints={totalPoints}
                  onRedeem={() => redeemDiscount(offer)}
                  t={t}
                  formatPoints={formatPoints}
                />
              ))}
            </div>
          </section>
        )}

        {tab === 'contribution' && (
          <ContributionPanel
            userTotalEur={userDonationEur}
            formatCurrency={formatCurrency}
            formatNumber={formatNumber}
            onRefresh={refreshUserTotal}
            t={t}
          />
        )}

        <Sheet open={donateOpen} onOpenChange={setDonateOpen}>
          <SheetContent
            side="bottom"
            className="max-h-[88vh] overflow-y-auto rounded-t-2xl border-t bg-background px-4 pb-8 pt-3 sm:mx-auto sm:max-w-md"
          >
            <SheetHeader className="space-y-1 text-left">
              <SheetTitle className="text-lg">{t.donateWithPoints}</SheetTitle>
              <p className="text-sm text-muted-foreground">
                {detail?.name ?? (leiriaDetailOpen ? 'Ajuda Leiria' : t.selectedInstitution)} · {t.pointsToEuroRate}{' '}
                {POINTS_PER_EURO} {t.pointsShort} = 1
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
                    <span className="text-lg font-bold tabular-nums">{formatCurrency(eur)}</span>
                    <span className="mt-1 flex items-center gap-1 text-xs font-medium text-muted-foreground">
                      <img src={impactPointsLogo} alt="" className="h-3.5 w-3.5 opacity-80" />
                      {formatPoints(pts)} {t.pointsShort}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 flex items-center justify-between rounded-xl border border-border bg-muted/30 px-3 py-2.5">
              <div className="flex items-center gap-2">
                <Repeat className="h-4 w-4 text-emerald-600" />
                <div>
                  <p className="text-sm font-medium">{t.recurringDonation}</p>
                  <p className="text-xs text-muted-foreground">{t.recurringDonationDesc}</p>
                </div>
              </div>
              <Switch checked={recurring} onCheckedChange={setRecurring} />
            </div>

            <div className="mt-4 flex gap-2 rounded-xl border border-dashed border-border bg-muted/20 p-3 text-xs text-muted-foreground">
              <Info className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                {t.estimatedNetAfterFees}{' '}
                <strong className="text-foreground">{formatCurrency(netToCharity(selectedEur))}</strong>.
              </span>
            </div>

            <Button
              type="button"
              className="mt-5 h-12 w-full rounded-2xl bg-foreground text-background hover:bg-foreground/90"
              onClick={confirmDonation}
              disabled={!donationRecipient}
            >
              {t.confirmDonation} · {formatPoints(eurosToPoints(selectedEur))} {t.pointsShort}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="mt-2 h-11 w-full rounded-2xl"
              onClick={openBuyPoints}
            >
              <CreditCard className="mr-2 h-4 w-4" />
              {t.buyPoints}
            </Button>
          </SheetContent>
        </Sheet>

        <Sheet open={groupDonateOpen} onOpenChange={setGroupDonateOpen}>
          <SheetContent
            side="bottom"
            className="max-h-[88vh] overflow-y-auto rounded-t-2xl border-t bg-background px-4 pb-8 pt-3 sm:mx-auto sm:max-w-md"
          >
            <SheetHeader className="space-y-1 text-left">
              <SheetTitle className="text-lg">{t.donateInGroup}</SheetTitle>
              <p className="text-sm text-muted-foreground">
                {t.createGroupVoteFor} {detail?.name ?? (leiriaDetailOpen ? 'Ajuda Leiria' : t.selectedInstitution)}
              </p>
            </SheetHeader>

            <div className="mt-4 space-y-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t.selectGroup}</label>

                {adminGroups.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-border bg-muted/30 p-3 text-sm text-muted-foreground">
                    {t.noAdminGroups}
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
                              <p className="text-xs text-muted-foreground">{t.adminGroup}</p>
                            </div>
                          </div>

                          {isSelected && (
                            <span className="text-xs font-semibold text-emerald-600">{t.selected}</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="rounded-xl border border-dashed border-border bg-muted/20 p-3 text-xs text-muted-foreground">
                {t.groupVoteSummaryPrefix}{' '}
                <strong className="text-foreground">{formatCurrency(selectedEur)}</strong>{' '}
                ({formatPoints(eurosToPoints(selectedEur))} {t.pointsShort})
                {selectedGroup ? (
                  <>
                    {' '}
                    {t.forGroup} <strong className="text-foreground">{selectedGroup.name}</strong>.
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
                {t.createGroupVote}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="h-11 w-full rounded-2xl"
                onClick={openBuyPoints}
              >
                <CreditCard className="mr-2 h-4 w-4" />
                {t.buyPoints}
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        <Sheet open={buyPointsOpen} onOpenChange={setBuyPointsOpen}>
          <SheetContent
            side="bottom"
            className="max-h-[90vh] overflow-y-auto rounded-t-2xl border-t bg-background px-4 pb-8 pt-3 sm:mx-auto sm:max-w-md"
          >
            <SheetHeader className="space-y-1 text-left">
              <SheetTitle className="text-lg">{t.buyPoints}</SheetTitle>
              <p className="text-sm text-muted-foreground">{t.buyPointsWithCard}</p>
            </SheetHeader>

            <div className="mt-4 rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 p-4 dark:border-emerald-900 dark:from-emerald-950/30 dark:to-teal-950/30">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm dark:bg-zinc-900">
                  <CreditCard className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{t.paymentWithCard}</p>
                  <p className="text-xs text-muted-foreground">{t.securePointsPurchaseSimulation}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              {BUY_POINTS_PACKS.map((pack) => {
                const isSelected = selectedPack.id === pack.id;
                const labelText =
                  pack.labelKey === 'starter'
                    ? t.starter
                    : pack.labelKey === 'popular'
                    ? t.popular
                    : pack.labelKey === 'bestValue'
                    ? t.bestValue
                    : t.premiumTitle;

                return (
                  <button
                    key={pack.id}
                    type="button"
                    onClick={() => setSelectedPack(pack)}
                    className={cn(
                      'rounded-2xl border-2 p-4 text-left transition',
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30'
                        : 'border-border bg-card hover:bg-muted/40',
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium">
                        {labelText}
                      </span>
                    </div>

                    <div className="mt-3 flex items-center gap-2">
                      <img src={impactPointsLogo} alt="" className="h-5 w-5 object-contain" />
                      <span className="text-lg font-bold">
                        {formatPoints(pack.points)} {t.pointsShort}
                      </span>
                    </div>

                    <p className="mt-2 text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                      {formatCurrency(pack.euro)}
                    </p>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 rounded-xl border border-dashed border-border bg-muted/20 p-3 text-xs text-muted-foreground">
              {t.buyPointsSummaryPrefix}{' '}
              <strong className="text-foreground">
                {formatPoints(selectedPack.points)} {t.pointsShort}
              </strong>{' '}
              por <strong className="text-foreground">{formatCurrency(selectedPack.euro)}</strong>.
            </div>

            <Button
              type="button"
              className="mt-5 h-12 w-full rounded-2xl bg-emerald-600 text-white hover:bg-emerald-700"
              onClick={handleConfirmBuyPoints}
            >
              {t.confirmPurchase}
            </Button>
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
  formatPoints,
  onBack,
  onDonate,
  onDonateInGroup,
  onSelectCharity,
  isGroupAdmin,
  adminGroups,
  t,
}: {
  userToCampaignEur: number;
  globalUserTotalEur: number;
  formatCurrency: (n: number) => string;
  formatPoints: (n: number) => string;
  onBack: () => void;
  onDonate: () => void;
  onDonateInGroup: () => void;
  onSelectCharity: (c: Charity) => void;
  isGroupAdmin: boolean;
  adminGroups: StoreGroupOption[];
  t: Translations;
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
          aria-label={t.backToHome}
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        <button
          type="button"
          className="ml-auto flex h-9 w-9 items-center justify-center rounded-full bg-muted"
          aria-label="share"
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
          {t.communityGoal}: {formatPoints(goal)} {t.pointsShort} · {formatCurrency(LEIRIA_CAMPAIGN_GOAL_EUR)}
        </p>

        <div className="relative mt-4 space-y-2">
          <div className="flex justify-between text-xs font-medium tabular-nums text-white/90">
            <span>
              {formatPoints(raised)} {t.pointsShort} (~{formatCurrency(raisedEur)})
            </span>
            <span className="text-white/75">{t.global}</span>
          </div>
          <Progress value={pct} className="h-2.5 bg-white/20" indicatorClassName="bg-white shadow-sm" />
        </div>

        <p className="relative mt-4 text-3xl font-bold tabular-nums">{formatCurrency(userToCampaignEur)}</p>
        <p className="relative mt-1 text-xs text-white/80">{t.contributedByYouToThisCampaign}</p>

        <div className="relative mt-5 flex gap-2">
          <Button
            type="button"
            onClick={onDonate}
            className="h-11 rounded-full bg-white/20 px-6 text-white backdrop-blur hover:bg-white/30"
          >
            <Heart className="mr-2 h-4 w-4 fill-white/30" />
            {t.donations}
          </Button>

          {isGroupAdmin && adminGroups.length > 0 && (
            <Button
              type="button"
              onClick={onDonateInGroup}
              className="h-11 rounded-full bg-white px-6 text-teal-900 hover:bg-white/90"
            >
              <Users className="mr-2 h-4 w-4" />
              {t.donateInGroup}
            </Button>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold">{t.moreWaysToGive}</h3>
        <div className="mt-2 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
          <RowAction
            icon={<img src={impactPointsLogo} alt="" className="h-5 w-5 object-contain" />}
            title={t.donateWithPoints}
            subtitle={`${t.chooseEuroAmountAndPayInPoints} (${POINTS_PER_EURO} ${t.pointsShort} = 1)`}
            onClick={onDonate}
          />
          <RowAction
            icon={<Repeat className="h-5 w-5 text-sky-500" />}
            title={t.recurringDonation}
            subtitle={t.activateMonthlyRenewalInPoints}
            onClick={onDonate}
          />
          {isGroupAdmin && adminGroups.length > 0 && (
            <RowAction
              icon={<Users className="h-5 w-5 text-emerald-600" />}
              title={t.donateInGroup}
              subtitle={t.createGroupVoteInChat}
              onClick={onDonateInGroup}
            />
          )}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold">{t.aboutCampaign}</h3>
        <p className="mt-2 whitespace-pre-line rounded-2xl border border-border bg-muted/40 p-4 text-sm leading-relaxed text-muted-foreground">
          {LEIRIA_CAMPAIGN_ABOUT}
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-muted/30 p-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{t.impactWalletContributionsThisCampaign}</span>
        </div>
        <div className="mt-2 flex items-end justify-between gap-2">
          <span className="text-sm text-muted-foreground">{t.totalRaisedDemo}</span>
          <span className="text-lg font-bold tabular-nums">{formatCurrency(networkTotalDemo)}</span>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          {t.yourGlobalDonationsAllInstitutions}{' '}
          <strong className="text-foreground">{formatCurrency(globalUserTotalEur)}</strong>
        </p>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">{t.charityInstitutions}</h3>
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
                <img src={c.image} alt={c.name} className="h-24 w-full object-cover" />
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

      <p className="text-center text-[10px] text-muted-foreground">{t.demoValuesImpactWallet}</p>
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
  t,
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
  t: Translations;
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
          aria-label={t.backToHome}
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        <button
          type="button"
          className="ml-auto flex h-9 w-9 items-center justify-center rounded-full bg-muted"
          aria-label="share"
        >
          <Share2 className="h-4 w-4" />
        </button>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-white/10 shadow-lg">
        {charity.image ? (
          <img src={charity.image} alt={charity.name} className="absolute inset-0 h-full w-full object-cover" />
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
          <p className="mt-1 text-xs text-white/80">{t.contributedByYouToThisInstitution}</p>

          <div className="mt-5 flex gap-2">
            <Button
              type="button"
              onClick={onDonate}
              className="h-11 rounded-full bg-white/20 px-6 text-white backdrop-blur hover:bg-white/30"
            >
              <Heart className="mr-2 h-4 w-4 fill-white/30" />
              {t.donations}
            </Button>

            {isGroupAdmin && adminGroups.length > 0 && (
              <Button
                type="button"
                onClick={onDonateInGroup}
                className="h-11 rounded-full bg-white px-6 text-teal-900 hover:bg-white/90"
              >
                <Users className="mr-2 h-4 w-4" />
                {t.donateInGroup}
              </Button>
            )}
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold">{t.moreWaysToGive}</h3>
        <div className="mt-2 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
          <RowAction
            icon={<img src={impactPointsLogo} alt="" className="h-5 w-5 object-contain" />}
            title={t.donateWithPoints}
            subtitle={t.useYourPointsToDoGood}
            onClick={onDonate}
          />
          <RowAction
            icon={<Repeat className="h-5 w-5 text-sky-500" />}
            title={t.recurringDonation}
            subtitle={t.setMonthlyAmountInPoints}
            onClick={onDonate}
          />
          {isGroupAdmin && adminGroups.length > 0 && (
            <RowAction
              icon={<Users className="h-5 w-5 text-emerald-600" />}
              title={t.donateInGroup}
              subtitle={t.createGroupVoteInChat}
              onClick={onDonateInGroup}
            />
          )}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold">{t.aboutCharity}</h3>
        <p className="mt-2 rounded-2xl border border-border bg-muted/40 p-4 text-sm leading-relaxed text-muted-foreground">
          {charity.about}
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-muted/30 p-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{t.impactWalletUserDonations}</span>
        </div>
        <div className="mt-2 flex items-end justify-between gap-2">
          <span className="text-sm text-muted-foreground">{t.totalDonatedEstimated}</span>
          <span className="text-lg font-bold tabular-nums">{formatCurrency(networkTotalDemo)}</span>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          {t.yourGlobalDonations}{' '}
          <strong className="text-foreground">{formatCurrency(globalUserTotalEur)}</strong>
        </p>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">{t.moreCharitiesToDiscover}</h3>
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
                <img src={c.image} alt={c.name} className="h-24 w-full object-cover" />
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

      <p className="text-center text-[10px] text-muted-foreground">{t.demoValuesImpactWallet}</p>
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
  t,
  formatPoints,
}: {
  offer: DiscountOffer;
  totalPoints: number;
  onRedeem: () => void;
  t: Translations;
  formatPoints: (n: number) => string;
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
          {formatPoints(offer.costPoints)} {t.pointsShort}
        </div>
        <Button size="sm" className="w-full rounded-xl" disabled={!ok} onClick={onRedeem}>
          {ok ? t.redeem : `${t.missing} ${formatPoints(offer.costPoints - totalPoints)} ${t.pointsShort}`}
        </Button>
      </div>
    </div>
  );
}

function ContributionPanel({
  userTotalEur,
  formatCurrency,
  formatNumber,
  onRefresh,
  t,
}: {
  userTotalEur: number;
  formatCurrency: (n: number) => string;
  formatNumber: (n: number, options?: Intl.NumberFormatOptions) => string;
  onRefresh: () => void;
  t: Translations;
}) {
  const [allCampaignsOpen, setAllCampaignsOpen] = useState(false);
  const previewCount = 3;
  const campaignsPreview = COMPLETED_CAMPAIGNS.slice(0, previewCount);
  const campaignsRest = COMPLETED_CAMPAIGNS.slice(previewCount);
  const hasMoreCampaigns = campaignsRest.length > 0;
  const formatPoints = makeFormatPoints(formatNumber);

  return (
    <section className="space-y-4">
      <div className="rounded-2xl border border-border bg-gradient-to-br from-emerald-500/10 to-teal-500/5 p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-sm font-semibold">{t.contributionGlobal}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {formatNumber(MOCK_GLOBAL_CONTRIBUTORS)} {t.peopleContributed}
            </p>
          </div>
          <button
            type="button"
            className="text-xs font-medium text-sky-600 dark:text-sky-400"
            onClick={onRefresh}
          >
            {t.refresh}
          </button>
        </div>
        <p className="mt-3 break-all text-2xl font-bold tabular-nums leading-tight">
          {formatCurrency(MOCK_GLOBAL_DONATIONS_EUR)}
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold">{t.yourContribution}</p>
          <Users className="h-4 w-4 text-muted-foreground" />
        </div>
        <p className="mt-1 text-xs text-muted-foreground">{t.donatedByYouViaStore}</p>
        <p className="mt-2 text-3xl font-bold tabular-nums">{formatCurrency(userTotalEur)}</p>
      </div>

      <div>
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold">{t.completedCampaigns}</h2>
          {hasMoreCampaigns && (
            <button
              type="button"
              onClick={() => setAllCampaignsOpen((o) => !o)}
              className="shrink-0 text-xs font-medium text-muted-foreground underline-offset-4 transition hover:text-foreground hover:underline"
            >
              {allCampaignsOpen ? t.seeLess : t.seeAll}
            </button>
          )}
        </div>

        <div className="mt-3 space-y-2">
          {campaignsPreview.map((c) => (
            <CompletedCampaignRow key={c.id} campaign={c} t={t} formatPoints={formatPoints} />
          ))}
        </div>

        {hasMoreCampaigns && (
          <div
            className={cn(
              'grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none',
              allCampaignsOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
            )}
          >
            <div className="min-h-0 overflow-hidden">
              <div className="space-y-2 pt-2">
                {campaignsRest.map((c) => (
                  <CompletedCampaignRow key={c.id} campaign={c} t={t} formatPoints={formatPoints} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2 rounded-xl border border-dashed border-border p-3 text-xs text-muted-foreground">
        <Sparkles className="h-4 w-4 shrink-0 text-amber-500" />
        {t.globalValuesDisclaimer}
      </div>
    </section>
  );
}