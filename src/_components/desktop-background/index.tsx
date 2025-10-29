'use client';
// import VideoBackground from './VideoBackground';
import { useTheme } from 'next-themes';
import Nova from './Nova';
import Liquid from './Liquid';
const DesktopBackground = () => {
    const { resolvedTheme } = useTheme();
    if (!resolvedTheme) {
        // 如果 resolvedTheme 未定义，返回一个占位符，避免水合错误
        return <div className="h-full w-full" />;
    }

    if (resolvedTheme === 'dark') {
        return <Nova />;
    }
    return <Liquid />;
};

export default DesktopBackground;
