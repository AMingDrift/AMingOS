'use client';

import type { FC, PropsWithChildren, ReactNode } from 'react';

import { usePathname } from 'next/navigation';
import React, { useEffect } from 'react';

import { useStore } from '@/app/@doc/document/hooks';

import { ToolBar } from './toolbar/toolbar';
const Modal: FC<PropsWithChildren> = ({ children }: { children?: ReactNode }) => {
    const docApp = useStore((state) => state.docApp);
    const full = useStore((state) => state.full);
    const hide = useStore((state) => state.hide);
    const pathname = usePathname();

    useEffect(() => {
        // 路由变化时执行的逻辑
        console.log('当前路径:', pathname);

        // 示例：根据路径判断是否显示"我的电脑"模态框
        if (pathname.startsWith('/document')) {
            setTimeout(() => {
                full();
            }, 10);
        } else {
            hide();
        }
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
