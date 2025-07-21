'use client';

import { useState } from 'react';

export default function PopulateSampleDataPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<string[]>([]);

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const populatePricingPeriods = async () => {
    try {
      addResult('Creating pricing periods...');
      
      const periods = [
        {
          _type: 'pricingPeriods',
          periodId: 'earlyBird',
          title: 'Early Bird On/Before Feb 28th, 2025',
          startDate: '2024-12-01T00:00:00Z',
          endDate: '2025-02-28T23:59:59Z',
          isActive: true,
          displayOrder: 1,
          description: 'Early bird pricing with maximum savings',
        },
        {
          _type: 'pricingPeriods',
          periodId: 'nextRound',
          title: 'Next Round of Registration up to May 31st, 2025',
          startDate: '2025-03-01T00:00:00Z',
          endDate: '2025-05-31T23:59:59Z',
          isActive: true,
          displayOrder: 2,
          description: 'Standard pricing for regular registration',
        },
        {
          _type: 'pricingPeriods',
          periodId: 'spotRegistration',
          title: 'Spot Registrations on June 18th 2025',
          startDate: '2025-06-01T00:00:00Z',
          endDate: '2025-06-18T23:59:59Z',
          isActive: true,
          displayOrder: 3,
          description: 'Last chance registration with premium pricing',
        },
      ];

      for (const period of periods) {
        const response = await fetch('/api/sanity/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(period),
        });
        
        if (response.ok) {
          addResult(`✅ Created pricing period: ${period.title}`);
        } else {
          addResult(`❌ Failed to create pricing period: ${period.title}`);
        }
      }
    } catch (error) {
      addResult(`❌ Error creating pricing periods: ${error}`);
    }
  };

  const populateFormConfiguration = async () => {
    try {
      addResult('Creating form configuration...');
      
      const formConfig = {
        _type: 'formConfiguration',
        title: 'Registration Form Configuration',
        countries: [
          { code: 'US', name: 'United States', isActive: true },
          { code: 'IN', name: 'India', isActive: true },
          { code: 'GB', name: 'United Kingdom', isActive: true },
          { code: 'CA', name: 'Canada', isActive: true },
          { code: 'AU', name: 'Australia', isActive: true },
          { code: 'DE', name: 'Germany', isActive: true },
          { code: 'FR', name: 'France', isActive: true },
          { code: 'JP', name: 'Japan', isActive: true },
          { code: 'CN', name: 'China', isActive: true },
          { code: 'BR', name: 'Brazil', isActive: true },
          { code: 'MG', name: 'Madagascar', isActive: true },
          { code: 'TW', name: 'Taiwan', isActive: true },
        ],
        abstractCategories: [
          { value: 'poster', label: 'Poster', isActive: true, displayOrder: 1 },
          { value: 'oral', label: 'Oral', isActive: true, displayOrder: 2 },
          { value: 'delegate', label: 'Delegate', isActive: true, displayOrder: 3 },
          { value: 'other', label: 'Other', isActive: true, displayOrder: 4 },
        ],
        titleOptions: [
          { value: 'mr', label: 'Mr.', isActive: true },
          { value: 'mrs', label: 'Mrs.', isActive: true },
          { value: 'ms', label: 'Ms.', isActive: true },
          { value: 'dr', label: 'Dr.', isActive: true },
          { value: 'prof', label: 'Prof.', isActive: true },
          { value: 'assoc_prof', label: 'Assoc Prof', isActive: true },
          { value: 'assist_prof', label: 'Assist Prof', isActive: true },
        ],
        accommodationNightOptions: [
          { nights: 1, label: '1 Night', isActive: true },
          { nights: 2, label: '2 Nights', isActive: true },
          { nights: 3, label: '3 Nights', isActive: true },
          { nights: 4, label: '4 Nights', isActive: true },
          { nights: 5, label: '5 Nights', isActive: true },
        ],
        lastUpdated: new Date().toISOString(),
      };

      const response = await fetch('/api/sanity/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formConfig),
      });
      
      if (response.ok) {
        addResult('✅ Created form configuration');
      } else {
        addResult('❌ Failed to create form configuration');
      }
    } catch (error) {
      addResult(`❌ Error creating form configuration: ${error}`);
    }
  };

  const populateAllSampleData = async () => {
    setIsLoading(true);
    setResults([]);
    
    try {
      addResult('🚀 Starting sample data population...');
      
      await populatePricingPeriods();
      await populateFormConfiguration();
      
      addResult('✅ Sample data population completed!');
      addResult('📝 Note: You may need to create registration types and sponsorship tiers manually in Sanity Studio');
      addResult('🔗 Visit Sanity Studio to configure the remaining data');
      
    } catch (error) {
      addResult(`❌ Error during population: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Populate Sample Data
          </h1>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <strong>Warning:</strong> This will create sample data in your Sanity backend. 
                  Make sure you have the correct Sanity project configured.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <button
              onClick={populatePricingPeriods}
              disabled={isLoading}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              Create Pricing Periods
            </button>

            <button
              onClick={populateFormConfiguration}
              disabled={isLoading}
              className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              Create Form Configuration
            </button>

            <button
              onClick={populateAllSampleData}
              disabled={isLoading}
              className="w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 disabled:opacity-50 transition-colors"
            >
              {isLoading ? 'Populating...' : 'Populate All Sample Data'}
            </button>
          </div>

          {/* Results Display */}
          {results.length > 0 && (
            <div className="bg-gray-100 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Results:</h3>
              <div className="space-y-1 text-sm font-mono max-h-96 overflow-y-auto">
                {results.map((result, index) => (
                  <div key={index} className="text-gray-700">
                    {result}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">Next Steps:</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-blue-700">
              <li>Run the sample data population above</li>
              <li>Open your Sanity Studio and verify the data was created</li>
              <li>Create registration types with pricing linked to the pricing periods</li>
              <li>Create sponsorship tiers with appropriate pricing</li>
              <li>Test the dynamic registration form at <code>/test-dynamic-registration</code></li>
              <li>Configure accommodation options if needed</li>
            </ol>
          </div>

          {/* Quick Links */}
          <div className="mt-6 flex flex-wrap gap-4 justify-center">
            <a
              href="/test-dynamic-registration"
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              Test Dynamic Registration
            </a>
            <a
              href="/api/registration/dynamic-config"
              target="_blank"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              View API Data
            </a>
            <a
              href="/api/registration/pricing-periods"
              target="_blank"
              className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
            >
              View Pricing Periods
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
