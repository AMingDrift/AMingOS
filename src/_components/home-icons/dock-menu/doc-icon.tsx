'use client';

import { throttle } from 'lodash';
import Link from 'next/link';
import React, { useState } from 'react';
import { useShallow } from 'zustand/shallow';

import { DockIcon } from '@/_components/magicui/dock';
import { useModalStore } from '@/_components/modal/hooks';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/_components/shadcn/ui/tooltip';

import type { AppType } from '../../modal/types';

import { buttonVariants } from '../../shadcn/ui/button';
import { cn } from '../../shadcn/utils';

const DockMenuIcon = ({ name, icon }: { name: AppType; icon: React.ReactNode }) => {
    const { app, toggleWindow } = useModalStore(
        useShallow((state) => ({
            app: state.modalApp.list[name],
            toggleWindow: state.actions.toggleWindow,
        })),
    );
    const handleModal = throttle(async () => {
        toggleWindow(name);
    }, 200);
    const [isAnimating, setIsAnimating] = useState(false); // 添加动画状态

    return (
        <DockIcon key={app.title}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Link
                        href="#"
                        aria-label={app.title}
                        className={cn(
                            buttonVariants({ variant: 'ghost', size: 'icon' }),
                            'size-11 origin-center transition-all duration-200 ease-in-out hover:bg-[linear-gradient(120deg,_rgba(161,196,253,0.2)_0%,_rgba(194,233,251,0.2)_100%)] hover:backdrop-blur-md',
                            !app.hide
                                ? 'bg-[linear-gradient(120deg,_rgba(161,196,253,0.2)_0%,_rgba(194,233,251,0.2)_100%)] shadow-lg'
                                : 'bg-transparent',
                            isAnimating ? 'animate-popintro' : '',
                        )}
                        onClick={(e) => {
                            e.preventDefault();
                            handleModal();
                            setIsAnimating(true);
                            setTimeout(() => setIsAnimating(false), 300);
                        }}
                    >
                        {icon}
                    </Link>
                </TooltipTrigger>
                <TooltipContent className="z-(--z-index-dock-menu)">
                    <p>{app.title}</p>
                </TooltipContent>
            </Tooltip>
        </DockIcon>
    );
};

export default DockMenuIcon;
