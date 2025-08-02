'use client';

import { useState, useEffect } from 'react';

interface AboutUsData {
  _id: string;
  title: string;
  content: string;
  primaryBrandName?: string;
  secondaryBrandText?: string;
  brandTagline?: string;
  organizationName?: string;
  organizationBrandName?: string;
  isActive: boolean;
  _createdAt: string;
  _updatedAt: string;
}

export default function DebugBrandingPage() {
  const [aboutUsData, setAboutUsData] = useState<AboutUsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/about-us');
        const result = await response.json();

        if (result.success && result.data) {
          setAboutUsData(result.data);
        } else {
          setError(result.error || 'Failed to load data');
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-600">Error: {error}</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Debug Branding Data</h1>
      
      <div className="bg-gray-100 p-6 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">Raw Data from API:</h2>
        <pre className="bg-white p-4 rounded border overflow-auto text-sm">
          {JSON.stringify(aboutUsData, null, 2)}
        </pre>
      </div>

      <div className="bg-blue-100 p-6 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">Current Field Values:</h2>
        <div className="space-y-2">
          <p><strong>Primary Brand Name:</strong> {aboutUsData?.primaryBrandName || 'NOT SET'}</p>
          <p><strong>Secondary Brand Text:</strong> {aboutUsData?.secondaryBrandText || 'NOT SET'}</p>
          <p><strong>Brand Tagline:</strong> {aboutUsData?.brandTagline || 'NOT SET'}</p>
          <p><strong>Organization Name (Legacy):</strong> {aboutUsData?.organizationName || 'NOT SET'}</p>
          <p><strong>Organization Brand Name (Legacy):</strong> {aboutUsData?.organizationBrandName || 'NOT SET'}</p>
        </div>
      </div>

      <div className="bg-green-100 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Computed Display Value:</h2>
        <div className="text-2xl font-bold text-orange-600">
          {(() => {
            if (!aboutUsData) return 'No data';
            
            const primaryBrand = aboutUsData.primaryBrandName || 
              (aboutUsData.organizationBrandName ? 
                aboutUsData.organizationBrandName.split(' ').slice(0, -1).join(' ') || 'Nursing' : 
                'Nursing');
            const secondaryBrand = aboutUsData.secondaryBrandText || 
              (aboutUsData.organizationBrandName ? 
                aboutUsData.organizationBrandName.split(' ').slice(-1)[0] || 'Conference 2026' : 
                'Conference 2026');
            return `${primaryBrand} ${secondaryBrand}`;
          })()}
        </div>
      </div>
    </div>
  );
}
