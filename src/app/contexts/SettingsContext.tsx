import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type CurrencyCode =
  | 'USD'
  | 'EUR'
  | 'GBP'
  | 'JPY'
  | 'CAD'
  | 'AUD'
  | 'CHF'
  | 'MXN'
  | 'BRL';

export type LanguageCode = 'en' | 'es' | 'fr' | 'de' | 'pt';

export interface Currency {
  code: CurrencyCode;
  symbol: string;
  name: string;
  locale: string;
}

export interface Language {
  code: LanguageCode;
  name: string;
  flag: string;
  locale: string;
}

export const CURRENCIES: Currency[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar', locale: 'en-US' },
  { code: 'EUR', symbol: '€', name: 'Euro', locale: 'pt-PT' },
  { code: 'GBP', symbol: '£', name: 'British Pound', locale: 'en-GB' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', locale: 'ja-JP' },
  { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar', locale: 'en-CA' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', locale: 'en-AU' },
  { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc', locale: 'de-CH' },
  { code: 'MXN', symbol: 'MX$', name: 'Mexican Peso', locale: 'es-MX' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real', locale: 'pt-BR' },
];

export const LANGUAGES: Language[] = [
  { code: 'en', name: 'English', flag: '🇺🇸', locale: 'en-US' },
  { code: 'es', name: 'Español', flag: '🇪🇸', locale: 'es-ES' },
  { code: 'fr', name: 'Français', flag: '🇫🇷', locale: 'fr-FR' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪', locale: 'de-DE' },
  { code: 'pt', name: 'Português', flag: '🇵🇹', locale: 'pt-PT' },
];

export type Translations = {
  home: string;
  profile: string;
  social: string;
  finance: string;
  store: string;

  settings: string;
  currency: string;
  language: string;
  darkMode: string;
  lightMode: string;
  appearance: string;
  preferences: string;
  settingsTitle: string;
  settingsDesc: string;

  budgetTracker: string;
  thisMonth: string;
  goal: string;
  spent: string;
  left: string;
  used: string;
  overBudget: string;
  remaining: string;
  vsLastMonth: string;

  impact: string;
  swipeUpToSeeMore: string;
  viewFullStats: string;
  yourImpact: string;
  impactSummaryDescription: string;
  donations: string;
  estimatedSavings: string;
  coffees: string;
  supportedOrganizations: string;
  donationsCount: string;
  total: string;
  saved: string;
  inCoffeeThisMonth: string;
  thisMonthLabel: string;
  inCoffee: string;
  vsAverageLast3Months: string;
  donatedToCausesYouChose: string;
  savedOnUnnecessaryExpenses: string;
  vsMonthsWithoutBudget: string;

  addPoints: string;
  move: string;
  data: string;
  achievements: string;
  impactPoints: string;
  impactPointsLogoAlt: string;

  welcomeBackSignedIn: string;
  impactPointsClaimed: string;
  successfullySentPoints: string;
  notEnoughPoints: string;
  pointRequestSent: string;

  groupVoteCreatedFor: string;
  inGroup: string;
  groupFallback: string;

  backToHome: string;
  premiumTitle: string;
  premiumSubtitle: string;
  premiumBenefit1: string;
  premiumBenefit2: string;
  premiumBenefit3: string;
  premiumBenefit4: string;
  premiumBenefit5: string;
  premiumBenefit6: string;
  monthlyPlan: string;
  perMonth: string;
  upgradeNow: string;
  premiumActivated: string;
  cancelAnytime: string;

  recentTransactions: string;
  seeAll: string;

  pointsShort: string;
  storeDonationsTab: string;
  storeDiscountsTab: string;
  storeContributionTab: string;
  campaigns: string;
  seeMore: string;
  seeLess: string;
  charities: string;
  fixedOffersDescription: string;
  buyPoints: string;
  buyPointsWithCard: string;
  securePointsPurchaseSimulation: string;
  paymentWithCard: string;
  confirmPurchase: string;
  donateWithPoints: string;
  selectedInstitution: string;
  pointsToEuroRate: string;
  recurringDonation: string;
  recurringDonationDesc: string;
  estimatedNetAfterFees: string;
  confirmDonation: string;
  donateInGroup: string;
  createGroupVoteFor: string;
  selectGroup: string;
  noAdminGroups: string;
  adminGroup: string;
  selected: string;
  createGroupVote: string;
  groupVoteSummaryPrefix: string;
  forGroup: string;
  buyPointsSummaryPrefix: string;
  contributionGlobal: string;
  peopleContributed: string;
  refresh: string;
  yourContribution: string;
  donatedByYouViaStore: string;
  completedCampaigns: string;
  globalValuesDisclaimer: string;
  completed: string;
  global: string;
  communityGoal: string;
  contributedByYouToThisCampaign: string;
  moreWaysToGive: string;
  aboutCampaign: string;
  impactWalletContributionsThisCampaign: string;
  totalRaisedDemo: string;
  yourGlobalDonationsAllInstitutions: string;
  charityInstitutions: string;
  demoValuesImpactWallet: string;
  contributedByYouToThisInstitution: string;
  aboutCharity: string;
  impactWalletUserDonations: string;
  totalDonatedEstimated: string;
  yourGlobalDonations: string;
  moreCharitiesToDiscover: string;
  useYourPointsToDoGood: string;
  chooseEuroAmountAndPayInPoints: string;
  activateMonthlyRenewalInPoints: string;
  setMonthlyAmountInPoints: string;
  createGroupVoteInChat: string;
  redeem: string;
  missing: string;
  enoughPointsBuyMore: string;
  selectAGroup: string;
  voteCreatedInGroupFor: string;
  codeSent: string;
  donationRegisteredFor: string;
  recurringDonationActivatedFor: string;
  perMonthText: string;
  starter: string;
  popular: string;
  bestValue: string;
  contributionGlobalCommunityLeiria: string;
};

const pt: Translations = {
  home: 'Início',
  profile: 'Perfil',
  social: 'Social',
  finance: 'Finanças',
  store: 'Loja',

  settings: 'Configurações',
  currency: 'Moeda',
  language: 'Idioma',
  darkMode: 'Modo escuro',
  lightMode: 'Modo claro',
  appearance: 'Aparência',
  preferences: 'Preferências',
  settingsTitle: 'Configurações',
  settingsDesc: 'Personaliza a tua experiência SaveSmart',

  budgetTracker: 'Controlo do orçamento',
  thisMonth: 'Este mês',
  goal: 'Objetivo',
  spent: 'Gasto',
  left: 'Restante',
  used: 'usado',
  overBudget: 'Acima do orçamento!',
  remaining: 'restante',
  vsLastMonth: 'vs mês passado',

  impact: 'Impacto',
  swipeUpToSeeMore: 'Desliza para cima para ver mais',
  viewFullStats: 'Ver estatísticas completas',
  yourImpact: 'O teu impacto',
  impactSummaryDescription:
    'Resumo de doações, poupança e hábitos — dados demonstrativos onde aplicável.',
  donations: 'Doações',
  estimatedSavings: 'Poupança estimada',
  coffees: 'Cafés',
  supportedOrganizations: 'Instituições apoiadas',
  donationsCount: 'doações',
  total: 'total',
  saved: 'Poupaste',
  inCoffeeThisMonth: 'em cafés este mês',
  thisMonthLabel: 'Este mês',
  inCoffee: 'em cafés',
  vsAverageLast3Months: 'vs média dos últimos 3 meses',
  donatedToCausesYouChose: 'doados a causas que escolheste',
  savedOnUnnecessaryExpenses: 'poupados em gastos desnecessários',
  vsMonthsWithoutBudget: 'vs meses sem orçamento definido',

  addPoints: 'Adicionar pontos',
  move: 'Mover',
  data: 'Dados',
  achievements: 'Conquistas',
  impactPoints: 'Impact Points',
  impactPointsLogoAlt: 'Logótipo Impact Points',

  welcomeBackSignedIn: 'Bem-vindo de volta! Sessão iniciada como',
  impactPointsClaimed: 'pontos de impacto recebidos',
  successfullySentPoints: 'pontos enviados com sucesso!',
  notEnoughPoints: 'Não tens pontos suficientes',
  pointRequestSent: 'Pedido enviado com sucesso!',

  groupVoteCreatedFor: 'Votação criada para',
  inGroup: 'no grupo',
  groupFallback: 'grupo',

  backToHome: 'Voltar ao início',
  premiumTitle: 'Impact Wallet Premium',
  premiumSubtitle: 'Uma experiência mais inteligente, mais completa e mais exclusiva.',
  premiumBenefit1: '+10 pontos por mês',
  premiumBenefit2: 'Inteligência artificial com mais precisão e valor',
  premiumBenefit3: 'Melhor previsão financeira',
  premiumBenefit4: 'Desafios mensais',
  premiumBenefit5: 'Ofertas e descontos exclusivos',
  premiumBenefit6: 'Alertas inteligentes',
  monthlyPlan: 'Plano mensal',
  perMonth: 'por mês',
  upgradeNow: 'Aderir agora',
  premiumActivated: 'Premium ativado!',
  cancelAnytime: 'Cancela quando quiseres',

  recentTransactions: 'Transações recentes',
  seeAll: 'Ver tudo',

  pointsShort: 'pts',
  storeDonationsTab: 'Doações',
  storeDiscountsTab: 'Descontos',
  storeContributionTab: 'Contribuição',
  campaigns: 'Campanhas',
  seeMore: 'ver mais',
  seeLess: 'ver menos',
  charities: 'Instituições de caridade',
  fixedOffersDescription: 'Ofertas fixas — resgata com pontos; o desconto já está definido pela marca.',
  buyPoints: 'Comprar pontos',
  buyPointsWithCard: 'Compra diretamente com cartão bancário',
  securePointsPurchaseSimulation: 'Simulação de compra segura de pontos',
  paymentWithCard: 'Pagamento com cartão',
  confirmPurchase: 'Confirmar compra',
  donateWithPoints: 'Doar com pontos',
  selectedInstitution: 'Instituição',
  pointsToEuroRate: 'equivalência',
  recurringDonation: 'Doação recorrente',
  recurringDonationDesc: 'Renova todos os meses em pontos',
  estimatedNetAfterFees: 'Estimativa: a instituição recebe cerca de',
  confirmDonation: 'Confirmar doação',
  donateInGroup: 'Doar em grupo',
  createGroupVoteFor: 'Cria uma votação no chat do grupo para',
  selectGroup: 'Seleciona o grupo',
  noAdminGroups: 'Não tens grupos onde sejas admin.',
  adminGroup: 'Grupo admin',
  selected: 'Selecionado',
  createGroupVote: 'Criar votação no grupo',
  groupVoteSummaryPrefix: 'Vai ser criada uma votação no chat do grupo para aprovar a doação de',
  forGroup: 'para o grupo',
  buyPointsSummaryPrefix: 'Vais comprar',
  contributionGlobal: 'Impacto global',
  peopleContributed: 'pessoas contribuíram',
  refresh: 'Atualizar',
  yourContribution: 'A tua contribuição',
  donatedByYouViaStore: 'Total doado por ti (via Store)',
  completedCampaigns: 'Campanhas concluídas',
  globalValuesDisclaimer: 'Os valores globais são demonstrativos; o teu total é guardado neste dispositivo.',
  completed: 'Concluída',
  global: 'global',
  communityGoal: 'Objetivo da comunidade',
  contributedByYouToThisCampaign: 'Contribuído por ti para esta campanha',
  moreWaysToGive: 'Mais formas de doar',
  aboutCampaign: 'Sobre a campanha',
  impactWalletContributionsThisCampaign: 'Contribuições Impact Wallet a esta campanha',
  totalRaisedDemo: 'Total angariado (demonstrativo)',
  yourGlobalDonationsAllInstitutions: 'O teu total global em doações (todas as instituições e campanhas):',
  charityInstitutions: 'Instituições de caridade',
  demoValuesImpactWallet: 'Valores demonstrativos · Impact Wallet',
  contributedByYouToThisInstitution: 'Contribuído por ti para esta instituição',
  aboutCharity: 'Sobre a instituição de caridade',
  impactWalletUserDonations: 'Doações dos utilizadores Impact Wallet',
  totalDonatedEstimated: 'Montante total doado (estimado)',
  yourGlobalDonations: 'O teu total global em doações:',
  moreCharitiesToDiscover: 'Mais instituições para descobrir',
  useYourPointsToDoGood: 'Usa os teus pontos para fazer o bem',
  chooseEuroAmountAndPayInPoints: 'Escolhe o montante e paga em pontos',
  activateMonthlyRenewalInPoints: 'No ecrã de doação, ativa a renovação mensal em pontos',
  setMonthlyAmountInPoints: 'Define um valor mensal em pontos',
  createGroupVoteInChat: 'Cria uma votação no chat do grupo',
  redeem: 'Resgatar',
  missing: 'Faltam',
  enoughPointsBuyMore: 'Não tens pontos suficientes. Compra mais pontos para continuar.',
  selectAGroup: 'Seleciona um grupo.',
  voteCreatedInGroupFor: 'Votação criada no chat do grupo para',
  codeSent: 'Código enviado',
  donationRegisteredFor: 'Doação registada para',
  recurringDonationActivatedFor: 'Doação recorrente ativada para',
  perMonthText: '/ mês',
  starter: 'Inicial',
  popular: 'Popular',
  bestValue: 'Melhor valor',
  contributionGlobalCommunityLeiria: 'Contribuição global da comunidade Impact Wallet para apoiar projetos na região.',
};

const en: Translations = {
  ...pt,
  home: 'Home',
  profile: 'Profile',
  finance: 'Finance',
  store: 'Store',
  settings: 'Settings',
  currency: 'Currency',
  language: 'Language',
  darkMode: 'Dark Mode',
  lightMode: 'Light Mode',
  appearance: 'Appearance',
  preferences: 'Preferences',
  settingsTitle: 'Settings',
  settingsDesc: 'Customize your SaveSmart experience',
  budgetTracker: 'Budget Tracker',
  thisMonth: 'This month',
  goal: 'Goal',
  spent: 'Spent',
  left: 'Left',
  used: 'used',
  overBudget: 'Over budget!',
  remaining: 'remaining',
  vsLastMonth: 'vs last month',
  impact: 'Impact',
  swipeUpToSeeMore: 'Swipe up to see more',
  viewFullStats: 'View full stats',
  yourImpact: 'Your impact',
  impactSummaryDescription: 'Summary of donations, savings and habits — demo data where applicable.',
  donations: 'Donations',
  estimatedSavings: 'Estimated savings',
  coffees: 'Coffee',
  supportedOrganizations: 'Supported organizations',
  donationsCount: 'donations',
  total: 'total',
  saved: 'You saved',
  inCoffeeThisMonth: 'on coffee this month',
  thisMonthLabel: 'This month',
  inCoffee: 'on coffee',
  vsAverageLast3Months: 'vs average of the last 3 months',
  donatedToCausesYouChose: 'donated to causes you chose',
  savedOnUnnecessaryExpenses: 'saved on unnecessary expenses',
  vsMonthsWithoutBudget: 'vs months without a budget',
  addPoints: 'Add points',
  move: 'Move',
  data: 'Data',
  achievements: 'Achievements',
  impactPointsLogoAlt: 'Impact Points logo',
  welcomeBackSignedIn: 'Welcome back! Signed in as',
  impactPointsClaimed: 'impact points claimed',
  successfullySentPoints: 'points sent successfully!',
  notEnoughPoints: 'Not enough points',
  pointRequestSent: 'Request sent successfully!',
  groupVoteCreatedFor: 'Vote created for',
  inGroup: 'in group',
  groupFallback: 'group',
  backToHome: 'Back to home',
  premiumSubtitle: 'A smarter, more complete and more exclusive experience.',
  premiumBenefit2: 'AI with more precision and value',
  premiumBenefit3: 'Better financial forecasting',
  premiumBenefit4: 'Monthly challenges',
  premiumBenefit5: 'Exclusive offers and discounts',
  monthlyPlan: 'Monthly plan',
  perMonth: 'per month',
  upgradeNow: 'Upgrade now',
  cancelAnytime: 'Cancel anytime',
  recentTransactions: 'Recent transactions',
  seeAll: 'See all',
  storeDonationsTab: 'Donations',
  storeDiscountsTab: 'Discounts',
  storeContributionTab: 'Contribution',
  campaigns: 'Campaigns',
  seeMore: 'see more',
  seeLess: 'see less',
  charities: 'Charities',
  fixedOffersDescription: 'Fixed offers — redeem with points; the discount is already defined by the brand.',
  buyPoints: 'Buy points',
  buyPointsWithCard: 'Buy directly with bank card',
  securePointsPurchaseSimulation: 'Secure points purchase simulation',
  paymentWithCard: 'Card payment',
  confirmPurchase: 'Confirm purchase',
  donateWithPoints: 'Donate with points',
  selectedInstitution: 'Institution',
  pointsToEuroRate: 'conversion',
  recurringDonation: 'Recurring donation',
  recurringDonationDesc: 'Renews every month in points',
  estimatedNetAfterFees: 'Estimate: the organization receives about',
  confirmDonation: 'Confirm donation',
  donateInGroup: 'Donate in group',
  createGroupVoteFor: 'Create a group chat vote for',
  selectGroup: 'Select group',
  noAdminGroups: 'You do not have any groups where you are an admin.',
  adminGroup: 'Admin group',
  selected: 'Selected',
  createGroupVote: 'Create group vote',
  groupVoteSummaryPrefix: 'A vote will be created in the group chat to approve a donation of',
  forGroup: 'for group',
  buyPointsSummaryPrefix: 'You are buying',
  contributionGlobal: 'Global impact',
  peopleContributed: 'people contributed',
  refresh: 'Refresh',
  yourContribution: 'Your contribution',
  donatedByYouViaStore: 'Total donated by you (via Store)',
  completedCampaigns: 'Completed campaigns',
  globalValuesDisclaimer: 'Global values are demo values; your total is stored on this device.',
  completed: 'Completed',
  global: 'global',
  communityGoal: 'Community goal',
  contributedByYouToThisCampaign: 'Contributed by you to this campaign',
  moreWaysToGive: 'More ways to give',
  aboutCampaign: 'About the campaign',
  impactWalletContributionsThisCampaign: 'Impact Wallet contributions to this campaign',
  totalRaisedDemo: 'Total raised (demo)',
  yourGlobalDonationsAllInstitutions: 'Your global donation total (all institutions and campaigns):',
  charityInstitutions: 'Charities',
  demoValuesImpactWallet: 'Demo values · Impact Wallet',
  contributedByYouToThisInstitution: 'Contributed by you to this institution',
  aboutCharity: 'About the charity',
  impactWalletUserDonations: 'Impact Wallet user donations',
  totalDonatedEstimated: 'Estimated total donated',
  yourGlobalDonations: 'Your global donations total:',
  moreCharitiesToDiscover: 'More charities to discover',
  useYourPointsToDoGood: 'Use your points to do good',
  chooseEuroAmountAndPayInPoints: 'Choose the amount and pay in points',
  activateMonthlyRenewalInPoints: 'On the donation screen, enable monthly renewal in points',
  setMonthlyAmountInPoints: 'Set a monthly amount in points',
  createGroupVoteInChat: 'Create a vote in the group chat',
  redeem: 'Redeem',
  missing: 'Missing',
  enoughPointsBuyMore: 'You do not have enough points. Buy more points to continue.',
  selectAGroup: 'Select a group.',
  voteCreatedInGroupFor: 'Vote created in the group chat for',
  codeSent: 'Code sent',
  donationRegisteredFor: 'Donation registered for',
  recurringDonationActivatedFor: 'Recurring donation activated for',
  perMonthText: '/ month',
  starter: 'Starter',
  popular: 'Popular',
  bestValue: 'Best value',
  contributionGlobalCommunityLeiria: 'Global contribution from the Impact Wallet community to support projects in the region.',
};

const es: Translations = {
  ...en,
  home: 'Inicio',
  profile: 'Perfil',
  finance: 'Finanzas',
  store: 'Tienda',
  settings: 'Ajustes',
  currency: 'Moneda',
  language: 'Idioma',
  darkMode: 'Modo oscuro',
  lightMode: 'Modo claro',
  settingsTitle: 'Ajustes',
  settingsDesc: 'Personaliza tu experiencia SaveSmart',
  thisMonth: 'Este mes',
  goal: 'Objetivo',
  spent: 'Gastado',
  left: 'Restante',
  vsLastMonth: 'vs mes pasado',
  impact: 'Impacto',
  yourImpact: 'Tu impacto',
  donations: 'Donaciones',
  estimatedSavings: 'Ahorro estimado',
  addPoints: 'Añadir puntos',
  data: 'Datos',
  achievements: 'Logros',
  buyPoints: 'Comprar puntos',
  donateWithPoints: 'Donar con puntos',
  donateInGroup: 'Donar en grupo',
  confirmPurchase: 'Confirmar compra',
  confirmDonation: 'Confirmar donación',
  redeem: 'Canjear',
  storeDiscountsTab: 'Descuentos',
  storeContributionTab: 'Contribución',
};

const fr: Translations = {
  ...en,
  home: 'Accueil',
  profile: 'Profil',
  finance: 'Finances',
  store: 'Boutique',
  settings: 'Paramètres',
  currency: 'Devise',
  language: 'Langue',
  darkMode: 'Mode sombre',
  lightMode: 'Mode clair',
  settingsTitle: 'Paramètres',
  settingsDesc: 'Personnalisez votre expérience SaveSmart',
  thisMonth: 'Ce mois-ci',
  goal: 'Objectif',
  spent: 'Dépensé',
  left: 'Restant',
  yourImpact: 'Votre impact',
  donations: 'Dons',
  estimatedSavings: 'Économies estimées',
  buyPoints: 'Acheter des points',
  donateWithPoints: 'Faire un don avec des points',
  donateInGroup: 'Faire un don en groupe',
  confirmPurchase: 'Confirmer l’achat',
  confirmDonation: 'Confirmer le don',
  redeem: 'Utiliser',
  storeContributionTab: 'Contribution',
};

const de: Translations = {
  ...en,
  home: 'Start',
  profile: 'Profil',
  finance: 'Finanzen',
  store: 'Shop',
  settings: 'Einstellungen',
  currency: 'Währung',
  language: 'Sprache',
  darkMode: 'Dunkelmodus',
  lightMode: 'Hellmodus',
  settingsTitle: 'Einstellungen',
  settingsDesc: 'Passe dein SaveSmart-Erlebnis an',
  thisMonth: 'Diesen Monat',
  goal: 'Ziel',
  spent: 'Ausgegeben',
  left: 'Übrig',
  yourImpact: 'Dein Einfluss',
  donations: 'Spenden',
  estimatedSavings: 'Geschätzte Ersparnis',
  buyPoints: 'Punkte kaufen',
  donateWithPoints: 'Mit Punkten spenden',
  donateInGroup: 'In der Gruppe spenden',
  confirmPurchase: 'Kauf bestätigen',
  confirmDonation: 'Spende bestätigen',
  redeem: 'Einlösen',
  storeContributionTab: 'Beitrag',
};

const TRANSLATIONS: Record<LanguageCode, Translations> = {
  pt,
  en,
  es,
  fr,
  de,
};

interface SettingsContextType {
  currency: Currency;
  setCurrencyCode: (code: CurrencyCode) => void;
  language: Language;
  setLanguageCode: (code: LanguageCode) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  t: Translations;
  formatCurrency: (amount: number) => string;
  formatNumber: (amount: number, options?: Intl.NumberFormatOptions) => string;
}

const SettingsContext = createContext<SettingsContextType | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [currencyCode, setCurrencyCodeState] = useState<CurrencyCode>(() => {
    return (localStorage.getItem('currencyCode') as CurrencyCode) || 'EUR';
  });

  const [languageCode, setLanguageCodeState] = useState<LanguageCode>(() => {
    return (localStorage.getItem('languageCode') as LanguageCode) || 'pt';
  });

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  const currency = CURRENCIES.find((c) => c.code === currencyCode) || CURRENCIES[0];
  const language = LANGUAGES.find((l) => l.code === languageCode) || LANGUAGES[0];
  const t = TRANSLATIONS[languageCode] || TRANSLATIONS.pt;

  const setCurrencyCode = (code: CurrencyCode) => {
    setCurrencyCodeState(code);
    localStorage.setItem('currencyCode', code);
  };

  const setLanguageCode = (code: LanguageCode) => {
    setLanguageCodeState(code);
    localStorage.setItem('languageCode', code);
  };

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      localStorage.setItem('darkMode', (!prev).toString());
      return !prev;
    });
  };

  const formatCurrency = (amount: number): string => {
    try {
      return new Intl.NumberFormat(language.locale, {
        style: 'currency',
        currency: currency.code,
        minimumFractionDigits: currency.code === 'JPY' ? 0 : 2,
        maximumFractionDigits: currency.code === 'JPY' ? 0 : 2,
      }).format(amount);
    } catch {
      return `${currency.symbol}${amount.toFixed(2)}`;
    }
  };

  const formatNumber = (amount: number, options?: Intl.NumberFormatOptions): string => {
    try {
      return new Intl.NumberFormat(language.locale, options).format(amount);
    } catch {
      return String(amount);
    }
  };

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  return (
    <SettingsContext.Provider
      value={{
        currency,
        setCurrencyCode,
        language,
        setLanguageCode,
        darkMode,
        toggleDarkMode,
        t,
        formatCurrency,
        formatNumber,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}