'use client';

import { useState } from 'react';

export default function TestRegistrationPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    registrationType: '',
  });

  const [totalPrice, setTotalPrice] = useState(299);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Registration form submitted! (This is a test)');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">Conference Registration</h1>
            <p className="text-blue-100 mt-1">International Nursing Conference 2025</p>
          </div>

          {/* Current Pricing Period */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <strong>Early Bird Pricing</strong> is currently active.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* Personal Details Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Personal Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* First Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter first name"
                    required
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter last name"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter email address"
                    required
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter phone number"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Registration Type Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Registration Type</h2>
              <div className="space-y-3">
                {[
                  { id: 'speaker', name: 'Speaker Registration', price: 299 },
                  { id: 'delegate', name: 'Delegate Registration', price: 199 },
                  { id: 'student', name: 'Student Registration', price: 99 },
                ].map((type) => (
                  <div key={type.id} className="border border-gray-200 rounded-lg p-4">
                    <label className="flex items-start space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        value={type.id}
                        checked={formData.registrationType === type.id}
                        onChange={(e) => {
                          setFormData({...formData, registrationType: e.target.value});
                          setTotalPrice(type.price);
                        }}
                        className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-gray-900">{type.name}</h3>
                            <p className="text-sm text-gray-600 mt-1">Early Bird Pricing</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">${type.price}</p>
                          </div>
                        </div>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Sponsorship Tiers Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Sponsorship Opportunities</h2>
              <div className="space-y-3">
                {[
                  { id: 'platinum', name: 'Platinum Sponsor', price: 5000 },
                  { id: 'gold', name: 'Gold Sponsor', price: 3000 },
                  { id: 'silver', name: 'Silver Sponsor', price: 2000 },
                ].map((tier) => (
                  <div key={tier.id} className="border border-gray-200 rounded-lg p-4 bg-gradient-to-r from-yellow-50 to-yellow-100">
                    <label className="flex items-start space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        value={tier.id}
                        checked={formData.registrationType === tier.id}
                        onChange={(e) => {
                          setFormData({...formData, registrationType: e.target.value});
                          setTotalPrice(tier.price);
                        }}
                        className="mt-1 h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-gray-900">{tier.name}</h3>
                            <p className="text-sm text-gray-600 mt-1">Includes registration + accommodation</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-xl text-yellow-700">${tier.price}</p>
                            <p className="text-sm text-gray-500">Complete Package</p>
                          </div>
                        </div>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Summary */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Registration Fee:</span>
                  <span className="font-medium">${totalPrice}</span>
                </div>
                <div className="border-t border-gray-200 pt-2">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Amount:</span>
                    <span className="text-blue-600">${totalPrice}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Proceed to Payment (${totalPrice})
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
