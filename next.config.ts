import type { NextConfig } from 'next';

import createMDX from '@next/mdx';
const withMDX = createMDX({
    extension: /\.mdx?$/,
    options: {
        remarkPlugins: [],
        rehypePlugins: [['rehype-prism-plus', { showLineNumbers: true }] as any],
    },
});
const externals: string[] = ['next-mdx-remote-client'];
if (process.env.TURBOPACK) {
    externals.push('rehype-prism-plus');
}

const nextConfig: NextConfig = {
    reactStrictMode: true, // 开启react严格模式
    serverExternalPackages: externals,
    // transpilePackages: ['@uiw/react-md-editor'],
    images: {
        dangerouslyAllowSVG: true,
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '*',
            },
            {
                protocol: 'http',
                hostname: '*',
            },
        ],
    },
    pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
};

export default withMDX(nextConfig);
