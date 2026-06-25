import { getCurrency } from './countries';

export const FREE_THEMES = ['minimal', 'dark', 'gradient'];

export const PRO_THEMES = ['bubbles', 'aurora', 'neon', 'sunset', 'ocean', 'candy', 'midnight', 'forest', 'lavender', 'custom'];

export const PREMIUM_EXCLUSIVE_THEMES = ['royal', 'diamond', 'galaxy', 'cybercity', 'goldenempire', 'arcticcrystal', 'volcano', 'luxuryblack'];

export const PLAN_LEVELS = { free: 0, pro: 1, premium: 2 };

export const MAX_PRODUCT_IMAGES = { free: 1, pro: 5, premium: 10 };
export const GIF_ENABLED        = { free: false, pro: false, premium: true };
export const MAX_GIF_PER_PRODUCT = { free: 0, pro: 0, premium: 1 };

export function isSubscriptionActive(vendor) {
  if (!vendor?.plan_expires_at) return true; // free plan has no expiry
  if (vendor?.plan_status === 'past_due') return false;
  return new Date(vendor.plan_expires_at) > new Date();
}

export function hasPlan(vendor, requiredPlan) {
  // If the paid subscription has expired, treat the vendor as free
  const effectivePlan = isSubscriptionActive(vendor)
    ? (vendor?.plan_type?.toLowerCase() || 'free')
    : 'free';
  const vendorLevel   = PLAN_LEVELS[effectivePlan]   ?? 0;
  const requiredLevel = PLAN_LEVELS[requiredPlan?.toLowerCase()] ?? 0;
  return vendorLevel >= requiredLevel;
}

const PRICING_NGN = {
  pro:     { monthly: 7500,   yearly: 76500  },
  premium: { monthly: 12000,  yearly: 122400 },
};

const PRICING_USD = {
  pro:     { monthly: 10,  yearly: 102 },
  premium: { monthly: 15,  yearly: 153 },
};

// Option A: fixed NGN rate for international users until USD Paystack is enabled
export const USD_TO_NGN_RATE = 1600;

export function getPaystackCurrency() {
  return 'NGN'; // All charges processed in NGN; international cards converted by card network
}

export function getPricing(vendor) {
  const isNG = vendor?.country === 'NG';
  return { prices: isNG ? PRICING_NGN : PRICING_USD, currency: isNG ? 'NGN' : 'USD', isNG };
}

// Returns the NGN amount to charge Paystack (converts USD at fixed rate for international)
export function getChargeAmountNGN(displayAmount, isNG) {
  return isNG ? displayAmount : displayAmount * USD_TO_NGN_RATE;
}

export function formatPrice(amount, currency = 'NGN') {
  const symbol = getCurrencySymbol(currency);
  return `${symbol}${Number(amount).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

const CURRENCY_SYMBOLS = {
  // Africa
  NGN: '₦',    // Nigerian Naira
  GHS: 'GH₵',  // Ghanaian Cedi
  KES: 'KSh',  // Kenyan Shilling
  ZAR: 'R',    // South African Rand
  EGP: 'E£',   // Egyptian Pound
  ETB: 'Br',   // Ethiopian Birrn
  TZS: 'TSh',  // Tanzanian Shilling
  UGX: 'USh',  // Ugandan Shilling
  RWF: 'RF',   // Rwandan Franc
  ZMW: 'ZK',   // Zambian Kwacha
  ZWL: 'Z$',   // Zimbabwean Dollar
  MAD: 'DH',   // Moroccan Dirham
  DZD: 'DA',   // Algerian Dinar
  TND: 'DT',   // Tunisian Dinar
  LYD: 'LD',   // Libyan Dinar
  SDG: 'SDG',  // Sudanese Pound
  AOA: 'Kz',   // Angolan Kwanza
  BWP: 'P',    // Botswana Pula
  MZN: 'MT',   // Mozambican Metical
  MGA: 'Ar',   // Malagasy Ariary
  MWK: 'MK',   // Malawian Kwacha
  GMD: 'D',    // Gambian Dalasi
  GNF: 'FG',   // Guinean Franc
  SLL: 'Le',   // Sierra Leonean Leone
  SOS: 'Sh',   // Somali Shilling
  DJF: 'Fdj',  // Djiboutian Franc
  CDF: 'FC',   // Congolese Franc
  LRD: 'L$',   // Liberian Dollar
  XOF: 'CFA',  // West African CFA Franc
  XAF: 'FCFA', // Central African CFA Franc

  // Americas
  USD: '$',    // US Dollar
  CAD: 'CA$',  // Canadian Dollar
  BRL: 'R$',   // Brazilian Real
  ARS: 'AR$',  // Argentine Peso
  MXN: 'MX$',  // Mexican Peso
  COP: 'CO$',  // Colombian Peso
  PEN: 'S/',   // Peruvian Sol
  CLP: 'CL$',  // Chilean Peso
  VES: 'Bs.S', // Venezuelan Bolívar

  // Europe
  EUR: '€',    // Euro
  GBP: '£',    // British Pound
  CHF: 'Fr',   // Swiss Franc
  SEK: 'kr',   // Swedish Krona
  NOK: 'kr',   // Norwegian Krone
  DKK: 'kr',   // Danish Krone
  PLN: 'zł',   // Polish Zloty
  CZK: 'Kč',   // Czech Koruna
  HUF: 'Ft',   // Hungarian Forint
  RON: 'lei',  // Romanian Leu
  BGN: 'лв',   // Bulgarian Lev
  RSD: 'din',  // Serbian Dinar
  UAH: '₴',    // Ukrainian Hryvnia
  RUB: '₽',    // Russian Ruble

  // Asia & Oceania
  JPY: '¥',    // Japanese Yen
  CNY: '¥',    // Chinese Yuan
  KRW: '₩',    // South Korean Won
  INR: '₹',    // Indian Rupee
  AUD: 'A$',   // Australian Dollar
  NZD: 'NZ$',  // New Zealand Dollar
  SGD: 'S$',   // Singapore Dollar
  MYR: 'RM',   // Malaysian Ringgit
  THB: '฿',    // Thai Baht
  PHP: '₱',    // Philippine Peso
  IDR: 'Rp',   // Indonesian Rupiah
  VND: '₫',    // Vietnamese Dong
  PKR: '₨',    // Pakistani Rupee
  BDT: '৳',    // Bangladeshi Taka
  NPR: 'Rs',   // Nepalese Rupee
  LKR: 'Rs',   // Sri Lankan Rupee
  MMK: 'K',    // Myanmar Kyat
  KZT: '₸',    // Kazakhstani Tenge
  UZS: 'UZS',  // Uzbekistani Som

  // Middle East
  AED: 'د.إ',  // UAE Dirham
  SAR: 'SR',   // Saudi Riyal
  QAR: 'QR',   // Qatari Riyal
  KWD: 'KD',   // Kuwaiti Dinar
  BHD: 'BD',   // Bahraini Dinar
  OMR: 'OR',   // Omani Rial
  JOD: 'JD',   // Jordanian Dinar
  IQD: 'IQD',  // Iraqi Dinar
  LBP: 'L£',   // Lebanese Pound
  ILS: '₪',    // Israeli Shekel
  SYP: '£S',   // Syrian Pound
  YER: 'YR',   // Yemeni Rial
  IRR: 'IRR',  // Iranian Rial
};

export function getCurrencySymbol(currency = 'NGN') {
  if (CURRENCY_SYMBOLS[currency]) return CURRENCY_SYMBOLS[currency];
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency, minimumFractionDigits: 0, maximumFractionDigits: 0 })
      .format(0)
      .replace(/[\d.,\s]/g, '')
      .trim();
  } catch {
    return currency;
  }
}

export const SUBSCRIPTION_PLANS = [
  {
    id: 'free',
    name: 'Free',
    monthlyPrice: 0,
    yearlyPrice: 0,
    badge: 'Always Free',
    tagline: 'Everything you need to start selling.',
    features: [
      'Unlimited products',
      '📷 1 product photo per item',
      'WhatsApp order collection',
      'Basic analytics (7-day)',
      '3 storefront themes (Minimal, Dark, Gradient)',
      'QR code & store link',
      'Store sharing templates',
      'Mobile push notifications',
    ],
    lockedFeatures: [
      'Exclusive themes + custom background',
      'Verified store badge',
      'Remove "Powered by ShopLink.vi"',
      'Advanced analytics (30-day)',
      'Custom WhatsApp order message to customers',
    ],
    color: 'bg-white border-slate-100 text-slate-900',
    btnColor: 'bg-slate-100 text-slate-600 hover:bg-slate-200',
    isFree: true,
  },
  {
    id: 'pro',
    name: 'Pro',
    monthlyPrice: 0,
    yearlyPrice: 0,
    yearlyDiscount: 15,
    paystackMonthlyPlanCode:    import.meta.env.VITE_PAYSTACK_PRO_MONTHLY_CODE     || '',
    paystackYearlyPlanCode:     import.meta.env.VITE_PAYSTACK_PRO_YEARLY_CODE      || '',
    paystackMonthlyPlanCodeUSD: import.meta.env.VITE_PAYSTACK_PRO_MONTHLY_CODE_USD || '',
    paystackYearlyPlanCodeUSD:  import.meta.env.VITE_PAYSTACK_PRO_YEARLY_CODE_USD  || '',
    badge: 'Most Popular',
    tagline: 'Unlock the full storefront experience.',
    badgeColor: '#3b82f6',
    features: [
      'Everything in Free',
      '📷 Up to 5 product photos per item (create a gallery)',
      '🔵 Blue verified badge on storefront',
      '12 exclusive themes (Bubbles, Aurora, Neon, Sunset, Ocean, Candy, Midnight, Forest, Lavender + Custom)',
      'Custom background image upload',
      'Remove "Powered by ShopLink.vi"',
      'Advanced analytics — 30-day charts, best sales day, fulfillment rate',
      '📦 Stock & inventory tracking — know how many items are left',
      '🏷️ Product variants (size, color, options)',
      '⚡ Quick Multi-Add — add up to 10 products at once',
    ],
    color: 'bg-white border-emerald-100 text-slate-900',
    btnColor: 'bg-emerald-600 text-white hover:bg-emerald-700',
    isPopular: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    monthlyPrice: 0,
    yearlyPrice: 0,
    yearlyDiscount: 15,
    paystackMonthlyPlanCode:    import.meta.env.VITE_PAYSTACK_PREMIUM_MONTHLY_CODE     || '',
    paystackYearlyPlanCode:     import.meta.env.VITE_PAYSTACK_PREMIUM_YEARLY_CODE      || '',
    paystackMonthlyPlanCodeUSD: import.meta.env.VITE_PAYSTACK_PREMIUM_MONTHLY_CODE_USD || '',
    paystackYearlyPlanCodeUSD:  import.meta.env.VITE_PAYSTACK_PREMIUM_YEARLY_CODE_USD  || '',
    badge: 'Best Value',
    tagline: 'The ultimate store experience.',
    badgeColor: '#f59e0b',
    features: [
      'Everything in Pro',
      '🖼️ Up to 10 product photos per item + 1 animated GIF',
      '🟡 Gold verified badge on storefront',
      '8 exclusive Premium themes (Royal, Diamond, Galaxy, Cyber City, Golden Empire, Arctic Crystal, Volcano, Luxury Black)',
      'Premium analytics — 90-day history, avg order value, monthly revenue trends',
      'Custom checkout message shown to customers when ordering',
      '📥 Bulk product import via CSV',
    ],
    color: 'bg-slate-900 border-slate-900 text-white',
    btnColor: 'bg-amber-500 text-white hover:bg-amber-400',
    isBestDeal: true,
  },
];
