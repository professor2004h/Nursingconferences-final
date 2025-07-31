'use client';

import React, { useState, useEffect } from 'react';
import EventScheduleSection from './EventScheduleSection';
import ParticipationBenefitsSection from './ParticipationBenefitsSection';

interface Session {
  startTime: string;
  endTime: string;
  title: string;
  description?: string;
  type: string;
  isHighlighted?: boolean;
}

interface Day {
  dayNumber: number;
  date: string;
  displayDate: string;
  sessions: Session[];
}

interface EventScheduleData {
  title: string;
  isActive: boolean;
  days: Day[];
  displayOrder: number;
}

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

interface EventScheduleAndBenefitsSectionProps {
  className?: string;
}

const EventScheduleAndBenefitsSection: React.FC<EventScheduleAndBenefitsSectionProps> = ({ 
  className = '' 
}) => {
  const [scheduleData, setScheduleData] = useState<EventScheduleData | null>(null);
  const [benefitsData, setBenefitsData] = useState<ParticipationBenefitsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch both schedule and benefits data
        const [scheduleResponse, benefitsResponse] = await Promise.all([
          fetch('/api/event-schedule'),
          fetch('/api/participation-benefits')
        ]);

        let scheduleResult = null;
        let benefitsResult = null;

        if (scheduleResponse.ok) {
          const scheduleJson = await scheduleResponse.json();
          if (scheduleJson.success && scheduleJson.data) {
            scheduleResult = scheduleJson.data;
          }
        }

        if (benefitsResponse.ok) {
          const benefitsJson = await benefitsResponse.json();
          if (benefitsJson.success && benefitsJson.data) {
            benefitsResult = benefitsJson.data;
          }
        }

        setScheduleData(scheduleResult);
        setBenefitsData(benefitsResult);
      } catch (err) {
        console.error('Error fetching schedule and benefits data:', err);
        setError('Failed to load schedule and benefits data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Don't render anything if both sections are inactive or missing
  if (!loading && !scheduleData?.isActive && !benefitsData?.isActive) {
    return null;
  }

  if (loading) {
    return (
      <section className={`py-12 md:py-16 lg:py-20 bg-gradient-to-br from-gray-50 to-gray-100 ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Schedule Skeleton */}
            <div className="bg-gray-900 rounded-xl p-6 md:p-8 shadow-xl animate-pulse">
              <div className="text-center mb-8">
                <div className="h-8 bg-gray-700 rounded w-32 mx-auto mb-2"></div>
                <div className="w-16 h-1 bg-gray-700 mx-auto rounded-full"></div>
              </div>
              <div className="flex justify-center mb-8 gap-2">
                <div className="h-16 bg-gray-700 rounded-lg w-24"></div>
                <div className="h-16 bg-gray-700 rounded-lg w-24"></div>
              </div>
              <div className="bg-gray-800 rounded-lg p-6">
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="w-24 h-12 bg-gray-700 rounded"></div>
                      <div className="w-3 h-3 bg-gray-700 rounded-full mt-2"></div>
                      <div className="flex-1 h-16 bg-gray-700 rounded"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Benefits Skeleton */}
            <div className="bg-white rounded-xl p-6 md:p-8 shadow-xl border border-gray-200 animate-pulse">
              <div className="text-center mb-8">
                <div className="h-8 bg-gray-300 rounded w-48 mx-auto mb-2"></div>
                <div className="w-16 h-1 bg-gray-300 mx-auto rounded-full"></div>
              </div>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-5 h-5 bg-gray-300 rounded"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={`py-12 md:py-16 lg:py-20 bg-gradient-to-br from-gray-50 to-gray-100 ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-red-800 mb-2">
                Unable to Load Schedule & Benefits
              </h3>
              <p className="text-red-600">
                {error}
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`py-12 md:py-16 lg:py-20 bg-gradient-to-br from-gray-50 to-gray-100 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop: 2-column layout, Mobile: 1-column stacked */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Event Schedule - Left column on desktop, top on mobile */}
          <div className="order-1">
            <EventScheduleSection scheduleData={scheduleData} />
          </div>
          
          {/* Participation Benefits - Right column on desktop, bottom on mobile */}
          <div className="order-2">
            <ParticipationBenefitsSection benefitsData={benefitsData} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventScheduleAndBenefitsSection;
