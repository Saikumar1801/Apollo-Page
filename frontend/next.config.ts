import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['randomuser.me'], // Add 'randomuser.me' to the allowed image domains
  },
};

export default nextConfig;
