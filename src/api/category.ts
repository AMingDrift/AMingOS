import type { CategoryApiType, categoryListRequestParams } from '@/server/category/type';

import { buildClient, fetchApi } from '@/libs/hono';
import { categoryPath } from '@/server/category/constants';

export const categoryClient = buildClient<CategoryApiType>(categoryPath);

export const categoryApi = {
    breadcrumb: async (latest: string) =>
        fetchApi(categoryClient, async (c) =>
            c.breadcrumb[':latest'].$get({
                param: { latest },
            }),
        ),
    list: async (params: categoryListRequestParams = {}) =>
        fetchApi(categoryClient, async (c) =>
            c[':parent?'].$get({
                param: params,
            }),
        ),
    tree: async (params: categoryListRequestParams = {}) =>
        fetchApi(categoryClient, async (c) =>
            c.tree[':parent?'].$get({
                param: params,
            }),
        ),
};
