'use client';

import type { FC } from 'react';

import { useRef } from 'react';
import { useMount } from 'react-use';

import { Skeleton } from '../shadcn/ui/skeleton';

/**
 * 文章列表页骨架屏
 */
const BlogIndexSkeleton: FC = () => {
    const loadingRef = useRef<HTMLDivElement>(null);
    useMount(() => {
        const scrollAreaEle = loadingRef.current?.closest(
            '[data-slot="scroll-area-viewport"]',
        ) as HTMLElement | null;
        const contentEle = scrollAreaEle?.firstChild as HTMLElement | null;
        if (contentEle) {
            contentEle.style.height = '100%';
        }
    });
    return (
        <div
            ref={loadingRef}
            className="page-container flex w-full flex-auto flex-col space-x-4 lg:flex-row h-full"
        >
            <div className="order-2 flex flex-auto flex-col space-y-5 lg:order-1">
                <div className="w-full flex-none">
                    <Skeleton className="flex h-9 w-full items-center justify-between rounded-md bg-gray-950/30 px-3 shadow-sm backdrop-blur-sm" />
                </div>
                <div className="flex w-full flex-auto flex-col space-y-4">
                    <Skeleton className="w-full flex-auto bg-gray-950/30 backdrop-blur-sm" />
                    <Skeleton className="w-full flex-auto bg-gray-950/30 backdrop-blur-sm" />
                    <Skeleton className="w-full flex-auto bg-gray-950/30 backdrop-blur-sm" />
                </div>
            </div>
            <div className="order-1 mb-6 flex w-full flex-none flex-col lg:order-2 lg:mb-0 lg:w-72">
                <Skeleton className="h-24 w-full backdrop-blur-md lg:h-1/2" />
            </div>
        </div>
    );
};

/**
 * 文章详情页骨架屏
 */
const PostItemSkeleton: FC = () => (
    <div className="page-container flex w-full flex-auto flex-col">
        <div className="order-2 flex flex-auto flex-col space-y-5">
            <div className="w-full flex-none">
                <Skeleton className="flex h-9 w-full items-center justify-between rounded-md bg-gray-950/30 px-3 shadow-sm backdrop-blur-sm" />
            </div>
            <div className="flex w-full flex-auto flex-col space-y-4">
                <Skeleton className="w-full flex-auto bg-gray-950/30 backdrop-blur-sm" />
            </div>
        </div>
    </div>
);

/**
 * 文章内容骨架屏
 */
const PostContentSkeleton: FC = () => (
    <div className="relative flex size-full flex-auto justify-between gap-8 space-x-2">
        <Skeleton className="w-auto flex-auto bg-gray-950/30 backdrop-blur-sm" />
        <Skeleton className="hidden bg-gray-950/30 backdrop-blur-sm lg:flex lg:w-56" />
    </div>
);

export { BlogIndexSkeleton, PostContentSkeleton, PostItemSkeleton };
