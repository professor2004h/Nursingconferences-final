'use client';

import React from 'react';

interface Benefit {
  title: string;
  description?: string;
  icon: string;
  isHighlighted?: boolean;
  displayOrder: number;
}

interface ParticipationBenefitsData {
  title: string;
  isActive: boolean;
  subtitle?: string;
  benefits: Benefit[];
  maxHeight?: string;
  backgroundColor?: string;
  displayOrder: number;
}

interface ParticipationBenefitsSectionProps {
  benefitsData: ParticipationBenefitsData | null;
}

const ParticipationBenefitsSection: React.FC<ParticipationBenefitsSectionProps> = ({ benefitsData }) => {
  if (!benefitsData || !benefitsData.isActive || !benefitsData.benefits?.length) {
    return null;
  }

  const getIconComponent = (iconType: string) => {
    const iconClasses = "w-5 h-5 text-blue-600 flex-shrink-0";
    
    switch (iconType) {
      case 'check':
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'arrow':
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        );
      case 'star':
        return (
          <svg className={iconClasses} fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        );
      case 'gift':
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
          </svg>
        );
      case 'certificate':
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
        );
      case 'book':
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        );
      case 'coffee':
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3a2 2 0 002 2h4a2 2 0 002-2v-3M8 14V9a2 2 0 012-2h4a2 2 0 012 2v5M8 14H6a2 2 0 01-2-2V9a2 2 0 012-2h2m0 0V5a2 2 0 012-2h4a2 2 0 012 2v2" />
          </svg>
        );
      case 'food':
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
          </svg>
        );
      case 'network':
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        );
      case 'badge':
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
        );
      default:
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
    }
  };

  // Sort benefits by display order
  const sortedBenefits = [...benefitsData.benefits].sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <div className="bg-white rounded-xl p-6 md:p-8 shadow-lg border border-gray-200 h-full flex flex-col w-full">
      {/* Header - Exact skeleton match */}
      <div className="text-center mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-3 h-6 flex items-center justify-center">
          {benefitsData.title}
        </h2>
        {benefitsData.subtitle && (
          <p className="text-gray-600 text-sm">
            {benefitsData.subtitle}
          </p>
        )}
        <div className="w-12 h-0.5 bg-gray-400 mx-auto mt-3"></div>
      </div>

      {/* Benefits List - Exact skeleton match with compact design */}
      <div className="flex-1 border border-gray-200 bg-gray-50 overflow-hidden">
        <div className="h-full overflow-y-auto p-4" style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#9ca3af #f3f4f6'
        }}>
          <style jsx>{`
            div::-webkit-scrollbar {
              width: 6px;
            }
            div::-webkit-scrollbar-track {
              background: #f3f4f6;
              border-radius: 3px;
            }
            div::-webkit-scrollbar-thumb {
              background: #9ca3af;
              border-radius: 3px;
            }
            div::-webkit-scrollbar-thumb:hover {
              background: #6b7280;
            }
          `}</style>
          <div className="space-y-3">
            {sortedBenefits.map((benefit, index) => (
              <div
                key={index}
                className={`bg-white border border-gray-200 p-3 ${
                  benefit.isHighlighted ? 'border-orange-300 bg-orange-50' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Icon - Exact skeleton match */}
                  <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                    {getIconComponent(benefit.icon)}
                  </div>

                  {/* Content - Compact design */}
                  <div className="flex-1 min-w-0">
                    <h3 className={`text-sm font-medium mb-1 leading-tight ${
                      benefit.isHighlighted ? 'text-orange-800' : 'text-gray-800'
                    }`}>
                      {benefit.title}
                    </h3>
                    {benefit.description && (
                      <p className={`text-xs leading-tight ${
                        benefit.isHighlighted ? 'text-orange-700' : 'text-gray-600'
                      }`}>
                        {benefit.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParticipationBenefitsSection;
