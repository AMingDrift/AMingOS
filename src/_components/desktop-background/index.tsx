'use client';
// import VideoBackground from './VideoBackground';
import { useTheme } from 'next-themes';
import dynamic from 'next/dynamic';

const NovaBackground = dynamic(() => import('./Nova'), {
    ssr: false,
});
const LiquidBackground = dynamic(() => import('./Liquid'), {
    ssr: false,
});
const DesktopBackground = () => {
    const { resolvedTheme } = useTheme();

    if (resolvedTheme === 'dark') {
        return <NovaBackground />;
    }
    return <LiquidBackground />;
};

export default DesktopBackground;
