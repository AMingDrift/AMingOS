import type { TagApiType } from '@/server/tag/routes';

import { buildClient, fetchApi } from '@/libs/hono';
import { tagPath } from '@/server/tag/routes';

export const tagClient = buildClient<TagApiType>(tagPath);
export const tagApi = {
    list: async () => fetchApi(tagClient, async (c) => c.index.$get()),
    detail: async (id: string) =>
        fetchApi(tagClient, async (c) => c[':item'].$get({ param: { item: id } })),
};
