'use client';

import React, { useRef, useEffect, useState } from 'react';
import { MapConfiguration } from '@/app/types/venueSettings';
import { useMapHoverOverlay } from '@/app/hooks/useMapHoverOverlay';
import MapHoverOverlay from './MapHoverOverlay';

// Dynamically import Leaflet to avoid SSR issues
let L: any = null;
if (typeof window !== 'undefined') {
  L = require('leaflet');
  require('leaflet/dist/leaflet.css');
}

interface VenueMapProps {
  mapConfig: MapConfiguration;
  venueName: string;
  venueAddress: string;
}

const VenueMap: React.FC<VenueMapProps> = ({ mapConfig, venueName, venueAddress }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showZoomInstructions, setShowZoomInstructions] = useState(true);
  const {
    showOverlay: showHoverOverlay,
    handleMouseEnter,
    handleMouseLeave,
    overlayContent
  } = useMapHoverOverlay();

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                            ('ontouchstart' in window) ||
                            (window.innerWidth <= 768);
      setIsMobile(isMobileDevice);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Hide instructions after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowZoomInstructions(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined' || !mapRef.current || !L || !mapConfig) return;

    // Initialize map with platform-specific controls
    const map = L.map(mapRef.current, {
      zoomControl: true,
      scrollWheelZoom: false, // Disable default scroll zoom
      doubleClickZoom: true,
      touchZoom: isMobile ? 'center' : false, // Enable touch zoom only on mobile
      dragging: true,
      tap: true,
      tapTolerance: 15,
      bounceAtZoomLimits: false,
    });

    mapInstanceRef.current = map;

    // Custom zoom control for desktop (Ctrl + scroll)
    if (!isMobile) {
      let isCtrlPressed = false;

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.ctrlKey || e.metaKey) {
          isCtrlPressed = true;
        }
      };

      const handleKeyUp = (e: KeyboardEvent) => {
        if (!e.ctrlKey && !e.metaKey) {
          isCtrlPressed = false;
        }
      };

      const handleWheel = (e: WheelEvent) => {
        if (isCtrlPressed) {
          e.preventDefault();
          const delta = e.deltaY > 0 ? -1 : 1;
          const currentZoom = map.getZoom();
          map.setZoom(currentZoom + delta);
        }
      };

      // Add event listeners
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('keyup', handleKeyUp);
      mapRef.current.addEventListener('wheel', handleWheel, { passive: false });

      // Cleanup function for desktop controls
      const cleanupDesktopControls = () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('keyup', handleKeyUp);
        if (mapRef.current) {
          mapRef.current.removeEventListener('wheel', handleWheel);
        }
      };

      // Store cleanup function
      (map as any)._cleanupDesktopControls = cleanupDesktopControls;
    } else {
      // Mobile-specific touch handling for better two-finger zoom
      let touchCount = 0;
      let initialTouchCount = 0;

      const handleTouchStart = (e: TouchEvent) => {
        touchCount = e.touches.length;
        initialTouchCount = touchCount;

        if (touchCount === 2) {
          // Two fingers detected - ensure zoom is enabled
          map.touchZoom.enable();
        }
        // Don't disable zoom for single finger - let Leaflet handle it naturally
      };

      const handleTouchMove = (e: TouchEvent) => {
        touchCount = e.touches.length;

        if (touchCount === 2 && initialTouchCount === 2) {
          // Two-finger gesture in progress - prevent page scrolling
          e.preventDefault();
          map.touchZoom.enable();
        }
      };

      const handleTouchEnd = (e: TouchEvent) => {
        touchCount = e.touches.length;

        // Only reset when all touches are gone
        if (touchCount === 0) {
          initialTouchCount = 0;
        }
      };

      // Add mobile touch event listeners
      if (mapRef.current) {
        mapRef.current.addEventListener('touchstart', handleTouchStart, { passive: true });
        mapRef.current.addEventListener('touchmove', handleTouchMove, { passive: false });
        mapRef.current.addEventListener('touchend', handleTouchEnd, { passive: true });

        // Cleanup function for mobile controls
        const cleanupMobileControls = () => {
          if (mapRef.current) {
            mapRef.current.removeEventListener('touchstart', handleTouchStart);
            mapRef.current.removeEventListener('touchmove', handleTouchMove);
            mapRef.current.removeEventListener('touchend', handleTouchEnd);
          }
        };

        // Store cleanup function
        (map as any)._cleanupMobileControls = cleanupMobileControls;
      }
    }

    // Add CartoDB Positron tiles (clean design)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap contributors © CARTO',
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    // Set map view to venue location
    const { latitude, longitude, zoomLevel = 15 } = mapConfig;
    map.setView([latitude, longitude], zoomLevel);

    // Create custom venue marker icon
    const venueIcon = L.divIcon({
      className: 'venue-marker',
      html: `
        <div style="
          width: 40px;
          height: 40px;
          background-color: #ea580c;
          border: 4px solid white;
          border-radius: 50%;
          box-shadow: 0 4px 12px rgba(234, 88, 12, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        ">
          <div style="
            font-size: 18px;
            color: white;
          ">🏨</div>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
      popupAnchor: [0, -20],
    });

    // Create marker for venue
    const marker = L.marker([latitude, longitude], { icon: venueIcon }).addTo(map);

    // Create popup content
    const popupContent = `
      <div style="min-width: 200px; font-family: system-ui, -apple-system, sans-serif;">
        <div style="
          background: linear-gradient(135deg, #ea580c, #dc2626);
          color: white;
          padding: 12px;
          margin: -12px -16px 12px -16px;
          border-radius: 8px 8px 0 0;
        ">
          <h3 style="
            margin: 0;
            font-size: 16px;
            font-weight: 600;
            line-height: 1.3;
          ">🏨 ${mapConfig.markerTitle || venueName}</h3>
        </div>
        <div style="padding: 0;">
          <p style="
            margin: 0 0 8px 0;
            color: #374151;
            font-size: 14px;
            line-height: 1.4;
          ">📍 ${venueAddress}</p>
          <div style="
            background: #f3f4f6;
            padding: 8px;
            border-radius: 6px;
            margin-top: 8px;
          ">
            <p style="
              margin: 0;
              color: #6b7280;
              font-size: 12px;
              text-align: center;
            ">Conference Venue</p>
          </div>
        </div>
      </div>
    `;

    // Bind popup to marker
    marker.bindPopup(popupContent, {
      className: 'venue-popup',
      maxWidth: 300,
      closeButton: true,
      autoClose: false,
      closeOnClick: false
    });

    // Open popup by default
    marker.openPopup();

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        // Cleanup desktop controls if they exist
        if ((mapInstanceRef.current as any)._cleanupDesktopControls) {
          (mapInstanceRef.current as any)._cleanupDesktopControls();
        }
        // Cleanup mobile controls if they exist
        if ((mapInstanceRef.current as any)._cleanupMobileControls) {
          (mapInstanceRef.current as any)._cleanupMobileControls();
        }
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [mapConfig, venueName, venueAddress]);

  // Loading state for SSR
  if (typeof window === 'undefined') {
    return (
      <div className="w-full h-[400px] bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-2">🗺️</div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="relative">
        <div
          ref={mapRef}
          className="w-full h-[400px] sm:h-[450px] md:h-[500px] rounded-lg overflow-hidden shadow-lg border border-gray-200"
          style={{
            minHeight: '400px',
            position: 'relative',
            zIndex: 1,
            isolation: 'isolate',
            touchAction: 'pan-x pan-y pinch-zoom'
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          role="application"
          aria-label="Interactive map showing venue location"
          aria-describedby="map-zoom-instruction"
        >
          <MapHoverOverlay
            show={showHoverOverlay}
            text={overlayContent.text}
            icon={overlayContent.icon}
          />
        </div>

        {/* Zoom Instructions Overlay */}
        {showZoomInstructions && (
          <div
            className={`absolute top-4 right-4 bg-black bg-opacity-75 text-white px-3 py-2 rounded-lg text-sm font-medium z-10 transition-opacity duration-300 ${
              showZoomInstructions ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ zIndex: 1000 }}
          >
            <div className="flex items-center space-x-2">
              <span className="text-lg">🔍</span>
              <span>
                {isMobile ? 'Use two fingers to zoom' : 'Hold Ctrl + scroll to zoom'}
              </span>
            </div>
            <button
              onClick={() => setShowZoomInstructions(false)}
              className="absolute -top-1 -right-1 w-5 h-5 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center text-xs transition-colors"
              aria-label="Close instructions"
            >
              ×
            </button>
          </div>
        )}
      </div>
      <style jsx global>{`
        .venue-popup .leaflet-popup-content-wrapper {
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.15);
          border: 1px solid #e5e7eb;
          padding: 0;
        }
        
        .venue-popup .leaflet-popup-content {
          margin: 12px 16px;
          line-height: 1.4;
        }
        
        .venue-popup .leaflet-popup-tip {
          background: white;
          border: 1px solid #e5e7eb;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .venue-marker {
          background: transparent !important;
          border: none !important;
        }
        
        .leaflet-control-zoom {
          border: none !important;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15) !important;
        }
        
        .leaflet-control-zoom a {
          background: white !important;
          border: 1px solid #e5e7eb !important;
          color: #374151 !important;
          font-weight: 600 !important;
        }
        
        .leaflet-control-zoom a:hover {
          background: #f9fafb !important;
          border-color: #d1d5db !important;
        }
      `}</style>
    </>
  );
};

export default VenueMap;
