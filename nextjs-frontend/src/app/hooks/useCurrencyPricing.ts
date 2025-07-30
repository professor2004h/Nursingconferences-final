'use client';

import { useMemo } from 'react';
import { useCurrency } from '@/app/contexts/CurrencyContext';
import {
  Currency,
  formatCurrency,
  getPriceForCurrency,
  extractRegistrationPrices,
  extractSponsorshipPrices,
  extractAccommodationPrices,
  RegistrationTypeMultiCurrency,
  SponsorshipTierMultiCurrency,
  AccommodationOptionMultiCurrency,
} from '@/app/types/currency';

export interface CurrencyAwarePricing {
  formatPrice: (amount: number) => string;
  getRegistrationPrice: (
    registrationType: RegistrationTypeMultiCurrency,
    period: 'earlyBird' | 'nextRound' | 'onSpot'
  ) => number;
  getSponsorshipPrice: (sponsorshipTier: SponsorshipTierMultiCurrency) => number;
  getAccommodationPrice: (
    roomOption: AccommodationOptionMultiCurrency['roomOptions'][0]
  ) => number;
  selectedCurrency: Currency;
  setSelectedCurrency: (currency: Currency) => void;
}

export function useCurrencyPricing(): CurrencyAwarePricing {
  const { selectedCurrency, setSelectedCurrency } = useCurrency();

  const formatPrice = useMemo(() => {
    return (amount: number) => formatCurrency(amount, selectedCurrency);
  }, [selectedCurrency]);

  const getRegistrationPrice = useMemo(() => {
    return (
      registrationType: RegistrationTypeMultiCurrency,
      period: 'earlyBird' | 'nextRound' | 'onSpot'
    ) => {
      const prices = extractRegistrationPrices(registrationType, period);
      return getPriceForCurrency(prices, selectedCurrency);
    };
  }, [selectedCurrency]);

  const getSponsorshipPrice = useMemo(() => {
    return (sponsorshipTier: SponsorshipTierMultiCurrency) => {
      const prices = extractSponsorshipPrices(sponsorshipTier);
      return getPriceForCurrency(prices, selectedCurrency);
    };
  }, [selectedCurrency]);

  const getAccommodationPrice = useMemo(() => {
    return (roomOption: AccommodationOptionMultiCurrency['roomOptions'][0]) => {
      const prices = extractAccommodationPrices(roomOption);
      return getPriceForCurrency(prices, selectedCurrency);
    };
  }, [selectedCurrency]);

  return {
    formatPrice,
    getRegistrationPrice,
    getSponsorshipPrice,
    getAccommodationPrice,
    selectedCurrency,
    setSelectedCurrency,
  };
}

// Helper hook for calculating total pricing with currency awareness
export function useCurrencyAwareTotalPricing() {
  const currencyPricing = useCurrencyPricing();

  const calculateTotalPrice = useMemo(() => {
    return (components: {
      registrationFee?: number;
      accommodationFee?: number;
      sponsorshipFee?: number;
      additionalFees?: number[];
    }) => {
      const {
        registrationFee = 0,
        accommodationFee = 0,
        sponsorshipFee = 0,
        additionalFees = [],
      } = components;

      const total = registrationFee + accommodationFee + sponsorshipFee + 
        additionalFees.reduce((sum, fee) => sum + fee, 0);

      return {
        total,
        formattedTotal: currencyPricing.formatPrice(total),
        breakdown: {
          registrationFee: {
            amount: registrationFee,
            formatted: currencyPricing.formatPrice(registrationFee),
          },
          accommodationFee: {
            amount: accommodationFee,
            formatted: currencyPricing.formatPrice(accommodationFee),
          },
          sponsorshipFee: {
            amount: sponsorshipFee,
            formatted: currencyPricing.formatPrice(sponsorshipFee),
          },
          additionalFees: additionalFees.map(fee => ({
            amount: fee,
            formatted: currencyPricing.formatPrice(fee),
          })),
        },
        currency: currencyPricing.selectedCurrency,
      };
    };
  }, [currencyPricing]);

  return {
    ...currencyPricing,
    calculateTotalPrice,
  };
}
