'use client';

import { Folders } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useShallow } from 'zustand/shallow';

import { DockIcon } from '@/_components/magicui/dock';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/_components/shadcn/ui/tooltip';
import { useDocStore } from '@/app/@doc/doc/hooks';

import { buttonVariants } from '../shadcn/ui/button';
import { cn } from '../shadcn/utils';

const DocIcon = () => {
    const { docApp, hide } = useDocStore(
        useShallow((state) => ({
            docApp: state.docApp,
            hide: state.hide,
        })),
    );
    const router = useRouter();

    const handleModal = () => {
        // src/app/@doc/doc/layout.tsx 中对'/doc'路由已有full()处理[兼容刷新保持modal]，这里无需再调用full()
        if (docApp.hide) {
            // state: 无 -> 全屏
            router.push('/doc');
        } else {
            if (docApp.max) {
                // state: 全屏 -> 最小化
                hide();
                router.push('/');
            } else {
                // state: 最小化 -> 全屏
                router.push(docApp.preMiniPath);
            }
        }
    };

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
                            !docApp.hide
                                ? 'bg-[linear-gradient(120deg,_rgba(161,196,253,0.2)_0%,_rgba(194,233,251,0.2)_100%)] backdrop-blur-md shadow-lg '
                                : 'bg-transparent',
                            isAnimating ? 'animate-popintro' : '',
                        )}
                        onClick={(e) => {
                            e.preventDefault();
                            setIsAnimating(true); // 开始动画
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
