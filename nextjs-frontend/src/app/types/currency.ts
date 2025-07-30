// Currency types and interfaces for multi-currency support

export type Currency = 'USD' | 'EUR' | 'GBP';

export interface CurrencyInfo {
  code: Currency;
  symbol: string;
  name: string;
  locale: string;
}

export const CURRENCIES: Record<Currency, CurrencyInfo> = {
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    locale: 'en-US',
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    locale: 'en-GB', // Using en-GB for European formatting
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound',
    locale: 'en-GB',
  },
};

export const DEFAULT_CURRENCY: Currency = 'USD';

// Multi-currency pricing interfaces
export interface MultiCurrencyPrice {
  USD: number;
  EUR: number;
  GBP: number;
}

export interface RegistrationTypeMultiCurrency {
  _id: string;
  name: string;
  category: string;
  description?: string;
  
  // Early Bird Pricing
  earlyBirdPrice: number;
  earlyBirdPriceEUR: number;
  earlyBirdPriceGBP: number;
  
  // Next Round Pricing
  nextRoundPrice: number;
  nextRoundPriceEUR: number;
  nextRoundPriceGBP: number;
  
  // OnSpot Pricing
  onSpotPrice: number;
  onSpotPriceEUR: number;
  onSpotPriceGBP: number;
  
  benefits?: string[];
  isActive: boolean;
  displayOrder: number;
  maxParticipants?: number;
}

export interface SponsorshipTierMultiCurrency {
  _id: string;
  name: string;
  slug: { current: string };
  price: number;
  priceEUR: number;
  priceGBP: number;
  order: number;
  featured: boolean;
  description?: string;
  benefits?: Array<{
    benefit: string;
    highlighted: boolean;
  }>;
  color?: {
    hex: string;
  };
  active: boolean;
}

export interface AccommodationOptionMultiCurrency {
  _id: string;
  hotelName: string;
  hotelCategory: string;
  description?: string;
  roomOptions: Array<{
    roomType: string;
    pricePerNight: number;
    pricePerNightEUR: number;
    pricePerNightGBP: number;
    roomDescription?: string;
    maxGuests: number;
    isAvailable: boolean;
  }>;
  packageOptions?: Array<{
    packageName: string;
    nights: number;
    checkInDate: string;
    checkOutDate: string;
    inclusions?: string[];
    isActive: boolean;
  }>;
  location?: any;
  amenities?: string[];
  isActive: boolean;
  displayOrder: number;
}

// Utility functions for currency formatting
export function formatCurrency(amount: number, currency: Currency): string {
  const currencyInfo = CURRENCIES[currency];
  
  try {
    return new Intl.NumberFormat(currencyInfo.locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (error) {
    // Fallback formatting if Intl.NumberFormat fails
    return `${currencyInfo.symbol}${amount.toFixed(2)}`;
  }
}

export function getCurrencySymbol(currency: Currency): string {
  return CURRENCIES[currency].symbol;
}

export function getCurrencyName(currency: Currency): string {
  return CURRENCIES[currency].name;
}

// Get price for specific currency from multi-currency object
export function getPriceForCurrency(
  prices: Partial<MultiCurrencyPrice>,
  currency: Currency,
  fallbackCurrency: Currency = 'USD'
): number {
  return prices[currency] ?? prices[fallbackCurrency] ?? 0;
}

// Convert pricing period to currency-specific field names
export function getPricingFieldName(period: string, currency: Currency): string {
  const baseFieldMap: Record<string, string> = {
    'earlyBird': 'earlyBirdPrice',
    'nextRound': 'nextRoundPrice',
    'onSpot': 'onSpotPrice',
  };
  
  const baseField = baseFieldMap[period];
  if (!baseField) return '';
  
  return currency === 'USD' ? baseField : `${baseField}${currency}`;
}

// Extract multi-currency prices from registration type
export function extractRegistrationPrices(
  registrationType: RegistrationTypeMultiCurrency,
  period: 'earlyBird' | 'nextRound' | 'onSpot'
): MultiCurrencyPrice {
  switch (period) {
    case 'earlyBird':
      return {
        USD: registrationType.earlyBirdPrice,
        EUR: registrationType.earlyBirdPriceEUR,
        GBP: registrationType.earlyBirdPriceGBP,
      };
    case 'nextRound':
      return {
        USD: registrationType.nextRoundPrice,
        EUR: registrationType.nextRoundPriceEUR,
        GBP: registrationType.nextRoundPriceGBP,
      };
    case 'onSpot':
      return {
        USD: registrationType.onSpotPrice,
        EUR: registrationType.onSpotPriceEUR,
        GBP: registrationType.onSpotPriceGBP,
      };
    default:
      return { USD: 0, EUR: 0, GBP: 0 };
  }
}

// Extract multi-currency prices from sponsorship tier
export function extractSponsorshipPrices(
  sponsorshipTier: SponsorshipTierMultiCurrency
): MultiCurrencyPrice {
  return {
    USD: sponsorshipTier.price,
    EUR: sponsorshipTier.priceEUR,
    GBP: sponsorshipTier.priceGBP,
  };
}

// Extract multi-currency prices from accommodation room
export function extractAccommodationPrices(
  roomOption: AccommodationOptionMultiCurrency['roomOptions'][0]
): MultiCurrencyPrice {
  return {
    USD: roomOption.pricePerNight,
    EUR: roomOption.pricePerNightEUR,
    GBP: roomOption.pricePerNightGBP,
  };
}
