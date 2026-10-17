import type { NextConfig } from 'next';
import { localApiRewrites } from './src/lib/server/local-api';

const apiRewrites = localApiRewrites(process.env.GDTUTOR_LOCAL_API_ORIGIN);

const nextConfig: NextConfig = {
  poweredByHeader: false,
  typedRoutes: true,
  async rewrites() {
    return { beforeFiles: apiRewrites, afterFiles: [], fallback: [] };
  },
};

export default nextConfig;
