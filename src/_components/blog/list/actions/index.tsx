'use client';

import type { FC } from 'react';

import type { PostItem } from '@/server/post/type';

import { cn } from '@/_components/shadcn/utils';

import { PostDelete } from './delete';
import { PostEditButton } from './edit-button';

export const Buttons: FC<{ item: PostItem; className?: string }> = ({ item, className }) => {
    return (
        <div className={cn('flex items-end space-x-1', className)}>
            <PostEditButton item={item} />
            <PostDelete item={item} />
        </div>
    );
};

export const PostActions: FC<{ item: PostItem; className?: string }> = ({ item, className }) => (
    <Buttons item={item} className={className} />
);
