import type { DocApiType } from '@/server/doc/routes';

import { buildClient, fetchApi } from '@/libs/hono';
import { docPath } from '@/server/doc/routes';

export const docClient = buildClient<DocApiType>(docPath);

export const docApi = {
    list: async (prefix?: string) =>
        fetchApi(docClient, async (c) =>
            c.index.$get({
                query: { prefix: prefix || '' },
            }),
        ),
};
