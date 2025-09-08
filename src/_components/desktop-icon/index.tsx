'use client';
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { Folders } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useRef } from 'react';
import { useShallow } from 'zustand/shallow';

import type { appType } from '../modal/types';

import { useModalStore } from '../modal/hooks';

const DesktopIcon = ({ name }: { name: appType }) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const { app, hide, full, setPreMiniPath } = useModalStore(
        useShallow((state) => ({
            app: state.modalApp.list[name],
            full: state.full,
            hide: state.hide,
            setPreMiniPath: state.setPreMiniPath,
        })),
    );

    const pathname = usePathname();
    const prePathname = useRef('');

    useEffect(() => {
        // 路由变化时执行的逻辑
        console.log('当前路径:', pathname);
        // 兼容刷新页面时，路径开头为/doc时，显示模态框
        if (pathname.startsWith(`/${name}`)) {
            const params = new URLSearchParams(searchParams);
            setPreMiniPath(name, pathname + (params.toString() ? `?${params.toString()}` : ''));
            if (
                (!prePathname.current || !prePathname.current.startsWith(`/${name}`)) &&
                !(!app.hide && app.max) // 排除打开状态
            ) {
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        full(name);
                    });
                });
            }
        }
        prePathname.current = pathname;
    }, [pathname, searchParams]);
    return (
        <div
            id="computer-icon"
            className="w-16 text-center cursor-pointer hover:text-primary transition-colors duration-200 group"
            onClick={() => {
                if (app.hide) {
                    // state: 无 -> 全屏
                    router.push(`/${name}`);
                } else {
                    if (app.max) {
                        // state: 全屏 -> 最小化
                        hide(name);
                        router.push('/');
                    } else {
                        // state: 最小化 -> 全屏
                        router.push(app.preMiniPath);
                    }
                }
            }}
        >
            <div className="size-14 mx-auto bg-primary/10 rounded-lg flex items-center justify-center mb-1 group-hover:bg-primary/20 transition-colors">
                <Folders />
            </div>
            <div className="text-sm font-medium truncate">{app.title}</div>
        </div>
    );
};

export default DesktopIcon;
