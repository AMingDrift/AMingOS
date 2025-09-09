'use client';

import { MoonIcon, SunIcon } from '@radix-ui/react-icons';
import { useTheme } from 'next-themes';
import { useRef } from 'react';
import { flushSync } from 'react-dom';

import { cn } from '@/_components/shadcn/utils';

import { Button } from '../shadcn/ui/button';

interface props {
    className?: string;
}

export const AnimatedThemeToggler = ({ className }: props) => {
    const buttonRef = useRef<HTMLButtonElement | null>(null);

    const { theme, setTheme } = useTheme();
    const changeTheme = async () => {
        if (!buttonRef.current) return;

        await document.startViewTransition(() => {
            // eslint-disable-next-line react-dom/no-flush-sync
            flushSync(() => {
                // 检查当前是否为暗色模式
                const isDark = theme === 'dark';

                // 切换主题：如果当前是暗色模式则移除属性，否则设置为 'dark'
                setTheme(isDark ? 'light' : 'dark');
            });
        }).ready;

        const { top, left, width, height } = buttonRef.current.getBoundingClientRect();
        const y = top + height / 2;
        const x = left + width / 2;

        const right = window.innerWidth - left;
        const bottom = window.innerHeight - top;
        const maxRad = Math.hypot(Math.max(left, right), Math.max(top, bottom));

        document.documentElement.animate(
            {
                clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${maxRad}px at ${x}px ${y}px)`],
            },
            {
                duration: 700,
                easing: 'ease-in-out',
                pseudoElement: '::view-transition-new(root)',
            },
        );
    };
    return (
        <Button
            ref={buttonRef}
            variant="ghost"
            type="button"
            size="icon"
            aria-label="Toggle theme"
            onClick={changeTheme}
            className={cn(className)}
        >
            <SunIcon className="size-[1.2rem] text-neutral-800 dark:hidden dark:text-neutral-200" />
            <MoonIcon className="hidden size-[1.2rem] text-neutral-800 dark:block dark:text-neutral-200" />
        </Button>
    );
};
