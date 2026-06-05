import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@mvp/contracts', '@mvp/config'],
};

export default nextConfig;
