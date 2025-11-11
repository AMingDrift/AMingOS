import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    reactStrictMode: true, // 开启react严格模式
    images: {
        dangerouslyAllowSVG: true,
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'jlwjxicihdtbbcmg.public.blob.vercel-storage.com',
            },
            {
                protocol: 'https',
                hostname: 'cdn.jsdelivr.net',
            },
            {
                protocol: 'https',
                hostname: 'cn-nb1.rains3.com',
            },
        ],
    },
    pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
    experimental: {
        useCache: true,
        serverActions: {
            bodySizeLimit: '5mb',
        },
    },
    allowedDevOrigins: ['http://192.168.2.9:3001'],
};

export default nextConfig;
