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
            {
                protocol: 'https',
                hostname: 'blob.amingdrift.com',
            },
            {
                protocol: 'https',
                hostname: 'cdn.amingdrift.com',
            },
        ],
    },
    pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
    experimental: {
        reactCompiler: true,
        useCache: true,
        serverActions: {
            bodySizeLimit: '5mb',
        },
    },
    allowedDevOrigins: ['http://192.168.2.8:3001'],
};

export default nextConfig;
