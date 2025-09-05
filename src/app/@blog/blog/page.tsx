import type { Metadata, ResolvingMetadata } from 'next';
import type { FC } from 'react';

import { Suspense } from 'react';

import type { IPaginateQueryProps } from '@/_components/paginate/types';

import { BlogIndex } from '@/_components/blog/list';
import { BlogIndexSkeleton } from '@/_components/blog/skeleton';

export const generateMetadata = async (
    _metadata: Record<string, any>,
    parent: ResolvingMetadata,
): Promise<Metadata> => ({
    title: `Blog | ${(await parent).title?.absolute}`,
});

const PageContent: FC<{ searchParams: Promise<IPaginateQueryProps> }> = async ({
    searchParams,
}) => {
    const rest = { ...(await searchParams) };
    return <BlogIndex {...rest} />;
};

const Page: FC<{ searchParams: Promise<IPaginateQueryProps> }> = async ({ searchParams }) => {
    return (
        <Suspense fallback={<BlogIndexSkeleton />}>
            <PageContent searchParams={searchParams} />
        </Suspense>
    );
};

export default Page;
