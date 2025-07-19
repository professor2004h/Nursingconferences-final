'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface NavigationLoadingState {
  isLoading: boolean;
  showOverlay: boolean;
  hasTimedOut: boolean;
  progress: number;
}

interface UseNavigationLoadingOptions {
  threshold?: number; // milliseconds before showing overlay
  timeout?: number; // milliseconds before timeout
  enableProgressBar?: boolean;
}

export function useNavigationLoading({
  threshold = 300,
  timeout = 10000,
  enableProgressBar = true
}: UseNavigationLoadingOptions = {}) {
  const router = useRouter();
  const pathname = usePathname();
  
  const [state, setState] = useState<NavigationLoadingState>({
    isLoading: false,
    showOverlay: false,
    hasTimedOut: false,
    progress: 0
  });

  useEffect(() => {
    let loadingTimer: NodeJS.Timeout;
    let timeoutTimer: NodeJS.Timeout;
    let progressInterval: NodeJS.Timeout;

    const startLoading = () => {
      setState(prev => ({ ...prev, isLoading: true, hasTimedOut: false, progress: 0 }));
      
      // Start progress animation if enabled
      if (enableProgressBar) {
        progressInterval = setInterval(() => {
          setState(prev => ({
            ...prev,
            progress: Math.min(prev.progress + Math.random() * 15, 90)
          }));
        }, 200);
      }
      
      // Show overlay after threshold
      loadingTimer = setTimeout(() => {
        setState(prev => ({ ...prev, showOverlay: true }));
      }, threshold);
      
      // Set timeout
      timeoutTimer = setTimeout(() => {
        setState(prev => ({ 
          ...prev, 
          hasTimedOut: true, 
          isLoading: false, 
          showOverlay: false 
        }));
      }, timeout);
    };

    const stopLoading = () => {
      clearTimeout(loadingTimer);
      clearTimeout(timeoutTimer);
      clearInterval(progressInterval);
      
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        showOverlay: false, 
        hasTimedOut: false,
        progress: 100
      }));
      
      // Reset progress after animation
      setTimeout(() => {
        setState(prev => ({ ...prev, progress: 0 }));
      }, 300);
    };

    const _resetTimeout = () => {
      setState(prev => ({ 
        ...prev, 
        hasTimedOut: false, 
        isLoading: false, 
        showOverlay: false,
        progress: 0
      }));
    };

    // Enhanced router push with loading states
    const originalPush = router.push;
    const originalReplace = router.replace;
    const originalBack = router.back;
    const originalForward = router.forward;

    router.push = (...args: Parameters<typeof router.push>) => {
      startLoading();
      const result = originalPush.apply(router, args);
      // Router methods return void, so we handle completion with timeout
      setTimeout(() => {
        stopLoading();
      }, 100);
      return result;
    };

    router.replace = (...args: Parameters<typeof router.replace>) => {
      startLoading();
      const result = originalReplace.apply(router, args);
      // Router methods return void, so we handle completion with timeout
      setTimeout(() => {
        stopLoading();
      }, 100);
      return result;
    };

    router.back = () => {
      startLoading();
      originalBack();
      // Back navigation doesn't return a promise, so we use a timeout
      setTimeout(stopLoading, 100);
    };

    router.forward = () => {
      startLoading();
      originalForward();
      // Forward navigation doesn't return a promise, so we use a timeout
      setTimeout(stopLoading, 100);
    };

    // Cleanup function
    return () => {
      clearTimeout(loadingTimer);
      clearTimeout(timeoutTimer);
      clearInterval(progressInterval);
      
      // Restore original router methods
      router.push = originalPush;
      router.replace = originalReplace;
      router.back = originalBack;
      router.forward = originalForward;
    };
  }, [router, threshold, timeout, enableProgressBar]);

  // Listen for route changes to stop loading
  useEffect(() => {
    setState(prev => ({ 
      ...prev, 
      isLoading: false, 
      showOverlay: false,
      progress: 0
    }));
  }, [pathname]);

  return {
    ...state,
    resetTimeout: () => {
      setState(prev => ({ 
        ...prev, 
        hasTimedOut: false, 
        isLoading: false, 
        showOverlay: false,
        progress: 0
      }));
    }
  };
}

// Hook for programmatic loading states
export function useLoadingState(initialState = false) {
  const [isLoading, setIsLoading] = useState(initialState);
  const [error, setError] = useState<string | null>(null);

  const startLoading = () => {
    setIsLoading(true);
    setError(null);
  };

  const stopLoading = () => {
    setIsLoading(false);
  };

  const setLoadingError = (errorMessage: string) => {
    setError(errorMessage);
    setIsLoading(false);
  };

  return {
    isLoading,
    error,
    startLoading,
    stopLoading,
    setLoadingError
  };
}

// Hook for measuring navigation performance
export function useNavigationPerformance() {
  const [metrics, setMetrics] = useState<{
    navigationStart: number | null;
    navigationEnd: number | null;
    duration: number | null;
  }>({
    navigationStart: null,
    navigationEnd: null,
    duration: null
  });

  const startMeasurement = () => {
    setMetrics({
      navigationStart: performance.now(),
      navigationEnd: null,
      duration: null
    });
  };

  const endMeasurement = () => {
    setMetrics(prev => {
      if (prev.navigationStart) {
        const end = performance.now();
        return {
          ...prev,
          navigationEnd: end,
          duration: end - prev.navigationStart
        };
      }
      return prev;
    });
  };

  return {
    ...metrics,
    startMeasurement,
    endMeasurement,
    isSlowNavigation: metrics.duration ? metrics.duration > 300 : false
  };
}
