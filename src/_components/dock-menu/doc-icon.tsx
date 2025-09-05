'use client';

import { throttle } from 'lodash';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useShallow } from 'zustand/shallow';

import { DockIcon } from '@/_components/magicui/dock';
import { useModalStore } from '@/_components/modal/hooks';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/_components/shadcn/ui/tooltip';

import type { appType } from '../modal/types';

import { buttonVariants } from '../shadcn/ui/button';
import { cn } from '../shadcn/utils';

const DockMenuIcon = ({ name, icon }: { name: appType; icon: React.ReactNode }) => {
    const { app, hide, list, front } = useModalStore(
        useShallow((state) => ({
            list: state.modalApp.list,
            app: state.modalApp.list[name],
            hide: state.hide,
            front: state.front,
        })),
    );
    const router = useRouter();
    const currentPath = usePathname();
    const handleModal = throttle(async () => {
        let targetPath;
        let isNeedFront = false;
        if (app.hide) {
            targetPath = `/${name}`;
        } else if (app.max) {
            // TODO: check home logic
            targetPath = '/';
            const aboveApp = Object.entries(list).find(
                ([appName, appItem]) => appName !== name && appItem.z > app.z,
            );
            if (aboveApp) {
                isNeedFront = true;
                front(name);
            }
        } else {
            targetPath = app.preMiniPath?.startsWith(`/${name}`) ? app.preMiniPath : `/${name}`;
        }
        // 路径相同则不重复跳转
        if (currentPath !== targetPath && !isNeedFront) {
            router.push(targetPath);
            if (targetPath === '/') {
                hide(name); // TODO: 后面专门做了home-icon.tsx后（里面监听/路由逻辑），就删掉
            }
        }
    }, 200);
    const [isAnimating, setIsAnimating] = useState(false); // 添加动画状态
    // // for debug
    // const handleKeyDown = (event: KeyboardEvent) => {
    //     // 监听特定按键，例如Escape键
    //     if (event.key === 'e') {
    //         console.log('Escape键被按下');
    //         // 在这里添加你的处理逻辑
    //         handleModal();
    //     }
    // };

    // useEffect(() => {
    //     // 添加事件监听器
    //     window.addEventListener('keydown', handleKeyDown);

    //     // 组件卸载时移除监听器
    //     return () => {
    //         window.removeEventListener('keydown', handleKeyDown);
    //     };
    // }, [handleKeyDown]);
    return (
        <DockIcon key={app.title}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Link
                        href="#"
                        aria-label={app.title}
                        className={cn(
                            buttonVariants({ variant: 'ghost', size: 'icon' }),
                            'origin-center ease-in-out transition-all duration-200',
                            !app.hide
                                ? 'bg-[linear-gradient(120deg,_rgba(161,196,253,0.2)_0%,_rgba(194,233,251,0.2)_100%)] backdrop-blur-md shadow-lg '
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
                <TooltipContent>
                    <p>{app.title}</p>
                </TooltipContent>
            </Tooltip>
        </DockIcon>
    );
};

export default DockMenuIcon;
