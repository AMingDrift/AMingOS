import { isNil } from 'lodash';

import type { PostApiType } from '@/server/post/routes';
import type {
    PostCreateOrUpdateData,
    PostPaginateNumberRequestQuery,
    PostPaginateRequestQuery,
} from '@/server/post/type';

import { buildClient, fetchApi } from '@/libs/hono';
import { postPath } from '@/server/post/routes';

export const postClient = buildClient<PostApiType>(postPath);

export const postApi = {
    paginate: async (query: PostPaginateRequestQuery = {}) => {
        const page = isNil(query.page) || Number(query.page) < 1 ? 1 : Number(query.page);
        return fetchApi(postClient, async (c) =>
            c.index.$get({
                query: {
                    ...query,
                    page: page.toString(),
                    limit: (query.limit ?? 20).toString(),
                },
            }),
        );
    },

    detail: async (item: string) =>
        fetchApi(postClient, async (c) => c[':item'].$get({ param: { item } })),

    detailBySlug: async (slug: string) =>
        fetchApi(postClient, async (c) => c.byslug[':slug'].$get({ param: { slug } })),

    detailById: async (id: string) =>
        fetchApi(postClient, async (c) => c.byid[':id'].$get({ param: { id } })),

    pageNumbers: async (query: PostPaginateNumberRequestQuery = {}) =>
        fetchApi(postClient, async (c) =>
            c['page-numbers'].$get({
                query: { ...query, limit: (query.limit ?? 20).toString() },
            }),
        ),
    create: async (data: PostCreateOrUpdateData) =>
        fetchApi(postClient, async (c) => c.index.$post({ json: data })),
    update: async (id: string, data: PostCreateOrUpdateData) =>
        fetchApi(postClient, async (c) =>
            c[':id'].$patch({
                param: { id },
                json: data,
            }),
        ),
    delete: async (id: string) =>
        fetchApi(postClient, async (c) => c[':id'].$delete({ param: { id } })),
};
