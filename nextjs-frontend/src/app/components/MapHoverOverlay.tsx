'use client';

import React from 'react';

interface MapHoverOverlayProps {
  show: boolean;
  text: string;
  icon: string;
  className?: string;
}

const MapHoverOverlay: React.FC<MapHoverOverlayProps> = ({ 
  show, 
  text, 
  icon, 
  className = '' 
}) => {
  return (
    <div
      className={`
        absolute inset-0 z-50 pointer-events-none
        transition-opacity duration-300 ease-in-out
        ${show ? 'opacity-100' : 'opacity-0'}
        ${className}
      `}
      style={{
        background: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(2px)'
      }}
      role="tooltip"
      aria-live="polite"
      aria-hidden={!show}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-black bg-opacity-90 text-white px-8 py-5 rounded-xl shadow-2xl backdrop-blur-md border border-white border-opacity-30 transform transition-transform duration-300 hover:scale-105">
          <div className="flex items-center gap-4">
            <span
              className="text-3xl animate-pulse"
              role="img"
              aria-label={icon === '⌨️' ? 'keyboard icon' : 'touch gesture icon'}
            >
              {icon}
            </span>
            <span
              className="text-xl font-semibold whitespace-nowrap tracking-wide"
              id="map-zoom-instruction"
            >
              {text}
            </span>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-20 rounded-xl"></div>
        </div>
      </div>
    </div>
  );
};

export default MapHoverOverlay;
