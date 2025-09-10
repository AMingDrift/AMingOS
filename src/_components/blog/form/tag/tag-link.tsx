'use client';
import type { FC } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';

import type { TagItem } from '@/server/tag/type';

import { Badge } from '@/_components/shadcn/ui/badge';

export const TagLink: FC<{
    tag: TagItem;
    variant?: 'default' | 'secondary' | 'destructive' | 'outline';
}> = ({ tag, variant }) => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [isHovered, setIsHovered] = useState(false);

    const getPageUrl = useCallback(
        (item: TagItem) => {
            const params = new URLSearchParams(searchParams);
            if (params.has('tag')) {
                const curTag = params.get('tag');
                params.delete('tag');
                if (item.text === curTag) {
                    return `/blog${params.toString() ? `?${params.toString()}` : ''}`;
                }
            }
            params.set('tag', item.text);
            return `/blog${params.toString() ? `?${params.toString()}` : ''}`;
        },
        [searchParams],
    );

    const handleMouseEnter = useCallback(() => {
        setIsHovered(true);
    }, []);

    const handleMouseLeave = useCallback(() => {
        setIsHovered(false);
    }, []);

    return (
        <Badge
            key={tag.id}
            className="transition-all duration-75"
            variant={variant === 'default' ? 'default' : isHovered ? 'secondary' : 'outline'}
            onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                router.push(getPageUrl(tag));
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {tag.text}
        </Badge>
    );
};
