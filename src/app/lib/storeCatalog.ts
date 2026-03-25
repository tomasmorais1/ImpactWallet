/** Impact Points ↔ EUR conversion (same scale as Revolut-style screenshots). */
import careImg from '../assets/Care.jpg';
import cruzImg from '../assets/cruz_vermlha.webp';
import wwfImg from '../assets/WWF.jpg';
import careLogo from '../assets/Logo_Care.png';
import cruzLogo from '../assets/Cruz-Vermelha_LOGO.JPG';
import wwfLogo from '../assets/Logo_WWF.png';
import iomImg from '../assets/IOMM.JPG';
import iomLogo from '../assets/IOM_logo.png';
import uniaoLogo from '../assets/Uniao_LOGO.png';
import uniaoImg from "../assets/uniao.jpg";
import unicefLogo from '../assets/unicef_logo.png';
import unicefImg from '../assets/uincef.jpg';
export const POINTS_PER_EURO = 140;

export const DONATION_EURO_AMOUNTS = [10, 25, 50, 100, 150, 200] as const;

export function eurosToPoints(euros: number) {
  return Math.round(euros * POINTS_PER_EURO);
}

export interface Charity {
  id: string;
  name: string;

  logo?: string;       // 👈 opcional
  image?: string;      // 👈 opcional

  logoEmoji?: string;  // 👈 tornar opcional
  socialProof?: string; // 👈 tornar opcional

  gradient: string;
  tagline: string;
  about: string;
}

export const CHARITIES: Charity[] = [
  {
    id: 'care',
    name: 'CARE International',
    tagline: 'Salvar vidas enquanto constrói um futuro melhor.',
    about:
      'A CARE trabalha em mais de 100 países para combater a pobreza e responder a emergências humanitárias, com foco em mulheres e crianças.',
    gradient: 'from-amber-900/90 via-orange-900/80 to-zinc-900',
    logoEmoji: '☀️',
    socialProof: '10,4k pessoas doaram para esta instituição',
    image: careImg,
    logo: careLogo,
  },
  {
  id: 'iom',
  name: 'IOM, UN Migration',
  tagline: 'Promover uma migração humanitária e ordenada.',
  about:
    'A Organização Internacional para as Migrações apoia migrantes e comunidades anfitriãs com abrigo, informação e integração.',
  gradient: 'from-sky-900/90 via-blue-950/90 to-zinc-950',
  logoEmoji: '🌍',
  socialProof: 'Milhares de apoios através da comunidade Impact Wallet',
  image: iomImg,
  logo: iomLogo,
},
  {
    id: 'cv',
    name: 'Cruz Vermelha Portuguesa',
    tagline: 'Humanidade, independência e voluntariado.',
    about:
      'A Cruz Vermelha Portuguesa presta apoio em emergências, formação em primeiros socorros e inclusão social em todo o país.',
    gradient: 'from-red-950/90 via-zinc-900 to-zinc-950',
    logoEmoji: '❤️',
    socialProof: 'Apoio contínuo em missões locais e internacionais',
    image: cruzImg,
    logo: cruzLogo,
  },
  {
    id: 'wwf',
    name: 'WWF',
    tagline: 'Proteger a natureza e espécies em risco.',
    about:
      'O WWF trabalha para parar a degradação do ambiente natural do planeta e construir um futuro em que humanos vivam em harmonia com a natureza.',
    gradient: 'from-emerald-950/90 via-green-950 to-zinc-950',
    logoEmoji: '🐼',
    socialProof: 'Comunidade global de conservação',
    image: wwfImg,
    logo: wwfLogo,

  },
  {
  id: 'uniao-zoofila',
  name: 'União Zoófila',
  logo: uniaoLogo,
  image: uniaoImg,
  gradient: 'from-orange-500 to-amber-500',
  tagline: 'Proteção e cuidado de animais',
  about: 'A União Zoófila dedica-se ao resgate, tratamento e adoção de animais abandonados em Portugal.',
},

{
  id: 'unicef',
  name: 'UNICEF',
  logo: unicefLogo,
  image: unicefImg,
  gradient: 'from-blue-500 to-cyan-500',
  tagline: 'Protegendo crianças no mundo',
  about: 'UNICEF trabalha em mais de 190 países para proteger os direitos das crianças e fornecer ajuda humanitária.',
},
  
];
export type DiscountOffer = {
  id: string;
  brand: string;
  title: string;
  description: string;
  costPoints: number;
  badge: string;
};

/** Predefined discounts — user does not pick the %; it is fixed per offer. */
export const DISCOUNT_OFFERS: DiscountOffer[] = [
  {
    id: 'd1',
    brand: 'Patagonia',
    title: '15% de desconto',
    description: 'Um uso em artigos de desporto sustentável selecionados.',
    costPoints: 175,
    badge: 'Modo eco',
  },
  {
    id: 'd2',
    brand: 'Allbirds',
    title: '20% de desconto',
    description: 'Sapatilhas com pegada de carbono neutra.',
    costPoints: 220,
    badge: 'Calçado',
  },
  {
    id: 'd3',
    brand: 'Grove Collaborative',
    title: '10% de desconto',
    description: 'Produtos de casa sem plástico descartável.',
    costPoints: 120,
    badge: 'Casa',
  },
  {
    id: 'd4',
    brand: 'Too Good To Go',
    title: '5€ de crédito',
    description: 'Crédito na app para salvar refeições em excesso.',
    costPoints: 450,
    badge: 'Comida',
  },
];

/** Mock global pool shown in Contribuição tab (EUR). */
export const MOCK_GLOBAL_DONATIONS_EUR = 61_419_201.49;
export const MOCK_GLOBAL_CONTRIBUTORS = 1_674_179;

export const USER_DONATION_TOTAL_KEY = 'impactWallet_userDonationEur';
export const USER_DONATION_BY_CHARITY_KEY = 'impactWallet_userDonationByCharity';
