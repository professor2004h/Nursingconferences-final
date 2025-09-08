/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',

  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
        pathname: '/**',
      },
    ],
    unoptimized: false,
  },
  env: {
    // Sanity Configuration
    NEXT_PUBLIC_SANITY_PROJECT_ID: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    NEXT_PUBLIC_SANITY_DATASET: process.env.NEXT_PUBLIC_SANITY_DATASET,
    NEXT_PUBLIC_SANITY_API_VERSION: process.env.NEXT_PUBLIC_SANITY_API_VERSION,

    // PayPal Configuration - Ensure all variables are available at build time
    NEXT_PUBLIC_PAYPAL_CLIENT_ID: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || process.env.PAYPAL_CLIENT_ID,
    NEXT_PUBLIC_PAYPAL_ENVIRONMENT: process.env.NEXT_PUBLIC_PAYPAL_ENVIRONMENT || process.env.PAYPAL_ENVIRONMENT || 'production',
    NEXT_PUBLIC_PAYPAL_CURRENCY: process.env.NEXT_PUBLIC_PAYPAL_CURRENCY || 'USD',

    // Base URL
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || 'https://nursingeducationconferences.org',

    // Build information for debugging
    BUILD_TIME: new Date().toISOString(),
  },
  // Optimize for production
  compress: true,
  poweredByHeader: false,
  // Handle trailing slashes
  trailingSlash: false,
  // Redirect configuration
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/studio',
        permanent: true,
      },
      {
        source: '/organizing-committee',
        destination: '/structure/organizingCommittee',
        permanent: true,
      },
    ];
  },
}

module.exports = nextConfig
