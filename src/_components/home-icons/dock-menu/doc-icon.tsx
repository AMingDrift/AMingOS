'use client';

import { throttle } from 'lodash';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useShallow } from 'zustand/shallow';

import { DockIcon } from '@/_components/magicui/dock';
import { useModalStore } from '@/_components/modal/hooks';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/_components/shadcn/ui/tooltip';

import type { appType } from '../../modal/types';

import { buttonVariants } from '../../shadcn/ui/button';
import { cn } from '../../shadcn/utils';

const DockMenuIcon = ({ name, icon }: { name: appType; icon: React.ReactNode }) => {
    const { app, hide, list, front } = useModalStore(
        useShallow((state) => ({
            list: state.modalApp.list,
            app: state.modalApp.list[name],
            hide: state.actions.hide,
            front: state.actions.front,
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

            // const otherApps = Object.entries(list).filter(([key]) => key !== name);
            // // 找到otherApps中hide=false,max=true,并且z最大的app
            // let popApp: AppItem | null = null;
            // let maxZ = 0;
            // otherApps.forEach(([, app]: [string, AppItem]) => {
            //     if (!app.hide && app.max && app.z > maxZ) {
            //         popApp = app;
            //         maxZ = app.z;
            //     }
            // });
            // if (popApp) {
            //     targetPath = (popApp as AppItem).activePath;
            // } else {
            //     targetPath = '/';
            // }

            targetPath = '/';
            const aboveApp = Object.entries(list).find(
                ([appName, appItem]) => appName !== name && appItem.z > app.z,
            );
            if (aboveApp) {
                isNeedFront = true;
                front(name);
            }
        } else {
            targetPath = app.activePath?.startsWith(`/${name}`) ? app.activePath : `/${name}`;
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

    return (
        <DockIcon key={app.title}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Link
                        href="#"
                        aria-label={app.title}
                        className={cn(
                            buttonVariants({ variant: 'ghost', size: 'icon' }),
                            'size-11 hover:backdrop-blur-md hover:bg-[linear-gradient(120deg,_rgba(161,196,253,0.2)_0%,_rgba(194,233,251,0.2)_100%)] origin-center ease-in-out transition-all duration-200',
                            !app.hide
                                ? 'bg-[linear-gradient(120deg,_rgba(161,196,253,0.2)_0%,_rgba(194,233,251,0.2)_100%)] shadow-lg '
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
