/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Environment variables that should be available on the client side
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // Image optimization settings
  images: {
    domains: [
      'localhost',
      // Add your domain here
      'your-domain.com',
      // PayPal domains for logos/images
      'www.paypalobjects.com',
      'www.paypal.com',
    ],
    formats: ['image/webp', 'image/avif'],
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },

  // Redirects for common paths
  async redirects() {
    return [
      {
        source: '/register',
        destination: '/registration',
        permanent: true,
      },
    ];
  },

  // Webpack configuration for PayPal SDK
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },

  // Experimental features
  experimental: {
    // Enable if using app directory
    // appDir: true,
  },

  // Output configuration for static export (if needed)
  // trailingSlash: true,
  // output: 'export',
};

module.exports = nextConfig;
