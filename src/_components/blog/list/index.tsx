import type { FC } from 'react';

import type { IPaginateQueryProps } from '../../paginate/types';

import { getBlogResult } from './actions/blog-actions';
import { PostList } from './items';
import Loadmore from './Loadmore';

export interface BlogIndexProps extends IPaginateQueryProps {
    tag?: string;
    categories?: string[];
}

export const BlogIndex: FC<BlogIndexProps> = async (props) => {
    const { limit = 10, tag } = props ?? {};

    // 无线滚动 https://www.youtube.com/watch?v=FKZAXFjxlJI&t=2409s

    return (
        <>
            <PostList items={(await getBlogResult(1, limit, tag)).items} activeTag={tag} />
            <Loadmore limit={limit} tag={tag} />
        </>
    );
};
