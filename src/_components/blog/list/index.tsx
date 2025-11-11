import type { FC } from 'react';

import { notFound } from 'next/navigation';

import type { IPaginateQueryProps } from '../../paginate/types';

import { getBlogResult, getBreadcrumbsCategories } from '../utils';
import { PostList } from './items';
import Loadmore from './Loadmore';

export interface BlogIndexProps extends IPaginateQueryProps {
    tag?: string;
    categories?: string[];
}

export const BlogIndex: FC<BlogIndexProps> = async (props) => {
    const { limit = 6, tag, categories } = props ?? {};
    const categoryItems = await getBreadcrumbsCategories(categories);
    if (!categoryItems) return notFound();
    const category = categoryItems.length > 0 ? categoryItems[categoryItems.length - 1] : undefined;
    const result = await getBlogResult({ page: 1, limit, tag, category: category?.id });
    return (
        <>
            {/* <CategoryTreeWidget actives={categoryItems} /> */}
            <PostList items={result.items} activeTag={tag} />
            <Loadmore limit={limit} tag={tag} category={category?.id} />
        </>
    );
};
