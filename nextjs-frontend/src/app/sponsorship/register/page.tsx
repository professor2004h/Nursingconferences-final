'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SponsorshipRegisterRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Client-side redirect to the main registration page
    router.replace('/registration');
  }, [router]);

  // Show a loading message while redirecting
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Redirecting...</h2>
        <p className="text-gray-600">
          You are being redirected to the main registration page.
        </p>
        <p className="text-sm text-gray-500 mt-4">
          If you are not redirected automatically,
          <a href="/registration" className="text-blue-600 hover:text-blue-800 ml-1">
            click here
          </a>
        </p>
      </div>
    </div>
  );
}