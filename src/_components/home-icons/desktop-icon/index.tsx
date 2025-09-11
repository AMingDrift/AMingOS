'use client';
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useRef } from 'react';
import { useShallow } from 'zustand/shallow';

import type { AppItem, appType } from '../../modal/types';

import { useModalStore } from '../../modal/hooks';

const DesktopIcon = ({ name, icon }: { name: appType; icon: React.ReactNode }) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const { app, list, hide, full, setActivePath, toggleWindow } = useModalStore(
        useShallow((state) => ({
            list: state.modalApp.list,
            app: state.modalApp.list[name],
            full: state.actions.full,
            hide: state.actions.hide,
            setActivePath: state.actions.setActivePath,
            toggleWindow: state.actions.toggleWindow,
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
            setActivePath(name, pathname + (params.toString() ? `?${params.toString()}` : ''));
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
                // toggleWindow(name);
                if (app.hide) {
                    // state: 无 -> 全屏
                    router.push(`/${name}`);
                } else {
                    if (app.max) {
                        // state: 全屏 -> 最小化
                        hide(name);

                        const otherApps = Object.entries(list).filter(([key]) => key !== name);
                        // 找到otherApps中hide=false,max=true,并且z最大的app
                        let popApp: AppItem | null = null;
                        let maxZ = 0;
                        otherApps.forEach(([, app]: [string, AppItem]) => {
                            if (!app.hide && app.max && app.z > maxZ) {
                                popApp = app;
                                maxZ = app.z;
                            }
                        });
                        if (popApp) {
                            router.push((popApp as AppItem).activePath);
                        } else {
                            router.push('/');
                        }
                    } else {
                        // state: 最小化 -> 全屏
                        router.push(app.activePath);
                    }
                }
            }}
        >
            <div className="size-14 mx-auto bg-primary/10 rounded-lg flex items-center justify-center mb-1 group-hover:bg-primary/20 transition-colors">
                {icon}
            </div>
            <div className="text-sm font-medium truncate">{app.title}</div>
        </div>
    );
};

export default DesktopIcon;
