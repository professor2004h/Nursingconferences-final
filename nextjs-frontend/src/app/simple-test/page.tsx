'use client';

import React from 'react';

export default function SimpleTestPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Simple Test Page</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p>This is a simple test page to verify the server is working.</p>
          <p>If you can see this, the Next.js server is running correctly.</p>
        </div>
      </div>
    </div>
  );
}
