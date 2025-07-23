'use client';

import { useState, useEffect, useCallback } from 'react';

interface UseMapHoverOverlayReturn {
  isMobile: boolean;
  showOverlay: boolean;
  handleMouseEnter: () => void;
  handleMouseLeave: () => void;
  overlayContent: {
    text: string;
    icon: string;
  };
}

export const useMapHoverOverlay = (): UseMapHoverOverlayReturn => {
  const [isMobile, setIsMobile] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

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

  const handleMouseEnter = useCallback(() => {
    // Only show overlay on desktop (non-touch devices)
    if (!isMobile) {
      setShowOverlay(true);
    }
  }, [isMobile]);

  const handleMouseLeave = useCallback(() => {
    setShowOverlay(false);
  }, []);

  const overlayContent = {
    text: isMobile ? 'Use two fingers to zoom' : 'Hold Ctrl + scroll to zoom',
    icon: isMobile ? '👆' : '⌨️'
  };

  return {
    isMobile,
    showOverlay,
    handleMouseEnter,
    handleMouseLeave,
    overlayContent
  };
};
