'use client';
import type { FC } from 'react';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';

import type { TagItem } from '@/server/tag/type';

import { Badge } from '@/_components/shadcn/ui/badge';
import { cn } from '@/_components/shadcn/utils';

export const TagLink: FC<{
    tag: TagItem;
    className?: string;
    variant?: 'default' | 'secondary' | 'destructive' | 'outline';
}> = ({ tag, variant, className }) => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const [isHovered, setIsHovered] = useState(false);

    const getPageUrl = useCallback(
        (item: TagItem) => {
            const params = new URLSearchParams(searchParams);
            if (params.has('tag')) {
                const curTag = params.get('tag');
                params.delete('tag');
                if (item.text === curTag) {
                    return pathname + (params.toString() ? `?${params.toString()}` : '');
                }
            }
            params.set('tag', item.text);
            return pathname + (params.toString() ? `?${params.toString()}` : '');
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
            className={cn('transition-all duration-75', className)}
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
