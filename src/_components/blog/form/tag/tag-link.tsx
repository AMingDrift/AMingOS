'use client';
import type { FC } from 'react';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

import type { TagItem } from '@/server/tag/type';

export const TagLink: FC<{ tag: TagItem; className?: string }> = ({ tag, className }) => {
    const searchParams = useSearchParams();
    const pathname = usePathname();
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
        <Link key={tag.id} href={getPageUrl(tag)} className={className ?? ''}>
            {tag.text}
        </Link>
    );
};
