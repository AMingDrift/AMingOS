import type { FC } from 'react';

import { postApi } from '@/api/post';

import type { IPaginateQueryProps } from '../../paginate/types';

import { PostList } from './items';
export interface BlogIndexProps extends IPaginateQueryProps {
    tag?: string;
    categories?: string[];
}
export const BlogIndex: FC<BlogIndexProps> = async (props) => {
    const { page, limit = 10, tag } = props ?? {};
    const getBlogResult = async () => {
        'use cache';
        const result = await postApi.paginate({ page, limit, tag });
        if (!result.ok) throw new Error((await result.json()).message);
        return await result.json();
    };

    const { items } = await getBlogResult();
    // https://www.youtube.com/watch?v=FKZAXFjxlJI&t=2409s
    // TODO: 无线滚动
    return <PostList items={items} activeTag={tag} />;
};
