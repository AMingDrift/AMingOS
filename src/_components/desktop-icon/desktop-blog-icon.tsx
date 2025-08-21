'use client';
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { NotebookPen } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useRef } from 'react';
import { useShallow } from 'zustand/shallow';

import { useBlogStore } from '../modal/hooks';

const DesktopBlogIcon = () => {
    const router = useRouter();

    const { modalApp, hide, full, setPreMiniPath } = useBlogStore(
        useShallow((state) => ({
            modalApp: state.modalApp,
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
        // 兼容刷新页面时，路径开头为/blog时，显示模态框
        if (pathname.startsWith('/blog')) {
            setPreMiniPath(pathname);
            if (!prePathname.current || !prePathname.current.startsWith('/blog')) {
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
            id="blog-icon"
            className="w-16 text-center cursor-pointer hover:text-primary transition-colors duration-200 group"
            onClick={() => {
                // src/app/@doc/doc/layout.tsx 中对'/doc'路由已有full()处理[兼容刷新保持modal]，这里无需再调用full()
                if (modalApp.hide) {
                    // state: 无 -> 全屏
                    router.push('/blog');
                } else {
                    if (modalApp.max) {
                        // state: 全屏 -> 最小化
                        hide();
                        router.push('/');
                    } else {
                        // state: 最小化 -> 全屏
                        router.push(modalApp.preMiniPath);
                    }
                }
            }}
        >
            <div className="size-14 mx-auto bg-primary/10 rounded-lg flex items-center justify-center mb-1 group-hover:bg-primary/20 transition-colors">
                <NotebookPen />
            </div>
            <div className="text-sm font-medium truncate">Blog</div>
        </div>
    );
};

export default DesktopBlogIcon;
