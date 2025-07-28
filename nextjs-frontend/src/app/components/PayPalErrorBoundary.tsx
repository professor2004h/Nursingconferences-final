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
    // Log the error for debugging
    console.error('PayPal Error Boundary caught an error:', error);
    console.error('Error Info:', errorInfo);
    
    this.setState({
      error,
      errorInfo
    });
  }

  handleRetry = () => {
    // Reset the error boundary state
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
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-start">
            <div className="text-red-400 text-2xl mr-3">⚠️</div>
            <div className="flex-1">
              <h3 className="text-lg font-medium text-red-800 mb-2">
                Payment System Error
              </h3>
              <p className="text-sm text-red-700 mb-4">
                There was an unexpected error with the payment system. This might be due to a temporary issue.
              </p>
              
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mb-4">
                  <summary className="text-sm font-medium text-red-800 cursor-pointer">
                    Error Details (Development)
                  </summary>
                  <div className="mt-2 p-3 bg-red-100 rounded border text-xs font-mono text-red-900">
                    <div className="mb-2">
                      <strong>Error:</strong> {this.state.error.message}
                    </div>
                    <div className="mb-2">
                      <strong>Stack:</strong>
                      <pre className="whitespace-pre-wrap mt-1">
                        {this.state.error.stack}
                      </pre>
                    </div>
                    {this.state.errorInfo && (
                      <div>
                        <strong>Component Stack:</strong>
                        <pre className="whitespace-pre-wrap mt-1">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </div>
                    )}
                  </div>
                </details>
              )}
              
              <div className="space-x-3">
                <button
                  onClick={this.handleRetry}
                  className="bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700 transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-gray-600 text-white px-4 py-2 rounded text-sm hover:bg-gray-700 transition-colors"
                >
                  Refresh Page
                </button>
              </div>
              
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                <p className="text-sm text-blue-800">
                  <strong>Alternative:</strong> If this error persists, you can also complete your payment by contacting us directly or using alternative payment methods.
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default PayPalErrorBoundary;
