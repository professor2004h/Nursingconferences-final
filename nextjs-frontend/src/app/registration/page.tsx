'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDynamicRegistration } from '@/app/hooks/useDynamicRegistration';
import { useMultipleToggleableRadio } from '@/app/hooks/useToggleableRadio';
import PayPalButton from '@/app/components/PayPalButton';
import PayPalErrorBoundary from '@/app/components/PayPalErrorBoundary';


// Form data interface
interface FormData {
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  country: string;
  fullPostalAddress: string;
  selectedRegistration: string;
  sponsorType: string;
  accommodationType: string;
  accommodationNights: string;
  numberOfParticipants: number;
}

// Countries list from reference site
const countries = [
  'Afghanistan', 'Albania', 'Algeria', 'American Samoa', 'Andorra', 'Angola', 'Anguilla', 'Antarctica',
  'Antigua and Barbuda', 'Argentina', 'Armenia', 'Aruba', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas',
  'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bermuda', 'Bhutan',
  'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Bouvet Island', 'Brazil', 'British Indian Ocean Territory',
  'Brunei Darussalam', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cambodia', 'Cameroon', 'Canada',
  'Cape Verde', 'Cayman Islands', 'Central African Republic', 'Chad', 'Chile', 'China', 'Christmas Island',
  'Cocos (Keeling) Islands', 'Colombia', 'Comoros', 'Congo', 'Cook Islands', 'Costa Rica', 'Croatia (Hrvatska)',
  'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'East Timor',
  'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Ethiopia',
  'Falkland Islands (Malvinas)', 'Faroe Islands', 'Fiji', 'Finland', 'France', 'France, Metropolitan',
  'French Guiana', 'French Polynesia', 'French Southern Territories', 'Gabon', 'Gambia', 'Georgia',
  'Germany', 'Ghana', 'Gibraltar', 'Guernsey', 'Greece', 'Greenland', 'Grenada', 'Guadeloupe', 'Guam',
  'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Heard and Mc Donald Islands', 'Honduras',
  'Hong Kong', 'Hungary', 'Iceland', 'India', 'Isle of Man', 'Indonesia', 'Iran (Islamic Republic of)',
  'Iraq', 'Ireland', 'Israel', 'Italy', 'Ivory Coast', 'Jersey', 'Jamaica', 'Japan', 'Jordan',
  'Kazakhstan', 'Kenya', 'Kiribati', 'Korea, Democratic People\'s Republic of', 'Korea, Republic of',
  'Kosovo', 'Kuwait', 'Kyrgyzstan', 'Lao People\'s Democratic Republic', 'Latvia', 'Lebanon', 'Lesotho',
  'Liberia', 'Libyan Arab Jamahiriya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macau', 'Macedonia',
  'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Martinique',
  'Mauritania', 'Mauritius', 'Mayotte', 'Mexico', 'Micronesia, Federated States of', 'Moldova, Republic of',
  'Monaco', 'Mongolia', 'Montenegro', 'Montserrat', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nauru',
  'Nepal', 'Netherlands', 'Netherlands Antilles', 'New Caledonia', 'New Zealand', 'Nicaragua', 'Niger',
  'Nigeria', 'Niue', 'Norfolk Island', 'Northern Mariana Islands', 'Norway', 'Oman', 'Pakistan', 'Palau',
  'Palestine', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Pitcairn', 'Poland',
  'Portugal', 'Puerto Rico', 'Qatar', 'Reunion', 'Romania', 'Russian Federation', 'Rwanda',
  'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino',
  'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore',
  'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Georgia South Sandwich Islands',
  'Spain', 'Sri Lanka', 'St. Helena', 'St. Pierre and Miquelon', 'Sudan', 'Suriname',
  'Svalbard and Jan Mayen Islands', 'Swaziland', 'Sweden', 'Switzerland', 'Syrian Arab Republic', 'Taiwan',
  'Tajikistan', 'Tanzania, United Republic of', 'Thailand', 'Togo', 'Tokelau', 'Tonga', 'Trinidad and Tobago',
  'Tunisia', 'Turkey', 'Turkmenistan', 'Turks and Caicos Islands', 'Tuvalu', 'Uganda', 'Ukraine',
  'United Arab Emirates', 'United Kingdom', 'United States', 'United States minor outlying islands', 'Uruguay',
  'Uzbekistan', 'Vanuatu', 'Vatican City State', 'Venezuela', 'Vietnam', 'Virgin Islands (British)',
  'Virgin Islands (U.S.)', 'Wallis and Futuna Islands', 'Western Sahara', 'Yemen', 'Zaire', 'Zambia', 'Zimbabwe'
];

export default function RegistrationPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [currentRegistrationId, setCurrentRegistrationId] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [showPayPalSection, setShowPayPalSection] = useState(false);
  const [currentPricingPeriod, setCurrentPricingPeriod] = useState<'earlyBird' | 'nextRound' | 'spotRegistration'>('earlyBird');

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
    handleRadioChange,
    clearSelection,
    isSelected,
    getSelection,
    resetAllSelections,
  } = useMultipleToggleableRadio({
    onSelectionChange: (groupName, value, previousValue) => {
      console.log(`Selection changed in ${groupName}: ${previousValue} → ${value}`);

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
    fullPostalAddress: '',
    selectedRegistration: '',
    sponsorType: '',
    accommodationType: '',
    accommodationNights: '',
    numberOfParticipants: 1,
  });

  // Handle input changes
  const handleInputChange = (field: keyof FormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Determine current pricing period based on dates
  useEffect(() => {
    const now = new Date();
    const earlyBirdEnd = new Date('2025-02-28');
    const nextRoundEnd = new Date('2025-05-31');

    if (now <= earlyBirdEnd) {
      setCurrentPricingPeriod('earlyBird');
    } else if (now <= nextRoundEnd) {
      setCurrentPricingPeriod('nextRound');
    } else {
      setCurrentPricingPeriod('spotRegistration');
    }
  }, []);

  // Pricing structure based on reference site
  const pricingStructure = {
    earlyBird: {
      title: 'Early Bird On/Before Feb 28th, 2025',
      speakerRegistration: { academia: 799, business: 899 },
      delegate: { academia: 699, business: 799 },
      student: 599,
      posterPresentation: 499,
      online: 200,
      accompanyingPerson: 250,
    },
    nextRound: {
      title: 'Next Round of Registration up to May 31st, 2025',
      speakerRegistration: { academia: 899, business: 999 },
      delegate: { academia: 799, business: 899 },
      student: 699,
      posterPresentation: 599,
      online: 300,
      accompanyingPerson: 300,
    },
    spotRegistration: {
      title: 'Spot Registrations on June 18th 2025',
      speakerRegistration: { academia: 999, business: 1099 },
      delegate: { academia: 899, business: 999 },
      student: 799,
      posterPresentation: 699,
      online: 500,
      accompanyingPerson: 350,
    }
  };

  // Sponsor pricing
  const sponsorPricing = {
    platinum: 7500,
    gold: 6000,
    silver: 5000,
    exhibitor: 3000,
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
      // Find sponsorship tier price (using name field from sponsorshipTiers)
      const sponsorTier = dynamicData.sponsorshipTiers?.find(tier =>
        tier.name?.toLowerCase() === selectedSponsorType.toLowerCase() ||
        tier.slug?.current === selectedSponsorType.toLowerCase()
      );
      registrationPrice = sponsorTier?.price || 0;

      // Fallback to hardcoded sponsor pricing if not found in dynamic data
      if (registrationPrice === 0) {
        const fallbackPricing: { [key: string]: number } = {
          'platinum': 7500,
          'gold': 6000,
          'silver': 5000,
          'exhibitor': 3000,
        };
        registrationPrice = fallbackPricing[selectedSponsorType.toLowerCase()] || 0;
      }
    } else if (selectedRegistrationType) {
      // Parse the registration type selection (format: typeId-periodId)
      const parts = selectedRegistrationType.split('-');
      if (parts.length >= 2) {
        // New format: typeId-periodId
        const typeId = parts[0];
        const periodId = parts[parts.length - 1]; // Last part is always periodId
        const regType = dynamicData.registrationTypes?.find(type => type._id === typeId);

        if (regType && regType.pricingByPeriod) {
          // Get pricing for the specific period
          const periodPricing = regType.pricingByPeriod[periodId];
          if (periodPricing) {
            registrationPrice = periodPricing.price || 0;
          }

          // Fallback pricing if no period pricing found or if active period is null
          if (registrationPrice === 0 || !dynamicData.activePeriod) {
            console.log('⚠️ No active period pricing found, using fallback pricing');
            // Use on-spot pricing as fallback
            registrationPrice = regType.onSpotPrice || regType.nextRoundPrice || regType.earlyBirdPrice || 0;
          }
        }
      }
    }

    // Calculate accommodation price
    const selectedAccommodation = getSelection('accommodation');

    if (selectedAccommodation && dynamicData.accommodationOptions) {
      // Parse accommodation selection (format: hotelId-roomType-nights)
      const [hotelId, roomType, nights] = selectedAccommodation.split('-');

      const hotel = dynamicData.accommodationOptions?.find(h => h._id === hotelId);
      if (hotel) {
        const roomOption = hotel.roomOptions?.find(ro => ro.roomType === roomType);
        if (roomOption) {
          // Calculate total price: pricePerNight * nights
          accommodationPrice = (roomOption.pricePerNight || 0) * parseInt(nights);
        }
      }
    }

    const totalRegistrationPrice = registrationPrice * formData.numberOfParticipants;
    const totalPrice = totalRegistrationPrice + accommodationPrice;

    // Debug logging for pricing issues
    if (totalPrice === 0) {
      console.log('⚠️ Total price is 0, debugging pricing calculation:', {
        selectedSponsorType,
        selectedRegistrationType,
        registrationPrice,
        accommodationPrice,
        numberOfParticipants: formData.numberOfParticipants,
        activePeriod: dynamicData.activePeriod,
        registrationTypes: dynamicData.registrationTypes?.length,
        sponsorshipTiers: dynamicData.sponsorshipTiers?.length
      });
    }

    return {
      registrationPrice,
      totalRegistrationPrice,
      accommodationPrice,
      totalPrice
    };
  };

  const priceCalculation = calculateTotalPrice();

  // Handle payment success
  const handlePaymentSuccess = (paymentData: any) => {
    console.log('✅ Payment successful:', paymentData);
    setPaymentSuccess(true);
    setShowPayPalSection(false);

    // Redirect to success page with payment details
    const successUrl = `/registration/success?` +
      `registration_id=${paymentData.registrationId}&` +
      `payment_id=${paymentData.paymentId}&` +
      `order_id=${paymentData.orderId}&` +
      `amount=${paymentData.amount}&` +
      `currency=${paymentData.currency}&` +
      `payment_method=paypal&` +
      `status=completed&` +
      `test_mode=true`;

    router.push(successUrl);
  };

  // Handle payment error
  const handlePaymentError = (error: any) => {
    console.error('❌ Payment failed:', error);
    const errorMessage = error instanceof Error ? error.message : 'Payment failed';
    alert(`Payment failed: ${errorMessage}\nYour registration is saved and you can complete payment later.`);
    setIsLoading(false);
  };



  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate required fields
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.phoneNumber) {
        alert('Please fill in all required fields');
        return;
      }

      if (!formData.country || !formData.fullPostalAddress) {
        alert('Please fill in all required information fields');
        return;
      }

      // Check if either registration type or sponsorship is selected
      const selectedRegistrationType = getSelection('registrationType');
      const selectedSponsorType = getSelection('sponsorshipType');

      if (!selectedRegistrationType && !selectedSponsorType) {
        alert('Please select a registration type or sponsorship option');
        return;
      }

      // Get the registration type name for display
      let selectedRegistrationName = '';
      if (selectedRegistrationType) {
        const regTypeId = selectedRegistrationType.split('-')[0]; // Extract the registration type ID
        const selectedRegType = dynamicData.registrationTypes?.find(type => type._id === regTypeId);
        selectedRegistrationName = selectedRegType?.name || '';
      }

      // Prepare registration data for API
      const registrationData = {
        // Personal Details
        title: formData.title,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,

        // Further Information
        country: formData.country,
        fullPostalAddress: formData.fullPostalAddress,

        // Registration Selection (using new format)
        selectedRegistration: selectedRegistrationType || '',
        selectedRegistrationName: selectedRegistrationName,
        sponsorType: selectedSponsorType || '',

        // Accommodation (using new selection format)
        accommodationType: getSelection('accommodation') || '',
        accommodationNights: getSelection('accommodation') ? getSelection('accommodation')?.split('-')[2] || '' : '',

        // Participants
        numberOfParticipants: formData.numberOfParticipants,

        // Pricing
        registrationFee: priceCalculation.registrationPrice,
        accommodationFee: priceCalculation.accommodationPrice,
        totalPrice: priceCalculation.totalPrice,
        pricingPeriod: getActivePeriodId() || 'unknown',
      };

      console.log('Submitting registration data:', registrationData);

      // Submit to API
      const response = await fetch('/api/registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Registration failed');
      }

      console.log('Registration successful:', result);

      // If total price is 0, just show success message
      if (priceCalculation.totalPrice === 0) {
        alert(`Registration submitted successfully! Registration ID: ${result.registrationId}`);
        // Reset form
        setFormData({
          title: '',
          firstName: '',
          lastName: '',
          email: '',
          phoneNumber: '',
          country: '',
          fullPostalAddress: '',
          selectedRegistration: '',
          sponsorType: '',
          accommodationType: '',
          accommodationNights: '',
          numberOfParticipants: 1,
        });
        // Reset all selections
        resetAllSelections();
        return;
      }

      // Show PayPal payment section for payment processing
      console.log('💳 Proceeding to payment for registration:', result.registrationId);

      // Validate payment amount before showing PayPal section
      const currentPrice = calculateTotalPrice();
      if (currentPrice.totalPrice <= 0) {
        console.error('❌ Cannot proceed to payment: Invalid amount', currentPrice);
        alert('Payment amount calculation error. Please ensure you have selected a registration type or sponsorship option.');
        setIsLoading(false);
        return;
      }

      console.log('✅ Payment amount validated:', currentPrice.totalPrice);
      setCurrentRegistrationId(result.registrationId);
      setShowPayPalSection(true);
      setIsLoading(false);

    } catch (error) {
      console.error('Registration error:', error);
      alert(`Registration failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Debug logging (only on mount and when data changes)
  useEffect(() => {
    if (dynamicData) {
      console.log('🔍 Registration Page Debug:', {
        dynamicLoading,
        dynamicError,
        dynamicData: !!dynamicData,
        registrationTypes: dynamicData?.registrationTypes?.length || 0,
        registrationTypeNames: dynamicData?.registrationTypes?.map(t => ({ name: t.name, category: t.category })) || [],
        sponsorshipTiers: dynamicData?.sponsorshipTiers?.length || 0,
        accommodationOptions: dynamicData?.accommodationOptions?.length || 0,
        activePeriod: dynamicData?.activePeriod?.periodId || 'None',
        pricingPeriods: dynamicData?.pricingPeriods?.length || 0
      });
    }
  }, [dynamicData, dynamicLoading, dynamicError]);

  // Early return for loading state
  if (dynamicLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading registration form...</p>
          <p className="mt-2 text-xs text-gray-500">Debug: Loading={String(dynamicLoading)}, Error={dynamicError || 'None'}</p>
        </div>
      </div>
    );
  }

  // Early return for error state
  if (dynamicError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-red-800 mb-2">Error Loading Registration Form</h2>
            <p className="text-red-700 mb-4">{dynamicError}</p>
            <button
              onClick={refetchDynamicData}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Early return if no data - with debug info
  if (!dynamicData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No registration data available.</p>
          <div className="mt-4 text-xs text-gray-500 bg-gray-100 p-3 rounded">
            <p>Loading: {String(dynamicLoading)}</p>
            <p>Error: {dynamicError || 'None'}</p>
            <p>Data: {dynamicData ? 'Present' : 'Null'}</p>
          </div>
          <button
            onClick={refetchDynamicData}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Reload
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header with hero background - matching reference site */}
      <div
        className="relative bg-cover bg-center bg-no-repeat text-white py-20 z-10"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("/api/placeholder/1200/400")',
        }}
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-left">
            <h1 className="text-5xl font-bold mb-4">REGISTRATION</h1>
            <div className="text-sm opacity-90">
              <span>Home</span> <span className="mx-2">»</span> <span>Registration</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Form Container */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <form
          onSubmit={handleSubmit}
          className="space-y-6"
          autoComplete="on"
          name="registrationForm"
          id="registrationForm"
        >
          {/* Personal Details Section */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="bg-blue-800 text-white px-6 py-3 rounded-t-lg">
              <h2 className="text-lg font-bold text-white">Personal Details</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <select
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    autoComplete="honorific-prefix"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Any</option>
                    <option value="Mr">Mr</option>
                    <option value="Ms">Ms</option>
                    <option value="Mrs">Mrs</option>
                    <option value="Prof">Prof</option>
                    <option value="Dr">Dr</option>
                  </select>
                </div>

                {/* First Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    placeholder="First Name *"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    autoComplete="given-name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    placeholder="Last Name *"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    autoComplete="family-name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Email *"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    autoComplete="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    placeholder="Phone Number *"
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    autoComplete="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Further Information Section */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="bg-blue-800 text-white px-6 py-3 rounded-t-lg">
              <h2 className="text-lg font-bold text-white">Further Information</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Country */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                  <select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    autoComplete="country"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select country</option>
                    {countries.map((country) => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                </div>


              </div>

              {/* Full Postal Address */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Postal Address</label>
                <textarea
                  id="fullPostalAddress"
                  name="fullPostalAddress"
                  value={formData.fullPostalAddress}
                  onChange={(e) => handleInputChange('fullPostalAddress', e.target.value)}
                  autoComplete="street-address"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Pricing Periods Overview Section */}
          <div className="bg-white rounded-lg shadow-sm border mb-6">
            <div className="bg-gradient-to-r from-blue-800 to-blue-900 text-white px-6 py-3 rounded-t-lg">
              <h2 className="text-lg font-bold text-white">Registration Periods</h2>
            </div>
            <div className="p-6">
              {dynamicData?.pricingPeriods && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {dynamicData.pricingPeriods
                    .sort((a, b) => a.displayOrder - b.displayOrder)
                    .map((period) => {
                      const isActive = period._id === dynamicData.activePeriod?._id;
                      const isPast = new Date(period.endDate) < new Date();
                      const isFuture = new Date(period.startDate) > new Date();

                      return (
                        <div
                          key={period._id}
                          className={`relative border-2 rounded-lg p-4 transition-all duration-200 ${
                            isActive
                              ? 'border-green-500 bg-green-50 shadow-lg'
                              : isPast
                              ? 'border-gray-300 bg-gray-50 opacity-60'
                              : 'border-blue-300 bg-blue-50'
                          }`}
                        >
                          {/* Status Badge */}
                          <div className="absolute -top-2 -right-2">
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                isActive
                                  ? 'bg-green-500 text-white'
                                  : isPast
                                  ? 'bg-gray-500 text-white'
                                  : 'bg-blue-500 text-white'
                              }`}
                            >
                              {isActive ? 'ACTIVE' : isPast ? 'ENDED' : 'UPCOMING'}
                            </span>
                          </div>

                          <div className="mb-3">
                            <h3 className={`font-bold text-lg ${
                              isActive ? 'text-green-800' : isPast ? 'text-gray-600' : 'text-blue-800'
                            }`}>
                              {period.title}
                            </h3>
                            <p className={`text-sm mt-1 ${
                              isActive ? 'text-green-700' : isPast ? 'text-gray-500' : 'text-blue-700'
                            }`}>
                              {period.description}
                            </p>
                          </div>

                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="font-medium">Start:</span>
                              <span>{new Date(period.startDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-medium">End:</span>
                              <span>{new Date(period.endDate).toLocaleDateString()}</span>
                            </div>
                          </div>

                          {isActive && (
                            <div className="mt-3 p-2 bg-green-100 rounded text-center">
                              <span className="text-green-800 font-medium text-sm">
                                🎯 Current Registration Period
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </div>

          {/* Registration Type Section */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="bg-blue-800 text-white px-6 py-3 rounded-t-lg">
              <h2 className="text-lg font-bold text-white">Registration Type</h2>
            </div>
            <div className="p-6">
              {/* Loading State */}
              {dynamicLoading && (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading registration options...</p>
                </div>
              )}

              {/* Error State */}
              {dynamicError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center">
                    <div className="text-red-600">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">Error Loading Registration Data</h3>
                      <p className="text-sm text-red-700 mt-1">{dynamicError}</p>
                      <button
                        onClick={refetchDynamicData}
                        className="mt-2 text-sm text-red-600 hover:text-red-500 underline"
                      >
                        Try Again
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Dynamic Content */}
              {dynamicData && (
                <>

                  {/* Dynamic Registration Types */}
                  <div className="space-y-6">
                    {/* Registration Types Table */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-6">Regular Registration</h3>

                      {/* Registration Table - Compact Design */}
                      <div className="overflow-x-auto">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
                          {/* Render each pricing period as a column */}
                          {dynamicData.pricingPeriods
                            ?.sort((a, b) => a.displayOrder - b.displayOrder)
                            ?.map((period) => {
                              const isActivePeriod = period._id === dynamicData.activePeriod?._id;
                              const isPastPeriod = new Date(period.endDate) < new Date();
                              const isFuturePeriod = new Date(period.startDate) > new Date();

                              return (
                                <div key={period._id} className="bg-white rounded-lg shadow-sm border">
                                  {/* Period Header - More Compact */}
                                  <div className={`px-3 py-2 rounded-t-lg text-white font-medium text-center text-sm ${
                                    isActivePeriod
                                      ? 'bg-blue-800'
                                      : isPastPeriod
                                      ? 'bg-gray-500'
                                      : 'bg-slate-600'
                                  }`}>
                                    <div className="text-sm font-semibold">{period.title}</div>
                                    <div className="text-xs opacity-90 mt-0.5">
                                      {new Date(period.startDate).toLocaleDateString()} - {new Date(period.endDate).toLocaleDateString()}
                                    </div>
                                  </div>

                                  {/* Registration Types for this period - Compact Layout */}
                                  <div className={`p-3 space-y-2 ${!isActivePeriod ? 'opacity-60' : ''}`}>
                                    {dynamicData.registrationTypes
                                      ?.filter(type => type.isActive)
                                      ?.sort((a, b) => {
                                        // Enforce specific order for the 8 approved registration types
                                        const order = [
                                          'speaker-inperson', 'speaker-virtual',
                                          'listener-inperson', 'listener-virtual',
                                          'student-inperson', 'student-virtual',
                                          'eposter-virtual', 'exhibitor'
                                        ];
                                        return order.indexOf(a.category) - order.indexOf(b.category);
                                      })
                                      ?.map((regType) => {
                                        // Get pricing for this specific period
                                        const periodPricing = regType.pricingByPeriod?.[period.periodId];
                                        const price = periodPricing?.price || 0;
                                        const hasValidPricing = price > 0;
                                        const canSelect = isActivePeriod && hasValidPricing;

                                        return (
                                          <div key={`${regType._id}-${period._id}`} className="border-b border-gray-100 last:border-b-0 pb-2 last:pb-0">
                                            {/* Registration Type Name - Compact */}
                                            <div className="mb-1">
                                              <h4 className={`font-medium text-xs text-left ${!canSelect ? 'text-gray-400' : 'text-gray-700'}`}>
                                                {regType.name}
                                              </h4>
                                            </div>

                                            {hasValidPricing ? (
                                              <div className="flex items-center justify-between">
                                                <label className={`flex items-center cursor-pointer text-xs ${!canSelect ? 'cursor-not-allowed' : ''}`}>
                                                  <input
                                                    type="checkbox"
                                                    name="registrationType"
                                                    value={`${regType._id}-${period.periodId}`}
                                                    checked={isSelected('registrationType', `${regType._id}-${period.periodId}`)}
                                                    onChange={() => canSelect && handleRadioChange('registrationType', `${regType._id}-${period.periodId}`)}
                                                    disabled={!canSelect}
                                                    className="mr-1.5 w-3 h-3"
                                                  />
                                                  <span className={`${!canSelect ? 'text-gray-400' : 'text-gray-600'}`}>
                                                    Select
                                                  </span>
                                                </label>
                                                <span className={`text-xs font-semibold ${!canSelect ? 'text-gray-400' : 'text-blue-600'}`}>
                                                  ${price}
                                                </span>
                                              </div>
                                            ) : (
                                              <div className="text-center py-1">
                                                <span className="text-xs text-gray-400">Not Available</span>
                                              </div>
                                            )}
                                          </div>
                                        );
                                      })}
                                  </div>

                                  {/* Period Status Footer - Compact */}
                                  <div className={`px-3 py-1.5 text-center text-xs rounded-b-lg ${
                                    isActivePeriod
                                      ? 'bg-green-50 text-green-700 font-medium'
                                      : isPastPeriod
                                      ? 'bg-gray-50 text-gray-500'
                                      : 'bg-blue-50 text-blue-700'
                                  }`}>
                                    {isActivePeriod
                                      ? '🎯 Active'
                                      : isPastPeriod
                                      ? '⏰ Ended'
                                      : '📅 Soon'
                                    }
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Sponsorship Types */}
                    <div>
                      <h3 className="text-lg font-bold text-white mb-4">Sponsorship Opportunities</h3>
                      <div className="flex flex-wrap justify-center gap-4">
                        {dynamicData.sponsorshipTiers
                          ?.filter(tier => tier.active)
                          ?.sort((a, b) => {
                            // Sort by order ascending (lowest first) or by price descending
                            if (a.order !== b.order) {
                              return a.order - b.order;
                            }
                            return b.price - a.price;
                          })
                          ?.map((tier) => {
                            const isTierSelected = isSelected('sponsorshipType', tier.name);

                            return (
                              <div
                                key={tier._id}
                                className={`relative border-2 rounded-lg p-4 bg-white border-gray-300 h-80 w-64
                                  transition-all duration-300 hover:shadow-md cursor-pointer
                                  ${isTierSelected ? 'ring-2 ring-blue-500 border-blue-500' : ''}`}
                                onClick={() => handleRadioChange('sponsorshipType', tier.name)}
                              >
                                {/* Tier Badge */}
                                <div className="absolute -top-3 left-4">
                                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold text-white bg-gray-600">
                                    {tier.name.toUpperCase()}
                                  </span>
                                </div>

                                {/* Selection Radio */}
                                <div className="absolute top-4 right-4">
                                  <input
                                    type="radio"
                                    name="sponsorshipType"
                                    value={tier.name}
                                    checked={isTierSelected}
                                    onChange={() => handleRadioChange('sponsorshipType', tier.name)}
                                    className="w-5 h-5 text-blue-600 cursor-pointer"
                                  />
                                </div>

                                <div className="mt-4 flex flex-col h-full">
                                  <h4 className="font-bold text-xl text-black mb-2">
                                    {tier.name}
                                  </h4>
                                  <div className="text-3xl font-bold text-black mb-3">
                                    ${tier.price.toLocaleString()}
                                  </div>
                                  <p className="text-sm text-black mb-4">
                                    {tier.description}
                                  </p>

                                  {/* Benefits */}
                                  {tier.benefits && tier.benefits.length > 0 && (
                                    <div className="flex-1">
                                      <h5 className="text-sm font-semibold text-black mb-2">
                                        Key Benefits:
                                      </h5>
                                      <ul className="space-y-1">
                                        {tier.benefits.slice(0, 4).map((benefit: any, idx: number) => (
                                          <li key={idx} className="flex items-start text-xs text-black">
                                            <span className="text-black mr-2 font-bold">✓</span>
                                            <span className="flex-1">
                                              {typeof benefit === 'string' ? benefit : benefit.benefit}
                                            </span>
                                          </li>
                                        ))}
                                        {tier.benefits.length > 4 && (
                                          <li className="text-xs text-black opacity-70 ml-4">
                                            + {tier.benefits.length - 4} more exclusive benefits
                                          </li>
                                        )}
                                      </ul>
                                    </div>
                                  )}

                                  {/* Availability Info */}
                                  {tier.maxSponsors && (
                                    <div className="mt-auto pt-3 border-t border-gray-300">
                                      <div className="text-xs text-black opacity-70">
                                        Limited to {tier.maxSponsors} sponsors
                                        {tier.currentSponsors && (
                                          <span className="ml-1">
                                            ({tier.maxSponsors - tier.currentSponsors} remaining)
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>







          {/* Accommodation Registration */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="bg-blue-800 text-white px-6 py-3 rounded-t-lg">
              <h2 className="text-lg font-bold text-white">Accommodation Registration</h2>
            </div>
            <div className="p-6">
              {/* Loading State */}
              {dynamicLoading && (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading accommodation options...</p>
                </div>
              )}

              {/* Error State */}
              {dynamicError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center">
                    <div className="text-red-600">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">Error Loading Accommodation Data</h3>
                      <p className="text-sm text-red-700 mt-1">{dynamicError}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Dynamic Accommodation Options */}
              {dynamicData && dynamicData.accommodationOptions && (
                <div className="space-y-6">
                  {dynamicData.accommodationOptions
                    .filter(hotel => hotel.isActive)
                    .sort((a, b) => a.displayOrder - b.displayOrder)
                    .map((hotel) => (
                      <div key={hotel._id} className="border rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">{hotel.hotelName}</h3>
                        <p className="text-sm text-gray-600 mb-4">{hotel.description}</p>

                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse">
                            <thead>
                              <tr className="bg-blue-800 text-white">
                                <th className="border border-gray-300 px-4 py-2 text-left">Room Type</th>
                                <th className="border border-gray-300 px-4 py-2 text-center">2 Nights</th>
                                <th className="border border-gray-300 px-4 py-2 text-center">3 Nights</th>
                                <th className="border border-gray-300 px-4 py-2 text-center">5 Nights</th>
                              </tr>
                            </thead>
                            <tbody>
                              {hotel.roomOptions?.map((roomOption) => (
                                <tr key={roomOption.roomType}>
                                  <td className="border border-gray-300 px-4 py-2 font-medium">
                                    {roomOption.roomType} ({roomOption.roomDescription})
                                  </td>
                                  {[2, 3, 5].map((nights) => {
                                    const accommodationKey = `${hotel._id}-${roomOption.roomType}-${nights}`;
                                    const totalPrice = (roomOption.pricePerNight || 0) * nights;

                                    return (
                                      <td key={nights} className="border border-gray-300 px-4 py-2 text-center">
                                        <label className="flex items-center justify-center">
                                          <input
                                            type="radio"
                                            name="accommodation"
                                            value={accommodationKey}
                                            checked={isSelected('accommodation', accommodationKey)}
                                            onChange={() => handleRadioChange('accommodation', accommodationKey)}
                                            className="mr-2"
                                          />
                                          <span className="text-sm">${totalPrice}</span>
                                        </label>
                                      </td>
                                    );
                                  })}
                                </tr>
                              )) || []}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>



          {/* Number of Participants */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="bg-blue-800 text-white px-6 py-3 rounded-t-lg">
              <h2 className="text-lg font-bold text-white">No. Of Participants. ({formData.numberOfParticipants})</h2>
            </div>
            <div className="p-6">
              <select
                id="numberOfParticipants"
                name="numberOfParticipants"
                value={formData.numberOfParticipants}
                onChange={(e) => handleInputChange('numberOfParticipants', parseInt(e.target.value))}
                autoComplete="off"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Payment Details and Payment Method */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Payment Details */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="bg-blue-800 text-white px-6 py-3 rounded-t-lg">
                <h2 className="text-lg font-bold text-white">Payment Details</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">Registration Price :</span>
                    <span>${priceCalculation.registrationPrice}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">No. Of Participants :</span>
                    <span>{formData.numberOfParticipants}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">Total Registration Price :</span>
                    <span>${priceCalculation.totalRegistrationPrice}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">Accommodation Registration Price :</span>
                    <span>${priceCalculation.accommodationPrice}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b font-bold text-lg">
                    <span>Total Price :</span>
                    <span>${priceCalculation.totalPrice}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Registration Action */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="bg-blue-800 text-white px-6 py-3 rounded-t-lg">
                <h2 className="text-lg font-bold text-white">Complete Registration</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <span className="text-blue-500 text-lg mr-2">💳</span>
                      <div>
                        <p className="text-sm font-medium text-blue-800">Pay with PayPal</p>
                        <p className="text-xs text-blue-600">
                          Click "Register Now" to save your registration. PayPal payment options will appear below.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* PayPal Preview Section */}
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="bg-white text-blue-600 px-4 py-2 rounded-lg text-lg font-bold mr-4">
                          PayPal
                        </div>
                        <div>
                          <p className="font-semibold">Secure Payment Processing</p>
                          <p className="text-sm text-blue-100">
                            Pay safely with your PayPal account or credit card
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">
                          ${priceCalculation.totalPrice.toFixed(2)}
                        </p>
                        <p className="text-sm text-blue-100">Total Amount</p>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-center space-x-6 text-sm">
                      <div className="flex items-center">
                        <span className="mr-2">🔒</span>
                        <span>Secure</span>
                      </div>
                      <div className="flex items-center">
                        <span className="mr-2">🌍</span>
                        <span>Global</span>
                      </div>
                      <div className="flex items-center">
                        <span className="mr-2">⚡</span>
                        <span>Instant</span>
                      </div>
                      <div className="flex items-center">
                        <span className="mr-2">🛡️</span>
                        <span>Protected</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || priceCalculation.totalPrice === 0}
                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-md font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isLoading ? 'Processing...' : 'Register Now'}
                  </button>

                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600 mb-2">Payment secured by</p>
                    <div className="flex justify-center space-x-2">
                      <span className="text-sm bg-blue-100 text-blue-800 px-3 py-2 rounded-lg font-medium">💳 PayPal</span>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Secure</span>
                      <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">Global</span>
                      <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Trusted</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* PayPal Payment Section */}
        {showPayPalSection && currentRegistrationId && priceCalculation.totalPrice > 0 && (
          <div className="mt-8 mb-8 w-full max-w-4xl mx-auto relative z-10">
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Complete Your Payment</h2>
              <p className="text-gray-600 text-sm">
                Your registration has been saved. Please complete your payment below to confirm your spot.
              </p>
            </div>
            <PayPalErrorBoundary>
              <PayPalButton
                amount={priceCalculation.totalPrice}
                currency="USD"
                registrationId={currentRegistrationId}
                registrationData={formData}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
                onCancel={() => console.log('Payment cancelled')}
              />
            </PayPalErrorBoundary>
          </div>
        )}

        {/* Error message when PayPal section should show but amount is 0 */}
        {showPayPalSection && currentRegistrationId && priceCalculation.totalPrice <= 0 && (
          <div className="mt-8 mb-8 w-full max-w-4xl mx-auto relative z-10">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <span className="text-yellow-500 text-2xl mr-3">⚠️</span>
                <h2 className="text-xl font-bold text-yellow-800">Payment Amount Issue</h2>
              </div>
              <p className="text-yellow-700 mb-4">
                Your registration has been saved, but there's an issue with the payment amount calculation.
              </p>
              <div className="bg-white rounded-lg p-4 mb-4">
                <h3 className="font-semibold text-gray-900 mb-2">Registration Details:</h3>
                <p className="text-sm text-gray-600">Registration ID: <span className="font-mono">{currentRegistrationId}</span></p>
                <p className="text-sm text-gray-600">Selected Type: {getSelection('registrationType') || getSelection('sponsorshipType') || 'None'}</p>
                <p className="text-sm text-gray-600">Calculated Amount: ${priceCalculation.totalPrice}</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    setShowPayPalSection(false);
                    setCurrentRegistrationId(null);
                  }}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                >
                  Go Back to Form
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Refresh Page
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Payment Component */}
        {showPayment && currentRegistrationId && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-blue-800 text-white px-6 py-4 rounded-t-lg">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold">Complete Payment</h2>
                  <button
                    onClick={() => {
                      setShowPayment(false);
                      setCurrentRegistrationId(null);
                    }}
                    className="text-white hover:text-gray-200 text-2xl"
                  >
                    ×
                  </button>
                </div>
                <p className="text-blue-100 text-sm mt-1">
                  Registration ID: {currentRegistrationId}
                </p>
              </div>

              <div className="p-6">
                <PayPalErrorBoundary>
                  <PayPalButton
                    amount={priceCalculation.totalPrice}
                    currency="USD"
                    registrationId={currentRegistrationId}
                    registrationData={formData}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                    onCancel={() => console.log('Payment cancelled')}
                  />
                </PayPalErrorBoundary>
              </div>
            </div>
          </div>
        )}

        {/* Success Message */}
        {paymentSuccess && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="bg-green-600 text-white px-6 py-4 rounded-t-lg">
                <h2 className="text-xl font-bold">Registration Successful! 🎉</h2>
              </div>
              <div className="p-6 text-center">
                <div className="text-6xl mb-4">✅</div>
                <p className="text-gray-700 mb-4">
                  Your registration and payment have been processed successfully!
                </p>
                <button
                  onClick={() => {
                    setPaymentSuccess(false);
                    // Optionally redirect to home or success page
                    window.location.href = '/';
                  }}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* PayPal integration now uses simple, clean implementation */}
    </div>
  );
}
