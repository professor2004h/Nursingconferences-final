'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface ReceiptSettings {
  _id: string;
  title: string;
  conferenceTitle: string;
  companyName: string;
  receiptTemplate: {
    useBlueHeader: boolean;
    headerColor: { hex: string };
    logoSize: { width: number; height: number };
  };
  emailSettings: {
    senderName: string;
    senderEmail: string;
    subjectLine: string;
    emailTemplate: string;
  };
  contactInformation: {
    supportEmail: string;
    phone: string;
    website: string;
  };
  pdfSettings: {
    enablePdfAttachment: boolean;
    storePdfInSanity: boolean;
    pdfFilenameFormat: string;
  };
  isActive: boolean;
  lastUpdated: string;
}

const ReceiptSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<ReceiptSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/receipt-settings');
      const data = await response.json();
      
      if (data.success) {
        setSettings(data.data);
      } else {
        setError('Failed to fetch receipt settings');
      }
    } catch (err) {
      setError('Error fetching receipt settings');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    if (!settings) return;

    try {
      setSaving(true);
      setError(null);
      setSuccessMessage(null);

      const response = await fetch('/api/receipt-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      const data = await response.json();

      if (data.success) {
        setSuccessMessage('Receipt settings saved successfully!');
        setSettings(data.data);
      } else {
        setError('Failed to save receipt settings');
      }
    } catch (err) {
      setError('Error saving receipt settings');
      console.error('Error:', err);
    } finally {
      setSaving(false);
    }
  };

  const updateSettings = (path: string, value: any) => {
    if (!settings) return;

    const keys = path.split('.');
    const newSettings = { ...settings };
    let current: any = newSettings;

    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
    }

    current[keys[keys.length - 1]] = value;
    setSettings(newSettings);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">No Receipt Settings Found</h1>
          <p className="text-gray-600 mb-6">Unable to load receipt settings.</p>
          <button
            onClick={fetchSettings}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Receipt & Email Settings</h1>
              <p className="mt-2 text-gray-600">Manage payment receipt templates and email configuration</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={saveSettings}
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                {saving ? 'Saving...' : 'Save Settings'}
              </button>
              <a
                href="http://localhost:3333/structure/receiptSettings"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Edit in Sanity Studio
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Status Messages */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <div className="text-red-800">
                <h3 className="text-sm font-medium">Error</h3>
                <p className="mt-1 text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex">
              <div className="text-green-800">
                <h3 className="text-sm font-medium">Success</h3>
                <p className="mt-1 text-sm">{successMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* Settings Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Template Status</h3>
            <p className="text-sm text-gray-600 mb-2">Current PDF template</p>
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${settings.receiptTemplate?.useBlueHeader ? 'bg-blue-500' : 'bg-gray-400'}`}></div>
              <span className="text-sm font-medium">
                {settings.receiptTemplate?.useBlueHeader ? 'Blue Header (Recommended)' : 'Default Template'}
              </span>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Configuration</h3>
            <p className="text-sm text-gray-600 mb-2">Sender settings</p>
            <p className="text-sm font-medium text-blue-600">{settings.emailSettings?.senderEmail}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">PDF Settings</h3>
            <p className="text-sm text-gray-600 mb-2">Attachment & storage</p>
            <div className="space-y-1">
              <div className="flex items-center text-sm">
                <span className={`w-2 h-2 rounded-full mr-2 ${settings.pdfSettings?.enablePdfAttachment ? 'bg-green-500' : 'bg-red-500'}`}></span>
                Email Attachment: {settings.pdfSettings?.enablePdfAttachment ? 'Enabled' : 'Disabled'}
              </div>
              <div className="flex items-center text-sm">
                <span className={`w-2 h-2 rounded-full mr-2 ${settings.pdfSettings?.storePdfInSanity ? 'bg-green-500' : 'bg-red-500'}`}></span>
                Sanity Storage: {settings.pdfSettings?.storePdfInSanity ? 'Enabled' : 'Disabled'}
              </div>
            </div>
          </div>
        </div>

        {/* Configuration Forms */}
        <div className="space-y-8">
          {/* Basic Settings */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Basic Configuration</h3>
              <p className="text-sm text-gray-600 mt-1">Conference and company information</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Conference Title</label>
                <input
                  type="text"
                  value={settings.conferenceTitle}
                  onChange={(e) => updateSettings('conferenceTitle', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="International Nursing Conference 2025"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                <input
                  type="text"
                  value={settings.companyName}
                  onChange={(e) => updateSettings('companyName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Intelli Global Conferences"
                />
              </div>
            </div>
          </div>

          {/* Template Settings */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">PDF Template Settings</h3>
              <p className="text-sm text-gray-600 mt-1">Configure PDF receipt appearance</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="useBlueHeader"
                  checked={settings.receiptTemplate?.useBlueHeader || false}
                  onChange={(e) => updateSettings('receiptTemplate.useBlueHeader', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="useBlueHeader" className="ml-2 block text-sm text-gray-900">
                  Use Blue Header Template (Recommended)
                </label>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-900 mb-2">⚠️ Important Notice</h4>
                <p className="text-sm text-blue-800">
                  The blue header template is the ONLY template that should be sent to clients via email. 
                  This ensures consistent branding and prevents the white template/multi-page receipt issues.
                </p>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">How to Manage Receipt Settings</h3>
            <div className="space-y-3 text-sm text-blue-800">
              <div className="flex items-start space-x-2">
                <span className="font-medium">1.</span>
                <span>Configure basic settings like conference title and company name above</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="font-medium">2.</span>
                <span>Ensure "Use Blue Header Template" is enabled for client emails</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="font-medium">3.</span>
                <span>Click "Edit in Sanity Studio" for advanced email template customization</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="font-medium">4.</span>
                <span>Save settings to apply changes to all new receipt emails</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptSettingsPage;
