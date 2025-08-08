'use client';

import { MoonIcon, SunIcon } from '@radix-ui/react-icons';
import { useTheme } from 'next-themes';
import React from 'react';

import { Button } from '@/_components/shadcn/ui/button';
import { cn } from '@/_components/shadcn/utils';

export const ModeToggle = React.forwardRef<
    HTMLButtonElement,
    React.ComponentPropsWithoutRef<typeof Button> & { className?: string }
>(({ className }, ref) => {
    const { theme, setTheme } = useTheme();

    return (
        <Button
            ref={ref}
            variant="ghost"
            type="button"
            size="icon"
            className={cn('px-2', className)}
            aria-label="Toggle theme"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
            <SunIcon className="size-[1.2rem] text-neutral-800 dark:hidden dark:text-neutral-200" />
            <MoonIcon className="hidden size-[1.2rem] text-neutral-800 dark:block dark:text-neutral-200" />
        </Button>
    );
});

ModeToggle.displayName = 'ModeToggle';
