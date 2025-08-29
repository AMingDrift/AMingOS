'use client';

import type { FC } from 'react';

import DocumentEdit24Regular from '@ricons/fluent/DocumentEdit24Regular';
import { UserPen } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

import { useUrlQuery } from '@/libs/url';

import { Button as CNButton } from '../shadcn/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../shadcn/ui/tooltip';
import { cn } from '../shadcn/utils';

const Button: FC<{ id: string; iconBtn?: boolean }> = ({ id, iconBtn }) => {
    const urlQuery = useUrlQuery();
    return (
        <CNButton
            asChild
            className={cn({
                'mr-3': !iconBtn,
                'btn-icon-transparent ': iconBtn,
            })}
            variant={iconBtn ? 'outline' : 'default'}
            size={iconBtn ? 'icon' : 'default'}
        >
            <Link href={`/blog/edit/${id}${urlQuery}`}>
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

export const PostEditButton: FC<{ id: string; iconBtn?: boolean }> = ({ id, iconBtn }) => (
    <Suspense>
        {iconBtn ? (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <Button id={id} iconBtn />
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>编辑文章</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        ) : (
            <Button id={id} />
        )}
    </Suspense>
);
