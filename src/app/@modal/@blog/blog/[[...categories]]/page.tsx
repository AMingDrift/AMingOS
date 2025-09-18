import type { FC } from 'react';

import { Suspense } from 'react';

import type { IBlogMetadata } from '@/_components/blog/metadata';
import type { IPaginateQueryProps } from '@/_components/paginate/types';

import { BlogIndex } from '@/_components/blog/list';
import { getBlogMetadata } from '@/_components/blog/metadata';
import { BlogIndexSkeleton } from '@/_components/blog/skeleton';

export const generateMetadata = async (
    metadata: Omit<IBlogMetadata, 'parent'>,
    parent: IBlogMetadata['parent'],
) => getBlogMetadata({ ...metadata, parent });

const PageContent: FC<{
    searchParams: Promise<IPaginateQueryProps & { tag?: string }>;
    params: Promise<{ categories?: string[] }>;
}> = async ({ searchParams, params }) => {
    const { categories } = await params;
    const rest = { ...(await searchParams), categories };
    return <BlogIndex {...rest} />;
};

const BlogIndexPage: FC<{
    searchParams: Promise<IPaginateQueryProps & { tag?: string }>;
    params: Promise<{ categories?: string[] }>;
}> = async ({ searchParams, params }) => {
    return (
        <Suspense fallback={<BlogIndexSkeleton />}>
            <PageContent searchParams={searchParams} params={params} />
        </Suspense>
    );
};

export default BlogIndexPage;
