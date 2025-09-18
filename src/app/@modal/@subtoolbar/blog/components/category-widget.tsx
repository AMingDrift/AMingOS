import type { FC } from 'react';

import type { CategoryItem } from '@/server/category/type';

import { categoryApi } from '@/api/category';

import { CategoryMenu } from './category-menu';

export const CategoryWidget: FC<{ actives?: false | CategoryItem[] }> = async ({ actives }) => {
    const result = await categoryApi.tree();
    if (!result.ok) throw new Error((await result.json()).message);
    const categories = await result.json();
    return <CategoryMenu categories={categories} />;
};
