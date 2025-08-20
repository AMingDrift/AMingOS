/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
'use client';

import { Folders, NotebookPen } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useRef } from 'react';
import { useShallow } from 'zustand/shallow';

import { useDocStore } from './@doc/doc/hooks';

const Desktop = () => {
    const router = useRouter();

    const { docApp, hide, full, setPreMiniPath } = useDocStore(
        useShallow((state) => ({
            docApp: state.docApp,
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
        if (pathname.startsWith('/doc')) {
            setPreMiniPath(pathname);
            if (!prePathname.current || !prePathname.current.startsWith('/doc')) {
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
        <div className="flex flex-col flex-wrap h-full justify-start gap-6 max-w-lg">
            <div
                id="computer-icon"
                className="w-16 text-center cursor-pointer hover:text-primary transition-colors duration-200 group"
                onClick={() => {
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
                }}
            >
                <div className="size-14 mx-auto bg-primary/10 rounded-lg flex items-center justify-center mb-1 group-hover:bg-primary/20 transition-colors">
                    <Folders />
                </div>
                <div className="text-sm font-medium truncate">Document</div>
            </div>
            <div
                id="blog-icon"
                className="w-16 text-center cursor-pointer hover:text-primary transition-colors duration-200 group"
                onClick={() => router.push('/doc')}
            >
                <div className="size-14 mx-auto bg-primary/10 rounded-lg flex items-center justify-center mb-1 group-hover:bg-primary/20 transition-colors">
                    <NotebookPen />
                </div>
                <div className="text-sm font-medium truncate">Blog</div>
            </div>
        </div>
    );
};

export default Desktop;
