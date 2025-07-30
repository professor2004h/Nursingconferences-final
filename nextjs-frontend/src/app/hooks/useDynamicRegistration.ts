import { useState, useEffect, useCallback } from 'react';
import { useRealTimePeriodDetection } from './useRealTimePeriodDetection';

export interface PricingPeriod {
  _id: string;
  periodId: string;
  title: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  displayOrder: number;
  description?: string;
  highlightColor?: any;
}

export interface RegistrationType {
  _id: string;
  name: string;
  category: string;
  description?: string;
  earlyBirdPrice: number;
  earlyBirdPriceEUR: number;
  earlyBirdPriceGBP: number;
  nextRoundPrice: number;
  nextRoundPriceEUR: number;
  nextRoundPriceGBP: number;
  onSpotPrice: number;
  onSpotPriceEUR: number;
  onSpotPriceGBP: number;
  pricingByPeriod: {
    [periodId: string]: {
      price: number;
      period: PricingPeriod;
    };
  };
  benefits?: string[];
  isActive: boolean;
  displayOrder: number;
  maxParticipants?: number;
}

export interface SponsorshipTier {
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

export interface AccommodationOption {
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

export interface FormConfig {
  countries: Array<{
    code: string;
    name: string;
    isActive: boolean;
  }>;
  abstractCategories: Array<{
    value: string;
    label: string;
    description?: string;
    isActive: boolean;
    displayOrder?: number;
  }>;
  titleOptions: Array<{
    value: string;
    label: string;
    isActive: boolean;
  }>;
  accommodationNightOptions: Array<{
    nights: number;
    label: string;
    isActive: boolean;
  }>;
}

export interface DynamicRegistrationData {
  pricingPeriods: PricingPeriod[];
  activePeriod: PricingPeriod | null;
  registrationTypes: RegistrationType[];
  sponsorshipTiers: SponsorshipTier[];
  accommodationOptions: AccommodationOption[];
  formConfig: FormConfig;
  registrationSettings: any;
  currentDate: string;
  lastFetched: string;
}

export interface UseDynamicRegistrationReturn {
  data: DynamicRegistrationData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  getCurrentPeriodPricing: (registrationType: RegistrationType, subtype?: 'academia' | 'business') => number;
  isRegistrationOpen: () => boolean;
  getActivePeriodId: () => string | null;
  // Real-time period detection
  realTimePeriodDetection: ReturnType<typeof useRealTimePeriodDetection> | null;
}

export const useDynamicRegistration = (): UseDynamicRegistrationReturn => {
  const [data, setData] = useState<DynamicRegistrationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Real-time period detection
  const realTimePeriodDetection = useRealTimePeriodDetection({
    periods: data?.pricingPeriods || [],
    updateInterval: 60000, // 1 minute
    onPeriodChange: (newPeriod, previousPeriod) => {
      console.log('🔄 Active pricing period changed:', {
        from: previousPeriod?.title || 'None',
        to: newPeriod?.title || 'None',
      });

      // Note: Removed setData call here to prevent infinite loop
      // The period detection is already handled by the hook itself
    },
    onTransitionWarning: (timeRemaining, currentPeriod) => {
      console.log('⚠️ Pricing period transition warning:', {
        period: currentPeriod.title,
        timeRemaining: Math.round(timeRemaining / 1000 / 60), // minutes
      });
    },
    transitionWarningThreshold: 60 * 60 * 1000, // 1 hour
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔄 Fetching dynamic registration data...');

      const response = await fetch('/api/registration/dynamic-config', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Add cache control for better performance
        cache: 'no-store', // Always fetch fresh data for pricing
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch registration data: ${response.status}`);
      }

      const result = await response.json();
      
      console.log('✅ Dynamic registration data fetched successfully');
      console.log('📊 Active period:', result.activePeriod?.periodId || 'None');

      setData(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('❌ Error fetching dynamic registration data:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch data on mount
  useEffect(() => {
    console.log('🚀 useDynamicRegistration: Hook mounted, starting data fetch...');
    fetchData();
  }, [fetchData]);

  // Helper function to get current period pricing for a registration type
  const getCurrentPeriodPricing = useCallback((
    registrationType: RegistrationType,
    _subtype?: 'academia' | 'business' // Kept for backward compatibility but not used
  ): number => {
    if (!data?.activePeriod) {
      // Default to early bird price if no active period
      return registrationType.earlyBirdPrice || 0;
    }

    const periodPricing = registrationType.pricingByPeriod[data.activePeriod.periodId];
    if (!periodPricing) {
      // Fallback to appropriate price based on period ID
      switch (data.activePeriod.periodId) {
        case 'nextRound':
          return registrationType.nextRoundPrice || 0;
        case 'spotRegistration':
          return registrationType.onSpotPrice || 0;
        default:
          return registrationType.earlyBirdPrice || 0;
      }
    }

    // Return the price from the pricing by period structure
    return periodPricing.price;
  }, [data]);

  // Helper function to check if registration is open
  const isRegistrationOpen = useCallback((): boolean => {
    return data?.registrationSettings?.registrationStatus?.isOpen ?? true;
  }, [data]);

  // Helper function to get active period ID
  const getActivePeriodId = useCallback((): string | null => {
    return data?.activePeriod?.periodId || null;
  }, [data]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    getCurrentPeriodPricing,
    isRegistrationOpen,
    getActivePeriodId,
    realTimePeriodDetection,
  };
};
