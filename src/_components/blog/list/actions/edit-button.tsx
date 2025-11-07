'use client';

import type { FC } from 'react';

import DocumentEdit24Regular from '@ricons/fluent/DocumentEdit24Regular';
import { UserPen } from 'lucide-react';
import Link from 'next/link';

import type { PostItem } from '@/server/post/type';

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/_components/shadcn/ui/tooltip';
import { cn } from '@/_components/shadcn/utils';
import { useUrlQuery } from '@/libs/url';

import { AdminChecker } from '@/_components/auth';

import { Button as CNButton } from '../../../shadcn/ui/button';

const Button: FC<{ id: string; iconBtn?: boolean }> = ({ id, iconBtn }) => {
    const urlQuery = useUrlQuery();
    return (
        <CNButton
            asChild
            className={cn('text-xs', {
                'mr-3': !iconBtn,
                'btn-icon-transparent': iconBtn,
            })}
            variant="secondary"
            size={iconBtn ? 'icon' : 'sm'}
        >
            <Link replace href={`/blog/edit/${id}${urlQuery}`}>
                {iconBtn ? (
                    <span className="xicon text-2xl">
                        <DocumentEdit24Regular />
                    </span>
                ) : (
                    <UserPen />
                )}
                {!iconBtn && ' 编辑'}
            </Link>
        </CNButton>
    );
};

export const PostEditButton: FC<{ item: PostItem; iconBtn?: boolean }> = ({ item, iconBtn }) => (
    <AdminChecker>
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger>
                    <Button id={item.id} iconBtn={iconBtn} />
                </TooltipTrigger>
                <TooltipContent>
                    <p>编辑文章</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    </AdminChecker>
);
