import { useState, useEffect, useCallback, useRef } from 'react';
import { PricingPeriod } from './useDynamicRegistration';
import { 
  determineActivePeriod, 
  PeriodDetectionResult, 
  formatTimeDuration, 
  getPeriodStatusMessage 
} from '@/app/utils/pricingPeriodUtils';

export interface UseRealTimePeriodDetectionOptions {
  periods: PricingPeriod[];
  updateInterval?: number; // milliseconds, default 60000 (1 minute)
  onPeriodChange?: (newPeriod: PricingPeriod | null, previousPeriod: PricingPeriod | null) => void;
  onTransitionWarning?: (timeRemaining: number, currentPeriod: PricingPeriod) => void;
  transitionWarningThreshold?: number; // milliseconds, default 1 hour
}

export interface UseRealTimePeriodDetectionReturn extends PeriodDetectionResult {
  currentTime: Date;
  statusMessage: string;
  isTransitionWarning: boolean;
  refreshPeriodDetection: () => void;
  timeUntilNextUpdate: number;
}

/**
 * Hook for real-time pricing period detection with automatic updates
 */
export const useRealTimePeriodDetection = (
  options: UseRealTimePeriodDetectionOptions
): UseRealTimePeriodDetectionReturn => {
  const {
    periods,
    updateInterval = 60000, // 1 minute
    onPeriodChange,
    onTransitionWarning,
    transitionWarningThreshold = 60 * 60 * 1000, // 1 hour
  } = options;

  const [currentTime, setCurrentTime] = useState(new Date());
  const [periodDetection, setPeriodDetection] = useState<PeriodDetectionResult>(() =>
    determineActivePeriod(periods, new Date())
  );
  const [timeUntilNextUpdate, setTimeUntilNextUpdate] = useState(updateInterval);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const previousActivePeriodRef = useRef<PricingPeriod | null>(periodDetection.activePeriod);
  const transitionWarningShownRef = useRef<Set<string>>(new Set());

  /**
   * Update period detection based on current time
   */
  const updatePeriodDetection = useCallback(() => {
    const now = new Date();
    const newDetection = determineActivePeriod(periods, now);
    
    setCurrentTime(now);
    setPeriodDetection(newDetection);

    // Check for period changes
    const previousPeriod = previousActivePeriodRef.current;
    const currentPeriod = newDetection.activePeriod;

    if (previousPeriod?.periodId !== currentPeriod?.periodId) {
      console.log('🔄 Pricing period changed:', {
        from: previousPeriod?.title || 'None',
        to: currentPeriod?.title || 'None',
        timestamp: now.toISOString(),
      });

      onPeriodChange?.(currentPeriod, previousPeriod);
      previousActivePeriodRef.current = currentPeriod;
      
      // Clear transition warnings for new period
      transitionWarningShownRef.current.clear();
    }

    // Check for transition warnings
    if (
      currentPeriod &&
      newDetection.timeUntilCurrentPeriodEnds !== null &&
      newDetection.timeUntilCurrentPeriodEnds <= transitionWarningThreshold &&
      !transitionWarningShownRef.current.has(currentPeriod.periodId)
    ) {
      console.log('⚠️ Transition warning:', {
        period: currentPeriod.title,
        timeRemaining: formatTimeDuration(newDetection.timeUntilCurrentPeriodEnds),
      });

      onTransitionWarning?.(newDetection.timeUntilCurrentPeriodEnds, currentPeriod);
      transitionWarningShownRef.current.add(currentPeriod.periodId);
    }

    // Reset countdown
    setTimeUntilNextUpdate(updateInterval);
  }, [periods, onPeriodChange, onTransitionWarning, transitionWarningThreshold, updateInterval]);

  /**
   * Manual refresh function
   */
  const refreshPeriodDetection = useCallback(() => {
    updatePeriodDetection();
  }, [updatePeriodDetection]);

  /**
   * Set up automatic updates
   */
  useEffect(() => {
    // Initial update
    updatePeriodDetection();

    // Set up main update interval
    intervalRef.current = setInterval(updatePeriodDetection, updateInterval);

    // Set up countdown timer (updates every second)
    countdownRef.current = setInterval(() => {
      setTimeUntilNextUpdate(prev => Math.max(0, prev - 1000));
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    };
  }, [updateInterval]);

  /**
   * Update when periods change (but not when updatePeriodDetection changes to avoid infinite loop)
   */
  useEffect(() => {
    if (periods && periods.length > 0) {
      updatePeriodDetection();
    }
  }, [periods]); // Removed updatePeriodDetection from dependencies to prevent infinite loop

  // Generate status message
  const statusMessage = getPeriodStatusMessage(periodDetection);

  // Check if we should show transition warning
  const isTransitionWarning = 
    periodDetection.activePeriod !== null &&
    periodDetection.timeUntilCurrentPeriodEnds !== null &&
    periodDetection.timeUntilCurrentPeriodEnds <= transitionWarningThreshold;

  return {
    ...periodDetection,
    currentTime,
    statusMessage,
    isTransitionWarning,
    refreshPeriodDetection,
    timeUntilNextUpdate,
  };
};

/**
 * Simplified hook for basic period detection without real-time updates
 */
export const usePeriodDetection = (periods: PricingPeriod[]) => {
  const [detection, setDetection] = useState<PeriodDetectionResult>(() =>
    determineActivePeriod(periods, new Date())
  );

  useEffect(() => {
    setDetection(determineActivePeriod(periods, new Date()));
  }, [periods]);

  return detection;
};

/**
 * Hook for period countdown display
 */
export const usePeriodCountdown = (targetDate: string | Date | null) => {
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (!targetDate) {
      setTimeRemaining(null);
      setIsExpired(false);
      return;
    }

    const updateCountdown = () => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const remaining = target - now;

      if (remaining <= 0) {
        setTimeRemaining(0);
        setIsExpired(true);
      } else {
        setTimeRemaining(remaining);
        setIsExpired(false);
      }
    };

    // Initial update
    updateCountdown();

    // Update every second
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return {
    timeRemaining,
    isExpired,
    formattedTime: timeRemaining ? formatTimeDuration(timeRemaining) : null,
  };
};
