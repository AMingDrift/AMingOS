'use client';

import type { FC, PropsWithChildren, ReactNode } from 'react';

import { usePathname } from 'next/navigation';
import React, { useEffect, useRef } from 'react';

import { useDocStore } from '@/app/@doc/doc/hooks';

import { ToolBar } from './toolbar/toolbar';
const Modal: FC<PropsWithChildren> = ({ children }: { children?: ReactNode }) => {
    const docApp = useDocStore((state) => state.docApp);
    const full = useDocStore((state) => state.full);
    const pathname = usePathname();
    const prePathname = useRef('');

    useEffect(() => {
        // 路由变化时执行的逻辑
        console.log('当前路径:', pathname);

        // 示例：根据路径判断是否显示"我的电脑"模态框
        if (pathname.startsWith('/doc')) {
            if (!prePathname.current.startsWith('/doc') || !prePathname.current) {
                setTimeout(() => {
                    full();
                }, 10);
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
