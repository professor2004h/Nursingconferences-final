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



  return (
    <div className="bg-white rounded-xl p-6 md:p-8 shadow-lg border border-gray-200 h-full flex flex-col w-full">
      {/* Header - Exact skeleton match */}
      <div className="text-center mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-3 h-6 flex items-center justify-center">
          {scheduleData.title}
        </h2>
        <div className="w-12 h-0.5 bg-gray-400 mx-auto"></div>
      </div>

      {/* Day Tabs - Exact skeleton match */}
      <div className="flex justify-center mb-6 gap-1">
        {scheduleData.days.map((day, index) => (
          <button
            key={day.dayNumber}
            onClick={() => setActiveDay(index)}
            className={`h-8 w-16 text-xs font-medium transition-colors flex items-center justify-center ${
              activeDay === index
                ? 'bg-gray-800 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Day {day.dayNumber}
          </button>
        ))}
      </div>

      {/* Schedule Content - Exact skeleton match with compact design */}
      <div className="flex-1 border border-gray-200 bg-gray-50 overflow-hidden">
        {scheduleData.days[activeDay] && (
          <div className="h-full flex flex-col">
            <div className="bg-white px-4 py-3 border-b border-gray-200 flex-shrink-0">
              <h3 className="text-sm font-medium text-gray-700 text-center h-4 flex items-center justify-center">
                {scheduleData.days[activeDay].displayDate}
              </h3>
            </div>

            {/* Scrollable Timeline Container - Exact skeleton match */}
            <div className="flex-1 overflow-y-auto p-4" style={{
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
                {scheduleData.days[activeDay].sessions.map((session, sessionIndex) => (
                  <div key={sessionIndex} className="bg-white border border-gray-200 p-3">
                    <div className="flex items-start gap-3">
                      {/* Time - Exact skeleton match */}
                      <div className="flex-shrink-0 w-16 h-8 flex flex-col justify-center text-xs text-gray-500">
                        <div className="font-medium leading-tight">{session.startTime}</div>
                        <div className="leading-tight">{session.endTime}</div>
                      </div>

                      {/* Session Content - Compact design */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-800 mb-1 leading-tight">
                          {session.title}
                        </h4>
                        {session.description && (
                          <p className="text-xs text-gray-600 mb-2 leading-tight">
                            {session.description}
                          </p>
                        )}
                        <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium leading-none">
                          {session.type.replace('-', ' ').toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventScheduleSection;
