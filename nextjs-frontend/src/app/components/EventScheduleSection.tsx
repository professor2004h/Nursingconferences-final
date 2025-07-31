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
      return 'bg-orange-100 border-orange-500 text-orange-800';
    }

    switch (type) {
      case 'keynote':
        return 'bg-blue-100 border-blue-400 text-blue-800';
      case 'plenary':
        return 'bg-indigo-100 border-indigo-400 text-indigo-800';
      case 'break':
      case 'lunch':
        return 'bg-green-100 border-green-400 text-green-800';
      case 'registration':
        return 'bg-gray-100 border-gray-400 text-gray-800';
      case 'opening':
      case 'closing':
        return 'bg-orange-100 border-orange-400 text-orange-800';
      default:
        return 'bg-white border-gray-300 text-gray-800';
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-6 md:p-8 shadow-xl h-full flex flex-col">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
          {scheduleData.title}
        </h2>
        <div className="w-16 h-1 bg-orange-400 mx-auto rounded-full"></div>
      </div>

      {/* Day Tabs */}
      <div className="flex flex-wrap justify-center mb-8 gap-2">
        {scheduleData.days.map((day, index) => (
          <button
            key={day.dayNumber}
            onClick={() => setActiveDay(index)}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
              activeDay === index
                ? 'bg-orange-500 text-white shadow-lg transform scale-105'
                : 'bg-blue-700 text-blue-100 hover:bg-blue-600 hover:text-white'
            }`}
          >
            <div className="text-sm">Day {day.dayNumber}</div>
            <div className="text-xs opacity-90">{day.displayDate}</div>
          </button>
        ))}
      </div>

      {/* Schedule Content - Flex grow to fill remaining space */}
      <div className="bg-blue-700 rounded-lg p-6 flex-grow">
        {scheduleData.days[activeDay] && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white text-center mb-6">
              Day {scheduleData.days[activeDay].dayNumber} - {scheduleData.days[activeDay].displayDate}
            </h3>
            
            {/* Timeline */}
            <div className="space-y-3">
              {scheduleData.days[activeDay].sessions.map((session, sessionIndex) => (
                <div key={sessionIndex} className="flex items-start gap-4">
                  {/* Time */}
                  <div className="flex-shrink-0 w-24 md:w-28">
                    <div className="text-orange-400 font-semibold text-sm">
                      {session.startTime}
                    </div>
                    <div className="text-orange-300 text-xs">
                      {session.endTime}
                    </div>
                  </div>

                  {/* Timeline Line */}
                  <div className="flex-shrink-0 flex flex-col items-center">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    {sessionIndex < scheduleData.days[activeDay].sessions.length - 1 && (
                      <div className="w-0.5 h-8 bg-orange-500 opacity-50"></div>
                    )}
                  </div>
                  
                  {/* Session Content */}
                  <div className="flex-1 min-w-0">
                    <div className={`p-4 rounded-lg border-l-4 ${getSessionTypeColor(session.type, session.isHighlighted)}`}>
                      <h4 className="font-semibold text-sm md:text-base mb-1">
                        {session.title}
                      </h4>
                      {session.description && (
                        <p className="text-xs md:text-sm opacity-80">
                          {session.description}
                        </p>
                      )}
                      <div className="mt-2">
                        <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full capitalize">
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
