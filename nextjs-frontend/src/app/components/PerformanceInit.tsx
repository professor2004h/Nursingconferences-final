'use client';

import { useEffect } from 'react';
import { initPerformanceMonitoring, preloadResource, prefetchResource } from '../lib/performanceUtils';

export default function PerformanceInit() {
  useEffect(() => {
    // Initialize performance monitoring
    initPerformanceMonitoring();

        
    // Prefetch likely next pages
    prefetchResource('/about');
    prefetchResource('/conferences');
    prefetchResource('/past-conferences');
    prefetchResource('/contact');
    
    // Optimize images loading
    const images = document.querySelectorAll('img[data-src]');
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
              imageObserver.unobserve(img);
            }
          }
        });
      });

      images.forEach(img => imageObserver.observe(img));
    }

    // Service Worker registration for caching (if available)
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker.register('/sw.js').catch(error => {
        console.log('SW registration failed:', error);
      });
    }

    // Cleanup function
    return () => {
      // Cleanup will be handled by the performance monitor
    };
  }, []);

  return null; // This component doesn't render anything
}
