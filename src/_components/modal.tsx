'use client';

import type { FC, PropsWithChildren, ReactNode } from 'react';

import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import { ToolBar } from './toolbar/toolbar';
const Modal: FC<PropsWithChildren> = ({ children }: { children?: ReactNode }) => {
    const [docApp, setDocApp] = useState({
        name: 'File Explorer',
        icon: 'explorer',
        type: 'app',
        action: 'EXPLORER',
        size: 'full',
        hide: true,
        max: true,
        z: 1,
    });

    const pathname = usePathname();

    useEffect(() => {
        // 路由变化时执行的逻辑
        console.log('当前路径:', pathname);

        // 示例：根据路径判断是否显示"我的电脑"模态框
        if (pathname === '/document') {
            setTimeout(() => {
                setDocApp({
                    ...docApp,
                    size: 'full',
                    hide: false,
                    max: true,
                });
            }, 0);
        } else {
            setDocApp({
                ...docApp,
                hide: true,
                max: true,
            });
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
            <ToolBar name="Document" docApp={docApp} setDocApp={setDocApp} />
            {children}
        </div>
    );
};

export default Modal;
