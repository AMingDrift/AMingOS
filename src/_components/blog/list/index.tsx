import type { FC } from 'react';

import { unstable_cache } from 'next/cache';

import { postApi } from '@/api/post';

import type { IPaginateQueryProps } from '../../paginate/types';

import { PostList } from './items';
export interface BlogIndexProps extends IPaginateQueryProps {
    tag?: string;
    categories?: string[];
}
export const BlogIndex: FC<BlogIndexProps> = async (props) => {
    const { page, limit = 20, tag } = props ?? {};
    const getBlogResult = unstable_cache(
        async () => {
            const result = await postApi.paginate({ page, limit, tag });
            if (!result.ok) throw new Error((await result.json()).message);
            return await result.json();
        },
        ['blog-paginate-cache'],
        {
            revalidate: 60 * 60 * 24,
        },
    );
    const { items } = await getBlogResult();

    return <PostList items={items} activeTag={tag} />;
};
