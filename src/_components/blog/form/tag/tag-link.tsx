'use client';
import type { FC } from 'react';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

import type { TagItem } from '@/server/tag/type';

export const TagLink: FC<{ tag: TagItem; className?: string }> = ({ tag, className }) => {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();
    const getPageUrl = useCallback(
        (item: TagItem) => {
            const params = new URLSearchParams(searchParams);
            if (params.has('tag')) params.delete('tag');
            params.set('tag', item.text);
            return pathname + (params.toString() ? `?${params.toString()}` : '');
        },
        [searchParams],
    );
    return (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
        <div
            key={tag.id}
            className={className ?? ''}
            onClick={() => {
                router.push(getPageUrl(tag));
            }}
        >
            {tag.text}
        </div>
    );
};
