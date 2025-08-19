'use client';

import type { FC, PropsWithChildren, ReactNode } from 'react';

import { usePathname } from 'next/navigation';
import React, { useEffect, useRef } from 'react';
import { useShallow } from 'zustand/shallow';

import { useDocStore } from '@/app/@doc/doc/hooks';

import { ToolBar } from './toolbar/toolbar';
const Modal: FC<PropsWithChildren> = ({ children }: { children?: ReactNode }) => {
    const { docApp, full } = useDocStore(
        useShallow((state) => ({
            docApp: state.docApp,
            full: state.full,
        })),
    );

    const pathname = usePathname();
    const prePathname = useRef('');

    useEffect(() => {
        // 路由变化时执行的逻辑
        console.log('当前路径:', pathname);

        // 示例：根据路径判断是否显示"我的电脑"模态框
        if (pathname.startsWith('/doc')) {
            if (!prePathname.current.startsWith('/doc') || !prePathname.current) {
                // 双requestAnimationFrame确保浏览器完成两次重绘周期，解决直接执行时DOM未就绪导致动画不触发的问题
                // 第一层RAF等待当前帧渲染完成，第二层RAF确保DOM样式已应用
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        full();
                    });
                });
            }
        }
        prePathname.current = pathname;
    }, [pathname]);

    return (
        <div
            className="msfiles floatTab dpShad"
            id={`ExplorerApp`}
            data-size={docApp.size}
            data-max={docApp.max}
            data-hide={docApp.hide}
            style={{
                ...(docApp.size === 'cstm' ? docApp.dim : null),
                zIndex: docApp.z,
            }}
        >
            <ToolBar name="Document" />
            {children}
        </div>
    );
};

export default Modal;
