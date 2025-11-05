'use client';

import type { FC } from 'react';

import { useRef } from 'react';

import { Skeleton } from '../shadcn/ui/skeleton';
import { BlurFade } from '../magicui/blur-fade';

/**
 * 文章列表页骨架屏
 */
const BlogIndexSkeleton: FC = () => {
    return (
        <div className="mx-10 mt-7 columns-1 gap-7 md:columns-2 2xl:columns-3">
            <BlurFade className="mb-10 break-inside-avoid">
                <Skeleton className="h-[50vh] w-full flex-auto bg-gray-950/30 backdrop-blur-sm" />
            </BlurFade>
            <BlurFade className="mb-10 break-inside-avoid">
                <Skeleton className="h-[50vh] w-full flex-auto bg-gray-950/30 backdrop-blur-sm" />
            </BlurFade>
            <BlurFade className="mb-10 break-inside-avoid">
                <Skeleton className="h-[30vh] w-full flex-auto bg-gray-950/30 backdrop-blur-sm" />
            </BlurFade>
            <BlurFade className="mb-10 break-inside-avoid">
                <Skeleton className="h-[30vh] w-full flex-auto bg-gray-950/30 backdrop-blur-sm" />
            </BlurFade>
            <BlurFade className="mb-10 break-inside-avoid">
                <Skeleton className="h-[30vh] w-full flex-auto bg-gray-950/30 backdrop-blur-sm" />
            </BlurFade>
            <BlurFade className="mb-10 break-inside-avoid">
                <Skeleton className="h-[50vh] w-full flex-auto bg-gray-950/30 backdrop-blur-sm" />
            </BlurFade>
            <BlurFade className="mb-10 break-inside-avoid">
                <Skeleton className="h-[50vh] w-full flex-auto bg-gray-950/30 backdrop-blur-sm" />
            </BlurFade>
        </div>
    );
};

/**
 * 文章详情页骨架屏
 */
const PostItemSkeleton: FC = () => {
    const loadingRef = useRef<HTMLDivElement>(null);
    return (
        <div ref={loadingRef} className="flex h-full w-full flex-auto page-container flex-col">
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
};

/**
 * 文章内容骨架屏
 */
const PostContentSkeleton: FC = () => {
    return (
        <div className="relative flex size-full flex-auto justify-between space-x-2">
            <Skeleton className="w-auto flex-auto bg-gray-950/30 backdrop-blur-sm" />
            <Skeleton className="hidden bg-gray-950/30 backdrop-blur-sm lg:flex lg:w-60" />
        </div>
    );
};

const StorageVideoSkeleton: FC = () => {
    return (
        <div className="mx-10 mt-7 columns-2 gap-10">
            <BlurFade className="mb-10 flex break-inside-avoid flex-col">
                <Skeleton className="aspect-video w-full flex-auto bg-gray-950/30 backdrop-blur-sm" />
            </BlurFade>
            <BlurFade className="mb-10 flex break-inside-avoid flex-col">
                <Skeleton className="aspect-video w-full flex-auto bg-gray-950/30 backdrop-blur-sm" />
            </BlurFade>
            <BlurFade className="mb-10 flex break-inside-avoid flex-col">
                <Skeleton className="aspect-video w-full flex-auto bg-gray-950/30 backdrop-blur-sm" />
            </BlurFade>
        </div>
    );
};

export { BlogIndexSkeleton, PostContentSkeleton, PostItemSkeleton, StorageVideoSkeleton };
