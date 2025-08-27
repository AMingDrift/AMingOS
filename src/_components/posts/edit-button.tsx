'use client';

import type { FC } from 'react';

import { isNil } from 'lodash';
import { UserPen } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useMemo } from 'react';

import { Button as CNButton } from '../shadcn/ui/button';

const Button: FC<{ id: string }> = ({ id }) => {
    const searchParams = useSearchParams();
    const getUrlQuery = useMemo(() => {
        const query = new URLSearchParams(searchParams.toString()).toString();
        return isNil(query) || query.length < 1 ? '' : `?${query}`;
    }, [searchParams]);
    return (
        <CNButton asChild className="mr-3">
            <Link href={`/blog/edit/${id}${getUrlQuery}`}>
                <UserPen />
                编辑
            </Link>
        </CNButton>
    );
};

export const PostEditButton: FC<{ id: string }> = ({ id }) => (
    <Suspense>
        <Button id={id} />
    </Suspense>
);
