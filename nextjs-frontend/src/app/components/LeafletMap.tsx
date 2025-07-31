'use client';

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useMapHoverOverlay } from '@/app/hooks/useMapHoverOverlay';
import MapHoverOverlay from './MapHoverOverlay';
// Removed DMS coordinate processing - using decimal only

// Fix for default markers in Leaflet with Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapLocation {
  _id: string;
  title: string;
  category?: string;
  address: string;
  latitude: number;
  longitude: number;
  description?: string;
  isActive: boolean;
  priority?: number;
  markerColor?: string;
}

interface LeafletMapProps {
  locations: MapLocation[];
  getMarkerColor: (color?: string) => string;
}

const LeafletMap: React.FC<LeafletMapProps> = ({ locations, getMarkerColor }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const {
    isMobile,
    showOverlay,
    handleMouseEnter,
    handleMouseLeave,
    overlayContent
  } = useMapHoverOverlay();

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined' || !mapRef.current || locations.length === 0) return;

    // Initialize map with platform-specific controls
    const map = L.map(mapRef.current, {
      zoomControl: true,
      scrollWheelZoom: false, // Disable default scroll zoom
      doubleClickZoom: true,
      touchZoom: isMobile ? 'center' : false, // Enable touch zoom only on mobile
      dragging: true,
      bounceAtZoomLimits: false,
    });

    mapInstanceRef.current = map;

    // Platform-specific zoom controls
    if (!isMobile) {
      // Desktop: Ctrl + scroll zoom
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
      if (mapRef.current) {
        mapRef.current.addEventListener('wheel', handleWheel, { passive: false });
      }

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

    // Add CartoDB Positron tiles (English-only labels, clean design)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '', // Hide attribution as requested
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    // Process locations (decimal coordinates only)
    console.log('🗺️ LeafletMap: Processing', locations.length, 'locations');

    const validLocations = locations
      .filter((location) => {
        // Validate decimal coordinates
        if (typeof location.latitude !== 'number' || typeof location.longitude !== 'number') {
          console.log(`❌ LeafletMap: Invalid coordinates for:`, location.title);
          return false;
        }

        // Validate coordinate ranges
        if (location.latitude < -90 || location.latitude > 90 ||
            location.longitude < -180 || location.longitude > 180) {
          console.log(`❌ LeafletMap: Coordinates out of range for:`, location.title);
          return false;
        }

        console.log(`✅ LeafletMap: Valid coordinates for ${location.title}:`, {
          latitude: location.latitude,
          longitude: location.longitude
        });

        return true;
      });

    console.log('🗺️ LeafletMap: Valid locations count:', validLocations.length);

    if (validLocations.length === 0) {
      // Default to world view if no coordinates
      map.setView([20, 0], 2);
      return;
    }

    const bounds = L.latLngBounds([]);

    // Add markers with decimal coordinates
    validLocations.forEach((location) => {
      console.log(`📍 LeafletMap: Creating marker for ${location.title} at:`, {
        latitude: location.latitude,
        longitude: location.longitude
      });

      const latLng = L.latLng(location.latitude, location.longitude);
      bounds.extend(latLng);

      // Create custom marker icon
      const markerColor = getMarkerColor(location.markerColor);
      const customIcon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div style="
            width: 28px;
            height: 28px;
            background-color: ${markerColor};
            border: 3px solid white;
            border-radius: 50%;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
          ">
            <div style="
              width: 8px;
              height: 8px;
              background-color: white;
              border-radius: 50%;
            "></div>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
        popupAnchor: [0, -14],
      });

      // Create marker
      const marker = L.marker(latLng, { icon: customIcon }).addTo(map);

      // Create popup content
      const categoryIcon = location.category === 'office' ? '🏢' :
                          location.category === 'conference' ? '🏛️' :
                          location.category === 'venue' ? '🎪' :
                          location.category === 'partner' ? '🤝' :
                          location.category === 'hotel' ? '🏨' :
                          location.category === 'restaurant' ? '🍽️' : '📍';

      const popupContent = `
        <div style="
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          max-width: 280px;
          padding: 0;
        ">
          <div style="
            background: linear-gradient(135deg, ${markerColor}, ${markerColor}dd);
            color: white;
            padding: 12px 16px;
            margin: -12px -16px 12px -16px;
            border-radius: 8px 8px 0 0;
          ">
            <div style="
              display: flex;
              align-items: center;
              gap: 8px;
              margin-bottom: 4px;
            ">
              <span style="font-size: 18px;">${categoryIcon}</span>
              <h3 style="
                margin: 0;
                font-size: 16px;
                font-weight: 600;
                line-height: 1.3;
              ">${location.title}</h3>
            </div>
            ${location.category ? `
              <span style="
                display: inline-block;
                background: rgba(255,255,255,0.2);
                padding: 2px 8px;
                border-radius: 12px;
                font-size: 12px;
                font-weight: 500;
                text-transform: capitalize;
              ">${location.category}</span>
            ` : ''}
          </div>
          <p style="
            margin: 0 0 8px 0;
            font-size: 14px;
            color: #6b7280;
            line-height: 1.4;
          ">📍 ${location.address}</p>
          <p style="
            margin: 8px 0;
            font-size: 12px;
            color: #6b7280;
            font-family: monospace;
            background: #f3f4f6;
            padding: 4px 8px;
            border-radius: 4px;
            line-height: 1.3;
          ">🌍 ${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}</p>
          ${location.description ? `
            <p style="
              margin: 0;
              font-size: 14px;
              color: #4b5563;
              line-height: 1.4;
            ">${location.description}</p>
          ` : ''}
        </div>
      `;

      marker.bindPopup(popupContent, {
        maxWidth: 300,
        className: 'custom-popup'
      });
    });

    // Fit map to bounds with exact coordinates
    if (validLocations.length === 1) {
      // Single location - center and zoom to exact coordinates
      const location = validLocations[0];
      map.setView([location.latitude, location.longitude], 15);
    } else if (validLocations.length > 1) {
      // Multiple locations - fit bounds with padding
      map.fitBounds(bounds, {
        padding: [20, 20],
        maxZoom: 15
      });
    }

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
  }, [locations, getMarkerColor]);

  return (
    <>
      <div
        ref={mapRef}
        className="w-full h-[400px] sm:h-[450px] md:h-[500px] lg:h-[600px] relative overflow-hidden"
        style={{
          minHeight: '400px',
          position: 'relative',
          zIndex: 1,
          isolation: 'isolate',
          touchAction: 'pan-x pan-y pinch-zoom'
        }}
        role="application"
        aria-label="Interactive map showing global locations"
      >
        {/* Fixed zoom instruction at bottom */}
        <div
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded text-sm whitespace-nowrap z-10"
          id="map-zoom-instruction"
        >
          {isMobile ? 'Use two fingers to zoom' : 'Hold Ctrl + scroll to zoom'}
        </div>
      </div>
      <style jsx global>{`
        .custom-popup .leaflet-popup-content-wrapper {
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.15);
          border: 1px solid #e5e7eb;
        }
        
        .custom-popup .leaflet-popup-content {
          margin: 12px 16px;
          line-height: 1.4;
        }
        
        .custom-popup .leaflet-popup-tip {
          background: white;
          border: 1px solid #e5e7eb;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .custom-marker {
          background: transparent !important;
          border: none !important;
        }
        
        .leaflet-container {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          position: relative !important;
          z-index: 1 !important;
          overflow: hidden !important;
        }

        /* Fix for mobile scrolling issues */
        .leaflet-container .leaflet-control-container {
          position: relative !important;
        }

        /* Prevent map from overlaying other elements */
        .leaflet-pane {
          z-index: 1 !important;
        }

        /* Fix touch issues on mobile */
        .leaflet-container .leaflet-control-zoom {
          position: absolute !important;
          top: 10px !important;
          left: 10px !important;
          z-index: 1000 !important;
        }
        
        .leaflet-control-zoom {
          border: none !important;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15) !important;
        }
        
        .leaflet-control-zoom a {
          border: none !important;
          background: white !important;
          color: #374151 !important;
          font-weight: 600 !important;
        }
        
        .leaflet-control-zoom a:hover {
          background: #f3f4f6 !important;
        }
        
        .leaflet-control-attribution {
          display: none !important;
        }
      `}</style>
    </>
  );
};

export default LeafletMap;
