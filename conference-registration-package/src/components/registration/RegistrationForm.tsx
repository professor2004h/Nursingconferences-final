// =============================================================================
// REGISTRATION FORM COMPONENT
// =============================================================================

'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { RegistrationFormData, RegistrationStep } from '@/types/registration';
import { validateRegistrationForm, validateStep } from '@/lib/utils/validation';
import { formatCurrency } from '@/lib/utils/formatting';
import { 
  TITLE_OPTIONS, 
  COUNTRIES, 
  REGISTRATION_TYPES, 
  ATTENDANCE_TYPES,
  REGISTRATION_STEPS 
} from '@/lib/utils/constants';
import { env } from '@/lib/config/environment';

interface RegistrationFormProps {
  onSubmit: (data: RegistrationFormData) => void;
  onPaymentRequired: (data: RegistrationFormData, amount: number) => void;
  loading?: boolean;
  initialData?: Partial<RegistrationFormData>;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({
  onSubmit,
  onPaymentRequired,
  loading = false,
  initialData,
}) => {
  const [currentStep, setCurrentStep] = useState<RegistrationStep>('personal-info');
  const [formData, setFormData] = useState<Partial<RegistrationFormData>>(initialData || {});
  const [stepErrors, setStepErrors] = useState<Record<string, string[]>>({});
  const [totalAmount, setTotalAmount] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger,
  } = useForm<RegistrationFormData>({
    defaultValues: initialData,
    mode: 'onChange',
  });

  const watchedValues = watch();

  // Calculate pricing based on registration type and current date
  useEffect(() => {
    const registrationType = watchedValues.registrationType;
    if (!registrationType) return;

    let price = 0;
    const now = new Date();
    const earlyBirdDeadline = new Date(env.CONFERENCE.EARLY_BIRD_DEADLINE);
    const regularDeadline = new Date(env.CONFERENCE.REGULAR_DEADLINE);

    if (registrationType === 'student') {
      price = env.PRICING.REGULAR - env.PRICING.STUDENT_DISCOUNT;
    } else if (registrationType === 'speaker') {
      price = 0; // Speakers get free registration
    } else if (now <= earlyBirdDeadline && registrationType === 'early-bird') {
      price = env.PRICING.EARLY_BIRD;
    } else if (now <= regularDeadline) {
      price = env.PRICING.REGULAR;
    } else {
      price = env.PRICING.REGULAR; // Late registration same as regular
    }

    setTotalAmount(price);
  }, [watchedValues.registrationType]);

  // Update form data when watched values change
  useEffect(() => {
    setFormData(prev => ({ ...prev, ...watchedValues }));
  }, [watchedValues]);

  // Get current step index
  const getCurrentStepIndex = () => {
    return REGISTRATION_STEPS.findIndex(step => step.id === currentStep);
  };

  // Validate current step
  const validateCurrentStep = async (): Promise<boolean> => {
    const stepValidation = validateStep(currentStep, formData);
    
    if (!stepValidation.isValid) {
      const errors = stepValidation.errors.reduce((acc, error) => {
        if (!acc[error.field]) acc[error.field] = [];
        acc[error.field].push(error.message);
        return acc;
      }, {} as Record<string, string[]>);
      
      setStepErrors(errors);
      toast.error('Please fix the errors before continuing');
      return false;
    }

    setStepErrors({});
    return true;
  };

  // Navigate to next step
  const nextStep = async () => {
    const isValid = await validateCurrentStep();
    if (!isValid) return;

    const currentIndex = getCurrentStepIndex();
    if (currentIndex < REGISTRATION_STEPS.length - 1) {
      setCurrentStep(REGISTRATION_STEPS[currentIndex + 1].id as RegistrationStep);
    }
  };

  // Navigate to previous step
  const prevStep = () => {
    const currentIndex = getCurrentStepIndex();
    if (currentIndex > 0) {
      setCurrentStep(REGISTRATION_STEPS[currentIndex - 1].id as RegistrationStep);
    }
  };

  // Handle form submission
  const onFormSubmit = async (data: RegistrationFormData) => {
    const validation = validateRegistrationForm(data);
    
    if (!validation.isValid) {
      toast.error('Please fix all errors before submitting');
      return;
    }

    if (totalAmount > 0) {
      onPaymentRequired(data, totalAmount);
    } else {
      onSubmit(data);
    }
  };

  // Render step indicator
  const renderStepIndicator = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {REGISTRATION_STEPS.slice(0, -2).map((step, index) => {
          const isActive = step.id === currentStep;
          const isCompleted = getCurrentStepIndex() > index;

          return (
            <div key={step.id} className="flex items-center">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                  isCompleted
                    ? 'bg-primary-600 text-white'
                    : isActive
                    ? 'bg-primary-100 text-primary-600 border-2 border-primary-600'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {isCompleted ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>

              {index < REGISTRATION_STEPS.length - 3 && (
                <div
                  className={`w-16 h-1 mx-2 ${
                    isCompleted ? 'bg-primary-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 text-center">
        <h2 className="text-xl font-semibold text-gray-900">
          {REGISTRATION_STEPS.find(step => step.id === currentStep)?.title}
        </h2>
        <p className="text-sm text-gray-600">
          {REGISTRATION_STEPS.find(step => step.id === currentStep)?.description}
        </p>
      </div>
    </div>
  );

  // Render personal information step
  const renderPersonalInfoStep = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Select
          label="Title"
          options={TITLE_OPTIONS}
          placeholder="Select title"
          required
          {...register('title', { required: 'Title is required' })}
          error={errors.title?.message}
        />

        <div /> {/* Empty div for grid spacing */}

        <Input
          label="First Name"
          type="text"
          required
          {...register('firstName', {
            required: 'First name is required',
            minLength: { value: 2, message: 'First name must be at least 2 characters' }
          })}
          error={errors.firstName?.message}
        />

        <Input
          label="Last Name"
          type="text"
          required
          {...register('lastName', {
            required: 'Last name is required',
            minLength: { value: 2, message: 'Last name must be at least 2 characters' }
          })}
          error={errors.lastName?.message}
        />

        <Input
          label="Email Address"
          type="email"
          required
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Please enter a valid email address'
            }
          })}
          error={errors.email?.message}
        />

        <Input
          label="Phone Number"
          type="tel"
          required
          {...register('phone', {
            required: 'Phone number is required',
            minLength: { value: 10, message: 'Phone number must be at least 10 digits' }
          })}
          error={errors.phone?.message}
        />
      </div>
    </div>
  );

  // Render contact details step
  const renderContactDetailsStep = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Select
          label="Country"
          options={COUNTRIES}
          placeholder="Select country"
          required
          {...register('country', { required: 'Country is required' })}
          error={errors.country?.message}
        />

        <div /> {/* Empty div for grid spacing */}

        <Input
          label="Address"
          type="text"
          required
          fullWidth
          className="md:col-span-2"
          {...register('address', {
            required: 'Address is required',
            minLength: { value: 5, message: 'Address must be at least 5 characters' }
          })}
          error={errors.address?.message}
        />

        <Input
          label="City"
          type="text"
          required
          {...register('city', {
            required: 'City is required',
            minLength: { value: 2, message: 'City must be at least 2 characters' }
          })}
          error={errors.city?.message}
        />

        <Input
          label="State/Province"
          type="text"
          required
          {...register('state', {
            required: 'State/Province is required',
            minLength: { value: 2, message: 'State must be at least 2 characters' }
          })}
          error={errors.state?.message}
        />

        <Input
          label="ZIP/Postal Code"
          type="text"
          required
          {...register('zipCode', {
            required: 'ZIP/Postal code is required',
            minLength: { value: 3, message: 'ZIP code must be at least 3 characters' }
          })}
          error={errors.zipCode?.message}
        />
      </div>
    </div>
  );

  // Render conference preferences step
  const renderConferencePreferencesStep = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Organization"
          type="text"
          required
          {...register('organization', {
            required: 'Organization is required',
            minLength: { value: 2, message: 'Organization must be at least 2 characters' }
          })}
          error={errors.organization?.message}
        />

        <Input
          label="Job Title"
          type="text"
          required
          {...register('jobTitle', {
            required: 'Job title is required',
            minLength: { value: 2, message: 'Job title must be at least 2 characters' }
          })}
          error={errors.jobTitle?.message}
        />

        <Select
          label="Registration Type"
          options={[
            { value: 'early-bird', label: 'Early Bird' },
            { value: 'regular', label: 'Regular' },
            { value: 'student', label: 'Student' },
            { value: 'speaker', label: 'Speaker' },
          ]}
          placeholder="Select registration type"
          required
          {...register('registrationType', { required: 'Registration type is required' })}
          error={errors.registrationType?.message}
        />

        <Select
          label="Attendance Type"
          options={[
            { value: 'in-person', label: 'In-Person' },
            { value: 'virtual', label: 'Virtual' },
            { value: 'hybrid', label: 'Hybrid' },
          ]}
          placeholder="Select attendance type"
          required
          {...register('attendanceType', { required: 'Attendance type is required' })}
          error={errors.attendanceType?.message}
        />
      </div>

      {totalAmount > 0 && (
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-primary-900 mb-2">
            Registration Fee
          </h3>
          <p className="text-2xl font-bold text-primary-600">
            {formatCurrency(totalAmount)}
          </p>
          <p className="text-sm text-primary-700 mt-1">
            Payment will be processed in the next step
          </p>
        </div>
      )}
    </div>
  );

  // Render additional information step
  const renderAdditionalInfoStep = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dietary Requirements
          </label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            rows={3}
            placeholder="Please specify any dietary requirements or allergies..."
            {...register('dietaryRequirements')}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Accessibility Needs
          </label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            rows={3}
            placeholder="Please specify any accessibility requirements..."
            {...register('accessibilityNeeds')}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Special Requests
          </label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            rows={3}
            placeholder="Any special requests or additional information..."
            {...register('specialRequests')}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="marketingConsent"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              {...register('marketingConsent')}
            />
            <label htmlFor="marketingConsent" className="ml-2 block text-sm text-gray-700">
              I consent to receive marketing communications about future conferences and events
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="newsletterSubscription"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              {...register('newsletterSubscription')}
            />
            <label htmlFor="newsletterSubscription" className="ml-2 block text-sm text-gray-700">
              Subscribe to our newsletter for conference updates and industry news
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  // Render review step
  const renderReviewStep = () => (
    <div className="space-y-6">
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Review Your Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Personal Information</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p>{formData.title} {formData.firstName} {formData.lastName}</p>
              <p>{formData.email}</p>
              <p>{formData.phone}</p>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">Contact Details</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p>{formData.address}</p>
              <p>{formData.city}, {formData.state} {formData.zipCode}</p>
              <p>{formData.country}</p>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">Conference Details</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p>Organization: {formData.organization}</p>
              <p>Job Title: {formData.jobTitle}</p>
              <p>Registration: {formData.registrationType}</p>
              <p>Attendance: {formData.attendanceType}</p>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">Registration Fee</h4>
            <div className="text-sm text-gray-600">
              <p className="text-lg font-bold text-primary-600">
                {formatCurrency(totalAmount)}
              </p>
              {totalAmount === 0 && (
                <p className="text-success-600">Free registration</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Render current step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 'personal-info':
        return renderPersonalInfoStep();
      case 'contact-details':
        return renderContactDetailsStep();
      case 'conference-preferences':
        return renderConferencePreferencesStep();
      case 'additional-info':
        return renderAdditionalInfoStep();
      case 'review':
        return renderReviewStep();
      default:
        return null;
    }
  };

  // Render navigation buttons
  const renderNavigationButtons = () => {
    const currentIndex = getCurrentStepIndex();
    const isFirstStep = currentIndex === 0;
    const isLastStep = currentIndex === REGISTRATION_STEPS.length - 3; // Exclude payment and confirmation steps

    return (
      <div className="flex justify-between pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={prevStep}
          disabled={isFirstStep || loading}
        >
          Previous
        </Button>

        {isLastStep ? (
          <Button
            type="submit"
            loading={loading}
            disabled={loading}
          >
            {totalAmount > 0 ? 'Proceed to Payment' : 'Complete Registration'}
          </Button>
        ) : (
          <Button
            type="button"
            onClick={nextStep}
            disabled={loading}
          >
            Next
          </Button>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" text="Processing registration..." />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-8">
        {renderStepIndicator()}
        {renderStepContent()}
        {renderNavigationButtons()}
      </form>
    </div>
  );
};

export default RegistrationForm;
