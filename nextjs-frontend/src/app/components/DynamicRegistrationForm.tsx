'use client';

import { useState, useEffect } from 'react';
import { useDynamicRegistration } from '@/app/hooks/useDynamicRegistration';
import { useMultipleToggleableRadio } from '@/app/hooks/useToggleableRadio';

interface FormData {
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  country: string;
  abstractCategory: string;
  fullPostalAddress: string;
  numberOfParticipants: number;
}

export default function DynamicRegistrationForm() {
  // Dynamic registration data
  const {
    data: dynamicData,
    loading: dynamicLoading,
    error: dynamicError,
    refetch: refetchDynamicData,
    getCurrentPeriodPricing,
    isRegistrationOpen,
    getActivePeriodId,
  } = useDynamicRegistration();

  // Enhanced radio button management
  const {
    selections,
    handleRadioChange,
    clearSelection,
    isSelected,
    getSelection,
    resetAllSelections,
  } = useMultipleToggleableRadio({
    onSelectionChange: (groupName, value, previousValue) => {
      console.log(`🔘 Selection changed in ${groupName}: ${previousValue} → ${value}`);
      
      // Clear other selections when switching between regular and sponsorship
      if (groupName === 'registrationType' && value) {
        clearSelection('sponsorshipType');
      } else if (groupName === 'sponsorshipType' && value) {
        clearSelection('registrationType');
      }
    },
    allowDeselect: true,
  });

  // Form state
  const [formData, setFormData] = useState<FormData>({
    title: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    country: '',
    abstractCategory: '',
    fullPostalAddress: '',
    numberOfParticipants: 1,
  });

  // Handle input changes
  const handleInputChange = (field: keyof FormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Calculate total price using dynamic data
  const calculateTotalPrice = () => {
    let registrationPrice = 0;
    let accommodationPrice = 0;

    if (!dynamicData) return { registrationPrice: 0, totalRegistrationPrice: 0, accommodationPrice: 0, totalPrice: 0 };

    // Calculate registration price
    const selectedSponsorType = getSelection('sponsorshipType');
    const selectedRegistrationType = getSelection('registrationType');

    if (selectedSponsorType) {
      // Find sponsorship tier price
      const sponsorTier = dynamicData.sponsorshipTiers.find(tier => tier.tierLevel === selectedSponsorType);
      registrationPrice = sponsorTier?.price || 0;
    } else if (selectedRegistrationType) {
      // Find registration type and get current period pricing
      const [typeId, subtype] = selectedRegistrationType.split('-');
      const regType = dynamicData.registrationTypes.find(type => 
        type.category === typeId || type.name.toLowerCase().includes(typeId)
      );
      
      if (regType && dynamicData.activePeriod) {
        const periodPricing = regType.pricingByPeriod[dynamicData.activePeriod.periodId];
        if (periodPricing) {
          registrationPrice = subtype === 'business' ? periodPricing.businessPrice : periodPricing.academiaPrice;
        }
      }
    }

    // Calculate accommodation price
    const selectedAccommodationType = getSelection('accommodationType');
    const selectedAccommodationNights = getSelection('accommodationNights');
    
    if (selectedAccommodationType && selectedAccommodationNights) {
      const accommodation = dynamicData.accommodationOptions.find(acc => acc.hotelName === selectedAccommodationType);
      if (accommodation) {
        const roomOption = accommodation.roomOptions.find(room => room.roomType === selectedAccommodationType);
        const nights = parseInt(selectedAccommodationNights);
        accommodationPrice = (roomOption?.pricePerNight || 0) * nights;
      }
    }

    const totalRegistrationPrice = registrationPrice * formData.numberOfParticipants;
    const totalPrice = totalRegistrationPrice + accommodationPrice;

    return {
      registrationPrice,
      totalRegistrationPrice,
      accommodationPrice,
      totalPrice
    };
  };

  const priceCalculation = calculateTotalPrice();

  // Show loading state
  if (dynamicLoading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Registration Form</h2>
          <p className="text-gray-600">Fetching the latest pricing and configuration...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (dynamicError) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Unable to Load Registration Form</h2>
          <p className="text-gray-600 mb-4">{dynamicError}</p>
          <button
            onClick={refetchDynamicData}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Show registration closed state
  if (!isRegistrationOpen()) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center">
          <div className="text-yellow-500 text-6xl mb-4">🚫</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Registration Closed</h2>
          <p className="text-gray-600">
            {dynamicData?.registrationSettings?.registrationStatus?.closedMessage || 
             'Registration is currently closed. Please check back later.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        Conference Registration
      </h1>

      {/* Current Pricing Period Indicator */}
      {dynamicData?.activePeriod && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                <strong>Current Pricing Period:</strong> {dynamicData.activePeriod.title}
              </p>
              <p className="text-xs text-blue-600 mt-1">
                {dynamicData.activePeriod.description || 'Current pricing period is active'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Personal Details Section */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Personal Details</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <select
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Title</option>
              {dynamicData?.formConfig.titleOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
            <input
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Country */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
            <select
              value={formData.country}
              onChange={(e) => handleInputChange('country', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Country</option>
              {dynamicData?.formConfig.countries.map((country) => (
                <option key={country.code} value={country.name}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Full Postal Address */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Full Postal Address</label>
          <textarea
            value={formData.fullPostalAddress}
            onChange={(e) => handleInputChange('fullPostalAddress', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Price Summary */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-green-800 mb-2">Price Summary</h3>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Registration Fee:</span>
            <span>${priceCalculation.registrationPrice}</span>
          </div>
          <div className="flex justify-between">
            <span>Participants:</span>
            <span>{formData.numberOfParticipants}</span>
          </div>
          <div className="flex justify-between">
            <span>Total Registration:</span>
            <span>${priceCalculation.totalRegistrationPrice}</span>
          </div>
          <div className="flex justify-between">
            <span>Accommodation:</span>
            <span>${priceCalculation.accommodationPrice}</span>
          </div>
          <div className="flex justify-between font-bold text-lg border-t pt-2">
            <span>Total:</span>
            <span>${priceCalculation.totalPrice}</span>
          </div>
        </div>
      </div>

      {/* Debug Info */}
      <div className="bg-gray-100 p-4 rounded-lg text-xs">
        <h4 className="font-semibold mb-2">Debug Info:</h4>
        <p>Active Period: {dynamicData?.activePeriod?.periodId || 'None'}</p>
        <p>Selections: {JSON.stringify(selections, null, 2)}</p>
        <p>Registration Types: {dynamicData?.registrationTypes.length || 0}</p>
        <p>Sponsorship Tiers: {dynamicData?.sponsorshipTiers.length || 0}</p>
      </div>
    </div>
  );
}
