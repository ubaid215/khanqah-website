/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      // Add other external image domains here if needed
      // {
      //   protocol: 'https',
      //   hostname: 'your-other-domain.com',
      //   pathname: '/**',
      // },
    ],
  },

  experimental: {
    serverActions: {
      bodySizeLimit: '500mb', // for large Server Actions payloads
    },
  },
};

export default nextConfig;