/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  experimental: {
    serverActions: {
      bodySizeLimit: '500mb', // for large Server Actions payloads
    },
  },
};

export default nextConfig;
