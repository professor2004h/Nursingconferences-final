'use client';

import React, { useState, useEffect, memo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
// import LoadingSpinner from './LoadingSpinner';

interface NavigationLoaderProps {
  threshold?: number; // milliseconds
  timeout?: number; // milliseconds
}

// Enhanced branded loading spinner
const BrandedSpinner = memo(({ size = 'lg' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12', 
    lg: 'h-16 w-16'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        {/* Outer ring */}
        <div className={`${sizeClasses[size]} border-4 border-orange-200 rounded-full animate-spin`}>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-orange-500 rounded-full animate-spin"></div>
        </div>
        
        {/* Inner pulse */}
        <div className={`absolute inset-2 bg-orange-100 rounded-full animate-pulse`}></div>
        
        {/* EventNext logo placeholder */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 bg-orange-500 rounded-full animate-bounce"></div>
        </div>
      </div>
      
      <div className="text-center">
        <p className="text-orange-600 font-semibold text-sm animate-pulse">
          Loading EventNext...
        </p>
        <div className="flex space-x-1 mt-2">
          <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
});

BrandedSpinner.displayName = 'BrandedSpinner';

// Navigation progress bar
const NavigationProgressBar = memo(() => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) return 90; // Stop at 90% until actual completion
        return prev + Math.random() * 15;
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="h-1 bg-orange-200">
        <div 
          className="h-full bg-gradient-to-r from-orange-500 to-orange-600 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
});

NavigationProgressBar.displayName = 'NavigationProgressBar';

// Full screen loading overlay
const LoadingOverlay = memo(({ show, onTimeout }: { show: boolean; onTimeout: () => void }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onTimeout, 10000); // 10 second timeout
      return () => clearTimeout(timer);
    }
  }, [show, onTimeout]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-40 flex items-center justify-center transition-opacity duration-300">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm mx-4 border border-orange-100">
        <BrandedSpinner size="lg" />
        <div className="mt-6 text-center">
          <h3 className="text-lg font-semibold text-slate-800 mb-2">
            Loading Conference Data
          </h3>
          <p className="text-sm text-slate-600">
            Please wait while we fetch the latest information...
          </p>
        </div>
      </div>
    </div>
  );
});

LoadingOverlay.displayName = 'LoadingOverlay';

// Main navigation loader component
export default function NavigationLoader({ 
  threshold = 300, 
  timeout = 10000 
}: NavigationLoaderProps) {
  const router = useRouter();
  const _pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [hasTimedOut, setHasTimedOut] = useState(false);

  useEffect(() => {
    let loadingTimer: NodeJS.Timeout | undefined;
    let overlayTimer: NodeJS.Timeout | undefined;

    const handleRouteChangeStart = () => {
      setHasTimedOut(false);

      // Show progress bar immediately
      setIsLoading(true);

      // Show overlay after threshold
      overlayTimer = setTimeout(() => {
        setShowOverlay(true);
      }, threshold);

      // Set timeout for loading state
      loadingTimer = setTimeout(() => {
        setHasTimedOut(true);
        setShowOverlay(false);
        setIsLoading(false);
      }, timeout);
    };

    const handleRouteChangeComplete = () => {
      if (loadingTimer) clearTimeout(loadingTimer);
      if (overlayTimer) clearTimeout(overlayTimer);
      setIsLoading(false);
      setShowOverlay(false);
      setHasTimedOut(false);
    };

    // Listen for route changes
    const originalPush = router.push;
    router.push = (...args: Parameters<typeof router.push>) => {
      handleRouteChangeStart();
      const result = originalPush.apply(router, args);
      // Router methods return void, so we handle completion with timeout
      setTimeout(() => {
        handleRouteChangeComplete();
      }, 100);
      return result;
    };

    return () => {
      if (loadingTimer) clearTimeout(loadingTimer);
      if (overlayTimer) clearTimeout(overlayTimer);
      router.push = originalPush;
    };
  }, [router, threshold, timeout]);

  // Error state for timeout
  if (hasTimedOut) {
    return (
      <div className="fixed inset-0 bg-red-50/90 backdrop-blur-sm z-40 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-4 border border-red-200">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              Loading Timeout
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              The page is taking longer than expected to load. Please check your connection and try again.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {isLoading && <NavigationProgressBar />}
      <LoadingOverlay show={showOverlay} onTimeout={() => setHasTimedOut(true)} />
    </>
  );
}

// Export individual components for reuse
export { BrandedSpinner, NavigationProgressBar, LoadingOverlay };
