'use client';

import type { FC, ReactNode } from 'react';

import { usePathname } from 'next/navigation';
import React, { useCallback } from 'react';

import ModalWrapper from './components/modal-wrapper';
import UrlListener from './components/url-listener';

const Page: FC = ({
    doc,
    blog,
    about,
    subtoolbar,
}: {
    doc?: ReactNode;
    blog?: ReactNode;
    about?: ReactNode;
    subtoolbar?: ReactNode;
}) => {
    const pathname = usePathname();

    // 创建针对blog路由的特殊高亮逻辑，使用useCallback包裹以优化性能
    const calcBlogRouteHighlight = useCallback(
        (originUrl: string) => {
            // 对于blog路由，特殊处理：如果当前路径是/blog或者不为/blog/create开头，都视为高亮状态
            if (originUrl === '/blog') {
                return pathname === '/blog' || !pathname.startsWith('/blog/create');
            }
            return false;
        },
        [pathname],
    );

    return (
        <>
            <ModalWrapper routerName="about" subtoolbar={subtoolbar}>
                {about}
            </ModalWrapper>
            <ModalWrapper
                routerName="blog"
                subtoolbar={subtoolbar}
                calcRouteHighlight={calcBlogRouteHighlight}
            >
                {blog}
            </ModalWrapper>
            <ModalWrapper routerName="doc" subtoolbar={subtoolbar}>
                {doc}
            </ModalWrapper>
            <UrlListener />
        </>
    );
};

export default Page;
