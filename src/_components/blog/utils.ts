'use server';

import { isNil } from 'lodash';

import type { CategoryItem } from '@/server/category/type';

import { categoryApi } from '@/api/category';
import { postApi } from '@/api/post';

/**
 * 获取扁平化(面包屑)分类数据
 * @param categories
 */
export const getBreadcrumbsCategories = async (
    categories?: string[],
): Promise<CategoryItem[] | false> => {
    'use cache';
    if (!isNil(categories) && categories.length > 0) {
        const latest = categories[categories.length - 1];
        const result = await categoryApi.breadcrumb(latest);
        if (!result.ok) throw new Error((await result.json()).message);
        const items = await result.json();
        if (items.length !== categories.length) return false;
        if (
            !items.every(
                (item, index) => item.id === categories[index] || item.slug === categories[index],
            )
        ) {
            return false;
        }
        return items;
    }
    return [];
};

export const getBlogResult = async ({
    page,
    limit,
    tag,
    category,
}: {
    page: number;
    limit: number;
    tag?: string;
    category?: string;
}) => {
    'use cache';
    const result = await postApi.paginate({ page, limit, tag, category });
    if (!result.ok) throw new Error((await result.json()).message);
    return await result.json();
};
