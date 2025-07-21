import { PricingPeriod } from '@/app/hooks/useDynamicRegistration';

/**
 * Utility functions for managing pricing periods and real-time active period detection
 */

export interface PeriodDetectionResult {
  activePeriod: PricingPeriod | null;
  nextPeriod: PricingPeriod | null;
  previousPeriod: PricingPeriod | null;
  timeUntilNextPeriod: number | null; // milliseconds
  timeUntilCurrentPeriodEnds: number | null; // milliseconds
  isInTransitionPeriod: boolean;
}

/**
 * Determine the currently active pricing period based on current date
 */
export function determineActivePeriod(
  periods: PricingPeriod[],
  currentDate: Date = new Date()
): PeriodDetectionResult {
  if (!periods || periods.length === 0) {
    return {
      activePeriod: null,
      nextPeriod: null,
      previousPeriod: null,
      timeUntilNextPeriod: null,
      timeUntilCurrentPeriodEnds: null,
      isInTransitionPeriod: false,
    };
  }

  // Sort periods by start date
  const sortedPeriods = [...periods]
    .filter(period => period.isActive)
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

  let activePeriod: PricingPeriod | null = null;
  let nextPeriod: PricingPeriod | null = null;
  let previousPeriod: PricingPeriod | null = null;

  const currentTime = currentDate.getTime();

  // Find the active period
  for (let i = 0; i < sortedPeriods.length; i++) {
    const period = sortedPeriods[i];
    const startTime = new Date(period.startDate).getTime();
    const endTime = new Date(period.endDate).getTime();

    if (currentTime >= startTime && currentTime <= endTime) {
      activePeriod = period;
      nextPeriod = sortedPeriods[i + 1] || null;
      previousPeriod = sortedPeriods[i - 1] || null;
      break;
    } else if (currentTime < startTime) {
      // Current time is before this period, so this is the next period
      nextPeriod = period;
      previousPeriod = sortedPeriods[i - 1] || null;
      break;
    } else {
      // Current time is after this period
      previousPeriod = period;
    }
  }

  // If no active period found, check if we're past all periods
  if (!activePeriod && !nextPeriod && sortedPeriods.length > 0) {
    previousPeriod = sortedPeriods[sortedPeriods.length - 1];
  }

  // Calculate time until next period starts
  const timeUntilNextPeriod = nextPeriod 
    ? new Date(nextPeriod.startDate).getTime() - currentTime
    : null;

  // Calculate time until current period ends
  const timeUntilCurrentPeriodEnds = activePeriod
    ? new Date(activePeriod.endDate).getTime() - currentTime
    : null;

  // Check if we're in a transition period (within 24 hours of period change)
  const transitionThreshold = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  const isInTransitionPeriod = 
    (timeUntilCurrentPeriodEnds !== null && timeUntilCurrentPeriodEnds <= transitionThreshold) ||
    (timeUntilNextPeriod !== null && timeUntilNextPeriod <= transitionThreshold);

  return {
    activePeriod,
    nextPeriod,
    previousPeriod,
    timeUntilNextPeriod,
    timeUntilCurrentPeriodEnds,
    isInTransitionPeriod,
  };
}

/**
 * Format time duration in a human-readable format
 */
export function formatTimeDuration(milliseconds: number): string {
  if (milliseconds <= 0) return 'Expired';

  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days} day${days !== 1 ? 's' : ''}, ${hours % 24} hour${hours % 24 !== 1 ? 's' : ''}`;
  } else if (hours > 0) {
    return `${hours} hour${hours !== 1 ? 's' : ''}, ${minutes % 60} minute${minutes % 60 !== 1 ? 's' : ''}`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes !== 1 ? 's' : ''}, ${seconds % 60} second${seconds % 60 !== 1 ? 's' : ''}`;
  } else {
    return `${seconds} second${seconds !== 1 ? 's' : ''}`;
  }
}

/**
 * Get period status message
 */
export function getPeriodStatusMessage(result: PeriodDetectionResult): string {
  if (result.activePeriod) {
    if (result.isInTransitionPeriod && result.timeUntilCurrentPeriodEnds) {
      return `${result.activePeriod.title} ends in ${formatTimeDuration(result.timeUntilCurrentPeriodEnds)}`;
    }
    return `${result.activePeriod.title} is currently active`;
  } else if (result.nextPeriod && result.timeUntilNextPeriod) {
    return `${result.nextPeriod.title} starts in ${formatTimeDuration(result.timeUntilNextPeriod)}`;
  } else if (result.previousPeriod) {
    return `Registration period has ended (last period: ${result.previousPeriod.title})`;
  } else {
    return 'No pricing periods configured';
  }
}

/**
 * Check if a specific period is currently active
 */
export function isPeriodActive(period: PricingPeriod, currentDate: Date = new Date()): boolean {
  const currentTime = currentDate.getTime();
  const startTime = new Date(period.startDate).getTime();
  const endTime = new Date(period.endDate).getTime();
  
  return period.isActive && currentTime >= startTime && currentTime <= endTime;
}

/**
 * Get the next upcoming period
 */
export function getNextPeriod(periods: PricingPeriod[], currentDate: Date = new Date()): PricingPeriod | null {
  const currentTime = currentDate.getTime();
  
  return periods
    .filter(period => period.isActive && new Date(period.startDate).getTime() > currentTime)
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())[0] || null;
}

/**
 * Validate pricing period configuration
 */
export function validatePricingPeriods(periods: PricingPeriod[]): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!periods || periods.length === 0) {
    errors.push('No pricing periods configured');
    return { isValid: false, errors, warnings };
  }

  // Sort periods by start date for validation
  const sortedPeriods = [...periods].sort((a, b) => 
    new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );

  // Check for overlapping periods
  for (let i = 0; i < sortedPeriods.length - 1; i++) {
    const current = sortedPeriods[i];
    const next = sortedPeriods[i + 1];
    
    const currentEnd = new Date(current.endDate).getTime();
    const nextStart = new Date(next.startDate).getTime();
    
    if (currentEnd >= nextStart) {
      errors.push(`Period "${current.title}" overlaps with "${next.title}"`);
    }
  }

  // Check for gaps between periods
  for (let i = 0; i < sortedPeriods.length - 1; i++) {
    const current = sortedPeriods[i];
    const next = sortedPeriods[i + 1];
    
    const currentEnd = new Date(current.endDate).getTime();
    const nextStart = new Date(next.startDate).getTime();
    const gap = nextStart - currentEnd;
    
    if (gap > 24 * 60 * 60 * 1000) { // More than 24 hours gap
      warnings.push(`Gap of ${formatTimeDuration(gap)} between "${current.title}" and "${next.title}"`);
    }
  }

  // Check for invalid date ranges
  periods.forEach(period => {
    const startTime = new Date(period.startDate).getTime();
    const endTime = new Date(period.endDate).getTime();
    
    if (startTime >= endTime) {
      errors.push(`Period "${period.title}" has invalid date range (start date must be before end date)`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}
