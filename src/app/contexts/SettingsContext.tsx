import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CAD' | 'AUD' | 'CHF' | 'MXN' | 'BRL';
export type LanguageCode = 'en' | 'es' | 'fr' | 'de' | 'pt';

export interface Currency {
  code: CurrencyCode;
  symbol: string;
  name: string;
  locale: string;
}

export const CURRENCIES: Currency[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar', locale: 'en-US' },
  { code: 'EUR', symbol: '€', name: 'Euro', locale: 'de-DE' },
  { code: 'GBP', symbol: '£', name: 'British Pound', locale: 'en-GB' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', locale: 'ja-JP' },
  { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar', locale: 'en-CA' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', locale: 'en-AU' },
  { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc', locale: 'de-CH' },
  { code: 'MXN', symbol: 'MX$', name: 'Mexican Peso', locale: 'es-MX' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real', locale: 'pt-BR' },
];

export interface Language {
  code: LanguageCode;
  name: string;
  flag: string;
}

export const LANGUAGES: Language[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
];

export type Translations = {
  home: string;
  bank: string;
  goals: string;
  donate: string;
  settings: string;
  appTagline: string;
  totalPoints: string;
  available: string;
  currency: string;
  language: string;
  darkMode: string;
  lightMode: string;
  appearance: string;
  preferences: string;
  settingsTitle: string;
  settingsDesc: string;
  donateTitle: string;
  donateDesc: string;
  youSaved: string;
  yourPoints: string;
  donationPercentage: string;
  donationAmountLabel: string;
  selectNgo: string;
  donateBtn: string;
  donationSuccess: string;
  donationSuccessMsg: string;
  featuredOrgs: string;
  featuredOrgsDesc: string;
  whyDonate: string;
  reason1: string;
  reason2: string;
  reason3: string;
  reason4: string;
  ofSavings: string;
  willDonate: string;
  nothingSaved: string;
};

const TRANSLATIONS: Record<LanguageCode, Translations> = {
  en: {
    home: 'Home', bank: 'Bank', goals: 'Goals', donate: 'Donate', settings: 'Settings',
    appTagline: 'Your money, your goals',
    totalPoints: 'Total Points', available: 'Available',
    currency: 'Currency', language: 'Language', darkMode: 'Dark Mode', lightMode: 'Light Mode',
    appearance: 'Appearance', preferences: 'Preferences',
    settingsTitle: 'Settings', settingsDesc: 'Customize your SaveSmart experience',
    donateTitle: 'Make an Impact', donateDesc: 'Choose how much of your savings to donate',
    youSaved: 'You Saved', yourPoints: 'Your Points',
    donationPercentage: 'Donation Percentage',
    donationAmountLabel: 'Donation Amount',
    selectNgo: 'Select an organization below',
    donateBtn: 'Donate',
    donationSuccess: 'Donation Successful!',
    donationSuccessMsg: 'Thank you for making a difference',
    featuredOrgs: 'Featured Organizations',
    featuredOrgsDesc: 'Select an organization to donate',
    whyDonate: 'Why Donate Your Savings?',
    reason1: 'Turn your financial discipline into real-world impact',
    reason2: 'Support vetted, high-impact organizations',
    reason3: '100% of your donation goes to the cause',
    reason4: 'Tax-deductible receipts provided',
    ofSavings: 'of savings',
    willDonate: 'will be donated',
    nothingSaved: 'Save more to unlock donations',
  },
  es: {
    home: 'Inicio', bank: 'Banco', goals: 'Metas', donate: 'Donar', settings: 'Ajustes',
    appTagline: 'Tu dinero, tus metas',
    totalPoints: 'Puntos Totales', available: 'Disponible',
    currency: 'Moneda', language: 'Idioma', darkMode: 'Modo Oscuro', lightMode: 'Modo Claro',
    appearance: 'Apariencia', preferences: 'Preferencias',
    settingsTitle: 'Ajustes', settingsDesc: 'Personaliza tu experiencia SaveSmart',
    donateTitle: 'Genera un Impacto', donateDesc: 'Elige cuánto de tus ahorros donar',
    youSaved: 'Ahorrado', yourPoints: 'Tus Puntos',
    donationPercentage: 'Porcentaje de Donación',
    donationAmountLabel: 'Monto a Donar',
    selectNgo: 'Selecciona una organización abajo',
    donateBtn: 'Donar',
    donationSuccess: '¡Donación Exitosa!',
    donationSuccessMsg: 'Gracias por hacer la diferencia',
    featuredOrgs: 'Organizaciones Destacadas',
    featuredOrgsDesc: 'Selecciona una organización para donar',
    whyDonate: '¿Por qué donar tus ahorros?',
    reason1: 'Convierte tu disciplina financiera en impacto real',
    reason2: 'Apoya organizaciones de alto impacto verificadas',
    reason3: 'El 100% de tu donación va a la causa',
    reason4: 'Recibos deducibles de impuestos proporcionados',
    ofSavings: 'de ahorros',
    willDonate: 'serán donados',
    nothingSaved: 'Ahorra más para desbloquear donaciones',
  },
  fr: {
    home: 'Accueil', bank: 'Banque', goals: 'Objectifs', donate: 'Donner', settings: 'Paramètres',
    appTagline: 'Votre argent, vos objectifs',
    totalPoints: 'Points Totaux', available: 'Disponible',
    currency: 'Devise', language: 'Langue', darkMode: 'Mode Sombre', lightMode: 'Mode Clair',
    appearance: 'Apparence', preferences: 'Préférences',
    settingsTitle: 'Paramètres', settingsDesc: 'Personnalisez votre expérience SaveSmart',
    donateTitle: 'Faites un Impact', donateDesc: 'Choisissez combien de vos économies donner',
    youSaved: 'Économisé', yourPoints: 'Vos Points',
    donationPercentage: 'Pourcentage de Don',
    donationAmountLabel: 'Montant du Don',
    selectNgo: 'Sélectionnez une organisation ci-dessous',
    donateBtn: 'Donner',
    donationSuccess: 'Don Réussi !',
    donationSuccessMsg: 'Merci de faire la différence',
    featuredOrgs: 'Organisations en Vedette',
    featuredOrgsDesc: 'Sélectionnez une organisation pour donner',
    whyDonate: 'Pourquoi donner vos économies ?',
    reason1: 'Transformez votre discipline financière en impact réel',
    reason2: 'Soutenez des organisations vérifiées à fort impact',
    reason3: '100% de votre don va à la cause',
    reason4: 'Reçus déductibles d\'impôts fournis',
    ofSavings: 'd\'économies',
    willDonate: 'seront donnés',
    nothingSaved: 'Économisez plus pour débloquer les dons',
  },
  de: {
    home: 'Start', bank: 'Bank', goals: 'Ziele', donate: 'Spenden', settings: 'Einstellungen',
    appTagline: 'Dein Geld, deine Ziele',
    totalPoints: 'Gesamtpunkte', available: 'Verfügbar',
    currency: 'Währung', language: 'Sprache', darkMode: 'Dunkelmodus', lightMode: 'Hellmodus',
    appearance: 'Erscheinungsbild', preferences: 'Einstellungen',
    settingsTitle: 'Einstellungen', settingsDesc: 'Passe dein SaveSmart-Erlebnis an',
    donateTitle: 'Wirkung erzielen', donateDesc: 'Wähle, wie viel deiner Ersparnisse du spenden möchtest',
    youSaved: 'Gespart', yourPoints: 'Deine Punkte',
    donationPercentage: 'Spendenanteil',
    donationAmountLabel: 'Spendenbetrag',
    selectNgo: 'Wähle eine Organisation unten',
    donateBtn: 'Spenden',
    donationSuccess: 'Spende erfolgreich!',
    donationSuccessMsg: 'Danke, dass du einen Unterschied machst',
    featuredOrgs: 'Ausgewählte Organisationen',
    featuredOrgsDesc: 'Wähle eine Organisation zum Spenden',
    whyDonate: 'Warum deine Ersparnisse spenden?',
    reason1: 'Verwandle deine finanzielle Disziplin in echte Wirkung',
    reason2: 'Unterstütze geprüfte, wirkungsstarke Organisationen',
    reason3: '100% deiner Spende kommt der Sache zugute',
    reason4: 'Steuerlich absetzbare Quittungen werden bereitgestellt',
    ofSavings: 'der Ersparnisse',
    willDonate: 'werden gespendet',
    nothingSaved: 'Mehr sparen, um Spenden freizuschalten',
  },
  pt: {
    home: 'Início', bank: 'Banco', goals: 'Metas', donate: 'Doar', settings: 'Configurações',
    appTagline: 'Seu dinheiro, seus objetivos',
    totalPoints: 'Pontos Totais', available: 'Disponível',
    currency: 'Moeda', language: 'Idioma', darkMode: 'Modo Escuro', lightMode: 'Modo Claro',
    appearance: 'Aparência', preferences: 'Preferências',
    settingsTitle: 'Configurações', settingsDesc: 'Personalize sua experiência SaveSmart',
    donateTitle: 'Cause um Impacto', donateDesc: 'Escolha quanto de suas economias doar',
    youSaved: 'Economizado', yourPoints: 'Seus Pontos',
    donationPercentage: 'Percentual de Doação',
    donationAmountLabel: 'Valor da Doação',
    selectNgo: 'Selecione uma organização abaixo',
    donateBtn: 'Doar',
    donationSuccess: 'Doação Bem-sucedida!',
    donationSuccessMsg: 'Obrigado por fazer a diferença',
    featuredOrgs: 'Organizações em Destaque',
    featuredOrgsDesc: 'Selecione uma organização para doar',
    whyDonate: 'Por que doar suas economias?',
    reason1: 'Transforme sua disciplina financeira em impacto real',
    reason2: 'Apoie organizações verificadas de alto impacto',
    reason3: '100% da sua doação vai para a causa',
    reason4: 'Recibos dedutíveis de impostos fornecidos',
    ofSavings: 'das economias',
    willDonate: 'serão doados',
    nothingSaved: 'Economize mais para desbloquear doações',
  },
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
}

const SettingsContext = createContext<SettingsContextType | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [currencyCode, setCurrencyCodeState] = useState<CurrencyCode>(() => {
    return (localStorage.getItem('currencyCode') as CurrencyCode) || 'USD';
  });
  const [languageCode, setLanguageCodeState] = useState<LanguageCode>(() => {
    return (localStorage.getItem('languageCode') as LanguageCode) || 'en';
  });
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  const currency = CURRENCIES.find(c => c.code === currencyCode) || CURRENCIES[0];
  const language = LANGUAGES.find(l => l.code === languageCode) || LANGUAGES[0];
  const t = TRANSLATIONS[languageCode];

  const setCurrencyCode = (code: CurrencyCode) => {
    setCurrencyCodeState(code);
    localStorage.setItem('currencyCode', code);
  };

  const setLanguageCode = (code: LanguageCode) => {
    setLanguageCodeState(code);
    localStorage.setItem('languageCode', code);
  };

  const toggleDarkMode = () => {
    setDarkMode(prev => {
      localStorage.setItem('darkMode', (!prev).toString());
      return !prev;
    });
  };

  const formatCurrency = (amount: number): string => {
    try {
      return new Intl.NumberFormat(currency.locale, {
        style: 'currency',
        currency: currency.code,
        minimumFractionDigits: currency.code === 'JPY' ? 0 : 2,
        maximumFractionDigits: currency.code === 'JPY' ? 0 : 2,
      }).format(amount);
    } catch {
      return `${currency.symbol}${amount.toFixed(2)}`;
    }
  };

  // Apply dark mode to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <SettingsContext.Provider value={{
      currency, setCurrencyCode,
      language, setLanguageCode,
      darkMode, toggleDarkMode,
      t, formatCurrency,
    }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}