'use client';

import { debounce } from 'lodash';
import { Folders } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useShallow } from 'zustand/shallow';

import { DockIcon } from '@/_components/magicui/dock';
import { useDocStore } from '@/_components/modal/hooks';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/_components/shadcn/ui/tooltip';

import { buttonVariants } from '../shadcn/ui/button';
import { cn } from '../shadcn/utils';

const DocIcon = () => {
    const { modalApp, hide } = useDocStore(
        useShallow((state) => ({
            modalApp: state.modalApp,
            hide: state.hide,
        })),
    );
    const router = useRouter();
    const currentPath = usePathname();
    const handleModal = debounce(async () => {
        let targetPath;
        if (modalApp.hide) {
            targetPath = '/doc';
        } else if (modalApp.max) {
            targetPath = '/';
        } else {
            targetPath = modalApp.preMiniPath?.startsWith('/doc') ? modalApp.preMiniPath : '/doc';
        }
        // 路径相同则不重复跳转
        if (currentPath !== targetPath) {
            router.push(targetPath);
            if (targetPath === '/') {
                hide(); // TODO: 后面专门做了home-icon.tsx后（里面监听/路由逻辑），就删掉
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
        <DockIcon key="Document">
            <Tooltip>
                <TooltipTrigger asChild>
                    <Link
                        href="#"
                        aria-label="Document"
                        className={cn(
                            buttonVariants({ variant: 'ghost', size: 'icon' }),
                            'origin-center ease-in-out transition-all duration-200',
                            !modalApp.hide
                                ? 'bg-[linear-gradient(120deg,_rgba(161,196,253,0.2)_0%,_rgba(194,233,251,0.2)_100%)] backdrop-blur-md shadow-lg '
                                : 'bg-transparent',
                            isAnimating ? 'animate-popintro' : '',
                        )}
                        onClick={(e) => {
                            e.preventDefault();
                            setIsAnimating(true);
                            setTimeout(() => setIsAnimating(false), 400);
                            handleModal();
                        }}
                    >
                        <Folders className="size-4" />
                    </Link>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Document</p>
                </TooltipContent>
            </Tooltip>
        </DockIcon>
    );
};

export default DocIcon;
