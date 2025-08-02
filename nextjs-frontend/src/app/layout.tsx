import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import HeaderWrapper from "./components/HeaderWrapper";
import { getSiteSettingsSSR, getSiteSettingsFresh, getImageUrl, getFullBrandName, getBrandParts } from './getSiteSettings';
import Footer from "./components/Footer";

// Import client-side components
import {
  AutoRefresh,
  FaviconManager,
  CacheBuster,
  ClientErrorBoundary,
  // ErrorBoundary, // Temporarily disabled due to dynamic import issues
  PerformanceMonitor,
  ConnectionStatus,
  PerformanceInit
} from "./components/ClientComponents";
import { NavigationLoadingProvider } from "./components/NavigationLoadingProvider";
import { testSanityConnectionWithRetry } from './sanity/client';

// Optimized font loading with display swap for better performance
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial']
});

export async function generateMetadata(): Promise<Metadata> {
  const siteSettings = process.env.NODE_ENV === 'development'
    ? await getSiteSettingsFresh()
    : await getSiteSettingsSSR();

  const siteName = getFullBrandName(siteSettings);
  const brandParts = getBrandParts(siteSettings);
  const siteDescription = siteSettings?.siteDescription ||
    `Join leading experts, researchers, and professionals at ${siteName}. Discover cutting-edge research, network with peers, and advance your career through our international conferences and events.`;

  const metaTitle = siteSettings?.seo?.metaTitle ||
    `${siteName} - Leading Academic & Medical Conferences`;

  const metaDescription = siteSettings?.seo?.metaDescription || siteDescription;

  const keywords = siteSettings?.seo?.keywords?.join(', ') ||
    "conferences, medical conferences, academic conferences, research, networking, professional development";

  // Favicon will be handled by FaviconManager component for better cache control

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: keywords,
    authors: [{ name: siteName }],
    creator: siteName,
    publisher: siteName,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    // Remove icons from metadata - handled by FaviconManager component
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      siteName: siteName,
      type: 'website',
      locale: 'en_US',
      url: 'https://intelliglobalconferences.com',
      images: siteSettings?.logo ? [
        {
          url: getImageUrl(siteSettings.logo) || '',
          width: 1200,
          height: 630,
          alt: siteSettings.logo.alt || siteName,
        }
      ] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      creator: '@intelliglobal',
      images: siteSettings?.logo ? [getImageUrl(siteSettings.logo) || ''] : [],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: 'your-google-verification-code', // Add your actual verification code
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Test Sanity connection in development
  let isConnected = true;
  let siteSettings = null;

  try {
    // Run connection test and site settings fetch in parallel
    const [connectionResult, settingsResult] = await Promise.allSettled([
      process.env.NODE_ENV === 'development' ? testSanityConnectionWithRetry(3) : Promise.resolve(true),
      process.env.NODE_ENV === 'development' ? getSiteSettingsFresh() : getSiteSettingsSSR()
    ]);

    // Handle connection result
    if (process.env.NODE_ENV === 'development') {
      isConnected = connectionResult.status === 'fulfilled' ? connectionResult.value : false;
      if (!isConnected) {
        console.error('⚠️ Sanity connection failed after retries. Please check your configuration.');
        console.error('🔧 Make sure Sanity Studio is running on port 3334');
      } else {
        console.warn('✅ Sanity connection successful');
      }
    }

    // Handle site settings result
    siteSettings = settingsResult.status === 'fulfilled' ? settingsResult.value : null;
    if (settingsResult.status === 'rejected' && process.env.NODE_ENV === 'development') {
      console.error('⚠️ Failed to fetch site settings:', settingsResult.reason);
    }
  } catch (error) {
    console.error('Error in layout initialization:', error);
    // Continue with null siteSettings to allow fallback rendering
  }

  const faviconUrl = siteSettings?.favicon ? getImageUrl(siteSettings.favicon) : null;

  return (
    <html lang="en" className="h-full">
      <body className={`${inter.variable} font-sans antialiased h-full bg-white`}>
        <div className="flex flex-col min-h-screen">
          {/* <ErrorBoundary> Temporarily disabled due to dynamic import issues */}
            <ClientErrorBoundary>
              <NavigationLoadingProvider
                threshold={300}
                timeout={10000}
                enableProgressBar={true}
                enableOverlay={true}
              >
                <PerformanceInit />
                {process.env.NODE_ENV === 'development' && (
                  <>
                    <PerformanceMonitor enabled={true} />
                    <AutoRefresh interval={30000} enabled={false} />
                    <ConnectionStatus />
                  </>
                )}
                <CacheBuster />
                <FaviconManager faviconUrl={faviconUrl} />

                {/* Header */}
                <HeaderWrapper />

                {/* Main Content */}
                <main className="flex-1 relative pt-20">
                  {children}
                </main>

                {/* Footer */}
                <Footer />
              </NavigationLoadingProvider>
            </ClientErrorBoundary>
          {/* </ErrorBoundary> Temporarily disabled due to dynamic import issues */}
        </div>
      </body>
    </html>
  );
}
