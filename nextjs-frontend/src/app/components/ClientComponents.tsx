'use client';

import dynamic from "next/dynamic";

// Client-side only components with dynamic imports
export const AutoRefresh = dynamic(() => import("./AutoRefresh"), {
  ssr: false,
  loading: () => null
});

export const FaviconManager = dynamic(() => import("./FaviconManager"), {
  ssr: false,
  loading: () => null
});

export const CacheBuster = dynamic(() => import("./CacheBuster"), {
  ssr: false,
  loading: () => null
});

export const ClientErrorBoundary = dynamic(() => import("./ClientErrorBoundary"), {
  ssr: false,
  loading: () => null
});

export const ErrorBoundary = dynamic(() => import("./ErrorBoundary"), {
  ssr: false,
  loading: () => null
});

export const PerformanceMonitor = dynamic(() => import("./PerformanceMonitor"), {
  ssr: false,
  loading: () => null
});

export const ConnectionStatus = dynamic(() => import("./ConnectionStatus"), {
  ssr: false,
  loading: () => null
});

export const PerformanceInit = dynamic(() => import("./PerformanceInit"), {
  ssr: false,
  loading: () => null
});
