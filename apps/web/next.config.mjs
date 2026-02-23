/** @type {import('next').NextConfig} */

const storageUrl = new URL(
  process.env.STORAGE_PUBLIC_URL || 'http://localhost:9000'
);

const nextConfig = {
  cacheComponents: true,
  transpilePackages: ['@workspace/ui', '@workspace/contracts'],
  images: {
    unoptimized: storageUrl.hostname === 'localhost',
    remotePatterns: [
      {
        protocol: storageUrl.protocol.replace(':', ''),
        hostname: storageUrl.hostname,
        port: storageUrl.port,
        pathname: '/**',
      },
    ],
    dangerouslyAllowLocalIP: true,
  },
  output: 'standalone',
};

export default nextConfig;
