/** @type {import('next').NextConfig} */
const path = require('path')
const nextConfig = {
  async redirects() {
    return [
      { source: '/reports', destination: '/pets', permanent: false },
      { source: '/dogs', destination: '/pets', permanent: false },
    ]
  },
  images: {
    domains: ['cdn.sanity.io'],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config) => {
    // Ensure alias '@' resolves to project root in all environments
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@': path.resolve(__dirname),
    }
    return config
  },
}

module.exports = nextConfig 
