'use client';

import React, { useState } from 'react';

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

interface EventScheduleSectionProps {
  scheduleData: EventScheduleData | null;
}

const EventScheduleSection: React.FC<EventScheduleSectionProps> = ({ scheduleData }) => {
  const [activeDay, setActiveDay] = useState(0);

  if (!scheduleData || !scheduleData.isActive || !scheduleData.days?.length) {
    return null;
  }

  const getSessionTypeColor = (type: string, isHighlighted?: boolean) => {
    if (isHighlighted) {
      return 'bg-orange-50 border-orange-400 text-orange-800';
    }

    switch (type) {
      case 'keynote':
        return 'bg-blue-50 border-blue-400 text-blue-800';
      case 'plenary':
        return 'bg-indigo-50 border-indigo-400 text-indigo-800';
      case 'break':
      case 'lunch':
        return 'bg-green-50 border-green-400 text-green-800';
      case 'registration':
        return 'bg-gray-50 border-gray-400 text-gray-800';
      case 'opening':
      case 'closing':
        return 'bg-orange-50 border-orange-400 text-orange-800';
      default:
        return 'bg-white border-gray-300 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-xl p-4 md:p-6 shadow-xl border border-gray-200 h-full flex flex-col">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
          {scheduleData.title}
        </h2>
        <div className="w-16 h-1 bg-blue-500 mx-auto rounded-full"></div>
      </div>

      {/* Day Tabs */}
      <div className="flex flex-wrap justify-center mb-6 gap-2">
        {scheduleData.days.map((day, index) => (
          <button
            key={day.dayNumber}
            onClick={() => setActiveDay(index)}
            className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 border ${
              activeDay === index
                ? 'bg-blue-600 text-white shadow-lg transform scale-105 border-blue-600'
                : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700'
            }`}
          >
            <div className="text-sm">Day {day.dayNumber}</div>
            <div className="text-xs opacity-90">{day.displayDate}</div>
          </button>
        ))}
      </div>

      {/* Schedule Content - Flex grow to fill remaining space */}
      <div className="bg-gray-50 rounded-lg p-4 flex-grow border border-gray-200">
        {scheduleData.days[activeDay] && (
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-gray-900 text-center mb-4">
              Day {scheduleData.days[activeDay].dayNumber} - {scheduleData.days[activeDay].displayDate}
            </h3>
            
            {/* Timeline */}
            <div className="space-y-2">
              {scheduleData.days[activeDay].sessions.map((session, sessionIndex) => (
                <div key={sessionIndex} className="flex items-start gap-3">
                  {/* Time */}
                  <div className="flex-shrink-0 w-24 md:w-28">
                    <div className="text-blue-600 font-semibold text-sm">
                      {session.startTime}
                    </div>
                    <div className="text-blue-500 text-xs">
                      {session.endTime}
                    </div>
                  </div>

                  {/* Timeline Line */}
                  <div className="flex-shrink-0 flex flex-col items-center">
                    <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
                    {sessionIndex < scheduleData.days[activeDay].sessions.length - 1 && (
                      <div className="w-0.5 h-6 bg-blue-500 opacity-50"></div>
                    )}
                  </div>

                  {/* Session Content */}
                  <div className="flex-1 min-w-0">
                    <div className={`p-3 rounded-lg border-l-4 ${getSessionTypeColor(session.type, session.isHighlighted)}`}>
                      <h4 className="font-semibold text-sm md:text-base mb-1">
                        {session.title}
                      </h4>
                      {session.description && (
                        <p className="text-xs md:text-sm opacity-80">
                          {session.description}
                        </p>
                      )}
                      <div className="mt-2">
                        <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full capitalize">
                          {session.type.replace('-', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventScheduleSection;
