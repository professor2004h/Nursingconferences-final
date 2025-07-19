'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BrandedSpinner, LoadingOverlay } from './NavigationLoader';
import { useNavigationLoading } from './NavigationLoadingProvider';

export default function LoadingDemo() {
  const router = useRouter();
  const { isLoading, showOverlay, progress, startLoading, stopLoading } = useNavigationLoading();
  const [demoLoading, setDemoLoading] = useState(false);
  const [demoOverlay, setDemoOverlay] = useState(false);

  const simulateSlowNavigation = async (route: string) => {
    startLoading();
    
    // Simulate slow network
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    router.push(route);
    stopLoading();
  };

  const testLoadingStates = () => {
    setDemoLoading(true);
    setTimeout(() => setDemoLoading(false), 3000);
  };

  const testOverlayState = () => {
    setDemoOverlay(true);
    setTimeout(() => setDemoOverlay(false), 5000);
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">
        🎨 Loading Animation Demo
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Loading Components Demo */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-slate-700">Loading Components</h3>
          
          {/* Branded Spinner Demo */}
          <div className="p-6 bg-slate-50 rounded-lg">
            <h4 className="font-medium text-slate-600 mb-4">Branded Spinner</h4>
            <div className="flex gap-4 items-center">
              <BrandedSpinner size="sm" />
              <BrandedSpinner size="md" />
              <BrandedSpinner size="lg" />
            </div>
          </div>
          
          {/* Progress Bar Demo */}
          <div className="p-6 bg-slate-50 rounded-lg">
            <h4 className="font-medium text-slate-600 mb-4">Progress Bar</h4>
            <div className="relative">
              <div className="h-2 bg-slate-200 rounded-full">
                <div 
                  className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
              <p className="text-sm text-slate-500 mt-2">Progress: {Math.round(progress)}%</p>
            </div>
          </div>
          
          {/* Skeleton Loading Demo */}
          <div className="p-6 bg-slate-50 rounded-lg">
            <h4 className="font-medium text-slate-600 mb-4">Skeleton Loading</h4>
            <div className="space-y-3">
              <div className="h-4 bg-slate-200 rounded animate-pulse"></div>
              <div className="h-4 bg-slate-200 rounded w-3/4 animate-pulse"></div>
              <div className="h-4 bg-slate-200 rounded w-1/2 animate-pulse"></div>
            </div>
          </div>
        </div>
        
        {/* Interactive Tests */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-slate-700">Interactive Tests</h3>
          
          {/* Navigation Tests */}
          <div className="p-6 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-slate-600 mb-4">Navigation Loading</h4>
            <div className="space-y-3">
              <button
                onClick={() => simulateSlowNavigation('/past-conferences')}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                disabled={isLoading}
              >
                {isLoading ? 'Loading...' : 'Test Slow Navigation'}
              </button>
              
              <button
                onClick={() => router.push('/conferences')}
                className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Fast Navigation
              </button>
              
              <p className="text-sm text-slate-600">
                Current loading state: {isLoading ? '🔄 Loading' : '✅ Ready'}
              </p>
            </div>
          </div>
          
          {/* Loading State Tests */}
          <div className="p-6 bg-orange-50 rounded-lg">
            <h4 className="font-medium text-slate-600 mb-4">Loading States</h4>
            <div className="space-y-3">
              <button
                onClick={testLoadingStates}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
                disabled={demoLoading}
              >
                {demoLoading ? 'Testing...' : 'Test Loading Animation'}
              </button>
              
              <button
                onClick={testOverlayState}
                className="w-full bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors"
                disabled={demoOverlay}
              >
                {demoOverlay ? 'Showing Overlay...' : 'Test Loading Overlay'}
              </button>
            </div>
          </div>
          
          {/* Performance Info */}
          <div className="p-6 bg-green-50 rounded-lg">
            <h4 className="font-medium text-slate-600 mb-4">Performance Info</h4>
            <div className="text-sm text-slate-600 space-y-2">
              <p>• Loading threshold: 300ms</p>
              <p>• Timeout threshold: 10 seconds</p>
              <p>• Progress bar: {isLoading ? 'Active' : 'Inactive'}</p>
              <p>• Overlay: {showOverlay ? 'Visible' : 'Hidden'}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Demo Loading States */}
      {demoLoading && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-40 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm mx-4 border border-orange-100">
            <BrandedSpinner size="lg" />
            <div className="mt-6 text-center">
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                Demo Loading State
              </h3>
              <p className="text-sm text-slate-600">
                This is how loading animations appear during navigation...
              </p>
            </div>
          </div>
        </div>
      )}
      
      <LoadingOverlay show={demoOverlay} onTimeout={() => setDemoOverlay(false)} />
      
      {/* Usage Instructions */}
      <div className="mt-8 p-6 bg-slate-100 rounded-lg">
        <h3 className="text-lg font-semibold text-slate-700 mb-4">🚀 How It Works</h3>
        <div className="text-sm text-slate-600 space-y-2">
          <p><strong>Automatic Detection:</strong> Loading animations appear when navigation takes longer than 300ms</p>
          <p><strong>Progressive Loading:</strong> Progress bar → Overlay → Timeout handling</p>
          <p><strong>Branded Experience:</strong> Custom EventNext loading spinners and animations</p>
          <p><strong>Performance Optimized:</strong> Animations only show when needed to prevent UI flashing</p>
          <p><strong>Error Handling:</strong> Timeout states with user-friendly error messages</p>
        </div>
      </div>
    </div>
  );
}
