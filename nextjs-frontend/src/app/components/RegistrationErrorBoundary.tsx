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

class RegistrationErrorBoundary extends Component<Props, State> {
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
    console.error('Registration Error Boundary caught an error:', error);
    console.error('Error Info:', errorInfo);
    
    // Check for specific React hook errors
    if (error.message.includes('useCallback is not defined') || 
        error.message.includes('useState is not defined') ||
        error.message.includes('useEffect is not defined')) {
      console.error('🚨 React Hook Error Detected:', {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack
      });
    }
    
    this.setState({
      error,
      errorInfo
    });
  }

  handleRetry = () => {
    // Reset the error boundary state
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    
    // Force a page reload for React hook errors
    if (this.state.error?.message.includes('useCallback is not defined') ||
        this.state.error?.message.includes('useState is not defined') ||
        this.state.error?.message.includes('useEffect is not defined')) {
      console.log('🔄 Reloading page due to React hook error...');
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI for registration page
      return this.props.fallback || (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Registration System Error
            </h2>
            <p className="text-gray-600 mb-4">
              We encountered an issue loading the registration form. This is usually a temporary problem.
            </p>
            
            <div className="space-y-3">
              <button
                onClick={this.handleRetry}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
              >
                🔄 Try Again
              </button>
              
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded transition-colors"
              >
                🔃 Reload Page
              </button>
              
              <a
                href="/contact"
                className="block w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition-colors"
              >
                📞 Contact Support
              </a>
            </div>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-4 text-left">
                <summary className="text-sm text-gray-600 cursor-pointer">
                  🔍 Error Details (Development)
                </summary>
                <div className="mt-2 p-3 bg-gray-100 rounded text-xs">
                  <div className="font-semibold text-red-600 mb-2">Error:</div>
                  <pre className="whitespace-pre-wrap text-red-600 mb-3">
                    {this.state.error.message}
                  </pre>
                  
                  {this.state.error.stack && (
                    <>
                      <div className="font-semibold text-red-600 mb-2">Stack Trace:</div>
                      <pre className="whitespace-pre-wrap text-red-600 mb-3 text-xs">
                        {this.state.error.stack}
                      </pre>
                    </>
                  )}
                  
                  {this.state.errorInfo?.componentStack && (
                    <>
                      <div className="font-semibold text-red-600 mb-2">Component Stack:</div>
                      <pre className="whitespace-pre-wrap text-red-600 text-xs">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </>
                  )}
                </div>
              </details>
            )}
            
            <div className="mt-4 text-xs text-gray-500">
              Error ID: {Date.now().toString(36)}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default RegistrationErrorBoundary;
