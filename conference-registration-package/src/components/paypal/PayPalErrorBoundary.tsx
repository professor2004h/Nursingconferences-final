// =============================================================================
// PAYPAL ERROR BOUNDARY COMPONENT
// =============================================================================

'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class PayPalErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error to console and any error reporting service
    console.error('PayPal Error Boundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });

    // You can also log the error to an error reporting service here
    // Example: logErrorToService(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="bg-error-50 border border-error-200 rounded-lg p-6 text-center">
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-error-100 rounded-full">
            <svg
              className="w-6 h-6 text-error-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          
          <h3 className="text-lg font-medium text-error-900 mb-2">
            Payment System Error
          </h3>
          
          <p className="text-error-700 mb-4">
            There was an issue loading the payment system. This might be due to:
          </p>
          
          <ul className="text-sm text-error-600 mb-6 text-left max-w-md mx-auto">
            <li>• Network connectivity issues</li>
            <li>• PayPal service temporarily unavailable</li>
            <li>• Browser compatibility issues</li>
            <li>• Ad blockers or security software</li>
          </ul>
          
          <div className="space-y-3">
            <button
              onClick={this.handleRetry}
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Try Again
            </button>
            
            <p className="text-xs text-gray-500">
              If the problem persists, please contact support or try a different payment method.
            </p>
          </div>

          {/* Development error details */}
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details className="mt-6 text-left">
              <summary className="cursor-pointer text-sm font-medium text-gray-700 mb-2">
                Error Details (Development Only)
              </summary>
              <div className="bg-gray-100 p-3 rounded text-xs font-mono text-gray-800 overflow-auto">
                <div className="mb-2">
                  <strong>Error:</strong> {this.state.error.message}
                </div>
                <div className="mb-2">
                  <strong>Stack:</strong>
                  <pre className="whitespace-pre-wrap">{this.state.error.stack}</pre>
                </div>
                {this.state.errorInfo && (
                  <div>
                    <strong>Component Stack:</strong>
                    <pre className="whitespace-pre-wrap">{this.state.errorInfo.componentStack}</pre>
                  </div>
                )}
              </div>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default PayPalErrorBoundary;
