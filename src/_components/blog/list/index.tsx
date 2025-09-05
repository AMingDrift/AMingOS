import type { FC } from 'react';

import { postApi } from '@/api/post';

import type { IPaginateQueryProps } from '../../paginate/types';

import { PostList } from './items';
export interface BlogIndexProps extends IPaginateQueryProps {
    tag?: string;
    categories?: string[];
}
export const BlogIndex: FC<BlogIndexProps> = async (props) => {
    const { page, limit = 20, tag } = props ?? {};
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const result = await postApi.paginate({ page, limit, tag });
    if (!result.ok) throw new Error((await result.json()).message);
    const { items } = await result.json();
    return <PostList items={items} activeTag={tag} />;
};
