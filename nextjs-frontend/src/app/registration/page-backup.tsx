'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RegistrationPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Custom Header for Nursing Conference */}
      <header className="bg-white shadow-lg border-b-4 border-blue-600">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">International Nursing Conference 2025</h1>
            <p className="text-lg text-blue-600 font-medium">Advancing Healthcare Through Innovation and Excellence</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Conference Registration</h2>
          <p className="text-gray-600">Registration form is being loaded...</p>
        </div>
      </div>

      {/* Custom Footer for Nursing Conference */}
      <footer className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white py-12 mt-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <p className="text-sm text-blue-200">© 2025 International Nursing Conference. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
