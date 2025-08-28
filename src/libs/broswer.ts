'use client';

import { useEffect, useState } from 'react';
import { useMedia } from 'react-use';

/**
 * 屏幕尺寸检测值
 */
const screenSize = {
    xs: 480,
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200,
    '2xl': 1400,
};

/**
 * 监听滚动条位置
 */
export function useScroll(threshold = 0) {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > threshold);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [threshold]);

    return scrolled;
}

/**
 * 检测当前屏幕尺寸
 * @param key
 */
export function useScreenCheck(key: keyof typeof screenSize) {
    return useMedia(`(max-width: ${screenSize[key]}px)`, false);
}

/**
 * 根据屏幕尺寸检测当前设备是否为移动端
 */
export function useIsMobile() {
    return useScreenCheck('md');
}

/**
 * 根据屏幕尺寸检测当前设备是否为平板
 */
export function useIsTablet() {
    const isMobile = useIsMobile();
    const lg = useScreenCheck('lg');
    return !isMobile && lg;
}

/**
 * 根据屏幕尺寸检测当前设备是否为笔记本
 */
export function useIsNotebook() {
    const isTablet = useIsTablet();
    const xl = useScreenCheck('xl');
    return !isTablet && xl;
}

/**
 * 根据屏幕尺寸检测当前设备是否为台式机
 */
export function useIsPC() {
    return useMedia(`(min-width: ${screenSize.xl}px)`);
}

/**
 *  根据屏幕尺寸检测当前设备是否为桌面端
 */
export function useIsDesktop() {
    const isNotebook = useIsNotebook();
    const isPc = useIsPC();
    return isNotebook || isPc;
}
