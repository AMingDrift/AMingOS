import type { FC } from 'react';

import { Skeleton } from '../shadcn/ui/skeleton';

/**
 * 通用骨架屏
 */
const PageSkeleton: FC = () => (
    <div className="page-container w-full">
        <div className="w-full justify-center space-y-7">
            <div className="flex flex-col space-y-3">
                <Skeleton className="h-52 w-full bg-gray-950/30" />
                <div className="flex h-16 w-full justify-between space-x-20">
                    <Skeleton className="w-1/3 flex-none bg-gray-950/30 backdrop-blur-sm" />
                    <Skeleton className="flex-auto  bg-gray-950/30 backdrop-blur-sm" />
                </div>
            </div>
            <div className="flex flex-col space-y-5">
                <Skeleton className="h-52 w-full backdrop-blur-md bg-gray-950/30" />
                <div className="flex h-16 w-full justify-between space-x-20">
                    <Skeleton className="w-1/3 flex-none bg-gray-950/30 backdrop-blur-sm" />
                    <Skeleton className="flex-auto bg-gray-950/30 backdrop-blur-sm" />
                </div>
            </div>
        </div>
    </div>
);

/**
 * 文章内容骨架屏
 */
const PostContentSkeleton: FC = () => (
    <div className="flex size-full flex-auto justify-between space-x-2">
        <Skeleton className="w-auto flex-auto bg-gray-950/30 backdrop-blur-sm" />
        <Skeleton className="hidden bg-gray-950/30 backdrop-blur-sm lg:flex lg:w-56" />
    </div>
);

export { PageSkeleton, PostContentSkeleton };